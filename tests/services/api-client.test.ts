import { describe, it, expect } from "vitest";
import { handleApiError } from "../../src/services/api-client.js";

describe("handleApiError", () => {
  it("maps 401 to auth error message with request ID", () => {
    const error = {
      isAxiosError: true,
      response: {
        status: 401,
        headers: { "x-sprout-request-id": "req-123" },
        data: {},
      },
    };
    const msg = handleApiError(error);
    expect(msg).toContain("Authentication failed");
    expect(msg).toContain("req-123");
  });

  it("maps 400 to bad request message", () => {
    const error = {
      isAxiosError: true,
      response: { status: 400, headers: {}, data: {} },
    };
    expect(handleApiError(error)).toContain("Bad request");
  });

  it("maps 403 to permissions message", () => {
    const error = {
      isAxiosError: true,
      response: { status: 403, headers: {}, data: {} },
    };
    expect(handleApiError(error)).toContain("permissions");
  });

  it("maps 404 to not found message", () => {
    const error = {
      isAxiosError: true,
      response: { status: 404, headers: {}, data: {} },
    };
    expect(handleApiError(error)).toContain("not found");
  });

  it("maps 429 to rate limit message", () => {
    const error = {
      isAxiosError: true,
      response: { status: 429, headers: {}, data: {} },
    };
    expect(handleApiError(error)).toContain("Rate limited");
  });

  it("maps 504 to timeout message", () => {
    const error = {
      isAxiosError: true,
      response: { status: 504, headers: {}, data: {} },
    };
    expect(handleApiError(error)).toContain("timed out");
  });

  it("maps connection abort to timeout message", () => {
    const error = {
      isAxiosError: true,
      code: "ECONNABORTED",
      message: "timeout",
    };
    expect(handleApiError(error)).toContain("timed out");
  });

  it("handles non-axios errors", () => {
    expect(handleApiError(new Error("network down"))).toContain("network down");
  });

  it("handles unknown error shapes", () => {
    expect(handleApiError("something")).toContain("something");
  });

  it("includes API error detail in 400 response", () => {
    const error = {
      isAxiosError: true,
      response: { status: 400, headers: {}, data: { error: "reporting_period filter is required" } },
    };
    const msg = handleApiError(error);
    expect(msg).toContain("Bad request");
    expect(msg).toContain("reporting_period filter is required");
  });

  it("includes API error message from response body", () => {
    const error = {
      isAxiosError: true,
      response: { status: 422, headers: {}, data: { error: "Invalid metric name" } },
      message: "Request failed",
    };
    expect(handleApiError(error)).toContain("Invalid metric name");
  });
});
