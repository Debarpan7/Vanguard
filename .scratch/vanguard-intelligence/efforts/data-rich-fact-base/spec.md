# Spec: Data-rich competitor fact base

Status: ready-for-agent
Label: `ready-for-agent`
Type: spec

## Problem Statement

The Vanguard Intelligence website currently renders a sparse, static TypeScript fact base. The five existing headline metrics are structurally present for Vanguard and the peer set, but peer observations are largely `pending-collection`, data cannot be collected or reviewed as durable records, and new public facts must be hand-coded into the application. This prevents the internal team from using the website as a data-rich competitor intelligence reference and makes quarterly maintenance, source review, comparability control, correction handling, and the site's data-as-of signal difficult to operate reliably.

The team needs a local-first, internet-sourced authoritative fact base for Vanguard and the existing peer set: BlackRock, Fidelity, State Street/SSGA, Invesco, and Amundi. It must retain five fiscal years of public financial and operating facts without overstating cross-firm comparability or inventing values where Vanguard or Fidelity do not publish them.

## Solution

Replace the sparse static fact base with a local-first database and collection workflow that becomes the website's authoritative source of facts. The database will retain FY2021–FY2025 observations and the metadata needed to trust, inspect, refresh, correct, and present each one:

- **A defensible source-backed observation model** for firms, metrics, periods, observations, definitions, citations, source quality, verification, collection runs, and revisions.
- **Expanded comparable financial and operating coverage** beyond the current five dashboard metrics, selected from what the current peer set can actually support with public evidence.
- **Explicit comparability handling** for mutual, private, listed, parent, segment, voluntary, US-GAAP, and IFRS data. A fact may be stored with its qualifications even when it is excluded from like-for-like default comparisons.
- **Internet-source collection with audit controls**: primary regulatory/company sources are preferred for audited and comparable facts. Reputable secondary and aggregator sources may publish as explicitly `unverified` display/context facts when their URL, retrieval date, period, definition, scope, and caveats are retained; they require review before supporting derived metrics or audited comparisons.
- **A quarterly refresh contract** that extracts, validates, reviews, publishes, stamps data-as-of, and supports rollback without weakening the existing rule that gaps stay gaps.
- **A controlled site cutover** that preserves current values, source links, gap labels, chatbot grounding, export behavior, and browser-visible data-as-of behavior while making database-backed facts the authoritative source.

## User Stories

