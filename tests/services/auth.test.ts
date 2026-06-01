import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import os from "node:os";

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
    expect(provider).not.toBeNull();
    expect(await provider!.getToken()).toBe("test-token-123");
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
    expect(provider).not.toBeNull();
    const token = await provider!.getToken();

    expect(token).toBe("oauth-jwt-token");
    expect(mockPost).toHaveBeenCalledWith(
      expect.stringContaining("identity.sproutsocial.com"),
      expect.any(String),
      expect.objectContaining({
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
    );
  });

  it("returns null when no auth env vars are set", () => {
    const provider = createAuthProvider();
    expect(provider).toBeNull();
  });

  it("prefers API token over OAuth when both are set", async () => {
    vi.stubEnv("SPROUT_API_TOKEN", "static-token");
    vi.stubEnv("SPROUT_CLIENT_ID", "client-id");
    vi.stubEnv("SPROUT_CLIENT_SECRET", "client-secret");
    vi.stubEnv("SPROUT_ORG_ID", "org-123");

    const provider = createAuthProvider();
    expect(provider).not.toBeNull();
    expect(await provider!.getToken()).toBe("static-token");
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
    expect(provider).not.toBeNull();
    await provider!.getToken();
    await provider!.getToken();
    await provider!.getToken();

    expect(mockPost).toHaveBeenCalledTimes(1);
  });

  it("clears cached token on OAuth refresh failure and retries on next call", async () => {
    vi.stubEnv("SPROUT_CLIENT_ID", "client-id");
    vi.stubEnv("SPROUT_CLIENT_SECRET", "client-secret");
    vi.stubEnv("SPROUT_ORG_ID", "org-123");

    const axios = await import("axios");
    const mockPost = vi.fn()
      .mockRejectedValueOnce(new Error("Token endpoint down"))
      .mockResolvedValueOnce({
        data: { access_token: "recovered-token", expires_in: 3600 },
      });
    vi.mocked(axios.default).post = mockPost;

    const provider = createAuthProvider();
    expect(provider).not.toBeNull();

    await expect(provider!.getToken()).rejects.toThrow("Token endpoint down");

    const token = await provider!.getToken();
    expect(token).toBe("recovered-token");
    expect(mockPost).toHaveBeenCalledTimes(2);
  });

  describe("OAuthUserBasedProvider", () => {
    beforeEach(() => {
      vi.stubEnv("SPROUT_CLIENT_ID", "client-id");
      vi.stubEnv("SPROUT_CLIENT_SECRET", "client-secret");
      // SPROUT_ORG_ID is not set, so it selects User-Based OAuth
      vi.spyOn(os, "homedir").mockReturnValue("/mock-home");
    });

    it("returns User-Based OAuth provider when client credentials are set without org ID", () => {
      const provider = createAuthProvider();
      expect(provider).not.toBeNull();
      expect(provider!.constructor.name).toBe("OAuthUserBasedProvider");
    });

    it("throws if token storage file does not exist", async () => {
      vi.spyOn(fs, "existsSync").mockReturnValue(false);
      const provider = createAuthProvider();
      await expect(provider!.getToken()).rejects.toThrow("No user login credentials found");
    });

    it("returns access token from file if valid", async () => {
      vi.spyOn(fs, "existsSync").mockReturnValue(true);
      vi.spyOn(fs, "readFileSync").mockReturnValue(
        JSON.stringify({
          access_token: "file-access-token",
          refresh_token: "file-refresh-token",
          expires_at: Date.now() + 3600 * 1000,
        })
      );

      const provider = createAuthProvider();
      const token = await provider!.getToken();
      expect(token).toBe("file-access-token");
    });

    it("refreshes access token from file if expired", async () => {
      vi.spyOn(fs, "existsSync").mockReturnValue(true);
      vi.spyOn(fs, "readFileSync").mockReturnValue(
        JSON.stringify({
          access_token: "old-access-token",
          refresh_token: "file-refresh-token",
          expires_at: Date.now() - 3600 * 1000, // expired
        })
      );
      const mockWrite = vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});

      const axios = await import("axios");
      const mockPost = vi.fn().mockResolvedValue({
        data: {
          access_token: "new-access-token",
          refresh_token: "new-refresh-token",
          expires_in: 3600,
        },
      });
      vi.mocked(axios.default).post = mockPost;

      const provider = createAuthProvider();
      const token = await provider!.getToken();

      expect(token).toBe("new-access-token");
      expect(mockPost).toHaveBeenCalledWith(
        expect.stringContaining("identity.sproutsocial.com"),
        expect.stringContaining("grant_type=refresh_token"),
        expect.any(Object)
      );
      expect(mockWrite).toHaveBeenCalled();
    });
    it("instantiates provider when no env vars are set but token file exists", () => {
      vi.unstubAllEnvs();
      vi.spyOn(fs, "existsSync").mockReturnValue(true);

      const provider = createAuthProvider();
      expect(provider).not.toBeNull();
      expect(provider!.constructor.name).toBe("OAuthUserBasedProvider");
    });

    it("refreshes token using client credentials loaded from file when env vars are missing", async () => {
      vi.unstubAllEnvs();
      vi.spyOn(fs, "existsSync").mockReturnValue(true);
      vi.spyOn(fs, "readFileSync").mockReturnValue(
        JSON.stringify({
          client_id: "file-client-id",
          client_secret: "file-client-secret",
          access_token: "old-access-token",
          refresh_token: "file-refresh-token",
          expires_at: Date.now() - 3600 * 1000, // expired
        })
      );
      const mockWrite = vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});

      const axios = await import("axios");
      const mockPost = vi.fn().mockResolvedValue({
        data: {
          access_token: "new-access-token",
          refresh_token: "new-refresh-token",
          expires_in: 3600,
        },
      });
      vi.mocked(axios.default).post = mockPost;

      const provider = createAuthProvider();
      const token = await provider!.getToken();

      expect(token).toBe("new-access-token");
      expect(mockPost).toHaveBeenCalledWith(
        expect.stringContaining("identity.sproutsocial.com"),
        expect.stringContaining("client_id=file-client-id&client_secret=file-client-secret"),
        expect.any(Object)
      );
      expect(mockWrite).toHaveBeenCalled();
    });

    it("throws error if token is expired and no client credentials exist in env or file", async () => {
      vi.unstubAllEnvs();
      vi.spyOn(fs, "existsSync").mockReturnValue(true);
      vi.spyOn(fs, "readFileSync").mockReturnValue(
        JSON.stringify({
          access_token: "old-access-token",
          refresh_token: "file-refresh-token",
          expires_at: Date.now() - 3600 * 1000,
        })
      );

      const provider = createAuthProvider();
      await expect(provider!.getToken()).rejects.toThrow("Missing OAuth client credentials");
    });
  });
});
