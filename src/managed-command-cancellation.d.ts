/** Reconstructed contracts from executable JS and current call sites; not original TS. */
export * from './recovered/extension/modules/src/managed-command-cancellation.mjs';
export type ManagedCommandStatus = 'running' | 'completed' | 'failed' | 'killed' | 'cancelled';
export interface ManagedCommandCancellationTarget {id: string; ownerId: string; command: string; cwd: string; startedAt: number; readonly status: ManagedCommandStatus; readonly exitCode: number | null; readonly cancelRequestedAt?: number; readonly cancelForced?: boolean; readonly terminalReusable: boolean; done: Promise<unknown>; requestInterrupt(at: number): boolean; forceClose(): void;}
export interface ManagedCommandCancellationPreview {commandId: string; command: string; cwd: string; status: ManagedCommandStatus; elapsedMs: number; riskLevel: 'normal' | 'high'; riskReason?: string; riskConsequence?: string;}
