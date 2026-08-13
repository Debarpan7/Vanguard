/**
 * The chatbot grounding engine (ticket 18 — live grounded chatbot,
 * engineered per the ticket-09 decisions).
 *
 * Decisions implemented here:
 *   D1  Deterministic retrieval engine — rule-based intent matching over the
 *       fact base and analysis data; no live LLM API call. Fully testable,
 *       no key/cost/latency/hallucination.
 *   D2  Five named intents (metric queries, 5-year trend, benchmarking, RoE
 *       tree/profitability, improvement reads + ownership/company context);
 *       everything else is refused.
 *   D3  Grounding: a static intent registry; answers render facts through the
 *       fact-base accessors (`seriesFor`/`latestPublishedPoint`/`metricMeta`)
 *       so every figure and source link is a fact-base literal.
 *   D4  Refuse-first with fixed literal strings; the ownership caveat is
 *       auto-appended to benchmarking and RoE answers.
 *   D5  Runs entirely in-browser on the /chatbot view — no API route, no
 *       network.
 */

import type { FirmId, MetricId } from "@/lib/fact-base";
import {
  firmMeta,
  headlineMetrics,
  latestPublishedPoint,
  metricMeta,
  peerFirms,
  seriesFor,
} from "@/lib/fact-base";
import {
  analysisNarrative,
  analysisOpportunities,
  improvementLens,
} from "@/data/analysis";
import { formatAsOf, formatValue } from "@/lib/format";
import { ownershipCaveat } from "@/lib/peer-set";

const PEER_QUERY_NAMES: readonly {
  firm: Exclude<FirmId, "vanguard">;
  patterns: readonly string[];
}[] = [
  { firm: "blackrock", patterns: ["blackrock"] },
  { firm: "fidelity", patterns: ["fidelity"] },
  { firm: "state-street", patterns: ["state street", "ssga"] },
  { firm: "invesco", patterns: ["invesco"] },
  { firm: "amundi", patterns: ["amundi"] },
];

export interface ChatbotSource {
  name: string;
  url: string;
}

export interface ChatbotResponse {
  text: string;
  sources: readonly ChatbotSource[];
}

/* ------------------------------------------------------------------ *
 * Fixed literal strings (decision 4) — asserted verbatim by the E2E   *
 * suite, so the wording is part of the contract.                      *
 * ------------------------------------------------------------------ */

/** Investment/regulatory/filing advice is refused with this exact string. */
export const refusalAdvice =
  "I can't give investment, regulatory, or legal advice — this site is internal reference on Vanguard's public data, not advice.";

/** Anything outside the fact base is refused with this exact string. */
export const refusalOutOfFactBase =
  "That's outside the fact base — I answer questions about Vanguard's metrics, benchmarking, RoE analysis, and improvement reads, grounded in public sources.";

/** Prompt shown when the user greets the chatbot or asks nothing. */
export const promptAsk =
  "Ask me about Vanguard's metrics, benchmarking, RoE analysis, and improvement reads — for example: \"What is Vanguard's AUM?\"";

/** Prompt shown when a trend/benchmark query doesn't name a metric. */
export const promptMetric =
  "Which metric? Try \"What is Vanguard's AUM?\" or \"AUM trend over 5 years\".";

/* ------------------------------------------------------------------ *
 * Refusal triggers — checked BEFORE intent matching (decision 4).     *
 * ------------------------------------------------------------------ */

/** Solicitation of investment/regulatory/filing advice. */
const ADVICE_PATTERNS: readonly RegExp[] = [
  /\bbuy\b/,
  /\bsell\b/,
  /\binvest\b/,
  /\ballocat/,
  /\brecommend/,
  /\badvice\b/,
  /\badvise\b/,
  /\bshould i\b/,
  /\bshould we\b/,
  /\bportfolio\b/,
  /\bregulatory\b/,
  /\bfiling\b/,
  /\bsec\b/,
  /\blawsuit\b/,
  /\bsue\b/,
  /\bcomplaint\b/,
];

/** Non-fact-base topics: forward-looking, other firms, legal, general. */
const NON_FACT_BASE_PATTERNS: readonly RegExp[] = [
  /\bforecast/,
  /\bpredict/,
  /\bprojection/,
  /\bfuture\b/,
  /\bnext year\b/,
  /\bnext quarter\b/,
  /\boutlook\b/,
  /\blegal\b/,
  /\bweather\b/,
  /\bnews\b/,
  /\b(jpmorgan|jp morgan|morgan stanley|goldman|t\.?\s*rowe|janus|northern trust|franklin|microsoft|apple|google|tesla|amazon|netflix)\b/i,
];

/** Greetings return the prompt string rather than a refusal. */
const GREETING_PATTERNS: readonly RegExp[] = [/\bhi\b/, /\bhello\b/, /\bhey\b/];

/* ------------------------------------------------------------------ *
 * Metric detection (fact-base `MetricId`s, not derived from text).    *
 * ------------------------------------------------------------------ */

