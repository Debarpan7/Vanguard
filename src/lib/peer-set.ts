import type { Ownership } from "@/data/fact-base";

/**
 * Peer set comparison content (decisions: ticket 04 — grilling peer set
 * selection). Rendered by the benchmarking view so the membership rules,
 * basis of comparison, availability notes, and ownership caveat travel with
 * every comparison. Content is decided, not derived — keep in sync with the
 * ticket resolution (`.scratch/vanguard-intelligence/issues/04-grilling-peer-set.md`).
 */

/** The three membership rules that define the core peer set (all hard). */
export const peerSetMembershipRules: readonly string[] = [
  "Audited financials for the 5-year window (10-K or equivalent) — with one documented exception: high-comparability private firms (e.g., Fidelity) admitted as voluntary-data core members, every metric labeled voluntary with source and date.",
  "AUM scale floor — at least $500B in assets under management (a guardrail that blocks future small entrants; all current members clear it).",
  "Business-mix overlap — index/ETF + retirement + advice mix comparable to Vanguard's (excludes e.g. T. Rowe Price, Janus Henderson, Northern Trust, Franklin).",
];

/** How the comparison is drawn up — same definitions, same fiscal-year labels. */
export const peerSetBasisOfComparison: string =
  "Comparisons use the same metric definitions and the same fiscal-year labels (FY2021–FY2025) across the core set. " +
  "The US-listed members report on a Dec-31 fiscal year (BlackRock, State Street, Invesco); Amundi reports IFRS in EUR " +
  "(converted at period FX, with the FX date noted); Fidelity publishes voluntary statistics only and is excluded from " +
  "audited-metric comparisons (e.g., RoE), shown as voluntary side data instead.";

/** Per-metric availability notes, so a reader never infers a false comparability. */
export const peerSetAvailabilityNote: string =
  "Per-metric availability: Fidelity is dropped from audited-metric comparisons (e.g., RoE) and shown as voluntary side data; " +
  "State Street is always isolated to its SSGA asset-management segment.";

/** The ownership caveat — displayed wherever Vanguard is compared (spec story 12). */
export const ownershipCaveat: string =
  "Vanguard is client-owned (mutual) — no shareholders, no listed equity; the peer set is listed (BlackRock, State Street, " +
  "Invesco, Amundi) or private (Fidelity). Ownership shapes capital structure, cost of capital, and profitability — compare with care.";

/** Human label for an ownership class (used in tables and panels). */
export const ownershipLabel: Record<Ownership, string> = {
  mutual: "Client-owned (mutual)",
  listed: "Listed",
  private: "Private",
};
