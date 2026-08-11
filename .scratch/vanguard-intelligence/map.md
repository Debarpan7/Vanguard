# Map: Vanguard client intelligence site

Label: `wayfinder:map`

## Destination

A working internal-reference website presenting an LLM-produced intelligence analysis of Vanguard — 5-year financial metrics, products & services, competitor benchmarking, RoE tree drilldowns, and RoE comparisons across peer set and industries by line of business — with a live, properly engineered LLM chatbot grounded in the fact base. The analysis answers how Vanguard is faring and where it can improve.

## Notes

- **Domain**: financial services / asset-management industry analysis; an internal-reference web tool for a technology consulting team.
- **Execution is in scope**: this effort carries the build — the site and the analysis — not just decisions.
- **Analysis is LLM-produced**: research loops (deepagents etc.) build the fact base and analysis; public sources only.
- **Hybrid currency**: most data dynamic (quarterly updates), some static; the chatbot is live.
- **5-year trends** (latest fiscal year as the primary view).
- **Improvement lens**: broad business performance, technology one possible lever among many.
- **Comparability caveat**: Vanguard is client-owned (mutual); RoE is computed from published statements, while peers may be listed — the analysis treats this explicitly.
- **Skills to consult**: grilling, domain-modeling, research, prototype, frontend-blueprint / frontend-design (UI), api-and-interface-design, source-driven-development, security-and-hardening (chatbot), observability-and-instrumentation (site ops).
- **Standing preferences**: internal reference only (never client-facing); public data only (no paid sources); proper engineering for the chatbot.
- **Build**: implementation tickets 11–20 derive from the spec (`.scratch/vanguard-intelligence/spec.md`); the design tickets above gate them.

## Decisions so far

<!-- one line per closed ticket: title + gist; detail lives in the ticket -->

## Not yet specified

- **Access control for the internal site** — who may reach it (network-internal vs. restricted); decided as the site ships.

## Out of scope

- Client-facing delivery — the site is internal reference only.
- Paid / premium data sources — public data only.
- Investment advice or regulatory content — the site informs; it doesn't advise.
