// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { __export, __toCommonJS, __toESM } from "../../../runtime/helpers.mjs";
import { init_define_SHUNCODE_BUILD_INFO } from "../../../runtime/build-info.mjs";
import { BridgeAccessController } from "./bridge-access-controller.mjs";
import { BridgeLicenseService } from "./bridge-license-service.mjs";
import { BridgeManager } from "./bridge-server.mjs";
import { configureShunCodeModel, setShunCodeApiKey } from "./config.mjs";
import { codexAuthManager, onCodexAuthChange } from "./codex-auth.mjs";
import { BranchStateStore } from "./branch-state.mjs";
import { registerShunCodeCustomAgents } from "./custom-agents.mjs";
import { IdeToolBroker } from "./ide-tool-broker.mjs";
import { ShunCodeLanguageModelProvider } from "./model-provider.mjs";
import { registerShunCodeNativeChat } from "./native-chat.mjs";
import { RuntimeClient } from "./runtime-client.mjs";
import { WorkspaceHubController } from "./workspace-hub.mjs";
// extensions/shuncode/src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
init_define_SHUNCODE_BUILD_INFO();
var vscode16 = __toESM(require("vscode"));

// extensions/shuncode/src/bridge-access-controller.ts

// extensions/shuncode/src/extension.ts
var activeBridge;
var activeWorkspaceHub;
function bridgeWorkspaceUri(relativePath) {
  const folder = vscode16.workspace.workspaceFolders?.[0];
  if (!folder) throw new Error("No workspace folder is open.");
  const normalized = relativePath.trim().replace(/\\/g, "/").replace(/^\.\//, "");
  if (!normalized || normalized === "." || normalized.startsWith("../") || normalized.includes("/../") || normalized.startsWith("/")) {
    throw new Error(`Invalid Bridge workspace path: ${relativePath}`);
  }
  return vscode16.Uri.joinPath(folder.uri, ...normalized.split("/").filter(Boolean));
}
function bridgeDiffSnippet(diff, filePath) {
  const lines = diff.split(/\r?\n/);
  let active = !filePath;
  const before = [];
  const after = [];
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.startsWith("--- ")) {
      const oldPath = line.slice(4).replace(/^a\//, "");
      const next = lines[index + 1]?.startsWith("+++ ") ? lines[index + 1].slice(4).replace(/^b\//, "") : "";
      active = !filePath || oldPath === filePath || next === filePath;
      continue;
    }
    if (!active || line.startsWith("+++ ") || line.startsWith("@@") || line === "\\ No newline at end of file") continue;
    if (line.startsWith("-")) before.push(line.slice(1));else if (line.startsWith("+")) after.push(line.slice(1));else if (line.startsWith(" ")) {
      before.push(line.slice(1));
      after.push(line.slice(1));
    }
  }
  return {
    before: before.join("\n"),
    after: after.join("\n")
  };
}
function activate(context) {
  const output = vscode16.window.createOutputChannel("ShunCode");
  const ideToolBroker = new IdeToolBroker();
  const bridgeLicense = new BridgeLicenseService(context, output);
  const authorizeBridgeStart = async () => {
    const developmentSmokeBypass = context.extensionMode === vscode16.ExtensionMode.Development && process.env.SHUNCODE_BRIDGE_LICENSE_SMOKE_BYPASS === "1";
    if (developmentSmokeBypass) {
      output.appendLine("[bridge-license] development smoke authorization bypass enabled");
      return;
    }
    await bridgeLicense.requireFeature("bridge");
  };
  const bridge = new BridgeManager(context, output, ideToolBroker, authorizeBridgeStart);
  const bridgeAccess = new BridgeAccessController(bridgeLicense, bridge, output);
  activeBridge = bridge;
  const bridgeReady = bridge.initialize();
  const bridgeLicenseReady = bridgeLicense.initialize();
  const workspaceHub = new WorkspaceHubController(context, bridge, output);
  activeWorkspaceHub = workspaceHub;
  const runtime = new RuntimeClient(context, output, ideToolBroker);
  const apiModelProvider = new ShunCodeLanguageModelProvider(context, "api");
  const codexModelProvider = new ShunCodeLanguageModelProvider(context, "codex");
  const branchStore = new BranchStateStore(context, output);
  const participant = registerShunCodeNativeChat(context, runtime, output, {
    shuncode: apiModelProvider,
    "shuncode-codex": codexModelProvider
  }, branchStore);
  const customAgents = registerShunCodeCustomAgents(context);
  const customAgentDiscoveryCts = new vscode16.CancellationTokenSource();
  context.subscriptions.push(output, ideToolBroker, bridgeLicense, bridgeAccess, bridge, workspaceHub, runtime, apiModelProvider, codexModelProvider, branchStore, participant, customAgents, customAgentDiscoveryCts, vscode16.lm.registerLanguageModelChatProvider("shuncode", apiModelProvider), vscode16.lm.registerLanguageModelChatProvider("shuncode-codex", codexModelProvider), vscode16.workspace.onDidChangeConfiguration(event => {
    if (event.affectsConfiguration("shuncode.model")) apiModelProvider.refresh();
  }), onCodexAuthChange(() => codexModelProvider.refresh()), vscode16.commands.registerCommand("shuncode.codex.openView", async () => {
    await vscode16.commands.executeCommand("aiCustomization.openManagementEditor", "codex");
  }), vscode16.commands.registerCommand("shuncode.configureModel", async () => {
    const changed = await configureShunCodeModel(context);
    if (changed) {
      apiModelProvider.refresh();
      await vscode16.window.showInformationMessage("ShunCode model configuration saved.");
    }
  }), vscode16.commands.registerCommand("shuncode.setApiKey", () => setShunCodeApiKey(context)), vscode16.commands.registerCommand("shuncode.branch.getGroupState", async groupId => {
    if (typeof groupId !== "string" || !groupId) return void 0;
    await branchStore.ensureLoaded();
    return branchStore.getState(groupId);
  }), vscode16.commands.registerCommand("shuncode.branch.adoptVariant", async (groupId, variantId) => {
    if (typeof groupId !== "string" || typeof variantId !== "string" || !groupId || !variantId) return;
    await branchStore.ensureLoaded();
    branchStore.adopt(groupId, variantId);
  }), vscode16.commands.registerCommand("shuncode.branch.setActiveVariant", async (groupId, variantId) => {
    if (typeof groupId !== "string" || typeof variantId !== "string" || !groupId || !variantId) return;
    await branchStore.ensureLoaded();
    branchStore.setActiveVariant(groupId, variantId);
  }), vscode16.commands.registerCommand("shuncode.pickMergeModel", async () => {
    const models = await vscode16.lm.selectChatModels({
      vendor: "shuncode"
    });
    const codexModels = await vscode16.lm.selectChatModels({
      vendor: "shuncode-codex"
    });
    const all = [...models, ...codexModels];
    if (all.length === 0) {
      await vscode16.window.showWarningMessage("No ShunCode models available to pick as the merge model.");
      return;
    }
    const current = vscode16.workspace.getConfiguration("shuncode").get("multiModel.mergeModel", "");
    const picked = await vscode16.window.showQuickPick(all.map(model => ({
      label: model.name,
      description: `${model.vendor}/${model.id}`,
      detail: current === `${model.vendor}/${model.id}` ? "Current merge model" : void 0,
      vendor: model.vendor,
      id: model.id
    })), {
      title: "Multi-Model Rounds \xB7 Select Merge Model",
      placeHolder: "Select the model that verifies and summarizes the branch plans"
    });
    if (!picked) return;
    await vscode16.workspace.getConfiguration("shuncode").update("multiModel.mergeModel", `${picked.vendor}/${picked.id}`, vscode16.ConfigurationTarget.Global);
    await vscode16.window.showInformationMessage(`Merge model set to ${picked.label} (${picked.vendor}/${picked.id})`);
  }), vscode16.commands.registerCommand("shuncode.testApiEndpoint", async (input = {}) => {
    const baseUrl = typeof input?.baseUrl === "string" ? input.baseUrl.trim() : "";
    const apiKey = typeof input?.apiKey === "string" ? input.apiKey.trim() : "";
    if (!baseUrl) return {
      ok: false,
      error: "Missing API endpoint URL."
    };
    const base = baseUrl.replace(/\/+$/, "");
    const modelsUrl = base.endsWith("/models") ? base : `${base}/models`;
    try {
      const headers = {
        accept: "application/json"
      };
      if (apiKey) headers.authorization = `Bearer ${apiKey}`;
      const response = await fetch(modelsUrl, {
        headers,
        signal: AbortSignal.timeout(1e4)
      });
      if (!response.ok) return {
        ok: false,
        error: `HTTP ${response.status} ${response.statusText}`
      };
      const payload = await response.json();
      const data = payload && typeof payload === "object" && !Array.isArray(payload) ? payload.data : void 0;
      const models = Array.isArray(data) ? data : Array.isArray(payload) ? payload : [];
      return {
        ok: true,
        count: models.length
      };
    } catch (error2) {
      return {
        ok: false,
        error: error2 instanceof Error ? error2.message : String(error2)
      };
    }
  }), vscode16.commands.registerCommand("shuncode.codex.login", async () => {
    const status = await codexAuthManager.getStatus();
    if (status.signedIn) {
      await vscode16.window.showWarningMessage(`Already signed in to Codex as ${status.account?.email ?? status.account?.accountId}. Sign out first to switch accounts.`, "OK");
      return;
    }
    try {
      await vscode16.window.withProgress({
        location: vscode16.ProgressLocation.Notification,
        title: "Codex sign-in: complete the authorization in your browser\u2026",
        cancellable: true
      }, async (_progress, progressToken) => {
        const account = await codexAuthManager.startLogin(progressToken);
        codexModelProvider.refresh();
        await vscode16.window.showInformationMessage(`Signed in to Codex as ${account.email ?? account.accountId}${account.planType ? ` (${account.planType})` : ""}. Codex models are now available in the Chat model picker.`);
      });
    } catch (error2) {
      if (error2 instanceof vscode16.CancellationError) return;
      await vscode16.window.showErrorMessage(`Codex sign-in failed: ${error2 instanceof Error ? error2.message : String(error2)}`);
    }
  }), vscode16.commands.registerCommand("shuncode.codex.logout", async () => {
    const status = await codexAuthManager.getStatus();
    if (!status.signedIn) {
      await vscode16.window.showInformationMessage("Not signed in to Codex.");
      return;
    }
    const choice = await vscode16.window.showWarningMessage(`Sign out of Codex as ${status.account?.email ?? status.account?.accountId}? This also signs out the official Codex CLI.`, {
      modal: true
    }, "Sign Out");
    if (choice !== "Sign Out") return;
    try {
      await codexAuthManager.signOut();
      codexModelProvider.refresh();
      await vscode16.window.showInformationMessage("Signed out of Codex.");
    } catch (error2) {
      await vscode16.window.showErrorMessage(`Failed to sign out of Codex: ${error2 instanceof Error ? error2.message : String(error2)}`);
    }
  }), vscode16.commands.registerCommand("shuncode.codex.relogin", async () => {
    const status = await codexAuthManager.getStatus();
    if (status.signedIn) {
      const choice = await vscode16.window.showWarningMessage(`Sign in to Codex again as a different account? This signs out ${status.account?.email ?? status.account?.accountId} and the official Codex CLI first.`, {
        modal: true
      }, "Sign In Again");
      if (choice !== "Sign In Again") return;
      try {
        await codexAuthManager.signOut();
      } catch (error2) {
        await vscode16.window.showErrorMessage(`Failed to prepare Codex sign-in: ${error2 instanceof Error ? error2.message : String(error2)}`);
        return;
      }
    }
    await vscode16.commands.executeCommand("shuncode.codex.login");
  }), vscode16.commands.registerCommand("shuncode.codex.getStatus", () => codexAuthManager.getStatus()), vscode16.commands.registerCommand("shuncode.codex.status", async () => {
    const status = await codexAuthManager.getStatus();
    if (!status.signedIn) {
      await vscode16.window.showInformationMessage("Not signed in to Codex. Run 'ShunCode: Sign in with Codex' to use ChatGPT subscription models.");
      return;
    }
    const account = status.account;
    const expiry = status.expiresAt ? new Date(status.expiresAt * 1e3).toLocaleString() : void 0;
    await vscode16.window.showInformationMessage(`Signed in to Codex as ${account?.email ?? account?.accountId}${account?.planType ? ` \xB7 ${account.planType}` : ""}${expiry ? ` \xB7 access token expires ${expiry}` : ""}.`);
  }), vscode16.commands.registerCommand("shuncode.restartRuntime", async () => {
    try {
      const hello = await runtime.restart();
      await vscode16.window.showInformationMessage(`ShunCode Runtime restarted \xB7 pid ${hello.pid} \xB7 protocol ${hello.protocolVersion} \xB7 ${hello.tools.length} tools`);
    } catch (error2) {
      await vscode16.window.showErrorMessage(`Failed to restart ShunCode Runtime: ${error2 instanceof Error ? error2.message : String(error2)}`);
    }
  }), vscode16.commands.registerCommand("shuncode.showRuntimeStatus", async () => {
    try {
      const hello = await runtime.hello();
      await vscode16.window.showInformationMessage(`ShunCode Runtime connected \xB7 pid ${hello.pid} \xB7 protocol ${hello.protocolVersion} \xB7 ${hello.tools.length} tools`);
    } catch (error2) {
      await vscode16.window.showErrorMessage(`ShunCode Runtime unavailable: ${error2 instanceof Error ? error2.message : String(error2)}`);
    }
  }), vscode16.commands.registerCommand("shuncode.openChat", async () => {
    await vscode16.commands.executeCommand("workbench.action.chat.open");
    await vscode16.commands.executeCommand("_shuncode.bridge.showChat");
  }), vscode16.commands.registerCommand("shuncode.bridge.openSession", async () => {
    await vscode16.commands.executeCommand("workbench.action.chat.open");
    await vscode16.commands.executeCommand("_shuncode.bridge.showSession");
  }), vscode16.commands.registerCommand("shuncode.bridge.getStatus", async () => {
    await bridgeReady;
    return bridge.getStatus();
  }), vscode16.commands.registerCommand("shuncode.bridge.access.getStatus", async () => {
    await bridgeLicenseReady;
    return bridgeAccess.getAccessStatus();
  }), vscode16.commands.registerCommand("shuncode.bridge.license.signIn", async () => {
    await bridgeLicenseReady;
    return bridgeAccess.signIn();
  }), vscode16.commands.registerCommand("shuncode.bridge.license.signInWithGitee", async () => {
    await bridgeLicenseReady;
    return bridgeAccess.signInWithGitee();
  }), vscode16.commands.registerCommand("shuncode.bridge.license.refresh", async () => {
    await bridgeLicenseReady;
    return bridgeAccess.refresh();
  }), vscode16.commands.registerCommand("shuncode.bridge.license.refreshSession", async () => {
    await bridgeLicenseReady;
    return bridgeAccess.refreshSession();
  }), vscode16.commands.registerCommand("shuncode.bridge.license.signOut", async () => {
    await bridgeLicenseReady;
    await vscode16.workspace.getConfiguration("shuncode.bridge").update("persistentMode", false, vscode16.ConfigurationTarget.Global);
    return bridgeAccess.signOut();
  }), vscode16.commands.registerCommand("shuncode.bridge.license.redeem", async value => {
    await bridgeLicenseReady;
    if (typeof value !== "string") throw new Error("Bridge activation code must be a string.");
    return bridgeAccess.redeem(value);
  }), vscode16.commands.registerCommand("shuncode.bridge.payment.getPlans", async force => {
    await bridgeLicenseReady;
    return bridgeAccess.loadPlans(force === true);
  }), vscode16.commands.registerCommand("shuncode.bridge.payment.createOrder", async (planId, paymentType) => {
    await bridgeLicenseReady;
    if (typeof planId !== "string") throw new Error("Bridge payment plan is required.");
    if (paymentType !== void 0 && typeof paymentType !== "string") throw new Error("Bridge payment type must be a string.");
    return bridgeAccess.createPayment(planId, paymentType ?? "alipay");
  }), vscode16.commands.registerCommand("shuncode.bridge.payment.getOrder", async orderId => {
    await bridgeLicenseReady;
    if (orderId !== void 0 && typeof orderId !== "string") throw new Error("Bridge payment order ID must be a string.");
    return bridgeAccess.getPaymentOrder(orderId ?? "");
  }), vscode16.commands.registerCommand("shuncode.bridge.openResource", async value => {
    const input = value && typeof value === "object" ? value : {};
    if (typeof input.path !== "string") throw new Error("Bridge resource path is required.");
    const uri = bridgeWorkspaceUri(input.path);
    if (input.folder === true) {
      await vscode16.commands.executeCommand("revealInExplorer", uri);
      return;
    }
    const line = typeof input.line === "number" && input.line > 0 ? input.line : 1;
    const column = typeof input.column === "number" && input.column > 0 ? input.column : 1;
    const position = new vscode16.Position(line - 1, column - 1);
    await vscode16.window.showTextDocument(uri, {
      preview: true,
      selection: new vscode16.Range(position, position)
    });
  }), vscode16.commands.registerCommand("shuncode.bridge.openDiff", async value => {
    const input = value && typeof value === "object" ? value : {};
    if (typeof input.diff !== "string" || !input.diff.trim()) throw new Error("Bridge diff content is required.");
    const filePath = typeof input.path === "string" ? input.path : void 0;
    const snippet = bridgeDiffSnippet(input.diff, filePath);
    const before = await vscode16.workspace.openTextDocument({
      content: snippet.before
    });
    const after = await vscode16.workspace.openTextDocument({
      content: snippet.after
    });
    await vscode16.commands.executeCommand("vscode.diff", before.uri, after.uri, `${filePath ?? "Bridge edit"} \xB7 Before \u2194 After`, {
      preview: true
    });
  }), vscode16.commands.registerCommand("shuncode.bridge.openTerminal", async terminalId => {
    if (typeof terminalId !== "string" || !terminalId) throw new Error("Bridge terminal id is required.");
    if (!ideToolBroker.revealTerminal(terminalId)) {
      await vscode16.window.showInformationMessage("That ShunCode terminal is no longer available.");
    }
  }), vscode16.commands.registerCommand("shuncode.bridge.configure", async domain => {
    await bridgeReady;
    if (typeof domain !== "string") throw new Error("Bridge ngrok domain must be a string.");
    return bridge.configure(domain);
  }), vscode16.commands.registerCommand("shuncode.bridge.configureNamedTunnel", async value => {
    await bridgeReady;
    const input = value && typeof value === "object" ? value : {};
    if (typeof input.domain !== "string") throw new Error("Cloudflare Named Tunnel hostname must be a string.");
    if (input.token !== void 0 && typeof input.token !== "string") throw new Error("Cloudflare Tunnel Token must be a string.");
    if (typeof input.localPort !== "number") throw new Error("Cloudflare Named Tunnel local port must be a number.");
    return bridge.configureNamedTunnel({
      domain: input.domain,
      token: input.token,
      localPort: input.localPort
    });
  }), vscode16.commands.registerCommand("shuncode.bridge.clearNamedTunnelToken", async () => {
    await bridgeReady;
    return bridge.clearNamedTunnelToken();
  }), vscode16.commands.registerCommand("shuncode.bridge.setTunnelProvider", async provider => {
    await bridgeReady;
    if (typeof provider !== "string") throw new Error("Bridge tunnel provider must be a string.");
    return bridge.setTunnelProvider(provider);
  }), vscode16.commands.registerCommand("shuncode.bridge.start", async domain => {
    await Promise.all([bridgeReady, bridgeLicenseReady]);
    if (domain !== void 0 && typeof domain !== "string") throw new Error("Bridge domain must be a string.");
    const status = await bridgeAccess.start(domain);
    await vscode16.commands.executeCommand("workbench.action.chat.open");
    await vscode16.commands.executeCommand("_shuncode.bridge.showSession");
    return status;
  }), vscode16.commands.registerCommand("shuncode.bridge.stop", async () => {
    await bridgeReady;
    return bridgeAccess.stop();
  }), vscode16.commands.registerCommand("shuncode.bridge.cleanupProcesses", async () => {
    await bridgeReady;
    return bridge.cleanupOrphanTunnel();
  }), vscode16.commands.registerCommand("shuncode.bridge.checkNgrok", async () => {
    await bridgeReady;
    return bridge.checkNgrok();
  }), vscode16.commands.registerCommand("shuncode.bridge.checkTunnel", async () => {
    await bridgeReady;
    return bridge.checkTunnel();
  }), vscode16.commands.registerCommand("shuncode.bridge.checkHealth", async () => {
    await bridgeReady;
    return bridge.checkHealth();
  }), vscode16.commands.registerCommand("shuncode.bridge.clearActivityLog", async () => {
    await bridgeReady;
    return bridge.clearActivityLog();
  }), vscode16.commands.registerCommand("shuncode.bridge.installCloudflared", async () => {
    await bridgeReady;
    const status = await vscode16.window.withProgress({
      location: vscode16.ProgressLocation.Notification,
      title: "Installing cloudflared for ShunCode Bridge\u2026",
      cancellable: false
    }, () => bridge.installCloudflared());
    void vscode16.window.showInformationMessage(`cloudflared is ready: ${status.tunnelVersion ?? "installed"}`);
    return status;
  }), vscode16.commands.registerCommand("shuncode.bridge.rotateEndpoint", async () => {
    await bridgeReady;
    return bridge.rotateEndpoint();
  }), vscode16.commands.registerCommand("shuncode.bridge.customTools.toggle", async name => {
    await bridgeReady;
    return bridge.toggleCustomTool(typeof name === "string" && name.trim() ? name.trim() : void 0);
  }), vscode16.commands.registerCommand("shuncode.bridge.customTools.delete", async name => {
    await bridgeReady;
    return bridge.deleteCustomTool(typeof name === "string" && name.trim() ? name.trim() : void 0);
  }), vscode16.commands.registerCommand("shuncode.bridge.skills.import", async source => {
    await bridgeReady;
    if (typeof source !== "string" || !source.trim()) throw new Error("Skill source must be a non-empty path.");
    return bridge.importSkill(source.trim());
  }), vscode16.commands.registerCommand("shuncode.bridge.skills.diagnose", async () => {
    await bridgeReady;
    return bridge.diagnoseSkills();
  }), vscode16.commands.registerCommand("shuncode.bridge.skills.generateRunner", async name => {
    await bridgeReady;
    if (typeof name !== "string" || !name.trim()) throw new Error("Skill name must be a non-empty string.");
    return bridge.generateSkillRunner(name.trim());
  }));
  output.appendLine("[extension] native Chat participant registered: shuncode.agent");
  output.appendLine("[extension] native Language Model provider registered: shuncode");
  output.appendLine("[extension] first-party modes registered: ShunCode Ask, ShunCode Plan, ShunCode Code");
  output.appendLine("[extension] IDE tool broker registered: list_directory, run_command, get_command_output, cancel_command, send_command_input, get_diagnostics, lsp");
  output.appendLine("[extension] Bridge registered: Streamable HTTP MCP + Cloudflare Quick/Named Tunnel + ngrok + report_progress");
  if (vscode16.workspace.getConfiguration("shuncode.bridge").get("persistentMode", false)) {
    output.appendLine("[extension] persistent Bridge mode enabled; opening Chat and waiting for the rendered view to start Bridge");
    setTimeout(() => {
      void vscode16.commands.executeCommand("workbench.action.chat.open").then(void 0, error2 => {
        output.appendLine(`[extension] failed to open Chat for persistent Bridge mode: ${error2 instanceof Error ? error2.message : String(error2)}`);
      });
    }, 100);
  }
  if (process.env.SHUNCODE_TERMINAL_SMOKE === "1") {
    void ideToolBroker.runTerminalSmokeTest().then(result => output.appendLine(`[terminal-smoke] PASS
${result}`), error2 => output.appendLine(`[terminal-smoke] FAIL ${error2 instanceof Error ? error2.stack ?? error2.message : String(error2)}`));
  }
  if (process.env.SHUNCODE_LSP_SMOKE === "1") {
    void ideToolBroker.runLspSmokeTest().then(result => output.appendLine(`[lsp-smoke] PASS
${result}`), error2 => output.appendLine(`[lsp-smoke] FAIL ${error2 instanceof Error ? error2.stack ?? error2.message : String(error2)}`));
  }
  const bridgeSmokeDomain = process.env.SHUNCODE_BRIDGE_SMOKE_DOMAIN?.trim();
  const bridgeLocalSmoke = process.env.SHUNCODE_BRIDGE_SMOKE_LOCAL === "1";
  if (bridgeSmokeDomain || bridgeLocalSmoke) {
    void Promise.all([bridgeReady, bridgeLicenseReady]).then(() => bridgeLocalSmoke ? bridge.startLocalSmoke() : bridgeAccess.start(bridgeSmokeDomain)).then(status => output.appendLine(`[bridge-smoke] READY local=${status.localUrl ?? "missing"} public=${status.publicUrl ?? "missing"}`), error2 => output.appendLine(`[bridge-smoke] FAIL ${error2 instanceof Error ? error2.stack ?? error2.message : String(error2)}`));
  }
  void vscode16.chat.getCustomAgents(customAgentDiscoveryCts.token).then(agents => output.appendLine(`[extension] custom agents discovered: ${agents.map(agent => agent.name).join(", ") || "none"}`), error2 => output.appendLine(`[extension] custom agent discovery failed: ${error2 instanceof Error ? error2.message : String(error2)}`));
}
async function deactivate() {
  const hub = activeWorkspaceHub;
  activeWorkspaceHub = void 0;
  const bridge = activeBridge;
  activeBridge = void 0;
  let firstError;
  try {
    if (bridge) await bridge.disposeAsync();
  } catch (error2) {
    firstError = error2;
  }
  try {
    if (hub) await hub.disposeAsync();
  } catch (error2) {
    firstError ??= error2;
  }
  if (firstError) throw firstError;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
/*! Bundled license information:

@modelcontextprotocol/server/dist/src-CX2iR2pK.mjs:
  (*!
  * content-type
  * Copyright(c) 2015 Douglas Christopher Wilson
  * MIT Licensed
  *)
*/
//# sourceMappingURL=extension.js.map
export { extension_exports, vscode16, activeBridge, activeWorkspaceHub, bridgeWorkspaceUri, bridgeDiffSnippet, activate, deactivate };
