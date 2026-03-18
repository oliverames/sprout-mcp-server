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
