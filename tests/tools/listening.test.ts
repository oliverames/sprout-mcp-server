import { describe, it, expect, vi } from "vitest";
import type { ApiClient } from "../../src/services/api-client.js";
import {
  handleListeningMessages,
  handleListeningMetrics,
} from "../../src/tools/listening.js";

function mockApiClient(responseData: unknown, paging = {}): ApiClient {
  return {
    get: vi.fn(),
    post: vi.fn().mockResolvedValue({ data: responseData, paging }),
    postFormData: vi.fn(),
  };
}

describe("handleListeningMessages", () => {
  it("builds filters with dates and sentiment", async () => {
    const client = mockApiClient([]);
    await handleListeningMessages(client, 999, {
      topic_id: 42,
      start_date: "2024-01-01",
      end_date: "2024-02-01",
      sentiment: "POSITIVE",
      fields: ["text", "created_time"],
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      "/v1/999/listening/topics/42/messages",
      expect.objectContaining({
        filters: expect.arrayContaining([
          "created_time.in(2024-01-01...2024-02-01)",
          "sentiment.eq(POSITIVE)",
        ]),
      })
    );
  });

  it("includes text_search as match filter", async () => {
    const client = mockApiClient([]);
    await handleListeningMessages(client, 999, {
      topic_id: 42,
      start_date: "2024-01-01",
      end_date: "2024-02-01",
      text_search: "sprout OR social",
      fields: ["text"],
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        filters: expect.arrayContaining([
          "text.match(sprout OR social)",
        ]),
      })
    );
  });

  it("sends fields in request body", async () => {
    const client = mockApiClient([]);
    await handleListeningMessages(client, 999, {
      topic_id: 42,
      start_date: "2024-01-01",
      end_date: "2024-02-01",
      fields: ["text", "network", "created_time"],
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        fields: ["text", "network", "created_time"],
      })
    );
  });

  it("includes network filter", async () => {
    const client = mockApiClient([]);
    await handleListeningMessages(client, 999, {
      topic_id: 42,
      start_date: "2024-01-01",
      end_date: "2024-02-01",
      network: "twitter",
      fields: ["text"],
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        filters: expect.arrayContaining([
          "network.eq(twitter)",
        ]),
      })
    );
  });
});

describe("handleListeningMetrics", () => {
  it("sends metrics and dimensions in request body", async () => {
    const client = mockApiClient([]);
    await handleListeningMetrics(client, 999, {
      topic_id: 42,
      start_date: "2024-01-01",
      end_date: "2024-02-01",
      metrics: ["engagements", "messages_count"],
      dimensions: ["created_time.by(day)"],
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      "/v1/999/listening/topics/42/metrics",
      expect.objectContaining({
        metrics: ["engagements", "messages_count"],
        dimensions: ["created_time.by(day)"],
      })
    );
  });

  it("includes timezone", async () => {
    const client = mockApiClient([]);
    await handleListeningMetrics(client, 999, {
      topic_id: 42,
      start_date: "2024-01-01",
      end_date: "2024-02-01",
      timezone: "America/Chicago",
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        timezone: "America/Chicago",
      })
    );
  });
});
