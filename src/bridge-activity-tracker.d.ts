/** Inferred runtime activity contracts; generic parameter is the presentation shape. */
import type { BridgeActivity, BridgeActivityPresentation } from '../extension/src/bridge-constants.js';
export type ActivityRecord<P> = Omit<BridgeActivity, 'presentation'> & { readonly presentation?: P };
export interface BridgeActivityStats {toolCalls: number; completedToolCalls: number; failedToolCalls: number; averageDurationMs: number; successRate: number; lastTool?: string; lastToolAt?: string;}
export interface BridgeActivitySnapshot<P = BridgeActivityPresentation> {stats: BridgeActivityStats; activities: ActivityRecord<P>[];}
export class BridgeActivityTracker<P = BridgeActivityPresentation> {
 constructor(limit: number, now?: () => string);
 push(input: Omit<ActivityRecord<P>, 'id' | 'at'>): number;
 finish(id: number, status: BridgeActivity['status'], durationMs: number, message?: string, presentation?: P): boolean;
 snapshot(): BridgeActivitySnapshot<P>; reset(): boolean; clear(): number;
}
