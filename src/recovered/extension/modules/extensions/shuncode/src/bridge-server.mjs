// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { __toESM } from "../../../runtime/helpers.mjs";
import { init_define_SHUNCODE_BUILD_INFO } from "../../../runtime/build-info.mjs";
import { fetchWithExtensionHostFallbacks, resolveExtensionHostProxy } from "./extension-host-proxy.mjs";
import { acquireBridgeTunnelLease, bridgeTunnelLeaseResources, clearTunnelOwnership, isBridgeTunnelLeaseConflict, reclaimStaleTunnelOwner, recordTunnelOwnership } from "./bridge-tunnel-lease.mjs";
import { createWindowsBridgeRouteIdentity } from "./bridge-route-token-storage.mjs";
import { CUSTOM_TOOLS_DIR_NAME } from "../../../src/custom-tool-contract.mjs";
import { migrateLegacySkillDirs } from "../../../src/custom-tool-migration.mjs";
import { diagnoseSkillTools } from "../../../src/custom-tool-skill.mjs";
import { customToolsFingerprint, listEnabledCustomTools, loadCustomTools, toStatusEntries } from "../../../src/custom-tools.mjs";
import { BRIDGE_SERVER_INSTRUCTIONS, BRIDGE_TOOL_CONCURRENCY_SETTING, BRIDGE_TOOL_DEFINITIONS, resolveBridgeToolConcurrency } from "./bridge-constants.mjs";
import { BridgeMcpTransport } from "./bridge-mcp-transport.mjs";
import { BridgeToolDispatcher } from "./bridge-tool-dispatcher.mjs";
import { deleteCustomTool, toggleCustomTool } from "../../../src/custom-tool-admin.mjs";
import { generateSkillRunner, importSkill } from "../../../src/custom-tool-skill-import.mjs";
// extensions/shuncode/src/bridge-server.ts
init_define_SHUNCODE_BUILD_INFO();

// extensions/shuncode/src/bridge-route-token-storage.ts

// extensions/shuncode/src/bridge-server.ts
var import_node_child_process7 = require("node:child_process");
var import_node_path14 = __toESM(require("node:path"));
var import_node_util2 = require("node:util");
var vscode3 = __toESM(require("vscode"));

// src/custom-tool-admin.ts

