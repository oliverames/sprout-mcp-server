import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ApiClient } from "../services/api-client.js";
import { buildEqFilter, buildDateRangeFilter } from "../services/filter-builder.js";
import { formatAsTable, formatOutput, truncateIfNeeded, safeToolCall } from "../services/formatter.js";
import {
  ResponseFormatSchema,
  CustomerIdSchema,
  CursorSchema,
  DateSchema,
  SortOrderSchema,
  TimezoneSchema,
} from "../schemas/common.js";
import { MAX_MESSAGE_IDS_PER_REQUEST } from "../constants.js";
import type { SproutApiResponse, ToolResponse, ResponseFormat } from "../types.js";

interface GetMessagesParams {
  profile_ids?: number[];
  group_id?: number;
  start_date?: string;
  end_date?: string;
  post_types?: string[];
  tag_ids?: number[];
  language_codes?: string[];
  from_guids?: string[];
  action_last_update_start?: string;
  action_last_update_end?: string;
  message_ids?: string[];
  fields?: string[];
  sort_order?: "asc" | "desc";
  timezone?: string;
  limit?: number;
  cursor?: string;
  response_format: ResponseFormat;
}

export async function handleGetMessages(
  client: ApiClient,
  customerId: number,
  params: GetMessagesParams
): Promise<ToolResponse> {
  let filters: string[];

  if ((params.start_date && !params.end_date) || (!params.start_date && params.end_date)) {
    return {
      isError: true,
      content: [{ type: "text" as const, text: "Both start_date and end_date are required when using date filters." }],
    };
  }

  if ((params.action_last_update_start && !params.action_last_update_end) ||
      (!params.action_last_update_start && params.action_last_update_end)) {
    return {
      isError: true,
      content: [{ type: "text" as const, text: "Both action_last_update_start and action_last_update_end are required when filtering by action time." }],
    };
  }

  if (params.message_ids && params.message_ids.length > 0) {
    filters = [buildEqFilter("message_id", params.message_ids)];
  } else {
    filters = [];
    if (params.profile_ids && params.profile_ids.length > 0) {
      filters.push(buildEqFilter("customer_profile_id", params.profile_ids));
    }
    if (params.group_id !== undefined) {
      filters.push(buildEqFilter("group_id", [params.group_id]));
    }
    if (params.start_date && params.end_date) {
      filters.push(buildDateRangeFilter("created_time", params.start_date, params.end_date, false));
    }
    if (params.post_types && params.post_types.length > 0) {
      filters.push(buildEqFilter("post_type", params.post_types));
    }
    if (params.tag_ids && params.tag_ids.length > 0) {
      filters.push(buildEqFilter("tag_id", params.tag_ids));
    }
    if (params.language_codes && params.language_codes.length > 0) {
      filters.push(buildEqFilter("language_code", params.language_codes));
    }
    if (params.from_guids && params.from_guids.length > 0) {
      filters.push(buildEqFilter("from.guid", params.from_guids));
    }
    if (params.action_last_update_start && params.action_last_update_end) {
      filters.push(buildDateRangeFilter("action_last_update_time", params.action_last_update_start, params.action_last_update_end, false));
    }
  }

  const sortOrder = params.sort_order ?? "desc";
  const body: Record<string, unknown> = {
    filters,
    sort: [`created_time:${sortOrder}`],
  };

  if (params.fields !== undefined) body.fields = params.fields;
  if (params.timezone !== undefined) body.timezone = params.timezone;
  if (params.limit !== undefined) body.limit = params.limit;
  if (params.cursor !== undefined) body.page_cursor = params.cursor;

  const response = await client.post<SproutApiResponse<object>>(
    `/v1/${customerId}/messages`,
    body
  );

  const paging = response.paging as { next_cursor?: string } | undefined;
  const text = formatOutput(
    response.data,
    params.response_format,
    (data) => formatAsTable(data as object[], params.fields ?? ["created_time"]),
    paging?.next_cursor ? { next_cursor: paging.next_cursor } : undefined
  );

  return { content: [{ type: "text" as const, text: truncateIfNeeded(text) }] };
}

const TOOL_ANNOTATIONS = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: true,
} as const;

export function registerMessagesTools(
  server: McpServer,
  client: ApiClient,
  defaultCustomerId: number
): void {
  server.registerTool(
    "sprout_get_messages",
    {
      title: "Get Messages",
      description: "Query inbox messages from Sprout Social with optional filters for profiles, groups, dates, post types, tags, and language. Supports cursor-based pagination.",
      inputSchema: z
        .object({
          customer_id: CustomerIdSchema,
          profile_ids: z.array(z.number()).optional().describe("Filter by profile IDs"),
          group_id: z.number().optional().describe("Filter by group ID"),
          start_date: DateSchema.optional().describe("Start of date range (inclusive)"),
          end_date: DateSchema.optional().describe("End of date range (exclusive)"),
          post_types: z.array(z.string()).optional().describe("Filter by post types"),
          tag_ids: z.array(z.number()).optional().describe("Filter by tag IDs"),
          language_codes: z.array(z.string()).optional().describe("Filter by language codes (e.g. ['en', 'es'])"),
          from_guids: z.array(z.string()).optional().describe("Filter by sender/external profile GUIDs"),
          action_last_update_start: DateSchema.optional().describe("Start of action_last_update_time range (inclusive) — filters by last Sprout action (Reply, Tag, Like, Complete)"),
          action_last_update_end: DateSchema.optional().describe("End of action_last_update_time range (exclusive)"),
          message_ids: z
            .array(z.string())
            .max(MAX_MESSAGE_IDS_PER_REQUEST)
            .optional()
            .describe("Fetch specific messages by ID (mutually exclusive with other filters)"),
          fields: z.array(z.string()).optional().describe("Fields to return"),
          sort_order: SortOrderSchema,
          timezone: TimezoneSchema,
          limit: z.number().int().min(1).max(100).default(50).describe("Results per page"),
          cursor: CursorSchema,
          response_format: ResponseFormatSchema,
        })
        .strict(),
      annotations: TOOL_ANNOTATIONS,
    },
    async (params) => safeToolCall(() => {
      const cid = params.customer_id ?? defaultCustomerId;
      return handleGetMessages(client, cid, {
        profile_ids: params.profile_ids,
        group_id: params.group_id,
        start_date: params.start_date,
        end_date: params.end_date,
        post_types: params.post_types,
        tag_ids: params.tag_ids,
        language_codes: params.language_codes,
        from_guids: params.from_guids,
        action_last_update_start: params.action_last_update_start,
        action_last_update_end: params.action_last_update_end,
        message_ids: params.message_ids,
        fields: params.fields,
        sort_order: params.sort_order,
        timezone: params.timezone,
        limit: params.limit,
        cursor: params.cursor,
        response_format: params.response_format,
      });
    })
  );
}
