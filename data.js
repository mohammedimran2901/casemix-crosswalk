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
  {
    name: "Elbow replacement (elective)",
    us: { family: "MS-DRG 507 / 508", tiers: [
      { code: "508", tier: "w/o CC/MCC", price: 11020, alos: 3.8 },
      { code: "507", tier: "w CC/MCC", price: 13145, alos: 6.4 } ] },
    uk: { family: "HRG HN62A–B (Very Major Elbow)", tiers: [
      { code: "HN62B", tier: "CC 0–1", price: 6323 },
      { code: "HN62A", tier: "CC 2+", price: 6771 } ] }
  },
  {
    name: "Complex spinal deformity correction",
    us: { family: "MS-DRG 456 / 457 / 458", tiers: [
      { code: "458", tier: "w/o CC/MCC", price: 30363, alos: 2.8 },
      { code: "457", tier: "w CC", price: 43392, alos: 5.9 },
      { code: "456", tier: "w MCC", price: 61150, alos: 11.5 } ] },
    uk: { family: "HRG HC50 / HC51 (Instrumented Correction of Spinal Deformity)", tiers: [
      { code: "HC51C", tier: "Complex, CC 0–2", price: 29742 },
      { code: "HC51B", tier: "Complex, CC 3–5", price: 31601 },
      { code: "HC51A", tier: "Complex, CC 6+", price: 42012 },
      { code: "HC50A", tier: "Very complex, 19+", price: 39403 } ] }
  },
  {
    name: "Multi-level lumbar spinal fusion",
    us: { family: "MS-DRG 447 / 448", tiers: [
      { code: "448", tier: "w/o MCC", price: 30859, alos: 4.1 },
      { code: "447", tier: "w MCC", price: 48620, alos: 9.7 } ] },
    uk: { family: "HRG HC53A–C (Very Major Spinal Reconstructive)", tiers: [
      { code: "HC53C", tier: "CC 0–1", price: 9704 },
      { code: "HC53B", tier: "CC 2–3", price: 11649 },
      { code: "HC53A", tier: "CC 4+", price: 15075 } ] }
  },
  {
    name: "Major foot / ankle reconstruction (elective)",
    us: { family: "MS-DRG 503 / 504 / 505", tiers: [
      { code: "505", tier: "w/o CC/MCC", price: 13046, alos: 3.2 },
      { code: "504", tier: "w CC", price: 13602, alos: 5.5 },
      { code: "503", tier: "w MCC", price: 20310, alos: 8.9 } ] },
    uk: { family: "HRG HN32A–C (Very Major Foot)", tiers: [
      { code: "HN32C", tier: "CC 0–1", price: 6317 },
      { code: "HN32B", tier: "CC 2–3", price: 6767 },
      { code: "HN32A", tier: "CC 4+", price: 7670 } ] }
  },
  {
    name: "Bunion correction / minor foot surgery",
    us: { family: "MS-DRG 504 / 505", tiers: [
      { code: "505", tier: "w/o CC/MCC", price: 13046, alos: 3.2 },
      { code: "504", tier: "w CC", price: 13602, alos: 5.5 } ] },
    uk: { family: "HRG HN35A (Minor Foot)", tiers: [
      { code: "HN35A", tier: "19+ years", price: 1304 } ] }
  },
  {
    name: "Carpal tunnel release / minor hand surgery",
    us: { family: "MS-DRG 501 / 502", tiers: [
      { code: "502", tier: "w/o CC/MCC", price: 9794, alos: 3.0 },
      { code: "501", tier: "w CC", price: 12721, alos: 5.2 } ] },
    uk: { family: "HRG HN45A (Minor Hand)", tiers: [
      { code: "HN45A", tier: "19+ years", price: 1304 } ] }
  },
  {
    name: "Major hand surgery (e.g. Dupuytren's contracture)",
    us: { family: "MS-DRG 513 / 514", tiers: [
      { code: "514", tier: "w/o CC/MCC", price: 7439, alos: 2.6 },
      { code: "513", tier: "w CC/MCC", price: 11456, alos: 5.2 } ] },
    uk: { family: "HRG HN43A–B (Major Hand)", tiers: [
      { code: "HN43B", tier: "CC 0–1", price: 3384 },
      { code: "HN43A", tier: "CC 2+", price: 3835 } ] }
  },
  {
    name: "Shoulder arthroscopy / intermediate shoulder surgery",
    us: { family: "MS-DRG 510 / 511 / 512", tiers: [
      { code: "512", tier: "w/o CC/MCC", price: 12046, alos: 2.7 },
      { code: "511", tier: "w CC", price: 15131, alos: 4.4 },
      { code: "510", tier: "w MCC", price: 21979, alos: 6.9 } ] },
    uk: { family: "HRG HN54A–C (Intermediate Shoulder)", tiers: [
      { code: "HN54C", tier: "CC 0–1", price: 2731 },
      { code: "HN54B", tier: "CC 2–3", price: 2820 },
      { code: "HN54A", tier: "CC 4+", price: 3158 } ] }
  },
  {
    name: "Other hip surgery, non-joint (elective)",
    us: { family: "MS-DRG 481 / 482", tiers: [
      { code: "482", tier: "w/o CC/MCC", price: 11868, alos: 3.5 },
      { code: "481", tier: "w CC", price: 15241, alos: 4.8 } ] },
    uk: { family: "HRG HN14A–E (Intermediate Hip)", tiers: [
      { code: "HN14E", tier: "CC 0–1", price: 2375 },
      { code: "HN14D", tier: "CC 2–3", price: 3383 },
      { code: "HN14C", tier: "CC 4–5", price: 4060 },
      { code: "HN14B", tier: "CC 6–7", price: 5639 },
      { code: "HN14A", tier: "CC 8+", price: 7896 } ] }
  },
  {
    name: "Soft tissue / tendon procedures (musculoskeletal)",
    us: { family: "MS-DRG 500 / 501 / 502", tiers: [
      { code: "502", tier: "w/o CC/MCC", price: 9794, alos: 3.0 },
      { code: "501", tier: "w CC", price: 12721, alos: 5.2 },
      { code: "500", tier: "w MCC", price: 23029, alos: 9.9 } ] },
    uk: { family: "HRG HN93Z (Other Muscle/Tendon/Fascia/Ligament)", tiers: [
      { code: "HN93Z", tier: "All", price: 1718 } ] }
  },
];

// Example code-only lookup entries (so users searching raw codes get hits too)
const CODE_ALIASES = {
  "IN020K": 0, "IJ414": 0, "HNZ11": 0, "HNZ20": 1, "I47C": 0, "I47B": 1,
};
