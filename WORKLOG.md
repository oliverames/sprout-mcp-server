# Worklog

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
