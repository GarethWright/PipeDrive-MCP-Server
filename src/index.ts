#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios, { AxiosInstance } from "axios";

// ---------------------------------------------------------------------------
// Pipedrive REST helper
// ---------------------------------------------------------------------------

const API_TOKEN = process.env.PIPEDRIVE_API_TOKEN ?? "";
const BASE_URL = process.env.PIPEDRIVE_BASE_URL ?? "https://api.pipedrive.com/v1";

function createClient(): AxiosInstance {
  if (!API_TOKEN) {
    throw new Error("PIPEDRIVE_API_TOKEN environment variable is required");
  }
  return axios.create({
    baseURL: BASE_URL,
    params: { api_token: API_TOKEN },
    headers: { "Content-Type": "application/json" },
  });
}

let _client: AxiosInstance | undefined;
function client(): AxiosInstance {
  if (!_client) _client = createClient();
  return _client;
}

async function pd(method: string, path: string, data?: any, params?: Record<string, any>) {
  try {
    const resp = await client().request({ method, url: path, data, params });
    return resp.data;
  } catch (err: any) {
    const msg = err.response?.data ?? err.message;
    return { success: false, error: typeof msg === "string" ? msg : JSON.stringify(msg) };
  }
}

function ok(result: any): { content: { type: "text"; text: string }[] } {
  return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
}

// ---------------------------------------------------------------------------
// MCP Server
// ---------------------------------------------------------------------------

const server = new McpServer({
  name: "pipedrive",
  version: "1.0.0",
});

// ======================== DEALS ========================

server.tool(
  "pipedrive_list_deals",
  "List deals with optional filtering",
  {
    user_id: z.number().optional().describe("Filter by owner user ID"),
    filter_id: z.number().optional().describe("Filter ID to use"),
    stage_id: z.number().optional().describe("Filter by stage ID"),
    status: z.enum(["open", "won", "lost", "deleted", "all_not_deleted"]).optional().describe("Deal status"),
    start: z.number().optional().describe("Pagination start (default 0)"),
    limit: z.number().optional().describe("Items per page (max 500)"),
    sort: z.string().optional().describe("Field to sort by, e.g. 'title ASC'"),
  },
  async ({ user_id, filter_id, stage_id, status, start, limit, sort }) => {
    return ok(await pd("GET", "/deals", undefined, { user_id, filter_id, stage_id, status, start, limit, sort }));
  }
);

server.tool(
  "pipedrive_get_deal",
  "Get a single deal by ID",
  { id: z.number().describe("Deal ID") },
  async ({ id }) => ok(await pd("GET", `/deals/${id}`))
);

server.tool(
  "pipedrive_create_deal",
  "Create a new deal",
  {
    title: z.string().describe("Deal title"),
    value: z.number().optional().describe("Deal monetary value"),
    currency: z.string().optional().describe("Currency code (e.g. USD)"),
    user_id: z.number().optional().describe("Owner user ID"),
    person_id: z.number().optional().describe("Associated person ID"),
    org_id: z.number().optional().describe("Associated organization ID"),
    pipeline_id: z.number().optional().describe("Pipeline ID"),
    stage_id: z.number().optional().describe("Stage ID"),
    status: z.enum(["open", "won", "lost"]).optional().describe("Deal status"),
    expected_close_date: z.string().optional().describe("Expected close date (YYYY-MM-DD)"),
    probability: z.number().optional().describe("Deal success probability (%)"),
    lost_reason: z.string().optional().describe("Reason deal was lost"),
    visible_to: z.number().optional().describe("Visibility (1=owner, 3=group, 5=company, 7=owner+followers)"),
    add_time: z.string().optional().describe("Creation time override (YYYY-MM-DD HH:MM:SS)"),
  },
  async (params) => ok(await pd("POST", "/deals", params))
);

server.tool(
  "pipedrive_update_deal",
  "Update an existing deal",
  {
    id: z.number().describe("Deal ID"),
    title: z.string().optional().describe("Deal title"),
    value: z.number().optional().describe("Deal monetary value"),
    currency: z.string().optional().describe("Currency code"),
    user_id: z.number().optional().describe("Owner user ID"),
    person_id: z.number().optional().describe("Associated person ID"),
    org_id: z.number().optional().describe("Associated organization ID"),
    pipeline_id: z.number().optional().describe("Pipeline ID"),
    stage_id: z.number().optional().describe("Stage ID"),
    status: z.enum(["open", "won", "lost"]).optional().describe("Deal status"),
    expected_close_date: z.string().optional().describe("Expected close date (YYYY-MM-DD)"),
    probability: z.number().optional().describe("Deal success probability (%)"),
    lost_reason: z.string().optional().describe("Reason deal was lost"),
    visible_to: z.number().optional().describe("Visibility setting"),
  },
  async ({ id, ...body }) => ok(await pd("PUT", `/deals/${id}`, body))
);

server.tool(
  "pipedrive_delete_deal",
  "Delete a deal",
  { id: z.number().describe("Deal ID") },
  async ({ id }) => ok(await pd("DELETE", `/deals/${id}`))
);

server.tool(
  "pipedrive_search_deals",
  "Search for deals by term",
  {
    term: z.string().describe("Search term (min 2 chars)"),
    fields: z.enum(["custom_fields", "notes", "title"]).optional().describe("Fields to search in"),
    exact_match: z.boolean().optional().describe("Exact match only"),
    person_id: z.number().optional().describe("Filter by person ID"),
    org_id: z.number().optional().describe("Filter by organization ID"),
    status: z.enum(["open", "won", "lost"]).optional(),
    start: z.number().optional(),
    limit: z.number().optional(),
  },
  async (params) => ok(await pd("GET", "/deals/search", undefined, params))
);