const METRIC_PATTERNS: readonly {
  metric: MetricId;
  patterns: readonly string[];
}[] = [
  { metric: "aum", patterns: ["aum", "assets under management"] },
  { metric: "clients", patterns: ["clients", "client count", "investors"] },
  { metric: "cost-ratio", patterns: ["cost ratio", "expense ratio"] },
  { metric: "revenue", patterns: ["revenue"] },
  { metric: "roe", patterns: ["roe", "return on equity"] },
];

function detectMetric(query: string): MetricId | undefined {
  let best: MetricId | undefined;
  let bestScore = 0;
  for (const { metric, patterns } of METRIC_PATTERNS) {
    const score = scoreKeywords(query, patterns);
    if (score > bestScore) {
      best = metric;
      bestScore = score;
    }
  }
  return bestScore > 0 ? best : undefined;
}

/* ------------------------------------------------------------------ *
 * Intent registry (decision 3). Order breaks ties — more specific     *
 * intents come first so they win when scores are equal.               *
 * ------------------------------------------------------------------ */

interface ChatbotIntent {
  /** Substring keywords scored against the normalized query. */
  keywords: readonly string[];
  /** Answer builder — facts rendered through fact-base accessors. */
  answer: (metric: MetricId | undefined, query?: string) => ChatbotResponse;
}

function metricAnswer(metric: MetricId | undefined): ChatbotResponse {
  if (!metric) return { text: promptMetric, sources: [] };
  const point = latestPublishedPoint(metric, "vanguard");
  const name = metricMeta[metric].name;
  if (!point) {
    return {
      text: `${name} is not published — Vanguard publishes no firm-level financial statements.`,
      sources: [notPublishedSource(metric)],
    };
  }
  return {
    text: `${name}: ${describeLatest(metric)}.`,
    sources: [{ name: point.source, url: point.sourceUrl }],
  };
}

function trendAnswer(metric: MetricId | undefined): ChatbotResponse {
  if (!metric) return { text: promptMetric, sources: [] };
  const series = seriesFor(metric, "vanguard");
  const parts = series.points.map(
    (point) => `${point.year}: ${formatValue(metric, point.value)}`,
  );
  return {
    text: `${metricMeta[metric].name} — 5-year trend: ${parts.join("; ")}.`,
    sources: dedupe(
      series.points
        .filter((point) => point.value !== null)
        .map((point) => ({ name: point.source, url: point.sourceUrl })),
    ),
  };
}

function benchmarkAnswer(
  metric: MetricId | undefined,
  query = "",
): ChatbotResponse {
  const peers = peerFirms.map((firm) => firmMeta[firm].name).join(", ");
  if (!metric) {
    return {
      text: `I compare Vanguard against its peer set — ${peers}. Audited BlackRock and Invesco revenue and RoE values are available; unsupported peer metrics remain pending collection. ${ownershipCaveat}`,
      sources: [],
    };
  }
  const requestedPeer = PEER_QUERY_NAMES.find(({ patterns }) =>
    patterns.some((pattern) => query.includes(pattern)),
  );
  const peerText = requestedPeer
    ? `${firmMeta[requestedPeer.firm].name}: ${describePeerLatest(metric, requestedPeer.firm)}`
    : `Audited BlackRock and Invesco revenue and RoE are available; other ${peers} metric series remain pending collection`;
  const sources = requestedPeer
    ? [
        sourceForPointOrGap(metric, "vanguard"),
        sourceForPointOrGap(metric, requestedPeer.firm),
      ]
    : [];
  return {
    text: `Vanguard ${metricMeta[metric].name}: ${describeLatest(metric)}. ${peerText}. ${ownershipCaveat}`,
    sources: dedupe(sources),
  };
}

function roeAnswer(): ChatbotResponse {
  return {
    text: `Return on equity — ${metricMeta.roe.definition} The RoE tree shows the decomposition with every Vanguard node as an explicit "Not published" gap, so RoE is not computable from public data. ${ownershipCaveat}`,
    sources: [notPublishedSource("roe")],
  };
}

function improvementAnswer(): ChatbotResponse {
  const reads = analysisNarrative.reads
    .map((read) => `${read.heading}: ${read.body}`)
    .join(" ");
  const opportunities = analysisOpportunities
    .map((opportunity) => `${opportunity.name} — ${opportunity.claim}`)
    .join(" ");
  const evidenceMetrics = Array.from(
    new Set(analysisOpportunities.flatMap((o) => o.evidence)),
  );
  return {
    text: `${analysisNarrative.intro} ${reads} Named improvement opportunities: ${opportunities}. ${improvementLens}`,
    sources: dedupe(
      evidenceMetrics.map((metric) => {
        const point = latestPublishedPoint(metric, "vanguard");
        return point
          ? { name: point.source, url: point.sourceUrl }
          : notPublishedSource(metric);
      }),
    ),
  };
}

