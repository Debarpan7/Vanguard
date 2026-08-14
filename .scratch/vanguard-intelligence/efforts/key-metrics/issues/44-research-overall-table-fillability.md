# Research: overall-table fillability and sketch verification

## Question

For the "Key metrics" overall-business table (columns: Vanguard, BlackRock, State Street/SSGA, Fidelity; dimensions: scale & growth, AUM mix by asset class and client type, monetization, profitability, operating productivity, customer experience):

1. Which rows can be filled from primary/strong sources per firm — and which must stay explicit gaps?
2. Do the sketched numbers verify against 10-K / IAPD / other primary sources (e.g., Vanguard AUM 11,092 vs. the repo fact base's ADV figure ≈ $10.25T; BlackRock AUM 14,038 vs. ~$12T reported; State Street revenue 14 vs. the $2.634B segment figure; Fidelity AUM 7,100)?
3. For Vanguard specifically: which rows have no primary source and therefore need web-scoured, corroborated secondary sourcing (media, interviews, third-party trackers)?

**Status:** complete (research subagent reported 2026-08-14)
**Report:** `.scratch/working/key-metrics-fillability.md`

## Answer

- **Sketch verified per-cell** (43-row verification table in the report, each with source URL + date + verdict). Highlights: Vanguard AUM 11,092 = the Form ADV **2026 annual amendment** (CRD 105958, filed 2026-03-30, Item 5.F.2.c = $11,092,665,107,962) — a newer filing than the repo's 2025 point ($10.2466T), an addition not a contradiction, must keep `display-only-regulatory-aum`; BlackRock's column fully verifies against the FY2025 10-K + Q4 2025 release (14,038 is a rounding artifact of the exact $14,041,518M; revenue 24 = $24,216M; flows 698; growth 19% — note "~$11.98T" is unsupported, BlackRock reported ~$14.0T at Dec 31, 2025); State Street AUM 5,665 / AUA 53,800 +16% verify (10-K Table 6 + Q4 release), **but "Revenue 14" is parent consolidated — conflicts with the repo's SSGA-segment $2.634B (scope decision required)**, and 180-vs-181 is a minor flow rounding; Fidelity 7,100 = voluntary 2025 annual-results disclosure (AUM $7.1T, revenue $37.7B +15%), definition-sensitive ($6.8T discretionary as of Sep 30, 2025 on its own about page), press-traced, no audited statements.
- **Fillability map** (row family × firm, P/V/S/G + 5y/1y): only AUM (P/P/P/V) and customer-experience (all S) are fillable for all four firms; flows, AUM mix, revenue, revenue mix, profitability are firm-dependent; profitability/productivity are NOT comparable across the set (Vanguard and Fidelity have no corporate income statements; State Street's are parent-scope). A truthful table must carry per-cell scope flags or explicit gaps.
- **Vanguard specifics**: primary firm-level data = Form ADV regulatory AUM (the only current firm AUM) + facts-and-figures operating facts; flows, AUM mix, and revenue have NO first-party source → web-scoured, triangulated secondary only.
- **15 numbered risks** in the report (rounding artifacts, scope conflicts, presentation changes, definition sensitivity, cross-firm flow scopes, gaps-not-zeros for the sketch's 0.0% cells, etc.) — ticket 48 must resolve each before display.
