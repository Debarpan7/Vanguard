# 25 — Task: animation system

**What to build:** The subtle, accessible motion layer: hover lifts on cards/links/buttons, fade-in-on-scroll for sections (via an SSR-safe in-view hook, no layout shift), nav transitions — with no animation on data tables and `prefers-reduced-motion` respected everywhere (the hook bails out; nothing animates for reduced-motion users). Includes streamed chatbot replies: responses reveal progressively in the existing chat view, with the final rendered text byte-equal to the deterministic engine's answer — verbatim refusal strings, ownership caveat, figures, and source links intact; the message region stays polite for assistive technology.

**Blocked by:** 21 (Task: design tokens and site shell color pass)

**Status:** ready-for-agent

- [ ] Hover lifts, scroll fade-ins (no layout shift), nav transitions; no data-table animation; reduced-motion users get none
- [ ] Chatbot streams replies; the completed final text matches the engine's exact answer (verbatim contract preserved)
- [ ] Streaming unit tests green (chunk concatenation equals the engine's exact answer); chatbot E2E awaits streamed completion and asserts the verbatim text
