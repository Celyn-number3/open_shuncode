// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
import { __decorateClass } from "../../../../../../base/common/shunCodeRecoveredHelpersWorkbench.js";
import { __decorateParam } from "../../../../../../base/common/shunCodeRecoveredHelpersWorkbench.js";
import { toDisposable } from "../../../../../../base/common/lifecycle.js";
import { Disposable } from "../../../../../../base/common/lifecycle.js";
import { clearNode } from "../../../../../../base/browser/dom.js";
import { addDisposableListener } from "../../../../../../base/browser/dom.js";
import { append } from "../../../../../../base/browser/dom.js";
import { $ } from "../../../../../../base/browser/dom.js";
import { setVisibility } from "../../../../../../base/browser/dom.js";
import { Codicon } from "../../../../../../base/common/codicons.js";
import { ThemeIcon } from "../../../../../../base/common/themables.js";
import { ICommandService } from "../../../../../../platform/commands/common/commands.js";
import { defaultButtonStyles } from "../../../../../../platform/theme/browser/defaultStyles.js";
import { Button } from "../../../../../../base/browser/ui/button/button.js";
import { localizeBridge } from "../../aiCustomization/shunCodeBridgeLocalization.js";
import { BridgeStatusRefresher } from "./bridgeStatusRefresh.js";
import { BridgeTaskViewState } from "./bridgeTaskPresentation.js";
var BRIDGE_GET_STATUS2 = "shuncode.bridge.getStatus";
var BRIDGE_START2 = "shuncode.bridge.start";
var BRIDGE_STOP2 = "shuncode.bridge.stop";
var BRIDGE_CHECK_HEALTH = "shuncode.bridge.checkHealth";
var BRIDGE_CLEAR_ACTIVITY_LOG = "shuncode.bridge.clearActivityLog";
var BRIDGE_OPEN_RESOURCE2 = "shuncode.bridge.openResource";
var BRIDGE_OPEN_DIFF = "shuncode.bridge.openDiff";
var BRIDGE_OPEN_TERMINAL = "shuncode.bridge.openTerminal";
function formatDuration4(durationMs) {
  if (durationMs === void 0) {
    return "";
  }
  if (durationMs < 1e3) {
    return `${durationMs} ms`;
  }
  return `${(durationMs / 1e3).toFixed(durationMs < 1e4 ? 1 : 0)} s`;
}
function formatTime(value2) {
  if (!value2) {
    return "";
  }
  const date = new Date(value2);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}
