import { mkdir, rename, unlink, writeFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import {
  allFirms,
  firmMeta,
  headlineMetrics,
  metricMeta,
  peerFirms,
  primarySourceFor,
  seriesFor,
  trendYears,
  auditedMetrics,
} from "../src/data/fact-base.ts";
import {
  backfillStaticFactBase,
  createFactBaseSchema,
  publishCandidate,
  readCandidateSeries,
  restorePublishedRun,
} from "../src/lib/fact-base-repository.ts";

const root = process.cwd();
const databasePath = `${root}/data/fact-base.sqlite`;
const readModelPath = `${root}/src/data/fact-base-read-model.json`;
const series = allFirms.flatMap((firm) =>
  headlineMetrics.map((metric) => seriesFor(metric, firm)),
);

await mkdir(`${root}/data`, { recursive: true });
const database = new DatabaseSync(databasePath);
createFactBaseSchema(database);
const runId = backfillStaticFactBase(database, {
  asOf: "2026-08-12",
  firms: firmMeta,
  metrics: metricMeta,
  periods: trendYears,
  series,
});
const previousRunId = database
  .prepare("SELECT id FROM collection_runs WHERE status = 'published'")
  .get()?.id;
const stagedReadModelPath = `${readModelPath}.${runId}.tmp`;
const publishedSeries = readCandidateSeries(database, runId);

await writeFile(
  stagedReadModelPath,
  `${JSON.stringify(
    {
      headlineMetrics,
      auditedMetrics,
      trendYears,
      peerFirms,
      allFirms,
      metricMeta,
      firmMeta,
      series: publishedSeries,
      primarySources: Object.fromEntries(
        peerFirms.map((firm) => [
          firm,
          primarySourceFor(firm),
        ]),
      ),
    },
    null,
    2,
  )}\n`,
  "utf8",
);

try {
  publishCandidate(database, runId);
  await rename(stagedReadModelPath, readModelPath);
} catch (error) {
  if (previousRunId !== undefined) restorePublishedRun(database, String(previousRunId));
  await unlink(stagedReadModelPath).catch(() => undefined);
  throw error;
}
database.close();