# Task: extend the ADV collection pipeline to peer CRDs

## Question

Extend the repo's existing SEC Form ADV machinery so the advisory section's data can be generated for the full set.

- `scripts/generate-adv-timeseries.mjs` matches by CRD (`1E1`) across history — add the peer CRDs as `historicalTargets`: Vanguard Advisers 106715, BlackRock Advisors 106614, PIMCO 104559, J.P. Morgan IM 107038, GSAM 107738, Fidelity M&R 108281, Morgan Stanley IM 110353, T. Rowe Price 105496, Capital Research 110885.
- Fix the field mapping: use 5D1a / 5D3a / 5F2a–f (the `item5F totalAmountUsd` name does not exist in SEC data — research 45).
- Handle the annual-amendment-in-Q1 cadence: `generate-adv-raw.mjs` matches by firm name in a single month and is brittle for peers that file only in Q1.
- Preserve the as-of-vs-submission-date distinction (Item 5 is a fiscal-year-end snapshot).

Unblocks validating ticket 49 with real data.

**Status:** complete (commits `cb01489` + review follow-up)

## Answer

- **historicalTargets extended** with the full advisory peer set in `scripts/adv-timeseries-lib.mjs` (commit `cb01489`); shared `rawTargets` registry + `matchRawTarget` (CRD-first via `1E1`, exact-name fallback) and `selectBestRawFiling` (annual updating amendment beats same-month other-than-annual; latest submission date otherwise). SSGA CRD 112861 documented as the UK entity — excluded from the advisory set, name-only in the raw registry.
- **Field mapping**: already correct at base (`5D1a`/`5D3a`/`5F2a–f`); the `item5F totalAmountUsd` naming does not exist in any SEC data (research 45 §3.2) — no code change needed, documented.
- **Q1 cadence**: `generate-adv-raw.mjs` now parameterized (`ADV_ARCHIVE_START`/`ADV_ARCHIVE_END`), CRD-first matching, and an optional `ADV_Filing_Types` join records filing type + `fiscalYearAsOf` (loud `console.warn` when the table is absent). Output keyed by archive year (`adv-{year}.json`).
- **As-of vs submission**: verified against the real SEC March-2026 archive — Vanguard Group's annual amendment (FilingID 2070614, FY2025) carries $11,092,665,107,962, superseding the same-month other-than-annual's stale $10,246,596,045,633 (research 45's Vanguard literals were the Dec-2025 values; the annual-amendment figures match research 44). Advisory peers collected with RAUM literals matching research 45 (PIMCO $3.67T, JPM $3.52T, GSAM $2.65T, FMR $5.69T, MSIM $702B, TROW $2.20T, Capital $3.75T). Committed artifacts: `data/adviserinfo/adv-2026.json/.xlsx` (March-2026 snapshot).
- **Known limits (by design)**: single-month snapshots (a Feb and Mar run in the same year overwrite `adv-{year}.json` — run the archive month matching the peers' filing window); Capital Research files only other-than-annual in March (June FYE) so its `fiscalYearAsOf` is null — the per-cell as-of discipline must show that; the historical series still keys `filingYear` by submission year (the 2011–2024 archive has no filing-types table); duplicate `firm: "fidelity"` brand key (two registered advisers) — advisory rows must key by CRD.
- **Tests**: `tests/adviserinfo-peer-pipeline.spec.ts` (registry, CRD-first matching, best-filing selection) + `tests/adviserinfo-2026.spec.ts` (verified RAUM literals, fiscal-year as-of, explicit gaps). Unit suite 104 green; E2E 37 green (three stale 2023-AUM expectations in e2e/ fixed in the follow-up — `eaf69c3` data-change fallout, unrelated to this ticket's code).
- **Review**: both axes clean (Standards: 0 hard violations, 5 judgement-call smells — worst: the dual target-registry duplication, acceptable by design and documented; Spec: partial-per-req-3/4 notes addressed above, scope-creep notes on committed artifacts defended as repo convention).
