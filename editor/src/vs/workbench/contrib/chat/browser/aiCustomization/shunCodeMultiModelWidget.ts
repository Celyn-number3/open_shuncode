// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
import { __decorateClass } from "../../../../../base/common/shunCodeRecoveredHelpersWorkbench.js";
import { __decorateParam } from "../../../../../base/common/shunCodeRecoveredHelpersWorkbench.js";
import { Disposable } from "../../../../../base/common/lifecycle.js";
import { addDisposableListener } from "../../../../../base/browser/dom.js";
import { append } from "../../../../../base/browser/dom.js";
import { $ } from "../../../../../base/browser/dom.js";
import { Codicon } from "../../../../../base/common/codicons.js";
import { ICommandService } from "../../../../../platform/commands/common/commands.js";
import { IConfigurationService } from "../../../../../platform/configuration/common/configuration.js";
import { defaultButtonStyles } from "../../../../../platform/theme/browser/defaultStyles.js";
import { defaultCheckboxStyles } from "../../../../../platform/theme/browser/defaultStyles.js";
import { Button } from "../../../../../base/browser/ui/button/button.js";
import { Checkbox } from "../../../../../base/browser/ui/toggle/toggle.js";
import { AICustomizationManagementSection } from "../../common/aiCustomizationWorkspaceService.js";
import { aiCustomizationManagementSectionRegistry } from "./aiCustomizationManagementSectionRegistry.js";
import { localizeMultiModel } from "./shunCodeMultiModelLocalization.js";
var SETTING_ENABLED = "shuncode.multiModel.enabled";
var SETTING_MERGE_MODEL = "shuncode.multiModel.mergeModel";
var SETTING_MERGE_READ_TOOLS = "shuncode.multiModel.mergeReadTools";
var SETTING_MAX_BRANCHES = "shuncode.multiModel.maxBranches";
var SETTING_MERGE_REASONING = "shuncode.multiModel.mergeReasoningEffort";
var PICK_MERGE_MODEL_COMMAND = "shuncode.pickMergeModel";
var MERGE_REASONING_OPTIONS = ["disabled", "none", "minimal", "low", "medium", "high", "xhigh", "max", "ultra"];
function mergeReasoningOptionLabel(option2) {
  switch (option2) {
    case "disabled":
      return localizeMultiModel("shuncodeMultiModel.mergeReasoningOptionDisabled", "Off");
    case "none":
      return localizeMultiModel("shuncodeMultiModel.mergeReasoningOptionNone", "None");
    case "minimal":
      return localizeMultiModel("shuncodeMultiModel.mergeReasoningOptionMinimal", "Minimal");
    case "low":
      return localizeMultiModel("shuncodeMultiModel.mergeReasoningOptionLow", "Low");
    case "medium":
      return localizeMultiModel("shuncodeMultiModel.mergeReasoningOptionMedium", "Medium");
    case "high":
      return localizeMultiModel("shuncodeMultiModel.mergeReasoningOptionHigh", "High");
    case "xhigh":
      return localizeMultiModel("shuncodeMultiModel.mergeReasoningOptionXHigh", "XHigh");
    case "max":
      return localizeMultiModel("shuncodeMultiModel.mergeReasoningOptionMax", "Max");
    case "ultra":
      return localizeMultiModel("shuncodeMultiModel.mergeReasoningOptionUltra", "Ultra");
    default:
      return option2;
  }
}
var ShunCodeMultiModelWidget = class extends Disposable {
  constructor(container3, configurationService, commandService) {
    super();
    this.configurationService = configurationService;
    this.commandService = commandService;
    const root = append(container3, $(".shuncode-multimodel"));
    const heroCard = append(root, $(".shuncode-multimodel-card.shuncode-multimodel-hero"));
    const heroHeader = append(heroCard, $(".shuncode-multimodel-card-header"));
    append(heroHeader, $("h2", void 0, localizeMultiModel("shuncodeMultiModel.title", "Multi-Model Rounds")));
    const heroBody = append(heroCard, $(".shuncode-multimodel-body"));
    append(heroBody, $("p.shuncode-multimodel-description", void 0, localizeMultiModel("shuncodeMultiModel.description", "In Plan mode, different models each answer the same question from the context before the previous round. The merge model then reads all branches and, when necessary, performs read-only file verification, producing consensus, disagreements, and the final plan. Only adopted branches continue into subsequent context.")));
    const rules = append(heroBody, $("ul.shuncode-multimodel-rules"));
    for (const rule of [localizeMultiModel("shuncodeMultiModel.rule1", "After asking a question in Plan mode and receiving an answer, clear the input box; the send button becomes the branch send button (accent color)."), localizeMultiModel("shuncodeMultiModel.rule2", "Switch models and send an empty input again to create a new branch; branches are generated serially, and the send button is disabled until the previous branch finishes."), localizeMultiModel("shuncodeMultiModel.rule3", "Once there are 2 branches, the answer action row shows \u25C0 \u25B6 and \u201CMerge & Summarize\u201D."), localizeMultiModel("shuncodeMultiModel.rule4", "The merged result becomes a new branch and the main line by default; before merging you can manually adopt a branch.")]) {
      append(rules, $("li", void 0, rule));
    }
    const settingsCard = append(root, $(".shuncode-multimodel-card"));
    const settingsHeader = append(settingsCard, $(".shuncode-multimodel-card-header"));
    append(settingsHeader, $("h3", void 0, localizeMultiModel("shuncodeMultiModel.settingsTitle", "Settings")));
    const settingsBody = append(settingsCard, $(".shuncode-multimodel-body"));
    const enabledRow = append(settingsBody, $(".shuncode-multimodel-persistent-row"));
    const enabledText = append(enabledRow, $(".shuncode-multimodel-persistent-text"));
    const enabledLabel = append(enabledText, $("label.shuncode-multimodel-persistent-label"));
    enabledLabel.textContent = localizeMultiModel("shuncodeMultiModel.enabledLabel", "Enable Multi-Model Rounds");
    append(enabledText, $(".shuncode-multimodel-hint", void 0, localizeMultiModel("shuncodeMultiModel.enabledHint", "When disabled, an empty input no longer triggers branch sending.")));
    this.enabledToggle = append(enabledRow, $("button.shuncode-multimodel-switch"));
    this.enabledToggle.type = "button";
    this.enabledToggle.setAttribute("role", "switch");
    this.enabledToggle.setAttribute("aria-label", localizeMultiModel("shuncodeMultiModel.enabledLabel", "Enable Multi-Model Rounds"));
    append(this.enabledToggle, $("span.shuncode-multimodel-switch-track"));
    this.renderEnabledToggle(this.readEnabled());
    this._register(addDisposableListener(this.enabledToggle, "click", () => {
      const enabled = this.enabledToggle.getAttribute("aria-checked") !== "true";
      this.renderEnabledToggle(enabled);
      void this.configurationService.updateValue(SETTING_ENABLED, enabled, 2 /* USER */).catch(() => {
        this.renderEnabledToggle(this.readEnabled());
      });
    }));
    const mergeModelField = append(settingsBody, $(".shuncode-multimodel-field"));
    append(mergeModelField, $("span.shuncode-multimodel-field-label", void 0, localizeMultiModel("shuncodeMultiModel.mergeModelLabel", "Merge model")));
    const mergeModelRow = append(mergeModelField, $(".shuncode-multimodel-merge-row"));
    this.mergeModelValue = append(mergeModelRow, $("code.shuncode-multimodel-value"));
    const mergeModelActions = append(mergeModelRow, $(".shuncode-multimodel-actions"));
    const pickButton = this._register(new Button(mergeModelActions, {
      ...defaultButtonStyles,
      secondary: true,
      supportIcons: true
    }));
    pickButton.label = `$(${Codicon.gitMerge.id}) ${localizeMultiModel("shuncodeMultiModel.pick", "Select\u2026")}`;
    pickButton.setTitle(localizeMultiModel("shuncodeMultiModel.pickTitle", "Choose the merge model from the configured models"));
    this._register(pickButton.onDidClick(() => void this.commandService.executeCommand(PICK_MERGE_MODEL_COMMAND)));
    const clearButton = this._register(new Button(mergeModelActions, {
      ...defaultButtonStyles,
      secondary: true
    }));
    clearButton.label = localizeMultiModel("shuncodeMultiModel.useCurrent", "Use current conversation model");
    clearButton.setTitle(localizeMultiModel("shuncodeMultiModel.useCurrentTitle", "Clear the merge model setting; the model selected in the current conversation will be used when merging"));
    this._register(clearButton.onDidClick(() => void this.configurationService.updateValue(SETTING_MERGE_MODEL, "", 2 /* USER */)));
    append(mergeModelField, $("p.shuncode-multimodel-help", void 0, localizeMultiModel("shuncodeMultiModel.mergeModelHelp", "Leave empty to use the model selected in the current conversation when merging. Format: vendor/modelId.")));
    const mergeReasoningField = append(settingsBody, $(".shuncode-multimodel-field"));
    append(mergeReasoningField, $("span.shuncode-multimodel-field-label", void 0, localizeMultiModel("shuncodeMultiModel.mergeReasoningLabel", "Merge thinking effort")));
    this.mergeReasoningSelect = append(mergeReasoningField, $("select.shuncode-multimodel-select"));
    this.mergeReasoningSelect.setAttribute("aria-label", localizeMultiModel("shuncodeMultiModel.mergeReasoningLabel", "Merge thinking effort"));
    for (const option2 of MERGE_REASONING_OPTIONS) {
      const element = append(this.mergeReasoningSelect, $("option"));
      element.value = option2;
      element.textContent = mergeReasoningOptionLabel(option2);
    }
    this._register(addDisposableListener(this.mergeReasoningSelect, "change", () => {
      void this.configurationService.updateValue(SETTING_MERGE_REASONING, this.mergeReasoningSelect.value, 2 /* USER */);
    }));
    append(mergeReasoningField, $("p.shuncode-multimodel-help", void 0, localizeMultiModel("shuncodeMultiModel.mergeReasoningHelp", "Thinking effort used when the merge model summarizes branches. Only applies when a separate merge model is configured above; otherwise merging follows the thinking setting of the current conversation. If the merge model does not support the selected effort (DeepSeek supports low/high/max only; Codex models cannot disable thinking), the merge model default is used.")));
    const readToolsRow = append(settingsBody, $(".shuncode-multimodel-row"));
    this.mergeReadToolsCheckbox = this._register(new Checkbox(localizeMultiModel("shuncodeMultiModel.readToolsLabel", "Allow read-only file verification when merging"), this.readMergeReadTools(), defaultCheckboxStyles));
    readToolsRow.appendChild(this.mergeReadToolsCheckbox.domNode);
    append(readToolsRow, $("span.shuncode-multimodel-check-label", void 0, localizeMultiModel("shuncodeMultiModel.readToolsLabel", "Allow read-only file verification when merging")));
    append(readToolsRow, $("span.shuncode-multimodel-hint", void 0, localizeMultiModel("shuncodeMultiModel.readToolsHint", "Files are read only when branches disagree or the conclusion lacks evidence.")));
    this._register(this.mergeReadToolsCheckbox.onChange(() => {
      void this.configurationService.updateValue(SETTING_MERGE_READ_TOOLS, this.mergeReadToolsCheckbox.checked, 2 /* USER */);
    }));
    const maxBranchesField = append(settingsBody, $(".shuncode-multimodel-field"));
    append(maxBranchesField, $("span.shuncode-multimodel-field-label", void 0, localizeMultiModel("shuncodeMultiModel.maxBranchesLabel", "Max branches per round")));
    this.maxBranchesSelect = append(maxBranchesField, $("select.shuncode-multimodel-select"));
    this.maxBranchesSelect.setAttribute("aria-label", localizeMultiModel("shuncodeMultiModel.maxBranchesLabel", "Max branches per round"));
    for (let value2 = 2; value2 <= 6; value2++) {
      const option2 = append(this.maxBranchesSelect, $("option"));
      option2.value = String(value2);
      option2.textContent = localizeMultiModel("shuncodeMultiModel.maxBranchesOption", "{0} branches", value2);
    }
    this._register(addDisposableListener(this.maxBranchesSelect, "change", () => {
      void this.configurationService.updateValue(SETTING_MAX_BRANCHES, Number(this.maxBranchesSelect.value), 2 /* USER */);
    }));
    append(maxBranchesField, $("p.shuncode-multimodel-help", void 0, localizeMultiModel("shuncodeMultiModel.maxBranchesHelp", "When the limit is reached, merge or adopt a branch before generating more branches for the same question.")));
    this._register(this.configurationService.onDidChangeConfiguration(event => {
      if (event.affectsConfiguration("shuncode.multiModel")) {
        this.refreshValues();
      }
    }));
    this.refreshValues();
  }
  readEnabled() {
    return this.configurationService.getValue(SETTING_ENABLED) ?? true;
  }
  readMergeReadTools() {
    return this.configurationService.getValue(SETTING_MERGE_READ_TOOLS) ?? true;
  }
  renderEnabledToggle(enabled) {
    this.enabledToggle.setAttribute("aria-checked", String(enabled));
    this.enabledToggle.title = enabled ? localizeMultiModel("shuncodeMultiModel.enabledOn", "Multi-model rounds are enabled. An empty input triggers branch sending.") : localizeMultiModel("shuncodeMultiModel.enabledOff", "Multi-model rounds are disabled. An empty input no longer triggers branch sending.");
  }
  refreshValues() {
    this.renderEnabledToggle(this.readEnabled());
    this.mergeReadToolsCheckbox.checked = this.readMergeReadTools();
    const mergeModel = (this.configurationService.getValue(SETTING_MERGE_MODEL) ?? "").trim();
    this.mergeModelValue.textContent = mergeModel || localizeMultiModel("shuncodeMultiModel.mergeModelEmpty", "Model selected in current conversation");
    const maxBranches = this.configurationService.getValue(SETTING_MAX_BRANCHES) ?? 3;
    const clamped = Number.isInteger(maxBranches) && maxBranches >= 2 && maxBranches <= 6 ? maxBranches : 3;
    this.maxBranchesSelect.value = String(clamped);
    const mergeReasoning = this.configurationService.getValue(SETTING_MERGE_REASONING) ?? "high";
    this.mergeReasoningSelect.value = MERGE_REASONING_OPTIONS.includes(mergeReasoning) ? mergeReasoning : "high";
  }
  dispose() {
    super.dispose();
  }
};
ShunCodeMultiModelWidget = __decorateClass([__decorateParam(1, IConfigurationService), __decorateParam(2, ICommandService)], ShunCodeMultiModelWidget);
aiCustomizationManagementSectionRegistry.register({
  id: AICustomizationManagementSection.MultiModel,
  label: localizeMultiModel("shuncodeMultiModel.navigationLabel", "Multi-Model Rounds"),
  icon: Codicon.gitMerge,
  description: localizeMultiModel("shuncodeMultiModel.navigationDescription", "Merge model, read-only verification, and branch limits for multi-model rounds."),
  supportsHarness: () => true,
  create: (instantiationService, container3) => instantiationService.createInstance(ShunCodeMultiModelWidget, container3)
});

// src/vs/workbench/contrib/chat/browser/aiCustomization/aiCustomizationManagement.contribution.ts
export { SETTING_ENABLED, SETTING_MERGE_MODEL, SETTING_MERGE_READ_TOOLS, SETTING_MAX_BRANCHES, SETTING_MERGE_REASONING, PICK_MERGE_MODEL_COMMAND, MERGE_REASONING_OPTIONS, mergeReasoningOptionLabel, ShunCodeMultiModelWidget };
