# Pipedrive MCP Server

A comprehensive [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server for the [Pipedrive CRM API](https://developers.pipedrive.com/docs/api/v1). Exposes **100 tools** — 94 standard API tools covering every major Pipedrive resource, plus **6 built-in analytics tools** for performance reporting, loss analysis, and pipeline health — so any MCP-compatible AI (Claude, ChatGPT, Codex, etc.) can read, write, and analyse your CRM data conversationally.

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

## Analytics & Reporting Tools

In addition to the 94 standard API tools above, the server includes **6 built-in analytics tools** that aggregate and analyse your Pipedrive data to produce actionable reports. These tools go beyond raw API access — they fetch and process data server-side to surface patterns, risks, and performance insights directly in your AI conversation.

> These tools are designed to be used conversationally. Ask your AI assistant in plain English and it will choose the right tool, run the analysis, and present the findings.

---

### `pipedrive_performance_report`

Generates a win/loss performance report for a given period with a **composite leaderboard** that ranks reps across four dimensions: win rate, volume, closing speed, and average deal value.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `period` | `daily` \| `weekly` \| `monthly` | Report period (ignored if date range supplied) |
| `offset` | number | Periods back from today (0 = current, 1 = previous) |
| `date_from` | string | Custom start date `YYYY-MM-DD` |
| `date_to` | string | Custom end date `YYYY-MM-DD` |
| `pipeline_id` | number | Restrict to a specific pipeline |

**Composite Scoring Methodology**

The leaderboard uses a 0–100 composite score to prevent any single metric from dominating:

| Dimension | Weight | How it's calculated |
|-----------|--------|---------------------|
| Win Rate | 30% | Deals won ÷ total closed |
| Volume | 25% | Won deals normalised against top performer |
| Speed | 20% | Avg days to close vs team median (faster = higher, capped at 1.5×) |
| Deal Value | 25% | Avg won deal value normalised against top performer |

This means a rep with a 100% win rate on 2 deals will not outscore someone closing 60 deals at 70% — volume and value matter.

**Example prompts**

```
"Show me this month's performance report"
"How did the team do in Q1 2026?"
"Give me a performance report for January 2026"
"Who had the best performance score last month?"
```

**Example output**

```
Period: 2026-01-01 → 2026-01-31

Summary
  Deals won:      42      Win rate:   58.3%
  Deals lost:     30      Revenue won: £284,750
  New deals:      118     Avg deal:    £6,779

Leaderboard
  #1 Alex Chen        Score: 74.2   Won: 12  Rate: 100%  Avg: £18,400  Speed: 8 days
     Win rate: 30/30  Volume: 18/25  Speed: 8/20  Value: 18.2/25

  #2 Jordan Mills     Score: 61.8   Won: 18  Rate: 72%   Avg: £8,200   Speed: 12 days
     Win rate: 21.6/30  Volume: 25/25  Speed: 12.3/20  Value: 3/25 (low value deals)

  #3 Sam Rivera       Score: 49.3   Won: 8   Rate: 66%   Avg: £5,100   Speed: 41 days
     Win rate: 19.8/30  Volume: 11.1/25  Speed: 6.7/20  Value: 11.8/25

  #4 Casey Park       Score: 31.1   Won: 4   Rate: 44%   Avg: £1,200   Speed: 5 days
     Win rate: 13.2/30  Volume: 5.6/25  Speed: 14.5/20  Value: 1.4/25

Won by stage: Stage 6 (38), Stage 8 (4)
```

---

### `pipedrive_loss_analysis`

Analyses lost deals to identify patterns — top loss reasons, which reps are losing most, which stages deals fall at, and high-value losses.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `period` | `daily` \| `weekly` \| `monthly` | Optional window (omit for all-time) |
| `offset` | number | Periods back from today |
| `pipeline_id` | number | Restrict to a pipeline |
| `min_value` | number | Only include deals above this value |

**Example prompts**

```
"Why are we losing deals this month?"
"Show me all-time loss reasons"
"What deals over £5,000 did we lose last quarter?"
"Which rep has the most losses and what are the reasons?"
```

**Example output**

```
Loss Analysis — March 2026

Summary
  Total lost:      34     Total lost value:  £128,440
  No reason logged: 4 (11.8%) ← data quality flag

Top Loss Reasons
  Unresponsive                  14  (41%)  £38,200
  Price vs Competitor            7  (21%)  £52,100
  Job Not Going Ahead            6  (18%)  £18,900
  Budget Changed                 4  (12%)  £14,240
  Existing Relationship          3   (9%)  £5,000

Losses by Rep
  Jordan Mills    12 losses  — mainly Unresponsive (9)
  Casey Park       9 losses  — mainly Price (5), Budget (3)
  Sam Rivera       8 losses  — mainly Job Not Going Ahead (6)
  Alex Chen        1 loss    — Duplicate Deal

High-Value Losses (top 3)
  Westfield Construction — £44,000 — "Price vs Competitor" (Casey Park)
  Hartley Group — £28,500 — "Unresponsive" (Jordan Mills)
  NovaCivil Ltd — £18,200 — "Job Not Going Ahead" (Sam Rivera)
```

---

### `pipedrive_pipeline_health`

Assesses your open pipeline for risk: stale deals, overdue close dates, missing data, and deals with no next activity scheduled.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pipeline_id` | number | Restrict to a pipeline |
| `stale_days` | number | Days without activity to flag as stale (default 30) |
| `limit` | number | Max deals returned per risk category (default 50) |

**Example prompts**

```
"How healthy is the pipeline?"
"Show me all deals that haven't been touched in 60 days"
"Which deals are past their expected close date?"
"Flag any open deals missing a value or contact"
```

**Example output**

```
Pipeline Health Report

Summary
  Total open deals:        312     Pipeline value:    £2,840,000
  Weighted value:          £1,190,000
  Stale (30+ days):        187  (60%)  ← attention needed
  Past expected close:      41  (13%)
  Missing deal value:       78  (25%)  ← forecasting risk
  No next activity:        142  (46%)
  No contact linked:        22   (7%)
  Zero activities ever:     54  (17%)

Risk: Most Stale Deals
  Northgate Retail — last activity: 94 days ago — £28,000 — Owner: Jordan Mills
  Apex Logistics — last activity: 87 days ago — £14,500 — Owner: Casey Park
  Redhill Partners — last activity: 71 days ago — £9,200 — Owner: Sam Rivera
  ... (184 more)

Risk: Past Expected Close
  Meridian Build — due 2025-11-30 — 116 days overdue — £42,000
  Creston Homes — due 2025-12-15 — 101 days overdue — £18,750

Stale Deals by Owner
  Jordan Mills: 68    Casey Park: 51    Sam Rivera: 44    Alex Chen: 24

Deals by Stage
  Stage 3: 94    Stage 4: 87    Stage 5: 61    Stage 6: 38    Stage 7: 32
```

---

### `pipedrive_activity_audit`

Audits activity logging quality across the team: deals with no activities, overdue tasks, missing call logs, and a per-rep hygiene score.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pipeline_id` | number | Restrict to a pipeline |
| `days_back` | number | Look-back window in days (default 90) |

**Example prompts**

```
"Show me the activity audit for the last 30 days"
"Which reps have overdue activities?"
"Who has the worst logging hygiene?"
"How many open deals have zero activities logged?"
```

**Example output**

```
Activity Audit — last 90 days

Open deals with no activity ever:    54
Open deals with no completed activity: 78
Overdue activities (not done, past due): 31

Overdue by Owner
  Casey Park: 14    Jordan Mills: 9    Sam Rivera: 6    Alex Chen: 2

Activity Type Breakdown (logged in period)
  Call:    312    Email:   198    Meeting: 87    Task: 44    Other: 23

Rep Hygiene Scores (higher = cleaner)
  Alex Chen      92/100  — 28 open deals, 1 no-activity, 2 overdue
  Sam Rivera     71/100  — 44 open deals, 8 no-activity, 6 overdue
  Jordan Mills   58/100  — 62 open deals, 18 no-activity, 9 overdue
  Casey Park     41/100  — 58 open deals, 27 no-activity, 14 overdue  ← needs attention
```

---

### `pipedrive_opportunities_report`

Surfaces high-potential open deals: large deals close to their expected close date, recently opened large deals, and deals that have been open a long time with no movement.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pipeline_id` | number | Restrict to a pipeline |
| `min_value` | number | Minimum deal value to include |
| `days_to_close` | number | Flag deals closing within N days (default 30) |
| `limit` | number | Max deals per category (default 20) |

**Example prompts**

```
"What are our biggest opportunities right now?"
"Show me deals over £10,000 closing in the next 2 weeks"
"Which large deals have been sitting open the longest?"
```

**Example output**

```
Opportunities Report

Closing Soon (next 30 days, value > £0)
  Apex Logistics — £84,000 — due 2026-04-08 — Stage 5 — Jordan Mills
  Fenwick Development — £41,500 — due 2026-04-14 — Stage 6 — Alex Chen
  Highfields Group — £28,000 — due 2026-04-22 — Stage 4 — Sam Rivera

High-Value Recently Opened (last 30 days)
  Carrington Estates — £120,000 — opened 2026-03-18 — Stage 2 — Alex Chen
  Bluestone FM — £67,500 — opened 2026-03-24 — Stage 3 — Jordan Mills

Long-Running Large Deals (open > 90 days)
  NovaCivil Ltd — £95,000 — open 247 days — last activity: 38 days ago — Casey Park
  Harland Group — £52,000 — open 184 days — last activity: 71 days ago — Jordan Mills
```

---

### `pipedrive_comparative_report`

Compares two time periods side-by-side: month-over-month, quarter-over-quarter, or any custom date range.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `period` | `daily` \| `weekly` \| `monthly` | Period unit |
| `pipeline_id` | number | Restrict to a pipeline |

**Example prompts**

```
"Compare this month to last month"
"How does Q1 2026 compare to Q4 2025?"
"Is the team improving or declining?"
```

**Example output**

```
Comparative Report — Monthly

                        February 2026    March 2026     Change
  Deals won                  44              75         +70.5% ▲
  Deals lost                 43              26         -39.5% ▲
  Win rate                 50.6%           74.3%       +23.7pp ▲
  Revenue won            £436,509        £277,513       -36.4% ▼
  Revenue lost           £378,595         £53,762       -85.8% ▲
  New deals opened           143             139         -2.8%
  Avg won deal size        £9,921          £3,700        -62.7% ▼

Interpretation
  Win rate improved sharply but revenue fell — the team is closing more deals
  at a lower average value. Consider whether deal qualification criteria have
  changed or if high-value opportunities are being deprioritised.
```

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

[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

Copyright (c) 2026 Gareth Wright

- **Free to use, copy, modify, and distribute** — but derivatives must remain open source under the same license.
- **Non-commercial only** — you may not use this software or any derivative for commercial purposes.
- **Attribution required** — credit the original author in any distribution.
