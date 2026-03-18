import { describe, it, expect } from "vitest";
import {
  formatAsTable,
  formatAsList,
  formatOutput,
  truncateIfNeeded,
} from "../../src/services/formatter.js";

describe("formatAsTable", () => {
  it("formats array of objects as markdown table", () => {
    const data = [
      { name: "Alice", role: "Admin" },
      { name: "Bob", role: "User" },
    ];
    const result = formatAsTable(data, ["name", "role"]);
    expect(result).toContain("| name | role |");
    expect(result).toContain("| Alice | Admin |");
    expect(result).toContain("| Bob | User |");
  });

  it("returns 'No data' for empty array", () => {
    expect(formatAsTable([], ["a"])).toBe("No data found.");
  });
});

describe("formatAsList", () => {
  it("formats items as bullet list", () => {
    const result = formatAsList(["one", "two", "three"]);
    expect(result).toBe("- one\n- two\n- three");
  });
});

describe("formatOutput", () => {
  it("returns JSON string for json format", () => {
    const data = { foo: "bar" };
    const result = formatOutput(data, "json");
    expect(result).toBe(JSON.stringify(data, null, 2));
  });

  it("returns markdown string for markdown format with custom renderer", () => {
    const data = { name: "Test" };
    const result = formatOutput(data, "markdown", (d) => `Name: ${d.name}`);
    expect(result).toBe("Name: Test");
  });

  it("falls back to JSON if no markdown renderer", () => {
    const data = { name: "Test" };
    const result = formatOutput(data, "markdown");
    expect(result).toBe(JSON.stringify(data, null, 2));
  });
});

describe("truncateIfNeeded", () => {
  it("returns text unchanged when under limit", () => {
    expect(truncateIfNeeded("short", 100)).toBe("short");
  });

  it("truncates and appends message when over limit", () => {
    const input = "a".repeat(200);
    const result = truncateIfNeeded(input, 100);
    expect(result).toContain("truncated");
    expect(result).not.toBe(input);
    expect(result.indexOf("---")).toBeLessThan(100);
  });
});
