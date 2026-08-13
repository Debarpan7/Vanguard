# Secondary Revenue Backfill

Collected 2026-08-12 for the historical FY2021-FY2025 display layer.

## State Street / SSGA-relevant segment

- Source: [StockAnalysis State Street financials](https://stockanalysis.com/stocks/stt/financials/)
- Source label: `Stock Analysis — State Street financials / Investment Management segment`
- Metric: Investment Management segment revenue, not State Street consolidated revenue or a standalone SSGA filing.
- Currency/unit: USD billions.
- Annual values: FY2021 2.119, FY2022 1.986, FY2023 2.079, FY2024 2.344, FY2025 2.634.
- Verification: `unverified`; the source is a reputable secondary financial-data publisher and the values are display-only.
- Comparability: `display-only-segment`; do not use in audited peer ranking or derived comparisons against consolidated revenue.
- Caveat: State Street Investment Management is used as the SSGA-relevant scope because SSGA is not separately reported as a public issuer.

## Amundi consolidated

- Source: [StockAnalysis Amundi financials](https://stockanalysis.com/quote/epa/AMUN/financials/)
- Source label: `Stock Analysis — Amundi financials`
- Metric: consolidated revenue.
- Currency/unit: EUR billions; no FX conversion applied.
- Annual values: FY2021 3.136044, FY2022 3.055527, FY2023 3.122209, FY2024 3.405853, FY2025 3.341676.
- Verification: `unverified`; the source is a reputable secondary financial-data publisher and the values are display-only.
- Comparability: `display-only-eur-ifrs`; do not compare directly with USD/US-GAAP series without an explicit conversion and qualification.
- Caveat: The secondary page identifies the financial statement mapping as EUR and reports Amundi as an IFRS issuer, but the exact annual-report reconciliation and issuer perimeter still require primary-source review.

## Collection decision

No AUM values were added from the same source pass. The available BlackRock and Invesco KPI extraction exposed only FY2023-FY2025 values, so FY2021-FY2022 were left as gaps rather than extrapolated. A separate partial-series change should preserve those year-specific gaps explicitly.
