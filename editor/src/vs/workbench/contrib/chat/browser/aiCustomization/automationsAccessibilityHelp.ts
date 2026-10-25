// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
import { localize } from "../../../../../nls.js";
import { ContextKeyExpr } from "../../../../../platform/contextkey/common/contextkey.js";
import { IKeybindingService } from "../../../../../platform/keybinding/common/keybinding.js";
import { AccessibleContentProvider } from "../../../../../platform/accessibility/browser/accessibleView.js";
import { AICustomizationManagementSection } from "../../common/aiCustomizationWorkspaceService.js";
import { CONTEXT_AI_CUSTOMIZATION_MANAGEMENT_EDITOR } from "./aiCustomizationManagement.js";
import { CONTEXT_AI_CUSTOMIZATION_MANAGEMENT_SECTION } from "./aiCustomizationManagement.js";
var AutomationsAccessibilityHelp = class {
  constructor() {
    this.type = "help" /* Help */;
    this.priority = 105;
    this.name = "automations";
    this.when = ContextKeyExpr.and(CONTEXT_AI_CUSTOMIZATION_MANAGEMENT_EDITOR, CONTEXT_AI_CUSTOMIZATION_MANAGEMENT_SECTION.isEqualTo(AICustomizationManagementSection.Automations));
  }
  getProvider(accessor) {
    const keybindingService = accessor.get(IKeybindingService);
    return new AccessibleContentProvider("automations" /* Automations */, {
      type: "help" /* Help */
    }, () => buildAutomationsHelpContent(keybindingService), () => {}, "accessibility.verbosity.automations" /* Automations */);
  }
};
function buildAutomationsHelpContent(keybindingService) {
  const lines = [];
  lines.push(localize("recovered.8692", "Accessibility Help: Automations"));
  lines.push(localize("recovered.8695", "Automations let you schedule agent sessions to run on a cadence you choose. When an automation is due, a fresh chat session is created in the background and the prompt is sent automatically."));
  lines.push(localize("recovered.8686", "Agents can list, create, update, run, or delete automations using the current tool approval policy. Create, update, and run requests use normal tool confirmation when approval is required, while delete requests show Delete and Cancel options. Agent-triggered runs start a new session in the background and return after dispatch. Successful create and update requests include a chat button that opens the affected automation. Cancelling or denying a request makes no changes."));
  lines.push("");
  lines.push(localize("recovered.8697", "Layout:"));
  lines.push(localize("recovered.8696", "The Automations section shows a list of all your automations. Each row displays the automation\u2019s name, schedule (Manual, Hourly, Daily at a time, or Weekly on a day at a time), whether it targets a workspace folder or runs without a workspace, the next scheduled run, and a preview of the prompt. Row action buttons follow on the right."));
  lines.push("");
  lines.push(localize("recovered.8684", "Row Actions (Tab between them):"));
  lines.push(localize("recovered.8683", "- Run now: spawns a new agent session immediately using the automation\u2019s prompt. The trigger is recorded as Manual."));
  lines.push(localize("recovered.8685", "- Toggle enabled: pauses or resumes scheduled runs. Disabled automations skip their scheduled tick but can still be run manually."));
  lines.push(localize("recovered.8681", "- Edit: opens the create/edit dialog with the current values prefilled."));
  lines.push(localize("recovered.8680", "- Delete: removes the automation after a confirmation prompt. Runs already in flight continue to completion."));
  lines.push(localize("recovered.8682", "- Show history: expands an inline list of recent runs for the automation, including their status and any error messages."));
  lines.push("");
  lines.push(localize("recovered.8690", "Create/Edit Dialog:"));
  lines.push(localize("recovered.8689", "The dialog has a Name field, a multi-line Prompt field, a Schedule selector (Manual, Hourly, Daily, Weekly), Time and Day-of-Week fields that appear when relevant, a Workspace target selector, a Session type selector, an isolation selector, a branch selector for supported Worktree sessions, an Agent Mode selector (Use default, Agent, Ask, Edit), and a Permission Mode selector (Use default, Default Approvals, Bypass Approvals, Autopilot). Choose No workspace from the Workspace target selector to run without a backing workspace. Only workspace-less-capable session types are then offered, and the isolation and branch controls do not apply. Folder isolation follows the selected repository\u2019s current branch. Worktree isolation lets you choose a local base branch. The selected configuration is replayed when the scheduler starts a run. Tab and Shift+Tab move between fields; Enter or Space opens a focused selector, and Escape closes an open selector before it closes the dialog."));
  lines.push(localize("recovered.8691", "Save is disabled until Name, Prompt, and Session type are set. Workspace-backed automations also require a Workspace folder, and Worktree isolation requires a branch. Activate Cancel or press Escape to dismiss without saving."));
  lines.push("");
  lines.push(localize("recovered.8694", "Run History:"));
  lines.push(localize("recovered.8693", "Each run records its status (Pending, Running, Completed, Failed), the trigger that started it (Schedule, Manual, or Catch-up after VS Code restarts), the time it started, and the time it took. Failed runs include the failure reason."));
  lines.push("");
  lines.push(localize("recovered.8701", "Screen Reader Announcements:"));
  lines.push(localize("recovered.8700", "The Automations list announces state changes when you create, update, delete, toggle, or manually run an automation. Verbose announcements can be turned off via the accessibility.verbosity.automations setting."));
  lines.push("");
  lines.push(localize("recovered.8698", "Settings ({0} opens Settings):", describeCommand(keybindingService, "workbench.action.openSettings") || "Ctrl+,"));
  lines.push(localize("recovered.8699", "- `accessibility.verbosity.automations`: Controls whether this Accessibility Help hint is announced when the Automations section is focused."));
  lines.push("");
  lines.push(localize("recovered.8688", "Closing this dialog:"));
  lines.push(localize("recovered.8687", "Press Escape to close this dialog and return focus to the Automations list."));
  return lines.join("\n");
}
function describeCommand(keybindingService, commandId) {
  const kb = keybindingService.lookupKeybinding(commandId);
  return kb?.getAriaLabel() ?? void 0;
}

// src/vs/sessions/contrib/automations/common/isolationGroupModel.ts
export { AutomationsAccessibilityHelp, buildAutomationsHelpContent, describeCommand };
