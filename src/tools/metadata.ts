import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ApiClient } from "../services/api-client.js";
import { formatAsTable, formatOutput, truncateIfNeeded, safeToolCall } from "../services/formatter.js";
import { ResponseFormatSchema, CustomerIdSchema } from "../schemas/common.js";
import type {
  SproutApiResponse,
  SproutCustomer,
  SproutProfile,
  SproutGroup,
  SproutTag,
  SproutUser,
  SproutTeam,
  SproutQueue,
  SproutTopic,
  ToolResponse,
  ResponseFormat,
} from "../types.js";

interface FormatParams {
  response_format: ResponseFormat;
}

export async function handleListCustomers(
  client: ApiClient,
  params: FormatParams
): Promise<ToolResponse> {
  const response = await client.get<SproutApiResponse<SproutCustomer>>("/v1/metadata/client");
  const text = formatOutput(response.data, params.response_format, (data) =>
    formatAsTable(data, ["customer_id", "name"])
  );
  return { content: [{ type: "text" as const, text: truncateIfNeeded(text) }] };
}

export async function handleListProfiles(
  client: ApiClient,
  customerId: number,
  params: FormatParams
): Promise<ToolResponse> {
  const response = await client.get<SproutApiResponse<SproutProfile>>(
    `/v1/${customerId}/metadata/customer`
  );
  const text = formatOutput(response.data, params.response_format, (data) =>
    formatAsTable(data, [
      "customer_profile_id",
      "network_type",
      "name",
      "native_name",
      "native_id",
    ])
  );
  return { content: [{ type: "text" as const, text: truncateIfNeeded(text) }] };
}

export async function handleListGroups(
  client: ApiClient,
  customerId: number,
  params: FormatParams
): Promise<ToolResponse> {
  const response = await client.get<SproutApiResponse<SproutGroup>>(
    `/v1/${customerId}/metadata/customer/groups`
  );
  const text = formatOutput(response.data, params.response_format, (data) =>
    formatAsTable(data, ["group_id", "name"])
  );
  return { content: [{ type: "text" as const, text: truncateIfNeeded(text) }] };
}

export async function handleListTags(
  client: ApiClient,
  customerId: number,
  params: FormatParams
): Promise<ToolResponse> {
  const response = await client.get<SproutApiResponse<SproutTag>>(
    `/v1/${customerId}/metadata/customer/tags`
  );
  const text = formatOutput(response.data, params.response_format, (data) =>
    formatAsTable(data, ["tag_id", "text", "type", "active"])
  );
  return { content: [{ type: "text" as const, text: truncateIfNeeded(text) }] };
}

export async function handleListUsers(
  client: ApiClient,
  customerId: number,
  params: FormatParams
): Promise<ToolResponse> {
  const response = await client.get<SproutApiResponse<SproutUser>>(
    `/v1/${customerId}/metadata/customer/users`
  );
  const text = formatOutput(response.data, params.response_format, (data) =>
    formatAsTable(data, ["id", "name", "email"])
  );
  return { content: [{ type: "text" as const, text: truncateIfNeeded(text) }] };
}

export async function handleListTeams(
  client: ApiClient,
  customerId: number,
  params: FormatParams
): Promise<ToolResponse> {
  const response = await client.get<SproutApiResponse<SproutTeam>>(
    `/v1/${customerId}/metadata/customer/teams`
  );
  const text = formatOutput(response.data, params.response_format, (data) =>
    formatAsTable(data, ["id", "name", "description"])
  );
  return { content: [{ type: "text" as const, text: truncateIfNeeded(text) }] };
}

export async function handleListQueues(
  client: ApiClient,
  customerId: number,
  params: FormatParams
): Promise<ToolResponse> {
  const response = await client.get<SproutApiResponse<SproutQueue>>(
    `/v1/${customerId}/metadata/customer/queues`
  );
  const text = formatOutput(response.data, params.response_format, (data) =>
    formatAsTable(data, ["id", "name", "description"])
  );
  return { content: [{ type: "text" as const, text: truncateIfNeeded(text) }] };
}

export async function handleListTopics(
  client: ApiClient,
  customerId: number,
  params: FormatParams
): Promise<ToolResponse> {
  const response = await client.get<SproutApiResponse<SproutTopic>>(
    `/v1/${customerId}/metadata/customer/topics`
  );
  const text = formatOutput(response.data, params.response_format, (data) =>
    formatAsTable(data, ["id", "name", "topic_type", "description"])
  );
  return { content: [{ type: "text" as const, text: truncateIfNeeded(text) }] };
}