// extensions/shuncode/src/bridge-server.ts
var execFileAsync2 = (0, import_node_util2.promisify)(import_node_child_process7.execFile);
var NGROK_DOMAIN_SETTING = "bridge.ngrokDomain";
var NGROK_DOMAIN_STATE_KEY = "shuncode.bridge.ngrokDomain";
var CLOUDFLARE_NAMED_DOMAIN_SETTING = "bridge.cloudflareNamedDomain";
var CLOUDFLARE_NAMED_DOMAIN_STATE_KEY = "shuncode.bridge.cloudflareNamedDomain";
var CLOUDFLARE_NAMED_TOKEN_SECRET = "shuncode.bridge.cloudflareNamedTunnelToken";
var CLOUDFLARE_NAMED_LOCAL_PORT_SETTING = "bridge.cloudflareNamedLocalPort";
var TUNNEL_PROVIDER_SETTING = "bridge.tunnelProvider";
var CUSTOM_INSTRUCTIONS_SETTING = "bridge.customInstructions";
var BRIDGE_SKILLS_ENABLED_SETTING = "bridge.skillsEnabled";
var BRIDGE_WORKSPACE_SCOPE_SETTING = "bridge.workspaceScope";
var NGROK_USE_HTTP_PROXY_SETTING = "bridge.ngrokUseHttpProxy";
var DEFAULT_PUBLIC_HEALTH_STARTUP_TIMEOUT_MS = 2e4;
var PUBLIC_HEALTH_STARTUP_TIMEOUT_SETTING = "bridge.startupTimeoutMs";
var PUBLIC_HEALTH_REQUEST_TIMEOUT_MS = 5e3;
var PUBLIC_HEALTH_POLL_INTERVAL_MS = 750;
var PUBLIC_HEALTH_DETERMINISTIC_FAILURE_LIMIT = 3;
var TUNNEL_RESTART_BACKOFF_MS = [1e3, 2e3, 4e3, 8e3, 15e3];
var TUNNEL_TERMINATE_GRACE_MS = 1e3;
var TUNNEL_KILL_GRACE_MS = 1e3;
var NGROK_AGENT_API_BASE_URL = "http://127.0.0.1:4040";
var NGROK_AGENT_API_TIMEOUT_MS = 2e3;
var NGROK_ENDPOINT_ONLINE_RETRY_BACKOFF_MS = [5e3, 1e4, 15e3, 2e4, 3e4, 3e4, 3e4, 3e4];
var CLOUDFLARED_WINGET_PACKAGE = "Cloudflare.cloudflared";
var DEFAULT_CLOUDFLARE_NAMED_LOCAL_PORT = 48271;
function publicHealthFailure(error2) {
  const messages = [];
  const codes = [];
  let current = error2;
  for (let depth = 0; depth < 4 && current !== void 0 && current !== null; depth++) {
    if (typeof current === "object") {
      const record4 = current;
      if (typeof record4.code === "string") codes.push(record4.code);
      if (typeof record4.message === "string") messages.push(record4.message);
      current = record4.cause;
    } else {
      messages.push(String(current));
      current = void 0;
    }
  }
  const reason = messages.join(": ") || (error2 instanceof Error ? error2.message : String(error2));
  const detail = `${codes.join(",")} ${reason}`.toLowerCase();
  const deterministic = codes.some(code => code === "ENOTFOUND" || code === "EAI_AGAIN" || code === "ECONNREFUSED" || code === "ECONNRESET" || code === "EPIPE") || detail.includes("certificate") || detail.includes("self-signed") || detail.includes("tls") || detail.includes("ssl") || detail.includes("wrong version number");
  return {
    reason,
    code: codes.length ? codes[0] : void 0,
    deterministic
  };
}
function cloudflaredEdgeFailureHint(output) {
  const lower = output.toLowerCase();
  const blocked = ["unable to establish", "dial tcp", "connection refused", "connection reset", "no such host", "i/o timeout", "context deadline", "quic"].some(marker => lower.includes(marker));
  return blocked ? " This usually means cloudflared cannot reach the Cloudflare edge from this network. ShunCode passes a resolvable VS Code/system HTTP proxy to tunnel processes; if that still fails, verify the proxy supports tunnel traffic or use a system/global (TUN) proxy." : "";
}
function bridgeWorkspaceScopeInstructions(scope) {
  if (scope === "workspace") {
    return "Default operating scope: project files in the folder(s) currently open in ShunCode on this local Windows host. That is the default target, not a hard ban: inspect another local path on this same PC only when the user explicitly identifies it, usually with run_command for read-only discovery first. Do not scan the whole device by default. Workspace file tools remain workspace-scoped.";
  }
  return "Default operating scope: this entire local Windows device. Prioritize the folder(s) currently open in ShunCode whenever they are relevant, but you may inspect other local paths on this same PC without requiring the user to restate the workspace first. Locate the exact path before acting outside the workspace and prefer read-only discovery first when the target is uncertain. Workspace file tools remain workspace-scoped; use run_command for outside-workspace paths.";
}
function normalizeHttpsHostname(value, label) {
  const trimmed = value.trim();
  if (!trimmed) throw new Error(`${label} is required.`);
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  let url2;
  try {
    url2 = new URL(withScheme);
  } catch {
    throw new Error(`${label} is not a valid hostname.`);
  }
  if (url2.protocol !== "https:") throw new Error(`${label} must use HTTPS.`);
  if (url2.pathname !== "/" || url2.search || url2.hash || url2.username || url2.password || url2.port) {
    throw new Error(`Enter only the ${label.toLowerCase()}, without a path, query, port, username, or password.`);
  }
  return url2.hostname.toLowerCase();
}
function normalizeNgrokDomain(value) {
  return normalizeHttpsHostname(value, "ngrok reserved domain");
}
function normalizeCloudflareNamedDomain(value) {
  return normalizeHttpsHostname(value, "Cloudflare Named Tunnel hostname");
}
function normalizeNamedTunnelLocalPort(value) {
  if (!Number.isInteger(value) || value < 1024 || value > 65535) {
    throw new Error("Cloudflare Named Tunnel local port must be an integer from 1024 to 65535.");
  }
  return value;
}
function cancellationFromAbortSignal(signal) {
  if (!signal) return {
    token: void 0,
    dispose: () => void 0
  };
  const source = new vscode3.CancellationTokenSource();
  const listener = () => source.cancel();
  if (signal.aborted) source.cancel();else signal.addEventListener("abort", listener, {
    once: true
  });
  return {
    token: source.token,
    dispose: () => {
      signal.removeEventListener("abort", listener);
      source.dispose();
    }
  };
}
var BridgeManager = class {
  constructor(context, output, ideToolBroker, authorizeStart) {
    this.context = context;
    this.output = output;
    this.ideToolBroker = ideToolBroker;
    this.authorizeStart = authorizeStart;
    this.routeIdentity = createWindowsBridgeRouteIdentity(context);
    this.dispatcher = new BridgeToolDispatcher({
      invokeIdeTool: async (name, args, signal, ownerId) => {
        const cancellation = cancellationFromAbortSignal(signal);
        try {
          return await this.ideToolBroker.invokeDirect(name, args, cancellation.token, ownerId);
        } finally {
          cancellation.dispose();
        }
      },
      workspaceRoots: () => this.workspaceRoots(),
      skillsEnabled: () => this.skillsEnabled(),
      log: message => this.output.appendLine(message)
    }, resolveBridgeToolConcurrency(vscode3.workspace.getConfiguration("shuncode").get(BRIDGE_TOOL_CONCURRENCY_SETTING)));
    this.mcpTransport = new BridgeMcpTransport({
      dispatchToolCall: (name, args, extra) => this.dispatcher.dispatch(name, args, extra),
      beginRemoteConversation: ownerId => this.dispatcher.beginRemoteConversation(ownerId),
      endRemoteConversation: ownerId => this.dispatcher.endRemoteConversation(ownerId),
      releaseCommandOwner: ownerId => this.ideToolBroker.releaseCommandOwner(ownerId),
      serverInstructions: () => this.composeServerInstructions(),
      log: message => this.output.appendLine(message),
      diag: message => this.output.appendLine("[bridge-mcp] " + message),
      listCustomTools: () => {
        try {
          return listEnabledCustomTools(this.workspaceRoots(), message => this.output.appendLine(message), {
            skillsEnabled: this.skillsEnabled()
          });
        } catch {
          return [];
        }
      }
    });
  }
  context;
  output;
  ideToolBroker;
  authorizeStart;
  state = "stopped";
  tunnelProvider = "cloudflare";
  domain = "";
  configuredDomain = "";
  configuredNamedDomain = "";
  namedTunnelToken = "";
  namedTunnelLocalPort = DEFAULT_CLOUDFLARE_NAMED_LOCAL_PORT;
  routeIdentity;
  get routeToken() {
    return this.routeIdentity.value;
  }
  tunnelProcess;
  lastError;
  tunnelInstalled;
  tunnelVersion;
  tunnelConfigValid;
  cloudflaredExecutable = "cloudflared";
  ngrokExecutable = "ngrok";
  revision = 0;
  customToolsRevision = 0;
  lastCustomToolsFingerprint = "";
  lastHealth;
  startPromise;
  stopPromise;
  lifecycleGeneration = 0;
  tunnelRecoveryPromise;
  tunnelRecoveryGeneration;
  tunnelGeneration = 0;
  stoppingResources = false;
  stopTunnelProcessInFlight;
  releaseTunnelLease;
  tunnelOwnerResources;
  tunnelOwnerPid;
  disposed = false;
  dispatcher;
  mcpTransport;
  currentLocalPort() {
    return this.mcpTransport.snapshot().localPort;
  }
  async initialize() {
    await this.routeIdentity.initialize();
    this.output.appendLine("[bridge] route identity: durable-commit-v1");
    this.tunnelProvider = this.readTunnelProvider();
    this.namedTunnelToken = (await this.context.secrets.get(CLOUDFLARE_NAMED_TOKEN_SECRET)) ?? "";
    this.namedTunnelLocalPort = this.readNamedTunnelLocalPort();
    await this.restorePersistedDomain();
    await this.restorePersistedNamedDomain();
    this.domain = this.configuredDomainForProvider(this.tunnelProvider);
  }
  getStatus() {
    if (this.state !== "running" && this.state !== "starting") {
      this.tunnelProvider = this.readTunnelProvider();
      this.restoreConfiguredDomain();
      this.restoreConfiguredNamedDomain();
      this.namedTunnelLocalPort = this.readNamedTunnelLocalPort();
      this.domain = this.configuredDomainForProvider(this.tunnelProvider);
    }
    const localUrl = this.currentLocalPort() && this.routeToken ? `http://127.0.0.1:${this.currentLocalPort()}/mcp/${this.routeToken}` : void 0;
    const publicUrl = this.domain && this.routeToken ? `https://${this.domain}/mcp/${this.routeToken}` : void 0;
    const customTools = this.snapshotCustomTools();
    const transport = this.mcpTransport.snapshot();
    const activity = this.dispatcher.snapshotActivity();
    return {
      state: this.state,
      transport: "streamable-http",
      tunnelProvider: this.tunnelProvider,
      domain: this.domain,
      configuredDomain: this.configuredDomain,
      configuredNamedDomain: this.configuredNamedDomain,
      namedTunnelTokenConfigured: Boolean(this.namedTunnelToken),
      namedTunnelLocalPort: this.namedTunnelLocalPort,
      namedTunnelOriginUrl: `http://127.0.0.1:${this.namedTunnelLocalPort}`,
      localUrl,
      publicUrl,
      localPort: this.currentLocalPort(),
      tunnelInstalled: this.tunnelInstalled,
      tunnelVersion: this.tunnelVersion,
      tunnelConfigValid: this.tunnelConfigValid,
      lastError: this.lastError,
      toolNames: BRIDGE_TOOL_DEFINITIONS.map(tool => tool.name),
      toolCount: BRIDGE_TOOL_DEFINITIONS.length,
      customTools,
      activeRequests: transport.activeRequests,
      connected: transport.connected,
      revision: this.revision + transport.revision + this.dispatcher.revision + this.customToolsRevision,
      stats: activity.stats,
      todos: this.dispatcher.snapshotTodos(),
      ...this.dispatcher.snapshotTaskState(),
      activities: activity.activities,
      health: this.lastHealth
    };
  }
  snapshotCustomTools() {
    let tools;
    try {
      tools = loadCustomTools(this.workspaceRoots(), message => this.output.appendLine(message), {
        skillsEnabled: this.skillsEnabled()
      });
    } catch {
      return [];
    }
    const fingerprint = customToolsFingerprint(tools);
    if (fingerprint !== this.lastCustomToolsFingerprint) {
      this.lastCustomToolsFingerprint = fingerprint;
      this.customToolsRevision += 1;
    }
    return toStatusEntries(tools);
  }
  async importSkill(source) {
    const [root] = this.workspaceRoots();
    const result = importSkill(root, source, message => this.output.appendLine(message));
    return {
      status: this.getStatus(),
      result
    };
  }
  async diagnoseSkills() {
    const [root] = this.workspaceRoots();
    const log = message => this.output.appendLine(message);
    migrateLegacySkillDirs(root, log);
    const skillsEnabled = this.skillsEnabled();
    let diagnoses = diagnoseSkillTools(root, log, {
      skillsEnabled
    });
    if (skillsEnabled) {
      const loadedNames = new Set(loadCustomTools(this.workspaceRoots(), log, {
        skillsEnabled
      }).map(tool => tool.name));
      diagnoses = diagnoses.map(diagnosis => {
        if (!diagnosis.loaded || !diagnosis.name || loadedNames.has(diagnosis.name)) return diagnosis;
        return {
          dirName: diagnosis.dirName,
          name: diagnosis.name,
          loaded: false,
          reasonCode: "duplicate-name",
          reason: "\u8BE5\u540D\u79F0\u5DF2\u88AB\u540C\u76EE\u5F55\u7684 JSON \u5DE5\u5177\u5360\u7528\u3002",
          fix: "open-folder"
        };
      });
    }
    return {
      status: this.getStatus(),
      diagnoses
    };
  }
  async generateSkillRunner(name) {
    const [root] = this.workspaceRoots();
    const target = (name ?? "").trim();
    if (!target) throw new Error("Skill name must be a non-empty string.");
    const result = generateSkillRunner(root, target, message => this.output.appendLine(message));
    return {
      status: this.getStatus(),
      result
    };
  }
  async toggleCustomTool(name) {
    const target = name ?? (await this.pickCustomToolName("toggle"));
    if (!target) return this.getStatus();
    toggleCustomTool(this.workspaceRoots(), target, message => this.output.appendLine(message));
    return this.getStatus();
  }
  async deleteCustomTool(name) {
    const target = name ?? (await this.pickCustomToolName("delete"));
    if (!target) return this.getStatus();
    const zh = vscode3.env.language.startsWith("zh");
    const confirm = await vscode3.window.showWarningMessage(zh ? `\u6C38\u4E45\u5220\u9664\u81EA\u5B9A\u4E49\u5DE5\u5177 \u201C${target}\u201D\uFF1F\u5176\u6280\u80FD\u5B50\u6587\u4EF6\u5939\u6216 JSON \u6E05\u5355\u4F1A\u88AB\u5220\u9664\uFF0C\u4E0D\u53EF\u6062\u590D\u3002` : `Permanently delete custom tool "${target}"? Its skill subfolder or JSON manifest is removed.`, {
      modal: true
    }, {
      title: zh ? "\u5220\u9664" : "Delete"
    });
    if (!confirm) return this.getStatus();
    deleteCustomTool(this.workspaceRoots(), target, message => this.output.appendLine(message));
    return this.getStatus();
  }
  /** Command-palette entry point: choose one of the workspace's custom tools. */
  async pickCustomToolName(action) {
    let tools;
    try {
      tools = loadCustomTools(this.workspaceRoots(), message => this.output.appendLine(message), {
        skillsEnabled: this.skillsEnabled()
      });
    } catch {
      tools = [];
    }
    const zh = vscode3.env.language.startsWith("zh");
    if (tools.length === 0) {
      void vscode3.window.showInformationMessage(zh ? `\u672A\u53D1\u73B0\u81EA\u5B9A\u4E49\u5DE5\u5177\uFF1A\u628A skill \u6587\u4EF6\u5939\u6216 JSON \u6E05\u5355\u653E\u5165 ${CUSTOM_TOOLS_DIR_NAME}\uFF0C\u6216\u5148\u4F7F\u7528\u201C\u5BFC\u5165 Skill\u201D\u3002` : `No custom tools yet: drop a skill folder or JSON manifest into ${CUSTOM_TOOLS_DIR_NAME}, or import one.`);
      return void 0;
    }
    const items = tools.map(tool => ({
      label: `${tool.enabled ? "\u2713" : "\u2298"}  ${tool.title || tool.name}`,
      description: tool.name,
      detail: tool.skillDir ? "skill" : "JSON manifest",
      pickedTool: tool.name
    }));
    const pick2 = await vscode3.window.showQuickPick(items, {
      title: action === "toggle" ? zh ? "\u9009\u62E9\u8981\u542F\u7528/\u505C\u7528\u7684\u81EA\u5B9A\u4E49\u5DE5\u5177" : "Select a custom tool to enable or disable" : zh ? "\u9009\u62E9\u8981\u5220\u9664\u7684\u81EA\u5B9A\u4E49\u5DE5\u5177" : "Select a custom tool to delete",
      placeHolder: zh ? "\u2713 \u5DF2\u542F\u7528\u3000\u2298 \u5DF2\u505C\u7528" : "\u2713 enabled\u3000\u2298 disabled"
    });
    return pick2?.pickedTool;
  }
  readConfiguredDomain() {
    return vscode3.workspace.getConfiguration("shuncode").get(NGROK_DOMAIN_SETTING, "").trim();
  }
  readConfiguredNamedDomain() {
    return vscode3.workspace.getConfiguration("shuncode").get(CLOUDFLARE_NAMED_DOMAIN_SETTING, "").trim();
  }
  readNamedTunnelLocalPort() {
    const value = vscode3.workspace.getConfiguration("shuncode").get(CLOUDFLARE_NAMED_LOCAL_PORT_SETTING, DEFAULT_CLOUDFLARE_NAMED_LOCAL_PORT);
    try {
      return normalizeNamedTunnelLocalPort(value);
    } catch {
      return DEFAULT_CLOUDFLARE_NAMED_LOCAL_PORT;
    }
  }
  configuredDomainForProvider(provider) {
    return provider === "ngrok" ? this.configuredDomain : provider === "cloudflare-named" ? this.configuredNamedDomain : "";
  }
  readTunnelProvider() {
    const provider = vscode3.workspace.getConfiguration("shuncode").get(TUNNEL_PROVIDER_SETTING, "cloudflare");
    return provider === "ngrok" || provider === "cloudflare-named" ? provider : "cloudflare";
  }
  readCustomInstructions() {
    return vscode3.workspace.getConfiguration("shuncode").get(CUSTOM_INSTRUCTIONS_SETTING, "").trim();
  }
  readWorkspaceScope() {
    return vscode3.workspace.getConfiguration("shuncode").get(BRIDGE_WORKSPACE_SCOPE_SETTING, "device") === "workspace" ? "workspace" : "device";
  }
  /**
   * Built-in Bridge instructions plus the optional user-defined text configured through
   * shuncode.bridge.customInstructions. Custom text is appended (never replacing the
   * built-in tool and task-coordination rules) and composed per session, so edits apply
   * to the next remote connection without restarting the Bridge.
   */
  composeServerInstructions() {
    const custom = this.readCustomInstructions();
    const builtIn = `${BRIDGE_SERVER_INSTRUCTIONS}

${bridgeWorkspaceScopeInstructions(this.readWorkspaceScope())}`;
    return custom ? `${builtIn}

${custom}` : builtIn;
  }
  readPersistedDomain() {
    return this.context.globalState.get(NGROK_DOMAIN_STATE_KEY, "").trim();
  }
  readPersistedNamedDomain() {
    return this.context.globalState.get(CLOUDFLARE_NAMED_DOMAIN_STATE_KEY, "").trim();
  }
  /**
   * Restore the Bridge domain from either VS Code configuration or the extension's own
   * persistent memento. The memento is intentionally a second source of truth because
   * carrier/user-data migrations can temporarily present an empty configuration value on
   * startup. Whichever store still has the domain repairs the other one.
   */
  async restorePersistedDomain() {
    const configured = this.readConfiguredDomain();
    const persisted = this.readPersistedDomain();
    const candidate = configured || persisted;
    if (!candidate) return;
    this.configuredDomain = normalizeNgrokDomain(candidate);
    if (persisted !== this.configuredDomain) {
      await this.context.globalState.update(NGROK_DOMAIN_STATE_KEY, this.configuredDomain);
    }
    if (configured !== this.configuredDomain) {
      try {
        await vscode3.workspace.getConfiguration("shuncode").update(NGROK_DOMAIN_SETTING, this.configuredDomain, vscode3.ConfigurationTarget.Global);
      } catch (error2) {
        this.output.appendLine(`[bridge] could not repair ngrok domain setting: ${error2 instanceof Error ? error2.message : String(error2)}`);
      }
    }
  }
  restoreConfiguredDomain() {
    const candidate = this.readConfiguredDomain() || this.readPersistedDomain();
    if (!candidate) return;
    try {
      this.configuredDomain = normalizeNgrokDomain(candidate);
    } catch {}
  }
  async persistDomain(domain) {
    const trimmed = domain.trim();
    this.configuredDomain = trimmed ? normalizeNgrokDomain(trimmed) : "";
    if (this.tunnelProvider === "ngrok") this.domain = this.configuredDomain;
    await this.context.globalState.update(NGROK_DOMAIN_STATE_KEY, this.configuredDomain);
    try {
      await vscode3.workspace.getConfiguration("shuncode").update(NGROK_DOMAIN_SETTING, this.configuredDomain, vscode3.ConfigurationTarget.Global);
    } catch (error2) {
      this.output.appendLine(`[bridge] ngrok domain saved to extension state, but settings.json update failed: ${error2 instanceof Error ? error2.message : String(error2)}`);
    }
  }
  async configure(domain) {
    if (this.state === "running" || this.state === "starting") {
      throw new Error("Stop the Bridge before changing its ngrok domain.");
    }
    await this.persistDomain(domain);
    this.lastError = void 0;
    return this.getStatus();
  }
  async restorePersistedNamedDomain() {
    const configured = this.readConfiguredNamedDomain();
    const persisted = this.readPersistedNamedDomain();
    const candidate = configured || persisted;
    if (!candidate) return;
    this.configuredNamedDomain = normalizeCloudflareNamedDomain(candidate);
    if (persisted !== this.configuredNamedDomain) {
      await this.context.globalState.update(CLOUDFLARE_NAMED_DOMAIN_STATE_KEY, this.configuredNamedDomain);
    }
    if (configured !== this.configuredNamedDomain) {
      try {
        await vscode3.workspace.getConfiguration("shuncode").update(CLOUDFLARE_NAMED_DOMAIN_SETTING, this.configuredNamedDomain, vscode3.ConfigurationTarget.Global);
      } catch (error2) {
        this.output.appendLine(`[bridge] could not repair Cloudflare Named Tunnel hostname setting: ${error2 instanceof Error ? error2.message : String(error2)}`);
      }
    }
  }
  restoreConfiguredNamedDomain() {
    const candidate = this.readConfiguredNamedDomain() || this.readPersistedNamedDomain();
    if (!candidate) return;
    try {
      this.configuredNamedDomain = normalizeCloudflareNamedDomain(candidate);
    } catch {}
  }
  async configureNamedTunnel(input) {
    if (this.state === "running" || this.state === "starting") {
      throw new Error("Stop the Bridge before changing its Cloudflare Named Tunnel configuration.");
    }
    const domain = normalizeCloudflareNamedDomain(input.domain);
    const localPort = normalizeNamedTunnelLocalPort(input.localPort);
    const token = input.token?.trim();
    if (token !== void 0 && !token) throw new Error("Cloudflare Tunnel Token cannot be empty.");
    this.configuredNamedDomain = domain;
    this.namedTunnelLocalPort = localPort;
    await this.context.globalState.update(CLOUDFLARE_NAMED_DOMAIN_STATE_KEY, domain);
    await vscode3.workspace.getConfiguration("shuncode").update(CLOUDFLARE_NAMED_DOMAIN_SETTING, domain, vscode3.ConfigurationTarget.Global);
    await vscode3.workspace.getConfiguration("shuncode").update(CLOUDFLARE_NAMED_LOCAL_PORT_SETTING, localPort, vscode3.ConfigurationTarget.Global);
    if (token !== void 0) {
      this.namedTunnelToken = token;
      await this.context.secrets.store(CLOUDFLARE_NAMED_TOKEN_SECRET, token);
    }
    if (this.tunnelProvider === "cloudflare-named") this.domain = domain;
    this.tunnelConfigValid = void 0;
    this.lastError = void 0;
    return await this.checkNamedTunnel();
  }
  async clearNamedTunnelToken() {
    if (this.state === "running" || this.state === "starting") {
      throw new Error("Stop the Bridge before clearing its Cloudflare Tunnel Token.");
    }
    this.namedTunnelToken = "";
    await this.context.secrets.delete(CLOUDFLARE_NAMED_TOKEN_SECRET);
    this.tunnelConfigValid = false;
    this.lastError = "Cloudflare Named Tunnel Token is not configured.";
    return this.getStatus();
  }
  async setTunnelProvider(provider) {
    if (this.state === "running" || this.state === "starting") {
      throw new Error("Stop the Bridge before changing its tunnel provider.");
    }
    if (provider !== "cloudflare" && provider !== "cloudflare-named" && provider !== "ngrok") {
      throw new Error("Bridge tunnel provider must be cloudflare, cloudflare-named, or ngrok.");
    }
    this.tunnelProvider = provider;
    this.domain = this.configuredDomainForProvider(provider);
    this.tunnelInstalled = void 0;
    this.tunnelVersion = void 0;
    this.tunnelConfigValid = void 0;
    this.lastError = void 0;
    await vscode3.workspace.getConfiguration("shuncode").update(TUNNEL_PROVIDER_SETTING, provider, vscode3.ConfigurationTarget.Global);
    return this.getStatus();
  }
  async rotateEndpoint() {
    if (this.state === "running" || this.state === "starting") {
      throw new Error("Stop the Bridge before rotating its endpoint URL.");
    }
    await this.routeIdentity.rotate();
    return this.getStatus();
  }
  async checkTunnel() {
    this.tunnelProvider = this.readTunnelProvider();
    return this.tunnelProvider === "ngrok" ? await this.checkNgrok() : this.tunnelProvider === "cloudflare-named" ? await this.checkNamedTunnel() : await this.checkCloudflared();
  }
  /**
   * Clears the tool-call timeline and resets the call statistics. Calls that are
   * still running are kept so their completion is still recorded consistently.
   * Todos are the remote agent's task list and are intentionally left untouched.
   */
  clearActivityLog() {
    const removed = this.dispatcher.clearActivity();
    this.output.appendLine(`[bridge] tool activity log cleared: ${removed} entries removed`);
    return this.getStatus();
  }
  /**
   * Probes the Bridge end to end: local HTTP server, public tunnel endpoint,
   * tunnel process liveness and active MCP sessions. The report is kept on the
   * status so the Bridge panel can show the latest result.
   */
  async checkHealth() {
    const startedAt = Date.now();
    const running = this.state === "running";
    const [local, publicProbe] = await Promise.all([this.probeLocalHealth(), running && this.domain && this.routeToken ? this.probePublicHealth() : Promise.resolve(void 0)]);
    const tunnel = this.tunnelProcess;
    const tunnelProcessAlive = Boolean(tunnel && tunnel.exitCode === null && tunnel.signalCode === null);
    const transport = this.mcpTransport.snapshot();
    const lastSessionActivity = transport.lastSessionActivityAt;
    const ok = running && local.ok && publicProbe?.ok === true && tunnelProcessAlive;
    const problems = [];
    if (!running) problems.push(`Bridge is ${this.state}`);
    if (!local.ok) problems.push(`local: ${local.error ?? "failed"}`);
    if (running && !publicProbe) problems.push("public endpoint not assigned");
    if (publicProbe && !publicProbe.ok) problems.push(`public: ${publicProbe.error ?? "failed"}`);
    if (running && !tunnelProcessAlive) problems.push("tunnel process not running");
    const summary = ok ? `healthy \xB7 local ${local.latencyMs ?? 0} ms \xB7 public ${publicProbe?.latencyMs ?? 0} ms \xB7 ${transport.sessions} MCP session(s)` : `unhealthy \xB7 ${problems.join("; ")}`;
    const report = {
      at: (/* @__PURE__ */new Date()).toISOString(),
      ok,
      state: this.state,
      durationMs: Date.now() - startedAt,
      local,
      public: publicProbe,
      tunnelProcessAlive,
      sessions: transport.sessions,
      activeRequests: transport.activeRequests,
      lastSessionActivityAt: lastSessionActivity ? new Date(lastSessionActivity).toISOString() : void 0,
      summary
    };
    this.lastHealth = report;
    this.output.appendLine(`[bridge] health check: ${summary}`);
    return this.getStatus();
  }
  async probeLocalHealth() {
    if (!this.currentLocalPort() || !this.routeToken) {
      return {
        ok: false,
        error: this.state === "running" ? "local HTTP port unavailable" : "Bridge is not running"
      };
    }
    const url2 = `http://127.0.0.1:${this.currentLocalPort()}/healthz/${this.routeToken}`;
    const started = Date.now();
    try {
      const response = await fetch(url2, {
        method: "GET",
        cache: "no-store",
        signal: AbortSignal.timeout(3e3)
      });
      const latencyMs = Date.now() - started;
      if (!response.ok) return {
        ok: false,
        url: url2,
        latencyMs,
        error: `HTTP ${response.status}`
      };
      const payload = await response.json().catch(() => void 0);
      return payload?.ok === true ? {
        ok: true,
        url: url2,
        latencyMs
      } : {
        ok: false,
        url: url2,
        latencyMs,
        error: "health response did not confirm ok"
      };
    } catch (error2) {
      return {
        ok: false,
        url: url2,
        latencyMs: Date.now() - started,
        error: error2 instanceof Error ? error2.message : String(error2)
      };
    }
  }
  async probePublicHealth() {
    const url2 = this.publicHealthUrl();
    const started = Date.now();
    const result = await this.requestPublicHealth(PUBLIC_HEALTH_REQUEST_TIMEOUT_MS * 2);
    const latencyMs = Date.now() - started;
    return result.ok ? {
      ok: true,
      url: url2,
      latencyMs
    } : {
      ok: false,
      url: url2,
      latencyMs,
      error: result.failure.reason
    };
  }
  async checkNgrok() {
    let lastError;
    for (const executable of this.ngrokExecutableCandidates()) {
      try {
        const version2 = await execFileAsync2(executable, ["version"], {
          windowsHide: true,
          timeout: 1e4
        });
        this.ngrokExecutable = executable;
        this.tunnelInstalled = true;
        this.tunnelVersion = String(version2.stdout || version2.stderr).trim().split(/\r?\n/)[0] || "ngrok";
        lastError = void 0;
        break;
      } catch (error2) {
        lastError = error2;
      }
    }
    if (!this.tunnelInstalled || lastError) {
      this.tunnelInstalled = false;
      this.tunnelConfigValid = false;
      this.tunnelVersion = void 0;
      this.lastError = `ngrok was not found: ${lastError instanceof Error ? lastError.message : String(lastError ?? "not installed")}`;
      return this.getStatus();
    }
    try {
      await execFileAsync2(this.ngrokExecutable, ["config", "check"], {
        windowsHide: true,
        timeout: 1e4
      });
      this.tunnelConfigValid = true;
      this.lastError = void 0;
    } catch (error2) {
      this.tunnelConfigValid = false;
      this.lastError = `ngrok config check failed: ${error2 instanceof Error ? error2.message : String(error2)}`;
    }
    return this.getStatus();
  }
  async checkCloudflared() {
    let lastError;
    for (const executable of this.cloudflaredExecutableCandidates()) {
      try {
        const version2 = await execFileAsync2(executable, ["--version"], {
          windowsHide: true,
          timeout: 1e4
        });
        this.cloudflaredExecutable = executable;
        this.tunnelInstalled = true;
        this.tunnelVersion = String(version2.stdout || version2.stderr).trim().split(/\r?\n/)[0] || "cloudflared";
        this.tunnelConfigValid = true;
        this.lastError = void 0;
        return this.getStatus();
      } catch (error2) {
        lastError = error2;
      }
    }
    this.tunnelInstalled = false;
    this.tunnelConfigValid = false;
    this.tunnelVersion = void 0;
    this.lastError = `cloudflared was not found: ${lastError instanceof Error ? lastError.message : String(lastError ?? "not installed")}`;
    return this.getStatus();
  }
  async checkNamedTunnel() {
    await this.checkCloudflared();
    if (!this.tunnelInstalled) return this.getStatus();
    this.namedTunnelToken = (await this.context.secrets.get(CLOUDFLARE_NAMED_TOKEN_SECRET)) ?? "";
    this.restoreConfiguredNamedDomain();
    this.namedTunnelLocalPort = this.readNamedTunnelLocalPort();
    this.domain = this.configuredNamedDomain;
    if (!this.namedTunnelToken) {
      this.tunnelConfigValid = false;
      this.lastError = "Cloudflare Named Tunnel Token is not configured.";
      return this.getStatus();
    }
    if (!this.configuredNamedDomain) {
      this.tunnelConfigValid = false;
      this.lastError = "Cloudflare Named Tunnel hostname is not configured.";
      return this.getStatus();
    }
    try {
      this.namedTunnelLocalPort = normalizeNamedTunnelLocalPort(this.namedTunnelLocalPort);
    } catch (error2) {
      this.tunnelConfigValid = false;
      this.lastError = error2 instanceof Error ? error2.message : String(error2);
      return this.getStatus();
    }
    this.tunnelConfigValid = true;
    this.lastError = void 0;
    return this.getStatus();
  }
  cloudflaredExecutableCandidates() {
    const candidates = [this.cloudflaredExecutable, "cloudflared"];
    if (process.platform === "win32") {
      if (process.env.LOCALAPPDATA) {
        candidates.push(import_node_path14.default.join(process.env.LOCALAPPDATA, "Microsoft", "WinGet", "Links", "cloudflared.exe"));
        candidates.push(import_node_path14.default.join(process.env.LOCALAPPDATA, "Microsoft", "WindowsApps", "cloudflared.exe"));
      }
      if (process.env.ProgramFiles) candidates.push(import_node_path14.default.join(process.env.ProgramFiles, "cloudflared", "cloudflared.exe"));
      if (process.env["ProgramFiles(x86)"]) candidates.push(import_node_path14.default.join(process.env["ProgramFiles(x86)"], "cloudflared", "cloudflared.exe"));
    }
    return [...new Set(candidates.filter(Boolean))];
  }
  ngrokExecutableCandidates() {
    const candidates = [this.ngrokExecutable, "ngrok"];
    if (process.platform === "win32") {
      if (process.env.LOCALAPPDATA) {
        candidates.push(import_node_path14.default.join(process.env.LOCALAPPDATA, "Microsoft", "WinGet", "Links", "ngrok.exe"));
        candidates.push(import_node_path14.default.join(process.env.LOCALAPPDATA, "Microsoft", "WindowsApps", "ngrok.exe"));
      }
      if (process.env.ProgramFiles) candidates.push(import_node_path14.default.join(process.env.ProgramFiles, "ngrok", "ngrok.exe"));
      if (process.env["ProgramFiles(x86)"]) candidates.push(import_node_path14.default.join(process.env["ProgramFiles(x86)"], "ngrok", "ngrok.exe"));
    }
    return [...new Set(candidates.filter(Boolean))];
  }
  async installCloudflared() {
    if (this.state === "running" || this.state === "starting") {
      throw new Error("Stop the Bridge before installing cloudflared.");
    }
    this.tunnelProvider = this.readTunnelProvider();
    if (this.tunnelProvider !== "cloudflare" && this.tunnelProvider !== "cloudflare-named") {
      throw new Error("Select a Cloudflare tunnel mode before installing cloudflared.");
    }
    const existing = await this.checkCloudflared();
    if (existing.tunnelInstalled) return this.tunnelProvider === "cloudflare-named" ? await this.checkNamedTunnel() : existing;
    if (process.platform !== "win32") {
      throw new Error("One-click cloudflared installation is currently supported on Windows with Winget.");
    }
    this.output.appendLine(`[bridge] installing cloudflared with Winget package ${CLOUDFLARED_WINGET_PACKAGE}...`);
    try {
      const result = await execFileAsync2("winget", ["install", "--id", CLOUDFLARED_WINGET_PACKAGE, "--exact", "--source", "winget", "--silent", "--disable-interactivity", "--accept-package-agreements", "--accept-source-agreements"], {
        windowsHide: false,
        timeout: 10 * 60 * 1e3,
        maxBuffer: 2 * 1024 * 1024
      });
      const output = String(result.stdout || result.stderr).trim();
      if (output) this.output.appendLine(`[winget] ${output}`);
    } catch (error2) {
      const details = error2;
      const output = [details.message, String(details.stdout ?? "").trim(), String(details.stderr ?? "").trim()].filter(Boolean).join("\n");
      this.lastError = `cloudflared installation failed: ${output}`;
      throw new Error(this.lastError);
    }
    const installed = await this.checkCloudflared();
    if (!installed.tunnelInstalled) {
      this.lastError = "cloudflared installation completed, but ShunCode could not locate the executable. Restart ShunCode and check the tunnel again.";
      throw new Error(this.lastError);
    }
    this.output.appendLine(`[bridge] cloudflared installation verified: ${installed.tunnelVersion ?? "installed"}`);
    return this.tunnelProvider === "cloudflare-named" ? await this.checkNamedTunnel() : installed;
  }
  async start(domain) {
    if (this.stopPromise) throw new Error("Bridge cleanup is in progress; wait before starting again.");
    if (this.disposed) throw new Error("Bridge has been disposed; reopen the workspace before starting it again.");
    if (this.state === "running") return this.getStatus();
    if (this.startPromise) return this.startPromise;
    if (this.state === "starting" && this.mcpTransport.isListening()) return this.getStatus();
    this.startPromise = this.startInternal(domain);
    try {
      return await this.startPromise;
    } finally {
      this.startPromise = void 0;
    }
  }
  /** Development-only transport smoke: opens the exact local Streamable HTTP MCP server without a public tunnel. */
  async startLocalSmoke() {
    if (this.disposed) throw new Error("Bridge has been disposed; reopen the workspace before starting it again.");
    if (this.context.extensionMode !== vscode3.ExtensionMode.Development || process.env.SHUNCODE_BRIDGE_SMOKE_LOCAL !== "1") {
      throw new Error("Local Bridge smoke mode is available only in an Extension Development Host with SHUNCODE_BRIDGE_SMOKE_LOCAL=1.");
    }
    if (this.state === "running") return this.getStatus();
    await this.initialize();
    if (!vscode3.workspace.workspaceFolders?.length) throw new Error("Open a workspace folder before starting the Bridge smoke server.");
    this.state = "starting";
    this.lastError = void 0;
    try {
      await this.mcpTransport.start({
        provider: this.tunnelProvider,
        routeToken: this.routeToken,
        namedTunnelLocalPort: this.namedTunnelLocalPort
      });
      await this.verifyLocalHealth();
      this.state = "running";
      this.output.appendLine(`[bridge-smoke] local Streamable HTTP server running on 127.0.0.1:${this.currentLocalPort()}`);
      return this.getStatus();
    } catch (error2) {
      this.lastError = error2 instanceof Error ? error2.message : String(error2);
      this.state = "error";
      await this.stopResources(false);
      throw error2;
    }
  }
  /**
   * Reserve this window's tunnel endpoint across ShunCode windows/instances.
   * ngrok is singleton per machine and a fixed domain/named credential cannot
   * be shared; when the configured provider is already held by another window,
   * a second window automatically falls back to provider #1 (cloudflare quick
   * tunnel, which needs no lease) instead of failing to start. Only this
   * window's in-memory provider changes — the configured provider in settings
   * is left untouched, so a later start retries it (and succeeds once the
   * other window releases it).
   */
  async acquireTunnelLeaseOrFallbackToCloudflare() {
    try {
      this.releaseTunnelLease = await acquireBridgeTunnelLease(this.currentTunnelLeaseResources());
      return;
    } catch (error2) {
      if (this.tunnelProvider === "cloudflare" || !isBridgeTunnelLeaseConflict(error2)) throw error2;
    }
    const configured = this.tunnelProvider;
    this.output.appendLine(`[bridge] ${configured} is already in use by another ShunCode window; this window falls back to cloudflare.`);
    void vscode3.window.showWarningMessage(`Bridge provider "${configured}" is already used by another ShunCode window; this window uses cloudflare instead.`);
    this.tunnelProvider = "cloudflare";
    this.domain = "";
    this.tunnelInstalled = void 0;
    this.tunnelVersion = void 0;
    this.tunnelConfigValid = void 0;
    const tunnel = await this.checkCloudflared();
    if (!tunnel.tunnelInstalled) throw new Error(this.lastError ?? "cloudflare tunnel client is not installed.");
    if (!tunnel.tunnelConfigValid) throw new Error(this.lastError ?? "cloudflare tunnel configuration is invalid.");
    this.releaseTunnelLease = await acquireBridgeTunnelLease([]);
  }
  /** Lease resources for the currently configured provider (one definition shared by acquire/spawn/stop/reclaim). */
  currentTunnelLeaseResources() {
    return bridgeTunnelLeaseResources({
      provider: this.tunnelProvider,
      configuredDomain: this.configuredDomain,
      configuredNamedDomain: this.configuredNamedDomain,
      namedTunnelToken: this.namedTunnelToken
    });
  }
  /** Tunnel binary image name for orphan identity verification (e.g. `ngrok.exe`). */
  currentTunnelImage() {
    const isCloudflare = this.tunnelProvider === "cloudflare" || this.tunnelProvider === "cloudflare-named";
    const image = import_node_path14.default.basename(isCloudflare ? this.cloudflaredExecutable : this.ngrokExecutable);
    return process.platform === "win32" && !image.toLowerCase().endsWith(".exe") ? `${image}.exe` : image;
  }
  /** Remember our tunnel child for the next holder's reclaim (singleton scopes only). */
  recordOwnedTunnel(pid) {
    const resources = this.currentTunnelLeaseResources();
    const localPort = this.currentLocalPort();
    if (!resources.length || pid === void 0 || !localPort) {
      this.tunnelOwnerResources = void 0;
      this.tunnelOwnerPid = void 0;
      return;
    }
    this.tunnelOwnerResources = resources;
    this.tunnelOwnerPid = pid;
    recordTunnelOwnership(resources, {
      pid,
      image: this.currentTunnelImage(),
      provider: this.tunnelProvider === "cloudflare-named" ? "cloudflare-named" : "ngrok",
      domain: (this.tunnelProvider === "ngrok" ? this.configuredDomain : this.configuredNamedDomain).trim().toLowerCase(),
      localPort,
      startedAt: Date.now()
    });
  }
  /** Forget our tunnel child (it exited or was stopped); never touches a successor's record. */
  clearOwnedTunnelRecord() {
    if (this.tunnelOwnerResources?.length && this.tunnelOwnerPid !== void 0) {
      clearTunnelOwnership(this.tunnelOwnerResources, this.tunnelOwnerPid);
      this.tunnelOwnerResources = void 0;
      this.tunnelOwnerPid = void 0;
    }
  }
  /**
   * Reclaim a crashed previous holder's tunnel child; fail fast when the
   * survivor cannot be stopped (spawning a duelling second agent for the same
   * reserved endpoint would fail at the edge anyway).
   */
  async reclaimPreviousTunnelOwner() {
    const resources = this.currentTunnelLeaseResources();
    if (!resources.length) return;
    const outcome = await reclaimStaleTunnelOwner(resources, this.currentTunnelImage());
    if (outcome.action === "reclaimed") {
      this.output.appendLine(`[bridge] reclaimed the previous ${this.tunnelProvider} tunnel (pid ${outcome.pid}) left behind by an unclean shutdown.`);
    } else if (outcome.action === "failed") {
      throw new Error(`Previous ${this.tunnelProvider} tunnel (pid ${outcome.pid}) is still running and could not be stopped: ${outcome.reason}. Stop it manually and retry.`);
    } else if (outcome.reason !== "no ownership record") {
      this.output.appendLine(`[bridge] previous-tunnel reclaim skipped (${outcome.reason}).`);
    }
  }
  /**
   * On-demand orphan sweep behind the "clean up processes" action: terminate
   * the stale tunnel child of a crashed previous holder WITHOUT stopping this
   * Bridge. Safety mirrors the startup reclaim, plus a live-holder probe: when
   * this window owns the endpoint, or another live ShunCode window still holds
   * the lease, that tunnel is owned and running — never an orphan — so nothing
   * is terminated. Quick tunnels have no fixed endpoint and leave no
   * reclaimable orphans.
   */
  async cleanupOrphanTunnel() {
    const resources = this.currentTunnelLeaseResources();
    if (!resources.length) {
      this.output.appendLine("[bridge] cleanup: quick tunnels leave no reclaimable processes; nothing to clean.");
      return this.getStatus();
    }
    if (this.state === "starting") {
      this.output.appendLine("[bridge] cleanup skipped: startup is in progress and reclaims stale tunnels itself.");
      return this.getStatus();
    }
    if (this.releaseTunnelLease) {
      this.output.appendLine("[bridge] cleanup skipped: this window owns the running tunnel; nothing to clean.");
      return this.getStatus();
    }
    let releaseProbe;
    try {
      releaseProbe = await acquireBridgeTunnelLease(resources);
    } catch (error2) {
      if (isBridgeTunnelLeaseConflict(error2)) {
        this.output.appendLine("[bridge] cleanup skipped: another live ShunCode window owns this endpoint and its tunnel is not an orphan.");
        return this.getStatus();
      }
      throw error2;
    }
    try {
      const outcome = await reclaimStaleTunnelOwner(resources, this.currentTunnelImage());
      if (outcome.action === "reclaimed") {
        this.output.appendLine(`[bridge] cleanup reclaimed the stale ${this.tunnelProvider} tunnel (pid ${outcome.pid}) left behind by an unclean shutdown.`);
      } else if (outcome.action === "failed") {
        throw new Error(`Stale ${this.tunnelProvider} tunnel (pid ${outcome.pid}) is still running and could not be stopped: ${outcome.reason}. Stop it manually and retry.`);
      } else {
        this.output.appendLine(`[bridge] cleanup found nothing to reclaim (${outcome.reason}).`);
      }
    } finally {
      await releaseProbe();
    }
    return this.getStatus();
  }
  async startInternal(domain) {
    const lifecycle = this.lifecycleGeneration;
    const checkCancelled = () => {
      if (lifecycle !== this.lifecycleGeneration) throw new Error("Bridge startup cancelled by stop/cleanup.");
    };
    try {
      await this.authorizeStart();
      checkCancelled();
    } catch (error2) {
      if (lifecycle !== this.lifecycleGeneration) throw error2;
      this.lastError = error2 instanceof Error ? error2.message : String(error2);
      this.state = "error";
      throw error2;
    }
    this.stoppingResources = false;
    this.state = "starting";
    this.lastError = void 0;
    try {
      await this.initialize();
      this.tunnelProvider = this.readTunnelProvider();
      if (this.tunnelProvider === "ngrok") {
        const resolvedDomain = domain ?? (this.configuredDomain || this.readConfiguredDomain() || this.readPersistedDomain());
        await this.persistDomain(resolvedDomain);
      } else if (this.tunnelProvider === "cloudflare-named") {
        this.namedTunnelToken = (await this.context.secrets.get(CLOUDFLARE_NAMED_TOKEN_SECRET)) ?? "";
        this.restoreConfiguredNamedDomain();
        this.namedTunnelLocalPort = this.readNamedTunnelLocalPort();
        this.domain = this.configuredNamedDomain;
      } else {
        this.domain = "";
      }
      checkCancelled();
      const folders = vscode3.workspace.workspaceFolders;
      if (!folders?.length) throw new Error("Open a workspace folder before starting the Bridge.");
      const tunnel = await this.checkTunnel();
      checkCancelled();
      if (!tunnel.tunnelInstalled) throw new Error(this.lastError ?? `${this.tunnelProvider} tunnel client is not installed.`);
      if (!tunnel.tunnelConfigValid) throw new Error(this.lastError ?? `${this.tunnelProvider} tunnel configuration is invalid.`);
      await this.acquireTunnelLeaseOrFallbackToCloudflare();
      checkCancelled();
      await this.mcpTransport.start({
        provider: this.tunnelProvider,
        routeToken: this.routeToken,
        namedTunnelLocalPort: this.namedTunnelLocalPort
      });
      await this.verifyLocalHealth();
      checkCancelled();
      await this.reclaimPreviousTunnelOwner();
      checkCancelled();
      await this.startTunnelOnce();
      checkCancelled();
      this.state = "running";
      const publicUrl = this.getStatus().publicUrl;
      this.output.appendLine(`[bridge] running ${publicUrl} -> 127.0.0.1:${this.currentLocalPort()}`);
      return this.getStatus();
    } catch (error2) {
      if (lifecycle !== this.lifecycleGeneration) throw error2;
      const message = error2 instanceof Error ? error2.message : String(error2);
      this.lastError = message;
      this.state = "error";
      await this.stopResources(false);
      throw error2;
    }
  }
  async verifyLocalHealth() {
    if (!this.currentLocalPort()) throw new Error("Bridge local HTTP port is unavailable after startup.");
    const url2 = new URL(`http://127.0.0.1:${this.currentLocalPort()}/healthz/${this.routeToken}`);
    let response;
    try {
      response = await fetch(url2, {
        method: "GET",
        cache: "no-store",
        signal: AbortSignal.timeout(3e3)
      });
    } catch (error2) {
      throw new Error(`Bridge local HTTP health check failed: ${error2 instanceof Error ? error2.message : String(error2)}`);
    }
    if (!response.ok) throw new Error(`Bridge local HTTP health check returned HTTP ${response.status}.`);
    const payload = await response.json().catch(() => void 0);
    if (payload?.ok !== true) throw new Error("Bridge local HTTP health check did not confirm readiness.");
    this.output.appendLine(`[bridge] local health verified: ${url2}`);
  }
  tunnelProcessEnvironment() {
    const env6 = {
      ...process.env
    };
    if (this.tunnelProvider === "ngrok") {
      return this.ngrokProcessEnvironment(env6);
    }
    const httpConfiguration = vscode3.workspace.getConfiguration("http");
    const proxySupport = httpConfiguration.get("proxySupport");
    const configuredProxy = httpConfiguration.get("proxy")?.trim();
    if (proxySupport !== "off") {
      const proxyUrl = resolveExtensionHostProxy(new URL("https://www.cloudflare.com/"), configuredProxy);
      if (proxyUrl) {
        const forceConfiguredProxy = Boolean(configuredProxy);
        const hasAllProxy = Boolean(env6.ALL_PROXY || env6.all_proxy);
        if (forceConfiguredProxy || !env6.HTTPS_PROXY && !env6.https_proxy && !hasAllProxy) env6.HTTPS_PROXY = proxyUrl;
        if (forceConfiguredProxy || !env6.HTTP_PROXY && !env6.http_proxy && !hasAllProxy) env6.HTTP_PROXY = proxyUrl;
        this.output.appendLine("[bridge] tunnel process will use configured/system HTTP proxy settings.");
      }
    }
    if (this.tunnelProvider === "cloudflare-named") env6.TUNNEL_TOKEN = this.namedTunnelToken;
    return env6;
  }
  /**
   * ngrok Free rejects agents that connect through an HTTP/S proxy with
   * ERR_NGROK_9009, so the ngrok process runs in direct mode by default and
   * inherited proxy variables are stripped (both case variants). Users with
   * an ngrok Pay-as-you-go plan can opt into the resolved proxy explicitly
   * via shuncode.bridge.ngrokUseHttpProxy.
   */
  ngrokProcessEnvironment(env6) {
    if (this.ngrokUseHttpProxyEnabled()) {
      const httpConfiguration = vscode3.workspace.getConfiguration("http");
      const configuredProxy = httpConfiguration.get("proxy")?.trim();
      const proxyUrl = httpConfiguration.get("proxySupport") === "off" ? void 0 : resolveExtensionHostProxy(new URL("https://www.cloudflare.com/"), configuredProxy);
      if (proxyUrl) {
        env6.HTTPS_PROXY = proxyUrl;
        env6.HTTP_PROXY = proxyUrl;
        this.output.appendLine("[bridge] ngrok process will use the resolved HTTP proxy (shuncode.bridge.ngrokUseHttpProxy); this requires an ngrok Pay-as-you-go plan.");
      } else {
        this.output.appendLine("[bridge] shuncode.bridge.ngrokUseHttpProxy is enabled, but no HTTP proxy was resolved; the ngrok process will connect directly.");
      }
      return env6;
    }
    for (const key of Object.keys(env6)) {
      if (/^(https?|all)_proxy$/i.test(key)) delete env6[key];
    }
    this.output.appendLine("[bridge] ngrok process will connect directly; inherited proxy variables were removed (ngrok Free rejects HTTP proxies with ERR_NGROK_9009).");
    return env6;
  }
  ngrokUseHttpProxyEnabled() {
    return vscode3.workspace.getConfiguration("shuncode").get(NGROK_USE_HTTP_PROXY_SETTING, false) === true;
  }
  startTunnelProcess() {
    if (this.stoppingResources || this.stopTunnelProcessInFlight) {
      throw new Error("Bridge is stopping; refusing to start a new tunnel process.");
    }
    if (this.tunnelProcess) {
      throw new Error("A Bridge tunnel process is still active; wait for it to exit before starting another.");
    }
    if (!this.currentLocalPort()) throw new Error("Bridge local HTTP port is unavailable.");
    const isCloudflare = this.tunnelProvider === "cloudflare" || this.tunnelProvider === "cloudflare-named";
    const command = isCloudflare ? this.cloudflaredExecutable : this.ngrokExecutable;
    const commandLabel = isCloudflare ? "cloudflared" : "ngrok";
    const args = this.tunnelProvider === "cloudflare" ? ["tunnel", "--url", `http://127.0.0.1:${this.currentLocalPort()}`] : this.tunnelProvider === "cloudflare-named" ? ["tunnel", "run"] : ["http", String(this.currentLocalPort()), "--url", `https://${this.configuredDomain}`, "--log=stdout", "--log-format=json"];
    const child = (0, import_node_child_process7.spawn)(command, args, {
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe"],
      env: this.tunnelProcessEnvironment()
    });
    this.tunnelProcess = child;
    this.recordOwnedTunnel(child.pid);
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", chunk => this.output.append(`[${commandLabel}] ${String(chunk)}`));
    child.stderr.on("data", chunk => this.output.append(`[${commandLabel}] ${String(chunk)}`));
    child.on("error", error2 => {
      if (this.tunnelProcess !== child || this.stopTunnelProcessInFlight) return;
      this.output.appendLine(`[${commandLabel}] process error: ${error2.message}`);
      this.lastError = error2.message;
      if (!this.stoppingResources && this.mcpTransport.isListening() && this.state === "running") {
        if (this.tunnelProvider === "cloudflare") this.domain = "";
        this.state = "starting";
        this.revision += 1;
        const generation = this.tunnelGeneration;
        void this.stopTunnelProcess().then(() => {
          if (generation === this.tunnelGeneration && !this.stoppingResources && this.mcpTransport.isListening()) this.beginTunnelRecovery();
        }).catch(stopError => {
          if (generation !== this.tunnelGeneration || this.stoppingResources) return;
          this.state = "error";
          this.lastError = stopError instanceof Error ? stopError.message : String(stopError);
          this.revision += 1;
        });
      }
    });
    child.on("exit", (code, signal) => {
      if (this.tunnelProcess !== child || this.stopTunnelProcessInFlight) return;
      this.tunnelProcess = void 0;
      if (!this.stoppingResources && this.mcpTransport.isListening() && this.state === "running") {
        const message = `${commandLabel} exited unexpectedly (code=${String(code)}, signal=${String(signal)}); reconnecting without stopping the local MCP server.`;
        this.output.appendLine(`[bridge] ${message}`);
        this.lastError = message;
        if (this.tunnelProvider === "cloudflare") this.domain = "";
        this.state = "starting";
        this.revision += 1;
        this.beginTunnelRecovery();
      }
    });
    return child;
  }
  async waitForTunnelStartup(child) {
    await new Promise((resolve, reject) => {
      let settled = false;
      let output = "";
      let quickTunnelUrlReceived = false;
      let quickTunnelEdgeRegistered = false;
      const cleanup = () => {
        clearTimeout(timer);
        child.off("exit", onExit);
        child.off("error", onError);
        child.stdout.off("data", onData);
        child.stderr.off("data", onData);
      };
      const finish = error2 => {
        if (settled) return;
        settled = true;
        cleanup();
        if (error2) reject(error2);else resolve();
      };
      const onExit = (code, signal) => {
        const detail = output.trim().slice(-4e3);
        finish(new Error(`${this.tunnelProvider} tunnel exited during startup (code=${String(code)}, signal=${String(signal)}).${detail ? ` ${detail}` : ""}`));
      };
      const onError = error2 => finish(error2);
      const onData = chunk => {
        output = `${output}${String(chunk)}`.slice(-16e3);
        const lower = output.toLowerCase();
        if (this.tunnelProvider === "cloudflare") {
          const matches = output.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/ig);
          const tunnelUrl = matches?.find(candidate => new URL(candidate).hostname.toLowerCase() !== "api.trycloudflare.com");
          if (tunnelUrl) {
            this.domain = new URL(tunnelUrl).hostname.toLowerCase();
            this.revision += 1;
            quickTunnelUrlReceived = true;
          }
          if (lower.includes("registered tunnel connection") || lower.includes("connection registered")) {
            quickTunnelEdgeRegistered = true;
          }
          if (quickTunnelUrlReceived && quickTunnelEdgeRegistered) {
            finish();
          }
          return;
        }
        if (this.tunnelProvider === "cloudflare-named") {
          if (lower.includes("invalid tunnel token") || lower.includes("failed to parse token") || lower.includes("authentication failed") || lower.includes("unauthorized")) {
            finish(new Error(`Cloudflare Named Tunnel authentication failed. Rotate or recopy the Tunnel Token. ${output.trim().slice(-4e3)}`));
            return;
          }
          if (lower.includes("registered tunnel connection") || lower.includes("connection registered") || lower.includes("initial protocol")) {
            finish();
          }
          return;
        }
        if (lower.includes('"msg":"started tunnel"') && lower.includes(this.configuredDomain.toLowerCase())) {
          finish();
          return;
        }
        if (lower.includes("err_ngrok_9009") || lower.includes("pay-as-you-go")) {
          finish(new Error(`ngrok cannot run through an HTTP/S proxy on the Free plan (ERR_NGROK_9009). Bridge starts ngrok with proxy variables removed, so check the ngrok config file (for example %LOCALAPPDATA%\\ngrok\\ngrok.yml) for a proxy_url entry and remove it, switch the proxy client to TUN mode with the system proxy off, or upgrade ngrok to a Pay-as-you-go plan and set shuncode.bridge.ngrokUseHttpProxy to reuse this proxy. ${output.trim().slice(-2e3)}`));
          return;
        }
        if (lower.includes("err_ngrok_") || lower.includes("endpoint is already online") || lower.includes("failed to start tunnel")) {
          finish(new Error(`ngrok failed to establish the reserved domain. ${output.trim().slice(-4e3)}`));
        }
      };
      child.once("exit", onExit);
      child.once("error", onError);
      child.stdout.on("data", onData);
      child.stderr.on("data", onData);
      const timer = setTimeout(() => {
        if (this.tunnelProvider === "cloudflare") {
          const reason = quickTunnelUrlReceived ? "cloudflared created a trycloudflare.com URL but did not register a Cloudflare edge connection within 120 seconds" : "cloudflared did not provide a trycloudflare.com URL within 120 seconds";
          finish(new Error(`${reason}.${cloudflaredEdgeFailureHint(output)} ${output.trim().slice(-4e3)}`));
        } else {
          finish();
        }
      }, this.tunnelProvider === "cloudflare" ? 12e4 : 5e3);
    });
  }
  publicHealthUrl() {
    return `https://${this.domain}/healthz/${this.routeToken}`;
  }
  async requestPublicHealth(totalTimeoutMs = PUBLIC_HEALTH_REQUEST_TIMEOUT_MS * 3) {
    try {
      const url2 = new URL(this.publicHealthUrl());
      const headers = this.tunnelProvider === "ngrok" ? {
        "ngrok-skip-browser-warning": "true"
      } : void 0;
      const httpConfiguration = vscode3.workspace.getConfiguration("http");
      const configuredProxy = httpConfiguration.get("proxy")?.trim();
      const proxySupport = httpConfiguration.get("proxySupport");
      const proxyUrl = proxySupport === "off" ? void 0 : resolveExtensionHostProxy(url2, configuredProxy);
      const boundedTimeoutMs = Math.max(1e3, Math.min(totalTimeoutMs, PUBLIC_HEALTH_REQUEST_TIMEOUT_MS * 3));
      const response = await fetchWithExtensionHostFallbacks(url2, {
        method: "GET",
        headers,
        signal: AbortSignal.timeout(boundedTimeoutMs),
        proxyUrl,
        configuredProxy,
        rejectUnauthorized: httpConfiguration.get("proxyStrictSSL", true),
        useElectron: proxySupport !== "off",
        proxySupport: proxySupport === "off" ? "off" : void 0,
        attemptTimeoutMs: Math.min(PUBLIC_HEALTH_REQUEST_TIMEOUT_MS, boundedTimeoutMs)
      });
      if (!response.ok) {
        return {
          ok: false,
          failure: {
            reason: `HTTP ${response.status} ${response.statusText ?? ""}`.trim(),
            code: `HTTP_${response.status}`,
            status: response.status,
            deterministic: false
          }
        };
      }
      const payload = await response.json().catch(() => void 0);
      return payload?.ok === true ? {
        ok: true
      } : {
        ok: false,
        failure: {
          reason: "health response did not confirm ok",
          status: response.status,
          deterministic: false
        }
      };
    } catch (error2) {
      return {
        ok: false,
        failure: publicHealthFailure(error2)
      };
    }
  }
  async waitForPublicHealth(child) {
    const configuredTimeout = vscode3.workspace.getConfiguration("shuncode").get(PUBLIC_HEALTH_STARTUP_TIMEOUT_SETTING, DEFAULT_PUBLIC_HEALTH_STARTUP_TIMEOUT_MS);
    const timeoutMs = typeof configuredTimeout === "number" && Number.isFinite(configuredTimeout) ? Math.min(Math.max(configuredTimeout, 5e3), 12e4) : DEFAULT_PUBLIC_HEALTH_STARTUP_TIMEOUT_MS;
    const deadline = Date.now() + timeoutMs;
    let consecutiveDeterministicFailures = 0;
    while (Date.now() < deadline) {
      if (child.exitCode !== null || child.signalCode !== null || this.tunnelProcess !== child) {
        throw new Error(`${this.tunnelProvider} tunnel exited before the public Bridge health endpoint became reachable.`);
      }
      const result = await this.requestPublicHealth(Math.max(1e3, deadline - Date.now()));
      if (result.ok) return;
      consecutiveDeterministicFailures = result.failure.deterministic ? consecutiveDeterministicFailures + 1 : 0;
      if (result.failure.deterministic && consecutiveDeterministicFailures >= PUBLIC_HEALTH_DETERMINISTIC_FAILURE_LIMIT) {
        throw new Error(this.publicHealthUnreachableMessage(result.failure));
      }
      await new Promise(resolve => setTimeout(resolve, PUBLIC_HEALTH_POLL_INTERVAL_MS));
    }
    if (this.tunnelProvider === "cloudflare-named") {
      throw new Error(`Cloudflare Named Tunnel connected, but ${this.publicHealthUrl()} could not reach Bridge. In Cloudflare Tunnels, set the published application hostname to ${this.configuredNamedDomain} and its Service URL to http://127.0.0.1:${this.namedTunnelLocalPort}.`);
    }
    throw new Error(`Public Bridge health check timed out after ${Math.round(timeoutMs / 1e3)} seconds: ${this.publicHealthUrl()}`);
  }
  publicHealthUnreachableMessage(failure) {
    const httpConfiguration = vscode3.workspace.getConfiguration("http");
    const hasProxy = Boolean(httpConfiguration.get("proxy")?.trim() || process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy);
    const guidance = hasProxy ? "The health request was routed through the configured HTTP proxy and still failed. Verify the proxy can reach Cloudflare, or enable a system/global (TUN) proxy." : "This machine cannot reach the public endpoint directly. Set http.proxy to a working HTTP proxy or enable a system/global (TUN) proxy so the health check can route around the block.";
    return `Public Bridge health endpoint unreachable: ${this.publicHealthUrl()} (${failure.reason}). ${guidance}`;
  }
  /** True only for ngrok's "endpoint is already online" (stale edge session after a restart). */
  isEndpointAlreadyOnlineFailure(error2) {
    if (this.tunnelProvider !== "ngrok") return false;
    const message = (error2 instanceof Error ? error2.message : String(error2)).toLowerCase();
    return message.includes("err_ngrok_334") || message.includes("is already online");
  }
  async startTunnelOnce() {
    const generation = this.tunnelGeneration;
    for (let attempt = 0;; attempt++) {
      const child = this.startTunnelProcess();
      try {
        await this.waitForTunnelStartup(child);
        if (this.tunnelProvider === "cloudflare") {
          this.output.appendLine(`[bridge] quick tunnel URL received and Cloudflare edge connection registered; local health is ready and public health is not used as a startup gate: ${this.publicHealthUrl()}`);
        } else if (this.tunnelProvider === "ngrok") {
          this.output.appendLine(`[bridge] ngrok reserved endpoint started; local health is ready and public health is not used as a startup gate: ${this.publicHealthUrl()}`);
        } else {
          await this.waitForPublicHealth(child);
          this.output.appendLine(`[bridge] public health verified: ${this.publicHealthUrl()}`);
        }
        if (this.tunnelProcess !== child) throw new Error(`${this.tunnelProvider} tunnel changed before health verification completed.`);
        return;
      } catch (error2) {
        if (this.tunnelProcess === child) await this.stopTunnelProcess();else this.clearOwnedTunnelRecord();
        if (this.tunnelProvider === "cloudflare" && attempt < 2 && /did not register a Cloudflare edge connection within 120 seconds/.test(error2 instanceof Error ? error2.message : String(error2))) {
          if (generation !== this.tunnelGeneration || this.stoppingResources || this.disposed) throw error2;
          this.lastError = `Cloudflare edge connection timed out; retry ${attempt + 1}/2 in 5 seconds. Check tunnel network reachability if this persists.`;
          this.revision += 1;
          this.output.appendLine(`[bridge] ${this.lastError}`);
          await new Promise(resolve => setTimeout(resolve, 5e3));
          if (generation !== this.tunnelGeneration || this.stoppingResources || this.disposed) throw error2;
          continue;
        }
        if (!this.isEndpointAlreadyOnlineFailure(error2) || attempt >= NGROK_ENDPOINT_ONLINE_RETRY_BACKOFF_MS.length) {
          if (this.isEndpointAlreadyOnlineFailure(error2)) {
            const detail = error2 instanceof Error ? error2.message : String(error2);
            throw new Error(`${detail} The ngrok endpoint is still held by another agent session; check https://dashboard.ngrok.com/endpoints and stop the other agent, then retry.`);
          }
          throw error2;
        }
        if (generation !== this.tunnelGeneration || this.stoppingResources || this.disposed) throw error2;
        const delayMs = NGROK_ENDPOINT_ONLINE_RETRY_BACKOFF_MS[attempt] ?? 3e4;
        const total = NGROK_ENDPOINT_ONLINE_RETRY_BACKOFF_MS.length + 1;
        this.lastError = `${error2 instanceof Error ? error2.message : String(error2)} Retrying in ${Math.round(delayMs / 1e3)}s (attempt ${attempt + 2}/${total}).`;
        this.revision += 1;
        this.output.appendLine(`[bridge] ngrok endpoint is still online (a previous agent session has not timed out yet); retrying in ${Math.round(delayMs / 1e3)}s (attempt ${attempt + 2}/${total}).`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        if (generation !== this.tunnelGeneration || this.stoppingResources || this.disposed) throw error2;
      }
    }
  }
  /** Wait for the exact owned tunnel child to exit before releasing ownership. */
  async stopTunnelProcess() {
    if (this.stopTunnelProcessInFlight) return this.stopTunnelProcessInFlight;
    const child = this.tunnelProcess;
    if (!child) {
      this.clearOwnedTunnelRecord();
      return;
    }
    const run = Promise.resolve().then(() => this.terminateOwnedTunnelProcess(child));
    this.stopTunnelProcessInFlight = run;
    try {
      await run;
      if (this.tunnelProcess === child) this.tunnelProcess = void 0;
      this.clearOwnedTunnelRecord();
    } finally {
      if (this.stopTunnelProcessInFlight === run) this.stopTunnelProcessInFlight = void 0;
    }
  }
  /**
   * Close only OUR ngrok tunnels via the local agent API, matched by local
   * port (a foreign agent on 4040 is left alone). Never throws: any failure
   * falls through to process termination.
   */
  async closeOwnedNgrokTunnelsGracefully() {
    const localPort = this.currentLocalPort();
    if (!localPort) return;
    let tunnels;
    try {
      const response = await fetch(`${NGROK_AGENT_API_BASE_URL}/api/tunnels`, {
        signal: AbortSignal.timeout(NGROK_AGENT_API_TIMEOUT_MS)
      });
      if (!response.ok) return;
      const payload = await response.json().catch(() => void 0);
      tunnels = Array.isArray(payload?.tunnels) ? payload.tunnels : [];
    } catch {
      return;
    }
    for (const entry of tunnels) {
      const tunnel = entry;
      const name = typeof tunnel?.name === "string" ? tunnel.name : "";
      const addr = typeof tunnel?.config?.addr === "string" ? tunnel.config.addr : "";
      if (!name || addr !== String(localPort) && !addr.includes(`:${localPort}`)) continue;
      try {
        await fetch(`${NGROK_AGENT_API_BASE_URL}/api/tunnels/${encodeURIComponent(name)}`, {
          method: "DELETE",
          signal: AbortSignal.timeout(NGROK_AGENT_API_TIMEOUT_MS)
        });
        this.output.appendLine(`[bridge] closed ngrok tunnel '${name}' gracefully before shutdown.`);
      } catch {}
    }
  }
  async terminateOwnedTunnelProcess(child) {
    if (child.exitCode !== null || child.signalCode !== null || child.pid === void 0) return;
    if (this.tunnelProvider === "ngrok") {
      try {
        await this.closeOwnedNgrokTunnelsGracefully();
      } catch {}
    }
    return new Promise((resolve, reject) => {
      let settled = false;
      let terminateTimer;
      let killTimer;
      const finish = error2 => {
        if (settled) return;
        settled = true;
        if (terminateTimer) clearTimeout(terminateTimer);
        if (killTimer) clearTimeout(killTimer);
        child.off("exit", onExit);
        child.off("close", onExit);
        child.off("error", onError);
        if (error2) reject(error2);else resolve();
      };
      const onExit = () => finish();
      const onError = error2 => finish(error2);
      const forceKill = () => {
        if (child.exitCode !== null || child.signalCode !== null) {
          finish();
          return;
        }
        if (process.platform === "win32" && child.pid) {
          void execFileAsync2("taskkill", ["/PID", String(child.pid), "/T", "/F"], {
            windowsHide: true,
            timeout: TUNNEL_KILL_GRACE_MS
          }).catch(() => {
            try {
              child.kill("SIGKILL");
            } catch {}
          });
        } else {
          try {
            child.kill("SIGKILL");
          } catch {}
        }
        killTimer = setTimeout(() => {
          finish(new Error("Bridge tunnel process did not exit after graceful termination and force kill; its ownership is retained and a replacement will not be started."));
        }, TUNNEL_KILL_GRACE_MS);
        killTimer.unref?.();
      };
      child.once("exit", onExit);
      child.once("close", onExit);
      child.once("error", onError);
      terminateTimer = setTimeout(forceKill, TUNNEL_TERMINATE_GRACE_MS);
      terminateTimer.unref?.();
      try {
        child.kill("SIGTERM");
      } catch (error2) {
        finish(error2 instanceof Error ? error2 : new Error(String(error2)));
      }
    });
  }
  isDeterministicTunnelFailure(message) {
    if (this.tunnelProvider !== "ngrok") return false;
    const lower = message.toLowerCase();
    return lower.includes("err_ngrok_9009") || lower.includes("pay-as-you-go") || lower.includes("authentication failed");
  }
  beginTunnelRecovery() {
    if (this.stoppingResources || !this.mcpTransport.isListening()) return;
    if (this.tunnelRecoveryPromise && this.tunnelRecoveryGeneration === this.tunnelGeneration) return;
    const generation = this.tunnelGeneration;
    const recovery = async () => {
      let attempt = 0;
      while (!this.stoppingResources && this.mcpTransport.isListening() && generation === this.tunnelGeneration) {
        const delayMs = TUNNEL_RESTART_BACKOFF_MS[Math.min(attempt, TUNNEL_RESTART_BACKOFF_MS.length - 1)];
        await new Promise(resolve => setTimeout(resolve, delayMs));
        if (this.stoppingResources || !this.mcpTransport.isListening() || generation !== this.tunnelGeneration) return;
        try {
          this.output.appendLine(`[bridge] ${this.tunnelProvider} reconnect attempt ${attempt + 1}...`);
          await this.startTunnelOnce();
          if (generation !== this.tunnelGeneration || this.stoppingResources) return;
          this.state = "running";
          this.lastError = void 0;
          this.revision += 1;
          this.output.appendLine(`[bridge] ${this.tunnelProvider} tunnel recovered: ${this.getStatus().publicUrl}`);
          return;
        } catch (error2) {
          this.lastError = error2 instanceof Error ? error2.message : String(error2);
          this.output.appendLine(`[bridge] ${this.tunnelProvider} reconnect attempt ${attempt + 1} failed: ${this.lastError}`);
          if (this.isDeterministicTunnelFailure(this.lastError)) {
            this.output.appendLine(`[bridge] ${this.tunnelProvider} stopped reconnecting: this failure is deterministic and will not resolve by retrying.`);
            return;
          }
          attempt += 1;
        }
      }
    };
    let trackedRecovery;
    trackedRecovery = recovery().finally(() => {
      if (this.tunnelRecoveryPromise === trackedRecovery) {
        this.tunnelRecoveryPromise = void 0;
        this.tunnelRecoveryGeneration = void 0;
      }
    });
    this.tunnelRecoveryGeneration = generation;
    this.tunnelRecoveryPromise = trackedRecovery;
  }
  takeToolCallsSinceLastReport() {
    return this.dispatcher.takeToolCallsSinceLastReport();
  }
  returnToolCallsSinceLastReport(count) {
    this.dispatcher.returnToolCallsSinceLastReport(count);
  }
  /** Master switch for Agent Skills; JSON manifests are never affected. */
  skillsEnabled() {
    return vscode3.workspace.getConfiguration("shuncode").get(BRIDGE_SKILLS_ENABLED_SETTING, true);
  }
  workspaceRoots() {
    const roots = vscode3.workspace.workspaceFolders?.map(folder => folder.uri.fsPath) ?? [];
    if (!roots.length) throw new Error("No workspace folder is open.");
    return roots;
  }
  async stop() {
    if (this.stopPromise) return this.stopPromise;
    this.lifecycleGeneration += 1;
    const pendingStart = this.startPromise;
    const run = (async () => {
      await this.stopResources(true);
      if (pendingStart) {
        await pendingStart.catch(() => void 0);
        await this.stopResources(true);
      }
      return this.getStatus();
    })();
    this.stopPromise = run;
    try {
      return await run;
    } finally {
      if (this.stopPromise === run) this.stopPromise = void 0;
    }
  }
  async stopResources(markStopped) {
    if (!this.stoppingResources) this.tunnelGeneration += 1;
    this.stoppingResources = true;
    try {
      try {
        this.mcpTransport.destroySessionsAndStopPruning();
      } catch (error2) {
        this.output.appendLine(`[bridge] session teardown failed during stop (continuing to tunnel shutdown): ${error2 instanceof Error ? error2.message : String(error2)}`);
      }
      await this.stopTunnelProcess();
      await this.mcpTransport.closeListener();
      if (this.releaseTunnelLease) {
        const release = this.releaseTunnelLease;
        this.releaseTunnelLease = void 0;
        try {
          await release();
        } catch (error2) {
          this.output.appendLine(`[bridge] tunnel lease release failed during stop (continuing): ${error2 instanceof Error ? error2.message : String(error2)}`);
        }
      }
      if (this.tunnelProvider === "cloudflare") this.domain = "";
      if (markStopped) {
        this.state = "stopped";
        this.lastError = void 0;
        this.output.appendLine("[bridge] stopped");
      }
    } catch (error2) {
      this.state = "error";
      this.lastError = error2 instanceof Error ? error2.message : String(error2);
      throw error2;
    } finally {
      this.stoppingResources = false;
    }
  }
  async disposeAsync() {
    this.disposed = true;
    await this.stopResources(true);
  }
  dispose() {
    this.disposed = true;
    void this.stopResources(true).catch(error2 => {
      this.output.appendLine(`[bridge] shutdown failed: ${error2 instanceof Error ? error2.message : String(error2)}`);
    });
  }
};

