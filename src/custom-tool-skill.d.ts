/** Reconstructed contracts from executable JS and current call sites; not original TS. */
export * from './recovered/extension/modules/src/custom-tool-skill.mjs';
import type { ToolLog } from './custom-tools.js';
export interface SkillLoadDiagnosis {dirName: string; loaded: boolean; name?: string; reasonCode?: string; reason?: string; fix?: string;}
export function diagnoseSkillTools(root: string, log?: ToolLog, options?: {skillsEnabled?: boolean}): SkillLoadDiagnosis[];
