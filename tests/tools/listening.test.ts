import { describe, it, expect, vi } from "vitest";
import type { ApiClient } from "../../src/services/api-client.js";
import {
  handleListeningMessages,
  handleListeningMetrics,
} from "../../src/tools/listening.js";

function mockApiClient(responseData: unknown, paging = {}): ApiClient {
  return {
    get: vi.fn(),
    getWithPolling: vi.fn(),
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
      sentiment: "positive",
      fields: ["text", "created_time"],
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      "/v1/999/listening/topics/42/messages",
      expect.objectContaining({
        filters: expect.arrayContaining([
          "created_time.in(2024-01-01...2024-02-01)",
          "sentiment.eq(positive)",
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

  it("includes network filter with multiple values", async () => {
    const client = mockApiClient([]);
    await handleListeningMessages(client, 999, {
      topic_id: 42,
      start_date: "2024-01-01",
      end_date: "2024-02-01",
      networks: ["TWITTER", "INSTAGRAM"],
      fields: ["text"],
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        filters: expect.arrayContaining([
          "network.eq(TWITTER, INSTAGRAM)",
        ]),
      })
    );
  });

  it("includes theme_ids filter", async () => {
    const client = mockApiClient([]);
    await handleListeningMessages(client, 999, {
      topic_id: 42,
      start_date: "2024-01-01",
      end_date: "2024-02-01",
      theme_ids: [100, 200],
      fields: ["text"],
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        filters: expect.arrayContaining([
          "document.theme_ids.eq(100, 200)",
        ]),
      })
    );
  });

  it("includes language and location filters", async () => {
    const client = mockApiClient([]);
    await handleListeningMessages(client, 999, {
      topic_id: 42,
      start_date: "2024-01-01",
      end_date: "2024-02-01",
      language: ["en", "es"],
      location_country: ["US"],
      fields: ["text"],
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        filters: expect.arrayContaining([
          "language.eq(en, es)",
          "location.country.eq(US)",
        ]),
      })
    );
  });

  it("includes explicit_label and visual_media exists filters", async () => {
    const client = mockApiClient([]);
    await handleListeningMessages(client, 999, {
      topic_id: 42,
      start_date: "2024-01-01",
      end_date: "2024-02-01",
      explicit_label: true,
      has_visual_media: false,
      fields: ["text"],
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        filters: expect.arrayContaining([
          "explicit_label.exists(true)",
          "visual_media.exists(false)",
        ]),
      })
    );
  });

  it("passes additional_filters for metric-based filtering", async () => {
    const client = mockApiClient([]);
    await handleListeningMessages(client, 999, {
      topic_id: 42,
      start_date: "2024-01-01",
      end_date: "2024-02-01",
      additional_filters: ["likes.gt(10)", "engagements.gte(5)"],
      fields: ["text"],
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        filters: expect.arrayContaining([
          "likes.gt(10)",
          "engagements.gte(5)",
        ]),
      })
    );
  });

  it("includes metrics in request body", async () => {
    const client = mockApiClient([]);
    await handleListeningMessages(client, 999, {
      topic_id: 42,
      start_date: "2024-01-01",
      end_date: "2024-02-01",
      fields: ["text"],
      metrics: ["engagements", "likes"],
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        metrics: ["engagements", "likes"],
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

  it("includes network, sentiment, and text_search filters", async () => {
    const client = mockApiClient([]);
    await handleListeningMetrics(client, 999, {
      topic_id: 42,
      start_date: "2024-01-01",
      end_date: "2024-02-01",
      networks: ["TWITTER"],
      sentiment: "positive",
      text_search: "sprout",
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        filters: expect.arrayContaining([
          "network.eq(TWITTER)",
          "sentiment.eq(positive)",
          "text.match(sprout)",
        ]),
      })
    );
  });

  it("passes additional_filters for metric-based filtering", async () => {
    const client = mockApiClient([]);
    await handleListeningMetrics(client, 999, {
      topic_id: 42,
      start_date: "2024-01-01",
      end_date: "2024-02-01",
      additional_filters: ["impressions.lte(1000)"],
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        filters: expect.arrayContaining([
          "impressions.lte(1000)",
        ]),
      })
    );
  });

  it("includes limit in request body", async () => {
    const client = mockApiClient([]);
    await handleListeningMetrics(client, 999, {
      topic_id: 42,
      start_date: "2024-01-01",
      end_date: "2024-02-01",
      limit: 100,
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        limit: 100,
      })
    );
  });

  it("includes language and location filters", async () => {
    const client = mockApiClient([]);
    await handleListeningMetrics(client, 999, {
      topic_id: 42,
      start_date: "2024-01-01",
      end_date: "2024-02-01",
      language: ["en", "es"],
      location_country: ["US"],
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        filters: expect.arrayContaining([
          "language.eq(en, es)",
          "location.country.eq(US)",
        ]),
      })
    );
  });

  it("includes explicit_label and visual_media exists filters", async () => {
    const client = mockApiClient([]);
    await handleListeningMetrics(client, 999, {
      topic_id: 42,
      start_date: "2024-01-01",
      end_date: "2024-02-01",
      explicit_label: false,
      has_visual_media: true,
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        filters: expect.arrayContaining([
          "explicit_label.exists(false)",
          "visual_media.exists(true)",
        ]),
      })
    );
  });

  it("includes theme_ids and distribution_type filters", async () => {
    const client = mockApiClient([]);
    await handleListeningMetrics(client, 999, {
      topic_id: 42,
      start_date: "2024-01-01",
      end_date: "2024-02-01",
      theme_ids: [10, 20],
      distribution_type: ["ORIGINAL"],
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        filters: expect.arrayContaining([
          "document.theme_ids.eq(10, 20)",
          "distribution_type.eq(ORIGINAL)",
        ]),
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
