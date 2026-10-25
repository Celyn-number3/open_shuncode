// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
var GlobalScope = "global";
var WorkspaceScope = "workspace";
var EphemeralScope = "ephemeral";
function resolveBrowserViewStorageScope(explicit, configured, isWorkspaceUntrusted, isRemote) {
  if (isWorkspaceUntrusted) {
    return EphemeralScope;
  }
  if (explicit !== void 0) {
    return explicit;
  }
  if (configured !== "default") {
    return configured;
  }
  return isRemote ? WorkspaceScope : GlobalScope;
}

// src/vs/workbench/contrib/browserView/common/browserArenaFollowLatestConfiguration.ts
export { GlobalScope, WorkspaceScope, EphemeralScope, resolveBrowserViewStorageScope };
