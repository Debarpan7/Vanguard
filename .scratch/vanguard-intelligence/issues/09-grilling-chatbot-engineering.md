# 09 — Grilling: chatbot scope and engineering

Type: grilling
Status: resolved
Blocked by: 08

## Question

What does the live LLM chatbot do, and how is it engineered?

Proper engineering is a standing preference — decide, one question at a time:
- **Scope**: what the chatbot answers — fact base queries, comparisons, RoE drilldowns, improvement reads — and what it refuses (out-of-fact-base claims, advice).
- **Grounding**: retrieval over the fact base (RAG), how sources/caveats are surfaced in answers.
- **Backend**: LLM provider and serving approach, given the internal-reference context.
- **Guardrails**: hallucination controls, data boundaries, and how the mutual-vs-listed caveat is enforced in answers.
- **Surfacing**: how the chatbot lives on the site (view, data it may draw from).

## Answer

Five decisions, grilled one at a time (user-approved):

1. **Engine — deterministic retrieval engine, not a live LLM API.** The chatbot is a rule-based intent engine over the fact base + analysis data. Fully testable (deterministic answers, sources, refusals), no API key, no cost, no latency, no hallucination risk. Consistent with how ticket 17's "LLM pipeline" is a seeded artifact, not a live API call. The "live" in "live chatbot" = interactive Q&A on the site, not a model call per query.

2. **Scope — five named intents, everything else refused.** (a) metric queries (AUM, clients, cost ratio, revenue, RoE — latest value + as-of + source link), (b) 5-year trend queries, (c) benchmarking questions (Vanguard vs peers, with the mutual-vs-listed caveat), (d) RoE tree / profitability questions, (e) improvement reads (the 4 opportunities + narrative) + ownership/company-context questions. Everything else → refusal.

3. **Grounding — intent registry + fact-base accessor answers.** A static intent registry (id, title, trigger keywords/patterns, answer builder, cited sources from the fact base/analysis data). Query → normalize (lowercase, trim) → score each intent by keyword hits → best intent above threshold answers; below threshold → refusal. Answers are built by rendering facts through `seriesFor`/`latestPublishedPoint`/`metricMeta` so every figure and source link is a fact-base literal — never hard-coded twice.

4. **Guardrails — refuse-first with fixed strings; caveat auto-appended.** Refusal triggers are checked BEFORE intent matching: investment-advice words (buy/sell/invest/allocat/recommend/advice/should I...), regulatory/filing advice, non-fact-base topics (private companies, firms outside the peer set, forward-looking/forecasts, legal). All refusal responses are fixed literal strings so E2E can assert them verbatim. Ownership caveat: any benchmarking/roe answer appends the mutual-vs-listed caveat line verbatim (from `peer-set.ts`'s existing caveat); a dedicated intent handles ownership/company questions.

5. **Surfacing — client component on /chatbot, engine in-browser.** /chatbot (placeholder exists) becomes a client component chat view: message list + input + send. The engine runs entirely in-browser (pure function over fact base/analysis data — no API route, no network, deterministic, instant). Answers render with source names as real links. Canned example question chips ("Try: What is Vanguard's AUM?") make the demo obvious.

Unblocks ticket 18 (full).

## Review

- Reviewed during ticket 18 implementation (commit `de8cc0a`). No blockers on the engineering decisions; implementation detail lives in `issues/18-task-chatbot.md`.
