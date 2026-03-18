# Sprout Social MCP Server — Design Spec

## Overview

A TypeScript MCP server that exposes Sprout Social's API as tools for LLMs. Enables social media analytics, inbox management, listening insights, content publishing (drafts), and case management through 17 tools organized across 6 domains.

**Transport:** stdio (local use with Claude Code, Cursor, etc.)
**Language:** TypeScript with Zod schemas
**SDK:** `@modelcontextprotocol/sdk` with `server.registerTool()` API

---

## Authentication

Two methods, selected by which environment variables are present:

### API Token (simple path)
- Env var: `SPROUT_API_TOKEN`
- Sent as `Authorization: Bearer <token>` on every request.

### OAuth M2M (production path)
- Env vars: `SPROUT_CLIENT_ID`, `SPROUT_CLIENT_SECRET`, `SPROUT_ORG_ID`
- Token endpoint: `https://identity.sproutsocial.com/oauth2/84e39c75-d770-45d9-90a9-7b79e3037d2c/v1/token`
- Grant type: `client_credentials`
- Scope parameter: `scope=<SPROUT_ORG_ID value>` (the actual org ID is sent as the scope value; API docs show `scope=organization_id` which appears to be a placeholder — implementation should send the real org ID)
- Content type: `application/x-www-form-urlencoded`
- Returns a JWT access token. The server caches it and refreshes before expiry.

**Startup order:**
1. Check for `SPROUT_API_TOKEN`. If present, use it.
2. Else check for `SPROUT_CLIENT_ID` + `SPROUT_CLIENT_SECRET` + `SPROUT_ORG_ID`. If all present, perform OAuth token exchange.
3. Else fail with a clear error listing both options.

---

## Customer ID Resolution

Every Sprout API path includes a `customer_id` segment: `/v1/<customer_id>/...`

**Startup behavior:**
1. Call `GET /v1/metadata/client` to list available customers.
2. If exactly one customer, use it as the default.
3. If multiple customers, check `SPROUT_CUSTOMER_ID` env var. If set, validate it against the list. If not set, fail with a message listing available customer IDs and names.

**Per-tool override:** Every tool accepts an optional `customer_id` parameter. If provided, it overrides the default for that call. This supports multi-customer use cases without complicating single-customer setups.

---

## Project Structure

```
sprout-mcp-server/
├── package.json
├── tsconfig.json
├── .env.example
├── src/
│   ├── index.ts              # Entry point: server init, auth setup, transport
│   ├── constants.ts          # Base URL, rate limits, character limit, token endpoint
│   ├── types.ts              # Shared TypeScript interfaces (API responses, pagination)
│   ├── services/
│   │   ├── api-client.ts     # Axios wrapper: auth injection, retries, rate-limit handling
│   │   ├── auth.ts           # Token management: static token or OAuth M2M with refresh
│   │   └── filter-builder.ts # Typed params → Sprout filter DSL translation
│   ├── schemas/
│   │   └── common.ts         # Shared Zod schemas: date ranges, pagination, response_format
│   └── tools/
│       ├── metadata.ts       # 8 tools
│       ├── analytics.ts      # 2 tools
│       ├── messages.ts       # 1 tool
│       ├── listening.ts      # 2 tools
│       ├── publishing.ts     # 3 tools
│       └── cases.ts          # 1 tool
└── dist/                     # Compiled output (entry: dist/index.js)
```

---

## Tool Inventory (17 tools)

### Metadata Domain (8 tools)

All are GET requests with no request body. All `readOnlyHint: true`.

| Tool Name | Endpoint | Description |
|-----------|----------|-------------|
| `sprout_list_customers` | `GET /v1/metadata/client` | List customer IDs and names accessible to your token |
| `sprout_list_profiles` | `GET /v1/<cid>/metadata/customer` | List social profiles with network type, native name, group membership |
| `sprout_list_groups` | `GET /v1/<cid>/metadata/customer/groups` | List profile groups |
| `sprout_list_tags` | `GET /v1/<cid>/metadata/customer/tags` | List message tags (labels + campaigns, active + archived) |
| `sprout_list_users` | `GET /v1/<cid>/metadata/customer/users` | List active users (id, name, email) |
| `sprout_list_teams` | `GET /v1/<cid>/metadata/customer/teams` | List teams (id, name, description) |
| `sprout_list_queues` | `GET /v1/<cid>/metadata/customer/queues` | List case queues with associated teams |
| `sprout_list_topics` | `GET /v1/<cid>/metadata/customer/topics` | List listening topics with themes and availability windows |

**Parameters (all metadata tools):**
- `customer_id?` (optional override)
- `response_format?` ("markdown" | "json", default "markdown")

### Analytics Domain (2 tools)

