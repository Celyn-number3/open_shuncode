// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { init_define_SHUNCODE_BUILD_INFO } from "../../../../runtime/build-info.mjs";
import { WebStandardStreamableHTTPServerTransport } from "../../server/dist/index.mjs";
import { getRequestListener } from "../node_modules/@hono/node-server/dist/index.mjs";
// node_modules/@modelcontextprotocol/node/dist/index.mjs
init_define_SHUNCODE_BUILD_INFO();

// node_modules/@modelcontextprotocol/node/node_modules/@hono/node-server/dist/index.mjs

// node_modules/@modelcontextprotocol/node/dist/index.mjs
var NodeStreamableHTTPServerTransport = class {
  _webStandardTransport;
  _requestListener;
  _requestContext = /* @__PURE__ */new WeakMap();
  constructor(options = {}) {
    this._webStandardTransport = new WebStandardStreamableHTTPServerTransport(options);
    this._requestListener = getRequestListener(async webRequest => {
      const context = this._requestContext.get(webRequest);
      return this._webStandardTransport.handleRequest(webRequest, {
        authInfo: context?.authInfo,
        parsedBody: context?.parsedBody
      });
    }, {
      overrideGlobalObjects: false
    });
  }
  /**
  * Gets the session ID for this transport instance.
  */
  get sessionId() {
    return this._webStandardTransport.sessionId;
  }
  /**
  * Sets callback for when the transport is closed.
  */
  set onclose(handler) {
    this._webStandardTransport.onclose = handler;
  }
  get onclose() {
    return this._webStandardTransport.onclose;
  }
  /**
  * Sets callback for transport errors.
  */
  set onerror(handler) {
    this._webStandardTransport.onerror = handler;
  }
  get onerror() {
    return this._webStandardTransport.onerror;
  }
  /**
  * Sets callback for incoming messages.
  */
  set onmessage(handler) {
    this._webStandardTransport.onmessage = handler;
  }
  get onmessage() {
    return this._webStandardTransport.onmessage;
  }
  /**
  * Starts the transport. This is required by the {@linkcode Transport} interface but is a no-op
  * for the Streamable HTTP transport as connections are managed per-request.
  */
  async start() {
    return this._webStandardTransport.start();
  }
  /**
  * Closes the transport and all active connections.
  */
  async close() {
    return this._webStandardTransport.close();
  }
  /**
  * Sends a JSON-RPC message through the transport.
  */
  async send(message, options) {
    return this._webStandardTransport.send(message, options);
  }
  /**
  * Forwards the supported protocol versions to the wrapped Web Standard
  * transport for `MCP-Protocol-Version` header validation. Called by the
  * protocol layer during connect; without this delegation a server's
  * `supportedProtocolVersions` option never reached the Node adapter's
  * header validation.
  */
  setSupportedProtocolVersions(versions) {
    this._webStandardTransport.setSupportedProtocolVersions(versions);
  }
  /**
  * Handles an incoming HTTP request, whether `GET` or `POST`.
  *
  * This method converts Node.js HTTP objects to Web Standard Request/Response
  * and delegates to the underlying {@linkcode WebStandardStreamableHTTPServerTransport}.
  *
  * @param req - Node.js `IncomingMessage`, optionally with `auth` property from middleware
  * @param res - Node.js `ServerResponse`
  * @param parsedBody - Optional pre-parsed body from body-parser middleware
  */
  async handleRequest(req, res, parsedBody) {
    const authInfo = req.auth;
    await getRequestListener(async webRequest => {
      return this._webStandardTransport.handleRequest(webRequest, {
        authInfo,
        parsedBody
      });
    }, {
      overrideGlobalObjects: false
    })(req, res);
  }
  /**
  * Close an SSE stream for a specific request, triggering client reconnection.
  * Use this to implement polling behavior during long-running operations -
  * client will reconnect after the retry interval specified in the priming event.
  */
  closeSSEStream(requestId) {
    this._webStandardTransport.closeSSEStream(requestId);
  }
  /**
  * Close the standalone GET SSE stream, triggering client reconnection.
  * Use this to implement polling behavior for server-initiated notifications.
  */
  closeStandaloneSSEStream() {
    this._webStandardTransport.closeStandaloneSSEStream();
  }
};
function toNodeHandler(handler, opts) {
  return async (req, res, parsedBody) => {
    if (typeof parsedBody === "function") parsedBody = void 0;
    let finished = false;
    const abort = new AbortController();
    res.on("close", () => {
      if (!finished) abort.abort();
    });
    if (res.destroyed === true) abort.abort();
    let response;
    try {
      const request = await toWebRequest(req, parsedBody, {
        signal: abort.signal
      });
      response = await handler.fetch(request, {
        ...(req.auth !== void 0 && {
          authInfo: req.auth
        }),
        ...(parsedBody !== void 0 && {
          parsedBody
        })
      });
    } catch (error2) {
      try {
        opts?.onerror?.(error2 instanceof Error ? error2 : new Error(String(error2)));
      } catch {}
      response = internalServerErrorResponse2(echoableRequestId2(parsedBody));
    }
    const headers = {};
    for (const [name, value] of response.headers) headers[name] = value;
    res.writeHead(response.status, headers);
    if (response.body === null) {
      finished = true;
      res.end();
      return;
    }
    let drainResolve;
    const releaseDrainWait = () => {
      drainResolve?.();
      drainResolve = void 0;
    };
    res.on("drain", releaseDrainWait);
    const closed = new Promise(resolve => {
      abort.signal.addEventListener("abort", () => resolve(), {
        once: true
      });
    });
    try {
      for await (const chunk of response.body) {
        if (abort.signal.aborted) break;
        if (res.write(chunk) === false) await Promise.race([new Promise(resolve => {
          drainResolve = resolve;
        }), closed]);
      }
    } catch {}
    finished = true;
    res.end();
  };
}
function singleHeaderValue(value) {
  return Array.isArray(value) ? value[0] : value;
}
async function toWebRequest(req, parsedBody, options) {
  const method = (req.method ?? "GET").toUpperCase();
  const url2 = `http://${singleHeaderValue(req.headers["host"]) ?? singleHeaderValue(req.headers[":authority"]) ?? "localhost"}${req.url ?? "/"}`;
  const headers = new Headers();
  for (const [name, value] of Object.entries(req.headers)) {
    if (value === void 0 || name.startsWith(":")) continue;
    if (Array.isArray(value)) for (const item of value) headers.append(name, item);else headers.set(name, value);
  }
  let body;
  if (method !== "GET" && method !== "HEAD") if (parsedBody === void 0) {
    const decoder = new TextDecoder();
    let collected = "";
    for await (const chunk of req) collected += typeof chunk === "string" ? chunk : decoder.decode(chunk, {
      stream: true
    });
    collected += decoder.decode();
    if (collected.length > 0) body = collected;
  } else {
    const serialized = JSON.stringify(parsedBody);
    headers.delete("content-encoding");
    headers.delete("transfer-encoding");
    if (serialized === void 0) headers.delete("content-length");else {
      body = serialized;
      headers.set("content-length", String(new TextEncoder().encode(serialized).byteLength));
    }
  }
  return new Request(url2, {
    method,
    headers,
    ...(options?.signal !== void 0 && {
      signal: options.signal
    }),
    ...(body !== void 0 && {
      body
    })
  });
}
function echoableRequestId2(body) {
  if (body === null || typeof body !== "object" || Array.isArray(body)) return null;
  const {
    method,
    id
  } = body;
  if (typeof method !== "string") return null;
  return typeof id === "string" || typeof id === "number" ? id : null;
}
function internalServerErrorResponse2(id) {
  return Response.json({
    jsonrpc: "2.0",
    error: {
      code: -32603,
      message: "Internal server error"
    },
    id
  }, {
    status: 500
  });
}

// extensions/shuncode/src/bridge-mcp-modern.ts
export { NodeStreamableHTTPServerTransport, toNodeHandler, singleHeaderValue, toWebRequest, echoableRequestId2, internalServerErrorResponse2 };
