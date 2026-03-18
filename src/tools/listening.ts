import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ApiClient } from "../services/api-client.js";
import {
  buildEqFilter,
  buildDateRangeFilter,
  buildTextMatchFilter,
} from "../services/filter-builder.js";
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

interface ListeningMessagesParams {
  topic_id: number;
  start_date: string;
  end_date: string;
  sentiment?: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  network?: string;
  text_search?: string;
  fields?: string[];
  sort_by?: string;
  sort_order?: "asc" | "desc";
  timezone?: string;
  page?: number;
  limit?: number;
  response_format: ResponseFormat;
}

interface ListeningMetricsParams {
  topic_id: number;
  start_date: string;
  end_date: string;
  metrics?: string[];
  dimensions?: string[];
  timezone?: string;
  response_format: ResponseFormat;
}

export async function handleListeningMessages(
  client: ApiClient,
  customerId: number,
  params: ListeningMessagesParams
): Promise<ToolResponse> {
  const filters: string[] = [
    buildDateRangeFilter("created_time", params.start_date, params.end_date, false),
  ];

  if (params.sentiment) {
    filters.push(buildEqFilter("sentiment", [params.sentiment]));
  }
  if (params.network) {
    filters.push(buildEqFilter("network", [params.network]));
  }
  if (params.text_search) {
    filters.push(buildTextMatchFilter("text", params.text_search));
  }

  const sortOrder = params.sort_order ?? "desc";
  const sortBy = params.sort_by ?? "created_time";
  const body: Record<string, unknown> = {
    filters,
    sort: [`${sortBy}:${sortOrder}`],
  };

  if (params.fields !== undefined) body.fields = params.fields;
  if (params.timezone !== undefined) body.timezone = params.timezone;
  if (params.page !== undefined) body.page = params.page;
  if (params.limit !== undefined) body.limit = params.limit;

  const response = await client.post<SproutApiResponse<object>>(
    `/v1/${customerId}/listening/topics/${params.topic_id}/messages`,
    body
  );

  const paging = response.paging as { current_page?: number; total_pages?: number } | undefined;
  const pageInfo =
    paging?.current_page !== undefined && paging?.total_pages !== undefined
      ? `\n\nPage ${paging.current_page} of ${paging.total_pages}`
      : "";

  const text = formatOutput(response.data, params.response_format, (data) =>
    formatAsTable(data as object[], params.fields ?? ["created_time"])
  );

  const fullText = pageInfo ? `${text}${pageInfo}` : text;
  return { content: [{ type: "text" as const, text: truncateIfNeeded(fullText) }] };
}

export async function handleListeningMetrics(
  client: ApiClient,
  customerId: number,
  params: ListeningMetricsParams
): Promise<ToolResponse> {
  const filters: string[] = [
    buildDateRangeFilter("created_time", params.start_date, params.end_date, false),
  ];

  const body: Record<string, unknown> = { filters };

  if (params.metrics !== undefined) body.metrics = params.metrics;
  if (params.dimensions !== undefined) body.dimensions = params.dimensions;
  if (params.timezone !== undefined) body.timezone = params.timezone;

  const response = await client.post<SproutApiResponse<object>>(
    `/v1/${customerId}/listening/topics/${params.topic_id}/metrics`,
    body
  );

  const columns = [
    ...(params.dimensions ?? []),
    ...(params.metrics ?? []),
  ];
  const text = formatOutput(response.data, params.response_format, (data) =>
    formatAsTable(data as object[], columns.length > 0 ? columns : ["created_time"])
  );
  return { content: [{ type: "text" as const, text: truncateIfNeeded(text) }] };
}

const TOOL_ANNOTATIONS = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: true,
} as const;

export function registerListeningTools(
  server: McpServer,
  client: ApiClient,
  defaultCustomerId: number
): void {
  server.registerTool(
    "sprout_get_listening_messages",
    {
      title: "Get Listening Messages",
      description:
        "Query social listening messages for a topic with optional filters for sentiment, network, and text search. Supports index-based pagination.",
      inputSchema: z
        .object({
          customer_id: CustomerIdSchema,
          topic_id: z.number().int().describe("Listening topic ID"),
          start_date: DateSchema.describe("Start of date range (inclusive)"),
          end_date: DateSchema.describe("End of date range (exclusive)"),
          sentiment: z
            .enum(["POSITIVE", "NEGATIVE", "NEUTRAL"])
            .optional()
            .describe("Filter by sentiment"),
          network: z.string().optional().describe("Filter by network (e.g. 'twitter')"),
          text_search: z
            .string()
            .optional()
            .describe("Full-text search (supports OR operator)"),
          fields: z.array(z.string()).optional().describe("Fields to return"),
          sort_by: z.string().optional().describe("Field to sort by"),
          sort_order: SortOrderSchema,
          timezone: TimezoneSchema,
          page: PageSchema,
          limit: z.number().int().min(1).max(100).default(50).describe("Results per page"),
          response_format: ResponseFormatSchema,
        })
        .strict(),
      annotations: TOOL_ANNOTATIONS,
    },
    async (params) => {
      const cid = params.customer_id ?? defaultCustomerId;
      return handleListeningMessages(client, cid, {
        topic_id: params.topic_id,
        start_date: params.start_date,
        end_date: params.end_date,
        sentiment: params.sentiment,
        network: params.network,
        text_search: params.text_search,
        fields: params.fields,
        sort_by: params.sort_by,
        sort_order: params.sort_order,
        timezone: params.timezone,
        page: params.page,
        limit: params.limit,
        response_format: params.response_format,
      });
    }
  );

  server.registerTool(
    "sprout_get_listening_metrics",
    {
      title: "Get Listening Metrics",
      description:
        "Query aggregated metrics for a listening topic over a date range. Returns all data in a single response (no pagination).",
      inputSchema: z
        .object({
          customer_id: CustomerIdSchema,
          topic_id: z.number().int().describe("Listening topic ID"),
          start_date: DateSchema.describe("Start of date range (inclusive)"),
          end_date: DateSchema.describe("End of date range (exclusive)"),
          metrics: z.array(z.string()).optional().describe("Metric names to return"),
          dimensions: z
            .array(z.string())
            .optional()
            .describe("Dimension expressions (e.g. 'created_time.by(day)')"),
          timezone: TimezoneSchema,
          response_format: ResponseFormatSchema,
        })
        .strict(),
      annotations: TOOL_ANNOTATIONS,
    },
    async (params) => {
      const cid = params.customer_id ?? defaultCustomerId;
      return handleListeningMetrics(client, cid, {
        topic_id: params.topic_id,
        start_date: params.start_date,
        end_date: params.end_date,
        metrics: params.metrics,
        dimensions: params.dimensions,
        timezone: params.timezone,
        response_format: params.response_format,
      });
    }
  );
}
