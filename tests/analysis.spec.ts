import { test, expect } from "@playwright/test";
import {
  analysisNarrative,
  analysisOpportunities,
  improvementLens,
  opportunityFor,
} from "../src/data/analysis";
import { headlineMetrics } from "../src/data/fact-base";

// Seam 2 — analysis provenance. The analysis is the decided pipeline output
// (ticket 17 — LLM analysis pipeline): a seeded narrative grounded in the fact
// base ("how is Vanguard faring"), named improvement opportunities each
// connected to their evidence metrics, and the improvement lens stated.
// Expected values are literal facts from the decision record
// (`.scratch/vanguard-intelligence/issues/17-task-analysis-pipeline.md`),
// never recomputed from the code under test.

// The decided opportunity set (ticket 17, answer 3): four named opportunities,
// each connected to its evidence metrics.
const DECIDED_OPPORTUNITIES: readonly {
  id: string;
  name: string;
  evidence: readonly string[];
}[] = [
  {
    id: "cost-advantage",
    name: "Extend the cost advantage",
    evidence: ["cost-ratio"],
  },
  {
    id: "profitability-visibility",
    name: "Close the profitability visibility gap",
    evidence: ["revenue", "roe"],
  },
  {
    id: "aum-disclosure",
    name: "Restore AUM disclosure",
    evidence: ["aum"],
  },
  {
    id: "client-measurement",
    name: "Measure clients consistently",
    evidence: ["clients"],
  },
];

test("the improvement lens is stated as broad business performance, technology one lever among many", () => {
  expect(improvementLens).toMatch(/broad business performance/i);
  expect(improvementLens).toMatch(/technology/);
  expect(improvementLens).toMatch(/one possible lever among many|one lever among many/i);
});

test("the narrative answers how Vanguard is faring with a title and a grounded intro", () => {
  expect(analysisNarrative.title).toMatch(/faring/i);
  expect(analysisNarrative.intro.length).toBeGreaterThan(0);
  // The intro is grounded in the fact base — never an invented figure.
  expect(analysisNarrative.intro).toMatch(/client-owned \(mutual\)|investor-owned/i);
});

test("the narrative carries the ownership caveat (mutual vs listed)", () => {
  expect(analysisNarrative.caveat).toMatch(/client-owned|mutual/i);
});

test("the narrative covers the four grounded reads with evidence behind each", () => {
  const reads = analysisNarrative.reads;
  expect(reads.length).toBeGreaterThanOrEqual(4);
  for (const read of reads) {
    expect(read.heading.length).toBeGreaterThan(0);
    expect(read.body.length).toBeGreaterThan(0);
    // Every read is grounded in a published fact or an explicit gap.
    expect(read.body).toMatch(
      /0\.09|0\.07|50M\+|30M\+|8\.1|H1 2022|not published|not computable|methodology/i,
    );
  }
  // The four reads are the decided ones.
  const headings = reads.map((r) => r.heading.toLowerCase());
  expect(headings.some((h) => h.includes("cost"))).toBe(true);
  expect(
    headings.some((h) => h.includes("profit") || h.includes("visibility")),
  ).toBe(true);
  expect(headings.some((h) => h.includes("aum") || h.includes("scale"))).toBe(
    true,
  );
  expect(
    headings.some((h) => h.includes("client") || h.includes("measure")),
  ).toBe(true);
});

test("the four named opportunities are present in the decided order, each with a claim and a read", () => {
  expect(analysisOpportunities).toHaveLength(DECIDED_OPPORTUNITIES.length);
  expect(analysisOpportunities.map((o) => o.id)).toEqual(
    DECIDED_OPPORTUNITIES.map((o) => o.id),
  );
  for (const opportunity of analysisOpportunities) {
    expect(opportunity.name.length).toBeGreaterThan(0);
    expect(opportunity.claim.length).toBeGreaterThan(0);
    expect(opportunity.read.length).toBeGreaterThan(0);
    expect(opportunity.evidence.length).toBeGreaterThan(0);
  }
});

test("each opportunity's evidence metrics are real headline metrics (ticket 03 set)", () => {
  for (const opportunity of analysisOpportunities) {
    for (const metric of opportunity.evidence) {
      expect(headlineMetrics).toContain(metric);
    }
  }
});

test("each opportunity is connected to the decided evidence metrics", () => {
  for (const decided of DECIDED_OPPORTUNITIES) {
    const opportunity = opportunityFor(decided.id);
    expect(opportunity.evidence).toEqual(decided.evidence);
  }
});

test("opportunityFor resolves known ids and throws on unknown ids", () => {
  expect(opportunityFor("cost-advantage").id).toBe("cost-advantage");
  expect(() => opportunityFor("not-an-opportunity")).toThrow();
});
