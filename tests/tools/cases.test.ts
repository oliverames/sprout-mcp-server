import { describe, it, expect, vi } from "vitest";
import type { ApiClient } from "../../src/services/api-client.js";
import { handleGetCases } from "../../src/tools/cases.js";

function mockApiClient(responseData: unknown, paging = {}): ApiClient {
  return {
    get: vi.fn(),
    getWithPolling: vi.fn(),
    post: vi.fn().mockResolvedValue({ data: responseData, paging }),
    postFormData: vi.fn(),
  };
}

describe("handleGetCases", () => {
  it("builds date filter using specified date_field", async () => {
    const client = mockApiClient([]);
    await handleGetCases(client, 999, {
      start_date: "2024-01-01",
      end_date: "2024-01-07",
      date_field: "created_time",
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      "/v1/999/cases/filter",
      expect.objectContaining({
        filters: expect.arrayContaining([
          "created_time.in(2024-01-01...2024-01-07)",
        ]),
      })
    );
  });

  it("defaults date_field to updated_time", async () => {
    const client = mockApiClient([]);
    await handleGetCases(client, 999, {
      start_date: "2024-01-01",
      end_date: "2024-01-07",
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        filters: expect.arrayContaining([
          "updated_time.in(2024-01-01...2024-01-07)",
        ]),
      })
    );
  });

  it("uses case_ids filter when provided (no date filters)", async () => {
    const client = mockApiClient([]);
    await handleGetCases(client, 999, {
      case_ids: [1, 2, 3],
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        filters: ["case_id.eq(1, 2, 3)"],
      })
    );
  });

  it("maps cursor to page_cursor and sort params to sort array", async () => {
    const client = mockApiClient([]);
    await handleGetCases(client, 999, {
      start_date: "2024-01-01",
      end_date: "2024-01-07",
      sort_by: "updated_time",
      sort_order: "asc",
      cursor: "xyz==",
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        sort: ["updated_time:asc"],
        page_cursor: "xyz==",
      })
    );
  });

  it("validates date range does not exceed 1 week", async () => {
    const client = mockApiClient([]);
    const result = await handleGetCases(client, 999, {
      start_date: "2024-01-01",
      end_date: "2024-01-15",
      response_format: "json",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0]!.text).toContain("1 week");
  });

  it("returns error when both case_ids and date filters are provided", async () => {
    const client = mockApiClient([]);
    const result = await handleGetCases(client, 999, {
      start_date: "2024-01-01",
      end_date: "2024-01-07",
      case_ids: [1, 2],
      response_format: "json",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0]!.text).toContain("mutually exclusive");
  });

  it("returns error when no case_ids and no date filters", async () => {
    const client = mockApiClient([]);
    const result = await handleGetCases(client, 999, {
      status: ["OPEN"],
      response_format: "json",
    });
    expect(result.isError).toBe(true);
    expect(result.content[0]!.text).toContain("required");
    expect(client.post).not.toHaveBeenCalled();
  });

  it("returns error when only start_date is provided", async () => {
    const client = mockApiClient([]);
    const result = await handleGetCases(client, 999, {
      start_date: "2024-01-01",
      response_format: "json",
    });
    expect(result.isError).toBe(true);
    expect(result.content[0]!.text).toContain("Both start_date and end_date");
    expect(client.post).not.toHaveBeenCalled();
  });

  it("returns error when start_date is after end_date", async () => {
    const client = mockApiClient([]);
    const result = await handleGetCases(client, 999, {
      start_date: "2024-01-07",
      end_date: "2024-01-01",
      response_format: "json",
    });
    expect(result.isError).toBe(true);
    expect(result.content[0]!.text).toContain("before");
    expect(client.post).not.toHaveBeenCalled();
  });

  it("includes assigned_by, created_by, and message_ids filters", async () => {
    const client = mockApiClient([]);
    await handleGetCases(client, 999, {
      start_date: "2024-01-01",
      end_date: "2024-01-07",
      assigned_by: "urn:sprout:user:123",
      created_by: "urn:sprout:user:456",
      message_ids: ["msg-1", "msg-2"],
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        filters: expect.arrayContaining([
          "assigned_by.eq(urn:sprout:user:123)",
          "created_by.eq(urn:sprout:user:456)",
          "message_id.eq(msg-1, msg-2)",
        ]),
      })
    );
  });

  it("includes exclude_tag_ids as neq filter", async () => {
    const client = mockApiClient([]);
    await handleGetCases(client, 999, {
      start_date: "2024-01-01",
      end_date: "2024-01-07",
      tag_ids: [100],
      exclude_tag_ids: [200, 300],
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        filters: expect.arrayContaining([
          "tag_id.eq(100)",
          "tag_id.neq(200, 300)",
        ]),
      })
    );
  });

  it("passes additional_filters as raw DSL strings", async () => {
    const client = mockApiClient([]);
    await handleGetCases(client, 999, {
      start_date: "2024-01-01",
      end_date: "2024-01-07",
      date_field: "created_time",
      additional_filters: ["updated_time.in(2024-01-03...2024-01-07)"],
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        filters: expect.arrayContaining([
          "created_time.in(2024-01-01...2024-01-07)",
          "updated_time.in(2024-01-03...2024-01-07)",
        ]),
      })
    );
  });

  it("includes status, priority, type filters", async () => {
    const client = mockApiClient([]);
    await handleGetCases(client, 999, {
      start_date: "2024-01-01",
      end_date: "2024-01-07",
      status: ["OPEN", "IN_PROGRESS"],
      priority: ["HIGH"],
      type: ["SUPPORT"],
      response_format: "json",
    });

    expect(client.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        filters: expect.arrayContaining([
          "status.eq(OPEN, IN_PROGRESS)",
          "priority.eq(HIGH)",
          "type.eq(SUPPORT)",
        ]),
      })
    );
  });
});
