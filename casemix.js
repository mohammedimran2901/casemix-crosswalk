// Casemix detail data: ALOS (average length of stay, days) and complexity
// split (approximate % of cases per complexity tier) per country/system.
// ILLUSTRATIVE starter values — verify against official publications.
const CASEMIX = {
  "Total knee replacement": {
    alos: { us: 2.6, uk: 3.1, de: 6.8, au: 3.9 },
    complexity: { us: [["w MCC (DRG 469)", 8], ["w CC (DRG 470)", 34], ["w/o CC (DRG 471)", 58]], uk: [["Bilateral/major complexity", 6], ["Standard (HNZ11)", 94]], de: [["Komplizierte Grundkrankheit", 41], ["Ohne kompl. Grundkrankheit", 59]], au: [["With complications", 11], ["Standard", 89]] }
  },
  "Total hip replacement": {
    alos: { us: 2.7, uk: 3.3, de: 7.2, au: 4.1 },
    complexity: { us: [["w MCC (DRG 469)", 9], ["w CC (DRG 470)", 36], ["w/o CC (DRG 471)", 55]], uk: [["Bilateral/major complexity", 7], ["Standard (HNZ20)", 93]], de: [["Komplizierte Grundkrankheit", 44], ["Ohne kompl. Grundkrankheit", 56]], au: [["With complications", 12], ["Standard", 88]] }
  },
  "Revision hip replacement": {
    alos: { us: 4.1, uk: 4.8, de: 10.5, au: 6.2 },
    complexity: { us: [["w MCC (DRG 465)", 24], ["w CC (DRG 466)", 41], ["w/o CC (DRG 467)", 35]], uk: [["Major revision (HNZ32)", 38], ["Standard revision (HNZ33)", 62]], de: [["Kompliziert", 52], ["Mittel/einfach", 48]], au: [["Complex revision", 35], ["Standard revision", 65]] }
  },
  "Revision knee replacement": {
    alos: { us: 3.9, uk: 4.5, de: 9.8, au: 5.9 },
    complexity: { us: [["w MCC (DRG 465)", 22], ["w CC (DRG 466)", 43], ["w/o CC (DRG 467)", 35]], uk: [["Major revision (HNZ31)", 34], ["Standard revision (HNZ33)", 66]], de: [["Kompliziert", 49], ["Mittel/einfach", 51]], au: [["Complex revision", 33], ["Standard revision", 67]] }
  },
  "Partial knee replacement": {
    alos: { us: 2.2, uk: 2.1, de: 5.4, au: 3.1 },
    complexity: { us: [["w MCC/CC", 14], ["w/o CC", 86]], uk: [["Complex (HNZ11)", 9], ["Standard (HNZ12)", 91]], de: [["Kompliziert", 28], ["Standard", 72]], au: [["With complications", 8], ["Standard", 92]] }
  },
  "Shoulder replacement": {
    alos: { us: 2.4, uk: 2.8, de: 6.1, au: 3.5 },
    complexity: { us: [["w MCC/CC (DRG 472/473)", 31], ["w/o CC", 69]], uk: [["Complex (HNZ40)", 12], ["Standard (HNZ41)", 88]], de: [["Kompliziert", 39], ["Standard", 61]], au: [["With complications", 10], ["Standard", 90]] }
  },
  "Hip fracture repair (hemiarthroplasty)": {
    alos: { us: 4.6, uk: 6.9, de: 11.2, au: 8.4 },
    complexity: { us: [["w MCC (DRG 479)", 18], ["w CC (DRG 480)", 47], ["w/o CC (DRG 481)", 35]], uk: [["With hip fracture (HN52A)", 71], ["Non-fracture (HN52B)", 29]], de: [["Mit Fraktur, kompliziert", 63], ["Ohne Fraktur", 37]], au: [["Fracture, with complications", 41], ["Fracture, standard", 59]] }
  },
  "Femoral neck fracture fixation": {
    alos: { us: 4.2, uk: 5.8, de: 9.6, au: 7.2 },
    complexity: { us: [["w MCC/CC (DRG 479/480)", 52], ["w/o CC (DRG 481)", 48]], uk: [["Intermediate (HN52A)", 44], ["Non-intermediate (HN52B)", 56]], de: [["Kompliziert", 58], ["Mittel/einfach", 42]], au: [["With complications", 33], ["Standard", 67]] }
  },
  "Ankle fracture ORIF": {
    alos: { us: 2.1, uk: 1.9, de: 4.8, au: 3.2 },
    complexity: { us: [["w MCC/CC (DRG 501/502)", 26], ["w/o CC (DRG 503)", 74]], uk: [["Complex (HN53B)", 15], ["Standard (HN53A)", 85]], de: [["Schwer", 21], ["Mittel", 62], ["Leicht", 17]], au: [["With complications", 12], ["Standard", 88]] }
  },
  "ACL reconstruction": {
    alos: { us: 1.1, uk: 0.8, de: 2.9, au: 1.6 },
    complexity: { us: [["w MCC/CC", 6], ["w/o CC", 94]], uk: [["Category 1 (major)", 11], ["Category 2 (HN23B)", 89]], de: [["Kompliziert", 14], ["Standard", 86]], au: [["With complications", 5], ["Standard", 95]] }
  },
  "Arthroscopic knee meniscectomy": {
    alos: { us: 0.6, uk: 0.3, de: 1.8, au: 0.9 },
    complexity: { us: [["w MCC/CC (DRG 511/512)", 9], ["w/o CC (DRG 513)", 91]], uk: [["Category 2 (HN23B)", 22], ["Category 3 (HN23C)", 78]], de: [["Mit Zusatzdiagnosen", 16], ["Standard", 84]], au: [["With complications", 4], ["Standard", 96]] }
  },
  "Spinal fusion (lumbar, 1 level)": {
    alos: { us: 3.4, uk: 4.2, de: 8.1, au: 5.3 },
    complexity: { us: [["w MCC (DRG 458)", 16], ["w CC (DRG 459)", 38], ["w/o CC (DRG 460)", 46]], uk: [["Complex (HN51B)", 47], ["Intermediate (HN51C)", 53]], de: [["Kompliziert", 55], ["Mittel", 45]], au: [["Complex, with complications", 29], ["Standard", 71]] }
  },
  "Cervical spinal fusion": {
    alos: { us: 2.9, uk: 3.1, de: 6.4, au: 4.4 },
    complexity: { us: [["w MCC (DRG 474)", 14], ["w CC (DRG 475)", 33], ["w/o MCC (DRG 471)", 53]], uk: [["Complex (HN50A)", 26], ["Intermediate (HN50B)", 74]], de: [["Kompliziert", 43], ["Mittel", 57]], au: [["With complications", 19], ["Standard", 81]] }
  },
  "Lumbar disc prolapse surgery (discectomy)": {
    alos: { us: 1.6, uk: 1.7, de: 4.3, au: 2.8 },
    complexity: { us: [["w MCC/CC (DRG 508/509)", 21], ["w/o CC (DRG 510)", 79]], uk: [["Intermediate (HN50B)", 31], ["Non-complex (HN50C)", 69]], de: [["Kompliziert/schwer", 27], ["Mittel", 73]], au: [["With complications", 13], ["Standard", 87]] }
  },
  "Amputation below knee": {
    alos: { us: 6.3, uk: 12.4, de: 18.7, au: 14.1 },
    complexity: { us: [["w MCC (DRG 551)", 31], ["w CC (DRG 552)", 44], ["w/o CC (DRG 553)", 25]], uk: [["Category 1 major (HN35A)", 28], ["Category 2 (HN35B)", 72]], de: [["Kompliziert", 61], ["Mittel/einfach", 39]], au: [["With complications", 38], ["Standard", 62]] }
  },
};