# Map: Key metrics & advisory sections

Label: `wayfinder:map`

## Destination

Two new sections on the Vanguard Intelligence site, built standalone in the existing Next.js app:

- **Key metrics** — an overall-business health table (Vanguard as a composite of its lines — funds, advisory, brokerage, etc.) benchmarked against exactly **BlackRock, State Street/SSGA, and Fidelity**, across the six sketched dimensions (scale & growth, AUM mix by asset class and client type, monetization, profitability, operating productivity, customer experience). **No RoE.** 5-year window where data supports it, at the very least 2025.
- **Advisory** — the advisory business compared across large SEC-registered advisers using **Form ADV data only**: Item 5 (regulatory AUM by client type, client counts, discretionary/non-discretionary split) and Part 2A brochure facts. Vanguard is represented by **Vanguard Advisers Inc (CRD 106715)**, not the whole firm.

Every number in both sections carries its **source(s) and as-of date** under a simple best-effort quality policy: strong sources stand alone, secondary sources need ≥2 independent corroborations, nothing unsourced.

## Notes

- **Domain**: financial-services competitor intelligence; subject firm Vanguard; public sources only.
- **Execution is in scope**: the effort carries the design decisions AND the build of the two sections.
- **Standalone**: does not touch the `data-rich-fact-base` SQLite pipeline or the existing sections; whether to sunset/enrich that effort is deferred (user directive).
- **Evidence policy, simplified** (user directive): "good quality data according to best effort"; plain language — say "source citation", not "provenance".
- **Cadence**: priority 2 — quarterly default aligned with the site, with per-cell as-of dates; not a focus.
- **Skills to consult**: grilling, domain-modeling, research, source-driven-development, test-driven-development, api-and-interface-design, frontend-blueprint / frontend-design (UI).
- **Tracker conventions**: tickets live in `issues/` as `NN-type-slug.md`; local blocking uses `Blocked by`; claim by setting `Assignee` before work; resolve with an answer, status, and a one-line map pointer.

## Decisions so far

<!-- one line per closed ticket: title + gist; detail lives in the ticket -->

- [Research: ADV advisory landscape](issues/45-research-adv-advisory-landscape.md) — peer CRDs verified two ways (IAPD API + SEC bulk CSVs): BlackRock Advisors 106614, PIMCO 104559, J.P. Morgan IM 107038, GSAM 107738; additions Fidelity M&R 108281, Morgan Stanley IM 110353, T. Rowe Price 105496, Capital Research 110885. **Vanguard Advisers Inc 106715 ($300.4B RAUM) is the advice arm**; the repo's SSGA CRD 112861 resolves to the UK entity (inactive) — drop SSGA from the advisory set. Real Item 5 columns: 5D3a (RAUM by client type), 5F2a–f (discretionary/non-discretionary totals), 5.E is compensation checkboxes (not RAUM); `item5F totalAmountUsd` does not exist in SEC data. DateSubmitted ≠ as-of (Item 5 is a fiscal-year-end snapshot — proven with Vanguard's identical 5F2(c) in its Dec-2025 and Mar-2026 filings). Retrieval recipe + 10 comparability caveats in `.scratch/working/adv-advisory-landscape.md`.

## Not yet specified

- The simplified evidence & quality policy's exact display treatment (decide `47-grilling-evidence-and-quality-policy`).
- The final overall-table row set per firm — which rows fill, which compute, which gap (research `44` → decide `48`).
- The advisory table's exact rows and how unstructured Part 2A content is captured (decide `49`; validate with `50`'s generated data).
- The customer-experience metrics — which app/social signals, how sourced (research `46` → decide `52`).
- The build tasks themselves: views, two nav entries, per-section data-as-of, refresh-gate extension, tests (graduate after the grilling tickets above).
- Whether a single weak source may ever be shown as low-confidence context, or hidden (decide `47`).
- `data-rich-fact-base` sunset/enrich (explicitly deferred by the user).

## Out of scope

- RoE — not tracked in this effort (user directive).
- Invesco and Amundi columns — excluded from the overall table (user directive).
- Changes to existing sections' data policy or data — this effort's policy applies to the two new sections only.
- Changes to the `data-rich-fact-base` pipeline (standalone; sunset/enrich deferred).
- Investment advice, regulatory content, client-facing delivery — site-wide standing rules.
