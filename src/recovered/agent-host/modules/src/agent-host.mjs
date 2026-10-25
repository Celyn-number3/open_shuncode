// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { __toESM } from "../runtime/helpers.mjs";
import { init_define_SHUNCODE_BUILD_INFO } from "../runtime/build-info.mjs";
import { FILE_TOOL_NAMES } from "./file-tool-registry.mjs";
import { IDE_TOOL_DEFINITIONS, IDE_TOOL_NAMES } from "./ide-tool-definitions.mjs";
import { runOpenAICompatibleAgent } from "./openai-agent.mjs";
// src/agent-host.ts
init_define_SHUNCODE_BUILD_INFO();
var import_node_readline = __toESM(require("node:readline"), 1);

// src/file-tool-registry.ts

// src/agent-host.ts
var PROTOCOL_VERSION = 8;
var TOOL_NAMES = [...FILE_TOOL_NAMES, ...IDE_TOOL_NAMES];
var peerPending = /* @__PURE__ */new Map();
var peerFetchStreams = /* @__PURE__ */new Map();
var activeRuns = /* @__PURE__ */new Map();
var nextPeerRequestId = 1;
function writeMessage(message) {
  process.stdout.write(`${JSON.stringify(message)}
`);
}
function asRecord(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("params must be an object");
  }
  return value;
}
function parseImages(value, label) {
  if (value === void 0) return void 0;
  if (!Array.isArray(value)) throw new Error(`${label} must be an array when provided`);
  if (value.length > 8) throw new Error(`${label} may contain at most 8 images`);
  return value.map((item, index) => {
    const row = asRecord(item);
    if (typeof row.mimeType !== "string" || !row.mimeType.startsWith("image/")) throw new Error(`${label}[${index}].mimeType must be an image MIME type`);
    if (typeof row.data !== "string" || !row.data) throw new Error(`${label}[${index}].data must be base64 text`);
    return {
      mimeType: row.mimeType,
      data: row.data,
      name: typeof row.name === "string" ? row.name : void 0
    };
  });
}
function parseHistory(value) {
  if (value === void 0) return void 0;
  if (!Array.isArray(value)) throw new Error("history must be an array when provided");
  return value.map((item, index) => {
    const row = asRecord(item);
    if (row.role !== "user" && row.role !== "assistant") {
      throw new Error(`history[${index}].role must be user or assistant`);
    }
    if (typeof row.content !== "string") {
      throw new Error(`history[${index}].content must be a string`);
    }
    return {
      role: row.role,
      content: row.content,
      images: parseImages(row.images, `history[${index}].images`)
    };
  });
}
function parseExternalTools(value) {
  if (value === void 0) return void 0;
  if (!Array.isArray(value)) throw new Error("externalTools must be an array when provided");
  if (value.length > 512) throw new Error("externalTools may contain at most 512 tools");
  const seen = /* @__PURE__ */new Set();
  return value.map((item, index) => {
    const row = asRecord(item);
    const name = typeof row.name === "string" ? row.name.trim() : "";
    if (!name) throw new Error(`externalTools[${index}].name must be a non-empty string`);
    if (seen.has(name)) throw new Error(`externalTools contains duplicate tool name: ${name}`);
    seen.add(name);
    if (row.description !== void 0 && typeof row.description !== "string") {
      throw new Error(`externalTools[${index}].description must be a string when provided`);
    }
    const inputSchema = row.inputSchema === void 0 ? {
      type: "object",
      properties: {}
    } : asRecord(row.inputSchema);
    return {
      name,
      description: typeof row.description === "string" ? row.description : "",
      inputSchema
    };
  });
}
function parseAgentCheckpoint(value) {
  if (value === void 0) return void 0;
  const row = asRecord(value);
  if (row.version !== 1) throw new Error("checkpoint.version must be 1");
  if (typeof row.model !== "string" || !row.model) throw new Error("checkpoint.model must be a non-empty string");
  if (typeof row.workspaceRoot !== "string" || !row.workspaceRoot) throw new Error("checkpoint.workspaceRoot must be a non-empty string");
  if (!Number.isInteger(row.nextStep) || Number(row.nextStep) < 1) throw new Error("checkpoint.nextStep must be a positive integer");
  if (!Array.isArray(row.toolNames) || row.toolNames.some(name => typeof name !== "string")) {
    throw new Error("checkpoint.toolNames must be an array of strings");
  }
  if (!Array.isArray(row.messages) || row.messages.length > 1e4) {
    throw new Error("checkpoint.messages must be an array with at most 10000 entries");
  }
  const messages = row.messages.map((message, index) => {
    if (!message || typeof message !== "object" || Array.isArray(message)) {
      throw new Error(`checkpoint.messages[${index}] must be an object`);
    }
    return message;
  });
  return {
    version: 1,
    model: row.model,
    workspaceRoot: row.workspaceRoot,
    nextStep: Number(row.nextStep),
    toolNames: row.toolNames,
    messages,
    createdAt: typeof row.createdAt === "string" ? row.createdAt : (/* @__PURE__ */new Date()).toISOString()
  };
}
function parseAgentRunInput(params) {
  const row = asRecord(params);
  for (const key of ["baseUrl", "model", "workspaceRoot"]) {
    if (typeof row[key] !== "string" || !row[key].trim()) {
      throw new Error(`${key} must be a non-empty string`);
    }
  }
  if (typeof row.prompt !== "string") throw new Error("prompt must be a string");
  if (row.protocol !== void 0 && row.protocol !== "chat-completions" && row.protocol !== "codex-responses" && row.protocol !== "openai-responses" && row.protocol !== "anthropic-messages") {
    throw new Error("protocol must be chat-completions, codex-responses, openai-responses, or anthropic-messages when provided");
  }
  if (row.apiKey !== void 0 && typeof row.apiKey !== "string") throw new Error("apiKey must be a string when provided");
  let codexAuth;
  if (row.codexAuth !== void 0) {
    const auth = asRecord(row.codexAuth);
    for (const key of ["accessToken", "accountId", "originator", "userAgent", "betaHeader"]) {
      if (typeof auth[key] !== "string" || !String(auth[key]).trim()) {
        throw new Error(`codexAuth.${key} must be a non-empty string`);
      }
    }
    codexAuth = {
      accessToken: String(auth.accessToken),
      accountId: String(auth.accountId),
      originator: String(auth.originator),
      userAgent: String(auth.userAgent),
      betaHeader: String(auth.betaHeader)
    };
  }
  if (row.runId !== void 0 && typeof row.runId !== "string") throw new Error("runId must be a string when provided");
  if (row.allowedTools !== void 0 && (!Array.isArray(row.allowedTools) || row.allowedTools.some(name => typeof name !== "string"))) {
    throw new Error("allowedTools must be an array of strings when provided");
  }
  if (row.modeInstructions !== void 0 && typeof row.modeInstructions !== "string") {
    throw new Error("modeInstructions must be a string when provided");
  }
  if (row.requestTimeoutMs !== void 0 && (!Number.isInteger(row.requestTimeoutMs) || Number(row.requestTimeoutMs) < 1e3 || Number(row.requestTimeoutMs) > 3e5)) {
    throw new Error("requestTimeoutMs must be an integer between 1000 and 300000 when provided");
  }
  for (const key of ["firstTokenTimeoutMs", "idleTimeoutMs", "totalTimeoutMs"]) {
    if (row[key] !== void 0 && (!Number.isInteger(row[key]) || Number(row[key]) < 1e3 || Number(row[key]) > 18e5)) {
      throw new Error(`${key} must be an integer between 1000 and 1800000 when provided`);
    }
  }
  if (row.retries !== void 0 && (!Number.isInteger(row.retries) || Number(row.retries) < 0 || Number(row.retries) > 5)) {
    throw new Error("retries must be an integer between 0 and 5 when provided");
  }
  if (row.deepSeek !== void 0 && typeof row.deepSeek !== "boolean") {
    throw new Error("deepSeek must be a boolean when provided");
  }
  if (row.imageInput !== void 0 && typeof row.imageInput !== "boolean") {
    throw new Error("imageInput must be a boolean when provided");
  }
  if (row.thinking !== void 0 && row.thinking !== "enabled" && row.thinking !== "disabled") {
    throw new Error("thinking must be enabled or disabled when provided");
  }
  if (row.reasoningEffort !== void 0 && row.reasoningEffort !== "none" && row.reasoningEffort !== "minimal" && row.reasoningEffort !== "low" && row.reasoningEffort !== "medium" && row.reasoningEffort !== "high" && row.reasoningEffort !== "xhigh" && row.reasoningEffort !== "max" && row.reasoningEffort !== "ultra") {
    throw new Error("reasoningEffort must be none, minimal, low, medium, high, xhigh, max, or ultra when provided");
  }
  if (row.serviceTier !== void 0 && row.serviceTier !== "default" && row.serviceTier !== "priority" && row.serviceTier !== "fast") {
    throw new Error("serviceTier must be default, priority, or fast when provided");
  }
  if (row.contextWindow !== void 0 && (!Number.isInteger(row.contextWindow) || Number(row.contextWindow) < 1024 || Number(row.contextWindow) > 1e7)) {
    throw new Error("contextWindow must be an integer between 1024 and 10000000 when provided");
  }
  if (row.maxOutputTokens !== void 0 && (!Number.isInteger(row.maxOutputTokens) || Number(row.maxOutputTokens) < 1 || Number(row.maxOutputTokens) > 1e6)) {
    throw new Error("maxOutputTokens must be an integer between 1 and 1000000 when provided");
  }
  const images = parseImages(row.images, "images");
  const checkpoint = parseAgentCheckpoint(row.checkpoint);
  if (!String(row.prompt).trim() && !images?.length && !checkpoint) throw new Error("prompt, at least one image, or a checkpoint is required");
  return {
    protocol: row.protocol === "chat-completions" || row.protocol === "codex-responses" || row.protocol === "openai-responses" || row.protocol === "anthropic-messages" ? row.protocol : void 0,
    baseUrl: String(row.baseUrl),
    model: String(row.model),
    prompt: String(row.prompt),
    images,
    workspaceRoot: String(row.workspaceRoot),
    apiKey: typeof row.apiKey === "string" ? row.apiKey : void 0,
    codexAuth,
    firstTokenTimeoutMs: Number.isInteger(row.firstTokenTimeoutMs) ? Number(row.firstTokenTimeoutMs) : void 0,
    idleTimeoutMs: Number.isInteger(row.idleTimeoutMs) ? Number(row.idleTimeoutMs) : void 0,
    totalTimeoutMs: Number.isInteger(row.totalTimeoutMs) ? Number(row.totalTimeoutMs) : void 0,
    requestTimeoutMs: Number.isInteger(row.requestTimeoutMs) ? Number(row.requestTimeoutMs) : void 0,
    retries: Number.isInteger(row.retries) ? Number(row.retries) : void 0,
    deepSeek: typeof row.deepSeek === "boolean" ? row.deepSeek : void 0,
    imageInput: typeof row.imageInput === "boolean" ? row.imageInput : void 0,
    thinking: row.thinking === "enabled" || row.thinking === "disabled" ? row.thinking : void 0,
    reasoningEffort: row.reasoningEffort === "none" || row.reasoningEffort === "minimal" || row.reasoningEffort === "low" || row.reasoningEffort === "medium" || row.reasoningEffort === "high" || row.reasoningEffort === "xhigh" || row.reasoningEffort === "max" || row.reasoningEffort === "ultra" ? row.reasoningEffort : void 0,
    serviceTier: row.serviceTier === "default" || row.serviceTier === "priority" || row.serviceTier === "fast" ? row.serviceTier : void 0,
    contextWindow: Number.isInteger(row.contextWindow) ? Number(row.contextWindow) : void 0,
    maxOutputTokens: Number.isInteger(row.maxOutputTokens) ? Number(row.maxOutputTokens) : void 0,
    history: parseHistory(row.history),
    allowedTools: Array.isArray(row.allowedTools) ? row.allowedTools : void 0,
    externalTools: parseExternalTools(row.externalTools),
    modeInstructions: typeof row.modeInstructions === "string" ? row.modeInstructions : void 0,
    checkpoint,
    runId: typeof row.runId === "string" ? row.runId : void 0
  };
}
function clearPeerRequest(id, pending) {
  clearTimeout(pending.timer);
  if (pending.signal && pending.onAbort) pending.signal.removeEventListener("abort", pending.onAbort);
  peerPending.delete(id);
}
function createPeerRequest(method, params, timeoutMs = 18e4, signal) {
  const id = `host-${nextPeerRequestId++}`;
  const promise = new Promise((resolve, reject) => {
    let pending;
    const finish = (error2, value) => {
      clearPeerRequest(id, pending);
      if (error2) reject(error2);else resolve(value);
    };
    const timer = setTimeout(() => finish(new Error(`IDE tool broker timed out: ${method}`)), timeoutMs);
    const onAbort = signal ? () => finish(signal.reason instanceof Error ? signal.reason : new Error("Agent run canceled.")) : void 0;
    pending = {
      resolve: value => finish(void 0, value),
      reject: error2 => finish(error2),
      timer,
      signal,
      onAbort
    };
    peerPending.set(id, pending);
    if (signal?.aborted) {
      onAbort?.();
      return;
    }
    if (signal && onAbort) signal.addEventListener("abort", onAbort, {
      once: true
    });
    writeMessage({
      jsonrpc: "2.0",
      id,
      method,
      params
    });
  });
  return {
    id,
    promise
  };
}
function requestPeer(method, params, timeoutMs = 18e4, signal) {
  return createPeerRequest(method, params, timeoutMs, signal).promise;
}
function cleanupPeerFetchStream(streamId) {
  const stream = peerFetchStreams.get(streamId);
  if (!stream) return void 0;
  peerFetchStreams.delete(streamId);
  if (stream.signal && stream.onAbort) stream.signal.removeEventListener("abort", stream.onAbort);
  return stream;
}
function cancelPeerFetch(streamId, reason) {
  const stream = cleanupPeerFetchStream(streamId);
  if (!stream) return;
  try {
    stream.controller.error(reason instanceof Error ? reason : new Error(String(reason ?? "Network request canceled.")));
  } catch {}
  writeMessage({
    jsonrpc: "2.0",
    method: "network/fetch/cancel",
    params: {
      streamId
    }
  });
}
async function fetchThroughExtensionHost(input2, init) {
  const url2 = typeof input2 === "string" ? input2 : input2 instanceof URL ? input2.toString() : input2.url;
  const requestHeaders = new Headers(input2 instanceof Request ? input2.headers : void 0);
  for (const [key, value] of new Headers(init?.headers).entries()) requestHeaders.set(key, value);
  const body = init?.body;
  if (body !== void 0 && body !== null && typeof body !== "string") {
    throw new Error("The extension-host fetch proxy accepts string request bodies only.");
  }
  let streamId = "";
  let streamController;
  const stream = new ReadableStream({
    start(controller) {
      streamController = controller;
    },
    cancel(reason) {
      if (streamId) cancelPeerFetch(streamId, reason ?? new Error("Response stream canceled."));
    }
  });
  const peer = createPeerRequest("network/fetch", {
    url: url2,
    method: init?.method ?? (input2 instanceof Request ? input2.method : "GET"),
    headers: Object.fromEntries(requestHeaders.entries()),
    body: typeof body === "string" ? body : void 0
  }, 18e5, init?.signal ?? void 0);
  streamId = peer.id;
  const onAbort = init?.signal ? () => cancelPeerFetch(streamId, init.signal?.reason ?? new Error("Network request canceled.")) : void 0;
  peerFetchStreams.set(streamId, {
    controller: streamController,
    signal: init?.signal ?? void 0,
    onAbort
  });
  if (init?.signal && onAbort) {
    if (init.signal.aborted) onAbort();else init.signal.addEventListener("abort", onAbort, {
      once: true
    });
  }
  try {
    const metadata = asRecord(await peer.promise);
    const status = Number(metadata.status);
    if (!Number.isInteger(status) || status < 100 || status > 599) throw new Error("Extension-host fetch returned an invalid HTTP status.");
    const headers = metadata.headers && typeof metadata.headers === "object" && !Array.isArray(metadata.headers) ? metadata.headers : {};
    return new Response(stream, {
      status,
      statusText: typeof metadata.statusText === "string" ? metadata.statusText : "",
      headers
    });
  } catch (error2) {
    const pendingStream = cleanupPeerFetchStream(streamId);
    if (pendingStream) {
      try {
        pendingStream.controller.error(error2);
      } catch {}
    }
    throw error2;
  }
}
function handlePeerFetchNotification(message) {
  if (message.method !== "network/fetch/chunk" && message.method !== "network/fetch/end" && message.method !== "network/fetch/error") return false;
  const params = message.params && typeof message.params === "object" && !Array.isArray(message.params) ? message.params : {};
  const streamId = typeof params.streamId === "string" ? params.streamId : "";
  const stream = peerFetchStreams.get(streamId);
  if (!stream) return true;
  try {
    if (message.method === "network/fetch/chunk") {
      const encoded = typeof params.data === "string" ? params.data : "";
      if (encoded) {
        const bytes = Buffer.from(encoded, "base64");
        stream.controller.enqueue(new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength));
      }
      return true;
    }
    cleanupPeerFetchStream(streamId);
    if (message.method === "network/fetch/error") {
      stream.controller.error(new Error(typeof params.message === "string" ? params.message : "Extension-host response stream failed."));
    } else {
      stream.controller.close();
    }
  } catch {
    cleanupPeerFetchStream(streamId);
  }
  return true;
}
async function dispatch(method, params) {
  switch (method) {
    case "runtime/hello":
      return {
        name: "shuncode-agent-host",
        protocolVersion: PROTOCOL_VERSION,
        pid: process.pid,
        node: process.version,
        platform: process.platform,
        tools: [...TOOL_NAMES],
        capabilities: {
          history: true,
          traceNotifications: true,
          bidirectionalRpc: true,
          ideToolBroker: true,
          unboundedAgentLoop: true,
          cancellation: true,
          imageInput: true,
          deepSeekV4: true,
          streamingModelResponses: true,
          recoverableCheckpoints: true,
          extensionHostFetchProxy: true
        }
      };
    case "runtime/ping":
      return {
        ok: true,
        now: (/* @__PURE__ */new Date()).toISOString()
      };
    case "tools/list":
      return {
        tools: [...TOOL_NAMES]
      };
    case "agent/run":
      {
        const parsed = parseAgentRunInput(params);
        const {
          runId,
          ...input2
        } = parsed;
        const abortController = new AbortController();
        if (runId) activeRuns.set(runId, abortController);
        try {
          const dynamicExternalTools = input2.externalTools ?? [];
          const reservedExternalToolNames = new Set(IDE_TOOL_DEFINITIONS.map(tool => tool.name));
          return await runOpenAICompatibleAgent({
            ...input2,
            signal: abortController.signal,
            externalTools: [...IDE_TOOL_DEFINITIONS.map(tool => ({
              name: tool.name,
              description: tool.description,
              inputSchema: tool.inputSchema
            })), ...dynamicExternalTools.filter(tool => !reservedExternalToolNames.has(tool.name))],
            executeExternalTool: async (name, args) => {
              if (!runId) throw new Error(`IDE-native tool ${name} requires an agent runId.`);
              abortController.signal.throwIfAborted();
              const result = asRecord(await requestPeer("ide/tool/invoke", {
                runId,
                name,
                arguments: args
              }, 18e4, abortController.signal));
              return {
                text: typeof result.text === "string" ? result.text : JSON.stringify(result),
                isError: result.isError === true
              };
            },
            onTrace: runId ? item => {
              writeMessage({
                jsonrpc: "2.0",
                method: "agent/trace",
                params: {
                  runId,
                  item
                }
              });
            } : void 0,
            onCheckpoint: runId ? checkpoint => {
              writeMessage({
                jsonrpc: "2.0",
                method: "agent/checkpoint",
                params: {
                  runId,
                  checkpoint
                }
              });
            } : void 0
          }, {
            fetch: input2.protocol === "codex-responses" ? fetchThroughExtensionHost : void 0
          });
        } finally {
          if (runId) activeRuns.delete(runId);
        }
      }
    case "agent/cancel":
      {
        const row = asRecord(params);
        const runId = typeof row.runId === "string" ? row.runId : "";
        if (!runId) throw new Error("runId must be a non-empty string");
        const controller = activeRuns.get(runId);
        if (!controller) return {
          canceled: false,
          reason: "not_running"
        };
        controller.abort(new Error("Agent run canceled by user."));
        return {
          canceled: true
        };
      }
    default:
      throw Object.assign(new Error(`Unknown method: ${method}`), {
        rpcCode: -32601
      });
  }
}
function handlePeerResponse(message) {
  const key = String(message.id);
  const pending = peerPending.get(key);
  if (!pending) return false;
  if ("error" in message) {
    pending.reject(new Error(`IDE broker ${message.error.code}: ${message.error.message}`));
  } else {
    pending.resolve(message.result);
  }
  return true;
}
async function handleIncomingRequest(request) {
  try {
    const result = await dispatch(request.method, request.params);
    writeMessage({
      jsonrpc: "2.0",
      id: request.id,
      result
    });
  } catch (error2) {
    const row = error2;
    writeMessage({
      jsonrpc: "2.0",
      id: request.id,
      error: {
        code: row.rpcCode ?? -32e3,
        message: row.message || "Agent host request failed"
      }
    });
  }
}
function handleLine(line) {
  if (!line.trim()) return;
  let message;
  try {
    message = JSON.parse(line.replace(/^\uFEFF/, ""));
  } catch (error2) {
    writeMessage({
      jsonrpc: "2.0",
      id: null,
      error: {
        code: -32700,
        message: "Invalid JSON",
        data: String(error2)
      }
    });
    return;
  }
  if (!message || message.jsonrpc !== "2.0") {
    writeMessage({
      jsonrpc: "2.0",
      id: null,
      error: {
        code: -32600,
        message: "Invalid request"
      }
    });
    return;
  }
  if (!("id" in message) || message.id === void 0) {
    if ("method" in message && typeof message.method === "string" && handlePeerFetchNotification(message)) return;
    writeMessage({
      jsonrpc: "2.0",
      id: null,
      error: {
        code: -32600,
        message: "Invalid request"
      }
    });
    return;
  }
  if (!("method" in message) || typeof message.method !== "string") {
    if (!handlePeerResponse(message)) {
      process.stderr.write(`[agent-host] unexpected peer response id=${String(message.id)}
`);
    }
    return;
  }
  void handleIncomingRequest(message);
}
var input = import_node_readline.default.createInterface({
  input: process.stdin,
  crlfDelay: Infinity
});
input.on("line", handleLine);
input.on("close", () => {
  for (const controller of activeRuns.values()) controller.abort(new Error("IDE peer disconnected."));
  activeRuns.clear();
  for (const pending of peerPending.values()) {
    clearTimeout(pending.timer);
    pending.reject(new Error("IDE peer disconnected."));
  }
  peerPending.clear();
  for (const [streamId, stream] of peerFetchStreams) {
    cleanupPeerFetchStream(streamId);
    try {
      stream.controller.error(new Error("IDE peer disconnected."));
    } catch {}
  }
  process.exit(0);
});
process.stderr.write(`[agent-host] ready protocol=${PROTOCOL_VERSION} pid=${process.pid}
`);
/*! Bundled license information:

@modelcontextprotocol/client/dist/src-D_zzAWoS.mjs:
  (*!
  * content-type
  * Copyright(c) 2015 Douglas Christopher Wilson
  * MIT Licensed
  *)
*/
//# sourceMappingURL=agent-host.js.map
export { import_node_readline, PROTOCOL_VERSION, TOOL_NAMES, peerPending, peerFetchStreams, activeRuns, nextPeerRequestId, writeMessage, asRecord, parseImages, parseHistory, parseExternalTools, parseAgentCheckpoint, parseAgentRunInput, clearPeerRequest, createPeerRequest, requestPeer, cleanupPeerFetchStream, cancelPeerFetch, fetchThroughExtensionHost, handlePeerFetchNotification, dispatch, handlePeerResponse, handleIncomingRequest, handleLine, input };
