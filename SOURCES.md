# Data Sources

All prices shown in CasemixCrosswalk are compiled directly from the following official publications.

## 🇺🇸 United States — MS-DRG
- **Publication:** CMS FY2026 IPPS Final Rule (CMS-1833-F)
- **Files used:**
  - Table 5 (`fy2026-ipps-fr-table-5.zip`) — MS-DRG relative weights, geometric & arithmetic mean LOS
    https://www.cms.gov/files/zip/fy2026-ipps-fr-table-5.zip
  - Tables 1A–1E (`fy2026-ipps-fr-table-1a-1e.zip`) — national standardized amounts
    https://www.cms.gov/files/zip/fy2026-ipps-fr-table-1a-1e.zip
- **Payment calculation:** DRG weight × ($6,752.61 operating [Table 1A/1B, full-quality submission] + $524.15 capital federal rate [Table 1D]) = weight × **$7,276.76**
- **Limitations:** national average only; actual payments vary by wage index (geographic adjustment), IME/DSH, outliers, and transfer policy.
- **Downloaded:** 2026-08-24

## 🇬🇧 United Kingdom — NHS HRG (HRG4+)
- **Publication:** 2025/26 NHS Payment Scheme — pay award prices workbook (published 27 June 2025; applies from 1 April 2025)
- **File used:** `25-26NHSPS-prices-pay-award.xlsx`, sheet "1 APC & OPROC"
    https://www.england.nhs.uk/publication/2025-26-nhs-payment-scheme/
- **Prices shown:** Combined day case / ordinary elective unit price (GBP), before Market Forces Factor (MFF). Non-elective prices differ (see source workbook).
- **Complexity tiers:** HRG4+ CC (comorbidity-related) score bands, as published.
- **Downloaded:** 2026-08-24

## Procedure-to-HRG/DRG family mapping
Mappings were made at the procedure-family level (e.g., "primary hip replacement → Very Major Hip Procedures HN12"; "revision hip/knee → HN80/HN81"; "single-level lumbar fusion → HC54"). Exact HRG assignment for an individual patient depends on the OPCS/ICD-10 coding and the NHS grouper; exact MS-DRG assignment depends on the CMS Grouper. Users should verify individual case mappings.

## Not yet included
- 🇩🇪 Germany (InEK Fallpauschalenkatalog), 🇦🇺 Australia (IHACPA NWAU) — planned.
- Complexity tier *activity shares* (% of cases per tier) — requires HES/MEDPAR activity data; only tier *prices* are shown.