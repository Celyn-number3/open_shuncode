import type * as vscode from "vscode";
/** Session authorization for the remote Bridge only. Native Chat permissions are unchanged. */
export function registerBridgeSecurity(vscodeApi: typeof vscode, context: vscode.ExtensionContext, bridge: unknown, buildInfo: { version: string; sourceRevision: string; sourceHash: string }): { dispose(): void; policy: unknown };