function ownershipAnswer(): ChatbotResponse {
  return {
    text: "Vanguard is client-owned (mutual) — no shareholders, no listed equity.",
    sources: [],
  };
}

const INTENTS: readonly ChatbotIntent[] = [
  {
    keywords: [
      "trend",
      "history",
      "over time",
      "5-year",
      "5 years",
      "five year",
      "by year",
      "years",
    ],
    answer: trendAnswer,
  },
  {
    keywords: [
      "compare",
      "comparison",
      "benchmark",
      "vs",
      "versus",
      "against",
      "peer",
      "peers",
      "blackrock",
      "fidelity",
      "state street",
      "invesco",
      "amundi",
    ],
    answer: benchmarkAnswer,
  },
  {
    keywords: [
      "roe",
      "return on equity",
      "profitability",
      "roe tree",
      "drivers",
      "net income",
      "equity",
    ],
    answer: roeAnswer,
  },
  {
    keywords: [
      "improve",
      "opportunit",
      "faring",
      "narrative",
      "lens",
      "how is vanguard",
      "analysis",
    ],
    answer: improvementAnswer,
  },
  {
    keywords: [
      "client-owned",
      "mutual",
      "owned",
      "ownership",
      "shareholder",
      "who owns",
      "listed",
      "structure",
    ],
    answer: ownershipAnswer,
  },
  {
    keywords: headlineMetrics.flatMap(
      (metric) =>
        METRIC_PATTERNS.find((m) => m.metric === metric)?.patterns ?? [],
    ),
    answer: metricAnswer,
  },
];

/* ------------------------------------------------------------------ *
 * Helpers.                                                            *
 * ------------------------------------------------------------------ */

function normalizeQuery(raw: string): string {
  return raw.toLowerCase().trim().replace(/\s+/g, " ");
}

/** Counts how many `keywords` are substrings of `query` — shared by metric
 * detection and intent scoring (best score wins, declaration order breaks
 * ties). */
function scoreKeywords(query: string, keywords: readonly string[]): number {
  return keywords.reduce(
    (n, keyword) => (query.includes(keyword) ? n + 1 : n),
    0,
  );
}

/** Formats Vanguard's latest published point for a metric as
 * "value as of date", or "not published" when the series is all gaps. */
function describeLatest(metric: MetricId): string {
  const point = latestPublishedPoint(metric, "vanguard");
  if (!point) return "not published";
  const asOf = point.asOf ? ` as of ${formatAsOf(point.asOf)}` : "";
  return `${formatValue(metric, point.value)}${asOf}`;
}

function describePeerLatest(
  metric: MetricId,
  firm: Exclude<FirmId, "vanguard">,
): string {
  const point = latestPublishedPoint(metric, firm);
  if (!point) return "pending collection";
  const asOf = point.asOf ? ` as of ${formatAsOf(point.asOf)}` : "";
  return `${formatValue(metric, point.value)}${asOf}`;
}

function dedupe(sources: readonly ChatbotSource[]): ChatbotSource[] {
  const seen = new Set<string>();
  return sources.filter((source) => {
    const key = `${source.name}|${source.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** The source recorded on a metric's series even when every point is a gap
 * (e.g., Vanguard revenue/RoE — "No publication found (research asset 01)"). */
function notPublishedSource(metric: MetricId): ChatbotSource {
  return sourceForPointOrGap(metric, "vanguard");
}

/** Returns the latest published source, or the recorded source for an
 * explicit gap so grounded answers retain provenance even without a value. */
function sourceForPointOrGap(metric: MetricId, firm: FirmId): ChatbotSource {
  const point = latestPublishedPoint(metric, firm) ?? seriesFor(metric, firm).points[0];
  return { name: point.source, url: point.sourceUrl };
}

/* ------------------------------------------------------------------ *
 * Entry point (decisions D1/D4): normalize → refuse-first → score     *
 * intents → best above threshold answers, else the fixed refusal.     *
 * ------------------------------------------------------------------ */

export function answerChat(rawQuery: string): ChatbotResponse {
  const query = normalizeQuery(rawQuery);
  if (!query) return { text: promptAsk, sources: [] };

  if (ADVICE_PATTERNS.some((pattern) => pattern.test(query))) {
    return { text: refusalAdvice, sources: [] };
  }
  if (NON_FACT_BASE_PATTERNS.some((pattern) => pattern.test(query))) {
    return { text: refusalOutOfFactBase, sources: [] };
  }
  if (GREETING_PATTERNS.some((pattern) => pattern.test(query))) {
    return { text: promptAsk, sources: [] };
  }

  const metric = detectMetric(query);
  let bestIntent: ChatbotIntent | undefined;
  let bestScore = 0;
  for (const intent of INTENTS) {
    const score = scoreKeywords(query, intent.keywords);
    if (score > bestScore) {
      bestIntent = intent;
      bestScore = score;
    }
  }

  if (bestIntent && bestScore >= 1) {
    return bestIntent.answer(metric, query);
  }
  return { text: refusalOutOfFactBase, sources: [] };
}
