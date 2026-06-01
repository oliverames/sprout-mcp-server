import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ApiClient } from "../services/api-client.js";
import { formatAsTable, formatOutput, truncateIfNeeded, safeToolCall } from "../services/formatter.js";
import {
  ResponseFormatSchema,
  CustomerIdSchema,
} from "../schemas/common.js";
import type { ToolResponse, ResponseFormat } from "../types.js";

interface MediaItem {
  media_id: string;
  media_type: "PHOTO" | "VIDEO";
}

interface CreateDraftPostParams {
  profile_ids: number[];
  group_id: number;
  text?: string;
  media?: MediaItem[];
  scheduled_times?: string[];
  tag_ids?: number[];
  response_format: ResponseFormat;
}

interface UploadMediaParams {
  media_url: string;
  response_format: ResponseFormat;
}

interface GetPostParams {
  post_id: string;
  response_format: ResponseFormat;
}

interface StartMultipartUploadParams {
  media_url?: string;
  response_format: ResponseFormat;
}

interface ContinueMultipartUploadParams {
  submission_id: string;
  part_number: number;
  media_url: string;
  response_format: ResponseFormat;
}

interface CompleteMultipartUploadParams {
  submission_id: string;
  response_format: ResponseFormat;
}

export async function handleCreateDraftPost(
  client: ApiClient,
  customerId: number,
  params: CreateDraftPostParams
): Promise<ToolResponse> {
  const body: Record<string, unknown> = {
    customer_profile_ids: params.profile_ids,
    group_id: params.group_id,
    is_draft: true,
  };

  if (params.text !== undefined) body.text = params.text;

  if (params.media !== undefined) body.media = params.media;
  if (params.scheduled_times !== undefined) {
    body.delivery = {
      scheduled_times: params.scheduled_times,
      type: "SCHEDULED",
    };
  }
  if (params.tag_ids !== undefined) body.tag_ids = params.tag_ids;

  const response = await client.post<{ data: unknown[] }>(
    `/v1/${customerId}/publishing/posts`,
    body
  );

  const text = formatOutput(response.data, params.response_format);
  return { content: [{ type: "text" as const, text: truncateIfNeeded(text) }] };
}

export async function handleUploadMedia(
  client: ApiClient,
  customerId: number,
  params: UploadMediaParams
): Promise<ToolResponse> {
  const formData = new FormData();
  formData.append("media_url", params.media_url);

  const result = await client.postFormData<{ data: Array<{ media_id: string; expiration_time: string }> }>(
    `/v1/${customerId}/media/`,
    formData
  );

  const mediaInfo = result.data?.[0] ?? result;
  const text = formatOutput(mediaInfo, params.response_format);
  return { content: [{ type: "text" as const, text: truncateIfNeeded(text) }] };
}

export async function handleGetPost(
  client: ApiClient,
  customerId: number,
  params: GetPostParams
): Promise<ToolResponse> {
  const response = await client.get<{ data: unknown[] }>(
    `/v1/${customerId}/publishing/posts/${params.post_id}`
  );

  const text = formatOutput(response.data, params.response_format);
  return { content: [{ type: "text" as const, text: truncateIfNeeded(text) }] };
}

export async function handleStartMultipartUpload(
  client: ApiClient,
  customerId: number,
  params: StartMultipartUploadParams
): Promise<ToolResponse> {
  const formData = new FormData();
  if (params.media_url !== undefined) {
    formData.append("media_url", params.media_url);
  }

  const result = await client.postFormData<{ data: Array<{ submission_id: string }> }>(
    `/v1/${customerId}/media/submission`,
    formData
  );

  const submissionInfo = result.data?.[0] ?? result;
  const text = formatOutput(submissionInfo, params.response_format);
  return { content: [{ type: "text" as const, text: truncateIfNeeded(text) }] };
}

export async function handleContinueMultipartUpload(
  client: ApiClient,
  customerId: number,
  params: ContinueMultipartUploadParams
): Promise<ToolResponse> {
  const formData = new FormData();
  formData.append("media_url", params.media_url);

  await client.postFormData<unknown>(
    `/v1/${customerId}/media/submission/${params.submission_id}/part/${params.part_number}`,
    formData
  );

  const text = formatOutput(
    { status: "ok", submission_id: params.submission_id, part_number: params.part_number },
    params.response_format
  );
  return { content: [{ type: "text" as const, text: truncateIfNeeded(text) }] };
}

