# SEC Form ADV raw adviser data — December 2025 archive

The generated exports in `data/adviserinfo/` preserve the requested Form ADV disclosures for the named Vanguard adviser entities and the core peer advisers matched in the official December 2025 archive:

- `adv-2025.json` keeps source metadata, filing identity, normalized client information, AUM/accounts, employee information, and the original Form ADV field names and values.
- `adv-2025.xlsx` contains the same data in four sheets: `Advisers`, `Client information`, `AUM information`, and `Employees`.

## Source and mapping

Source archive: [SEC Form ADV filing data — December 2025](https://reports.adviserinfo.sec.gov/reports/foia/advFilingData/2025/ADV_Filing_Data_20251201_20251231.zip)

Source site: [Investment Adviser Public Disclosure](https://adviserinfo.sec.gov/)

The exporter reads `IA_ADV_Base_A_20251201_20251231.csv` and maps:

- `5D1a`–`5D1n`: client counts by Form ADV client type.
- `5D3a`–`5D3n`: regulatory assets under management (RAUM) by Form ADV client type, in USD.
- `5F2a`–`5F2f`: discretionary/non-discretionary AUM and account totals.
- `5A`, `5B1`–`5B6`: total employees and employee-function counts.

The SEC source is regulatory adviser disclosure. It must not be presented as audited consolidated corporate AUM, revenue, or profitability. Missing archive matches are preserved as `pending-collection` records and are not treated as zero.