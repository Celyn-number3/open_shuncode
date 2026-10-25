// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { CLIENT_CAPABILITIES_META_KEY, LATEST_PROTOCOL_VERSION, LOG_LEVEL_META_KEY, LoggingLevelSchema } from "../../core/dist/auth-CUe6YdwF.mjs";
import { MissingRequiredClientCapabilityError, Protocol, ProtocolError, ProtocolErrorCode, REQUEST_STATE_ONLY_LEG_PACING_MS, ResourceNotFoundError, SdkError, SdkErrorCode, assertCompleteRequestPrompt, assertCompleteRequestResourceTemplate, assertValidCacheHint, attachCacheHintFallback, codecForVersion, inputRequiredRoundsExceededMessage, isInputRequiredResult, isModernProtocolVersion, legacyProtocolVersions, linkedRoundAbort, mergeCapabilities, missingClientCapabilities, modernProtocolVersions, normalizeContentlessToolResult, normalizeRawShapeSchema, parseSchema, promptArgumentsFromStandardSchema, requestStateAccessor, requiredClientCapabilitiesForInputRequest, scanXMcpHeaderDeclarations, sleep, standardSchemaToJsonSchema, validateAndWarnToolName, validateStandardSchema, withRequestStateValue } from "./src-CX2iR2pK.mjs";
import { AjvJsonSchemaValidator } from "./ajvProvider-CEoC__sr.mjs";
// node_modules/@modelcontextprotocol/server/dist/mcp-DXXb3Vv3.mjs
var COMPLETABLE_SYMBOL = /* @__PURE__ */Symbol.for("mcp.completable");
function isCompletable(schema) {
  return !!schema && typeof schema === "object" && COMPLETABLE_SYMBOL in schema;
}
function getCompleter(schema) {
  return schema[COMPLETABLE_SYMBOL]?.complete;
}
var MAX_TIMER_DELAY_MS = 2 ** 31 - 1;
var DEFAULT_LEGACY_SHIM_MAX_ROUNDS = 8;
var DEFAULT_LEGACY_SHIM_ROUND_TIMEOUT_MS = 6e5;
function resolveLegacyShimOptions(options) {
  if (options?.maxRounds !== void 0 && (!Number.isInteger(options.maxRounds) || options.maxRounds < 1)) throw new RangeError(`inputRequired.maxRounds must be a positive integer (got ${options.maxRounds})`);
  if (options?.roundTimeoutMs !== void 0 && (!Number.isFinite(options.roundTimeoutMs) || options.roundTimeoutMs <= 0)) throw new RangeError(`inputRequired.roundTimeoutMs must be a positive number (got ${options.roundTimeoutMs})`);
  return {
    maxRounds: options?.maxRounds ?? DEFAULT_LEGACY_SHIM_MAX_ROUNDS,
    roundTimeoutMs: options?.roundTimeoutMs ?? DEFAULT_LEGACY_SHIM_ROUND_TIMEOUT_MS,
    legacyShim: options?.legacyShim ?? true
  };
}
function coerceEmbeddedInputRequest(method, key, entry) {
  if (entry === null || typeof entry !== "object" || typeof entry.method !== "string") throw new ProtocolError(ProtocolErrorCode.InternalError, `Handler for ${method} returned an invalid input request '${key}': each inputRequests entry must be an embedded elicitation/create, sampling/createMessage, or roots/list request`);
  const embedded = entry;
  const required2 = requiredClientCapabilitiesForInputRequest(embedded);
  if (required2 === void 0) throw new ProtocolError(ProtocolErrorCode.InternalError, `Handler for ${method} returned an input request '${key}' of kind '${embedded.method}', which is not an embedded request the 2026-07-28 revision defines`);
  return {
    embedded,
    required: required2
  };
}
function syntheticElicitationId() {
  const webCrypto = globalThis.crypto;
  if (webCrypto?.randomUUID !== void 0) return webCrypto.randomUUID();
  const bytes = new Uint8Array(16);
  webCrypto.getRandomValues(bytes);
  bytes[6] = bytes[6] & 15 | 64;
  bytes[8] = bytes[8] & 63 | 128;
  const hex3 = [...bytes].map(byte => byte.toString(16).padStart(2, "0")).join("");
  return `${hex3.slice(0, 8)}-${hex3.slice(8, 12)}-${hex3.slice(12, 16)}-${hex3.slice(16, 20)}-${hex3.slice(20)}`;
}
function legacyShimFailure(method, message) {
  if (method === "tools/call") return {
    content: [{
      type: "text",
      text: message
    }],
    isError: true
  };
  throw new ProtocolError(ProtocolErrorCode.InternalError, message);
}
var LegacyInputRequiredShim = class {
  constructor(_host) {
    this._host = _host;
  }
  async fulfill(method, handler, request, ctx, firstResult) {
    const {
      maxRounds,
      roundTimeoutMs
    } = this._host;
    const outerSignal = ctx.mcpReq.signal;
    let current = firstResult;
    let round = 0;
    while (true) {
      round += 1;
      if (round > maxRounds) return legacyShimFailure(method, inputRequiredRoundsExceededMessage(method, maxRounds));
      const inputRequests = current.inputRequests;
      const hasInputRequests = inputRequests != null && Object.keys(inputRequests).length > 0;
      const requestState = typeof current.requestState === "string" ? current.requestState : void 0;
      if (!hasInputRequests && requestState === void 0) throw new ProtocolError(ProtocolErrorCode.InternalError, `Handler for ${method} returned an input-required result with neither inputRequests nor requestState (every InputRequiredResult must include at least one of the two)`);
      let responses;
      if (hasInputRequests) {
        const declared = this._host.resolvedClientCapabilities(ctx);
        const coerced = [];
        for (const [key, entry] of Object.entries(inputRequests)) {
          const {
            embedded,
            required: required2
          } = coerceEmbeddedInputRequest(method, key, entry);
          if (embedded.method !== "roots/list" && embedded.params === void 0) throw new ProtocolError(ProtocolErrorCode.InternalError, `Handler for ${method} returned an input request '${key}' of kind '${embedded.method}' without params`);
          if (missingClientCapabilities(required2, declared) !== void 0) return legacyShimFailure(method, `Cannot request input '${key}' (${embedded.method}): the client on this 2025-era connection did not declare the required capability${declared === void 0 ? " (no client capabilities are available on this connection \u2014 per-request legacy serving cannot receive server-to-client requests)" : ""}`);
          coerced.push([key, embedded]);
        }
        const roundAbort = linkedRoundAbort(outerSignal);
        try {
          const legOptions = {
            relatedRequestId: ctx.mcpReq.id,
            timeout: roundTimeoutMs,
            resetTimeoutOnProgress: true,
            onprogress: () => {},
            signal: roundAbort.signal
          };
          const fulfilled = await Promise.all(coerced.map(async ([key, embedded]) => {
            try {
              return [key, await this._dispatchLeg(embedded, legOptions)];
            } catch (error51) {
              roundAbort.abort(error51);
              throw error51;
            }
          }));
          responses = Object.fromEntries(fulfilled);
        } catch (error51) {
          if (outerSignal.aborted) throw error51;
          return legacyShimFailure(method, `Fulfilling input required by '${method}' failed: ${error51 instanceof Error ? error51.message : String(error51)}`);
        } finally {
          roundAbort.dispose();
        }
      } else await sleep(REQUEST_STATE_ONLY_LEG_PACING_MS, outerSignal);
      let ctxNext = {
        ...ctx,
        mcpReq: {
          ...ctx.mcpReq,
          inputResponses: responses,
          droppedInputResponseKeys: void 0,
          requestState: requestStateAccessor(requestState)
        }
      };
      if (requestState !== void 0) {
        const decoded = await this._host.verifyRequestState(requestState, ctxNext, method);
        if (decoded !== void 0) ctxNext = withRequestStateValue(ctxNext, decoded);
      }
      const next = await handler(request, ctxNext);
      if (!isInputRequiredResult(next)) return next;
      current = next;
    }
  }
  /** Routes one embedded request through the host's existing 2025-era senders (gate already ran). */
  async _dispatchLeg(embedded, options) {
    switch (embedded.method) {
      case "elicitation/create":
        {
          let params = embedded.params;
          if (params.mode === "url" && params.elicitationId === void 0) params = {
            ...params,
            elicitationId: syntheticElicitationId()
          };
          return await this._host.sendElicitation(params, options);
        }
      case "sampling/createMessage":
        return await this._host.sendSampling(embedded.params, options);
      case "roots/list":
        return await this._host.listRoots(embedded.params, options);
    }
  }
};
var INPUT_REQUIRED_CAPABLE_METHODS = /* @__PURE__ */new Set(["tools/call", "prompts/get", "resources/read"]);
var writeClientIdentity;
var installDiscoverHandler;
var readServerIdentity;
var Server = class extends Protocol {
  _clientCapabilities;
  _clientVersion;
  static {
    writeClientIdentity = (server, identity) => {
      if (identity.clientCapabilities !== void 0) server._clientCapabilities = identity.clientCapabilities;
      if (identity.clientInfo !== void 0) server._clientVersion = identity.clientInfo;
    };
    installDiscoverHandler = (server, servedModernVersions) => {
      const missing = servedModernVersions.filter(version2 => !server._supportedProtocolVersions.includes(version2));
      if (missing.length > 0) server._supportedProtocolVersions = [...server._supportedProtocolVersions, ...missing];
      server.setRequestHandler("server/discover", () => server._ondiscover());
    };
    readServerIdentity = server => server._serverInfo;
  }
  _capabilities;
  _instructions;
  _jsonSchemaValidator;
  _cacheHints;
  _requestStateVerify;
  _inputRequiredServing;
  _legacyShim;
  /** Lazily-built legacy shim; the loop lives in legacyInputRequiredShim.ts behind a narrow host contract. */
  _legacyInputRequiredShim() {
    return this._legacyShim ??= new LegacyInputRequiredShim({
      maxRounds: this._inputRequiredServing.maxRounds,
      roundTimeoutMs: this._inputRequiredServing.roundTimeoutMs,
      resolvedClientCapabilities: ctx => this._inputRequestCapabilityView(ctx),
      verifyRequestState: (state, ctx, method) => this._verifyRequestState(state, ctx, method),
      sendElicitation: (params, options) => this._sendElicitationLeg(params, options, {
        validateAcceptedContent: false
      }),
      sendSampling: (params, options) => this.createMessage(params, options),
      listRoots: (params, options) => this.listRoots(params, options)
    });
  }
  /**
  * Callback for when initialization has fully completed (i.e., the client has sent an `notifications/initialized` notification).
  */
  oninitialized;
  /**
  * Initializes this server with the given name and version information.
  */
  constructor(_serverInfo, options) {
    super(options);
    this._serverInfo = _serverInfo;
    this._capabilities = options?.capabilities ? {
      ...options.capabilities
    } : {};
    this._instructions = options?.instructions;
    this._jsonSchemaValidator = options?.jsonSchemaValidator ?? new AjvJsonSchemaValidator();
    this._requestStateVerify = options?.requestState?.verify;
    this._inputRequiredServing = resolveLegacyShimOptions(options?.inputRequired);
    if (options?.cacheHints !== void 0) {
      for (const [operation, hint] of Object.entries(options.cacheHints)) if (hint !== void 0) assertValidCacheHint(hint, `cacheHints['${operation}']`);
      this._cacheHints = options.cacheHints;
    }
    this.setRequestHandler("initialize", request => this._oninitialize(request));
    this.setNotificationHandler("notifications/initialized", () => this.oninitialized?.());
    if (modernProtocolVersions(this._supportedProtocolVersions).length > 0) this.setRequestHandler("server/discover", () => this._ondiscover());
    if (this._capabilities.logging) this._registerLoggingHandler();
  }
  /**
  * Registers the built-in `logging/setLevel` request handler.
  *
  * @deprecated Deprecated as of protocol version 2026-07-28 (SEP-2577).
  * Remains functional during the deprecation window (at least twelve months).
  * Migrate to stderr logging (STDIO servers) or OpenTelemetry.
  */
  _registerLoggingHandler() {
    this.setRequestHandler("logging/setLevel", async (request, ctx) => {
      const transportSessionId = ctx.sessionId || ctx.http?.req?.headers.get("mcp-session-id") || void 0;
      const {
        level
      } = request.params;
      const parseResult = parseSchema(LoggingLevelSchema, level);
      if (parseResult.success) this._loggingLevels.set(transportSessionId, parseResult.data);
      return {};
    });
  }
  buildContext(ctx, transportInfo) {
    const hasHttpInfo = ctx.http || transportInfo?.request || transportInfo?.closeSSEStream || transportInfo?.closeStandaloneSSEStream;
    return {
      ...ctx,
      mcpReq: {
        ...ctx.mcpReq,
        log: (level, data, logger) => {
          if (!this._capabilities.logging) return Promise.resolve();
          let threshold;
          if (this._servedModernEra()) {
            threshold = ctx.mcpReq.envelope?.[LOG_LEVEL_META_KEY];
            if (threshold === void 0) return Promise.resolve();
          } else threshold = this._loggingLevels.get(ctx.sessionId) ?? this._loggingLevels.get(void 0);
          if (threshold !== void 0 && this.LOG_LEVEL_SEVERITY.get(level) < this.LOG_LEVEL_SEVERITY.get(threshold)) return Promise.resolve();
          return ctx.mcpReq.notify({
            method: "notifications/message",
            params: {
              level,
              data,
              logger
            }
          });
        },
        elicitInput: (params, options) => this.elicitInput(params, options),
        requestSampling: (params, options) => this.createMessage(params, options)
      },
      http: hasHttpInfo ? {
        ...ctx.http,
        req: transportInfo?.request,
        closeSSE: transportInfo?.closeSSEStream,
        closeStandaloneSSE: transportInfo?.closeStandaloneSSEStream
      } : void 0
    };
  }
  _loggingLevels = /* @__PURE__ */new Map();
  LOG_LEVEL_SEVERITY = new Map(LoggingLevelSchema.options.map((level, index) => [level, index]));
  isMessageIgnored = (level, sessionId) => {
    const currentLevel = this._loggingLevels.get(sessionId);
    return currentLevel ? this.LOG_LEVEL_SEVERITY.get(level) < this.LOG_LEVEL_SEVERITY.get(currentLevel) : false;
  };
  /**
  * Registers new capabilities. This can only be called before connecting to a transport.
  *
  * The new capabilities will be merged with any existing capabilities previously given (e.g., at initialization).
  */
  registerCapabilities(capabilities) {
    if (this.transport) throw new SdkError(SdkErrorCode.AlreadyConnected, "Cannot register capabilities after connecting to transport");
    const hadLogging = !!this._capabilities.logging;
    this._capabilities = mergeCapabilities(this._capabilities, capabilities);
    if (!hadLogging && this._capabilities.logging) this._registerLoggingHandler();
  }
  /**
  * Enforces server-side validation for `tools/call` results regardless of how the
  * handler was registered, attaches the configured per-operation cache hint
  * (when one exists) so the 2026-07-28 encode seam can fill `ttlMs`/`cacheScope`
  * for results that do not provide their own, and owns the multi-round-trip
  * seam: on the methods whose 2026-07-28 result vocabulary includes
  * `input_required` (`tools/call`, `prompts/get`, `resources/read`) an
  * input-required return skips result-schema validation and is checked
  * against the served era, the at-least-one rule, and the request's own
  * declared client capabilities; on every other method an input-required
  * return is a server bug and fails loudly. The hint rides a symbol-keyed
  * property that is never serialized, so 2025-era responses are unaffected.
  */
  _wrapHandler(method, handler) {
    if (method !== "tools/call") {
      const cacheHint = this._cacheHints?.[method];
      const isInputRequiredCapable = INPUT_REQUIRED_CAPABLE_METHODS.has(method);
      if (cacheHint === void 0 && !isInputRequiredCapable) return async (request, ctx) => {
        const result = await handler(request, ctx);
        if (isInputRequiredResult(result)) throw new ProtocolError(ProtocolErrorCode.InternalError, `Handler for ${method} returned an input-required result, but only tools/call, prompts/get and resources/read support input_required (protocol revision 2026-07-28)`);
        return result;
      };
      return async (request, ctx) => {
        const result = isInputRequiredCapable ? await this._invokeInputRequiredCapableHandler(method, handler, request, ctx) : await handler(request, ctx);
        if (isInputRequiredResult(result)) {
          if (!isInputRequiredCapable) throw new ProtocolError(ProtocolErrorCode.InternalError, `Handler for ${method} returned an input-required result, but only tools/call, prompts/get and resources/read support input_required (protocol revision 2026-07-28)`);
          return result;
        }
        return cacheHint === void 0 ? result : attachCacheHintFallback(result, cacheHint);
      };
    }
    return async (request, ctx) => {
      const codec2 = codecForVersion(this._negotiatedProtocolVersion);
      const validatedRequest = codec2.validateRequest("tools/call", request);
      if (!validatedRequest.ok) throw new ProtocolError(validatedRequest.reason === "not-in-era" ? ProtocolErrorCode.InternalError : ProtocolErrorCode.InvalidParams, validatedRequest.reason === "not-in-era" ? "No wire schema for tools/call in the resolved era" : `Invalid tools/call request: ${validatedRequest.message}`);
      const result = await this._invokeInputRequiredCapableHandler("tools/call", handler, request, ctx);
      if (isInputRequiredResult(result)) return result;
      const normalizedResult = normalizeContentlessToolResult(result);
      const validationResult = codec2.validateResult("tools/call", normalizedResult);
      if (!validationResult.ok) throw new ProtocolError(validationResult.reason === "not-in-era" ? ProtocolErrorCode.InternalError : ProtocolErrorCode.InvalidParams, validationResult.reason === "not-in-era" ? "No wire schema for tools/call in the resolved era" : `Invalid tools/call result: ${validationResult.message}`);
      return validationResult.value;
    };
  }
  /**
  * Whether this instance is bound to a 2026-07-28-or-later protocol
  * revision. Era is instance state — a serving entry (`createMcpHandler`,
  * `serveStdio`) marks the instance modern at construction; a 2025-era
  * `initialize` handshake binds it legacy. The multi-round-trip seam reads
  * this directly: there is no per-request era consult.
  */
  _servedModernEra() {
    return this._negotiatedProtocolVersion !== void 0 && isModernProtocolVersion(this._negotiatedProtocolVersion);
  }
  /**
  * Invokes a handler for one of the multi-round-trip methods and applies
  * the input-required seam:
  *
  * - a `UrlElicitationRequiredError` (or any 2025-style server→client
  *   request idiom) escaping the handler on a request served on the
  *   2026-07-28 era fails LOUDLY with a clear steer to
  *   `inputRequired.elicitUrl(...)` — the `-32042` error never reaches the
  *   2026-07-28 wire and the throw is not silently converted. Requests
  *   served on the 2025 era keep today's `-32042` behavior byte-exact (the
  *   error is rethrown unchanged).
  * - an input-required RETURN toward a 2026-07-28 request must satisfy
  *   the at-least-one rule, and every embedded request must be covered by
  *   the capabilities declared on the request's envelope (violations
  *   answer the typed `-32021` error). Toward a 2025-era request the
  *   return is fulfilled by the default-on legacy shim, whose own gate
  *   consults the initialize-declared capabilities and surfaces
  *   violations per family; `inputRequired.legacyShim: false` restores
  *   the pre-shim loud failure.
  */
  async _invokeInputRequiredCapableHandler(method, handler, request, ctx) {
    const servedModern = this._servedModernEra();
    const rawRequestState = ctx.mcpReq.requestState();
    if (rawRequestState !== void 0 && typeof rawRequestState !== "string") throw new ProtocolError(ProtocolErrorCode.InvalidParams, "Invalid or expired requestState", {
      reason: "invalid_request_state"
    });
    let ctxForHandler = ctx;
    if (typeof rawRequestState === "string") {
      const decoded = await this._verifyRequestState(rawRequestState, ctx, method);
      if (decoded !== void 0) ctxForHandler = withRequestStateValue(ctx, decoded);
    }
    let result;
    try {
      result = await handler(request, ctxForHandler);
    } catch (error51) {
      if (error51 instanceof ProtocolError && error51.code === ProtocolErrorCode.UrlElicitationRequired) {
        if (!servedModern) throw error51;
        throw new ProtocolError(ProtocolErrorCode.InternalError, `URL elicitation cannot be signalled by throwing UrlElicitationRequiredError on protocol revision ${this._negotiatedProtocolVersion}: return inputRequired({ inputRequests: { \u2026: inputRequired.elicitUrl(...) } }) from the handler instead. The urlElicitationRequired error (-32042) of earlier revisions is not available on this revision.`);
      }
      throw error51;
    }
    if (!isInputRequiredResult(result)) return result;
    if (!servedModern) {
      if (!this._inputRequiredServing.legacyShim) throw new ProtocolError(ProtocolErrorCode.InternalError, `Handler for ${method} returned an input-required result, but this request is served on protocol revision ${this._negotiatedProtocolVersion ?? LATEST_PROTOCOL_VERSION}, which has no input_required vocabulary`);
      return await this._legacyInputRequiredShim().fulfill(method, handler, request, ctxForHandler, result);
    }
    const inputRequests = result.inputRequests;
    const hasInputRequests = inputRequests != null && Object.keys(inputRequests).length > 0;
    const hasRequestState = typeof result.requestState === "string";
    if (!hasInputRequests && !hasRequestState) throw new ProtocolError(ProtocolErrorCode.InternalError, `Handler for ${method} returned an input-required result with neither inputRequests nor requestState (every InputRequiredResult must include at least one of the two)`);
    if (hasInputRequests) {
      const declared = this._inputRequestCapabilityView(ctx);
      for (const [key, entry] of Object.entries(inputRequests)) {
        const {
          embedded,
          required: required2
        } = coerceEmbeddedInputRequest(method, key, entry);
        const missing = missingClientCapabilities(required2, declared);
        if (missing !== void 0) throw new MissingRequiredClientCapabilityError({
          requiredCapabilities: missing
        }, `Cannot request input '${key}' (${embedded.method}): the request's client capabilities do not declare the required capability`);
      }
    }
    return result;
  }
  /**
  * Runs the configured `requestState.verify` hook and returns its
  * resolved value (`undefined` when unconfigured or the hook returns
  * nothing). Deny-on-error: any hook failure answers the frozen `-32602`;
  * the reason goes to `onerror` only.
  */
  async _verifyRequestState(state, ctx, method) {
    if (this._requestStateVerify === void 0) return;
    try {
      return await this._requestStateVerify(state, ctx);
    } catch (error51) {
      this.onerror?.(/* @__PURE__ */new Error(`requestState verification rejected ${method}: ${error51 instanceof Error ? error51.message : String(error51)}`));
      throw new ProtocolError(ProtocolErrorCode.InvalidParams, "Invalid or expired requestState", {
        reason: "invalid_request_state"
      });
    }
  }
  /**
  * The per-request resolved client-capabilities view: the request's own
  * `_meta` envelope on the 2026 era; the `initialize`-declared state on a
  * 2025-era connection. Per-request instances that never saw an
  * initialize (stateless legacy) hold nothing, so gates refuse there.
  */
  _inputRequestCapabilityView(ctx) {
    return this._servedModernEra() ? ctx.mcpReq.envelope?.[CLIENT_CAPABILITIES_META_KEY] : this._clientCapabilities;
  }
  /**
  * Guard for the push-style server→client request APIs ({@linkcode createMessage},
  * {@linkcode elicitInput}, {@linkcode listRoots}, {@linkcode ping}) on a
  * modern-era instance: the 2026-07-28 revision has no server→client request
  * channel, so the call fails before any wire traffic with a typed error
  * whose message steers to `inputRequired(...)`. The base era gate would
  * also reject it; this guard runs first to carry the steer.
  */
  _assertPushApiInServedEra(method) {
    if (this._servedModernEra()) throw new SdkError(SdkErrorCode.MethodNotSupportedByProtocolVersion, `Server-to-client requests are not available on protocol revision ${this._negotiatedProtocolVersion}: '${method}' cannot be sent while serving a request on that revision. Return inputRequired({ ... }) from the handler instead \u2014 the client fulfils the embedded requests and retries the original request (multi round-trip requests).`, {
      method,
      era: "2026-07-28"
    });
  }
  assertCapabilityForMethod(method) {
    switch (method) {
      case "sampling/createMessage":
        if (!this._clientCapabilities?.sampling) throw new SdkError(SdkErrorCode.CapabilityNotSupported, `Client does not support sampling (required for ${method})`);
        break;
      case "elicitation/create":
        if (!this._clientCapabilities?.elicitation) throw new SdkError(SdkErrorCode.CapabilityNotSupported, `Client does not support elicitation (required for ${method})`);
        break;
      case "roots/list":
        if (!this._clientCapabilities?.roots) throw new SdkError(SdkErrorCode.CapabilityNotSupported, `Client does not support listing roots (required for ${method})`);
        break;
      case "ping":
        break;
    }
  }
  assertNotificationCapability(method) {
    switch (method) {
      case "notifications/message":
        if (!this._capabilities.logging) throw new SdkError(SdkErrorCode.CapabilityNotSupported, `Server does not support logging (required for ${method})`);
        break;
      case "notifications/resources/updated":
      case "notifications/resources/list_changed":
        if (!this._capabilities.resources) throw new SdkError(SdkErrorCode.CapabilityNotSupported, `Server does not support notifying about resources (required for ${method})`);
        break;
      case "notifications/tools/list_changed":
        if (!this._capabilities.tools) throw new SdkError(SdkErrorCode.CapabilityNotSupported, `Server does not support notifying of tool list changes (required for ${method})`);
        break;
      case "notifications/prompts/list_changed":
        if (!this._capabilities.prompts) throw new SdkError(SdkErrorCode.CapabilityNotSupported, `Server does not support notifying of prompt list changes (required for ${method})`);
        break;
      case "notifications/elicitation/complete":
        if (!this._clientCapabilities?.elicitation?.url) throw new SdkError(SdkErrorCode.CapabilityNotSupported, `Client does not support URL elicitation (required for ${method})`);
        break;
      case "notifications/cancelled":
        break;
      case "notifications/progress":
        break;
    }
  }
  assertRequestHandlerCapability(method) {
    switch (method) {
      case "completion/complete":
        if (!this._capabilities.completions) throw new SdkError(SdkErrorCode.CapabilityNotSupported, `Server does not support completions (required for ${method})`);
        break;
      case "logging/setLevel":
        if (!this._capabilities.logging) throw new SdkError(SdkErrorCode.CapabilityNotSupported, `Server does not support logging (required for ${method})`);
        break;
      case "prompts/get":
      case "prompts/list":
        if (!this._capabilities.prompts) throw new SdkError(SdkErrorCode.CapabilityNotSupported, `Server does not support prompts (required for ${method})`);
        break;
      case "resources/list":
      case "resources/templates/list":
      case "resources/read":
        if (!this._capabilities.resources) throw new SdkError(SdkErrorCode.CapabilityNotSupported, `Server does not support resources (required for ${method})`);
        break;
      case "tools/call":
      case "tools/list":
        if (!this._capabilities.tools) throw new SdkError(SdkErrorCode.CapabilityNotSupported, `Server does not support tools (required for ${method})`);
        break;
      case "ping":
      case "initialize":
        break;
    }
  }
  async _oninitialize(request) {
    const requestedVersion = request.params.protocolVersion;
    this._clientCapabilities = request.params.capabilities;
    this._clientVersion = request.params.clientInfo;
    const legacyVersions = legacyProtocolVersions(this._supportedProtocolVersions);
    const protocolVersion = legacyVersions.includes(requestedVersion) ? requestedVersion : legacyVersions[0] ?? LATEST_PROTOCOL_VERSION;
    this._negotiatedProtocolVersion = protocolVersion;
    this.transport?.setProtocolVersion?.(protocolVersion);
    return {
      protocolVersion,
      capabilities: this.getCapabilities(),
      serverInfo: this._serverInfo,
      ...(this._instructions && {
        instructions: this._instructions
      })
    };
  }
  /**
  * Answers `server/discover` (protocol revision 2026-07-28). `supportedVersions`
  * lists only modern revisions (2025-era versions are negotiated via `initialize`);
  * the capabilities are advertised as-is, listChanged/subscribe bits included
  * (see {@linkcode discoverAdvertisedCapabilities}).
  */
  _ondiscover() {
    return {
      supportedVersions: modernProtocolVersions(this._supportedProtocolVersions),
      capabilities: discoverAdvertisedCapabilities(this.getCapabilities()),
      ...(this._instructions && {
        instructions: this._instructions
      })
    };
  }
  /**
  * The identity the 2026-era encode seam stamps into every outbound
  * result's `_meta` under `io.modelcontextprotocol/serverInfo` (spec PR
  * #3002: servers SHOULD identify themselves on every response).
  */
  _outboundServerInfo() {
    return this._serverInfo;
  }
  /**
  * After initialization has completed, this will be populated with the client's reported capabilities.
  *
  * @deprecated Read client identity from the per-request handler context instead: on
  * 2026-07-28 (per-request envelope) requests `ctx.mcpReq.envelope` carries the client's
  * declared capabilities, while on 2025-era connections this accessor keeps returning the
  * `initialize`-scoped value. The accessor remains functional — instances serving the
  * 2026-07-28 era are backfilled per request from the validated envelope.
  */
  getClientCapabilities() {
    return this._clientCapabilities;
  }
  /**
  * After initialization has completed, this will be populated with information about the client's name and version.
  *
  * @deprecated Read client identity from the per-request handler context instead: on
  * 2026-07-28 (per-request envelope) requests `ctx.mcpReq.envelope` carries the client's
  * name and version, while on 2025-era connections this accessor keeps returning the
  * `initialize`-scoped value. The accessor remains functional — instances serving the
  * 2026-07-28 era are backfilled per request from the validated envelope.
  */
  getClientVersion() {
    return this._clientVersion;
  }
  /**
  * After initialization has completed, this will be populated with the protocol version negotiated
  * with the client (the version the server responded with during the initialize handshake), or
  * `undefined` before initialization.
  *
  * @deprecated Read the protocol revision from the per-request handler context instead: on
  * 2026-07-28 (per-request envelope) requests `ctx.mcpReq.envelope` names the revision the
  * request was sent for, while on 2025-era connections this accessor keeps returning the
  * `initialize`-negotiated version. The accessor remains functional — instances serving the
  * 2026-07-28 era report that revision.
  */
  getNegotiatedProtocolVersion() {
    return this._negotiatedProtocolVersion;
  }
  /**
  * Project a `tools/call` result through this instance's negotiated wire
  * codec — the era-agnostic SEP-2106 §4.3 TextContent auto-append, plus on
  * the 2025 era the `{result:…}` wrap when `structuredContent` is a
  * non-object value or the advertised `outputSchema` had a non-object root.
  * Identity for object-shaped `structuredContent` on the 2026 era.
  *
  * `McpServer`'s built-in `tools/call` handler routes through this method.
  * Low-level `setRequestHandler('tools/call', …)` authors call it
  * themselves so the projection lives in one place (the codec) and the
  * server-side handler stays era-blind.
  *
  * This is the only codec function exposed on `Server` — the full
  * `WireCodec` is intentionally not part of the public surface.
  */
  projectCallToolResult(result, advertisedOutputSchema) {
    return this._wireCodec().projectCallToolResult(result, advertisedOutputSchema);
  }
  /**
  * Returns the current server capabilities.
  */
  getCapabilities() {
    return this._capabilities;
  }
  /**
  * Sends a `ping` request to the connected client.
  *
  * @deprecated The 2026-07-28 protocol removed ping; it throws on a 2026-07-28-era instance.
  * If your factory serves both eras, this only works on the legacy path.
  */
  async ping() {
    this._assertPushApiInServedEra("ping");
    return this.request({
      method: "ping"
    });
  }
  async createMessage(params, options) {
    this._assertPushApiInServedEra("sampling/createMessage");
    if ((params.tools || params.toolChoice) && !this._clientCapabilities?.sampling?.tools) throw new SdkError(SdkErrorCode.CapabilityNotSupported, "Client does not support sampling tools capability.");
    if (params.messages.length > 0) {
      const lastMessage = params.messages.at(-1);
      const lastContent = Array.isArray(lastMessage.content) ? lastMessage.content : [lastMessage.content];
      const hasToolResults = lastContent.some(c => c.type === "tool_result");
      const previousMessage = params.messages.length > 1 ? params.messages.at(-2) : void 0;
      const previousContent = previousMessage ? Array.isArray(previousMessage.content) ? previousMessage.content : [previousMessage.content] : [];
      const hasPreviousToolUse = previousContent.some(c => c.type === "tool_use");
      if (hasToolResults) {
        if (lastContent.some(c => c.type !== "tool_result")) throw new ProtocolError(ProtocolErrorCode.InvalidParams, "The last message must contain only tool_result content if any is present");
        if (!hasPreviousToolUse) throw new ProtocolError(ProtocolErrorCode.InvalidParams, "tool_result blocks are not matching any tool_use from the previous message");
      }
      if (hasPreviousToolUse) {
        const toolUseIds = new Set(previousContent.filter(c => c.type === "tool_use").map(c => c.id));
        const toolResultIds = new Set(lastContent.filter(c => c.type === "tool_result").map(c => c.toolUseId));
        if (toolUseIds.size !== toolResultIds.size || ![...toolUseIds].every(id => toolResultIds.has(id))) throw new ProtocolError(ProtocolErrorCode.InvalidParams, "ids of tool_result blocks and tool_use blocks from previous message do not match");
      }
    }
    const hasTools = Boolean(params.tools || params.toolChoice);
    const wide = await this.request({
      method: "sampling/createMessage",
      params
    }, options);
    const outcome = this._wireCodec().samplingResultVariant(hasTools, wide);
    if (!outcome.ok) throw new SdkError(SdkErrorCode.InvalidResult, `Invalid sampling/createMessage result: ${outcome.reason === "invalid" ? outcome.message : outcome.reason}`);
    return outcome.value;
  }
  /**
  * Creates an elicitation request for the given parameters.
  * For backwards compatibility, `mode` may be omitted for form requests and will default to `"form"`.
  * @param params The parameters for the elicitation request.
  * @param options Optional request options.
  * @returns The result of the elicitation request.
  *
  * @deprecated Throws on a 2026-07-28-era request — use {@link index.inputRequired | inputRequired} (multi-round-trip)
  * instead. The 2025 push-style server-to-client request model is replaced by input_required
  * results in the 2026-07-28 protocol. If your factory serves both eras, this only works on the
  * legacy path.
  */
  async elicitInput(params, options) {
    this._assertPushApiInServedEra("elicitation/create");
    switch (params.mode ?? "form") {
      case "url":
        if (!this._clientCapabilities?.elicitation?.url) throw new SdkError(SdkErrorCode.CapabilityNotSupported, "Client does not support url elicitation.");
        break;
      case "form":
        if (!this._clientCapabilities?.elicitation?.form) throw new SdkError(SdkErrorCode.CapabilityNotSupported, "Client does not support form elicitation.");
        break;
    }
    return this._sendElicitationLeg(params, options);
  }
  /**
  * The capability-check-free core of {@linkcode elicitInput}. The shim
  * uses it because its gate differs from the public checks: a bare
  * `elicitation: {}` counts as form support (the pre-mode rule), and
  * accepted content passes through unvalidated for parity with the
  * modern client driver (handlers validate via the schema-aware
  * `acceptedContent` overload and can re-ask).
  */
  async _sendElicitationLeg(params, options, behavior) {
    const mode = params.mode ?? "form";
    const validateAcceptedContent = behavior?.validateAcceptedContent ?? true;
    switch (mode) {
      case "url":
        {
          const urlParams = params;
          return this.request({
            method: "elicitation/create",
            params: urlParams
          }, options);
        }
      case "form":
        {
          const formParams = params.mode === "form" ? params : {
            ...params,
            mode: "form"
          };
          const result = await this.request({
            method: "elicitation/create",
            params: formParams
          }, options);
          if (validateAcceptedContent && result.action === "accept" && result.content && formParams.requestedSchema) try {
            const validationResult = this._jsonSchemaValidator.getValidator(formParams.requestedSchema)(result.content);
            if (!validationResult.valid) throw new ProtocolError(ProtocolErrorCode.InvalidParams, `Elicitation response content does not match requested schema: ${validationResult.errorMessage}`);
          } catch (error51) {
            if (error51 instanceof ProtocolError) throw error51;
            throw new ProtocolError(ProtocolErrorCode.InternalError, `Error validating elicitation response: ${error51 instanceof Error ? error51.message : String(error51)}`);
          }
          return result;
        }
    }
  }
  /**
  * Creates a reusable callback that, when invoked, will send a `notifications/elicitation/complete`
  * notification for the specified elicitation ID.
  *
  * The notification (and the `elicitationId` it references) exists only on protocol revision
  * 2025-11-25 — the 2026-07-28 revision removed both. On a connection negotiated at 2026-07-28 the
  * returned callback rejects with a typed local error before anything reaches the transport
  * (the method is not part of that revision's wire registry).
  *
  * @param elicitationId The ID of the elicitation to mark as complete.
  * @param options Optional notification options. Useful when the completion notification should be related to a prior request.
  * @returns A function that emits the completion notification when awaited.
  */
  createElicitationCompletionNotifier(elicitationId, options) {
    if (!this._clientCapabilities?.elicitation?.url) throw new SdkError(SdkErrorCode.CapabilityNotSupported, "Client does not support URL elicitation (required for notifications/elicitation/complete)");
    return () => this.notification({
      method: "notifications/elicitation/complete",
      params: {
        elicitationId
      }
    }, options);
  }
  /**
  * Requests the list of roots from the client.
  *
  * @deprecated Deprecated as of protocol version 2026-07-28 (SEP-2577).
  * Throws on a 2026-07-28-era request — use {@link index.inputRequired | inputRequired} (multi-round-trip) instead,
  * or migrate to passing paths via tool parameters, resource URIs, or configuration. The 2025
  * push-style server-to-client request model is replaced by input_required results in the
  * 2026-07-28 protocol. If your factory serves both eras, this only works on the legacy path.
  */
  async listRoots(params, options) {
    this._assertPushApiInServedEra("roots/list");
    return this.request({
      method: "roots/list",
      params
    }, options);
  }
  /**
  * Sends a logging message to the client, if connected.
  * Note: You only need to send the parameters object, not the entire JSON-RPC message.
  * @see {@linkcode LoggingMessageNotification}
  * @param params
  * @param sessionId Optional for stateless transports and backward compatibility.
  *
  * @deprecated Deprecated as of protocol version 2026-07-28 (SEP-2577).
  * Remains functional during the deprecation window (at least twelve months).
  * Migrate to stderr logging (STDIO servers) or OpenTelemetry.
  */
  async sendLoggingMessage(params, sessionId) {
    if (this._capabilities.logging && !this.isMessageIgnored(params.level, sessionId)) return this.notification({
      method: "notifications/message",
      params
    });
  }
  async sendResourceUpdated(params) {
    return this.notification({
      method: "notifications/resources/updated",
      params
    });
  }
  async sendResourceListChanged() {
    return this.notification({
      method: "notifications/resources/list_changed"
    });
  }
  async sendToolListChanged() {
    return this.notification({
      method: "notifications/tools/list_changed"
    });
  }
  async sendPromptListChanged() {
    return this.notification({
      method: "notifications/prompts/list_changed"
    });
  }
};
function discoverAdvertisedCapabilities(capabilities) {
  return {
    ...capabilities
  };
}
var McpServer = class {
  /**
  * The underlying {@linkcode Server} instance, useful for advanced operations like sending notifications.
  */
  server;
  _registeredResources = {};
  _registeredResourceTemplates = {};
  _registeredTools = {};
  _registeredPrompts = {};
  /**
  * Per-tool JSON-converted `inputSchema`, memoized so the SEP-2243
  * registration-time scan and the pre-dispatch validation step share one
  * conversion instead of paying it twice per request under the
  * per-request-factory `createMcpHandler` model.
  */
  _toolInputSchemaJson = {};
  /**
  * The JSON-serialized `inputSchema` of a registered tool, or `undefined`
  * when no such tool is registered. Used by the HTTP entry's pre-dispatch
  * SEP-2243 `Mcp-Param-*` validation step (which needs the same JSON Schema
  * `tools/list` would emit, before dispatch reaches the handler).
  *
  * @internal
  */
  toolInputSchemaJson(name) {
    const tool = this._registeredTools[name];
    if (tool === void 0 || !tool.enabled) return void 0;
    if (Object.hasOwn(this._toolInputSchemaJson, name)) return this._toolInputSchemaJson[name];
    if (tool.inputSchema === void 0) return EMPTY_OBJECT_JSON_SCHEMA;
    try {
      const json2 = standardSchemaToJsonSchema(tool.inputSchema, "input");
      this._toolInputSchemaJson[name] = json2;
      return json2;
    } catch {
      return;
    }
  }
  constructor(serverInfo, options) {
    this.server = new Server(serverInfo, options);
    if (options?.capabilities?.tools) this.setToolRequestHandlers();
    if (options?.capabilities?.resources) this.setResourceRequestHandlers();
    if (options?.capabilities?.prompts) this.setPromptRequestHandlers();
  }
  /**
  * Attaches to the given transport, starts it, and starts listening for messages.
  *
  * The `server` object assumes ownership of the {@linkcode Transport}, replacing any callbacks that have already been set, and expects that it is the only user of the {@linkcode Transport} instance going forward.
  *
  * @example
  * ```ts source="./mcp.examples.ts#McpServer_connect_stdio"
  * const server = new McpServer({ name: 'my-server', version: '1.0.0' });
  * const transport = new StdioServerTransport();
  * await server.connect(transport);
  * ```
  */
  async connect(transport) {
    return await this.server.connect(transport);
  }
  /**
  * Closes the connection.
  */
  async close() {
    await this.server.close();
  }
  _toolHandlersInitialized = false;
  setToolRequestHandlers() {
    if (this._toolHandlersInitialized) return;
    this.server.assertCanSetRequestHandler("tools/list");
    this.server.assertCanSetRequestHandler("tools/call");
    this.server.registerCapabilities({
      tools: {
        listChanged: this.server.getCapabilities().tools?.listChanged ?? true
      }
    });
    this.server.setRequestHandler("tools/list", () => ({
      tools: Object.entries(this._registeredTools).filter(([, tool]) => tool.enabled).map(([name, tool]) => {
        const toolDefinition = {
          name,
          title: tool.title,
          description: tool.description,
          inputSchema: tool.inputSchema ? standardSchemaToJsonSchema(tool.inputSchema, "input") : EMPTY_OBJECT_JSON_SCHEMA,
          annotations: tool.annotations,
          icons: tool.icons,
          execution: tool.execution,
          _meta: tool._meta
        };
        if (tool.outputSchema) toolDefinition.outputSchema = standardSchemaToJsonSchema(tool.outputSchema, "output");
        return toolDefinition;
      })
    }));
    this.server.setRequestHandler("tools/call", async (request, ctx) => {
      const tool = this._registeredTools[request.params.name];
      if (!tool) throw new ProtocolError(ProtocolErrorCode.InvalidParams, `Tool ${request.params.name} not found`);
      if (!tool.enabled) throw new ProtocolError(ProtocolErrorCode.InvalidParams, `Tool ${request.params.name} disabled`);
      try {
        const args = await this.validateToolInput(tool, request.params.arguments, request.params.name);
        const result = await this.executeToolHandler(tool, args, ctx);
        await this.validateToolOutput(tool, result, request.params.name);
        if (isInputRequiredResult(result)) return result;
        return this.server.projectCallToolResult(result, tool.outputSchemaJson);
      } catch (error51) {
        if (error51 instanceof ProtocolError && error51.code === ProtocolErrorCode.UrlElicitationRequired) throw error51;
        return this.createToolError(error51 instanceof Error ? error51.message : String(error51));
      }
    });
    this._toolHandlersInitialized = true;
  }
  /**
  * Creates a tool error result.
  *
  * @param errorMessage - The error message.
  * @returns The tool error result.
  */
  createToolError(errorMessage) {
    return {
      content: [{
        type: "text",
        text: errorMessage
      }],
      isError: true
    };
  }
  /**
  * Validates tool input arguments against the tool's input schema.
  */
  async validateToolInput(tool, args, toolName) {
    if (!tool.inputSchema) return;
    const parseResult = await validateStandardSchema(tool.inputSchema, args ?? {});
    if (!parseResult.success) throw new ProtocolError(ProtocolErrorCode.InvalidParams, `Input validation error: Invalid arguments for tool ${toolName}: ${parseResult.error}`);
    return parseResult.data;
  }
  /**
  * Validates tool output against the tool's output schema.
  */
  async validateToolOutput(tool, result, toolName) {
    if (!tool.outputSchema) return;
    if (isInputRequiredResult(result)) return;
    if (result.isError) return;
    if (result.structuredContent === void 0) throw new ProtocolError(ProtocolErrorCode.InvalidParams, `Output validation error: Tool ${toolName} has an output schema but no structured content was provided`);
    const parseResult = await validateStandardSchema(tool.outputSchema, result.structuredContent);
    if (!parseResult.success) throw new ProtocolError(ProtocolErrorCode.InvalidParams, `Output validation error: Invalid structured content for tool ${toolName}: ${parseResult.error}`);
  }
  /**
  * Executes a tool handler.
  */
  async executeToolHandler(tool, args, ctx) {
    return tool.executor(args, ctx);
  }
  _completionHandlerInitialized = false;
  setCompletionRequestHandler() {
    if (this._completionHandlerInitialized) return;
    this.server.assertCanSetRequestHandler("completion/complete");
    this.server.registerCapabilities({
      completions: {}
    });
    this.server.setRequestHandler("completion/complete", async request => {
      switch (request.params.ref.type) {
        case "ref/prompt":
          assertCompleteRequestPrompt(request);
          return this.handlePromptCompletion(request, request.params.ref);
        case "ref/resource":
          assertCompleteRequestResourceTemplate(request);
          return this.handleResourceCompletion(request, request.params.ref);
        default:
          throw new ProtocolError(ProtocolErrorCode.InvalidParams, `Invalid completion reference: ${request.params.ref}`);
      }
    });
    this._completionHandlerInitialized = true;
  }
  async handlePromptCompletion(request, ref) {
    const prompt = this._registeredPrompts[ref.name];
    if (!prompt) throw new ProtocolError(ProtocolErrorCode.InvalidParams, `Prompt ${ref.name} not found`);
    if (!prompt.enabled) throw new ProtocolError(ProtocolErrorCode.InvalidParams, `Prompt ${ref.name} disabled`);
    if (!prompt.argsSchema) return EMPTY_COMPLETION_RESULT;
    const field = unwrapOptionalSchema(getSchemaShape(prompt.argsSchema)?.[request.params.argument.name]);
    if (!isCompletable(field)) return EMPTY_COMPLETION_RESULT;
    const completer = getCompleter(field);
    if (!completer) return EMPTY_COMPLETION_RESULT;
    return createCompletionResult(await completer(request.params.argument.value, request.params.context));
  }
  async handleResourceCompletion(request, ref) {
    const template = Object.values(this._registeredResourceTemplates).find(t => t.resourceTemplate.uriTemplate.toString() === ref.uri);
    if (!template) {
      if (this._registeredResources[ref.uri]) return EMPTY_COMPLETION_RESULT;
      throw new ProtocolError(ProtocolErrorCode.InvalidParams, `Resource template ${request.params.ref.uri} not found`);
    }
    const completer = template.resourceTemplate.completeCallback(request.params.argument.name);
    if (!completer) return EMPTY_COMPLETION_RESULT;
    return createCompletionResult(await completer(request.params.argument.value, request.params.context));
  }
  _resourceHandlersInitialized = false;
  setResourceRequestHandlers() {
    if (this._resourceHandlersInitialized) return;
    this.server.assertCanSetRequestHandler("resources/list");
    this.server.assertCanSetRequestHandler("resources/templates/list");
    this.server.assertCanSetRequestHandler("resources/read");
    this.server.registerCapabilities({
      resources: {
        listChanged: this.server.getCapabilities().resources?.listChanged ?? true
      }
    });
    this.server.setRequestHandler("resources/list", async (_request, ctx) => {
      const resources = Object.entries(this._registeredResources).filter(([_, resource]) => resource.enabled).map(([uri, resource]) => ({
        uri,
        name: resource.name,
        ...resource.metadata
      }));
      const templateResources = [];
      for (const template of Object.values(this._registeredResourceTemplates)) {
        if (!template.resourceTemplate.listCallback) continue;
        const result = await template.resourceTemplate.listCallback(ctx);
        for (const resource of result.resources) templateResources.push({
          ...template.metadata,
          ...resource
        });
      }
      return {
        resources: [...resources, ...templateResources]
      };
    });
    this.server.setRequestHandler("resources/templates/list", async () => {
      return {
        resourceTemplates: Object.entries(this._registeredResourceTemplates).map(([name, template]) => ({
          name,
          uriTemplate: template.resourceTemplate.uriTemplate.toString(),
          ...template.metadata
        }))
      };
    });
    this.server.setRequestHandler("resources/read", async (request, ctx) => {
      let uri;
      try {
        uri = new URL(request.params.uri);
      } catch {
        throw new ProtocolError(ProtocolErrorCode.InvalidParams, `Resource URI ${request.params.uri} is invalid`, {
          uri: request.params.uri,
          reason: "invalid_uri"
        });
      }
      const resource = this._registeredResources[uri.toString()];
      if (resource) {
        if (!resource.enabled) throw new ProtocolError(ProtocolErrorCode.InvalidParams, `Resource ${uri} disabled`);
        return attachCacheHintFallback(await resource.readCallback(uri, ctx), resource.cacheHint);
      }
      for (const template of Object.values(this._registeredResourceTemplates)) {
        const variables = template.resourceTemplate.uriTemplate.match(uri.toString());
        if (variables) return attachCacheHintFallback(await template.readCallback(uri, variables, ctx), template.cacheHint);
      }
      throw new ResourceNotFoundError(request.params.uri);
    });
    this._resourceHandlersInitialized = true;
  }
  _promptHandlersInitialized = false;
  setPromptRequestHandlers() {
    if (this._promptHandlersInitialized) return;
    this.server.assertCanSetRequestHandler("prompts/list");
    this.server.assertCanSetRequestHandler("prompts/get");
    this.server.registerCapabilities({
      prompts: {
        listChanged: this.server.getCapabilities().prompts?.listChanged ?? true
      }
    });
    this.server.setRequestHandler("prompts/list", () => ({
      prompts: Object.entries(this._registeredPrompts).filter(([, prompt]) => prompt.enabled).map(([name, prompt]) => {
        return {
          name,
          title: prompt.title,
          description: prompt.description,
          arguments: prompt.argsSchema ? promptArgumentsFromStandardSchema(prompt.argsSchema) : void 0,
          icons: prompt.icons,
          _meta: prompt._meta
        };
      })
    }));
    this.server.setRequestHandler("prompts/get", async (request, ctx) => {
      const prompt = this._registeredPrompts[request.params.name];
      if (!prompt) throw new ProtocolError(ProtocolErrorCode.InvalidParams, `Prompt ${request.params.name} not found`);
      if (!prompt.enabled) throw new ProtocolError(ProtocolErrorCode.InvalidParams, `Prompt ${request.params.name} disabled`);
      return prompt.handler(request.params.arguments, ctx);
    });
    this._promptHandlersInitialized = true;
  }
  registerResource(name, uriOrTemplate, config2, readCallback) {
    const cacheHint = config2.cacheHint;
    let metadata = config2;
    if (cacheHint !== void 0) {
      assertValidCacheHint(cacheHint, `resource ${name}`);
      const rest = {
        ...config2
      };
      delete rest.cacheHint;
      metadata = rest;
    }
    if (typeof uriOrTemplate === "string") {
      if (this._registeredResources[uriOrTemplate]) throw new Error(`Resource ${uriOrTemplate} is already registered`);
      const registeredResource = this._createRegisteredResource(name, config2.title, uriOrTemplate, metadata, readCallback);
      if (cacheHint !== void 0) registeredResource.cacheHint = cacheHint;
      this.setResourceRequestHandlers();
      this.sendResourceListChanged();
      return registeredResource;
    } else {
      if (this._registeredResourceTemplates[name]) throw new Error(`Resource template ${name} is already registered`);
      const registeredResourceTemplate = this._createRegisteredResourceTemplate(name, config2.title, uriOrTemplate, metadata, readCallback);
      if (cacheHint !== void 0) registeredResourceTemplate.cacheHint = cacheHint;
      this.setResourceRequestHandlers();
      this.sendResourceListChanged();
      return registeredResourceTemplate;
    }
  }
  _createRegisteredResource(name, title, uri, metadata, readCallback) {
    const registeredResource = {
      name,
      title,
      metadata,
      readCallback,
      enabled: true,
      disable: () => registeredResource.update({
        enabled: false
      }),
      enable: () => registeredResource.update({
        enabled: true
      }),
      remove: () => registeredResource.update({
        uri: null
      }),
      update: updates => {
        if (updates.uri !== void 0 && updates.uri !== uri) {
          delete this._registeredResources[uri];
          if (updates.uri) this._registeredResources[updates.uri] = registeredResource;
        }
        if (updates.name !== void 0) registeredResource.name = updates.name;
        if (updates.title !== void 0) registeredResource.title = updates.title;
        if (updates.metadata !== void 0) registeredResource.metadata = updates.metadata;
        if (updates.callback !== void 0) registeredResource.readCallback = updates.callback;
        if (updates.enabled !== void 0) registeredResource.enabled = updates.enabled;
        this.sendResourceListChanged();
      }
    };
    this._registeredResources[uri] = registeredResource;
    return registeredResource;
  }
  _createRegisteredResourceTemplate(name, title, template, metadata, readCallback) {
    const registeredResourceTemplate = {
      resourceTemplate: template,
      title,
      metadata,
      readCallback,
      enabled: true,
      disable: () => registeredResourceTemplate.update({
        enabled: false
      }),
      enable: () => registeredResourceTemplate.update({
        enabled: true
      }),
      remove: () => registeredResourceTemplate.update({
        name: null
      }),
      update: updates => {
        if (updates.name !== void 0 && updates.name !== name) {
          delete this._registeredResourceTemplates[name];
          if (updates.name) this._registeredResourceTemplates[updates.name] = registeredResourceTemplate;
        }
        if (updates.title !== void 0) registeredResourceTemplate.title = updates.title;
        if (updates.template !== void 0) registeredResourceTemplate.resourceTemplate = updates.template;
        if (updates.metadata !== void 0) registeredResourceTemplate.metadata = updates.metadata;
        if (updates.callback !== void 0) registeredResourceTemplate.readCallback = updates.callback;
        if (updates.enabled !== void 0) registeredResourceTemplate.enabled = updates.enabled;
        this.sendResourceListChanged();
      }
    };
    this._registeredResourceTemplates[name] = registeredResourceTemplate;
    const variableNames = template.uriTemplate.variableNames;
    if (Array.isArray(variableNames) && variableNames.some(v => !!template.completeCallback(v))) this.setCompletionRequestHandler();
    return registeredResourceTemplate;
  }
  _createRegisteredPrompt(name, title, description, argsSchema, callback, icons, _meta) {
    let currentArgsSchema = argsSchema;
    let currentCallback = callback;
    const registeredPrompt = {
      title,
      description,
      argsSchema,
      icons,
      _meta,
      handler: createPromptHandler(name, argsSchema, callback),
      enabled: true,
      disable: () => registeredPrompt.update({
        enabled: false
      }),
      enable: () => registeredPrompt.update({
        enabled: true
      }),
      remove: () => registeredPrompt.update({
        name: null
      }),
      update: updates => {
        if (updates.name !== void 0 && updates.name !== name) {
          delete this._registeredPrompts[name];
          if (updates.name) this._registeredPrompts[updates.name] = registeredPrompt;
        }
        if (updates.title !== void 0) registeredPrompt.title = updates.title;
        if (updates.description !== void 0) registeredPrompt.description = updates.description;
        if (updates.icons !== void 0) registeredPrompt.icons = updates.icons;
        if (updates._meta !== void 0) registeredPrompt._meta = updates._meta;
        let needsHandlerRegen = false;
        if (updates.argsSchema !== void 0) {
          registeredPrompt.argsSchema = updates.argsSchema;
          currentArgsSchema = updates.argsSchema;
          needsHandlerRegen = true;
        }
        if (updates.callback !== void 0) {
          currentCallback = updates.callback;
          needsHandlerRegen = true;
        }
        if (needsHandlerRegen) registeredPrompt.handler = createPromptHandler(name, currentArgsSchema, currentCallback);
        if (updates.enabled !== void 0) registeredPrompt.enabled = updates.enabled;
        this.sendPromptListChanged();
      }
    };
    this._registeredPrompts[name] = registeredPrompt;
    if (argsSchema) {
      const shape = getSchemaShape(argsSchema);
      if (shape) {
        if (Object.values(shape).some(field => {
          return isCompletable(unwrapOptionalSchema(field));
        })) this.setCompletionRequestHandler();
      }
    }
    return registeredPrompt;
  }
  _createRegisteredTool(name, title, description, inputSchema, outputSchema, annotations, icons, execution, _meta, handler) {
    validateAndWarnToolName(name);
    if (inputSchema !== void 0) try {
      const json2 = standardSchemaToJsonSchema(inputSchema, "input");
      this._toolInputSchemaJson[name] = json2;
      const scan = scanXMcpHeaderDeclarations(json2);
      if (!scan.valid) console.warn(`[mcp-sdk] tool '${name}' carries an invalid x-mcp-header declaration and will be excluded by conforming Streamable HTTP clients: ${scan.reason}`);
    } catch {}
    let currentHandler = handler;
    const registeredTool = {
      title,
      description,
      inputSchema,
      outputSchema,
      outputSchemaJson: convertOutputSchemaJson(outputSchema),
      annotations,
      icons,
      execution,
      _meta,
      handler,
      executor: createToolExecutor(inputSchema, handler),
      enabled: true,
      disable: () => registeredTool.update({
        enabled: false
      }),
      enable: () => registeredTool.update({
        enabled: true
      }),
      remove: () => registeredTool.update({
        name: null
      }),
      update: updates => {
        if (updates.name !== void 0 && updates.name !== name) {
          if (typeof updates.name === "string") validateAndWarnToolName(updates.name);
          delete this._registeredTools[name];
          delete this._toolInputSchemaJson[name];
          if (updates.name) {
            delete this._toolInputSchemaJson[updates.name];
            this._registeredTools[updates.name] = registeredTool;
            name = updates.name;
          }
        }
        if (updates.title !== void 0) registeredTool.title = updates.title;
        if (updates.description !== void 0) registeredTool.description = updates.description;
        let needsExecutorRegen = false;
        if (updates.paramsSchema !== void 0) {
          registeredTool.inputSchema = updates.paramsSchema;
          delete this._toolInputSchemaJson[name];
          needsExecutorRegen = true;
        }
        if (updates.callback !== void 0) {
          registeredTool.handler = updates.callback;
          currentHandler = updates.callback;
          needsExecutorRegen = true;
        }
        if (needsExecutorRegen) registeredTool.executor = createToolExecutor(registeredTool.inputSchema, currentHandler);
        if (updates.outputSchema !== void 0) {
          registeredTool.outputSchema = updates.outputSchema;
          registeredTool.outputSchemaJson = convertOutputSchemaJson(updates.outputSchema);
        }
        if (updates.annotations !== void 0) registeredTool.annotations = updates.annotations;
        if (updates.icons !== void 0) registeredTool.icons = updates.icons;
        if (updates._meta !== void 0) registeredTool._meta = updates._meta;
        if (updates.enabled !== void 0) registeredTool.enabled = updates.enabled;
        this.sendToolListChanged();
      }
    };
    this._registeredTools[name] = registeredTool;
    this.setToolRequestHandlers();
    this.sendToolListChanged();
    return registeredTool;
  }
  registerTool(name, config2, cb) {
    if (this._registeredTools[name]) throw new Error(`Tool ${name} is already registered`);
    const {
      title,
      description,
      inputSchema,
      outputSchema,
      annotations,
      icons,
      _meta
    } = config2;
    return this._createRegisteredTool(name, title, description, normalizeRawShapeSchema(inputSchema), normalizeRawShapeSchema(outputSchema), annotations, icons, void 0, _meta, cb);
  }
  registerPrompt(name, config2, cb) {
    if (this._registeredPrompts[name]) throw new Error(`Prompt ${name} is already registered`);
    const {
      title,
      description,
      argsSchema,
      icons,
      _meta
    } = config2;
    const registeredPrompt = this._createRegisteredPrompt(name, title, description, normalizeRawShapeSchema(argsSchema), cb, icons, _meta);
    this.setPromptRequestHandlers();
    this.sendPromptListChanged();
    return registeredPrompt;
  }
  /**
  * Checks if the server is connected to a transport.
  * @returns `true` if the server is connected
  */
  isConnected() {
    return this.server.transport !== void 0;
  }
  /**
  * Sends a logging message to the client, if connected.
  * Note: You only need to send the parameters object, not the entire JSON-RPC message.
  * @see {@linkcode LoggingMessageNotification}
  * @param params
  * @param sessionId Optional for stateless transports and backward compatibility.
  *
  * @example
  * ```ts source="./mcp.examples.ts#McpServer_sendLoggingMessage_basic"
  * await server.sendLoggingMessage({
  *     level: 'info',
  *     data: 'Processing complete'
  * });
  * ```
  *
  * @deprecated Deprecated as of protocol version 2026-07-28 (SEP-2577).
  * Remains functional during the deprecation window (at least twelve months).
  * Migrate to stderr logging (STDIO servers) or OpenTelemetry.
  */
  async sendLoggingMessage(params, sessionId) {
    return this.server.sendLoggingMessage(params, sessionId);
  }
  /**
  * Sends a resource list changed event to the client, if connected.
  */
  sendResourceListChanged() {
    if (this.isConnected()) this.server.sendResourceListChanged();
  }
  /**
  * Sends a tool list changed event to the client, if connected.
  */
  sendToolListChanged() {
    if (this.isConnected()) this.server.sendToolListChanged();
  }
  /**
  * Sends a prompt list changed event to the client, if connected.
  */
  sendPromptListChanged() {
    if (this.isConnected()) this.server.sendPromptListChanged();
  }
};
function createToolExecutor(inputSchema, handler) {
  if (inputSchema) {
    const callback$1 = handler;
    return async (args, ctx) => callback$1(args, ctx);
  }
  const callback = handler;
  return async (_args, ctx) => callback(ctx);
}
var EMPTY_OBJECT_JSON_SCHEMA = {
  type: "object",
  properties: {}
};
function convertOutputSchemaJson(outputSchema) {
  if (outputSchema === void 0) return void 0;
  try {
    return standardSchemaToJsonSchema(outputSchema, "output");
  } catch {
    return;
  }
}
function createPromptHandler(name, argsSchema, callback) {
  if (argsSchema) {
    const typedCallback = callback;
    return async (args, ctx) => {
      const parseResult = await validateStandardSchema(argsSchema, args);
      if (!parseResult.success) throw new ProtocolError(ProtocolErrorCode.InvalidParams, `Invalid arguments for prompt ${name}: ${parseResult.error}`);
      return typedCallback(parseResult.data, ctx);
    };
  } else {
    const typedCallback = callback;
    return async (_args, ctx) => {
      return typedCallback(ctx);
    };
  }
}
function createCompletionResult(suggestions) {
  return {
    completion: {
      values: suggestions.map(String).slice(0, 100),
      total: suggestions.length,
      hasMore: suggestions.length > 100
    }
  };
}
var EMPTY_COMPLETION_RESULT = {
  completion: {
    values: [],
    hasMore: false
  }
};
function getSchemaShape(schema) {
  const candidate = schema;
  if (candidate.shape && typeof candidate.shape === "object") return candidate.shape;
}
function isOptionalSchema(schema) {
  return schema?.type === "optional";
}
function unwrapOptionalSchema(schema) {
  if (!isOptionalSchema(schema)) return schema;
  return schema.def?.innerType ?? schema;
}

// node_modules/@modelcontextprotocol/server/dist/index.mjs
export { COMPLETABLE_SYMBOL, isCompletable, getCompleter, MAX_TIMER_DELAY_MS, DEFAULT_LEGACY_SHIM_MAX_ROUNDS, DEFAULT_LEGACY_SHIM_ROUND_TIMEOUT_MS, resolveLegacyShimOptions, coerceEmbeddedInputRequest, syntheticElicitationId, legacyShimFailure, LegacyInputRequiredShim, INPUT_REQUIRED_CAPABLE_METHODS, writeClientIdentity, installDiscoverHandler, readServerIdentity, Server, discoverAdvertisedCapabilities, McpServer, createToolExecutor, EMPTY_OBJECT_JSON_SCHEMA, convertOutputSchemaJson, createPromptHandler, createCompletionResult, EMPTY_COMPLETION_RESULT, getSchemaShape, isOptionalSchema, unwrapOptionalSchema };
