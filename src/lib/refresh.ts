import {
  allFirms,
  headlineMetrics,
  seriesFor,
  trendYears,
  type MetricSeries,
  type VerificationTag,
} from "@/lib/fact-base";
import {
  analysisNarrative,
  analysisOpportunities,
  type AnalysisNarrative,
  type AnalysisOpportunity,
} from "@/data/analysis";
import { site } from "@/lib/site";

/**
 * The quarterly refresh pipeline gate (ticket 20). The site is a static,
 * seeded build, so the "pipeline" is a re-runnable validation gate: after a
 * refresh updates the fact base (`src/data/fact-base.ts`) and the re-analysis
 * (`src/data/analysis.ts`), the gate re-verifies the invariants that keep
 * provenance intact — full (metric, firm) coverage, every point sourced and
 * consistently tagged (gaps carry null, published points carry a value:
 * nothing invented), the analysis well-formed and grounded in real headline
 * metrics, and the data-as-of stamp a valid date. The runbook
 * (`docs/runbooks/quarterly-refresh.md`) runs this gate as step 4.
 *
 * Every check returns a list of human-readable issues; an empty list means
 * the gate passed. `refreshGate()` is the full gate; `runRefreshChecks()`
 * wraps it with an `ok` flag.
 */

/** Verification tags that mean "no value was found": the point is a gap. */
const GAP_TAGS: readonly VerificationTag[] = [
  "not-published",
  "pending-collection",
  "pdf-not-read",
  "blocked-unavailable",
];

/** Verification tags that mean "a value was found and recorded". */
const PUBLISHED_TAGS: readonly VerificationTag[] = [
  "verified-from-url",
  "unverified",
  "voluntary",
];

const ALL_TAGS: readonly VerificationTag[] = [...GAP_TAGS, ...PUBLISHED_TAGS];

/**
 * Every (metric, firm) pair resolved through the fact-base accessor. A pair
 * the accessor cannot resolve (its series is missing) is left out of the
 * list: `factBaseIssues` then flags it as `Missing series:` instead of
 * letting the gate crash on the thrown error.
 */
export function liveSeries(): readonly MetricSeries[] {
  const series: MetricSeries[] = [];
  for (const firm of allFirms) {
    for (const metric of headlineMetrics) {
      try {
        series.push(seriesFor(metric, firm));
      } catch {
        // missing pair — reported by the factBaseIssues coverage check
      }
    }
  }
  return series;
}

/** True for a blank string (including whitespace-only). */
function isEmpty(value: string): boolean {
  return value.trim() === "";
}

/** Issues for a single series: year coverage, provenance, gap semantics. */
export function seriesIssues(series: MetricSeries): string[] {
  const issues: string[] = [];
  const label = `${series.metric}/${series.firm}`;

  const years = series.points.map((p) => p.year);
  if (
    years.length !== trendYears.length ||
    years.some((y, i) => y !== trendYears[i])
  ) {
    issues.push(
      `${label}: points must cover trend years in order — got [${years.join(", ")}], expected [${trendYears.join(", ")}]`,
    );
  }

  for (const point of series.points) {
    if (isEmpty(point.source)) {
      issues.push(`${label} ${point.year}: missing source`);
    }
    if (!point.sourceUrl.startsWith("http")) {
      issues.push(`${label} ${point.year}: sourceUrl must be a resolvable URL`);
    }
    if (!ALL_TAGS.includes(point.verification)) {
      issues.push(`${label} ${point.year}: unknown verification tag "${point.verification}"`);
      continue;
    }
    const isGap = GAP_TAGS.includes(point.verification);
    if (isGap && point.value !== null) {
      issues.push(
        `${label} ${point.year}: gap point (${point.verification}) must carry no value — nothing invented`,
      );
    }
    if (!isGap && point.value === null) {
      issues.push(
        `${label} ${point.year}: published point (${point.verification}) must carry a value`,
      );
    }
  }

  return issues;
}

/**
 * Fact-base gate. Checks that every (metric, firm) pair in the universe is
 * present, then runs the per-series checks. Defaults to the live fact base.
 */