server.tool(
  "pipedrive_get_deal_activities",
  "Get activities associated with a deal",
  {
    id: z.number().describe("Deal ID"),
    start: z.number().optional(),
    limit: z.number().optional(),
    done: z.enum(["0", "1"]).optional().describe("Filter by done status"),
  },
  async ({ id, ...params }) => ok(await pd("GET", `/deals/${id}/activities`, undefined, params))
);

server.tool(
  "pipedrive_get_deals_summary",
  "Get summary of deals (total values, counts, etc.)",
  {
    status: z.enum(["open", "won", "lost"]).optional(),
    filter_id: z.number().optional(),
    user_id: z.number().optional(),
    stage_id: z.number().optional(),
  },
  async (params) => ok(await pd("GET", "/deals/summary", undefined, params))
);

server.tool(
  "pipedrive_get_deals_timeline",
  "Get deals timeline for a date range",
  {
    start_date: z.string().describe("Start date (YYYY-MM-DD)"),
    interval: z.enum(["day", "week", "month", "quarter"]).describe("Timeline interval"),
    amount: z.number().describe("Number of intervals"),
    field_key: z.string().describe("Date field key (e.g. add_time, close_time, expected_close_date)"),
    user_id: z.number().optional(),
    pipeline_id: z.number().optional(),
    filter_id: z.number().optional(),
    exclude_deals: z.number().optional().describe("Set to 1 to exclude deal objects"),
    totals_convert_currency: z.string().optional().describe("Currency code for totals conversion"),
  },
  async (params) => ok(await pd("GET", "/deals/timeline", undefined, params))
);

// ======================== PERSONS ========================

server.tool(
  "pipedrive_list_persons",
  "List persons/contacts with optional filtering",
  {
    user_id: z.number().optional().describe("Filter by owner user ID"),
    filter_id: z.number().optional().describe("Filter ID to use"),
    first_char: z.string().optional().describe("Filter by first letter of name"),
    start: z.number().optional(),
    limit: z.number().optional(),
    sort: z.string().optional().describe("Sort field e.g. 'name ASC'"),
  },
  async (params) => ok(await pd("GET", "/persons", undefined, params))
);

server.tool(
  "pipedrive_get_person",
  "Get a single person by ID",
  { id: z.number().describe("Person ID") },
  async ({ id }) => ok(await pd("GET", `/persons/${id}`))
);

server.tool(
  "pipedrive_create_person",
  "Create a new person/contact",
  {
    name: z.string().describe("Person name"),
    owner_id: z.number().optional().describe("Owner user ID"),
    org_id: z.number().optional().describe("Associated organization ID"),
    email: z.array(z.string()).optional().describe("Email addresses"),
    phone: z.array(z.string()).optional().describe("Phone numbers"),
    visible_to: z.number().optional().describe("Visibility setting"),
    marketing_status: z.enum(["no_consent", "unsubscribed", "subscribed", "archived"]).optional(),
    add_time: z.string().optional().describe("Creation time override"),
  },
  async (params) => {
    const body: any = { ...params };
    if (params.email) body.email = params.email.map((e) => ({ value: e, primary: false }));
    if (params.phone) body.phone = params.phone.map((p) => ({ value: p, primary: false }));
    if (body.email?.[0]) body.email[0].primary = true;
    if (body.phone?.[0]) body.phone[0].primary = true;
    return ok(await pd("POST", "/persons", body));
  }
);

server.tool(
  "pipedrive_update_person",
  "Update an existing person/contact",
  {
    id: z.number().describe("Person ID"),
    name: z.string().optional().describe("Person name"),
    owner_id: z.number().optional().describe("Owner user ID"),
    org_id: z.number().optional().describe("Associated organization ID"),
    email: z.array(z.string()).optional().describe("Email addresses (replaces existing)"),
    phone: z.array(z.string()).optional().describe("Phone numbers (replaces existing)"),
    visible_to: z.number().optional().describe("Visibility setting"),
    marketing_status: z.enum(["no_consent", "unsubscribed", "subscribed", "archived"]).optional(),
  },
  async ({ id, ...params }) => {
    const body: any = { ...params };
    if (params.email) body.email = params.email.map((e, i) => ({ value: e, primary: i === 0 }));
    if (params.phone) body.phone = params.phone.map((p, i) => ({ value: p, primary: i === 0 }));
    return ok(await pd("PUT", `/persons/${id}`, body));
  }
);

server.tool(
  "pipedrive_delete_person",
  "Delete a person/contact",
  { id: z.number().describe("Person ID") },
  async ({ id }) => ok(await pd("DELETE", `/persons/${id}`))
);

server.tool(
  "pipedrive_search_persons",
  "Search for persons by name, email, phone, or notes",
  {
    term: z.string().describe("Search term (min 2 chars)"),
    fields: z.enum(["custom_fields", "email", "notes", "phone", "name"]).optional(),
    exact_match: z.boolean().optional(),
    org_id: z.number().optional(),
    start: z.number().optional(),
    limit: z.number().optional(),
  },
  async (params) => ok(await pd("GET", "/persons/search", undefined, params))
);

server.tool(
  "pipedrive_get_person_deals",
  "Get deals associated with a person",
  {
    id: z.number().describe("Person ID"),
    start: z.number().optional(),
    limit: z.number().optional(),
    status: z.enum(["open", "won", "lost", "deleted", "all_not_deleted"]).optional(),
    sort: z.string().optional(),
  },
  async ({ id, ...params }) => ok(await pd("GET", `/persons/${id}/deals`, undefined, params))
);

// ======================== ORGANIZATIONS ========================

