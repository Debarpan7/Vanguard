import type { MetricId } from "@/data/fact-base";

/**
 * Seeded analysis output (ticket 17 — LLM analysis pipeline: narrative and
 * improvement opportunities). The pipeline's job is to produce, from the fact
 * base, (a) a narrative answering "how is Vanguard faring", (b) named
 * improvement opportunities each connected to its evidence metrics, and
 * (c) a stated improvement lens. This module is the pipeline's stored output
 * for the site to present; in production the pipeline would run over the fact
 * base, but the seeded output is the decided, grounded content (decisions:
 * `.scratch/vanguard-intelligence/issues/17-task-analysis-pipeline.md`).
 *
 * Grounding rules (ticket 03 exclusions): every claim traces to a fact-base
 * metric or an explicit gap — Vanguard gaps render as "not published", peer
 * data stays "pending collection" (ticket 17 answer 1). Nothing is invented.
 */

/** One grounded narrative read, e.g. "cost leadership". */
export interface AnalysisRead {
  heading: string;
  /** Grounded prose — traces to fact-base literals or explicit gaps. */
  body: string;
}

/** The narrative produced from the fact base. */
export interface AnalysisNarrative {
  title: string;
  /** Grounded overview of how Vanguard is faring. */
  intro: string;
  reads: readonly AnalysisRead[];
  /** Ownership/methodology caveat every reader should hold. */
  caveat: string;
}

/** A named improvement opportunity connected to its evidence metrics. */
export interface AnalysisOpportunity {
  id: string;
  name: string;
  /** What the evidence indicates — a claim grounded in the evidence metrics. */
  claim: string;
  /** The evidence metrics behind the claim, from the headline metric set. */
  evidence: readonly MetricId[];
  /** The improvement read — what the analysis suggests following from the
   * evidence. */
  read: string;
}

/**
 * The stated improvement lens (spec story 32): broad business performance,
 * technology one possible lever among many — not the primary frame.
 */
export const improvementLens =
  "Broad business performance: technology is one possible lever among many, not the primary frame for improving Vanguard.";

export const analysisNarrative: AnalysisNarrative = {
  title: "How Vanguard is faring",
  intro:
    "Vanguard is client-owned (mutual) and publishes headline statistics — AUM, client counts, the cost ratio — and fund-level statements, but no firm-level financials. The fact base shows a firm whose published measures tell a consistent story: cost leadership held and extended (0.09% → 0.07% asset-weighted expense ratio over five years), client count growth that is a 2023 counting change, not organic growth (30M+ → 50M+ with a methodology break), and an assets-under-management story that goes quiet after H1 2022 ($8.1T as of Mar 31, 2022 was the last firm AUM published). Profitability is the gap: revenue and RoE are not published, so the firm's financial performance is not visible from public disclosures.",
  reads: [
    {
      heading: "Cost leadership is real and improving",
      body: "The asset-weighted average US fund expense ratio fell from 0.09% (FY2021) to 0.07% (FY2024–25) — a durable, published measure of the cost advantage.",
    },
    {
      heading: "Profitability visibility is the open gap",
      body: "Revenue and RoE are not published (no firm-level financial statements), so profitability is not computable from public data — the single biggest blind spot in the fact base.",
    },
    {
      heading: "AUM disclosure stopped at H1 2022",
      body: "Firm AUM was $8.1T as of Mar 31, 2022 — the last published point; the series after that is an explicit not-published gap.",
    },
    {
      heading: "Client measurement has a methodology break",
      body: "The 30M+ → 50M+ jump carries a 2023 methodology break (a counting change, not organic growth), so client-count trends before and after 2023 are not directly comparable.",
    },
  ],
  caveat:
    "Vanguard is client-owned (mutual), so it has no obligation to publish income statements; the profitability gap is structural, not a disclosure slip. Peer data stays pending collection (ticket 17, answer 1) — no peer-relative claim is made in this narrative.",
};

export const analysisOpportunities: readonly AnalysisOpportunity[] = [
  {
    id: "cost-advantage",
    name: "Extend the cost advantage",
    claim:
      "The cost ratio fell from 0.09% (FY2021) to 0.07% (FY2024–25); cost leadership is the firm's most visible, verified strength.",
    evidence: ["cost-ratio"],
    read: "Keep driving the expense ratio down — it is the one headline metric where Vanguard both publishes and improves.",
  },
  {
    id: "profitability-visibility",
    name: "Close the profitability visibility gap",
    claim:
      "Revenue and RoE are not published, so profitability is not computable from public data — the fact base cannot show how the firm is faring financially.",
    evidence: ["revenue", "roe"],
    read: "Publish firm-level financials (revenue, and enough equity data for an RoE read) — or read Form ADV — so profitability becomes visible and value-creation reads are unlocked.",
  },
  {
    id: "aum-disclosure",
    name: "Restore AUM disclosure",
    claim:
      "Firm AUM stops at $8.1T (Mar 31, 2022); the metric series is a not-published gap from FY2023 onward.",
    evidence: ["aum"],
    read: "Resume publishing firm AUM so the fee-based scale story can be tracked without relying on regulatory filings.",
  },
  {
    id: "client-measurement",
    name: "Measure clients consistently",
    claim:
      "The 30M+ → 50M+ jump carries a 2023 methodology break, so client trends across the break are not comparable.",
    evidence: ["clients"],
    read: "Restate or annotate the client count so the series is comparable over time — separate counting changes from organic growth.",
  },
];

/** Resolves an improvement opportunity by id. */
export function opportunityFor(id: string): AnalysisOpportunity {
  const opportunity = analysisOpportunities.find((o) => o.id === id);
  if (!opportunity) {
    throw new Error(`No analysis opportunity with id "${id}"`);
  }
  return opportunity;
}
