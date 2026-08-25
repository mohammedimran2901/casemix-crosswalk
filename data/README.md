# Data layer — where the data lives and how to extend it

## Current storage (static JSON/JS in this repo)
All data lives in this repo — no backend needed at this scale:

| File | Purpose | Rows |
|---|---|---|
| `../data.js` | App dataset: 19 procedure families × 5 systems + activity | ~150 tiers |
| `../source-data/*.json` | Extracted raw catalogs (US, UK, DE, UAE) | 770 + 110 + 176 + 789 |
| `../source-data/*.xlsx/.pdf` | Original official publications (audit trail) | — |

**Why this works:** GitHub Pages/Netlify serve static files free; a few thousand rows of JSON is <1MB; no server, no database, no maintenance.

## Scaling to ALL DRGs (the roadmap)
1. **~1,000–5,000 tiers:** keep static JSON. Split per system: `data/us.json`, `data/uk.json`, `data/de.json`, `data/au.json`, `data/ae.json`, `data/activity.json`. Load with `fetch('data/us.json')` at page load. Full US (770 DRGs) + UK (1,600 HRGs) + DE (1,300) + AU (800) ≈ 2–3MB uncompressed — still fine, and gzips to ~300KB.
2. **Search across all of it:** swap the current `filter()` for a prebuilt index (e.g., FlexSearch / MiniSearch, ~10KB) — instant typeahead over thousands of codes.
3. **>10k rows or per-user features:** move to SQLite (Turso) or Supabase with a tiny search API. Only needed when you add accounts, entitlements, or live-updating tariffs.

## Regenerating the data (`scripts/build_data.py`)
Run `python3 scripts/build_data.py` after downloading fresh annual publications into `source-data/`. It re-parses:
- `nhpps-25-26-pay-award.xlsx` → UK HRG prices
- `CMS-1833-F Table 5.xlsx` + `Tables 1A-1E.xlsx` → US weights, LOS, payments
- `g-drg-katalog-2025.xlsx` → German weights + LOS
- `doh-drg-weights.xlsx` → UAE IR-DRG weights
- `NCC .../Admitted Patient Care.xlsx` → UK activity shares
- `aihw-ardrg-cube-*.xlsx` → AU activity (once downloadable — AIHW is behind Cloudflare; download manually in a browser)

Each annual update = download new file, adjust the one filename constant, re-run, commit.