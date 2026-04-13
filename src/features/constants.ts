// ======================================================
// 🔥 PIPELINE STEPS (MATCH YOUR REAL PIPELINE EXACTLY)
// ======================================================

export const STEP_ORDER = [
  "queued",

  // control
  "decide_mode",

  // ingestion phase
  "ingest",
  "load_pdfs",

  // extraction phase
  "extract_text_sentences",
  "extract_table_sentences",

  // semantic processing
  "factor_matching",

  // evidence refinement
  "refine_evidence",
  "write_refined",
  "use_refined",

  // ML + scoring
  "sdg_inference",
  "sdg_assessment",
] as const;

export type StepKey = (typeof STEP_ORDER)[number];

// ======================================================
// 🧠 HUMAN FRIENDLY LABELS
// ======================================================
export const STEP_LABEL: Record<StepKey, string> = {
  queued: "Queued",

  decide_mode: "Selecting Processing Mode",

  ingest: "Initializing Ingestion",
  load_pdfs: "Loading Project Documents",

  extract_text_sentences: "Extracting Text Evidence",
  extract_table_sentences: "Extracting Table Evidence",

  factor_matching: "Semantic Matching & Filtering",

  refine_evidence: "Refining Evidence (LLM)",
  write_refined: "Saving Refined Evidence",
  use_refined: "Using Cached Evidence",

  sdg_inference: "Running SDG Model",
  sdg_assessment: "Computing SDG Scores",
};

// ======================================================
// 🎨 STEP GROUPS (FOR UI COLORS / SECTIONS)
// ======================================================
export const STEP_GROUP: Record<
  StepKey,
  "control" | "ingestion" | "extraction" | "processing" | "llm" | "scoring"
> = {
  queued: "control",
  decide_mode: "control",

  ingest: "ingestion",
  load_pdfs: "ingestion",

  extract_text_sentences: "extraction",
  extract_table_sentences: "extraction",

  factor_matching: "processing",

  refine_evidence: "llm",
  write_refined: "llm",
  use_refined: "llm",

  sdg_inference: "scoring",
  sdg_assessment: "scoring",
};

// ======================================================
// ⚡ OPTIONAL: STEP DESCRIPTIONS (SUPER USEFUL UI)
// ======================================================
export const STEP_DESCRIPTION: Record<StepKey, string> = {
  queued: "Waiting for processing slot",

  decide_mode:
    "Determining whether to reuse cached results or run full pipeline",

  ingest: "Preparing ingestion pipeline and dependencies",
  load_pdfs: "Loading and validating project PDF documents",

  extract_text_sentences: "Extracting narrative text into structured sentences",
  extract_table_sentences: "Extracting structured data from tables",

  factor_matching: "Matching extracted content to SDG-related factors",

  refine_evidence: "Using LLM to refine and clean extracted evidence",
  write_refined: "Saving refined evidence to storage",
  use_refined: "Reusing previously refined evidence",

  sdg_inference: "Running multi-label SDG classification model",
  sdg_assessment: "Calculating final SDG impact scores",
};

export const SDG_LABEL: Record<number, string> = {
  1: "No Poverty",
  2: "Zero Hunger",
  3: "Good Health and Well-being",
  4: "Quality Education",
  5: "Gender Equality",
  6: "Clean Water and Sanitation",
  7: "Affordable and Clean Energy",
  8: "Decent Work and Economic Growth",
  9: "Industry, Innovation and Infrastructure",
  10: "Reduced Inequalities",
  11: "Sustainable Cities and Communities",
  12: "Responsible Consumption and Production",
  13: "Climate Action",
  14: "Life Below Water",
  15: "Life on Land",
  16: "Peace, Justice and Strong Institutions",
  17: "Partnerships for the Goals",
};
