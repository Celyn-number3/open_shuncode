// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
import { Disposable } from "../../../../../base/common/lifecycle.js";
import { addDisposableListener } from "../../../../../base/browser/dom.js";
import { append } from "../../../../../base/browser/dom.js";
import { $ } from "../../../../../base/browser/dom.js";
import { Codicon } from "../../../../../base/common/codicons.js";
import { ThemeIcon } from "../../../../../base/common/themables.js";
import { localizeBridge } from "./shunCodeBridgeLocalization.js";
var SHUNCODE_BRIDGE_HIDDEN_URL_MASK = "\u2022".repeat(24);
var ShunCodeBridgePublicUrlField = class extends Disposable {
  constructor(container3, copyText) {
    super();
    this.copyText = copyText;
    this.currentUrl = "";
    this.revealed = false;
    this.element = append(container3, $(".shuncode-bridge-url-section"));
    this.element.hidden = true;
    append(this.element, $(".shuncode-bridge-url-label", void 0, localizeBridge("shuncodeBridge.publicUrl", "MCP address")));
    const row = append(this.element, $(".shuncode-bridge-url-row"));
    const valueContainer = append(row, $(".shuncode-bridge-url-value-container"));
    this.input = append(valueContainer, $("input.shuncode-bridge-url-value"));
    this.input.type = "text";
    this.input.readOnly = true;
    this.input.spellcheck = false;
    this._register(addDisposableListener(this.input, "focus", () => this.input.select()));
    this.visibilityButton = append(valueContainer, $("button.shuncode-bridge-url-visibility"));
    this.visibilityButton.type = "button";
    this.visibilityIcon = append(this.visibilityButton, $("span"));
    this.visibilityIcon.setAttribute("aria-hidden", "true");
    this._register(addDisposableListener(this.visibilityButton, "click", () => {
      this.revealed = !this.revealed;
      this.renderValue();
    }));
    const copyButton = append(row, $("button.shuncode-bridge-copy-url"));
    copyButton.type = "button";
    copyButton.textContent = localizeBridge("copy", "Copy");
    copyButton.title = localizeBridge("shuncodeBridge.copyUrl", "Copy MCP address");
    copyButton.setAttribute("aria-label", localizeBridge("shuncodeBridge.copyUrl", "Copy MCP address"));
    this._register(addDisposableListener(copyButton, "click", async () => {
      if (this.currentUrl) await this.copyText(this.currentUrl);
    }));
    this.notice = append(this.element, $(".shuncode-bridge-address-notice"));
    this.notice.hidden = true;
    this.renderValue();
  }
  render(state) {
    this.currentUrl = state.url?.trim() ?? "";
    if (!this.currentUrl) this.revealed = false;
    this.element.hidden = !this.currentUrl;
    this.notice.textContent = state.notice ?? "";
    this.notice.hidden = !state.notice;
    this.renderValue();
  }
  renderValue() {
    const visibleUrl = this.revealed ? this.currentUrl : "";
    this.input.value = this.currentUrl && !this.revealed ? SHUNCODE_BRIDGE_HIDDEN_URL_MASK : visibleUrl;
    if (visibleUrl) {
      this.input.title = visibleUrl;
      this.input.setAttribute("aria-label", localizeBridge("shuncodeBridge.publicUrl", "MCP address"));
    } else {
      this.input.removeAttribute("title");
      this.input.setAttribute("aria-label", this.currentUrl ? localizeBridge("shuncodeBridge.publicUrlHidden", "MCP address hidden") : localizeBridge("shuncodeBridge.publicUrl", "MCP address"));
    }
    const actionLabel = this.revealed ? localizeBridge("shuncodeBridge.hidePublicUrl", "Hide MCP address") : localizeBridge("shuncodeBridge.showPublicUrl", "Show MCP address");
    this.visibilityButton.title = actionLabel;
    this.visibilityButton.setAttribute("aria-label", actionLabel);
    this.visibilityIcon.className = ThemeIcon.asClassName(this.revealed ? Codicon.eye : Codicon.eyeClosed);
  }
};
export { SHUNCODE_BRIDGE_HIDDEN_URL_MASK, ShunCodeBridgePublicUrlField };
