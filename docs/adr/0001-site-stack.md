# ADR 0001: Site stack — Next.js App Router + React + TypeScript + Tailwind, Playwright E2E

- **Status:** accepted
- **Date:** 2026-03-11 (build ticket 11 — site scaffold)
- **Deciders:** build agent, in consultation with the wayfinder chart (map + spec)

## Context

Ticket 11 (site scaffold) must stand up the public website seam for the
Vanguard Intelligence site: an internal reference site showing financial
metrics, products and services, competitor benchmarking, RoE tree drilldowns,
and RoE comparisons, plus a chatbot.

The spec (`.scratch/vanguard-intelligence/spec.md`) defines two testing seams:

- **Seam 1 — website public interface:** browser E2E over the running site
  (nav, section views, About statement, data-as-of marker).
- **Seam 2 — fact base provenance:** data + sources, exercised by later
  tickets (17 analysis pipeline).

The site is a data-heavy, LLM-produced-analysis reference tool, not a
marketing page. It must be cheap to build, boring in a good way, and
greppable for later tickets (12–20) that land real views.

## Decision

- **Framework:** Next.js 16 (App Router) with **React 19**, **TypeScript 5**.
- **Styling:** Tailwind CSS 4 (single `@import "tailwindcss"` in
  `src/app/globals.css`, `@theme inline` for fonts).
- **Structure:** `src/` directory, import alias `@/*`.
- **Testing:** Playwright (`@playwright/test`) running against a production
  build (`npm run build && npm run start`) using the system Chrome channel.
- **Site config:** a single source of truth module, `src/lib/site.ts`,
  holding the site name, tagline, nav links, and the `dataAsOf` marker
  (currently `null` = "Not yet refreshed").

### Environment pinning (non-obvious)

1. **Turbopack root pinning** — `turbopack: { root: __dirname }` in
   `next.config.ts`. A stray `package-lock.json` in the parent directory
   (`C:\Users\2661632\Downloads\Sandbox\`) made Next resolve the wrong
   workspace root and warn it was ignoring the lockfile.
2. **System Chrome in Playwright** — `channel: "chrome"` instead of the
   bundled Chromium because the Chromium download failed in this environment.
3. **Production server for E2E** — dev-server cold compiles kept timing out
   the webServer boot; a production build is deterministic for CI-style runs.

## Consequences

- One framework, one styling system, no CSS-in-JS, no component library:
  views in later tickets (12–20) are plain Server Components with Tailwind.
- `data-as-of` is a first-class concept from day one (footer + About), so the
  refresh pipeline (ticket 20) has a settled contract to update.
- Playwright against a production build is slower to boot (~50s for 3 tests)
  but far more stable than dev-server E2E in this environment.
- Pinning system Chrome couples tests to that Chrome being installed; this is
  acceptable for an internal tool and recorded in `playwright.config.ts`
  comments.

## Alternatives considered

- **Vite + React SPA:** fine for a pure dashboard, but we want real routes
  per section, server-rendered metadata, and no client-side routing ceremony;
  Next.js App Router gives this with zero extra decisions.
- **Create React App / other metaframeworks:** CRA is effectively deprecated;
  Next is the default choice for this kind of internal reference site.
- **Dev-server E2E:** rejected due to repeated cold-compile timeouts.
- **Downloading Playwright Chromium:** rejected due to download failure;
  system Chrome was already present.
