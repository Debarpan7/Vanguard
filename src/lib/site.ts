/**
 * Single source of truth for the site shell: name, navigation, and the
 * data-as-of (last refresh) marker. Pages and components read from here so
 * the marker mechanism stays consistent across the site.
 */

export const site = {
  name: "Vanguard Intelligence",
  tagline:
    "How Vanguard is faring and where it can improve — internal reference, LLM-produced analysis over public sources.",
  /** ISO date of the last fact base refresh. Null until the first refresh runs. */
  dataAsOf: null as string | null,
} as const;

export interface NavLink {
  name: string;
  path: string;
}

/** Every section of the site, in navigation order. */
export const navLinks: readonly NavLink[] = [
  { name: "Metrics", path: "/metrics" },
  { name: "Products & services", path: "/products" },
  { name: "Benchmarking", path: "/benchmarking" },
  { name: "RoE tree", path: "/roe-tree" },
  { name: "RoE comparisons", path: "/roe-comparison" },
  { name: "Chatbot", path: "/chatbot" },
  { name: "About", path: "/about" },
];

/**
 * Human-readable form of the data-as-of marker. Returns the pending label
 * when no refresh has happened yet, so the site never shows a fake date.
 * Unparseable dates fall back to the pending label rather than "Invalid Date".
 */
export function dataAsOfLabel(asOf: string | null): string {
  if (!asOf) return "Not yet refreshed";
  const parsed = new Date(`${asOf}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return "Not yet refreshed";
  return `As of ${parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })}`;
}
