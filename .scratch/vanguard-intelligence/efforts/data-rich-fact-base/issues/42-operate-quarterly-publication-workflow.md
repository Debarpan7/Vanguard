# 42 — Operate quarterly fact-base publication workflow

**What to build:** Turn the database-backed fact base into a repeatable quarterly publication process. A data curator can collect candidates, corroborate evidence, route exceptions for review, publish only a valid dataset, handle corrections/restatements, stamp data-as-of, verify the site, and roll back safely when a refresh fails.

**Blocked by:** 37 — Publish audited BlackRock and Invesco competitor series; 38 — Publish Amundi EUR/IFRS competitor series; 39 — Publish scoped State Street and SSGA series; 40 — Publish Vanguard regulatory AUM coverage; 41 — Publish Fidelity voluntary operating side data.

**Status:** ready-for-agent

- [ ] A quarterly candidate-to-published workflow records collection outcomes, respects source-access constraints, enforces corroboration/review requirements, and preserves correction/restatement history.
- [ ] The fact-base publication gate validates the full current peer set and metric taxonomy, including provenance, period, scope, comparability, gap semantics, and data-as-of rules.
- [ ] A documented run completes from collection through site verification, while a failed run leaves the last validated publication live and provides a safe rollback path.
