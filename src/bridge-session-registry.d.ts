/** Reconstructed contracts from executable JS and current call sites; not original TS. */
export interface TrackedBridgeSession {activeRequests: number; activeStreams: number; lastActivity: number;}
export type SessionRemovalReason = string;
export class BridgeSessionRegistry<T extends TrackedBridgeSession = TrackedBridgeSession> {
 constructor(options?: {closeSession?: (session: T) => void; onSessionDestroyed?: (id: string, session: T, reason: SessionRemovalReason) => void});
 readonly size: number; get(id: string): T | undefined; set(id: string, session: T): void; has(id: string): boolean;
 isActive(session: T): boolean; prune(now: number, idleTimeoutMs: number, maxSessions: number): void;
 makeRoom(maxSessions: number): boolean; destroy(id: string, reason?: SessionRemovalReason): boolean;
 destroyAfter(id: string, action: (session: T) => void | Promise<void>, reason?: SessionRemovalReason): Promise<boolean>;
 destroyAll(reason?: SessionRemovalReason): void; values(): T[]; trimInactive(max: number): void;
}
