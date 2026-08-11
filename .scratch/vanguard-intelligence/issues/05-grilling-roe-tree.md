# 05 — Grilling: RoE tree decomposition design

Type: grilling
Status: resolved
Blocked by: 01, 03

## Question

What is the RoE tree — how does Return on Equity decompose into its drivers, and how does it render across the 5 years?

Decide, grounded in what the disclosures research (01) and the core metric set (03) make available:
- **Decomposition shape**: DuPont-style (net margin × asset turnover × equity multiplier) or an income-statement drilldown (revenue → costs → operating income → net income → RoE), or a blend.
- **Nodes**: exactly which nodes exist at each level of the tree, and where Vanguard's published statements supply each number.
- **Evolution**: how the tree shows change across the 5 years (which node drove RoE up/down when).

## Answer

Grilled with the user one decision at a time (3 questions); all decisions confirmed.

**Decomposition shape (Q1) — income-statement drilldown, not DuPont:**

- RoE = **Net income ÷ average equity** (root; labeled proxy for Vanguard with the mutual-vs-listed caveat).
- Left branch: revenue → operating expenses → operating income → net income.
- Right branch: average equity.
- Rationale: every node is a published 10-K line for listed peers (fillable + traceable) and an honest "not published" gap for Vanguard, which publishes no firm-level statements (asset 01). DuPont's ratio nodes (asset turnover, equity multiplier) have no Vanguard analogue — no firm balance sheet is published — so they would be invented for Vanguard.

**Nodes (Q2) — pure line nodes:**

- Nodes: RoE (root) → revenue, operating expenses, operating income, net income (left branch) + average equity (right branch).
- Every node traceable to the published number it derives from (a 10-K line for peers; an explicit gap for Vanguard).
- The operating-expenses node carries Vanguard's published cost ratio as a clearly labeled note — a ratio of AUM (0.09% FY2021 → 0.08% FY2022–23 → 0.07% FY2024–25), **not an income-statement line**.
- AUM attaches as context only, never as a node.
- Drilldown opens a node detail: definition, source, gap reason, 5-year series.

**Evolution (Q3) — one tree + year selector:**

- One tree, year selector (2021–2025), latest fiscal year as the default (2025) — matching the site's "5-year window, latest fiscal year as primary view" pattern.
- Each node shows its value + Δ vs prior year; the node detail shows the full 5-year series.
- Today every Vanguard node is a gap in every year, so the selector renders the structure honestly; it becomes meaningful when peer trees arrive (ticket 17).

**Feeds:** ticket 15 (RoE tree drilldown), ticket 16 (RoE comparison views — also blocked by 06).

## Review

Reviewed with the ticket-15 implementation (2026-08-11): shape, node set, and evolution implemented exactly as decided — `/roe-tree` renders the income-statement drilldown with a year selector (2025 default), explicit `not-published` nodes with provenance, the cost-ratio note on the operating-expenses node, AUM attached as context, and per-node drilldown (definition, unit, source link, gap reason, 5-year series). Verified by the ticket-15 Seam 2 + Seam 1 test suites and the two-axis review. No code changed by this ticket itself (grilling decision recorded in ticket + map + CONTEXT.md glossary).