Both are POST requests. Both `readOnlyHint: true`.

#### `sprout_get_profile_analytics`

Retrieves daily profile-level metrics (followers, impressions, engagement rates).

**Parameters:**
- `profile_ids: number[]` (required, max 100)
- `start_date: string` (required, ISO date YYYY-MM-DD)
- `end_date: string` (required, ISO date YYYY-MM-DD, max 1 year range)
- `metrics: string[]` (required, e.g. `["impressions", "reactions", "lifetime_snapshot.followers_count"]`)
- `page?: number` (default 1)
- `limit?: number` (default 1000)
- `customer_id?`
- `response_format?`

**Filter construction:**
- `customer_profile_id.eq(<profile_ids>)`
- `reporting_period.in(<start_date>..<end_date>)` (two dots = end-inclusive, so `end_date: "2024-01-31"` includes Jan 31st — more intuitive for daily metrics)

Note: The API supports both `..` (inclusive) and `...` (exclusive). We use inclusive here for UX; post/message/listening tools use exclusive (`...`) for `created_time` which follows the standard half-open interval convention.

**Pagination:** Index-based. Response includes `current_page` and `total_pages`.

#### `sprout_get_post_analytics`

Retrieves post-level metrics and content fields.

**Parameters:**
- `profile_ids: number[]` (required, max 100)
- `start_date: string` (required, ISO date)
- `end_date: string` (required, ISO date)
- `metrics?: string[]` (e.g. `["lifetime.impressions", "lifetime.likes"]`)
- `fields?: string[]` (e.g. `["text", "created_time", "perma_link"]`)
- `sort_by?: "created_time"` (default "created_time" — only supported sort field for posts)
- `sort_order?: "asc" | "desc"` (default "desc")
- `timezone?: string` (IANA timezone, e.g. "America/Chicago" — used for date interpretation)
- `page?: number` (default 1)
- `limit?: number` (default 50)
- `customer_id?`
- `response_format?`

**Filter construction:**
- `customer_profile_id.eq(<profile_ids>)`
- `created_time.in(<start_date>...<end_date>)` (end-exclusive)

### Messages Domain (1 tool)

POST request. `readOnlyHint: true`.

#### `sprout_get_messages`

Retrieves inbox messages with rich filtering.

**Endpoint:** `POST /v1/<cid>/messages`

**Parameter mapping notes:**
- `cursor` → `page_cursor` in API request body
- `sort_order` → `sort: ["created_time:<sort_order>"]` in API request body (only `created_time` sort is supported)

**Parameters:**
- `profile_ids?: number[]` (mapped to `customer_profile_id.eq(...)` filter)
- `group_id?: number` (mapped to `group_id.eq(...)` filter — enables `inbox_permalink` field)
- `start_date?: string` (ISO date)
- `end_date?: string` (ISO date)
- `post_types?: string[]` (e.g. `["COMMENT", "DM", "POST"]`)
- `tag_ids?: number[]`
- `language_code?: string`
- `message_ids?: string[]` (mutually exclusive with other filters, max 100)
- `fields?: string[]` (e.g. `["text", "from", "created_time", "post_type"]`)
- `sort_order?: "asc" | "desc"` (default "desc") — always sorts by `created_time`
- `timezone?: string` (IANA timezone, e.g. "America/Chicago")
- `limit?: number` (default 50, max 100)
- `cursor?: string` (for pagination)
- `customer_id?`
- `response_format?`

**Pagination:** Cursor-based. Response includes `next_cursor` when more results exist.

### Listening Domain (2 tools)

Both POST requests. Both `readOnlyHint: true`.

#### `sprout_get_listening_messages`

Messages within a listening topic.

**Parameters:**
- `topic_id: number` (required)
- `start_date: string` (required)
- `end_date: string` (required)
- `sentiment?: "POSITIVE" | "NEGATIVE" | "NEUTRAL"`
- `network?: string`
- `text_search?: string` (supports OR operator)
- `fields?: string[]`
- `sort_by?: string`
- `sort_order?: "asc" | "desc"`
- `timezone?: string` (IANA timezone, e.g. "America/Chicago")
- `page?: number` (default 1)
- `limit?: number` (default 50, max 100)
- `customer_id?`
- `response_format?`

**Pagination:** Index-based. Response includes `current_page` and `total_pages` (same pattern as analytics).

#### `sprout_get_listening_metrics`

Aggregated topic metrics with optional dimensional breakdown.

**Parameters:**
- `topic_id: number` (required)
- `start_date: string` (required)
- `end_date: string` (required)
- `metrics?: string[]` (e.g. `["engagements", "messages_count", "positive_sentiments_count"]`)
- `dimensions?: string[]` (e.g. `["created_time.by(day)", "sentiment", "network"]`)
- `timezone?: string` (IANA timezone, e.g. "America/Chicago")
- `customer_id?`
- `response_format?`

