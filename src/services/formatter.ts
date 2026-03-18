import { CHARACTER_LIMIT } from "../constants.js";
import type { ResponseFormat } from "../types.js";

export function formatAsTable(
  data: object[],
  columns: string[]
): string {
  if (data.length === 0) return "No data found.";

  const header = `| ${columns.join(" | ")} |`;
  const separator = `| ${columns.map(() => "---").join(" | ")} |`;
  const rows = data.map(
    (row) => {
      const record = row as Record<string, unknown>;
      return `| ${columns.map((col) => String(record[col] ?? "")).join(" | ")} |`;
    }
  );

  return [header, separator, ...rows].join("\n");
}

export function formatAsList(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

export function formatOutput<T>(
  data: T,
  format: ResponseFormat,
  markdownRenderer?: (data: T) => string
): string {
  if (format === "json") {
    return JSON.stringify(data, null, 2);
  }

  if (markdownRenderer) {
    return markdownRenderer(data);
  }

  return JSON.stringify(data, null, 2);
}

export function truncateIfNeeded(
  text: string,
  limit: number = CHARACTER_LIMIT
): string {
  if (text.length <= limit) return text;

  const truncationMsg =
    "\n\n---\n*Response truncated. Use pagination parameters (page/cursor) or narrower date ranges to retrieve remaining data.*";
  const sliceEnd = Math.max(0, limit - truncationMsg.length);
  return text.slice(0, sliceEnd) + truncationMsg;
}
