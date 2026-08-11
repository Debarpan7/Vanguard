# 08 — Task: fact base assembly

Type: task
Status: resolved
Blocked by: 03, 04, 05, 06

## Question

Assemble the fact base: collect the actual Vanguard and peer financial data into a structured dataset that matches the decided metric set, peer set, and RoE design.

This is execution — the analysis is LLM-produced, so the agent drives the collection (deepagents / research loops as needed). The work must match every decision made upstream:
- **Vanguard data**: 5 years, from the sources found in 01, per the metric set from 03.
- **Peer data**: same metrics, same years, per the peer set from 04.
- **RoE inputs**: the tree nodes from 05 and the comparison inputs from 06.

Resolved when the fact base is complete and verified. The answer records what was done, data provenance (source per series), the resulting dataset location, and any gaps found — facts later tickets depend on.

## Answer

**Dataset location:** `src/data/fact-base.ts` (single module, typed, per the spec's Seam 2 contract).

**What was assembled:**
- **Types:** `FirmId` (Vanguard + the 5 peers from ticket 04), `MetricId` (the 5 headline metrics from ticket 03), `VerificationTag` (same legend as the research assets), `SeriesPoint` (year, value, as-of, source, source URL, verification, note), `MetricSeries`.
- **Access layer:** `headlineMetrics`, `trendYears` (2021–2025), `metricMeta` (name/unit/definition), `seriesFor(metric, firm)`, `latestPublishedPoint(metric, firm)`; gap helpers `notPublished` and `pendingCollection`.
- **Vanguard series — complete (5 series × 5 years):**
  - AUM: $8.0T (as of Sep 30 2021) / $8.1T (as of Mar 31 2022) / FY2023–25 `not-published` (Form ADV unread), per asset 01.
  - Clients: 30M+ (2021–22) → 50M+ (2023–25), 2023 methodology break noted, per asset 01.
  - Cost ratio: 0.09% (2021) → 0.08% (22–23) → 0.07% (24–25), 2025 note distinguishing the 0.06% press figure, per asset 01.
  - Revenue & RoE: all years `not-published` (Vanguard publishes no firm financials) — recorded as gaps, never invented (ticket 03 exclusion 3).
- **Peer series — structure complete, values pending (5 peers × 5 metrics):** all 25 series exist via `peerSeries()` with `pending-collection` tags and a `peerPrimarySource` map (EDGAR/IR pages per peer from ticket 02/04). No values are fabricated.

**Data provenance:** every Vanguard point carries its public source name, URL (incl. web.archive.org snapshots), verification tag, and as-of date; expected values in the tests come from the independent research asset 01 — never recomputed.

**Verification:** Seam 2 provenance tests `tests/fact-base.spec.ts` — 7/7 pass (`npm run test:unit`); dashboard E2E (ticket 12) green.

**Gaps found (deferred, not lost):**
- **Peer data collection deferred to ticket 17 (analysis pipeline).** Rationale: peer figures must be gathered from primary sources via research loops and anchored to an independent source of truth before provenance tests can assert them; RoE inputs additionally await tickets 05/06 (still open); the dashboard slice (ticket 12) renders Vanguard series only. The structural scaffold is in place so tickets 14/16 can build against the shape.
- **Vanguard AUM FY2023–25:** `not-published` on vanguard.com; Form ADV PDFs recorded but not read (`pdf-not-read`) — reading them is also scoped to the analysis pipeline.

**Feeds:** ticket 12 (consumed now), 14, 16, 17.

## Review (code review, post-resolution)

Two-axis review (standards + spec) surfaced provenance defects; all were re-verified
against the primary sources (Wayback captures of the Vanguard facts-and-figures page)
before fixing.

**Confirmed & fixed — data provenance errors (violated the "every number traces to its
public source" promise):**
- **Clients as-of dates lag the captures by one year.** The Oct-2023 page states
  "50M+ investors, as of December 31, 2022"; the Dec-2024 page "as of December 31,
  2023". The FY2023 point's `asOf` was `2023-12-31` → corrected to `2022-12-31`; the
  FY2024 point's was `2024-12-31` → corrected to `2023-12-31`. FY2022 gained its
  verified `asOf` (`2022-11-30`, per the Dec-2022 capture). Locked by new as-of
  assertions in `tests/fact-base.spec.ts`.
- **Cost-ratio citations pointed at captures showing a different figure.** Verified
  captures: Dec-2022 page shows 0.09% (share of 2021 avg), Oct-2023 page 0.08%
  (share of 2022 avg), Dec-2024/Jan-2025/Mar-2025 pages 0.08% (share of 2023 avg),
  current page 0.07% (share of 2025 avg). The FY2022 point (0.08%) cited the Dec-2022
  capture → re-pointed to the Oct-2023 capture; FY2023 (0.08%) re-pointed to the
  Dec-2024 capture. **FY2024 (0.07%) has no capture documenting the 2024 measure** —
  the value is per asset 01 only; the point now cites the current page with
  verification `unverified` and an explicit note. FY2025 lost its misleading
  period-end `asOf` (annual-average measure → "Fiscal year 2025" label) and gained a
  note flagging the page's "combined mutual fund and ETF expenses" wording change.
- **Stale deferral reference:** `pendingCollection` note and header said "(ticket 08,
  in progress)" → corrected to ticket 17 (analysis pipeline).

**Accepted judgement calls (documented, not changed):** `metricMeta` unit as the single
source of truth (all five Vanguard series now reference it); the `verification` tag
legend shared with the research assets (some variants unused in data); "Not published"
label duplication in the card component.
