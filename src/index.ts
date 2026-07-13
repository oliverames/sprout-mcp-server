#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createAuthProvider, type AuthProvider } from "./services/auth.js";
import { createApiClient } from "./services/api-client.js";
import { SERVER_VERSION } from "./constants.js";
import { registerSproutTools } from "./tools/catalog.js";
import type { SproutApiResponse, SproutCustomer } from "./types.js";
import { resolveApiKey } from "./op-fallback.js";

class MissingAuthProvider implements AuthProvider {
  async getToken(): Promise<string> {
    throw new Error(
      "Sprout Social MCP server is not authenticated. Set SPROUT_API_TOKEN, set SPROUT_CLIENT_ID + SPROUT_CLIENT_SECRET + SPROUT_ORG_ID, or run npm run login."
    );
  }
}

async function main(): Promise<void> {
  // 1. Create MCP server (always starts, even without auth)
  const server = new McpServer({
    name: "sprout-mcp-server",
    version: SERVER_VERSION,
  });

  // 2. Resolve credentials from 1Password if not already set
  resolveApiKey("SPROUT_API_TOKEN", "op://Development/Sprout API Token/credential");
  resolveApiKey("SPROUT_CLIENT_ID", "op://Development/Sprout OAuth Client/client_id");
  resolveApiKey("SPROUT_CLIENT_SECRET", "op://Development/Sprout OAuth Client/client_secret");
  resolveApiKey("SPROUT_ORG_ID", "op://Development/Sprout OAuth Client/org_id");

  // 3. Check authentication
  const auth = createAuthProvider();
  const authenticated = !!auth;

  // 3. Set up API client and discover customer when authentication is present.
  // Missing auth still registers the full tool catalog so tools remain discoverable.
  const client = createApiClient(auth ?? new MissingAuthProvider());
  let defaultCustomerId: number;

  const envCustomerId = process.env.SPROUT_CUSTOMER_ID;
  if (envCustomerId) {
    defaultCustomerId = parseInt(envCustomerId, 10);
    if (isNaN(defaultCustomerId)) {
      throw new Error(`Invalid SPROUT_CUSTOMER_ID: "${envCustomerId}" is not a number.`);
    }
    console.error(`Using customer ID from env: ${defaultCustomerId}`);
  } else if (authenticated) {
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
  } else {
    defaultCustomerId = 0;
    console.error("Sprout Social MCP Server: no authentication configured. Registering all tools in discovery-only mode.");
  }

  // 4. Register all tools
  registerSproutTools(server, client, defaultCustomerId, authenticated);

  // 5. Connect stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Sprout Social MCP Server running via stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error.message);
  process.exit(1);
});

process.on("SIGINT", () => {
  console.error("Sprout Social MCP Server shutting down (SIGINT)");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.error("Sprout Social MCP Server shutting down (SIGTERM)");
  process.exit(0);
});
