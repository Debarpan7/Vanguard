# 37 — Publish audited BlackRock and Invesco competitor series

**What to build:** Populate the authoritative fact base with verified FY2021–FY2025 audited financial and operating observations for BlackRock and Invesco. A consultant can compare their available metrics with Vanguard in the site, export the visible values, and receive grounded chatbot answers, each retaining filing-level provenance and relevant comparison caveats.

**Blocked by:** 36 — Publish database-backed baseline fact base.

**Status:** resolved

- [x] The collected BlackRock and Invesco observations are tied to the correct consolidated annual-report/filing evidence, reporting period, unit, scope, and verification state.
- [x] The publication gate accepts only source-backed, internally consistent observations and rejects incomplete or contradictory candidate series without altering published data.
- [x] Benchmarking, exports, and deterministic chatbot retrieval expose the newly published values with source links and preserve explicit gaps where a metric is not supportable.

## Resolution

- Published FY2021-FY2025 consolidated revenue and calculated RoE for BlackRock and Invesco from SEC 10-K filing evidence, including BlackRock's 2024 registrant rename and filing-level URLs.
- Kept AUM, clients, and cost-ratio as explicit `pending-collection` gaps for both firms; no unsupported operating values were inferred.
- Added focused provenance/value tests and updated the prior all-peers-pending assertions to distinguish verified audited metrics from remaining gaps.
- Regenerated `data/fact-base.sqlite` and `src/data/fact-base-read-model.json` through the existing atomic publication path.
- Validation: focused affected tests 21/21, full unit suite 74/74, typecheck, lint, and production build passed; all 37 E2E assertions passed, with three retry-passing Chromium teardown flakes.
