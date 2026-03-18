import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ApiClient } from "../services/api-client.js";
import { formatOutput, truncateIfNeeded } from "../services/formatter.js";
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
  text: string;
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

export async function handleCreateDraftPost(
  client: ApiClient,
  customerId: number,
  params: CreateDraftPostParams
): Promise<ToolResponse> {
  const body: Record<string, unknown> = {
    customer_profile_ids: params.profile_ids,
    group_id: params.group_id,
    text: params.text,
    is_draft: true,
  };

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

  const result = await client.postFormData<{ media_id: string; expiration_time: string }>(
    `/v1/${customerId}/media/`,
    formData
  );

  const text = formatOutput(result, params.response_format);
  return { content: [{ type: "text" as const, text: truncateIfNeeded(text) }] };
}

export async function handleGetPost(
  client: ApiClient,
  customerId: number,
  params: GetPostParams
): Promise<ToolResponse> {
  const response = await client.get<{ data: unknown }>(
    `/v1/${customerId}/publishing/posts/${params.post_id}`
  );

  const text = formatOutput(response.data, params.response_format);
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
          text: z.string().min(1).describe("Post text content"),
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
            .array(z.string())
            .optional()
            .describe("ISO 8601 scheduled delivery times"),
          tag_ids: z.array(z.number()).optional().describe("Tag IDs to apply"),
          response_format: ResponseFormatSchema,
        })
        .strict(),
      annotations: WRITE_ANNOTATIONS,
    },
    async (params) => {
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
    }
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
    async (params) => {
      const cid = params.customer_id ?? defaultCustomerId;
      return handleUploadMedia(client, cid, {
        media_url: params.media_url,
        response_format: params.response_format,
      });
    }
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
    async (params) => {
      const cid = params.customer_id ?? defaultCustomerId;
      return handleGetPost(client, cid, {
        post_id: params.post_id,
        response_format: params.response_format,
      });
    }
  );
}
