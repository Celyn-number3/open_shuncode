/** Reconstructed contracts from executable JS and current call sites; not original TS. */
import type { JSONRPCMessage } from '@modelcontextprotocol/server';
export class BoundedInMemoryEventStore {
 constructor(limit: number);
 storeEvent(streamId: string, message: JSONRPCMessage): Promise<string>;
 replayEventsAfter(lastEventId: string, options: {send: (eventId: string, message: JSONRPCMessage) => Promise<void>}): Promise<string>;
}
