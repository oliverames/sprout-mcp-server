import { describe, it, expect, vi } from "vitest";
import type { ApiClient } from "../../src/services/api-client.js";
import {
  handleProfileAnalytics,
  handlePostAnalytics,
} from "../../src/tools/analytics.js";

function mockApiClient(responseData: unknown): ApiClient {
  return {
    get: vi.fn(),
    getWithPolling: vi.fn(),
    post: vi.fn().mockResolvedValue({ data: responseData, paging: { current_page: 1, total_pages: 1 } }),
    postFormData: vi.fn(),
  };
}

describe("handleProfileAnalytics", () => {
  it("builds correct filters and request body", async () => {
    const client = mockApiClient([]);
    await handleProfileAnalytics(client, 999, {
      profile_ids: [123, 456],
      start_date: "2024-01-01",
      end_date: "2024-01-31",
      metrics: ["impressions"],
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      "/v1/999/analytics/profiles",
      expect.objectContaining({
        filters: [
          "customer_profile_id.eq(123, 456)",
          "reporting_period.in(2024-01-01..2024-01-31)",
        ],
        metrics: ["impressions"],
      })
    );
  });

  it("includes page and limit in request", async () => {
    const client = mockApiClient([]);
    await handleProfileAnalytics(client, 999, {
      profile_ids: [123],
      start_date: "2024-01-01",
      end_date: "2024-01-31",
      metrics: ["impressions"],
      page: 2,
      limit: 500,
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        page: 2,
        limit: 500,
      })
    );
  });

  it("includes dimension columns in markdown output", async () => {
    const client = {
      get: vi.fn(),
    getWithPolling: vi.fn(),
      post: vi.fn().mockResolvedValue({
        data: [{
          dimensions: { "reporting_period.by(day)": "2024-01-01", customer_profile_id: 123 },
          metrics: { impressions: 5000 },
        }],
        paging: { current_page: 1, total_pages: 1 },
      }),
      postFormData: vi.fn(),
    };
    const result = await handleProfileAnalytics(client, 999, {
      profile_ids: [123],
      start_date: "2024-01-01",
      end_date: "2024-01-31",
      metrics: ["impressions"],
      response_format: "markdown",
    });
    expect(result.content[0]!.text).toContain("customer_profile_id");
    expect(result.content[0]!.text).toContain("123");
    expect(result.content[0]!.text).toContain("5000");
  });

  it("rejects date range exceeding 365 days", async () => {
    const client = mockApiClient([]);
    const result = await handleProfileAnalytics(client, 999, {
      profile_ids: [123],
      start_date: "2023-01-01",
      end_date: "2024-06-01",
      metrics: ["impressions"],
      response_format: "json",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0]!.text).toContain("365 days");
    expect(client.post).not.toHaveBeenCalled();
  });

  it("rejects inverted date range", async () => {
    const client = mockApiClient([]);
    const result = await handleProfileAnalytics(client, 999, {
      profile_ids: [123],
      start_date: "2024-06-01",
      end_date: "2024-01-01",
      metrics: ["impressions"],
      response_format: "json",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0]!.text).toContain("before");
    expect(client.post).not.toHaveBeenCalled();
  });
});

describe("handlePostAnalytics", () => {
  it("builds correct filters with sort and timezone", async () => {
    const client = mockApiClient([]);
    await handlePostAnalytics(client, 999, {
      profile_ids: [123],
      start_date: "2024-01-01",
      end_date: "2024-02-01",
      metrics: ["lifetime.impressions"],
      fields: ["text", "created_time"],
      sort_order: "asc",
      timezone: "America/Chicago",
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      "/v1/999/analytics/posts",
      expect.objectContaining({
        filters: [
          "customer_profile_id.eq(123)",
          "created_time.in(2024-01-01...2024-02-01)",
        ],
        metrics: ["lifetime.impressions"],
        fields: ["text", "created_time"],
        sort: ["created_time:asc"],
        timezone: "America/Chicago",
      })
    );
  });

  it("uses custom sort_field", async () => {
    const client = mockApiClient([]);
    await handlePostAnalytics(client, 999, {
      profile_ids: [123],
      start_date: "2024-01-01",
      end_date: "2024-02-01",
      sort_field: "guid",
      sort_order: "asc",
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        sort: ["guid:asc"],
      })
    );
  });

  it("adds guid.gt filter when guid_cursor is provided", async () => {
    const client = mockApiClient([]);
    await handlePostAnalytics(client, 999, {
      profile_ids: [123],
      start_date: "2024-01-01",
      end_date: "2024-02-01",
      sort_field: "guid",
      sort_order: "asc",
      guid_cursor: "102",
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        filters: expect.arrayContaining([
          "guid.gt(102)",
        ]),
        sort: ["guid:asc"],
      })
    );
  });

  it("uses default sort order desc", async () => {
    const client = mockApiClient([]);
    await handlePostAnalytics(client, 999, {
      profile_ids: [123],
      start_date: "2024-01-01",
      end_date: "2024-02-01",
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        sort: ["created_time:desc"],
      })
    );
  });
});
