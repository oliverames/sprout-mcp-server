<p align="center">
  <img src="assets/icon.png" width="80" height="80" alt="Sprout Social">
</p>

<h1 align="center">Sprout Social MCP Server</h1>

<p align="center">
  <strong>Sprout Social analytics, publishing, listening, messages, and cases through MCP</strong>
</p>

<p align="center">
  <code>28 tools</code> &bull;
  <code>6 API domains</code> &bull;
  <code>11 networks</code>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@oliverames/sprout-mcp-server"><img src="https://img.shields.io/npm/v/%40oliverames%2Fsprout-mcp-server?style=flat-square&color=f5a542" alt="npm"></a>
  <a href="https://github.com/oliverames/sprout-mcp-server/releases"><img src="https://img.shields.io/github/v/release/oliverames/sprout-mcp-server?style=flat-square&color=f5a542" alt="GitHub release"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-f5a542?style=flat-square" alt="License"></a>
  <a href="https://github.com/oliverames"><img src="https://img.shields.io/badge/Repository-source-0969da?style=flat-square&logo=github&logoColor=white" alt="Repository"></a>
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> &bull;
  <a href="#28-tools-across-6-api-domains">Tools</a> &bull;
  <a href="#configuration">Configuration</a> &bull;
  <a href="#tool-coverage">Tool Coverage</a>
</p>

---

A Model Context Protocol server for Sprout Social analytics, inbox messages, social listening, content publishing, media uploads, and support cases. It works with Claude, GPT, and other MCP clients.

## Why this exists

Sprout Social's API can answer questions and create drafts without a trip through the dashboard for each operation. This server makes those calls available to MCP clients and adds a few workflows for common reporting, campaign, and case-triage jobs.

## What you can do

Ask your AI assistant to work with Sprout Social directly:

- "How did our Instagram perform last month?" Pull profile impressions, engagements, and follower growth for the date range.
- "Show me our top posts on LinkedIn this quarter." Query post analytics and sort by the metrics you choose.
- "What are people saying about our brand?" Search listening topics by sentiment, network, language, or text.
- "Draft a post announcing our product launch across all channels." Create draft posts with media, scheduling, and tags.
- "Are there any open support cases assigned to me?" Filter cases by status, priority, assignee, and queue.

---

## 28 tools across 6 API domains

### Authentication: 1 tool

| Tool | Description |
|------|-------------|
| `sprout_auth_status` | Check whether authentication is configured and get setup instructions |

### Metadata: 8 tools

Discover and enumerate your Sprout Social account structure.

| Tool | Description |
|------|-------------|
| `sprout_list_customers` | List all customer accounts accessible to your token |
| `sprout_list_profiles` | List connected social profiles (Instagram, Facebook, X, LinkedIn, TikTok, etc.) |
| `sprout_list_groups` | List profile groups for organizing and routing |
| `sprout_list_tags` | List conversation tags (labels and campaigns) |
| `sprout_list_users` | List team members with roles and permissions |
| `sprout_list_teams` | List teams within your organization |
| `sprout_list_queues` | List case management queues |
| `sprout_list_topics` | List social listening topics being monitored |

### Analytics: 4 tools

Query performance metrics across profiles and individual posts. Supports all major networks: Instagram, Facebook, X (Twitter), LinkedIn, YouTube, Pinterest, TikTok, Threads, and Bluesky.

| Tool | Description |
|------|-------------|
| `sprout_get_profile_analytics` | Aggregate profile metrics (impressions, engagements, followers) by day over a date range |
| `sprout_get_post_analytics` | Post-level metrics and content fields with flexible sorting, timezone support, and cursor-based pagination for 10K+ results via `guid_cursor` |
| `sprout_compile_performance_report` | Combine profile growth and top-post metrics in one report |
| `sprout_compare_profiles` | Compare selected profiles across the same metrics and date range |

### Messages: 2 tools

