// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
import { __decorateClass } from "../../../../../base/common/shunCodeRecoveredHelpersWorkbench.js";
import { __decorateParam } from "../../../../../base/common/shunCodeRecoveredHelpersWorkbench.js";
import { localize } from "../../../../../nls.js";
import { $ } from "../../../../../base/browser/dom.js";
import { Codicon } from "../../../../../base/common/codicons.js";
import { renderIcon } from "../../../../../base/browser/ui/iconLabel/iconLabels.js";
import { IWorkspaceContextService } from "../../../../../platform/workspace/common/workspace.js";
import { IHoverService } from "../../../../../platform/hover/browser/hover.js";
import { IWorkspaceTrustManagementService } from "../../../../../platform/workspace/common/workspaceTrust.js";
import { BrowserEditorContribution } from "../browserEditor.js";
import { BrowserEditor } from "../browserEditor.js";
// src/vs/workbench/contrib/browserView/electron-browser/features/browserScopeIndicatorFeature.ts
function classifyBrowserScopeBadge(scope, isWorkspaceUntrusted) {
  switch (scope) {
    case "ephemeral" /* Ephemeral */:
      return isWorkspaceUntrusted ? "incognito-untrusted" /* IncognitoUntrusted */ : "incognito" /* Incognito */;
    case "secondAccount" /* SecondAccount */:
      return "second-account" /* SecondAccount */;
    default:
      return "none" /* None */;
  }
}
function presentationFor(kind) {
  switch (kind) {
    case "incognito" /* Incognito */:
      return {
        label: localize("recovered.7344", "Incognito"),
        hover: localize("recovered.7345", "Incognito tab opened on purpose: cookies, logins and site data live only in this tab and are erased when it closes. Normal tabs are not affected."),
        icon: Codicon.eyeClosed,
        className: "incognito"
      };
    case "incognito-untrusted" /* IncognitoUntrusted */:
      return {
        label: localize("recovered.7346", "Incognito \xB7 Restricted workspace"),
        hover: localize("recovered.7347", "This workspace is not trusted, so every browser tab runs in incognito mode automatically and nothing is saved. Trust the workspace to use normal tabs again."),
        icon: Codicon.shield,
        className: "incognito untrusted"
      };
    case "second-account" /* SecondAccount */:
      return {
        label: localize("recovered.7348", "Second account"),
        hover: localize("recovered.7349", "Second-account tab: a separate persistent profile that keeps its own logins, isolated from normal tabs, and survives restarts."),
        icon: Codicon.account,
        className: "second-account"
      };
    default:
      return void 0;
  }
}
var BrowserScopeIndicatorContribution = class extends BrowserEditorContribution {
  constructor(editor, hoverService, workspaceContextService, workspaceTrustManagementService) {
    super(editor);
    this.workspaceContextService = workspaceContextService;
    this.workspaceTrustManagementService = workspaceTrustManagementService;
    this._hover = "";
    this._container = $(".browser-scope-indicator");
    this._container.setAttribute("role", "status");
    this._iconSlot = $("span.browser-scope-indicator-icon");
    this._label = $("span.browser-scope-indicator-label");
    this._container.append(this._iconSlot, this._label);
    this._register(hoverService.setupDelayedHover(this._container, () => ({
      content: this._hover
    })));
    this._register(this.workspaceTrustManagementService.onDidChangeTrust(() => this.refresh(this.editor.input?.model?.storageScope ?? this.editor.input?.serialize().storageScope)));
    this.refresh(void 0);
  }
  get widgets() {
    return [{
      location: "preUrl" /* PreUrl */,
      element: this._container,
      order: -10
    }];
  }
  prerenderInput(input) {
    this.refresh(input.serialize().storageScope);
  }
  onModelAttached(model, _store) {
    this.refresh(model.storageScope);
  }
  onModelDetached() {
    this.refresh(void 0);
  }
  isWorkspaceUntrusted() {
    return this.workspaceContextService.getWorkbenchState() !== 1 /* EMPTY */ && !this.workspaceTrustManagementService.isWorkspaceTrusted();
  }
  refresh(scope) {
    const kind = classifyBrowserScopeBadge(scope, this.isWorkspaceUntrusted());
    const presentation2 = presentationFor(kind);
    this._container.className = "browser-scope-indicator";
    this._container.dataset.kind = kind;
    if (!presentation2) {
      this._container.style.display = "none";
      this._container.removeAttribute("aria-label");
      this._hover = "";
      return;
    }
    this._container.style.display = "";
    for (const cls of presentation2.className.split(" ")) {
      this._container.classList.add(cls);
    }
    this._iconSlot.replaceChildren(renderIcon(presentation2.icon));
    this._label.textContent = presentation2.label;
    this._container.setAttribute("aria-label", `${presentation2.label}. ${presentation2.hover}`);
    this._hover = presentation2.hover;
  }
};
BrowserScopeIndicatorContribution = __decorateClass([__decorateParam(1, IHoverService), __decorateParam(2, IWorkspaceContextService), __decorateParam(3, IWorkspaceTrustManagementService)], BrowserScopeIndicatorContribution);
BrowserEditor.registerContribution(BrowserScopeIndicatorContribution);

// src/vs/workbench/contrib/browserView/electron-browser/features/browserEditorArenaFollowLatestFeature.ts
export { classifyBrowserScopeBadge, presentationFor, BrowserScopeIndicatorContribution };