server.tool(
  "pipedrive_list_organizations",
  "List organizations with optional filtering",
  {
    user_id: z.number().optional().describe("Filter by owner user ID"),
    filter_id: z.number().optional().describe("Filter ID to use"),
    first_char: z.string().optional().describe("Filter by first letter"),
    start: z.number().optional(),
    limit: z.number().optional(),
    sort: z.string().optional(),
  },
  async (params) => ok(await pd("GET", "/organizations", undefined, params))
);

server.tool(
  "pipedrive_get_organization",
  "Get a single organization by ID",
  { id: z.number().describe("Organization ID") },
  async ({ id }) => ok(await pd("GET", `/organizations/${id}`))
);

server.tool(
  "pipedrive_create_organization",
  "Create a new organization",
  {
    name: z.string().describe("Organization name"),
    owner_id: z.number().optional().describe("Owner user ID"),
    visible_to: z.number().optional().describe("Visibility setting"),
    add_time: z.string().optional().describe("Creation time override"),
    address: z.string().optional().describe("Full address"),
  },
  async (params) => ok(await pd("POST", "/organizations", params))
);

server.tool(
  "pipedrive_update_organization",
  "Update an existing organization",
  {
    id: z.number().describe("Organization ID"),
    name: z.string().optional().describe("Organization name"),
    owner_id: z.number().optional().describe("Owner user ID"),
    visible_to: z.number().optional().describe("Visibility setting"),
    address: z.string().optional().describe("Full address"),
  },
  async ({ id, ...body }) => ok(await pd("PUT", `/organizations/${id}`, body))
);

server.tool(
  "pipedrive_delete_organization",
  "Delete an organization",
  { id: z.number().describe("Organization ID") },
  async ({ id }) => ok(await pd("DELETE", `/organizations/${id}`))
);

server.tool(
  "pipedrive_search_organizations",
  "Search for organizations by name or address",
  {
    term: z.string().describe("Search term (min 2 chars)"),
    fields: z.enum(["address", "custom_fields", "name", "notes"]).optional(),
    exact_match: z.boolean().optional(),
    start: z.number().optional(),
    limit: z.number().optional(),
  },
  async (params) => ok(await pd("GET", "/organizations/search", undefined, params))
);

server.tool(
  "pipedrive_get_organization_deals",
  "Get deals associated with an organization",
  {
    id: z.number().describe("Organization ID"),
    start: z.number().optional(),
    limit: z.number().optional(),
    status: z.enum(["open", "won", "lost", "deleted", "all_not_deleted"]).optional(),
    sort: z.string().optional(),
  },
  async ({ id, ...params }) => ok(await pd("GET", `/organizations/${id}/deals`, undefined, params))
);

server.tool(
  "pipedrive_get_organization_persons",
  "Get persons associated with an organization",
  {
    id: z.number().describe("Organization ID"),
    start: z.number().optional(),
    limit: z.number().optional(),
  },
  async ({ id, ...params }) => ok(await pd("GET", `/organizations/${id}/persons`, undefined, params))
);

// ======================== ACTIVITIES ========================

server.tool(
  "pipedrive_list_activities",
  "List activities with optional filtering",
  {
    user_id: z.number().optional().describe("Filter by user ID"),
    filter_id: z.number().optional().describe("Filter ID"),
    type: z.string().optional().describe("Activity type (call, meeting, task, deadline, email, lunch)"),
    start: z.number().optional(),
    limit: z.number().optional(),
    start_date: z.string().optional().describe("Start of date range (YYYY-MM-DD)"),
    end_date: z.string().optional().describe("End of date range (YYYY-MM-DD)"),
    done: z.enum(["0", "1"]).optional().describe("Filter by completion status"),
  },
  async (params) => ok(await pd("GET", "/activities", undefined, params))
);

server.tool(
  "pipedrive_get_activity",
  "Get a single activity by ID",
  { id: z.number().describe("Activity ID") },
  async ({ id }) => ok(await pd("GET", `/activities/${id}`))
);

server.tool(
  "pipedrive_create_activity",
  "Create a new activity (call, meeting, task, etc.)",
  {
    subject: z.string().describe("Activity subject/title"),
    type: z.string().describe("Activity type (call, meeting, task, deadline, email, lunch)"),
    done: z.enum(["0", "1"]).optional().describe("Whether done (0=not done, 1=done)"),
    due_date: z.string().optional().describe("Due date (YYYY-MM-DD)"),
    due_time: z.string().optional().describe("Due time (HH:MM)"),
    duration: z.string().optional().describe("Duration (HH:MM)"),
    user_id: z.number().optional().describe("Assigned user ID"),
    deal_id: z.number().optional().describe("Linked deal ID"),
    person_id: z.number().optional().describe("Linked person ID"),
    org_id: z.number().optional().describe("Linked organization ID"),
    note: z.string().optional().describe("Activity note (HTML)"),
    location: z.string().optional().describe("Activity location"),
    public_description: z.string().optional().describe("Public description for calendar sync"),
    busy_flag: z.enum(["true", "false"]).optional().describe("Whether busy during this activity"),
  },
  async (params) => ok(await pd("POST", "/activities", params))
);

server.tool(
  "pipedrive_update_activity",
  "Update an existing activity",
  {
    id: z.number().describe("Activity ID"),
    subject: z.string().optional().describe("Activity subject/title"),
    type: z.string().optional().describe("Activity type"),
    done: z.enum(["0", "1"]).optional().describe("Whether done"),
    due_date: z.string().optional().describe("Due date (YYYY-MM-DD)"),
    due_time: z.string().optional().describe("Due time (HH:MM)"),
    duration: z.string().optional().describe("Duration (HH:MM)"),
    user_id: z.number().optional().describe("Assigned user ID"),
    deal_id: z.number().optional().describe("Linked deal ID"),
    person_id: z.number().optional().describe("Linked person ID"),
    org_id: z.number().optional().describe("Linked organization ID"),
    note: z.string().optional().describe("Activity note (HTML)"),
    location: z.string().optional().describe("Activity location"),
  },
  async ({ id, ...body }) => ok(await pd("PUT", `/activities/${id}`, body))
);

