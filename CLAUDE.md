# Sprout Social MCP Server

## Quick Start
- `npm install` — install deps
- `npm run build` — compile TypeScript
- `npm test` — run tests
- `npm start` — run server (requires auth env vars)

## Architecture
- TypeScript MCP server using stdio transport
- 20 tools across 6 domains: metadata, analytics, messages, listening, publishing, cases
- Filter builder translates friendly params to Sprout's custom DSL
- Dual auth: API token or OAuth M2M

## Key Patterns
- All tool handlers are pure functions: `handler(client, customerId, params) → ToolResponse`
- Tool registration is grouped by domain in `src/tools/*.ts`
- Filter DSL construction is centralized in `src/services/filter-builder.ts`
- Response formatting supports markdown (default) and JSON
- `formatAsTable()` accepts `object[]` — do NOT cast typed arrays to `Record<string, unknown>[]`

## Testing
- Unit tests in `tests/` mirror `src/` structure
- Mock the `ApiClient` interface for tool handler tests
- Filter builder tests are pure (no mocking needed)
- Run: `npm test` or `npx vitest run`

## Environment Variables
- `SPROUT_API_TOKEN` — static token (simplest auth)
- `SPROUT_CLIENT_ID` + `SPROUT_CLIENT_SECRET` + `SPROUT_ORG_ID` — OAuth M2M
- `SPROUT_CUSTOMER_ID` — optional, for multi-customer setups
