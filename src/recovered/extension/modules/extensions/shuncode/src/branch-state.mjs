// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { __toESM } from "../../../runtime/helpers.mjs";
import { init_define_SHUNCODE_BUILD_INFO } from "../../../runtime/build-info.mjs";
// extensions/shuncode/src/branch-state.ts
init_define_SHUNCODE_BUILD_INFO();
var vscode6 = __toESM(require("vscode"));
var SHUNCODE_BRANCH_GROUP_METADATA_KEY = "shuncodeBranchGroup";
function branchGroupMetadata(metadata) {
  if (!metadata || typeof metadata !== "object") return void 0;
  const row = metadata[SHUNCODE_BRANCH_GROUP_METADATA_KEY];
  if (!row || typeof row !== "object" || Array.isArray(row)) return void 0;
  const group = row;
  if (typeof group.groupId !== "string" || typeof group.variantId !== "string") return void 0;
  if (group.kind !== "branch" && group.kind !== "merge") return void 0;
  return {
    groupId: group.groupId,
    variantId: group.variantId,
    kind: group.kind
  };
}
var BranchStateStore = class {
  constructor(context, output) {
    this.output = output;
    this.file = vscode6.Uri.joinPath(context.globalStorageUri, "shuncode-branch-state.json");
  }
  output;
  state = {};
  loaded = false;
  saveChain = Promise.resolve();
  file;
  async ensureLoaded() {
    if (this.loaded) return;
    try {
      const raw = await vscode6.workspace.fs.readFile(this.file);
      const parsed = JSON.parse(Buffer.from(raw).toString("utf8"));
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        this.state = parsed;
      }
    } catch {}
    this.loaded = true;
  }
  getState(groupId) {
    return this.state[groupId] ?? {};
  }
  setCanonical(groupId, variantId) {
    const current = this.getState(groupId);
    if (current.canonicalVariantId === variantId) return;
    this.state[groupId] = {
      ...current,
      canonicalVariantId: variantId
    };
    this.queueSave(groupId, variantId);
  }
  setMerged(groupId, variantId) {
    const current = this.getState(groupId);
    if (current.mergedVariantId === variantId && current.canonicalVariantId === variantId) return;
    this.state[groupId] = {
      ...current,
      mergedVariantId: variantId,
      canonicalVariantId: variantId
    };
    this.queueSave(groupId, variantId);
  }
  /**
   * Records which variant the user is currently viewing in the branch
   * container, so a reload restores the same variant.
   */
  setActiveVariant(groupId, variantId) {
    const current = this.getState(groupId);
    if (current.activeVariantId === variantId) return;
    this.state[groupId] = {
      ...current,
      activeVariantId: variantId
    };
    this.queueSave(groupId, variantId);
  }
  /**
   * Records an explicit user adoption. Adoption both selects the canonical
   * variant and closes the round, so later branch sends open a new group.
   */
  adopt(groupId, variantId) {
    const current = this.getState(groupId);
    if (current.canonicalVariantId === variantId && current.adoptedVariantId === variantId) return;
    this.state[groupId] = {
      ...current,
      canonicalVariantId: variantId,
      adoptedVariantId: variantId
    };
    this.queueSave(groupId, variantId);
  }
  queueSave(groupId, variantId) {
    this.saveChain = this.saveChain.then(async () => {
      try {
        await vscode6.workspace.fs.createDirectory(vscode6.Uri.joinPath(this.file, ".."));
        const payload = JSON.stringify(this.state, null, 2);
        await vscode6.workspace.fs.writeFile(this.file, Buffer.from(payload, "utf8"));
        this.output.appendLine(`[branch-state] saved group=${groupId} variant=${variantId}`);
      } catch (error2) {
        this.output.appendLine(`[branch-state] failed to save ${groupId}: ${error2 instanceof Error ? error2.message : String(error2)}`);
      }
    });
  }
  dispose() {}
};

// extensions/shuncode/src/custom-agents.ts
export { vscode6, SHUNCODE_BRANCH_GROUP_METADATA_KEY, branchGroupMetadata, BranchStateStore };
