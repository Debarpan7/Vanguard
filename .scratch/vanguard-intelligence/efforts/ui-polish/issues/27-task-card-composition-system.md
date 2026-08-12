# 27 — Task: site-wide card composition system

**What to build:** Apply a consistent card/grid composition model across every existing route and shared surface. Content groups, metric summaries, narrative reads, peer panels, product entries, chatbot messages, filters, and footer metadata should use explicit cards or CSS grids rather than loose flex-based strips. Preserve semantic HTML: data tables remain actual tables inside responsive framed panels, and flex remains allowed for small control internals such as icon-plus-label buttons and navigation links. Establish shared surface, border, shadow, spacing, and responsive patterns so later page passes do not invent one-off cards.

**Blocked by:** 21 (Task: lock Take B tokens and the rail shell)

**Status:** ready-for-agent

**Assignee:**

- [ ] Shared card and panel patterns are defined in the existing Tailwind/CSS conventions
- [ ] All route-level content areas use cards or grids; no decorative nested-card stacks
- [ ] Tables remain semantic, responsive, and visually framed without table animation
- [ ] Existing headings, testids, source links, data values, and E2E/unit contracts remain unchanged
