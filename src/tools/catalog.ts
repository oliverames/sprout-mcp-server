import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ApiClient } from "../services/api-client.js";
import { registerAnalyticsTools } from "./analytics.js";
import { registerCasesTools } from "./cases.js";
import { registerListeningTools } from "./listening.js";
import { registerMessagesTools } from "./messages.js";
import { registerMetadataTools } from "./metadata.js";
import { registerPublishingTools } from "./publishing.js";

export const SPROUT_TOOL_NAMES = [
  "sprout_auth_status",
  "sprout_list_customers",
  "sprout_list_profiles",
  "sprout_list_groups",
  "sprout_list_tags",
  "sprout_list_users",
  "sprout_list_teams",
  "sprout_list_queues",
  "sprout_list_topics",
  "sprout_get_profile_analytics",
  "sprout_get_post_analytics",
  "sprout_compile_performance_report",
  "sprout_compare_profiles",
  "sprout_get_messages",
  "sprout_get_all_messages",
  "sprout_get_listening_messages",
  "sprout_get_listening_metrics",
  "sprout_analyze_listening_trends",
  "sprout_create_draft_post",
  "sprout_upload_media",
  "sprout_get_post",
  "sprout_start_multipart_upload",
  "sprout_continue_multipart_upload",
  "sprout_complete_multipart_upload",
  "sprout_draft_campaign",
  "sprout_schedule_campaign_queue",
  "sprout_get_cases",
  "sprout_triage_support_cases",
] as const;

export const SPROUT_TOOL_COUNT = SPROUT_TOOL_NAMES.length;

export function authStatusMessage(authenticated: boolean): string {
  if (authenticated) {
    return "✅ Sprout Social MCP server is authenticated and the full tool catalog is registered.";
  }

  return "⚠️ Sprout Social MCP server is running but not authenticated.\n\n" +
    "There are two ways to connect:\n\n" +
    "Option A, token or machine auth (best for unattended automation):\n" +
    "  • Static API token:  SPROUT_API_TOKEN=your-token\n" +
    "  • OAuth M2M:         SPROUT_CLIENT_ID + SPROUT_CLIENT_SECRET + SPROUT_ORG_ID\n\n" +
    "Option B, sign in with Sprout (best for a person):\n" +
    "  1. Set SPROUT_CLIENT_ID (no client secret needed because this flow uses PKCE).\n" +
    "  2. Run `npm run login` and sign in at Sprout's login page in your browser.\n" +
    "     Your session is saved locally and refreshed automatically.\n\n" +
    "The full Sprout tool catalog is still registered for discovery, but API tools will fail until authentication is configured.";
}

export function registerSproutTools(
  server: McpServer,
  client: ApiClient,
  defaultCustomerId: number,
  authenticated: boolean
): void {
  server.tool(
    "sprout_auth_status",
    "Check Sprout Social authentication status and get setup instructions",
    {},
    async () => ({
      content: [{
        type: "text" as const,
        text: authStatusMessage(authenticated),
      }],
    })
  );

  registerMetadataTools(server, client, defaultCustomerId);
  registerAnalyticsTools(server, client, defaultCustomerId);
  registerMessagesTools(server, client, defaultCustomerId);
  registerListeningTools(server, client, defaultCustomerId);
  registerPublishingTools(server, client, defaultCustomerId);
  registerCasesTools(server, client, defaultCustomerId);
}
