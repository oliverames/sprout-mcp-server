/**
 * Build a date range filter using Sprout's DSL.
 * endInclusive=false (default): uses "..." (end-exclusive) for created_time
 * endInclusive=true: uses ".." (end-inclusive) for reporting_period
 */
export function buildDateRangeFilter(
  field: string,
  start: string,
  end: string,
  endInclusive = false
): string {
  const separator = endInclusive ? ".." : "...";
  return `${field}.in(${start}${separator}${end})`;
}

/**
 * Build a set filter: field.op(val1, val2, ...)
 */
function buildSetFilter(
  field: string,
  op: "eq" | "neq",
  values: (string | number)[]
): string {
  return `${field}.${op}(${values.join(", ")})`;
}

export function buildEqFilter(field: string, values: (string | number)[]): string {
  return buildSetFilter(field, "eq", values);
}

export function buildNeqFilter(field: string, values: (string | number)[]): string {
  return buildSetFilter(field, "neq", values);
}

/**
 * Build a comparison filter: field.op(value)
 */
export function buildComparisonFilter(
  field: string,
  op: "gt" | "gte" | "lt" | "lte",
  value: string
): string {
  return `${field}.${op}(${value})`;
}

/**
 * Build a text match filter: field.match(text)
 * Supports OR operator in search text.
 */
export function buildTextMatchFilter(
  field: string,
  text: string
): string {
  return `${field}.match(${text})`;
}

/**
 * Build an exists filter: field.exists(true/false)
 */
export function buildExistsFilter(
  field: string,
  exists: boolean
): string {
  return `${field}.exists(${exists})`;
}
