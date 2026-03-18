# Sprout Social MCP Server Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a TypeScript MCP server exposing 17 Sprout Social API tools across 6 domains (metadata, analytics, messages, listening, publishing, cases).

**Architecture:** stdio transport, domain-grouped tools with filter builder abstraction, dual auth (API token + OAuth M2M), auto-discovered customer ID with per-tool override.

**Tech Stack:** TypeScript, `@modelcontextprotocol/sdk`, Zod, Axios, Vitest

**Spec:** `docs/superpowers/specs/2026-03-18-sprout-mcp-server-design.md`

---

## File Map

| File | Responsibility |
|------|---------------|
| `package.json` | Dependencies, scripts, entry point. **Requires Node >= 18** (for global `FormData`) |
| `tsconfig.json` | TypeScript strict config, ES2022 target |
| `vitest.config.ts` | Vitest config with TypeScript resolution |
| `.env.example` | Document all env vars |
| `src/constants.ts` | Base URL, token endpoint, rate limits, character limit |
| `src/types.ts` | Shared interfaces: API responses, pagination envelopes, tool result shapes |
| `src/services/auth.ts` | Token management: static token or OAuth M2M with caching/refresh |
| `src/services/api-client.ts` | Axios wrapper: auth injection, rate limiting, retries, error handling |
| `src/services/filter-builder.ts` | Typed params → Sprout filter DSL translation (5 builder functions) |
| `src/services/formatter.ts` | Response formatting: markdown tables/lists, JSON passthrough, truncation |
| `src/schemas/common.ts` | Shared Zod schemas: response_format, pagination, date ranges |
| `src/tools/metadata.ts` | 8 metadata tools (list customers, profiles, groups, tags, users, teams, queues, topics) |
| `src/tools/analytics.ts` | 2 analytics tools (profile analytics, post analytics) |
| `src/tools/messages.ts` | 1 messages tool (inbox messages) |
| `src/tools/listening.ts` | 2 listening tools (topic messages, topic metrics) |
| `src/tools/publishing.ts` | 3 publishing tools (create draft, upload media, get post) |
| `src/tools/cases.ts` | 1 cases tool (filter cases) |
| `src/index.ts` | Entry point: init server, auth, customer discovery, register tools, connect stdio |
| `tests/services/filter-builder.test.ts` | Filter builder unit tests |
| `tests/services/auth.test.ts` | Auth module unit tests |
| `tests/services/api-client.test.ts` | API client unit tests (retry, rate limit, error handling) |
| `tests/services/formatter.test.ts` | Formatter unit tests |
| `tests/tools/metadata.test.ts` | Metadata tool handler tests |
| `tests/tools/analytics.test.ts` | Analytics tool handler tests |
| `tests/tools/messages.test.ts` | Messages tool handler tests |
| `tests/tools/listening.test.ts` | Listening tool handler tests |
| `tests/tools/publishing.test.ts` | Publishing tool handler tests |
| `tests/tools/cases.test.ts` | Cases tool handler tests |

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.env.example`
- Create: `vitest.config.ts`
- Create: `src/constants.ts`
- Create: `src/types.ts`

- [ ] **Step 0: Initialize git repo (if not already initialized)**

Run: `git init` (skip if `.git/` already exists — the brainstorming phase may have already initialized it)

- [ ] **Step 1: Create package.json**

```json
{
  "name": "sprout-mcp-server",
  "version": "1.0.0",
  "description": "MCP server for Sprout Social API",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsc --watch",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.6.1",
    "axios": "^1.7.9",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "typescript": "^5.7.0",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

- [ ] **Step 2b: Create vitest.config.ts**

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: false,
    environment: "node",
  },
});
```

- [ ] **Step 3: Create .env.example**

```env
# Authentication (one method required)
# Option 1: Static API Token
SPROUT_API_TOKEN=

# Option 2: OAuth M2M
SPROUT_CLIENT_ID=
SPROUT_CLIENT_SECRET=
SPROUT_ORG_ID=

# Optional: Override auto-discovered customer ID (only needed for multi-customer setups)
SPROUT_CUSTOMER_ID=
```

- [ ] **Step 4: Create src/constants.ts**

```typescript
export const BASE_URL = "https://api.sproutsocial.com";

export const OAUTH_TOKEN_ENDPOINT =
  "https://identity.sproutsocial.com/oauth2/84e39c75-d770-45d9-90a9-7b79e3037d2c/v1/token";

export const RATE_LIMIT_PER_MINUTE = 60;
export const RATE_LIMIT_SOFT_CAP = 55; // Start throttling at this threshold

export const REQUEST_TIMEOUT_MS = 30_000;

export const MAX_RETRIES = 3;
export const RETRY_BASE_DELAY_MS = 1000;
export const MAX_202_RETRIES = 5;

export const CHARACTER_LIMIT = 25_000;

export const MAX_PROFILES_PER_REQUEST = 100;
export const MAX_MESSAGE_IDS_PER_REQUEST = 100;
export const MAX_CASE_IDS_PER_REQUEST = 100;
export const CASES_MAX_DATE_RANGE_DAYS = 7;
export const ANALYTICS_MAX_DATE_RANGE_DAYS = 365;

export const RETRYABLE_STATUS_CODES = [429, 500, 503, 504];
export const NON_RETRYABLE_STATUS_CODES = [400, 401, 403, 404, 405, 415];
```

- [ ] **Step 5: Create src/types.ts**

```typescript
export type ResponseFormat = "markdown" | "json";

export interface SproutCustomer {
  customer_id: number;
  name: string;
}

export interface SproutProfile {
  customer_profile_id: number;
  network_type: string;
  name: string;
  native_name: string;
  native_id: string;
  groups: number[];
  network_metadata?: Record<string, unknown>;
}

export interface SproutGroup {
  group_id: number;
  name: string;
}

export interface SproutTag {
  tag_id: number;
  any_group: boolean;
  active: boolean;
  text: string;
  type: "LABEL" | "CAMPAIGN";
  groups: number[];
}

export interface SproutUser {
  id: number;
  name: string;
  email: string;
}

export interface SproutTeam {
  id: number;
  name: string;
  description: string;
}

export interface SproutQueue {
  id: number;
  name: string;
  description: string;
  associated_teams: number[];
}

export interface SproutTopic {
  id: number;
  name: string;
  topic_type: string;
  description: string;
  group_id: number;
  theme_groups: unknown[];
  availability_time: string;
}

export interface SproutApiResponse<T> {
  data: T[];
  paging?: IndexPaging | CursorPaging;
  error?: string;
}

export interface IndexPaging {
  current_page: number;
  total_pages: number;
}

export interface CursorPaging {
  next_cursor?: string;
}

export interface PaginationEnvelope<T> {
  data: T[];
  pagination: {
    has_more: boolean;
    next_cursor?: string;
    current_page?: number;
    total_pages?: number;
  };
}

export interface MediaUploadResult {
  media_id: string;
  expiration_time: string;
}

export interface ToolResponse {
  content: Array<{ type: "text"; text: string }>;
  structuredContent?: unknown;
  isError?: boolean;
}
```

- [ ] **Step 6: Install dependencies**

Run: `npm install`
Expected: `node_modules` created, no errors.

- [ ] **Step 7: Verify TypeScript compiles (empty project)**

Create a minimal `src/index.ts`:
```typescript
console.error("Sprout MCP Server starting...");
```

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 8: Commit**

```bash
git add package.json tsconfig.json vitest.config.ts .env.example src/constants.ts src/types.ts src/index.ts package-lock.json
git commit -m "feat: scaffold project with deps, types, and constants"
```

---

### Task 2: Filter Builder (TDD)

**Files:**
- Create: `src/services/filter-builder.ts`
- Create: `tests/services/filter-builder.test.ts`

- [ ] **Step 1: Write failing tests for all filter builder functions**

```typescript
// tests/services/filter-builder.test.ts
import { describe, it, expect } from "vitest";
import {
  buildDateRangeFilter,
  buildEqFilter,
  buildComparisonFilter,
  buildTextMatchFilter,
  buildExistsFilter,
} from "../../src/services/filter-builder.js";

