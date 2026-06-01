import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ApiClient } from "../services/api-client.js";
import { buildEqFilter, buildDateRangeFilter, buildComparisonFilter } from "../services/filter-builder.js";
import { formatAsTable, formatOutput, truncateIfNeeded, safeToolCall } from "../services/formatter.js";
import {
  ResponseFormatSchema,
  CustomerIdSchema,
  PageSchema,
  DateSchema,
  SortOrderSchema,
  TimezoneSchema,
} from "../schemas/common.js";
import { ANALYTICS_MAX_DATE_RANGE_DAYS, MAX_PROFILES_PER_REQUEST } from "../constants.js";
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
  sort_field?: string;
  sort_order?: "asc" | "desc";
  guid_cursor?: string;
  timezone?: string;
  page?: number;
  limit?: number;
  response_format: ResponseFormat;
}

function validateDateRange(start: string, end: string): string | null {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays > ANALYTICS_MAX_DATE_RANGE_DAYS) {
    return `Date range exceeds maximum of ${ANALYTICS_MAX_DATE_RANGE_DAYS} days for analytics.`;
  }
  if (diffDays < 0) {
    return "start_date must be before end_date.";
  }
  return null;
}

export async function handleProfileAnalytics(
  client: ApiClient,
  customerId: number,
  params: ProfileAnalyticsParams
): Promise<ToolResponse> {
  const rangeError = validateDateRange(params.start_date, params.end_date);
  if (rangeError) {
    return { isError: true, content: [{ type: "text" as const, text: rangeError }] };
  }

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

  const paging = response.paging as { current_page?: number; total_pages?: number } | undefined;
  const dimensionCols = ["customer_profile_id", "reporting_period.by(day)"];
  const text = formatOutput(
    response.data,
    params.response_format,
    (data) => formatAsTable(data, [...dimensionCols, ...params.metrics]),
    paging
  );
  return { content: [{ type: "text" as const, text: truncateIfNeeded(text) }] };
}

export async function handlePostAnalytics(
  client: ApiClient,
  customerId: number,
  params: PostAnalyticsParams
): Promise<ToolResponse> {
  const rangeError = validateDateRange(params.start_date, params.end_date);
  if (rangeError) {
    return { isError: true, content: [{ type: "text" as const, text: rangeError }] };
  }

  const filters: string[] = [
    buildEqFilter("customer_profile_id", params.profile_ids),
    buildDateRangeFilter("created_time", params.start_date, params.end_date, false),
  ];
  if (params.guid_cursor) {
    filters.push(buildComparisonFilter("guid", "gt", params.guid_cursor));
  }

  const sortField = params.guid_cursor ? "guid" : (params.sort_field ?? "created_time");
  const sortOrder = params.guid_cursor ? "asc" : (params.sort_order ?? "desc");
  const body: Record<string, unknown> = {
    filters,
    sort: [`${sortField}:${sortOrder}`],
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

  const paging = response.paging as { current_page?: number; total_pages?: number } | undefined;
  const columns = [
    ...(params.fields ?? []),
    ...(params.metrics ?? []),
  ];
  const text = formatOutput(
    response.data,
    params.response_format,
    (data) => formatAsTable(data, columns.length > 0 ? columns : ["created_time"]),
    paging
  );
  return { content: [{ type: "text" as const, text: truncateIfNeeded(text) }] };
}

interface CompilePerformanceReportParams {
  profile_ids: number[];
  start_date: string;
  end_date: string;
  metrics: string[];
  post_limit: number;
  response_format: ResponseFormat;
}

export async function handleCompilePerformanceReport(
  client: ApiClient,
  customerId: number,
  params: CompilePerformanceReportParams
): Promise<ToolResponse> {
  const rangeError = validateDateRange(params.start_date, params.end_date);
  if (rangeError) {
    return { isError: true, content: [{ type: "text" as const, text: rangeError }] };
  }

  const profileFilters = [
    buildEqFilter("customer_profile_id", params.profile_ids),
    buildDateRangeFilter("reporting_period", params.start_date, params.end_date, true),
  ];
  const profileResponse = await client.post<SproutApiResponse<any>>(
    `/v1/${customerId}/analytics/profiles`,
    { filters: profileFilters, metrics: params.metrics, limit: 1000 }
  );

  const postFilters = [
    buildEqFilter("customer_profile_id", params.profile_ids),
    buildDateRangeFilter("created_time", params.start_date, params.end_date, false),
  ];
  const postResponse = await client.post<SproutApiResponse<any>>(
    `/v1/${customerId}/analytics/posts`,
    {
      filters: postFilters,
      metrics: params.metrics,
      fields: ["created_time", "text", "customer_profile_id"],
      sort: ["created_time:desc"],
      limit: Math.max(50, params.post_limit * 2),
    }
  );

  if (params.response_format === "json") {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              profile_analytics: profileResponse.data,
              post_analytics: postResponse.data.slice(0, params.post_limit),
            },
            null,
            2
          ),
        },
      ],
    };
  }

  const profileCols = ["customer_profile_id", "reporting_period.by(day)"];
  const profileTable = formatAsTable(profileResponse.data, [...profileCols, ...params.metrics]);

  const sortedPosts = [...postResponse.data]
    .sort((a, b) => {
      const sumA = params.metrics.reduce((acc, m) => {
        const val = a.metrics?.[m] ?? a[m] ?? 0;
        return acc + (typeof val === "number" ? val : 0);
      }, 0);
      const sumB = params.metrics.reduce((acc, m) => {
        const val = b.metrics?.[m] ?? b[m] ?? 0;
        return acc + (typeof val === "number" ? val : 0);
      }, 0);
      return sumB - sumA;
    })
    .slice(0, params.post_limit);

  const postsTable = formatAsTable(
    sortedPosts.map((p) => ({
      ...p,
      ...p.metrics,
    })),
    ["customer_profile_id", "created_time", "text", ...params.metrics]
  );

  const totals: Record<string, number> = {};
  for (const m of params.metrics) {
    totals[m] = profileResponse.data.reduce((acc, row) => {
      const val = row.metrics?.[m] ?? row[m] ?? 0;
      return acc + (typeof val === "number" ? val : 0);
    }, 0);
  }

  const totalsSummary = params.metrics
    .map((m) => `* **Total ${m}**: ${totals[m]!.toLocaleString()}`)
    .join("\n");

  const reportText = [
    `# Sprout Social Performance Report`,
    `**Reporting Period**: ${params.start_date} to ${params.end_date}`,
    `**Target Profiles**: ${params.profile_ids.join(", ")}`,
    ``,
    `## Executive Metrics Summary`,
    totalsSummary,
    ``,
    `## Profile Growth & Performance History`,
    profileTable,
    ``,
    `## Top Performing Posts (Ranked by Engagement Summary)`,
    postsTable,
  ].join("\n");

  return { content: [{ type: "text" as const, text: truncateIfNeeded(reportText) }] };
}

