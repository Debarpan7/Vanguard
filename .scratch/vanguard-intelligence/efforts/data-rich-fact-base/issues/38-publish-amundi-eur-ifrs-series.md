# 38 — Publish Amundi EUR/IFRS competitor series

**What to build:** Publish verified FY2021–FY2025 Amundi annual-report facts in the authoritative fact base. A consultant can inspect available Amundi metrics with regulated-report provenance while the website keeps EUR/IFRS basis and issuer scope visible and prevents a silent conversion or like-for-like comparison that has not been approved.

**Blocked by:** 36 — Publish database-backed baseline fact base.

**Status:** in-progress

- [ ] Each published Amundi observation traces to a reviewed FY2021–FY2025 regulated annual report or corroborating public evidence and retains its reported unit, currency, accounting basis, period, and issuer scope.
- [x] The publication gate rejects an Amundi observation missing the required source, scope, EUR/IFRS metadata, or regulated EUR/IFRS display-only comparability classification.
- [x] The relevant site views, exports, and chatbot answers make available Amundi facts and their comparison qualification observable without changing other firms' data.

## Implementation note

The authoritative fact base now publishes the FY2021–FY2025 Amundi consolidated revenue slice from the collected Stock Analysis corroborating source in EUR billions. Each point remains `unverified`, retains Amundi consolidated scope and IFRS metadata, and is classified `display-only-eur-ifrs`; no FX conversion or US-GAAP comparison is applied. Direct review of the five official URDs/annual financial reports is still required before these observations can be upgraded to verified regulated-report facts.