| Tool | Description |
|------|-------------|
| `sprout_get_messages` | Query inbox messages with filters for profiles, groups, date ranges, post types, tags, language, sender GUIDs, and action timestamps. Cursor-based pagination for large result sets |
| `sprout_get_all_messages` | Follow message cursors and return a combined result set |

### Listening: 3 tools

| Tool | Description |
|------|-------------|
| `sprout_get_listening_messages` | Retrieve individual listening messages for a topic with filters for sentiment, network, text search, language, location, themes, media presence, and distribution type. Supports requesting metrics alongside fields |
| `sprout_get_listening_metrics` | Aggregated metrics for a listening topic with filters for network, sentiment, text search, language, location, themes, and metric comparisons. Supports dimensions for trend analysis (by day, sentiment, network, etc.) |
| `sprout_analyze_listening_trends` | Compile daily volume, sentiment, and network distribution for a topic |

### Publishing: 8 tools

Create draft content and manage media uploads of any size.

| Tool | Description |
|------|-------------|
| `sprout_create_draft_post` | Create a draft post for one or more profiles with optional text, media, scheduling, and tags |
| `sprout_upload_media` | Upload media from a URL (images, video up to 50MB). Returns a `media_id` for post creation |
| `sprout_get_post` | Retrieve a publishing post by ID |
| `sprout_start_multipart_upload` | Start a multipart upload for large media files (>50MB) or URL downloads |
| `sprout_continue_multipart_upload` | Upload subsequent 5MB parts of a multipart media file |
| `sprout_complete_multipart_upload` | Finalize a multipart upload and poll until processing completes |
| `sprout_draft_campaign` | Create tailored drafts for several profiles under one campaign |
| `sprout_schedule_campaign_queue` | Schedule a sequence of draft posts at a fixed interval |

### Cases: 2 tools

| Tool | Description |
|------|-------------|
| `sprout_get_cases` | Query support and feedback cases with filters for status, priority, type, queue, assignee, assigner, creator, related messages, tags (include/exclude), and multiple date ranges via `additional_filters` |
| `sprout_triage_support_cases` | Rank active cases that may need attention, including unassigned and older high-priority cases |

---

## Quick start

### Prerequisites

