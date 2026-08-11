# 09 — Grilling: chatbot scope and engineering

Type: grilling
Status: open
Blocked by: 08

## Question

What does the live LLM chatbot do, and how is it engineered?

Proper engineering is a standing preference — decide, one question at a time:
- **Scope**: what the chatbot answers — fact base queries, comparisons, RoE drilldowns, improvement reads — and what it refuses (out-of-fact-base claims, advice).
- **Grounding**: retrieval over the fact base (RAG), how sources/caveats are surfaced in answers.
- **Backend**: LLM provider and serving approach, given the internal-reference context.
- **Guardrails**: hallucination controls, data boundaries, and how the mutual-vs-listed caveat is enforced in answers.
- **Surfacing**: how the chatbot lives on the site (view, data it may draw from).
