// 1900 UI bundle — light (no pdf-lib): analysis, presets, docx reading and the 2차 제작 revision system.
export { TRIM_PRESETS, DEFAULT_PRINT_OPTIONS, PRINT_HUMAN_GATES } from './presets';
export { DESIGN_PROFILES, DENSITY_OPTIONS, profileUsesSans } from './designProfiles';
export { analyzeForDesign, GENRES } from './designAnalysis';
export { COVER_TEMPLATES, designImageSlot, hexToCmyk, FINISH_TYPES, FINISH_TARGETS } from './coverConstants';
export { safeAutoFix } from '../onedaybooksEngine';
export { extractDocx } from '../docxReader';
export { validateIsbn13 } from '../preflight';
export { emptyState, outline, dryRun, applyOps, COMMANDS, isSubstantive, validateOp, chapterName } from '../revision/catalog';
export { parseIntentRules } from '../revision/intent';
export { planRevision, buildPlannerPrompt, normalizePlan, extractJson } from '../revision/planner';
export { knowledgeText, LAYOUT_MODULES, DESIGN_REFERENCES } from '../revision/knowledge';