**Pagination:** None — returns all data in one response.

### Publishing Domain (3 tools)

#### `sprout_create_draft_post`

Creates a draft post. `readOnlyHint: false`, `destructiveHint: false`.

**Parameters:**
- `profile_ids: number[]` (required — mapped to API field `customer_profile_ids`)
- `group_id: number` (required)
- `text: string` (required)
- `media?: { media_id: string, media_type: "PHOTO" | "VIDEO" }[]` (UUIDs from `sprout_upload_media` with type)
- `scheduled_times?: string[]` (ISO datetimes, UTC)
- `tag_ids?: number[]`
- `customer_id?`
- `response_format?`

Always sets `is_draft: true`. The tool constructs the API request body including:
- `customer_profile_ids` from `profile_ids`
- `delivery: { scheduled_times, type: "SCHEDULED" }` wrapper from `scheduled_times`
- `media` array with `{media_id, media_type}` objects

Fans out: one calendar post per profile per scheduled time.

#### `sprout_upload_media`

Uploads media for use in posts. `readOnlyHint: false`, `destructiveHint: false`.

**Parameters:**
- `media_url: string` (URL to download from — mutually exclusive with file upload)
- `customer_id?`
- `response_format?`

Uses the simple upload path (`POST /v1/<cid>/media/` with `media_url` form field). Returns `{ media_id, expiration_time }`. Media expires after 24 hours if not attached to a post.

Note: Direct file upload from the local filesystem is not supported in this version (would require multipart form encoding of binary data). URL-based upload covers the primary use case.

#### `sprout_get_post`

Retrieves a publishing post. `readOnlyHint: true`.

**Endpoint:** `GET /v1/<cid>/publishing/posts/<post_id>`

**Parameters:**
- `post_id: string` (required)
- `customer_id?`
- `response_format?`

### Cases Domain (1 tool)

POST request. `readOnlyHint: true`.

#### `sprout_get_cases`

Retrieves support/feedback cases.

**Endpoint:** `POST /v1/<cid>/cases/filter`

**Parameter mapping notes:**
- `cursor` → `page_cursor` in API request body
- `sort_by` + `sort_order` → `sort: ["<sort_by>:<sort_order>"]` in API request body

**Parameters:**
- `start_date?: string` (ISO date, required unless `case_ids` provided)
- `end_date?: string` (ISO date, max 1 week from start_date)
- `date_field?: "created_time" | "updated_time" | "latest_activity_time"` (default "updated_time") — selects which date field `start_date`/`end_date` apply to; only one date filter is constructed per request
- `case_ids?: number[]` (mutually exclusive with date filters, max 100)
- `status?: ("OPEN" | "IN_PROGRESS" | "ON_HOLD" | "CLOSED")[]`
- `priority?: ("CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "UNDEFINED")[]`
- `type?: ("GENERAL" | "SUPPORT" | "LEAD" | "QUESTION" | "FEEDBACK")[]`
- `queue_id?: number`
- `assigned_to?: string` (user ID or URN string, e.g. `"1420065"` — tool constructs the filter)
- `tag_ids?: number[]`
- `sort_by?: "created_time" | "updated_time"` (default "created_time") — only these two values are supported by the API
- `sort_order?: "asc" | "desc"` (default "desc")
- `timezone?: string` (IANA timezone, e.g. "America/Chicago")
- `limit?: number` (default 50, max 100)
- `cursor?: string`
- `customer_id?`
- `response_format?`

**Pagination:** Cursor-based.

---

## Filter Builder

Central module that translates typed tool parameters into Sprout's filter DSL. Keeps DSL knowledge in one place.

### Functions

```typescript
buildDateRangeFilter(field: string, start: string, end: string, endInclusive?: boolean): string
// endInclusive=false (default): "created_time.in(2024-01-01...2024-02-01)" (three dots = end-exclusive)
// endInclusive=true: "reporting_period.in(2024-01-01..2024-02-01)" (two dots = end-inclusive)

buildEqFilter(field: string, values: (string | number)[]): string
// "customer_profile_id.eq(123, 456)"

buildComparisonFilter(field: string, op: "gt" | "gte" | "lt" | "lte", value: string): string
// "guid.gt(abc123)"

buildTextMatchFilter(field: string, text: string): string
// "text.match(sprout OR social)"

buildExistsFilter(field: string, exists: boolean): string
// "field.exists(true)"
```

### Usage Pattern

Each tool's handler calls filter builder functions with its typed parameters, collects the resulting strings into a `filters[]` array, and passes them in the POST body.

---

## API Client

