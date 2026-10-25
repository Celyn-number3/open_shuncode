/** Reconstructed contracts from executable JS and current call sites; not original TS. */
export interface AdaptiveSample {failed: boolean; durationMs: number; queued: number;}
export interface AdaptiveDecision {limit: number; changed: boolean; reason: 'hold' | 'grow' | 'shrink';}
export class AdaptiveConcurrencyController {
 constructor(options: {min: number; max: number; windowSize?: number; slowCallMs?: number});
 readonly limit: number; readonly pending: number; record(sample: AdaptiveSample): AdaptiveDecision; reset(limit?: number): void;
}
