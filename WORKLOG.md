# Worklog

## 2026-06-01 — PKCE "Sign in with Sprout" (Option B); live login blocked on real OAuth client

**What changed**: Added an interactive user-login path using PKCE (S256) alongside the existing token/M2M auth, presented as two clear options (A: API token or OAuth M2M; B: "Sign in with Sprout"). New `src/services/pkce.ts` (`createPkcePair`: 32-byte base64url verifier + S256 challenge) with unit tests. `login.ts` now sends `code_challenge`/`code_challenge_method=S256` on authorize and `code_verifier` on token exchange; client secret is optional. `auth.ts`: `OAuthUserBasedProvider` refreshes with `client_id` alone when no secret is present (public client); `createAuthProvider` accepts a client-id-only public client. Updated `index.ts` auth-status message, `manifest.json`, `.env.example`, and README to the two-option model. Bumped to 1.3.0. Commit `c2942d1`, pushed to origin/main.

**Verification**: `tsc` clean; 138/138 vitest pass (134 prior + 4 new PKCE/public-client tests). Confirmed in compiled output: `dist/login.js` carries `code_challenge_method=S256` + `code_verifier`; `dist/services/auth.js` shows the relaxed `if (!activeClientId)` guard + conditional `client_secret`. Preserved existing refresh contracts (`client_id&client_secret` adjacency; "Missing OAuth client credentials" throw).

**Decisions made**:
- Two-option auth, NOT a port of the app's internal login. Declined to reimplement/replay the mobile email+password+reCAPTCHA flow or to capture-and-replay internal session traffic: those target the undocumented `app.sproutsocial.com`/`cactus` surface, handle raw passwords, and route around Sprout's sanctioned credential model. PKCE delivers the same "just sign in" UX on the supported Okta surface (`identity.sproutsocial.com/oauth2/{authServerId}/v1/...`).
- PKCE makes Option B a public client: only a client ID is needed, no secret shipped in the MCPB.

**Left off at**: Code complete, tested, pushed. Live login validation is BLOCKED on a real Sprout Okta OAuth client. No `0oa...` client ID or self-serve API token was available this session; the Development vault still has only "npm Sprout Publish Token" (the "Sprout OAuth Client" item from the 2026-04-06 TODO was never created). The Google `default_web_client_id` from the decompiled APK is NOT a Sprout login client — probing Sprout's Okta authorize endpoint with it returned `invalid_request`. Chrome DevTools MCP was attached and ready for the live watch once a real credential exists.

**Open questions**:
- Does the operator have self-serve access to API Token Management (Option A1) or OAuth Client Management (to mint a public `0oa...` client with `http://localhost:3000/callback` whitelisted)? That is the unblock.
- Refresh `scope` requirement still unverified live — needs a real session to confirm whether Okta wants `scope` on the `refresh_token` grant.
- 1.3.0 is git-only; not yet published to npm.

---

## 2026-04-06 — 1Password CLI fallback for credential resolution

**What changed**: Added automatic 1Password CLI fallback to credential resolution at startup. When environment variables are not set, the server attempts to resolve them via `op read` from the Development vault before failing. Uses `execFileSync` (Node) or `exec.Command` (Go) for shell-safe execution with a 10s timeout. Silent no-op if 1Password CLI is unavailable. Updated README to document the integration with `op://` reference paths. Part of a broader session that also touched ynab-mcp-server, imagerelay-mcp-server, meta-mcp-server, sprout-mcp-server, and ames-unifi-mcp.

**Decisions made**: Used `execFileSync` instead of `execSync` to avoid shell injection surface (even though inputs are hardcoded string literals). Added the fallback as a separate `op-fallback.ts` module (TS servers) or inline helper (Go) rather than modifying the existing auth flow, keeping the env var path as primary (zero overhead) and 1Password as fallback only. Chose `op://Development/` vault paths matching existing 1Password item names where items exist; for servers without items yet (Meta, Sprout, UniFi), chose conventional names so items can be created later.

**Left off at**: Published and pushed. 1Password items still need to be created for Meta Access Token, Threads Access Token, Sprout API Token/OAuth Client, and UniFi Controller credentials. YNAB and ImageRelay items already exist. Also: 20 uncategorized YNAB transactions from this session's review were identified but not yet categorized.

**Open questions**: None.

