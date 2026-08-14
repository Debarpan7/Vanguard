# ADV Advisory-Landscape — SEC Form ADV data for the "Advisory business" comparison

- **Date of research:** 2026-08-14 (all URLs retrieved on this date)
- **Scope:** Which SEC-registered advisers to compare against Vanguard (CRD 105958) for a new "Advisory business" site section; the exact Form ADV Part 1A Item 5 / Part 2A data structure to use; and how to retrieve the data at scale (bulk archives + the repo's existing pipeline).
- **Deliverable location:** this file (`.scratch/working/adv-advisory-landscape.md`); no source files were modified.
- **Relation to repo:** extends the existing ADV pipeline (`data/adviserinfo/adv-2025.json`, `scripts/generate-adv-raw.mjs`, `scripts/generate-adv-timeseries.mjs`, `scripts/adv-timeseries-lib.mjs`) from Vanguard-only targets to a multi-firm advisory set.

## Method & verification legend

| Tag | Meaning |
|---|---|
| ✅ **VERIFIED** | Read directly from the cited primary source (SEC/IAPD page, bulk archive, form PDF) during this session. |
| ⚠️ **UNVERIFIED** | From general knowledge or secondary sources only; treat as a lead, not a fact. |
| 🚫 **BLOCKED** | Route tried and failed this session (HTTP 403/404, SPA not renderable). |
| ❓ **CANNOT-CONFIRM** | Could not be verified from any accessible primary source this session. |

Firm presence was verified two independent ways: (1) the IAPD firm-search API (`https://api.adviserinfo.sec.gov/search/firm?query=…`, ✅ verified working) which returns CRD numbers (`firm_source_id`), SEC file numbers and registration scope, and (2) matching rows in the SEC monthly bulk archives (`IA_ADV_Base_A_*.csv`), keyed on column `1E1` (CRD number, ✅ verified). Note: the IAPD profile page URL pattern `https://adviserinfo.sec.gov/firm/summary/{CRD}` returns the same SPA shell (HTTP 200, ~9 KB) even for bogus CRDs, so HTTP 200 on that page alone does **not** confirm an entity; use the search API or bulk CSV rows instead.

---

## 1. Named candidates — confirm registration, CRD, IAPD profile

All five named candidates are SEC-registered investment advisers with public IAPD profiles. CRDs verified via the IAPD search API and (where noted) via rows in the bulk archives. The "RAUM 5F2(c)" column shows the total regulatory AUM reported in Item 5.F.(2)(c) of the firm's March 2026 filing (annual updating amendment, fiscal year 2025) where a row matched in `ADV_Filing_Data_20260301_20260331.zip` — evidence the firm appears in the bulk pipeline (values in USD).

| Firm | Registered-adviser entity (Item 1.A legal name) | CRD (`1E1`) | SEC file no. (`1D`) | IAPD profile URL | Confirm present | RAUM 5F2(c), Mar-2026 bulk filing (USD) |
|---|---|---|---|---|---|---|
| **Vanguard (subject)** | THE VANGUARD GROUP, INC. (parent adviser; fund advisory) | 105958 | 801-11953 | https://adviserinfo.sec.gov/firm/summary/105958 | ✅ search API ACTIVE + ✅ Dec-2025 & Mar-2026 bulk rows | 10,246,596,045,633 |
| Vanguard (advice arm) | VANGUARD ADVISERS, INC. (the retail/advice entity) | 106715 | 801-49601 | https://adviserinfo.sec.gov/firm/summary/106715 | ✅ bulk rows (also in repo `adv-2025.json`) | 300,434,933,763 |
| Vanguard (other) | VANGUARD GLOBAL ADVISERS, LLC; VANGUARD CAPITAL MANAGEMENT, LLC; VANGUARD PORTFOLIO MANAGEMENT, LLC | 164593; 338002; 338003 | 801-76825; 801-134586; 801-134587 | …/firm/summary/164593 etc. | ✅ search API ACTIVE (in repo targets) | — |
| **BlackRock** | BLACKROCK ADVISORS, LLC | 106614 | 801-47710 | https://adviserinfo.sec.gov/firm/summary/106614 | ✅ search API ACTIVE + ✅ bulk rows (already in repo) | 1,096,122,604,226 |
| **PIMCO** | PACIFIC INVESTMENT MANAGEMENT COMPANY LLC | 104559 | 801-48187 | https://adviserinfo.sec.gov/firm/summary/104559 | ✅ search API ACTIVE + ✅ Mar-2026 bulk row | 3,666,935,101,247 |
| **J.P. Morgan** | J.P. MORGAN INVESTMENT MANAGEMENT INC. | 107038 | 801-21011 | https://adviserinfo.sec.gov/firm/summary/107038 | ✅ search API ACTIVE + ✅ Mar-2026 bulk row | 3,519,414,511,755 |
| **Goldman Sachs** | GOLDMAN SACHS ASSET MANAGEMENT, L.P. | 107738 | 801-37591 | https://adviserinfo.sec.gov/firm/summary/107738 | ✅ search API ACTIVE + ✅ bulk rows (Dec-2025, Mar-2026) | 2,648,902,942,827 |

Related entities worth noting (multi-entity caveat, §5):
- **BlackRock** has several separate SEC-registered advisers, all ACTIVE per search API: BlackRock Fund Advisors (CRD 105247, 801-22609), BlackRock Investment Management, LLC (CRD 108928, 801-56972), BlackRock Realty Advisors Inc. (CRD 109457, 801-54217), BlackRock Capital Investment Advisors, LLC (CRD 290336, 801-112118), BlackRock Alternatives Management, LLC (CRD 288041, 801-110250).
- **J.P. Morgan**: J.P. Morgan Investment Management Inc. (107038) is the flagship IA; J.P. Morgan Securities LLC (CRD 79, 801-3702) is also IA-registered (broker-dealer + adviser). The dual-registrant **JPMorgan Chase Bank, N.A.** exists but its CRD could not be resolved via the search API this session ❓.
- **Goldman Sachs**: Goldman Sachs Asset Management, L.P. (107738) is the asset-management IA; Goldman Sachs & Co. LLC (CRD 361, 801-16048) is also IA-registered (the BD).

---

## 2. Recommended additional candidates (4)

These are among the largest US-registered advisers (by reported RAUM) and give a sensible advisory-comparison set — a mix of retail/wealth advice, fund advisory, and institutional advisory. Invesco (CRD 105360) and Fidelity Institutional Wealth Adviser (CRD 301896) are already in the repo's pipeline and can be kept as alternates.

| Firm | Registered-adviser entity | CRD | SEC file no. | IAPD profile URL | Confirm present | RAUM 5F2(c), Mar-2026 bulk filing (USD) | Why include |
|---|---|---|---|---|---|---|---|
| **Fidelity** | FIDELITY MANAGEMENT & RESEARCH COMPANY LLC (FMR — fund/advice adviser) | 108281 | 801-7884 | https://adviserinfo.sec.gov/firm/summary/108281 | ✅ search API ACTIVE + ✅ Mar-2026 bulk row | 5,685,041,930,529 | Largest registered adviser by RAUM in the set; retail + index + advice overlaps Vanguard; private firm (voluntary stats only — repo peer research asset 02) |
| **Morgan Stanley** | MORGAN STANLEY INVESTMENT MANAGEMENT INC. | 110353 | 801-15757 | https://adviserinfo.sec.gov/firm/summary/110353 | ✅ search API ACTIVE + ✅ Mar-2026 bulk row | 702,248,681,596 | Institutional/wealth asset management; distinct advisory-business profile vs. Vanguard |
| **T. Rowe Price** | T. ROWE PRICE ASSOCIATES, INC. | 105496 | 801-856 | https://adviserinfo.sec.gov/firm/summary/105496 | ✅ search API ACTIVE + ✅ Mar-2026 bulk row | 2,196,452,587,469 | Active-management contrast case; retirement franchise overlaps Vanguard |
| **Capital Group** | CAPITAL RESEARCH AND MANAGEMENT COMPANY (American Funds adviser) | 110885 | 801-8055 | https://adviserinfo.sec.gov/firm/summary/110885 | ✅ search API ACTIVE + ✅ bulk rows (Dec-2025, Mar-2026) | 3,753,542,800,892 | Private (no 10-K); retail fund + advice; good active/retail contrast |

Alternates / notes:
- **Morgan Stanley (wealth)**: the combined firm "MORGAN STANLEY" (successor to Morgan Stanley Smith Barney LLC) CRD 149777, SEC# 801-70103, ACTIVE — if the comparison is about *wealth/advice* rather than asset management, use this entity instead of MSIM, or both with the multi-entity caveat.
- **UBS**: UBS Financial Services Inc. (CRD 8174, 801-7163, ACTIVE — wealth advisory, RAUM 5F2(c) $915.8B in Mar-2026) and UBS Asset Management (Americas) LLC (CRD 106838, 801-34910, ACTIVE — RAUM $588.2B). Both verified in the Mar-2026 archive.
- **Northern Trust**: NORTHERN TRUST INVESTMENTS, INCORPORATED (CRD 105780, 801-33358, ACTIVE — RAUM $1,245.2B, Mar-2026 ✅). Custody/servicing-led parent (bank), so advisory comparison needs segment caveats.
- **Invesco** (CRD 105360) and **Fidelity Institutional Wealth Adviser** (CRD 301896) are already repo targets — reuse rather than re-add.
- **State Street — not recommended without entity resolution**: the repo's existing `state-street` target keys CRD 112861, but the bulk CSV rows for that CRD resolve to **STATE STREET GLOBAL ADVISORS LIMITED** (London) — a UK-registered entity now showing **INACTIVE** on IAPD — not the US "State Street Global Advisors, Inc.". No ACTIVE US SSGA IA entity surfaced in the search API this session; the US SSGA adviser business's current CRD ❓ CANNOT-CONFIRM. Drop SSGA from the advisory set, or resolve the current US entity first.

---

## 3. ADV data structure relevant to the comparison

Primary sources read this session: the current Form ADV Part 1A (`https://www.sec.gov/files/formadv-part1a_1.pdf`), the combined Form ADV index (`https://www.sec.gov/files/formadv.pdf`), the Part 2 form incl. Part 2A instructions (`https://www.sec.gov/files/formadv-part2_0.pdf`), and the actual column headers of `IA_ADV_Base_A_20251201_20251231.csv` (243 columns) from the Dec-2025 bulk archive.

### 3.1 Form ADV Part 1A Item 5 — exact structure (verified from the form)

| Form item | Content | Bulk-CSV column(s) | Repo JSON field(s) in `adv-2025.json` |
|---|---|---|---|
| 5.A | Number of employees (full+part-time, no clerical) | `5A` | `adviser.employees` |
| 5.B(1)–(6) | Employees by function (advisory, BD reps, state reps, other's reps, insurance agents, solicitors) | `5B1`…`5B6` | `adviser.employeeFunctions.*` |
| 5.C(1), 5.C(2) | Clients **without** RAUM; % of clients that are non-US persons | `5C1`, `5C2` | not mapped in repo |
| 5.D(1)(a)–(n) | **Number of clients by type** (14 categories) | `5D1a`…`5D1n` (+ `5D1n Other` free text) | `clientInformation[].clients` |
| 5.D(2)(a)–(n) | "Fewer than 5 clients" checkbox per category (only a,b,c,g,h,i,j,k,l,m,n — (d),(e),(f) excluded by form design) | `5D2a`…`5D2n` | not mapped in repo |
| 5.D(3)(a)–(n) | **Regulatory AUM attributable to each client type** (must sum to 5.F(2)(c)) | `5D3a`…`5D3n` | `clientInformation[].raumUsd` |
| 5.E(1)–(7) | Compensation arrangements checkboxes (AUM %, hourly, subscription, fixed, commissions, performance-based, other) | `5E1`…`5E7` (+`5E7-Other`) | not mapped in repo |
| 5.F(1) | Continuous/supervisory portfolio services? (Y/N) | `5F1` | not mapped |
| 5.F(2)(a)–(f) | **Discretionary $ (a) / non-discretionary $ (b) / total $ (c); accounts (d)/(e)/(f)** | `5F2a`…`5F2f` | `aumInformation.{discretionaryAmountUsd, nonDiscretionaryAmountUsd, totalAmountUsd, discretionaryAccounts, nonDiscretionaryAccounts, totalAccounts}` |
| 5.F(3) | RAUM attributable to non-US persons | `5F3` | not mapped |
| 5.G(1)–(12) | Types of advisory services (financial planning, portfolio mgmt for individuals/ICs/pools/institutions, pension consulting, selection of other advisers, etc.) | `5G1`…`5G12` | not mapped |
| 5.H | # clients receiving financial planning (buckets) | `5H` | not mapped |
| 5.I(1), 5.I(2)(a)–(c) | **Wrap-fee programs**: participation (Y/N); RAUM as sponsor (a) / portfolio manager (b) / both (c) | `5I1`, `5I2a`, `5I2b`, `5I2c` | not mapped |
| 5.J(1)–(2), 5.K(1)–(4), 5.L | Limited-investment advice; SMA borrowing/derivatives/custody concentration; marketing | `5J1`…`5L4` | not mapped |

**Client-type codes (a–n), identical to the repo's `clientTypes` in `scripts/generate-adv-raw.mjs` / `adv-timeseries-lib.mjs`:** (a) Individuals other than high net worth individuals, (b) High net worth individuals, (c) Banking or thrift institutions, (d) Investment companies, (e) Business development companies, (f) Pooled investment vehicles, (g) Pension and profit sharing plans, (h) Charitable organizations, (i) State or municipal government entities, (j) Other investment advisers, (k) Insurance companies, (l) Sovereign wealth funds and foreign official institutions, (m) Corporations or other businesses, (n) Other. Form note: "individuals" includes trusts, estates, and 401(k)/IRA of individuals; investors in a private fund you advise are **not** clients unless separately advised; pick one category per client to avoid double counting.

**Correction to the brief's framing:** in the current form, the discretionary/non-discretionary RAUM split is **Item 5.F(2)** (totals only, not by client type), and **Item 5.E** is compensation *arrangements* checkboxes. RAUM *by client type* is **Item 5.D(3)**. There is no per-client-type discretionary split in the form.

### 3.2 The `item5F totalAmountUsd` naming — ❓ CANNOT-CONFIRM

- The repo's `data/adviserinfo/adv-2025.json` does **not** contain `item5F`/`totalAmountUsd` keys — it uses the CSV-derived names (`5D1a`, `5D3a`, `5F2a`…`5F2f`, `rawFields`).
- The SEC bulk archives are **CSV-only** (101 files in the Dec-2025 zip; no JSON), so no `item5F` schema exists there.
- Grep of the IAPD site's main JS bundle and the sec-api.io docs page found no `item5F`/`totalAmountUsd` strings; the IAPD per-firm/filing JSON endpoints (`https://api.adviserinfo.sec.gov/firm/{crd}…`) return 403 from this environment 🚫.
- Conclusion: `item5F.totalAmountUsd`-style keys cannot be confirmed from any primary source this session; if that naming appears anywhere, it is an IAPD-web-internal or third-party mirror convention. Build the comparison on the verified CSV column names above.

### 3.3 Form ADV Part 2A brochure — items relevant to an advisory comparison (verified from `formadv-part2_0.pdf`)

Part 2A is a **narrative brochure filed as a PDF** — there are no standardized numeric fields for fees, minimums, or client counts; those numbers live in prose.

| Item | Content relevant to the comparison |
|---|---|
| Item 4 (Advisory Business) | 4.A firm description & principal owners; 4.B types of advisory services; 4.D **wrap-fee programs** (differences vs. other accounts; share of wrap fee received); 4.E **client assets managed discretionary vs. non-discretionary + "as of" date** — note: the method for "client assets you manage" *may differ* from Part 1A Item 5.F RAUM, and the as-of date must be ≤ 90 days before the brochure update |
| Item 5 (Fees and Compensation) | 5.A **fee schedule** (free text — AUM-based % schedules, hourly, fixed; whether negotiable; this is where AUM-based fee tiers are described); 5.B billing/deduction method; 5.C other client-paid fees (custody, fund expenses, brokerage); 5.D prepaid fees/refunds; 5.E compensation for securities sales (conflicts) |
| Item 6 | Performance-based fees and side-by-side management |
| Item 7 (Types of Clients) | Types of clients served; **minimum account size** requirements (only where the firm discloses them — many large institutional advisers state no minimum) |
| Item 8 | Methods of analysis, investment strategies, risk of loss |
| Item 9 | Disciplinary information |
| Item 10–18 | Affiliations; code of ethics; brokerage practices (12); account review (13); referrals (14); custody (15); discretion (16); proxy voting (17); financial information (18) |
| Item 19 | State-registered advisers only |
| Appendix 1 | **Wrap Fee Program Brochure** — services, wrap fee charged, fee schedule, negotiability, portion paid to portfolio managers (Part 2A Appendix 1 Item 4) |

Part 1A gives the **structured** advisory-business numbers (clients by type, RAUM by type, discretionary split, wrap RAUM by role in 5.I(2)); Part 2A gives the **qualitative** fee/minimum narrative. Fee *schedules* (e.g., % of AUM tiers, minimum account sizes) must be parsed from brochure text/PDFs — no machine-readable numeric fee fields exist in either part.

---

## 4. Retrieval recipe at scale

### 4.1 Bulk data sources (all URL patterns verified this session)

1. **Monthly filing archives, 2025 → present** (data after Jan 1, 2025 moved to the IAPD site per the SEC Form ADV Data page):
   `https://reports.adviserinfo.sec.gov/reports/foia/advFilingData/{YYYY}/ADV_Filing_Data_{startYYYYMMDD}_{endYYYYMMDD}.zip`
   - ✅ Verified: `…/2025/ADV_Filing_Data_20251201_20251231.zip` (5.7 MB) and `…/2026/ADV_Filing_Data_20260301_20260331.zip` (32.8 MB). HTTP 200 with a declared User-Agent.
   - Contents: 101 CSV files — `IA_ADV_Base_A_*.csv` (Part 1A core, 243 columns), `IA_ADV_Base_B_*.csv`, `IA_ADV_1J_1K_*.csv`, Schedule D tables, `ADV_Filing_Types_*.csv` (filing-type flags per FilingID), plus parallel `ERA_*` tables for exempt reporting advisers. **No JSON, no Part 2A text in these zips.**
2. **Historical archives, pre-2025** (used by `scripts/generate-adv-timeseries.mjs`):
   - `https://www.sec.gov/files/adv-filing-data-20111105-20241231-part1.zip` and `…-part2.zip` (2011-11-05 → 2024-12-31)
   - `https://www.sec.gov/files/adv-filing-data-20001019-20111104.zip` (2000–2011)
3. **Part 2A brochure PDFs, 2024** (monthly zips + a filing→PDF mapping):
   - `https://www.sec.gov/files/adv-brochures-2024-{month}.zip` (e.g., `adv-brochures-2024-december.zip`, 188 MB; March 2024 is split into `…/foia/docs/adv/adv_brochures_2024_mar_{1..10}_of_10.zip`)
   - Mapping: `https://www.sec.gov/files/adv-brochure-mapping-20240301-20240331.csv` with columns `FirmName, SECNumber, CRDNumber, FilingID, BrochureName, BrochureID, BrochureVersion, DateFiled, PDFFileName`; PDF filenames follow `{CRD}_{BrochureID}_{Version}_{YYYYMMDD}.pdf`.
   - **2025+ brochure bulk source: ❓ CANNOT-CONFIRM** — the new data page `https://adviserinfo.sec.gov/adv` is a JS SPA that this environment could not render; per-firm brochure PDFs are served from the "classic-reports" host `https://files.adviserinfo.sec.gov` (path pattern not confirmed; four guessed URL shapes all 404). The IAPD per-firm brochures API returned 403 here.
4. **IAPD search API** (handy for resolving names→CRDs): `https://api.adviserinfo.sec.gov/search/firm?query={name}` — ✅ verified; returns `hits.hits[]._source` with `firm_source_id` (**CRD**), `firm_ia_sec_number` / `firm_ia_full_sec_number` (SEC file no.), `firm_name`, `firm_other_names`, `firm_ia_scope` (ACTIVE/INACTIVE), addresses. (Note: the parameter is `query`, not `q`.) Per-firm endpoints (`/firm/{crd}`, `/firm/{crd}/brochures`) returned 403 from this environment 🚫.

### 4.2 Keying filings by CRD

- `IA_ADV_Base_A` column **`1E1` = CRD number** (✅ verified: Vanguard Group 105958, BlackRock Advisors 106614, GSAM 107738, Capital Research 110885, Invesco 105360…). This is how `generate-adv-timeseries.mjs` filters (`targetsByCrd.get(String(row["1E1"]))`).
- Column **`1D` = SEC file number** (`801-XXXXX`; ✅ verified: 801-11953, 801-47710…). This is the number shown on IAPD as the SEC file no.
- Other key columns: `FilingID` (unique filing key), `1A` (legal name), `1B1` (business name), `DateSubmitted` (submission timestamp, `MM/DD/YYYY HH:MM:SS AM/PM`), `Execution Type`.
- **Filing type classification**: join `ADV_Filing_Types_*.csv` on `FilingID`; columns flag `Initial SEC Registration Request`, `Annual Updating Amendment for Registered Adviser`, `Other-Than Anual Amendment For Registered Adviser` (SEC's header contains the typo "Anual"), ERA variants, and `Annual Updating Amendment Fiscal Year` (the fiscal year the annual amendment covers — ✅ verified: Mar-2026 annual amendments for T. Rowe Price, J.P. Morgan, GS, Northern Trust all carry fiscal year `2025`).

### 4.3 Filing date vs. effective/as-of date (the key quirk)

- `DateSubmitted` (bulk CSV) is the **submission** timestamp, not the data as-of date. Item 5 figures are snapshots **as of the adviser's most recently completed fiscal year end** (annual updating amendments are due within 90 days of fiscal year end — 17 CFR 275.204-1).
- ✅ Verified evidence: Vanguard Group's Dec-2025 filing was flagged "Other-Than Annual Amendment" but reports the same 5F2(c) total ($10,246,596,045,633) as its Mar-2026 annual amendment — same as-of date, different submission dates. Firms with Dec-31 fiscal years typically file their annual amendments in Q1 (PIMCO, JPM, MS, UBS, Fidelity, TROW, NT all appeared in the Mar-2026 archive but had **no** row in the Dec-2025 archive).
- The IAPD UI distinguishes receipt/effective dates (`effectiveDate` string present in the IAPD bundle; exact UI labels ❓ not verified from this environment). The bulk-data ground truth is: use `DateSubmitted` + `ADV_Filing_Types.Annual Updating Amendment Fiscal Year` to know *which fiscal year* a filing covers, and always compare filings with the **same as-of fiscal year end**.

### 4.4 Etiquette / rate limits

- SEC fair-access policy: **max 10 requests/second**, and declare a User-Agent in the format `Sample Company Name AdminContact@<domain>.com` — see `https://www.sec.gov/os/webmaster-faq` (✅ retrieved; the wording is in the EDGAR developer section but is the SEC's general programmatic-access policy).
- Observed this session: directory listings on `reports.adviserinfo.sec.gov` return 403, but **file URLs return 200 with a declared UA**; `api.adviserinfo.sec.gov/search/*` works; `api.adviserinfo.sec.gov/firm/*` 403 (host-level block). Use a descriptive UA + polite pacing (≥ ~100 ms between requests) on all SEC hosts.

### 4.5 How the repo's existing scripts do it (and the seams to extend)

- `scripts/generate-adv-raw.mjs` — single-month snapshot. Requires `ADV_SOURCE_DIR` pointing at an extracted monthly archive; reads `IA_ADV_Base_A_*.csv` via the `xlsx` package (CSV-as-spreadsheet); matches targets by **legal name (`1A`)** against a hard-coded list; emits `data/adviserinfo/adv-2025.json` + `adv-2025.xlsx`. Seam: name-matching is brittle for peers (e.g., "VANGUARD CAPITAL" collides with unrelated entities) and a single month misses firms that didn't file that month.
- `scripts/generate-adv-timeseries.mjs` + `scripts/adv-timeseries-lib.mjs` — historical series. Reads the part1 CSV (2011-2024) line-by-line with a hand-rolled CSV parser; filters by **CRD via `1E1`** against `historicalTargets`; `normalizeHistoricalRow` maps Item 5 fields into the shared shape; `selectAnnualLatest` keeps the latest filing per `crd:filingYear`. This is the pattern to replicate for the peer set: extend `historicalTargets` (and the raw target list) with the CRDs in §1–§2, keeping the 14 client-type codes and the 5F2a–f mapping.
- Data-quality note discovered in the existing data: the repo's `state-street` series (CRD 112861) actually tracks **STATE STREET GLOBAL ADVISORS LIMITED** (UK) — see §2/§5.

---

## 5. Comparability caveats

1. **Adviser-level, not firm-level.** RAUM/client counts are per registered legal entity. Multi-entity firms must be handled deliberately: BlackRock (6+ ACTIVE registered advisers: 106614, 105247, 108928, 109457, 290336, 288041), J.P. Morgan (107038 + J.P. Morgan Securities LLC 79 + JPMCB dual registrant ❓CRD unresolved), Morgan Stanley (MSIM 110353 vs. the combined wealth firm 149777), UBS (8174 + 106838), Vanguard (Group 105958 vs. Advisers 106715). Comparing one entity per brand silently misstates totals.
2. **RAUM ≠ total firm business.** Registered-adviser scope only. Bank/insurer parents (JPM, UBS, MS, NT) and multi-line firms (BlackRock's Aladdin tech, State Street/Northern Trust custody) have business far broader than the ADV entity; Part 2A fee schedules are **advisory-fee schedules, not firm revenue or profit** (no revenue/profit fields exist in Form ADV).
3. **Client types are standardized (good comparability), with real caveats.** 14 fixed categories; but 5.D(2) lets a firm check "fewer than 5 clients" instead of reporting small counts (blanks ≠ 0); private-fund investors are not clients unless separately advised; trusts/estates/401(k)/IRA count as individuals; firms pick one category per client. Also, a firm may leave 5.D(3) blank while reporting 5.F(2)(c) (e.g., Vanguard Group reports ~$10.2T in 5.F(2)(c) with 5.D largely zero/blank — its RAUM is concentrated in the investment-company/pooled categories; the retail *advice* business is Vanguard Advisers, 106715, ~$300B). Choose the Vanguard entity to match the comparison's purpose.
4. **As-of date alignment.** Item 5 numbers are fiscal-year-end snapshots; submission dates vary (annual amendments cluster in Q1 for Dec-31-FYE firms; other-than-annual amendments land year-round). Compare filings with the same fiscal-year-as-of (use `ADV_Filing_Types.Annual Updating Amendment Fiscal Year`), not the same submission month.
5. **Discretionary split is totals-only.** 5.F(2) gives discretionary/non-discretionary **totals** (amounts + accounts) but not by client type; 5.D(3) gives RAUM by type with no discretionary split. Any "discretionary by client type" claim cannot be sourced from ADV.
6. **Part 2A is unstructured.** Fee schedules (AUM-based tiers, minimum account sizes, negotiability) are narrative text in Item 5.A / Item 7; minimums are often not disclosed at all by large institutional advisers; wrap-fee economics live in Appendix 1 PDFs. Automated comparisons need text extraction + manual review; expect heterogeneous formats across firms.
7. **Wrap-fee programs.** Part 1A Item 5.I(2)(a)–(c) gives wrap RAUM by role (sponsor / portfolio manager / both) — numeric but role-specific; the brochure's fee-split detail is PDF-only.
8. **Entity-identity drift in the data.** The repo's `state-street` CRD 112861 resolves to the UK entity (SSGA Limited, now INACTIVE), and the IAPD search index's primary names can lag (SSGA Limited shown at CRD 112861). Always confirm entity identity via `1A`/`1E1` in the bulk CSVs, not brand names or search-API display names.
9. **Historical vs. current comparability.** Item 5 structure changed materially with the 2016 amendments (effective Oct 2017; e.g., 5.D(2) fewer-than-5 checkbox, 5.I(2) wrap roles); the pre-2017 historical CSV has a different column set for Item 5 (the repo's 2011–2017 series was still populated, but treat pre-2017 fields with care).
10. **Missing years/fields are gaps, not zeros** (repo convention in `adv-timeseries.json` notes): a firm with no row in a given month/archive simply didn't file then; null fields mean "not reported", and the repo's `pending-collection` status exists precisely to avoid inferring zeros.

---

## Sources (all retrieved 2026-08-14)

- SEC Form ADV Part 1A (current form): https://www.sec.gov/files/formadv-part1a_1.pdf ✅
- SEC Form ADV index: https://www.sec.gov/files/formadv.pdf ✅
- SEC Form ADV Part 2 (Part 2A instructions + brochure items, Appendix 1 wrap brochure): https://www.sec.gov/files/formadv-part2_0.pdf ✅
- SEC "Form ADV Data" page (data source split: 2025+ on adviserinfo.sec.gov/adv; historical CSVs; 2024 brochure zips + mapping): https://www.sec.gov/foia-services/frequently-requested-documents/form-adv-data ✅ (and mirror https://www.sec.gov/foia/docs/form-adv-archive-data.htm ✅)
- SEC fair-access / programmatic-access policy: https://www.sec.gov/os/webmaster-faq ✅
- IAPD search API: https://api.adviserinfo.sec.gov/search/firm?query=… ✅ (queried for every candidate; per-firm endpoints 🚫 403)
- IAPD profile URL pattern (SPA shell, presence not confirmable by HTTP 200 alone): https://adviserinfo.sec.gov/firm/summary/{CRD} ✅(pattern)
- IAPD bulk archives (verified downloads): https://reports.adviserinfo.sec.gov/reports/foia/advFilingData/2025/ADV_Filing_Data_20251201_20251231.zip ✅; https://reports.adviserinfo.sec.gov/reports/foia/advFilingData/2026/ADV_Filing_Data_20260301_20260331.zip ✅
- Historical archives (linked from the SEC Form ADV Data page): https://www.sec.gov/files/adv-filing-data-20111105-20241231-part1.zip ✅(linked, used by repo), https://www.sec.gov/files/adv-filing-data-20001019-20111104.zip ✅(linked)
- Brochure mapping CSV (2024): https://www.sec.gov/files/adv-brochure-mapping-20240301-20240331.csv ✅
- 2024 brochure zips (linked): https://www.sec.gov/files/adv-brochures-2024-december.zip ✅(linked, 188 MB; listing timed out, not fully inspected)
- Repo files read: `scripts/generate-adv-raw.mjs`, `scripts/generate-adv-timeseries.mjs`, `scripts/adv-timeseries-lib.mjs`, `data/adviserinfo/adv-2025.json`, `data/adviserinfo/adv-timeseries.json` ✅
- Repo scratch context: `.scratch/vanguard-intelligence/assets/02-peer-universe.md` ✅
