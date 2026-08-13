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
});