# Key Metrics section — sketch verification & fillability report

- **Date of research:** 2026-08-14
- **Purpose:** (1) verify the pasted "Key Metrics" sketch's numbers against primary sources; (2) map which rows are actually fillable from primary/strong public sources per firm; (3) flag conflicts with the repo's existing fact base (`src/data/fact-base.ts`, read 2026-08-14).
- **Method:** Primary documents fetched directly from SEC EDGAR (10-Ks, 8-K earnings releases/exhibits) and the SEC IAPD/Form ADV filing-data archive; Fidelity checked via Wayback captures of fidelity.com (live fidelity.com returns 403 to automated clients) plus dated trade-press coverage. All retrievals 2026-08-14. Values below are as printed in the cited documents; "cannot trace" is used where no dated first-party disclosure could be found.
- **Bottom line:** The BlackRock, State Street, and Vanguard columns of the sketch are verifiable against primary sources (BlackRock FY2025 10-K + Q4 2025 earnings release; State Street FY2025 10-K + Q4 2025 release/supplemental/presentation; Vanguard Form ADV 2026 annual amendment). The Fidelity AUM figure is traceable to Fidelity's voluntary 2025 annual-results disclosure (early March 2026) via dated press coverage, but no first-party URL is machine-fetchable and Fidelity publishes no audited statements. Several sketch values carry presentation artifacts (rounding sums, performance-fee reallocation, parent-vs-segment revenue) that must be resolved before display.

---

## 1. Sketch-number verification table

Legend: ✅ verified (matches a primary/dated source or is exact arithmetic from one) · ⚠️ verified with caveat (presentation artifact, rounding, or scope issue) · ❓ cannot trace (no dated first-party source found) · ❌ conflicts with repo fact base.

