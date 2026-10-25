// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
import { __esm } from "../../../base/common/shunCodeRecoveredHelpersMain.js";
import { localize } from "../../../nls.js";
import "../../../nls.js";
import { isLinux } from "../../../base/common/platform.js";
import "../../../base/common/platform.js";
import { normalize } from "../../../base/common/path.js";
import "../../../base/common/path.js";
import { URI } from "../../../base/common/uri.js";
import "../../../base/common/uri.js";
import { Schemas } from "../../../base/common/network.js";
import { FileAccess } from "../../../base/common/network.js";
import "../../../base/common/network.js";
import { joinPath } from "../../../base/common/resources.js";
import "../../../base/common/resources.js";
import { TernarySearchTree } from "../../../base/common/ternarySearchTree.js";
import "../../../base/common/ternarySearchTree.js";
import "../common/browserView.js";
import { BrowserSessionTrust } from "./browserSessionTrust.js";
import "./browserSessionTrust.js";
import { BrowserSessionHistory } from "./browserSessionHistory.js";
import "./browserSessionHistory.js";
import { BrowserSessionPermissions } from "./browserSessionPermissions.js";
import "./browserSessionPermissions.js";
import { BrowserSessionRemote } from "./browserSessionRemote.js";
import "./browserSessionRemote.js";
// src/vs/platform/browserView/electron-main/browserSession.ts
import { session } from "electron";
function toStandardChromiumUserAgent(userAgent2) {
  if (!/\bChrome\/[^\s]+/i.test(userAgent2)) {
    return userAgent2;
  }
  return userAgent2.replace(/\s+(?:Electron|ShunCode|Code(?:-OSS)?|VSCode|VSCodium)\/[^\s]+/gi, "").replace(/\s{2,}/g, " ").trim();
}
var BrowserSession;
BrowserSession = class _BrowserSession {
  /**
   * @deprecated Don't use this directly. Create sessions via the static factory methods.
   */
  constructor(id2, electronSession, storageScope) {
    this.id = id2;
    this.electronSession = electronSession;
    this.storageScope = storageScope;
    this._trust = new BrowserSessionTrust(this);
    this._history = new BrowserSessionHistory(this);
    this._remote = new BrowserSessionRemote(this);
    this._permissions = new BrowserSessionPermissions(this);
    this.configure();
    _BrowserSession.knownSessions.add(electronSession);
    _BrowserSession._bySession.set(electronSession, this);
    _BrowserSession._byId.set(id2, new WeakRef(this));
    _BrowserSession._finalizer.register(electronSession, id2);
  }
  static {
    // #region Static registry
    /**
     * Primary store — keyed by Electron session so entries are
     * automatically removed when the Electron session is GC'd.
     *
     * The goal is to ensure that BrowserSessions have the exact same lifespan as their Electron sessions.
     */
    this._bySession = /* @__PURE__ */new WeakMap();
  }
  static {
    /**
     * String-keyed lookup for {@link get} and {@link getBrowserContextIds}.
     * Values are weak references so they don't prevent GC of the
     * {@link BrowserSession} (and transitively the Electron session).
     *
     * ID derivation rules (one-to-one with Electron sessions):
     *  - Global scope         -> `"global"`
     *  - Workspace scope      -> `"workspace:${workspaceId}"`
     *  - Ephemeral scope      -> `"ephemeral:${viewId}"` or `"${type}:${viewId}"` for custom types
     *  - SecondAccount scope  -> `"secondAccount"`
     */
    this._byId = /* @__PURE__ */new Map();
  }
  static {
    /**
     * Cleans up stale {@link _byId} entries when the Electron session
     * they point to is garbage-collected.
     */
    this._finalizer = new FinalizationRegistry(id2 => {
      _BrowserSession._byId.delete(id2);
    });
  }
  static {
    /**
     * Weak set mirroring the Electron sessions owned by any BrowserSession.
     * Useful for quickly checking whether a given {@link Electron.WebContents}
     * belongs to the integrated browser.
     */
    this.knownSessions = /* @__PURE__ */new WeakSet();
  }
  /**
   * Check if a {@link Electron.WebContents} belongs to an integrated browser
   * view backed by a BrowserSession.
   */
  static isBrowserViewWebContents(contents) {
    return _BrowserSession.knownSessions.has(contents.session);
  }
  /**
   * Return an existing session for the given id, or `undefined`.
   */
  static get(id2) {
    const ref = _BrowserSession._byId.get(id2);
    if (!ref) {
      return void 0;
    }
    const bs = ref.deref();
    if (!bs) {
      _BrowserSession._byId.delete(id2);
    }
    return bs;
  }
  /**
   * Return all live browser context IDs (i.e. all session {@link id}s).
   */
  static getBrowserContextIds() {
    const ids = [];
    for (const [id2, ref] of _BrowserSession._byId) {
      if (ref.deref()) {
        ids.push(id2);
      } else {
        _BrowserSession._byId.delete(id2);
      }
    }
    return ids;
  }
  /**
   * Get or create the singleton global-scope session.
   */
  static getOrCreateGlobal(instantiationService) {
    const electronSession = session.fromPartition("persist:vscode-browser");
    return _BrowserSession._bySession.get(electronSession) ?? instantiationService.createInstance(_BrowserSession, "global", electronSession, "global" /* Global */);
  }
  /**
   * Get or create a workspace-scope session for the given workspace.
   */
  static getOrCreateWorkspace(instantiationService, workspaceId, workspaceStorageHome) {
    const storage = joinPath(workspaceStorageHome, workspaceId, "browserStorage");
    const electronSession = session.fromPath(storage.fsPath);
    return _BrowserSession._bySession.get(electronSession) ?? instantiationService.createInstance(_BrowserSession, `workspace:${workspaceId}`, electronSession, "workspace" /* Workspace */);
  }
  /**
   * Get or create an ephemeral session for the given view / target id.
   */
  static getOrCreateEphemeral(instantiationService, viewId, type3) {
    if (type3 === "workspace" || type3 === "ephemeral") {
      throw new Error(`Cannot create session with reserved type '${type3}'`);
    }
    const sessionId = `${type3 ?? "ephemeral"}:${viewId}`;
    const electronSession = session.fromPartition(`vscode-browser-${type3}${viewId}`);
    return _BrowserSession._bySession.get(electronSession) ?? instantiationService.createInstance(_BrowserSession, sessionId, electronSession, "ephemeral" /* Ephemeral */);
  }
  /**
   * Get or create the singleton second-account session. Persistent
   * across restarts; shared by every second-account view.
   */
  static getOrCreateSecondAccount(instantiationService) {
    const electronSession = session.fromPartition("persist:vscode-browser-second-account");
    return _BrowserSession._bySession.get(electronSession) ?? instantiationService.createInstance(_BrowserSession, "secondAccount", electronSession, "secondAccount" /* SecondAccount */);
  }
  /**
   * Get or create a session for a workbench-originated browser view.
   * The session id is derived from the *scope* -- not the view id -- so
   * multiple views that share a scope (e.g. two Global views) get the
   * same `BrowserSession`.
   *
   * @param instantiationService Used to construct the session and inject
   *                             its service dependencies (tunnel proxy,
   *                             log) when a new session is needed.
   * @param viewId   Used only for ephemeral sessions where every view
   *                 needs its own Electron session.
   * @param sessionOptions  Determines the storage scope for the session.
   * @param workspaceStorageHome  Root folder under which per-workspace
   *                              browser storage is created
   *                              (`IEnvironmentMainService.workspaceStorageHome`).
   * @param workspaceId  Only required when `scope` is `workspace`.
   */
  static getOrCreate(instantiationService, viewId, sessionOptions, workspaceStorageHome, workspaceId) {
    switch (sessionOptions.scope) {
      case "global" /* Global */:
        return _BrowserSession.getOrCreateGlobal(instantiationService);
      case "secondAccount" /* SecondAccount */:
        return _BrowserSession.getOrCreateSecondAccount(instantiationService);
      case "workspace" /* Workspace */:
        if (workspaceId) {
          return _BrowserSession.getOrCreateWorkspace(instantiationService, workspaceId, workspaceStorageHome);
        }
      // fallthrough -- no workspace context -> ephemeral
      case "ephemeral" /* Ephemeral */:
      default:
        return _BrowserSession.getOrCreateEphemeral(instantiationService, viewId);
    }
  }
  static {
    this._trustedFileRoots = TernarySearchTree.forPaths(!isLinux);
  }
  static {
    this._trustAllFiles = false;
  }
  /**
   * Set trusted file roots for all browser sessions.
   */
  static setTrustedFileRoots(roots, trustAllFiles) {
    _BrowserSession._trustAllFiles = trustAllFiles;
    _BrowserSession._trustedFileRoots.clear();
    for (const root of roots) {
      if (root) {
        _BrowserSession._trustedFileRoots.set(normalize(root), true);
      }
    }
  }
  /** Public trust interface for consumers that need cert operations. */
  get trust() {
    return this._trust;
  }
  /** Public history interface for consumers that record visits. */
  get history() {
    return this._history;
  }
  /** Public remote interface owning the proxy lifecycle for this session. */
  get remote() {
    return this._remote;
  }
  /** Public permissions interface owning per-origin permission state. */
  get permissions() {
    return this._permissions;
  }
  /**
   * Connect application storage to this session so that preferences
   * (trusted certificates, history, etc.) are persisted across restarts.
   * Restores any previously-saved data on first call; subsequent calls
   * are no-ops.
   */
  connectStorage(storage) {
    this._trust.connectStorage(storage);
    this._history.connectStorage(storage);
    this._permissions.connectStorage(storage);
  }
  /**
   * Apply the permission policy and preload scripts to the session.
   */
  configure() {
    this.electronSession.setUserAgent(toStandardChromiumUserAgent(this.electronSession.getUserAgent()));
    this._permissions.configure(this.electronSession);
    this.electronSession.registerPreloadScript({
      type: "frame",
      filePath: FileAccess.asFileUri("vs/platform/browserView/electron-browser/preload-browserView.js").fsPath
    });
    this.electronSession.protocol.handle(Schemas.file, request => {
      const filePath = normalize(URI.parse(request.url).fsPath);
      if (!_BrowserSession._trustAllFiles && !_BrowserSession._trustedFileRoots.findSubstr(filePath)) {
        return new Response(localize("recovered.2551", "Forbidden. File does not reside within a trusted folder."), {
          status: 403
        });
      }
      return this.electronSession.fetch(request, {
        bypassCustomProtocolHandlers: true
      });
    });
  }
  /**
   * Clear all session data including trust state, history, and all browsing data.
   */
  async clearData() {
    await this._trust.clear();
    this._history.delete();
    this._permissions.clear();
    await this.electronSession.clearData();
  }
  // #endregion
};
export { session, toStandardChromiumUserAgent, BrowserSession };
