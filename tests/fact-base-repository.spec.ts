import { DatabaseSync } from "node:sqlite";
import { test, expect } from "@playwright/test";
import {
  allFirms,
  firmMeta,
  headlineMetrics,
  metricMeta,
  seriesFor,
  trendYears,
  type FirmId,
  type MetricId,
} from "../src/data/fact-base";
import {
  backfillStaticFactBase,
  createFactBaseSchema,
  publishCandidate,
  readPublishedSeries,
} from "../src/lib/fact-base-repository";

test.describe("database-backed fact base", () => {
  test("contains audited BlackRock and Invesco revenue and RoE observations", () => {
    const blackrockRevenue = seriesFor("revenue", "blackrock");
    const blackrockRoe = seriesFor("roe", "blackrock");
    const invescoRevenue = seriesFor("revenue", "invesco");
    const invescoRoe = seriesFor("roe", "invesco");

    expect(blackrockRevenue.points.map((point) => point.value)).toEqual([
      19.374,
      17.873,
      17.859,
      20.407,
      24.216,
    ]);
    expect(blackrockRoe.points.map((point) => point.value)).toEqual([
      16.172,
      13.728,
      14.274,
      14.668,
      10.743,
    ]);
    expect(invescoRevenue.points.map((point) => point.value)).toEqual([
      6.8945,
      6.0489,
      5.7164,
      6.067,
      6.3771,
    ]);
    expect(invescoRoe.points.map((point) => point.value)).toEqual([
      9.331,
      4.454,
      -2.239,
      3.69,
      -1.305,
    ]);
    for (const series of [
      blackrockRevenue,
      blackrockRoe,
      invescoRevenue,
      invescoRoe,
    ]) {
      expect(series.points.every((point) => point.verification === "verified-from-url")).toBe(true);
      expect(series.points.every((point) => point.sourceUrl.includes("sec.gov/Archives/edgar/data/"))).toBe(true);
    }
  });

  test("publishes historical Vanguard regulatory AUM with filing-date provenance", () => {
    const aum = seriesFor("aum", "vanguard");

    expect(aum.points.map((point) => point.value)).toEqual([
      8,
      8.1,
      6.649219111273,
      7.909760294676,
      10.246596045633,
    ]);
    expect(aum.points.slice(2, 4).every((point) =>
      point.verification === "verified-from-url" &&
      point.comparabilityClassification === "display-only-regulatory-aum" &&
      point.issuerScope?.includes("CRD 105958") &&
      point.sourceUrl.includes("sec.gov/files/adv-filing-data-20111105-20241231-part1.zip") &&
      point.asOf,
    )).toBe(true);
    expect(aum.points.slice(2, 4).map((point) => point.asOf)).toEqual([
      "2023-08-15",
      "2024-12-18",
    ]);
  });

  test("round-trips the static baseline with provenance and audit records", () => {
    const database = new DatabaseSync(":memory:");
    createFactBaseSchema(database);
    const allSeries = allFirms.flatMap((firm) =>
      headlineMetrics.map((metric) => seriesFor(metric, firm)),
    );

    const runId = backfillStaticFactBase(database, {
      asOf: "2026-08-12",
      firms: firmMeta,
      metrics: metricMeta,
      periods: trendYears,
      series: allSeries,
    });
    publishCandidate(database, runId);

    expect(readPublishedSeries(database)).toEqual(allSeries);
    expect(
      database
        .prepare("SELECT COUNT(*) AS count FROM observations WHERE run_id = ?")
        .get(runId),
    ).toEqual({ count: 150 });
    expect(
      database
        .prepare("SELECT COUNT(*) AS count FROM citations")
        .get(),
    ).toEqual({ count: 150 });
    expect(
      database
        .prepare("SELECT COUNT(*) AS count FROM verification_events")
        .get(),
    ).toEqual({ count: 150 });
  });

  test("round-trips Amundi accounting and comparability metadata", () => {
    const database = new DatabaseSync(":memory:");
    createFactBaseSchema(database);
    const allSeries = allFirms.flatMap((firm) =>
      headlineMetrics.map((metric) => seriesFor(metric, firm)),
    );
    const amundiRevenue = seriesFor("revenue", "amundi");
    const series = allSeries.map((current) =>
      current === amundiRevenue
        ? {
            ...current,
            points: current.points.map((point) => ({
              ...point,
              value: point.value ?? 1,
              verification: "unverified" as const,
              sourceCurrency: "EUR",
              accountingBasis: "IFRS",
              issuerScope: "Amundi consolidated",
              comparabilityClassification: "display-only-eur-ifrs",
            })),
          }
        : current,
    );
    const runId = backfillStaticFactBase(database, {
      asOf: "2026-08-13",
      firms: firmMeta,
      metrics: metricMeta,
      periods: trendYears,
      series,
    });
    publishCandidate(database, runId);

    const published = readPublishedSeries(database).find(
      (current) => current.firm === "amundi" && current.metric === "revenue",
    );
    expect(published?.points[0]).toMatchObject({
      sourceCurrency: "EUR",
      accountingBasis: "IFRS",
      issuerScope: "Amundi consolidated",
      comparabilityClassification: "display-only-eur-ifrs",
    });
    expect(
      database
        .prepare(
          "SELECT state FROM comparability_states WHERE observation_id = (SELECT o.id FROM observations o WHERE o.run_id = ? AND o.firm_id = 'amundi' AND o.metric_id = 'revenue' LIMIT 1)",
        )
        .get(runId),
    ).toEqual({ state: "display-only" });
  });

  test("round-trips State Street segment scope and unit metadata", () => {
    const database = new DatabaseSync(":memory:");
    createFactBaseSchema(database);
    const allSeries = allFirms.flatMap((firm) =>
      headlineMetrics.map((metric) => seriesFor(metric, firm)),
    );
    const runId = backfillStaticFactBase(database, {
      asOf: "2026-08-13",
      firms: firmMeta,
      metrics: metricMeta,
      periods: trendYears,
      series: allSeries,
    });
    publishCandidate(database, runId);

    const published = readPublishedSeries(database).find(
      (current) => current.firm === "state-street" && current.metric === "revenue",
    );
    expect(published).toMatchObject({ unit: "USD billions" });
    expect(published?.points[0]).toMatchObject({
      issuerScope: "State Street Investment Management segment / SSGA-relevant scope",
      comparabilityClassification: "display-only-segment",
    });
  });

  test("rejects an invalid candidate without replacing the active publication", () => {
    const database = new DatabaseSync(":memory:");
    createFactBaseSchema(database);
    const allSeries = allFirms.flatMap((firm) =>
      headlineMetrics.map((metric) => seriesFor(metric, firm)),
    );
    const activeRunId = backfillStaticFactBase(database, {
      asOf: "2026-08-12",
      firms: firmMeta,
      metrics: metricMeta,
      periods: trendYears,
      series: allSeries,
    });
    publishCandidate(database, activeRunId);

    const candidateRunId = backfillStaticFactBase(database, {
      asOf: "2026-08-13",
      firms: firmMeta,
      metrics: metricMeta,
      periods: trendYears,
      series: allSeries.filter(
        (series) =>
          !(series.firm === ("vanguard" as FirmId) &&
            series.metric === ("roe" as MetricId)),
      ),
    });

    expect(() => publishCandidate(database, candidateRunId)).toThrow(
      "candidate validation failed",
    );
    expect(
      database
        .prepare("SELECT id FROM collection_runs WHERE status = 'published'")
        .get(),
    ).toEqual({ id: activeRunId });
    expect(readPublishedSeries(database)).toEqual(allSeries);
  });

  test("rejects a fully covered candidate with an invented gap state", () => {
    const database = new DatabaseSync(":memory:");
    createFactBaseSchema(database);
    const allSeries = allFirms.flatMap((firm) =>
      headlineMetrics.map((metric) => seriesFor(metric, firm)),
    );
    const activeRunId = backfillStaticFactBase(database, {
      asOf: "2026-08-12",
      firms: firmMeta,
      metrics: metricMeta,
      periods: trendYears,
      series: allSeries,
    });
    publishCandidate(database, activeRunId);
    const candidateRunId = backfillStaticFactBase(database, {
      asOf: "2026-08-13",
      firms: firmMeta,
      metrics: metricMeta,
      periods: trendYears,
      series: allSeries,
    });
    const observation = database
      .prepare("SELECT id FROM observations WHERE run_id = ? LIMIT 1")
      .get(candidateRunId);
    database
      .prepare("UPDATE observations SET value = NULL, verification = 'verified-from-url' WHERE id = ?")
      .run(observation?.id);

    expect(() => publishCandidate(database, candidateRunId)).toThrow(
      "published point has no value",
    );
    expect(
      database
        .prepare("SELECT status FROM collection_runs WHERE id = ?")
        .get(candidateRunId),
    ).toEqual({ status: "failed" });
    expect(
      database
        .prepare("SELECT id FROM collection_runs WHERE status = 'published'")
        .get(),
    ).toEqual({ id: activeRunId });
  });

  test("rejects an Amundi published point without EUR/IFRS comparability metadata", () => {
    const database = new DatabaseSync(":memory:");
    createFactBaseSchema(database);
    const allSeries = allFirms.flatMap((firm) =>
      headlineMetrics.map((metric) => seriesFor(metric, firm)),
    );
    const candidateRunId = backfillStaticFactBase(database, {
      asOf: "2026-08-13",
      firms: firmMeta,
      metrics: metricMeta,
      periods: trendYears,
      series: allSeries.map((series) =>
        series.firm === "amundi" && series.metric === "revenue"
          ? {
              ...series,
              points: series.points.map((point, index) =>
                index === 0
                  ? {
                      ...point,
                      value: 3.1,
                      verification: "verified-from-url" as const,
                      sourceCurrency: undefined,
                      accountingBasis: undefined,
                      issuerScope: undefined,
                      comparabilityClassification: undefined,
                    }
                  : point,
              ),
            }
          : series,
      ),
    });

    expect(() => publishCandidate(database, candidateRunId)).toThrow(
      "Amundi published point is missing EUR/IFRS scope or comparability metadata",
    );
  });

  test("rejects an Amundi point with a non-regulated EUR/IFRS classification", () => {
    const database = new DatabaseSync(":memory:");
    createFactBaseSchema(database);
    const allSeries = allFirms.flatMap((firm) =>
      headlineMetrics.map((metric) => seriesFor(metric, firm)),
    );
    const candidateRunId = backfillStaticFactBase(database, {
      asOf: "2026-08-13",
      firms: firmMeta,
      metrics: metricMeta,
      periods: trendYears,
      series: allSeries.map((series) =>
        series.firm === "amundi" && series.metric === "revenue"
          ? {
              ...series,
              points: series.points.map((point, index) =>
                index === 0
                  ? {
                      ...point,
                      value: 3.1,
                      verification: "verified-from-url" as const,
                      sourceCurrency: "EUR",
                      accountingBasis: "IFRS",
                      issuerScope: "Amundi consolidated",
                      comparabilityClassification: "display-only-segment",
                    }
                  : point,
              ),
            }
          : series,
      ),
    });

    expect(() => publishCandidate(database, candidateRunId)).toThrow(
      "Amundi published point is missing EUR/IFRS scope or comparability metadata",
    );
  });

  test("rejects a published State Street point without explicit SSGA segment scope", () => {
    const database = new DatabaseSync(":memory:");
    createFactBaseSchema(database);
    const allSeries = allFirms.flatMap((firm) =>
      headlineMetrics.map((metric) => seriesFor(metric, firm)),
    );
    const candidateRunId = backfillStaticFactBase(database, {
      asOf: "2026-08-13",
      firms: firmMeta,
      metrics: metricMeta,
      periods: trendYears,
      series: allSeries.map((series) =>
        series.firm === "state-street" && series.metric === "revenue"
          ? {
              ...series,
              points: series.points.map((point, index) =>
                index === 0
                  ? {
                      ...point,
                      issuerScope: "State Street consolidated",
                      comparabilityClassification: "comparable",
                    }
                  : point,
              ),
            }
          : series,
      ),
    });

    expect(() => publishCandidate(database, candidateRunId)).toThrow(
      "State Street published point is missing explicit Investment Management segment scope",
    );
  });

  test("rejects Vanguard AUM that is published without adviser scope", () => {
    const database = new DatabaseSync(":memory:");
    createFactBaseSchema(database);
    const allSeries = allFirms.flatMap((firm) =>
      headlineMetrics.map((metric) => seriesFor(metric, firm)),
    );
    const candidateRunId = backfillStaticFactBase(database, {
      asOf: "2026-08-13",
      firms: firmMeta,
      metrics: metricMeta,
      periods: trendYears,
      series: allSeries.map((series) =>
        series.firm === "vanguard" && series.metric === "aum"
          ? {
              ...series,
              points: series.points.map((point) =>
                point.year === 2025
                  ? {
                      ...point,
                      issuerScope: "Vanguard corporate consolidated",
                    }
                  : point,
              ),
            }
          : series,
      ),
    });

    expect(() => publishCandidate(database, candidateRunId)).toThrow(
      "Vanguard regulatory AUM requires an adviser Form ADV citation",
    );
  });

  test("rejects Vanguard regulatory AUM from a lookalike SEC hostname", () => {
    const database = new DatabaseSync(":memory:");
    createFactBaseSchema(database);
    const allSeries = allFirms.flatMap((firm) =>
      headlineMetrics.map((metric) => seriesFor(metric, firm)),
    );
    const candidateRunId = backfillStaticFactBase(database, {
      asOf: "2026-08-13",
      firms: firmMeta,
      metrics: metricMeta,
      periods: trendYears,
      series: allSeries.map((series) =>
        series.firm === "vanguard" && series.metric === "aum"
          ? {
              ...series,
              points: series.points.map((point) =>
                point.year === 2025
                  ? {
                      ...point,
                      sourceUrl: "https://attacker.example/sec.gov/form-adv.zip",
                    }
                  : point,
              ),
            }
          : series,
      ),
    });

    expect(() => publishCandidate(database, candidateRunId)).toThrow(
      "Vanguard regulatory AUM requires an adviser Form ADV citation",
    );
  });
});