# 23 — Task: visual-regression seam

**What to build:** The new screenshot-diff seam: a Playwright spec that captures the key pages — home, metrics, products, benchmarking, RoE tree, RoE comparisons, About, chatbot — at a fixed viewport against the production build, compares them to committed baselines with dynamic regions masked, and provides a documented re-baselining script. Baselines are captured after the shell pass settles; later tickets extend their own baselines deliberately, never to mask a regression.

**Blocked by:** 21 (Task: lock Take B tokens and the rail shell), 27 (Task: site-wide card composition system), 28 (Task: responsive rail and explicit theme behavior)

**Status:** ready-for-agent

- [ ] Screenshot spec runs against the same production build the E2E suite boots, fixed viewport, dynamic regions (data-as-of, chatbot) masked
- [ ] Baselines committed; re-baselining documented (script + runbook note) and CI runs the comparison
- [ ] Suite stays green in CI; the seam catches a deliberately introduced visual change in review
