# Research: ADV advisory landscape

## Question

Which large US-registered investment advisers are the right peer set for an advisory-business comparison on Form ADV Item 5 + Part 2A data, what are their CRDs, and what is the exact ADV field map and retrieval recipe at scale?

**Status:** complete (research subagent reported 2026-08-14)
**Report:** `.scratch/working/adv-advisory-landscape.md`

## Answer

- **Peers verified** (IAPD API + SEC bulk CSVs, keyed on column `1E1`): BlackRock Advisors LLC 106614, Pacific Investment Management Company LLC 104559 ($3.67T RAUM), J.P. Morgan Investment Management Inc 107038 ($3.52T), Goldman Sachs Asset Management L.P. 107738 ($2.65T). Additions proposed and verified: Fidelity Management & Research 108281 ($5.69T), Morgan Stanley Investment Management 110353 ($702B), T. Rowe Price Associates 105496 ($2.20T), Capital Research and Management 110885 ($3.75T).
- **Vanguard Advisers Inc 106715** ($300.4B RAUM) is the advice arm — the Vanguard column for this section (decision in ticket 49).
- **Data-quality finds**: the repo's `state-street` CRD 112861 resolves to State Street Global Advisors **Limited (UK, inactive)** — not usable; `item5F totalAmountUsd` does not exist in the repo JSON, the SEC bulk CSVs, or IAPD — the real columns are 5D1a (client counts), 5D3a (RAUM by client type), 5F2a–f (discretionary/non-discretionary totals); 5.E is compensation-arrangement checkboxes.
- **Retrieval**: monthly ZIPs `https://reports.adviserinfo.sec.gov/reports/foia/advFilingData/{YYYY}/ADV_Filing_Data_{YYYYMMDD}_{YYYYMMDD}.zip` (CSV-only); history via `https://www.sec.gov/files/adv-filing-data-20111105-20241231-part1.zip` (+part2); 2024 brochure ZIPs + mapping CSV; 2025+ brochure bulk source unconfirmed (per-firm API 403). SEC etiquette: ≤10 req/s, declared User-Agent.
- **Key quirk**: DateSubmitted ≠ as-of date — Item 5 is a fiscal-year-end snapshot (Vanguard's Dec-2025 and Mar-2026 filings report identical 5F2(c)); key by filing year, not submission date.
- **10 comparability caveats**: adviser-level not firm-level (multi-entity firms), RAUM ≠ total business, standardized client types but blanks ≠ 0 and private-fund investors excluded, as-of alignment, discretionary split is totals-only, Part 2A unstructured, entity-identity drift (SSGA), 2016 Item 5 structural change, missing years are gaps not zeros, existing scripts match by name in one month (brittle — peers file annual amendments in Q1).
