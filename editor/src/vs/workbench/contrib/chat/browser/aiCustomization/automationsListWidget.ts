// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
import { __decorateClass } from "../../../../../base/common/shunCodeRecoveredHelpersWorkbench.js";
import { __decorateParam } from "../../../../../base/common/shunCodeRecoveredHelpersWorkbench.js";
import { localize } from "../../../../../nls.js";
import { DisposableStore } from "../../../../../base/common/lifecycle.js";
import { Disposable } from "../../../../../base/common/lifecycle.js";
import { MutableDisposable } from "../../../../../base/common/lifecycle.js";
import { Emitter } from "../../../../../base/common/event.js";
import { CancellationToken } from "../../../../../base/common/cancellation.js";
import { URI } from "../../../../../base/common/uri.js";
import { isEqual as isEqual2 } from "../../../../../base/common/resources.js";
import { autorun } from "../../../../../base/common/observableInternal/reactions/autorun.js";
import { clearNode } from "../../../../../base/browser/dom.js";
import { addDisposableListener } from "../../../../../base/browser/dom.js";
import { addStandardDisposableListener } from "../../../../../base/browser/dom.js";
import { isAncestor } from "../../../../../base/browser/dom.js";
import { append } from "../../../../../base/browser/dom.js";
import { $ } from "../../../../../base/browser/dom.js";
import { status } from "../../../../../base/browser/ui/aria/aria.js";
import { IInstantiationService } from "../../../../../platform/instantiation/common/instantiation.js";
import { Codicon } from "../../../../../base/common/codicons.js";
import { ThemeIcon } from "../../../../../base/common/themables.js";
import { ILogService } from "../../../../../platform/log/common/log.js";
import { fromNow } from "../../../../../base/common/date.js";
import { getDurationString } from "../../../../../base/common/date.js";
import { IConfigurationService } from "../../../../../platform/configuration/common/configuration.js";
import { IDialogService } from "../../../../../platform/dialogs/common/dialogs.js";
import { INotificationService } from "../../../../../platform/notification/common/notification.js";
import { getDefaultHoverDelegate } from "../../../../../base/browser/ui/hover/hoverDelegateFactory.js";
import { IWorkspaceContextService } from "../../../../../platform/workspace/common/workspace.js";
import { defaultButtonStyles } from "../../../../../platform/theme/browser/defaultStyles.js";
import { IHoverService } from "../../../../../platform/hover/browser/hover.js";
import { Button } from "../../../../../base/browser/ui/button/button.js";
import { WorkbenchList } from "../../../../../platform/list/browser/listService.js";
import { IEditorGroupsService } from "../../../../services/editor/common/editorGroupsService.js";
import { IEditorService } from "../../../../services/editor/common/editorService.js";
import { IAutomationService } from "../../common/automations/automationService.js";
import { openSessionByResource } from "../agentSessions/agentSessionsOpener.js";
import { IAutomationRunner } from "../../common/automations/automationRunner.js";
import { IAutomationDialogService } from "../../common/automations/automationDialogService.js";
import { CHAT_AUTOMATIONS_ENABLED_SETTING } from "../../common/automations/automationsEnabled.js";
import { DAYS_OF_WEEK } from "../../common/automations/schedule.js";
var $91 = $;
var AUTOMATION_ROW_HEIGHT = 72;
var HISTORY_ROW_HEIGHT = 28;
var HISTORY_HEADER_HEIGHT = 32;
var HISTORY_EMPTY_HEIGHT = 28;
var HISTORY_MORE_HEIGHT = 22;
var MAX_VISIBLE_RUNS = 20;
var AutomationItemDelegate = class {
  // Initial estimate only. Actual row height is measured from the DOM because
  // the list is created with `supportDynamicHeights` (meta wraps, prompt wraps,
  // and run-error text is variable-height). See `hasDynamicHeight` below.
  getHeight(element) {
    if (!element.expanded) {
      return AUTOMATION_ROW_HEIGHT;
    }
    const runs = element.runs;
    const visibleRuns = Math.min(runs.length, MAX_VISIBLE_RUNS);
    if (visibleRuns === 0) {
      return AUTOMATION_ROW_HEIGHT + HISTORY_EMPTY_HEIGHT;
    }
    let historyHeight = HISTORY_HEADER_HEIGHT + visibleRuns * HISTORY_ROW_HEIGHT;
    if (runs.length > MAX_VISIBLE_RUNS) {
      historyHeight += HISTORY_MORE_HEIGHT;
    }
    return AUTOMATION_ROW_HEIGHT + historyHeight;
  }
  hasDynamicHeight(_element) {
    return true;
  }
  getTemplateId(_element) {
    return "automationItem";
  }
};
var AutomationItemRenderer = class {
  constructor(widget, hoverService, notificationService, editorService, editorGroupsService, logService, instantiationService) {
    this.widget = widget;
    this.hoverService = hoverService;
    this.notificationService = notificationService;
    this.editorService = editorService;
    this.editorGroupsService = editorGroupsService;
    this.logService = logService;
    this.instantiationService = instantiationService;
    this.templateId = "automationItem";
  }
  renderTemplate(container3) {
    const disposables = new DisposableStore();
    container3.classList.add("automations-row-wrapper");
    const row = append(container3, $91(".automations-row"));
    const main2 = append(row, $91(".automations-row-main"));
    const nameEl = append(main2, $91(".automations-row-name"));
    const nameTextEl = append(nameEl, $91("span.automations-row-name-text"));
    const disabledBadge = append(nameEl, $91("span.automations-row-disabled-badge"));
    const metaEl = append(main2, $91(".automations-row-meta"));
    const scheduleEl = append(metaEl, $91("span.automations-row-schedule"));
    const sep1 = append(metaEl, $91("span.automations-row-meta-sep"));
    const nextEl = append(metaEl, $91("span.automations-row-next"));
    const sepFolder = append(metaEl, $91("span.automations-row-meta-sep"));
    const folderEl = append(metaEl, $91("span.automations-row-folder"));
    const sep2 = append(metaEl, $91("span.automations-row-meta-sep"));
    const lastEl = append(metaEl, $91("span.automations-row-last"));
    const promptEl = append(main2, $91(".automations-row-prompt"));
    const actions = append(row, $91(".automations-row-actions"));
    const historyPanel = append(container3, $91(".automations-row-history"));
    return {
      container: container3,
      row,
      nameEl,
      nameTextEl,
      disabledBadge,
      scheduleEl,
      sep1,
      nextEl,
      sepFolder,
      folderEl,
      sep2,
      lastEl,
      promptEl,
      actions,
      historyPanel,
      disposables
    };
  }
  renderElement(element, _index, templateData) {
    templateData.disposables.clear();
    const {
      automation,
      runs,
      expanded: expanded2,
      inFlight
    } = element;
    templateData.nameTextEl.textContent = automation.name;
    templateData.row.classList.toggle("automations-row-disabled", !automation.enabled);
    templateData.disabledBadge.textContent = !automation.enabled ? localize("recovered.8709", "Disabled") : "";
    templateData.disabledBadge.style.display = !automation.enabled ? "" : "none";
    templateData.scheduleEl.textContent = formatSchedule(automation);
    templateData.sep1.textContent = "\xB7";
    templateData.nextEl.textContent = formatNextRun(automation);
    templateData.sepFolder.textContent = "\xB7";
    templateData.folderEl.textContent = this.widget.formatTargetLabel(automation);
    if (automation.target.kind === "quickChat") {
      templateData.folderEl.title = localize("recovered.8714", "Runs as a workspace-less chat");
    } else {
      templateData.folderEl.title = automation.target.folderUri.toString();
    }
    if (automation.lastRunAt) {
      templateData.sep2.textContent = "\xB7";
      templateData.sep2.style.display = "";
      templateData.lastEl.textContent = localize("recovered.8736", "Last run {0}", formatRelativeTimeOrIso(automation.lastRunAt));
      templateData.lastEl.style.display = "";
    } else {
      templateData.sep2.style.display = "none";
      templateData.lastEl.style.display = "none";
    }
    templateData.promptEl.textContent = truncate4(automation.prompt, 160);
    templateData.promptEl.title = automation.prompt;
    templateData.disposables.add(addDisposableListener(templateData.row, "click", e => {
      if (isAncestor(e.target, templateData.actions)) {
        return;
      }
      this.widget.toggleExpanded(automation.id);
    }));
    clearNode(templateData.actions);
    templateData.disposables.add(addDisposableListener(templateData.actions, "click", e => {
      e.stopPropagation();
    }));
    this.renderActions(templateData, automation, expanded2, inFlight);
    clearNode(templateData.historyPanel);
    templateData.historyPanel.id = `automation-history-${automation.id}`;
    if (expanded2) {
      this.renderHistoryPanel(templateData, automation, runs);
    }
    templateData.historyPanel.style.display = expanded2 ? "" : "none";
    templateData.container.classList.toggle("automations-row-wrapper-expanded", expanded2);
  }
  renderActions(templateData, automation, expanded2, inFlight) {
    const {
      actions,
      disposables
    } = templateData;
    const runBtn = this.createIconButton(actions, Codicon.play, localize("recovered.8745", "Run now"), inFlight, disposables);
    disposables.add(addStandardDisposableListener(runBtn, "click", () => {
      void this.widget.runNow(automation);
    }));
    const toggleIcon = automation.enabled ? Codicon.eye : Codicon.eyeClosed;
    const toggleTooltip = automation.enabled ? localize("recovered.8730", "Disable") : localize("recovered.8732", "Enable");
    const toggleBtn = this.createIconButton(actions, toggleIcon, toggleTooltip, false, disposables);
    disposables.add(addStandardDisposableListener(toggleBtn, "click", () => {
      void this.widget.toggleEnabled(automation);
    }));
    const editBtn = this.createIconButton(actions, Codicon.edit, localize("recovered.8731", "Edit"), false, disposables);
    disposables.add(addStandardDisposableListener(editBtn, "click", () => {
      void this.widget.openEditDialog(automation);
    }));
    const deleteBtn = this.createIconButton(actions, Codicon.trash, localize("recovered.8729", "Delete"), false, disposables);
    disposables.add(addStandardDisposableListener(deleteBtn, "click", () => {
      void this.widget.deleteAutomation(automation);
    }));
    const histIcon = expanded2 ? Codicon.chevronDown : Codicon.chevronRight;
    const histTooltip = expanded2 ? localize("recovered.8733", "Hide history") : localize("recovered.8758", "Show history");
    const histBtn = this.createIconButton(actions, histIcon, histTooltip, false, disposables);
    histBtn.setAttribute("aria-expanded", expanded2 ? "true" : "false");
    histBtn.setAttribute("aria-controls", `automation-history-${automation.id}`);
    disposables.add(addStandardDisposableListener(histBtn, "click", () => {
      this.widget.toggleExpanded(automation.id);
    }));
  }
  renderHistoryPanel(templateData, automation, runs) {
    const panel = templateData.historyPanel;
    panel.setAttribute("role", "region");
    panel.setAttribute("aria-label", localize("recovered.8734", "Run history for {0}", automation.name));
    if (runs.length === 0) {
      const empty = append(panel, $91(".automations-history-empty"));
      empty.textContent = localize("recovered.8741", "No runs yet.");
      return;
    }
    const heading2 = append(panel, $91("h4.automations-history-heading"));
    heading2.textContent = localize("recovered.8744", "Run history");
    const runsList = append(panel, $91("ul.automations-history-list"));
    const visibleRuns = runs.slice(0, MAX_VISIBLE_RUNS);
    for (const run of visibleRuns) {
      this.renderRunRow(runsList, run, templateData.disposables);
    }
    if (runs.length > MAX_VISIBLE_RUNS) {
      const more = append(panel, $91(".automations-history-more"));
      more.textContent = localize("recovered.8735", "{0} more run(s) not shown.", runs.length - visibleRuns.length);
    }
  }
  renderRunRow(container3, run, disposables) {
    const li = append(container3, $91("li.automations-history-row", {
      "data-run-id": run.id,
      "data-run-status": run.status
    }));
    const statusIcon = append(li, $91("span.automations-history-status.codicon"));
    const {
      iconId,
      spin
    } = runStatusIcon(run.status);
    statusIcon.classList.add(`codicon-${iconId}`);
    if (spin) {
      statusIcon.classList.add("codicon-modifier-spin");
    }
    statusIcon.setAttribute("aria-hidden", "true");
    const text2 = append(li, $91(".automations-history-row-text"));
    const first2 = append(text2, $91(".automations-history-row-first"));
    const statusLabel = append(first2, $91("span.automations-history-row-status"));
    statusLabel.textContent = runStatusLabel(run.status);
    const sep2 = append(first2, $91("span.automations-history-row-sep"));
    sep2.textContent = "\xB7";
    const trig = append(first2, $91("span.automations-history-row-trigger"));
    trig.textContent = runTriggerLabel(run.trigger);
    const sep22 = append(first2, $91("span.automations-history-row-sep"));
    sep22.textContent = "\xB7";
    const started = append(first2, $91("span.automations-history-row-started"));
    started.textContent = localize("recovered.8746", "Started {0}", formatRelativeTimeOrIso(run.startedAt));
    const dur = formatRunDuration(run);
    if (dur) {
      const sep3 = append(first2, $91("span.automations-history-row-sep"));
      sep3.textContent = "\xB7";
      const durEl = append(first2, $91("span.automations-history-row-duration"));
      durEl.textContent = dur;
    }
    if (run.errorMessage) {
      const err = append(text2, $91(".automations-history-row-error"));
      err.textContent = run.errorMessage;
      err.setAttribute("role", "status");
      err.setAttribute("aria-live", "polite");
    }
    if (run.sessionResource) {
      const openButton = append(li, $91("span.automations-history-row-open.codicon.codicon-link-external"));
      openButton.setAttribute("role", "button");
      openButton.setAttribute("tabindex", "0");
      openButton.setAttribute("aria-label", localize("recovered.8742", "Open session"));
      disposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate("element"), openButton, localize("recovered.8742", "Open session")));
      const openSession2 = e => {
        e.stopPropagation();
        const sessionResource = URI.parse(run.sessionResource);
        this.logService.debug(`[AutomationsListWidget] Opening session: ${sessionResource.toString()}`);
        const activeEditor = this.editorService.activeEditor;
        const activeGroupId = this.editorGroupsService.activeGroup.id;
        this.instantiationService.invokeFunction(openSessionByResource, sessionResource).then(() => {
          if (activeEditor) {
            this.editorService.closeEditor({
              editor: activeEditor,
              groupId: activeGroupId
            });
          }
        }).catch(err => {
          this.logService.error(`[AutomationsListWidget] openSession failed for ${sessionResource.toString()}`, err);
          this.notificationService.error(localize("recovered.8743", "Failed to open automation session"));
        });
      };
      disposables.add(addDisposableListener(openButton, "click", openSession2));
      disposables.add(addDisposableListener(openButton, "keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openSession2(e);
        }
      }));
    }
  }
  createIconButton(container3, icon2, tooltip, disabled, disposables) {
    const button = append(container3, $91("button.automations-row-action-button", {
      type: "button",
      "aria-label": tooltip,
      tabindex: "0"
    }));
    button.classList.add(...ThemeIcon.asClassNameArray(icon2));
    button.disabled = disabled;
    disposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate("element"), button, tooltip));
    return button;
  }
  disposeTemplate(templateData) {
    templateData.disposables.dispose();
  }
};
var AutomationsListWidget = class extends Disposable {
  constructor(automationService, automationRunner, dialogService, automationDialogService, hoverService, workspaceContextService, logService, configurationService, instantiationService, notificationService, editorService, editorGroupsService) {
    super();
    this.automationService = automationService;
    this.automationRunner = automationRunner;
    this.dialogService = dialogService;
    this.automationDialogService = automationDialogService;
    this.hoverService = hoverService;
    this.workspaceContextService = workspaceContextService;
    this.logService = logService;
    this.configurationService = configurationService;
    this.instantiationService = instantiationService;
    this.notificationService = notificationService;
    this.editorService = editorService;
    this.editorGroupsService = editorGroupsService;
    this._onDidChangeItemCount = this._register(new Emitter());
    this.onDidChangeItemCount = this._onDidChangeItemCount.event;
    this.newButtonHover = this._register(new MutableDisposable());
    this.newEmptyStateButtonHover = this._register(new MutableDisposable());
    this._emptyStateStore = this._register(new DisposableStore());
    this.runInFlight = /* @__PURE__ */new Set();
    this.expandedRows = /* @__PURE__ */new Set();
    this.displayEntries = [];
    this.lastHeight = 0;
    this.lastWidth = 0;
    this.visible = false;
    this.listDirty = false;
    this.remeasureOnNextLayout = false;
    this.element = $91(".automations-list-widget");
    this.headerEl = append(this.element, $91(".automations-header"));
    this.emptyContainer = append(this.element, $91(".automations-empty-state"));
    this.emptyContainer.style.display = "none";
    this.listContainer = append(this.element, $91(".automations-list"));
    this.renderHeader();
    this.createList();
    this._register(autorun(reader => {
      const items = this.automationService.automations.read(reader);
      this.automationService.runs.read(reader);
      this.updateList(items);
      this._onDidChangeItemCount.fire(items.length);
    }));
  }
  renderHeader() {
    const titleRow = append(this.headerEl, $91(".automations-header-row"));
    const titleEl = append(titleRow, $91("h2.automations-header-title"));
    titleEl.textContent = localize("recovered.8721", "Automations");
    const subtitleEl = append(this.headerEl, $91("p.automations-header-subtitle"));
    subtitleEl.textContent = localize("recovered.8720", "Schedule agent sessions to run on a cadence you choose.");
    const newButton = this._register(new Button(titleRow, {
      ...defaultButtonStyles,
      title: localize("recovered.8737", "New automation")
    }));
    newButton.label = localize("recovered.8737", "New automation");
    newButton.element.classList.add("automations-new-button");
    this._register(newButton.onDidClick(() => this.openCreateDialog()));
    this.newButtonHover.value = this.hoverService.setupManagedHover(getDefaultHoverDelegate("element"), newButton.element, localize("recovered.8738", "Create a new automation"));
  }
  createList() {
    const delegate = new AutomationItemDelegate();
    const renderer = new AutomationItemRenderer(this, this.hoverService, this.notificationService, this.editorService, this.editorGroupsService, this.logService, this.instantiationService);
    this.list = this._register(this.instantiationService.createInstance(WorkbenchList, "AutomationsManagementList", this.listContainer, delegate, [renderer], {
      multipleSelectionSupport: false,
      setRowLineHeight: false,
      supportDynamicHeights: true,
      horizontalScrolling: false,
      accessibilityProvider: {
        getAriaLabel: element => {
          return this.formatAriaLabel(element.automation);
        },
        getWidgetAriaLabel() {
          return localize("recovered.8722", "Automations");
        }
      },
      identityProvider: {
        getId(element) {
          return element.automation.id;
        }
      }
    }));
    this._register(this.list.onDidChangeSelection(() => {
      if (this.list.getSelection().length > 0) {
        this.list.setSelection([]);
      }
    }));
  }
  updateList(items) {
    if (items.length === 0) {
      this.element.classList.add("automations-empty");
      this.displayEntries = [];
      this.listDirty = true;
      this.commitList();
      this.emptyContainer.style.display = "";
      this.listContainer.style.display = "none";
      this.renderEmptyState();
      return;
    }
    this.element.classList.remove("automations-empty");
    this.emptyContainer.style.display = "none";
    this.listContainer.style.display = "";
    this.newEmptyStateButtonHover.clear();
    this.displayEntries = items.map(automation => ({
      type: "automation-item",
      automation,
      runs: this.automationService.runsFor(automation.id).get(),
      expanded: this.expandedRows.has(automation.id),
      inFlight: this.runInFlight.has(automation.id)
    }));
    this.listDirty = true;
    this.commitList();
    if (this.visible && this.lastHeight > 0 && this.lastWidth > 0) {
      this.layout(this.lastHeight, this.lastWidth);
    }
  }
  commitList() {
    if (!this.visible || !this.listDirty) {
      return;
    }
    this.list.splice(0, this.list.length, this.displayEntries);
    this.listDirty = false;
  }
  renderEmptyState() {
    this._emptyStateStore.clear();
    clearNode(this.emptyContainer);
    this.emptyContainer.setAttribute("role", "status");
    const title = append(this.emptyContainer, $91("h3.automations-empty-title"));
    title.textContent = localize("recovered.8719", "No automations yet");
    const message = append(this.emptyContainer, $91("p.automations-empty-message"));
    message.textContent = localize("recovered.8718", "Create an automation to schedule an agent session to run on a cadence you choose.");
    const ctaButton = this._emptyStateStore.add(new Button(this.emptyContainer, {
      ...defaultButtonStyles
    }));
    ctaButton.label = localize("recovered.8717", "Create automation");
    ctaButton.element.classList.add("automations-empty-cta");
    this._emptyStateStore.add(ctaButton.onDidClick(() => this.openCreateDialog()));
    this.newEmptyStateButtonHover.value = this.hoverService.setupManagedHover(getDefaultHoverDelegate("element"), ctaButton.element, localize("recovered.8738", "Create a new automation"));
  }
  toggleExpanded(automationId) {
    if (this.expandedRows.has(automationId)) {
      this.expandedRows.delete(automationId);
    } else {
      this.expandedRows.add(automationId);
    }
    this.updateList(this.automationService.automations.get());
  }
  async runNow(automation) {
    if (!this._isEnabled()) {
      await this._notifyDisabled();
      return;
    }
    if (this.runInFlight.has(automation.id)) {
      return;
    }
    this.runInFlight.add(automation.id);
    this.updateList(this.automationService.automations.get());
    try {
      const operation = this.automationRunner.runOnce(automation, "manual", 0, CancellationToken.None);
      const dispatch = await operation.whenDispatched;
      if (dispatch.kind === "started") {
        status(localize("recovered.8723", "Started automation {0}", automation.name));
      }
      await operation.whenCompleted;
    } catch (err) {
      this.logService.error("[Automations] runNow failed unexpectedly", err);
    } finally {
      this.runInFlight.delete(automation.id);
      this.updateList(this.automationService.automations.get());
    }
  }
  async toggleEnabled(automation) {
    if (!this._isEnabled()) {
      await this._notifyDisabled();
      return;
    }
    try {
      await this.automationService.updateAutomation(automation.id, {
        enabled: !automation.enabled
      });
      status(automation.enabled ? localize("recovered.8710", "Disabled automation {0}", automation.name) : localize("recovered.8711", "Enabled automation {0}", automation.name));
    } catch (err) {
      this.logService.error("[Automations] Failed to toggle automation", err);
    }
  }
  async deleteAutomation(automation) {
    if (!this._isEnabled()) {
      await this._notifyDisabled();
      return;
    }
    const result = await this.dialogService.confirm({
      type: "warning",
      message: localize("recovered.8726", "Delete automation \u201C{0}\u201D?", automation.name),
      detail: localize("recovered.8727", "Runs already in flight will continue. This cannot be undone."),
      primaryButton: localize("recovered.8728", "Delete")
    });
    if (!result.confirmed) {
      return;
    }
    if (!this._isEnabled()) {
      await this._notifyDisabled();
      return;
    }
    try {
      await this.automationService.deleteAutomation(automation.id);
      status(localize("recovered.8708", "Deleted automation {0}", automation.name));
    } catch (err) {
      this.logService.error("[Automations] Failed to delete automation", err);
    }
  }
  async openEditDialog(automation) {
    if (!this._isEnabled()) {
      await this._notifyDisabled();
      return;
    }
    const result = await this.automationDialogService.showAutomationDialog({
      existing: automation
    });
    if (!result || result.kind !== "update") {
      return;
    }
    if (!this._isEnabled()) {
      await this._notifyDisabled();
      return;
    }
    try {
      const updateResult = await this.automationService.updateAutomationIfUnchanged(result.id, result.value, automation);
      if (updateResult.kind === "conflict") {
        throw new Error(updateResult.current ? localize("recovered.8704", "This automation changed while the dialog was open. Reopen it to review the latest values.") : localize("recovered.8707", "This automation was deleted while the dialog was open."));
      }
      status(localize("recovered.8724", "Updated automation {0}", automation.name));
    } catch (err) {
      this.logService.error("[Automations] Failed to update automation", err);
      await this.dialogService.error(localize("recovered.8725", "Failed to update automation."), err instanceof Error ? err.message : String(err));
    }
  }
  formatFolderLabel(folderUri) {
    const folders = this.workspaceContextService.getWorkspace().folders;
    const match2 = folders.find(f => isEqual2(f.uri, folderUri));
    if (match2) {
      return match2.name || match2.uri.toString();
    }
    const segments = folderUri.path.split("/").filter(s => s.length > 0);
    return segments[segments.length - 1] ?? folderUri.toString();
  }
  formatTargetLabel(automation) {
    if (automation.target.kind === "quickChat") {
      return localize("recovered.8713", "without a workspace");
    }
    return localize("recovered.8712", "in {0}", this.formatFolderLabel(automation.target.folderUri));
  }
  formatAriaLabel(automation) {
    const schedule = formatSchedule(automation);
    const target = this.formatTargetLabel(automation);
    return automation.enabled ? localize("recovered.8702", "{0}, {1}, {2}", automation.name, schedule, target) : localize("recovered.8703", "{0}, disabled, {1}, {2}", automation.name, schedule, target);
  }
  _isEnabled() {
    return this.configurationService.getValue(CHAT_AUTOMATIONS_ENABLED_SETTING) === true;
  }
  async _notifyDisabled() {
    await this.dialogService.info(localize("recovered.8716", "Automations are disabled."), localize("recovered.8715", "Enable \u201C{0}\u201D to make changes.", CHAT_AUTOMATIONS_ENABLED_SETTING));
  }
  async openCreateDialog() {
    if (!this._isEnabled()) {
      await this._notifyDisabled();
      return;
    }
    const result = await this.automationDialogService.showAutomationDialog({});
    if (!result || result.kind !== "create") {
      return;
    }
    if (!this._isEnabled()) {
      await this._notifyDisabled();
      return;
    }
    try {
      const created = await this.automationService.createAutomation(result.value);
      status(localize("recovered.8705", "Created automation {0}", created.name));
    } catch (err) {
      this.logService.error("[Automations] Failed to create automation", err);
      await this.dialogService.error(localize("recovered.8706", "Failed to create automation."), err instanceof Error ? err.message : String(err));
    }
  }
  layout(height, width2) {
    this.lastHeight = height;
    this.lastWidth = width2;
    this.element.style.height = `${height}px`;
    if (!this.visible || this.displayEntries.length === 0 || height <= 0 || width2 <= 0) {
      return;
    }
    const headerHeight = this.headerEl.offsetHeight;
    if (headerHeight === 0) {
      return;
    }
    const listHeight = Math.max(0, height - headerHeight);
    this.listContainer.style.height = `${listHeight}px`;
    this.list.layout(listHeight, width2);
    if (this.remeasureOnNextLayout) {
      this.remeasureOnNextLayout = false;
      this.list.rerender();
    }
  }
  setVisible(visible) {
    if (this.visible === visible) {
      return;
    }
    this.visible = visible;
    if (!visible) {
      return;
    }
    this.commitList();
    this.remeasureOnNextLayout = this.list.length > 0;
  }
  fireItemCount() {
    this._onDidChangeItemCount.fire(this.automationService.automations.get().length);
  }
  /** Test-only: number of rows currently in the virtualized list. */
  get itemCount() {
    return this.list.length;
  }
  /**
   * Test-only: snapshot of the view-model rows the list is displaying.
   * The virtualized {@link WorkbenchList} does not lay out rows in a unit-test
   * DOM, so tests assert the derived render state (expansion, runs, in-flight)
   * here instead of querying row elements.
   */
  getDisplayEntriesForTest() {
    return this.displayEntries;
  }
  /**
   * Expands, reveals, and moves keyboard focus to an automation.
   */
  focusAutomation(automationId) {
    const index2 = this.displayEntries.findIndex(entry => entry.automation.id === automationId);
    if (index2 < 0) {
      return false;
    }
    this.expandedRows.add(automationId);
    this.updateList(this.automationService.automations.get());
    this.list.reveal(index2);
    this.list.setFocus([index2]);
    this.list.domFocus();
    return true;
  }
  focus() {
    if (this.list.length > 0) {
      this.list.domFocus();
    }
  }
};
AutomationsListWidget = __decorateClass([__decorateParam(0, IAutomationService), __decorateParam(1, IAutomationRunner), __decorateParam(2, IDialogService), __decorateParam(3, IAutomationDialogService), __decorateParam(4, IHoverService), __decorateParam(5, IWorkspaceContextService), __decorateParam(6, ILogService), __decorateParam(7, IConfigurationService), __decorateParam(8, IInstantiationService), __decorateParam(9, INotificationService), __decorateParam(10, IEditorService), __decorateParam(11, IEditorGroupsService)], AutomationsListWidget);
function formatSchedule(a) {
  switch (a.schedule.interval) {
    case "manual":
      return localize("recovered.8756", "Manual");
    case "hourly":
      return localize("recovered.8755", "Hourly");
    case "daily":
      return localize("recovered.8754", "Daily at {0}", formatHourMinute(a.schedule.scheduleHour, a.schedule.scheduleMinute));
    case "weekly":
      {
        const day2 = dayName(a.schedule.scheduleDay);
        return localize("recovered.8757", "Weekly on {0} at {1}", day2, formatHourMinute(a.schedule.scheduleHour, a.schedule.scheduleMinute));
      }
  }
}
function formatHourMinute(hour2, minute2) {
  const date = /* @__PURE__ */new Date();
  date.setHours(Math.max(0, Math.min(23, hour2 | 0)), Math.max(0, Math.min(59, minute2 | 0)), 0, 0);
  return date.toLocaleTimeString(void 0, {
    hour: "numeric",
    minute: "2-digit"
  });
}
function dayName(day2) {
  const idx = (day2 % 7 + 7) % 7;
  return DAYS_OF_WEEK[idx];
}
function formatNextRun(a) {
  if (!a.enabled || a.schedule.interval === "manual" || !a.nextRunAt) {
    return localize("recovered.8740", "No scheduled run");
  }
  return localize("recovered.8739", "Next run {0}", formatRelativeTimeOrIso(a.nextRunAt));
}
function formatRelativeTimeOrIso(iso) {
  const t2 = Date.parse(iso);
  if (Number.isNaN(t2)) {
    return iso;
  }
  const date = new Date(t2);
  const rel = fromNow(date, true);
  const absolute = date.toLocaleString();
  return `${rel} (${absolute})`;
}
function truncate4(s, max) {
  const single = s.replace(/\s+/g, " ").trim();
  if (single.length <= max) {
    return single;
  }
  return single.slice(0, Math.max(0, max - 1)) + "\u2026";
}
function runStatusIcon(status2) {
  switch (status2) {
    case "pending":
      return {
        iconId: "circle-outline",
        spin: false
      };
    case "running":
      return {
        iconId: "sync",
        spin: true
      };
    case "completed":
      return {
        iconId: "check",
        spin: false
      };
    case "failed":
      return {
        iconId: "error",
        spin: false
      };
  }
}
function runStatusLabel(status2) {
  switch (status2) {
    case "pending":
      return localize("recovered.8749", "Pending");
    case "running":
      return localize("recovered.8750", "Running");
    case "completed":
      return localize("recovered.8747", "Completed");
    case "failed":
      return localize("recovered.8748", "Failed");
  }
}
function runTriggerLabel(trigger) {
  switch (trigger) {
    case "schedule":
      return localize("recovered.8753", "Scheduled");
    case "manual":
      return localize("recovered.8752", "Manual");
    case "catch_up":
      return localize("recovered.8751", "Catch-up");
  }
}
function formatRunDuration(run) {
  if (!run.completedAt) {
    return void 0;
  }
  const startMs = Date.parse(run.startedAt);
  const endMs = Date.parse(run.completedAt);
  if (Number.isNaN(startMs) || Number.isNaN(endMs)) {
    return void 0;
  }
  const durationMs = Math.max(0, endMs - startMs);
  return getDurationString(durationMs);
}

// src/vs/workbench/contrib/chat/browser/aiCustomization/customizationCreatorService.ts
export { $91, AUTOMATION_ROW_HEIGHT, HISTORY_ROW_HEIGHT, HISTORY_HEADER_HEIGHT, HISTORY_EMPTY_HEIGHT, HISTORY_MORE_HEIGHT, MAX_VISIBLE_RUNS, AutomationItemDelegate, AutomationItemRenderer, AutomationsListWidget, formatSchedule, formatHourMinute, dayName, formatNextRun, formatRelativeTimeOrIso, truncate4, runStatusIcon, runStatusLabel, runTriggerLabel, formatRunDuration, $91 as $, truncate4 as truncate };
