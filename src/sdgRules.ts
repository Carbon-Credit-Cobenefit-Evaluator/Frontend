// src/lib/sdgRules.ts
// (adjust path to wherever you keep constants)

export type SDG1OutputKey = "O1" | "O2" | "O3" | "O4" | "O5" | "O6";
export type SDG1OutcomeKey = "R1" | "R2" | "R3" | "R4" | "R5" | "R6";
export type SDG1ImpactKey = "I1" | "I2" | "I3" | "I4" | "I5";

export type SDG1Key = SDG1OutputKey | SDG1OutcomeKey | SDG1ImpactKey;
export type SDG1Section = "OUTPUT" | "OUTCOME" | "IMPACT";

export type SDG1Rules = {
  OUTPUT: Record<SDG1OutputKey, string>;
  OUTCOME: Record<SDG1OutcomeKey, string>;
  IMPACT: Record<SDG1ImpactKey, string>;
};

export const SDG1_RULES: SDG1Rules = {
  OUTPUT: {
    O1: "Income-generating assets provided",
    O2: "Employment created",
    O3: "Training or capacity building",
    O4: "Subsidized technology or inputs",
    O5: "Financial assistance or support",
    O6: "Community infrastructure created",
  },
  OUTCOME: {
    R1: "Household expenditure reduction",
    R2: "Increase in productive time",
    R3: "Increase in disposable income",
    R4: "Improved livelihood opportunities",
    R5: "Increased access to basic services",
    R6: "Reduced vulnerability of low-income groups",
  },
  IMPACT: {
    I1: "General poverty reduction",
    I2: "Impact on poverty indicators",
    I3: "Empowerment of vulnerable groups",
    I4: "Inclusive economic growth",
    I5: "Long-term resilience building",
  },
};

/** Convenience: get label by code (O1/R1/I1 etc.) */
export function getSDG1Label(code: SDG1Key): string {
  if (code.startsWith("O")) return SDG1_RULES.OUTPUT[code as SDG1OutputKey];
  if (code.startsWith("R")) return SDG1_RULES.OUTCOME[code as SDG1OutcomeKey];
  return SDG1_RULES.IMPACT[code as SDG1ImpactKey];
}

/** Convenience: flatten into [{code, section, label}] */
export function listSDG1Rules(): Array<{
  code: SDG1Key;
  section: SDG1Section;
  label: string;
}> {
  const out: any[] = [];

  (Object.entries(SDG1_RULES.OUTPUT) as Array<[SDG1OutputKey, string]>).forEach(
    ([code, label]) => out.push({ code, section: "OUTPUT", label })
  );

  (
    Object.entries(SDG1_RULES.OUTCOME) as Array<[SDG1OutcomeKey, string]>
  ).forEach(([code, label]) => out.push({ code, section: "OUTCOME", label }));

  (Object.entries(SDG1_RULES.IMPACT) as Array<[SDG1ImpactKey, string]>).forEach(
    ([code, label]) => out.push({ code, section: "IMPACT", label })
  );

  return out;
}
