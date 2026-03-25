# Pipedrive MCP Server

A comprehensive [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server for the [Pipedrive CRM API](https://developers.pipedrive.com/docs/api/v1). Exposes **94 tools** covering every major Pipedrive resource so any MCP-compatible AI (Claude, ChatGPT, Codex, etc.) can read and write your CRM data conversationally.

---

## Tools Reference

### Deals (9)
| Tool | Description |
|------|-------------|
| `pipedrive_list_deals` | List deals with optional filtering by user, stage, status |
| `pipedrive_get_deal` | Get a single deal by ID |
| `pipedrive_create_deal` | Create a new deal |
| `pipedrive_update_deal` | Update an existing deal |
| `pipedrive_delete_deal` | Delete a deal |
| `pipedrive_search_deals` | Full-text search across deals |
| `pipedrive_get_deal_activities` | List all activities on a deal |
| `pipedrive_get_deals_summary` | Aggregate totals by pipeline/stage |
| `pipedrive_get_deals_timeline` | Deals over time with configurable interval |

### Persons / Contacts (6)
| Tool | Description |
|------|-------------|
| `pipedrive_list_persons` | List persons with optional filtering |
| `pipedrive_get_person` | Get a person by ID |
| `pipedrive_create_person` | Create a new person |
| `pipedrive_update_person` | Update a person |
| `pipedrive_delete_person` | Delete a person |
| `pipedrive_search_persons` | Full-text search across persons |
| `pipedrive_get_person_deals` | Get all deals linked to a person |

### Organizations (6)
| Tool | Description |
|------|-------------|
| `pipedrive_list_organizations` | List organizations |
| `pipedrive_get_organization` | Get an organization by ID |
| `pipedrive_create_organization` | Create a new organization |
| `pipedrive_update_organization` | Update an organization |
| `pipedrive_delete_organization` | Delete an organization |
| `pipedrive_search_organizations` | Full-text search across organizations |
| `pipedrive_get_organization_deals` | Get all deals for an organization |
| `pipedrive_get_organization_persons` | Get all persons in an organization |

### Activities (5)
| Tool | Description |
|------|-------------|
| `pipedrive_list_activities` | List activities with date/type filtering |
| `pipedrive_get_activity` | Get an activity by ID |
| `pipedrive_create_activity` | Create a new activity |
| `pipedrive_update_activity` | Update an activity |
| `pipedrive_delete_activity` | Delete an activity |

### Leads (6)
| Tool | Description |
|------|-------------|
| `pipedrive_list_leads` | List all leads |
| `pipedrive_get_lead` | Get a lead by ID |
| `pipedrive_create_lead` | Create a new lead |
| `pipedrive_update_lead` | Update a lead |
| `pipedrive_delete_lead` | Delete a lead |
| `pipedrive_search_leads` | Full-text search across leads |

### Notes (5)
| Tool | Description |
|------|-------------|
| `pipedrive_list_notes` | List notes with filtering |
| `pipedrive_get_note` | Get a note by ID |
| `pipedrive_create_note` | Create a note linked to deal/person/org |
| `pipedrive_update_note` | Update a note |
| `pipedrive_delete_note` | Delete a note |

### Products (6)
| Tool | Description |
|------|-------------|
| `pipedrive_list_products` | List products with filtering |
| `pipedrive_get_product` | Get a product by ID |
| `pipedrive_create_product` | Create a new product |
| `pipedrive_update_product` | Update a product |
| `pipedrive_delete_product` | Delete a product |
| `pipedrive_search_products` | Full-text search across products |

### Pipelines (6)
| Tool | Description |
|------|-------------|
| `pipedrive_list_pipelines` | List all pipelines |
| `pipedrive_get_pipeline` | Get a pipeline by ID |
| `pipedrive_create_pipeline` | Create a pipeline |
| `pipedrive_update_pipeline` | Update a pipeline |
| `pipedrive_delete_pipeline` | Delete a pipeline |
| `pipedrive_get_pipeline_deals` | Get deals in a pipeline |
| `pipedrive_get_pipeline_conversion_statistics` | Funnel conversion stats |
| `pipedrive_get_pipeline_movement_statistics` | Deal movement statistics |

### Stages (5)
| Tool | Description |
|------|-------------|
| `pipedrive_list_stages` | List all stages |
| `pipedrive_get_stage` | Get a stage by ID |
| `pipedrive_create_stage` | Create a stage |
| `pipedrive_update_stage` | Update a stage |
| `pipedrive_delete_stage` | Delete a stage |
| `pipedrive_get_stage_deals` | Get deals in a stage |

### Users (3)
| Tool | Description |
|------|-------------|
| `pipedrive_list_users` | List all users in the company |
| `pipedrive_get_user` | Get a user by ID |
| `pipedrive_get_current_user` | Get the authenticated user |

### Projects (5)
| Tool | Description |
|------|-------------|
| `pipedrive_list_projects` | List all projects |
| `pipedrive_get_project` | Get a project by ID |
| `pipedrive_create_project` | Create a project |
| `pipedrive_update_project` | Update a project |
| `pipedrive_delete_project` | Delete a project |

### Custom Fields (5)
| Tool | Description |
|------|-------------|
| `pipedrive_list_deal_fields` | List all custom deal fields |
| `pipedrive_create_deal_field` | Create a custom deal field |
| `pipedrive_delete_deal_field` | Delete a custom deal field |
| `pipedrive_list_person_fields` | List all custom person fields |
| `pipedrive_create_person_field` | Create a custom person field |
| `pipedrive_list_organization_fields` | List all custom org fields |

### Webhooks (3)
| Tool | Description |
|------|-------------|
| `pipedrive_list_webhooks` | List all configured webhooks |
| `pipedrive_create_webhook` | Create a webhook subscription |
| `pipedrive_delete_webhook` | Delete a webhook |

### Files (3)
| Tool | Description |
|------|-------------|
| `pipedrive_list_files` | List all uploaded files |
| `pipedrive_get_file` | Get file metadata by ID |
| `pipedrive_delete_file` | Delete a file |

### Mail (3)
| Tool | Description |
|------|-------------|
| `pipedrive_list_mail_threads` | List mail threads |
| `pipedrive_get_mail_thread` | Get a mail thread by ID |
| `pipedrive_get_mail_thread_messages` | Get all messages in a thread |

### Call Logs (2)
| Tool | Description |
|------|-------------|
| `pipedrive_list_call_logs` | List call logs |
| `pipedrive_create_call_log` | Log a call against a deal/person |

### Search & Misc (8)
| Tool | Description |
|------|-------------|
| `pipedrive_search` | Global search across all entity types |
| `pipedrive_search_leads` | Search leads |
| `pipedrive_list_filters` | List saved filters |
| `pipedrive_get_filter` | Get a filter by ID |
| `pipedrive_get_recents` | Get recently changed items |
| `pipedrive_list_activity_types` | List activity type definitions |
| `pipedrive_list_currencies` | List supported currencies |
| `pipedrive_list_goals` | List goals |
| `pipedrive_get_subscription` | Get subscription details |
| `pipedrive_create_recurring_subscription` | Create a recurring subscription |

---

## Prerequisites

- **Node.js** 18 or later
- A **Pipedrive API token** — find yours at *Settings → Personal preferences → API*

---

## Installation

```bash
git clone https://github.com/GarethWright/PipeDrive-MCP-Server.git
cd PipeDrive-MCP-Server
npm install
npm run build
```

---

## Configuration

### Claude Code (Claude Desktop / CLI)

Add the server with a single command:

```bash
claude mcp add pipedrive \
  -e PIPEDRIVE_API_TOKEN=your_api_token_here \
  -- node /absolute/path/to/PipeDrive-MCP-Server/dist/index.js
```

Or add it manually to `~/.claude/settings.json` → `mcpServers`:

```json
{
  "mcpServers": {
    "pipedrive": {
      "command": "node",
      "args": ["/absolute/path/to/PipeDrive-MCP-Server/dist/index.js"],
      "env": {
        "PIPEDRIVE_API_TOKEN": "your_api_token_here"
      }
    }
  }
}
```

> **Note for nvm/homebrew users:** If `node` isn't in the default PATH, use the full path to the binary (e.g. `/opt/homebrew/opt/node@20/bin/node`).

---

### ChatGPT (via OpenAI Custom GPT / Function Calling)

ChatGPT does not natively support MCP stdio servers, but you can expose this server over HTTP using an MCP-to-HTTP bridge such as [`mcp-proxy`](https://github.com/sparfenyuk/mcp-proxy):

```bash
# Install the proxy
npm install -g mcp-proxy

# Start the HTTP bridge
PIPEDRIVE_API_TOKEN=your_api_token_here \
  mcp-proxy --port 3100 node /absolute/path/to/PipeDrive-MCP-Server/dist/index.js
```

Then add `http://localhost:3100` as a **Custom Action** server in your GPT configuration. Export the tool schemas from the running server to generate the OpenAPI spec ChatGPT needs.

For **OpenAI Assistants API** with function calling, generate the function definitions from the tool list above and pass them as `tools` in your assistant creation call.

---

### OpenAI Codex (Codex CLI)

[Codex CLI](https://github.com/openai/openai-codex) supports MCP natively via its config file at `~/.codex/config.yaml`:

```yaml
mcpServers:
  pipedrive:
    command: node
    args:
      - /absolute/path/to/PipeDrive-MCP-Server/dist/index.js
    env:
      PIPEDRIVE_API_TOKEN: your_api_token_here
```

Restart Codex after saving. Tools will appear automatically in the session.

> **Note for nvm/homebrew users:** Specify the full path to `node`, e.g. `/opt/homebrew/opt/node@20/bin/node`.

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PIPEDRIVE_API_TOKEN` | Yes | — | Your Pipedrive API token |
| `PIPEDRIVE_BASE_URL` | No | `https://api.pipedrive.com/v1` | Override for self-hosted / EU data residency |

---

## Development

```bash
# Watch mode — recompiles on save
npx tsc --watch

# Run directly without building
npx ts-node src/index.ts
```

---

## License

ISC