### Configuration
- Base URL: `https://api.sproutsocial.com`
- Timeout: 30 seconds
- Default headers: `Authorization: Bearer <token>`, `Accept: application/json`, `Content-Type: application/json`
- Exception: Media upload endpoints use `Content-Type: multipart/form-data` (overrides default)

### Auth Module (`auth.ts`)
- `getToken(): Promise<string>` — returns cached token or refreshes
- For static tokens: returns `SPROUT_API_TOKEN` directly
- For OAuth: caches JWT, refreshes when within 60 seconds of expiry
- Token refresh is mutex-protected to prevent concurrent refresh races

### Rate Limiting
- Tracks request timestamps in a sliding window (60 per minute)
- If approaching the limit (>55 requests in the current window), delays the next request
- On 429 response: reads `Retry-After` header, backs off with exponential retry (max 3 retries)

### Retry Strategy
- Retries on: 202 (media not ready — uses `wait_until` from response), 429, 500, 503, 504
- Max 3 retries with exponential backoff (1s, 2s, 4s) for 429/5xx
- For 202: retry after the `wait_until` timestamp, max 5 retries (media processing can be slow)
- Does NOT retry on: 400, 401, 403, 404, 405, 415

### Error Handling
Centralized `handleApiError(error: unknown): string` that maps HTTP status codes to actionable messages:

| Status | Message |
|--------|---------|
| 400 | "Bad request. Check parameter values and date formats." |
| 401 | "Authentication failed. Check your SPROUT_API_TOKEN or OAuth credentials." |
| 403 | "Insufficient permissions. Verify API access is enabled in Sprout settings." |
| 404 | "Resource not found. Check the ID is correct." |
| 429 | "Rate limited. The server will retry automatically." |
| 504 | "Request timed out. Try narrowing the date range or reducing the number of profiles." |

All errors include the `X-Sprout-Request-ID` response header value when available.

---

## Response Formatting

### `response_format` Parameter
Every tool accepts `response_format?: "markdown" | "json"` (default `"markdown"`).

### Markdown Format
- **Metadata tools:** Bulleted lists or simple tables
- **Analytics tools:** Tables with metrics as columns, dates/profiles as rows
- **Messages:** Structured blocks with sender, timestamp, text, tags
- **Cases:** Summary cards with status, priority, assignment, message count
- **Publishing:** Confirmation with post IDs and scheduled times

### JSON Format
Returns the structured data object directly, without formatting.

### Truncation
Constant: `CHARACTER_LIMIT = 25000`

If a response exceeds this limit, it is truncated and a message is appended:
> "Response truncated. Use pagination parameters (page/cursor) or narrower date ranges to retrieve remaining data."

---

## Tool Annotations

| Domain | readOnlyHint | destructiveHint | idempotentHint | openWorldHint |
|--------|-------------|-----------------|----------------|---------------|
| Metadata (all) | true | false | true | true |
| Analytics (all) | true | false | true | true |
| Messages | true | false | true | true |
| Listening (all) | true | false | true | true |
| Publishing: create_draft_post | false | false | false | true |
| Publishing: upload_media | false | false | false | true |
| Publishing: get_post | true | false | true | true |
| Cases | true | false | true | true |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SPROUT_API_TOKEN` | One auth method required | Static API token from Sprout UI |
| `SPROUT_CLIENT_ID` | For OAuth | OAuth client ID |
| `SPROUT_CLIENT_SECRET` | For OAuth | OAuth client secret |
| `SPROUT_ORG_ID` | For OAuth | Organization ID for scope |
| `SPROUT_CUSTOMER_ID` | Only if multiple customers | Override auto-discovered customer ID |

---

## Known Limitations & Gotchas

Documented in tool descriptions so the LLM is aware:

1. **Publishing is draft-only.** `is_draft: true` is enforced. Posts must be approved in Sprout's UI.
2. **Cases date range max 1 week.** The tool validates this and returns an error if exceeded.
3. **Analytics 10K result cap.** For large datasets, the tool automatically switches to guid-cursor pagination.
4. **Media expires in 24 hours.** Upload media close to when you'll create the post.
5. **X (Twitter) data requires separate EULA.** If X profile analytics fail with 403, this is likely the cause.
6. **DM media URLs are nonfunctional.** Image/video URLs in DM messages won't resolve.
7. **Facebook metric deprecations.** Some impression metrics now represent "views" for dates after Jan 1, 2025.
8. **Timezone handling:** Profile analytics use network-native timezones (Facebook/Instagram = PST, X/LinkedIn = UTC). Post/message timestamps are always UTC.

---

## Dependencies

```json
{
  "@modelcontextprotocol/sdk": "^1.6.1",
  "zod": "^3.23.8",
  "axios": "^1.7.9"
}
```

Dev dependencies: `typescript`, `@types/node`
