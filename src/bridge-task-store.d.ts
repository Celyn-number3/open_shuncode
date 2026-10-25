/** Reconstructed contracts from executable JS and current call sites; not original TS. */
import type { BridgeTodo } from '../extension/src/bridge-constants.js';
export type BridgeTaskLifecycle = 'running' | 'completed' | 'blocked' | 'cancelled' | 'waiting_plan' | 'cleared' | 'interrupted' | 'awaiting_sync';
export interface BridgeTaskHistory<T extends BridgeTodo = BridgeTodo> { revision: number; at: number; state: BridgeTaskLifecycle; completed: number; total: number; removed: T[]; }
export interface BridgeTaskSnapshot<T extends BridgeTodo = BridgeTodo> { id: string; revision: number; updatedAt: number; state: BridgeTaskLifecycle; todos: T[]; history: BridgeTaskHistory<T>[]; }
export interface BridgeTaskUpdate { task_id?: string; expected_revision?: number; new_task?: boolean; mode?: 'replace' | 'patch'; lifecycle?: 'running' | 'completed' | 'blocked' | 'cancelled'; }
export class BridgeTaskStore<T extends BridgeTodo = BridgeTodo> {
 constructor(maxTodos: number, now?: () => number, maxTasks?: number, maxHistory?: number);
 update(owner: string, todos: T[], input?: unknown): BridgeTaskSnapshot<T> | undefined;
 forProgress(owner: string, input?: unknown): BridgeTaskSnapshot<T> | undefined;
 snapshot(): {taskId?: string; tasks: BridgeTaskSnapshot<T>[]};
 selectedTodos(): T[]; disconnect(owner: string): boolean; touch(id: string): void; forget(id: string): void;
}