// extensions/shuncode/src/config.ts
export { import_node_child_process7, import_node_path14, import_node_util2, vscode3, execFileAsync2, NGROK_DOMAIN_SETTING, NGROK_DOMAIN_STATE_KEY, CLOUDFLARE_NAMED_DOMAIN_SETTING, CLOUDFLARE_NAMED_DOMAIN_STATE_KEY, CLOUDFLARE_NAMED_TOKEN_SECRET, CLOUDFLARE_NAMED_LOCAL_PORT_SETTING, TUNNEL_PROVIDER_SETTING, CUSTOM_INSTRUCTIONS_SETTING, BRIDGE_SKILLS_ENABLED_SETTING, BRIDGE_WORKSPACE_SCOPE_SETTING, NGROK_USE_HTTP_PROXY_SETTING, DEFAULT_PUBLIC_HEALTH_STARTUP_TIMEOUT_MS, PUBLIC_HEALTH_STARTUP_TIMEOUT_SETTING, PUBLIC_HEALTH_REQUEST_TIMEOUT_MS, PUBLIC_HEALTH_POLL_INTERVAL_MS, PUBLIC_HEALTH_DETERMINISTIC_FAILURE_LIMIT, TUNNEL_RESTART_BACKOFF_MS, TUNNEL_TERMINATE_GRACE_MS, TUNNEL_KILL_GRACE_MS, NGROK_AGENT_API_BASE_URL, NGROK_AGENT_API_TIMEOUT_MS, NGROK_ENDPOINT_ONLINE_RETRY_BACKOFF_MS, CLOUDFLARED_WINGET_PACKAGE, DEFAULT_CLOUDFLARE_NAMED_LOCAL_PORT, publicHealthFailure, cloudflaredEdgeFailureHint, bridgeWorkspaceScopeInstructions, normalizeHttpsHostname, normalizeNgrokDomain, normalizeCloudflareNamedDomain, normalizeNamedTunnelLocalPort, cancellationFromAbortSignal, BridgeManager };
