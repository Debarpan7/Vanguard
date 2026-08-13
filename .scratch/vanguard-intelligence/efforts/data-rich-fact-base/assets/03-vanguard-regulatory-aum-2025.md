# Vanguard regulatory AUM — 2025 Form ADV

## Published observation

| Metric | Fiscal-year label | Measurement as-of | Value | Unit | Filing date | Verification | Scope |
| --- | ---: | --- | ---: | --- | --- | --- | --- |
| Regulatory AUM | FY2025 | 2025-09-30 | 10.246596045633 | USD trillions | 2025-12-22 | `verified-from-url` | The Vanguard Group, Inc. SEC-registered investment adviser, CRD 105958 |

The value is the SEC Form ADV Item 5.F.2.c total regulatory assets under management field: `$10,246,596,045,633`. It is stored as USD trillions for the site’s existing AUM unit.

## Primary sources

- SEC IAPD structured firm record for Vanguard Group Inc, CRD 105958: https://api.adviserinfo.sec.gov/search/firm/105958?hl=true&nrows=12&query=smith&r=25&sort=score+desc&wt=json
- SEC Form ADV filing-data archive for December 2025: https://reports.adviserinfo.sec.gov/reports/foia/advFilingData/2025/ADV_Filing_Data_20251201_20251231.zip
- SEC Form ADV data guidance: https://www.sec.gov/foia-services/frequently-requested-documents/form-adv-data

The structured firm record identifies the adviser as `VANGUARD GROUP INC`, CRD `105958`, SEC number `801-11953`, and the filing date used here is the `DateSubmitted` value in the archive row: `12/22/2025`.

## Qualification and limits

- This is adviser-level regulatory AUM, not Vanguard’s mutual-company revenue, equity, or net income. The observation is therefore marked `display-only-regulatory-aum` and is not an audited financial comparison.
- Vanguard’s corporate site no longer publishes a comparable firm AUM point after March 31, 2022. FY2023 and FY2024 remain explicit `not-published` gaps.
- The SEC’s current machine-readable Form ADV archive begins January 1, 2025. The SEC identifies the pre-2025 historical Part 1 archive separately; those records were not extracted in this slice.