server.tool(
  "pipedrive_delete_activity",
  "Delete an activity",
  { id: z.number().describe("Activity ID") },
  async ({ id }) => ok(await pd("DELETE", `/activities/${id}`))
);

// ======================== PRODUCTS ========================

server.tool(
  "pipedrive_list_products",
  "List products",
  {
    user_id: z.number().optional().describe("Filter by owner user ID"),
    filter_id: z.number().optional().describe("Filter ID"),
    start: z.number().optional(),
    limit: z.number().optional(),
  },
  async (params) => ok(await pd("GET", "/products", undefined, params))
);

server.tool(
  "pipedrive_get_product",
  "Get a single product by ID",
  { id: z.number().describe("Product ID") },
  async ({ id }) => ok(await pd("GET", `/products/${id}`))
);

server.tool(
  "pipedrive_create_product",
  "Create a new product",
  {
    name: z.string().describe("Product name"),
    code: z.string().optional().describe("Product code/SKU"),
    unit: z.string().optional().describe("Unit of measurement"),
    tax: z.number().optional().describe("Tax percentage"),
    active_flag: z.boolean().optional().describe("Whether product is active"),
    visible_to: z.number().optional().describe("Visibility setting"),
    prices: z.array(z.object({
      price: z.number().describe("Price amount"),
      currency: z.string().describe("Currency code"),
      cost: z.number().optional().describe("Cost"),
      overhead_cost: z.number().optional().describe("Overhead cost"),
    })).optional().describe("Product prices"),
  },
  async (params) => ok(await pd("POST", "/products", params))
);

server.tool(
  "pipedrive_update_product",
  "Update an existing product",
  {
    id: z.number().describe("Product ID"),
    name: z.string().optional().describe("Product name"),
    code: z.string().optional().describe("Product code/SKU"),
    unit: z.string().optional().describe("Unit of measurement"),
    tax: z.number().optional().describe("Tax percentage"),
    active_flag: z.boolean().optional().describe("Whether product is active"),
    visible_to: z.number().optional().describe("Visibility setting"),
    prices: z.array(z.object({
      price: z.number().describe("Price amount"),
      currency: z.string().describe("Currency code"),
      cost: z.number().optional(),
      overhead_cost: z.number().optional(),
    })).optional().describe("Product prices"),
  },
  async ({ id, ...body }) => ok(await pd("PUT", `/products/${id}`, body))
);

server.tool(
  "pipedrive_delete_product",
  "Delete a product",
  { id: z.number().describe("Product ID") },
  async ({ id }) => ok(await pd("DELETE", `/products/${id}`))
);

server.tool(
  "pipedrive_search_products",
  "Search for products by name",
  {
    term: z.string().describe("Search term (min 2 chars)"),
    fields: z.enum(["custom_fields", "name", "code"]).optional(),
    exact_match: z.boolean().optional(),
    start: z.number().optional(),
    limit: z.number().optional(),
  },
  async (params) => ok(await pd("GET", "/products/search", undefined, params))
);

// ======================== PIPELINES ========================

server.tool(
  "pipedrive_list_pipelines",
  "List all pipelines",
  {},
  async () => ok(await pd("GET", "/pipelines"))
);

server.tool(
  "pipedrive_get_pipeline",
  "Get a single pipeline by ID",
  { id: z.number().describe("Pipeline ID") },
  async ({ id }) => ok(await pd("GET", `/pipelines/${id}`))
);

server.tool(
  "pipedrive_create_pipeline",
  "Create a new pipeline",
  {
    name: z.string().describe("Pipeline name"),
    deal_probability: z.enum(["0", "1"]).optional().describe("Enable deal probability (0=disabled, 1=enabled)"),
    order_nr: z.number().optional().describe("Pipeline order number"),
    active: z.enum(["0", "1"]).optional().describe("Whether active"),
  },
  async (params) => ok(await pd("POST", "/pipelines", params))
);

server.tool(
  "pipedrive_update_pipeline",
  "Update an existing pipeline",
  {
    id: z.number().describe("Pipeline ID"),
    name: z.string().optional().describe("Pipeline name"),
    deal_probability: z.enum(["0", "1"]).optional(),
    order_nr: z.number().optional(),
    active: z.enum(["0", "1"]).optional(),
  },
  async ({ id, ...body }) => ok(await pd("PUT", `/pipelines/${id}`, body))
);

server.tool(
  "pipedrive_delete_pipeline",
  "Delete a pipeline",
  { id: z.number().describe("Pipeline ID") },
  async ({ id }) => ok(await pd("DELETE", `/pipelines/${id}`))
);

server.tool(
  "pipedrive_get_pipeline_deals",
  "Get deals in a pipeline",
  {
    id: z.number().describe("Pipeline ID"),
    filter_id: z.number().optional(),
    user_id: z.number().optional(),
    everyone: z.enum(["0", "1"]).optional().describe("Show deals for all users"),
    stage_id: z.number().optional(),
    start: z.number().optional(),
    limit: z.number().optional(),
    get_summary: z.enum(["0", "1"]).optional().describe("Include summary"),
    totals_convert_currency: z.string().optional(),
  },
  async ({ id, ...params }) => ok(await pd("GET", `/pipelines/${id}/deals`, undefined, params))
);

