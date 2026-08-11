# 01 — Research: Vanguard's public financial disclosures

Type: research
Status: resolved
Blocked by:

## Question

What financial data does Vanguard publish publicly, and what is the 5-year coverage (latest fiscal year back ~5 years)?

Identify and document:
- **Sources**: annual report, financial statements, key statistics, press releases, fund pages, any investor/statistics pages.
- **Metrics disclosed**: AUM, number of clients, revenue by source (e.g., management and administrative fees), expenses, net income, equity, cost ratios — with each metric's source and year coverage.
- **Gaps**: what is *not* published — segment / line-of-business profitability, technology spend, client-owned equity treatment, anything the map's RoE analysis would need.

Produce a markdown summary as a linked asset: one row per metric — metric, source, years available, notes. This ticket grounds the core metric set decision, so precision on gaps matters more than completeness of prose.

**Linked asset:** `../assets/01-vanguard-public-disclosures.md`

## Answer

Research completed against primary sources (Vanguard corporate pages incl. Wayback captures 2021–2026, press releases, SEC IAPD/EDGAR); full deliverable in the linked asset with per-claim verification tags.

Key findings:

- **Vanguard publishes no firm-level financial statements** — it is client-owned (mutual), files no 10-K, and has no IR section; the vehicle for regulatory firm-level AUM is Form ADV on SEC IAPD.
- **Published and 5-year covered:** cost ratios (0.09%→0.07% US asset-weighted avg, 2020–2025, with a 0.06% lineup definition on 2026 pages — flag before quoting), client/investor counts (2021–2025, ⚠️ 30M+→50M+ methodology break in 2023), fund counts, crew, ownership structure.
- **AUM:** published on vanguard.com only through Mar 31, 2022 (~$8.1T); FY2022–FY2025 AUM is unpublished on vanguard.com — must come from Form ADV (PDF, not machine-readable this session; follow-up for ticket 03) or clearly-labeled secondary estimates.
- **Not published (gaps):** revenue by source, firm expenses, net income, equity/retained earnings; segment/LoB profitability; technology spend (qualitative "multibillion-dollar" only); client-owned equity mechanics.
- **Implication for RoE (tickets 05/06):** RoE = net income ÷ equity **cannot be computed from published data**; RoE work must use a proxy (e.g., fund-level advisory fees − estimated costs), secondary estimates (marked), or be reframed as cost-ratio analysis.

Verification: `npm run test:e2e` → 3 passed (commit `64854e8`; markdown-only change, one flake on the About test during the first run, green on re-run).
