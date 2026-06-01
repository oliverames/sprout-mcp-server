import axios from "axios";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
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
    if (this.cachedToken && Date.now() < this.expiresAt - 60_000) {
      return this.cachedToken;
    }

    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.refresh();
    try {
      return await this.refreshPromise;
    } catch (error) {
      this.cachedToken = null;
      this.expiresAt = 0;
      throw error;
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

interface UserTokenData {
  client_id?: string;
  client_secret?: string;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

class OAuthUserBasedProvider implements AuthProvider {
  private cachedToken: string | null = null;
  private expiresAt = 0;
  private tokenPath: string;
  private refreshPromise: Promise<string> | null = null;

  constructor(
    private clientId?: string,
    private clientSecret?: string
  ) {
    this.tokenPath = path.join(os.homedir(), ".sprout-mcp-auth.json");
  }

  async getToken(): Promise<string> {
    if (this.cachedToken && Date.now() < this.expiresAt - 60_000) {
      return this.cachedToken;
    }

    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.resolveAndRefreshToken();
    try {
      return await this.refreshPromise;
    } catch (error) {
      this.cachedToken = null;
      this.expiresAt = 0;
      throw error;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async resolveAndRefreshToken(): Promise<string> {
    if (!fs.existsSync(this.tokenPath)) {
      throw new Error(
        "Sprout Social MCP Server: No user login credentials found. Please run 'npm run login' to authenticate your personal account."
      );
    }

    let tokenData: UserTokenData;
    try {
      const content = fs.readFileSync(this.tokenPath, "utf-8");
      tokenData = JSON.parse(content);
    } catch (error: any) {
      throw new Error(`Failed to parse token storage file: ${error.message}. Please run 'npm run login' again.`);
    }

    if (!tokenData.access_token || !tokenData.refresh_token) {
      throw new Error("Invalid token storage file. Please run 'npm run login' to re-authenticate.");
    }

    const activeClientId = this.clientId || tokenData.client_id;
    const activeClientSecret = this.clientSecret || tokenData.client_secret;

    if (tokenData.expires_at && Date.now() < tokenData.expires_at - 60_000) {
      this.cachedToken = tokenData.access_token;
      this.expiresAt = tokenData.expires_at;
      return this.cachedToken;
    }

    if (!activeClientId) {
      throw new Error(
        "Sprout Social MCP Server: Missing OAuth client credentials. Please set SPROUT_CLIENT_ID (and SPROUT_CLIENT_SECRET for a confidential client), or run 'npm run login' to re-authenticate."
      );
    }

    try {
      const params = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: tokenData.refresh_token,
        client_id: activeClientId,
      });
      // Confidential clients include the secret; public/PKCE clients refresh
      // with the client_id alone (the secret was never issued).
      if (activeClientSecret) {
        params.set("client_secret", activeClientSecret);
      }

      const response = await axios.post<OAuthTokenResponse & { refresh_token?: string }>(
        OAUTH_TOKEN_ENDPOINT,
        params.toString(),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      const newAccessToken = response.data.access_token;
      const newRefreshToken = response.data.refresh_token || tokenData.refresh_token;
      const newExpiresAt = Date.now() + response.data.expires_in * 1000;

      const updatedTokenData: UserTokenData = {
        client_id: activeClientId,
        client_secret: activeClientSecret,
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        expires_at: newExpiresAt,
      };

      fs.writeFileSync(this.tokenPath, JSON.stringify(updatedTokenData, null, 2), "utf-8");

      this.cachedToken = newAccessToken;
      this.expiresAt = newExpiresAt;
      return this.cachedToken;
    } catch (error: any) {
      const status = error.response?.status;
      const data = error.response?.data;
      console.error("❌ Failed to refresh Sprout OAuth access token:", data || error.message);
      
      if (status === 400 || status === 401) {
        throw new Error(
          "Your Sprout Social login session has expired or been revoked. Please run 'npm run login' to re-authenticate."
        );
      }
      throw new Error(`Failed to refresh authentication token: ${error.message}`);
    }
  }
}

export function createAuthProvider(): AuthProvider | null {
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

  // Interactive user login (Option B). A client ID alone is enough — the
  // browser flow uses PKCE, so a public client needs no secret. A secret is
  // still honored when present (confidential client).
  if (clientId) {
    return new OAuthUserBasedProvider(clientId, clientSecret);
  }

  const tokenPath = path.join(os.homedir(), ".sprout-mcp-auth.json");
  if (fs.existsSync(tokenPath)) {
    return new OAuthUserBasedProvider();
  }

  return null;
}
