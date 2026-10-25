// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
import { isMacintosh } from "../../../../../base/common/platform.js";
var OPEN_FOLDER_COMMAND_ID = "workbench.action.files.openFolder";
function openFolderShortcutHint() {
  return isMacintosh ? void 0 : "Ctrl+K Ctrl+O";
}
function openFolderTooltip(menuPath) {
  const hint = openFolderShortcutHint();
  return hint ? `${menuPath} \xB7 ${hint}` : menuPath;
}

// src/vs/workbench/contrib/chat/browser/aiCustomization/shunCodeBridgeQuickLinks.ts
export { OPEN_FOLDER_COMMAND_ID, openFolderShortcutHint, openFolderTooltip };
