import { test, expect } from "@playwright/test";
import {
  seriesFor,
  headlineMetrics,
  allFirms,
  trendYears,
  type MetricId,
  type MetricSeries,
} from "../src/data/fact-base";
import {
  analysisNarrative,
  analysisOpportunities,
} from "../src/data/analysis";
import { site, dataAsOfLabel } from "../src/lib/site";
import {
  liveSeries,
  seriesIssues,
  factBaseIssues,
  analysisIssues,
  dataAsOfIssues,
  refreshGate,
  runRefreshChecks,
} from "../src/lib/refresh";

// Seam 2 — the quarterly refresh pipeline gate (ticket 20;
// .scratch/vanguard-intelligence/issues/20-task-refresh-pipeline.md). The
// pipeline's automated contract: after a refresh (data collection → fact
// base → re-analysis), the gate must pass with zero issues — provenance
// intact (every (metric, firm) pair fully covered, every point sourced, gap
// semantics respected: nothing invented), the analysis well-formed and
// grounded in real headline metrics, and the data-as-of stamped with a
// valid date. Expected values are literals from the seeded data and the
// first-refresh stamp (2026-08-12), never recomputed from the code under
// test.

test("the full refresh gate passes on the seeded state — provenance intact", () => {
  expect(refreshGate()).toEqual([]);
});

test("runRefreshChecks reports ok with zero issues when the gate passes", () => {
  const result = runRefreshChecks();
  expect(result.ok).toBe(true);
  expect(result.issues).toEqual([]);
});

test("every (metric, firm) pair has a live series and the coverage is complete", () => {
  const live = liveSeries();
  // Literal: 6 firms × 5 headline metrics (decided sets in fact-base.ts).
  expect(live).toHaveLength(30);
  for (const firm of allFirms) {
    for (const metric of headlineMetrics) {
      expect(live.some((s) => s.metric === metric && s.firm === firm)).toBe(true);
    }
  }
});

test("factBaseIssues returns no issues on the seeded fact base", () => {
  expect(factBaseIssues()).toEqual([]);
});

test("seriesIssues flags a series that does not cover every trend year in order", () => {
  const aum = seriesFor("aum", "vanguard");
  const tampered: MetricSeries = {
    ...aum,
    points: aum.points.filter((p) => p.year !== 2023),
  };
  const issues = seriesIssues(tampered);
  expect(issues.some((i) => i.includes("trend years"))).toBe(true);
  expect(issues.some((i) => i.includes(trendYears.join(", ")))).toBe(true);
});

test("seriesIssues flags a point with a missing source (provenance gap)", () => {
  const clients = seriesFor("clients", "vanguard");
  const tampered: MetricSeries = {
    ...clients,
    points: clients.points.map((p) => (p.year === 2021 ? { ...p, source: "" } : p)),
  };
  const issues = seriesIssues(tampered);
  expect(issues.some((i) => i.includes("2021") && i.includes("source"))).toBe(true);
});

test("seriesIssues flags an invented value on a gap point — nothing invented", () => {
  // Vanguard AUM 2023 is a not-published gap (value null). Inventing a value
  // must be caught by the gate.
  const aum = seriesFor("aum", "vanguard");
  const tampered: MetricSeries = {
    ...aum,
    points: aum.points.map((p) => (p.year === 2023 ? { ...p, value: 9.0 } : p)),
  };
  const issues = seriesIssues(tampered);
  expect(issues.some((i) => i.includes("2023") && i.includes("gap"))).toBe(true);
});

test("seriesIssues flags a published point carrying no value", () => {
  const cost = seriesFor("cost-ratio", "vanguard");
  const tampered: MetricSeries = {
    ...cost,
    points: cost.points.map((p) => (p.year === 2025 ? { ...p, value: null } : p)),
  };
  const issues = seriesIssues(tampered);
  expect(issues.some((i) => i.includes("2025") && i.includes("published"))).toBe(true);
});

test("factBaseIssues flags a missing series in the coverage universe", () => {
  const partial = liveSeries().filter(
    (s) => !(s.metric === "roe" && s.firm === "blackrock"),
  );
  const issues = factBaseIssues(partial);
  expect(issues.some((i) => i.includes("Missing series: roe/blackrock"))).toBe(true);
});

test("analysisIssues returns no issues on the seeded analysis", () => {
  expect(analysisIssues()).toEqual([]);
});

test("analysisIssues flags evidence that references a non-headline metric", () => {
  const tampered = analysisOpportunities.map((o) =>
    o.id === "cost-advantage"
      ? { ...o, evidence: ["made-up-metric" as MetricId] }
      : o,
  );
  const issues = analysisIssues(analysisNarrative, tampered);
  expect(issues.some((i) => i.includes("made-up-metric"))).toBe(true);
});

test("analysisIssues flags duplicate opportunity ids", () => {
  const tampered = [...analysisOpportunities, { ...analysisOpportunities[0] }];
  const issues = analysisIssues(analysisNarrative, tampered);
  expect(issues.some((i) => i.includes("duplicate"))).toBe(true);
});

test("dataAsOfIssues returns no issues and the label shows the first-refresh date", () => {
  expect(dataAsOfIssues()).toEqual([]);
  expect(site.dataAsOf).toBe("2026-08-12");
  expect(dataAsOfLabel(site.dataAsOf)).toBe("As of August 12, 2026");
});

test("dataAsOfIssues flags a missing or unparseable stamp", () => {
  expect(dataAsOfIssues(null).length).toBeGreaterThan(0);
  expect(dataAsOfIssues("not-a-date").length).toBeGreaterThan(0);
});

test("dataAsOfLabel falls back to the pending label when unstamped", () => {
  expect(dataAsOfLabel(null)).toBe("Not yet refreshed");
});
