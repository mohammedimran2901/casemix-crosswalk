// VERIFIED dataset — compiled directly from official publications:
// 🇺🇸 US: CMS FY2026 IPPS Final Rule (CMS-1833-F), Table 5 (MS-DRG weights &
//    mean LOS) + Tables 1A/1D (national standardized amounts). Payment =
//    weight × ($6,752.61 operating + $524.15 capital) = weight × $7,276.76.
//    National average, before wage index/IME/DSH geographic adjustment.
// 🇬🇧 UK: NHS Payment Scheme 2025/26, Annex A prices workbook (pay-award
//    edition, published 27 June 2025). Elective unit prices in GBP, before
//    Market Forces Factor. Complexity tiers = CC (charlson-related) score bands.
// Sources & download dates: see SOURCES.md
const SOURCES = {
  us: "CMS FY2026 IPPS Final Rule (CMS-1833-F), Tables 1A/1D & 5",
  uk: "NHS Payment Scheme 2025/26 Annex A (pay award, 27 Jun 2025)"
};

const PROCEDURES = [
  {
    name: "Primary hip replacement (elective)",
    us: { family: "MS-DRG 469 / 470", tiers: [
      { code: "470", tier: "w CC", price: 14036, alos: 2.2 },
      { code: "469", tier: "w MCC", price: 22072, alos: 4.4 } ] },
    uk: { family: "HRG HN12A–F (Very Major Hip)", tiers: [
      { code: "HN12F", tier: "CC 0–1", price: 7251 },
      { code: "HN12E", tier: "CC 2–3", price: 7489 },
      { code: "HN12D", tier: "CC 4–5", price: 8260 },
      { code: "HN12C", tier: "CC 6–7", price: 9839 },
      { code: "HN12B", tier: "CC 8–9", price: 11644 },
      { code: "HN12A", tier: "CC 10+", price: 13900 } ] }
  },
  {
    name: "Primary knee replacement (elective)",
    us: { family: "MS-DRG 469 / 470", tiers: [
      { code: "470", tier: "w CC", price: 14036, alos: 2.2 },
      { code: "469", tier: "w MCC", price: 22072, alos: 4.4 } ] },
    uk: { family: "HRG HN22A–E (Very Major Knee)", tiers: [
      { code: "HN22E", tier: "CC 0–1", price: 7222 },
      { code: "HN22D", tier: "CC 2–3", price: 7578 },
      { code: "HN22C", tier: "CC 4–5", price: 8054 },
      { code: "HN22B", tier: "CC 6–7", price: 10149 },
      { code: "HN22A", tier: "CC 8+", price: 10826 } ] }
  },
  {
    name: "Revision of hip or knee replacement",
    us: { family: "MS-DRG 466 / 467 / 468", tiers: [
      { code: "468", tier: "w/o CC/MCC", price: 19997, alos: 1.8 },
      { code: "467", tier: "w CC", price: 25662, alos: 4.1 },
      { code: "466", tier: "w MCC", price: 37878, alos: 9.1 } ] },
    uk: { family: "HRG HN80 / HN81 (Complex Hip or Knee)", tiers: [
      { code: "HN81E", tier: "Complex, CC 0–1", price: 9817 },
      { code: "HN81D", tier: "Complex, CC 2–3", price: 10446 },
      { code: "HN81C", tier: "Complex, CC 4–5", price: 11075 },
      { code: "HN81B", tier: "Complex, CC 6–8", price: 13068 },
      { code: "HN81A", tier: "Complex, CC 9+", price: 20086 },
      { code: "HN80D", tier: "Very complex, CC 0–2", price: 11907 },
      { code: "HN80C", tier: "Very complex, CC 3–5", price: 15156 },
      { code: "HN80B", tier: "Very complex, CC 6–8", price: 19605 },
      { code: "HN80A", tier: "Very complex, CC 9+", price: 27752 } ] }
  },
  {
    name: "Shoulder replacement (elective)",
    us: { family: "MS-DRG 507 / 508", tiers: [
      { code: "508", tier: "w/o CC/MCC", price: 11020, alos: 3.8 },
      { code: "507", tier: "w CC/MCC", price: 13145, alos: 6.4 } ] },
    uk: { family: "HRG HN52A–C (Very Major Shoulder)", tiers: [
      { code: "HN52C", tier: "CC 0–1", price: 6323 },
      { code: "HN52B", tier: "CC 2–3", price: 6760 },
      { code: "HN52A", tier: "CC 4+", price: 7413 } ] }
  },
  {
    name: "Knee arthroscopy (e.g. meniscectomy)",
    us: { family: "MS-DRG 488 / 489", tiers: [
      { code: "489", tier: "w/o CC/MCC", price: 8127, alos: 1.4 },
      { code: "488", tier: "w CC/MCC", price: 11087, alos: 3.1 } ] },
    uk: { family: "HRG HN24A–C (Intermediate Knee)", tiers: [
      { code: "HN24C", tier: "CC 0–1", price: 2143 },
      { code: "HN24B", tier: "CC 2–3", price: 2369 },
      { code: "HN24A", tier: "CC 4+", price: 3271 } ] }
  },
  {
    name: "ACL / major knee ligament reconstruction",
    us: { family: "MS-DRG 488 / 489", tiers: [
      { code: "489", tier: "w/o CC/MCC", price: 8127, alos: 1.4 },
      { code: "488", tier: "w CC/MCC", price: 11087, alos: 3.1 } ] },
    uk: { family: "HRG HN23A–C (Major Knee)", tiers: [
      { code: "HN23C", tier: "CC 0–1", price: 4399 },
      { code: "HN23B", tier: "CC 2–3", price: 4737 },
      { code: "HN23A", tier: "CC 4+", price: 5076 } ] }
  },
  {
    name: "Lumbar spinal fusion, single level (elective)",
    us: { family: "MS-DRG 450 / 451", tiers: [
      { code: "451", tier: "w/o MCC", price: 23507, alos: 3.1 },
      { code: "450", tier: "w MCC", price: 38782, alos: 8.1 } ] },
    uk: { family: "HRG HC54A–C (Major Spinal Reconstructive)", tiers: [
      { code: "HC54C", tier: "CC 0–1", price: 9616 },
      { code: "HC54B", tier: "CC 2–3", price: 10550 },
      { code: "HC54A", tier: "CC 4+", price: 14556 } ] }
  },
  {
    name: "Cervical spinal fusion (elective)",
    us: { family: "MS-DRG 471 / 472 / 473", tiers: [
      { code: "473", tier: "w/o CC/MCC", price: 17765, alos: 2.0 },
      { code: "472", tier: "w CC", price: 21438, alos: 3.5 },
      { code: "471", tier: "w MCC", price: 35137, alos: 9.4 } ] },
    uk: { family: "HRG HC63A–C (Major Extradural Spinal)", tiers: [
      { code: "HC63C", tier: "CC 0–1", price: 4895 },
      { code: "HC63B", tier: "CC 2–3", price: 5724 },
      { code: "HC63A", tier: "CC 4+", price: 7247 } ] }
  },
  {
    name: "Lumbar discectomy / decompression",
    us: { family: "MS-DRG 518 / 519 / 520", tiers: [
      { code: "520", tier: "w/o CC/MCC", price: 10871, alos: 2.6 },
      { code: "519", tier: "w CC", price: 14555, alos: 4.2 },
      { code: "518", tier: "w MCC", price: 27195, alos: 7.6 } ] },
    uk: { family: "HRG HC64A–C (Intermediate Extradural Spinal)", tiers: [
      { code: "HC64C", tier: "CC 0–1", price: 3911 },
      { code: "HC64B", tier: "CC 2–3", price: 4435 },
      { code: "HC64A", tier: "CC 4+", price: 5987 } ] }
  },
];

// Example code-only lookup entries (so users searching raw codes get hits too)
const CODE_ALIASES = {
  "IN020K": 0, "IJ414": 0, "HNZ11": 0, "HNZ20": 1, "I47C": 0, "I47B": 1,
};
