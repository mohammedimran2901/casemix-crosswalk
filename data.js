// Seed dataset: orthopedic procedure crosswalks.
// NOTE: Rates are illustrative starter values compiled from public tariff
// publications — VERIFY against official sources before commercial use!
// US MS-DRG rates ~ FY2024 national base-ish averages (USD)
// UK HRG ~ NHS National Tariff 2023/24 (GBP)
// DE G-DRG ~ InEK Fallpauschalen ~2023 (EUR, Landesebene average)
// AU AR-DRG ~ NWAU 2023-24 (AUD)
const PROCEDURES = [
  { name: "Total knee replacement", us: ["470", "Major joint replacement without MCC", 13500], uk: ["HNZ11", "Primary knee replacement", 6100], de: ["I47C", "Knie-TEP, komplizierte Grundkrankheit", 8900], au: ["I47A", "Knee replacement", 17500] },
  { name: "Total hip replacement", us: ["470", "Major joint replacement without MCC", 13500], uk: ["HNZ20", "Primary hip replacement", 5800], de: ["I47B", "Hüft-TEP, komplizierte Grundkrankheit", 9100], au: ["I47B", "Hip replacement", 17800] },
  { name: "Revision hip replacement", us: ["466", "Revision of hip/knee replacement without MCC", 14200], uk: ["HNZ32", "Secondary hip revision", 8400], de: ["I48A", "Hüft-TEP Revision, kompliziert", 12400], au: ["I49A", "Hip revision", 22300] },
  { name: "Revision knee replacement", us: ["466", "Revision of hip/knee replacement without MCC", 14200], uk: ["HNZ31", "Secondary knee revision", 7900], de: ["I48B", "Knie-TEP Revision, kompliziert", 11900], au: ["I49B", "Knee revision", 21800] },
  { name: "Partial knee replacement", us: ["507", "Major joint replacement/reattachment of lower extremity w/o MCC*", 13100], uk: ["HNZ12", "Other knee replacement", 4800], de: ["I47D", "Schlittenprothese Knie", 7200], au: ["I47C", "Partial knee replacement", 15200] },
  { name: "Shoulder replacement", us: ["473", "Acute major joint/bilateral/multiple procedure of upper extremity w/o MCC", 12900], uk: ["HNZ41", "Primary shoulder replacement", 6500], de: ["I44A", "Schulterendoprothese, kompliziert", 8300], au: ["I46A", "Shoulder replacement", 16900] },
  { name: "Hip fracture repair (hemiarthroplasty)", us: ["480", "Hip & femur procedures except major joint w CC", 11800], uk: ["HN52A", "Traumatic hip procedure, intermediate", 5200], de: ["I43B", "Hüftprothesen-Erstimplantation Fraktur", 8700], au: ["I45A", "Hip fracture arthroplasty", 16400] },
  { name: "Femoral neck fracture fixation", us: ["481", "Hip & femur procedures except major joint w/o MCC", 9800], uk: ["HN52B", "Traumatic hip procedure, non-intermediate", 3400], de: ["I36A", "Frakturen Femur, kompliziert", 6100], au: ["I45B", "Hip fracture fixation", 12800] },
  { name: "Ankle fracture ORIF", us: ["503", "Foot procedures w/o MCC", 8200], uk: ["HN53A", "Traumatic ankle procedure", 2900], de: ["I37B", "Frakturen unterer Extremität, mittel", 4300], au: ["I42A", "Ankle fracture", 9100] },
  { name: "ACL reconstruction", us: ["507", "Major joint/lower extremity reattachment w/o MCC", 13100], uk: ["HN23B", "Knee procedures category 2", 2600], de: ["I38E", "Bandplastik Knie", 4900], au: ["I41A", "Knee ligament reconstruction", 8600] },
  { name: "Arthroscopic knee meniscectomy", us: ["513", "Minor joint procedures of lower extremity w/o MCC", 6400], uk: ["HN23C", "Knee procedures category 3", 1700], de: ["I39C", "Arthroskopische Knieoperationen", 2400], au: ["I40B", "Knee arthroscopy minor", 4700] },
  { name: "Spinal fusion (lumbar, 1 level)", us: ["460", "Spinal fusion except cervical w/o MCC", 26800], uk: ["HN51B", "Complex back procedures", 9800], de: ["I61A", "Wirbelsäulenversteifung, kompliziert", 13800], au: ["I63A", "Spinal fusion complex", 31500] },
  { name: "Cervical spinal fusion", us: ["473/471", "Cervical spinal fusion w/o MCC", 18400], uk: ["HN50B", "Intermediate back procedures", 7100], de: ["I60B", "Wirbelkörperersatz HWS, mittel", 10200], au: ["I62A", "Spinal fusion intermediate", 24300] },
  { name: "Lumbar disc prolapse surgery (discectomy)", us: ["509", "Decompression peripheral nerve w/o MCC", 9600], uk: ["HN50C", "Non-complex back procedures", 3300], de: ["I62C", "Bandscheibenoperationen, mittel", 5100], au: ["I64A", "Disc excision", 11200] },
  { name: "Amputation below knee", us: ["552", "Lower limb amputation w/o MCC", 13400], uk: ["HN35B", "Lower limb amputation category 2", 7300], de: ["I45A", "Amputation untere Extremität, kompliziert", 10800], au: ["I58A", "Lower limb amputation major", 19800] },
];

// Example code-only lookup entries (so users searching raw codes get hits too)
const CODE_ALIASES = {
  "IN020K": 0, "IJ414": 0, "HNZ11": 0, "HNZ20": 1, "I47C": 0, "I47B": 1,
};
