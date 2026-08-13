# Quarterly refresh runbook

The re-runnable pipeline that keeps the site current. Run it once per
quarter (spec story 23 — quarterly cadence). Every step exists to preserve
provenance: each number stays traceable to its public source, gaps stay
gaps, and the data-as-of marker on the site is updated and visible
(spec story 31).

The pipeline is: **data collection → candidate database → validate → publish
read model → re-analysis → stamp data-as-of → redeploy → verify**. The
database publication is atomic; the previous published run remains active
when validation fails.

## 0. Prerequisites

- Node + this repo on the current branch, tree clean (`git status`).
- The browser used by Playwright available (`npx playwright install chrome`
  if the E2E verify fails to find it).
- Today's date for the stamp: `Get-Date -Format "yyyy-MM-dd"` (PowerShell).

## 1. Data collection

Collect the quarter's public figures for the 5 headline metrics
(`aum`, `clients`, `cost-ratio`, `revenue`, `roe`) across Vanguard and the
peer set. Prefer primary sources (annual report, key statistics, press
releases, peers' 10-Ks), but reputable secondary or aggregator sources may
also be collected for display/context coverage. Provenance rules:

- Every figure gets a `source` (document/title), `sourceUrl`, and a
  `verification` tag — never a bare number.
- Secondary or aggregator evidence uses `verification: "unverified"`, keeps
  its retrieval date, definition, period, scope, and caveat, and is excluded
  from audited like-for-like comparisons by default. It cannot support a
  derived metric without review.
- A figure that cannot be found is recorded as a **gap**, not invented:
  `verification: "not-published"` (or `"pending-collection"`), `value: null`.
- Research notes from prior rounds live in
  `.scratch/vanguard-intelligence/assets/` — follow their formats.

## 2. Build the candidate database

The TypeScript fact base is an immutable migration fixture. Build a candidate
SQLite publication and its client-safe serialized read model with:

```bash
npm run fact-base:generate
```

The generator records firms, metrics, periods, observations, sources,
citations, verification events, comparability state, collection runs, and
revision links in `data/fact-base.sqlite`. The site boundary reads the
published run through `src/data/fact-base-read-model.json`; do not hand-edit
that generated file.

Keep the invariants the gate checks:

- Every series covers the 5 trend years (2021–2025) in order.
- Every point has a non-empty `source`, `sourceUrl`, and valid
  `verification`.
- Gap semantics: a gap tag (`not-published`, `pending-collection`,
  `pdf-not-read`, `blocked-unavailable`) carries `value: null`; a published
  tag (`verified-from-url`, `unverified`, `voluntary`) carries a value.
- The generated read model preserves the existing accessor contract —
  `seriesFor` stays the only way the rest of the site reads data.

## 3. Re-analysis

Edit `src/data/analysis.ts`: update `analysisNarrative` (how Vanguard is
faring) and `analysisOpportunities` (named improvements) to match the new
fact base (spec story 32). Rules the gate checks:

- Narrative: non-empty `title`, `intro`, `caveat`; at least one read with a
  heading and body.
- Opportunities: unique ids, each with `name`, `claim`, `read`, and
  `evidence` that references only real headline metrics.
- Every claim stays grounded in fact-base literals; peer-relative reads
  stay honestly labeled where peer data is pending.

## 4. Validate (the gate)

The gate re-verifies the whole pipeline — provenance intact, analysis
well-formed, stamp valid:

```bash
npm run refresh:validate
```

Run the generator before the gate whenever the candidate data changes. Zero
failures = the publication gate passes. A failing test names the exact issue
(e.g. "gap point ... must carry no value — nothing invented"). Fix the
data in steps 2–3, never weaken the gate. Also run the full check suite:

```bash
npx tsc --noEmit
npm run lint
npm run test:unit
```

## 5. Stamp data-as-of

Update the refresh stamp in `src/lib/site.ts`:

```ts
dataAsOf: "YYYY-MM-DD" as string | null, // the date this refresh ran
```

The marker component (`src/components/data-as-of-marker.tsx`) renders it
everywhere via `dataAsOfLabel` — the label reads "As of <Month Day, Year>".
The gate (step 4) checks the stamp's **format** only (it fails if the stamp
is missing, not YYYY-MM-DD, or a date that does not exist); it cannot know
the calendar — **freshness is this step's discipline**: stamp the date this
run actually ran, and re-run step 4 to confirm the new stamp passes.

## 6. Redeploy

Production build, then serve/start (or push the build to hosting):

```bash
npm run build
npm run start
```

One rebuild updates both the site pages and the chatbot's data — the
chatbot is a deterministic engine that reads the same fact-base modules in
browser (no separate data service to sync).

## 7. Verify

```bash
npm run test:e2e
```

The E2E suite asserts the dated marker ("As of August 12, 2026" on the
first run) renders on the home page, the About page, and the footer — the
data-as-of update is visible on the site, never the "Not yet refreshed"
fallback. If the suite flakes on the cold start, kill port 3000 and rerun:

```powershell
$conn = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($conn) { $conn | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue } }
npx playwright test --config playwright.config.ts --workers=2
```

## 8. Backup and rollback

- Before a refresh, copy `data/fact-base.sqlite` to an approved backup
  location. Keep the matching `src/data/fact-base-read-model.json` beside the
  backup or regenerate it from the restored database.
- If the gate (step 4) fails and cannot be resolved, do not publish the
  candidate. The previous published database run keeps serving.
- If a published deployment regresses, restore the database and read-model
  pair from the last-known-good backup, then rebuild and restore the previous
  stamp.
- If the deployed site regresses: redeploy the last green commit
  (`git checkout <last-green-commit>` then steps 6–7).

## Checklist (one line per run)

- [ ] Data collected from preferred primary or explicitly labeled secondary sources, provenance noted (step 1)
- [ ] Candidate database generated, gaps stay gaps (step 2)
- [ ] Analysis re-run, claims grounded (step 3)
- [ ] `npm run refresh:validate` passes (step 4)
- [ ] `dataAsOf` stamped with this run's date (step 5)
- [ ] Built and deployed (step 6)
- [ ] E2E shows the dated marker site-wide (step 7)
