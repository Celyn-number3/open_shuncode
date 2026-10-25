/** Reconstructed contracts from executable JS and current call sites; not original TS. */
import 'vscode';
declare module 'vscode' {
 interface ShunCodeToolItem {label: string; description?: string; resource?: Uri | Location;}
 interface ShunCodeDiffLine {kind: 'context' | 'add' | 'delete'; oldLine?: number; newLine?: number; text: string;}
 interface ShunCodeDiffHunk {oldStart?: number; newStart?: number; lines: ShunCodeDiffLine[]; truncated?: boolean;}
 interface ShunCodeDiffFile {path: string; oldPath?: string; newPath?: string; hunks: ShunCodeDiffHunk[]; truncated?: boolean;}
 interface ChatSimpleToolResultData {
  presentationStyle?: 'shuncode'; presentationKind?: 'files' | 'search' | 'edit' | 'terminal' | 'diagnostics' | 'lsp' | 'generic';
  isError?: boolean; durationMs?: number; terminalId?: string; diff?: string; diffPreview?: ShunCodeDiffFile[];
  summary?: string; detailsLabel?: string; items?: ShunCodeToolItem[]; metrics?: {label: string; value: string}[];
 }
}
