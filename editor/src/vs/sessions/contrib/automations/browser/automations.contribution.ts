// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
import { __decorateClass } from "../../../../base/common/shunCodeRecoveredHelpersSessions.js";
import { __decorateParam } from "../../../../base/common/shunCodeRecoveredHelpersSessions.js";
import { localize } from "../../../../nls.js";
import { Disposable } from "../../../../base/common/lifecycle.js";
import { IContextKeyService } from "../../../../platform/contextkey/common/contextkey.js";
import { Registry } from "../../../../platform/registry/common/platform.js";
import { IConfigurationService } from "../../../../platform/configuration/common/configuration.js";
import { registerSingleton } from "../../../../platform/instantiation/common/extensions.js";
import product_default from "../../../../platform/product/common/product.js";
import { Extensions as Extensions4 } from "../../../../platform/configuration/common/configurationRegistry.js";
import { AccessibleViewRegistry } from "../../../../platform/accessibility/browser/accessibleViewRegistry.js";
import { WorkbenchPhase } from "../../../../workbench/common/contributions.js";
import { registerWorkbenchContribution2 } from "../../../../workbench/common/contributions.js";
import { IAutomationService } from "../../../../workbench/contrib/chat/common/automations/automationService.js";
import { IAutomationRunner } from "../../../../workbench/contrib/chat/common/automations/automationRunner.js";
import { IAutomationDialogService } from "../../../../workbench/contrib/chat/common/automations/automationDialogService.js";
import { CHAT_AUTOMATIONS_ENABLED_SETTING } from "../../../../workbench/contrib/chat/common/automations/automationsEnabled.js";
import { CHAT_AUTOMATIONS_RUN_TIMEOUT_MINUTES_SETTING } from "../../../../workbench/contrib/chat/common/automations/automationsEnabled.js";
import { DEFAULT_AUTOMATIONS_RUN_TIMEOUT_MINUTES } from "../../../../workbench/contrib/chat/common/automations/automationsEnabled.js";
import { ChatAutomationsEnabledContext } from "../../../../workbench/contrib/chat/common/automations/automationsEnabled.js";
import { AutomationsAccessibilityHelp } from "../../../../workbench/contrib/chat/browser/aiCustomization/automationsAccessibilityHelp.js";
import { AutomationDialogService } from "./automationDialogService.js";
import { AutomationRunner } from "./automationRunner.js";
import { AutomationScheduler } from "./automationScheduler.js";
import { IAutomationStorageService } from "../common/automationStorageService.js";
import { AutomationService } from "./automationService.js";
import { BrowserAutomationStorageService } from "./automationStorageService.js";
import { AutomationToolsContribution } from "./automationTools.js";
// src/vs/sessions/contrib/automations/browser/automations.contribution.ts
registerSingleton(IAutomationStorageService, BrowserAutomationStorageService, 1 /* Delayed */);
registerSingleton(IAutomationService, AutomationService, 1 /* Delayed */);
registerSingleton(IAutomationRunner, AutomationRunner, 1 /* Delayed */);
registerSingleton(IAutomationDialogService, AutomationDialogService, 1 /* Delayed */);
registerWorkbenchContribution2(AutomationScheduler.ID, AutomationScheduler, WorkbenchPhase.Eventually);
registerWorkbenchContribution2(AutomationToolsContribution.ID, AutomationToolsContribution, WorkbenchPhase.Eventually);
AccessibleViewRegistry.register(new AutomationsAccessibilityHelp());
Registry.as(Extensions4.Configuration).registerConfiguration({
  id: "chat",
  properties: {
    [CHAT_AUTOMATIONS_ENABLED_SETTING]: {
      type: "boolean",
      default: false,
      scope: 2 /* MACHINE */,
      tags: ["experimental", "advanced"],
      description: localize("recovered.3903", "Enables the Automations feature: scheduling agent sessions to run on a cadence. When disabled, the Automations entry in the Customizations sidebar, the Automations section in the Customizations editor, and the Automation option in the new-session composer are hidden, and scheduled automations are not dispatched."),
      included: product_default.quality !== "stable",
      experiment: {
        mode: "auto"
      }
    },
    [CHAT_AUTOMATIONS_RUN_TIMEOUT_MINUTES_SETTING]: {
      type: "number",
      default: DEFAULT_AUTOMATIONS_RUN_TIMEOUT_MINUTES,
      minimum: 1,
      scope: 2 /* MACHINE */,
      tags: ["experimental", "advanced"],
      description: localize("recovered.3904", "Maximum number of minutes a scheduled automation run is allowed to take before the scheduler cancels it and marks it failed. Prevents a single hung run from permanently blocking subsequent scheduled runs."),
      included: product_default.quality !== "stable"
    }
  }
});
var ChatAutomationsEnabledContextContribution = class extends Disposable {
  static {
    this.ID = "workbench.contrib.chatAutomationsEnabledContext";
  }
  constructor(configurationService, contextKeyService) {
    super();
    const key3 = ChatAutomationsEnabledContext.bindTo(contextKeyService);
    const update = () => key3.set(configurationService.getValue(CHAT_AUTOMATIONS_ENABLED_SETTING) === true);
    update();
    this._register(configurationService.onDidChangeConfiguration(e4 => {
      if (e4.affectsConfiguration(CHAT_AUTOMATIONS_ENABLED_SETTING)) {
        update();
      }
    }));
  }
};
ChatAutomationsEnabledContextContribution = __decorateClass([__decorateParam(0, IConfigurationService), __decorateParam(1, IContextKeyService)], ChatAutomationsEnabledContextContribution);
registerWorkbenchContribution2(ChatAutomationsEnabledContextContribution.ID, ChatAutomationsEnabledContextContribution, WorkbenchPhase.BlockStartup);

// src/vs/workbench/contrib/onboarding/common/onboardingPresentation.ts
export { ChatAutomationsEnabledContextContribution };
