# 36 — Publish database-backed baseline fact base

**What to build:** Make a validated local database the authoritative source for the facts the site already knows. A consultant sees the current Vanguard values and intentional gaps unchanged, but every displayed observation now has durable source, citation, verification, comparability, and collection-audit records, and the publication gate controls whether a candidate dataset reaches the site.

**Blocked by:** 35 — Expand fact-base access boundary.

**Status:** ready-for-agent

- [ ] A local-first database stores firms, metric definitions, periods, observations, sources/citations, verification/comparability state, collection runs, and revision history required by the approved domain model.
- [ ] The existing source-backed facts and explicit gaps are backfilled, validated, and served to every existing site consumer through the expanded access boundary with no browser-visible regression.
- [ ] A candidate dataset cannot replace the active database publication unless the extended fact-base gate passes; a failed candidate leaves the last known-good site data available.