server.tool(
  "pipedrive_get_pipeline_conversion_statistics",
  "Get deal conversion statistics for a pipeline",
  {
    id: z.number().describe("Pipeline ID"),
    start_date: z.string().describe("Start date (YYYY-MM-DD)"),
    end_date: z.string().describe("End date (YYYY-MM-DD)"),
    user_id: z.number().optional(),
  },
  async ({ id, ...params }) => ok(await pd("GET", `/pipelines/${id}/conversion_statistics`, undefined, params))
);

server.tool(
  "pipedrive_get_pipeline_movement_statistics",
  "Get deal movement statistics for a pipeline",
  {
    id: z.number().describe("Pipeline ID"),
    start_date: z.string().describe("Start date (YYYY-MM-DD)"),
    end_date: z.string().describe("End date (YYYY-MM-DD)"),
    user_id: z.number().optional(),
  },
  async ({ id, ...params }) => ok(await pd("GET", `/pipelines/${id}/movement_statistics`, undefined, params))
);

// ======================== STAGES ========================

server.tool(
  "pipedrive_list_stages",
  "List all stages or stages in a pipeline",
  {
    pipeline_id: z.number().optional().describe("Filter by pipeline ID"),
  },
  async (params) => ok(await pd("GET", "/stages", undefined, params))
);

server.tool(
  "pipedrive_get_stage",
  "Get a single stage by ID",
  { id: z.number().describe("Stage ID") },
  async ({ id }) => ok(await pd("GET", `/stages/${id}`))
);

server.tool(
  "pipedrive_create_stage",
  "Create a new stage in a pipeline",
  {
    name: z.string().describe("Stage name"),
    pipeline_id: z.number().describe("Pipeline ID this stage belongs to"),
    deal_probability: z.number().optional().describe("Deal probability percentage (0-100)"),
    rotten_flag: z.enum(["0", "1"]).optional().describe("Enable deal rotting"),
    rotten_days: z.number().optional().describe("Days before a deal rots"),
    order_nr: z.number().optional().describe("Stage order number"),
  },
  async (params) => ok(await pd("POST", "/stages", params))
);

server.tool(
  "pipedrive_update_stage",
  "Update an existing stage",
  {
    id: z.number().describe("Stage ID"),
    name: z.string().optional().describe("Stage name"),
    pipeline_id: z.number().optional().describe("Pipeline ID"),
    deal_probability: z.number().optional().describe("Deal probability percentage"),
    rotten_flag: z.enum(["0", "1"]).optional(),
    rotten_days: z.number().optional(),
    order_nr: z.number().optional(),
  },
  async ({ id, ...body }) => ok(await pd("PUT", `/stages/${id}`, body))
);

server.tool(
  "pipedrive_delete_stage",
  "Delete a stage",
  { id: z.number().describe("Stage ID") },
  async ({ id }) => ok(await pd("DELETE", `/stages/${id}`))
);

server.tool(
  "pipedrive_get_stage_deals",
  "Get deals in a stage",
  {
    id: z.number().describe("Stage ID"),
    filter_id: z.number().optional(),
    user_id: z.number().optional(),
    everyone: z.enum(["0", "1"]).optional(),
    start: z.number().optional(),
    limit: z.number().optional(),
  },
  async ({ id, ...params }) => ok(await pd("GET", `/stages/${id}/deals`, undefined, params))
);

// ======================== NOTES ========================

server.tool(
  "pipedrive_list_notes",
  "List notes with optional filtering",
  {
    user_id: z.number().optional().describe("Filter by author user ID"),
    deal_id: z.number().optional().describe("Filter by deal ID"),
    person_id: z.number().optional().describe("Filter by person ID"),
    org_id: z.number().optional().describe("Filter by organization ID"),
    lead_id: z.string().optional().describe("Filter by lead ID (UUID)"),
    start: z.number().optional(),
    limit: z.number().optional(),
    sort: z.string().optional(),
    start_date: z.string().optional().describe("Start date filter (YYYY-MM-DD)"),
    end_date: z.string().optional().describe("End date filter (YYYY-MM-DD)"),
    pinned_to_deal_flag: z.enum(["0", "1"]).optional(),
    pinned_to_person_flag: z.enum(["0", "1"]).optional(),
    pinned_to_organization_flag: z.enum(["0", "1"]).optional(),
  },
  async (params) => ok(await pd("GET", "/notes", undefined, params))
);

server.tool(
  "pipedrive_get_note",
  "Get a single note by ID",
  { id: z.number().describe("Note ID") },
  async ({ id }) => ok(await pd("GET", `/notes/${id}`))
);

server.tool(
  "pipedrive_create_note",
  "Create a note on a deal, person, organization, or lead",
  {
    content: z.string().describe("Note content (HTML supported)"),
    deal_id: z.number().optional().describe("Attach to deal ID"),
    person_id: z.number().optional().describe("Attach to person ID"),
    org_id: z.number().optional().describe("Attach to organization ID"),
    lead_id: z.string().optional().describe("Attach to lead ID (UUID)"),
    pinned_to_deal_flag: z.enum(["0", "1"]).optional().describe("Pin to deal"),
    pinned_to_person_flag: z.enum(["0", "1"]).optional().describe("Pin to person"),
    pinned_to_organization_flag: z.enum(["0", "1"]).optional().describe("Pin to organization"),
  },
  async (params) => ok(await pd("POST", "/notes", params))
);