describe("buildDateRangeFilter", () => {
  it("builds end-exclusive range by default (three dots)", () => {
    expect(buildDateRangeFilter("created_time", "2024-01-01", "2024-02-01"))
      .toBe("created_time.in(2024-01-01...2024-02-01)");
  });

  it("builds end-inclusive range when specified (two dots)", () => {
    expect(buildDateRangeFilter("reporting_period", "2024-01-01", "2024-01-31", true))
      .toBe("reporting_period.in(2024-01-01..2024-01-31)");
  });
});

describe("buildEqFilter", () => {
  it("builds single value", () => {
    expect(buildEqFilter("customer_profile_id", [123]))
      .toBe("customer_profile_id.eq(123)");
  });

  it("builds multiple values", () => {
    expect(buildEqFilter("customer_profile_id", [123, 456, 789]))
      .toBe("customer_profile_id.eq(123, 456, 789)");
  });

  it("handles string values", () => {
    expect(buildEqFilter("post_type", ["COMMENT", "DM"]))
      .toBe("post_type.eq(COMMENT, DM)");
  });
});

describe("buildComparisonFilter", () => {
  it("builds gt filter", () => {
    expect(buildComparisonFilter("guid", "gt", "abc123"))
      .toBe("guid.gt(abc123)");
  });

  it("builds lte filter", () => {
    expect(buildComparisonFilter("created_time", "lte", "2024-01-01"))
      .toBe("created_time.lte(2024-01-01)");
  });
});

describe("buildTextMatchFilter", () => {
  it("builds match filter with simple text", () => {
    expect(buildTextMatchFilter("text", "sprout"))
      .toBe("text.match(sprout)");
  });

  it("preserves OR operator", () => {
    expect(buildTextMatchFilter("text", "sprout OR social"))
      .toBe("text.match(sprout OR social)");
  });
});

