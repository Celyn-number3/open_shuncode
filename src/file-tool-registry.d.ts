/** Reconstructed contracts from executable JS and current call sites; not original TS. */
export * from './recovered/extension/modules/src/file-tool-registry.mjs';
export type ToolContentBlock = {type: 'text'; text: string} | {type: 'image'; data: string; mimeType: string};
export interface FileToolResult {text: string; content?: ToolContentBlock[]; structuredContent?: Record<string, unknown>; isError?: boolean;}
export function invokeFileTool(name: string, input: Record<string, unknown>, context: {workspaceRoots: string[] | (() => string[]); signal?: AbortSignal}): Promise<FileToolResult>;
