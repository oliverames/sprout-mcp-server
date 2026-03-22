import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ApiClient } from "../services/api-client.js";
import { buildEqFilter, buildNeqFilter, buildDateRangeFilter } from "../services/filter-builder.js";
import { formatAsTable, formatOutput, truncateIfNeeded, safeToolCall } from "../services/formatter.js";
import {
  ResponseFormatSchema,
  CustomerIdSchema,
  CursorSchema,
  DateSchema,
  SortOrderSchema,
  TimezoneSchema,
} from "../schemas/common.js";
import type { SproutApiResponse, ToolResponse, ResponseFormat } from "../types.js";
import { CASES_MAX_DATE_RANGE_DAYS, MAX_CASE_IDS_PER_REQUEST } from "../constants.js";

interface GetCasesParams {
  start_date?: string;
  end_date?: string;
  date_field?: "created_time" | "updated_time" | "latest_activity_time";
  case_ids?: number[];
  status?: string[];
  priority?: string[];
  type?: string[];
  queue_id?: number;
  assigned_to?: string;
  assigned_by?: string;
  created_by?: string;
  message_ids?: string[];
  tag_ids?: number[];
  exclude_tag_ids?: number[];
  additional_filters?: string[];
  sort_by?: "created_time" | "updated_time";
  sort_order?: "asc" | "desc";
  timezone?: string;
  limit?: number;
  cursor?: string;
  response_format: ResponseFormat;
}