---



## 2026-03-22 — Deep audit: 13 bug fixes + code simplification

**What changed**: Ran a 10-iteration deep audit loop reviewing all tool handlers against the internal API docs (Docs/*.md) and the API changelog. Fixed 13 bugs/gaps across 17 files (358 insertions, 67 deletions), then ran /simplify which extracted shared code and removed 41 lines of duplication.

Key fixes: (1) removed invalid `likes` sort from messages — API only supports `created_time`, (2) added 8 missing filter params to listening metrics handler, (3) added `guid_cursor` for post analytics cursor-based pagination beyond 10K, (4) added `buildNeqFilter` and `exclude_tag_ids` for cases tag exclusion, (5) added `additional_filters` escape hatch to cases/listening for raw DSL strings, (6) fixed formatter dot-path resolution for nested fields like `from.name`, (7) fixed `[object Object]` rendering in table cells, (8) replaced non-existent `subject` column in cases table with `created_time`, (9) made publishing `text` optional per API spec, (10) added `native_id` to profiles table, (11) fixed ID type mismatch — `topic_id`, `case_ids`, `queue_id` now use `z.coerce.number()` to accept string IDs the API returns. Simplification pass extracted `buildListeningFilters()` shared helper, unified eq/neq via `buildSetFilter`, added numeric fast-path in `escapeCell`, and made `guid_cursor` auto-set sort params.

**Decisions made**:
- Previous session's `sort_by: "likes"` on messages was itself a bug introduced by misreading the API docs — the messages endpoint only supports sorting by `created_time`. Removed entirely rather than trying to fix.
- Used `z.coerce.number()` for IDs that the API returns as strings (topic, case, queue) rather than changing everything to string-based — coerce handles both types transparently.
- Added `additional_filters` as a raw DSL escape hatch rather than modeling every possible filter combination (multi-date on cases, metric comparisons on listening) as typed params — keeps schemas manageable while providing full API coverage.
- `guid_cursor` auto-sets `sort_field='guid'` and `sort_order='asc'` in the handler — callers shouldn't need to know the coupling.

**Left off at**: All 20 endpoints covered, 119 tests passing, version 1.1.0. Ready to bump to 1.2.0 and publish to npm. README is updated. Consider: (1) publishing new version, (2) adding example metric/field names to tool descriptions.

**Open questions**:
- Should we version-bump before publishing? The fixes are significant enough for a minor bump (1.1.0 → 1.2.0).
- The `text.match()` DSL question from last session is still open — unquoted seems to work per API docs.

---

## 2026-03-21 — API docs audit and 4 bug fixes

**What changed**: Compared every MCP tool against the live Sprout Social API docs (https://api.sproutsocial.com/docs/) across 20 iterations. Fixed 4 bugs: (1) messages tool missing `sort_by` parameter for `likes` sorting, (2) no User-Agent header on API client, (3) listening sentiment filter values were uppercase but API expects lowercase, (4) FormData Content-Type header prevented axios from setting multipart boundary. Also cleaned up deleted docs/ directory (moved to Docs/ which is gitignored). Tests went from 103 to 104, all passing.

**Decisions made**:
- Sentiment filter values must be lowercase (`positive`, `negative`, `neutral`, `unclassified`) for the filter DSL, even though API responses return uppercase. This asymmetry is documented in Sprout's API.
- FormData uploads should use `Content-Type: undefined` rather than manually setting `multipart/form-data` — lets axios auto-detect and include the boundary string.
- New API fields/metrics from the changelog (e.g., `is_boosted`, `lifetime.views`) don't need code changes since handlers accept arbitrary string arrays.
- v2 metadata endpoint not needed — `network_metadata` was added to v1 simultaneously.

**Left off at**: All 20 endpoints covered, 104 tests passing, version 1.1.0. Next session should consider: (1) bumping to 1.2.0 and publishing to npm, (2) adding example metric/field names to tool descriptions to help LLMs choose the right values, (3) potentially adding webhook support if there's demand.

**Open questions**:
- Should tool descriptions include example metric names (e.g., `lifetime.impressions`, `net_follower_growth`) to help LLMs? This would improve usability but increase description length.
- Is the `text.match()` filter DSL correct without quotes around search text, or should we wrap in quotes? API docs show `text.match(blue OR red)` without quotes.

---
