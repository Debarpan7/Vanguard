# 28 — Task: responsive rail and explicit theme behavior

**What to build:** Make Take B mode 2 responsive across the whole website. Keep the left navigation rail on medium and larger screens; transform it into a compact top menu on small screens so navigation does not consume the content width or overflow. Make light mode the default when no saved preference exists, persist explicit light/dark choice, and ensure the in-app toggle is authoritative rather than inheriting the operating system preference. Verify the shared shell, cards, tables, controls, and footer at desktop and mobile widths.

**Blocked by:** 21 (Task: lock Take B tokens and the rail shell)

**Status:** ready-for-agent

**Assignee:**

- [ ] Desktop rail and mobile top menu expose the same navigation labels and active state
- [ ] Theme toggle works from both responsive shell variants and persists the explicit choice
- [ ] Light mode is the deterministic default; OS preference does not override it
- [ ] No horizontal overflow, clipped text, or theme control overlap at mobile widths
- [ ] Responsive browser checks cover home, metrics, benchmarking, and chatbot
