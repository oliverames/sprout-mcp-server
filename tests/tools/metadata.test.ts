import { describe, it, expect, vi } from "vitest";
import type { ApiClient } from "../../src/services/api-client.js";
import {
  handleListCustomers,
  handleListProfiles,
  handleListGroups,
  handleListTags,
  handleListUsers,
  handleListTeams,
  handleListQueues,
  handleListTopics,
} from "../../src/tools/metadata.js";

function mockApiClient(data: unknown): ApiClient {
  return {
    get: vi.fn().mockResolvedValue({ data }),
    getWithPolling: vi.fn(),
    post: vi.fn(),
    postFormData: vi.fn(),
  };
}

describe("handleListCustomers", () => {
  it("calls GET /v1/metadata/client and returns data", async () => {
    const client = mockApiClient([{ customer_id: 123, name: "Acme Corp" }]);
    const result = await handleListCustomers(client, { response_format: "json" });
    expect(client.get).toHaveBeenCalledWith("/v1/metadata/client");
    expect(result.content[0]!.text).toContain("123");
  });
});

describe("handleListProfiles", () => {
  it("calls correct endpoint with customer_id", async () => {
    const client = mockApiClient([
      { customer_profile_id: 1, network_type: "instagram", name: "Test" },
    ]);
    const result = await handleListProfiles(client, 999, { response_format: "json" });
    expect(client.get).toHaveBeenCalledWith("/v1/999/metadata/customer");
    expect(result.content[0]!.text).toContain("instagram");
  });

  it("includes native_id in markdown table columns", async () => {
    const client = mockApiClient([
      { customer_profile_id: 1, network_type: "twitter", name: "Acme", native_name: "acmecorp", native_id: "42793960" },
    ]);
    const result = await handleListProfiles(client, 999, { response_format: "markdown" });
    expect(result.content[0]!.text).toContain("native_id");
    expect(result.content[0]!.text).toContain("42793960");
  });
});

describe("handleListGroups", () => {
  it("calls correct endpoint", async () => {
    const client = mockApiClient([{ group_id: 1, name: "Marketing" }]);
    const result = await handleListGroups(client, 999, { response_format: "markdown" });
    expect(client.get).toHaveBeenCalledWith("/v1/999/metadata/customer/groups");
    expect(result.content[0]!.text).toContain("Marketing");
  });
});

describe("handleListTags", () => {
  it("calls correct endpoint", async () => {
    const client = mockApiClient([{ tag_id: 1, text: "Launch", type: "CAMPAIGN", active: true }]);
    const result = await handleListTags(client, 999, { response_format: "json" });
    expect(client.get).toHaveBeenCalledWith("/v1/999/metadata/customer/tags");
    expect(result.content[0]!.text).toContain("Launch");
  });
});

describe("handleListUsers", () => {
  it("calls correct endpoint", async () => {
    const client = mockApiClient([{ id: 1, name: "Alice", email: "alice@co.com" }]);
    const result = await handleListUsers(client, 999, { response_format: "json" });
    expect(client.get).toHaveBeenCalledWith("/v1/999/metadata/customer/users");
    expect(result.content[0]!.text).toContain("Alice");
  });
});

describe("handleListTeams", () => {
  it("calls correct endpoint", async () => {
    const client = mockApiClient([{ id: 1, name: "Social Team", description: "Main team" }]);
    const result = await handleListTeams(client, 999, { response_format: "json" });
    expect(client.get).toHaveBeenCalledWith("/v1/999/metadata/customer/teams");
    expect(result.content[0]!.text).toContain("Social Team");
  });
});

describe("handleListQueues", () => {
  it("calls correct endpoint", async () => {
    const client = mockApiClient([{ id: 1, name: "Support Queue", description: "Main queue" }]);
    const result = await handleListQueues(client, 999, { response_format: "json" });
    expect(client.get).toHaveBeenCalledWith("/v1/999/metadata/customer/queues");
    expect(result.content[0]!.text).toContain("Support Queue");
  });
});

describe("handleListTopics", () => {
  it("calls correct endpoint", async () => {
    const client = mockApiClient([{ id: 1, name: "Brand Mentions", topic_type: "BASIC" }]);
    const result = await handleListTopics(client, 999, { response_format: "json" });
    expect(client.get).toHaveBeenCalledWith("/v1/999/metadata/customer/topics");
    expect(result.content[0]!.text).toContain("Brand Mentions");
  });
});
