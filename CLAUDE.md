# Sprout Social MCP Server

## Quick Start
- `npm install` — install deps
- `npm run build` — compile TypeScript
- `npm run dev` — watch mode (tsc --watch)
- `npm test` — run tests (`vitest run`)
- `npm run test:watch` — tests in watch mode
- `npm start` — run server (requires auth env vars)
- `npm run publish:npm` — publish to npm as `@oliverames/sprout-mcp-server`

## Architecture
- TypeScript MCP server using stdio transport
- 20 tools across 6 domains: metadata, analytics, messages, listening, publishing, cases
- Filter builder translates friendly params to Sprout's custom DSL
- Dual auth: API token or OAuth M2M

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
- Current: 1.1.0 (published to npm)
- Audit fixes from 2026-03-22 are on main but unpublished — bump to 1.2.0 when ready