1. As a consultant, I want the website to show populated competitor facts where public evidence exists, so that benchmarking is useful rather than mostly marked pending collection.
2. As a consultant, I want the peer set to remain Vanguard, BlackRock, Fidelity, State Street/SSGA, Invesco, and Amundi, so that new data preserves the comparison boundary I already use.
3. As a consultant, I want the fact base to retain FY2021–FY2025, so that comparisons share the current five-year analysis window.
4. As a consultant, I want each observation to identify its firm, metric, period, unit, scope, and definition, so that I can interpret a value correctly.
5. As a consultant, I want each observation to link to its public evidence, so that I can inspect the source before relying on a number.
6. As a consultant, I want each fact to display when the underlying source reported it and when it was collected, so that I can distinguish economic period, publication timing, and refresh timing.
7. As a consultant, I want the fact base to preserve an exact source citation such as filing, report, table, or page where available, so that review does not depend on a vague URL.
8. As a consultant, I want primary regulatory and issuer evidence used by default, so that the fact base is defensible in internal discussions.
9. As a consultant, I want an aggregator-sourced lead labeled `unverified` and excluded from audited comparisons unless corroborated, so that broader coverage never becomes falsely authoritative evidence.
10. As a consultant, I want the fact base to retain a source-quality and verification state, so that I can distinguish audited, regulated, issuer-published, voluntary, corroborated, and unavailable facts.
11. As a consultant, I want a value that cannot be found to remain an explicit gap, so that the site never implies a number that is not publicly supported.
12. As a consultant, I want Vanguard corporate revenue, profitability, and equity to remain explicit gaps when unavailable, so that fund-level data is never misrepresented as a Vanguard firm financial statement.
13. As a consultant, I want Fidelity financial profitability and equity to remain voluntary-side-data gaps where audited company figures are unavailable, so that private-company limitations remain visible.
14. As a consultant, I want Fidelity operating facts to be labelled voluntary and dated, so that I can use them as context without treating them as audited comparables.
15. As a consultant, I want State Street parent observations labelled as parent scope, so that custody, servicing, and bank economics are not silently presented as SSGA performance.
16. As a consultant, I want Investment Management segment facts labelled as segment scope and reconciled where possible, so that SSGA-relevant information is useful without suggesting a standalone financial statement.
17. As a consultant, I want Amundi observations to retain EUR and IFRS basis where reported, so that currency conversion and accounting differences are never hidden.
18. As a consultant, I want non-comparable facts stored with explicit flags, so that I can inspect the available evidence even when a dashboard excludes it from a like-for-like view.
19. As a consultant, I want comparison views to exclude or caveat non-comparable facts by default, so that tables do not create false equivalence.
20. As a consultant, I want AUM observations to retain their exact as-of date and issuer-defined scope, so that period-end and regulatory AUM are not conflated.
21. As a consultant, I want client, investor, headcount, fund-count, and product-count observations to retain their stated definitions and methodology notes, so that methodology changes are not mistaken for operating growth.
22. As a consultant, I want Vanguard's cost ratio kept distinct from corporate operating expenses, so that a fund investor cost measure is not misread as a company margin input.
23. As a consultant, I want the expanded metric taxonomy to contain only metrics that meet a documented public-evidence coverage rule, so that the fact base is rich without becoming a collection of arbitrary fields.
24. As a data curator, I want to record source documents and citations separately from observations, so that one filing can support multiple facts without duplicated provenance.
25. As a data curator, I want collection runs recorded, so that I can tell what was attempted, what succeeded, what failed, and what requires review.
26. As a data curator, I want automated collection to respect source access constraints and rate limits, so that the refresh process remains compliant and reliable.
27. As a data curator, I want SEC collection to identify the registrant, CIK, accession, and filing context, so that machine-readable XBRL facts are tied back to the correct annual report.
28. As a data curator, I want issuer document retrieval to record a retrieval timestamp and content identity where practical, so that a later review can detect a changed source document.
29. As a data curator, I want a failed retrieval recorded as a collection outcome rather than evidence of non-disclosure, so that scraper limitations do not become false gaps.
30. As a data curator, I want automated extraction to identify facts needing human review, so that custom tags, PDF tables, segment notes, and definition changes are not published unchecked.
31. As a data curator, I want corrections and restatements recorded rather than overwritten without history, so that published history can be explained and reproduced.
32. As a data curator, I want a repeatable quarterly refresh process, so that published facts and the data-as-of marker remain current.
33. As a data curator, I want refresh validation to fail on missing provenance, invalid period coverage, inconsistent gap semantics, or unreviewed evidence, so that bad data cannot quietly reach the site.
34. As a data curator, I want a failed refresh to leave the last known-good published fact base intact, so that the site remains trustworthy during collection problems.
35. As a consultant, I want the website's metrics, benchmarking, RoE views, analysis, chatbot, CSV exports, and source links to read from the same authoritative fact base, so that no surface drifts from another.
36. As a consultant, I want existing rendered values and explicit gaps preserved until a verified database observation supersedes them, so that the cutover does not regress current content.
37. As a consultant, I want the chatbot to remain deterministic and grounded in the authoritative fact base, so that a database migration does not introduce live-model hallucination or source drift.
38. As a consultant, I want the data-as-of marker to represent the published database refresh, so that the site-wide freshness signal still has one authoritative meaning.
39. As a consultant, I want source links and comparison caveats to remain visible on database-backed pages, so that richer data does not reduce interpretability.
40. As an engineer, I want a stable fact-base access boundary, so that pages and the chatbot do not depend on the database engine or schema directly.
41. As an engineer, I want application tests to use a controlled seeded fact base, so that deterministic browser and unit tests do not depend on live internet access.
42. As an engineer, I want the existing refresh gate extended instead of bypassed, so that the established coverage, provenance, gap, analysis, and data-as-of safeguards keep protecting the site.
43. As an engineer, I want a documented migration and rollback path from the TypeScript dataset, so that the authoritative-source cutover is reversible.
44. As an engineering team, I want the database to be local-first, so that the initial data foundation does not require managed hosting, shared credentials, or cloud operations.
45. As an engineering team, I want a documented threshold for reconsidering managed/shared storage, so that future scaling occurs through an intentional decision rather than an accidental deployment dependency.
46. As an internal user, I want the fact base to remain public-data-only, so that the tool honors its research and licensing boundary.
47. As an internal user, I want the database to exclude source-document binary archival, so that the system stores reviewable citations and audit data without becoming a document repository.
48. As an internal user, I want no forecast, intraday, investment-advice, or regulatory-advice data added, so that the enhanced fact base stays within the site’s purpose.