describe("buildExistsFilter", () => {
  it("builds exists true", () => {
    expect(buildExistsFilter("tag_id", true))
      .toBe("tag_id.exists(true)");
  });

  it("builds exists false", () => {
    expect(buildExistsFilter("tag_id", false))
      .toBe("tag_id.exists(false)");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/services/filter-builder.test.ts`
Expected: All tests FAIL (module not found).

- [ ] **Step 3: Implement filter builder**

```typescript
// src/services/filter-builder.ts

/**
 * Build a date range filter using Sprout's DSL.
 * endInclusive=false (default): uses "..." (end-exclusive) for created_time
 * endInclusive=true: uses ".." (end-inclusive) for reporting_period
 */
export function buildDateRangeFilter(
  field: string,
  start: string,
  end: string,
  endInclusive = false
): string {
  const separator = endInclusive ? ".." : "...";
  return `${field}.in(${start}${separator}${end})`;
}

/**
 * Build an equality filter: field.eq(val1, val2, ...)
 */
export function buildEqFilter(
  field: string,
  values: (string | number)[]
): string {
  return `${field}.eq(${values.join(", ")})`;
}

/**
 * Build a comparison filter: field.op(value)
 */
export function buildComparisonFilter(
  field: string,
  op: "gt" | "gte" | "lt" | "lte",
  value: string
): string {
  return `${field}.${op}(${value})`;
}

/**
 * Build a text match filter: field.match(text)
 * Supports OR operator in search text.
 */
export function buildTextMatchFilter(
  field: string,
  text: string
): string {
  return `${field}.match(${text})`;
}

/**
 * Build an exists filter: field.exists(true/false)
 */
export function buildExistsFilter(
  field: string,
  exists: boolean
): string {
  return `${field}.exists(${exists})`;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/services/filter-builder.test.ts`
Expected: All 8 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/services/filter-builder.ts tests/services/filter-builder.test.ts
git commit -m "feat: add filter builder with full test coverage"
```

---

### Task 3: Auth Module (TDD)

**Files:**
- Create: `src/services/auth.ts`
- Create: `tests/services/auth.test.ts`

- [ ] **Step 1: Write failing tests for auth module**

```typescript
// tests/services/auth.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// We'll mock axios at the module level
vi.mock("axios");

import { createAuthProvider, type AuthProvider } from "../../src/services/auth.js";

describe("createAuthProvider", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns static token provider when SPROUT_API_TOKEN is set", async () => {
    vi.stubEnv("SPROUT_API_TOKEN", "test-token-123");
    const provider = createAuthProvider();
    expect(await provider.getToken()).toBe("test-token-123");
  });

  it("returns OAuth provider when client credentials are set", async () => {
    vi.stubEnv("SPROUT_CLIENT_ID", "client-id");
    vi.stubEnv("SPROUT_CLIENT_SECRET", "client-secret");
    vi.stubEnv("SPROUT_ORG_ID", "org-123");

    // Mock the token endpoint
    const axios = await import("axios");
    const mockPost = vi.fn().mockResolvedValue({
      data: { access_token: "oauth-jwt-token", expires_in: 3600 },
    });
    vi.mocked(axios.default).post = mockPost;

    const provider = createAuthProvider();
    const token = await provider.getToken();

    expect(token).toBe("oauth-jwt-token");
    expect(mockPost).toHaveBeenCalledWith(
      expect.stringContaining("identity.sproutsocial.com"),
      expect.any(String),
      expect.objectContaining({
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
    );
  });

  it("throws when no auth env vars are set", () => {
    expect(() => createAuthProvider()).toThrow(/authentication/i);
  });

  it("prefers API token over OAuth when both are set", async () => {
    vi.stubEnv("SPROUT_API_TOKEN", "static-token");
    vi.stubEnv("SPROUT_CLIENT_ID", "client-id");
    vi.stubEnv("SPROUT_CLIENT_SECRET", "client-secret");
    vi.stubEnv("SPROUT_ORG_ID", "org-123");

    const provider = createAuthProvider();
    expect(await provider.getToken()).toBe("static-token");
  });

  it("caches OAuth token and reuses until near expiry", async () => {
    vi.stubEnv("SPROUT_CLIENT_ID", "client-id");
    vi.stubEnv("SPROUT_CLIENT_SECRET", "client-secret");
    vi.stubEnv("SPROUT_ORG_ID", "org-123");

    const axios = await import("axios");
    const mockPost = vi.fn().mockResolvedValue({
      data: { access_token: "cached-token", expires_in: 3600 },
    });
    vi.mocked(axios.default).post = mockPost;

    const provider = createAuthProvider();
    await provider.getToken();
    await provider.getToken();
    await provider.getToken();

    expect(mockPost).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/services/auth.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement auth module**

```typescript
// src/services/auth.ts
import axios from "axios";
import { OAUTH_TOKEN_ENDPOINT } from "../constants.js";

export interface AuthProvider {
  getToken(): Promise<string>;
}

interface OAuthTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

class StaticTokenProvider implements AuthProvider {
  constructor(private token: string) {}

  async getToken(): Promise<string> {
    return this.token;
  }
}

class OAuthM2MProvider implements AuthProvider {
  private cachedToken: string | null = null;
  private expiresAt = 0;
  private refreshPromise: Promise<string> | null = null;

  constructor(
    private clientId: string,
    private clientSecret: string,
    private orgId: string
  ) {}

  async getToken(): Promise<string> {
    // Return cached token if still valid (with 60s buffer)
    if (this.cachedToken && Date.now() < this.expiresAt - 60_000) {
      return this.cachedToken;
    }

    // Mutex: if a refresh is in progress, wait for it
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.refresh();
    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async refresh(): Promise<string> {
    const params = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: this.clientId,
      client_secret: this.clientSecret,
      scope: this.orgId,
    });

    const response = await axios.post<OAuthTokenResponse>(
      OAUTH_TOKEN_ENDPOINT,
      params.toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    this.cachedToken = response.data.access_token;
    this.expiresAt = Date.now() + response.data.expires_in * 1000;
    return this.cachedToken;
  }
}

export function createAuthProvider(): AuthProvider {
  const apiToken = process.env.SPROUT_API_TOKEN;
  if (apiToken) {
    return new StaticTokenProvider(apiToken);
  }

  const clientId = process.env.SPROUT_CLIENT_ID;
  const clientSecret = process.env.SPROUT_CLIENT_SECRET;
  const orgId = process.env.SPROUT_ORG_ID;

  if (clientId && clientSecret && orgId) {
    return new OAuthM2MProvider(clientId, clientSecret, orgId);
  }

  throw new Error(
    "No authentication configured. Set either:\n" +
      "  - SPROUT_API_TOKEN (static API token), or\n" +
      "  - SPROUT_CLIENT_ID + SPROUT_CLIENT_SECRET + SPROUT_ORG_ID (OAuth M2M)"
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/services/auth.test.ts`
Expected: All 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/services/auth.ts tests/services/auth.test.ts
git commit -m "feat: add auth module with API token and OAuth M2M support"
```

---

### Task 4: API Client (TDD)

**Files:**
- Create: `src/services/api-client.ts`
- Create: `tests/services/api-client.test.ts`

- [ ] **Step 1: Write failing tests for API client**

Test the core behaviors: error handling, retry logic, and 202 polling.

Note: The `createApiClient` function returns an object wrapping Axios. Full integration-style tests of retry/rate-limit logic would require intercepting Axios internals. Focus unit tests on `handleApiError` (pure function) and validate the client's behavioral contract through tool-level tests that mock the `ApiClient` interface. The retry and rate-limit logic should be manually verified with the MCP Inspector during Task 14.

```typescript
// tests/services/api-client.test.ts
import { describe, it, expect } from "vitest";
import { handleApiError } from "../../src/services/api-client.js";

describe("handleApiError", () => {
  it("maps 401 to auth error message with request ID", () => {
    const error = {
      isAxiosError: true,
      response: {
        status: 401,
        headers: { "x-sprout-request-id": "req-123" },
        data: {},
      },
    };
    const msg = handleApiError(error);
    expect(msg).toContain("Authentication failed");
    expect(msg).toContain("req-123");
  });

  it("maps 400 to bad request message", () => {
    const error = {
      isAxiosError: true,
      response: { status: 400, headers: {}, data: {} },
    };
    expect(handleApiError(error)).toContain("Bad request");
  });

  it("maps 403 to permissions message", () => {
    const error = {
      isAxiosError: true,
      response: { status: 403, headers: {}, data: {} },
    };
    expect(handleApiError(error)).toContain("permissions");
  });

  it("maps 404 to not found message", () => {
    const error = {
      isAxiosError: true,
      response: { status: 404, headers: {}, data: {} },
    };
    expect(handleApiError(error)).toContain("not found");
  });

  it("maps 429 to rate limit message", () => {
    const error = {
      isAxiosError: true,
      response: { status: 429, headers: {}, data: {} },
    };
    expect(handleApiError(error)).toContain("Rate limited");
  });

  it("maps 504 to timeout message", () => {
    const error = {
      isAxiosError: true,
      response: { status: 504, headers: {}, data: {} },
    };
    expect(handleApiError(error)).toContain("timed out");
  });

  it("maps connection abort to timeout message", () => {
    const error = {
      isAxiosError: true,
      code: "ECONNABORTED",
      message: "timeout",
    };
    expect(handleApiError(error)).toContain("timed out");
  });

  it("handles non-axios errors", () => {
    expect(handleApiError(new Error("network down"))).toContain("network down");
  });

  it("handles unknown error shapes", () => {
    expect(handleApiError("something")).toContain("something");
  });

  it("includes API error message from response body", () => {
    const error = {
      isAxiosError: true,
      response: { status: 422, headers: {}, data: { error: "Invalid metric name" } },
      message: "Request failed",
    };
    expect(handleApiError(error)).toContain("Invalid metric name");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/services/api-client.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement API client**

```typescript
// src/services/api-client.ts
import axios, {
  type AxiosInstance,
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  BASE_URL,
  REQUEST_TIMEOUT_MS,
  MAX_RETRIES,
  RETRY_BASE_DELAY_MS,
  RATE_LIMIT_PER_MINUTE,
  RATE_LIMIT_SOFT_CAP,
  RETRYABLE_STATUS_CODES,
  MAX_202_RETRIES,
} from "../constants.js";
import type { AuthProvider } from "./auth.js";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Maps Axios errors to actionable user-facing messages.
 */
export function handleApiError(error: unknown): string {
  if (error && typeof error === "object" && "isAxiosError" in error) {
    const axiosErr = error as AxiosError<{ error?: string }>;
    const requestId = axiosErr.response?.headers?.["x-sprout-request-id"];
    const suffix = requestId ? ` (Request ID: ${requestId})` : "";

    if (axiosErr.response) {
      switch (axiosErr.response.status) {
        case 400:
          return `Bad request. Check parameter values and date formats.${suffix}`;
        case 401:
          return `Authentication failed. Check your SPROUT_API_TOKEN or OAuth credentials.${suffix}`;
        case 403:
          return `Insufficient permissions. Verify API access is enabled in Sprout settings.${suffix}`;
        case 404:
          return `Resource not found. Check the ID is correct.${suffix}`;
        case 429:
          return `Rate limited. The server will retry automatically.${suffix}`;
        case 504:
          return `Request timed out. Try narrowing the date range or reducing the number of profiles.${suffix}`;
        default:
          return `API error (${axiosErr.response.status}): ${axiosErr.response.data?.error ?? axiosErr.message}${suffix}`;
      }
    }

    if (axiosErr.code === "ECONNABORTED") {
      return "Request timed out. Try again or narrow your query.";
    }

    return `Network error: ${axiosErr.message}`;
  }

  if (error instanceof Error) {
    return `Error: ${error.message}`;
  }

  return `Error: ${String(error)}`;
}

/**
 * Rate limiter using a sliding window of request timestamps.
 */
class RateLimiter {
  private timestamps: number[] = [];

  async throttle(): Promise<void> {
    const now = Date.now();
    // Remove timestamps older than 1 minute
    this.timestamps = this.timestamps.filter((t) => now - t < 60_000);

    if (this.timestamps.length >= RATE_LIMIT_SOFT_CAP) {
      // Wait until the oldest timestamp in our window expires
      const waitMs = 60_000 - (now - this.timestamps[0]!) + 100;
      if (waitMs > 0) {
        await sleep(waitMs);
      }
    }

    this.timestamps.push(Date.now());
  }
}

export interface ApiClient {
  get<T>(path: string): Promise<T>;
  post<T>(path: string, body: unknown): Promise<T>;
  postFormData<T>(path: string, formData: FormData): Promise<T>;
}

export function createApiClient(auth: AuthProvider): ApiClient {
  const rateLimiter = new RateLimiter();

  const instance: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: REQUEST_TIMEOUT_MS,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  // Auth interceptor
  instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const token = await auth.getToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  async function requestWithRetry<T>(
    fn: () => Promise<AxiosResponse<T>>,
    retries = MAX_RETRIES
  ): Promise<T> {
    await rateLimiter.throttle();

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fn();
        return response.data;
      } catch (error) {
        const axiosErr = error as AxiosError;
        const status = axiosErr.response?.status;

        if (status && RETRYABLE_STATUS_CODES.includes(status) && attempt < retries) {
          const retryAfter = axiosErr.response?.headers?.["retry-after"];
          const delayMs = retryAfter
            ? parseInt(retryAfter, 10) * 1000
            : RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
          await sleep(delayMs);
          continue;
        }

        throw error;
      }
    }

    throw new Error("Max retries exceeded");
  }

  /**
   * Poll for 202 responses (used by media upload completion).
   */
  async function pollFor202<T>(
    fn: () => Promise<AxiosResponse<T>>
  ): Promise<T> {
    for (let attempt = 0; attempt < MAX_202_RETRIES; attempt++) {
      await rateLimiter.throttle();
      const response = await fn();

      if (response.status !== 202) {
        return response.data;
      }

      // 202 means "not ready yet" — wait and retry
      const body = response.data as Record<string, unknown>;
      const waitUntil = body?.wait_until as string | undefined;
      if (waitUntil) {
        const waitMs = new Date(waitUntil).getTime() - Date.now();
        if (waitMs > 0) {
          await sleep(Math.min(waitMs, 30_000));
        }
      } else {
        await sleep(2000 * (attempt + 1));
      }
    }

    throw new Error("Media processing timed out after maximum retries");
  }

  return {
    async get<T>(path: string): Promise<T> {
      return requestWithRetry(() => instance.get<T>(path));
    },

    async post<T>(path: string, body: unknown): Promise<T> {
      return requestWithRetry(() => instance.post<T>(path, body));
    },

    async postFormData<T>(path: string, formData: FormData): Promise<T> {
      // Media uploads may return 202 (processing), so use pollFor202
      return pollFor202(() =>
        instance.post<T>(path, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          validateStatus: (status: number) => status < 500 || status === 202,
        })
      );
    },
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/services/api-client.test.ts`
Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/services/api-client.ts tests/services/api-client.test.ts
git commit -m "feat: add API client with retries, rate limiting, and error handling"
```

---

### Task 5: Common Schemas & Response Formatter (TDD)

**Files:**
- Create: `src/schemas/common.ts`
- Create: `src/services/formatter.ts`
- Create: `tests/services/formatter.test.ts`

- [ ] **Step 1: Create common Zod schemas**

```typescript
// src/schemas/common.ts
import { z } from "zod";

export const ResponseFormatSchema = z
  .enum(["markdown", "json"])
  .default("markdown")
  .describe('Output format: "markdown" (default) for human-readable, "json" for structured data');

export const CustomerIdSchema = z
  .number()
  .int()
  .positive()
  .optional()
  .describe("Override the default customer ID for this request");

export const PageSchema = z
  .number()
  .int()
  .min(1)
  .default(1)
  .describe("Page number (1-indexed)");

export const CursorSchema = z
  .string()
  .optional()
  .describe("Pagination cursor from a previous response");

export const TimezoneSchema = z
  .string()
  .optional()
  .describe('IANA timezone (e.g. "America/Chicago") for date interpretation');

export const DateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
  .describe("Date in YYYY-MM-DD format");

export const SortOrderSchema = z
  .enum(["asc", "desc"])
  .default("desc")
  .describe("Sort order: ascending or descending");
```

- [ ] **Step 2: Write failing tests for formatter**

```typescript
// tests/services/formatter.test.ts
import { describe, it, expect } from "vitest";
import {
  formatAsTable,
  formatAsList,
  formatOutput,
  truncateIfNeeded,
} from "../../src/services/formatter.js";

describe("formatAsTable", () => {
  it("formats array of objects as markdown table", () => {
    const data = [
      { name: "Alice", role: "Admin" },
      { name: "Bob", role: "User" },
    ];
    const result = formatAsTable(data, ["name", "role"]);
    expect(result).toContain("| name | role |");
    expect(result).toContain("| Alice | Admin |");
    expect(result).toContain("| Bob | User |");
  });

  it("returns 'No data' for empty array", () => {
    expect(formatAsTable([], ["a"])).toBe("No data found.");
  });
});

describe("formatAsList", () => {
  it("formats items as bullet list", () => {
    const result = formatAsList(["one", "two", "three"]);
    expect(result).toBe("- one\n- two\n- three");
  });
});

describe("formatOutput", () => {
  it("returns JSON string for json format", () => {
    const data = { foo: "bar" };
    const result = formatOutput(data, "json");
    expect(result).toBe(JSON.stringify(data, null, 2));
  });

  it("returns markdown string for markdown format with custom renderer", () => {
    const data = { name: "Test" };
    const result = formatOutput(data, "markdown", (d) => `Name: ${d.name}`);
    expect(result).toBe("Name: Test");
  });

  it("falls back to JSON if no markdown renderer", () => {
    const data = { name: "Test" };
    const result = formatOutput(data, "markdown");
    expect(result).toBe(JSON.stringify(data, null, 2));
  });
});

describe("truncateIfNeeded", () => {
  it("returns text unchanged when under limit", () => {
    expect(truncateIfNeeded("short", 100)).toBe("short");
  });

  it("truncates and appends message when over limit", () => {
    const input = "a".repeat(200);
    const result = truncateIfNeeded(input, 100);
    expect(result).toContain("truncated");
    expect(result).not.toBe(input);
    // The truncated content (before the message) should be shorter than the limit
    expect(result.indexOf("---")).toBeLessThan(100);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npx vitest run tests/services/formatter.test.ts`
Expected: FAIL.

- [ ] **Step 4: Implement formatter**

```typescript
// src/services/formatter.ts
import { CHARACTER_LIMIT } from "../constants.js";
import type { ResponseFormat } from "../types.js";

/**
 * Format an array of objects as a markdown table.
 */
export function formatAsTable(
  data: Record<string, unknown>[],
  columns: string[]
): string {
  if (data.length === 0) return "No data found.";

  const header = `| ${columns.join(" | ")} |`;
  const separator = `| ${columns.map(() => "---").join(" | ")} |`;
  const rows = data.map(
    (row) => `| ${columns.map((col) => String(row[col] ?? "")).join(" | ")} |`
  );

  return [header, separator, ...rows].join("\n");
}

/**
 * Format strings as a bullet list.
 */
export function formatAsList(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

/**
 * Format data as either JSON or markdown.
 * If markdown and a custom renderer is provided, use it.
 * Otherwise fall back to pretty-printed JSON.
 */
export function formatOutput<T>(
  data: T,
  format: ResponseFormat,
  markdownRenderer?: (data: T) => string
): string {
  if (format === "json") {
    return JSON.stringify(data, null, 2);
  }

  if (markdownRenderer) {
    return markdownRenderer(data);
  }

  return JSON.stringify(data, null, 2);
}

/**
 * Truncate text if it exceeds the character limit.
 */
export function truncateIfNeeded(
  text: string,
  limit: number = CHARACTER_LIMIT
): string {
  if (text.length <= limit) return text;

  const truncationMsg =
    "\n\n---\n*Response truncated. Use pagination parameters (page/cursor) or narrower date ranges to retrieve remaining data.*";
  return text.slice(0, limit - truncationMsg.length) + truncationMsg;
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run tests/services/formatter.test.ts`
Expected: All tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/schemas/common.ts src/services/formatter.ts tests/services/formatter.test.ts
git commit -m "feat: add common schemas and response formatter with tests"
```

---

### Task 6: Metadata Tools

**Files:**
- Create: `src/tools/metadata.ts`
- Create: `tests/tools/metadata.test.ts`

- [ ] **Step 1: Write tests for metadata tools**

Test that each tool calls the correct endpoint and formats the response. Use a mock API client.

Note: `handleListCustomers` takes only 2 args (no `customerId`) since its endpoint `/v1/metadata/client` has no customer_id path segment. All other handlers take 3 args: `(client, customerId, params)`.

```typescript
// tests/tools/metadata.test.ts
import { describe, it, expect, vi } from "vitest";
import type { ApiClient } from "../../src/services/api-client.js";
import {
  handleListCustomers,
  handleListProfiles,
  handleListGroups,
  handleListTags,
  handleListUsers,
  handleListTeams,
  handleListQueues,
  handleListTopics,
} from "../../src/tools/metadata.js";

function mockApiClient(data: unknown): ApiClient {
  return {
    get: vi.fn().mockResolvedValue({ data }),
    post: vi.fn(),
    postFormData: vi.fn(),
  };
}

describe("handleListCustomers", () => {
  it("calls GET /v1/metadata/client and returns data", async () => {
    const client = mockApiClient([{ customer_id: 123, name: "Acme Corp" }]);
    const result = await handleListCustomers(client, { response_format: "json" });
    expect(client.get).toHaveBeenCalledWith("/v1/metadata/client");
    expect(result.content[0]!.text).toContain("123");
  });
});

describe("handleListProfiles", () => {
  it("calls correct endpoint with customer_id", async () => {
    const client = mockApiClient([
      { customer_profile_id: 1, network_type: "instagram", name: "Test" },
    ]);
    const result = await handleListProfiles(client, 999, { response_format: "json" });
    expect(client.get).toHaveBeenCalledWith("/v1/999/metadata/customer");
    expect(result.content[0]!.text).toContain("instagram");
  });
});

describe("handleListGroups", () => {
  it("calls correct endpoint", async () => {
    const client = mockApiClient([{ group_id: 1, name: "Marketing" }]);
    const result = await handleListGroups(client, 999, { response_format: "markdown" });
    expect(client.get).toHaveBeenCalledWith("/v1/999/metadata/customer/groups");
    expect(result.content[0]!.text).toContain("Marketing");
  });
});

describe("handleListTags", () => {
  it("calls correct endpoint", async () => {
    const client = mockApiClient([{ tag_id: 1, text: "Launch", type: "CAMPAIGN", active: true }]);
    const result = await handleListTags(client, 999, { response_format: "json" });
    expect(client.get).toHaveBeenCalledWith("/v1/999/metadata/customer/tags");
    expect(result.content[0]!.text).toContain("Launch");
  });
});

describe("handleListUsers", () => {
  it("calls correct endpoint", async () => {
    const client = mockApiClient([{ id: 1, name: "Alice", email: "alice@co.com" }]);
    const result = await handleListUsers(client, 999, { response_format: "json" });
    expect(client.get).toHaveBeenCalledWith("/v1/999/metadata/customer/users");
    expect(result.content[0]!.text).toContain("Alice");
  });
});

describe("handleListTeams", () => {
  it("calls correct endpoint", async () => {
    const client = mockApiClient([{ id: 1, name: "Social Team", description: "Main team" }]);
    const result = await handleListTeams(client, 999, { response_format: "json" });
    expect(client.get).toHaveBeenCalledWith("/v1/999/metadata/customer/teams");
    expect(result.content[0]!.text).toContain("Social Team");
  });
});

describe("handleListQueues", () => {
  it("calls correct endpoint", async () => {
    const client = mockApiClient([{ id: 1, name: "Support Queue", description: "Main queue" }]);
    const result = await handleListQueues(client, 999, { response_format: "json" });
    expect(client.get).toHaveBeenCalledWith("/v1/999/metadata/customer/queues");
    expect(result.content[0]!.text).toContain("Support Queue");
  });
});

describe("handleListTopics", () => {
  it("calls correct endpoint", async () => {
    const client = mockApiClient([{ id: 1, name: "Brand Mentions", topic_type: "BASIC" }]);
    const result = await handleListTopics(client, 999, { response_format: "json" });
    expect(client.get).toHaveBeenCalledWith("/v1/999/metadata/customer/topics");
    expect(result.content[0]!.text).toContain("Brand Mentions");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/tools/metadata.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement metadata tools**

Implement all 8 metadata tool handlers in `src/tools/metadata.ts`. Each follows the same pattern: call `client.get()`, format the response.

The file should export:
- `handleListCustomers(client, params)` — `GET /v1/metadata/client`
- `handleListProfiles(client, customerId, params)` — `GET /v1/<cid>/metadata/customer`
- `handleListGroups(client, customerId, params)` — `GET /v1/<cid>/metadata/customer/groups`
- `handleListTags(client, customerId, params)` — `GET /v1/<cid>/metadata/customer/tags`
- `handleListUsers(client, customerId, params)` — `GET /v1/<cid>/metadata/customer/users`
- `handleListTeams(client, customerId, params)` — `GET /v1/<cid>/metadata/customer/teams`
- `handleListQueues(client, customerId, params)` — `GET /v1/<cid>/metadata/customer/queues`
- `handleListTopics(client, customerId, params)` — `GET /v1/<cid>/metadata/customer/topics`
- `registerMetadataTools(server, client, defaultCustomerId)` — registers all 8 tools on the MCP server

Each handler:
1. Calls `client.get<SproutApiResponse<T>>(path)`
2. Extracts `.data`
3. Calls `formatOutput(data, params.response_format, markdownRenderer)`
4. Returns `{ content: [{ type: "text", text: truncateIfNeeded(formatted) }] }`

Note: The MCP SDK's `registerTool` handler returns `{ content }`. If `outputSchema` support is confirmed in the SDK version used, add `structuredContent` later. For now, return text-only content (JSON format already provides structured output as text).

The `registerMetadataTools` function calls `server.registerTool()` for each tool with:
- Tool name (e.g., `"sprout_list_profiles"`)
- Title, description, inputSchema (Zod), annotations (`readOnlyHint: true`, etc.)
- Handler that resolves `customer_id` (param override or default), calls the handler function

Markdown renderers per tool:
- **customers**: table with columns `[customer_id, name]`
- **profiles**: table with `[customer_profile_id, network_type, name, native_name]`
- **groups**: table with `[group_id, name]`
- **tags**: table with `[tag_id, text, type, active]`
- **users**: table with `[id, name, email]`
- **teams**: table with `[id, name, description]`
- **queues**: table with `[id, name, description]`
- **topics**: table with `[id, name, topic_type, description]`

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/tools/metadata.test.ts`
Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/tools/metadata.ts tests/tools/metadata.test.ts
git commit -m "feat: add 8 metadata tools (profiles, groups, tags, users, teams, queues, topics)"
```

---

### Task 7: Analytics Tools

**Files:**
- Create: `src/tools/analytics.ts`
- Create: `tests/tools/analytics.test.ts`

- [ ] **Step 1: Write tests for analytics tool handlers**

Test filter construction, request body shape, and response formatting.

```typescript
// tests/tools/analytics.test.ts
import { describe, it, expect, vi } from "vitest";
import type { ApiClient } from "../../src/services/api-client.js";
import {
  handleProfileAnalytics,
  handlePostAnalytics,
} from "../../src/tools/analytics.js";

function mockApiClient(responseData: unknown): ApiClient {
  return {
    get: vi.fn(),
    post: vi.fn().mockResolvedValue({ data: responseData, paging: { current_page: 1, total_pages: 1 } }),
    postFormData: vi.fn(),
  };
}

describe("handleProfileAnalytics", () => {
  it("builds correct filters and request body", async () => {
    const client = mockApiClient([]);
    await handleProfileAnalytics(client, 999, {
      profile_ids: [123, 456],
      start_date: "2024-01-01",
      end_date: "2024-01-31",
      metrics: ["impressions"],
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      "/v1/999/analytics/profiles",
      expect.objectContaining({
        filters: [
          "customer_profile_id.eq(123, 456)",
          "reporting_period.in(2024-01-01..2024-01-31)",
        ],
        metrics: ["impressions"],
      })
    );
  });
});

describe("handlePostAnalytics", () => {
  it("builds correct filters with sort and timezone", async () => {
    const client = mockApiClient([]);
    await handlePostAnalytics(client, 999, {
      profile_ids: [123],
      start_date: "2024-01-01",
      end_date: "2024-02-01",
      metrics: ["lifetime.impressions"],
      fields: ["text", "created_time"],
      sort_order: "asc",
      timezone: "America/Chicago",
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      "/v1/999/analytics/posts",
      expect.objectContaining({
        filters: [
          "customer_profile_id.eq(123)",
          "created_time.in(2024-01-01...2024-02-01)",
        ],
        metrics: ["lifetime.impressions"],
        fields: ["text", "created_time"],
        sort: ["created_time:asc"],
        timezone: "America/Chicago",
      })
    );
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/tools/analytics.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement analytics tools**

Implement in `src/tools/analytics.ts`:

- `handleProfileAnalytics(client, customerId, params)`:
  - Builds filters: `buildEqFilter("customer_profile_id", profile_ids)`, `buildDateRangeFilter("reporting_period", start, end, true)` (end-inclusive)
  - POST body: `{ filters, metrics, page, limit }`
  - Endpoint: `POST /v1/<cid>/analytics/profiles`

- `handlePostAnalytics(client, customerId, params)`:
  - Builds filters: `buildEqFilter("customer_profile_id", profile_ids)`, `buildDateRangeFilter("created_time", start, end, false)` (end-exclusive)
  - POST body: `{ filters, metrics, fields, sort: ["<sort_by>:<sort_order>"], timezone, page, limit }`
  - Endpoint: `POST /v1/<cid>/analytics/posts`

- `registerAnalyticsTools(server, client, defaultCustomerId)`: registers both tools with Zod schemas, annotations, and handlers.

Zod schemas should validate:
- `profile_ids`: `z.array(z.number()).min(1).max(100)`
- `start_date`, `end_date`: `DateSchema`
- `metrics`: `z.array(z.string()).min(1)` for profiles, optional for posts
- `fields`: `z.array(z.string()).optional()` for posts

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/tools/analytics.test.ts`
Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/tools/analytics.ts tests/tools/analytics.test.ts
git commit -m "feat: add profile and post analytics tools"
```

---

### Task 8: Messages Tool

**Files:**
- Create: `src/tools/messages.ts`
- Create: `tests/tools/messages.test.ts`

- [ ] **Step 1: Write tests for messages tool handler**

```typescript
// tests/tools/messages.test.ts
import { describe, it, expect, vi } from "vitest";
import type { ApiClient } from "../../src/services/api-client.js";
import { handleGetMessages } from "../../src/tools/messages.js";

function mockApiClient(responseData: unknown, paging = {}): ApiClient {
  return {
    get: vi.fn(),
    post: vi.fn().mockResolvedValue({ data: responseData, paging }),
    postFormData: vi.fn(),
  };
}

describe("handleGetMessages", () => {
  it("builds filters from profile_ids and date range", async () => {
    const client = mockApiClient([]);
    await handleGetMessages(client, 999, {
      profile_ids: [123],
      start_date: "2024-01-01",
      end_date: "2024-02-01",
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      "/v1/999/messages",
      expect.objectContaining({
        filters: expect.arrayContaining([
          "customer_profile_id.eq(123)",
          "created_time.in(2024-01-01...2024-02-01)",
        ]),
      })
    );
  });

  it("uses page_cursor for pagination", async () => {
    const client = mockApiClient([]);
    await handleGetMessages(client, 999, {
      cursor: "abc123==",
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      "/v1/999/messages",
      expect.objectContaining({
        page_cursor: "abc123==",
      })
    );
  });

  it("passes message_ids as filter when provided", async () => {
    const client = mockApiClient([]);
    await handleGetMessages(client, 999, {
      message_ids: ["msg-1", "msg-2"],
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      "/v1/999/messages",
      expect.objectContaining({
        filters: ["message_id.eq(msg-1, msg-2)"],
      })
    );
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/tools/messages.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement messages tool**

Implement in `src/tools/messages.ts`:

- `handleGetMessages(client, customerId, params)`:
  - If `message_ids` provided, build only `buildEqFilter("message_id", message_ids)` — no other filters
  - Otherwise build filters from: `profile_ids` → `customer_profile_id.eq(...)`, `group_id` → `group_id.eq(...)`, dates → `created_time.in(...)`, `post_types` → `post_type.eq(...)`, `tag_ids` → `tag_id.eq(...)`, `language_code` → `language_code.eq(...)`
  - POST body: `{ filters, fields, sort: ["created_time:<sort_order>"], timezone, limit, page_cursor }`
  - Endpoint: `POST /v1/<cid>/messages`
  - Returns pagination with `next_cursor` from response paging

- `registerMessagesTools(server, client, defaultCustomerId)`: registers the tool with cursor-based pagination schema.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/tools/messages.test.ts`
Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/tools/messages.ts tests/tools/messages.test.ts
git commit -m "feat: add messages tool with cursor pagination"
```

---

### Task 9: Listening Tools

**Files:**
- Create: `src/tools/listening.ts`
- Create: `tests/tools/listening.test.ts`

- [ ] **Step 1: Write tests for listening tool handlers**

```typescript
// tests/tools/listening.test.ts
import { describe, it, expect, vi } from "vitest";
import type { ApiClient } from "../../src/services/api-client.js";
import {
  handleListeningMessages,
  handleListeningMetrics,
} from "../../src/tools/listening.js";

function mockApiClient(responseData: unknown, paging = {}): ApiClient {
  return {
    get: vi.fn(),
    post: vi.fn().mockResolvedValue({ data: responseData, paging }),
    postFormData: vi.fn(),
  };
}

describe("handleListeningMessages", () => {
  it("builds filters with topic_id, dates, and sentiment", async () => {
    const client = mockApiClient([]);
    await handleListeningMessages(client, 999, {
      topic_id: 42,
      start_date: "2024-01-01",
      end_date: "2024-02-01",
      sentiment: "POSITIVE",
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      "/v1/999/listening/topics/42/messages",
      expect.objectContaining({
        filters: expect.arrayContaining([
          "created_time.in(2024-01-01...2024-02-01)",
          "sentiment.eq(POSITIVE)",
        ]),
      })
    );
  });

  it("includes text_search as match filter", async () => {
    const client = mockApiClient([]);
    await handleListeningMessages(client, 999, {
      topic_id: 42,
      start_date: "2024-01-01",
      end_date: "2024-02-01",
      text_search: "sprout OR social",
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        filters: expect.arrayContaining([
          "text.match(sprout OR social)",
        ]),
      })
    );
  });
});

describe("handleListeningMetrics", () => {
  it("sends metrics and dimensions in request body", async () => {
    const client = mockApiClient([]);
    await handleListeningMetrics(client, 999, {
      topic_id: 42,
      start_date: "2024-01-01",
      end_date: "2024-02-01",
      metrics: ["engagements", "messages_count"],
      dimensions: ["created_time.by(day)"],
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      "/v1/999/listening/topics/42/metrics",
      expect.objectContaining({
        metrics: ["engagements", "messages_count"],
        dimensions: ["created_time.by(day)"],
      })
    );
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/tools/listening.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement listening tools**

Implement in `src/tools/listening.ts`:

- `handleListeningMessages(client, customerId, params)`:
  - Filters: dates → `created_time.in(...)`, sentiment → `sentiment.eq(...)`, network → `network.eq(...)`, text_search → `text.match(...)`
  - POST body: `{ filters, fields, sort, timezone, page, limit }`
  - Endpoint: `POST /v1/<cid>/listening/topics/<topic_id>/messages`
  - Index-based pagination

- `handleListeningMetrics(client, customerId, params)`:
  - Filters: dates → `created_time.in(...)`
  - POST body: `{ filters, metrics, dimensions, timezone }`
  - Endpoint: `POST /v1/<cid>/listening/topics/<topic_id>/metrics`
  - No pagination

- `registerListeningTools(server, client, defaultCustomerId)`

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/tools/listening.test.ts`
Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/tools/listening.ts tests/tools/listening.test.ts
git commit -m "feat: add listening messages and metrics tools"
```

---

### Task 10: Publishing Tools

**Files:**
- Create: `src/tools/publishing.ts`
- Create: `tests/tools/publishing.test.ts`

- [ ] **Step 1: Write tests for publishing tool handlers**

```typescript
// tests/tools/publishing.test.ts
import { describe, it, expect, vi } from "vitest";
import type { ApiClient } from "../../src/services/api-client.js";
import {
  handleCreateDraftPost,
  handleUploadMedia,
  handleGetPost,
} from "../../src/tools/publishing.js";

function mockApiClient(responseData: unknown): ApiClient {
  return {
    get: vi.fn().mockResolvedValue({ data: responseData }),
    post: vi.fn().mockResolvedValue({ data: responseData }),
    postFormData: vi.fn().mockResolvedValue(responseData),
  };
}

describe("handleCreateDraftPost", () => {
  it("constructs correct request body with draft=true and delivery wrapper", async () => {
    const client = mockApiClient([{ id: "post-1" }]);
    await handleCreateDraftPost(client, 999, {
      profile_ids: [123, 456],
      group_id: 789,
      text: "Hello world!",
      scheduled_times: ["2024-06-30T18:00:00Z"],
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      "/v1/999/publishing/posts",
      expect.objectContaining({
        customer_profile_ids: [123, 456],
        group_id: 789,
        text: "Hello world!",
        is_draft: true,
        delivery: {
          scheduled_times: ["2024-06-30T18:00:00Z"],
          type: "SCHEDULED",
        },
      })
    );
  });

  it("includes media array with media_id and media_type", async () => {
    const client = mockApiClient([]);
    await handleCreateDraftPost(client, 999, {
      profile_ids: [123],
      group_id: 789,
      text: "Photo post",
      media: [{ media_id: "uuid-1", media_type: "PHOTO" }],
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        media: [{ media_id: "uuid-1", media_type: "PHOTO" }],
      })
    );
  });
});

describe("handleUploadMedia", () => {
  it("sends media_url as form data", async () => {
    const client = mockApiClient({ media_id: "uuid-1", expiration_time: "2024-01-02" });
    await handleUploadMedia(client, 999, {
      media_url: "https://example.com/image.jpg",
      response_format: "json",
    });

    expect(client.postFormData).toHaveBeenCalledWith(
      "/v1/999/media/",
      expect.any(FormData)
    );
  });
});

describe("handleGetPost", () => {
  it("calls correct endpoint", async () => {
    const client = mockApiClient({ id: "post-1", text: "Hello" });
    await handleGetPost(client, 999, {
      post_id: "post-1",
      response_format: "json",
    });

    expect(client.get).toHaveBeenCalledWith("/v1/999/publishing/posts/post-1");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/tools/publishing.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement publishing tools**

Implement in `src/tools/publishing.ts`:

- `handleCreateDraftPost(client, customerId, params)`:
  - Maps `profile_ids` → `customer_profile_ids`
  - Maps `scheduled_times` → `delivery: { scheduled_times, type: "SCHEDULED" }`
  - Always sets `is_draft: true`
  - POST to `/v1/<cid>/publishing/posts`

- `handleUploadMedia(client, customerId, params)`:
  - Creates `FormData` with `media_url` field
  - POST to `/v1/<cid>/media/` using `client.postFormData`
  - Returns `{ media_id, expiration_time }`

- `handleGetPost(client, customerId, params)`:
  - GET `/v1/<cid>/publishing/posts/<post_id>`

- `registerPublishingTools(server, client, defaultCustomerId)`:
  - `sprout_create_draft_post`: `readOnlyHint: false`, `destructiveHint: false`, `idempotentHint: false`
  - `sprout_upload_media`: `readOnlyHint: false`, `destructiveHint: false`, `idempotentHint: false`
  - `sprout_get_post`: `readOnlyHint: true`

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/tools/publishing.test.ts`
Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/tools/publishing.ts tests/tools/publishing.test.ts
git commit -m "feat: add publishing tools (draft post, media upload, get post)"
```

---

### Task 11: Cases Tool

**Files:**
- Create: `src/tools/cases.ts`
- Create: `tests/tools/cases.test.ts`

- [ ] **Step 1: Write tests for cases tool handler**

```typescript
// tests/tools/cases.test.ts
import { describe, it, expect, vi } from "vitest";
import type { ApiClient } from "../../src/services/api-client.js";
import { handleGetCases } from "../../src/tools/cases.js";

function mockApiClient(responseData: unknown, paging = {}): ApiClient {
  return {
    get: vi.fn(),
    post: vi.fn().mockResolvedValue({ data: responseData, paging }),
    postFormData: vi.fn(),
  };
}

describe("handleGetCases", () => {
  it("builds date filter using specified date_field", async () => {
    const client = mockApiClient([]);
    await handleGetCases(client, 999, {
      start_date: "2024-01-01",
      end_date: "2024-01-07",
      date_field: "created_time",
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      "/v1/999/cases/filter",
      expect.objectContaining({
        filters: expect.arrayContaining([
          "created_time.in(2024-01-01...2024-01-07)",
        ]),
      })
    );
  });

  it("defaults date_field to updated_time", async () => {
    const client = mockApiClient([]);
    await handleGetCases(client, 999, {
      start_date: "2024-01-01",
      end_date: "2024-01-07",
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        filters: expect.arrayContaining([
          "updated_time.in(2024-01-01...2024-01-07)",
        ]),
      })
    );
  });

  it("uses case_ids filter when provided (no date filters)", async () => {
    const client = mockApiClient([]);
    await handleGetCases(client, 999, {
      case_ids: [1, 2, 3],
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        filters: ["case_id.eq(1, 2, 3)"],
      })
    );
  });

  it("maps cursor to page_cursor and sort params to sort array", async () => {
    const client = mockApiClient([]);
    await handleGetCases(client, 999, {
      start_date: "2024-01-01",
      end_date: "2024-01-07",
      sort_by: "updated_time",
      sort_order: "asc",
      cursor: "xyz==",
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        sort: ["updated_time:asc"],
        page_cursor: "xyz==",
      })
    );
  });

  it("validates date range does not exceed 1 week", async () => {
    const client = mockApiClient([]);
    const result = await handleGetCases(client, 999, {
      start_date: "2024-01-01",
      end_date: "2024-01-15", // 14 days — too long
      response_format: "json",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0]!.text).toContain("1 week");
  });

  it("returns error when both case_ids and date filters are provided", async () => {
    const client = mockApiClient([]);
    const result = await handleGetCases(client, 999, {
      start_date: "2024-01-01",
      end_date: "2024-01-07",
      case_ids: [1, 2],
      response_format: "json",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0]!.text).toContain("mutually exclusive");
  });

  it("includes status, priority, type filters", async () => {
    const client = mockApiClient([]);
    await handleGetCases(client, 999, {
      start_date: "2024-01-01",
      end_date: "2024-01-07",
      status: ["OPEN", "IN_PROGRESS"],
      priority: ["HIGH"],
      type: ["SUPPORT"],
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        filters: expect.arrayContaining([
          "status.eq(OPEN, IN_PROGRESS)",
          "priority.eq(HIGH)",
          "type.eq(SUPPORT)",
        ]),
      })
    );
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/tools/cases.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement cases tool**

Implement in `src/tools/cases.ts`:

- `handleGetCases(client, customerId, params)`:
  - Validate date range <= 7 days (return error if exceeded)
  - If `case_ids` provided, build only `case_id.eq(...)` filter
  - Otherwise build date filter using `date_field` (default "updated_time") + other filters: `status.eq(...)`, `priority.eq(...)`, `type.eq(...)`, `queue_id.eq(...)`, `assigned_to.eq(...)` (pass the string value as-is — the API accepts both plain IDs and URN strings), `tag_id.eq(...)`
  - Map `cursor` → `page_cursor`, `sort_by` + `sort_order` → `sort: [...]`
  - POST to `/v1/<cid>/cases/filter`

- `registerCasesTools(server, client, defaultCustomerId)`

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/tools/cases.test.ts`
Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/tools/cases.ts tests/tools/cases.test.ts
git commit -m "feat: add cases tool with date range validation"
```

---

### Task 12: Server Entry Point

**Files:**
- Modify: `src/index.ts`

- [ ] **Step 1: Implement the main entry point**

Wire everything together: init auth → init API client → discover customer ID → register all tools → connect stdio transport.

```typescript
// src/index.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createAuthProvider } from "./services/auth.js";
import { createApiClient } from "./services/api-client.js";
import { registerMetadataTools } from "./tools/metadata.js";
import { registerAnalyticsTools } from "./tools/analytics.js";
import { registerMessagesTools } from "./tools/messages.js";
import { registerListeningTools } from "./tools/listening.js";
import { registerPublishingTools } from "./tools/publishing.js";
import { registerCasesTools } from "./tools/cases.js";
import type { SproutApiResponse, SproutCustomer } from "./types.js";

async function main(): Promise<void> {
  // 1. Initialize auth
  const auth = createAuthProvider();
  const client = createApiClient(auth);

  // 2. Discover customer ID
  let defaultCustomerId: number;

  const envCustomerId = process.env.SPROUT_CUSTOMER_ID;
  if (envCustomerId) {
    defaultCustomerId = parseInt(envCustomerId, 10);
    console.error(`Using customer ID from env: ${defaultCustomerId}`);
  } else {
    const response = await client.get<SproutApiResponse<SproutCustomer>>(
      "/v1/metadata/client"
    );
    const customers = response.data;

    if (customers.length === 0) {
      throw new Error("No customers found for this token.");
    } else if (customers.length === 1) {
      defaultCustomerId = customers[0]!.customer_id;
      console.error(`Auto-discovered customer: ${customers[0]!.name} (${defaultCustomerId})`);
    } else {
      const list = customers
        .map((c) => `  - ${c.customer_id}: ${c.name}`)
        .join("\n");
      throw new Error(
        `Multiple customers found. Set SPROUT_CUSTOMER_ID to one of:\n${list}`
      );
    }
  }

  // 3. Create MCP server
  const server = new McpServer({
    name: "sprout-mcp-server",
    version: "1.0.0",
  });

  // 4. Register all tools
  registerMetadataTools(server, client, defaultCustomerId);
  registerAnalyticsTools(server, client, defaultCustomerId);
  registerMessagesTools(server, client, defaultCustomerId);
  registerListeningTools(server, client, defaultCustomerId);
  registerPublishingTools(server, client, defaultCustomerId);
  registerCasesTools(server, client, defaultCustomerId);

  // 5. Connect stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Sprout Social MCP Server running via stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error.message);
  process.exit(1);
});
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No type errors.

- [ ] **Step 3: Build the project**

Run: `npm run build`
Expected: `dist/` directory created with compiled JS files.

- [ ] **Step 4: Run all tests**

Run: `npm test`
Expected: All tests pass across all test files.

- [ ] **Step 5: Commit**

```bash
git add src/index.ts
git commit -m "feat: wire up server entry point with auth, customer discovery, and all tools"
```

---

### Task 13: Build Verification & Documentation

**Files:**
- Verify: all files compile and tests pass
- Create: `CLAUDE.md` (project-specific instructions)

- [ ] **Step 1: Run full build**

Run: `npm run build`
Expected: Clean compilation, `dist/index.js` exists.

- [ ] **Step 2: Run full test suite**

Run: `npm test`
Expected: All tests pass.

- [ ] **Step 3: Create CLAUDE.md for this project**

```markdown
# Sprout Social MCP Server

## Quick Start
- `npm install` — install deps
- `npm run build` — compile TypeScript
- `npm test` — run tests
- `npm start` — run server (requires auth env vars)

## Architecture
- TypeScript MCP server using stdio transport
- 17 tools across 6 domains: metadata, analytics, messages, listening, publishing, cases
- Filter builder translates friendly params to Sprout's custom DSL
- Dual auth: API token or OAuth M2M

## Key Patterns
- All tool handlers are pure functions: `handler(client, customerId, params) → ToolResponse`
- Tool registration is grouped by domain in `src/tools/*.ts`
- Filter DSL construction is centralized in `src/services/filter-builder.ts`
- Response formatting supports markdown (default) and JSON

## Testing
- Unit tests in `tests/` mirror `src/` structure
- Mock the ApiClient interface for tool handler tests
- Filter builder tests are pure (no mocking needed)

## Environment Variables
- `SPROUT_API_TOKEN` — static token (simplest auth)
- `SPROUT_CLIENT_ID` + `SPROUT_CLIENT_SECRET` + `SPROUT_ORG_ID` — OAuth M2M
- `SPROUT_CUSTOMER_ID` — optional, for multi-customer setups
```

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add CLAUDE.md with project overview and dev instructions"
```

---

### Task 14: MCP Client Configuration

**Files:**
- Document: Claude Code MCP config

- [ ] **Step 1: Verify the server starts without crashing (dry run)**

Run: `echo '{}' | timeout 2 node dist/index.js 2>&1 || true`
Expected: Should see auth error (no token set) — confirms the binary runs and produces a useful error.

- [ ] **Step 2: Document Claude Code configuration**

The user should add this to their Claude Code MCP settings (`.claude/settings.json` or project-level):

```json
{
  "mcpServers": {
    "sprout": {
      "command": "node",
      "args": ["/path/to/sprout-mcp-server/dist/index.js"],
      "env": {
        "SPROUT_API_TOKEN": "<your-token>"
      }
    }
  }
}
```

- [ ] **Step 3: Final commit with all remaining files**

```bash
git add -A
git commit -m "chore: final build verification and MCP client config docs"
```
