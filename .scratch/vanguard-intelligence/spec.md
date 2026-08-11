# Spec: Vanguard client intelligence website

Status: ready-for-agent
Type: spec

## Problem Statement

Our team needs to understand how Vanguard is faring and where it can improve — its financial health, competitive position, and improvement opportunities — to support client conversations and internal thinking. That understanding is scattered across public documents: Vanguard's annual report and key statistics, peers' annual filings, fund pages, and press releases. Every metric, benchmark, and comparison has to be gathered and re-derived by hand each time it's needed, comparisons get drawn inconsistently across people, and insights are hard to trace back to a source.

## Solution

An internal-reference website that presents an LLM-produced intelligence analysis of Vanguard, built on a sourced fact base:

- **Current financial metrics** — AUM, number of clients, revenue, expenses, RoE, and related metrics — each with a 5-year trend.
- **Products & services** — a catalog of Vanguard's offerings (funds, ETFs, retirement, brokerage, advice, institutional).
- **Competitor benchmarking** — each metric compared against the peer set.
- **RoE tree drilldowns** — Return on Equity decomposed into its drivers, shown across the 5 years.
- **RoE comparisons** — Vanguard's RoE vs. the peer set, and line-of-business RoE vs. relevant industries.
- **A live LLM chatbot** grounded in the fact base, answering questions about the metrics, comparisons, and analysis with sources.
- **Improvement reads** — where the analysis indicates Vanguard can improve, surfaced for internal reference.

Every number traces to its public source; every comparison carries the mutual-vs-listed ownership caveat. The site answers "how is Vanguard faring" and "where can it improve", and is refreshed on a quarterly cadence.

## User Stories

1. As a consultant, I want a dashboard showing Vanguard's headline metrics (AUM, number of clients, revenue, RoE) at a glance, so that I can grasp the firm's current position quickly.
2. As a consultant, I want a 5-year trend for every metric, so that I can judge trajectory rather than a single-year snapshot.
3. As a consultant, I want each metric precisely defined (units, period-end vs. average, client-type scope), so that I don't misinterpret a number.
4. As a consultant, I want to see the source and year coverage for every metric, so that I can verify any number on the site.
5. As a consultant, I want a products & services catalog covering Vanguard's lines of business, so that I understand what the firm offers.
6. As a consultant, I want each metric benchmarked against the peer set, so that I can gauge Vanguard's relative position.
7. As a consultant, I want the peer set and its membership rules stated, so that I can trust the comparison.
8. As a consultant, I want an RoE tree that decomposes RoE into its drivers, so that I can see what drives the firm's profitability.
9. As a consultant, I want the RoE tree shown across the 5 years, so that I can see which driver changed when.
10. As a consultant, I want each RoE tree node traceable to the published numbers it comes from, so that I can verify the decomposition.
11. As a consultant, I want Vanguard's RoE compared against the peer set over the 5 years, so that I can see profitability relative to competitors.
12. As a consultant, I want the mutual (client-owned) vs. listed ownership caveat displayed wherever RoE is compared, so that I don't over-interpret the comparison.
13. As a consultant, I want RoE compared by line of business, so that I can see where value is created and where it isn't.
14. As a consultant, I want the line-of-business RoE derivation disclosed (proxies, disclosures, or explicit limitations), so that I know what the segment numbers can and cannot support.
15. As a consultant, I want each line of business benchmarked against the industry it competes in, so that I can see Vanguard's position within each industry.
16. As a consultant, I want to drill from a comparison view into the underlying data, so that I can follow the comparison to its facts.
17. As a consultant, I want a live chatbot that answers questions about the metrics, benchmarking, RoE analysis, and improvement reads, so that I can interrogate the fact base conversationally.
18. As a consultant, I want chatbot answers grounded in the fact base and citing their sources, so that I can trust and verify them.
19. As a consultant, I want the chatbot to decline questions outside the fact base and avoid giving investment or regulatory advice, so that it doesn't hallucinate or mislead.
20. As a consultant, I want the site to surface named improvement opportunities, so that the analysis supports how we position our work with the firm.
21. As a consultant, I want improvement opportunities connected to the metrics behind them, so that I can see the evidence for each read.
22. As a consultant, I want an LLM-produced narrative ("how is Vanguard faring"), so that I get a synthesized read rather than raw numbers.
23. As a consultant, I want the fact base and analysis refreshed on a quarterly cadence, so that the site stays current.
24. As a consultant, I want the data caveats visible — disclosure gaps, segment-RoE limits, comparability limits — so that I know the bounds of the analysis.
25. As a consultant, I want to search and filter the metric, benchmarking, and comparison views, so that I can find what I need fast.
26. As a consultant, I want to export a view (e.g., a metric table as CSV), so that I can use the numbers in other work.
27. As a consultant, I want a stable link per view, so that I can share a finding with a colleague.
28. As a consultant, I want the site usable in a meeting on a projector or laptop, so that the views work for discussions.
29. As a consultant, I want the site clearly internal-reference only, so that nothing on it is mistaken for client-facing material.
30. As a consultant, I want an explanation of what the site is and how to read it, so that a first-time user can orient quickly.
31. As a consultant, I want to know when the underlying data was last refreshed, so that I can judge how current the analysis is.
32. As a consultant, I want the analysis's improvement lens stated — broad business performance, technology one possible lever among many — so that I read the opportunities in the right frame.

