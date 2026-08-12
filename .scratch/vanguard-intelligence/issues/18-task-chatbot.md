# 18 — Task: live grounded chatbot

**What to build:** The live chatbot answers questions about the metrics, benchmarking, RoE analysis, and improvement reads — grounded in the fact base with source citations, refusing out-of-fact-base and advice questions — engineered per the chatbot design ticket.

**Blocked by:** 11 (Task: site scaffold — stack, shell, navigation), 08 (Task: fact base assembly), 09 (Grilling: chatbot scope and engineering)

**Status:** done

- [x] Chatbot answers known fact base queries with the correct grounded sources
- [x] Chatbot refuses out-of-fact-base and advice questions
- [x] Ownership caveat is enforced in relevant answers
- [x] Browser E2E test asserts a known query returns the correct grounded answer and an out-of-scope query is refused