server.tool(
  "pipedrive_update_note",
  "Update an existing note",
  {
    id: z.number().describe("Note ID"),
    content: z.string().describe("Note content (HTML supported)"),
    deal_id: z.number().optional(),
    person_id: z.number().optional(),
    org_id: z.number().optional(),
    lead_id: z.string().optional(),
    pinned_to_deal_flag: z.enum(["0", "1"]).optional(),
    pinned_to_person_flag: z.enum(["0", "1"]).optional(),
    pinned_to_organization_flag: z.enum(["0", "1"]).optional(),
  },
  async ({ id, ...body }) => ok(await pd("PUT", `/notes/${id}`, body))
);

server.tool(
  "pipedrive_delete_note",
  "Delete a note",
  { id: z.number().describe("Note ID") },
  async ({ id }) => ok(await pd("DELETE", `/notes/${id}`))
);

// ======================== LEADS ========================

server.tool(
  "pipedrive_list_leads",
  "List leads with optional filtering",
  {
    limit: z.number().optional(),
    start: z.number().optional(),
    archived_status: z.enum(["archived", "not_archived", "all"]).optional(),
    owner_id: z.number().optional().describe("Filter by owner user ID"),
    person_id: z.number().optional(),
    organization_id: z.number().optional(),
    filter_id: z.number().optional(),
    sort: z.string().optional(),
  },
  async (params) => ok(await pd("GET", "/leads", undefined, params))
);

server.tool(
  "pipedrive_get_lead",
  "Get a single lead by ID",
  { id: z.string().describe("Lead ID (UUID)") },
  async ({ id }) => ok(await pd("GET", `/leads/${id}`))
);

server.tool(
  "pipedrive_create_lead",
  "Create a new lead",
  {
    title: z.string().describe("Lead title"),
    owner_id: z.number().optional().describe("Owner user ID"),
    label_ids: z.array(z.string()).optional().describe("Lead label UUIDs"),
    person_id: z.number().optional().describe("Associated person ID"),
    organization_id: z.number().optional().describe("Associated organization ID"),
    value: z.object({
      amount: z.number().describe("Monetary amount"),
      currency: z.string().describe("Currency code"),
    }).optional().describe("Lead value"),
    expected_close_date: z.string().optional().describe("Expected close date (YYYY-MM-DD)"),
    visible_to: z.number().optional(),
    was_seen: z.boolean().optional().describe("Whether lead has been seen"),
  },
  async (params) => ok(await pd("POST", "/leads", params))
);

server.tool(
  "pipedrive_update_lead",
  "Update an existing lead",
  {
    id: z.string().describe("Lead ID (UUID)"),
    title: z.string().optional().describe("Lead title"),
    owner_id: z.number().optional(),
    label_ids: z.array(z.string()).optional(),
    person_id: z.number().optional(),
    organization_id: z.number().optional(),
    value: z.object({
      amount: z.number(),
      currency: z.string(),
    }).optional(),
    expected_close_date: z.string().optional(),
    visible_to: z.number().optional(),
    is_archived: z.boolean().optional().describe("Archive/unarchive the lead"),
  },
  async ({ id, ...body }) => ok(await pd("PATCH", `/leads/${id}`, body))
);

server.tool(
  "pipedrive_delete_lead",
  "Delete a lead",
  { id: z.string().describe("Lead ID (UUID)") },
  async ({ id }) => ok(await pd("DELETE", `/leads/${id}`))
);

server.tool(
  "pipedrive_search_leads",
  "Search for leads",
  {
    term: z.string().describe("Search term (min 2 chars)"),
    fields: z.enum(["custom_fields", "notes", "title"]).optional(),
    exact_match: z.boolean().optional(),
    person_id: z.number().optional(),
    organization_id: z.number().optional(),
    start: z.number().optional(),
    limit: z.number().optional(),
  },
  async (params) => ok(await pd("GET", "/leads/search", undefined, params))
);

// ======================== USERS ========================

server.tool(
  "pipedrive_list_users",
  "List all users in the company",
  {},
  async () => ok(await pd("GET", "/users"))
);

server.tool(
  "pipedrive_get_user",
  "Get a user by ID",
  { id: z.number().describe("User ID") },
  async ({ id }) => ok(await pd("GET", `/users/${id}`))
);

server.tool(
  "pipedrive_get_current_user",
  "Get the current authenticated user",
  {},
  async () => ok(await pd("GET", "/users/me"))
);

// ======================== FILTERS ========================

server.tool(
  "pipedrive_list_filters",
  "List all filters",
  {
    type: z.enum(["deals", "leads", "org", "people", "products", "activity"]).optional().describe("Filter entity type"),
  },
  async (params) => ok(await pd("GET", "/filters", undefined, params))
);

server.tool(
  "pipedrive_get_filter",
  "Get a filter by ID",
  { id: z.number().describe("Filter ID") },
  async ({ id }) => ok(await pd("GET", `/filters/${id}`))
);

// ======================== SEARCH ========================

server.tool(
  "pipedrive_search",
  "Search across all Pipedrive entities",
  {
    term: z.string().describe("Search term (min 2 chars)"),
    item_types: z.string().optional().describe("Comma-separated entity types: deal,person,organization,product,lead,file"),
    fields: z.string().optional().describe("Comma-separated fields: custom_fields,notes,email,phone,name,title"),
    exact_match: z.boolean().optional(),
    start: z.number().optional(),
    limit: z.number().optional(),
  },
  async (params) => ok(await pd("GET", "/itemSearch", undefined, params))
);

// ======================== WEBHOOKS ========================

server.tool(
  "pipedrive_list_webhooks",
  "List all webhooks",
  {},
  async () => ok(await pd("GET", "/webhooks"))
);

