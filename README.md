# Vanguard Intelligence

Internal reference site for how Vanguard is faring and where it can improve —
LLM-produced analysis over public sources (annual report, key statistics,
press releases, and peers' filings). **Not client-facing.**

## Sections

- **Metrics** — current financial metrics (AUM, clients, etc.)
- **Products & services** — the product and line-of-business taxonomy
- **Benchmarking** — competitor benchmarking of core metrics
- **RoE tree** — RoE tree drilldowns
- **RoE comparisons** — RoE comparisons across peers and industries per line of business
- **Chatbot** — Q&A over the fact base
- **About** — what this site is, how to read it, data provenance and refresh

Sections beyond About are under construction (build tickets 12–20).

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4.
See `docs/adr/0001-site-stack.md` for the stack decision and the environment
pinning (Turbopack root, system Chrome for Playwright, production build for E2E).

## Development

```bash
npm run dev        # dev server at http://localhost:3000
npm run lint       # ESLint
npx tsc --noEmit   # typecheck
npm run test:e2e   # Playwright E2E (builds, starts prod server, runs tests)
```

## Tracker

Product decisions and build tickets live in `.scratch/vanguard-intelligence/`
(map, spec, issues). The single source of truth for the site shell
(name, nav, data-as-of marker) is `src/lib/site.ts`.
