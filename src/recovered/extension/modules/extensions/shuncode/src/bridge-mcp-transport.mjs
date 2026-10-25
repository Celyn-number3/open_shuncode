// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { init_define_SHUNCODE_BUILD_INFO } from "../../../runtime/build-info.mjs";
import { isInitializeRequest } from "../../../vendor/@modelcontextprotocol/server/dist/src-CX2iR2pK.mjs";
import { Server } from "../../../vendor/@modelcontextprotocol/server/dist/mcp-DXXb3Vv3.mjs";
import { NodeStreamableHTTPServerTransport } from "../../../vendor/@modelcontextprotocol/node/dist/index.mjs";
import { handleModernPost, isModernRequest } from "./bridge-mcp-modern.mjs";
import { CUSTOM_TOOL_OUTPUT_SCHEMA } from "../../../src/custom-tool-contract.mjs";
import { BoundedInMemoryEventStore } from "../../../src/bridge-event-store.mjs";
import { SHUNCODE_BEHAVIOR_VERSION } from "../../../src/version.mjs";
import { createBridgeHttpRoutes, handleBridgeHttpRequest, writeBridgeJsonError, writeBridgeJsonRpcError } from "../../../src/bridge-http-router.mjs";
import { JsonRpcRequestIdRegistry, requestIdsOfRequest } from "../../../src/jsonrpc-request-id-registry.mjs";
import { BridgeSessionRegistry } from "../../../src/bridge-session-registry.mjs";
import { bridgeManagedCommandOwnerId } from "../../../src/managed-command-cancellation.mjs";
import { BRIDGE_SERVER_INSTRUCTIONS, BRIDGE_TOOL_DEFINITIONS, MAX_REQUEST_BYTES, MAX_SESSIONS, SESSION_EVENT_STORE_LIMIT, SESSION_IDLE_TIMEOUT_MS, SESSION_KEEPALIVE_INTERVAL_MS, SESSION_PRUNE_INTERVAL_MS, SESSION_RETRY_INTERVAL_MS } from "./bridge-constants.mjs";
// extensions/shuncode/src/bridge-mcp-transport.ts
init_define_SHUNCODE_BUILD_INFO();
var import_node_crypto8 = require("node:crypto");
var import_node_http3 = require("node:http");

// node_modules/@modelcontextprotocol/server/dist/index.mjs

