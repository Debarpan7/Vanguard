# Context

Glossary for the Vanguard client intelligence effort. Terms resolve here as they crystallize; nothing else lives in this file.

## Terms

- **Vanguard** — the subject firm: a client-owned (mutual) asset manager headquartered in the US. The firm this intelligence site is about. Not publicly traded; publishes no firm-level financial statements (no income statement, balance sheet, or cash-flow statement — verified in `assets/01-vanguard-public-disclosures.md`); publishes headline statistics (AUM through H1 2022, client counts, cost ratios, fund counts, crew) and fund-level financial statements.
- **Client intelligence** — an internal reference knowledge base about a firm, maintained to support a team's understanding of its financial health, competitive position, and improvement opportunities. Internal, not client-facing.
- **Fact base** — the structured collection of Vanguard and peer financial data (5 years, public sources only) that the analysis and site are built on.
- **Metric** — a quantitative measure tracked for Vanguard and its peers (e.g., AUM, number of clients, revenue, expenses, RoE).
- **AUM** — assets under management.
- **Peer set** — the group of firms Vanguard is benchmarked against, defined by membership rules agreed in the peer set decision (recorded in `issues/04-grilling-peer-set.md`): audited financials for the 5-year window (10-K or equivalent, with a documented exception for high-comparability private firms), AUM scale floor, and business-mix overlap (index/ETF + retirement + advice). Current membership: see the decision.
- **Voluntary-data core member** — a peer admitted to the core set without audited firm financials (currently: Fidelity). Every Fidelity metric is labeled voluntary + source + date; Fidelity is excluded from audited-metric comparisons (e.g., RoE) and shown as voluntary side data instead.
- **RoE (Return on Equity)** — net income over equity; the profitability lens for the analysis. Not directly computable for Vanguard from published data (no net income or equity published — verified in `assets/01-vanguard-public-disclosures.md`); the analysis uses an approved proxy (e.g., fund-level advisory fees minus estimated costs), secondary estimates clearly labeled, or a cost-ratio reframing. Market-derived for listed peers; the comparability caveat is part of the analysis.
- **RoE tree** — a decomposition of RoE into driver nodes (DuPont-style: net margin × asset turnover × equity multiplier, drilled through income-statement nodes), shown across the 5 years.
- **Line of business (LoB)** — Vanguard's operating lines (e.g., investment management, retirement, brokerage, advice), defined by the products & services taxonomy.
- **Benchmarking** — comparing Vanguard's metrics against the peer set.
- **Improvement opportunity** — an area where the analysis indicates Vanguard can improve, surfaced for internal reference; the improvement lens is broad business performance, with technology one possible lever among many.
- **Cost ratio** — Vanguard's published expense measure: asset-weighted average US fund expenses as a share of prior-year average net US assets (0.09% 2020–21 → 0.08% 2022–23 → 0.07% 2024–25). Distinct from the 0.06% fund-lineup average cited in 2026 press materials (different measure — compare like-for-like before quoting). One of the 5 headline metrics (decision: ticket 03).
