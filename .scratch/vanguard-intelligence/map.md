# Map: Vanguard client intelligence site

Label: `wayfinder:map`

## Destination

A working internal-reference website presenting an LLM-produced intelligence analysis of Vanguard — 5-year financial metrics, products & services, competitor benchmarking, RoE tree drilldowns, and RoE comparisons across peer set and industries by line of business — with a live, properly engineered LLM chatbot grounded in the fact base. The analysis answers how Vanguard is faring and where it can improve.

## Notes

- **Domain**: financial services / asset-management industry analysis; an internal-reference web tool for a technology consulting team.
- **Execution is in scope**: this effort carries the build — the site and the analysis — not just decisions.
- **Analysis is LLM-produced**: research loops (deepagents etc.) build the fact base and analysis; public sources only.
- **Hybrid currency**: most data dynamic (quarterly updates), some static; the chatbot is live.
- **5-year trends** (latest fiscal year as the primary view).
- **Improvement lens**: broad business performance, technology one possible lever among many.
- **Comparability caveat**: Vanguard is client-owned (mutual); RoE is computed from published statements, while peers may be listed — the analysis treats this explicitly.
- **Skills to consult**: grilling, domain-modeling, research, prototype, frontend-blueprint / frontend-design (UI), api-and-interface-design, source-driven-development, security-and-hardening (chatbot), observability-and-instrumentation (site ops).
- **Standing preferences**: internal reference only (never client-facing); public data only (no paid sources); proper engineering for the chatbot.
- **Build**: implementation tickets 11–20 derive from the spec (`.scratch/vanguard-intelligence/spec.md`); the design tickets above gate them.

## Decisions so far

<!-- one line per closed ticket: title + gist; detail lives in the ticket -->