export async function handleGetCases(
  client: ApiClient,
  customerId: number,
  params: GetCasesParams
): Promise<ToolResponse> {
  const hasDateFilters = params.start_date || params.end_date;
  const hasCaseIds = params.case_ids && params.case_ids.length > 0;

  if (hasCaseIds && hasDateFilters) {
    return {
      isError: true,
      content: [{ type: "text" as const, text: "case_ids and date filters are mutually exclusive. Provide one or the other, not both." }],
    };
  }

  if (!hasCaseIds && !params.start_date && !params.end_date) {
    return {
      isError: true,
      content: [{ type: "text" as const, text: "Either case_ids or a date range (start_date + end_date) is required." }],
    };
  }

  if ((params.start_date && !params.end_date) || (!params.start_date && params.end_date)) {
    return {
      isError: true,
      content: [{ type: "text" as const, text: "Both start_date and end_date are required when using date filters." }],
    };
  }

  if (hasDateFilters && params.start_date && params.end_date) {
    const start = new Date(params.start_date);
    const end = new Date(params.end_date);
    const diffMs = end.getTime() - start.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    if (diffDays < 0) {
      return {
        isError: true,
        content: [{ type: "text" as const, text: "start_date must be before end_date." }],
      };
    }
    if (diffDays > CASES_MAX_DATE_RANGE_DAYS) {
      return {
        isError: true,
        content: [{ type: "text" as const, text: `Date range exceeds maximum of 1 week (${CASES_MAX_DATE_RANGE_DAYS} days).` }],
      };
    }
  }

  let filters: string[];

  if (hasCaseIds) {
    filters = [buildEqFilter("case_id", params.case_ids!)];
  } else {
    filters = [];
    if (params.start_date && params.end_date) {
      const dateField = params.date_field ?? "updated_time";
      filters.push(buildDateRangeFilter(dateField, params.start_date, params.end_date, false));
    }
    if (params.status && params.status.length > 0) {
      filters.push(buildEqFilter("status", params.status));
    }
    if (params.priority && params.priority.length > 0) {
      filters.push(buildEqFilter("priority", params.priority));
    }
    if (params.type && params.type.length > 0) {
      filters.push(buildEqFilter("type", params.type));
    }
    if (params.queue_id !== undefined) {
      filters.push(buildEqFilter("queue_id", [params.queue_id]));
    }
    if (params.assigned_to) {
      filters.push(buildEqFilter("assigned_to", [params.assigned_to]));
    }
    if (params.assigned_by) {
      filters.push(buildEqFilter("assigned_by", [params.assigned_by]));
    }
    if (params.created_by) {
      filters.push(buildEqFilter("created_by", [params.created_by]));
    }
    if (params.message_ids && params.message_ids.length > 0) {
      filters.push(buildEqFilter("message_id", params.message_ids));
    }
    if (params.tag_ids && params.tag_ids.length > 0) {
      filters.push(buildEqFilter("tag_id", params.tag_ids));
    }
    if (params.exclude_tag_ids && params.exclude_tag_ids.length > 0) {
      filters.push(buildNeqFilter("tag_id", params.exclude_tag_ids));
    }
    if (params.additional_filters && params.additional_filters.length > 0) {
      filters.push(...params.additional_filters);
    }
  }

  const sortBy = params.sort_by ?? "created_time";
  const sortOrder = params.sort_order ?? "desc";
  const body: Record<string, unknown> = {
    filters,
    sort: [`${sortBy}:${sortOrder}`],
  };

  if (params.timezone !== undefined) body.timezone = params.timezone;
  if (params.limit !== undefined) body.limit = params.limit;
  if (params.cursor !== undefined) body.page_cursor = params.cursor;

  const response = await client.post<SproutApiResponse<object>>(
    `/v1/${customerId}/cases/filter`,
    body
  );

  const paging = response.paging as { next_cursor?: string } | undefined;
  const defaultColumns = ["case_id", "status", "priority", "type", "created_time", "updated_time"];
  const text = formatOutput(
    response.data,
    params.response_format,
    (data) => formatAsTable(data as object[], defaultColumns),
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

export function registerCasesTools(
  server: McpServer,
  client: ApiClient,
  defaultCustomerId: number
): void {
  server.registerTool(
    "sprout_get_cases",
    {
      title: "Get Cases",
      description: "Query support/feedback cases from Sprout Social with optional filters for status, priority, type, queue, assignee, and date range. Supports cursor-based pagination.",
      inputSchema: z
        .object({
          customer_id: CustomerIdSchema,
          start_date: DateSchema.optional().describe("Start of date range (inclusive)"),
          end_date: DateSchema.optional().describe("End of date range (end-exclusive); max range is 1 week"),
          date_field: z
            .enum(["created_time", "updated_time", "latest_activity_time"])
            .default("updated_time")
            .optional()
            .describe("Which date field to filter on"),
          case_ids: z
            .array(z.coerce.number())
            .max(MAX_CASE_IDS_PER_REQUEST)
            .optional()
            .describe("Fetch specific cases by ID (mutually exclusive with date filters; accepts string or number IDs)"),
          status: z
            .array(z.enum(["OPEN", "IN_PROGRESS", "ON_HOLD", "CLOSED"]))
            .optional()
            .describe("Filter by case status"),
          priority: z
            .array(z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "UNDEFINED"]))
            .optional()
            .describe("Filter by case priority"),
          type: z
            .array(z.enum(["GENERAL", "SUPPORT", "LEAD", "QUESTION", "FEEDBACK"]))
            .optional()
            .describe("Filter by case type"),
          queue_id: z.coerce.number().optional().describe("Filter by queue ID (accepts string or number)"),
          assigned_to: z.string().optional().describe("Filter by assignee (URN format)"),
          assigned_by: z.string().optional().describe("Filter by who assigned the case (URN format)"),
          created_by: z.string().optional().describe("Filter by who created the case (URN format)"),
          message_ids: z.array(z.string()).optional().describe("Filter by related message GUIDs"),
          tag_ids: z.array(z.number()).optional().describe("Include only cases with these tag IDs"),
          exclude_tag_ids: z.array(z.number()).optional().describe("Exclude cases with these tag IDs"),
          additional_filters: z.array(z.string()).optional().describe("Extra Sprout DSL filter strings (e.g. 'updated_time.in(2025-01-05...2025-01-08)' to add a second date filter alongside the primary one)"),
          sort_by: z
            .enum(["created_time", "updated_time"])
            .default("created_time")
            .optional()
            .describe("Field to sort by"),
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
      return handleGetCases(client, cid, {
        start_date: params.start_date,
        end_date: params.end_date,
        date_field: params.date_field,
        case_ids: params.case_ids,
        status: params.status,
        priority: params.priority,
        type: params.type,
        queue_id: params.queue_id,
        assigned_to: params.assigned_to,
        assigned_by: params.assigned_by,
        created_by: params.created_by,
        message_ids: params.message_ids,
        tag_ids: params.tag_ids,
        exclude_tag_ids: params.exclude_tag_ids,
        additional_filters: params.additional_filters,
        sort_by: params.sort_by,
        sort_order: params.sort_order,
        timezone: params.timezone,
        limit: params.limit,
        cursor: params.cursor,
        response_format: params.response_format,
      });
    })
  );
}