server.tool(
  "pipedrive_create_webhook",
  "Create a new webhook",
  {
    subscription_url: z.string().describe("Webhook callback URL"),
    event_action: z.enum(["added", "updated", "merged", "deleted", "*"]).describe("Event action to listen for"),
    event_object: z.enum(["activity", "activityType", "deal", "note", "organization", "person", "pipeline", "product", "stage", "user", "*"]).describe("Event object type"),
    user_id: z.number().optional().describe("Filter events by user ID"),
    http_auth_user: z.string().optional().describe("HTTP basic auth username"),
    http_auth_password: z.string().optional().describe("HTTP basic auth password"),
  },
  async (params) => ok(await pd("POST", "/webhooks", params))
);

server.tool(
  "pipedrive_delete_webhook",
  "Delete a webhook",
  { id: z.number().describe("Webhook ID") },
  async ({ id }) => ok(await pd("DELETE", `/webhooks/${id}`))
);

// ======================== DEAL FIELDS ========================

server.tool(
  "pipedrive_list_deal_fields",
  "List all deal fields (including custom fields)",
  {
    start: z.number().optional(),
    limit: z.number().optional(),
  },
  async (params) => ok(await pd("GET", "/dealFields", undefined, params))
);

server.tool(
  "pipedrive_create_deal_field",
  "Create a custom deal field",
  {
    name: z.string().describe("Field name"),
    field_type: z.enum(["address", "date", "daterange", "double", "enum", "monetary", "org", "people", "phone", "set", "text", "time", "timerange", "user", "varchar", "varchar_auto", "visible_to"]).describe("Field type"),
    options: z.array(z.object({ label: z.string() })).optional().describe("Options for enum/set fields"),
    add_visible_flag: z.boolean().optional().describe("Whether visible in add-new dialogs"),
  },
  async (params) => ok(await pd("POST", "/dealFields", params))
);

server.tool(
  "pipedrive_delete_deal_field",
  "Delete a custom deal field",
  { id: z.number().describe("Deal field ID") },
  async ({ id }) => ok(await pd("DELETE", `/dealFields/${id}`))
);

// ======================== PERSON FIELDS ========================

server.tool(
  "pipedrive_list_person_fields",
  "List all person fields (including custom fields)",
  {
    start: z.number().optional(),
    limit: z.number().optional(),
  },
  async (params) => ok(await pd("GET", "/personFields", undefined, params))
);

server.tool(
  "pipedrive_create_person_field",
  "Create a custom person field",
  {
    name: z.string().describe("Field name"),
    field_type: z.enum(["address", "date", "daterange", "double", "enum", "monetary", "org", "people", "phone", "set", "text", "time", "timerange", "user", "varchar", "varchar_auto", "visible_to"]).describe("Field type"),
    options: z.array(z.object({ label: z.string() })).optional().describe("Options for enum/set fields"),
    add_visible_flag: z.boolean().optional(),
  },
  async (params) => ok(await pd("POST", "/personFields", params))
);

// ======================== ORGANIZATION FIELDS ========================

server.tool(
  "pipedrive_list_organization_fields",
  "List all organization fields (including custom fields)",
  {
    start: z.number().optional(),
    limit: z.number().optional(),
  },
  async (params) => ok(await pd("GET", "/organizationFields", undefined, params))
);

// ======================== ACTIVITY TYPES ========================

server.tool(
  "pipedrive_list_activity_types",
  "List all activity types",
  {},
  async () => ok(await pd("GET", "/activityTypes"))
);

// ======================== CURRENCIES ========================

server.tool(
  "pipedrive_list_currencies",
  "List all supported currencies",
  {
    term: z.string().optional().describe("Search term for currency name/code"),
  },
  async (params) => ok(await pd("GET", "/currencies", undefined, params))
);

// ======================== RECENTS ========================

server.tool(
  "pipedrive_get_recents",
  "Get recent changes across entities",
  {
    since_timestamp: z.string().describe("Timestamp for changes since (YYYY-MM-DD HH:MM:SS)"),
    items: z.string().optional().describe("Comma-separated entity types: activity,activityType,deal,file,filter,note,organization,person,pipeline,product,stage,user"),
    start: z.number().optional(),
    limit: z.number().optional(),
  },
  async (params) => ok(await pd("GET", "/recents", undefined, params))
);

// ======================== FILES ========================

server.tool(
  "pipedrive_list_files",
  "List files with optional filtering",
  {
    start: z.number().optional(),
    limit: z.number().optional(),
    sort: z.string().optional(),
  },
  async (params) => ok(await pd("GET", "/files", undefined, params))
);

server.tool(
  "pipedrive_get_file",
  "Get a file by ID",
  { id: z.number().describe("File ID") },
  async ({ id }) => ok(await pd("GET", `/files/${id}`))
);

server.tool(
  "pipedrive_delete_file",
  "Delete a file",
  { id: z.number().describe("File ID") },
  async ({ id }) => ok(await pd("DELETE", `/files/${id}`))
);

// ======================== GOALS ========================

server.tool(
  "pipedrive_list_goals",
  "List goals",
  {
    type_name: z.enum(["deals_won", "deals_progressed", "activities_completed", "activities_added", "deals_started"]).optional(),
    title: z.string().optional().describe("Filter by goal title"),
    is_active: z.boolean().optional().describe("Active goals only"),
    assignee_id: z.number().optional().describe("Filter by assignee user ID"),
    assignee_type: z.enum(["person", "company", "team"]).optional(),
    expected_outcome_target: z.number().optional(),
    expected_outcome_tracking_metric: z.enum(["quantity", "sum"]).optional(),
    type_params_pipeline_id: z.array(z.number()).optional(),
    type_params_stage_id: z.number().optional(),
    type_params_activity_type_id: z.array(z.number()).optional(),
    period_start: z.string().optional().describe("Start of period (YYYY-MM-DD)"),
    period_end: z.string().optional().describe("End of period (YYYY-MM-DD)"),
  },
  async (params) => ok(await pd("GET", "/goals/find", undefined, params))
);

