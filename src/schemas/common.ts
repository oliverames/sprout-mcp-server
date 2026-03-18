import { z } from "zod";

export const ResponseFormatSchema = z
  .enum(["markdown", "json"])
  .default("markdown")
  .describe('Output format: "markdown" (default) for human-readable, "json" for structured data');

export const CustomerIdSchema = z
  .number()
  .int()
  .positive()
  .optional()
  .describe("Override the default customer ID for this request");

export const PageSchema = z
  .number()
  .int()
  .min(1)
  .default(1)
  .describe("Page number (1-indexed)");

export const CursorSchema = z
  .string()
  .optional()
  .describe("Pagination cursor from a previous response");

export const TimezoneSchema = z
  .string()
  .optional()
  .describe('IANA timezone (e.g. "America/Chicago") for date interpretation');

export const DateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
  .describe("Date in YYYY-MM-DD format");

export const SortOrderSchema = z
  .enum(["asc", "desc"])
  .default("desc")
  .describe("Sort order: ascending or descending");
