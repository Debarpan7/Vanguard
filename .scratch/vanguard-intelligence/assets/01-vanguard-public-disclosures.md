# Vanguard — public financial disclosures (research asset for ticket 01)

- **Date of research:** 2026-08-11
- **Scope:** What financial data Vanguard publishes publicly, with 5-year coverage (latest fiscal year back ~5 years, i.e. ~2021–2025 / most recent 5 reported fiscal years).
- **Owned by:** `.scratch/vanguard-intelligence/issues/01-research-vanguard-disclosures.md`

## Method & verification legend

| Legend tag | Meaning |
|---|---|
| ✅ **VERIFIED-FROM-URL** | Data read directly from the cited page (live or Wayback Machine snapshot) during this research session. |
| ⚠️ **UNVERIFIED** | From general knowledge only; no primary page read this session. Treat as a lead, not a fact. |
| 📄 **PDF-NOT-READ** | The primary document exists at the cited URL but is a PDF the fetcher could not extract text from. |
| 🚫 **BLOCKED/UNAVAILABLE** | The route was tried and failed (HTTP 301/403/404, bot CAPTCHA, or API Forbidden). |

**Key structural finding:** Vanguard is a privately held, client-owned mutual company (not a public corporation). It does **not** file a 10-K and publishes **no firm-level annual report, income statement, balance sheet, or cash-flow statement**. Its regulatory disclosure vehicle for firm-level AUM is **Form ADV on the SEC IAPD**, not EDGAR. Everything below is consistent with that regime.

---

## 1. Sources

