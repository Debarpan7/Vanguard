# 20 — Task: quarterly refresh pipeline

**What to build:** A documented, re-runnable pipeline for the quarterly update — data collection → fact base → re-analysis → redeploy — with provenance intact and the data-as-of marker updated and visible on the site. Includes the runbook for the quarterly process.

**Blocked by:** 11 (Task: site scaffold — stack, shell, navigation), 17 (Task: LLM analysis pipeline — narrative and improvement opportunities), 18 (Task: live grounded chatbot)

**Status:** resolved (commit `12407bd`)

- [x] Pipeline re-runs data collection into the fact base with provenance intact
- [x] Re-analysis produces an updated narrative and improvement opportunities
- [x] Redeploy updates the site and the chatbot's data
- [x] Data-as-of is updated and visible on the site
- [x] Runbook documents the quarterly process end to end
