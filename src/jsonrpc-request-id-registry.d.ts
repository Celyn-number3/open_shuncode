/** Reconstructed contracts from executable JS and current call sites; not original TS. */
export type JsonRpcRequestId = string | number;
export class JsonRpcRequestIdRegistry {
 claim(ids: JsonRpcRequestId[]): {ok: true} | {ok: false; conflictId: JsonRpcRequestId};
 release(ids: JsonRpcRequestId[]): void;
}
export function requestIdsOfRequest(body: unknown): JsonRpcRequestId[];
