/** Reconstructed contracts from executable JS and current call sites; not original TS. */
export class Semaphore {
 constructor(max: number); readonly active: number; readonly waiting: number; readonly limit: number;
 setLimit(next: number): void; acquire(signal?: AbortSignal): Promise<() => void>;
 run<T>(fn: () => T | Promise<T>, signal?: AbortSignal): Promise<T>;
}
export const DEFAULT_MCP_CONCURRENCY: number;
export const mcpConcurrencyLimiter: Semaphore;