function activityIcon(activity) {
  if (activity.status === "error") {
    return Codicon.error;
  }
  if (activity.status === "running") {
    return ThemeIcon.modify(Codicon.loading, "spin");
  }
  switch (activity.presentation?.kind) {
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
var ShunCodeBridgeSessionView = class extends Disposable {
  constructor(parent, commandService) {
    super();
    this.commandService = commandService;
    this.visible = false;
    this.taskViewState = new BridgeTaskViewState();
    // One in-flight status read at a time, with a deadline, backoff and disposal: a stuck
    // request can no longer freeze every later refresh.
    this.statusRefresher = new BridgeStatusRefresher(() => this.commandService.executeCommand(BRIDGE_GET_STATUS2), (status2, force) => {
      this.lastStatus = status2;
      this.render(status2, force);
    }, error => this.renderRefreshError(error), () => this.visible && !this.busy);
    this.busy = false;
    this.checkingHealth = false;
    this.footerCollapsed = false;
    this.todoExpanded = true;
    this.expandedToolActivities = /* @__PURE__ */new Set();
    this.lastRevision = -1;
    this.followTimeline = true;
    this.suppressScrollTracking = false;
    this.userScrollActiveUntil = 0;
    this.root = append(parent, $(".shuncode-bridge-session-view"));
    this.root.style.display = "none";
    this.todosRegion = append(this.root, $(".shuncode-bridge-session-todos-region"));
    this.timelineScroll = append(this.root, $(".shuncode-bridge-session-scroll"));
    this.timeline = append(this.timelineScroll, $(".shuncode-bridge-session-timeline"));
    this._register(addDisposableListener(this.timelineScroll, "scroll", () => this.onTimelineScroll()));
    this._register(addDisposableListener(this.root, "wheel", event => {
      event.stopPropagation();
    }));
    const footer = append(this.root, $(".shuncode-bridge-session-footer"));
    const connectionRow = append(footer, $(".shuncode-bridge-session-connection-row"));
    const connectionHeader = append(connectionRow, $(".shuncode-bridge-session-connection-header"));
    const connectionInfo = append(connectionHeader, $(".shuncode-bridge-session-connection-info"));
    const connectionHeading = append(connectionInfo, $(".shuncode-bridge-session-connection-heading"));
    this.connectionDot = append(connectionHeading, $("span.shuncode-bridge-session-dot"));
    this.connectionTitle = append(connectionHeading, $("strong"));
    this.connectionDescription = append(connectionInfo, $("span.shuncode-bridge-session-connection-description"));
    this.collapseButton = this._register(new Button(connectionHeader, {
      ...defaultButtonStyles,
      secondary: true,
      supportIcons: true
    }));
    this.collapseButton.element.classList.add("shuncode-bridge-session-collapse-button");
    this._register(this.collapseButton.onDidClick(() => this.toggleFooterCollapsed()));
    const connectionActions = append(connectionRow, $(".shuncode-bridge-session-connection-actions"));
    this.startStopButton = this._register(new Button(connectionActions, {
      ...defaultButtonStyles,
      supportIcons: true
    }));
    this.startStopButton.element.classList.add("shuncode-bridge-session-start-stop-button");
    this._register(this.startStopButton.onDidClick(() => void this.toggleBridge()));
    this.clearLogButton = this._register(new Button(connectionActions, {
      ...defaultButtonStyles,
      secondary: true,
      supportIcons: true
    }));
    this.clearLogButton.element.classList.add("shuncode-bridge-session-action-button", "shuncode-bridge-session-clear-button");
    this._register(this.clearLogButton.onDidClick(() => void this.clearActivityLog()));
    this.healthButton = this._register(new Button(connectionActions, {
      ...defaultButtonStyles,
      secondary: true,
      supportIcons: true
    }));
    this.healthButton.element.classList.add("shuncode-bridge-session-action-button", "shuncode-bridge-session-health-button");
    this._register(this.healthButton.onDidClick(() => void this.checkHealth()));
    this.footerDetails = append(footer, $(".shuncode-bridge-session-footer-details"));
    this.statsContainer = append(this.footerDetails, $(".shuncode-bridge-session-stats"));
    this.healthRow = append(this.footerDetails, $(".shuncode-bridge-session-health"));
    this.healthDot = append(this.healthRow, $("span.shuncode-bridge-session-dot"));
    this.healthText = append(this.healthRow, $("span.shuncode-bridge-session-health-text"));
    setVisibility(false, this.healthRow);
    this.footerMeta = append(this.footerDetails, $(".shuncode-bridge-session-meta"));
    this.footerHint = append(this.footerDetails, $(".shuncode-bridge-session-hint"));
    this.renderFooterCollapsedState();
    const timer = setInterval(() => void this.refresh(), 350);
    this._register(toDisposable(() => clearInterval(timer)));
    this._register(toDisposable(() => this.statusRefresher.dispose()));
  }
  static {
    this.NEAR_BOTTOM_SCROLL_THRESHOLD_PX = 72;
  }
  static {
    this.USER_SCROLL_RENDER_COOLDOWN_MS = 500;
  }
  setVisible(visible) {
    this.visible = visible;
    setVisibility(visible, this.root);
    if (visible) {
      this.followTimeline = true;
      void this.refresh(true);
    }
  }
  async toggleBridge() {
    if (this.busy) {
      return;
    }
    this.busy = true;
    this.renderControls();
    try {
      const status2 = await this.commandService.executeCommand(this.lastStatus?.state === "running" ? BRIDGE_STOP2 : BRIDGE_START2);
      if (status2) {
        this.lastStatus = status2;
        this.render(status2, true);
      }
    } catch (error) {
      this.connectionDescription.textContent = error instanceof Error ? error.message : String(error);
    } finally {
      this.busy = false;
      this.renderControls();
      void this.refresh(true);
    }
  }
  toggleFooterCollapsed() {
    this.footerCollapsed = !this.footerCollapsed;
    this.renderFooterCollapsedState();
    if (this.lastStatus) {
      this.renderStatus(this.lastStatus);
    }
  }
  async checkHealth() {
    if (this.checkingHealth) {
      return;
    }
    this.checkingHealth = true;
    this.healthError = void 0;
    this.renderControls();
    this.renderHealth(this.lastStatus?.health);
    try {
      const status2 = await this.commandService.executeCommand(BRIDGE_CHECK_HEALTH);
      if (status2) {
        this.lastStatus = status2;
        this.render(status2, false);
      }
    } catch (error) {
      this.healthError = error instanceof Error ? error.message : String(error);
    } finally {
      this.checkingHealth = false;
      this.renderControls();
      this.renderHealth(this.lastStatus?.health);
    }
  }
  async clearActivityLog() {
    if (this.busy) {
      return;
    }
    this.busy = true;
    this.renderControls();
    try {
      const status2 = await this.commandService.executeCommand(BRIDGE_CLEAR_ACTIVITY_LOG);
      this.expandedToolActivities.clear();
      this.followTimeline = true;
      if (status2) {
        this.lastStatus = status2;
        this.render(status2, true);
      }
    } catch (error) {
      this.connectionDescription.textContent = error instanceof Error ? error.message : String(error);
    } finally {
      this.busy = false;
      this.renderControls();
    }
  }
  renderFooterCollapsedState() {
    this.root.classList.toggle("footer-collapsed", this.footerCollapsed);
    setVisibility(!this.footerCollapsed, this.footerDetails);
    this.collapseButton.label = `$(${this.footerCollapsed ? Codicon.chevronUp.id : Codicon.chevronDown.id})`;
    const title = this.footerCollapsed ? localizeBridge("shuncodeBridgeSession.expandStatus", "Expand Bridge status") : localizeBridge("shuncodeBridgeSession.collapseStatus", "Collapse Bridge status");
    this.collapseButton.setTitle(title);
    this.collapseButton.element.setAttribute("aria-label", title);
    this.collapseButton.element.setAttribute("aria-expanded", String(!this.footerCollapsed));
  }
  async refresh(force = false) {
    await this.statusRefresher.refresh(force);
  }
  renderRefreshError(error) {
    this.connectionTitle.textContent = localizeBridge("shuncodeBridgeSession.unavailable", "Bridge unavailable");
    this.connectionDescription.textContent = error instanceof Error ? error.message : String(error);
    this.connectionDot.className = "shuncode-bridge-session-dot state-error";
  }
  render(status2, force) {
    this.taskSnapshot = status2.tasks?.find(task => task.id === status2.taskId) ?? status2.tasks?.[0];
    if (force || status2.revision !== this.lastRevision && Date.now() >= this.userScrollActiveUntil) {
      this.renderTimeline(status2.activities, status2.todos);
      this.lastRevision = status2.revision;
    }
    this.renderStatus(status2);
    this.renderControls();
  }
  renderTimeline(activities, todos) {
    clearNode(this.todosRegion);
    clearNode(this.timeline);
    this.renderTodos(todos, activities);
    if (!activities.length) {
      const empty = append(this.timeline, $(".shuncode-bridge-session-empty"));
      const icon2 = append(empty, $("span"));
      icon2.classList.add(...ThemeIcon.asClassNameArray(Codicon.radioTower));
      append(empty, $("strong", void 0, localizeBridge("shuncodeBridgeSession.waiting", "Waiting for MCP client connection")));
      append(empty, $("span", void 0, localizeBridge("shuncodeBridgeSession.waitingDetail", "Tool calls from the MCP client connected to Bridge appear here. By default, operations target the workspace folder(s) currently open in ShunCode on this Windows PC. Conversation input remains in the external client.")));
      return;
    }
    for (const activity of activities) {
      if (activity.status === "progress") {
        this.renderProgress(activity);
      } else {
        this.renderToolCard(activity);
      }
    }
    if (this.followTimeline) {
      this.scrollTimelineToBottom();
    }
  }
  onTimelineScroll() {
    if (this.suppressScrollTracking) {
      return;
    }
    this.userScrollActiveUntil = Date.now() + ShunCodeBridgeSessionView.USER_SCROLL_RENDER_COOLDOWN_MS;
    const distanceFromBottom = this.timelineScroll.scrollHeight - this.timelineScroll.scrollTop - this.timelineScroll.clientHeight;
    this.followTimeline = distanceFromBottom < ShunCodeBridgeSessionView.NEAR_BOTTOM_SCROLL_THRESHOLD_PX;
  }
  scrollTimelineToBottom() {
    queueMicrotask(() => {
      this.suppressScrollTracking = true;
      this.timelineScroll.scrollTop = this.timelineScroll.scrollHeight;
      setTimeout(() => {
        this.suppressScrollTracking = false;
        this.followTimeline = true;
      }, 0);
    });
  }
  /** Task-level states render even before a plan exists, so an empty card never looks like "nothing happened". */
  renderTaskPlaceholder(task) {
    const card = append(this.todosRegion, $("details.shuncode-bridge-todos.shuncode-bridge-task-card.shuncode-bridge-task-placeholder"));
    card.open = this.taskViewState.expanded;
    const summary = append(card, $("summary.shuncode-bridge-todos-summary"));
    this.bindDetailsToggle(card, summary, expanded2 => this.taskViewState.expanded = expanded2);
    const icon2 = append(summary, $("span.shuncode-bridge-todos-icon"));
    icon2.classList.add(...ThemeIcon.asClassNameArray(task.state === "awaiting_sync" || task.state === "interrupted" ? Codicon.warning : Codicon.checklist));
    const labels2 = append(summary, $(".shuncode-bridge-task-summary-labels"));
    append(labels2, $("strong", void 0, localizeBridge("shuncodeBridgeSession.taskProgress", "Task progress")));
    append(labels2, $("span.shuncode-bridge-task-summary-detail", void 0, localizeBridge("shuncodeBridgeSession.noPlanYet", "No plan reported yet")));
    append(summary, $("span.shuncode-bridge-task-pill", void 0, localizeBridge("shuncodeBridgeSession.noPlanBadge", "No plan")));
    append(summary, $("span.shuncode-bridge-task-state-pill", void 0, this.taskStateLabel(task.state)));
    this.todosRegion.classList.toggle("shuncode-bridge-task-pending", task.state === "awaiting_sync" || task.state === "waiting_plan");
  }
  /** Lifecycle wording is deliberately explicit: interrupted or stale is never shown as complete. */
  taskStateLabel(state) {
    switch (state) {
      case "running":
        return localizeBridge("shuncodeBridgeSession.stateRunning", "In progress");
      case "completed":
        return localizeBridge("shuncodeBridgeSession.stateCompleted", "Completed");
      case "blocked":
        return localizeBridge("shuncodeBridgeSession.stateBlocked", "Blocked");
      case "cancelled":
        return localizeBridge("shuncodeBridgeSession.stateCancelled", "Cancelled");
      case "awaiting_sync":
        return localizeBridge("shuncodeBridgeSession.stateAwaitingSync", "Awaiting update");
      case "interrupted":
        return localizeBridge("shuncodeBridgeSession.stateInterrupted", "Interrupted");
      case "waiting_plan":
        return localizeBridge("shuncodeBridgeSession.stateWaitingPlan", "Planning");
      default:
        return localizeBridge("shuncodeBridgeSession.stateCleared", "Cleared");
    }
  }
  /** Steps removed by a later snapshot stay visible here within the Bridge's bounded history. */
  renderTaskHistory(card, task) {
    const removed = task.history.flatMap(entry => entry.removed.map(todo => ({
      todo,
      revision: entry.revision
    })));
    if (!removed.length) {
      return;
    }
    const history = append(card, $("details.shuncode-bridge-task-history"));
    const summary = append(history, $("summary.shuncode-bridge-task-history-summary", void 0, localizeBridge("shuncodeBridgeSession.earlierSteps", "Earlier steps ({0})", removed.length)));
    this.bindDetailsToggle(history, summary, () => void 0);
    const body = append(history, $(".shuncode-bridge-task-history-body"));
    for (const entry of removed) {
      const row = append(body, $(".shuncode-bridge-task-history-row"));
      append(row, $("span.shuncode-bridge-task-history-step", void 0, `#${entry.revision}`));
      append(row, $("span.shuncode-bridge-task-history-title", void 0, entry.todo.title));
    }
  }
  renderTodos(todos, activities) {
    const task = this.taskSnapshot;
    if (!todos.length) {
      if (task && task.state !== "cleared") {
        this.renderTaskPlaceholder(task);
      }
      return;
    }
    const latestProgressByTodo = /* @__PURE__ */new Map();
    for (const activity of activities) {
      if (activity.status === "progress" && activity.todoId) {
        latestProgressByTodo.set(activity.todoId, activity);
      }
    }
    const taskSummary = this.summarizeTaskProgress(todos, latestProgressByTodo);
    const isFullyComplete = taskSummary.totalCount > 0 && taskSummary.completedCount === taskSummary.totalCount;
    if (task) {
      this.taskViewState.update(task.id, isFullyComplete);
    }
    this.todoExpanded = this.taskViewState.expanded;
    const card = append(this.todosRegion, $("details.shuncode-bridge-todos.shuncode-bridge-task-card"));
    card.open = this.todoExpanded;
    const summary = append(card, $("summary.shuncode-bridge-todos-summary"));
    this.bindDetailsToggle(card, summary, expanded2 => {
      this.todoExpanded = expanded2;
      this.taskViewState.expanded = expanded2;
    });
    const icon2 = append(summary, $("span.shuncode-bridge-todos-icon"));
    icon2.classList.add(...ThemeIcon.asClassNameArray(Codicon.checklist));
    const summaryLabels = append(summary, $(".shuncode-bridge-task-summary-labels"));
    append(summaryLabels, $("strong", void 0, localizeBridge("shuncodeBridgeSession.taskProgress", "Task progress")));
    const summaryDetail = taskSummary.currentTodo ? localizeBridge("shuncodeBridgeSession.currentTaskSummary", "Step {0} / {1} \xB7 {2}", taskSummary.currentIndex + 1, taskSummary.totalCount, taskSummary.currentTodo.title) : localizeBridge("shuncodeBridgeSession.completedTaskSummary", "Completed {0} / {1} steps", taskSummary.completedCount, taskSummary.totalCount);
    append(summaryLabels, $("span.shuncode-bridge-task-summary-detail", void 0, summaryDetail));
    append(summary, $("span.shuncode-bridge-task-pill", void 0, taskSummary.currentTodo ? localizeBridge("shuncodeBridgeSession.stepBadge", "Step {0}/{1}", taskSummary.currentIndex + 1, taskSummary.totalCount) : localizeBridge("shuncodeBridgeSession.doneBadge", "Done {0}/{1}", taskSummary.completedCount, taskSummary.totalCount)));
    const body = append(card, $(".shuncode-bridge-todos-body"));
    if (task) {
      append(summary, $("span.shuncode-bridge-task-state-pill", void 0, this.taskStateLabel(task.state)));
      this.renderTaskHistory(card, task);
    }
    const current = append(body, $(".shuncode-bridge-task-current"));
    const currentIcon = append(current, $("span.shuncode-bridge-task-current-icon"));
    currentIcon.classList.add(...ThemeIcon.asClassNameArray(taskSummary.currentTodo ? ThemeIcon.modify(Codicon.loading, "spin") : Codicon.checkAll));
    const currentBody = append(current, $(".shuncode-bridge-task-current-body"));
    append(currentBody, $("span.shuncode-bridge-task-current-eyebrow", void 0, taskSummary.currentTodo ? localizeBridge("shuncodeBridgeSession.currentStep", "Current step") : localizeBridge("shuncodeBridgeSession.taskComplete", "Task complete")));
    append(currentBody, $("strong.shuncode-bridge-task-current-title", void 0, taskSummary.currentTodo?.title ?? localizeBridge("shuncodeBridgeSession.allStepsCompleted", "All steps completed")));
    const currentMetaParts = [taskSummary.latestProgress?.phase, taskSummary.latestProgress?.message].filter(Boolean);
    append(currentBody, $("span.shuncode-bridge-task-current-meta", void 0, currentMetaParts.length ? currentMetaParts.join(" \xB7 ") : taskSummary.currentTodo ? localizeBridge("shuncodeBridgeSession.waitingForStepUpdate", "Waiting for step updates") : localizeBridge("shuncodeBridgeSession.allStepsCompletedDetail", "All planned steps are complete")));
    if (taskSummary.latestProgress?.percent !== void 0) {
      append(current, $("span.shuncode-bridge-task-current-percent", void 0, `${taskSummary.latestProgress.percent}%`));
    }
    for (const todo of todos) {
      const row = append(body, $(`div.shuncode-bridge-todo.${todo.status.replace("_", "-")}`));
      append(row, $("span.shuncode-bridge-todo-step-index", void 0, String(todos.indexOf(todo) + 1)));
      const statusIcon = append(row, $("span.shuncode-bridge-todo-icon"));
      const todoIcon = todo.status === "completed" ? Codicon.check : todo.status === "in_progress" ? ThemeIcon.modify(Codicon.loading, "spin") : Codicon.circleLargeOutline;
      statusIcon.classList.add(...ThemeIcon.asClassNameArray(todoIcon));
      const labels2 = append(row, $(".shuncode-bridge-todo-labels"));
      append(labels2, $("span.shuncode-bridge-todo-title", void 0, todo.title));
      const progress = latestProgressByTodo.get(todo.id);
      if (todo.status === "in_progress" && progress) {
        const detail2 = [progress.phase, progress.message].filter(Boolean).join(" \xB7 ");
        if (detail2) {
          append(labels2, $("span.shuncode-bridge-todo-progress", void 0, detail2));
        }
        if (progress.percent !== void 0) {
          append(row, $("span.shuncode-bridge-todo-percent", void 0, `${progress.percent}%`));
        }
      }
    }
  }
  summarizeTaskProgress(todos, latestProgressByTodo) {
    const completedCount = todos.filter(todo => todo.status === "completed").length;
    const currentIndex = Math.max(0, todos.findIndex(todo => todo.status === "in_progress"));
    const currentTodo = todos.find(todo => todo.status === "in_progress");
    return {
      currentTodo,
      currentIndex: currentTodo ? currentIndex : completedCount,
      completedCount,
      totalCount: todos.length,
      latestProgress: currentTodo ? latestProgressByTodo.get(currentTodo.id) : void 0
    };
  }
  renderProgress(activity) {
    const row = append(this.timeline, $(".shuncode-bridge-progress-row"));
    const icon2 = append(row, $("span.shuncode-bridge-progress-icon"));
    icon2.classList.add(...ThemeIcon.asClassNameArray(Codicon.info));
    const body = append(row, $(".shuncode-bridge-progress-body"));
    if (activity.todoTitle) {
      append(body, $("span.shuncode-bridge-progress-task", void 0, localizeBridge("shuncodeBridgeSession.progressTask", "Task \xB7 {0}", activity.todoTitle)));
    }
    if (activity.phase) {
      append(body, $("strong", void 0, activity.phase));
    }
    append(body, $("span", void 0, activity.message ?? localizeBridge("shuncodeBridgeSession.progress", "Working\u2026")));
    if (activity.percent !== void 0) {
      append(row, $("span.shuncode-bridge-progress-percent", void 0, `${activity.percent}%`));
    }
  }
  renderToolCard(activity) {
    const presentation2 = activity.presentation ?? {
      kind: "generic",
      title: activity.tool
    };
    const card = append(this.timeline, $("details.shuncode-bridge-tool-card"));
    card.open = this.expandedToolActivities.has(activity.id);
    card.classList.add(`state-${activity.status}`, `kind-${presentation2.kind}`);
    const summary = append(card, $("summary.shuncode-bridge-tool-summary"));
    this.bindDetailsToggle(card, summary, expanded2 => {
      if (expanded2) {
        this.expandedToolActivities.add(activity.id);
      } else {
        this.expandedToolActivities.delete(activity.id);
      }
    });
    const icon2 = append(summary, $("span.shuncode-bridge-tool-icon"));
    icon2.classList.add(...ThemeIcon.asClassNameArray(activityIcon(activity)));
    const labels2 = append(summary, $(".shuncode-bridge-tool-labels"));
    append(labels2, $("span.shuncode-bridge-tool-title", void 0, presentation2.title));
    if (presentation2.subtitle) append(labels2, $("span.shuncode-bridge-tool-subtitle", void 0, presentation2.subtitle));
    const meta = append(summary, $("span.shuncode-bridge-tool-meta"));
    meta.textContent = activity.status === "running" ? localizeBridge("shuncodeBridgeSession.running", "Running\u2026") : activity.status === "error" ? localizeBridge("shuncodeBridgeSession.failed", "Failed") : formatDuration4(activity.durationMs) || localizeBridge("shuncodeBridgeSession.completed", "Completed");
    if (presentation2.kind === "edit") {
      this.renderEditSummaryItems(summary, presentation2);
    }
    const body = append(card, $(".shuncode-bridge-tool-body"));
    if (presentation2.kind !== "edit") {
      this.renderToolItems(body, presentation2);
    }
    if (presentation2.kind === "edit") {
      this.renderMiniDiff(body, presentation2);
    }
    if (presentation2.terminalId) {
      const actions = append(body, $(".shuncode-bridge-tool-actions"));
      const openTerminal = append(actions, $("button.shuncode-bridge-tool-action"));
      const terminalIcon = append(openTerminal, $("span"));
      terminalIcon.classList.add(...ThemeIcon.asClassNameArray(Codicon.terminal));
      append(openTerminal, $("span", void 0, localizeBridge("shuncodeBridgeSession.openTerminal", "Open Terminal")));
      openTerminal.addEventListener("click", () => void this.commandService.executeCommand(BRIDGE_OPEN_TERMINAL, presentation2.terminalId));
    }
    const showRawInput = presentation2.kind === "generic" || activity.tool === "send_command_input";
    this.renderCodeSection(body, localizeBridge("shuncodeBridgeSession.input", "Input"), showRawInput ? presentation2.input : void 0);
    this.renderCodeSection(body, localizeBridge("shuncodeBridgeSession.output", "Output"), presentation2.output);
    if (activity.message && activity.status === "error" && activity.message !== presentation2.output) {
      const error = append(body, $(".shuncode-bridge-tool-error"));
      error.textContent = activity.message;
    }
  }
  bindDetailsToggle(card, summary, onDidToggle) {
    const syncExpandedState = () => {
      summary.setAttribute("aria-expanded", String(card.open));
      onDidToggle(card.open);
    };
    summary.addEventListener("click", event => {
      event.preventDefault();
      card.open = !card.open;
      syncExpandedState();
    });
    card.addEventListener("toggle", syncExpandedState);
    syncExpandedState();
  }
  renderEditSummaryItems(parent, presentation2) {
    const items = (presentation2.items ?? []).filter(item => item.kind === "file");
    if (!items.length) {
      return;
    }
    const list2 = append(parent, $(".shuncode-bridge-edit-summary-files"));
    for (const item of items.slice(0, 8)) {
      const row = append(list2, $("button.shuncode-bridge-edit-summary-file"));
      row.type = "button";
      const icon2 = append(row, $("span.shuncode-bridge-edit-summary-file-icon"));
      icon2.classList.add(...ThemeIcon.asClassNameArray(Codicon.file));
      append(row, $("span.shuncode-bridge-edit-summary-file-path", void 0, item.path));
      if (item.additions !== void 0 || item.deletions !== void 0) {
        const stats = append(row, $("span.shuncode-bridge-edit-summary-file-stats"));
        append(stats, $("span.additions", void 0, `+${item.additions ?? 0}`));
        append(stats, $("span.deletions", void 0, `\u2212${item.deletions ?? 0}`));
      }
      row.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        void this.commandService.executeCommand(BRIDGE_OPEN_RESOURCE2, {
          path: item.path
        });
      });
    }
    if (items.length > 8) {
      append(list2, $("span.shuncode-bridge-edit-summary-more", void 0, localizeBridge("shuncodeBridgeSession.moreEditedFiles", "{0} more files", items.length - 8)));
    }
  }
  renderMiniDiff(parent, presentation2) {
    if (!presentation2.diffPreview?.length || !presentation2.diff) {
      return;
    }
    const preview = append(parent, $(".shuncode-bridge-mini-diff"));
    for (const file of presentation2.diffPreview) {
      const fileBlock = append(preview, $(".shuncode-bridge-mini-diff-file"));
      const header2 = append(fileBlock, $(".shuncode-bridge-mini-diff-header"));
      const fileButton = append(header2, $("button.shuncode-bridge-mini-diff-file-button"));
      fileButton.type = "button";
      const fileIcon = append(fileButton, $("span"));
      fileIcon.classList.add(...ThemeIcon.asClassNameArray(Codicon.file));
      append(fileButton, $("span.shuncode-bridge-mini-diff-path", void 0, file.path));
      fileButton.addEventListener("click", () => void this.commandService.executeCommand(BRIDGE_OPEN_RESOURCE2, {
        path: file.path
      }));
      const openDiff = append(header2, $("button.shuncode-bridge-mini-diff-open"));
      openDiff.type = "button";
      openDiff.setAttribute("title", localizeBridge("shuncodeBridgeSession.openFullDiff", "Open full diff"));
      const diffIcon = append(openDiff, $("span"));
      diffIcon.classList.add(...ThemeIcon.asClassNameArray(Codicon.diff));
      openDiff.addEventListener("click", () => void this.commandService.executeCommand(BRIDGE_OPEN_DIFF, {
        diff: presentation2.diff,
        path: file.path
      }));
      for (let hunkIndex = 0; hunkIndex < file.hunks.length; hunkIndex += 1) {
        if (hunkIndex > 0) {
          append(fileBlock, $("div.shuncode-bridge-mini-diff-gap", void 0, "\xB7\xB7\xB7"));
        }
        const hunk = file.hunks[hunkIndex];
        const code = append(fileBlock, $(".shuncode-bridge-mini-diff-code"));
        for (const line of hunk.lines) {
          const row = append(code, $(`div.shuncode-bridge-mini-diff-line.${line.kind}`));
          const lineNumber = line.kind === "delete" ? line.oldLine : line.newLine;
          append(row, $("span.shuncode-bridge-mini-diff-line-number", void 0, lineNumber === void 0 ? "" : String(lineNumber)));
          append(row, $("span.shuncode-bridge-mini-diff-marker", void 0, line.kind === "add" ? "+" : line.kind === "delete" ? "\u2212" : ""));
          const text2 = append(row, $("span.shuncode-bridge-mini-diff-text", void 0, line.text || " "));
          text2.setAttribute("title", line.text);
        }
        if (hunk.truncated) {
          append(code, $("div.shuncode-bridge-mini-diff-truncated", void 0, localizeBridge("shuncodeBridgeSession.diffMoreLines", "More changed lines\u2026")));
        }
      }
      if (file.truncated) {
        append(fileBlock, $("div.shuncode-bridge-mini-diff-truncated", void 0, localizeBridge("shuncodeBridgeSession.diffMoreHunks", "More changes in this file\u2026")));
      }
    }
  }
  renderToolItems(parent, presentation2) {
    const items = presentation2.items ?? (presentation2.files ?? []).map(path => ({
      kind: "file",
      path
    }));
    if (!items.length) return;
    const container3 = append(parent, $(".shuncode-bridge-tool-items"));
    for (const item of items.slice(0, 40)) {
      const row = append(container3, $("div.shuncode-bridge-tool-item"));
      if (item.severity) row.classList.add(`severity-${item.severity}`);
      row.tabIndex = 0;
      row.setAttribute("role", "button");
      row.setAttribute("title", item.line ? `${item.path}:${item.line}:${item.column ?? 1}` : item.path);
      const icon2 = append(row, $("span.shuncode-bridge-tool-item-icon"));
      const itemIcon = item.kind === "folder" ? Codicon.folder : item.kind === "match" ? Codicon.search : item.kind === "diagnostic" ? item.severity === "error" ? Codicon.error : item.severity === "warning" ? Codicon.warning : Codicon.info : item.kind === "symbol" ? Codicon.symbolMethod : Codicon.file;
      icon2.classList.add(...ThemeIcon.asClassNameArray(itemIcon));
      const labels2 = append(row, $(".shuncode-bridge-tool-item-labels"));
      append(labels2, $("span.shuncode-bridge-tool-item-primary", void 0, item.label || item.path));
      const location2 = item.line ? `${item.path}:${item.line}${item.column ? `:${item.column}` : ""}` : item.label ? item.path : void 0;
      const change = item.additions !== void 0 || item.deletions !== void 0 ? `+${item.additions ?? 0} -${item.deletions ?? 0}` : void 0;
      const secondary = [location2, item.description, change].filter(Boolean).join(" \xB7 ");
      if (secondary) append(labels2, $("span.shuncode-bridge-tool-item-secondary", void 0, secondary));
      const openResource = () => void this.commandService.executeCommand(BRIDGE_OPEN_RESOURCE2, {
        path: item.path,
        line: item.line,
        column: item.column,
        folder: item.kind === "folder"
      });
      row.addEventListener("click", openResource);
      row.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openResource();
        }
      });
      if (presentation2.kind === "edit" && presentation2.diff && item.kind === "file") {
        const diffButton = append(row, $("button.shuncode-bridge-tool-item-action"));
        diffButton.type = "button";
        diffButton.setAttribute("title", localizeBridge("shuncodeBridgeSession.openFileDiff", "Open file diff"));
        const diffIcon = append(diffButton, $("span"));
        diffIcon.classList.add(...ThemeIcon.asClassNameArray(Codicon.diff));
        diffButton.addEventListener("click", event => {
          event.stopPropagation();
          void this.commandService.executeCommand(BRIDGE_OPEN_DIFF, {
            diff: presentation2.diff,
            path: item.path
          });
        });
      }
    }
    if (items.length > 40) append(container3, $("span.shuncode-bridge-tool-more", void 0, localizeBridge("shuncodeBridgeSession.moreItems", "{0} more items", items.length - 40)));
  }
  renderCodeSection(parent, label3, value2) {
    if (!value2) {
      return;
    }
    const section = append(parent, $(".shuncode-bridge-tool-section"));
    append(section, $("span.shuncode-bridge-tool-section-label", void 0, label3));
    const pre = append(section, $("pre"));
    pre.textContent = value2;
  }
  renderStatus(status2) {
    this.connectionDot.className = `shuncode-bridge-session-dot state-${status2.connected ? "connected" : status2.state}`;
    this.connectionTitle.textContent = localizeBridge("shuncodeBridgeSession.mcpSession", "MCP session");
    if (this.footerCollapsed) {
      const compact2 = [status2.connected ? localizeBridge("shuncodeBridgeSession.connectedCompact", "Connected") : status2.state === "running" ? localizeBridge("shuncodeBridgeSession.waitingCompact", "Waiting for MCP") : localizeBridge("shuncodeBridgeSession.disconnectedCompact", "Not connected")];
      compact2.push(localizeBridge("shuncodeBridgeSession.toolCallsCompact", "{0} tool calls", status2.stats.toolCalls));
      if (status2.stats.completedToolCalls > 0) {
        compact2.push(formatDuration4(status2.stats.averageDurationMs));
      }
      compact2.push(`${status2.stats.successRate.toFixed(status2.stats.successRate === 100 ? 0 : 1)}%`);
      this.connectionDescription.textContent = compact2.join(" \xB7 ");
    } else {
      this.connectionDescription.textContent = status2.connected ? localizeBridge("shuncodeBridgeSession.connected", "Connected \xB7 ShunCode tools are available to the external Agent for the workspace currently open in ShunCode on this Windows PC") : status2.state === "running" ? localizeBridge("shuncodeBridgeSession.waitingConnection", "Bridge is running and awaiting an external MCP client connection for the workspace currently open in ShunCode on this Windows PC") : status2.lastError ?? localizeBridge("shuncodeBridgeSession.notRunning", "Bridge is not running");
    }
    clearNode(this.statsContainer);
    this.appendStat(localizeBridge("shuncodeBridgeSession.toolCalls", "Tool calls"), String(status2.stats.toolCalls));
    this.appendStat(localizeBridge("shuncodeBridgeSession.averageResponse", "Average response"), formatDuration4(status2.stats.averageDurationMs));
    this.appendStat(localizeBridge("shuncodeBridgeSession.failures", "Failures"), String(status2.stats.failedToolCalls));
    this.appendStat(localizeBridge("shuncodeBridgeSession.successRate", "Success rate"), `${status2.stats.successRate.toFixed(status2.stats.successRate === 100 ? 0 : 1)}%`);
    this.renderHealth(status2.health);
    const pieces = [localizeBridge("shuncodeBridgeSession.transport", "Streamable HTTP")];
    if (status2.activeRequests > 0) {
      pieces.push(localizeBridge("shuncodeBridgeSession.activeRequests", "{0} active", status2.activeRequests));
    }
    if (status2.stats.lastTool) {
      pieces.push(localizeBridge("shuncodeBridgeSession.lastTool", "Last tool: {0}", status2.stats.lastTool));
    }
    const lastTime = formatTime(status2.stats.lastToolAt);
    if (lastTime) {
      pieces.push(lastTime);
    }
    this.footerMeta.textContent = pieces.join(" \xB7 ");
    this.footerHint.textContent = status2.connected ? localizeBridge("shuncodeBridgeSession.outputOnlyHint", "The Bridge view in the ShunCode sidebar displays output. By default, operations target the workspace folder(s) currently open in ShunCode on this Windows PC. Conversation interaction continues in the external client.") : localizeBridge("shuncodeBridgeSession.connectHint", "Start Bridge here, then connect from the external client using the configured MCP URL. By default, tool operations target the workspace folder(s) currently open in ShunCode on this Windows PC.");
  }
  appendStat(label3, value2) {
    const stat = append(this.statsContainer, $(".shuncode-bridge-session-stat"));
    append(stat, $("span", void 0, label3));
    append(stat, $("strong", void 0, value2 || "\u2014"));
  }
  renderHealth(health) {
    if (this.checkingHealth) {
      setVisibility(true, this.healthRow);
      this.healthDot.className = "shuncode-bridge-session-dot state-starting";
      this.healthText.textContent = localizeBridge("shuncodeBridgeSession.healthChecking", "Checking Bridge health\u2026");
      this.healthRow.title = "";
      return;
    }
    if (this.healthError) {
      setVisibility(true, this.healthRow);
      this.healthDot.className = "shuncode-bridge-session-dot state-error";
      this.healthText.textContent = localizeBridge("shuncodeBridgeSession.healthFailed", "Health check failed: {0}", this.healthError);
      this.healthRow.title = this.healthError;
      return;
    }
    if (!health) {
      setVisibility(false, this.healthRow);
      return;
    }
    setVisibility(true, this.healthRow);
    this.healthDot.className = `shuncode-bridge-session-dot ${health.ok ? "state-connected" : "state-error"}`;
    const parts = [];
    if (health.ok) {
      parts.push(localizeBridge("shuncodeBridgeSession.healthOk", "Healthy"));
      parts.push(formatDuration4((health.public ?? health.local).latencyMs ?? 0));
    } else {
      parts.push(localizeBridge("shuncodeBridgeSession.healthUnhealthy", "Unhealthy"));
      if (health.state !== "running") {
        parts.push(localizeBridge("shuncodeBridgeSession.healthNotRunning", "Bridge is {0}", health.state));
      }
      if (!health.local.ok) {
        parts.push(localizeBridge("shuncodeBridgeSession.healthLocalFailed", "local: {0}", health.local.error ?? "failed"));
      }
      if (health.public && !health.public.ok) {
        parts.push(localizeBridge("shuncodeBridgeSession.healthPublicFailed", "public: {0}", health.public.error ?? "failed"));
      }
      if (health.state === "running" && !health.tunnelProcessAlive) {
        parts.push(localizeBridge("shuncodeBridgeSession.healthTunnelDown", "tunnel process not running"));
      }
    }
    const checkedAt = formatTime(health.at);
    if (checkedAt) {
      parts.push(checkedAt);
    }
    this.healthText.textContent = parts.join(" \xB7 ");
    const tooltip = [health.summary];
    if (health.local.url) {
      tooltip.push(localizeBridge("shuncodeBridgeSession.healthTooltipLocal", "Local: {0} ({1})", health.local.url, formatDuration4(health.local.latencyMs ?? 0)));
    }
    if (health.public?.url) {
      tooltip.push(localizeBridge("shuncodeBridgeSession.healthTooltipPublic", "Public: {0} ({1})", health.public.url, formatDuration4(health.public.latencyMs ?? 0)));
    }
    tooltip.push(localizeBridge("shuncodeBridgeSession.healthTooltipSessions", "MCP sessions: {0} \xB7 active requests: {1}", health.sessions, health.activeRequests));
    if (health.lastSessionActivityAt) {
      tooltip.push(localizeBridge("shuncodeBridgeSession.healthLastActivity", "Last MCP activity: {0}", formatTime(health.lastSessionActivityAt)));
    }
    this.healthRow.title = tooltip.join("\n");
  }
  renderControls() {
    const running = this.lastStatus?.state === "running";
    const starting = this.lastStatus?.state === "starting";
    this.startStopButton.enabled = !this.busy && !starting;
    this.startStopButton.label = this.busy || starting ? `$(${Codicon.loading.id}) ${localizeBridge("shuncodeBridgeSession.starting", "Starting\u2026")}` : running ? `$(${Codicon.debugStop.id}) ${localizeBridge("shuncodeBridgeSession.stopBridge", "Stop Bridge")}` : `$(${Codicon.plug.id}) ${localizeBridge("shuncodeBridgeSession.startBridge", "Start Bridge")}`;
    this.healthButton.enabled = !this.checkingHealth && !starting;
    this.healthButton.label = this.checkingHealth ? `$(${Codicon.loading.id}) ${localizeBridge("shuncodeBridgeSession.checkingHealthShort", "Checking\u2026")}` : `$(${Codicon.pulse.id}) ${localizeBridge("shuncodeBridgeSession.checkHealthShort", "Health")}`;
    const healthTitle = localizeBridge("shuncodeBridgeSession.checkHealth", "Check MCP health");
    this.healthButton.setTitle(healthTitle);
    this.healthButton.element.setAttribute("aria-label", healthTitle);
    const hasLog = (this.lastStatus?.activities.length ?? 0) > 0 || (this.lastStatus?.stats.toolCalls ?? 0) > 0;
    this.clearLogButton.enabled = !this.busy && hasLog;
    this.clearLogButton.label = `$(${Codicon.clearAll.id}) ${localizeBridge("shuncodeBridgeSession.clearLogShort", "Clear log")}`;
    const clearTitle = localizeBridge("shuncodeBridgeSession.clearLog", "Clear tool call log");
    this.clearLogButton.setTitle(clearTitle);
    this.clearLogButton.element.setAttribute("aria-label", clearTitle);
    this.renderFooterCollapsedState();
  }
};
ShunCodeBridgeSessionView = __decorateClass([__decorateParam(1, ICommandService)], ShunCodeBridgeSessionView);

// src/vs/workbench/contrib/chat/browser/widgetHosts/viewPane/chatViewPane.ts
export { BRIDGE_GET_STATUS2, BRIDGE_START2, BRIDGE_STOP2, BRIDGE_CHECK_HEALTH, BRIDGE_CLEAR_ACTIVITY_LOG, BRIDGE_OPEN_RESOURCE2, BRIDGE_OPEN_DIFF, BRIDGE_OPEN_TERMINAL, formatDuration4, formatTime, activityIcon, ShunCodeBridgeSessionView, BRIDGE_GET_STATUS2 as BRIDGE_GET_STATUS, BRIDGE_START2 as BRIDGE_START, BRIDGE_STOP2 as BRIDGE_STOP, BRIDGE_OPEN_RESOURCE2 as BRIDGE_OPEN_RESOURCE, formatDuration4 as formatDuration };
