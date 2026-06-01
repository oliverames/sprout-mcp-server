#!/usr/bin/env node
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
import { resolveApiKey } from "./op-fallback.js";

async function main(): Promise<void> {
  // 1. Create MCP server (always starts, even without auth)
  const server = new McpServer({
    name: "sprout-mcp-server",
    version: "1.3.0",
  });

  // 2. Resolve credentials from 1Password if not already set
  resolveApiKey("SPROUT_API_TOKEN", "op://Development/Sprout API Token/credential");
  resolveApiKey("SPROUT_CLIENT_ID", "op://Development/Sprout OAuth Client/client_id");
  resolveApiKey("SPROUT_CLIENT_SECRET", "op://Development/Sprout OAuth Client/client_secret");
  resolveApiKey("SPROUT_ORG_ID", "op://Development/Sprout OAuth Client/org_id");

  // 3. Check authentication
  const auth = createAuthProvider();

  if (!auth) {
    // No credentials — register a single tool that explains what's needed
    console.error("Sprout Social MCP Server: no authentication configured. Starting in unauthenticated mode.");
    server.tool(
      "sprout_auth_status",
      "Check Sprout Social authentication status and get setup instructions",
      {},
      async () => ({
        content: [{
          type: "text" as const,
          text: "⚠️ Sprout Social MCP server is running but not authenticated.\n\n" +
            "There are two ways to connect:\n\n" +
            "Option A — Token / machine auth (best for unattended automation):\n" +
            "  • Static API token:  SPROUT_API_TOKEN=your-token\n" +
            "  • OAuth M2M:         SPROUT_CLIENT_ID + SPROUT_CLIENT_SECRET + SPROUT_ORG_ID\n\n" +
            "Option B — Sign in with Sprout (best for a person):\n" +
            "  1. Set SPROUT_CLIENT_ID (no client secret needed — this flow uses PKCE).\n" +
            "  2. Run `npm run login` and sign in at Sprout's login page in your browser.\n" +
            "     Your session is saved locally and refreshed automatically.\n\n" +
            "After connecting, restart Claude Code to pick up the changes."
        }]
      })
    );

    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Sprout Social MCP Server running (unauthenticated mode)");
    return;
  }

  // 3. Authenticated — set up API client and discover customer
  const client = createApiClient(auth);
  let defaultCustomerId: number;

  const envCustomerId = process.env.SPROUT_CUSTOMER_ID;
  if (envCustomerId) {
    defaultCustomerId = parseInt(envCustomerId, 10);
    if (isNaN(defaultCustomerId)) {
      throw new Error(`Invalid SPROUT_CUSTOMER_ID: "${envCustomerId}" is not a number.`);
    }
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

process.on("SIGINT", () => {
  console.error("Sprout Social MCP Server shutting down (SIGINT)");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.error("Sprout Social MCP Server shutting down (SIGTERM)");
  process.exit(0);
});
