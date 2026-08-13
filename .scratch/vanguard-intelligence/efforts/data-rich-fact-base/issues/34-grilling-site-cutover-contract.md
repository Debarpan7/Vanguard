# 34 — Grilling: authoritative fact-base cutover contract

Type: grilling
Status: resolved
Assignee: GitHub Copilot
Blocked by: 32, 33

## Question

How should the existing Next.js site migrate from `src/data/fact-base.ts` to the local database while preserving its public-data, provenance, gap-handling, refresh, and test contracts?

Decide application read boundaries; whether generated read models or direct database reads serve the routes; server/client constraints; migration and backfill sequence; data-as-of ownership; test seams and fixture strategy; performance expectations; deployment behavior; rollback; and the retirement or compatibility role of the current TypeScript dataset.

## Answer

Production uses **repository-backed accessors that preserve the current fact-base API concepts**. Server-rendered routes, exports, refresh validation, analysis, and other consumers read through that boundary; persistence details do not leak into pages or the deterministic engine. The client chatbot receives a minimal validated fact/analysis payload serialized by the server and never opens the database or fetches arbitrary data from a browser API.

Cutover follows **expand, shadow-verify, promote, then contract**. The repository is introduced beside the static dataset, database and static accessor outputs are compared, and promotion requires parity across current accessor outputs, rendered metrics/benchmarking/RoE/export/source/caveat/data-as-of behavior, and existing deterministic chatbot answers. Once the database publication is promoted and the full gate passes, static production reads are removed.

The current TypeScript dataset remains as an immutable migration and regression fixture. It is not a production fallback. If a refresh candidate fails validation, or the active database publication cannot be replaced, the last-known-good published data remains active and publication/deployment fails closed for the new candidate.

The Next.js process opens the local SQLite database file directly; there is no separate database service or readiness dependency. File backup/export and restore remain documented operational requirements. The published-run metadata owns the atomic data-as-of date, which the site shell renders consistently across pages.

Verification: resolved through the interactive decision rounds on 2026-08-13; no application code changed.
