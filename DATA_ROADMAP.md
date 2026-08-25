# Data Expansion Roadmap — "everything covered"

Current coverage: **19 procedure families · 5 systems · 2,024 verified rows.**
This roadmap schedules the path to full coverage. Update the checkboxes as phases complete.

## Monitoring (automated) — ACTIVE ✅
Firecrawl monitors check these pages daily at 09:00 UTC and flag meaningful changes:
| Monitor | ID | Watches for |
|---|---|---|
| CMS IPPS | `01a03917-25cf-708d-ae3c-7ecd78cd4129` | FY2027 final rule tables/weights |
| NHS England | `01a03918-5056-71d8-9c22-369ce9fe722b` | 2026/27 payment scheme, new NCC activity |
| InEK G-DRG | `01a03919-342e-7791-9634-dcf4c949bd9e` | Fallpauschalen-Katalog 2026 |
| IHACPA + AIHW | `01a0391a-5b7a-703d-b2e6-0110dff33280` | NEP updates, AR-DRG V12.0, new data cubes |
| DoH Abu Dhabi | `01a0391b-f9a4-7431-9b5f-6313d79af9f6` | Mandatory tariff / DRG weight updates |

When a monitor fires: download the new file → drop into `source-data/` → update the filename constant in `scripts/build_data.py` → run it → update `data.js` → bump vintage labels in SOURCES.md.

## Phase 1 — Full catalog depth (target: +1 week, part-time)
- [ ] **US:** ingest all 770 MS-DRGs (parser exists — `data/us_drg.json` already has every DRG; wire search + table to it)
- [ ] **UK:** ingest all ~1,600 HN/HC HRGs (`data/uk_hrg_prices.json`, 184 ortho done)
- [ ] **DE:** ingest all 176 I-DRGs + expand to other MDCs from the same catalog
- [ ] **UAE:** register (free) on Shafafiya → download current Mandatory Tariff weights → replace v2012-Q2 vintage
- [ ] **AU:** manually download AIHW AR-DRG cube (browser) → parse real AU activity %; add NWAU-based A$ prices

## Phase 2 — New specialties beyond musculoskeletal (target: +2–3 weeks)
Priority order by market demand: cardiovascular → oncology → neurology → general surgery → maternity.
Each specialty = same pipeline: map families across the 5 systems, verify by hand, add activity shares where published.

## Phase 3 — New countries (target: month 2–3)
- [ ] **🇸🇦 Saudi Arabia:** CHI AR-DRG — monitor chi.gov.sa; request weight tables from CHI (they publish via knowledge center)
- [ ] **🇨🇭 Switzerland:** SwissDRG catalog (public on swissdrg.org)
- [ ] **🇳🇱 Netherlands:** DBC/Zorgproducten (open tarieven)
- [ ] **🇫🇷 France:** GHM/ghs public tariff (Annexe du TSS)
- [ ] **🇸🇬 Singapore / 🇯🇵 Japan (DPC):** longer-term

## Phase 4 — Data quality upgrades (ongoing)
- [ ] US activity %: purchase MEDPAR extract or use published MedPAC DRG volume tables
- [ ] DE activity %: InEK Fallzahlen (requires InEK data portal registration)
- [ ] Crosswalk verification: OPCS/ICD-10 → HRG grouper files for exact UK mappings
- [ ] Annual refresh: each Oct–Mar when new tariffs publish (monitors will fire)

## Rules that keep us credible
1. No number ships without a source file in `source-data/`.
2. Every vintage is labeled (year + publication + download date in SOURCES.md).
3. Where activity data isn't public, we say so — never estimate.