/** Reconstructed contracts from executable JS and current call sites; not original TS. */
import type {IncomingMessage, ServerResponse} from 'node:http';
export interface BridgeHttpRoutes {endpointPath: string; healthPath: string;}
export function createBridgeHttpRoutes(token: string): BridgeHttpRoutes;
export function writeBridgeJsonError(response: ServerResponse, status: number, message: string): void;
export function writeBridgeJsonRpcError(response: ServerResponse, status: number, code: number, message: string, id: string | number | null): void;
export function handleBridgeHttpRequest(options: {routes: BridgeHttpRoutes; maxRequestBytes: number; standaloneGetEnabled: boolean}, handlers: {
 getSessionCount(): number;
 handlePost(incoming: IncomingMessage, outgoing: ServerResponse, body: unknown, sessionId: string | undefined, protocolVersion: string | undefined, method: string | undefined, name: string | undefined): Promise<void>;
 handleGet(incoming: IncomingMessage, outgoing: ServerResponse, sessionId: string): Promise<void>;
 handleDelete(incoming: IncomingMessage, outgoing: ServerResponse, sessionId: string): Promise<void>;
}, incoming: IncomingMessage, outgoing: ServerResponse): Promise<void>;