## Implementation Decisions

Decided:

- **Product form**: an internal-reference website that presents an LLM-produced analysis; hybrid currency — most data dynamic (quarterly refresh), some content static, the chatbot live.
- **Data**: public sources only; a 5-year window with the latest fiscal year as the primary view; the fact base is a structured dataset with per-series provenance (source, value, year coverage).
- **Analysis**: produced by LLM research loops (deepagents and similar); refreshable on the same quarterly cadence; framed around how Vanguard is faring and where it can improve, with broad business performance as the improvement lens.
- **Comparability**: Vanguard is client-owned (mutual); peers may be listed. The ownership caveat is surfaced wherever RoE is compared, and segment-level RoE is derived transparently (proxies or explicit limitations) — never invented.
- **Chatbot**: live, grounded in the fact base with source citation and refusal behavior; engineered to proper standards (retrieval/grounding, hallucination controls) as an internal service.
- **Audience**: internal reference only — never client-facing.

Deferred to the wayfinder map (resolved by tickets, referenced by name — this spec records the decisions, it doesn't make them):

- The exact core metric set and definitions — resolved by "03 — Grilling: core metric set and definitions".
- The peer set and its membership rules — resolved by "04 — Grilling: peer set selection".
- The RoE tree decomposition shape and nodes — resolved by "05 — Grilling: RoE tree decomposition design".
- The RoE comparison design (peer set, line of business, industry basis) — resolved by "06 — Grilling: RoE comparison across peer set, industries, and lines of business".
- The products & services taxonomy and line-of-business model — resolved by "07 — Grilling: products & services and LoB taxonomy".
- The chatbot's scope and engineering specifics — resolved by "09 — Grilling: chatbot scope and engineering".
- The site's structure and views — resolved by "10 — Prototype: site structure and views".
- Tech stack, hosting, fact base schema, quarterly refresh mechanism, and improvement-read design — still fog on the map's "Not yet specified"; they graduate as the tickets above resolve.

## Testing Decisions

A good test asserts only external behavior a user can observe: a view displays the correct value for a known fact base data point, a drilldown behaves as specified, the chatbot answers a known query with the correct grounded source. Tests never reach into implementation details.

Two seams:

- **Seam 1 — the website's public interface** (browser E2E). With a seeded fact base, every view — dashboard, metrics, products & services, benchmarking, RoE tree, RoE comparisons — renders the correct values; the RoE tree drilldown behaves across the years; the chatbot answers known queries grounded in the fact base with the correct sources and refuses out-of-fact-base or advice questions. The correctness of the analysis is asserted through what the site displays, since the site is its only consumer.
- **Seam 2 — the fact base provenance**. Direct tests over the fact base asserting each series traces to its public source with the correct value and year coverage — guarding the "garbage in, garbage out" risk at the source, before data reaches the site.

Modules tested: the fact base (provenance), the presentation layer (rendered values), and the chatbot (grounded answers and refusal behavior).

Prior art: none — the repo is greenfield and has no tests yet. The browser E2E pattern (Playwright-style) is the established prior art this effort adopts for Seam 1.

## Out of Scope

- Client-facing delivery — the site is internal reference only.
- Paid / premium data sources — public data only.
- Investment advice, regulatory content, or anything a user could mistake for advice to investors.
- Live intraday or real-time market data, and forecasting — the fact base is historical 5-year data.
- Invented segment data: where Vanguard doesn't disclose (e.g., line-of-business RoE), the analysis uses disclosed proxies or states the limitation — it never fabricates numbers.
- The wayfinder decisions themselves (core metric set, peer set, RoE tree shape, comparison design, chatbot engineering, tech stack) — resolved through the map's tickets, not by this spec.

## Further Notes

- This spec is the product-level consolidation of the wayfinder map "Vanguard client intelligence site" (`.scratch/vanguard-intelligence/map.md`). Open decisions resolve through the map's tickets, referenced by name above.
- The quarterly refresh touches data collection → fact base → re-analysis → site.
- Vocabulary follows `CONTEXT.md` (fact base, peer set, RoE, RoE tree, line of business, benchmarking, improvement opportunity, metric, AUM).
- The analysis runs through LLM research loops (deepagents); the chatbot is a separate live service grounded in the fact base.
