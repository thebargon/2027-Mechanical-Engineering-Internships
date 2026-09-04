import { CATEGORIES } from "./config";

function keywordMatches(text: string, keyword: string): boolean {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i").test(text);
}

export function matchesKeywords(text: string): boolean {
  return Object.values(CATEGORIES).flat().some((word) => keywordMatches(text, word));
}

export function isExcludedTitle(title: string): boolean {
  return /\b(?:software|firmware|frontend|backend|full[ -]stack|data|machine learning|electrical|electronics?|embedded|FPGA|ASIC|RF|civil|construction|sales|marketing|recruit(?:er|ing)|human resources|finance|accounting|supply chain|procurement|regulatory|EHS|environmental health|graphic|UX|UI)\b/i.test(title);
}

// Eligibility is deliberately narrower than CATEGORIES, which only labels jobs.
// Generic engineering, industry names, and employer-description keywords are not
// evidence of mechanical work. Prefer missing an ambiguous role to mislabeling it.
const MECHANICAL_TITLE = /\b(?:mechanical|electromechanical|electro-mechanical|manufacturing|industrial engineering|production engineer(?:ing)?|tooling|machining|metrology|thermal|thermofluids|thermodynamics|heat transfer|fluid dynamics|fluid mechanics|HVAC|CFD|FEA|finite element|propulsion|aerodynamics|airframe|structures?|robotics|mechatronics|chassis|powertrain|vehicle dynamics|CAD|SolidWorks|CATIA|Creo|NX|GD&T)\b/i;

export function matchesTitle(title: string): boolean {
  return !isExcludedTitle(title) && MECHANICAL_TITLE.test(title);
}

export function isEngineeringTitle(title: string): boolean {
  return matchesTitle(title);
}

export function isMechanicalInternship(title: string): boolean {
  return isInternship(title) && matchesTitle(title) &&
    !/\b(?:senior|sr\.?|manager|director|recruiter|advisor|coordinator)\b/i.test(title);
}

export function isInternship(title: string): boolean {
  return /\b(?:intern(?:ship)?s?|co[ -]?op|student)\b/i.test(title) && !isExcludedTitle(title);
}

export function getCategory(text: string): string {
  for (const [category, keywords] of Object.entries(CATEGORIES)) {
    if (keywords.some((word) => keywordMatches(text, word))) return category;
  }
  return "other";
}
