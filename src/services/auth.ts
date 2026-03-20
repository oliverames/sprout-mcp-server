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

  return null;
}
