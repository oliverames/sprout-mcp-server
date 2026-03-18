import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

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
