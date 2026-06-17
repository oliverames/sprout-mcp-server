# Sprout Social MCP Server

## Quick Start
- `npm install` — install deps
- `npm run build` — compile TypeScript
- `npm run dev` — watch mode (tsc --watch)
- `npm test` — run tests (`vitest run`)
- `npm run test:watch` — tests in watch mode
- `npm run login` — execute interactive user login flow
- `npm start` — run server (uses static token, M2M OAuth, or saved user login)
- `npm run publish:npm` — publish to npm as `@oliverames/sprout-mcp-server`

## Architecture
- TypeScript MCP server using stdio transport
- 20 tools across 6 domains: metadata, analytics, messages, listening, publishing, cases
- Filter builder translates friendly params to Sprout's custom DSL
- Triple auth: API token, OAuth M2M, or Interactive User OAuth via PKCE (public client, no client secret needed; zero-config persistence)

## Source Structure

```
src/
  index.ts              Entry point — auth, customer discovery, tool registration
  constants.ts          API URLs, rate limits, validation constraints
  types.ts              Shared TypeScript interfaces
  schemas/common.ts     Reusable Zod schemas for tool input validation
  services/
    auth.ts             API token + OAuth M2M token management
    api-client.ts       HTTP client with retries, rate limiting, 202 polling
    filter-builder.ts   Translates typed params → Sprout's filter DSL
    formatter.ts        Markdown/JSON formatting + truncation
  tools/
    metadata.ts         8 tools — account structure discovery
    analytics.ts        2 tools — profile + post performance
    messages.ts         1 tool  — inbox message queries
    listening.ts        2 tools — topic messages + aggregated metrics
    publishing.ts       6 tools — drafts, media upload (simple + multipart)
    cases.ts            1 tool  — support case management
tests/
  tools/                Per-domain test files (mirrors src/tools/)
  services/             Per-service test files (mirrors src/services/)
```

## Key Patterns
- All tool handlers are pure functions: `handler(client, customerId, params) → ToolResponse`
- Tool registration is grouped by domain in `src/tools/*.ts` (analytics, cases, listening, messages, metadata, publishing)
- Zod schemas in `src/schemas/` define tool input validation
- Filter DSL construction is centralized in `src/services/filter-builder.ts`
- Response formatting supports markdown (default) and JSON
- `formatAsTable()` accepts `object[]` — do NOT cast typed arrays to `Record<string, unknown>[]`

## Gotchas
- IDs (`topic_id`, `case_ids`, `queue_id`) use `z.coerce.number()` — API returns strings but filter DSL needs numbers
- Sentiment filter values must be **lowercase** (`positive`, `negative`, `neutral`) despite API responses returning uppercase
- `guid_cursor` on post analytics auto-sets `sort_field='guid'` + `sort_order='asc'` — don't set manually
- `additional_filters` on cases/listening accepts raw DSL strings for filter combos not modeled as typed params
- Messages only support `sort_by: 'created_time'` — no `likes` sort exists despite it seeming logical
- FormData uploads use `Content-Type: undefined` to let axios set the multipart boundary

## Testing
- Unit tests in `tests/` mirror `src/` structure
- Mock the `ApiClient` interface for tool handler tests
- Filter builder tests are pure (no mocking needed)
- Run: `npm test` or `npx vitest run`

## Environment Variables
- `SPROUT_API_TOKEN` — static token (simplest auth)
- `SPROUT_CLIENT_ID` + `SPROUT_CLIENT_SECRET` + `SPROUT_ORG_ID` — OAuth M2M
- `SPROUT_CUSTOMER_ID` — optional, for multi-customer setups

## Version State
- Current: 1.3.0 (committed to main; NOT yet published to npm — 1.2.0 is the latest published)
- Main branch may have unpublished changes — check `git log --oneline npm/v1.2.0..HEAD` before deciding on next version bump
- 1.3.0 adds PKCE-based interactive login (Option B). Live login is unvalidated: no real Sprout Okta OAuth client (`0oa...`) or API token has been available to test against (see WORKLOG 2026-06-01)