- **Node.js 20.19+**
- A **Sprout Social** account with API access enabled ([request access](https://developers.sproutsocial.com/))

### Install from npm

```bash
npm install -g @oliverames/sprout-mcp-server
```

Or run directly with `npx`:

```bash
npx @oliverames/sprout-mcp-server
```

### Install from source

```bash
git clone https://github.com/oliverames/sprout-mcp-server.git
cd sprout-mcp-server
npm ci && npm run build
```

---

## Authentication

There are two ways to connect. Pick the one that fits how the server runs.

### Option A: token or machine auth

Use this when the server runs headless (CI, a scheduled job, a shared host).

**A1. API token (simplest).** Generate a token in Sprout under **Settings → Global Features → API Page → API Token Management**.

```bash
export SPROUT_API_TOKEN=your-token-here
```

**A2. OAuth 2.0 machine-to-machine.** Client-credentials grant; the server acquires and refreshes the token automatically.

```bash
export SPROUT_CLIENT_ID=your-client-id
export SPROUT_CLIENT_SECRET=your-client-secret
export SPROUT_ORG_ID=your-org-id
```

### Option B: sign in with Sprout

Use this to connect your own Sprout account. You sign in at Sprout's real login page in the browser, so the server never sees your password and your normal 2FA/SSO applies. The interactive flow uses **PKCE**, so it needs only a client ID, with no client secret to configure or store.

1. Set your OAuth client ID (generate it under **Settings → Global Features → API → OAuth Client Management**):
   ```bash
   export SPROUT_CLIENT_ID=your-client-id
   ```
2. Run the login command and sign in when the browser opens:
   ```bash
   npm run login
   ```

The CLI starts a local callback server, opens your browser, and on success saves your session to `~/.sprout-mcp-auth.json`. After that, run the server with no further configuration:

```bash
npm start
```

The server loads your saved session and refreshes tokens automatically in the background.

### 1Password integration

If credentials are not set in the environment, the server automatically attempts to resolve them from [1Password CLI](https://developer.1password.com/docs/cli/):

| Variable | 1Password Reference |
|----------|-------------------|
| `SPROUT_API_TOKEN` | `op://Development/Sprout API Token/credential` |
| `SPROUT_CLIENT_ID` | `op://Development/Sprout OAuth Client/client_id` |
| `SPROUT_CLIENT_SECRET` | `op://Development/Sprout OAuth Client/client_secret` |
| `SPROUT_ORG_ID` | `op://Development/Sprout OAuth Client/org_id` |

This means you can skip setting env vars entirely if you have `op` installed and a service account or session active. The fallback adds ~1-2s to startup and is silently skipped if 1Password is unavailable.

---

## Configuration

### Claude Desktop and Claude Code

Add to your MCP settings (e.g., `.claude/settings.json`):

```json
{
  "mcpServers": {
    "sprout": {
      "command": "npx",
      "args": ["@oliverames/sprout-mcp-server"],
      "env": {
        "SPROUT_API_TOKEN": "your-token-here"
      }
    }
  }
}
```

### From a local clone

```json
{
  "mcpServers": {
    "sprout": {
      "command": "node",
      "args": ["/path/to/sprout-mcp-server/dist/index.js"],
      "env": {
        "SPROUT_API_TOKEN": "your-token-here"
      }
    }
  }
}
```

### Any MCP client

The server communicates over **stdio transport**. Point any MCP-compatible client at `node dist/index.js` (or `npx @oliverames/sprout-mcp-server`) with the appropriate environment variables.

---

## Multi-customer support

On startup, the server auto-discovers your customer ID from the API. If your token has access to multiple customers, specify which one:

```bash
export SPROUT_CUSTOMER_ID=123456
```

Every tool also accepts an optional `customer_id` parameter to override the default for a request, which is useful for agencies managing multiple brands.

---

## Response formats

All tools accept a `response_format` parameter:

| Format | Description |
|--------|-------------|
| `"markdown"` | Human-readable tables, lists, and summaries (default) |
| `"json"` | Raw structured data for programmatic use |

---

## Supported networks

Analytics, messages, and publishing support all networks connected in your Sprout Social account:

| Network | Analytics | Messages | Publishing |
|---------|:---------:|:--------:|:----------:|
| Instagram (Business & Creator) | ✅ | ✅ | ✅ |
| Facebook Pages | ✅ | ✅ | ✅ |
| X (Twitter) | ✅ | ✅ | ✅ |
| LinkedIn (Pages & Personal) | ✅ | ✅ | ✅ |
| TikTok | ✅ | ✅ | ✅ |
| YouTube | ✅ | ✅ | ✅ |
| Pinterest | ✅ | ✅ | ✅ |
| Threads | ✅ | ✅ | ✅ |
| Bluesky | ✅ | ✅ | N/A |
| Google Business | ✅ | ✅ | ✅ |
| WhatsApp | N/A | ✅ | N/A |

---

## Built-in reliability

The server handles the operational details so you don't have to:

- A sliding-window throttle stays under Sprout's 60 request-per-minute limit, with a soft cap at 55.
- Requests retry with exponential backoff after 429, 500, 503, and 504 responses.
- Media uploads and multipart completions poll automatically after a 202 response.
- Zod validates dates, profile limits, and required fields before a request reaches Sprout.
- The server starts without credentials and keeps its tool catalog visible with setup instructions.
- Large responses are truncated before they overwhelm the client's context window.

---

## Tool coverage

The server maps 20 Sprout API endpoints to direct tools and adds seven workflow tools. The authentication status tool brings the protocol-visible catalog to 28. An integration test lists the tools through MCP and checks every name.

| Domain | Supported endpoints | Tools |
|--------|--------------------:|------:|
| Customer metadata | 8 | 8 |
| Analytics | 2 | 4 |
| Messages | 1 | 2 |
| Listening | 2 | 3 |
| Publishing and media | 6 | 8 |
| Cases | 1 | 2 |
| Authentication status | N/A | 1 |
| **Total** | **20** | **28** |

---

## Known limitations

These are Sprout Social API constraints, not server limitations:

| Limitation | Detail |
|------------|--------|
| **Draft-only publishing** | Posts are created with `is_draft: true`. Approve and publish in the Sprout UI. |
| **Cases: 7-day max range** | The cases endpoint enforces a maximum 7-day date range per request. |
| **Analytics: 10K result cap** | Profile analytics caps at 10,000 results. Use pagination for larger datasets. |
| **Media expires in 24 hours** | Uploaded media must be attached to a post within 24 hours. |
| **X (Twitter) data** | Requires accepting a separate EULA in the Sprout Social UI. |
| **Simple upload: 50MB limit** | Files over 50MB must use the multipart upload flow. |

---

## Development

```bash
npm ci               # Install locked dependencies
npm run build        # Compile TypeScript
npm test             # Run the test suite
npm run check        # Build, test, audit, and inspect the npm package
npm run test:watch   # Watch mode
npm run dev          # TypeScript watch mode
npm start            # Start the server
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for pull request guidance, [SECURITY.md](SECURITY.md) for private vulnerability reporting, and [RELEASING.md](RELEASING.md) for the release checklist.

### Project structure

```
src/
├── index.ts              # Entry point: auth, customer discovery, tool registration
├── constants.ts          # API URLs, rate limits, validation constraints
├── types.ts              # Shared TypeScript interfaces
├── schemas/
│   └── common.ts         # Reusable Zod schemas for tool input validation
├── services/
│   ├── auth.ts           # API token + OAuth M2M token management
│   ├── api-client.ts     # HTTP client with retries, rate limiting, 202 polling
│   ├── filter-builder.ts # Translates typed params → Sprout's filter DSL (eq, neq, in, gt, match, exists)
│   └── formatter.ts      # Markdown/JSON formatting + truncation
└── tools/
    ├── catalog.ts        # Catalog inventory and registration
    ├── metadata.ts       # 8 account structure tools
    ├── analytics.ts      # 4 profile, post, and reporting tools
    ├── messages.ts       # 2 inbox message tools
    ├── listening.ts      # 3 topic and trend tools
    ├── publishing.ts     # 8 draft and media tools
    └── cases.ts          # 2 case management tools
```

### Architecture

All tool handlers are **pure functions** with the signature:

```typescript
handler(client: ApiClient, customerId: number, params: T) → Promise<ToolResponse>
```

This makes every handler independently testable with a mock `ApiClient`. The catalog test uses an in-memory MCP transport to check the list clients receive.

The **filter builder** translates friendly parameters into Sprout's custom filter DSL (`field.op(values)`), keeping the DSL syntax internal to the server.

---

## License

MIT

Sprout Social is a trademark of Sprout Social, Inc. This independent project is not affiliated with or endorsed by Sprout Social, Inc.

---

<p align="center">
  Built with the <a href="https://modelcontextprotocol.io">Model Context Protocol</a> · Powered by the <a href="https://developers.sproutsocial.com/">Sprout Social API</a>
</p>

---

<p align="center">
  <a href="https://github.com/oliverames">
    <img src="https://img.shields.io/badge/Repository-source-0969da?style=for-the-badge&logo=github&logoColor=white" alt="Repository">
  </a>
</p>

<p align="center">
  <sub>
    Maintained on GitHub
    &bull; <a href="https://github.com/oliverames">GitHub</a>
    &bull; <a href="https://github.com/oliverames">LinkedIn</a>
    &bull; <a href="https://github.com/oliverames">Bluesky</a>
  </sub>
</p>
