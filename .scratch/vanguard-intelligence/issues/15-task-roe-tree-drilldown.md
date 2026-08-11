# 15 — Task: RoE tree drilldown

**What to build:** The RoE tree per the agreed decomposition, rendered across the 5 years with drilldown into driver nodes, every node traceable to the published numbers it derives from.

**Blocked by:** 11 (Task: site scaffold — stack, shell, navigation), 08 (Task: fact base assembly)

**Status:** resolved

- [x] RoE tree renders per the agreed decomposition
- [x] Drilldown reaches each driver node across the 5 years
- [x] Every node shows the published numbers it derives from
- [x] Browser E2E test asserts the tree nodes render the correct values from a seeded fact base

## Answer

The tree landed in `src/data/roe-tree.ts` (dataset), `src/components/roe-tree.tsx` (server component), `src/app/roe-tree/page.tsx` (replaced placeholder). Per the ticket-05 decisions: income-statement drilldown (RoE = net income ÷ average equity; left branch revenue → operating expenses → operating income → net income; right branch average equity); pure line nodes only, no derived ratio nodes; the operating-expenses node carries the published cost ratio as a labeled note (a ratio of AUM, not an income-statement line); AUM attaches as context only, never a node. One tree + year selector (2021–25, 2025 default) as URL state (`?year=`, parsed against `trendYears`); drilldown is URL state too (`?node=`, parsed against `roeTreeIds`), opening a node detail (definition, unit, source link, gap reason, 5-year series) with value + Δ vs prior year per node (em dash on gaps — `roeYearDelta` never fabricates a change). All six nodes are explicit `not-published` gaps with provenance (Vanguard publishes no firm-level statements — asset 01); figures never invented. Seam 2 6/6 + Seam 1 roe-tree 4/4 green; full suite 23 unit + 21 E2E.

## Review

Reviewed on both axes with ticket-05 decisions (2026-08-11). No blockers. STANDARDS noted one SHOULD-FIX: `formatNodeValue` re-implements `formatValue`'s unit logic — accepted deliberately: tree nodes carry unit strings, not `MetricId`s, and `formatValue` is keyed by metric; the 5-line local formatter is revisited when peer trees arrive (ticket 17). NITs recorded: `aria-current="true"` on year tabs (benchmarking uses "page"); GAP_SOURCE/GAP_SOURCE_URL duplicated from fact-base's not-published helper (not exported — single-sourcing deferred to a shared provenance constant); `roeYearDelta` returns percentage points for the % root, inert until peer data. Peer-set trees deferred to ticket 17.
