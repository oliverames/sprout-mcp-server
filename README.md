<p align="center">
  <img src="assets/icon.png" width="80" height="80" alt="Sprout Social">
</p>

<h1 align="center">Sprout Social MCP Server</h1>

<p align="center">
  <strong>Full Sprout Social API coverage for AI-powered social media management</strong>
</p>

<p align="center">
  <code>20 tools</code> &bull;
  <code>6 domains</code> &bull;
  <code>100% API coverage</code> &bull;
  <code>11 networks</code>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@oliverames/sprout-mcp-server"><img src="https://img.shields.io/npm/v/%40oliverames%2Fsprout-mcp-server?style=flat-square&color=f5a542" alt="npm"></a>
  <a href="https://github.com/oliverames/sprout-mcp-server/releases/tag/v1.1.2"><img src="https://img.shields.io/github/v/release/oliverames/sprout-mcp-server?style=flat-square&color=f5a542&label=MCPB" alt="MCPB release"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-f5a542?style=flat-square" alt="License"></a>
  <a href="https://www.buymeacoffee.com/oliverames"><img src="https://img.shields.io/badge/Buy_Me_a_Coffee-support-f5a542?style=flat-square&logo=buy-me-a-coffee&logoColor=white" alt="Buy Me a Coffee"></a>
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> &bull;
  <a href="#install-with-mcpb">MCPB Download</a> &bull;
  <a href="#20-tools-across-6-domains">Tools</a> &bull;
  <a href="#configuration">Configuration</a> &bull;
  <a href="#api-coverage">API Coverage</a>
</p>

---

A Model Context Protocol server that gives AI assistants complete access to the Sprout Social API — analytics, inbox messages, social listening, content publishing, media uploads, and support cases. Works with Claude, GPT, or any MCP-compatible client.

## Why This Exists

Sprout Social is the command center for social media teams managing multiple brands across multiple networks. But its power lives behind a dashboard that requires manual interaction for every query, every export, every draft. This server turns that dashboard into a conversation — ask your AI assistant to pull analytics, draft posts, search listening data, or triage support cases without switching tabs.

Every endpoint in the Sprout Social API is covered. No gaps, no workarounds.

## What You Can Do

Ask your AI assistant to work with Sprout Social directly:

- **"How did our Instagram perform last month?"** — Pull profile-level impressions, engagements, and follower growth across any date range
- **"Show me our top posts on LinkedIn this quarter"** — Query post-level analytics sorted by engagement metrics
- **"What are people saying about our brand?"** — Search social listening topics for sentiment, volume, and trending themes
- **"Draft a post announcing our product launch across all channels"** — Create draft posts with media, scheduling, and tags
- **"Are there any open support cases assigned to me?"** — Filter cases by status, priority, assignee, and queue

---

## 20 Tools Across 6 Domains

### Metadata — 8 tools

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

### Analytics — 2 tools

Query performance metrics across profiles and individual posts. Supports all major networks: Instagram, Facebook, X (Twitter), LinkedIn, YouTube, Pinterest, TikTok, Threads, and Bluesky.

| Tool | Description |
|------|-------------|
| `sprout_get_profile_analytics` | Aggregate profile metrics (impressions, engagements, followers) by day over a date range |
| `sprout_get_post_analytics` | Post-level metrics and content fields with flexible sorting, timezone support, and cursor-based pagination for 10K+ results via `guid_cursor` |

### Messages — 1 tool

| Tool | Description |
|------|-------------|
| `sprout_get_messages` | Query inbox messages with filters for profiles, groups, date ranges, post types, tags, language, sender GUIDs, and action timestamps. Cursor-based pagination for large result sets |

### Listening — 2 tools

| Tool | Description |
|------|-------------|
| `sprout_get_listening_messages` | Retrieve individual listening messages for a topic with filters for sentiment, network, text search, language, location, themes, media presence, and distribution type. Supports requesting metrics alongside fields |
| `sprout_get_listening_metrics` | Aggregated metrics for a listening topic with filters for network, sentiment, text search, language, location, themes, and metric comparisons. Supports dimensions for trend analysis (by day, sentiment, network, etc.) |

### Publishing — 6 tools

Create draft content and manage media uploads of any size.

| Tool | Description |
|------|-------------|
| `sprout_create_draft_post` | Create a draft post for one or more profiles with optional text, media, scheduling, and tags |
| `sprout_upload_media` | Upload media from a URL (images, video up to 50MB). Returns a `media_id` for post creation |
| `sprout_get_post` | Retrieve a publishing post by ID |
| `sprout_start_multipart_upload` | Start a multipart upload for large media files (>50MB) or URL downloads |
| `sprout_continue_multipart_upload` | Upload subsequent 5MB parts of a multipart media file |
| `sprout_complete_multipart_upload` | Finalize a multipart upload — automatically polls until processing completes |

### Cases — 1 tool

| Tool | Description |
|------|-------------|
| `sprout_get_cases` | Query support and feedback cases with filters for status, priority, type, queue, assignee, assigner, creator, related messages, tags (include/exclude), and multiple date ranges via `additional_filters` |

---

## Quick Start

### Install with MCPB

