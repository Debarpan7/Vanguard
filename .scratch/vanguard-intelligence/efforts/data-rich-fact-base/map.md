# Map: Data-rich competitor fact base

Label: `wayfinder:map`

## Destination

A decision-complete, executable specification for replacing the site’s sparse TypeScript fact base with a local-first, internet-sourced database that becomes the authoritative source for Vanguard and the existing five-peer set. It preserves five fiscal years of comparable financial and operating data, source provenance, collection auditability, and quarterly refresh readiness.

## Notes

- **Domain**: internal financial-services competitor intelligence. The subject firm is Vanguard; the peer set is BlackRock, Fidelity, State Street/SSGA, Invesco, and Amundi.
- **Planning only**: this map resolves decisions and produces the implementation route. Database construction, backfill, and site migration begin only after the route is clear.
- **Coverage direction**: expanded comparable financial and operating metrics, not every public datapoint. The current five dashboard metrics remain in scope, and the exact expanded taxonomy awaits source-coverage research.
- **History and refresh**: retain FY2021–FY2025; design for a quarterly refresh.
- **Evidence policy**: primary company/regulatory sources are preferred. A public aggregator may identify a fact, but publishing requires corroboration from a primary source or a second independent public source.
- **Comparability**: retain published but non-comparable facts with explicit scope, definition, currency, and comparability flags; exclude them from like-for-like defaults rather than silently normalizing them.
- **Record contents**: facts, metric definitions, citations/URLs, extraction and verification timestamps, source quality, and collection-validation audit data.
- **Skills to consult**: grilling, domain-modeling, research, api-and-interface-design, source-driven-development, security-and-hardening, test-driven-development.
- **Tracker conventions**: tickets live in `issues/` as `NN-type-slug.md`; local blocking uses `Blocked by`; claim by setting `Assignee` before work; resolve with an answer, status, and a one-line map pointer.

## Decisions so far

<!-- one line per closed ticket: title + gist; detail lives in the ticket -->

- [Research: public-source coverage for the current peer set](issues/30-research-public-source-coverage.md) — BlackRock and Invesco have audited five-year coverage; Amundi and State Street require scoped extraction/normalization; Vanguard profitability and Fidelity audited financials remain explicit structural gaps.
- [Grilling: canonical metric taxonomy and comparability policy](issues/31-grilling-canonical-metric-taxonomy.md) — Four metric families are canonical under the existing Vanguard-plus-two-peers/three-of-five coverage floor; non-comparable facts are stored and shown with warnings; derived values require compatible inputs and explicit provenance.
- [Grilling: local data-store technology and domain boundary](issues/32-grilling-local-data-store-boundary.md) — SQLite with a typed SQL layer and normalized relational schema; server-side repository plus serialized read model; embedded database file with documented backup/restore (amended from containerized service).
- [Grilling: authoritative fact-base cutover contract](issues/34-grilling-site-cutover-contract.md) — Repository-backed accessor parity, server-serialized chatbot payload, expand/shadow-verify/promote/contract migration, immutable static fixture, last-known-good serving, and published-run data-as-of ownership.
- [Expand fact-base access boundary](issues/35-expand-fact-base-access-boundary.md) — Added a persistence-agnostic boundary and routed all application, library, refresh, and test consumers through it; the static dataset remains the compatibility implementation.
- [Publish database-backed baseline fact base](issues/36-publish-database-backed-baseline.md) — Added the embedded SQLite baseline, typed publication gate, durable audit records, generated serialized read model, and last-known-good candidate behavior.
- [Grilling: ingestion, validation, and quarterly-refresh contract](issues/33-grilling-ingestion-validation-refresh.md) — Source-priority collection, corroborated aggregator leads, review for interpretive facts, deterministic reruns, immutable candidate runs, atomic promotion, strict provenance/scope validation, and rollback to the prior publication.

## Not yet specified

- Which concrete metrics within the four approved families meet the coverage floor after database/source design is settled.
- The concrete extractor implementations, source-specific parsers, and review UI/runbook steps.
- The migration tooling and exact serialized read-model shape for the SQLite repository.
- The observation model for fiscal/calendar periods, currencies, restatements, segment scope, and comparable versus display-only facts.
- The concrete ingestion, validation, review, reconciliation, error-recovery, and quarterly refresh implementation.
- The concrete cutover implementation from `src/data/fact-base.ts`, including repository/read-model code and migration scripts.

## Out of scope

- Expanding the peer set beyond BlackRock, Fidelity, State Street/SSGA, Invesco, and Amundi.
- Paid or premium data sources.
- Forecasts, intraday market data, investment advice, or regulatory advice.
- Retaining source-document binaries in the database; this map covers citations and collection audit data, not a document archive.
- A managed/shared cloud database in this effort; the target is local-first, with hosting reconsidered separately.