| Source name | What it contains | URL | Notes |
|---|---|---|---|
| Vanguard corporate — "Facts and figures" (current page) | Headline stats: 465 funds worldwide (228 US incl. variable annuity portfolios + 237 non-US, as of Feb 28, 2026); 50M+ investors (as of Dec 31, 2025); 0.07% asset-weighted avg US fund expenses (share of 2025 avg net US assets, as of Dec 31, 2025, sources Vanguard & Morningstar); ~20,000 crew (as of Dec 31, 2025); ownership footnote ("Vanguard is owned by its funds, which are owned by Vanguard's fund shareholder clients"); CEO Salim Ramji | https://corporate.vanguard.com/content/corporatesite/us/en/corp/why-vanguard/who-we-are/facts-and-figures.html | ✅ VERIFIED-FROM-URL. Page is new since the 2026 site redesign (first Wayback capture Feb 2026). **Note: no AUM figure on this page.** |
| Vanguard corporate — "Facts and figures" (Wayback captures, 2022–2026) | Yearly snapshots of the same page under its older URL: funds, investors, expense ratio, crew, CEO | https://web.archive.org/web/20220117222753/https://corporate.vanguard.com/content/corporatesite/us/en/corp/who-we-are/sets-us-apart/facts-and-figures.html (also captures 20220504030848, 20221225104159, 20230306194918, 20231020161441, 20241213021319, 20251210222027) | ✅ VERIFIED-FROM-URL. This is the backbone of the 2021–2025 time series (see Metrics table). **AUM tile present in Jan 2022 ($8.0T, as of Sep 30, 2021) and May 2022 ($8.1T, as of Mar 31, 2022) captures; removed from the page thereafter** (absent in all Dec 2022 → 2026 captures). |
| Vanguard — "Fast facts" (about.vanguard.com, Wayback) | Snapshot captured Sep 2, 2021 of a page showing data as of Jan 31, 2021: ~$7.2T global AUM; ~209 US + ~232 non-US funds; 30M+ investors in ~170 countries; 0.09% avg expense ratio (US asset-weighted, share of 2020 avg net assets); ~17,300 crew; CEO Mortimer J. Buckley; HQ Valley Forge, PA | https://web.archive.org/web/20210902071520/https://about.vanguard.com/who-we-are/fast-facts/ (157 captures Oct 2014 – Sep 2021) | ✅ VERIFIED-FROM-URL. Old about.vanguard.com domain was decommissioned in 2022 (paths now 301 to corporate homepage); this snapshot is the cleanest 2021 firm-level data point. |
| Vanguard — CEO letter to investors (May 1, 2026) | Qualitative + selective financial commentary: avg annual fund operating cost 0.06% ($6 per $10,000) vs industry 0.44%; ~$600M estimated investor savings from 2025+2026 fee cuts; record net new assets in 2025; 93% of investors stayed invested during April 2025 tariff volatility (5:1 buy:sell); 45% of 401(k) investors raised contribution rates; avg retirement savings rate at all-time high 12% of income; 22M+ equity index fund investors in Investor Choice; 500K+ Cash Plus accounts; $515B+ actively managed bond funds and $1.5T+ bond index funds (as of Mar 31, 2026); multibillion-dollar tech modernization investment (qualitative) | https://corporate.vanguard.com/content/corporatesite/us/en/corp/articles/salim-letter-to-investors-2026.html | ✅ VERIFIED-FROM-URL. No firm revenue/profit figures. Note: "0.06%" here vs "0.07%" on facts-and-figures — see Cost ratios row. |
| Vanguard pressroom — press release (Feb 2, 2026) | $250M fee reductions in 2026 (84 share classes across 53 funds); ~$600M total 2025+2026 savings, "largest-ever two-year combined cost reduction"; fund-lineup avg expense ratio 0.06%; 84% of funds outperformed Lipper peer-group averages over 10 yrs (275 of 326 funds) incl. 88% of active fixed income (42 of 48); footnote: "Comparison uses AUM as of December 31, 2025" (no number stated) | https://corporate.vanguard.com/content/corporatesite/us/en/corp/who-we-are/pressroom/press-release-vanguard-to-deliver-more-than-half-a-billion-in-expected-savings-to-investors-since-2025-020226.html | ✅ VERIFIED-FROM-URL. Confirms fee-savings math methodology (savings = prior-year-end AUM × reduced expense ratio). |
| SEC IAPD — Form ADV firm summary (The Vanguard Group, Inc.) | Regulatory registration record: CRD # 105958 / SEC# 801-11953, registered 8/23/1976, ACTIVE, Malvern PA; links to latest Form ADV PDF and Part 2 brochures | https://adviserinfo.sec.gov/firm/summary/105958 | ✅ VERIFIED-FROM-URL (summary page). 📄 PDF-NOT-READ: the ADV itself — https://reports.adviserinfo.sec.gov/reports/ADV/105958/PDF/105958.pdf — could not be extracted ("Failed to extract meaningful content"). **The ADV is the regulatory AUM source (annual, ~Dec 31 each year) but was not readable this session.** |
| SEC IAPD — search API | Entity registry: 22 "vanguard" hits incl. Vanguard Group Inc (105958), Vanguard Advisers Inc (106715, ~2,120 branches), Vanguard Marketing Corp (broker-dealer 8-28207), Vanguard Global Advisers LLC (164593), inactive international entities | https://api.adviserinfo.sec.gov/search/firm?query=vanguard | ✅ VERIFIED-FROM-URL. 🚫 The per-firm detail API (https://api.adviserinfo.sec.gov/firm/105958) returns HTTP 403 Forbidden. |
| SEC EDGAR | CIK browse: The Vanguard Group, Inc. (CIK 0001305589, Malvern PA); London entity 0001680208. Fund-level filings (N-CSR, prospectuses) exist for each Vanguard fund | https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001305589 | ✅ VERIFIED-FROM-URL (entity browse). **No firm-level 10-K/10-Q on EDGAR** — confirms non-filer status. |
| Vanguard fund-level annual reports (examples) | Financial statements of individual Vanguard funds (net assets, expense ratios, advisory fees paid) — describe the **funds**, not The Vanguard Group, Inc. | e.g. https://fund-docs.vanguard.com/lifestrategy-annual-report.pdf; https://personal1.vanguard.com/funds/ncsr/NCSR103.pdf | 📄 PDF-NOT-READ (URLs verified to exist; contents not read this session). Not usable as firm financials; usable only as a bottom-up proxy (see Gaps). |
| Vanguard Investment Stewardship annual reports | Voting and engagement reports, not financial statements | e.g. https://corporate.vanguard.com/content/dam/corp/advocate/investment-stewardship/pdf/policies-and-reports/investment_stewardship_2023_annual_report.pdf | 📄 PDF-NOT-READ this session. Not financial data. |
| Search engines (Bing, DuckDuckGo, Mojeek) | — | — | 🚫 BLOCKED (Bing 403; DDG bot CAPTCHA; Mojeek Altcha CAPTCHA). Wayback CDX API was used as the discovery fallback and worked. |

