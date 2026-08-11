# 12 — Task: metrics dashboard and 5-year trends

**What to build:** The dashboard shows Vanguard's headline metrics (AUM, number of clients, revenue, RoE) for the latest fiscal year, drawn from the fact base, each with its definition, unit, source, and 5-year trend. This slice also establishes the fact base access layer and the provenance tests — every series must trace to its public source with the correct value and year coverage.

**Blocked by:** 11 (Task: site scaffold — stack, shell, navigation), 03 (Grilling: core metric set and definitions), 08 (Task: fact base assembly)

**Status:** resolved

- [x] Dashboard renders the headline metrics for the latest fiscal year
- [x] Each metric shows its definition, unit, source, and 5-year trend
- [x] Fact base access layer serves the metric set from the fact base
- [x] Provenance tests assert each series traces to its public source with correct value and year coverage
- [x] Browser E2E test asserts the dashboard renders the correct values from a seeded fact base

## Answer

**Built:**
- `src/app/metrics/page.tsx` — placeholder replaced with the real dashboard: h1, intro, data-as-of marker, gap/proxy note, and a responsive card grid (`lg:grid-cols-2`) over the 5 headline metrics (ticket 03 order: AUM, clients, cost ratio, revenue, RoE).
- `src/components/metric-card.tsx` — `MetricCard({metric})`: heading (name + unit), verbatim definition, latest published value with as-of date (e.g. AUM "$8.1T — As of Mar 31, 2022"), and a 5-year trend table (FY label, value, source link, gap note) with `data-testid`s (`metric-card-*`, `metric-value`, `trend-*`). Gaps render "Not published" with the gap note, never fabricated figures.

**Fact base access layer:** `src/data/fact-base.ts` — `seriesFor`, `latestPublishedPoint`, `metricMeta`, `headlineMetrics`, `trendYears`; the page/component read all values from the fact base (no hardcoded numbers).

**Verification (both seams):**
- Seam 2 — `tests/fact-base.spec.ts` (7 tests): every Vanguard series traces to its public source with the correct value and year coverage; expected values from asset 01 (independent source of truth), never recomputed. All pass (`npm run test:unit`).
- Seam 1 — `e2e/metrics.spec.ts`: browser test asserts the dashboard renders the correct values from the fact base (headline values, as-of text, trend rows, source links, data-as-of marker). Passes (`npx playwright test e2e/metrics.spec.ts`).

## Review (code review, post-resolution)

Two-axis review (standards + spec) findings for the dashboard slice:

**Fixed:**
- **Page copy overstated coverage:** the intro claimed "headline financial metrics for
  the latest fiscal year" while AUM's latest published point is FY2022. Now reads "each
  with its latest published value…". The gap note dropped the forward commitment to the
  RoE proxy "(tickets 05/06)" — scope creep; the gap itself is already explicit.
- **Spec story 4 (year coverage):** per-metric gap rows render "Not published" with the
  reason — the per-year coverage is visible in the trend table. The full verification
  badge per point was deliberately **not** added to the UI: ticket 12's slice is
  source + definition + unit + trend; a verification-column UI pass belongs with the
  provenance surfacing work (deferred, recorded).

**Accepted judgement calls:** `formatValue` switch per metric (formats genuinely differ);
the duplicated "Not published" literal (gap series vs. gap row rendering); strict-mode
`getByText` exactness fixed earlier during the E2E work.

Post-review verification: `npx tsc --noEmit` clean, `npm run lint` clean, `npm run
test:unit` 7/7, full `npm run test:e2e` 4/4.