- [Task: site scaffold — stack, shell, navigation](issues/11-task-site-scaffold.md) — site boots on Next.js 16 App Router + React 19 + TS + Tailwind 4; full nav to all 7 sections with stable placeholders; About states internal-reference-only + how-to-read + data-as-of; stack + environment pinning documented in `docs/adr/0001-site-stack.md`; E2E green (commit `fc05b09`).
- [Research: Vanguard's public financial disclosures](issues/01-research-vanguard-disclosures.md) — asset `assets/01-vanguard-public-disclosures.md`: Vanguard publishes no firm-level statements (mutual, no 10-K); published: cost ratios 0.09%→0.07% (2020–2025), client counts (2021–2025, 2023 methodology break), fund counts, crew; AUM public only through H1 2022 (FY2022–25 in Form ADV, unread); gaps: revenue/expenses/income/equity, LoB profitability, tech spend → RoE not computable from published data (ticket 03 follow-up: ADV PDF) (commit `64854e8`).
- [Research: peer universe comparability](issues/02-research-peer-universe.md) — asset `assets/02-peer-universe.md`: candidates split into listed & fully data-comparable (BlackRock, State Street, T. Rowe Price, Franklin, Invesco, Janus Henderson, Northern Trust — 10-Ks verified via EDGAR; Amundi — URD, IFRS/EUR), private & data-limited (Fidelity — voluntary stats only), and mutual subject (Vanguard); closest business comparators to Vanguard's index/ETF + retirement + advice mix: BlackRock, Fidelity, SSGA, Invesco; comparability traps: three ownership regimes, differing revenue models, staggered FYEs (Franklin Sep 30, JHG Jun 30), US GAAP vs IFRS; feeds ticket 04 (does not pick the set).
- [Grilling: peer set selection](issues/04-grilling-peer-set.md) — core set = **BlackRock, Fidelity (voluntary-data core member), State Street/SSGA (segment-isolated), Invesco, Amundi**; membership rules: audited financials (10-K or equivalent; documented exception for high-comparability private firms), AUM scale floor ≥$500B (guardrail), business-mix overlap (index/ETF + retirement + advice) — excludes T. Rowe Price, Janus Henderson, Northern Trust, Franklin; one core set + per-metric availability notes (Fidelity out of audited-metric comparisons, SSGA isolated); basis: same definitions + Dec-31 FYE for US-listed members (Amundi to confirm at ticket 08), ownership/revenue-model caveats on comparisons (story 12), Amundi EUR→USD + IFRS/US-GAAP flag, Vanguard RoE = labeled proxy; feeds tickets 06, 08, 14, 16.
- [Grilling: core metric set and definitions](issues/03-grilling-core-metric-set.md) — headline set = **AUM, number of clients, cost ratio, revenue, RoE**; definitions/units approved (AUM period-end USD T with as-of dates; clients = investors, M, 2023 methodology break; cost ratio = Vanguard's published definition verbatim; revenue = audited total firm revenue USD B; RoE = NI ÷ average equity, Vanguard = labeled proxy); exclusions = paid data, live/forecast data, invented figures (Vanguard profitability = gaps, never reconstructed), Fidelity audited-metric exclusion, non-financial ops detail, fund-level granularity, peer revenue-model extras; coverage floor = prospective guardrail (new metrics must fill for Vanguard + ≥2 peers × ≥3 of 5 years); supporting series = peer NI/equity/margins + Vanguard crew/fund counts; feeds tickets 08, 12, 14.
- [Task: fact base assembly](issues/08-task-fact-base-assembly.md) — fact base landed in `src/data/fact-base.ts`: typed series (FirmId/MetricId/SeriesPoint/MetricSeries), Vanguard's 5 headline series complete FY2021–25 with per-point provenance (source name, URL incl. archive snapshots, verification tag, as-of), 25 peer series structurally present as `pending-collection` via `peerSeries()` + `peerPrimarySource`; gaps recorded as `not-published`/`pending-collection`, never invented (ticket 03 exclusion 3); provenance tests green (Seam 2, 7/7); peer data collection + Form ADV read deferred to ticket 17 (needs research loops + independent source of truth; RoE inputs await tickets 05/06); feeds tickets 12, 14, 16, 17.
- [Task: metrics dashboard and 5-year trends](issues/12-task-metrics-dashboard.md) — `/metrics` renders the 5 headline metric cards (latest value + as-of, verbatim definition, source link, 5-year trend table with gap handling) reading entirely from the fact base access layer (`seriesFor`/`latestPublishedPoint`); Seam 2 provenance tests (7/7) + Seam 1 browser E2E both green; placeholder replaced.
- [Task: competitor benchmarking views](issues/14-task-benchmarking-views.md) — `/benchmarking` replaced the placeholder: peer set panel (ticket-04 core set with ownership labels, 3 membership rules, basis of comparison, availability note, ownership caveat) + one comparison table per metric (rows = firms Vanguard-first, columns = FY2021–25, cells literal facts or explicit gap labels: "Pending collection" vs "Not published"); metric filter is URL state (`?metric=`, shareable) parsed against the headline-metrics allowlist; fact base gained `peerFirms`/`allFirms`/`Ownership`/`firmMeta`/`primarySourceFor`; narrative content lives in `src/lib/peer-set.ts` (decided, not derived); Seam 2 provenance tests 10/10 + Seam 1 benchmarking E2E 4/4 green.
- [Task: search, filter, export, shareable links](issues/19-task-search-filter-export.md) — `/metrics` search filters cards across name/unit/definition with an explicit empty state; metric cards gained stable anchor ids (`#aum` etc.); reusable `CsvExportButton` (RFC-4180, blob URL revoked 30s after click — earlier revocation cancels in-flight Chromium downloads) and `CopyLinkButton` (`origin + href`, "Copied" feedback) on cards and benchmarking tables; benchmarking firm filter narrows rows case-insensitively; `formatValue`/`formatAsOf` extracted to `src/lib/format.ts` (one formatting path shared by cards, tables, CSV); Seam 1 search-export E2E 5/5 green.
- Fix (ticket 14 follow-up): Fidelity excluded from audited-metric comparisons — `auditedMetrics` (`["revenue","roe"]`) + `isAuditedMetric` in the fact base, `voluntarySideDataNote` in `peer-set.ts`; benchmarking tables drop Fidelity's row and render a voluntary-side-data footnote under revenue/roe; CSV rows keyed by year (no index coupling); `cellText` delegates to `formatValue`. Charts explicitly deferred (peer data `pending-collection`; revisit with ticket 17). Seam 2 11/11 + Seam 1 14/14 (commit `9b97a7b`).

## Not yet specified

- **Access control for the internal site** — who may reach it (network-internal vs. restricted); decided as the site ships.

## Out of scope

- Client-facing delivery — the site is internal reference only.
- Paid / premium data sources — public data only.
- Investment advice or regulatory content — the site informs; it doesn't advise.
