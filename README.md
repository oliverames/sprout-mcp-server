# Sprout Social MCP Server

A [Model Context Protocol](https://modelcontextprotocol.io/) server that exposes the [Sprout Social API](https://developers.sproutsocial.com/) as tools for LLMs. Enables social media analytics, inbox management, listening insights, content publishing (drafts), and case management through 17 tools.

## Tools

| Domain | Tools | Description |
|--------|-------|-------------|
| **Metadata** | 8 | List profiles, groups, tags, users, teams, queues, topics, customers |
| **Analytics** | 2 | Profile-level daily metrics, post-level metrics and content |
| **Messages** | 1 | Inbox messages with filtering, tagging, and cursor pagination |
| **Listening** | 2 | Topic messages and aggregated metrics (sentiment, volume, etc.) |
| **Publishing** | 3 | Create draft posts, upload media, retrieve posts |
| **Cases** | 1 | Support/feedback cases with status, priority, and assignment filters |

## Quick Start

### Prerequisites

- Node.js >= 18
- A Sprout Social account with API access enabled

### Install

```bash
git clone https://github.com/oliverames/sprout-mcp-server.git
cd sprout-mcp-server
npm install
npm run build
```

### Authentication

The server supports two authentication methods. Set environment variables for one:

**Option 1: API Token** (simplest)

Generate a token in Sprout Social at *Settings > Global Features > API Page > API Token Management*.

```bash
export SPROUT_API_TOKEN=your-token-here
```

**Option 2: OAuth M2M** (production)

```bash
export SPROUT_CLIENT_ID=your-client-id
export SPROUT_CLIENT_SECRET=your-client-secret
export SPROUT_ORG_ID=your-org-id
```

### Configure with Claude Code

Add to your Claude Code settings (`.claude/settings.json`):

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

Or if running from a local clone:

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

### Configure with other MCP clients

The server uses stdio transport. Point any MCP-compatible client at `node dist/index.js` with the appropriate env vars.

## Multi-Customer Support

On startup, the server auto-discovers your customer ID via the API. If your token has access to multiple customers, set `SPROUT_CUSTOMER_ID` to select one. Every tool also accepts an optional `customer_id` parameter to override the default per-call.

## Response Formats

All tools accept a `response_format` parameter:

- `"markdown"` (default) — human-readable tables, lists, and summaries
- `"json"` — structured data for programmatic use

## Development

```bash
npm install          # install dependencies
npm run build        # compile TypeScript
npm test             # run tests
npm run test:watch   # run tests in watch mode
npm run dev          # compile in watch mode
npm start            # run the server
```

### Project Structure

```
src/
├── index.ts              # Entry point: auth, customer discovery, tool registration
├── constants.ts          # API URLs, rate limits, validation limits
├── types.ts              # Shared TypeScript interfaces
├── services/
│   ├── auth.ts           # API token and OAuth M2M token management
│   ├── api-client.ts     # Axios wrapper with retries, rate limiting, error handling
│   ├── filter-builder.ts # Translates typed params → Sprout filter DSL
│   └── formatter.ts      # Markdown/JSON response formatting and truncation
├── schemas/
│   └── common.ts         # Shared Zod schemas for tool parameters
└── tools/
    ├── metadata.ts       # 8 tools
    ├── analytics.ts      # 2 tools
    ├── messages.ts       # 1 tool
    ├── listening.ts      # 2 tools
    ├── publishing.ts     # 3 tools
    └── cases.ts          # 1 tool
```

## API Rate Limits

The Sprout Social API allows 60 requests per minute and 250,000 per month. The server includes a sliding-window rate limiter that throttles requests before hitting the limit, and retries with exponential backoff on 429 responses.

## Known Limitations

- **Publishing is draft-only.** Posts are created with `is_draft: true` and must be approved in Sprout's UI.
- **Cases date range max 1 week.** The API enforces this; the server validates and returns a clear error.
- **Analytics 10K result cap.** For datasets exceeding 10,000 results, use guid-cursor pagination.
- **Media expires in 24 hours.** Upload media close to when you create the post.
- **X (Twitter) data requires a separate EULA** accepted in Sprout's UI.

## License

Private — not licensed for redistribution.
