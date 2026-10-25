/** Reconstructed contracts from executable JS and current call sites; not original TS. */
export * from './recovered/extension/modules/src/custom-tool-skill-import.mjs';
import type { ToolLog } from './custom-tools.js';
export interface SkillImportResult {name: string; directory: string; renamedFrom?: string; generatedRunner?: boolean;}
export interface SkillRunnerResult {name: string; dirName: string; generated: boolean; runnerRel?: string;}
export function importSkill(root: string, source: string, log?: ToolLog): SkillImportResult;
export function generateSkillRunner(root: string, name: string, log?: ToolLog): SkillRunnerResult;