const TOOL_ANNOTATIONS = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: true,
} as const;

export function registerMetadataTools(
  server: McpServer,
  client: ApiClient,
  defaultCustomerId: number
): void {
  server.registerTool(
    "sprout_list_customers",
    {
      title: "List Customers",
      description: "List customer IDs and names accessible to your token.",
      inputSchema: z
        .object({
          response_format: ResponseFormatSchema,
        })
        .strict(),
      annotations: TOOL_ANNOTATIONS,
    },
    async (params) => safeToolCall(() =>
      handleListCustomers(client, { response_format: params.response_format })
    )
  );

  server.registerTool(
    "sprout_list_profiles",
    {
      title: "List Profiles",
      description: "List social profiles with network type, native name, and group membership.",
      inputSchema: z
        .object({
          customer_id: CustomerIdSchema,
          response_format: ResponseFormatSchema,
        })
        .strict(),
      annotations: TOOL_ANNOTATIONS,
    },
    async (params) => safeToolCall(() => {
      const cid = params.customer_id ?? defaultCustomerId;
      return handleListProfiles(client, cid, { response_format: params.response_format });
    })
  );

  server.registerTool(
    "sprout_list_groups",
    {
      title: "List Groups",
      description: "List profile groups.",
      inputSchema: z
        .object({
          customer_id: CustomerIdSchema,
          response_format: ResponseFormatSchema,
        })
        .strict(),
      annotations: TOOL_ANNOTATIONS,
    },
    async (params) => safeToolCall(() => {
      const cid = params.customer_id ?? defaultCustomerId;
      return handleListGroups(client, cid, { response_format: params.response_format });
    })
  );

  server.registerTool(
    "sprout_list_tags",
    {
      title: "List Tags",
      description: "List message tags (labels and campaigns, active and archived).",
      inputSchema: z
        .object({
          customer_id: CustomerIdSchema,
          response_format: ResponseFormatSchema,
        })
        .strict(),
      annotations: TOOL_ANNOTATIONS,
    },
    async (params) => safeToolCall(() => {
      const cid = params.customer_id ?? defaultCustomerId;
      return handleListTags(client, cid, { response_format: params.response_format });
    })
  );

  server.registerTool(
    "sprout_list_users",
    {
      title: "List Users",
      description: "List active users (id, name, email).",
      inputSchema: z
        .object({
          customer_id: CustomerIdSchema,
          response_format: ResponseFormatSchema,
        })
        .strict(),
      annotations: TOOL_ANNOTATIONS,
    },
    async (params) => safeToolCall(() => {
      const cid = params.customer_id ?? defaultCustomerId;
      return handleListUsers(client, cid, { response_format: params.response_format });
    })
  );

  server.registerTool(
    "sprout_list_teams",
    {
      title: "List Teams",
      description: "List teams (id, name, description).",
      inputSchema: z
        .object({
          customer_id: CustomerIdSchema,
          response_format: ResponseFormatSchema,
        })
        .strict(),
      annotations: TOOL_ANNOTATIONS,
    },
    async (params) => safeToolCall(() => {
      const cid = params.customer_id ?? defaultCustomerId;
      return handleListTeams(client, cid, { response_format: params.response_format });
    })
  );

  server.registerTool(
    "sprout_list_queues",
    {
      title: "List Queues",
      description: "List case queues with associated teams.",
      inputSchema: z
        .object({
          customer_id: CustomerIdSchema,
          response_format: ResponseFormatSchema,
        })
        .strict(),
      annotations: TOOL_ANNOTATIONS,
    },
    async (params) => safeToolCall(() => {
      const cid = params.customer_id ?? defaultCustomerId;
      return handleListQueues(client, cid, { response_format: params.response_format });
    })
  );

  server.registerTool(
    "sprout_list_topics",
    {
      title: "List Topics",
      description: "List listening topics with themes and availability windows.",
      inputSchema: z
        .object({
          customer_id: CustomerIdSchema,
          response_format: ResponseFormatSchema,
        })
        .strict(),
      annotations: TOOL_ANNOTATIONS,
    },
    async (params) => safeToolCall(() => {
      const cid = params.customer_id ?? defaultCustomerId;
      return handleListTopics(client, cid, { response_format: params.response_format });
    })
  );
}
