/** Reconstructed contracts from executable JS and current call sites; not original TS. */
export * from './recovered/extension/modules/src/custom-tool-contract.mjs';
export type ToolLog = (message: string) => void;
export interface CustomToolManifest {name: string; title: string; description: string; enabled: boolean; inputSchema: Record<string, unknown>; command: string[]; timeoutMs: number; sourcePath: string; skillDir?: string;}
export interface CustomToolStatusEntry {name: string; title: string; description: string; enabled: boolean; source: 'skill' | 'manifest';}
export interface CustomToolLoadOptions {skillsEnabled?: boolean;}
export function loadCustomTools(roots: string[], log?: ToolLog, options?: CustomToolLoadOptions): CustomToolManifest[];
export function listEnabledCustomTools(roots: string[], log?: ToolLog, options?: CustomToolLoadOptions): CustomToolManifest[];
export function findCustomTool(roots: string[], name: string, log?: ToolLog, options?: CustomToolLoadOptions): CustomToolManifest | undefined;
export function toStatusEntries(tools: CustomToolManifest[]): CustomToolStatusEntry[];
export function customToolsFingerprint(tools: CustomToolManifest[]): string;
export function executeCustomTool(roots: string[], tool: CustomToolManifest, args: Record<string, unknown>, options?: {signal?: AbortSignal; log?: ToolLog}): Promise<{text: string; isError: boolean; structuredContent: {exit_code: number | null; timed_out: boolean; aborted: boolean; duration_ms: number}}>;
