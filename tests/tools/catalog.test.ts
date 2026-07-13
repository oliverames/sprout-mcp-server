import { readFileSync } from "node:fs";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { afterEach, describe, expect, it } from "vitest";
import { SERVER_VERSION } from "../../src/constants.js";
import { USER_AGENT } from "../../src/services/api-client.js";
import type { ApiClient } from "../../src/services/api-client.js";
import {
  registerSproutTools,
  SPROUT_TOOL_COUNT,
  SPROUT_TOOL_NAMES,
} from "../../src/tools/catalog.js";

const unusedClient: ApiClient = {
  async get() { throw new Error("API client should not be called while listing tools"); },
  async getWithPolling() { throw new Error("API client should not be called while listing tools"); },
  async post() { throw new Error("API client should not be called while listing tools"); },
  async postFormData() { throw new Error("API client should not be called while listing tools"); },
};

const closeCallbacks: Array<() => Promise<void>> = [];

afterEach(async () => {
  await Promise.all(closeCallbacks.splice(0).map((close) => close()));
});

describe("release metadata", () => {
  it("keeps source, npm, and MCPB versions aligned", () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
    const manifest = JSON.parse(readFileSync("manifest.json", "utf8"));

    expect(packageJson.version).toBe(SERVER_VERSION);
    expect(manifest.version).toBe(SERVER_VERSION);
    expect(USER_AGENT).toBe(`sprout-mcp-server/${SERVER_VERSION}`);
  });
});

describe("tool catalog", () => {
  it("exposes the documented catalog over MCP", async () => {
    const server = new McpServer({ name: "sprout-catalog-test", version: SERVER_VERSION });
    const client = new Client({ name: "sprout-catalog-test-client", version: "1.0.0" });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    registerSproutTools(server, unusedClient, 0, false);
    await Promise.all([
      server.connect(serverTransport),
      client.connect(clientTransport),
    ]);
    closeCallbacks.push(() => client.close(), () => server.close());

    const result = await client.listTools();
    const names = result.tools.map((tool) => tool.name);

    expect(names).toEqual([...SPROUT_TOOL_NAMES]);
    expect(names).toHaveLength(SPROUT_TOOL_COUNT);
    expect(SPROUT_TOOL_COUNT).toBe(28);
  });
});
