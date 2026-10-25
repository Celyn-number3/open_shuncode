// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { __toESM } from "../../../runtime/helpers.mjs";
import { init_define_SHUNCODE_BUILD_INFO } from "../../../runtime/build-info.mjs";
import { acquireBridgeTunnelLease } from "./bridge-tunnel-lease.mjs";
import { HUB_MAX_CHAT_BYTES, HUB_REQUEST_TTL_MS, HUB_WINDOW_TTL_MS } from "./workspace-hub-types.mjs";
// extensions/shuncode/src/workspace-hub-store.ts
init_define_SHUNCODE_BUILD_INFO();
var import_node_crypto14 = require("node:crypto");
var fs3 = __toESM(require("node:fs/promises"));
var import_node_path19 = __toESM(require("node:path"));

// extensions/shuncode/src/workspace-hub-types.ts

// extensions/shuncode/src/workspace-hub-store.ts
var digest = value => (0, import_node_crypto14.createHash)("sha256").update(value).digest("hex");
var safeKey = value => /^[a-f0-9]{64}$/.test(value);
var safeWindowId = value => /^[a-f0-9-]{36}$/.test(value);
var busy = "SHUNCODE_CHAT_WRITE_BUSY";
var missing = error2 => error2?.code === "ENOENT";
var record3 = v => !!v && typeof v === "object" && !Array.isArray(v);
var hubChatKey = (workspaceId, sessionResource) => digest(`${workspaceId}
${sessionResource}`);
function validHubWorkspace(value) {
  if (!record3(value) || typeof value.id !== "string" || !(safeKey(value.id) || value.id === "empty") || typeof value.name !== "string" || value.name.length > 300 || !Array.isArray(value.folders) || value.folders.length > 100 || value.folders.some(f => typeof f !== "string" || f.length > 8192)) return false;
  if (!["folder", "workspace", "empty"].includes(String(value.kind))) return false;
  return value.kind === "empty" ? value.uri === void 0 : typeof value.uri === "string" && /^file:\/\//.test(value.uri) && value.uri.length <= 8192 && !/[\r\n]/.test(value.uri);
}
function parseFrame(frame2) {
  if (typeof frame2.sessionId !== "string" || !frame2.sessionId || frame2.sessionId.length > 256 || /[\/\\\0]/.test(frame2.sessionId)) throw new Error("Invalid chat session ID.");
  if (typeof frame2.sessionResource !== "string" || !/^vscode-chat-session:\/\/local\/[A-Za-z0-9_=-]+$/.test(frame2.sessionResource)) throw new Error("Only native local chat sessions can be shared.");
  if (!Number.isSafeInteger(frame2.sequence) || frame2.sequence < 0 || typeof frame2.serialized !== "string" || Buffer.byteLength(frame2.serialized) > HUB_MAX_CHAT_BYTES) throw new Error("Chat snapshot is invalid or exceeds 32 MiB. The original history is retained.");
  const canonicalResource = `vscode-chat-session://local/${Buffer.from(frame2.sessionId).toString("base64url")}`;
  if (frame2.sessionResource !== canonicalResource) throw new Error("Chat resource does not match its session ID.");
  const data = JSON.parse(frame2.serialized);
  if (!record3(data) || data.sessionId !== frame2.sessionId || !Array.isArray(data.requests)) throw new Error("Invalid serialized chat snapshot.");
  delete data.inputState;
  delete data.pendingRequests;
  return data;
}
function titleOf(data) {
  const first = data.requests[0];
  const message = record3(first?.message) ? first.message.text : first?.message;
  return String(data.customTitle || message || "\u65B0\u5BF9\u8BDD").replace(/\s+/g, " ").slice(0, 180);
}
function messageTime(data, fallback) {
  const last = data.requests.at(-1);
  const modelState = record3(last?.modelState) ? last.modelState : {};
  const values = [data.creationDate, data.lastMessageDate, last?.timestamp, last?.responseTimestamp, modelState.completedAt].filter(v => typeof v === "number" && Number.isFinite(v) && v > 0);
  return values.length ? Math.max(...values) : fallback;
}
function chatHistorySignature(data, omitLast = false) {
  const rows = Array.isArray(data?.requests) ? data.requests : [];
  return JSON.stringify((omitLast ? rows.slice(0, -1) : rows).map(r => ({
    id: r.requestId,
    message: r.message,
    response: r.response,
    result: r.result
  })));
}
var WorkspaceHubStore = class {
  constructor(root, windowId, workspace13, now = Date.now) {
    this.windowId = windowId;
    this.workspace = workspace13;
    this.now = now;
    if (!safeWindowId(windowId) || !validHubWorkspace(workspace13)) throw new Error("Invalid workspace hub identity.");
    this.root = import_node_path19.default.resolve(root);
    this.namespace = digest(this.root);
  }
  windowId;
  workspace;
  now;
  root;
  namespace;
  closing = false;
  generations = /* @__PURE__ */new Map();
  summaryCache = /* @__PURE__ */new Map();
  async initialize() {
    for (const folder of [this.root, ...["windows", "chats", "requests"].map(p => import_node_path19.default.join(this.root, p))]) await fs3.mkdir(folder, {
      recursive: true,
      mode: 448
    });
  }
  file(area, key) {
    if (!(safeKey(key) || safeWindowId(key))) throw new Error("Invalid hub record key.");
    return import_node_path19.default.join(this.root, area, `${key}.json`);
  }
  async readJson(file) {
    try {
      const stat7 = await fs3.lstat(file);
      if (!stat7.isFile() || stat7.isSymbolicLink() || stat7.size > HUB_MAX_CHAT_BYTES + 64 * 1024) throw new Error("Invalid shared record file.");
      return JSON.parse(await fs3.readFile(file, "utf8"));
    } catch (e) {
      if (missing(e)) return void 0;
      throw e;
    }
  }
  async atomic(file, value) {
    if (this.closing) throw new Error("Workspace hub is closing.");
    const temporary = `${file}.${(0, import_node_crypto14.randomUUID)()}.tmp`;
    try {
      const handle = await fs3.open(temporary, "wx", 384);
      try {
        await handle.writeFile(JSON.stringify(value));
        await handle.sync();
      } finally {
        await handle.close();
      }
      if (this.closing) throw new Error("Workspace hub is closing.");
      await fs3.rename(temporary, file);
    } finally {
      await fs3.unlink(temporary).catch(() => {});
    }
  }
  async transaction(key, fn) {
    let release;
    for (let attempt = 0; attempt < 40; attempt++) {
      try {
        release = await acquireBridgeTunnelLease([`chat-write:${this.namespace}:${key}`], busy);
        break;
      } catch (e) {
        if (!(e instanceof Error) || e.message !== busy) throw e;
        await new Promise(resolve => setTimeout(resolve, 25));
      }
    }
    if (!release) throw new Error("\u5171\u4EAB\u804A\u5929\u6B63\u5728\u4FDD\u5B58\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002");
    try {
      if (this.closing) throw new Error("Workspace hub is closing.");
      return await fn();
    } finally {
      await release();
    }
  }
  async publishWindow(value) {
    if (value.windowId !== this.windowId || value.workspace.id !== this.workspace.id) throw new Error("Window ownership mismatch.");
    const safe = {
      version: 1,
      windowId: this.windowId,
      workspace: this.workspace,
      updatedAt: this.now(),
      bridge: {
        state: value.bridge.state,
        provider: value.bridge.provider,
        domain: value.bridge.domain,
        localPort: value.bridge.localPort,
        connected: value.bridge.connected,
        todos: value.bridge.todos.slice(0, 24).map(t => ({
          id: t.id,
          title: t.title.replace(/\/mcp\/[a-f0-9]{32}/gi, "/mcp/\u2022\u2022\u2022\u2022").slice(0, 400),
          status: t.status
        }))
      },
      activeChats: [...this.generations.keys()],
      syncError: value.syncError,
      // Multi-instance registry fields (informational; never trusted for authority).
      instanceId: typeof value.instanceId === "string" ? value.instanceId.slice(0, 64) : void 0,
      userDataDir: typeof value.userDataDir === "string" ? value.userDataDir.slice(0, 4096) : void 0,
      pid: Number.isSafeInteger(value.pid) && value.pid > 0 ? value.pid : void 0
    };
    await this.atomic(this.file("windows", this.windowId), safe);
  }
  async listWindows() {
    const entries = await fs3.readdir(import_node_path19.default.join(this.root, "windows"));
    const values = await Promise.all(entries.filter(n => /^[a-f0-9-]{36}\.json$/.test(n)).map(async n => {
      try {
        const v = await this.readJson(import_node_path19.default.join(this.root, "windows", n));
        if (!record3(v) || v.version !== 1 || v.windowId !== n.slice(0, -5) || !validHubWorkspace(v.workspace) || !record3(v.bridge) || !["running", "stopped", "starting", "error"].includes(String(v.bridge.state)) || typeof v.bridge.domain !== "string" || v.bridge.domain.length > 253 || !Array.isArray(v.bridge.todos) || !Array.isArray(v.activeChats) || v.activeChats.some(k => typeof k !== "string" || !safeKey(k)) || typeof v.updatedAt !== "number" || this.now() - v.updatedAt > HUB_WINDOW_TTL_MS || v.updatedAt > this.now() + 5e3) return void 0;
        if (v.instanceId !== void 0 && typeof v.instanceId !== "string" || v.userDataDir !== void 0 && typeof v.userDataDir !== "string" || v.pid !== void 0 && !Number.isSafeInteger(v.pid)) return void 0;
        return v;
      } catch {
        return void 0;
      }
    }));
    return values.filter(v => !!v);
  }
  async readChat(key) {
    const v = await this.readJson(this.file("chats", key));
    if (v === void 0) return void 0;
    if (!record3(v) || v.version !== 1 || !validHubWorkspace(v.workspace) || typeof v.sessionResource !== "string" || v.key !== key || hubChatKey(v.workspace.id, v.sessionResource) !== key || typeof v.revision !== "number" || typeof v.ownerWindowId !== "string" || !v.deleted && !record3(v.data)) throw new Error("Invalid shared chat record.");
    return v;
  }
  async listChats(windows) {
    const live = new Map((windows ?? (await this.listWindows())).map(w => [w.windowId, w]));
    const names = (await fs3.readdir(import_node_path19.default.join(this.root, "chats"))).filter(n => /^[a-f0-9]{64}\.json$/.test(n));
    const result = [];
    for (const name of names) {
      const key = name.slice(0, -5);
      try {
        const stat7 = await fs3.stat(this.file("chats", key));
        let cached2 = this.summaryCache.get(key);
        if (!cached2 || cached2.mtime !== stat7.mtimeMs || cached2.ctime !== stat7.ctimeMs || cached2.ino !== stat7.ino || cached2.size !== stat7.size) {
          const value = await this.readChat(key);
          if (!value || value.deleted) {
            this.summaryCache.delete(key);
            continue;
          }
          const {
            data: _data,
            ...metadata
          } = value;
          cached2 = {
            mtime: stat7.mtimeMs,
            ctime: stat7.ctimeMs,
            ino: stat7.ino,
            size: stat7.size,
            value: {
              ...metadata,
              status: "idle"
            }
          };
          this.summaryCache.set(key, cached2);
        }
        const owner = live.get(cached2.value.ownerWindowId);
        const running = !!owner?.activeChats.includes(key);
        result.push({
          ...cached2.value,
          status: running ? "running" : cached2.value.active ? "interrupted" : "idle"
        });
      } catch {}
    }
    for (const key of this.summaryCache.keys()) if (!names.includes(`${key}.json`)) this.summaryCache.delete(key);
    return result.sort((a, b) => b.lastMessageAt - a.lastMessageAt);
  }
  makeChat(frame2, data, previous) {
    const key = hubChatKey(this.workspace.id, frame2.sessionResource);
    return {
      version: 1,
      key,
      workspace: this.workspace,
      sessionId: frame2.sessionId,
      sessionResource: frame2.sessionResource,
      ownerWindowId: this.windowId,
      revision: (previous?.revision ?? 0) + 1,
      sourceSequence: frame2.sequence,
      generation: this.generations.get(key)?.id ?? frame2.generation,
      active: this.generations.has(key),
      deleted: false,
      updatedAt: this.now(),
      lastMessageAt: messageTime(data, this.now()),
      title: titleOf(data),
      data
    };
  }
  async publishChat(frame2, importing = false) {
    const data = parseFrame(frame2),
      key = hubChatKey(this.workspace.id, frame2.sessionResource);
    return this.transaction(key, async () => {
      const previous = await this.readChat(key);
      if (previous?.deleted || importing && previous) return false;
      if (previous && (previous.ownerWindowId !== this.windowId || frame2.sequence <= previous.sourceSequence || previous.generation && frame2.generation !== previous.generation)) return false;
      await this.atomic(this.file("chats", key), this.makeChat(frame2, data, previous));
      return true;
    });
  }
  async beginGeneration(frame2) {
    const data = parseFrame(frame2),
      key = hubChatKey(this.workspace.id, frame2.sessionResource);
    if (this.generations.has(key)) throw new Error("\u8FD9\u4E2A\u804A\u5929\u4ECD\u5728\u751F\u6210\uFF0C\u8BF7\u7B49\u5F85\u5B8C\u6210\u540E\u518D\u7EE7\u7EED\u3002");
    const release = await acquireBridgeTunnelLease([`chat-generation:${this.namespace}:${key}`], "\u53E6\u4E00\u4E2A\u7A97\u53E3\u6B63\u5728\u751F\u6210\u8FD9\u4E2A\u804A\u5929\uFF0C\u5F53\u524D\u7A97\u53E3\u53EA\u53EF\u67E5\u770B\u3002");
    try {
      return await this.transaction(key, async () => {
        const previous = await this.readChat(key);
        if (previous?.deleted) throw new Error("\u8FD9\u6761\u5171\u4EAB\u8BB0\u5F55\u5DF2\u5220\u9664\uFF0C\u8BF7\u65B0\u5EFA\u804A\u5929\u3002");
        if (previous && previous.ownerWindowId !== this.windowId) {
          const live = (await this.listWindows()).some(w => w.windowId === previous.ownerWindowId);
          if (live) throw new Error("\u8FD9\u4E2A\u804A\u5929\u5C5E\u4E8E\u53E6\u4E00\u4E2A\u7A97\u53E3\uFF0C\u8BF7\u4ECE\u201C\u5171\u4EAB\u804A\u5929\u201D\u8FDB\u5165\u539F\u7A97\u53E3\u7EE7\u7EED\u3002");
          if (chatHistorySignature(previous.data) !== chatHistorySignature(data, true)) throw new Error("\u5F53\u524D\u7A97\u53E3\u7684\u8BB0\u5F55\u5DF2\u8FC7\u671F\uFF0C\u8BF7\u4ECE\u201C\u5171\u4EAB\u804A\u5929\u201D\u6062\u590D\u6700\u65B0\u8BB0\u5F55\u540E\u7EE7\u7EED\u3002");
        }
        const id = (0, import_node_crypto14.randomUUID)();
        this.generations.set(key, {
          id,
          release
        });
        await this.atomic(this.file("chats", key), this.makeChat({
          ...frame2,
          generation: id
        }, data, previous));
        return id;
      });
    } catch (e) {
      this.generations.delete(key);
      await release();
      throw e;
    }
  }
  async finishGeneration(frame2) {
    const key = hubChatKey(this.workspace.id, frame2.sessionResource),
      owned = this.generations.get(key);
    if (!owned || owned.id !== frame2.generation) return;
    try {
      const data = parseFrame(frame2);
      await this.transaction(key, async () => {
        const previous = await this.readChat(key);
        if (!previous || previous.deleted || previous.ownerWindowId !== this.windowId || previous.generation !== owned.id) return;
        const value = frame2.sequence >= previous.sourceSequence ? this.makeChat(frame2, data, previous) : {
          ...previous,
          updatedAt: this.now(),
          revision: previous.revision + 1
        };
        value.active = false;
        await this.atomic(this.file("chats", key), value);
      });
    } finally {
      if (this.generations.get(key) === owned) this.generations.delete(key);
      await owned.release();
    }
  }
  async prepareContinuation(key) {
    const release = await acquireBridgeTunnelLease([`chat-generation:${this.namespace}:${key}`], "\u804A\u5929\u4ECD\u5728\u751F\u6210\uFF0C\u4E0D\u80FD\u4ECE\u53E6\u4E00\u4E2A\u7A97\u53E3\u7EE7\u7EED\u3002");
    try {
      return await this.transaction(key, async () => {
        const value = await this.readChat(key);
        if (!value || value.deleted || value.workspace.id !== this.workspace.id) throw new Error("\u5FC5\u987B\u5728\u5BF9\u8BDD\u6240\u5C5E\u7684\u5DE5\u4F5C\u533A\u7EE7\u7EED\uFF0C\u4E0D\u80FD\u5728\u5F53\u524D\u9879\u76EE\u6267\u884C\u3002");
        if (value.ownerWindowId !== this.windowId && (await this.listWindows()).some(w => w.windowId === value.ownerWindowId)) throw new Error("\u8BF7\u5728\u62E5\u6709\u6B64\u804A\u5929\u7684\u7A97\u53E3\u7EE7\u7EED\u3002");
        if (value.ownerWindowId !== this.windowId) {
          value.ownerWindowId = this.windowId;
          value.sourceSequence = 0;
          value.generation = void 0;
        }
        value.active = false;
        value.updatedAt = this.now();
        value.revision++;
        await this.atomic(this.file("chats", key), value);
        return value;
      });
    } finally {
      await release();
    }
  }
  async deleteChat(sessionResource) {
    const key = hubChatKey(this.workspace.id, sessionResource);
    const release = this.generations.has(key) ? void 0 : await acquireBridgeTunnelLease([`chat-generation:${this.namespace}:${key}`], "\u8BF7\u5148\u5728\u539F\u7A97\u53E3\u505C\u6B62\u751F\u6210\uFF0C\u518D\u5220\u9664\u5171\u4EAB\u8BB0\u5F55\u3002");
    try {
      await this.transaction(key, async () => {
        const value = await this.readChat(key);
        if (!value) return;
        await this.atomic(this.file("chats", key), {
          ...value,
          deleted: true,
          active: false,
          data: null,
          title: "",
          updatedAt: this.now(),
          revision: value.revision + 1
        });
      });
    } finally {
      await release?.();
    }
  }
  /** Tombstone one record by its key, whatever workspace it belongs to. Used by
   * the management UI (after an explicit user confirmation) and by the
   * superseded-record sweep. The native service path keeps using the
   * workspace-scoped `deleteChat`.
   */
  async deleteChatByKey(key) {
    if (!safeKey(key)) throw new Error("Invalid chat key.");
    const release = this.generations.has(key) ? void 0 : await acquireBridgeTunnelLease([`chat-generation:${this.namespace}:${key}`], "\u8BF7\u5148\u5728\u539F\u7A97\u53E3\u505C\u6B62\u751F\u6210\uFF0C\u518D\u5220\u9664\u5171\u4EAB\u8BB0\u5F55\u3002");
    try {
      await this.transaction(key, async () => {
        const value = await this.readChat(key);
        if (!value || value.deleted) return;
        await this.atomic(this.file("chats", key), {
          ...value,
          deleted: true,
          active: false,
          data: null,
          title: "",
          updatedAt: this.now(),
          revision: value.revision + 1
        });
      });
    } finally {
      await release?.();
    }
  }
  /** One-time-per-startup migration: early hub builds keyed records by a
   * per-window workspace id, so one native session could leave several
   * records behind (one per window incarnation). Native session ids are
   * unique, so records sharing a sessionResource are the same conversation:
   * keep the newest, tombstone the rest. Idempotent and safe to run on every
   * window start; records that are still generating are skipped.
   */
  async sweepSupersededChatRecords() {
    const chats = await this.listChats();
    const byResource = /* @__PURE__ */new Map();
    for (const chat4 of chats) {
      const rows = byResource.get(chat4.sessionResource) ?? [];
      rows.push(chat4);
      byResource.set(chat4.sessionResource, rows);
    }
    let swept = 0;
    for (const rows of byResource.values()) {
      if (rows.length < 2) continue;
      const ordered = [...rows].sort((a, b) => b.updatedAt - a.updatedAt || b.revision - a.revision);
      for (const loser of ordered.slice(1)) {
        try {
          await this.deleteChatByKey(loser.key);
          swept++;
        } catch {}
      }
    }
    return swept;
  }
  async requestContinuation(chat4, targetWindowId) {
    const request = {
      version: 1,
      id: (0, import_node_crypto14.randomUUID)(),
      kind: "continue",
      chatKey: chat4.key,
      workspaceId: chat4.workspace.id,
      targetWindowId,
      createdAt: this.now()
    };
    await this.atomic(this.file("requests", request.id), request);
  }
  /** Multi-instance: ask one live window (possibly in another process) to act. */
  async requestWindowAction(target, kind) {
    const request = {
      version: 1,
      id: (0, import_node_crypto14.randomUUID)(),
      kind,
      chatKey: "",
      workspaceId: target.workspace.id,
      targetWindowId: target.windowId,
      createdAt: this.now()
    };
    await this.atomic(this.file("requests", request.id), request);
  }
  async consumeRequests(open6, act) {
    for (const name of await fs3.readdir(import_node_path19.default.join(this.root, "requests"))) {
      if (!/^[a-f0-9-]{36}\.json$/.test(name)) continue;
      const file = import_node_path19.default.join(this.root, "requests", name);
      let request;
      try {
        request = await this.readJson(file);
      } catch {
        continue;
      }
      if (!request || request.version !== 1 || request.workspaceId !== this.workspace.id || request.targetWindowId && request.targetWindowId !== this.windowId) continue;
      const kind = request.kind ?? "continue";
      if (kind === "continue" ? !safeKey(request.chatKey) : !((kind === "focus" || kind === "copy-address") && request.targetWindowId === this.windowId)) continue;
      if (!Number.isFinite(request.createdAt) || this.now() - request.createdAt > HUB_REQUEST_TTL_MS || request.createdAt > this.now() + 5e3) {
        await fs3.unlink(file).catch(() => {});
        continue;
      }
      const claimed = `${file}.${this.windowId}.claimed`;
      try {
        await fs3.rename(file, claimed);
      } catch (e) {
        if (missing(e)) continue;
        throw e;
      }
      try {
        if (kind === "continue") await open6(request.chatKey);else await act?.(kind);
      } finally {
        await fs3.unlink(claimed).catch(() => {});
      }
    }
  }
  async dispose() {
    this.closing = true;
    const owned = [...this.generations.values()];
    this.generations.clear();
    await Promise.all(owned.map(v => v.release().catch(() => {})));
    await fs3.unlink(this.file("windows", this.windowId)).catch(() => {});
  }
};

// extensions/shuncode/src/instance-launcher.ts
export { import_node_crypto14, fs3, import_node_path19, digest, safeKey, safeWindowId, busy, missing, record3, hubChatKey, validHubWorkspace, parseFrame, titleOf, messageTime, chatHistorySignature, WorkspaceHubStore };
