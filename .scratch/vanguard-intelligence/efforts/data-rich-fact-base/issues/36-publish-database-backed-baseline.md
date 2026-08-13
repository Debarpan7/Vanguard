# 36 — Publish database-backed baseline fact base

**What to build:** Make a validated local database the authoritative source for the facts the site already knows. A consultant sees the current Vanguard values and intentional gaps unchanged, but every displayed observation now has durable source, citation, verification, comparability, and collection-audit records, and the publication gate controls whether a candidate dataset reaches the site.

**Blocked by:** 35 — Expand fact-base access boundary.

**Status:** resolved (commit pending)

- [x] A local-first database stores firms, metric definitions, periods, observations, sources/citations, verification/comparability state, collection runs, and revision history required by the approved domain model.
- [x] The existing source-backed facts and explicit gaps are backfilled, validated, and served to every existing site consumer through the expanded access boundary with no browser-visible regression.
- [x] A candidate dataset cannot replace the active database publication unless the extended fact-base gate passes; a failed candidate leaves the last known-good site data available.

## Resolution

- Added the embedded SQLite schema and typed repository using Node 26 `node:sqlite`.
- Backfilled the 30 current metric/firm series and 150 observations with source, citation, verification, comparability, collection-run, and revision structures.
- Added canonical coverage and provenance validation, durable failed-run status, last-known-good preservation, and staged read-model publication.
- Switched the fact-base boundary to the generated serialized read model; the static TypeScript dataset remains an immutable migration fixture.
- Added `npm run fact-base:generate` and updated the quarterly refresh runbook with backup and rollback guidance.
- Validation: typecheck, lint, 73/73 unit tests, and 35/37 E2E tests passed directly; the remaining 2 E2E cases passed on retry as Chrome teardown-timeout flakes.