interface CompareProfilesParams {
  profile_ids: number[];
  start_date: string;
  end_date: string;
  metrics: string[];
  response_format: ResponseFormat;
}

export async function handleCompareProfiles(
  client: ApiClient,
  customerId: number,
  params: CompareProfilesParams
): Promise<ToolResponse> {
  const rangeError = validateDateRange(params.start_date, params.end_date);
  if (rangeError) {
    return { isError: true, content: [{ type: "text" as const, text: rangeError }] };
  }

  const filters = [
    buildEqFilter("customer_profile_id", params.profile_ids),
    buildDateRangeFilter("reporting_period", params.start_date, params.end_date, true),
  ];
  const response = await client.post<SproutApiResponse<any>>(
    `/v1/${customerId}/analytics/profiles`,
    { filters, metrics: params.metrics, limit: 1000 }
  );

  const comparisonMap: Record<number, Record<string, number>> = {};
  for (const pid of params.profile_ids) {
    comparisonMap[pid] = {};
    for (const m of params.metrics) {
      comparisonMap[pid][m] = 0;
    }
  }

  for (const row of response.data) {
    const pid = Number(row.customer_profile_id);
    if (pid in comparisonMap) {
      for (const m of params.metrics) {
        const val = row.metrics?.[m] ?? row[m] ?? 0;
        comparisonMap[pid][m] += typeof val === "number" ? val : 0;
      }
    }
  }

  const comparisonData = params.profile_ids.map((pid) => ({
    customer_profile_id: pid,
    ...comparisonMap[pid],
  }));

  if (params.response_format === "json") {
    return {
      content: [{ type: "text" as const, text: JSON.stringify(comparisonData, null, 2) }],
    };
  }

  const table = formatAsTable(comparisonData, ["customer_profile_id", ...params.metrics]);

  const reportText = [
    `# Social Channel Comparison Report`,
    `**Reporting Period**: ${params.start_date} to ${params.end_date}`,
    ``,
    table,
  ].join("\n");

  return { content: [{ type: "text" as const, text: truncateIfNeeded(reportText) }] };
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
          profile_ids: z.array(z.number()).min(1).max(MAX_PROFILES_PER_REQUEST).describe("List of profile IDs to query"),
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
    async (params) => safeToolCall(() => {
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
    })
  );

  server.registerTool(
    "sprout_get_post_analytics",
    {
      title: "Get Post Analytics",
      description: "Query post-level metrics and fields for published posts within a date range.",
      inputSchema: z
        .object({
          customer_id: CustomerIdSchema,
          profile_ids: z.array(z.number()).min(1).max(MAX_PROFILES_PER_REQUEST).describe("List of profile IDs to query"),
          start_date: DateSchema.describe("Start of date range (inclusive)"),
          end_date: DateSchema.describe("End of date range (exclusive)"),
          metrics: z.array(z.string()).optional().describe("Metric names to return"),
          fields: z.array(z.string()).optional().describe("Post field names to return"),
          sort_field: z.string().default("created_time").optional().describe("Field to sort by (default: 'created_time'; use 'guid' for cursor-based pagination)"),
          sort_order: SortOrderSchema,
          guid_cursor: z.string().optional().describe("Last guid from a previous response — used with sort_field='guid' and sort_order='asc' for cursor-based pagination beyond 10K results"),
          timezone: TimezoneSchema,
          page: PageSchema,
          limit: z.number().int().min(1).max(10000).default(50).describe("Results per page"),
          response_format: ResponseFormatSchema,
        })
        .strict(),
      annotations: TOOL_ANNOTATIONS,
    },
    async (params) => safeToolCall(() => {
      const cid = params.customer_id ?? defaultCustomerId;
      return handlePostAnalytics(client, cid, {
        profile_ids: params.profile_ids,
        start_date: params.start_date,
        end_date: params.end_date,
        metrics: params.metrics,
        fields: params.fields,
        sort_field: params.sort_field,
        sort_order: params.sort_order,
        guid_cursor: params.guid_cursor,
        timezone: params.timezone,
        page: params.page,
        limit: params.limit,
        response_format: params.response_format,
      });
    })
  );

  server.registerTool(
    "sprout_compile_performance_report",
    {
      title: "Compile Performance Report",
      description: "Compile both profile-level growth metrics and top post-level performance metrics into a unified summary report.",
      inputSchema: z
        .object({
          customer_id: CustomerIdSchema,
          profile_ids: z.array(z.number()).min(1).max(10).describe("List of profile IDs to compile"),
          start_date: DateSchema.describe("Start of reporting period (inclusive)"),
          end_date: DateSchema.describe("End of reporting period (inclusive)"),
          metrics: z.array(z.string()).default(["impressions", "engagements", "net_follower_growth", "likes"]).describe("Metric names to include"),
          post_limit: z.number().int().min(1).max(20).default(5).describe("Number of top posts to return"),
          response_format: ResponseFormatSchema,
        })
        .strict(),
      annotations: TOOL_ANNOTATIONS,
    },
    async (params) => safeToolCall(() => {
      const cid = params.customer_id ?? defaultCustomerId;
      return handleCompilePerformanceReport(client, cid, {
        profile_ids: params.profile_ids,
        start_date: params.start_date,
        end_date: params.end_date,
        metrics: params.metrics,
        post_limit: params.post_limit,
        response_format: params.response_format,
      });
    })
  );

  server.registerTool(
    "sprout_compare_profiles",
    {
      title: "Compare Profiles",
      description: "Compare multiple social profiles or channels against each other over a date range to evaluate channel strength.",
      inputSchema: z
        .object({
          customer_id: CustomerIdSchema,
          profile_ids: z.array(z.number()).min(2).max(10).describe("List of profile IDs to compare"),
          start_date: DateSchema.describe("Start of date range (inclusive)"),
          end_date: DateSchema.describe("End of date range (inclusive)"),
          metrics: z.array(z.string()).default(["impressions", "engagements", "likes", "shares", "comments"]).describe("Metric names to compare"),
          response_format: ResponseFormatSchema,
        })
        .strict(),
      annotations: TOOL_ANNOTATIONS,
    },
    async (params) => safeToolCall(() => {
      const cid = params.customer_id ?? defaultCustomerId;
      return handleCompareProfiles(client, cid, {
        profile_ids: params.profile_ids,
        start_date: params.start_date,
        end_date: params.end_date,
        metrics: params.metrics,
        response_format: params.response_format,
      });
    })
  );
}
