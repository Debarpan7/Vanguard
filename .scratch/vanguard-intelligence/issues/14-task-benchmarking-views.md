# 14 — Task: competitor benchmarking views

**What to build:** Each metric in the metric set shown against the peer set over the 5 years — comparison tables and charts — with the peer set membership rules and the ownership caveat displayed alongside every comparison.

**Blocked by:** 11 (Task: site scaffold — stack, shell, navigation), 03 (Grilling: core metric set and definitions), 04 (Grilling: peer set selection), 08 (Task: fact base assembly)

**Status:** resolved

- [x] Each metric renders compared against the peer set over the 5 years
- [x] Peer set membership rules are displayed with the comparison
- [x] Ownership caveat is displayed wherever Vanguard is compared
- [x] Browser E2E test asserts the benchmarking views render the correct comparisons from a seeded fact base

## Answer

**Built:**
- `src/app/benchmarking/page.tsx` — placeholder replaced with the real view: h1, intro, data-as-of marker, `PeerSetPanel`, and `BenchmarkingExplorer`. `?metric=` is parsed against the `headlineMetrics` allowlist (invalid/absent → all metrics); the page is `async` and awaits `searchParams`, so the metric filter is a stable shareable URL (ticket 19 overlaps here by design).
- `src/components/peer-set-panel.tsx` — server-rendered panel: the five core-set members (decision: ticket 04) with ownership labels, the three membership rules (audited financials + Fidelity voluntary exception, AUM scale floor ≥ $500B, business-mix overlap), basis of comparison, per-metric availability note, and the ownership caveat.
- `src/components/benchmarking-explorer.tsx` — client component: metric tabs driven by URL (`/benchmarking` + `/benchmarking?metric=`) with `aria-current`, a firm search box (client state, case-insensitive on firm name), and one `BenchmarkTable` per visible metric.
- `src/components/benchmark-table.tsx` — comparison table per metric: rows = firms (Vanguard first, then core set), columns = FY2021–FY2025; each cell is a literal fact or an explicit gap label from the fact base — peers `pending-collection` render "Pending collection", Vanguard gaps render "Not published". Firm name + ownership label + availability note travel with each row; the ownership caveat renders under every table; CSV export and copy-link buttons ride along (ticket 19).
- `src/data/fact-base.ts` — added `peerFirms` (ticket-04 core set in display order), `allFirms` (Vanguard first), `Ownership` type + `firmMeta` (name, ownership class, per-firm availability note), and `primarySourceFor(firm)` over the existing `peerPrimarySource`. The `allSeries` construction now derives peers from `peerFirms` instead of an inline array literal.
- `src/lib/peer-set.ts` — narrative content module: membership rules, basis of comparison, availability note, ownership caveat, ownership labels. Content is decided (ticket 04), not derived — comment points at the ticket resolution.

**Verification (both seams):**
- Seam 2 — `tests/fact-base.spec.ts` (10 tests): 3 new tests assert the peer set is the ticket-04 core set in display order, firm metadata records ownership + per-firm availability notes, and peer primary sources identify the filing each series is collected from. All pass (`npm run test:unit`).
- Seam 1 — `e2e/benchmarking.spec.ts` (4 tests): peer set panel shows members with membership rules and ownership caveat; comparison tables render seeded values ($8.0T/$8.1T, 0.09%→0.07%, "Pending collection", "Not published"); ownership caveat on every table; metric filter narrows the view with a stable URL. All pass.

## Review (code review, post-resolution)

Five-axis review (correctness, readability, architecture, security, performance) of the ticket 14 + 19 changes as a unit.

**Approved** — no blocking findings. Non-blocking notes recorded:
- **Duplicated search-input markup** between `metrics-dashboard.tsx` and `benchmarking-explorer.tsx` (label + input + className) — two occurrences only; per the "don't generalize until the third use case" rule, left as-is.
- **Duplicated button className** between `csv-export-button.tsx` and `copy-link-button.tsx` — trivial, consistent styling; a shared constant would add indirection without clarifying.

**Accepted judgement calls:** the firm filter is client state while the metric filter is URL state (spec: metric filter must be shareable; firm search is an on-page convenience); `parseMetric` casts `value as MetricId` after an allowlist `includes` check (standard narrowing workaround, no unchecked string reaches the view); CSV cells quote per RFC-4180 and content comes only from the fact base (no user input, no formula-injection surface).

### Follow-up: Fidelity audited-metric exclusion fixed (spec finding (c)1)

The page stated "Fidelity is dropped from audited-metric comparisons (e.g., RoE) and shown as voluntary side data" but still rendered a normal Fidelity "Pending collection" row in every table, including RoE — a contradiction with the ticket-04 peer-set rule. Fixed:

- `src/data/fact-base.ts` — `auditedMetrics` (`["revenue", "roe"]` — exactly the metrics `metricMeta` defines as coming from audited statements) + `isAuditedMetric(metric)`.
- `src/components/benchmark-table.tsx` — Fidelity's row is dropped from audited-metric tables (`firm !== "fidelity" || !isAuditedMetric(metric)`); a footnote (`voluntarySideDataNote`, testid `voluntary-note-{metric}`) renders under revenue/roe tables so a reader never infers false comparability. CSV rows were also re-keyed by year (`Map(year → cellText)`) instead of index-coupling to `points[i]`, and `cellText` now delegates to `formatValue` for all non-pending-collection nulls (kills the "Not published" duplication).
- `src/lib/peer-set.ts` — `voluntarySideDataNote` extracted; `peerSetAvailabilityNote` reuses it (rendered text unchanged).
- Tests: Seam 2 — new fact-base test "audited metrics are exactly revenue and roe"; Seam 1 — new benchmarking E2E "Fidelity is excluded from audited-metric comparisons and flagged as voluntary side data" (no `benchmark-row-fidelity` in revenue/roe, footnote visible; row present in aum/clients/cost-ratio with voluntary text).

This also preempts the ticket-17 data landing: a Fidelity RoE number would otherwise have appeared in a comparison it shouldn't.

**Deferred — charts (recorded, not fixed):** "What to build" mentions comparison tables **and charts**; the checkboxes and build never included charts. All peer series are `pending-collection` and Vanguard revenue/RoE are explicit gaps, so charting would draw lines through empty data. Revisit when ticket 17 lands peer data (add a map.md line when built).

Post-review verification (after follow-up): `npx tsc --noEmit` clean, `npm run lint` clean, `npm run test:unit` 11/11, full `npm run test:e2e` 14/14.
