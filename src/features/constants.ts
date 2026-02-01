export const STEP_ORDER = [
  'queued',
  'decide_mode',
  'ingest',
  'load_pdfs',
  'extract_text_sentences',
  'extract_table_sentences',
  'factor_matching',
  'refine_evidence',
  'write_refined',
  'use_refined',
  'sdg_inference',
  'sdg_assessment',
] as const;

export type StepKey = (typeof STEP_ORDER)[number];

export const STEP_LABEL: Record<StepKey, string> = {
  queued: 'Queued',
  decide_mode: 'Decide mode',
  ingest: 'Ingest PDFs',
  load_pdfs: 'Load PDFs',
  extract_text_sentences: 'Extract text sentences',
  extract_table_sentences: 'Extract table sentences',
  factor_matching: 'Semantic filtering',
  refine_evidence: 'Refine evidence',
  write_refined: 'Write refined evidence',
  use_refined: 'Use existing refined evidence',
  sdg_inference: 'SDG model inference',
  sdg_assessment: 'SDG scoring / assessment',
};

export const SDG_LABEL: Record<number, string> = {
  1: 'No Poverty',
  2: 'Zero Hunger',
  3: 'Good Health and Well-being',
  4: 'Quality Education',
  5: 'Gender Equality',
  6: 'Clean Water and Sanitation',
  7: 'Affordable and Clean Energy',
  8: 'Decent Work and Economic Growth',
  9: 'Industry, Innovation and Infrastructure',
  10: 'Reduced Inequalities',
  11: 'Sustainable Cities and Communities',
  12: 'Responsible Consumption and Production',
  13: 'Climate Action',
  14: 'Life Below Water',
  15: 'Life on Land',
  16: 'Peace, Justice and Strong Institutions',
  17: 'Partnerships for the Goals',
};
