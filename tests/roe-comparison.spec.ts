import { test, expect } from "@playwright/test";
import {
  lobComparisonIds,
  lobComparisons,
  lobComparisonFor,
  lobComparisonDerivationDisclosure,
  type LobId,
} from "../src/data/roe-comparison";
import {
  isAuditedMetric,
  peerFirms,
  seriesFor,
  trendYears,
} from "../src/data/fact-base";

// Seam 2 — RoE comparison provenance. The comparison basis is the decided
// design (ticket 06 — grilling RoE comparison across peer set, industries,
// and lines of business; ticket 07 — canonical LoB taxonomy): the canonical
// 4-line LoB model with peer-set industry representatives and Vanguard LoB
// RoE as explicit not-published gaps. Expected values are literal facts from
// the decision record
// (`.scratch/vanguard-intelligence/issues/06-grilling-roe-comparison.md`),
// never recomputed from the code under test.

// The decided LoB → industry → representative mapping (ticket 06, answer 4).
const DECIDED_MAPPING: Record<
  LobId,
  {
    industry: string;
    reps: readonly { firm: string; voluntary?: boolean }[];
    deferred?: string;
  }
> = {
  "investment-management": {
    industry: "Asset management",
    reps: [{ firm: "blackrock" }, { firm: "invesco" }, { firm: "amundi" }],
  },
  retirement: {
    industry: "Retirement recordkeeping",
    reps: [{ firm: "state-street" }, { firm: "fidelity", voluntary: true }],
  },
  brokerage: {
    industry: "Brokerage & trading",
    reps: [{ firm: "fidelity", voluntary: true }],
    deferred: "Schwab",
  },
  advice: {
    industry: "Wealth/advice management",
    reps: [{ firm: "fidelity", voluntary: true }],
    deferred: "Schwab",
  },
};

test("the LoB model is the canonical 4-line model in the decided order (tickets 06, 07)", () => {
  expect(lobComparisonIds).toEqual([
    "investment-management",
    "retirement",
    "brokerage",
    "advice",
  ]);
  // The comparison list carries every line exactly once, in the same order.
  expect(lobComparisons.map((l) => l.id)).toEqual([...lobComparisonIds]);
  for (const lob of lobComparisons) {
    expect(lob.name.length).toBeGreaterThan(0);
    expect(lob.definition.length).toBeGreaterThan(0);
    expect(lob.industry.name.length).toBeGreaterThan(0);
    expect(lob.representatives.length).toBeGreaterThan(0);
  }
});

test("each line maps to the decided industry and peer-set representatives (ticket 06)", () => {
  for (const id of lobComparisonIds) {
    const decided = DECIDED_MAPPING[id];
    const lob = lobComparisonFor(id);

    expect(lob.id).toBe(id);
    expect(lob.industry.name).toBe(decided.industry);
    expect(lob.representatives.map((r) => r.firm)).toEqual(
      decided.reps.map((r) => r.firm),
    );
    for (const rep of lob.representatives) {
      const decidedRep = decided.reps.find((r) => r.firm === rep.firm);
      // Voluntary flag matches the decision (Fidelity only).
      expect(rep.voluntary).toBe(decidedRep?.voluntary ?? undefined);
    }
    // Deferred non-core benchmarks (e.g., Schwab) disclosed per line.
    if (decided.deferred) {
      expect(lob.representatives.some((r) => r.deferredNote)).toBe(true);
    } else {
      expect(lob.representatives.every((r) => !r.deferredNote)).toBe(true);
    }
  }
});

test("representatives are peer-set firms only — never Vanguard, never outside the set", () => {
  for (const lob of lobComparisons) {
    for (const rep of lob.representatives) {
      expect(rep.firm).not.toBe("vanguard");
      expect(peerFirms).toContain(rep.firm);
    }
  }
});

test("roe is an audited metric — Fidelity is excluded from the peer-set table", () => {
  expect(isAuditedMetric("roe")).toBe(true);
});

test("peer-set RoE availability: Vanguard not-published, peers pending-collection until ticket 17", () => {
  const vanguard = seriesFor("roe", "vanguard");
  expect(vanguard.points).toHaveLength(trendYears.length);
  for (const point of vanguard.points) {
    expect(point.value).toBeNull();
    expect(point.verification).toBe("not-published");
  }

  for (const lob of lobComparisons) {
    for (const rep of lob.representatives) {
      const series = seriesFor("roe", rep.firm);
      expect(series.points).toHaveLength(trendYears.length);
      for (const point of series.points) {
        expect(point.value).toBeNull();
        expect(point.verification).toBe("pending-collection");
      }
    }
  }
});

test("the derivation disclosure states the limitations: not-published gaps, canonical model, Schwab deferred to ticket 17", () => {
  const disclosure = lobComparisonDerivationDisclosure;
  expect(disclosure).toMatch(/not-?published/);
  expect(disclosure).toMatch(/never an invented figure|not computable/i);
  expect(disclosure).toMatch(/canonical/);
  expect(disclosure).toMatch(/ticket 07/);
  expect(disclosure).toMatch(/ticket 17/);
  expect(disclosure).toMatch(/Schwab/);
});