## Implementation Decisions

- **Authoritative boundary**: the local-first database becomes the canonical data store for the existing fact base. Website views, exports, analysis, and the deterministic chatbot consume facts through one fact-base access boundary rather than importing persistence details.
- **Compatibility contract**: the established domain behavior remains intact: a metric series is a firm/metric set of FY2021–FY2025 points; every observation is sourced; missing public facts are explicit gaps; and the site retains source links, notes, verification information, and data-as-of behavior.
- **Data model scope**: the persistent model must represent firms, metric definitions, reporting periods, observations, scopes, units/currencies/accounting basis, comparability states, sources/citations, collection runs, verification/review outcomes, and revisions/restatements. A source document may support many observations; an observation must remain traceable to its supporting citation.
- **Evidence policy**: primary regulatory filings, regulated annual reports, and issuer-hosted disclosures take precedence. Reputable secondary sources may publish as `unverified` display/context observations when complete provenance and limitations are retained. They do not qualify as audited evidence, do not support derived metrics without review, and do not turn retrieval failure into a disclosure gap.
- **Peer-specific rules**: BlackRock and Invesco use audited USD/US-GAAP consolidated evidence. Amundi preserves EUR/IFRS and issuer scope. State Street parent and Investment Management segment evidence retain their scope and are never silently treated as standalone SSGA economics. Vanguard's unavailable corporate financials and Fidelity's unavailable audited financials remain gaps; Fidelity operating facts are voluntary side data.
- **Metric policy**: the five existing headline metrics remain supported. Expanded financial and operating metrics are admitted only after “Grilling: canonical metric taxonomy and comparability policy” records their definitions, coverage floor, comparability classification, and default presentation behavior. Vanguard cost ratio remains distinct from corporate operating expense.
- **Period and normalization policy**: retain reported fiscal/calendar period labels, exact as-of dates, reported units/currency, accounting basis, and methodology notes. Currency conversion, derived metrics, or normalized comparisons may only be introduced with the associated source/methodology and must never overwrite a reported observation.
- **Collection workflow**: a refresh is an auditable run from source discovery through retrieval, extraction, corroboration, normalization, validation, review, publication, data-as-of stamping, and rollback. SEC access follows its declared User-Agent and throttling rules; PDF/HTML/segment/custom-tag sources are eligible for manual review rather than unsafe automated publication.
- **Refresh safety**: the last validated published dataset remains active until a candidate refresh passes all validation and review requirements. Corrections and restatements preserve the prior observation history and identify the superseding source/run.
- **Migration**: existing static facts are backfilled as source-backed seed observations before the website reads from the database. The existing static dataset remains available only as a migration fixture or compatibility aid until the cutover contract is complete, then is retired or reduced according to “Grilling: authoritative fact-base cutover contract.”
- **Local-first operation**: persistence location, database engine, migration tooling, backup mechanics, and Next.js runtime access are decisions owned by “Grilling: local data-store technology and domain boundary.” The spec does not choose an engine prematurely. A managed/shared database is outside this delivery.
- **Required decision gates**: implementation starts after the four open Wayfinder tickets resolve: “Grilling: canonical metric taxonomy and comparability policy,” “Grilling: local data-store technology and domain boundary,” “Grilling: ingestion, validation, and quarterly-refresh contract,” and “Grilling: authoritative fact-base cutover contract.”

