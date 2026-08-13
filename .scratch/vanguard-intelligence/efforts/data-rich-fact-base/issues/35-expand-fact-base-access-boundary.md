# 35 — Expand fact-base access boundary

**What to build:** Preserve every current fact-base behavior while putting a stable compatibility boundary between the site and its static dataset. A consultant continues to see the same metrics, sources, gaps, exports, analysis, chatbot answers, and data-as-of marker, while later tickets gain a reversible path to a database-backed authoritative fact base.

**Blocked by:** 31 — Grilling: canonical metric taxonomy and comparability policy; 32 — Grilling: local data-store technology and domain boundary; 33 — Grilling: ingestion, validation, and quarterly-refresh contract; 34 — Grilling: authoritative fact-base cutover contract.

**Status:** resolved (commit pending)

- [x] The current public fact-base behavior is available through one persistence-agnostic access boundary without changing rendered values, source links, gap labels, exports, chatbot answers, or data-as-of behavior.
- [x] The existing refresh/provenance gate and controlled test fixtures use the same boundary and continue to report readable validation failures.
- [x] Unit and production-build browser tests prove the existing website contract remains green during the expand phase.

## Resolution

- Added the persistence-agnostic fact-base boundary used by application routes, components, libraries, and tests.
- Kept the static dataset behind the boundary as the compatibility implementation; data-definition modules remain on the implementation side.
- Focused provenance and refresh validation passed: `26 passed`.
- TypeScript validation passed after the application and test consumer migration.