export async function handleCompleteMultipartUpload(
  client: ApiClient,
  customerId: number,
  params: CompleteMultipartUploadParams
): Promise<ToolResponse> {
  const result = await client.getWithPolling<{ data: Array<{ media_id: string; expiration_time: string }> }>(
    `/v1/${customerId}/media/submission/${params.submission_id}`
  );

  const mediaInfo = result.data?.[0] ?? result;
  const text = formatOutput(mediaInfo, params.response_format);
  return { content: [{ type: "text" as const, text: truncateIfNeeded(text) }] };
}

const WRITE_ANNOTATIONS = {
  readOnlyHint: false,
  destructiveHint: false,
  idempotentHint: false,
  openWorldHint: true,
} as const;

const READ_ANNOTATIONS = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: true,
} as const;

export function registerPublishingTools(
  server: McpServer,
  client: ApiClient,
  defaultCustomerId: number
): void {
  server.registerTool(
    "sprout_create_draft_post",
    {
      title: "Create Draft Post",
      description: "Create a draft post in Sprout Social for one or more profiles. Optionally schedule delivery and attach media.",
      inputSchema: z
        .object({
          customer_id: CustomerIdSchema,
          profile_ids: z.array(z.number()).min(1).describe("Profile IDs to post to"),
          group_id: z.number().int().describe("Group ID"),
          text: z.string().optional().describe("Post text content (optional for some networks when media is attached)"),
          media: z
            .array(
              z.object({
                media_id: z.string(),
                media_type: z.enum(["PHOTO", "VIDEO"]),
              })
            )
            .optional()
            .describe("Media attachments"),
          scheduled_times: z
            .array(z.string().datetime({ message: "Each scheduled time must be ISO 8601 format (e.g. 2024-06-30T18:00:00Z)" }))
            .optional()
            .describe("ISO 8601 scheduled delivery times in UTC"),
          tag_ids: z.array(z.number()).optional().describe("Tag IDs to apply"),
          response_format: ResponseFormatSchema,
        })
        .strict(),
      annotations: WRITE_ANNOTATIONS,
    },
    async (params) => safeToolCall(() => {
      const cid = params.customer_id ?? defaultCustomerId;
      return handleCreateDraftPost(client, cid, {
        profile_ids: params.profile_ids,
        group_id: params.group_id,
        text: params.text,
        media: params.media,
        scheduled_times: params.scheduled_times,
        tag_ids: params.tag_ids,
        response_format: params.response_format,
      });
    })
  );

  server.registerTool(
    "sprout_upload_media",
    {
      title: "Upload Media",
      description: "Upload media to Sprout Social from a URL. Returns a media_id for use in post creation.",
      inputSchema: z
        .object({
          customer_id: CustomerIdSchema,
          media_url: z.string().url().describe("URL of the media to upload"),
          response_format: ResponseFormatSchema,
        })
        .strict(),
      annotations: WRITE_ANNOTATIONS,
    },
    async (params) => safeToolCall(() => {
      const cid = params.customer_id ?? defaultCustomerId;
      return handleUploadMedia(client, cid, {
        media_url: params.media_url,
        response_format: params.response_format,
      });
    })
  );

  server.registerTool(
    "sprout_get_post",
    {
      title: "Get Post",
      description: "Retrieve a single post by ID from Sprout Social publishing.",
      inputSchema: z
        .object({
          customer_id: CustomerIdSchema,
          post_id: z.string().describe("Post ID to retrieve"),
          response_format: ResponseFormatSchema,
        })
        .strict(),
      annotations: READ_ANNOTATIONS,
    },
    async (params) => safeToolCall(() => {
      const cid = params.customer_id ?? defaultCustomerId;
      return handleGetPost(client, cid, {
        post_id: params.post_id,
        response_format: params.response_format,
      });
    })
  );

  server.registerTool(
    "sprout_start_multipart_upload",
    {
      title: "Start Multipart Media Upload",
      description: "Start a multipart media upload for files over 50MB. Optionally provide a URL to download from. Returns a submission_id for subsequent upload parts and completion.",
      inputSchema: z
        .object({
          customer_id: CustomerIdSchema,
          media_url: z.string().url().optional().describe("URL of the media to download (skips manual part uploads)"),
          response_format: ResponseFormatSchema,
        })
        .strict(),
      annotations: WRITE_ANNOTATIONS,
    },
    async (params) => safeToolCall(() => {
      const cid = params.customer_id ?? defaultCustomerId;
      return handleStartMultipartUpload(client, cid, {
        media_url: params.media_url,
        response_format: params.response_format,
      });
    })
  );

  server.registerTool(
    "sprout_continue_multipart_upload",
    {
      title: "Continue Multipart Media Upload",
      description: "Upload the next part of a multipart media upload. Each part (except the last) must be exactly 5MB. Part numbers start at 2.",
      inputSchema: z
        .object({
          customer_id: CustomerIdSchema,
          submission_id: z.string().describe("Submission ID from start_multipart_upload"),
          part_number: z.number().int().min(2).describe("Part number (starts at 2)"),
          media_url: z.string().url().describe("URL of the media part to upload"),
          response_format: ResponseFormatSchema,
        })
        .strict(),
      annotations: WRITE_ANNOTATIONS,
    },
    async (params) => safeToolCall(() => {
      const cid = params.customer_id ?? defaultCustomerId;
      return handleContinueMultipartUpload(client, cid, {
        submission_id: params.submission_id,
        part_number: params.part_number,
        media_url: params.media_url,
        response_format: params.response_format,
      });
    })
  );
  server.registerTool(
    "sprout_complete_multipart_upload",
    {
      title: "Complete Multipart Media Upload",
      description: "Complete a multipart media upload and retrieve the media_id. Polls automatically until processing finishes. The returned media_id can be used in post creation.",
      inputSchema: z
        .object({
          customer_id: CustomerIdSchema,
          submission_id: z.string().describe("Submission ID from start_multipart_upload"),
          response_format: ResponseFormatSchema,
        })
        .strict(),
      annotations: READ_ANNOTATIONS,
    },
    async (params) => safeToolCall(() => {
      const cid = params.customer_id ?? defaultCustomerId;
      return handleCompleteMultipartUpload(client, cid, {
        submission_id: params.submission_id,
        response_format: params.response_format,
      });
    })
  );

  server.registerTool(
    "sprout_draft_campaign",
    {
      title: "Draft Campaign",
      description: "Create tailored draft posts across different profiles under a single campaign.",
      inputSchema: z
        .object({
          customer_id: CustomerIdSchema,
          group_id: z.number().int().describe("Group ID"),
          posts: z
            .array(
              z.object({
                profile_id: z.number().int().describe("Target profile ID"),
                text: z.string().describe("Tailored post copy"),
                media: z
                  .array(
                    z.object({
                      media_id: z.string(),
                      media_type: z.enum(["PHOTO", "VIDEO"]),
                    })
                  )
                  .optional()
                  .describe("Media attachments for this post"),
              })
            )
            .min(1)
            .describe("Posts to deploy"),
          scheduled_times: z
            .array(z.string().datetime({ message: "Each scheduled time must be ISO 8601 format" }))
            .optional()
            .describe("Scheduled delivery times in UTC"),
          tag_ids: z.array(z.number()).optional().describe("Tag IDs to apply to all drafts"),
          response_format: ResponseFormatSchema,
        })
        .strict(),
      annotations: WRITE_ANNOTATIONS,
    },
    async (params) => safeToolCall(() => {
      const cid = params.customer_id ?? defaultCustomerId;
      return handleDraftCampaign(client, cid, {
        group_id: params.group_id,
        posts: params.posts,
        scheduled_times: params.scheduled_times,
        tag_ids: params.tag_ids,
        response_format: params.response_format,
      });
    })
  );

  server.registerTool(
    "sprout_schedule_campaign_queue",
    {
      title: "Schedule Campaign Queue",
      description: "Sequentially schedules a list of draft posts at set intervals (e.g. every 3 days) starting from a base date.",
      inputSchema: z
        .object({
          customer_id: CustomerIdSchema,
          profile_ids: z.array(z.number()).min(1).describe("Target profile IDs"),
          group_id: z.number().int().describe("Group ID"),
          posts: z
            .array(
              z.object({
                text: z.string().describe("Post text copy"),
                media_id: z.string().optional().describe("Media ID to attach"),
                media_type: z.enum(["PHOTO", "VIDEO"]).optional().describe("Media type"),
              })
            )
            .min(1)
            .describe("Queue posts to schedule"),
          start_date: z.string().datetime().describe("ISO 8601 base start date (e.g. 2024-06-30T18:00:00Z)"),
          interval_days: z.number().int().min(1).max(30).default(3).describe("Days between posts in the queue"),
          tag_ids: z.array(z.number()).optional().describe("Tag IDs to apply to all drafts"),
          response_format: ResponseFormatSchema,
        })
        .strict(),
      annotations: WRITE_ANNOTATIONS,
    },
    async (params) => safeToolCall(() => {
      const cid = params.customer_id ?? defaultCustomerId;
      return handleScheduleCampaignQueue(client, cid, {
        profile_ids: params.profile_ids,
        group_id: params.group_id,
        posts: params.posts,
        start_date: params.start_date,
        interval_days: params.interval_days,
        tag_ids: params.tag_ids,
        response_format: params.response_format,
      });
    })
  );
}