// ======================== CALL LOGS ========================

server.tool(
  "pipedrive_list_call_logs",
  "List call logs",
  {
    start: z.number().optional(),
    limit: z.number().optional(),
  },
  async (params) => ok(await pd("GET", "/callLogs", undefined, params))
);

server.tool(
  "pipedrive_create_call_log",
  "Log a phone call",
  {
    subject: z.string().optional().describe("Call subject"),
    duration: z.string().optional().describe("Call duration in seconds"),
    outcome: z.enum(["connected", "no_answer", "left_message", "left_voicemail", "wrong_number", "busy"]).describe("Call outcome"),
    from_phone_number: z.string().optional().describe("Caller phone number"),
    to_phone_number: z.string().describe("Called phone number"),
    start_time: z.string().describe("Call start time (RFC3339)"),
    end_time: z.string().optional().describe("Call end time (RFC3339)"),
    person_id: z.number().optional().describe("Linked person ID"),
    org_id: z.number().optional().describe("Linked organization ID"),
    deal_id: z.number().optional().describe("Linked deal ID"),
    note: z.string().optional().describe("Call note"),
  },
  async (params) => ok(await pd("POST", "/callLogs", params))
);

// ======================== PROJECTS ========================

server.tool(
  "pipedrive_list_projects",
  "List projects",
  {
    status: z.enum(["open", "completed", "canceled", "deleted"]).optional(),
    phase_id: z.number().optional(),
    start: z.number().optional(),
    limit: z.number().optional(),
    archived: z.boolean().optional(),
    filter_id: z.number().optional(),
  },
  async (params) => ok(await pd("GET", "/projects", undefined, params))
);

server.tool(
  "pipedrive_get_project",
  "Get a project by ID",
  { id: z.number().describe("Project ID") },
  async ({ id }) => ok(await pd("GET", `/projects/${id}`))
);

server.tool(
  "pipedrive_create_project",
  "Create a new project",
  {
    title: z.string().describe("Project title"),
    board_id: z.number().optional().describe("Board ID"),
    phase_id: z.number().optional().describe("Phase ID"),
    description: z.string().optional().describe("Project description"),
    status: z.enum(["open", "completed", "canceled"]).optional(),
    owner_id: z.number().optional(),
    start_date: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    end_date: z.string().optional().describe("End date (YYYY-MM-DD)"),
    deal_ids: z.array(z.number()).optional().describe("Linked deal IDs"),
    org_id: z.number().optional(),
    person_id: z.number().optional(),
  },
  async (params) => ok(await pd("POST", "/projects", params))
);

server.tool(
  "pipedrive_update_project",
  "Update an existing project",
  {
    id: z.number().describe("Project ID"),
    title: z.string().optional(),
    board_id: z.number().optional(),
    phase_id: z.number().optional(),
    description: z.string().optional(),
    status: z.enum(["open", "completed", "canceled"]).optional(),
    owner_id: z.number().optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    deal_ids: z.array(z.number()).optional(),
    org_id: z.number().optional(),
    person_id: z.number().optional(),
  },
  async ({ id, ...body }) => ok(await pd("PUT", `/projects/${id}`, body))
);

server.tool(
  "pipedrive_delete_project",
  "Delete a project",
  { id: z.number().describe("Project ID") },
  async ({ id }) => ok(await pd("DELETE", `/projects/${id}`))
);

// ======================== SUBSCRIPTIONS ========================

server.tool(
  "pipedrive_get_subscription",
  "Get a recurring subscription by deal ID",
  { deal_id: z.number().describe("Deal ID") },
  async ({ deal_id }) => ok(await pd("GET", `/subscriptions/find/${deal_id}`))
);

server.tool(
  "pipedrive_create_recurring_subscription",
  "Create a recurring subscription on a deal",
  {
    deal_id: z.number().describe("Deal ID"),
    currency: z.string().describe("Currency code"),
    cadence_type: z.enum(["weekly", "monthly", "quarterly", "yearly"]).describe("Billing cadence"),
    cycle_amount: z.number().describe("Amount per cycle"),
    start_date: z.string().describe("Start date (YYYY-MM-DD)"),
    infinite: z.boolean().optional().describe("Whether subscription is infinite"),
    end_date: z.string().optional().describe("End date (YYYY-MM-DD) if not infinite"),
    payments: z.array(z.object({
      amount: z.number(),
      description: z.string().optional(),
      due_at: z.string().describe("Due date (YYYY-MM-DD)"),
    })).optional().describe("Manual payment schedule"),
  },
  async (params) => ok(await pd("POST", "/subscriptions/recurring", params))
);

// ======================== MAIL ========================

server.tool(
  "pipedrive_list_mail_threads",
  "List mail threads",
  {
    folder: z.enum(["inbox", "drafts", "sent", "archive"]).optional().describe("Mail folder"),
    start: z.number().optional(),
    limit: z.number().optional(),
  },
  async (params) => ok(await pd("GET", "/mailbox/mailThreads", undefined, params))
);

server.tool(
  "pipedrive_get_mail_thread",
  "Get a mail thread by ID",
  { id: z.number().describe("Mail thread ID") },
  async ({ id }) => ok(await pd("GET", `/mailbox/mailThreads/${id}`))
);

server.tool(
  "pipedrive_get_mail_thread_messages",
  "Get messages in a mail thread",
  { id: z.number().describe("Mail thread ID") },
  async ({ id }) => ok(await pd("GET", `/mailbox/mailThreads/${id}/mailMessages`))
);

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Pipedrive MCP server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
