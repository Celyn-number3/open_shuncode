import * as vscode from "vscode";
import type { BridgeManager } from "./bridge-server.js";

export interface CodexSkillRoot {
  path: string;
  label: string;
}

export interface CodexSkillCandidate {
  name: string;
  description: string;
  directory: string;
  sourceRoot: string;
  sourceLabel: string;
  warning?: string;
}

export function discoverCodexSkillRoots(
  workspaceRoots?: string[],
  env?: NodeJS.ProcessEnv,
  homeDir?: string,
): CodexSkillRoot[];
export function scanCodexSkills(
  roots: Array<string | CodexSkillRoot>,
  options?: { maxDirectories?: number; maxSkills?: number; maxDepth?: number },
): CodexSkillCandidate[];
export function registerCodexSkillScanCommand(
  vscodeApi: typeof vscode,
  bridge: BridgeManager,
  bridgeReady: Promise<unknown>,
): vscode.Disposable;