For Claude Desktop and other MCPB-compatible clients, download the local bundle from the [v1.1.2 release](https://github.com/oliverames/sprout-mcp-server/releases/tag/v1.1.2):

[Download `sprout-mcp-server-1.1.2.mcpb`](https://github.com/oliverames/sprout-mcp-server/releases/download/v1.1.2/sprout-mcp-server-1.1.2.mcpb)

The bundle includes the Sprout Social favicon, production runtime dependencies, and setup prompts for API token or OAuth machine-to-machine credentials.

### Prerequisites

- **Node.js 18+**
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
npm install && npm run build
```

---

## Authentication

The server supports two authentication methods. Configure one via environment variables.

### Option 1: API Token

The simplest option. Generate a token in Sprout Social under **Settings → Global Features → API Page → API Token Management**.

```bash
export SPROUT_API_TOKEN=your-token-here
```

### Option 2: OAuth 2.0 Machine-to-Machine

Recommended for production and automated workflows. Uses the client credentials grant.

```bash
export SPROUT_CLIENT_ID=your-client-id
export SPROUT_CLIENT_SECRET=your-client-secret
export SPROUT_ORG_ID=your-org-id
```

The server handles token acquisition and refresh automatically.

### 1Password Integration

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

### Claude Desktop / Claude Code

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

### Any MCP Client

The server communicates over **stdio transport**. Point any MCP-compatible client at `node dist/index.js` (or `npx @oliverames/sprout-mcp-server`) with the appropriate environment variables.

---

## Multi-Customer Support

On startup, the server auto-discovers your customer ID from the API. If your token has access to multiple customers, specify which one:

```bash
export SPROUT_CUSTOMER_ID=123456
```

Every tool also accepts an optional `customer_id` parameter to override the default per-request — useful for agencies managing multiple brands.

---

## Response Formats

All tools accept a `response_format` parameter:

| Format | Description |
|--------|-------------|
| `"markdown"` | Human-readable tables, lists, and summaries (default) |
| `"json"` | Raw structured data for programmatic use |

---

## Supported Networks

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
| Bluesky | ✅ | ✅ | — |
| Google Business | ✅ | ✅ | ✅ |
| WhatsApp | — | ✅ | — |

---

## Built-In Reliability

The server handles the operational details so you don't have to:

- **Rate limiting** — Sliding-window throttle stays under Sprout's 60 req/min limit (soft cap at 55)
- **Automatic retries** — Exponential backoff on 429, 500, 503, and 504 responses (up to 3 retries)
- **202 polling** — Media uploads and multipart completions automatically poll until processing finishes
- **Input validation** — Date ranges, profile limits, and required fields validated before hitting the API
- **Graceful startup** — Starts in unauthenticated mode with setup instructions if no credentials are found
- **Response truncation** — Large responses are intelligently truncated to stay within LLM context limits

---

## API Coverage

This server provides **100% coverage** of the Sprout Social Public API (v1).

| Domain | Endpoints | Tools | Status |
|--------|-----------|-------|--------|
| Customer Metadata | 8 | 8 | ✅ Complete |
| Analytics | 2 | 2 | ✅ Complete |
| Messages | 1 | 1 | ✅ Complete |
| Listening | 2 | 2 | ✅ Complete |
| Publishing | 2 | 2 | ✅ Complete |
| Media Upload (Simple) | 1 | 1 | ✅ Complete |
| Media Upload (Multipart) | 3 | 3 | ✅ Complete |
| Cases | 1 | 1 | ✅ Complete |
| **Total** | **20** | **20** | **✅ Complete** |

---

## Known Limitations

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
npm install          # Install dependencies
npm run build        # Compile TypeScript
npm test             # Run test suite (119 tests)
npm run test:watch   # Watch mode
npm run dev          # TypeScript watch mode
npm start            # Start the server
```

### Project Structure

```
src/
├── index.ts              # Entry point — auth, customer discovery, tool registration
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
    ├── metadata.ts       # 8 tools — account structure discovery
    ├── analytics.ts      # 2 tools — profile + post performance
    ├── messages.ts       # 1 tool  — inbox message queries
    ├── listening.ts      # 2 tools — topic messages + aggregated metrics
    ├── publishing.ts     # 6 tools — drafts, media upload (simple + multipart)
    └── cases.ts          # 1 tool  — support case management
```

### Architecture

All tool handlers are **pure functions** with the signature:

```typescript
handler(client: ApiClient, customerId: number, params: T) → Promise<ToolResponse>
```

This makes every handler independently testable with a mock `ApiClient` — no server bootstrap required.

The **filter builder** translates friendly parameters into Sprout's custom filter DSL (`field.op(values)`), keeping the DSL syntax internal to the server.

---

## License

MIT

---

<p align="center">
  Built with the <a href="https://modelcontextprotocol.io">Model Context Protocol</a> · Powered by the <a href="https://developers.sproutsocial.com/">Sprout Social API</a>
</p>

---

<p align="center">
  <a href="https://www.buymeacoffee.com/oliverames">
    <img src="https://img.shields.io/badge/Buy_Me_a_Coffee-support-f5a542?style=for-the-badge&logo=buy-me-a-coffee&logoColor=white" alt="Buy Me a Coffee">
  </a>
</p>

<p align="center">
  <sub>
    Built by <a href="https://ames.consulting">Oliver Ames</a> in Vermont
    &bull; <a href="https://github.com/oliverames">GitHub</a>
    &bull; <a href="https://linkedin.com/in/oliverames">LinkedIn</a>
    &bull; <a href="https://bsky.app/profile/oliverames.bsky.social">Bluesky</a>
  </sub>
</p>