---

## 2. Metrics disclosed

| Metric | Source | Years available | Notes |
|---|---|---|---|
| **AUM** | Facts-and-figures (old URL, Wayback) | **2021 & H1 2022 only** | ~$7.2T as of Jan 31, 2021 (fast-facts) → $8.0T as of Sep 30, 2021 → $8.1T as of Mar 31, 2022. **Vanguard stopped publishing firm AUM on this page after mid-2022** (tile removed; absent in every capture through Feb 2026, incl. current page). Regulatory AUM lives in Form ADV (📄 PDF-NOT-READ this session). Feb 2026 press release references "AUM as of December 31, 2025" without stating it. **AUM for FY2022–FY2025 is effectively unpublished on vanguard.com** — must come from Form ADV or secondary sources. |
| **Clients (investors)** | Facts-and-figures / fast-facts | 2021–2025 | 30M+ investors in ~170 countries (as of Jan 31, 2021) → 30M+ (2021–early 2023) → **50M+ (as of Dec 31, 2022, per Oct 2023 page) and 50M+ for Dec 31, 2023/2024/2025**. ⚠️ The 30M+→50M+ jump between the Jan 31, 2023 and Dec 31, 2022 reference dates is too large for organic growth — strongly suggests a **methodology/counting change in 2023** (UNVERIFIED inference; the page does not explain it). |
| **Revenue by source** | — | **Not disclosed** | No firm revenue figures published anywhere found. Fund-level N-CSR filings show advisory fees paid **to** Vanguard per fund, so a bottom-up revenue proxy is theoretically constructible (see Gaps). |
| **Expenses (firm-level)** | — | **Not disclosed** | No firm-level operating expense line published. Only fund-level expense ratios (see Cost ratios) and fee-reduction announcements. |
| **Net income** | — | **Not disclosed** | No income statement published. Fund-level statements show fund net investment income, not firm profit. |
| **Equity / retained earnings** | — | **Not disclosed** | No balance sheet published. Client-owned structure means no external shareholders; no equity accounts disclosed. |
| **Cost ratios** | Facts-and-figures / fast-facts / press release / CEO letter | 2020–2025 | Asset-weighted avg US fund expenses as share of prior-year avg net US assets: **0.09%** (2020, 2021) → **0.08%** (2022, 2023) → **0.07%** (2024, 2025). Feb 2026 press release & CEO letter cite **0.06%** avg for the fund lineup ($6 per $10,000) vs industry 0.44% — ⚠️ the 0.06% vs 0.07% discrepancy is not fully explained on the pages; the "all share classes vs US asset-weighted" reading is an UNVERIFIED inference (the pages do not state it) — compare like-for-like before quoting. |
| **Employees (crew)** | Facts-and-figures / fast-facts | 2021–2025 | ~17,300 (Jan 2021) → 17,300 (Sep 2021) → 18,800 (Mar 2022 / Dec 31, 2021) → 20,000 (Dec 31, 2022 – Dec 31, 2025, "~20,000" in 2025). |
| **Fund count** | Facts-and-figures / fast-facts | 2021–2026 | ~441 (Jan 2021: 209 US + 232 non-US) → 417 (Sep 30, 2021) → 410 (Mar 31, 2022) → 431 (Nov 30, 2022 & Jan 31, 2023) → 430 (Aug 31, 2023) → 426 (Oct 31, 2024) → 452 (Oct 31, 2025) → 465 (Feb 28, 2026). |
| **CEO / leadership** | Facts-and-figures / fast-facts | 2021–2026 | Mortimer J. Buckley (Chairman & CEO, 2021) → Tim Buckley (CEO & chairman, 2022–2023 captures) → Salim Ramji (CEO from July 2024; page shows Ramji by Dec 2024). |
| **Ownership structure** | Facts-and-figures / press releases | 2021–2026 | Consistent footnote: "Vanguard is investor-owned — fund shareholders own the funds, which in turn own Vanguard" (older wording) / "Vanguard is owned by its funds, which are owned by Vanguard's fund shareholder clients" (current). No ownership equity percentages or capital accounts published. |
| **Fee savings / performance claims** | Press release (Feb 2026), CEO letter (May 2026) | 2025–2026 | ~$600M combined 2025+2026 fee savings; $250M in 2026 (53 funds); 84% of funds beat Lipper peer averages over 10 yrs (275/326, period ended Dec 31, 2025); active fixed income: 88% beat over a decade (press release, 42 of 48 funds) vs 86% (CEO letter — ⚠️ different measure or cutoff, not explained on either page). Qualitative and selective; not audited financials. |

