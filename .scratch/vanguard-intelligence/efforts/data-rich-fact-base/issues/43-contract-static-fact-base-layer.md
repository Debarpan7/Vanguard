# 43 — Contract static fact-base migration layer

**What to build:** Complete the expand–contract migration by removing the transitional static production fact base after the quarterly database workflow is proven. A consultant experiences no change in site behavior, but every production metric, source, gap, export, analysis read, and chatbot answer comes from the published database through the stable access boundary.

**Blocked by:** 42 — Operate quarterly fact-base publication workflow.

**Status:** ready-for-agent

- [ ] The production application no longer depends on a static fact collection for live facts; any retained static records are explicitly limited to fixtures or migration evidence.
- [ ] The database publication remains the only authoritative source for site rendering, exports, analysis, chatbot grounding, refresh validation, and data-as-of state.
- [ ] Unit, type, lint, refresh, and production-build browser suites demonstrate that the contracted architecture preserves all existing behavior and newly published competitor coverage.
