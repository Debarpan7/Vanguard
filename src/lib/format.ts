import type { MetricId } from "@/data/fact-base";

/** Formats a value for display per its metric's unit. Null is always the
 * explicit gap label — the site never shows an invented number. Shared by
 * the metric cards, the benchmarking comparison tables, and CSV export. */
export function formatValue(metric: MetricId, value: number | null): string {
  if (value === null) return "Not published";
  switch (metric) {
    case "aum":
      return `$${value.toFixed(1)}T`;
    case "clients":
      return `${value}M+`;
    case "cost-ratio":
      return `${value.toFixed(2)}%`;
    case "revenue":
      return `$${value.toFixed(1)}B`;
    case "roe":
      return `${value.toFixed(1)}%`;
  }
}

/** Formats an ISO period-end date for display (e.g., "Mar 31, 2022"). */
export function formatAsOf(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