export function factBaseIssues(
  seriesList: readonly MetricSeries[] = liveSeries(),
): string[] {
  const issues: string[] = [];

  for (const firm of allFirms) {
    for (const metric of headlineMetrics) {
      const present = seriesList.some(
        (s) => s.metric === metric && s.firm === firm,
      );
      if (!present) {
        issues.push(`Missing series: ${metric}/${firm}`);
      }
    }
  }

  for (const series of seriesList) {
    issues.push(...seriesIssues(series));
  }

  return issues;
}

/**
 * Analysis gate. The re-analysis step (ticket 17) must produce a well-formed
 * narrative and opportunities whose evidence references real headline
 * metrics. Defaults to the live analysis data.
 */
export function analysisIssues(
  narrative: AnalysisNarrative = analysisNarrative,
  opportunities: readonly AnalysisOpportunity[] = analysisOpportunities,
): string[] {
  const issues: string[] = [];

  if (isEmpty(narrative.title)) {
    issues.push("analysis narrative: missing title");
  }
  if (isEmpty(narrative.intro)) {
    issues.push("analysis narrative: missing intro");
  }
  if (isEmpty(narrative.caveat)) {
    issues.push("analysis narrative: missing caveat");
  }
  if (narrative.reads.length === 0) {
    issues.push("analysis narrative: no reads");
  }
  narrative.reads.forEach((read, i) => {
    if (isEmpty(read.heading)) {
      issues.push(`analysis narrative read ${i + 1}: missing heading`);
    }
    if (isEmpty(read.body)) {
      issues.push(`analysis narrative read ${i + 1}: missing body`);
    }
  });

  const seenIds = new Set<string>();
  opportunities.forEach((opportunity, i) => {
    if (isEmpty(opportunity.id)) {
      issues.push(`analysis opportunity ${i + 1}: missing id`);
      return;
    }
    if (seenIds.has(opportunity.id)) {
      issues.push(`analysis opportunity "${opportunity.id}": duplicate id`);
    }
    seenIds.add(opportunity.id);

    if (isEmpty(opportunity.name)) {
      issues.push(`analysis opportunity "${opportunity.id}": missing name`);
    }
    if (isEmpty(opportunity.claim)) {
      issues.push(`analysis opportunity "${opportunity.id}": missing claim`);
    }
    if (isEmpty(opportunity.read)) {
      issues.push(`analysis opportunity "${opportunity.id}": missing read`);
    }
    if (opportunity.evidence.length === 0) {
      issues.push(`analysis opportunity "${opportunity.id}": no evidence metrics`);
    }
    for (const metric of opportunity.evidence) {
      if (!headlineMetrics.includes(metric)) {
        issues.push(
          `analysis opportunity "${opportunity.id}": evidence metric "${metric}" is not a headline metric`,
        );
      }
    }
  });

  return issues;
}

/**
 * Data-as-of gate: the refresh stamp must be a real, well-formed ISO date
 * (YYYY-MM-DD) — the gate checks format, not freshness: stamping the run's
 * date is the runbook's step 5 discipline.
 */
export function dataAsOfIssues(asOf: string | null = site.dataAsOf): string[] {
  if (!asOf) {
    return ["data-as-of: no refresh stamp — set site.dataAsOf to the refresh date"];
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(asOf)) {
    return [`data-as-of: "${asOf}" is not a valid ISO date (expected YYYY-MM-DD)`];
  }
  const parsed = new Date(`${asOf}T00:00:00Z`);
  const roundTrip = parsed.toISOString().slice(0, 10);
  if (roundTrip !== asOf) {
    return [`data-as-of: "${asOf}" is not a valid ISO date (rolled over to ${roundTrip})`];
  }
  return [];
}

/** The full refresh gate: fact base + analysis + data-as-of. */
export function refreshGate(): string[] {
  return [...factBaseIssues(), ...analysisIssues(), ...dataAsOfIssues()];
}

/** Wraps the gate with an `ok` flag for the runbook's go/no-go step. */
export function runRefreshChecks(): { ok: boolean; issues: string[] } {
  const issues = refreshGate();
  return { ok: issues.length === 0, issues };
}