---

## 3. Gaps

1. **Segment / line-of-business profitability** — Not published. Vanguard offers advice, retirement, brokerage, and fund products but discloses no revenue or profit split by business line. (Only the fee-savings press release and CEO letter give directional color.)
2. **Technology spend** — Not published. Only qualitative: CEO letter cites "record investments in client experience" / "multibillion-dollar tech modernization" with no dollar figure, no capex/opex split.
3. **Client-owned equity treatment** — The ownership footnote is qualitative only. No balance sheet, no equity accounts, no capital structure, no treatment of retained earnings (profits are implicitly reinvested or rebated via fee reductions, but the mechanics are not disclosed). Fee cuts (~$600M) are the observable "rebate" channel.
4. **RoE analysis needs** — **RoE = Net income ÷ Equity cannot be computed from published data**, because Vanguard publishes neither net income nor equity. Any RoE work for tickets 05/06 must either (a) use an alternative profitability proxy (fund-level advisory fees − estimated costs), (b) use secondary estimates (⚠️ UNVERIFIED), or (c) be reframed as cost-ratio/expense-ratio analysis, which *is* well covered by the published data.
5. **Other gaps**
   - **Firm AUM, FY2022–FY2025:** unpublished on vanguard.com after Mar 31, 2022. Regulatory AUM exists in Form ADV (📄 PDF-NOT-READ this session — `https://reports.adviserinfo.sec.gov/reports/ADV/105958/PDF/105958.pdf`; recommend manual download/OCR for ticket 03 metrics work).
   - **Revenue reconstruction:** possible only bottom-up by aggregating per-fund "investment advisory fees" disclosed in fund N-CSR/annual reports — labor-intensive, and fees paid by funds ≠ total firm revenue (excludes advice, brokerage, retirement-plan administration revenue).
   - **Investor-count series discontinuity:** 30M+ → 50M+ (2023) without explanation — treat the client-count series as two regimes, not one trend.
   - **Expense-ratio definitions:** 0.06% vs 0.07% appear in different 2026 pages; also older footnotes used "Vanguard, Morningstar and Lipper" while newer use "Vanguard and Morningstar" — compare like-for-like before charting.
   - **Historical depth:** about.vanguard.com fast-facts only runs through Sep 2021; older pre-2021 snapshots exist (back to Oct 2014) if a longer AUM history is ever needed.

---

### Sources that could not be fetched this session (explicit)

- **Form ADV PDF** (`https://reports.adviserinfo.sec.gov/reports/ADV/105958/PDF/105958.pdf`) — PDF-NOT-READ (fetcher could not extract text). This is the single most valuable unread source: it holds Vanguard's regulatory AUM and client counts for 2022–2025.
- **IAPD firm detail API** (`https://api.adviserinfo.sec.gov/firm/105958`) — HTTP 403 Forbidden (search endpoint works).
- **Bing / DuckDuckGo / Mojeek** — blocked by 403/CAPTCHA; Wayback CDX API used instead.
- **about.vanguard.com investor-relations paths** — all 301-redirect to the corporate homepage (no IR section ever existed on the old site).
- **Wayback 301/403 captures** of the corporate facts-and-figures URL were skipped in favor of 200-status captures (listed in Sources).

**Bottom line for ticket 01:** Vanguard publicly discloses *headline* firm metrics (AUM only through H1 2022, fund/investor/crew counts, expense ratios, CEO) but **no audited firm-level financial statements — revenue, expenses, net income, or equity are all unpublished**. The 5-year window 2021–2025 is fully covered for cost ratios, fund counts, client counts (with the 2023 methodology break), and employees; AUM coverage stops at Mar 31, 2022 and must be filled from Form ADV (PDF, unread this session) or clearly-labeled secondary estimates.
