import type { FirmId } from "@/data/fact-base";

/**
 * RoE comparison basis (decision: ticket 06 — grilling RoE comparison across
 * peer set, industries, and lines of business). Vanguard publishes no segment
 * (line-of-business) financials, so line-of-business RoE is not computable
 * from published data: every Vanguard LoB cell renders an explicit
 * not-published gap, never an invented figure (ticket 03 exclusion 3). The
 * 4-line model is provisional pending the products & services taxonomy
 * (ticket 07); industry representatives come from the peer set (ticket 04)
 * only, and non-core industry benchmarks (e.g., Schwab) are deferred to
 * ticket 17 with a disclosed note.
 */

/** The provisional line-of-business model (ticket 06) — four lines, in the
 * decided display order. Marked provisional: the taxonomy decision (ticket 07)
 * may revise the model later. */
export type LobId =
  | "investment-management"
  | "retirement"
  | "brokerage"
  | "advice";

export const lobComparisonIds: readonly LobId[] = [
  "investment-management",
  "retirement",
  "brokerage",
  "advice",
];

/** An industry a line competes in, with its human label. */
export interface LobIndustry {
  name: string;
}

/** A peer-set firm standing in for an industry (ticket 06 answer 2 — no new
 * firm ids). Fidelity is voluntary data; non-core benchmarks are deferred. */
export interface LobRepresentative {
  firm: Exclude<FirmId, "vanguard">;
  /** Fidelity reports voluntary statistics only — labeled as such. */
  voluntary?: boolean;
  /** Non-core industry benchmark deferred to the peer-set expansion
   * (ticket 17), e.g. "Schwab". */
  deferredNote?: string;
}

/** One line of business and the industry comparison drawn against it. */
export interface LobComparison {
  id: LobId;
  name: string;
  definition: string;
  industry: LobIndustry;
  representatives: readonly LobRepresentative[];
}

const LOB_NAME: Record<LobId, string> = {
  "investment-management": "Investment management",
  retirement: "Retirement",
  brokerage: "Brokerage",
  advice: "Advice",
};

const LOB_DEFINITION: Record<LobId, string> = {
  "investment-management":
    "Managing the funds and ETFs Vanguard offers to investors (mutual funds, ETFs, index products).",
  retirement:
    "Retirement plans and recordkeeping — workplace plans and individual retirement accounts.",
  brokerage: "Brokerage and trading services for investors.",
  advice: "Advisory and guidance services (personal and digital advice).",
};

const LOB_INDUSTRY: Record<LobId, LobIndustry> = {
  "investment-management": {
    name: "Asset management",
  },
  retirement: {
    name: "Retirement recordkeeping",
  },
  brokerage: {
    name: "Brokerage & trading",
  },
  advice: {
    name: "Wealth/advice management",
  },
};

const LOB_REPRESENTATIVES: Record<LobId, readonly LobRepresentative[]> = {
  "investment-management": [
    { firm: "blackrock" },
    { firm: "invesco" },
    { firm: "amundi" },
  ],
  retirement: [{ firm: "state-street" }, { firm: "fidelity", voluntary: true }],
  brokerage: [
    {
      firm: "fidelity",
      voluntary: true,
      deferredNote: "Schwab (brokerage & trading) — deferred to ticket 17",
    },
  ],
  advice: [
    {
      firm: "fidelity",
      voluntary: true,
      deferredNote: "Schwab (wealth/advice) — deferred to ticket 17",
    },
  ],
};

/** The four comparison rows, in the decided display order. */
export const lobComparisons: readonly LobComparison[] = lobComparisonIds.map(
  (id) => ({
    id,
    name: LOB_NAME[id],
    definition: LOB_DEFINITION[id],
    industry: LOB_INDUSTRY[id],
    representatives: LOB_REPRESENTATIVES[id],
  }),
);

/** Resolves a line-of-business comparison by id. */
export function lobComparisonFor(id: LobId): LobComparison {
  const lob = lobComparisons.find((l) => l.id === id);
  if (!lob) {
    throw new Error(`No line-of-business comparison for "${id}"`);
  }
  return lob;
}

/** The stated limitation shown with the LoB comparison (ticket 06, answers 1
 * and 2): Vanguard publishes no segment financials, the 4-line model is
 * provisional, and industry representatives are peer-set only. */
export const lobComparisonDerivationDisclosure: string =
  "Vanguard does not publish segment (line-of-business) financials, so line-of-business RoE is " +
  "not computable from published data — every Vanguard LoB cell renders an explicit not-published gap, " +
  "never an invented figure (ticket 03 exclusion 3). The four lines (investment management, retirement, " +
  "brokerage, advice) are provisional pending the products & services taxonomy (ticket 07). Each line is " +
  "benchmarked against the industry it competes in, represented by peer-set firms only; non-core industry " +
  "benchmarks (e.g., Schwab) are deferred to the peer-set expansion (ticket 17).";
