import { describe, it, expect } from "vitest";
import {
  buildDateRangeFilter,
  buildEqFilter,
  buildNeqFilter,
  buildComparisonFilter,
  buildTextMatchFilter,
  buildExistsFilter,
} from "../../src/services/filter-builder.js";

describe("buildDateRangeFilter", () => {
  it("builds end-exclusive range by default (three dots)", () => {
    expect(buildDateRangeFilter("created_time", "2024-01-01", "2024-02-01"))
      .toBe("created_time.in(2024-01-01...2024-02-01)");
  });

  it("builds end-inclusive range when specified (two dots)", () => {
    expect(buildDateRangeFilter("reporting_period", "2024-01-01", "2024-01-31", true))
      .toBe("reporting_period.in(2024-01-01..2024-01-31)");
  });
});

describe("buildEqFilter", () => {
  it("builds single value", () => {
    expect(buildEqFilter("customer_profile_id", [123]))
      .toBe("customer_profile_id.eq(123)");
  });

  it("builds multiple values", () => {
    expect(buildEqFilter("customer_profile_id", [123, 456, 789]))
      .toBe("customer_profile_id.eq(123, 456, 789)");
  });

  it("handles string values", () => {
    expect(buildEqFilter("post_type", ["COMMENT", "DM"]))
      .toBe("post_type.eq(COMMENT, DM)");
  });
});

describe("buildNeqFilter", () => {
  it("builds single value", () => {
    expect(buildNeqFilter("tag_id", [123]))
      .toBe("tag_id.neq(123)");
  });

  it("builds multiple values", () => {
    expect(buildNeqFilter("tag_id", [123, 456]))
      .toBe("tag_id.neq(123, 456)");
  });
});

describe("buildComparisonFilter", () => {
  it("builds gt filter", () => {
    expect(buildComparisonFilter("guid", "gt", "abc123"))
      .toBe("guid.gt(abc123)");
  });

  it("builds lte filter", () => {
    expect(buildComparisonFilter("created_time", "lte", "2024-01-01"))
      .toBe("created_time.lte(2024-01-01)");
  });
});

describe("buildTextMatchFilter", () => {
  it("builds match filter with simple text", () => {
    expect(buildTextMatchFilter("text", "sprout"))
      .toBe("text.match(sprout)");
  });

  it("preserves OR operator", () => {
    expect(buildTextMatchFilter("text", "sprout OR social"))
      .toBe("text.match(sprout OR social)");
  });
});

describe("buildExistsFilter", () => {
  it("builds exists true", () => {
    expect(buildExistsFilter("tag_id", true))
      .toBe("tag_id.exists(true)");
  });

  it("builds exists false", () => {
    expect(buildExistsFilter("tag_id", false))
      .toBe("tag_id.exists(false)");
  });
});
