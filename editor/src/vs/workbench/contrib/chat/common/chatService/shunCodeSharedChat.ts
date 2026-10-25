// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
import { __decorateClass } from "../../../../../base/common/shunCodeRecoveredHelpersWorkbench.js";
import { __decorateParam } from "../../../../../base/common/shunCodeRecoveredHelpersWorkbench.js";
import { DisposableStore } from "../../../../../base/common/lifecycle.js";
import { Disposable } from "../../../../../base/common/lifecycle.js";
import { RunOnceScheduler } from "../../../../../base/common/async.js";
import { autorun } from "../../../../../base/common/observableInternal/reactions/autorun.js";
import { ICommandService } from "../../../../../platform/commands/common/commands.js";
import { ILogService } from "../../../../../platform/log/common/log.js";
import { IConfigurationService } from "../../../../../platform/configuration/common/configuration.js";
import { LocalChatSessionUri } from "../model/chatUri.js";
import { stringifyEntryWithFallback } from "../model/objectMutationLog.js";
var SHUNCODE_SHARED_CHAT_SETTING = "shuncode.chat.sharedHistory";
var ShunCodeSharedChat = class extends Disposable {
  constructor(models, sessionStore, commands, configuration2, log4) {
    super();
    this.sessionStore = sessionStore;
    this.commands = commands;
    this.configuration = configuration2;
    this.log = log4;
    this.tracked = /* @__PURE__ */new Map();
    this.flushing = false;
    this.lastWarning = "";
    this.scheduler = this._register(new RunOnceScheduler(() => {
      void this.flush();
    }, 300));
    this._register(autorun(reader => {
      const live = [...models.read(reader)];
      const keys = new Set(live.map(m => m.sessionResource.toString()));
      for (const [key3, item] of this.tracked) if (!keys.has(key3)) {
        item.listeners.dispose();
        this.tracked.delete(key3);
      }
      for (const model of live) {
        if (!LocalChatSessionUri.isLocalSession(model.sessionResource) || model.isReadOnly.get()) continue;
        const key3 = model.sessionResource.toString();
        if (this.tracked.has(key3)) continue;
        const item = this.item(model);
        this.attachResponses(item);
        this.dirty(item);
      }
    }));
    this._register(configuration2.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration(SHUNCODE_SHARED_CHAT_SETTING)) this.scheduler.schedule();
    }));
    void this.importHistory().catch(e => this.warn(e));
  }
  get enabled() {
    return this.configuration.getValue(SHUNCODE_SHARED_CHAT_SETTING) === true;
  }
  dirty(item) {
    item.dirty = true;
    if (!this.scheduler.isScheduled()) this.scheduler.schedule();
  }
  attachResponses(item) {
    for (const request2 of item.model.getRequests()) {
      if (!request2.response || item.responseIds.has(request2.response.id)) continue;
      item.responseIds.add(request2.response.id);
      item.listeners.add(request2.response.onDidChange(() => this.dirty(item)));
    }
  }
  item(model) {
    const key3 = model.sessionResource.toString();
    let value2 = this.tracked.get(key3);
    if (!value2) {
      value2 = {
        model,
        listeners: new DisposableStore(),
        responseIds: /* @__PURE__ */new Set(),
        sequence: 0,
        dirty: false
      };
      this.tracked.set(key3, value2);
      const item = value2;
      item.listeners.add(model.onDidChange(() => {
        this.attachResponses(item);
        this.dirty(item);
      }));
      this.attachResponses(item);
    }
    return value2;
  }
  frame(item, generation = item.generation) {
    const data = JSON.parse(stringifyEntryWithFallback(item.model));
    delete data.inputState;
    delete data.pendingRequests;
    return {
      sessionId: LocalChatSessionUri.parseLocalSessionId(item.model.sessionResource),
      sessionResource: item.model.sessionResource.toString(),
      serialized: JSON.stringify(data),
      sequence: ++item.sequence,
      generation
    };
  }
  warn(error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message !== this.lastWarning) {
      this.lastWarning = message;
      this.log.warn("[ShunCode shared chat]", message);
    }
  }
  async flush() {
    if (!this.enabled || this.flushing) return;
    this.flushing = true;
    try {
      for (const item of this.tracked.values()) {
        if (!item.dirty || !item.model.getRequests().length) continue;
        item.dirty = false;
        try {
          await this.commands.executeCommand("shuncode.workspaceHub.publishChat", this.frame(item));
        } catch (e) {
          item.dirty = true;
          this.warn(e);
        }
      }
    } finally {
      this.flushing = false;
      if ([...this.tracked.values()].some(v2 => v2.dirty)) this.scheduler.schedule(1e3);
    }
  }
  async begin(model) {
    if (!this.enabled || !LocalChatSessionUri.isLocalSession(model.sessionResource)) return void 0;
    const item = this.item(model);
    const generation = await this.commands.executeCommand("shuncode.workspaceHub.beginChat", this.frame(item));
    if (typeof generation !== "string" || !generation) throw new Error("\u5171\u4EAB\u804A\u5929\u7EC4\u4EF6\u672A\u5C31\u7EEA\uFF0C\u672A\u5F00\u59CB\u6267\u884C\u4EFB\u52A1\u3002");
    item.generation = generation;
    this.dirty(item);
    return generation;
  }
  async finish(model, generation) {
    const item = this.item(model);
    await this.commands.executeCommand("shuncode.workspaceHub.finishChat", this.frame(item, generation));
  }
  async remove(resource) {
    if (this.enabled && LocalChatSessionUri.isLocalSession(resource)) await this.commands.executeCommand("shuncode.workspaceHub.deleteChat", resource.toString());
  }
  async removeWorkspaceHistory() {
    if (!this.enabled) return;
    for (const id2 of Object.keys(await this.sessionStore.getIndex())) if (!id2.includes("://")) await this.remove(LocalChatSessionUri.forSession(id2));
  }
  async importHistory() {
    if (!this.enabled) return;
    const existing = new Set(await this.commands.executeCommand("shuncode.workspaceHub.importedKeys"));
    for (const id2 of Object.keys(await this.sessionStore.getIndex())) {
      if (id2.includes("://")) continue;
      const resource = LocalChatSessionUri.forSession(id2).toString();
      const key3 = await this.commands.executeCommand("shuncode.workspaceHub.chatKey", resource);
      if (!key3 || existing.has(key3)) continue;
      const stored = await this.sessionStore.readSession(id2);
      if (!stored) continue;
      const data = {
        ...stored.value,
        inputState: void 0,
        pendingRequests: void 0
      };
      await this.commands.executeCommand("shuncode.workspaceHub.publishChat", {
        sessionId: id2,
        sessionResource: resource,
        serialized: JSON.stringify(data),
        sequence: 0
      }, true);
    }
  }
  dispose() {
    for (const item of this.tracked.values()) item.listeners.dispose();
    this.tracked.clear();
    super.dispose();
  }
};
ShunCodeSharedChat = __decorateClass([__decorateParam(2, ICommandService), __decorateParam(3, IConfigurationService), __decorateParam(4, ILogService)], ShunCodeSharedChat);

// src/vs/workbench/contrib/chat/common/chatService/chatServiceImpl.ts
export { SHUNCODE_SHARED_CHAT_SETTING, ShunCodeSharedChat };
