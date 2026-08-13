# 40 — Publish Vanguard regulatory AUM coverage

**What to build:** Use verified historical Vanguard Form ADV evidence to publish supportable post-2022 regulatory AUM observations. A consultant can see a fuller Vanguard AUM series with exact as-of dates and regulatory scope, while corporate revenue, profitability, and equity remain unmistakably unavailable rather than inferred from adviser or fund data.

**Blocked by:** 36 — Publish database-backed baseline fact base.

**Status:** resolved

- [x] Historical Form ADV observations are published only after the filing date, reported AUM definition, regulatory scope, and as-of date have been verified and recorded.
- [x] The publication gate rejects an AUM observation that lacks a valid adviser-source citation or that misrepresents regulatory AUM as a corporate financial-statement fact.
- [x] Metrics, benchmarking, exports, and chatbot answers render the approved AUM coverage with its qualification while maintaining explicit Vanguard profitability and equity gaps.

Implementation: historical CRD 105958 observations from the official SEC Form ADV archive now feed the canonical AUM seed for FY2023-FY2024; the existing FY2025 IAPD point remains in place. Historical filing dates are normalized to ISO and explicitly documented as observation dates because the archive does not expose a separate AUM valuation date. Generated SQLite/read-model artifacts were refreshed by `npm run fact-base:generate`.
