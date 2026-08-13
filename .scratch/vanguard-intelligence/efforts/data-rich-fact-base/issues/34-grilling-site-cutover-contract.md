# 34 — Grilling: authoritative fact-base cutover contract

Type: grilling
Status: open
Assignee:
Blocked by: 32, 33

## Question

How should the existing Next.js site migrate from `src/data/fact-base.ts` to the local database while preserving its public-data, provenance, gap-handling, refresh, and test contracts?

Decide application read boundaries; whether generated read models or direct database reads serve the routes; server/client constraints; migration and backfill sequence; data-as-of ownership; test seams and fixture strategy; performance expectations; deployment behavior; rollback; and the retirement or compatibility role of the current TypeScript dataset.