interface DraftCampaignPostEntry {
  profile_id: number;
  text: string;
  media?: MediaItem[];
}

interface DraftCampaignParams {
  group_id: number;
  posts: DraftCampaignPostEntry[];
  scheduled_times?: string[];
  tag_ids?: number[];
  response_format: ResponseFormat;
}

export async function handleDraftCampaign(
  client: ApiClient,
  customerId: number,
  params: DraftCampaignParams
): Promise<ToolResponse> {
  const results: Array<{ profile_id: number; status: string; post_id?: string; error?: string }> = [];

  for (const entry of params.posts) {
    try {
      const body: Record<string, unknown> = {
        customer_profile_ids: [entry.profile_id],
        group_id: params.group_id,
        is_draft: true,
        text: entry.text,
      };
      if (entry.media !== undefined) body.media = entry.media;
      if (params.scheduled_times !== undefined) {
        body.delivery = {
          scheduled_times: params.scheduled_times,
          type: "SCHEDULED",
        };
      }
      if (params.tag_ids !== undefined) body.tag_ids = params.tag_ids;

      const response = await client.post<any>(
        `/v1/${customerId}/publishing/posts`,
        body
      );

      const postInfo = response.data?.[0] ?? response;
      const createdId = postInfo?.id ?? "unknown";

      results.push({
        profile_id: entry.profile_id,
        status: "success",
        post_id: createdId,
      });
    } catch (err: any) {
      results.push({
        profile_id: entry.profile_id,
        status: "failed",
        error: err.message || String(err),
      });
    }
  }

  if (params.response_format === "json") {
    return {
      content: [{ type: "text" as const, text: JSON.stringify(results, null, 2) }],
    };
  }

  const table = formatAsTable(results, ["profile_id", "status", "post_id", "error"]);
  const reportText = [
    `# Campaign Draft Posting Deployment`,
    ``,
    table,
  ].join("\n");

  return { content: [{ type: "text" as const, text: truncateIfNeeded(reportText) }] };
}

