import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ApiClient } from "../services/api-client.js";
import { buildEqFilter, buildDateRangeFilter } from "../services/filter-builder.js";
import { formatAsTable, formatOutput, truncateIfNeeded } from "../services/formatter.js";
import {
  ResponseFormatSchema,
  CustomerIdSchema,
  PageSchema,
  DateSchema,
  SortOrderSchema,
  TimezoneSchema,
} from "../schemas/common.js";
import type { SproutApiResponse, ToolResponse, ResponseFormat } from "../types.js";

interface ProfileAnalyticsParams {
  profile_ids: number[];
  start_date: string;
  end_date: string;
  metrics: string[];
  page?: number;
  limit?: number;
  response_format: ResponseFormat;
}

interface PostAnalyticsParams {
  profile_ids: number[];
  start_date: string;
  end_date: string;
  metrics?: string[];
  fields?: string[];
  sort_order?: "asc" | "desc";
  timezone?: string;
  page?: number;
  limit?: number;
  response_format: ResponseFormat;
}

export async function handleProfileAnalytics(
  client: ApiClient,
  customerId: number,
  params: ProfileAnalyticsParams
): Promise<ToolResponse> {
  const filters = [
    buildEqFilter("customer_profile_id", params.profile_ids),
    buildDateRangeFilter("reporting_period", params.start_date, params.end_date, true),
  ];

  const body: Record<string, unknown> = {
    filters,
    metrics: params.metrics,
  };
  if (params.page !== undefined) body.page = params.page;
  if (params.limit !== undefined) body.limit = params.limit;

  const response = await client.post<SproutApiResponse<object>>(
    `/v1/${customerId}/analytics/profiles`,
    body
  );

  const text = formatOutput(response.data, params.response_format, (data) =>
    formatAsTable(data, params.metrics)
  );
  return { content: [{ type: "text" as const, text: truncateIfNeeded(text) }] };
}

export async function handlePostAnalytics(
  client: ApiClient,
  customerId: number,
  params: PostAnalyticsParams
): Promise<ToolResponse> {
  const filters = [
    buildEqFilter("customer_profile_id", params.profile_ids),
    buildDateRangeFilter("created_time", params.start_date, params.end_date, false),
  ];

  const sortOrder = params.sort_order ?? "desc";
  const body: Record<string, unknown> = {
    filters,
    sort: [`created_time:${sortOrder}`],
  };
  if (params.metrics !== undefined) body.metrics = params.metrics;
  if (params.fields !== undefined) body.fields = params.fields;
  if (params.timezone !== undefined) body.timezone = params.timezone;
  if (params.page !== undefined) body.page = params.page;
  if (params.limit !== undefined) body.limit = params.limit;

  const response = await client.post<SproutApiResponse<object>>(
    `/v1/${customerId}/analytics/posts`,
    body
  );

  const columns = [
    ...(params.fields ?? []),
    ...(params.metrics ?? []),
  ];
  const text = formatOutput(response.data, params.response_format, (data) =>
    formatAsTable(data, columns.length > 0 ? columns : ["created_time"])
  );
  return { content: [{ type: "text" as const, text: truncateIfNeeded(text) }] };
}

const TOOL_ANNOTATIONS = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: true,
} as const;

export function registerAnalyticsTools(
  server: McpServer,
  client: ApiClient,
  defaultCustomerId: number
): void {
  server.registerTool(
    "sprout_get_profile_analytics",
    {
      title: "Get Profile Analytics",
      description: "Query profile-level metrics (impressions, engagements, etc.) for social profiles over a date range.",
      inputSchema: z
        .object({
          customer_id: CustomerIdSchema,
          profile_ids: z.array(z.number()).min(1).max(100).describe("List of profile IDs to query"),
          start_date: DateSchema.describe("Start of reporting period (inclusive)"),
          end_date: DateSchema.describe("End of reporting period (inclusive)"),
          metrics: z.array(z.string()).min(1).describe("Metric names to return"),
          page: PageSchema,
          limit: z.number().int().min(1).max(10000).default(1000).describe("Results per page"),
          response_format: ResponseFormatSchema,
        })
        .strict(),
      annotations: TOOL_ANNOTATIONS,
    },
    async (params) => {
      const cid = params.customer_id ?? defaultCustomerId;
      return handleProfileAnalytics(client, cid, {
        profile_ids: params.profile_ids,
        start_date: params.start_date,
        end_date: params.end_date,
        metrics: params.metrics,
        page: params.page,
        limit: params.limit,
        response_format: params.response_format,
      });
    }
  );

  server.registerTool(
    "sprout_get_post_analytics",
    {
      title: "Get Post Analytics",
      description: "Query post-level metrics and fields for published posts within a date range.",
      inputSchema: z
        .object({
          customer_id: CustomerIdSchema,
          profile_ids: z.array(z.number()).min(1).max(100).describe("List of profile IDs to query"),
          start_date: DateSchema.describe("Start of date range (inclusive)"),
          end_date: DateSchema.describe("End of date range (exclusive)"),
          metrics: z.array(z.string()).optional().describe("Metric names to return"),
          fields: z.array(z.string()).optional().describe("Post field names to return"),
          sort_order: SortOrderSchema,
          timezone: TimezoneSchema,
          page: PageSchema,
          limit: z.number().int().min(1).max(10000).default(50).describe("Results per page"),
          response_format: ResponseFormatSchema,
        })
        .strict(),
      annotations: TOOL_ANNOTATIONS,
    },
    async (params) => {
      const cid = params.customer_id ?? defaultCustomerId;
      return handlePostAnalytics(client, cid, {
        profile_ids: params.profile_ids,
        start_date: params.start_date,
        end_date: params.end_date,
        metrics: params.metrics,
        fields: params.fields,
        sort_order: params.sort_order,
        timezone: params.timezone,
        page: params.page,
        limit: params.limit,
        response_format: params.response_format,
      });
    }
  );
}
