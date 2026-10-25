// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { __toESM } from "../../../runtime/helpers.mjs";
import { init_define_SHUNCODE_BUILD_INFO } from "../../../runtime/build-info.mjs";
import { WorkspaceHubStore, hubChatKey } from "./workspace-hub-store.mjs";
import { applicationBundleOf, applicationExecutableOf, devExecutableOverride, instanceIdentity, launchInstance, nextUserDataDirectory, seedInstanceSettings, userDataDirectoryOf } from "./instance-launcher.mjs";
// extensions/shuncode/src/workspace-hub.ts
init_define_SHUNCODE_BUILD_INFO();
var import_node_crypto16 = require("node:crypto");
var import_promises8 = require("node:fs/promises");
var import_node_os5 = __toESM(require("node:os"));
var import_node_path21 = __toESM(require("node:path"));
var vscode15 = __toESM(require("vscode"));

// extensions/shuncode/src/workspace-hub-store.ts

// extensions/shuncode/src/workspace-hub.ts
function workspaceHubRoot(env6 = process.env, home = import_node_os5.default.homedir()) {
  const explicit = env6.SHUNCODE_SHARED_DATA_HOME?.trim();
  if (explicit) return import_node_path21.default.join(import_node_path21.default.resolve(explicit), "workspace-hub");
  const portable = env6.VSCODE_PORTABLE?.trim();
  if (portable) return import_node_path21.default.join(import_node_path21.default.resolve(portable), "shared-data", "workspace-hub");
  return import_node_path21.default.join(home, ".shuncode-shared", "workspace-hub");
}
function workspaceStorageIdentity(storageUri) {
  const segments = storageUri.path.split("/").filter(Boolean);
  const workspaceId = segments.at(-2);
  if (segments.length >= 3 && segments.at(-3) === "workspaceStorage" && workspaceId) return workspaceId;
  return storageUri.toString();
}
function hubWorkspaceId(storageUri) {
  if (!storageUri) return "empty";
  return (0, import_node_crypto16.createHash)("sha256").update(`shuncode-hub-workspace-v1::${workspaceStorageIdentity(storageUri)}`).digest("hex");
}
function currentWorkspace(context) {
  const folders = vscode15.workspace.workspaceFolders ?? [];
  const file = vscode15.workspace.workspaceFile;
  const uri = file?.scheme === "file" ? file : folders.length === 1 && folders[0].uri.scheme === "file" ? folders[0].uri : void 0;
  return {
    id: hubWorkspaceId(context.storageUri),
    name: vscode15.workspace.name ?? "\u672A\u6253\u5F00\u9879\u76EE",
    uri: uri?.toString(),
    kind: uri ? file ? "workspace" : "folder" : "empty",
    folders: folders.map(f => f.uri.toString())
  };
}
function frame(value) {
  if (!value || typeof value !== "object") throw new Error("Invalid chat sync frame.");
  return value;
}
var WorkspaceHubController = class {
  constructor(context, bridge, output) {
    this.context = context;
    this.bridge = bridge;
    this.output = output;
    this.userDataDir = userDataDirectoryOf(context.globalStorageUri.fsPath);
    this.instanceId = instanceIdentity(this.userDataDir);
    this.store = new WorkspaceHubStore(workspaceHubRoot(), (0, import_node_crypto16.randomUUID)(), currentWorkspace(context));
    this.ready = this.store.initialize();
    const register2 = (name, callback) => this.subscriptions.push(vscode15.commands.registerCommand(`shuncode.workspaceHub.${name}`, callback));
    register2("open", () => this.open());
    register2("openChats", () => this.open("chats"));
    register2("snapshot", () => this.snapshot());
    register2("beginChat", async value => {
      await this.ensure();
      const id = await this.store.beginGeneration(frame(value));
      await this.publishWindow().catch(e => this.output.appendLine(`[workspace-hub] heartbeat: ${String(e)}`));
      return id;
    });
    register2("publishChat", async (value, importing = false) => {
      await this.ensure();
      try {
        const result = await this.store.publishChat(frame(value), importing === true);
        this.syncError = void 0;
        return result;
      } catch (e) {
        this.syncError = "\u5171\u4EAB\u8BB0\u5F55\u540C\u6B65\u5931\u8D25\uFF0C\u8BF7\u67E5\u770B\u672C\u7A97\u53E3 ShunCode \u65E5\u5FD7\u3002";
        throw e;
      }
    });
    register2("finishChat", async value => {
      await this.ready;
      await this.store.finishGeneration(frame(value));
      await this.publishWindow();
    });
    register2("deleteChat", async resource => {
      await this.ensure();
      if (typeof resource !== "string") throw new Error("Invalid session resource.");
      await this.store.deleteChat(resource);
    });
    register2("prepareContinuation", async key => {
      await this.ensure();
      if (typeof key !== "string") throw new Error("Invalid chat key.");
      const before = await this.store.readChat(key);
      const chat4 = await this.store.prepareContinuation(key);
      return {
        key,
        wasOwner: before?.ownerWindowId === this.store.windowId,
        workspace: chat4.workspace,
        sessionResource: chat4.sessionResource,
        data: chat4.data
      };
    });
    register2("importedKeys", async () => {
      await this.ensure();
      return (await this.store.listChats()).filter(c => c.workspace.id === this.store.workspace.id).map(c => c.key);
    });
    register2("chatKey", resource => hubChatKey(this.store.workspace.id, resource));
    register2("readChat", async key => {
      await this.ensure();
      return this.store.readChat(key);
    });
    this.subscriptions.push(vscode15.commands.registerCommand("shuncode.openNewInstance", args => this.openNewInstance(args)));
    this.ready.then(() => {
      if (this.disposed) return;
      void this.sweepSupersededRecords();
      void this.refresh();
      void Promise.resolve(vscode15.commands.executeCommand("shuncode.chat.ensureSharedSync")).catch(() => {
        this.syncError = "\u804A\u5929\u540C\u6B65\u7EC4\u4EF6\u672A\u52A0\u8F7D\uFF0C\u8BF7\u4F7F\u7528\u5305\u542B\u672C\u529F\u80FD\u7684\u5B8C\u6574 ShunCode \u6784\u5EFA\u3002";
      });
      this.timer = setInterval(() => {
        void this.refresh();
      }, 1e3);
      this.timer.unref();
    }, e => this.output.appendLine(`[workspace-hub] initialization failed: ${String(e)}`));
  }
  context;
  bridge;
  output;
  store;
  userDataDir;
  instanceId;
  ready;
  subscriptions = [];
  timer;
  ticking;
  panel;
  disposed = false;
  syncError;
  selectedChat;
  desiredTab = "workspaces";
  lastPanelSnapshot = "";
  lastPanelChatRevision = "";
  async ensure() {
    await this.ready;
    if (this.disposed) throw new Error("Workspace hub is closed.");
    if (currentWorkspace(this.context).id !== this.store.workspace.id) throw new Error("\u5DE5\u4F5C\u533A\u5DF2\u53D8\u5316\uFF0C\u8BF7\u91CD\u65B0\u52A0\u8F7D\u7A97\u53E3\u540E\u4F7F\u7528\u5171\u4EAB\u804A\u5929\u3002");
  }
  /** Tombstone duplicate records left by the old per-window workspace identity.
   * Idempotent; records that are still generating are skipped and retried on a
   * later start.
   */
  async sweepSupersededRecords() {
    try {
      await this.ensure();
      const swept = await this.store.sweepSupersededChatRecords();
      if (swept > 0) this.output.appendLine(`[workspace-hub] removed ${swept} superseded shared chat record(s) from the previous workspace identity.`);
    } catch (e) {
      this.output.appendLine(`[workspace-hub] migration sweep skipped: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  async publishWindow() {
    if (this.disposed) return;
    await this.ensure();
    const status = this.bridge.getStatus();
    const value = {
      version: 1,
      windowId: this.store.windowId,
      workspace: this.store.workspace,
      updatedAt: Date.now(),
      bridge: {
        state: status.state,
        provider: status.tunnelProvider,
        domain: status.domain,
        localPort: status.localPort,
        connected: status.connected,
        todos: status.todos
      },
      activeChats: [],
      syncError: this.syncError,
      instanceId: this.instanceId,
      userDataDir: this.userDataDir,
      pid: process.pid
    };
    await this.store.publishWindow(value);
  }
  async snapshot() {
    await this.ensure();
    const windows = await this.store.listWindows();
    const ownPublicUrl = this.bridge.getStatus().publicUrl ?? "";
    return {
      currentWindowId: this.store.windowId,
      currentInstanceId: this.instanceId,
      workspaceId: this.store.workspace.id,
      dataFolder: this.store.root,
      ownPublicUrl,
      syncEnabled: vscode15.workspace.getConfiguration("shuncode").get("chat.sharedHistory", true),
      windows,
      chats: await this.store.listChats(windows)
    };
  }
  refresh() {
    if (this.ticking || this.disposed) return this.ticking ?? Promise.resolve();
    this.ticking = (async () => {
      await this.publishWindow();
      await this.store.consumeRequests(async key => {
        await vscode15.commands.executeCommand("shuncode.chat.openSharedSession", key);
      }, async kind => {
        if (kind === "copy-address") {
          await this.copyOwnAddress();
          return;
        }
        await vscode15.commands.executeCommand("shuncode.chat.focusWindow");
      });
      if (this.panel) {
        const snapshot = await this.snapshot();
        const stable = JSON.stringify(snapshot, (key, value) => key === "updatedAt" ? void 0 : value);
        if (stable !== this.lastPanelSnapshot) {
          this.lastPanelSnapshot = stable;
          await this.panel.webview.postMessage({
            type: "snapshot",
            value: snapshot
          });
        }
        if (this.selectedChat) {
          const key = this.selectedChat;
          const value = await this.store.readChat(key);
          if (key !== this.selectedChat) return;
          const revision = `${key}:${value?.revision ?? "missing"}:${value?.deleted}`;
          if (revision !== this.lastPanelChatRevision) {
            this.lastPanelChatRevision = revision;
            await this.panel.webview.postMessage({
              type: "chat",
              key,
              value: value?.deleted ? void 0 : value
            });
          }
        }
      }
    })().catch(e => {
      this.output.appendLine(`[workspace-hub] ${String(e)}`);
    }).finally(() => {
      this.ticking = void 0;
    });
    return this.ticking;
  }
  /** The route token lives in the owning window's Bridge state. Only the
   * owning window itself can copy its full address, so a copy for any other
   * window is delegated to it through a hub request; the token is never
   * re-derived from SecretStorage here and never crosses windows.
   */
  async copyAddress(windowId) {
    const item = (await this.store.listWindows()).find(w => w.windowId === windowId);
    if (!item || item.bridge.state !== "running" || !item.bridge.domain) throw new Error("\u6B64\u7A97\u53E3\u6CA1\u6709\u53EF\u7528\u7684 Bridge \u5730\u5740\u3002");
    if (item.windowId === this.store.windowId) return this.copyOwnPublicUrl();
    await this.store.requestWindowAction(item, "copy-address");
    return "\u5DF2\u8BF7\u6C42\u6240\u5C5E\u7A97\u53E3\u590D\u5236\u5730\u5740\uFF1B\u8BE5\u7A97\u53E3\u4F1A\u628A\u5B8C\u6574\u5730\u5740\u5199\u5165\u526A\u8D34\u677F\u3002";
  }
  async copyOwnPublicUrl() {
    const status = this.bridge.getStatus();
    if (status.state !== "running" || !status.publicUrl) throw new Error("\u672C\u7A97\u53E3\u7684 Bridge \u672A\u8FD0\u884C\u3002");
    await vscode15.env.clipboard.writeText(status.publicUrl);
    return "\u5DF2\u590D\u5236\u5B8C\u6574\u5730\u5740\uFF0C\u8BF7\u50CF\u5BC6\u7801\u4E00\u6837\u4FDD\u7BA1\u3002";
  }
  async copyOwnAddress() {
    await this.copyOwnPublicUrl();
    void vscode15.window.showInformationMessage("\u5DF2\u6309\u5176\u4ED6 ShunCode \u7A97\u53E3\u7684\u8BF7\u6C42\u590D\u5236\u672C\u5DE5\u4F5C\u533A\u7684 Bridge \u5730\u5740\uFF0C\u8BF7\u50CF\u5BC6\u7801\u4E00\u6837\u4FDD\u7BA1\u3002");
  }
  /** Last hop of continuation: no live window owns the workspace, so
   * a new independent instance is launched for that folder and the request is
   * left for whichever window of that workspace appears within the request TTL.
   */
  async continueChat(key) {
    if (!vscode15.workspace.getConfiguration("shuncode").get("chat.sharedHistory", true)) throw new Error("\u5171\u4EAB\u804A\u5929\u540C\u6B65\u5DF2\u5173\u95ED\uFF0C\u8BF7\u542F\u7528\u5E76\u91CD\u65B0\u52A0\u8F7D\u7A97\u53E3\u540E\u7EE7\u7EED\u3002");
    const chat4 = await this.store.readChat(key);
    if (!chat4 || chat4.deleted) throw new Error("\u5171\u4EAB\u8BB0\u5F55\u4E0D\u5B58\u5728\u6216\u5DF2\u5220\u9664\u3002");
    const windows = await this.store.listWindows(),
      owner = windows.find(w => w.windowId === chat4.ownerWindowId);
    if (owner?.activeChats.includes(key)) throw new Error("\u539F\u7A97\u53E3\u4ECD\u5728\u751F\u6210\uFF1B\u5176\u4ED6\u7A97\u53E3\u53EF\u4EE5\u540C\u6B65\u67E5\u770B\uFF0C\u5B8C\u6210\u540E\u518D\u7EE7\u7EED\u3002");
    if (owner?.windowId === this.store.windowId || !owner && chat4.workspace.id === this.store.workspace.id) {
      await vscode15.commands.executeCommand("shuncode.chat.openSharedSession", key);
      return;
    }
    if (owner) {
      await this.store.requestContinuation(chat4, owner.windowId);
      return;
    }
    const existingWorkspace = windows.find(w => w.workspace.id === chat4.workspace.id);
    if (existingWorkspace) {
      await this.store.requestContinuation(chat4, existingWorkspace.windowId);
      return;
    }
    if (chat4.workspace.uri) {
      await this.store.requestContinuation(chat4);
      const target = chat4.workspace.kind === "workspace" ? {
        fileUri: chat4.workspace.uri
      } : {
        folderUri: chat4.workspace.uri
      };
      await this.openNewInstance(target);
    } else if (chat4.workspace.id === "empty") {
      await this.store.requestContinuation(chat4);
      await vscode15.commands.executeCommand("workbench.action.newWindow");
    } else throw new Error("\u539F\u5BF9\u8BDD\u6765\u81EA\u672A\u4FDD\u5B58\u7684\u591A\u6839\u5DE5\u4F5C\u533A\u3002\u8BF7\u5148\u6253\u5F00\u539F\u5DE5\u4F5C\u533A\u518D\u7EE7\u7EED\uFF0C\u4E0D\u80FD\u6539\u5728\u5F53\u524D\u9879\u76EE\u6267\u884C\u3002");
  }
  /** `shuncode.openNewInstance`: a separate ShunCode process with its own
   * `--user-data-dir`. Live instances are read from the hub window registry.
   */
  async openNewInstance(args) {
    await this.ready;
    const live = (await this.store.listWindows()).map(w => w.userDataDir).filter(v => typeof v === "string");
    const {
      directory,
      ordinal
    } = nextUserDataDirectory(this.userDataDir, live);
    const asString3 = value => value instanceof vscode15.Uri ? value.toString() : typeof value === "string" ? value : void 0;
    const folderUri = asString3(args?.folderUri),
      fileUri = asString3(args?.fileUri);
    if (folderUri && fileUri) throw new Error("\u4E0D\u80FD\u540C\u65F6\u5728\u65B0\u5B9E\u4F8B\u4E2D\u6253\u5F00\u6587\u4EF6\u5939\u548C\u6587\u4EF6\u3002");
    if (folderUri && !/^file:\/\//.test(folderUri)) throw new Error("\u53EA\u80FD\u5728\u65B0\u5B9E\u4F8B\u4E2D\u6253\u5F00\u672C\u5730\u6587\u4EF6\u5939\u3002");
    if (fileUri && !/^file:\/\//.test(fileUri)) throw new Error("\u53EA\u80FD\u5728\u65B0\u5B9E\u4F8B\u4E2D\u6253\u5F00\u672C\u5730\u6587\u4EF6\u3002");
    if (await seedInstanceSettings(directory, ordinal)) this.output.appendLine(`[workspace-hub] seeded ${directory} with Named Tunnel local port ${48271 + ordinal - 1}`);
    const environment = {};
    for (const key of ["SHUNCODE_SHARED_DATA_HOME", "VSCODE_PORTABLE", "SHUNCODE_AGENT_HOST_ENTRY", "VSCODE_DEV", "NODE_ENV"]) {
      const value = process.env[key];
      if (value) environment[key] = value;
    }
    const developmentAppRoot = process.env.VSCODE_DEV ? vscode15.env.appRoot : void 0;
    const target = folderUri ?? fileUri;
    const devExecutable = devExecutableOverride();
    if (devExecutable || process.platform === "win32") {
      const executable = devExecutable ?? applicationExecutableOf(process.execPath);
      if (!executable) throw new Error("\u65E0\u6CD5\u5B9A\u4F4D ShunCode \u53EF\u6267\u884C\u6587\u4EF6\uFF0C\u65E0\u6CD5\u65B0\u5F00\u5B9E\u4F8B\u3002");
      await launchInstance({
        executable,
        userDataDir: directory,
        ordinal,
        folderUri,
        fileUri,
        environment
      });
    } else {
      const bundle = applicationBundleOf(process.execPath);
      if (!bundle) throw new Error("\u65E0\u6CD5\u5B9A\u4F4D ShunCode.app\uFF0C\u65E0\u6CD5\u65B0\u5F00\u5B9E\u4F8B\u3002");
      await launchInstance({
        bundle,
        userDataDir: directory,
        ordinal,
        folderUri,
        fileUri,
        developmentAppRoot,
        environment
      });
    }
    this.output.appendLine(`[workspace-hub] launched instance ${instanceIdentity(directory)} (${directory})${target ? ` for ${target}` : ""}`);
    return directory;
  }
  async open(tab = "workspaces") {
    await this.ensure();
    this.desiredTab = tab;
    if (this.panel) {
      this.panel.reveal();
      await this.panel.webview.postMessage({
        type: "tab",
        value: tab
      });
      return;
    }
    const media = vscode15.Uri.joinPath(this.context.extensionUri, "media");
    const panel = this.panel = vscode15.window.createWebviewPanel("shuncode.workspaceHub", "\u5DE5\u4F5C\u533A\u4E0E\u5171\u4EAB\u804A\u5929", vscode15.ViewColumn.Active, {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [media]
    });
    const nonce = (0, import_node_crypto16.randomBytes)(18).toString("base64");
    const html = await (0, import_promises8.readFile)(vscode15.Uri.joinPath(media, "workspace-hub.html").fsPath, "utf8");
    panel.webview.html = html.replaceAll("{{cspSource}}", panel.webview.cspSource).replaceAll("{{nonce}}", nonce).replaceAll("{{scriptUri}}", panel.webview.asWebviewUri(vscode15.Uri.joinPath(media, "workspace-hub.js")).toString()).replaceAll("{{styleUri}}", panel.webview.asWebviewUri(vscode15.Uri.joinPath(media, "workspace-hub.css")).toString());
    panel.onDidDispose(() => {
      if (this.panel === panel) this.panel = void 0;
      this.selectedChat = void 0;
      this.lastPanelSnapshot = "";
      this.lastPanelChatRevision = "";
    });
    panel.webview.onDidReceiveMessage(async message => {
      try {
        await this.ensure();
        if (!message || typeof message.type !== "string") return;
        switch (message.type) {
          case "ready":
            this.lastPanelSnapshot = "";
            await panel.webview.postMessage({
              type: "tab",
              value: this.desiredTab
            });
            await this.refresh();
            break;
          case "selectChat":
            if (typeof message.key !== "string" || !/^[a-f0-9]{64}$/.test(message.key)) throw new Error("Invalid chat key.");
            this.selectedChat = message.key;
            this.lastPanelChatRevision = "";
            await this.refresh();
            break;
          case "continueChat":
            if (typeof message.key === "string") {
              await this.continueChat(message.key);
              await panel.webview.postMessage({
                type: "notice",
                text: "\u5DF2\u8BF7\u6C42\u5728\u6240\u5C5E\u5DE5\u4F5C\u533A\u6253\u5F00\uFF1B\u4E0D\u4F1A\u81EA\u52A8\u53D1\u9001\u6D88\u606F\u3002"
              });
            }
            break;
          case "deleteChat":
            {
              if (typeof message.key !== "string" || !/^[a-f0-9]{64}$/.test(message.key)) throw new Error("Invalid chat key.");
              const target = await this.store.readChat(message.key);
              if (!target || target.deleted) throw new Error("\u5171\u4EAB\u8BB0\u5F55\u4E0D\u5B58\u5728\u6216\u5DF2\u5220\u9664\u3002");
              const pick2 = await vscode15.window.showWarningMessage(`\u5220\u9664\u5171\u4EAB\u8BB0\u5F55\u300C${target.title || "\u672A\u547D\u540D"}\u300D\uFF08${target.workspace.name}\uFF09\uFF1F\u539F\u5DE5\u4F5C\u533A\u7684\u672C\u5730\u5386\u53F2\u4E0D\u53D7\u5F71\u54CD\u3002`, {
                modal: true
              }, "\u5220\u9664");
              if (pick2 !== "\u5220\u9664") break;
              await this.store.deleteChatByKey(message.key);
              if (this.selectedChat === message.key) {
                this.selectedChat = void 0;
                this.lastPanelChatRevision = "";
              }
              await panel.webview.postMessage({
                type: "notice",
                text: "\u5DF2\u5220\u9664\u5171\u4EAB\u8BB0\u5F55\u3002"
              });
              await this.refresh();
              break;
            }
          case "copyAddress":
            if (typeof message.windowId === "string") {
              const text = await this.copyAddress(message.windowId);
              await panel.webview.postMessage({
                type: "notice",
                text
              });
            }
            break;
          case "focusWindow":
            {
              const item = (await this.store.listWindows()).find(w => w.windowId === message.windowId);
              if (!item) throw new Error("\u8BE5\u7A97\u53E3\u5DF2\u4E0D\u5728\u7EBF\u3002");
              if (item.windowId === this.store.windowId) {
                await vscode15.commands.executeCommand("shuncode.chat.focusWindow");
                break;
              }
              await this.store.requestWindowAction(item, "focus");
              break;
            }
          case "openWorkspace":
            {
              const item = (await this.store.listWindows()).find(w => w.windowId === message.windowId);
              if (!item?.workspace.uri) throw new Error("\u8BF7\u5148\u4FDD\u5B58\u5DE5\u4F5C\u533A\uFF0C\u518D\u4ECE\u5176\u4ED6\u7A97\u53E3\u6253\u5F00\u3002");
              if (item.workspace.kind !== "folder" && item.workspace.kind !== "workspace") throw new Error("\u591A\u6839\u5DE5\u4F5C\u533A\u8BF7\u5728\u539F\u5B9E\u4F8B\u4E2D\u6253\u5F00\u3002");
              const target = item.workspace.kind === "workspace" ? {
                fileUri: item.workspace.uri
              } : {
                folderUri: item.workspace.uri
              };
              await this.openNewInstance(target);
              await panel.webview.postMessage({
                type: "notice",
                text: "\u6B63\u5728\u4EE5\u72EC\u7ACB\u5B9E\u4F8B\u6253\u5F00\u8BE5\u9879\u76EE\u3002"
              });
              break;
            }
          case "chooseWorkspace":
            {
              const selected = await vscode15.window.showOpenDialog({
                canSelectFolders: true,
                canSelectFiles: false,
                canSelectMany: false,
                openLabel: "\u5728\u65B0\u5B9E\u4F8B\u6253\u5F00"
              });
              if (selected?.[0]) {
                await this.openNewInstance({
                  folderUri: selected[0]
                });
                await panel.webview.postMessage({
                  type: "notice",
                  text: "\u5DF2\u5728\u72EC\u7ACB\u5B9E\u4F8B\u4E2D\u6253\u5F00\u8BE5\u9879\u76EE\u3002"
                });
              }
              break;
            }
          case "newInstance":
            await this.openNewInstance();
            await panel.webview.postMessage({
              type: "notice",
              text: "\u5DF2\u542F\u52A8\u65B0\u7684 ShunCode \u5B9E\u4F8B\u3002"
            });
            break;
          case "openDataFolder":
            await vscode15.commands.executeCommand("revealFileInOS", vscode15.Uri.file(this.store.root));
            break;
        }
      } catch (e) {
        await panel.webview.postMessage({
          type: "error",
          text: e instanceof Error ? e.message : String(e)
        });
      }
    });
    this.lastPanelSnapshot = "";
    await this.refresh();
  }
  async disposeAsync() {
    if (this.disposed) return;
    this.disposed = true;
    if (this.timer) clearInterval(this.timer);
    this.panel?.dispose();
    for (const item of this.subscriptions) item.dispose();
    await this.ready.catch(() => {});
    await this.ticking;
    await this.store.dispose();
  }
  dispose() {
    void this.disposeAsync().catch(e => this.output.appendLine(`[workspace-hub] shutdown: ${String(e)}`));
  }
};

// extensions/shuncode/src/extension.ts
export { import_node_crypto16, import_promises8, import_node_os5, import_node_path21, vscode15, workspaceHubRoot, workspaceStorageIdentity, hubWorkspaceId, currentWorkspace, frame, WorkspaceHubController };
