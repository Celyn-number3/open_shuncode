/** Contracts inferred from the validated workspace-owned administration implementation. */
export * from './recovered/extension/modules/src/custom-tool-admin.mjs';
import type {ToolLog} from './custom-tools.js';
export function toggleCustomTool(roots: string[], name: string, log?: ToolLog): {name: string; enabled: boolean};
export function deleteCustomTool(roots: string[], name: string, log?: ToolLog): {name: string; deleted: string};
