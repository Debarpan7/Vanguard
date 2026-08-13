import { randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import {
  allFirms,
  headlineMetrics,
  trendYears,
} from "../data/fact-base.ts";
import type {
  FirmId,
  MetricId,
  MetricSeries,
  Ownership,
  SeriesPoint,
  VerificationTag,
} from "../data/fact-base.ts";

type FirmMetadata = Record<
  FirmId,
  { name: string; ownership: Ownership; note: string }
>;
type MetricMetadata = Record<
  MetricId,
  { name: string; unit: string; definition: string }
>;

export interface StaticFactBaseSeed {
  asOf: string;
  firms: FirmMetadata;
  metrics: MetricMetadata;
  periods: readonly number[];
  series: readonly MetricSeries[];
}

const schema = `
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS firms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    ownership TEXT NOT NULL,
    note TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS metrics (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    unit TEXT NOT NULL,
    definition TEXT NOT NULL,
    display_order INTEGER NOT NULL,
    is_headline INTEGER NOT NULL,
    is_audited INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS periods (
    year INTEGER PRIMARY KEY
  );

  CREATE TABLE IF NOT EXISTS collection_runs (
    id TEXT PRIMARY KEY,
    status TEXT NOT NULL CHECK (status IN ('candidate', 'published', 'superseded', 'failed')),
    data_as_of TEXT NOT NULL,
    created_at TEXT NOT NULL,
    published_at TEXT,
    failure_reason TEXT
  );

  CREATE TABLE IF NOT EXISTS collection_run_periods (
    run_id TEXT NOT NULL REFERENCES collection_runs(id),
    year INTEGER NOT NULL REFERENCES periods(year),
    PRIMARY KEY (run_id, year)
  );

  CREATE TABLE IF NOT EXISTS sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    UNIQUE (name, url)
  );

  CREATE TABLE IF NOT EXISTS observations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    run_id TEXT NOT NULL REFERENCES collection_runs(id),
    firm_id TEXT NOT NULL REFERENCES firms(id),
    metric_id TEXT NOT NULL REFERENCES metrics(id),
    period_year INTEGER NOT NULL REFERENCES periods(year),
    value REAL,
    as_of TEXT,
    verification TEXT NOT NULL,
    source_currency TEXT,
    accounting_basis TEXT,
    issuer_scope TEXT,
    comparability_classification TEXT,
    note TEXT,
    supersedes_id INTEGER REFERENCES observations(id),
    UNIQUE (run_id, firm_id, metric_id, period_year)
  );

  CREATE TABLE IF NOT EXISTS citations (
    observation_id INTEGER PRIMARY KEY REFERENCES observations(id),
    source_id INTEGER NOT NULL REFERENCES sources(id),
    claim TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS verification_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    observation_id INTEGER NOT NULL REFERENCES observations(id),
    state TEXT NOT NULL,
    note TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS comparability_states (
    observation_id INTEGER PRIMARY KEY REFERENCES observations(id),
    state TEXT NOT NULL,
    note TEXT
  );

  CREATE TABLE IF NOT EXISTS revisions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    observation_id INTEGER NOT NULL REFERENCES observations(id),
    supersedes_id INTEGER REFERENCES observations(id),
    reason TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`;

export function createFactBaseSchema(database: DatabaseSync): void {
  database.exec(schema);
  const columns = database
    .prepare("PRAGMA table_info(observations)")
    .all()
    .map((row) => String(row.name));
  for (const [name, definition] of [
    ["source_currency", "TEXT"],
    ["accounting_basis", "TEXT"],
    ["issuer_scope", "TEXT"],
    ["comparability_classification", "TEXT"],
  ] as const) {
    if (!columns.includes(name)) {
      database.exec(`ALTER TABLE observations ADD COLUMN ${name} ${definition}`);
    }
  }
}

export function backfillStaticFactBase(
  database: DatabaseSync,
  seed: StaticFactBaseSeed,
): string {
  const runId = randomUUID();
  const now = new Date().toISOString();
  database.exec("BEGIN IMMEDIATE");

  try {
    const insertFirm = database.prepare(
      "INSERT INTO firms (id, name, ownership, note) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name = excluded.name, ownership = excluded.ownership, note = excluded.note",
    );
    for (const [firmId, firm] of Object.entries(seed.firms)) {
      insertFirm.run(firmId, firm.name, firm.ownership, firm.note);
    }

    const insertMetric = database.prepare(
      "INSERT INTO metrics (id, name, unit, definition, display_order, is_headline, is_audited) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name = excluded.name, unit = excluded.unit, definition = excluded.definition",
    );
    for (const [index, [metricId, metric]] of Object.entries(seed.metrics).entries()) {
      insertMetric.run(metricId, metric.name, metric.unit, metric.definition, index, 1, ["revenue", "roe"].includes(metricId) ? 1 : 0);
    }

    const insertPeriod = database.prepare(
      "INSERT OR IGNORE INTO periods (year) VALUES (?)",
    );
    for (const year of seed.periods) insertPeriod.run(year);

    database
      .prepare(
        "INSERT INTO collection_runs (id, status, data_as_of, created_at) VALUES (?, 'candidate', ?, ?)",
      )
      .run(runId, seed.asOf, now);
    const insertRunPeriod = database.prepare(
      "INSERT INTO collection_run_periods (run_id, year) VALUES (?, ?)",
    );
    for (const year of seed.periods) insertRunPeriod.run(runId, year);

    const sourceIds = new Map<string, number>();
    const sourceFor = database.prepare(
      "SELECT id FROM sources WHERE name = ? AND url = ?",
    );
    const insertSource = database.prepare(
      "INSERT INTO sources (name, url) VALUES (?, ?)",
    );
    const insertObservation = database.prepare(
      "INSERT INTO observations (run_id, firm_id, metric_id, period_year, value, as_of, verification, source_currency, accounting_basis, issuer_scope, comparability_classification, note, supersedes_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    );
    const previousObservation = database.prepare(
      "SELECT o.id FROM observations o JOIN collection_runs r ON r.id = o.run_id WHERE r.status = 'published' AND o.firm_id = ? AND o.metric_id = ? AND o.period_year = ?",
    );
    const insertCitation = database.prepare(
      "INSERT INTO citations (observation_id, source_id, claim) VALUES (?, ?, ?)",
    );
    const insertVerification = database.prepare(
      "INSERT INTO verification_events (observation_id, state, note, created_at) VALUES (?, ?, ?, ?)",
    );
    const insertComparability = database.prepare(
      "INSERT INTO comparability_states (observation_id, state, note) VALUES (?, ?, ?)",
    );

    for (const series of seed.series) {
      for (const point of series.points) {
        const sourceKey = `${point.source}\u0000${point.sourceUrl}`;
        let sourceId = sourceIds.get(sourceKey);
        if (sourceId === undefined) {
          const existing = sourceFor.get(point.source, point.sourceUrl);
          if (existing) {
            sourceId = Number(existing.id);
          } else {
            const inserted = insertSource.run(point.source, point.sourceUrl);
            sourceId = Number(inserted.lastInsertRowid);
          }
          sourceIds.set(sourceKey, sourceId);
        }

        const previous = previousObservation.get(
          series.firm,
          series.metric,
          point.year,
        );
        const supersedesId = previous?.id ?? null;
        const observation = insertObservation.run(
          runId,
          series.firm,
          series.metric,
          point.year,
          point.value,
          point.asOf ?? null,
          point.verification,
          point.sourceCurrency ?? null,
          point.accountingBasis ?? null,
          point.issuerScope ?? null,
          point.comparabilityClassification ?? null,
          point.note ?? null,
          supersedesId,
        );
        const observationId = Number(observation.lastInsertRowid);
        if (supersedesId !== null) {
          database
            .prepare(
              "INSERT INTO revisions (observation_id, supersedes_id, reason, created_at) VALUES (?, ?, ?, ?)",
            )
            .run(
              observationId,
              supersedesId,
              "Quarterly candidate supersedes the prior published observation",
              now,
            );
        }
        insertCitation.run(observationId, sourceId, point.note ?? series.definition);
        insertVerification.run(
          observationId,
          point.verification,
          point.note ?? null,
          now,
        );
        const comparabilityState =
          point.verification === "voluntary"
            ? "voluntary"
            : point.verification === "unverified"
              ? "display-only"
              : "comparable";
        insertComparability.run(
          observationId,
          comparabilityState,
          series.definition,
        );
      }
    }

    database.exec("COMMIT");
    return runId;
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}

export function publishCandidate(database: DatabaseSync, runId: string): void {
  const issues = validateCandidate(database, runId);
  if (issues.length > 0) {
    database
      .prepare(
        "UPDATE collection_runs SET status = 'failed', failure_reason = ? WHERE id = ? AND status = 'candidate'",
      )
      .run(issues.join("; "), runId);
    throw new Error(`candidate validation failed: ${issues.join("; ")}`);
  }

  const publishedAt = new Date().toISOString();
  database.exec("BEGIN IMMEDIATE");
  try {
    database
      .prepare(
        "UPDATE collection_runs SET status = 'superseded' WHERE status = 'published'",
      )
      .run();
    database
      .prepare(
        "UPDATE collection_runs SET status = 'published', published_at = ? WHERE id = ?",
      )
      .run(publishedAt, runId);
    database.exec("COMMIT");
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}

function validateCandidate(database: DatabaseSync, runId: string): string[] {
  const issues: string[] = [];
  const run = database
    .prepare("SELECT status, data_as_of FROM collection_runs WHERE id = ?")
    .get(runId);
  if (!run) return [`unknown collection run: ${runId}`];
  if (run.status !== "candidate") issues.push(`run is not a candidate: ${runId}`);

  const runPeriods = database
    .prepare("SELECT year FROM collection_run_periods WHERE run_id = ? ORDER BY year")
    .all(runId)
    .map((row) => Number(row.year));
  if (
    runPeriods.length !== trendYears.length ||
    runPeriods.some((year, index) => year !== trendYears[index])
  ) {
    issues.push(
      `candidate periods must be [${trendYears.join(", ")}], found [${runPeriods.join(", ")}]`,
    );
  }
  const expectedRows = allFirms.flatMap((firm) =>
    headlineMetrics.flatMap((metric) =>
      trendYears.map((year) => ({ firm_id: firm, metric_id: metric, year })),
    ),
  );
  const expectedKeys = new Set(
    expectedRows.map((row) => `${row.firm_id}/${row.metric_id}/${row.year}`),
  );
  const candidateRows = database
    .prepare(
          `SELECT o.id, o.firm_id, o.metric_id, o.period_year, o.value,
              o.verification, o.as_of, o.source_currency, o.accounting_basis,
              o.issuer_scope, o.comparability_classification,
              s.name AS source, s.url,
              c.observation_id AS citation_id,
              v.observation_id AS verification_id,
              cs.observation_id AS comparability_id
       FROM observations o
       LEFT JOIN citations c ON c.observation_id = o.id
       LEFT JOIN sources s ON s.id = c.source_id
       LEFT JOIN verification_events v ON v.observation_id = o.id
       LEFT JOIN comparability_states cs ON cs.observation_id = o.id
       WHERE o.run_id = ?`,
    )
    .all(runId);
  const actualKeys = new Set(
    candidateRows.map((row) => `${row.firm_id}/${row.metric_id}/${row.period_year}`),
  );
  for (const key of expectedKeys) {
    if (!actualKeys.has(key)) issues.push(`missing observation: ${key}`);
  }
  for (const key of actualKeys) {
    if (!expectedKeys.has(key)) issues.push(`unexpected observation: ${key}`);
  }

  const gapTags = new Set([
    "not-published",
    "pending-collection",
    "pdf-not-read",
    "blocked-unavailable",
  ]);
  const publishedTags = new Set([
    "verified-from-url",
    "unverified",
    "voluntary",
  ]);
  for (const row of candidateRows) {
    let validUrl = false;
    try {
      const url = new URL(String(row.url));
      validUrl = url.protocol === "http:" || url.protocol === "https:";
    } catch {
      validUrl = false;
    }
    if (!row.source || !validUrl) {
      issues.push(`observation ${row.id}: missing or invalid source`);
    }
    if (!row.citation_id) issues.push(`observation ${row.id}: missing citation`);
    if (!row.verification_id) {
      issues.push(`observation ${row.id}: missing verification event`);
    }
    if (!row.comparability_id) {
      issues.push(`observation ${row.id}: missing comparability state`);
    }
    if (gapTags.has(String(row.verification)) && row.value !== null) {
      issues.push(`observation ${row.id}: gap carries a value`);
    }
    if (publishedTags.has(String(row.verification)) && row.value === null) {
      issues.push(`observation ${row.id}: published point has no value`);
    }
    if (
      row.firm_id === "amundi" &&
      publishedTags.has(String(row.verification)) &&
      (!row.source_currency ||
        !row.accounting_basis ||
        !row.issuer_scope ||
        !row.comparability_classification)
    ) {
      issues.push(
        `observation ${row.id}: Amundi published point is missing EUR/IFRS scope or comparability metadata`,
      );
    }
    if (!gapTags.has(String(row.verification)) && !publishedTags.has(String(row.verification))) {
      issues.push(`observation ${row.id}: unknown verification tag`);
    }
  }
  const asOf = String(run.data_as_of);
  const parsedAsOf = new Date(`${asOf}T00:00:00Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(asOf) ||
    parsedAsOf.toISOString().slice(0, 10) !== asOf
  ) {
    issues.push(`invalid data-as-of: ${run.data_as_of}`);
  }
  return issues;
}

export function readPublishedSeries(database: DatabaseSync): MetricSeries[] {
  return readSeries(database);
}

export function readCandidateSeries(
  database: DatabaseSync,
  runId: string,
): MetricSeries[] {
  return readSeries(database, runId);
}

export function restorePublishedRun(
  database: DatabaseSync,
  previousRunId: string,
): void {
  database.exec("BEGIN IMMEDIATE");
  try {
    database
      .prepare(
        "UPDATE collection_runs SET status = 'superseded' WHERE status = 'published'",
      )
      .run();
    database
      .prepare(
        "UPDATE collection_runs SET status = 'published', failure_reason = NULL WHERE id = ?",
      )
      .run(previousRunId);
    database.exec("COMMIT");
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}

function readSeries(database: DatabaseSync, runId?: string): MetricSeries[] {
  const runPredicate = runId ? "r.id = ?" : "r.status = 'published'";
  const rows = database
    .prepare(
          `SELECT o.firm_id, o.metric_id, m.unit, m.definition, o.period_year,
              o.value, o.as_of, o.source_currency, o.accounting_basis,
              o.issuer_scope, o.comparability_classification,
              s.name AS source, s.url AS source_url,
              o.verification, o.note
       FROM observations o
       JOIN collection_runs r ON r.id = o.run_id AND ${runPredicate}
       JOIN metrics m ON m.id = o.metric_id
       JOIN sources s ON s.id = (SELECT source_id FROM citations WHERE observation_id = o.id)
      ORDER BY m.display_order, o.period_year, o.firm_id`,
    )
    .all(...(runId ? [runId] : []));
  const series = new Map<string, MetricSeries>();
  for (const row of rows) {
    const key = `${row.metric_id}/${row.firm_id}`;
    let current = series.get(key);
    if (!current) {
      current = {
        metric: row.metric_id as MetricId,
        firm: row.firm_id as FirmId,
        unit: String(row.unit),
        definition: String(row.definition),
        points: [],
      };
      series.set(key, current);
    }
    current.points.push({
      year: Number(row.period_year),
      value: row.value === null ? null : Number(row.value),
      ...(row.as_of === null ? {} : { asOf: String(row.as_of) }),
      source: String(row.source),
      sourceUrl: String(row.source_url),
      verification: row.verification as VerificationTag,
      ...(row.source_currency === null ? {} : { sourceCurrency: String(row.source_currency) }),
      ...(row.accounting_basis === null ? {} : { accountingBasis: String(row.accounting_basis) }),
      ...(row.issuer_scope === null ? {} : { issuerScope: String(row.issuer_scope) }),
      ...(row.comparability_classification === null
        ? {}
        : { comparabilityClassification: String(row.comparability_classification) }),
      ...(row.note === null ? {} : { note: String(row.note) }),
    });
  }
  return [...series.values()].sort(
    (left, right) =>
      allFirms.indexOf(left.firm) - allFirms.indexOf(right.firm) ||
      left.metric.localeCompare(right.metric),
  );
}

export function readPublishedSeriesMap(
  database: DatabaseSync,
): Map<string, MetricSeries> {
  return new Map(
    readPublishedSeries(database).map((series) => [
      `${series.metric}/${series.firm}`,
      series,
    ]),
  );
}

export type { SeriesPoint };