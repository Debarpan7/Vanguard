# 32 — Grilling: local data-store technology and domain boundary

Type: grilling
Status: resolved
Assignee: GitHub Copilot
Blocked by: 31

## Question

What local-first database technology, schema boundary, and migration approach should hold the canonical metric observations and provenance audit trail before the site uses it as its authoritative fact base?

Decide the engine and file location; schema ownership; identifiers for firms, metrics, periods, observations, sources, citations, collection runs, verification events, and revisions/restatements; repository and deployment constraints; access API boundary for Next.js; migration strategy; backups; and the criteria that would justify a future managed/shared database. The answer must support the canonical taxonomy and comparability states decided in the preceding ticket.

## Answer

Use **SQLite with a typed SQL layer** as the local-first authoritative store. The schema is a normalized relational model with separate identities and relationships for firms, metrics, reporting periods, observations, sources/citations, collection runs, verification/review events, and revisions/restatements. Relational constraints and uniqueness rules protect one canonical observation from silent duplication.

The Next.js application reads through a server-side typed repository. Client-side features, including the deterministic chatbot, receive only a serialized read model or explicitly shaped data required for their interaction; no client code receives database credentials or arbitrary query access. Existing fact-base accessors remain the compatibility boundary during migration.

Run SQLite as a containerized local service with a persistent volume. Document volume backup/restore and database export as part of the refresh/runbook work. Managed/shared hosting is deferred to a future decision, triggered by collaboration needs, scale, backup/recovery requirements, or deployment constraints that exceed the local service boundary.

Verification: resolved through the interactive decision round on 2026-08-13; no application code changed.
