// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { init_define_SHUNCODE_BUILD_INFO } from "../../../../runtime/build-info.mjs";
import { CLIENT_CAPABILITIES_META_KEY, CLIENT_INFO_META_KEY, DEFAULT_NEGOTIATED_PROTOCOL_VERSION, JSONRPCMessageSchema, SUPPORTED_PROTOCOL_VERSIONS } from "../../core/dist/auth-CUe6YdwF.mjs";
import { LADDER_ERROR_HTTP_STATUS, MissingRequiredClientCapabilityError, ProtocolErrorCode, SUPPORTED_MODERN_PROTOCOL_VERSIONS, SdkError, SdkErrorCode, UnsupportedProtocolVersionError, classifyInboundRequest, httpStatusForErrorCode, isInitializeRequest, isJSONRPCErrorResponse, isJSONRPCRequest, isJSONRPCResultResponse, isJsonContentType, mediaTypeEssence, missingClientCapabilities, modernOnlyStrictRejection, requestMetaOf, requiredClientCapabilitiesForRequest, scanXMcpHeaderDeclarations, setNegotiatedProtocolVersion, validateMcpParamHeaders, validateStandardRequestHeaders } from "./src-CX2iR2pK.mjs";
import { DEFAULT_MAX_SUBSCRIPTIONS, DEFAULT_SSE_KEEP_ALIVE_MS, InMemoryServerEventBus, McpServer, armSseKeepAlive, createListenRouter, createServerNotifier, installModernOnlyHandlers, seedClientIdentityFromEnvelope, serverIdentityOf } from "./mcp-DXXb3Vv3.mjs";
// node_modules/@modelcontextprotocol/server/dist/index.mjs
init_define_SHUNCODE_BUILD_INFO();

// node_modules/@modelcontextprotocol/server/dist/mcp-DXXb3Vv3.mjs

