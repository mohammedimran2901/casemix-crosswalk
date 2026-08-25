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

## 🇦🇪 United Arab Emirates — IR-DRG (Abu Dhabi)
- **System:** IR-DRG, mandated by the Department of Health (DoH) Abu Dhabi for all inpatient encounters (also implemented in Dubai). Payment = relative weight × facility-specific negotiated base rate (AED), with outlier rules.
- **Rules source:** DoH Claims & Adjudication Rules V2025 (PDF, doh.gov.ae Shafafiya section) — confirms IR-DRG mandate and that relative weights are set in the Mandatory Tariff.
    https://www.doh.gov.ae/-/media/Feature/shafifya/Prices/Adjudication-Rules/DOH-Claims-and-Adjudication-Rules-V2025.ashx
- **Weights source:** DoH-published DRG weight update file (v2012-Q2 era), `DRG_WeightUpdateMethodology-V2012-Q2.ashx` (Excel, "WeightUpdate" sheet, 789 IR-DRGs with severity 1–3 weights).
    https://www.doh.gov.ae/-/media/Feature/shafifya/Prices/Adjudication-Rules/DRG_WeightUpdateMethodology-V2012-Q2.ashx
- **Important vintage note:** the *current* Mandatory Tariff weights require free registration on the Shafafiya portal (https://shafafiyaportal.doh.gov.ae). The weights shown are from the older public publication and may differ from current weights.
- **Downloaded:** 2026-08-24

## 🇩🇪 Germany — G-DRG (aG-DRG 2025)
- **Publication:** InEK Fallpauschalen-Katalog 2025 (aG-DRG-Version 2025), published 14 Oct 2024.
    https://www.g-drg.de/content/download/14156/file/Fallpauschalenkatalog%202025_2024-09-26.xlsx (sheet "Hauptabteilungen")
- **Values shown:** Bewertungsrelation (relative weight) and mittlere Verweildauer (official mean LOS). Payment = weight × Landesbasisfallwert (state base rate, negotiated annually; ~€4,000–4,600 for 2025).
- **Downloaded:** 2026-08-25

## 🇬🇧 UK activity shares (real % of cases per complexity tier)
- **Publication:** NHS England, National Cost Collection 2024/25 — National Schedule of NHS costs, "Admitted Patient Care" sheet (suppressed publication).
    https://www.england.nhs.uk/wp-content/uploads/2025/11/NCC_National-Schedule_2024_25.zip
- **Values shown:** finished consultant episodes (FCEs) per HRG code, aggregated across day case / elective / non-elective sectors. Percentages = code FCEs ÷ family FCEs. These are REAL activity distributions, not estimates.
- **Downloaded:** 2026-08-25

## 🇦🇺 Australia — AR-DRG V11.0
- **Publication:** IHACPA National Efficient Price Determination 2025–26, Appendix H — price weights for admitted acute patients (AR-DRG V11.0).
    https://www.ihacpa.gov.au/sites/default/files/2025-03/national_efficient_price_determination_2025-26-price_weight_tables.xlsx
- **Values shown:** inlier price weight (NWAU) and official mean ALOS per AR-DRG. Payment = price weight × National Efficient Price (NEP 2024–25 = A$6,465/NWAU), before adjustments (paediatric, remoteness, ICU, etc.).
- **Note:** the AIHW AR-DRG activity cube (real AU separations %) is published at aihhw.gov.au but is behind Cloudflare bot protection for automated download — AU activity % pending manual download.
- **Downloaded:** 2026-08-25 (via text conversion)

## Procedure-to-HRG/DRG family mapping
Mappings were made at the procedure-family level (e.g., "primary hip replacement → Very Major Hip Procedures HN12"; "revision hip/knee → HN80/HN81"; "single-level lumbar fusion → HC54"). Exact HRG assignment for an individual patient depends on the OPCS/ICD-10 coding and the NHS grouper; exact MS-DRG assignment depends on the CMS Grouper. Users should verify individual case mappings.

## Not yet included
- 🇩🇪 Germany (InEK Fallpauschalenkatalog), 🇦🇺 Australia (IHACPA NWAU) — planned.
- Complexity tier *activity shares* (% of cases per tier) — requires HES/MEDPAR activity data; only tier *prices* are shown.