| # | Row | Sketch value | Primary source found (URL + date) | Verdict | Note |
|---|---|---|---|---|---|
| 1 | Vanguard AUM | 11,092 | SEC Form ADV filing-data archive, March 2026 zip (`IA_ADV_Base_A`), CRD 105958, FilingID 2070614 submitted **2026-03-30**, Item 5.F.2.a = 5.F.2.c = **$11,092,665,107,962**; reaffirmed identical in FilingID 2111005 submitted **2026-07-17** (July 2026 zip). https://reports.adviserinfo.sec.gov/reports/foia/advFilingData/2026/ADV_Filing_Data_20260301_20260331.zip | ✅ verified (regulatory AUM) | This is the **2026 annual amendment** to Form ADV — a newer filing than the repo fact base's point (filed 2025-12-22, $10,246,596,045,633 as of 2025-09-30). Difference ≈ +$0.85T is market movement + flows between the two filings' valuation dates; not a contradiction (see §4.3). Archive rows do not expose the AUM valuation date (same limitation already noted in repo asset `03-vanguard-regulatory-aum-2025.md`); a ~Dec 31, 2025 valuation is consistent with the ADV annual-amendment cycle. Must stay labeled `display-only-regulatory-aum` (adviser-level, not Vanguard corporate AUM — Vanguard's own site publishes no current firm AUM, verified 2026-08-14 on facts-and-figures). |
| 2 | BlackRock AUM | 14,038 | BlackRock FY2025 10-K (EDGAR CIK 2012383, acc 0001193125-26-071966, filed **2026-02-25**), "Assets Under Management" table: Total **$14,041,518M** at Dec 31, 2025; Q4 2025 earnings release (acc 0001193125-26-013503, filed **2026-01-15**): "$14 trillion in AUM"; https://www.sec.gov/Archives/edgar/data/2012383/000119312526071966/blk-20251231.htm | ✅ verified (rounding caveat) | 14,038 = arithmetic sum of the rounded components (7,793+3,272+1,223+423+78+169+1,080). The exact primary total is **14,041,518M ($14.0415T)**. Use 14,041.5 or "$14.0T" to avoid an artifact total. |
| 3 | BlackRock AUM growth | 22% | Computed from 10-K AUM table: 14,041,518 / 11,551,251 − 1 = **+21.6%** | ✅ verified (arithmetic) | Total-AUM growth (markets + flows + acquisitions), not organic (organic base fee growth was 9% FY2025 per Q4 release). |
| 4 | State Street AUM | 5,665 | State Street FY2025 10-K (EDGAR CIK 93751, acc 0000093751-26-000124, filed **2026-02-19**) Table 6 "Assets Under Management by Asset Class and Investment Approach": Total **$5,665B** at Dec 31, 2025; Q4 2025 earnings release (acc 0000093751-26-000008, filed **2026-01-16**) financial-highlights table: AUM $5,665B. https://www.sec.gov/Archives/edgar/data/93751/000009375126000124/stt-20251231.htm | ✅ verified | Exact match (10-K and release both show 5,665). |
| 5 | State Street AUM growth | 20% | 10-K MD&A: "AUM of $5.67 trillion … increased 20%"; 5,665/4,715 = **+20.1%** | ✅ verified | |
| 6 | State Street AUA | 53,800 | Q4 2025 release financial highlights: AUC/A **$53,800B** at Dec 31, 2025; 10-K MD&A: "AUC/A of $53.80 trillion". | ✅ verified | "AUA" = State Street's **assets under custody and/or administration (AUC/A)** — a parent *servicing* metric, not SSGA. SSGA AUM is the 5,665 line. |
| 7 | State Street AUA growth | 16% | 10-K MD&A: "$53.80 trillion … increased 16%"; 53,800/46,557 = **+15.6%** | ✅ verified | |
| 8 | BlackRock net flows | 698 | Q4 2025 release headline: "record **$698 billion of full year net inflows**"; AUM rollforward in same release: total FY2025 net flows **$698,261M** | ✅ verified | FY2025 total net inflows across all products incl. cash management; includes flows into GIP/HPS/preqin-related products. |
| 9 | State Street net flows | 180 | Q4 2025 earnings presentation (Ex 99.3, acc 0000093751-26-000008): quarterly SSGA net flows 1Q25 −13 / 2Q25 +82 / 3Q25 +26 / 4Q25 +85 → FY sum **180**; same deck states "total net inflows of … **$181B** in FY2025". https://www.sec.gov/Archives/edgar/data/93751/000009375126000008/stt4q25earningspresentat.htm | ⚠️ verified (rounding) | Component sum 180 vs stated 181 — minor rounding in one of the two presentations. |
| 10 | AUM mix — Equity (BLK) | 7,793 | 10-K AUM table: Equity **7,793,875M** (2025) | ✅ verified | Exact rounded match. |
| 11 | AUM mix — Fixed Income (BLK) | 3,272 | 10-K: Fixed income **3,272,021M** | ✅ verified | |
| 12 | AUM mix — Multi-asset (BLK) | 1,223 | 10-K: **1,223,625M** | ✅ verified | |
| 13 | AUM mix — Alternatives (BLK) | 423 | 10-K: **423,614M** | ✅ verified | |
| 14 | AUM mix — Digital assets (BLK) | 78 | 10-K: **78,435M** | ✅ verified | |
| 15 | AUM mix — Currency & commodities (BLK) | 169 | 10-K: **169,216M** | ✅ verified | |
| 16 | AUM mix — Cash mgmt (BLK) | 1,080 | 10-K: **1,080,732M** | ✅ verified | |
| 17 | AUM mix — Equity (STT) | 3,589 | 10-K Table 6: Total equity **3,589B** (active 61 + passive 3,528) | ✅ verified | |
| 18 | AUM mix — Fixed Income (STT) | 734 | 10-K Table 6: Total fixed-income **734B** (active 30 + passive 704) | ✅ verified | |
| 19 | AUM mix — Multi-asset (STT) | 501 | 10-K Table 6: Total multi-asset-class solutions **501B** | ✅ verified | |
| 20 | AUM mix — Alternatives (STT) | 271 | 10-K Table 6: Total alternative investments **271B** (footnote: includes REITs, currency and commodities incl. SPDR Gold) | ✅ verified | Currency/commodities for STT sits inside alternatives — hence the sketch's blank C&C/digital cells for STT are appropriate. |
| 21 | AUM mix — Cash (STT) | 570 | 10-K Table 6: Cash **570B** | ✅ verified | |
| 22 | Flows — Equity (BLK) | 220 | Q4 2025 release AUM rollforward: Equity net flows **220,126M** | ✅ verified | |
| 23 | Flows — Fixed Income (BLK) | 164 | Rollforward: **164,399M** | ✅ verified | |
| 24 | Flows — Multi-asset (BLK) | 72 | Rollforward: **72,269M** | ✅ verified | |
| 25 | Flows — Alternatives (BLK) | 51 | Rollforward: private 39,834 + liquid 11,143 = **50,977M** | ✅ verified | |
| 26 | Flows — Digital (BLK) | 34 | Rollforward: **34,763M** | ✅ verified | |
| 27 | Flows — C&C (BLK) | 25 | Rollforward: **24,953M** | ✅ verified | |
| 28 | Flows — Cash (BLK) | 131 | Rollforward: **130,774M**; total 698,261 | ✅ verified | |
| 29 | Flows — Equity (STT) | 10 | Q2 2026 supplemental (Ex 99.2, acc 0000093751-26-000387, filed **2026-07-16**) "Net asset flows by category — By Asset Class" quarterly table, FY2025 sum: Equity (−37+14+5+28) = **10** | ✅ verified | Same table is the only first-party place where SSGA flows by asset class appear; sums to the 180 total. |
| 30 | Flows — Fixed Income (STT) | 77 | Same table: (2+51+13+11) = **77** | ✅ verified | |
| 31 | Flows — Multi-asset (STT) | 56 | Same table: (13+25+6+12) = **56** | ✅ verified | |
| 32 | Flows — Alternatives (STT) | 3 | Same table: (8−7−8+10) = **3** | ✅ verified | |
| 33 | Flows — Cash (STT) | 34 | Same table: (1−1+10+24) = **34** | ✅ verified | |
| 34 | Revenue (BLK) | 24 | 10-K income statement: FY2025 total revenue **$24,216M**; matches repo fact base (24.216) | ✅ verified | |
| 35 | Revenue growth (BLK) | 19% | Q4 2025 release: "19% increase in full year revenue"; 24,216/20,407 = **+18.7%** | ✅ verified | |
| 36 | Revenue (STT) | 14 | 10-K Table 2: FY2025 **total revenue $13,944M ≈ $14.0B** | ⚠️ verified — **❌ scope conflict with repo** | Repo fact base stores the SSGA-relevant measure: **Investment Management segment revenue $2.634B** (10-K segment note, table 14). "14" is **parent consolidated revenue** (servicing + NII + everything else). Displaying 14 as "State Street (SSGA)" contradicts the repo's segment-isolation convention (`firmMeta` note: "SSGA asset-management segment isolated from parent custody and net-interest income"). |
| 37 | Revenue growth (STT) | 7% | 10-K/presentation: 13,944/13,000 = **+7.3%** (parent) | ⚠️ verified — scope conflict as #36 | Segment revenue growth FY2025 = 2,634/2,344 = **+12.4%** (different measure). |
| 38 | Revenue mix (BLK) — all ten lines | 8,342 / 3,566 / 1,355 / 4,272 / 1,321 / 502 / 1,245 / 1,981 / 1,355 / 277 | 10-K revenue note (Note — Revenue disaggregation) + Q4 2025 release "Results by Product Type". Lines verified: Non-ETF index 1,321 (FY24 1,183); Digital/commodities/MA ETFs 502 (247); Cash mgmt 1,245 (1,049); Technology services & subscription 1,981 (1,603); Distribution fees 1,355 (1,273); Advisory & other 277 (224). Equity 8,342 = 8,210 + 132 perf. fees; Fixed income 3,566 = 3,550 + 16; Active multi-asset 1,355 = 1,332 + 23; Alternatives 4,272 = 3,019 + 1,253 (perf. fees) | ⚠️ verified (re-presentation) | Sum = **24,216 = FY2025 revenue** ✓. The 10-K shows performance fees as a separate line; the sketch folds them into each product line (a defensible re-presentation, but it is not BlackRock's own table). Growth %s are author-computed from the 10-K two-year columns: +12% / +6% / +7% (actual +6.5%) / +55% / +12% / +103% / +19% / +24% / +6% / +24% — all consistent. |
| 39 | Revenue / "Average" AUM | 0.17% / 0.25% | Computed: 24,216/14,041,518 = **0.172%** (BLK); 13,944/5,665,000 = **0.246%** (STT) | ✅ verified (arithmetic) | Label is inaccurate: the denominator is **period-end AUM**, not average AUM. Rename or recompute with true averages. |
| 40 | Client-type AUM mix | all blank | BlackRock Q4 2025 release "Results by Client Type" (Dec 31, 2025): Retail **$1,278,732M**; ETFs **$5,467,710M**; Institutional active **$2,518,170M**; Institutional index **$3,696,174M**; Institutional subtotal $6,214,344M; Long-term $12,960,786M | ✅ fillable for BLK (sketch underfilled) | For Vanguard, State Street, Fidelity: no first-party retail/HNI/institutional AUM split found (State Street discloses geographic mix, Table 7 in 10-K, and vehicle mix in the 99.2 — ETF/SMA/commingled — but not retail/HNI/institutional). |
| 41 | Profitability rows | blank | BLK: operating margin GAAP **29.1%**, as-adjusted **44.1%** (FY2025, 10-K + release). STT (parent): pre-tax margin GAAP **26.8%** / ex-notables **29.2%**; ROE **11.5%**; ROTCE **17.9%** (10-K + 99.3). VG: 0.07% asset-weighted US fund expense ratio (different measure — investor cost, not corporate margin). FI: none published | Partially fillable | Sketch blanks are underfilled for BLK and STT-parent. |
| 42 | Operating productivity | blank | Computable from 10-K headcount: BLK ~24k employees → revenue/employee ≈ $1.0M; STT ~51.5k → ≈ $0.27M (parent). VG: crew count + 0.07% cost ratio. FI: 80,000+ associates (voluntary) | Partially fillable | No standard cross-firm productivity metric exists; any comparison needs explicit definition. |
| 43 | Customer experience | blank | None — no first-party source for any firm | ❓ gap for all | App-store ratings/social signals must be web-scoured (Google Play / App Store / press), each with retrieval date. |

---

## 2. Fillability map (row family × firm)

Legend: **P** = primary/strong public source exists · **V** = voluntary (private-firm, dated first-party but not audited) · **S** = secondary/web-scour only · **G** = gap (no first-party source). "5y" = 5-year series coverable; "1y" = single observation; "triage" = only via third-party aggregation/triangulation.

| Row family | Vanguard | BlackRock | State Street (SSGA) | Fidelity |
|---|---|---|---|---|
| **AUM** | P (Form ADV regulatory AUM — IAPD; one observation per filing; 5y via ADV archive 2023–26 + facts-and-figures through Mar 2022). Label `display-only-regulatory-aum`. | P, 5y (10-K + quarterly releases). | P, 5y (10-K Table 6 + quarterly releases; AUC/A 5y table in 99.2). | V, 1y-per-year (annual-results disclosure ~Mar 2026: $7.1T; earlier years via press/archives). Voluntary flag required. |
| **Flows / organic growth** | G (no firm-level flows published; ADV has no flow field). Fund-level via ETF.com/Morningstar/Bloomberg — S/triage only. | P, 5y (Q4 release AUM rollforward + 10-K). | P, 5y (quarterly "Net asset flows by category" in 99.2/presentation). | G (no firm-level flows; occasional press mentions — S). |
| **AUM mix by asset class** | G at firm level (fund-level N-CSR/N-PORT only — S/triage). | P, 5y (10-K table 2021–2025 + quarterly). | P, 3y in 2025 10-K Table 6 (2023–25); quarterly supplemental; ⚠️ presentation changed Q1 2026 (now Index/Active/Cash organization; asset-class view retained as supplemental). | G at firm level (fund data via N-CSR/third-party — S). |
| **AUM mix by client type** | G (no firm-level retail/HNI/institutional split). | P, 1y-per-release, 5y coverable (Results by Client Type: Retail/ETF/Institutional). | Partial (geographic Table 7 + vehicle mix in 99.2; no retail/HNI/institutional split). | G (qualitative "retail-heavy" only). |
| **Revenue** | G (no firm revenue published; bottom-up N-CSR advisory-fee proxy possible but excluded by repo ticket 03). | P, 5y (10-K; repo has FY21–25: 19.374→24.216). | P, 5y **parent consolidated** (10-K); SSGA segment revenue P (repo: 2.119→2.634). Scope decision required — do not mix. | V, 1y (2025 revenue $37.7B, +15%, from annual-results coverage ~Mar 2026). No audited statements. |
| **Revenue mix** | G. | P (10-K revenue note + release; 2-year columns per filing; 5y coverable). | P parent (10-K Table 2); SSGA segment mix partial (management fees $2,398M FY25). | G. |
| **Profitability** | G (cost ratio 0.07% is an investor-cost measure, not corporate profitability). | P, 5y (10-K: operating margin 29.1% GAAP / 44.1% adj). | P parent, 5y (pre-tax margin 26.8%/29.2%; ROE 11.5%; ROTCE 17.9%) — parent scope, **not** SSGA economics. | G (no income statement). |
| **Operating productivity** | Partial (crew count, cost ratio — operating facts only). | P, 5y (headcount + revenue/expenses in 10-K). | P parent, 5y (headcount ~51.5k, revenue, expenses). | V/partial (80,000+ associates; no financial ratios). |
| **Customer experience** | G — S (app-store ratings, press) | G — S | G — S | G — S |

**Row-family reality check:** Only two row families are honestly fillable for *all four* firms: **AUM** (P/P/P/V) and (with heavy caveats) **customer experience** (all S). Everything else is firm-dependent, and profitability/productivity rows are not comparable across the set (Vanguard and Fidelity lack corporate income statements; State Street's are parent-scope). A truthful "Key Metrics" table must carry per-cell scope/provenance flags or show explicit gaps — consistent with the repo's existing `not-published` / `pending-collection` / `voluntary` verification tags.

---

## 3. Vanguard-specific source map

**What primary sources exist for Vanguard firm-level facts (verified 2026-08-14):**

1. **Form ADV / IAPD (regulatory AUM — the only current firm-level AUM):**
   - 2026 annual amendment: **$11,092,665,107,962** (Item 5.F.2.a = 5.F.2.c), submitted **2026-03-30** (FilingID 2070614); reaffirmed **2026-07-17** (FilingID 2111005, the current IAPD record — `advFilingDate` confirmed via IAPD API https://api.adviserinfo.sec.gov/search/firm/105958?hl=true&nrows=12&query=smith&r=25&sort=score+desc&wt=json). Source archive: https://reports.adviserinfo.sec.gov/reports/foia/advFilingData/2026/ADV_Filing_Data_20260301_20260331.zip (and 20260701_20260731.zip).
   - Prior point (in repo fact base): filed 2025-12-22, **$10,246,596,045,633** as of 2025-09-30. Historical ADV archive covers filing years 2023–2024 (repo `adv-timeseries.json`).
   - ⚠️ Limitations: regulatory adviser scope (not corporate AUM); archive does not expose the AUM valuation date; also Item 5.F.2.d "number of clients" (212→228 in 2026 filings) is a regulatory client count, **not** the "50M+ investors" figure.
   - IAPD firm summary page: https://adviserinfo.sec.gov/firm/summary/105958 (SPA; data via the API above).

2. **Vanguard corporate — Facts and figures** (https://corporate.vanguard.com/content/corporatesite/us/en/corp/why-vanguard/who-we-are/facts-and-figures.html, page dated 2026-06-23): publishes **487 funds** (as of Jun 30, 2026), **50M+ investors** (as of Dec 31, 2025), **0.07%** asset-weighted average U.S. combined mutual fund and ETF expenses — but **no current firm AUM** (AUM was last published on vanguard.com for Mar 31, 2022, per repo asset 01/fact-base). Wayback captures provide the historical operating-facts series (already in the repo fact base).

3. **Fund filings (N-CSR/N-PORT/N-1A, EDGAR)** — fund-level net assets, expenses, and advisory-fee lines for bottom-up aggregation. Fund scope only; repo ticket 03 excludes using this as "Vanguard revenue".

4. **Vanguard press releases / CEO letter** — occasionally state asset milestones (e.g., $10T milestone coverage mid-2025) but no consistent firm-level AUM/flows series.

**What must be web-scoured (no first-party source):**
- Firm-level net flows / organic growth — no Vanguard disclosure; third-party trackers (ETF.com, Morningstar, Bloomberg, media interviews) are the only route; each estimate needs a dated citation and a "triangulated" tag.
- Firm-level AUM mix by asset class / client type — not published; fund-level data only.
- Firm revenue — not published; media-reported estimates exist but are not primary; the repo already holds Vanguard revenue as explicit `not-published` gaps.
- Customer experience signals — app-store ratings/social, web-scoured for all firms.

---

## 4. Key risks & conflicts list

1. **BlackRock AUM total is a rounding artifact.** 14,038 = sum of rounded product lines; the exact primary total is **$14,041,518M** (10-K + Q4 2025 release tables). Displaying 14,038 without the exact total preserves an internally inconsistent number.
2. **The task prompt's "FY2025 AUM at Dec 31, 2025 ≈ $11.98T" is not supported by any BlackRock disclosure found.** BlackRock's Q4 2025 earnings release (2026-01-15) and FY2025 10-K report record AUM of **$14.0T at Dec 31, 2025** (Reuters/Bloomberg, 2026-01-15, also headline "$14 trillion"; Q3 2025 was $13.5T per the Q3 release). The sketch's ~14,038 is correct per primary sources; "$11.98T" appears to be a misattributed earlier-2025 quarter figure — **do not "correct" the sketch down to ~12T**.
3. **Vanguard 11,092 vs repo fact base 10.2466 — not a conflict, but a newer filing.** The repo's 2025 point is the 2025-12-22 ADV filing (as of 2025-09-30); the sketch uses the 2026 annual amendment (filed 2026-03-30). Both are Item 5.F.2 regulatory AUM. If the site adds the sketch's number, it should be a new series point (filing year 2026) with the same `display-only-regulatory-aum` classification and an explicit "valuation date not published in the ADV archive" caveat.
4. **State Street "Revenue 14" conflicts with the repo's canonical SSGA measure ($2.634B).** 14 = parent consolidated FY2025 revenue ($13,944M); the repo isolates the Investment Management segment (10-K Table 14, $2.634B, +12.4% YoY). A "State Street (SSGA)" column showing 14 (and 7% growth) mixes parent economics into an SSGA-labeled cell — violates the repo's `firmMeta` segment-isolation note. Either relabel as parent scope with flags or use the segment value.
5. **State Street "AUA" is a servicing metric, not SSGA.** $53.8T = assets under custody and/or administration (parent). Keep it visually distinct from AUM; the sketch's own column header "State Street (SSGA)" is fine only if cells are individually scoped.
6. **State Street flows: 180 vs 181.** Quarterly components sum to exactly 180 (presentation 99.3), while the same deck's prose says $181B FY2025. Minor; pick one and footnote.
7. **"Revenue/Average AUM" label is wrong.** Verified values are revenue ÷ **period-end** AUM (0.172% BLK, 0.246% STT). Rename or recompute with a true average; also note the ratio mixes parent revenue (STT) with SSGA AUM.
8. **BlackRock revenue-mix is a re-presentation, not BlackRock's own table.** The 10-K separates performance fees; the sketch folds them into product lines (which is why Alternatives is 4,272, not 3,019). Acceptable if disclosed as author-computed from the 10-K note; growth %s are author-computed (active multi-asset is +6.5%, shown as +7%).
9. **BlackRock "22% AUM growth" and "19% revenue growth" are total growth, not organic.** FY2025 organic base fee growth was 9%; label the rows to avoid implying organic growth.
10. **State Street AUM-mix presentation changed in Q1 2026** (new "Index / Active, Alternatives and Other / Cash" organization; the asset-class view is retained only as a supplemental). The sketch's Table-6-based mix is valid for Dec 31, 2025, but a 5-year series must not silently mix the two presentations.
11. **Fidelity $7.1T is voluntary, media-traced, and definition-sensitive.** Dated coverage (Bloomberg/Financial Planning/ThinkAdvisor, 2026-03-02; AdvisorHub via financialadvisortransitions, 2026-03-04) reports Fidelity's annual filing: AUM $7.1T (2024: $5.9T), revenue $37.7B (+15%), ~$18T managed+administered. Fidelity's own about page (Wayback 2026-03-16 capture) instead shows "$6.8T total discretionary assets" and "$17.5T assets under administration" as of **Sept 30, 2025** — so "AUM vs discretionary vs managed assets vs AUA" are different Fidelity measures. Any Fidelity cell needs the exact measure, as-of date, and a `voluntary` tag; the first-party URL (fidelity.com) is bot-blocked (403), so today the citation chain is press→Fidelity annual filing.
12. **Vanguard ADV "clients" is not the 50M investors figure.** Item 5.F.2.d shows 212–228 (regulatory client count); the repo's "50M+ investors" comes from facts-and-figures. Do not conflate if client-mix rows are ever added.
13. **AUM-mix "0.0%" placeholders for Vanguard/Fidelity are gaps, not zeros.** The sketch shows Vanguard & Fidelity asset-class mix as mostly 0.0%; these should render as `not-published` gaps, matching the repo's no-invented-numbers rule.
14. **Cross-firm flow comparability.** BlackRock's 698 includes cash management (131) and GIP/HPS-related flows; State Street's 180 is SSGA only; scopes differ — add a per-firm scope note on the flows row.
15. **No first-party customer-experience data exists for any firm** — the row must be web-scoured (app-store ratings, social signals) with retrieval dates, or left a gap.

---

### Source index (all retrieved 2026-08-14)

**BlackRock**
- Q4 2025 earnings release, 8-K Ex 99.1, filed 2026-01-15: https://www.sec.gov/Archives/edgar/data/2012383/000119312526013503/blk-ex99_1.htm
- FY2025 10-K, filed 2026-02-25: https://www.sec.gov/Archives/edgar/data/2012383/000119312526071966/blk-20251231.htm
- Q3 2025 earnings release, filed 2025-10-14: https://www.sec.gov/Archives/edgar/data/2012383/000119312525237960/blk-ex99_1.htm
- Q1 2025 10-Q: https://www.sec.gov/Archives/edgar/data/2012383/000095017025065838/blk-20250331.htm
- Media corroboration of $14T (2026-01-15): Reuters https://www.reuters.com/business/blackrock-fourth-quarter-profit-rises-etf-inflows-index-fund-demand-2026-01-15/ ; Bloomberg https://www.bloomberg.com/news/articles/2026-01-15/blackrock-total-assets-hit-record-14-trillion-as-etfs-surge

**State Street**
- Q4 2025 earnings release, 8-K Ex 99.1, filed 2026-01-16: https://www.sec.gov/Archives/edgar/data/93751/000009375126000008/a4q25earningspressrelease.htm
- Q4 2025 supplemental, Ex 99.2: https://www.sec.gov/Archives/edgar/data/93751/000009375126000008/exhibit992-4q25earningsrel.htm
- Q4 2025 earnings presentation, Ex 99.3: https://www.sec.gov/Archives/edgar/data/93751/000009375126000008/stt4q25earningspresentat.htm
- FY2025 10-K, filed 2026-02-19: https://www.sec.gov/Archives/edgar/data/93751/000009375126000124/stt-20251231.htm
- Q2 2026 earnings release + supplemental, 8-K filed 2026-07-16: https://www.sec.gov/Archives/edgar/data/93751/000009375126000387/a2q26earningspressrelease.htm ; .../exhibit992-2q26earningsrel.htm
- Q1 2026 earnings release, filed 2026-04-17: https://www.sec.gov/Archives/edgar/data/93751/000009375126000184/a1q26earningspressrelease.htm

**Vanguard**
- SEC Form ADV filing-data archive (March 2026 and July 2026 zips, CRD 105958 rows): https://reports.adviserinfo.sec.gov/reports/foia/advFilingData/2026/ADV_Filing_Data_20260301_20260331.zip ; https://reports.adviserinfo.sec.gov/reports/foia/advFilingData/2026/ADV_Filing_Data_20260701_20260731.zip
- IAPD firm record API (advFilingDate 07/17/2026): https://api.adviserinfo.sec.gov/search/firm/105958?hl=true&nrows=12&query=smith&r=25&sort=score+desc&wt=json
- IAPD firm summary: https://adviserinfo.sec.gov/firm/summary/105958
- Vanguard facts and figures (current page, 2026-06-23): https://corporate.vanguard.com/content/corporatesite/us/en/corp/why-vanguard/who-we-are/facts-and-figures.html

**Fidelity**
- Bloomberg, "Fidelity Managed Assets Hit $7.1 Trillion, Revenue Jumps 15%", 2026-03-02: https://www.bloomberg.com/news/articles/2026-03-02/fidelity-managed-assets-hit-7-1-trillion-revenue-jumps-15
- Financial Planning, "Fidelity says managed assets hit $7.1 trillion in 2025", 2026-03-02: https://www.financial-planning.com/articles/fidelity-says-managed-assets-hit-7-1-trillion-in-2025
- ThinkAdvisor, "Fidelity Managed Assets Top $7T, Revenue Jumps 15%", 2026-03-02: https://www.thinkadvisor.com/2026/03/02/fidelity-managed-assets-top-7t-revenue-jumps-15/
- Boston Globe, "Fidelity Investments sees record revenue in 2025", 2026-03-02: https://www.bostonglobe.com/2026/03/02/business/fidelity-investments-record-revenue-2025/
- AdvisorHub via Financial Advisor Transitions (annual-filing specifics: AUM $7.1T vs $5.9T; revenue $37.7B +15%; ~$18T managed+administered), 2026-03-04: https://www.financialadvisortransitions.com/blog/fidelity-posts-record-year-as-assets-reach-71-trillion
- Fidelity about page (Wayback capture 2026-03-16; $17.5T AUA / $6.8T discretionary as of 2025-09-30): https://web.archive.org/web/20260316112840/https://www.fidelity.com/about-fidelity/our-company

**Repo cross-check**
- `src/data/fact-base.ts` (read 2026-08-14) — Vanguard ADV 2025 point, BlackRock revenue series, State Street segment-revenue series, Fidelity voluntary-only convention, verification-tag vocabulary.
- `.scratch/vanguard-intelligence/efforts/data-rich-fact-base/assets/03-vanguard-regulatory-aum-2025.md`, `01-public-source-coverage.md`, `.scratch/vanguard-intelligence/assets/02-peer-universe.md` — repo's prior source-landscape findings (consistent with this report).
