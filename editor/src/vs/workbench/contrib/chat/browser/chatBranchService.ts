// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
import { __decorateClass } from "../../../../base/common/shunCodeRecoveredHelpersWorkbench.js";
import { __decorateParam } from "../../../../base/common/shunCodeRecoveredHelpersWorkbench.js";
import { Disposable } from "../../../../base/common/lifecycle.js";
import { Emitter } from "../../../../base/common/event.js";
import { createDecorator } from "../../../../platform/instantiation/common/instantiation.js";
import { ICommandService } from "../../../../platform/commands/common/commands.js";
var IChatBranchService = createDecorator("chatBranchService");
var ChatBranchService = class extends Disposable {
  constructor(commandService) {
    super();
    this.commandService = commandService;
    this._onDidChange = this._register(new Emitter());
    this.onDidChange = this._onDidChange.event;
    /** sessionResource.toString() -> groupId -> group */
    this.groups = /* @__PURE__ */new Map();
    /** sessionResource.toString() -> rowId (request or response) -> { groupId, requestId } */
    this.rowIndex = /* @__PURE__ */new Map();
    /** sessionResource.toString() -> groupId of the most recently extended branch group (the only group that can be merged). */
    this.activeGroup = /* @__PURE__ */new Map();
  }
  sessionKey(sessionResource) {
    return sessionResource.toString();
  }
  registerVariant(sessionResource, variant) {
    if (this.registerVariantInternal(sessionResource, variant)) {
      this._onDidChange.fire(sessionResource);
    }
  }
  /**
   * Registers a batch of variants (mirrored from response metadata) and fires
   * a single change event when anything changed. Variants that disappeared
   * from the model (for example the old request row of a branch/merge answer
   * that was retried and removed) are pruned so stale entries do not inflate
   * counts or keep dead rows mapped. Used by the chat list widget so variant
   * bookkeeping no longer depends on row rendering.
   */
  synchronize(sessionResource, variants) {
    const key3 = this.sessionKey(sessionResource);
    let changed = false;
    for (const variant of variants) {
      changed = this.registerVariantInternal(sessionResource, variant) || changed;
    }
    const keepRequestIds = new Set(variants.map(variant => variant.requestId));
    const sessionGroups = this.groups.get(key3);
    if (sessionGroups) {
      for (const group2 of sessionGroups.values()) {
        const stale = group2.variants.filter(variant => !keepRequestIds.has(variant.requestId));
        for (const variant of stale) {
          changed = this.removeVariantInternal(sessionResource, variant.requestId) || changed;
        }
      }
    }
    if (changed) {
      this._onDidChange.fire(sessionResource);
    }
  }
  registerVariantInternal(sessionResource, variant) {
    const key3 = this.sessionKey(sessionResource);
    let sessionGroups = this.groups.get(key3);
    if (!sessionGroups) {
      sessionGroups = /* @__PURE__ */new Map();
      this.groups.set(key3, sessionGroups);
    }
    let group2 = sessionGroups.get(variant.groupId);
    if (!group2) {
      group2 = {
        id: variant.groupId,
        baseRequestId: variant.requestId,
        variants: [],
        canonicalRequestId: variant.requestId,
        activeRequestId: variant.requestId
      };
      sessionGroups.set(variant.groupId, group2);
      this.hydrateCanonical(sessionResource, group2);
    }
    const existing = group2.variants.find(v2 => v2.requestId === variant.requestId);
    if (existing) {
      existing.responseId = variant.responseId;
      existing.kind = variant.kind;
      existing.canceled = variant.canceled;
      if (variant.modelId) {
        existing.modelId = variant.modelId;
      }
      if (variant.kind === "merge") {
        group2.mergedRequestId = variant.requestId;
        group2.canonicalRequestId = variant.requestId;
        group2.pendingCanonicalRequestId = void 0;
      }
      this.applyPendingCanonical(sessionResource, group2);
      return false;
    }
    group2.variants.push({
      requestId: variant.requestId,
      responseId: variant.responseId,
      kind: variant.kind,
      modelId: variant.modelId,
      canceled: variant.canceled
    });
    group2.activeRequestId = variant.requestId;
    group2.pendingActiveRequestId = void 0;
    this.activeGroup.set(key3, variant.groupId);
    if (variant.kind === "merge") {
      group2.mergedRequestId = variant.requestId;
      group2.canonicalRequestId = variant.requestId;
      group2.pendingCanonicalRequestId = void 0;
    }
    this.applyPendingCanonical(sessionResource, group2);
    let sessionRows = this.rowIndex.get(key3);
    if (!sessionRows) {
      sessionRows = /* @__PURE__ */new Map();
      this.rowIndex.set(key3, sessionRows);
    }
    sessionRows.set(variant.requestId, {
      groupId: variant.groupId,
      requestId: variant.requestId
    });
    sessionRows.set(variant.responseId, {
      groupId: variant.groupId,
      requestId: variant.requestId
    });
    return true;
  }
  hydrateCanonical(sessionResource, group2) {
    void (async () => {
      try {
        const state = await this.commandService.executeCommand("shuncode.branch.getGroupState", group2.id);
        const canonical = state?.canonicalVariantId;
        if (typeof canonical === "string" && canonical) {
          group2.pendingCanonicalRequestId = canonical;
          this.applyPendingCanonical(sessionResource, group2);
        }
        const active = state?.activeVariantId;
        if (typeof active === "string" && active) {
          group2.pendingActiveRequestId = active;
          this.applyPendingActive(sessionResource, group2);
        }
      } catch {}
    })();
  }
  applyPendingActive(sessionResource, group2) {
    const target = group2.pendingActiveRequestId;
    if (!target || group2.activeRequestId === target) {
      return;
    }
    if (group2.variants.some(v2 => v2.requestId === target)) {
      group2.activeRequestId = target;
      this._onDidChange.fire(sessionResource);
    }
  }
  applyPendingCanonical(sessionResource, group2) {
    const target = group2.pendingCanonicalRequestId;
    if (!target || group2.canonicalRequestId === target) {
      return;
    }
    if (group2.variants.some(v2 => v2.requestId === target)) {
      group2.canonicalRequestId = target;
      this._onDidChange.fire(sessionResource);
    }
  }
  removeRequest(sessionResource, requestId) {
    if (this.removeVariantInternal(sessionResource, requestId)) {
      this._onDidChange.fire(sessionResource);
    }
  }
  removeVariantInternal(sessionResource, requestId) {
    const key3 = this.sessionKey(sessionResource);
    const sessionRows = this.rowIndex.get(key3);
    if (!sessionRows) {
      return false;
    }
    const row = sessionRows.get(requestId);
    if (!row) {
      return false;
    }
    const sessionGroups = this.groups.get(key3);
    const group2 = sessionGroups?.get(row.groupId);
    if (!group2) {
      return false;
    }
    const index2 = group2.variants.findIndex(v2 => v2.requestId === requestId);
    if (index2 < 0) {
      return false;
    }
    const [removed] = group2.variants.splice(index2, 1);
    sessionRows.delete(removed.responseId);
    sessionRows.delete(removed.requestId);
    if (group2.canonicalRequestId === requestId) {
      group2.canonicalRequestId = group2.variants[0]?.requestId ?? "";
    }
    if (group2.mergedRequestId === requestId) {
      group2.mergedRequestId = void 0;
    }
    if (group2.activeRequestId === requestId) {
      group2.activeRequestId = group2.canonicalRequestId || group2.variants[0]?.requestId || "";
    }
    if (!group2.variants.length) {
      sessionGroups?.delete(row.groupId);
      this.activeGroup.delete(key3);
    }
    return true;
  }
  removeSession(sessionResource) {
    const key3 = this.sessionKey(sessionResource);
    this.groups.delete(key3);
    this.rowIndex.delete(key3);
    this.activeGroup.delete(key3);
    this._onDidChange.fire(sessionResource);
  }
  getGroup(sessionResource, groupId) {
    return this.groups.get(this.sessionKey(sessionResource))?.get(groupId);
  }
  getGroups(sessionResource) {
    const sessionGroups = this.groups.get(this.sessionKey(sessionResource));
    return sessionGroups ? [...sessionGroups.values()] : [];
  }
  getActiveGroupId(sessionResource) {
    return this.activeGroup.get(this.sessionKey(sessionResource));
  }
  setActiveVariant(sessionResource, groupId, requestId) {
    const group2 = this.getGroup(sessionResource, groupId);
    if (!group2 || group2.activeRequestId === requestId) {
      return;
    }
    if (!group2.variants.some(v2 => v2.requestId === requestId)) {
      return;
    }
    group2.activeRequestId = requestId;
    group2.pendingActiveRequestId = void 0;
    this._onDidChange.fire(sessionResource);
    void this.commandService.executeCommand("shuncode.branch.setActiveVariant", groupId, requestId).catch(() => {});
  }
  getRowInfo(sessionResource, rowId) {
    const sessionRows = this.rowIndex.get(this.sessionKey(sessionResource));
    const row = sessionRows?.get(rowId);
    if (!row) {
      return void 0;
    }
    const group2 = this.groups.get(this.sessionKey(sessionResource))?.get(row.groupId);
    if (!group2) {
      return void 0;
    }
    const variantIndex = group2.variants.findIndex(v2 => v2.requestId === row.requestId);
    if (variantIndex < 0) {
      return void 0;
    }
    const variant = group2.variants[variantIndex];
    const isMerged = group2.mergedRequestId === row.requestId && variant.kind === "merge";
    const isCanonical = group2.canonicalRequestId === row.requestId;
    const branchCount = group2.variants.filter(v2 => v2.kind === "branch" && !v2.canceled).length;
    const isActiveGroup = this.activeGroup.get(this.sessionKey(sessionResource)) === group2.id;
    return {
      group: group2,
      variantIndex,
      variantKind: variant.kind,
      variantCount: group2.variants.length,
      modelId: variant.modelId,
      isCanonical,
      isMerged,
      canMerge: variant.kind === "branch" && branchCount >= 2 && !group2.mergedRequestId && isActiveGroup,
      canAdopt: !isCanonical,
      canDelete: variant.kind === "branch" && !isCanonical,
      hasPrev: variantIndex > 0,
      hasNext: variantIndex < group2.variants.length - 1
    };
  }
  adoptVariant(sessionResource, requestId) {
    const sessionRows = this.rowIndex.get(this.sessionKey(sessionResource));
    const row = sessionRows?.get(requestId);
    if (!row) {
      return;
    }
    const group2 = this.groups.get(this.sessionKey(sessionResource))?.get(row.groupId);
    if (!group2 || !group2.variants.some(v2 => v2.requestId === requestId)) {
      return;
    }
    if (group2.canonicalRequestId === requestId) {
      return;
    }
    group2.canonicalRequestId = requestId;
    group2.pendingCanonicalRequestId = void 0;
    this._onDidChange.fire(sessionResource);
  }
};
ChatBranchService = __decorateClass([__decorateParam(0, ICommandService)], ChatBranchService);

// src/vs/workbench/contrib/chat/browser/widget/chatContentParts/chatSuggestNextWidget.ts
export { IChatBranchService, ChatBranchService };
