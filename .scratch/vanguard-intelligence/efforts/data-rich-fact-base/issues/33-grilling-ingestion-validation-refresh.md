# 33 — Grilling: ingestion, validation, and quarterly-refresh contract

Type: grilling
Status: resolved
Assignee: GitHub Copilot
Blocked by: 30, 31, 32

## Question

How does internet-sourced data move from discovery through extraction, corroboration, normalization, validation, review, and quarterly publication into the authoritative local fact base?

Decide source priority and fallback; extraction boundaries; cross-check evidence required for aggregator leads; idempotency; rate-limit and failure behavior; manual-review gates; validation rules for units, periods, citations, completeness, and comparability; data-as-of semantics; audit records; correction/restatement handling; rerun and rollback behavior; and test evidence required before publication.

## Answer

The refresh source order is: **regulatory filing or regulated annual report; issuer-hosted copy; issuer results/AUM release; corroborating public source**. SEC and other source-specific rate limits, declared user agents, caching, and retrieval timestamps are part of the collector contract.

Aggregators are discovery leads only. A lead cannot publish until corroborated by a primary source or a second independent public source, with the lead retained in the audit trail. Stable structured facts with complete provenance may publish automatically; PDF tables, custom XBRL tags, segment notes, changed definitions, accounting/scope breaks, and derived values require human review.

Each refresh creates an immutable candidate run. A deterministic observation key combines firm, metric, period, scope, definition/basis, and source identity so reruns update the candidate without duplicating observations. Publication is atomic: a candidate is promoted only after validation and required review, while the previous published run remains available for rollback.

Publication-blocking validation failures include missing source/citation or invalid URL, period/unit/scope/accounting inconsistency, and duplicate or conflicting observations. Coverage gaps do not block the entire run; they remain explicit gaps or pending states according to the evidence review. A retrieval failure is recorded as a collection failure, never treated as proof of non-disclosure and never silently converted into a `not-published` fact.

The site-wide data-as-of marker is the atomic publication date of the promoted run. Individual observations retain their own source reporting/as-of dates. Corrections and restatements create new reviewed observations linked to the superseded record rather than overwriting history.

Verification: resolved through the interactive decision rounds on 2026-08-13; no application code changed.
