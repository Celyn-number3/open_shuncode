// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { __toESM } from "../../../runtime/helpers.mjs";
import { init_define_SHUNCODE_BUILD_INFO } from "../../../runtime/build-info.mjs";
import { fetchThroughExtensionHostProxy, resolveExtensionHostProxy } from "./extension-host-proxy.mjs";
// extensions/shuncode/src/runtime-client.ts
init_define_SHUNCODE_BUILD_INFO();
var import_node_child_process8 = require("node:child_process");
var import_node_readline = __toESM(require("node:readline"));
var import_node_path18 = __toESM(require("node:path"));
var vscode14 = __toESM(require("vscode"));
var RuntimeRpcError = class extends Error {
  constructor(code, message, data) {
    super(`Runtime ${code}: ${message}`);
    this.code = code;
    this.data = data;
    this.name = "RuntimeRpcError";
  }
  code;
  data;
};
var RuntimeClient = class {
  constructor(context, output, ideToolBroker) {
    this.context = context;
    this.output = output;
    this.ideToolBroker = ideToolBroker;
  }
  context;
  output;
  ideToolBroker;
  process;
  pending = /* @__PURE__ */new Map();
  traceListeners = /* @__PURE__ */new Map();
  checkpointListeners = /* @__PURE__ */new Map();
  runContexts = /* @__PURE__ */new Map();
  networkFetchControllers = /* @__PURE__ */new Map();
  nextId = 1;
  nextRunId = 1;
  starting;
  async start() {
    if (this.process && !this.process.killed) {
      return this.request("runtime/hello", {}, 1e4);
    }
    if (this.starting) return this.starting;
    this.starting = this.startProcess();
    try {
      return await this.starting;
    } finally {
      this.starting = void 0;
    }
  }
  async restart() {
    this.stop();
    return this.start();
  }
  async runAgent(params, onTrace, onCheckpoint, invocationContext) {
    await this.start();
    const runId = `run-${Date.now()}-${this.nextRunId++}`;
    if (onTrace) this.traceListeners.set(runId, onTrace);
    if (onCheckpoint) this.checkpointListeners.set(runId, onCheckpoint);
    if (invocationContext) {
      this.runContexts.set(runId, {
        ...invocationContext,
        registeredToolNames: new Set((params.externalTools ?? []).map(tool => tool.name))
      });
    }
    const runPromise = this.request("agent/run", {
      ...params,
      runId
    });
    const cancellation = invocationContext?.cancellationToken.onCancellationRequested(() => {
      void this.request("agent/cancel", {
        runId
      }, 1e4).catch(error2 => {
        this.output.appendLine(`[runtime] failed to cancel ${runId}: ${error2 instanceof Error ? error2.message : String(error2)}`);
      });
    });
    if (invocationContext?.cancellationToken.isCancellationRequested) {
      void this.request("agent/cancel", {
        runId
      }, 1e4).catch(() => void 0);
    }
    try {
      return await runPromise;
    } finally {
      cancellation?.dispose();
      this.traceListeners.delete(runId);
      this.checkpointListeners.delete(runId);
      this.runContexts.delete(runId);
    }
  }
  async hello() {
    await this.start();
    return this.request("runtime/hello", {}, 1e4);
  }
  dispose() {
    this.stop();
  }
  resolveEntryPoint() {
    const configured = vscode14.workspace.getConfiguration("shuncode").get("runtime.entryPoint")?.trim();
    const candidates = [configured, process.env.SHUNCODE_AGENT_HOST_ENTRY, this.context.asAbsolutePath(import_node_path18.default.join("runtime", "agent-host.js")), ...(vscode14.workspace.workspaceFolders ?? []).map(folder => import_node_path18.default.join(folder.uri.fsPath, "dist", "src", "agent-host.js"))].filter(value => Boolean(value));
    const fs4 = require("node:fs");
    const found = candidates.find(candidate => fs4.existsSync(candidate));
    if (found) return import_node_path18.default.resolve(found);
    throw new Error("ShunCode Agent Runtime was not found. Run the carrier through scripts/shuncode-dev.bat or set shuncode.runtime.entryPoint to dist/src/agent-host.js.");
  }
  async startProcess() {
    const entryPoint = this.resolveEntryPoint();
    this.output.appendLine(`[runtime] starting ${entryPoint}`);
    const child = (0, import_node_child_process8.spawn)(process.execPath, [entryPoint], {
      cwd: vscode14.workspace.workspaceFolders?.[0]?.uri.fsPath ?? this.context.extensionPath,
      env: {
        ...process.env,
        ELECTRON_RUN_AS_NODE: "1"
      },
      stdio: ["pipe", "pipe", "pipe"],
      windowsHide: true
    });
    this.process = child;
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", chunk => this.output.append(String(chunk)));
    child.on("exit", (code, signal) => {
      this.output.appendLine(`[runtime] exited code=${String(code)} signal=${String(signal)}`);
      if (this.process === child) this.process = void 0;
      this.rejectPending(new Error(`ShunCode Agent Runtime exited (code=${String(code)}, signal=${String(signal)}).`));
    });
    child.on("error", error2 => {
      this.output.appendLine(`[runtime] process error: ${error2.message}`);
      this.rejectPending(error2);
    });
    const lines = import_node_readline.default.createInterface({
      input: child.stdout,
      crlfDelay: Infinity
    });
    lines.on("line", line => this.handleLine(line));
    return this.request("runtime/hello", {}, 15e3);
  }
  request(method, params, timeoutMs) {
    const child = this.process;
    if (!child || child.killed) return Promise.reject(new Error("ShunCode Agent Runtime is not running."));
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      const timer = timeoutMs === void 0 ? void 0 : setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`Runtime request timed out: ${method}`));
      }, timeoutMs);
      this.pending.set(id, {
        resolve: value => resolve(value),
        reject,
        timer
      });
      child.stdin.write(`${JSON.stringify({
        jsonrpc: "2.0",
        id,
        method,
        params
      })}
`, error2 => {
        if (!error2) return;
        if (timer) clearTimeout(timer);
        this.pending.delete(id);
        reject(error2);
      });
    });
  }
  handleLine(line) {
    let response;
    try {
      response = JSON.parse(line);
    } catch {
      this.output.appendLine(`[runtime] non-JSON stdout: ${line}`);
      return;
    }
    if (response.method === "ide/tool/invoke" && response.id !== void 0) {
      void this.handleIdeToolRequest(response);
      return;
    }
    if (response.method === "network/fetch" && response.id !== void 0) {
      void this.handleNetworkFetchRequest(response);
      return;
    }
    if (response.method === "network/fetch/cancel") {
      const params = response.params && typeof response.params === "object" ? response.params : {};
      const streamId = typeof params.streamId === "string" ? params.streamId : "";
      this.networkFetchControllers.get(streamId)?.abort(new Error("Runtime canceled the network request."));
      return;
    }
    if (response.method === "agent/trace") {
      const params = response.params;
      const runId = typeof params?.runId === "string" ? params.runId : void 0;
      if (runId) {
        const listener = this.traceListeners.get(runId);
        if (listener && params?.item && typeof params.item === "object") {
          listener(params.item);
        }
      }
      return;
    }
    if (response.method === "agent/checkpoint") {
      const params = response.params;
      const runId = typeof params?.runId === "string" ? params.runId : void 0;
      if (runId && params?.checkpoint && typeof params.checkpoint === "object" && !Array.isArray(params.checkpoint)) {
        this.checkpointListeners.get(runId)?.(params.checkpoint);
      }
      return;
    }
    if (response.id === void 0) {
      this.output.appendLine(`[runtime] unexpected notification: ${line}`);
      return;
    }
    const id = Number(response.id);
    const pending = this.pending.get(id);
    if (!pending) {
      this.output.appendLine(`[runtime] unexpected response id=${String(response.id)}`);
      return;
    }
    if (pending.timer) clearTimeout(pending.timer);
    this.pending.delete(id);
    if (response.error) {
      pending.reject(new RuntimeRpcError(response.error.code, response.error.message, response.error.data));
    } else {
      pending.resolve(response.result);
    }
  }
  async handleIdeToolRequest(request) {
    const child = this.process;
    if (!child || child.killed || request.id === void 0) return;
    const params = request.params && typeof request.params === "object" ? request.params : {};
    const runId = typeof params.runId === "string" ? params.runId : "";
    const name = typeof params.name === "string" ? params.name : "";
    const args = params.arguments && typeof params.arguments === "object" && !Array.isArray(params.arguments) ? params.arguments : {};
    const context = this.runContexts.get(runId);
    try {
      if (!context) throw new Error(`Unknown or inactive runId: ${runId}`);
      if (!name) throw new Error("IDE tool request is missing a tool name.");
      const result = await this.ideToolBroker.invoke(name, args, context, context.registeredToolNames.has(name));
      child.stdin.write(`${JSON.stringify({
        jsonrpc: "2.0",
        id: request.id,
        result
      })}
`);
    } catch (error2) {
      const message = error2 instanceof Error ? error2.message : String(error2);
      child.stdin.write(`${JSON.stringify({
        jsonrpc: "2.0",
        id: request.id,
        error: {
          code: -32010,
          message
        }
      })}
`);
    }
  }
  errorChain(error2) {
    const messages = [];
    let current = error2;
    for (let depth = 0; depth < 6 && current; depth += 1) {
      const message = current instanceof Error ? current.message : String(current);
      if (message && !messages.includes(message)) messages.push(message);
      current = current instanceof Error ? current.cause : void 0;
    }
    return messages.join(": ") || "Unknown network error";
  }
  async handleNetworkFetchRequest(request) {
    const child = this.process;
    if (!child || child.killed || request.id === void 0) return;
    const streamId = String(request.id);
    const params = request.params && typeof request.params === "object" && !Array.isArray(request.params) ? request.params : {};
    const controller = new AbortController();
    this.networkFetchControllers.set(streamId, controller);
    let responseStarted = false;
    const send = payload => {
      if (!child.killed) child.stdin.write(`${JSON.stringify(payload)}
`);
    };
    try {
      const url2 = typeof params.url === "string" ? params.url : "";
      const parsedUrl = new URL(url2);
      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") throw new Error("Only HTTP and HTTPS URLs are supported.");
      const headers = new Headers();
      if (params.headers && typeof params.headers === "object" && !Array.isArray(params.headers)) {
        for (const [key, value] of Object.entries(params.headers)) {
          if (typeof value === "string") headers.set(key, value);
        }
      }
      const method = typeof params.method === "string" ? params.method : "GET";
      const httpConfiguration = vscode14.workspace.getConfiguration("http");
      const configuredProxy = httpConfiguration.get("proxy")?.trim();
      const proxySupport = httpConfiguration.get("proxySupport");
      const proxyUrl = proxySupport === "off" ? void 0 : resolveExtensionHostProxy(parsedUrl, configuredProxy);
      const response = proxyUrl ? await fetchThroughExtensionHostProxy(parsedUrl, {
        method,
        headers,
        body: typeof params.body === "string" ? params.body : void 0,
        signal: controller.signal,
        proxyUrl,
        rejectUnauthorized: httpConfiguration.get("proxyStrictSSL", true)
      }) : await fetch(parsedUrl, {
        method,
        headers,
        body: typeof params.body === "string" ? params.body : void 0,
        signal: controller.signal
      });
      responseStarted = true;
      send({
        jsonrpc: "2.0",
        id: request.id,
        result: {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        }
      });
      if (response.body) {
        const reader = response.body.getReader();
        try {
          while (true) {
            const chunk = await reader.read();
            if (chunk.done) break;
            for (let offset = 0; offset < chunk.value.byteLength; offset += 64 * 1024) {
              const slice = chunk.value.subarray(offset, Math.min(chunk.value.byteLength, offset + 64 * 1024));
              send({
                jsonrpc: "2.0",
                method: "network/fetch/chunk",
                params: {
                  streamId,
                  data: Buffer.from(slice).toString("base64")
                }
              });
            }
          }
        } finally {
          reader.releaseLock();
        }
      }
      send({
        jsonrpc: "2.0",
        method: "network/fetch/end",
        params: {
          streamId
        }
      });
    } catch (error2) {
      const message = this.errorChain(error2);
      if (responseStarted) {
        send({
          jsonrpc: "2.0",
          method: "network/fetch/error",
          params: {
            streamId,
            message
          }
        });
      } else {
        send({
          jsonrpc: "2.0",
          id: request.id,
          error: {
            code: -32020,
            message: `Extension-host fetch failed: ${message}`
          }
        });
      }
    } finally {
      this.networkFetchControllers.delete(streamId);
    }
  }
  stop() {
    const child = this.process;
    this.process = void 0;
    if (child && !child.killed) child.kill();
    this.traceListeners.clear();
    this.runContexts.clear();
    for (const controller of this.networkFetchControllers.values()) controller.abort(new Error("ShunCode Agent Runtime stopped."));
    this.networkFetchControllers.clear();
    this.rejectPending(new Error("ShunCode Agent Runtime stopped."));
  }
  rejectPending(error2) {
    for (const pending of this.pending.values()) {
      if (pending.timer) clearTimeout(pending.timer);
      pending.reject(error2);
    }
    this.pending.clear();
  }
};

// extensions/shuncode/src/workspace-hub.ts
export { import_node_child_process8, import_node_readline, import_node_path18, vscode14, RuntimeRpcError, RuntimeClient };
