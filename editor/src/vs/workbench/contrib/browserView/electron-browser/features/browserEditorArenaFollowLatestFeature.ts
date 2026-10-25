// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
import { __decorateClass } from "../../../../../base/common/shunCodeRecoveredHelpersWorkbench.js";
import { __decorateParam } from "../../../../../base/common/shunCodeRecoveredHelpersWorkbench.js";
import { localize } from "../../../../../nls.js";
import { addDisposableListener } from "../../../../../base/browser/dom.js";
import { EventType } from "../../../../../base/browser/dom.js";
import { $ } from "../../../../../base/browser/dom.js";
import { Codicon } from "../../../../../base/common/codicons.js";
import { ThemeIcon } from "../../../../../base/common/themables.js";
import { Registry } from "../../../../../platform/registry/common/platform.js";
import { IConfigurationService } from "../../../../../platform/configuration/common/configuration.js";
import { Extensions as Extensions4 } from "../../../../../platform/configuration/common/configurationRegistry.js";
import { IHoverService } from "../../../../../platform/hover/browser/hover.js";
import { BrowserEditorContribution } from "../browserEditor.js";
import { BrowserEditor } from "../browserEditor.js";
import { browserArenaFollowLatestSettingId } from "../../common/browserArenaFollowLatestConfiguration.js";
// src/vs/workbench/contrib/browserView/electron-browser/features/browserEditorArenaFollowLatestFeature.ts
Registry.as(Extensions4.Configuration).registerConfiguration({
  id: "browserArenaFollowLatest",
  properties: {
    [browserArenaFollowLatestSettingId]: {
      type: "boolean",
      default: true,
      scope: 1 /* APPLICATION */,
      description: localize("recovered.7205", "\u4EC5\u63A7\u5236\u5F53\u524D\u56DE\u7B54\u7684\u81EA\u52A8\u8DDF\u968F\u3002\u5411\u4E0A\u6EDA\u52A8\u6216\u9009\u4E2D\u6587\u5B57\u4F1A\u6682\u505C\uFF1B\u56DE\u7B54\u7ED3\u675F\u540E\u505C\u6B62\u6EDA\u52A8\uFF1B\u6BCF\u8F6E\u65B0\u56DE\u7B54\u5747\u81EA\u52A8\u5F00\u542F\uFF0C\u4E0D\u53D7\u6B64\u524D\u5F00\u5173\u503C\u5F71\u54CD\u3002")
    }
  }
});
var BrowserEditorArenaFollowLatestContribution = class extends BrowserEditorContribution {
  constructor(editor, configurationService, hoverService) {
    super(editor);
    this.button = $("button.browser-arena-follow-latest");
    this.pending = false;
    this.message = "";
    this.button.type = "button";
    const icon2 = $("span." + ThemeIcon.asClassName(Codicon.arrowDown).split(" ").join("."));
    icon2.setAttribute("aria-hidden", "true");
    this.button.append(icon2);
    this._register(addDisposableListener(this.button, EventType.CLICK, () => {
      void this.toggle();
    }));
    this._register(hoverService.setupDelayedHover(this.button, () => ({
      content: this.message
    })));
    this._register(configurationService.onDidChangeConfiguration(event => {
      if (event.affectsConfiguration(browserArenaFollowLatestSettingId)) {
        this.refresh();
      }
    }));
    this.refresh();
  }
  get widgets() {
    return [{
      location: "postUrl" /* PostUrl */,
      element: this.button,
      order: 21
    }];
  }
  onModelAttached(model, store) {
    this.model = model;
    store.add(model.onDidNavigate(() => this.refresh()));
    store.add(model.onDidChangeArenaFollowLatest(() => this.refresh()));
    this.refresh();
  }
  onModelDetached() {
    this.model = void 0;
    this.refresh();
  }
  refresh() {
    const enabled = this.model?.arenaFollowLatestState.enabled !== false;
    const generating = this.model?.arenaFollowLatestState.generating === true;
    const arena = /^https:\/\/(www\.)?arena\.ai(?:[/:?#]|$)/i.test(this.model?.url ?? "");
    this.button.disabled = !arena || this.pending;
    this.button.setAttribute("aria-pressed", String(enabled));
    this.button.classList.toggle("active", enabled && arena);
    this.message = !arena ? localize("recovered.7204", "\u81EA\u52A8\u8DDF\u968F\u6700\u65B0\u6D88\u606F\uFF08\u4EC5\u9002\u7528\u4E8E Arena\uFF09") : !generating ? localize("recovered.7201", "\u5F53\u524D\u6CA1\u6709\u56DE\u7B54\u6B63\u5728\u751F\u6210\uFF0C\u53EF\u81EA\u7531\u6D4F\u89C8\uFF1B\u4E0B\u4E00\u8F6E\u5C06\u81EA\u52A8\u5F00\u542F\u8DDF\u968F") : enabled ? localize("recovered.7203", "\u672C\u8F6E\u8DDF\u968F\u5DF2\u5F00\u542F\uFF0C\u70B9\u51FB\u6682\u505C\uFF1B\u5411\u4E0A\u6EDA\u52A8\u6216\u9009\u62E9\u6587\u5B57\u4E5F\u4F1A\u6682\u505C") : localize("recovered.7202", "\u672C\u8F6E\u8DDF\u968F\u5DF2\u6682\u505C\uFF0C\u70B9\u51FB\u6062\u590D\uFF1B\u4E0B\u4E00\u8F6E\u5C06\u81EA\u52A8\u5F00\u542F");
    this.button.setAttribute("aria-label", this.message);
  }
  async toggle() {
    if (this.button.disabled) {
      return;
    }
    this.pending = true;
    this.refresh();
    let failed = false;
    try {
      await this.model?.setArenaFollowLatestEnabled(!this.model.arenaFollowLatestState.enabled);
    } catch {
      failed = true;
    } finally {
      this.pending = false;
      this.refresh();
    }
    if (failed) {
      this.message = localize("recovered.7200", "\u672C\u8F6E\u8DDF\u968F\u72B6\u6001\u66F4\u65B0\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u3002");
      this.button.setAttribute("aria-label", this.message);
    }
  }
};
BrowserEditorArenaFollowLatestContribution = __decorateClass([__decorateParam(1, IConfigurationService), __decorateParam(2, IHoverService)], BrowserEditorArenaFollowLatestContribution);
BrowserEditor.registerContribution(BrowserEditorArenaFollowLatestContribution);

// src/vs/workbench/contrib/browserView/electron-browser/browserView.contribution.ts
export { BrowserEditorArenaFollowLatestContribution };
