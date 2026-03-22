import { describe, it, expect, vi } from "vitest";
import type { ApiClient } from "../../src/services/api-client.js";
import {
  handleCreateDraftPost,
  handleUploadMedia,
  handleGetPost,
  handleStartMultipartUpload,
  handleContinueMultipartUpload,
  handleCompleteMultipartUpload,
} from "../../src/tools/publishing.js";

function mockApiClient(responseData: unknown): ApiClient {
  return {
    get: vi.fn().mockResolvedValue({ data: responseData }),
    getWithPolling: vi.fn().mockResolvedValue({ data: responseData }),
    post: vi.fn().mockResolvedValue({ data: responseData }),
    postFormData: vi.fn().mockResolvedValue(responseData),
  };
}

describe("handleCreateDraftPost", () => {
  it("constructs correct request body with draft=true and delivery wrapper", async () => {
    const client = mockApiClient([{ id: "post-1" }]);
    await handleCreateDraftPost(client, 999, {
      profile_ids: [123, 456],
      group_id: 789,
      text: "Hello world!",
      scheduled_times: ["2024-06-30T18:00:00Z"],
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      "/v1/999/publishing/posts",
      expect.objectContaining({
        customer_profile_ids: [123, 456],
        group_id: 789,
        text: "Hello world!",
        is_draft: true,
        delivery: {
          scheduled_times: ["2024-06-30T18:00:00Z"],
          type: "SCHEDULED",
        },
      })
    );
  });

  it("includes media array with media_id and media_type", async () => {
    const client = mockApiClient([]);
    await handleCreateDraftPost(client, 999, {
      profile_ids: [123],
      group_id: 789,
      text: "Photo post",
      media: [{ media_id: "uuid-1", media_type: "PHOTO" as const }],
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        media: [{ media_id: "uuid-1", media_type: "PHOTO" }],
      })
    );
  });

  it("omits text from body when not provided (media-only post)", async () => {
    const client = mockApiClient([]);
    await handleCreateDraftPost(client, 999, {
      profile_ids: [123],
      group_id: 789,
      media: [{ media_id: "uuid-1", media_type: "PHOTO" as const }],
      response_format: "json",
    });

    const callBody = (client.post as ReturnType<typeof vi.fn>).mock.calls[0]![1] as Record<string, unknown>;
    expect(callBody.text).toBeUndefined();
    expect(callBody.is_draft).toBe(true);
    expect(callBody.media).toEqual([{ media_id: "uuid-1", media_type: "PHOTO" }]);
  });

  it("omits delivery when no scheduled_times", async () => {
    const client = mockApiClient([]);
    await handleCreateDraftPost(client, 999, {
      profile_ids: [123],
      group_id: 789,
      text: "No schedule",
      response_format: "json",
    });

    const callBody = (client.post as ReturnType<typeof vi.fn>).mock.calls[0]![1] as Record<string, unknown>;
    expect(callBody.delivery).toBeUndefined();
  });
});

describe("handleUploadMedia", () => {
  it("sends media_url as form data and unwraps data envelope", async () => {
    const client = {
      get: vi.fn(),
      post: vi.fn(),
      postFormData: vi.fn().mockResolvedValue({
        data: [{ media_id: "uuid-1", expiration_time: "2024-01-02T00:00:00Z" }],
      }),
    } satisfies ApiClient;

    const result = await handleUploadMedia(client, 999, {
      media_url: "https://example.com/image.jpg",
      response_format: "json",
    });

    expect(client.postFormData).toHaveBeenCalledWith(
      "/v1/999/media/",
      expect.any(FormData)
    );
    const parsed = JSON.parse(result.content[0]!.text);
    expect(parsed.media_id).toBe("uuid-1");
  });
});

describe("handleGetPost", () => {
  it("calls correct endpoint", async () => {
    const client = mockApiClient({ id: "post-1", text: "Hello" });
    await handleGetPost(client, 999, {
      post_id: "post-1",
      response_format: "json",
    });

    expect(client.get).toHaveBeenCalledWith("/v1/999/publishing/posts/post-1");
  });
});

describe("handleStartMultipartUpload", () => {
  it("posts to media/submission with media_url", async () => {
    const client = {
      get: vi.fn(),
      getWithPolling: vi.fn(),
      post: vi.fn(),
      postFormData: vi.fn().mockResolvedValue({
        data: [{ submission_id: "sub-123" }],
      }),
    } satisfies ApiClient;

    const result = await handleStartMultipartUpload(client, 999, {
      media_url: "https://example.com/large-video.mp4",
      response_format: "json",
    });

    expect(client.postFormData).toHaveBeenCalledWith(
      "/v1/999/media/submission",
      expect.any(FormData)
    );
    const parsed = JSON.parse(result.content[0]!.text);
    expect(parsed.submission_id).toBe("sub-123");
  });

  it("works without media_url for direct file upload flow", async () => {
    const client = {
      get: vi.fn(),
      getWithPolling: vi.fn(),
      post: vi.fn(),
      postFormData: vi.fn().mockResolvedValue({
        data: [{ submission_id: "sub-456" }],
      }),
    } satisfies ApiClient;

    await handleStartMultipartUpload(client, 999, {
      response_format: "json",
    });

    expect(client.postFormData).toHaveBeenCalledWith(
      "/v1/999/media/submission",
      expect.any(FormData)
    );
  });
});

describe("handleContinueMultipartUpload", () => {
  it("posts to correct part endpoint", async () => {
    const client = {
      get: vi.fn(),
      getWithPolling: vi.fn(),
      post: vi.fn(),
      postFormData: vi.fn().mockResolvedValue({}),
    } satisfies ApiClient;

    const result = await handleContinueMultipartUpload(client, 999, {
      submission_id: "sub-123",
      part_number: 2,
      media_url: "https://example.com/part2.bin",
      response_format: "json",
    });

    expect(client.postFormData).toHaveBeenCalledWith(
      "/v1/999/media/submission/sub-123/part/2",
      expect.any(FormData)
    );
    const parsed = JSON.parse(result.content[0]!.text);
    expect(parsed.submission_id).toBe("sub-123");
    expect(parsed.part_number).toBe(2);
  });
});

describe("handleCompleteMultipartUpload", () => {
  it("polls via getWithPolling and returns media_id", async () => {
    const client = {
      get: vi.fn(),
      getWithPolling: vi.fn().mockResolvedValue({
        data: [{ media_id: "media-789", expiration_time: "2024-01-02T00:00:00Z" }],
      }),
      post: vi.fn(),
      postFormData: vi.fn(),
    } satisfies ApiClient;

    const result = await handleCompleteMultipartUpload(client, 999, {
      submission_id: "sub-123",
      response_format: "json",
    });

    expect(client.getWithPolling).toHaveBeenCalledWith(
      "/v1/999/media/submission/sub-123"
    );
    const parsed = JSON.parse(result.content[0]!.text);
    expect(parsed.media_id).toBe("media-789");
  });
});
