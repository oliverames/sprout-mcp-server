import { describe, it, expect, vi } from "vitest";
import type { ApiClient } from "../../src/services/api-client.js";
import { handleGetMessages } from "../../src/tools/messages.js";

function mockApiClient(responseData: unknown, paging = {}): ApiClient {
  return {
    get: vi.fn(),
    post: vi.fn().mockResolvedValue({ data: responseData, paging }),
    postFormData: vi.fn(),
  };
}

describe("handleGetMessages", () => {
  it("builds filters from profile_ids and date range", async () => {
    const client = mockApiClient([]);
    await handleGetMessages(client, 999, {
      profile_ids: [123],
      start_date: "2024-01-01",
      end_date: "2024-02-01",
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      "/v1/999/messages",
      expect.objectContaining({
        filters: expect.arrayContaining([
          "customer_profile_id.eq(123)",
          "created_time.in(2024-01-01...2024-02-01)",
        ]),
      })
    );
  });

  it("uses page_cursor for pagination", async () => {
    const client = mockApiClient([]);
    await handleGetMessages(client, 999, {
      cursor: "abc123==",
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      "/v1/999/messages",
      expect.objectContaining({
        page_cursor: "abc123==",
      })
    );
  });

  it("passes message_ids as filter when provided", async () => {
    const client = mockApiClient([]);
    await handleGetMessages(client, 999, {
      message_ids: ["msg-1", "msg-2"],
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      "/v1/999/messages",
      expect.objectContaining({
        filters: ["message_id.eq(msg-1, msg-2)"],
      })
    );
  });

  it("includes group_id filter", async () => {
    const client = mockApiClient([]);
    await handleGetMessages(client, 999, {
      group_id: 55,
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      "/v1/999/messages",
      expect.objectContaining({
        filters: expect.arrayContaining(["group_id.eq(55)"]),
      })
    );
  });

  it("returns error when only start_date provided without end_date", async () => {
    const client = mockApiClient([]);
    const result = await handleGetMessages(client, 999, {
      start_date: "2024-01-01",
      response_format: "json",
    });
    expect(result.isError).toBe(true);
    expect(result.content[0]!.text).toContain("Both start_date and end_date");
    expect(client.post).not.toHaveBeenCalled();
  });

  it("includes sort order in request", async () => {
    const client = mockApiClient([]);
    await handleGetMessages(client, 999, {
      sort_order: "asc",
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        sort: ["created_time:asc"],
      })
    );
  });
});