## Testing Decisions

- **Good-test rule**: tests assert externally meaningful outcomes: a candidate fact base can or cannot be published, a displayed value retains the required source/caveat/gap behavior, and a user-visible page or chatbot answer reads the same canonical observation. Tests do not assert SQL statements, table names, ORM calls, implementation-only collection steps, or CSS selectors unrelated to behavior.
- **Primary seam — fact-base publication gate**: extend the existing pure refresh/provenance gate as the highest shared seam for the database-backed fact base. Given a controlled candidate dataset, it validates five-year coverage where required, identifiers, citations/URLs, verification state, gap semantics, evidence/corroboration requirements, period/unit/currency/scope/comparability metadata, duplicate/conflicting observations, and review/publication status. It also preserves analysis evidence and data-as-of validation. A passing gate is the publication precondition; a failing gate reports the exact human-readable issue.
- **Site acceptance seam — existing browser E2E**: retain the existing production-build Playwright browser suite as the observable cutover guard. Seeded known facts and gaps must render with the same formatting, source links, caveats, exports, deep links, data-as-of marker, and deterministic chatbot answers before and after the persistence migration. Add focused browser cases for a populated peer observation and a display-only/non-comparable observation.
- **Collection integration tests**: where an extractor has deterministic fixture input, test the externally observable result at the publication-gate boundary: source metadata and candidate observations either validate or are rejected/review-required. Do not make the regular suite depend on a live SEC, issuer, Wayback, or aggregator network response.
- **Migration and rollback tests**: exercise a controlled copy of the existing static fact base through backfill, candidate validation, publication, and rollback. Assert the known source-backed Vanguard values and explicit gaps survive unchanged until an approved replacement exists.
- **Prior art**: direct Playwright unit tests already test fact-base provenance with literal expected values, while the browser suite tests metric cards, trends, sources, gaps, data-as-of, and chatbot behavior against a production build. The existing quarterly refresh gate is the primary precedent for readable validation failures and for keeping gaps as gaps.

## Out of Scope

- Expanding the peer set beyond BlackRock, Fidelity, State Street/SSGA, Invesco, and Amundi.
- Managed/shared cloud database hosting, shared operational access, and associated credentials.
- Paid, premium, or subscription-only data sources.
- Retaining source-document binary files or acting as a document archive.
- Forecasting, intraday market data, investment advice, regulatory advice, or client-facing delivery.
- Treating Vanguard fund filings as a substitute for Vanguard corporate financial statements.
- Treating Fidelity voluntary operating facts as audited financial statements.
- Treating State Street parent banking/custody results as standalone SSGA economics.
- Silent currency conversion, accounting normalization, inference, or fabrication of values.
- Implementing the database before the open Wayfinder decision tickets resolve.

## Further Notes

- This spec is published for the “Data-rich competitor fact base” Wayfinder effort. Its source-coverage evidence is recorded in the effort’s research asset; BlackRock and Invesco have strong audited coverage, Amundi and State Street require scoped extraction/normalization, and Vanguard profitability plus Fidelity audited financials remain structural gaps.
- Domain vocabulary follows `CONTEXT.md`: fact base, data-rich competitor fact base, aggregator lead, peer set, metric, AUM, RoE, cost ratio, voluntary-data core member, and refresh pipeline.
- The existing site-stack ADR remains in force: Next.js App Router, React, TypeScript, Tailwind, and Playwright against a production build. The persistence choice must fit that stack but is intentionally deferred to its decision ticket.
- The current quarterly-refresh runbook will be revised during implementation so that its data-collection and fact-base steps operate through the database workflow while preserving its existing validation, stamping, redeploy, verification, and rollback discipline.
