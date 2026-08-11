# 03 — Grilling: core metric set and definitions

Type: grilling
Status: resolved
Blocked by: 01

## Question

Which metrics does the site track for Vanguard and its peers — the exact list, definitions, units, and the 5-year series each needs?

Ground the conversation in what the Vanguard disclosures research (ticket 01) found is actually published. Decide:
- **Headline set**: AUM, client counts, revenue, expenses, margins, net income, equity, RoE, cost ratios — which are in, which are out.
- **Definitions and units**: precise definitions for each metric (e.g., AUM at period end vs. average; client counts — which client type), units, and how the 5-year series is expressed.
- **Exclusions**: what is deliberately not tracked.

## Answer

Grilled with the user one decision at a time (4 questions); all decisions confirmed.

**Headline set (5 metrics):** AUM · number of clients · cost ratio · revenue · RoE.

**Definitions and units (approved table):**

| Metric | Definition | Unit / as-of | 5-year expression |
|---|---|---|---|
| AUM | Assets under management, period-end | USD trillions | FY2021–FY2025 labels; Vanguard's points are quarter-end as-of dates (Jan 31 '21 $7.2T; Sep 30 '21 $8.0T; Mar 31 '22 $8.1T); FY22–25 "not published" until Form ADV read |
| Number of clients | Number of investors (not accounts), period-end | Millions | 2021–2025; 2023 methodology break noted (30M+ → 50M+); peer availability varies, marked per firm |
| Cost ratio | Vanguard's published definition verbatim: asset-weighted average US fund expenses as share of prior-year average net US assets | % of assets | 0.09% (2020–21) → 0.08% (22–23) → 0.07% (24–25); peers "as disclosed in filings", like-for-like flagged |
| Revenue | Total firm revenue as reported in audited statements (management/advisory fees + other) | USD billions; Amundi EUR→USD at period FX, FX date noted | Vanguard: "not published" gap; peers: 10-K/URD series |
| RoE | Net income ÷ **average equity**, per audited statements | % | Vanguard: labeled proxy, mutual-vs-listed caveat; peers: computed; IFRS-vs-US-GAAP flagged |

**Exclusions (deliberately not tracked):**
1. Paid / premium data — public sources only (standing preference).
2. Live intraday or forecast data — fact base is historical 5-year.
3. Invented figures — Vanguard revenue/expenses/net income/equity are gaps ("not published"), never reconstructed as authoritative; bottom-up proxies only if clearly labeled.
4. Firm-level profitability for Fidelity — audited-metric series (RoE, revenue) excluded from audited comparisons; voluntary side data only (per ticket 04).
5. Non-financial operational detail (client satisfaction, NPS, etc.) — not published, out of scope.
6. Fund-level granularity — only as supporting evidence for firm-level analysis.
7. Peer-side revenue-model extras (Aladdin tech fees, custody/NII) — caveat notes only, not headline series (per ticket 04).

**Coverage floor (guardrail):** any metric *beyond* the agreed headline set must be fillable for Vanguard + ≥2 peers in ≥3 of the 5 years. Applied prospectively only — AUM keeps its documented gap treatment (FY22–25 "not published" until Form ADV is read; floor mirrors ticket 04's scale-floor precedent).

**Supporting fact-base series (not dashboard headline):** peer-side revenue, expenses, net income, equity, margins (RoE + benchmarking inputs from 10-Ks); Vanguard crew and fund counts as supplementary facts.

**Feeds:** ticket 08 (fact base assembly), ticket 12 (metrics dashboard), ticket 14 (benchmarking views).

Verification: no code changed (grilling decision recorded in ticket + map + CONTEXT.md glossary); no test run required for this ticket.