// extensions/shuncode/src/bridge-mcp-transport.ts
function bridgeMethodOf(body) {
  const list = Array.isArray(body) ? body : [body];
  return list.map(message => {
    if (!message || typeof message !== "object") return "(non-object)";
    const method = message.method;
    return typeof method === "string" ? method : "(no method)";
  }).join(",");
}
var BridgeMcpTransport = class {
  constructor(deps) {
    this.deps = deps;
    deps.log("[bridge] session continuity: bounded-retention-v1 (capacity bounded; explicit close/shutdown still apply)");
    this.sessions = new BridgeSessionRegistry({
      closeSession: session => {
        try {
          void session.transport.close();
        } catch {}
        try {
          void session.server.close();
        } catch {}
      },
      onSessionDestroyed: (sessionId, _session, reason) => {
        const commandOwnerId = bridgeManagedCommandOwnerId(sessionId);
        this.deps.endRemoteConversation(commandOwnerId);
        this.deps.releaseCommandOwner(commandOwnerId);
        this.revision_ += 1;
        this.deps.log(`[bridge] session destroyed: ${sessionId} reason=${reason}`);
      }
    });
  }
  deps;
  sessions;
  httpServer;
  localPort;
  sessionPruneTimer;
  activeRequests = 0;
  revision_ = 0;
  /**
   * DELETE can cause the SDK to emit both onsessionclosed and onclose. Retain
   * the request context only while its handler is in flight so either callback
   * preserves the client-requested reason without mislabeling other closes.
   */
  deleteInFlightSessionIds = /* @__PURE__ */new Set();
  lifecycle = "idle";
  startInFlight;
  closeInFlight;
  startOptions;
  /** Transport-side revision; the facade adds this to its own for getStatus(). */
  get revision() {
    return this.revision_;
  }
  snapshot() {
    let lastSessionActivityAt;
    for (const session of this.sessions.values()) {
      lastSessionActivityAt = Math.max(lastSessionActivityAt ?? 0, session.lastActivity);
    }
    return {
      localPort: this.localPort,
      activeRequests: this.activeRequests,
      connected: this.sessions.size > 0,
      revision: this.revision_,
      sessions: this.sessions.size,
      lastSessionActivityAt
    };
  }
  /** Internal (non-snapshot) predicate for facade lifecycle/tunnel-recovery reads. */
  isListening() {
    return this.lifecycle === "listening";
  }
  now() {
    return this.deps.now ? this.deps.now() : Date.now();
  }
  // ---- Lifecycle (segmented; never a single reordering stop()) --------------
  /**
   * Start the local HTTP/MCP listener. Idempotent and concurrency-safe: a second
   * call while `starting` reuses the in-flight promise (only one listen), a call
   * while `listening` resolves immediately, and a call while `closing` waits for
   * the close to finish before starting fresh.
   */
  async start(options) {
    if (this.lifecycle === "listening") return;
    if (this.lifecycle === "starting" && this.startInFlight) return this.startInFlight;
    if (this.lifecycle === "closing" && this.closeInFlight) {
      await this.closeInFlight;
      return this.start(options);
    }
    this.lifecycle = "starting";
    const startOptions = {
      ...options
    };
    this.startOptions = startOptions;
    const run = (async () => {
      try {
        await this.startHttpServer(startOptions);
        this.lifecycle = "listening";
      } catch (error2) {
        const server = this.httpServer;
        this.httpServer = void 0;
        if (server) {
          await new Promise(resolve => server.close(() => resolve()));
        }
        if (this.sessionPruneTimer) {
          this.sessionPruneTimer.clear();
          this.sessionPruneTimer = void 0;
        }
        this.localPort = void 0;
        this.startOptions = void 0;
        this.lifecycle = "idle";
        throw error2;
      }
    })();
    this.startInFlight = run;
    try {
      await run;
    } finally {
      this.startInFlight = void 0;
    }
  }
  /**
   * First stop segment: stop pruning and destroy all sessions. Intentionally
   * does NOT zero `activeRequests` — that happens in closeListener(), preserving
   * the original ordering (sessions/prune → tunnel kill → activeRequests/listener).
   */
  destroySessionsAndStopPruning() {
    if (this.sessionPruneTimer) {
      this.sessionPruneTimer.clear();
      this.sessionPruneTimer = void 0;
    }
    this.sessions.destroyAll("bridge-shutdown");
  }
  /**
   * Third stop segment: zero active requests, close the listener and clear the
   * local port. Idempotent and concurrency-safe. If a start is still in flight,
   * wait for it to settle first — swallowing any startup error so cleanup still
   * completes — then close.
   */
  async closeListener() {
    if (this.lifecycle === "closing" && this.closeInFlight) return this.closeInFlight;
    if (this.lifecycle === "starting" && this.startInFlight) {
      try {
        await this.startInFlight;
      } catch {}
      return this.closeListener();
    }
    if (this.lifecycle === "idle") {
      this.activeRequests = 0;
      this.localPort = void 0;
      this.startOptions = void 0;
      return;
    }
    this.lifecycle = "closing";
    const run = (async () => {
      this.activeRequests = 0;
      const server = this.httpServer;
      this.httpServer = void 0;
      if (server) {
        await new Promise(resolve => server.close(() => resolve()));
      }
      this.localPort = void 0;
      this.startOptions = void 0;
    })();
    this.closeInFlight = run;
    try {
      await run;
    } finally {
      this.lifecycle = "idle";
      this.closeInFlight = void 0;
    }
  }
  // ---- HTTP listener -------------------------------------------------------
  async startHttpServer(options) {
    const routes = createBridgeHttpRoutes(options.routeToken);
    const handler = (request, response) => {
      void handleBridgeHttpRequest({
        routes,
        maxRequestBytes: MAX_REQUEST_BYTES,
        // Keep the optional Streamable HTTP GET/SSE channel available for every
        // provider. Some remote MCP clients open it immediately after initialize;
        // rejecting it only for Quick Tunnel made otherwise healthy servers look
        // disconnected even though POST JSON responses were working.
        standaloneGetEnabled: true
      }, {
        getSessionCount: () => this.sessions.size,
        handlePost: (incoming, outgoing, body, sessionId) => this.handlePost(incoming, outgoing, body, sessionId),
        handleGet: (incoming, outgoing, sessionId) => this.handleGet(incoming, outgoing, sessionId),
        handleDelete: (incoming, outgoing, sessionId) => this.handleDelete(incoming, outgoing, sessionId)
      }, request, response).catch(error2 => {
        const message = error2 instanceof Error ? error2.message : String(error2);
        this.deps.log(`[bridge] HTTP error: ${message}`);
        this.deps.log(`[bridge] HTTP error STACK: ${error2 instanceof Error ? error2.stack : "n/a"}`);
        writeBridgeJsonError(response, 500, message);
      });
    };
    const server = this.deps.createHttpServer ? this.deps.createHttpServer(handler) : (0, import_node_http3.createServer)(handler);
    this.httpServer = server;
    await new Promise((resolve, reject) => {
      const onError = error2 => {
        server.off("listening", onListening);
        if (options.provider === "cloudflare-named" && error2.code === "EADDRINUSE") {
          reject(new Error(`Cloudflare Named Tunnel local port ${options.namedTunnelLocalPort} is already in use. Choose another port and update the Cloudflare published application Service URL.`));
          return;
        }
        reject(error2);
      };
      const onListening = () => {
        server.off("error", onError);
        resolve();
      };
      server.once("error", onError);
      server.once("listening", onListening);
      server.listen(options.provider === "cloudflare-named" ? options.namedTunnelLocalPort : 0, "127.0.0.1");
    });
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("Bridge local HTTP server did not expose a TCP port.");
    this.localPort = address.port;
    this.sessionPruneTimer = this.deps.createTimer ? this.deps.createTimer(() => this.pruneSessions(), SESSION_PRUNE_INTERVAL_MS) : createUnrefInterval(() => this.pruneSessions(), SESSION_PRUNE_INTERVAL_MS);
  }
  // ---- Request handlers ----------------------------------------------------
  async handlePost(request, response, body, sessionId) {
    if (!sessionId && !isInitializeRequest(body) && (await isModernRequest(request, body, this.deps.diag))) {
      this.deps.diag(`POST modern-era method=${bridgeMethodOf(body)}`);
      await handleModernPost(request, response, body, this.modernDeps());
      return;
    }
    if (sessionId) {
      const session = this.sessions.get(sessionId);
      if (!session) {
        this.deps.diag(`POST no-session sid=${sessionId.slice(0, 8)} -> 404`);
        writeBridgeJsonError(response, 404, "Session not found. The MCP session may have expired.");
        return;
      }
      session.lastActivity = this.now();
      const requestIds = requestIdsOfRequest(body);
      const claim = session.requestIds.claim(requestIds);
      if (!claim.ok) {
        this.deps.diag(`POST duplicate request id sid=${sessionId.slice(0, 8)} id=${String(claim.conflictId)}`);
        writeBridgeJsonRpcError(response, 409, -32009, "Duplicate JSON-RPC request id is already in flight for this MCP session.", claim.conflictId);
        return;
      }
      session.activeRequests += 1;
      this.activeRequests += 1;
      try {
        await session.transport.handleRequest(request, response, body);
      } finally {
        session.requestIds.release(requestIds);
        session.activeRequests = Math.max(0, session.activeRequests - 1);
        session.lastActivity = this.now();
        this.activeRequests = Math.max(0, this.activeRequests - 1);
      }
      return;
    }
    if (!isInitializeRequest(body)) {
      this.deps.diag(`POST no-sid non-initialize -> 400 method=${bridgeMethodOf(body)}`);
      writeBridgeJsonError(response, 400, "Bad Request: a POST without Mcp-Session-Id must be an MCP initialize request.");
      return;
    }
    this.sessions.makeRoom(MAX_SESSIONS);
    if (this.sessions.size >= MAX_SESSIONS) {
      writeBridgeJsonError(response, 503, "Bridge session capacity reached. Close an existing MCP session and retry.");
      return;
    }
    const {
      transport,
      server
    } = this.createSession();
    this.activeRequests += 1;
    try {
      await server.connect(transport);
      await transport.handleRequest(request, response, body);
    } catch (error2) {
      const newSessionId = transport.sessionId;
      if (newSessionId) this.sessions.destroy(newSessionId, "initialize-error");
      throw error2;
    } finally {
      this.activeRequests = Math.max(0, this.activeRequests - 1);
    }
  }
  async handleGet(request, response, sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      this.deps.diag(`GET no-session sid=${sessionId.slice(0, 8)} -> 404`);
      writeBridgeJsonError(response, 404, "Session not found. The MCP session may have expired.");
      return;
    }
    const getStartedAt = this.now();
    this.deps.diag(`GET stream open sid=${sessionId.slice(0, 8)}`);
    response.once("close", () => {
      this.deps.diag(`GET stream closed sid=${sessionId.slice(0, 8)} after ${this.now() - getStartedAt}ms aborted=${request.aborted === true} destroyed=${response.destroyed === true} finished=${response.writableFinished === true}`);
    });
    session.lastActivity = this.now();
    session.activeStreams += 1;
    let released = false;
    const releaseStream = () => {
      if (released) return;
      released = true;
      session.activeStreams = Math.max(0, session.activeStreams - 1);
      session.lastActivity = this.now();
    };
    response.once("close", releaseStream);
    try {
      await session.transport.handleRequest(request, response);
    } finally {
      response.off("close", releaseStream);
      releaseStream();
    }
  }
  async handleDelete(request, response, sessionId) {
    this.deleteInFlightSessionIds.add(sessionId);
    try {
      const destroyed = await this.sessions.destroyAfter(sessionId, async session => {
        await session.transport.handleRequest(request, response);
      }, "delete");
      if (!destroyed) {
        writeBridgeJsonError(response, 404, "Session not found.");
      }
    } finally {
      this.deleteInFlightSessionIds.delete(sessionId);
    }
  }
  // ---- Session assembly (always performed here; never bypassed by tests) ----
  createSession() {
    const server = this.instantiateMcpServer();
    let transport;
    const options = {
      sessionIdGenerator: () => (0, import_node_crypto8.randomUUID)(),
      enableJsonResponse: this.startOptions?.provider === "cloudflare",
      eventStore: new BoundedInMemoryEventStore(SESSION_EVENT_STORE_LIMIT),
      keepAliveMs: SESSION_KEEPALIVE_INTERVAL_MS,
      retryInterval: SESSION_RETRY_INTERVAL_MS,
      onsessioninitialized: sid => {
        this.deps.beginRemoteConversation(bridgeManagedCommandOwnerId(sid));
        this.sessions.set(sid, {
          transport,
          server,
          requestIds: new JsonRpcRequestIdRegistry(),
          lastActivity: this.now(),
          activeRequests: 0,
          activeStreams: 0
        });
        this.revision_ += 1;
        this.deps.log(`[bridge] new MCP session: ${sid}`);
      },
      onsessionclosed: sid => {
        this.destroyClosedSession(sid);
      }
    };
    transport = this.deps.createSessionTransport ? this.deps.createSessionTransport(options) : new NodeStreamableHTTPServerTransport(options);
    this.registerToolHandlers(server, () => transport.sessionId);
    transport.onclose = () => {
      const sid = transport.sessionId;
      if (sid) this.destroyClosedSession(sid);
    };
    return {
      transport,
      server
    };
  }
  /**
   * Build a bare MCP server carrying the Bridge identity, capabilities and instructions.
   * Shared by both protocol eras so the two paths can never drift apart.
   */
  instantiateMcpServer() {
    const serverInfo = {
      name: "shuncode-bridge",
      version: SHUNCODE_BEHAVIOR_VERSION
    };
    const serverOptions = {
      capabilities: {
        tools: {},
        logging: {}
      },
      // 2026-07-28 cache hints. Omitting these makes the SDK emit `ttlMs: 0`
      // and `cacheScope: 'private'`, i.e. "never cache", which is what the
      // Bridge shipped before. The tool list only changes when the extension
      // itself changes, so let shared caches hold it briefly; discovery is
      // even more stable. 2025-era responses are unaffected by these hints.
      cacheHints: {
        "tools/list": {
          ttlMs: 6e4,
          cacheScope: "public"
        },
        "server/discover": {
          ttlMs: 3e5,
          cacheScope: "public"
        }
      },
      // Keep this connection-specific rule beside the MCP metadata it must reach;
      // BRIDGE_SERVER_INSTRUCTIONS remains the shared base prompt.
      instructions: this.deps.serverInstructions?.() ?? BRIDGE_SERVER_INSTRUCTIONS
    };
    return this.deps.createMcpServer ? this.deps.createMcpServer(serverInfo, serverOptions) : new Server(serverInfo, serverOptions);
  }
  /**
   * Dependencies handed to the modern-era path. Deliberately narrow: it can mint a
   * per-request server, bracket an in-flight request and log — nothing session-shaped
   * is reachable from there.
   */
  modernDeps() {
    return {
      createServer: (scopeId, taskOwnerId) => {
        const server = this.instantiateMcpServer();
        this.registerToolHandlers(server, () => scopeId, taskOwnerId);
        return server;
      },
      trackRequest: async run => {
        this.activeRequests += 1;
        try {
          return await run();
        } finally {
          this.activeRequests = Math.max(0, this.activeRequests - 1);
        }
      },
      diag: message => this.deps.diag(message)
    };
  }
  /**
   * Register the Bridge tool surface on `server`.
   *
   * `resolveSessionId` supplies the command-owner scope: the legacy path passes the
   * transport's session id, while the modern path passes the stable owner derived
   * from the modern client envelope because it has no Mcp-Session-Id.
   */
  registerToolHandlers(server, resolveSessionId, taskOwnerId) {
    server.setRequestHandler("tools/list", async () => ({
      tools: [...BRIDGE_TOOL_DEFINITIONS.map(tool => ({
        name: tool.name,
        title: tool.title ?? tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
        outputSchema: tool.outputSchema,
        annotations: tool.annotations
      })), ...(this.deps.listCustomTools?.() ?? []).map(tool => ({
        name: tool.name,
        title: tool.title,
        description: tool.description,
        inputSchema: tool.inputSchema,
        outputSchema: CUSTOM_TOOL_OUTPUT_SCHEMA,
        // User-added tools run an arbitrary local command, so they are declared
        // destructive: clients must not auto-approve them the way they may for
        // the read-only built-ins.
        annotations: {
          title: tool.title,
          readOnlyHint: false,
          destructiveHint: true,
          idempotentHint: false,
          openWorldHint: false
        }
      }))]
    }));
    server.setRequestHandler("tools/call", async (request, extra) => {
      const toolName = request.params.name;
      const args = request.params.arguments ?? {};
      const result = await this.deps.dispatchToolCall(toolName, args, {
        signal: extra.signal,
        commandOwnerId: bridgeManagedCommandOwnerId(resolveSessionId()),
        taskOwnerId
      });
      return {
        content: result.content,
        isError: result.isError,
        structuredContent: result.structuredContent
      };
    });
  }
  pruneSessions() {
    this.sessions.prune(this.now(), SESSION_IDLE_TIMEOUT_MS, MAX_SESSIONS);
  }
  /** Attribute a close to DELETE only while that request is actively handled. */
  destroyClosedSession(sessionId) {
    const reason = this.deleteInFlightSessionIds.has(sessionId) ? "delete" : "transport-close";
    this.sessions.destroy(sessionId, reason);
  }
};
function createUnrefInterval(callback, ms) {
  const timer = setInterval(callback, ms);
  timer.unref?.();
  return {
    clear: () => clearInterval(timer)
  };
}

// extensions/shuncode/src/bridge-tool-dispatcher.ts
export { import_node_crypto8, import_node_http3, bridgeMethodOf, BridgeMcpTransport, createUnrefInterval };
