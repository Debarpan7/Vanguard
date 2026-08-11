import { test, expect } from "@playwright/test";
import {
  roeTreeNodes,
  roeTreeRoot,
  roeTreeIds,
  roeNodeFor,
  roeYearDelta,
  type RoeNode,
} from "../src/data/roe-tree";
import { trendYears } from "../src/data/fact-base";

// Seam 2 — RoE tree provenance. The tree structure is the agreed
// decomposition (decision: ticket 05 — income-statement drilldown). Expected
// values are literal facts from the disclosure research
// (`.scratch/vanguard-intelligence/assets/01-vanguard-public-disclosures.md`),
// never recomputed from the code under test.

// The income-statement drilldown per ticket 05: RoE = net income ÷ average
// equity; left branch revenue → operating expenses → operating income → net
// income; right branch average equity. Asserted as the exact child order.
const DECOMPOSITION: Record<string, readonly string[] | undefined> = {
  roe: ["net-income", "average-equity"],
  "net-income": ["operating-income"],
  "operating-income": ["revenue", "operating-expenses"],
  revenue: undefined,
  "operating-expenses": undefined,
  "average-equity": undefined,
};

// The source every Vanguard node's points trace to (no firm-level statement
// published — asset 01; same source as the fact base's not-published gaps).
const GAP_SOURCE_URL =
  "https://corporate.vanguard.com/content/corporatesite/us/en/corp/why-vanguard/who-we-are/facts-and-figures.html";

function points(node: RoeNode) {
  return node.points;
}

test("tree shape matches the agreed income-statement decomposition (ticket 05)", () => {
  expect(roeTreeRoot).toBe("roe");
  // Root first; every node present exactly once.
  expect(roeTreeNodes[0].id).toBe(roeTreeRoot);
  expect(roeTreeNodes.map((n) => n.id)).toEqual([...roeTreeIds]);

  for (const node of roeTreeNodes) {
    expect(node.children ?? []).toEqual(DECOMPOSITION[node.id] ?? []);
    // Children reference valid node ids.
    for (const child of node.children ?? []) {
      expect(roeTreeIds).toContain(child);
      // The child exists and resolves to a node with that id.
      expect(roeNodeFor(child).id).toBe(child);
    }
  }
});

test("every node carries a definition, unit, and a full 5-year series with provenance", () => {
  for (const node of roeTreeNodes) {
    expect(node.name.length).toBeGreaterThan(0);
    expect(node.definition.length).toBeGreaterThan(0);
    expect(node.unit.length).toBeGreaterThan(0);

    // Full 5-year coverage in fiscal-year order (the site's 5-year window).
    expect(node.points.map((p) => p.year)).toEqual([...trendYears]);
    for (const point of points(node)) {
      expect(point.source.length).toBeGreaterThan(0);
      expect(point.sourceUrl).toBe(GAP_SOURCE_URL);
    }
  }
});

test("Vanguard's financial nodes are explicit not-published gaps, never invented", () => {
  for (const node of roeTreeNodes) {
    for (const point of points(node)) {
      expect(point.value).toBeNull();
      expect(point.verification).toBe("not-published");
      // Gap reason documented on every point.
      expect(point.note?.length).toBeGreaterThan(0);
    }
  }
});

test("operating-expenses carries the published cost-ratio note as labeled context (ticket 05)", () => {
  const expenses = roeNodeFor("operating-expenses");
  // The note is present and clearly a ratio of AUM, not a statement line.
  expect(expenses.contextNote).toBeDefined();
  // Literal facts from asset 01: 0.09% (2020-21) → 0.08% (2022-23) → 0.07%
  // (2024-25), asset-weighted average US fund expenses.
  expect(expenses.contextNote).toContain("0.09%");
  expect(expenses.contextNote).toContain("0.07%");
  expect(expenses.contextNote).toMatch(/not an income-statement line/);
});

test("the root node carries the labeled-proxy and mutual caveat (spec story 12)", () => {
  const root = roeNodeFor(roeTreeRoot);
  expect(root.contextNote).toBeDefined();
  expect(root.contextNote).toMatch(/labeled proxy/);
  expect(root.contextNote).toMatch(/client-owned \(mutual\)/);
});

test("roeYearDelta computes the signed change between consecutive non-null points, null on gaps", () => {
  const node: RoeNode = {
    id: "revenue",
    name: "Revenue",
    definition: "d",
    unit: "USD billions",
    points: [
      {
        year: 2021,
        value: 10,
        source: "s",
        sourceUrl: GAP_SOURCE_URL,
        verification: "not-published",
      },
      {
        year: 2022,
        value: null,
        source: "s",
        sourceUrl: GAP_SOURCE_URL,
        verification: "not-published",
      },
      {
        year: 2023,
        value: 10,
        source: "s",
        sourceUrl: GAP_SOURCE_URL,
        verification: "not-published",
      },
      {
        year: 2024,
        value: 12,
        source: "s",
        sourceUrl: GAP_SOURCE_URL,
        verification: "not-published",
      },
      {
        year: 2025,
        value: null,
        source: "s",
        sourceUrl: GAP_SOURCE_URL,
        verification: "not-published",
      },
    ],
  };

  // No prior year for the first point of the window.
  expect(roeYearDelta(node, 2021)).toBeNull();
  // Current or prior value is a gap → no delta (never fabricate a change).
  expect(roeYearDelta(node, 2022)).toBeNull();
  expect(roeYearDelta(node, 2023)).toBeNull();
  // Signed change between consecutive published points.
  expect(roeYearDelta(node, 2024)).toBe(2);
  // Gap at current year → no delta.
  expect(roeYearDelta(node, 2025)).toBeNull();
  // Unknown year → no delta.
  expect(roeYearDelta(node, 2030)).toBeNull();
});
