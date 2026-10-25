// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
import { __decorateClass } from "../../../../../../../base/common/shunCodeRecoveredHelpersWorkbench.js";
import { __decorateParam } from "../../../../../../../base/common/shunCodeRecoveredHelpersWorkbench.js";
import { localize } from "../../../../../../../nls.js";
import { URI } from "../../../../../../../base/common/uri.js";
import { isUriComponents } from "../../../../../../../base/common/uri.js";
import { addDisposableListener } from "../../../../../../../base/browser/dom.js";
import { EventType } from "../../../../../../../base/browser/dom.js";
import { append } from "../../../../../../../base/browser/dom.js";
import { $ } from "../../../../../../../base/browser/dom.js";
import { Codicon } from "../../../../../../../base/common/codicons.js";
import { ThemeIcon } from "../../../../../../../base/common/themables.js";
import { ICommandService } from "../../../../../../../platform/commands/common/commands.js";
import { IOpenerService } from "../../../../../../../platform/opener/common/opener.js";
import { IChatToolInvocation } from "../../../../common/chatService/chatService.js";
import { ChatCollapsibleContentPart } from "../chatCollapsibleContentPart.js";
import { BaseChatToolInvocationSubPart } from "./chatToolInvocationSubPart.js";
// src/vs/workbench/contrib/chat/browser/widget/chatContentParts/toolInvocationParts/shunCodeChatToolProgressPart.ts
function messageText(message) {
  return typeof message === "string" ? message : message?.value ?? "";
}
function formatDuration(durationMs) {
  if (durationMs === void 0) return "";
  if (durationMs < 1e3) return `${durationMs} ms`;
  return `${(durationMs / 1e3).toFixed(durationMs < 1e4 ? 1 : 0)} s`;
}
function presentationIcon(kind) {
  switch (kind) {
    case "files":
      return Codicon.files;
    case "search":
      return Codicon.search;
    case "edit":
      return Codicon.edit;
    case "terminal":
      return Codicon.terminal;
    case "diagnostics":
      return Codicon.warning;
    case "lsp":
      return Codicon.symbolMethod;
    default:
      return Codicon.tools;
  }
}
var ShunCodeChatToolProgressPart = class extends BaseChatToolInvocationSubPart {
  constructor(toolInvocation, message, subtitle, data, openerService, commandService) {
    super(toolInvocation);
    this.openerService = openerService;
    this.commandService = commandService;
    this.codeblocks = [];
    const kind = data.presentationKind ?? "generic";
    const isComplete = IChatToolInvocation.isComplete(toolInvocation);
    const isError = data.isError === true;
    const state = isError ? "error" : isComplete ? "completed" : "running";
    const activity = $("details.shuncode-chat-activity");
    activity.open = ShunCodeChatToolProgressPart.expandedState.get(toolInvocation.toolCallId) ?? false;
    activity.classList.add(`state-${state}`, `kind-${kind}`);
    const header2 = append(activity, $("summary.shuncode-chat-activity-header"));
    const icon2 = append(header2, $("span.shuncode-chat-activity-icon"));
    const iconValue = state === "running" ? ThemeIcon.modify(Codicon.loading, "spin") : isError ? Codicon.error : presentationIcon(kind);
    icon2.classList.add(...ThemeIcon.asClassNameArray(iconValue));
    const labels2 = append(header2, $(".shuncode-chat-activity-labels"));
    const title = messageText(message) || localize("recovered.11328", "Working\u2026");
    append(labels2, $("span.shuncode-chat-activity-title", void 0, title));
    const secondary = data.summary || messageText(subtitle);
    if (secondary) append(labels2, $("span.shuncode-chat-activity-subtitle", void 0, secondary));
    const meta = append(header2, $("span.shuncode-chat-activity-meta"));
    meta.textContent = state === "running" ? localize("recovered.11327", "Running\u2026") : state === "error" ? localize("recovered.11319", "Failed") : formatDuration(data.durationMs) || localize("recovered.11318", "Completed");
    const syncExpandedState = () => {
      header2.setAttribute("aria-expanded", String(activity.open));
      ShunCodeChatToolProgressPart.expandedState.set(toolInvocation.toolCallId, activity.open);
    };
    this._register(addDisposableListener(header2, EventType.CLICK, event => {
      event.preventDefault();
      activity.dispatchEvent(new CustomEvent(ChatCollapsibleContentPart.userToggleEvent, {
        bubbles: true
      }));
      activity.open = !activity.open;
      syncExpandedState();
    }));
    this._register(addDisposableListener(activity, "toggle", syncExpandedState));
    syncExpandedState();
    if (kind === "edit") this.renderEditSummary(header2, data);
    const body = append(activity, $(".shuncode-chat-activity-body"));
    if (kind !== "edit") this.renderItems(body, data, kind);
    this.renderMiniDiff(body, data);
    this.renderActions(body, data);
    this.renderMetrics(body, data);
    this.renderCodeSection(body, localize("recovered.11320", "Input"), data.input);
    this.renderCodeSection(body, localize("recovered.11326", "Output"), data.output);
    this.domNode = activity;
  }
  static {
    this.expandedState = /* @__PURE__ */new Map();
  }
  renderMetrics(parent, data) {
    if (!data.metrics?.length) return;
    const metrics = append(parent, $(".shuncode-chat-activity-metrics"));
    metrics.textContent = data.metrics.map(metric => `${metric.label} ${metric.value}`).join(" \xB7 ");
  }
  renderEditSummary(parent, data) {
    if (!data.items?.length) return;
    const items = append(parent, $(".shuncode-chat-edit-files"));
    for (const item of data.items.slice(0, 12)) {
      const row = this.createResourceRow(items, item, "edit");
      row.classList.add("shuncode-chat-edit-file");
    }
  }
  renderItems(parent, data, kind) {
    if (!data.items?.length) return;
    const items = append(parent, $(".shuncode-chat-activity-items"));
    for (const item of data.items.slice(0, 40)) this.createResourceRow(items, item, kind);
    if (data.items.length > 40) {
      append(items, $("span.shuncode-chat-activity-more", void 0, localize("recovered.11323", "{0} more items", data.items.length - 40)));
    }
  }
  createResourceRow(parent, item, kind) {
    const row = append(parent, item.resource ? $("a.shuncode-chat-activity-item") : $(".shuncode-chat-activity-item"));
    const icon2 = append(row, $("span.shuncode-chat-activity-item-icon"));
    const itemIcon = kind === "search" ? Codicon.search : kind === "diagnostics" ? Codicon.warning : kind === "lsp" ? Codicon.symbolMethod : Codicon.file;
    icon2.classList.add(...ThemeIcon.asClassNameArray(itemIcon));
    const labels2 = append(row, $(".shuncode-chat-activity-item-labels"));
    append(labels2, $("span.shuncode-chat-activity-item-primary", void 0, item.label));
    if (item.description) append(labels2, $("span.shuncode-chat-activity-item-secondary", void 0, item.description));
    if (item.added !== void 0 || item.removed !== void 0) {
      const diff4 = append(row, $("span.shuncode-chat-activity-item-diff"));
      if (item.added !== void 0) append(diff4, $("span.additions", void 0, `+${item.added}`));
      if (item.removed !== void 0) append(diff4, $("span.deletions", void 0, `\u2212${item.removed}`));
    }
    if (item.resource) {
      const resource = URI.isUri(item.resource) ? item.resource : isUriComponents(item.resource) ? URI.revive(item.resource) : URI.revive(item.resource.uri);
      row.href = resource.toString();
      this._register(addDisposableListener(row, EventType.CLICK, event => {
        event.stopPropagation();
        event.preventDefault();
        void this.openerService.open(resource, {
          fromUserGesture: true
        });
      }));
    }
    return row;
  }
  renderMiniDiff(parent, data) {
    if (!data.diffPreview?.length || !data.diff) return;
    const preview = append(parent, $(".shuncode-chat-mini-diff"));
    for (const file of data.diffPreview) {
      const fileBlock = append(preview, $(".shuncode-chat-mini-diff-file"));
      const header2 = append(fileBlock, $(".shuncode-chat-mini-diff-header"));
      const fileButton = append(header2, $("button.shuncode-chat-mini-diff-file-button"));
      fileButton.type = "button";
      const fileIcon = append(fileButton, $("span"));
      fileIcon.classList.add(...ThemeIcon.asClassNameArray(Codicon.file));
      append(fileButton, $("span.shuncode-chat-mini-diff-path", void 0, file.path));
      this._register(addDisposableListener(fileButton, EventType.CLICK, () => void this.commandService.executeCommand("shuncode.bridge.openResource", {
        path: file.path
      })));
      const openDiff = append(header2, $("button.shuncode-chat-mini-diff-open"));
      openDiff.type = "button";
      openDiff.title = localize("recovered.11324", "Open full diff");
      const diffIcon = append(openDiff, $("span"));
      diffIcon.classList.add(...ThemeIcon.asClassNameArray(Codicon.diff));
      this._register(addDisposableListener(openDiff, EventType.CLICK, () => void this.commandService.executeCommand("shuncode.bridge.openDiff", {
        diff: data.diff,
        path: file.path
      })));
      for (let hunkIndex = 0; hunkIndex < file.hunks.length; hunkIndex += 1) {
        if (hunkIndex > 0) append(fileBlock, $(".shuncode-chat-mini-diff-gap", void 0, "\xB7\xB7\xB7"));
        const code = append(fileBlock, $(".shuncode-chat-mini-diff-code"));
        for (const line of file.hunks[hunkIndex].lines) {
          const row = append(code, $(`.shuncode-chat-mini-diff-line.${line.kind}`));
          const lineNumber = line.kind === "delete" ? line.oldLine : line.newLine;
          append(row, $("span.shuncode-chat-mini-diff-line-number", void 0, lineNumber === void 0 ? "" : String(lineNumber)));
          append(row, $("span.shuncode-chat-mini-diff-marker", void 0, line.kind === "add" ? "+" : line.kind === "delete" ? "\u2212" : ""));
          const text2 = append(row, $("span.shuncode-chat-mini-diff-text", void 0, line.text || " "));
          text2.title = line.text;
        }
        if (file.hunks[hunkIndex].truncated) append(code, $(".shuncode-chat-mini-diff-truncated", void 0, localize("recovered.11321", "More changed lines\u2026")));
      }
      if (file.truncated) append(fileBlock, $(".shuncode-chat-mini-diff-truncated", void 0, localize("recovered.11322", "More changes in this file\u2026")));
    }
  }
  renderActions(parent, data) {
    if (!data.terminalId) return;
    const actions = append(parent, $(".shuncode-chat-activity-actions"));
    const button = append(actions, $("button.shuncode-chat-activity-action"));
    button.type = "button";
    const icon2 = append(button, $("span"));
    icon2.classList.add(...ThemeIcon.asClassNameArray(Codicon.terminal));
    append(button, $("span", void 0, localize("recovered.11325", "Open Terminal")));
    this._register(addDisposableListener(button, EventType.CLICK, () => void this.commandService.executeCommand("shuncode.bridge.openTerminal", data.terminalId)));
  }
  renderCodeSection(parent, label3, value2) {
    if (!value2) return;
    const section = append(parent, $(".shuncode-chat-activity-section"));
    append(section, $("span.shuncode-chat-activity-section-label", void 0, label3));
    const pre = append(section, $("pre"));
    pre.textContent = value2;
  }
};
ShunCodeChatToolProgressPart = __decorateClass([__decorateParam(4, IOpenerService), __decorateParam(5, ICommandService)], ShunCodeChatToolProgressPart);

// src/vs/workbench/contrib/chat/browser/widget/chatContentParts/toolInvocationParts/abstractToolConfirmationSubPart.ts
export { messageText, formatDuration, presentationIcon, ShunCodeChatToolProgressPart };
