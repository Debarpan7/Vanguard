/**
 * The RoE tree — Return on Equity decomposed into its drivers per the agreed
 * decomposition (decision: ticket 05 — income-statement drilldown, not
 * DuPont):
 *
 *   RoE = Net income ÷ Average equity
 *   ├── Net income
 *   │   └── Operating income
 *   │       ├── Revenue
 *   │       └── Operating expenses
 *   └── Average equity
 *
 * Every node is a pure line node traceable to the published number it derives
 * from (a 10-K line for listed peers; an explicit "not published" gap for
 * Vanguard, which publishes no firm-level statements — asset 01). Vanguard's
 * published cost ratio attaches to the operating-expenses node as a clearly
 * labeled note (a ratio of AUM, not an income-statement line); AUM attaches
 * as context only, never as a node. Figures are never invented.
 */

import { trendYears, type VerificationTag } from "@/data/fact-base";

export type RoeNodeId =
  | "roe"
  | "net-income"
  | "operating-income"
  | "revenue"
  | "operating-expenses"
  | "average-equity";

/** A single year of a tree node — same provenance contract as the fact base. */
export interface RoeNodePoint {
  year: number;
  /** Numeric value, or null when the point is a gap (not published). */
  value: number | null;
  source: string;
  sourceUrl: string;
  verification: VerificationTag;
  /** Gap reason / provenance note for the point. */
  note?: string;
}

export interface RoeNode {
  id: RoeNodeId;
  name: string;
  definition: string;
  /** Display unit for the node's values ("%" for the root, USD billions for
   * the income-statement lines). */
  unit: string;
  /** Child node ids this node decomposes into, in display order. */
  children?: readonly RoeNodeId[];
  /** Published context attached to the node, clearly labeled (e.g., the
   * cost ratio on operating expenses; the proxy caveat on the root). */
  contextNote?: string;
  /** The node's 5-year series, in fiscal-year order. */
  points: readonly RoeNodePoint[];
}

/** The root of the tree — RoE. */
export const roeTreeRoot: RoeNodeId = "roe";

/** Every node id, in tree (pre-order) display order. */
export const roeTreeIds: readonly RoeNodeId[] = [
  "roe",
  "net-income",
  "operating-income",
  "revenue",
  "operating-expenses",
  "average-equity",
];

/** The source every Vanguard node traces to when the line is not published
 * (no firm-level statement exists — asset 01). Same source as the fact
 * base's not-published gaps. */
const GAP_SOURCE = "No publication found (research asset 01)";
const GAP_SOURCE_URL =
  "https://corporate.vanguard.com/content/corporatesite/us/en/corp/why-vanguard/who-we-are/facts-and-figures.html";

const gapPoint = (year: number, note: string): RoeNodePoint => ({
  year,
  value: null,
  source: GAP_SOURCE,
  sourceUrl: GAP_SOURCE_URL,
  verification: "not-published",
  note,
});

const vanguardGapSeries = (note: string): readonly RoeNodePoint[] =>
  trendYears.map((year) => gapPoint(year, note));

/** Every node's published-context note and gap reason. */
const NODE_NOTES: Record<
  RoeNodeId,
  { definition: string; unit: string; contextNote?: string; gapNote: string }
> = {
  roe: {
    definition:
      "Net income ÷ average equity, per audited statements. Vanguard: labeled proxy only (no net income or equity published).",
    unit: "%",
    contextNote:
      "Vanguard is client-owned (mutual); peers may be listed. RoE is a labeled proxy — no net income or equity published.",
    gapNote:
      "RoE not computable from published data — Vanguard publishes no net income or equity (asset 01).",
  },
  "net-income": {
    definition: "Net income (bottom line) as reported in audited statements.",
    unit: "USD billions",
    gapNote:
      "Vanguard publishes no firm-level income statement — net income is not published.",
  },
  "operating-income": {
    definition:
      "Operating income (income from operations) as reported in audited statements.",
    unit: "USD billions",
    gapNote:
      "Vanguard publishes no firm-level income statement — operating income is not published.",
  },
  revenue: {
    definition:
      "Total firm revenue as reported in audited statements (management/advisory fees + other).",
    unit: "USD billions",
    gapNote:
      "Vanguard publishes no firm-level income statement — revenue is not published.",
  },
  "operating-expenses": {
    definition: "Operating expenses as reported in audited statements.",
    unit: "USD billions",
    contextNote:
      "Vanguard publishes its cost ratio instead: asset-weighted average US fund expenses as a share of prior-year average net US assets — 0.09% (FY2021) → 0.08% (FY2022–23) → 0.07% (FY2024–25). A ratio of AUM, not an income-statement line.",
    gapNote:
      "Vanguard publishes no firm-level income statement — operating expenses (a dollar figure) are not published.",
  },
  "average-equity": {
    definition:
      "Average shareholders' equity, per audited statements (period-average).",
    unit: "USD billions",
    gapNote:
      "Vanguard publishes no firm-level balance sheet — equity is not published.",
  },
};

/** Display names for the tree nodes. */
const NODE_NAME: Record<RoeNodeId, string> = {
  roe: "Return on equity",
  "net-income": "Net income",
  "operating-income": "Operating income",
  revenue: "Revenue",
  "operating-expenses": "Operating expenses",
  "average-equity": "Average equity",
};

/** The driver relationships between nodes, in display order. */
const CHILDREN: Record<RoeNodeId, readonly RoeNodeId[] | undefined> = {
  roe: ["net-income", "average-equity"],
  "net-income": ["operating-income"],
  "operating-income": ["revenue", "operating-expenses"],
  revenue: undefined,
  "operating-expenses": undefined,
  "average-equity": undefined,
};

/** The tree nodes in display order (root first). */
export const roeTreeNodes: readonly RoeNode[] = roeTreeIds.map((id) => ({
  id,
  name: NODE_NAME[id],
  definition: NODE_NOTES[id].definition,
  unit: NODE_NOTES[id].unit,
  children: CHILDREN[id],
  contextNote: NODE_NOTES[id].contextNote,
  points: vanguardGapSeries(NODE_NOTES[id].gapNote),
}));

/** Returns the node for an id — throws for unknown ids. */
export function roeNodeFor(id: RoeNodeId): RoeNode {
  const node = roeTreeNodes.find((n) => n.id === id);
  if (!node) {
    throw new Error(`No RoE tree node "${id}"`);
  }
  return node;
}

/**
 * The year-over-year change of a node (current year − prior year), or null
 * when either value is a gap — the tree never fabricates a change. Null for
 * the first year of the window (no prior year) and unknown years.
 */
export function roeYearDelta(node: RoeNode, year: number): number | null {
  const current = node.points.find((p) => p.year === year);
  const prior = node.points.find((p) => p.year === year - 1);
  if (!current || !prior) return null;
  if (current.value === null || prior.value === null) return null;
  return current.value - prior.value;
}
