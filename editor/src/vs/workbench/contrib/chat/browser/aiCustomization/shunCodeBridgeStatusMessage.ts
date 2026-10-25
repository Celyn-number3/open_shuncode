// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
import { toDisposable } from "../../../../../base/common/lifecycle.js";
import { Disposable } from "../../../../../base/common/lifecycle.js";
import { addDisposableListener } from "../../../../../base/browser/dom.js";
import { append } from "../../../../../base/browser/dom.js";
import { $ } from "../../../../../base/browser/dom.js";
import { Codicon } from "../../../../../base/common/codicons.js";
import { ThemeIcon } from "../../../../../base/common/themables.js";
import { localizeBridge } from "./shunCodeBridgeLocalization.js";
var privateMcpAddressPattern = /\bhttps?:\/\/[^\s<>"']+\/mcp\/[^\s<>"']+/giu;
var statusMessageIdPool = 0;
function redactShunCodeBridgeMcpAddresses(message) {
  return message.replace(privateMcpAddressPattern, localizeBridge("shuncodeBridge.privateMcpAddress", "[private MCP address]"));
}
var ShunCodeBridgeStatusMessage = class extends Disposable {
  constructor(container3) {
    super();
    this.sourceMessage = "";
    this.error = false;
    this.expanded = false;
    this.overflows = false;
    this.observedWidth = -1;
    this.element = append(container3, $(".shuncode-bridge-status-details.shuncode-bridge-status-message"));
    this.element.setAttribute("aria-live", "polite");
    this.messageElement = append(this.element, $(".shuncode-bridge-status-message-text"));
    this.messageElement.id = "shuncode-bridge-status-message-" + String(++statusMessageIdPool);
    this.toggleButton = append(this.element, $("button.shuncode-bridge-status-message-toggle"));
    this.toggleButton.type = "button";
    this.toggleButton.hidden = true;
    this.toggleButton.setAttribute("aria-controls", this.messageElement.id);
    this.toggleIcon = append(this.toggleButton, $("span"));
    this.toggleIcon.setAttribute("aria-hidden", "true");
    this.toggleLabel = append(this.toggleButton, $("span"));
    this._register(addDisposableListener(this.toggleButton, "click", () => {
      this.expanded = !this.expanded;
      this.updatePresentation();
    }));
    if (typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver(entries2 => {
        const width2 = entries2[0]?.contentRect.width ?? this.element.clientWidth;
        if (width2 === this.observedWidth) return;
        this.observedWidth = width2;
        this.layout();
      });
      resizeObserver.observe(this.element);
      this._register(toDisposable(() => resizeObserver.disconnect()));
    }
  }
  render(state) {
    const changed = state.message !== this.sourceMessage || state.error !== this.error;
    this.sourceMessage = state.message;
    this.error = state.error;
    if (changed || !this.error) this.expanded = false;
    this.messageElement.textContent = redactShunCodeBridgeMcpAddresses(state.message);
    this.element.setAttribute("role", this.error ? "alert" : "status");
    this.layout();
  }
  layout() {
    if (!this.error || !this.messageElement.textContent) {
      this.overflows = false;
      this.expanded = false;
      this.updatePresentation();
      return;
    }
    this.messageElement.classList.add("collapsed");
    this.overflows = this.messageElement.scrollHeight > this.messageElement.clientHeight + 1;
    if (!this.overflows) this.expanded = false;
    this.updatePresentation();
  }
  updatePresentation() {
    const collapsed2 = this.error && this.overflows && !this.expanded;
    this.messageElement.classList.toggle("collapsed", collapsed2);
    this.toggleButton.hidden = !this.overflows;
    this.toggleButton.setAttribute("aria-expanded", String(this.expanded));
    const label3 = this.expanded ? localizeBridge("shuncodeBridge.collapseError", "Collapse error") : localizeBridge("shuncodeBridge.expandError", "Expand full error");
    this.toggleButton.title = label3;
    this.toggleButton.setAttribute("aria-label", label3);
    this.toggleLabel.textContent = label3;
    this.toggleIcon.className = ThemeIcon.asClassName(this.expanded ? Codicon.chevronUp : Codicon.chevronDown);
  }
};
export { privateMcpAddressPattern, statusMessageIdPool, redactShunCodeBridgeMcpAddresses, ShunCodeBridgeStatusMessage };