interface QueuePostEntry {
  text: string;
  media_id?: string;
  media_type?: "PHOTO" | "VIDEO";
}

interface ScheduleCampaignQueueParams {
  profile_ids: number[];
  group_id: number;
  posts: QueuePostEntry[];
  start_date: string;
  interval_days: number;
  tag_ids?: number[];
  response_format: ResponseFormat;
}

export async function handleScheduleCampaignQueue(
  client: ApiClient,
  customerId: number,
  params: ScheduleCampaignQueueParams
): Promise<ToolResponse> {
  const results: Array<{ post_index: number; scheduled_time: string; status: string; post_id?: string; error?: string }> = [];

  const baseDate = new Date(params.start_date);
  if (isNaN(baseDate.getTime())) {
    return { isError: true, content: [{ type: "text" as const, text: "Invalid start_date format. Must be an ISO 8601 timestamp." }] };
  }

  for (let i = 0; i < params.posts.length; i++) {
    const entry = params.posts[i]!;
    const postScheduledDate = new Date(baseDate.getTime() + i * params.interval_days * 24 * 60 * 60 * 1000);
    const postScheduledStr = postScheduledDate.toISOString();

    try {
      const body: Record<string, unknown> = {
        customer_profile_ids: params.profile_ids,
        group_id: params.group_id,
        is_draft: true,
        text: entry.text,
        delivery: {
          scheduled_times: [postScheduledStr],
          type: "SCHEDULED",
        },
      };

      if (entry.media_id !== undefined && entry.media_type !== undefined) {
        body.media = [{ media_id: entry.media_id, media_type: entry.media_type }];
      }
      if (params.tag_ids !== undefined) body.tag_ids = params.tag_ids;

      const response = await client.post<any>(
        `/v1/${customerId}/publishing/posts`,
        body
      );

      const postInfo = response.data?.[0] ?? response;
      const createdId = postInfo?.id ?? "unknown";

      results.push({
        post_index: i + 1,
        scheduled_time: postScheduledStr,
        status: "success",
        post_id: createdId,
      });
    } catch (err: any) {
      results.push({
        post_index: i + 1,
        scheduled_time: postScheduledStr,
        status: "failed",
        error: err.message || String(err),
      });
    }
  }

  if (params.response_format === "json") {
    return {
      content: [{ type: "text" as const, text: JSON.stringify(results, null, 2) }],
    };
  }

  const table = formatAsTable(results, ["post_index", "scheduled_time", "status", "post_id", "error"]);
  const reportText = [
    `# Sequential Campaign Scheduling Queue`,
    `**Target Profiles**: ${params.profile_ids.join(", ")}`,
    `**Interval**: Every ${params.interval_days} days`,
    ``,
    table,
  ].join("\n");

  return { content: [{ type: "text" as const, text: truncateIfNeeded(reportText) }] };
}


