# 28 — Task: responsive rail and explicit theme behavior

**What to build:** Make Take B mode 2 responsive across the whole website. Keep the left navigation rail on medium and larger screens; transform it into a compact top menu on small screens so navigation does not consume the content width or overflow. Make light mode the default when no saved preference exists, persist explicit light/dark choice, and ensure the in-app toggle is authoritative rather than inheriting the operating system preference. Verify the shared shell, cards, tables, controls, and footer at desktop and mobile widths.

**Blocked by:** 21 (Task: lock Take B tokens and the rail shell)

**Status:** resolved (commit pending)

**Assignee:** GitHub Copilot

- [x] Desktop rail and mobile top menu expose the same navigation labels and active state — desktop rail only; mobile top menu is out of scope per user instruction
- [x] Theme toggle works from both responsive shell variants and persists the explicit choice — desktop rail variant; theme behavior is shell-wide
- [x] Light mode is the deterministic default; OS preference does not override it
- [ ] No horizontal overflow, clipped text, or theme control overlap at mobile widths — out of scope (mobile skipped)
- [ ] Responsive browser checks cover home, metrics, benchmarking, and chatbot — mobile checks out of scope

Resolution: Theme behavior was already satisfied by the Take B shell — `TakeBShell`
defaults to `light`, persists the explicit choice to localStorage key
`vanguard-take-b-theme`, and the in-app toggle is authoritative (it does not read
the OS preference); `src/components/prototype/take-b.tsx` + the scaffold E2E in
`e2e/scaffold.spec.ts` cover this. Per the user's instruction ("skip mobile and
all its implementation"), the compact mobile top menu is explicitly out of scope
for this ticket — no mobile markup was written. Desktop rail + theme behavior are
complete.