// node_modules/@modelcontextprotocol/server/dist/index.mjs
var PerRequestHTTPServerTransport = class {
  onclose;
  onerror;
  onmessage;
  _classification;
  _responseMode;
  _started = false;
  _used = false;
  _closed = false;
  _terminalDelivered = false;
  /**
  * `true` only while the inbound message is being delivered synchronously
  * to the connected protocol layer. The pre-handler gates (the era
  * registry gate, the edge→instance handoff check, the missing-handler
  * rejection) answer inside this window; request handlers always run
  * after it (the protocol layer defers them to a microtask). An error
  * sent inside the window is therefore ladder-originated, and an error
  * sent after it is handler-produced.
  */
  _dispatchWindowOpen = false;
  _requestId;
  _deferredResponse;
  _sse;
  _abortCleanup;
  _keepAliveMs;
  constructor(options) {
    this._classification = options.classification;
    this._responseMode = options.responseMode ?? "auto";
    this._keepAliveMs = options.keepAliveMs ?? DEFAULT_SSE_KEEP_ALIVE_MS;
  }
  async start() {
    if (this._started) throw new Error("PerRequestHTTPServerTransport is already started");
    this._started = true;
  }
  /**
  * Serves the single exchange: delivers the classified message to the
  * connected server instance and resolves with the HTTP response.
  *
  * Throws when called a second time (the transport is strictly
  * single-use), or before a server has been connected to the transport.
  * The returned promise rejects with a connection-closed error when the
  * transport is closed before a response was produced (for example because
  * the client disconnected).
  */
  async handleMessage(message, extra) {
    if (this._used) throw new Error("PerRequestHTTPServerTransport serves exactly one exchange; construct a new transport per request");
    if (!this._started || this.onmessage === void 0) throw new Error("PerRequestHTTPServerTransport is not connected: connect a server to this transport before handling a message");
    if (this._closed) throw new Error("PerRequestHTTPServerTransport is closed");
    this._used = true;
    const signal = extra?.request?.signal;
    if (signal?.aborted) {
      await this.close();
      throw new SdkError(SdkErrorCode.ConnectionClosed, "The request was aborted before it could be handled");
    }
    const messageExtra = {
      classification: this._classification,
      ...(extra?.request !== void 0 && {
        request: extra.request
      }),
      ...(extra?.authInfo !== void 0 && {
        authInfo: extra.authInfo
      })
    };
    if (isJSONRPCRequest(message)) {
      this._requestId = message.id;
      let resolve;
      let reject;
      const promise = new Promise((promiseResolve, promiseReject) => {
        resolve = promiseResolve;
        reject = promiseReject;
      });
      this._deferredResponse = {
        promise,
        resolve,
        reject,
        settled: false
      };
      if (signal !== void 0) {
        const onAbort = () => void this.close();
        signal.addEventListener("abort", onAbort, {
          once: true
        });
        this._abortCleanup = () => signal.removeEventListener("abort", onAbort);
      }
      this._dispatchWindowOpen = true;
      try {
        this.onmessage(message, messageExtra);
      } finally {
        this._dispatchWindowOpen = false;
      }
      if (this._responseMode === "sse" && !this._closed && !this._deferredResponse.settled) this.upgradeToSse();
      return promise;
    }
    this.onmessage(message, messageExtra);
    return new Response(null, {
      status: 202
    });
  }
  async send(message, options) {
    if (this._closed) return;
    const isResponse = isJSONRPCResultResponse(message) || isJSONRPCErrorResponse(message);
    const relatedId = isResponse ? message.id : options?.relatedRequestId;
    if (this._requestId === void 0 || relatedId === void 0 || relatedId !== this._requestId) {
      if (isResponse) this.onerror?.(/* @__PURE__ */new Error(`Received a response for an unknown request id: ${String(message.id)}`));
      return;
    }
    if (isResponse) {
      if (this._terminalDelivered) return;
      this._terminalDelivered = true;
      const errorCode = isJSONRPCErrorResponse(message) ? message.error.code : void 0;
      const ladderStatus = errorCode !== void 0 && (this._dispatchWindowOpen || errorCode === ProtocolErrorCode.MissingRequiredClientCapability) ? LADDER_ERROR_HTTP_STATUS[errorCode] : void 0;
      if (ladderStatus !== void 0 && this._sse === void 0) {
        this.settleResponse(Response.json(message, {
          status: ladderStatus,
          headers: {
            "Content-Type": "application/json"
          }
        }));
        queueMicrotask(() => void this.close());
        return;
      }
      if (this._sse !== void 0 || this._responseMode === "sse") {
        if (this._sse === void 0) this.upgradeToSse();
        this.writeMessageFrame(message);
        this.finalizeStream();
        return;
      }
      this.settleResponse(Response.json(message, {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }));
      queueMicrotask(() => void this.close());
      return;
    }
    if (this._responseMode === "json") return;
    if (this._sse === void 0) this.upgradeToSse();
    this.writeMessageFrame(message);
  }
  /**
  * Writes an SSE comment frame (a keep-alive heartbeat). Dropped when the
  * exchange is not currently streaming.
  */
  writeCommentFrame(comment) {
    if (this._closed || this._sse === void 0 || this._sse.closed) return;
    const frame2 = comment.split("\n").map(line => `: ${line}`).join("\n");
    this.writeFrame(`${frame2}

`);
  }
  async close() {
    if (this._closed) return;
    this._closed = true;
    this._abortCleanup?.();
    this._abortCleanup = void 0;
    if (this._sse?.keepAliveTimer !== void 0) clearInterval(this._sse.keepAliveTimer);
    if (this._sse !== void 0 && !this._sse.closed) {
      this._sse.closed = true;
      try {
        this._sse.controller.close();
      } catch {}
    }
    if (this._deferredResponse !== void 0 && !this._deferredResponse.settled) {
      this._deferredResponse.settled = true;
      this._deferredResponse.reject(new SdkError(SdkErrorCode.ConnectionClosed, "Connection closed before a response was produced"));
    }
    this.onclose?.();
  }
  settleResponse(response) {
    if (this._deferredResponse === void 0 || this._deferredResponse.settled) return;
    this._deferredResponse.settled = true;
    this._deferredResponse.resolve(response);
  }
  upgradeToSse() {
    let controller;
    const readable = new ReadableStream({
      start: streamController => {
        controller = streamController;
      },
      cancel: () => {
        this.close();
      }
    });
    this._sse = {
      controller,
      encoder: new TextEncoder(),
      closed: false
    };
    this._sse.keepAliveTimer = armSseKeepAlive(this._keepAliveMs, () => this.writeCommentFrame("keepalive"));
    this.settleResponse(new Response(readable, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no"
      }
    }));
  }
  finalizeStream() {
    if (this._sse?.keepAliveTimer !== void 0) clearInterval(this._sse.keepAliveTimer);
    if (this._sse !== void 0 && !this._sse.closed) {
      this._sse.closed = true;
      try {
        this._sse.controller.close();
      } catch {}
    }
    queueMicrotask(() => void this.close());
  }
  writeMessageFrame(message) {
    this.writeFrame(`event: message
data: ${JSON.stringify(message)}

`);
  }
  writeFrame(frame2) {
    if (this._sse === void 0 || this._sse.closed) return;
    try {
      this._sse.controller.enqueue(this._sse.encoder.encode(frame2));
    } catch (error2) {
      this.onerror?.(/* @__PURE__ */new Error(`Failed to write to the response stream: ${error2}`));
    }
  }
};
async function invoke(server, message, ctx) {
  const transport = new PerRequestHTTPServerTransport({
    classification: ctx.classification,
    ...(ctx.responseMode !== void 0 && {
      responseMode: ctx.responseMode
    }),
    ...(ctx.keepAliveMs !== void 0 && {
      keepAliveMs: ctx.keepAliveMs
    })
  });
  await server.connect(transport);
  return transport.handleMessage(message, {
    ...(ctx.request !== void 0 && {
      request: ctx.request
    }),
    ...(ctx.authInfo !== void 0 && {
      authInfo: ctx.authInfo
    })
  });
}
var WebStandardStreamableHTTPServerTransport = class {
  sessionIdGenerator;
  _started = false;
  _closed = false;
  _streamMapping = /* @__PURE__ */new Map();
  _requestToStreamMapping = /* @__PURE__ */new Map();
  _requestResponseMap = /* @__PURE__ */new Map();
  _initialized = false;
  _enableJsonResponse = false;
  _standaloneSseStreamId = "_GET_stream";
  _eventStore;
  _onsessioninitialized;
  _onsessionclosed;
  _allowedHosts;
  _allowedOrigins;
  _enableDnsRebindingProtection;
  _retryInterval;
  _supportedProtocolVersions;
  _keepAliveMs;
  sessionId;
  onclose;
  onerror;
  onmessage;
  constructor(options = {}) {
    this.sessionIdGenerator = options.sessionIdGenerator;
    this._enableJsonResponse = options.enableJsonResponse ?? false;
    this._eventStore = options.eventStore;
    this._onsessioninitialized = options.onsessioninitialized;
    this._onsessionclosed = options.onsessionclosed;
    this._allowedHosts = options.allowedHosts;
    this._allowedOrigins = options.allowedOrigins;
    this._enableDnsRebindingProtection = options.enableDnsRebindingProtection ?? false;
    this._retryInterval = options.retryInterval;
    this._supportedProtocolVersions = options.supportedProtocolVersions ?? SUPPORTED_PROTOCOL_VERSIONS;
    this._keepAliveMs = options.keepAliveMs ?? DEFAULT_SSE_KEEP_ALIVE_MS;
  }
  startKeepAlive(controller, encoder) {
    if (this._closed) return void 0;
    const timer = armSseKeepAlive(this._keepAliveMs, () => {
      try {
        controller.enqueue(encoder.encode(": keepalive\n\n"));
      } catch {
        if (timer !== void 0) clearInterval(timer);
      }
    });
    return timer;
  }
  /**
  * Starts the transport. This is required by the {@linkcode Transport} interface but is a no-op
  * for the Streamable HTTP transport as connections are managed per-request.
  */
  async start() {
    if (this._started) throw new Error("Transport already started");
    this._started = true;
  }
  /**
  * Sets the supported protocol versions for header validation.
  * Called by the server during {@linkcode server/server.Server.connect | connect()} to pass its supported versions.
  */
  setSupportedProtocolVersions(versions) {
    this._supportedProtocolVersions = versions;
  }
  /**
  * Helper to create a JSON error response
  */
  createJsonErrorResponse(status, code, message, options) {
    const error2 = {
      code,
      message
    };
    if (options?.data !== void 0) error2.data = options.data;
    return Response.json({
      jsonrpc: "2.0",
      error: error2,
      id: null
    }, {
      status,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers
      }
    });
  }
  /**
  * Validates request headers for DNS rebinding protection.
  * @returns Error response if validation fails, `undefined` if validation passes.
  */
  validateRequestHeaders(req) {
    if (!this._enableDnsRebindingProtection) return;
    if (this._allowedHosts && this._allowedHosts.length > 0) {
      const hostHeader = req.headers.get("host");
      if (!hostHeader || !this._allowedHosts.includes(hostHeader)) {
        const error2 = `Invalid Host header: ${hostHeader}`;
        this.onerror?.(new Error(error2));
        return this.createJsonErrorResponse(403, -32e3, error2);
      }
    }
    if (this._allowedOrigins && this._allowedOrigins.length > 0) {
      const originHeader = req.headers.get("origin");
      if (originHeader && !this._allowedOrigins.includes(originHeader)) {
        const error2 = `Invalid Origin header: ${originHeader}`;
        this.onerror?.(new Error(error2));
        return this.createJsonErrorResponse(403, -32e3, error2);
      }
    }
  }
  /**
  * Handles an incoming HTTP request, whether `GET`, `POST`, or `DELETE`
  * Returns a `Response` object (Web Standard)
  */
  async handleRequest(req, options) {
    if (this._closed) return this.createJsonErrorResponse(404, -32001, "Session not found");
    const validationError = this.validateRequestHeaders(req);
    if (validationError) return validationError;
    switch (req.method) {
      case "POST":
        return this.handlePostRequest(req, options);
      case "GET":
        return this.handleGetRequest(req);
      case "DELETE":
        return this.handleDeleteRequest(req);
      default:
        return this.handleUnsupportedRequest();
    }
  }
  /**
  * Returns true if the client's protocol version supports empty SSE data in
  * priming events (the fix shipped with protocol version `2025-11-25`).
  *
  * The version is checked for membership in this transport instance's
  * supported protocol versions rather than with an open-ended
  * `>= '2025-11-25'` comparison: the value may come from an `initialize`
  * request body, which (unlike the `MCP-Protocol-Version` header) is not
  * validated against `supportedProtocolVersions` before reaching this
  * check. An unknown future version string must not silently enable
  * behavior reserved for versions this transport actually supports.
  */
  supportsEmptySSEData(protocolVersion) {
    return this._supportedProtocolVersions.includes(protocolVersion) && protocolVersion >= "2025-11-25";
  }
  /**
  * Writes a priming event to establish resumption capability.
  * Only sends if `eventStore` is configured (opt-in for resumability) and
  * the client's protocol version supports empty SSE data (a supported
  * version that is >= `2025-11-25`).
  */
  async writePrimingEvent(controller, encoder, streamId, protocolVersion) {
    if (!this._eventStore) return;
    if (!this.supportsEmptySSEData(protocolVersion)) return;
    const primingEventId = await this._eventStore.storeEvent(streamId, {});
    let primingEvent = `id: ${primingEventId}
data: 

`;
    if (this._retryInterval !== void 0) primingEvent = `id: ${primingEventId}
retry: ${this._retryInterval}
data: 

`;
    controller.enqueue(encoder.encode(primingEvent));
  }
  /**
  * Handles `GET` requests for SSE stream
  */
  async handleGetRequest(req) {
    if (!req.headers.get("accept")?.includes("text/event-stream")) {
      this.onerror?.(/* @__PURE__ */new Error("Not Acceptable: Client must accept text/event-stream"));
      return this.createJsonErrorResponse(406, -32e3, "Not Acceptable: Client must accept text/event-stream");
    }
    const sessionError = this.validateSession(req);
    if (sessionError) return sessionError;
    const protocolError = this.validateProtocolVersion(req);
    if (protocolError) return protocolError;
    if (this._eventStore) {
      const lastEventId = req.headers.get("last-event-id");
      if (lastEventId) return this.replayEvents(lastEventId);
    }
    if (this._streamMapping.get(this._standaloneSseStreamId) !== void 0) {
      this.onerror?.(/* @__PURE__ */new Error("Conflict: Only one SSE stream is allowed per session"));
      return this.createJsonErrorResponse(409, -32e3, "Conflict: Only one SSE stream is allowed per session");
    }
    const encoder = new TextEncoder();
    let streamController;
    let keepAliveTimer;
    const readable = new ReadableStream({
      start: controller => {
        streamController = controller;
      },
      cancel: () => {
        if (keepAliveTimer !== void 0) clearInterval(keepAliveTimer);
        if (this._streamMapping.get(this._standaloneSseStreamId)?.controller === streamController) this._streamMapping.delete(this._standaloneSseStreamId);
      }
    });
    const headers = {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no"
    };
    if (this.sessionId !== void 0) headers["mcp-session-id"] = this.sessionId;
    this._streamMapping.set(this._standaloneSseStreamId, {
      controller: streamController,
      encoder,
      cleanup: () => {
        if (keepAliveTimer !== void 0) clearInterval(keepAliveTimer);
        this._streamMapping.delete(this._standaloneSseStreamId);
        try {
          streamController.close();
        } catch {}
      }
    });
    keepAliveTimer = this.startKeepAlive(streamController, encoder);
    return new Response(readable, {
      headers
    });
  }
  /**
  * Replays events that would have been sent after the specified event ID
  * Only used when resumability is enabled
  */
  async replayEvents(lastEventId) {
    if (!this._eventStore) {
      this.onerror?.(/* @__PURE__ */new Error("Event store not configured"));
      return this.createJsonErrorResponse(400, -32e3, "Event store not configured");
    }
    try {
      let streamId;
      if (this._eventStore.getStreamIdForEventId) {
        streamId = await this._eventStore.getStreamIdForEventId(lastEventId);
        if (!streamId) {
          this.onerror?.(/* @__PURE__ */new Error("Invalid event ID format"));
          return this.createJsonErrorResponse(400, -32e3, "Invalid event ID format");
        }
        if (this._streamMapping.get(streamId) !== void 0) {
          this.onerror?.(/* @__PURE__ */new Error("Conflict: Stream already has an active connection"));
          return this.createJsonErrorResponse(409, -32e3, "Conflict: Stream already has an active connection");
        }
      }
      const headers = {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no"
      };
      if (this.sessionId !== void 0) headers["mcp-session-id"] = this.sessionId;
      const encoder = new TextEncoder();
      let streamController;
      let keepAliveTimer;
      let cancelled = false;
      let replayedStreamId;
      const readable = new ReadableStream({
        start: controller => {
          streamController = controller;
        },
        cancel: () => {
          cancelled = true;
          if (keepAliveTimer !== void 0) clearInterval(keepAliveTimer);
          if (replayedStreamId !== void 0 && this._streamMapping.get(replayedStreamId)?.controller === streamController) this._streamMapping.delete(replayedStreamId);
        }
      });
      const replayedEventIds = /* @__PURE__ */new Set();
      replayedStreamId = await this._eventStore.replayEventsAfter(lastEventId, {
        send: async (eventId, message) => {
          replayedEventIds.add(eventId);
          if (!this.writeSSEEvent(streamController, encoder, message, eventId)) try {
            streamController.close();
          } catch {}
        }
      });
      if (this._closed || cancelled) {
        try {
          streamController.close();
        } catch {}
        return this.createJsonErrorResponse(404, -32001, "Session not found");
      }
      this._streamMapping.get(replayedStreamId)?.cleanup();
      this._streamMapping.set(replayedStreamId, {
        controller: streamController,
        encoder,
        replayedEventIds,
        cleanup: () => {
          if (keepAliveTimer !== void 0) clearInterval(keepAliveTimer);
          this._streamMapping.delete(replayedStreamId);
          try {
            streamController.close();
          } catch {}
        }
      });
      if (replayedStreamId !== this._standaloneSseStreamId) {
        if (![...this._requestToStreamMapping.values()].includes(replayedStreamId)) {
          this._streamMapping.delete(replayedStreamId);
          try {
            streamController.close();
          } catch {}
        }
      }
      if (this._streamMapping.get(replayedStreamId)?.controller === streamController) keepAliveTimer = this.startKeepAlive(streamController, encoder);
      return new Response(readable, {
        headers
      });
    } catch (error2) {
      this.onerror?.(error2);
      return this.createJsonErrorResponse(500, -32e3, "Error replaying events");
    }
  }
  /**
  * Writes an event to an SSE stream via controller with proper formatting
  */
  writeSSEEvent(controller, encoder, message, eventId) {
    try {
      let eventData = `event: message
`;
      if (eventId) eventData += `id: ${eventId}
`;
      eventData += `data: ${JSON.stringify(message)}

`;
      controller.enqueue(encoder.encode(eventData));
      return true;
    } catch (error2) {
      this.onerror?.(error2);
      return false;
    }
  }
  /**
  * Handles unsupported requests (`PUT`, `PATCH`, etc.)
  */
  handleUnsupportedRequest() {
    this.onerror?.(/* @__PURE__ */new Error("Method not allowed."));
    return Response.json({
      jsonrpc: "2.0",
      error: {
        code: -32e3,
        message: "Method not allowed."
      },
      id: null
    }, {
      status: 405,
      headers: {
        Allow: "GET, POST, DELETE",
        "Content-Type": "application/json"
      }
    });
  }
  /**
  * Handles `POST` requests containing JSON-RPC messages
  */
  async handlePostRequest(req, options) {
    try {
      const acceptHeader = req.headers.get("accept");
      if (!acceptHeader?.includes("application/json") || !acceptHeader.includes("text/event-stream")) {
        this.onerror?.(/* @__PURE__ */new Error("Not Acceptable: Client must accept both application/json and text/event-stream"));
        return this.createJsonErrorResponse(406, -32e3, "Not Acceptable: Client must accept both application/json and text/event-stream");
      }
      if (!isJsonContentType(req.headers.get("content-type"))) {
        this.onerror?.(/* @__PURE__ */new Error("Unsupported Media Type: Content-Type must be application/json"));
        return this.createJsonErrorResponse(415, -32e3, "Unsupported Media Type: Content-Type must be application/json");
      }
      const request = req;
      let rawMessage;
      if (options?.parsedBody === void 0) try {
        rawMessage = await req.json();
      } catch (error2) {
        this.onerror?.(error2);
        return this.createJsonErrorResponse(400, -32700, "Parse error: Invalid JSON");
      } else rawMessage = options.parsedBody;
      let messages;
      try {
        messages = Array.isArray(rawMessage) ? rawMessage.map(msg => JSONRPCMessageSchema.parse(msg)) : [JSONRPCMessageSchema.parse(rawMessage)];
      } catch (error2) {
        this.onerror?.(error2);
        return this.createJsonErrorResponse(400, -32700, "Parse error: Invalid JSON-RPC message");
      }
      if (this._closed) return this.createJsonErrorResponse(404, -32001, "Session not found");
      const isInitializationRequest = messages.some(element => isInitializeRequest(element));
      if (isInitializationRequest) {
        if (this._initialized && this.sessionId !== void 0) {
          this.onerror?.(/* @__PURE__ */new Error("Invalid Request: Server already initialized"));
          return this.createJsonErrorResponse(400, -32600, "Invalid Request: Server already initialized");
        }
        if (messages.length > 1) {
          this.onerror?.(/* @__PURE__ */new Error("Invalid Request: Only one initialization request is allowed"));
          return this.createJsonErrorResponse(400, -32600, "Invalid Request: Only one initialization request is allowed");
        }
        this.sessionId = this.sessionIdGenerator?.();
        this._initialized = true;
        if (this.sessionId && this._onsessioninitialized) await Promise.resolve(this._onsessioninitialized(this.sessionId));
      }
      if (!isInitializationRequest) {
        const sessionError = this.validateSession(req);
        if (sessionError) return sessionError;
        const protocolError = this.validateProtocolVersion(req);
        if (protocolError) return protocolError;
      }
      if (this._closed) return this.createJsonErrorResponse(404, -32001, "Session not found");
      if (!messages.some(element => isJSONRPCRequest(element))) {
        for (const message of messages) this.onmessage?.(message, {
          authInfo: options?.authInfo,
          request
        });
        return new Response(null, {
          status: 202
        });
      }
      const streamId = crypto.randomUUID();
      const initRequest = messages.find(m => isInitializeRequest(m));
      const clientProtocolVersion = initRequest ? initRequest.params.protocolVersion : req.headers.get("mcp-protocol-version") ?? DEFAULT_NEGOTIATED_PROTOCOL_VERSION;
      if (this._enableJsonResponse) return new Promise(resolve => {
        this._streamMapping.set(streamId, {
          resolveJson: resolve,
          cleanup: () => {
            this._streamMapping.delete(streamId);
          }
        });
        for (const message of messages) if (isJSONRPCRequest(message)) this._requestToStreamMapping.set(message.id, streamId);
        for (const message of messages) this.onmessage?.(message, {
          authInfo: options?.authInfo,
          request
        });
      });
      const encoder = new TextEncoder();
      let streamController;
      let keepAliveTimer;
      const readable = new ReadableStream({
        start: controller => {
          streamController = controller;
        },
        cancel: () => {
          if (keepAliveTimer !== void 0) clearInterval(keepAliveTimer);
          if (this._streamMapping.get(streamId)?.controller === streamController) this._streamMapping.delete(streamId);
        }
      });
      const headers = {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no"
      };
      if (this.sessionId !== void 0) headers["mcp-session-id"] = this.sessionId;
      for (const message of messages) if (isJSONRPCRequest(message)) {
        this._streamMapping.set(streamId, {
          controller: streamController,
          encoder,
          cleanup: () => {
            if (keepAliveTimer !== void 0) clearInterval(keepAliveTimer);
            this._streamMapping.delete(streamId);
            try {
              streamController.close();
            } catch {}
          }
        });
        this._requestToStreamMapping.set(message.id, streamId);
      }
      await this.writePrimingEvent(streamController, encoder, streamId, clientProtocolVersion);
      for (const message of messages) {
        let closeSSEStream;
        let closeStandaloneSSEStream;
        if (isJSONRPCRequest(message) && this._eventStore && this.supportsEmptySSEData(clientProtocolVersion)) {
          closeSSEStream = () => {
            this.closeSSEStream(message.id);
          };
          closeStandaloneSSEStream = () => {
            this.closeStandaloneSSEStream();
          };
        }
        this.onmessage?.(message, {
          authInfo: options?.authInfo,
          request,
          closeSSEStream,
          closeStandaloneSSEStream
        });
      }
      if (this._streamMapping.get(streamId)?.controller === streamController) keepAliveTimer = this.startKeepAlive(streamController, encoder);
      return new Response(readable, {
        status: 200,
        headers
      });
    } catch (error2) {
      this.onerror?.(error2);
      return this.createJsonErrorResponse(400, -32700, "Parse error", {
        data: String(error2)
      });
    }
  }
  /**
  * Handles `DELETE` requests to terminate sessions
  */
  async handleDeleteRequest(req) {
    const sessionError = this.validateSession(req);
    if (sessionError) return sessionError;
    const protocolError = this.validateProtocolVersion(req);
    if (protocolError) return protocolError;
    try {
      await Promise.resolve(this._onsessionclosed?.(this.sessionId));
      return new Response(null, {
        status: 200
      });
    } finally {
      await this.close();
    }
  }
  /**
  * Validates session ID for non-initialization requests.
  * Returns `Response` error if invalid, `undefined` otherwise
  */
  validateSession(req) {
    if (this.sessionIdGenerator === void 0) return;
    if (!this._initialized) {
      this.onerror?.(/* @__PURE__ */new Error("Bad Request: Server not initialized"));
      return this.createJsonErrorResponse(400, -32e3, "Bad Request: Server not initialized");
    }
    const sessionId = req.headers.get("mcp-session-id");
    if (!sessionId) {
      this.onerror?.(/* @__PURE__ */new Error("Bad Request: Mcp-Session-Id header is required"));
      return this.createJsonErrorResponse(400, -32e3, "Bad Request: Mcp-Session-Id header is required");
    }
    if (sessionId !== this.sessionId) {
      this.onerror?.(/* @__PURE__ */new Error("Session not found"));
      return this.createJsonErrorResponse(404, -32001, "Session not found");
    }
  }
  /**
  * Validates the `MCP-Protocol-Version` header on incoming requests.
  *
  * For initialization: Version negotiation handles unknown versions gracefully
  * (server responds with its supported version).
  *
  * For subsequent requests with `MCP-Protocol-Version` header:
  * - Accept if in supported list
  * - 400 if unsupported
  *
  * For HTTP requests without the `MCP-Protocol-Version` header:
  * - Accept and default to the version negotiated at initialization
  */
  validateProtocolVersion(req) {
    const protocolVersion = req.headers.get("mcp-protocol-version");
    if (protocolVersion !== null && !this._supportedProtocolVersions.includes(protocolVersion)) {
      const error2 = `Bad Request: Unsupported protocol version: ${protocolVersion} (supported versions: ${this._supportedProtocolVersions.join(", ")})`;
      this.onerror?.(new Error(error2));
      return this.createJsonErrorResponse(400, -32e3, error2);
    }
  }
  async close() {
    if (this._closed) return;
    this._closed = true;
    for (const {
      cleanup
    } of this._streamMapping.values()) cleanup();
    this._streamMapping.clear();
    this._requestResponseMap.clear();
    this.onclose?.();
  }
  /**
  * Close an SSE stream for a specific request, triggering client reconnection.
  * Use this to implement polling behavior during long-running operations -
  * client will reconnect after the retry interval specified in the priming event.
  */
  closeSSEStream(requestId) {
    const streamId = this._requestToStreamMapping.get(requestId);
    if (!streamId) return;
    const stream = this._streamMapping.get(streamId);
    if (stream) stream.cleanup();
  }
  /**
  * Close the standalone `GET` SSE stream, triggering client reconnection.
  * Use this to implement polling behavior for server-initiated notifications.
  */
  closeStandaloneSSEStream() {
    const stream = this._streamMapping.get(this._standaloneSseStreamId);
    if (stream) stream.cleanup();
  }
  async send(message, options) {
    let requestId = options?.relatedRequestId;
    if (isJSONRPCResultResponse(message) || isJSONRPCErrorResponse(message)) requestId = message.id;
    if (requestId === void 0) {
      if (isJSONRPCResultResponse(message) || isJSONRPCErrorResponse(message)) throw new Error("Cannot send a response on a standalone SSE stream unless resuming a previous client request");
      let eventId;
      if (this._eventStore) eventId = await this._eventStore.storeEvent(this._standaloneSseStreamId, message);
      const standaloneSse = this._streamMapping.get(this._standaloneSseStreamId);
      if (standaloneSse === void 0) return;
      if (standaloneSse.controller && standaloneSse.encoder && (eventId === void 0 || !standaloneSse.replayedEventIds?.has(eventId))) this.writeSSEEvent(standaloneSse.controller, standaloneSse.encoder, message, eventId);
      return;
    }
    const streamId = this._requestToStreamMapping.get(requestId);
    if (!streamId) throw new Error(`No connection established for request ID: ${String(requestId)}`);
    let stream = this._streamMapping.get(streamId);
    if (!this._enableJsonResponse) {
      let eventId;
      if (this._eventStore) {
        eventId = await this._eventStore.storeEvent(streamId, message);
        stream = this._streamMapping.get(streamId);
      }
      if (stream?.controller && stream?.encoder && (eventId === void 0 || !stream.replayedEventIds?.has(eventId))) this.writeSSEEvent(stream.controller, stream.encoder, message, eventId);
    }
    if (isJSONRPCResultResponse(message) || isJSONRPCErrorResponse(message)) {
      this._requestResponseMap.set(requestId, message);
      const relatedIds = [...this._requestToStreamMapping.entries()].filter(([_, sid]) => sid === streamId).map(([id]) => id);
      if (relatedIds.every(id => this._requestResponseMap.has(id))) {
        if (!stream) {
          if (this._enableJsonResponse) throw new Error(`No connection established for request ID: ${String(requestId)}`);
          if (!this._eventStore) {
            this.onerror?.(/* @__PURE__ */new Error(`Response for request ID ${String(requestId)} is undeliverable: per-request stream is disconnected and no eventStore is configured`));
            for (const id of relatedIds) {
              this._requestResponseMap.delete(id);
              this._requestToStreamMapping.delete(id);
            }
            return;
          }
          for (const id of relatedIds) {
            this._requestResponseMap.delete(id);
            this._requestToStreamMapping.delete(id);
          }
          return;
        }
        if (this._enableJsonResponse && stream.resolveJson) {
          const headers = {
            "Content-Type": "application/json"
          };
          if (this.sessionId !== void 0) headers["mcp-session-id"] = this.sessionId;
          const responses = relatedIds.map(id => this._requestResponseMap.get(id));
          if (responses.length === 1) stream.resolveJson(Response.json(responses[0], {
            status: 200,
            headers
          }));else stream.resolveJson(Response.json(responses, {
            status: 200,
            headers
          }));
          stream.cleanup();
        } else stream.cleanup();
        for (const id of relatedIds) {
          this._requestResponseMap.delete(id);
          this._requestToStreamMapping.delete(id);
        }
      }
    }
  }
};
function echoableRequestId(body) {
  if (body === null || typeof body !== "object" || Array.isArray(body)) return null;
  const {
    method,
    id
  } = body;
  if (typeof method !== "string") return null;
  return typeof id === "string" || typeof id === "number" ? id : null;
}
function jsonRpcErrorResponse(httpStatus, code, message, data, id = null) {
  return Response.json({
    jsonrpc: "2.0",
    error: {
      code,
      message,
      ...(data !== void 0 && {
        data
      })
    },
    id
  }, {
    status: httpStatus
  });
}
function rejectionResponse(rejection2, id = null) {
  return jsonRpcErrorResponse(rejection2.httpStatus, rejection2.code, rejection2.message, rejection2.data, id);
}
function toError(value) {
  return value instanceof Error ? value : new Error(String(value));
}
function internalServerErrorResponse(id = null) {
  return jsonRpcErrorResponse(500, -32603, "Internal server error", void 0, id);
}
function createLegacyStatelessFallback(factory, onerror, keepAliveMs) {
  return async (request, options) => {
    if (request.method.toUpperCase() !== "POST") return jsonRpcErrorResponse(405, -32e3, "Method not allowed.");
    try {
      const product = await factory({
        era: "legacy",
        ...(options?.authInfo !== void 0 && {
          authInfo: options.authInfo
        }),
        requestInfo: request
      });
      const transport = new WebStandardStreamableHTTPServerTransport({
        sessionIdGenerator: void 0,
        ...(keepAliveMs !== void 0 && {
          keepAliveMs
        })
      });
      await product.connect(transport);
      const teardown = () => {
        transport.close().catch(() => {});
        product.close().catch(() => {});
      };
      request.signal?.addEventListener("abort", teardown, {
        once: true
      });
      const response = await transport.handleRequest(request, {
        ...(options?.authInfo !== void 0 && {
          authInfo: options.authInfo
        }),
        ...(options?.parsedBody !== void 0 && {
          parsedBody: options.parsedBody
        })
      });
      if (response.body === null || mediaTypeEssence(response.headers.get("content-type")) !== "text/event-stream") {
        teardown();
        return response;
      }
      const reader = response.body.getReader();
      let toreDown = false;
      const completeExchange = () => {
        if (!toreDown) {
          toreDown = true;
          teardown();
        }
      };
      const monitoredBody = new ReadableStream({
        pull: async controller => {
          try {
            const {
              done,
              value
            } = await reader.read();
            if (done) {
              completeExchange();
              controller.close();
              return;
            }
            if (value !== void 0) controller.enqueue(value);
          } catch (error2) {
            completeExchange();
            controller.error(error2);
          }
        },
        cancel: reason => {
          completeExchange();
          return reader.cancel(reason).catch(() => {});
        }
      });
      return new Response(monitoredBody, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
    } catch (error2) {
      try {
        onerror?.(toError(error2));
      } catch {}
      return internalServerErrorResponse(echoableRequestId(options?.parsedBody));
    }
  };
}
async function classifyEntryRequest(request, providedParsedBody, needsForward = true) {
  const httpMethod = request.method.toUpperCase();
  let body;
  let parsedBody = providedParsedBody;
  let forwardRequest = request;
  let unparseable = false;
  if (httpMethod === "POST") {
    if (parsedBody === void 0) {
      if (needsForward) forwardRequest = request.clone();
      let bodyText;
      try {
        bodyText = await request.text();
      } catch {
        return {
          step: "unreadable-body"
        };
      }
      try {
        body = bodyText.length === 0 ? void 0 : JSON.parse(bodyText);
      } catch {
        unparseable = true;
      }
      if (!unparseable && body !== void 0) parsedBody = body;
    } else body = parsedBody;
    if (unparseable || body === void 0) return {
      step: "no-json-body",
      forwardRequest
    };
  }
  return {
    step: "classified",
    outcome: classifyInboundRequest({
      httpMethod,
      protocolVersionHeader: request.headers.get("mcp-protocol-version") ?? void 0,
      mcpMethodHeader: request.headers.get("mcp-method") ?? void 0,
      mcpNameHeader: request.headers.get("mcp-name") ?? void 0,
      ...(body !== void 0 && {
        body
      })
    }),
    body,
    parsedBody,
    forwardRequest
  };
}
async function isLegacyRequest(request, parsedBody) {
  const classified = await classifyEntryRequest(parsedBody === void 0 && request.method.toUpperCase() === "POST" ? request.clone() : request, parsedBody, false);
  return classified.step === "no-json-body" || classified.step === "classified" && classified.outcome.kind === "legacy";
}
function createMcpHandler(factory, options = {}) {
  const {
    legacy,
    onerror,
    responseMode
  } = options;
  if (typeof legacy === "function") throw new TypeError("The 'legacy' option only accepts 'stateless' or 'reject', not a handler function. To serve 2025-era traffic with your own handler, route in user land with the exported isLegacyRequest(request) predicate in front of a strict (legacy: 'reject') handler.");
  const inflight = /* @__PURE__ */new Set();
  let closed = false;
  const reportError = error2 => {
    try {
      onerror?.(error2);
    } catch {}
  };
  const bus = options.bus ?? new InMemoryServerEventBus(reportError);
  const notify = createServerNotifier(bus);
  const listenRouter = createListenRouter({
    bus,
    maxSubscriptions: options.maxSubscriptions ?? DEFAULT_MAX_SUBSCRIPTIONS,
    keepAliveMs: options.keepAliveMs ?? DEFAULT_SSE_KEEP_ALIVE_MS,
    onerror: reportError
  });
  if (responseMode === "json") console.warn("responseMode: 'json' drops mid-call notifications. subscriptions/listen streams are always served over SSE regardless; other notifications emitted before a result are dropped.");
  const legacyHandler = legacy === "reject" ? void 0 : createLegacyStatelessFallback(factory, reportError, options.keepAliveMs);
  async function serveModern(route, request, authInfo) {
    const claimedRevision = route.classification.revision;
    if (claimedRevision === void 0 || !SUPPORTED_MODERN_PROTOCOL_VERSIONS.includes(claimedRevision)) {
      const error2 = new UnsupportedProtocolVersionError({
        supported: [...SUPPORTED_MODERN_PROTOCOL_VERSIONS],
        requested: claimedRevision ?? "unknown"
      });
      reportError(error2);
      return jsonRpcErrorResponse(400, error2.code, error2.message, error2.data, echoableRequestId(route.message));
    }
    const stdHeaderRejection = validateStandardRequestHeaders({
      httpMethod: request.method,
      mcpMethodHeader: request.headers.get("mcp-method") ?? void 0,
      mcpNameHeader: request.headers.get("mcp-name") ?? void 0
    }, route);
    if (stdHeaderRejection !== void 0) {
      reportError(/* @__PURE__ */new Error(`Rejected inbound request (${stdHeaderRejection.cell}): ${stdHeaderRejection.message}`));
      return rejectionResponse(stdHeaderRejection, echoableRequestId(route.message));
    }
    const meta2 = route.messageKind === "request" ? requestMetaOf(route.message.params) : void 0;
    const declaredClientCapabilities = meta2?.[CLIENT_CAPABILITIES_META_KEY];
    if (route.messageKind === "request") {
      const required2 = requiredClientCapabilitiesForRequest(route.message.method);
      if (required2 !== void 0) {
        const missing2 = missingClientCapabilities(required2, declaredClientCapabilities);
        if (missing2 !== void 0) {
          const error2 = new MissingRequiredClientCapabilityError({
            requiredCapabilities: missing2
          });
          reportError(error2);
          return jsonRpcErrorResponse(httpStatusForErrorCode(error2.code, "ladder"), error2.code, error2.message, error2.data, route.message.id);
        }
      }
    }
    const product = await factory({
      era: "modern",
      ...(authInfo !== void 0 && {
        authInfo
      }),
      requestInfo: request
    });
    const server = product instanceof McpServer ? product.server : product;
    if (route.messageKind === "request" && route.message.method === "subscriptions/listen") {
      const capabilities = server.getCapabilities();
      const serverInfo = serverIdentityOf(server);
      product.close().catch(reportError);
      return listenRouter.serve(route.message, request.signal, capabilities, serverInfo);
    }
    if (route.messageKind === "request" && route.message.method === "tools/call" && product instanceof McpServer) {
      const callParams = route.message.params;
      const toolName = typeof callParams?.name === "string" ? callParams.name : void 0;
      const inputSchema = toolName === void 0 ? void 0 : product.toolInputSchemaJson(toolName);
      if (inputSchema !== void 0) {
        const scan = scanXMcpHeaderDeclarations(inputSchema);
        if (scan.valid && scan.declarations.length > 0) {
          const rejection2 = validateMcpParamHeaders(scan.declarations, callParams?.arguments, request.headers);
          if (rejection2 !== void 0) {
            product.close().catch(reportError);
            reportError(/* @__PURE__ */new Error(`Rejected inbound request (${rejection2.cell}): ${rejection2.message}`));
            return rejectionResponse(rejection2, route.message.id);
          }
        }
      }
    }
    setNegotiatedProtocolVersion(server, claimedRevision);
    installModernOnlyHandlers(server, SUPPORTED_MODERN_PROTOCOL_VERSIONS);
    if (meta2 !== void 0) seedClientIdentityFromEnvelope(server, {
      clientInfo: meta2[CLIENT_INFO_META_KEY],
      clientCapabilities: declaredClientCapabilities
    });
    const previousOnClose = server.onclose;
    inflight.add(server);
    server.onclose = () => {
      inflight.delete(server);
      previousOnClose?.();
    };
    try {
      const response = await invoke(product, route.message, {
        classification: route.classification,
        request,
        ...(authInfo !== void 0 && {
          authInfo
        }),
        ...(responseMode !== void 0 && {
          responseMode
        }),
        ...(options.keepAliveMs !== void 0 && {
          keepAliveMs: options.keepAliveMs
        })
      });
      if (route.messageKind === "notification") queueMicrotask(() => void server.close().catch(() => {}));
      return response;
    } catch (error2) {
      if (error2 instanceof SdkError && error2.code === SdkErrorCode.ConnectionClosed) return new Response(null, {
        status: 499
      });
      await server.close().catch(() => {});
      inflight.delete(server);
      reportError(toError(error2));
      return internalServerErrorResponse(echoableRequestId(route.message));
    }
  }
  async function serveLegacyRoute(route, forwardRequest, authInfo, parsedBody) {
    if (legacyHandler !== void 0) return legacyHandler(forwardRequest, {
      ...(authInfo !== void 0 && {
        authInfo
      }),
      ...(parsedBody !== void 0 && {
        parsedBody
      })
    });
    const strict = modernOnlyStrictRejection(route, SUPPORTED_MODERN_PROTOCOL_VERSIONS);
    if (strict === void 0) return new Response(null, {
      status: 202
    });
    reportError(/* @__PURE__ */new Error(`Rejected 2025-era request on a modern-only endpoint (${strict.cell}): ${strict.message}`));
    return rejectionResponse(strict, echoableRequestId(parsedBody));
  }
  async function handle(request, requestOptions) {
    const authInfo = requestOptions?.authInfo;
    if (request.method.toUpperCase() === "POST" && !isJsonContentType(request.headers.get("content-type"))) {
      reportError(/* @__PURE__ */new Error("Unsupported Media Type: Content-Type must be application/json"));
      return jsonRpcErrorResponse(415, -32e3, "Unsupported Media Type: Content-Type must be application/json");
    }
    const classified = await classifyEntryRequest(request, requestOptions?.parsedBody);
    if (classified.step === "unreadable-body") return jsonRpcErrorResponse(400, -32700, "Parse error: the request body could not be read");
    if (classified.step === "no-json-body") {
      if (legacyHandler !== void 0) return legacyHandler(classified.forwardRequest, {
        ...(authInfo !== void 0 && {
          authInfo
        })
      });
      return jsonRpcErrorResponse(400, -32700, "Parse error: the request body is not valid JSON");
    }
    const {
      outcome,
      body,
      parsedBody,
      forwardRequest
    } = classified;
    try {
      switch (outcome.kind) {
        case "reject":
          reportError(/* @__PURE__ */new Error(`Rejected inbound request (${outcome.cell}): ${outcome.message}`));
          return rejectionResponse(outcome, echoableRequestId(body));
        case "modern":
          return await serveModern(outcome, request, authInfo);
        case "legacy":
          return await serveLegacyRoute(outcome, forwardRequest, authInfo, parsedBody);
      }
    } catch (error2) {
      reportError(toError(error2));
      return internalServerErrorResponse(echoableRequestId(body));
    }
  }
  const fetchFace = async (request, requestOptions) => {
    if (closed) throw new Error("This MCP handler has been closed");
    try {
      return await handle(request, requestOptions);
    } catch (error2) {
      reportError(toError(error2));
      return internalServerErrorResponse(echoableRequestId(requestOptions?.parsedBody));
    }
  };
  return {
    fetch: fetchFace,
    notify,
    bus,
    close: async () => {
      closed = true;
      listenRouter.closeAll();
      const closing = [...inflight].map(server => server.close().catch(() => {}));
      inflight.clear();
      await Promise.all(closing);
    }
  };
}

// node_modules/@modelcontextprotocol/node/dist/index.mjs
export { PerRequestHTTPServerTransport, invoke, WebStandardStreamableHTTPServerTransport, echoableRequestId, jsonRpcErrorResponse, rejectionResponse, toError, internalServerErrorResponse, createLegacyStatelessFallback, classifyEntryRequest, isLegacyRequest, createMcpHandler };
