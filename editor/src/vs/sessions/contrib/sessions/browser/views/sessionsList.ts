// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
import { __decorateClass } from "../../../../../base/common/shunCodeRecoveredHelpersSessions.js";
import { __decorateParam } from "../../../../../base/common/shunCodeRecoveredHelpersSessions.js";
import { localize } from "../../../../../nls.js";
import { toDisposable } from "../../../../../base/common/lifecycle.js";
import { DisposableStore } from "../../../../../base/common/lifecycle.js";
import { Disposable } from "../../../../../base/common/lifecycle.js";
import { MutableDisposable } from "../../../../../base/common/lifecycle.js";
import { Emitter } from "../../../../../base/common/event.js";
import { observableValue } from "../../../../../base/common/observableInternal/observables/observableValue.js";
import { autorun } from "../../../../../base/common/observableInternal/reactions/autorun.js";
import { derived } from "../../../../../base/common/observableInternal/observables/derived.js";
import { observableSignalFromEvent } from "../../../../../base/common/observableInternal/observables/observableSignalFromEvent.js";
import { getWindow } from "../../../../../base/browser/dom.js";
import { clearNode } from "../../../../../base/browser/dom.js";
import { addDisposableListener } from "../../../../../base/browser/dom.js";
import { addStandardDisposableListener } from "../../../../../base/browser/dom.js";
import { isMouseEvent } from "../../../../../base/browser/dom.js";
import { EventType } from "../../../../../base/browser/dom.js";
import { append } from "../../../../../base/browser/dom.js";
import { $ } from "../../../../../base/browser/dom.js";
import { IInstantiationService } from "../../../../../platform/instantiation/common/instantiation.js";
import { Action } from "../../../../../base/common/actions.js";
import { ActionRunner } from "../../../../../base/common/actions.js";
import { Separator } from "../../../../../base/common/actions.js";
import { SubmenuAction } from "../../../../../base/common/actions.js";
import { Codicon } from "../../../../../base/common/codicons.js";
import { ThemeIcon } from "../../../../../base/common/themables.js";
import { ICommandService } from "../../../../../platform/commands/common/commands.js";
import { RawContextKey } from "../../../../../platform/contextkey/common/contextkey.js";
import { IContextKeyService } from "../../../../../platform/contextkey/common/contextkey.js";
import { MenuId } from "../../../../../platform/actions/common/actions.js";
import { IMenuService } from "../../../../../platform/actions/common/actions.js";
import { MenuItemAction } from "../../../../../platform/actions/common/actions.js";
import { IAccessibilityService } from "../../../../../platform/accessibility/common/accessibility.js";
import { fromNow } from "../../../../../base/common/date.js";
import { IConfigurationService } from "../../../../../platform/configuration/common/configuration.js";
import { asCssVariable } from "../../../../../platform/theme/common/colorUtils.js";
import { chartsOrange } from "../../../../../platform/theme/common/colors/chartsColors.js";
import { Gesture } from "../../../../../base/browser/touch.js";
import { LocalSelectionTransfer } from "../../../../../platform/dnd/browser/dnd.js";
import { IKeybindingService } from "../../../../../platform/keybinding/common/keybinding.js";
import { ServiceCollection } from "../../../../../platform/instantiation/common/serviceCollection.js";
import { getDefaultHoverDelegate } from "../../../../../base/browser/ui/hover/hoverDelegateFactory.js";
import { createMatches } from "../../../../../base/common/filters.js";
import { NotSelectableGroupId } from "../../../../../base/browser/ui/list/list.js";
import { ElementsDragAndDropData } from "../../../../../base/browser/ui/list/listView.js";
import { MarkdownString } from "../../../../../base/common/htmlContent.js";
import { IContextMenuService } from "../../../../../platform/contextview/browser/contextView.js";
import { IStorageService } from "../../../../../platform/storage/common/storage.js";
import { defaultButtonStyles } from "../../../../../platform/theme/browser/defaultStyles.js";
import { defaultToggleStyles } from "../../../../../platform/theme/browser/defaultStyles.js";
import { defaultInputBoxStyles } from "../../../../../platform/theme/browser/defaultStyles.js";
import { defaultFindWidgetStyles } from "../../../../../platform/theme/browser/defaultStyles.js";
import { MenuWorkbenchToolBar } from "../../../../../platform/actions/browser/toolbar.js";
import { IHoverService } from "../../../../../platform/hover/browser/hover.js";
import { IMarkdownRendererService } from "../../../../../platform/markdown/browser/markdownRenderer.js";
import { Button } from "../../../../../base/browser/ui/button/button.js";
import { ILayoutService } from "../../../../../platform/layout/browser/layoutService.js";
import { InputBox } from "../../../../../base/browser/ui/inputbox/inputBox.js";
import { WorkbenchObjectTree } from "../../../../../platform/list/browser/listService.js";
import { HighlightedLabel } from "../../../../../base/browser/ui/highlightedlabel/highlightedLabel.js";
import { IWorkbenchAssignmentService } from "../../../../../workbench/services/assignment/common/assignmentService.js";
import { IAgentSessionsService } from "../../../../../workbench/contrib/chat/browser/agentSessions/agentSessionsService.js";
import { ISessionsProvidersService } from "../../../../services/sessions/browser/sessionsProvidersService.js";
import { ISessionsManagementService } from "../../../../services/sessions/common/sessionsManagement.js";
import { GITHUB_REMOTE_FILE_SCHEME } from "../../../../services/sessions/common/session.js";
import { getSessionWorkspaceKind } from "../../../../services/sessions/common/session.js";
import { SessionProviderIdContext } from "../../../../common/contextkeys.js";
import { SessionTypeContext } from "../../../../common/contextkeys.js";
import { SessionSupportsRenameContext } from "../../../../common/contextkeys.js";
import { SessionSupportsDeleteContext } from "../../../../common/contextkeys.js";
import { SessionIsReadContext } from "../../../../common/contextkeys.js";
import { SessionIsArchivedContext } from "../../../../common/contextkeys.js";
import { SessionHasPullRequestContext } from "../../../../common/contextkeys.js";
import { IsPhoneLayoutContext } from "../../../../common/contextkeys.js";
import { ISessionsService } from "../../../../services/sessions/browser/sessionsService.js";
import { IVoicePlaybackService } from "../../../../../workbench/contrib/chat/common/voicePlaybackService.js";
import { synchronizeCSSAnimations } from "../../../../../base/browser/animationSync.js";
import { pauseCSSAnimationsWhenHidden } from "../../../../../base/browser/animationSync.js";
import { agentSessionApprovalId } from "../../../../../workbench/contrib/chat/browser/agentSessions/agentSessionApprovalModel.js";
import { AgentSessionApprovalModel } from "../../../../../workbench/contrib/chat/browser/agentSessions/agentSessionApprovalModel.js";
import { SessionsDataTransfers } from "../../../../browser/dnd.js";
import { DraggedSessionIdentifier } from "../../../../browser/dnd.js";
import { ISessionsListModelService } from "../../../../services/sessions/browser/sessionsListModelService.js";
import { SessionStatusIcon } from "../../../../browser/sessionStatusIcon.js";
import { ARCHIVE_SESSION_COMMAND_ID } from "../../../../common/sessionCommands.js";
import { ISessionGroupsService } from "../../../../services/sessions/browser/sessionGroupsService.js";
import { ISessionSectionOrderService } from "../../../../services/sessions/browser/sessionSectionOrderService.js";
import { IAgentHostFilterService } from "../../../../services/agentHostFilter/common/agentHostFilter.js";
import { buildSessionHoverContent } from "../sessionHoverContent.js";
import { createSessionArchiveAnimation } from "./sessionArchiveAnimation.js";
var $110 = $;
var SESSION_SECTION_FOCUS_FROM_POINTER_CLASS = "session-section-focus-from-pointer";
var SESSION_HEADER_DROP_TARGET_CLASS = "session-header-drop-target";
var SessionItemToolbarMenuId = new MenuId("SessionItemToolbar");
var SessionItemContextMenuId = MenuId.SessionItemContextMenu;
var SessionSectionToolbarMenuId = new MenuId("SessionSectionToolbar");
var SessionGroupToolbarMenuId = new MenuId("SessionGroupToolbar");
var SESSIONS_LIST_SHOW_EMPTY_DEFAULT_GROUPS_SETTING = "sessions.list.showEmptyDefaultGroups";
var IsSessionPinnedContext = new RawContextKey("sessionItem.isPinned", false);
var SessionItemHasBranchNameContext = new RawContextKey("sessionItem.hasBranchName", false);
var SessionItemStatusContext = new RawContextKey("sessionItem.status", 3 /* Completed */);
var SessionItemInGroupContext = new RawContextKey("sessionItem.inGroup", false);
var SessionSectionTypeContext = new RawContextKey("sessionSection.type", "");
var SessionGroupHasVisibleSessionsContext = new RawContextKey("sessionGroup.hasVisibleSessions", false);
var SessionGroupIsEmptyContext = new RawContextKey("sessionGroup.isEmpty", false);
function shouldAnimateArchiveAction(actionId, sessionCount, motionReduced) {
  return actionId === ARCHIVE_SESSION_COMMAND_ID && sessionCount === 1 && !motionReduced;
}
var SessionsGrouping = /* @__PURE__ */(SessionsGrouping2 => {
  SessionsGrouping2["Workspace"] = "workspace";
  SessionsGrouping2["Date"] = "date";
  return SessionsGrouping2;
})(SessionsGrouping || {});
var SessionsSorting = /* @__PURE__ */(SessionsSorting2 => {
  SessionsSorting2["Created"] = "created";
  SessionsSorting2["Updated"] = "updated";
  return SessionsSorting2;
})(SessionsSorting || {});
function sortingToMode(sorting) {
  return sorting === "updated" /* Updated */ ? "updated" : "created";
}
var SORT_FALLBACK_STEP_MS = 6e4;
function isSessionGroupItem(item) {
  return "group" in item;
}
function isSessionSection(item) {
  return !isSessionGroupItem(item) && "sessions" in item && Array.isArray(item.sessions);
}
function isSessionShowMore(item) {
  return "showMore" in item && item.showMore === true;
}
function isSessionPlaceholder(item) {
  return "placeholder" in item && item.placeholder === true;
}
function isSessionItem(item) {
  return !isSessionGroupItem(item) && !isSessionSection(item) && !isSessionShowMore(item) && !isSessionPlaceholder(item);
}
var SHOW_MORE_FOLDERS_LABEL = "__more_folders__";
var FOUR_DAYS_MS = 4 * 24 * 60 * 60 * 1e3;
var DEFAULT_APPROVAL_ROW_MAX_LINES = 3;
var SessionsTreeDelegate = class _SessionsTreeDelegate {
  constructor(_approvalModel, _isPhone, _approvalRowMaxLines = DEFAULT_APPROVAL_ROW_MAX_LINES, _ciFixModel = void 0) {
    this._approvalModel = _approvalModel;
    this._isPhone = _isPhone;
    this._approvalRowMaxLines = _approvalRowMaxLines;
    this._ciFixModel = _ciFixModel;
  }
  static {
    this.ITEM_HEIGHT = 54;
  }
  static {
    /** Quick-chat rows are single-line — see the `.session-item.quick-chat` rules in `sessionsList.css`. */
    this.ITEM_HEIGHT_QUICK_CHAT = 28;
  }
  static {
    /**
     * Phone layout uses a taller row so the inline action toolbar can
     * meet the 44px minimum touch target without overflowing. Sized to
     * fit a 44px toolbar centered between the title and details rows.
     * Keep in sync with the `.phone-layout .session-item` rules in
     * `sessionsList.css`.
     */
    this.ITEM_HEIGHT_PHONE = 76;
  }
  static {
    this.SECTION_HEIGHT = 26;
  }
  static {
    this.SHOW_MORE_HEIGHT = 26;
  }
  static {
    this.PLACEHOLDER_HEIGHT = 26;
  }
  getHeight(element) {
    if (isSessionSection(element) || isSessionGroupItem(element)) {
      return _SessionsTreeDelegate.SECTION_HEIGHT;
    }
    if (isSessionShowMore(element)) {
      return _SessionsTreeDelegate.SHOW_MORE_HEIGHT;
    }
    if (isSessionPlaceholder(element)) {
      return _SessionsTreeDelegate.PLACEHOLDER_HEIGHT;
    }
    let height;
    if (this._isPhone()) {
      height = _SessionsTreeDelegate.ITEM_HEIGHT_PHONE;
    } else if (isQuickChatSession(element)) {
      height = _SessionsTreeDelegate.ITEM_HEIGHT_QUICK_CHAT;
    } else {
      height = _SessionsTreeDelegate.ITEM_HEIGHT;
    }
    if (this._approvalModel) {
      const approval = getFirstApprovalAcrossChats(this._approvalModel, element, void 0);
      if (approval) {
        height += SessionItemRenderer.getApprovalRowHeight(approval.label, this._approvalRowMaxLines);
      }
    }
    if (this._ciFixModel && this._ciFixModel.getCIFix(element).get()) {
      height += SessionItemRenderer.CI_ROW_HEIGHT;
    }
    return height;
  }
  hasDynamicHeight(element) {
    return (!!this._approvalModel || !!this._ciFixModel) && isSessionItem(element);
  }
  getTemplateId(element) {
    if (isSessionGroupItem(element)) {
      return SessionGroupRenderer.TEMPLATE_ID;
    }
    if (isSessionSection(element)) {
      return SessionSectionRenderer.TEMPLATE_ID;
    }
    if (isSessionShowMore(element)) {
      return SessionShowMoreRenderer.TEMPLATE_ID;
    }
    if (isSessionPlaceholder(element)) {
      return SessionPlaceholderRenderer.TEMPLATE_ID;
    }
    return SessionItemRenderer.TEMPLATE_ID;
  }
};
var SessionItemActionRunner = class extends ActionRunner {
  constructor(getMultiSelectedSessions, handleAction) {
    super();
    this.getMultiSelectedSessions = getMultiSelectedSessions;
    this.handleAction = handleAction;
  }
  async runAction(action, context2) {
    if (context2 && !Array.isArray(context2)) {
      if (this.handleAction && (await this.handleAction(action, context2))) {
        return;
      }
      await super.runAction(action, this.getMultiSelectedSessions(context2));
      return;
    }
    await super.runAction(action, context2);
  }
};
var SESSION_TITLE_SHIMMER_ANIMATION_NAME = "session-title-shimmer";
var SESSION_TITLE_SHIMMER_ANIMATION_NAMES = /* @__PURE__ */new Set([SESSION_TITLE_SHIMMER_ANIMATION_NAME]);
var SESSION_TITLE_SHIMMER_PAUSED_CLASS = "session-title-shimmer-paused";
var SessionItemRenderer = class _SessionItemRenderer {
  constructor(options3, approvalModel, ciFixModel, instantiationService, contextKeyService, markdownRendererService, hoverService, sessionsProvidersService, agentSessionsService, _voicePlaybackService) {
    this.options = options3;
    this.approvalModel = approvalModel;
    this.ciFixModel = ciFixModel;
    this.instantiationService = instantiationService;
    this.contextKeyService = contextKeyService;
    this.markdownRendererService = markdownRendererService;
    this.hoverService = hoverService;
    this.sessionsProvidersService = sessionsProvidersService;
    this.agentSessionsService = agentSessionsService;
    this._voicePlaybackService = _voicePlaybackService;
    this.templateId = _SessionItemRenderer.TEMPLATE_ID;
    this._onDidChangeItemHeight = new Emitter();
    this.onDidChangeItemHeight = this._onDidChangeItemHeight.event;
    this._onDidApproveSession = new Emitter();
    /** Fires when the user approves a session's pending action via its "Allow" button. */
    this.onDidApproveSession = this._onDidApproveSession.event;
    this._templatesBySession = /* @__PURE__ */new Map();
  }
  static {
    this.TEMPLATE_ID = "session-item";
  }
  static {
    this._APPROVAL_ROW_LINE_HEIGHT = 18;
  }
  static {
    this._APPROVAL_ROW_OVERHEAD = 14;
  }
  static {
    /** Height of the single-line "Fix CI" row (label + orange button), including its top margin. */
    this.CI_ROW_HEIGHT = 32;
  }
  static getApprovalRowHeight(label3, maxLines = DEFAULT_APPROVAL_ROW_MAX_LINES) {
    const lineCount = Math.min(label3.split(/\r?\n/).length, maxLines);
    return lineCount * _SessionItemRenderer._APPROVAL_ROW_LINE_HEIGHT + _SessionItemRenderer._APPROVAL_ROW_OVERHEAD;
  }
  renderTemplate(container2) {
    const disposables = new DisposableStore();
    const elementDisposables = disposables.add(new DisposableStore());
    container2.classList.add("session-item");
    const iconContainer = append(container2, $110(".session-icon"));
    const statusIcon = disposables.add(this.instantiationService.createInstance(SessionStatusIcon, iconContainer));
    const mainCol = append(container2, $110(".session-main"));
    const titleRow = append(mainCol, $110(".session-title-row"));
    const titleContainer = append(titleRow, $110(".session-title"));
    const title = disposables.add(new HighlightedLabel(titleContainer));
    disposables.add(addDisposableListener(titleContainer, EventType.ANIMATION_START, e4 => {
      if (e4.target === titleContainer && e4.animationName === SESSION_TITLE_SHIMMER_ANIMATION_NAME) {
        synchronizeCSSAnimations(titleContainer, {
          animationNames: SESSION_TITLE_SHIMMER_ANIMATION_NAMES
        });
      }
    }));
    disposables.add(pauseCSSAnimationsWhenHidden(titleContainer, {
      pausedClass: SESSION_TITLE_SHIMMER_PAUSED_CLASS,
      animationNames: SESSION_TITLE_SHIMMER_ANIMATION_NAMES
    }));
    const titleToolbarContainer = append(titleRow, $110(".session-title-toolbar"));
    const pendingVoiceIndicator = append(titleRow, $110(".session-pending-voice-indicator"));
    for (const eventType of ["pointerdown", "pointerup", "click", "dblclick"]) {
      disposables.add(addDisposableListener(titleToolbarContainer, eventType, e4 => e4.stopPropagation()));
    }
    disposables.add(Gesture.ignoreTarget(titleToolbarContainer));
    const detailsRow = append(mainCol, $110(".session-details-row"));
    const approvalRow = append(mainCol, $110(".session-approval-row"));
    const approvalLabel = append(approvalRow, $110("span.session-approval-label"));
    const approvalButtonContainer = append(approvalRow, $110(".session-approval-button"));
    const ciRow = append(mainCol, $110(".session-ci-row"));
    const ciLabel = append(ciRow, $110("span.session-ci-label"));
    const ciButtonContainer = append(ciRow, $110(".session-ci-button"));
    for (const eventType of ["pointerdown", "pointerup", "click", "dblclick"]) {
      disposables.add(addDisposableListener(ciRow, eventType, e4 => e4.stopPropagation()));
    }
    disposables.add(Gesture.ignoreTarget(ciRow));
    const contextKeyService = disposables.add(this.contextKeyService.createScoped(container2));
    const statusContext = SessionItemStatusContext.bindTo(contextKeyService);
    const scopedInstantiationService = disposables.add(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, contextKeyService])));
    let titleToolbar;
    if (this.options.toolbarMenuId) {
      const actionRunner = disposables.add(new SessionItemActionRunner(this.options.getMultiSelectedSessions, this.options.handleToolbarAction));
      titleToolbar = disposables.add(scopedInstantiationService.createInstance(MenuWorkbenchToolBar, titleToolbarContainer, this.options.toolbarMenuId, {
        menuOptions: {
          shouldForwardArgs: true
        },
        actionRunner
      }));
    }
    return {
      container: container2,
      statusIcon,
      title,
      titleContainer,
      titleToolbar,
      pendingVoiceIndicator,
      detailsRow,
      approvalRow,
      approvalLabel,
      approvalButtonContainer,
      ciRow,
      ciLabel,
      ciButtonContainer,
      contextKeyService,
      statusContext,
      disposables,
      elementDisposables,
      sessionResource: void 0,
      archiveAnimation: void 0
    };
  }
  renderElement(node, _index, template2) {
    const element = node.element;
    if (!isSessionItem(element)) {
      return;
    }
    this.renderSession(element, template2, createMatches(node.filterData));
  }
  renderSession(element, template2, matches2) {
    this.bindTemplateToSession(template2, element);
    template2.elementDisposables.clear();
    this.agentSessionsService.model.observeSession(element.resource);
    if (this.options.showHover) {
      template2.elementDisposables.add(this.hoverService.setupDelayedHover(template2.container, () => ({
        content: buildSessionHoverContent(element, this.sessionsProvidersService),
        appearance: {
          showPointer: true
        },
        position: {
          hoverPosition: 1 /* RIGHT */,
          forcePosition: true
        },
        persistence: {
          hideOnHover: false
        }
      }), {
        groupId: "sessions-list"
      }));
    }
    const pendingVoiceResource = element.resource;
    template2.pendingVoiceIndicator.className = "session-pending-voice-indicator " + ThemeIcon.asClassName(Codicon.unmute);
    template2.elementDisposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate("mouse"), template2.pendingVoiceIndicator, localize("recovered.4802", "Voice response ready")));
    template2.elementDisposables.add(autorun(reader => {
      this._voicePlaybackService.pendingResponseVersion.read(reader);
      template2.pendingVoiceIndicator.classList.toggle("visible", this._voicePlaybackService.hasPendingResponse(pendingVoiceResource));
    }));
    if (template2.titleToolbar) {
      template2.titleToolbar.context = element;
    }
    const isPinned = this.options.isPinned(element);
    IsSessionPinnedContext.bindTo(template2.contextKeyService).set(isPinned);
    SessionIsArchivedContext.bindTo(template2.contextKeyService).set(element.isArchived.get());
    SessionIsReadContext.bindTo(template2.contextKeyService).set(this.options.isRead(element));
    SessionItemHasBranchNameContext.bindTo(template2.contextKeyService).set(!!element.workspace.get()?.folders[0]?.gitRepository?.branchName?.trim());
    template2.elementDisposables.add(autorun(reader => {
      const isArchived = element.isArchived.read(reader);
      template2.container.classList.toggle("archived", isArchived);
      template2.container.classList.toggle("pinned", isPinned && !isArchived);
    }));
    template2.elementDisposables.add(autorun(reader => {
      const wrapper = this.options.visibleSessions.read(reader).find(s => s?.sessionId === element.sessionId);
      const isSticky = wrapper ? wrapper.sticky.read(reader) : false;
      template2.container.classList.toggle("sticky", isSticky);
    }));
    template2.elementDisposables.add(autorun(reader => {
      const sessionStatus = element.status.read(reader);
      template2.statusContext.set(sessionStatus);
      const isRead = this.options.isRead(element);
      const isArchived = element.isArchived.read(reader);
      const gitHubInfo = element.workspace.read(reader)?.folders[0]?.gitRepository?.gitHubInfo.read(reader);
      const isQuickChat2 = element.isQuickChat?.read(reader) ?? false;
      const completedStateIcon = gitHubInfo?.pullRequest?.icon;
      template2.statusIcon.setStatus(sessionStatus, isRead, isArchived, completedStateIcon, element.resource);
      template2.container.classList.toggle("in-progress", sessionStatus === 1 /* InProgress */);
      template2.container.classList.toggle("needs-input", sessionStatus === 2 /* NeedsInput */);
      template2.container.classList.toggle("unread", !isRead && !isArchived);
      template2.container.classList.toggle("quick-chat", isQuickChat2);
    }));
    template2.elementDisposables.add(autorun(reader => {
      const titleText = element.title.read(reader);
      template2.title.set(titleText, matches2);
    }));
    const timeDisposable = template2.elementDisposables.add(new MutableDisposable());
    const descriptionDisposable = template2.elementDisposables.add(new MutableDisposable());
    template2.elementDisposables.add(autorun(reader => {
      const sessionStatus = element.status.read(reader);
      const workspace = element.workspace.read(reader);
      const description = element.description.read(reader);
      const isQuickChat2 = element.isQuickChat?.read(reader) ?? false;
      clearNode(template2.detailsRow);
      if (isQuickChat2) {
        descriptionDisposable.clear();
        timeDisposable.clear();
        return;
      }
      const changes = element.changes.read(reader);
      const changesSummary = element.changesSummary?.read(reader);
      let timeDate;
      const hideDetails = sessionStatus === 1 /* InProgress */ || sessionStatus === 2 /* NeedsInput */;
      if (!hideDetails) {
        timeDate = element.updatedAt.read(reader);
      }
      const parts = [];
      if (sessionStatus !== 1 /* InProgress */) {
        const kind = getSessionWorkspaceKind(workspace, element.worktreePending?.read(reader));
        const icon2 = kind === "virtual" /* Virtual */ ? Codicon.cloudCompact : kind === "folder" /* Folder */ ? Codicon.folderCompact : Codicon.worktreeCompact;
        const typeIconEl = append(template2.detailsRow, $110("span.session-details-icon"));
        append(typeIconEl, $110(`span${ThemeIcon.asCSSSelector(icon2)}`));
        parts.push(typeIconEl);
      }
      if (!hideDetails && workspace && (this.options.grouping() !== "workspace" /* Workspace */ || this.options.isPinned(element) || element.isArchived.read(reader))) {
        const badgeLabel2 = this.getWorkspaceBadgeLabel(workspace);
        if (badgeLabel2) {
          const badgeEl = append(template2.detailsRow, $110("span.session-badge"));
          badgeEl.textContent = badgeLabel2;
          parts.push(badgeEl);
        }
      }
      if (!hideDetails && (changesSummary || changes.length > 0)) {
        let insertions = 0,
          deletions = 0;
        if (changesSummary) {
          insertions = changesSummary.additions;
          deletions = changesSummary.deletions;
        } else if (changes.length > 0) {
          for (const change of changes) {
            insertions += change.insertions;
            deletions += change.deletions;
          }
        }
        if (insertions > 0 || deletions > 0) {
          if (parts.length > 0) {
            append(template2.detailsRow, $110("span.session-separator.has-separator"));
          }
          const diffEl = append(template2.detailsRow, $110("span.session-diff"));
          append(diffEl, $110("span.session-diff-added")).textContent = `+${insertions}`;
          append(diffEl, $110("span.session-diff-removed")).textContent = `-${deletions}`;
          parts.push(diffEl);
        }
      }
      if (sessionStatus === 1 /* InProgress */) {
        if (parts.length > 0) {
          append(template2.detailsRow, $110("span.session-separator.has-separator"));
        }
        const statusEl = append(template2.detailsRow, $110("span.session-description"));
        if (description) {
          descriptionDisposable.value = this.markdownRendererService.render(description, {
            sanitizerConfig: {
              replaceWithPlaintext: true
            }
          }, statusEl);
        } else {
          descriptionDisposable.clear();
          statusEl.textContent = localize("recovered.4825", "Working...");
        }
        parts.push(statusEl);
      } else if (sessionStatus === 2 /* NeedsInput */) {
        if (parts.length > 0) {
          append(template2.detailsRow, $110("span.session-separator.has-separator"));
        }
        const statusEl = append(template2.detailsRow, $110("span.session-description"));
        if (description) {
          descriptionDisposable.value = this.markdownRendererService.render(description, {
            sanitizerConfig: {
              replaceWithPlaintext: true
            }
          }, statusEl);
        } else {
          descriptionDisposable.clear();
          statusEl.textContent = localize("recovered.4796", "Input needed");
        }
        parts.push(statusEl);
      } else if (sessionStatus === 4 /* Error */) {
        if (parts.length > 0) {
          append(template2.detailsRow, $110("span.session-separator.has-separator"));
        }
        const statusEl = append(template2.detailsRow, $110("span.session-description"));
        if (description) {
          descriptionDisposable.value = this.markdownRendererService.render(description, {
            sanitizerConfig: {
              replaceWithPlaintext: true
            }
          }, statusEl);
        } else {
          descriptionDisposable.clear();
          statusEl.textContent = localize("recovered.4794", "Failed");
        }
        parts.push(statusEl);
      } else {
        descriptionDisposable.clear();
      }
      if (!hideDetails && timeDate) {
        if (parts.length > 0) {
          append(template2.detailsRow, $110("span.session-separator.has-separator"));
        }
        const timeEl = append(template2.detailsRow, $110("span.session-time"));
        const definiteTimeDate = timeDate;
        const formatTime3 = () => {
          const seconds = Math.round((Date.now() - definiteTimeDate.getTime()) / 1e3);
          return seconds < 60 ? localize("recovered.4807", "now") : fromNow(definiteTimeDate, true);
        };
        timeEl.textContent = formatTime3();
        const targetWindow = getWindow(timeEl);
        const interval = targetWindow.setInterval(() => {
          timeEl.textContent = formatTime3();
        }, 6e4);
        timeDisposable.value = toDisposable(() => targetWindow.clearInterval(interval));
      } else {
        timeDisposable.clear();
      }
    }));
    if (this.approvalModel) {
      this.renderApprovalRow(element, template2);
    }
    if (this.ciFixModel) {
      this.renderCIRow(element, template2);
    }
  }
  renderApprovalRow(element, template2) {
    if (!this.approvalModel) {
      return;
    }
    const approvalModel = this.approvalModel;
    const initialInfo = getFirstApprovalAcrossChats(approvalModel, element, void 0);
    let wasVisible = !!initialInfo;
    template2.approvalRow.classList.toggle("visible", wasVisible);
    const buttonStore = template2.elementDisposables.add(new DisposableStore());
    template2.elementDisposables.add(autorun(reader => {
      buttonStore.clear();
      const info = getFirstApprovalAcrossChats(approvalModel, element, reader);
      const visible = !!info;
      template2.approvalRow.classList.toggle("visible", visible);
      if (info) {
        const lines = info.label.split("\n");
        const maxLines = this.options.approvalRowMaxLines;
        const visibleLines = lines.slice(0, maxLines);
        if (lines.length > maxLines) {
          visibleLines[maxLines - 1] = `${visibleLines[maxLines - 1]} \u2026`;
        }
        const langId = info.languageId ?? "json";
        const labelContent = new MarkdownString();
        for (const line of visibleLines) {
          labelContent.appendCodeblock(langId, line);
        }
        template2.approvalLabel.textContent = "";
        buttonStore.add(this.markdownRendererService.render(labelContent, {}, template2.approvalLabel));
        if (this.options.showHover) {
          const fullContent = new MarkdownString().appendCodeblock(info.languageId ?? "json", info.label);
          buttonStore.add(this.hoverService.setupDelayedHover(template2.approvalLabel, {
            content: fullContent,
            style: 1 /* Pointer */,
            position: {
              hoverPosition: 2 /* BELOW */
            }
          }));
        }
        template2.approvalButtonContainer.textContent = "";
        const button = buttonStore.add(new Button(template2.approvalButtonContainer, {
          title: localize("recovered.4786", "Allow once"),
          secondary: true,
          ...defaultButtonStyles
        }));
        button.label = localize("recovered.4785", "Allow");
        buttonStore.add(button.onDidClick(() => {
          const approvalId = agentSessionApprovalId(info);
          info.confirm();
          this._onDidApproveSession.fire({
            session: element,
            approvalId
          });
        }));
      }
      if (wasVisible !== visible) {
        wasVisible = visible;
        this._onDidChangeItemHeight.fire(element);
      }
    }));
  }
  renderCIRow(element, template2) {
    if (!this.ciFixModel) {
      return;
    }
    const ciFixModel = this.ciFixModel;
    const stateObs = ciFixModel.getCIFix(element);
    let wasVisible = !!stateObs.get();
    template2.ciRow.classList.toggle("visible", wasVisible);
    const buttonStore = template2.elementDisposables.add(new DisposableStore());
    template2.elementDisposables.add(autorun(reader => {
      buttonStore.clear();
      const state = stateObs.read(reader);
      const visible = !!state;
      template2.ciRow.classList.toggle("visible", visible);
      if (state) {
        template2.ciLabel.textContent = localize("recovered.4789", "{0} checks failed, {1} pending", state.failed, state.pending);
        template2.ciButtonContainer.textContent = "";
        const button = buttonStore.add(new Button(template2.ciButtonContainer, {
          title: localize("recovered.4791", "Fix failing CI checks"),
          ...defaultButtonStyles,
          buttonBackground: asCssVariable(chartsOrange),
          buttonHoverBackground: `color-mix(in srgb, ${asCssVariable(chartsOrange)} 88%, black)`,
          buttonBorder: asCssVariable(chartsOrange)
        }));
        button.label = localize("recovered.4790", "Fix CI");
        buttonStore.add(button.onDidClick(() => ciFixModel.fixCI(element)));
      }
      if (wasVisible !== visible) {
        wasVisible = visible;
        this._onDidChangeItemHeight.fire(element);
      }
    }));
  }
  getWorkspaceBadgeLabel(workspace) {
    const folder = workspace.folders[0];
    if (folder?.root.scheme === GITHUB_REMOTE_FILE_SCHEME) {
      const parts = folder.root.path.split("/").filter(Boolean);
      if (parts.length >= 2) {
        return `${parts[0]}/${parts[1]}`;
      }
    }
    return workspace.label;
  }
  startArchiveAnimation(session, overlayHost) {
    const template2 = this._templatesBySession.get(session.resource.toString());
    if (!template2 || !template2.titleToolbar || template2.container.ownerDocument.visibilityState === "hidden" || template2.archiveAnimation) {
      return void 0;
    }
    const toolbarBounds = template2.titleToolbar.getElement().getBoundingClientRect();
    let itemOffset = 0;
    let archiveActionBounds;
    for (let index2 = 0; index2 < template2.titleToolbar.getItemsLength(); index2++) {
      const itemWidth = template2.titleToolbar.getItemWidth(index2);
      if (template2.titleToolbar.getItemAction(index2)?.id === ARCHIVE_SESSION_COMMAND_ID) {
        archiveActionBounds = {
          left: toolbarBounds.left + itemOffset,
          top: toolbarBounds.top,
          width: itemWidth,
          height: toolbarBounds.height
        };
        break;
      }
      itemOffset += itemWidth;
    }
    if (!archiveActionBounds) {
      return void 0;
    }
    template2.archiveAnimation = createSessionArchiveAnimation(template2.container, archiveActionBounds, overlayHost);
    return template2.archiveAnimation;
  }
  clearArchiveAnimation(session, animation) {
    const template2 = this._templatesBySession.get(session.resource.toString());
    if (template2?.archiveAnimation === animation) {
      template2.archiveAnimation = void 0;
    }
    animation.dispose();
  }
  bindTemplateToSession(template2, session) {
    const sessionResource = session.resource.toString();
    if (template2.sessionResource === sessionResource) {
      return;
    }
    this.unbindTemplate(template2);
    template2.sessionResource = sessionResource;
    this._templatesBySession.set(sessionResource, template2);
  }
  unbindTemplate(template2) {
    if (template2.sessionResource && this._templatesBySession.get(template2.sessionResource) === template2) {
      this._templatesBySession.delete(template2.sessionResource);
    }
    template2.sessionResource = void 0;
    template2.archiveAnimation?.dispose();
    template2.archiveAnimation = void 0;
  }
  disposeElement(node, _index, template2) {
    this.unbindTemplate(template2);
    template2.elementDisposables.clear();
  }
  disposeTemplate(template2) {
    this.unbindTemplate(template2);
    template2.disposables.dispose();
  }
};
var SessionSectionRenderer = class _SessionSectionRenderer {
  constructor(hideSectionCount, instantiationService, contextKeyService) {
    this.hideSectionCount = hideSectionCount;
    this.instantiationService = instantiationService;
    this.contextKeyService = contextKeyService;
    this.templateId = _SessionSectionRenderer.TEMPLATE_ID;
    this.templatesByElement = /* @__PURE__ */new WeakMap();
    this.templatesById = /* @__PURE__ */new Map();
  }
  static {
    this.TEMPLATE_ID = "session-section";
  }
  renderTemplate(container2) {
    const disposables = new DisposableStore();
    container2.classList.add("session-section");
    const icon2 = append(container2, $110("span.session-section-icon"));
    icon2.setAttribute("aria-hidden", "true");
    const label3 = append(container2, $110("span.session-section-label"));
    const count2 = append(container2, $110("span.session-section-count"));
    const toolbarContainer = append(container2, $110(".session-section-toolbar"));
    const chevron = append(container2, $110("span.session-section-chevron"));
    chevron.setAttribute("aria-hidden", "true");
    const contextKeyService = disposables.add(this.contextKeyService.createScoped(container2));
    const scopedInstantiationService = disposables.add(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, contextKeyService])));
    const toolbar = disposables.add(scopedInstantiationService.createInstance(MenuWorkbenchToolBar, toolbarContainer, SessionSectionToolbarMenuId, {
      menuOptions: {
        shouldForwardArgs: true
      }
    }));
    return {
      container: container2,
      icon: icon2,
      label: label3,
      count: count2,
      toolbar,
      chevron,
      contextKeyService,
      disposables
    };
  }
  renderElement(node, _index, template2) {
    const element = node.element;
    if (!isSessionSection(element)) {
      return;
    }
    this.templatesByElement.set(element, template2);
    this.templatesById.set(element.id, template2);
    template2.container.classList.remove(SESSION_HEADER_DROP_TARGET_CLASS);
    const sectionIcon = element.id === QUICK_CHATS_SECTION_ID ? Codicon.commentDiscussion : element.id === "pinned" ? Codicon.pinned : void 0;
    template2.icon.className = sectionIcon ? `session-section-icon ${ThemeIcon.asClassName(sectionIcon)}` : "session-section-icon";
    template2.icon.style.display = sectionIcon ? "" : "none";
    template2.label.textContent = element.label;
    if (this.hideSectionCount) {
      template2.count.textContent = "";
      template2.count.style.display = "none";
    } else {
      template2.count.textContent = String(element.sessions.length);
      template2.count.style.display = "";
    }
    this.updateChevron(template2, node.collapsible, node.collapsed);
    const sectionType = element.id.startsWith("workspace:") ? "workspace" : element.id;
    SessionSectionTypeContext.bindTo(template2.contextKeyService).set(sectionType);
    template2.toolbar.context = element;
  }
  /**
   * Updates the expand/collapse chevron for an already-rendered section. The
   * tree only re-invokes `renderTwistie` (not `renderElement`) when a section's
   * collapse state toggles, so the owning list forwards collapse changes here.
   */
  updateCollapseState(element, collapsed2) {
    const template2 = this.templatesByElement.get(element);
    if (template2) {
      this.updateChevron(template2, true, collapsed2);
    }
  }
  setDropTarget(sectionId, active) {
    const template2 = this.templatesById.get(sectionId);
    template2?.container.classList.toggle(SESSION_HEADER_DROP_TARGET_CLASS, active);
  }
  updateChevron(template2, collapsible, collapsed2) {
    template2.chevron.className = "session-section-chevron";
    if (collapsible) {
      template2.chevron.classList.add("collapsible");
      const icon2 = collapsed2 ? Codicon.chevronRight : Codicon.chevronDown;
      template2.chevron.classList.add(...ThemeIcon.asClassNameArray(icon2));
    }
  }
  disposeElement(node, _index, _template) {
    if (isSessionSection(node.element)) {
      this.templatesByElement.delete(node.element);
      this.templatesById.delete(node.element.id);
    }
  }
  disposeTemplate(template2) {
    template2.disposables.dispose();
  }
};
var SessionGroupRenderer = class _SessionGroupRenderer {
  constructor(delegate, instantiationService, contextKeyService) {
    this.delegate = delegate;
    this.instantiationService = instantiationService;
    this.contextKeyService = contextKeyService;
    this.templateId = _SessionGroupRenderer.TEMPLATE_ID;
    this.templatesByElement = /* @__PURE__ */new WeakMap();
    this.templatesById = /* @__PURE__ */new Map();
  }
  static {
    this.TEMPLATE_ID = "session-group";
  }
  renderTemplate(container2) {
    const disposables = new DisposableStore();
    container2.classList.add("session-section", "session-group");
    const label3 = append(container2, $110("span.session-section-label"));
    const inputContainer = append(container2, $110(".session-group-input"));
    const toolbarContainer = append(container2, $110(".session-section-toolbar"));
    const chevron = append(container2, $110("span.session-section-chevron"));
    chevron.setAttribute("aria-hidden", "true");
    const contextKeyService = disposables.add(this.contextKeyService.createScoped(container2));
    const scopedInstantiationService = disposables.add(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, contextKeyService])));
    const toolbar = disposables.add(scopedInstantiationService.createInstance(MenuWorkbenchToolBar, toolbarContainer, SessionGroupToolbarMenuId, {
      menuOptions: {
        shouldForwardArgs: true
      }
    }));
    return {
      container: container2,
      label: label3,
      inputContainer,
      toolbar,
      chevron,
      contextKeyService,
      disposables,
      elementDisposables: disposables.add(new DisposableStore())
    };
  }
  renderElement(node, _index, template2) {
    const element = node.element;
    if (!isSessionGroupItem(element)) {
      return;
    }
    template2.elementDisposables.clear();
    this.templatesByElement.set(element, template2);
    this.templatesById.set(element.group.id, template2);
    template2.container.classList.remove(SESSION_HEADER_DROP_TARGET_CLASS);
    template2.label.textContent = element.group.name;
    this.updateChevron(template2, node.collapsible, node.collapsed);
    SessionGroupHasVisibleSessionsContext.bindTo(template2.contextKeyService).set(element.sessions.length > 0);
    SessionGroupIsEmptyContext.bindTo(template2.contextKeyService).set(element.isEmpty);
    template2.toolbar.context = element;
    template2.container.classList.toggle("session-group-editing", element.editing);
    if (element.editing) {
      this.renderInput(element, template2);
    } else {
      template2.inputContainer.style.display = "none";
      template2.label.style.display = "";
    }
  }
  renderInput(element, template2) {
    template2.label.style.display = "none";
    template2.inputContainer.style.display = "";
    clearNode(template2.inputContainer);
    const input = template2.elementDisposables.add(new InputBox(template2.inputContainer, void 0, {
      inputBoxStyles: defaultInputBoxStyles,
      ariaLabel: localize("recovered.4808", "Group name")
    }));
    input.value = element.group.name;
    input.focus();
    input.select();
    let done = false;
    const commit = () => {
      if (done) {
        return;
      }
      done = true;
      this.delegate.commitEdit(element.group, input.value.trim());
    };
    const cancel = () => {
      if (done) {
        return;
      }
      done = true;
      this.delegate.cancelEdit(element.group);
    };
    template2.elementDisposables.add(addStandardDisposableListener(input.inputElement, EventType.KEY_DOWN, e4 => {
      if (e4.equals(3 /* Enter */)) {
        e4.preventDefault();
        e4.stopPropagation();
        commit();
      } else if (e4.equals(9 /* Escape */)) {
        e4.preventDefault();
        e4.stopPropagation();
        cancel();
      }
    }));
    template2.elementDisposables.add(addDisposableListener(input.inputElement, EventType.BLUR, () => commit()));
  }
  /** Forwarded from the owning list when the group's collapse state toggles. */
  updateCollapseState(element, collapsed2) {
    const template2 = this.templatesByElement.get(element);
    if (template2) {
      this.updateChevron(template2, true, collapsed2);
    }
  }
  setDropTarget(groupId, active) {
    const template2 = this.templatesById.get(groupId);
    template2?.container.classList.toggle(SESSION_HEADER_DROP_TARGET_CLASS, active);
  }
  updateChevron(template2, collapsible, collapsed2) {
    template2.chevron.className = "session-section-chevron";
    if (collapsible) {
      template2.chevron.classList.add("collapsible");
      const icon2 = collapsed2 ? Codicon.chevronRight : Codicon.chevronDown;
      template2.chevron.classList.add(...ThemeIcon.asClassNameArray(icon2));
    }
  }
  disposeElement(node, _index, template2) {
    if (isSessionGroupItem(node.element)) {
      this.templatesByElement.delete(node.element);
      this.templatesById.delete(node.element.group.id);
    }
    template2.elementDisposables.clear();
  }
  disposeTemplate(template2) {
    template2.disposables.dispose();
  }
};
var SessionShowMoreRenderer = class _SessionShowMoreRenderer {
  constructor() {
    this.templateId = _SessionShowMoreRenderer.TEMPLATE_ID;
  }
  static {
    this.TEMPLATE_ID = "session-show-more";
  }
  renderTemplate(container2) {
    container2.classList.add("session-show-more");
    return append(container2, $110("span.session-show-more-label"));
  }
  renderElement(node, _index, template2) {
    const element = node.element;
    if (!isSessionShowMore(element)) {
      return;
    }
    const container2 = template2.parentElement;
    container2?.classList.toggle("session-show-more-folders", element.kind === "folders");
    if (element.mode === "less") {
      template2.textContent = element.kind === "folders" ? localize("recovered.4817", "Show fewer workspaces") : localize("recovered.4815", "Show less");
    } else {
      template2.textContent = element.kind === "folders" ? element.remainingCount === 1 ? localize("recovered.4821", "+{0} more workspace", element.remainingCount) : localize("recovered.4823", "+{0} more workspaces", element.remainingCount) : localize("recovered.4819", "+{0} more", element.remainingCount);
    }
  }
  disposeTemplate(_template) {}
};
var SessionPlaceholderRenderer = class _SessionPlaceholderRenderer {
  constructor(hoverService) {
    this.hoverService = hoverService;
    this.templateId = _SessionPlaceholderRenderer.TEMPLATE_ID;
  }
  static {
    this.TEMPLATE_ID = "session-placeholder";
  }
  renderTemplate(container2) {
    container2.classList.add("session-placeholder");
    return {
      container: container2,
      label: append(container2, $110("span.session-placeholder-label")),
      hover: new MutableDisposable()
    };
  }
  renderElement(node, _index, template2) {
    const element = node.element;
    if (!isSessionPlaceholder(element)) {
      return;
    }
    template2.label.textContent = element.label;
    template2.hover.value = element.hover ? this.hoverService.setupManagedHover(getDefaultHoverDelegate("element"), template2.container, element.hover) : void 0;
  }
  disposeTemplate(template2) {
    template2.hover.dispose();
  }
};
var SessionsAccessibilityProvider = class {
  getWidgetAriaLabel() {
    return localize("recovered.4813", "Sessions");
  }
  getAriaLabel(element) {
    if (isSessionGroupItem(element)) {
      return `${element.group.name}, ${element.sessions.length}`;
    }
    if (isSessionSection(element)) {
      return `${element.label}, ${element.sessions.length}`;
    }
    if (isSessionShowMore(element)) {
      if (element.mode === "less") {
        return element.kind === "folders" ? localize("recovered.4816", "Show fewer workspaces") : localize("recovered.4814", "Show fewer sessions");
      }
      return element.kind === "folders" ? element.remainingCount === 1 ? localize("recovered.4820", "Show {0} more workspace", element.remainingCount) : localize("recovered.4822", "Show {0} more workspaces", element.remainingCount) : localize("recovered.4818", "Show {0} more sessions", element.remainingCount);
    }
    if (isSessionPlaceholder(element)) {
      return element.hover ? localize("recovered.4811", "{0}. {1}", element.label, element.hover) : element.label;
    }
    return derived(this, reader => {
      const title = element.title.read(reader);
      const updated = fromNow(element.updatedAt.read(reader), true);
      return element.worktreePending?.read(reader) ? localize("recovered.4810", "{0}, creating worktree, updated {1}", title, updated) : localize("recovered.4809", "{0}, updated {1}", title, updated);
    });
  }
};
var SessionsListDragAndDrop = class extends Disposable {
  constructor(delegate) {
    super();
    this.delegate = delegate;
    this._transfer = LocalSelectionTransfer.getInstance();
  }
  getDragURI(element) {
    if (isSessionGroupItem(element)) {
      return `sessionGroup:${element.group.id}`;
    }
    if (isSessionSection(element)) {
      return element.id.startsWith("workspace:") ? `sessionWorkspace:${element.id}` : null;
    }
    if (isSessionShowMore(element)) {
      return null;
    }
    if (isSessionPlaceholder(element)) {
      return null;
    }
    return element.resource.toString();
  }
  getDragLabel(elements) {
    const groupItem = elements.find(isSessionGroupItem);
    if (groupItem) {
      return groupItem.group.name;
    }
    const workspaceSection = elements.find(e4 => isSessionSection(e4) && e4.id.startsWith("workspace:"));
    if (workspaceSection) {
      return workspaceSection.label;
    }
    const sessions = this.toSessions(elements);
    if (sessions.length === 0) {
      return void 0;
    }
    if (sessions.length === 1) {
      return sessions[0].title.get();
    }
    return localize("recovered.4812", "{0} sessions", sessions.length);
  }
  onDragStart(data, originalEvent) {
    const sessions = this.toSessions(data instanceof ElementsDragAndDropData ? data.elements : []);
    if (sessions.length === 0) {
      return;
    }
    const identifiers2 = sessions.map(s => new DraggedSessionIdentifier(s.sessionId, s.resource));
    this._transfer.setData(identifiers2, DraggedSessionIdentifier.prototype);
    if (originalEvent.dataTransfer) {
      const payload = JSON.stringify({
        sessionId: sessions[0].sessionId,
        resource: sessions[0].resource.toString()
      });
      originalEvent.dataTransfer.setData(SessionsDataTransfers.SESSION, payload);
    }
  }
  onDragEnd() {
    this._transfer.clearData(DraggedSessionIdentifier.prototype);
    this.delegate.setDropTargetHeader(void 0);
  }
  onDragOver(data, targetElement, _targetIndex, targetSector) {
    const draggedHeader = this.draggedHeader(data);
    if (draggedHeader) {
      this.delegate.setDropTargetHeader(void 0);
      return this.onHeaderDragOver(draggedHeader, targetElement, targetSector);
    }
    const pinTarget = this.resolvePinTarget(data, targetElement, targetSector);
    if (pinTarget) {
      this.delegate.setDropTargetHeader(pinTarget.header);
      return this.toMembershipDropReaction(pinTarget);
    }
    const addToGroupTarget = this.resolveAddToGroupTarget(data, targetElement, targetSector);
    if (addToGroupTarget) {
      this.delegate.setDropTargetHeader(addToGroupTarget.header);
      return this.toMembershipDropReaction(addToGroupTarget);
    }
    this.delegate.setDropTargetHeader(void 0);
    const target = this.resolveReorderTarget(data, targetElement);
    if (!target) {
      return false;
    }
    const position2 = sectorToPosition(targetSector);
    return {
      accept: true,
      effect: {
        type: 1 /* Move */,
        position: position2 === "after" ? "drop-target-after" /* After */ : "drop-target-before" /* Before */
      }
    };
  }
  drop(data, targetElement, _targetIndex, targetSector) {
    this.delegate.setDropTargetHeader(void 0);
    try {
      const draggedHeader = this.draggedHeader(data);
      if (draggedHeader) {
        if (targetElement) {
          const targetRef = this.headerRefOf(targetElement);
          if (targetRef && targetRef !== draggedHeader.id) {
            this.delegate.reorderSection(draggedHeader.id, targetRef, sectorToPosition(targetSector), draggedHeader.isWorkspace);
          }
        }
        return;
      }
      const pinTarget = this.resolvePinTarget(data, targetElement, targetSector);
      if (pinTarget) {
        this.delegate.pinSessions(pinTarget.sessions, pinTarget.target, pinTarget.position);
        return;
      }
      const addToGroupTarget = this.resolveAddToGroupTarget(data, targetElement, targetSector);
      if (addToGroupTarget) {
        this.delegate.addSessionsToGroup(addToGroupTarget.sessions, addToGroupTarget.groupId, addToGroupTarget.target, addToGroupTarget.position);
        return;
      }
      const target = this.resolveReorderTarget(data, targetElement);
      if (!target) {
        return;
      }
      this.delegate.reorder(this.draggedSessions(data), target, sectorToPosition(targetSector));
    } finally {
      this.delegate.setDropTargetHeader(void 0);
    }
  }
  onHeaderDragOver(draggedHeader, targetElement, targetSector) {
    if (!targetElement) {
      return false;
    }
    const targetRef = this.headerRefOf(targetElement);
    if (!targetRef || targetRef === draggedHeader.id) {
      return false;
    }
    const position2 = sectorToPosition(targetSector);
    return {
      accept: true,
      effect: {
        type: 1 /* Move */,
        position: position2 === "after" ? "drop-target-after" /* After */ : "drop-target-before" /* Before */
      }
    };
  }
  resolvePinTarget(data, targetElement, targetSector) {
    if (!targetElement) {
      return void 0;
    }
    let target;
    if (isSessionSection(targetElement)) {
      if (targetElement.id !== "pinned") {
        return void 0;
      }
    } else if (isSessionItem(targetElement) && this.delegate.isSessionPinned(targetElement)) {
      target = targetElement;
    } else {
      return void 0;
    }
    const dragged = this.draggedSessions(data);
    const hasArchived = dragged.some(session => session.isArchived.get());
    const allPinned = dragged.every(session => this.delegate.isSessionPinned(session));
    if (dragged.length === 0 || hasArchived || allPinned) {
      return void 0;
    }
    if (target && dragged.some(session => session.sessionId === target.sessionId)) {
      return void 0;
    }
    return {
      sessions: dragged,
      header: {
        kind: "section",
        id: "pinned"
      },
      target,
      position: target ? sectorToPosition(targetSector) : void 0
    };
  }
  resolveAddToGroupTarget(data, targetElement, targetSector) {
    if (!targetElement) {
      return void 0;
    }
    let groupId;
    let target;
    if (isSessionGroupItem(targetElement)) {
      groupId = targetElement.group.id;
    } else if (isSessionPlaceholder(targetElement) && targetElement.sectionId.startsWith("group:")) {
      groupId = targetElement.sectionId.slice("group:".length);
    } else if (isSessionItem(targetElement)) {
      groupId = this.delegate.getGroupIdOfSession(targetElement);
      target = groupId === void 0 ? void 0 : targetElement;
    }
    if (groupId === void 0) {
      return void 0;
    }
    const dragged = this.draggedSessions(data);
    const hasArchived = dragged.some(session => session.isArchived.get());
    const allInGroup = dragged.every(session => this.delegate.getGroupIdOfSession(session) === groupId);
    if (dragged.length === 0 || hasArchived || allInGroup) {
      return void 0;
    }
    if (target && dragged.some(session => session.sessionId === target.sessionId)) {
      return void 0;
    }
    return {
      sessions: dragged,
      groupId,
      header: {
        kind: "group",
        id: groupId
      },
      target,
      position: target ? sectorToPosition(targetSector) : void 0
    };
  }
  /**
   * Resolve the session the drop should be positioned against, or `undefined`
   * if the current drag is not a valid in-list reorder.
   */
  resolveReorderTarget(data, targetElement) {
    if (!targetElement || !isSessionItem(targetElement)) {
      return void 0;
    }
    const target = targetElement;
    if (!this.delegate.isReorderable(target)) {
      return void 0;
    }
    const dragged = this.draggedSessions(data);
    if (dragged.length === 0 || dragged.some(s => s.sessionId === target.sessionId)) {
      return void 0;
    }
    if (dragged.some(s => !this.delegate.isReorderable(s))) {
      return void 0;
    }
    if (!this.delegate.canDropOn(dragged, target)) {
      return void 0;
    }
    return target;
  }
  toMembershipDropReaction(target) {
    let position2 = "drop-target" /* Over */;
    if (target.position === "after") {
      position2 = "drop-target-after" /* After */;
    } else if (target.position === "before") {
      position2 = "drop-target-before" /* Before */;
    }
    return {
      accept: true,
      effect: {
        type: 1 /* Move */,
        position: position2
      }
    };
  }
  draggedHeader(data) {
    if (!(data instanceof ElementsDragAndDropData)) {
      return void 0;
    }
    const elements = data.elements;
    const groupItem = elements.find(isSessionGroupItem);
    if (groupItem) {
      return {
        id: `group:${groupItem.group.id}`,
        isWorkspace: false
      };
    }
    const workspaceSection = elements.find(e4 => isSessionSection(e4) && e4.id.startsWith("workspace:"));
    if (workspaceSection) {
      return {
        id: workspaceSection.id,
        isWorkspace: true
      };
    }
    return void 0;
  }
  /** The reorder identity of a top-level header element, or `undefined` when it is not reorderable. */
  headerRefOf(element) {
    if (isSessionGroupItem(element)) {
      return `group:${element.group.id}`;
    }
    if (isSessionSection(element) && element.id.startsWith("workspace:")) {
      return element.id;
    }
    return void 0;
  }
  draggedSessions(data) {
    return this.toSessions(data instanceof ElementsDragAndDropData ? data.elements : []);
  }
  toSessions(elements) {
    return elements.filter(isSessionItem);
  }
};
function sectorToPosition(sector) {
  return sector !== void 0 && sector >= 2 /* CENTER_BOTTOM */ ? "after" : "before";
}
var SessionsList = class extends Disposable {
  constructor(container2, options3, _sessionsManagementService, _sessionsService, _sessionsListModelService, _sessionGroupsService, _sessionSectionOrderService, _agentHostFilterService, instantiationService, contextKeyService, storageService, contextMenuService, menuService, keybindingService, commandService, _listVoicePlaybackService, assignmentService, configurationService, accessibilityService, layoutService) {
    super();
    this.options = options3;
    this._sessionsManagementService = _sessionsManagementService;
    this._sessionsService = _sessionsService;
    this._sessionsListModelService = _sessionsListModelService;
    this._sessionGroupsService = _sessionGroupsService;
    this._sessionSectionOrderService = _sessionSectionOrderService;
    this._agentHostFilterService = _agentHostFilterService;
    this.contextKeyService = contextKeyService;
    this.storageService = storageService;
    this.contextMenuService = contextMenuService;
    this.menuService = menuService;
    this.keybindingService = keybindingService;
    this.commandService = commandService;
    this._listVoicePlaybackService = _listVoicePlaybackService;
    this.assignmentService = assignmentService;
    this.configurationService = configurationService;
    this.accessibilityService = accessibilityService;
    this.layoutService = layoutService;
    this.sessions = [];
    this.visible = true;
    /**
     * Maximum number of sessions shown per workspace section or user group.
     */
    this.sessionGroupLimit = observableValue(this, SessionsList.DEFAULT_SESSION_GROUP_LIMIT);
    this.expandedSessionGroups = /* @__PURE__ */new Set();
    this.expandedMoreFolders = false;
    this.hasFindPattern = false;
    this.suspendCollapseStatePersistence = false;
    this._archiveActionsInProgress = /* @__PURE__ */new Set();
    /**
     * Snapshot of the currently-rendered reorderable top-level headers (groups
     * and, in workspace mode, workspace sections) in display order, by reorder
     * identity. Captured each render and used as the basis for drag-reorder math.
     */
    this._topLevelOrder = [];
    this._onDidUpdate = this._register(new Emitter());
    this.onDidUpdate = this._onDidUpdate.event;
    this._onDidChangeFindOpenState = this._register(new Emitter());
    this.onDidChangeFindOpenState = this._onDidChangeFindOpenState.event;
    this.excludedSessionTypes = this.loadExcludedSessionTypes();
    this.excludedStatuses = this.loadExcludedStatuses();
    this._excludeArchived = this.storageService.getBoolean(SessionsList.EXCLUDE_ARCHIVED_KEY, 0 /* PROFILE */, true);
    this._excludeRead = this.storageService.getBoolean(SessionsList.EXCLUDE_READ_KEY, 0 /* PROFILE */, false);
    this.workspaceGroupCapped = this.storageService.getBoolean(SessionsList.WORKSPACE_GROUP_CAPPED_KEY, 0 /* PROFILE */, true);
    this.listContainer = append(container2, $110(".sessions-list-control"));
    this._register(addDisposableListener(this.listContainer, EventType.POINTER_DOWN, () => {
      this.listContainer.classList.add(SESSION_SECTION_FOCUS_FROM_POINTER_CLASS);
    }));
    this._register(addDisposableListener(this.listContainer.ownerDocument, EventType.KEY_DOWN, () => {
      this.listContainer.classList.remove(SESSION_SECTION_FOCUS_FROM_POINTER_CLASS);
    }, true));
    const approvalModel = this._register(instantiationService.createInstance(AgentSessionApprovalModel));
    const markdownRendererService = instantiationService.invokeFunction(accessor => accessor.get(IMarkdownRendererService));
    const hoverService = instantiationService.invokeFunction(accessor => accessor.get(IHoverService));
    const sessionsProvidersService = instantiationService.invokeFunction(accessor => accessor.get(ISessionsProvidersService));
    this._sessionsProvidersService = sessionsProvidersService;
    const providerCapabilityListeners = this._register(new DisposableStore());
    const subscribeProviderCapabilities = () => {
      providerCapabilityListeners.clear();
      for (const provider of sessionsProvidersService.getProviders()) {
        if (provider.onDidChangeCapabilities) {
          providerCapabilityListeners.add(provider.onDidChangeCapabilities(() => this.update()));
        }
      }
    };
    subscribeProviderCapabilities();
    this._register(sessionsProvidersService.onDidChangeProviders(() => {
      subscribeProviderCapabilities();
      this.update();
    }));
    this._register(this.configurationService.onDidChangeConfiguration(e4 => {
      if (e4.affectsConfiguration(SESSIONS_LIST_SHOW_EMPTY_DEFAULT_GROUPS_SETTING)) {
        this.update();
      }
    }));
    const agentSessionsService = instantiationService.invokeFunction(accessor => accessor.get(IAgentSessionsService));
    const voicePlaybackService = instantiationService.invokeFunction(accessor => accessor.get(IVoicePlaybackService));
    const sessionRenderer = this._sessionRenderer = new SessionItemRenderer({
      grouping: this.options.grouping,
      isPinned: s => this.isSessionPinned(s),
      isRead: s => s.isRead.get(),
      visibleSessions: this._sessionsService.visibleSessions,
      getMultiSelectedSessions: s => this.getMultiSelectedSessions(s),
      showHover: true,
      approvalRowMaxLines: DEFAULT_APPROVAL_ROW_MAX_LINES,
      toolbarMenuId: SessionItemToolbarMenuId,
      handleToolbarAction: (action, session) => this.handleToolbarAction(action, session)
    }, approvalModel, void 0, instantiationService, contextKeyService, markdownRendererService, hoverService, sessionsProvidersService, agentSessionsService, voicePlaybackService);
    const showMoreRenderer = new SessionShowMoreRenderer();
    const placeholderRenderer = new SessionPlaceholderRenderer(hoverService);
    const sectionRenderer = new SessionSectionRenderer(true, instantiationService, contextKeyService);
    this._sectionRenderer = sectionRenderer;
    const groupRenderer = new SessionGroupRenderer({
      commitEdit: (group2, name) => this.commitGroupEdit(group2, name),
      cancelEdit: group2 => this.cancelGroupEdit(group2)
    }, instantiationService, contextKeyService);
    this._groupRenderer = groupRenderer;
    const delegate = new SessionsTreeDelegate(approvalModel, () => !!IsPhoneLayoutContext.getValue(contextKeyService));
    this.tree = this._register(instantiationService.createInstance(WorkbenchObjectTree, "SessionsListTree", this.listContainer, delegate, [sessionRenderer, sectionRenderer, groupRenderer, showMoreRenderer, placeholderRenderer], {
      accessibilityProvider: new SessionsAccessibilityProvider(),
      dnd: this._register(new SessionsListDragAndDrop({
        isReorderable: session => this.isReorderable(session),
        isSessionPinned: session => this.isSessionPinned(session),
        canDropOn: (dragged, target) => this.canReorderOnto(dragged, target),
        reorder: (dragged, target, position2) => this.reorderSessions(dragged, target, position2),
        getGroupIdOfSession: session => this._sessionGroupsService.getGroupOfSession(session.sessionId),
        addSessionsToGroup: (sessions, groupId, target, position2) => this.addSessionsToGroup(sessions, groupId, target, position2),
        pinSessions: (sessions, target, position2) => this.pinSessions(sessions, target, position2),
        setDropTargetHeader: header2 => this.setDropTargetHeader(header2),
        reorderSection: (draggedId, targetId, position2, isWorkspace2) => this.reorderSection(draggedId, targetId, position2, isWorkspace2)
      })),
      identityProvider: {
        getId: element => {
          if (isSessionGroupItem(element)) {
            return `group:${element.group.id}`;
          }
          if (isSessionSection(element)) {
            return `section:${element.id}`;
          }
          if (isSessionShowMore(element)) {
            return `show-more:${element.kind}:${element.mode}:${element.sectionId}`;
          }
          if (isSessionPlaceholder(element)) {
            return `placeholder:${element.sectionId}`;
          }
          return element.resource.toString();
        },
        getGroupId: element => {
          if (isSessionGroupItem(element)) {
            return NotSelectableGroupId;
          }
          if (isSessionSection(element)) {
            return NotSelectableGroupId;
          }
          if (isSessionShowMore(element)) {
            return NotSelectableGroupId;
          }
          if (isSessionPlaceholder(element)) {
            return NotSelectableGroupId;
          }
          return element.isArchived.get() ? 2 : 1;
        }
      },
      horizontalScrolling: false,
      multipleSelectionSupport: true,
      indent: 0,
      findWidgetEnabled: true,
      defaultFindMode: 1 /* Filter */,
      findWidgetContainer: this.options.findWidgetContainer,
      findWidgetStyles: {
        ...defaultFindWidgetStyles,
        toggleStyles: {
          ...defaultToggleStyles,
          inputActiveOptionBorder: "transparent"
        }
      },
      keyboardNavigationLabelProvider: {
        getKeyboardNavigationLabel: element => {
          if (isSessionGroupItem(element)) {
            return element.group.name;
          }
          if (isSessionSection(element)) {
            return element.label;
          }
          if (isSessionShowMore(element)) {
            return element.sectionLabel;
          }
          if (isSessionPlaceholder(element)) {
            return element.label;
          }
          return element.title.get();
        }
      },
      overrideStyles: this.options.overrideStyles,
      renderIndentGuides: "none" /* None */,
      twistieAdditionalCssClass: () => "force-no-twistie"
    }));
    this._register(this.tree.onDidOpen(e4 => {
      const element = e4.element;
      if (!element) {
        return;
      }
      if (isSessionShowMore(element)) {
        if (element.kind === "folders") {
          this.expandedMoreFolders = element.mode === "more";
        } else {
          if (element.mode === "more") {
            this.expandedSessionGroups.add(element.sectionId);
          } else {
            this.expandedSessionGroups.delete(element.sectionId);
          }
        }
        this.update();
        return;
      }
      if (isSessionPlaceholder(element)) {
        return;
      }
      if (!isSessionSection(element) && !isSessionGroupItem(element)) {
        this.markRead(element);
        const isLeftClick = isMouseEvent(e4.browserEvent) && e4.browserEvent.button === 0;
        const preserveFocus = isLeftClick ? false : e4.editorOptions.preserveFocus ?? false;
        this.options.onSessionOpen(element.resource, preserveFocus, e4.sideBySide);
        if (this._listVoicePlaybackService.hasPendingResponse(element.resource)) {
          this.commandService.executeCommand("_chat.voice.activateSession", element.resource.toString());
        }
      }
    }));
    this._register(sessionRenderer.onDidChangeItemHeight(session => {
      if (this.tree.hasElement(session)) {
        this.tree.updateElementHeight(session, delegate.getHeight(session));
      }
    }));
    const phoneKeys = /* @__PURE__ */new Set([IsPhoneLayoutContext.key]);
    this._register(this.contextKeyService.onDidChangeContext(e4 => {
      if (!e4.affectsSome(phoneKeys)) {
        return;
      }
      for (const session of this.sessions) {
        if (this.tree.hasElement(session)) {
          this.tree.updateElementHeight(session, delegate.getHeight(session));
        }
      }
    }));
    this._register(this.tree.onContextMenu(e4 => this.onContextMenu(e4)));
    this._register(this.tree.onDidChangeCollapseState(e4 => {
      const element = e4.node.element;
      if (element && isSessionGroupItem(element)) {
        this._groupRenderer.updateCollapseState(element, e4.node.collapsed);
        if (!this.suspendCollapseStatePersistence) {
          this.saveSectionCollapseState(`group:${element.group.id}`, e4.node.collapsed);
        }
      } else if (element && isSessionSection(element)) {
        sectionRenderer.updateCollapseState(element, e4.node.collapsed);
        if (!this.suspendCollapseStatePersistence) {
          this.saveSectionCollapseState(element.id, e4.node.collapsed);
        }
      }
    }));
    let isFindOpen = false;
    let findPattern = "";
    const updateFindPatternState = () => {
      const hasFindPattern = isFindOpen && findPattern.length > 0;
      if (hasFindPattern !== this.hasFindPattern) {
        this.hasFindPattern = hasFindPattern;
        this.update();
      }
    };
    this._register(this.tree.onDidChangeFindOpenState(open2 => {
      isFindOpen = open2;
      this._onDidChangeFindOpenState.fire(open2);
      updateFindPatternState();
    }));
    this._register(this.tree.onDidChangeFindPattern(pattern => {
      findPattern = pattern;
      updateFindPatternState();
    }));
    this._register(this._sessionsManagementService.onDidChangeSessions(e4 => {
      if (this.visible) {
        this.refresh();
      }
      if (e4.removed.length > 0) {
        this._sessionSectionOrderService.retain(this.liveSectionOrderIds());
      }
    }));
    this._register(this._sessionsListModelService.onDidChange(() => {
      if (this.visible) {
        this.update();
      }
    }));
    this._register(this._sessionGroupsService.onDidChange(e4 => {
      if (this.visible) {
        this.update();
      }
      if (e4.groupsChanged) {
        this._sessionSectionOrderService.retain(this.liveSectionOrderIds());
      }
    }));
    this._register(this._sessionSectionOrderService.onDidChange(() => {
      if (this.visible) {
        this.update();
      }
    }));
    this._register(this._agentHostFilterService.onDidChange(() => {
      if (this.visible) {
        this.update();
      }
    }));
    this._register(autorun(reader => {
      this._sessionsService.activeSession.read(reader);
      if (this.visible) {
        this.update();
      }
    }));
    const assignmentRefetchSignal = observableSignalFromEvent(this, this.assignmentService.onDidRefetchAssignments);
    this._register(autorun(reader => {
      assignmentRefetchSignal.read(reader);
      this.updateSessionGroupLimit();
    }));
    this.refresh();
  }
  static {
    this.SECTION_COLLAPSE_STATE_KEY = "sessionsListControl.sectionCollapseState";
  }
  static {
    this.EXCLUDED_TYPES_KEY = "sessionsListControl.excludedSessionTypes";
  }
  static {
    this.EXCLUDED_STATUSES_KEY = "sessionsListControl.excludedStatuses";
  }
  static {
    this.EXCLUDE_ARCHIVED_KEY = "sessionsListControl.excludeArchived";
  }
  static {
    this.EXCLUDE_READ_KEY = "sessionsListControl.excludeRead";
  }
  static {
    this.WORKSPACE_GROUP_CAPPED_KEY = "sessionsListControl.workspaceGroupCapped";
  }
  static {
    this.DEFAULT_SESSION_GROUP_LIMIT = 5;
  }
  static {
    /**
     * Experiment treatment that overrides how many sessions are shown per group
     * before the "show more" affordance appears.
     */
    this.SESSION_GROUP_LIMIT_TREATMENT = "sessions.workspaceGroupLimit";
  }
  get element() {
    return this.listContainer;
  }
  /**
   * Fetches the session group limit treatment and updates the backing
   * observable. Invalid or unset treatments fall back to the default limit.
   */
  updateSessionGroupLimit() {
    this.assignmentService.getTreatment(SessionsList.SESSION_GROUP_LIMIT_TREATMENT).then(value2 => {
      const limit = typeof value2 === "number" && Number.isInteger(value2) && value2 > 0 ? value2 : SessionsList.DEFAULT_SESSION_GROUP_LIMIT;
      if (this.sessionGroupLimit.get() !== limit) {
        this.sessionGroupLimit.set(limit, void 0);
        if (this.visible) {
          this.update();
        }
      }
    });
  }
  refresh() {
    this.sessions = this._sessionsManagementService.getSessions();
    for (const session of this.sessions) {
      this._sessionsListModelService.migrateLegacyReadState(session);
    }
    this.update();
  }
  update(expandAll2) {
    const activeSession = this._sessionsService.activeSession.get();
    let filtered = this.sessions;
    const hostFilter = this._agentHostFilterService.selectedProviderId;
    if (hostFilter !== void 0) {
      filtered = filtered.filter(s => s.providerId === hostFilter);
    }
    if (this.excludedSessionTypes.size > 0) {
      filtered = filtered.filter(s => !this.excludedSessionTypes.has(s.sessionType));
    }
    if (this.excludedStatuses.size > 0) {
      filtered = filtered.filter(s => !this.excludedStatuses.has(s.status.get()));
    }
    if (this._excludeArchived) {
      filtered = filtered.filter(s => !s.isArchived.get());
    }
    if (this._excludeRead) {
      filtered = filtered.filter(s => !s.isRead.get());
    }
    if (activeSession && !filtered.some(s => s.sessionId === activeSession.sessionId)) {
      const match2 = this.sessions.find(s => s.sessionId === activeSession.sessionId);
      if (match2) {
        filtered = [...filtered, match2];
      }
    }
    const grouping = this.options.grouping();
    const sorting = this.options.sorting();
    const sortKeyForGrouping = (s, srt) => this._sessionsListModelService.getSortKey(s, sortingToMode(srt));
    const groupedMembers = /* @__PURE__ */new Map();
    const groupedRegularIds = /* @__PURE__ */new Set();
    for (const s of filtered) {
      if (s.isArchived.get() || this.isSessionPinned(s)) {
        continue;
      }
      const groupId = this._sessionGroupsService.getGroupOfSession(s.sessionId);
      if (groupId !== void 0 && this._sessionGroupsService.getGroup(groupId)) {
        let members = groupedMembers.get(groupId);
        if (!members) {
          members = [];
          groupedMembers.set(groupId, members);
        }
        members.push(s);
        groupedRegularIds.add(s.sessionId);
      }
    }
    const forSections = groupedRegularIds.size > 0 ? filtered.filter(s => !groupedRegularIds.has(s.sessionId)) : filtered;
    const groupItemsById = /* @__PURE__ */new Map();
    for (const group2 of this._sessionGroupsService.getGroups()) {
      const members = groupedMembers.get(group2.id) ?? [];
      const sortedMembers = sortSessions(members, sorting, sortKeyForGrouping);
      groupItemsById.set(group2.id, {
        group: group2,
        sessions: sortedMembers,
        isEmpty: this._sessionGroupsService.getSessionIdsInGroup(group2.id).length === 0,
        editing: group2.id === this._editingGroupId
      });
    }
    const defaultGroupIds = [...groupItemsById.values()].sort((a, b) => b.group.createdAt - a.group.createdAt).map(item => `group:${item.group.id}`);
    const sections = groupSessionsForList(forSections, grouping, sorting, session => this.isSessionPinned(session), (s, srt) => this._sessionsListModelService.getSortKey(s, sortingToMode(srt)));
    const hasRecentSessions = sections.some(s => s.id === "recent" && s.sessions.length > 0);
    const showEmptyDefaultGroups = this.configurationService.getValue(SESSIONS_LIST_SHOW_EMPTY_DEFAULT_GROUPS_SETTING);
    if (showEmptyDefaultGroups && this._someProviderSupportsQuickChats() && !sections.some(s => s.id === QUICK_CHATS_SECTION_ID)) {
      sections.push({
        id: QUICK_CHATS_SECTION_ID,
        label: localize("recovered.4788", "Chats"),
        sessions: []
      });
    }
    const partitionFolders = grouping === "workspace" /* Workspace */ && !this.hasFindPattern && this.workspaceGroupCapped;
    const moreFolderSectionIds = /* @__PURE__ */new Set();
    if (partitionFolders) {
      const workspaceSections = sections.filter(s => s.id.startsWith("workspace:"));
      if (workspaceSections.length > 0) {
        const now = Date.now();
        const isRecent = section => section.sessions.some(s => s.updatedAt.get().getTime() >= now - FOUR_DAYS_MS);
        const isOpenWindow = section => !!this.openWindowSourceFolder && section.sessions.some(s => sessionMatchesFolder(s, this.openWindowSourceFolder));
        const meetsCriteria = section => isRecent(section) || isOpenWindow(section);
        let anyMeets = false;
        for (const section of workspaceSections) {
          if (meetsCriteria(section)) {
            anyMeets = true;
            break;
          }
        }
        let fallbackId;
        if (!anyMeets) {
          let bestTime = -Infinity;
          for (const section of workspaceSections) {
            for (const s of section.sessions) {
              const t2 = s.updatedAt.get().getTime();
              if (t2 > bestTime) {
                bestTime = t2;
                fallbackId = section.id;
              }
            }
          }
        }
        for (const section of workspaceSections) {
          if (!meetsCriteria(section) && section.id !== fallbackId && !this._sessionSectionOrderService.isPromoted(section.id)) {
            moreFolderSectionIds.add(section.id);
          }
        }
      }
    }
    const children = [];
    const sessionGroupLimit = this.sessionGroupLimit.get();
    const toSessionChildren = sessions => sessions.map(session => ({
      element: session
    }));
    const renderSessionChildren = (sessions, sectionId, sectionLabel, enabled) => {
      const limited = limitSessionsForList(sessions, sessionGroupLimit, {
        enabled,
        expanded: this.expandedSessionGroups.has(sectionId),
        sectionId,
        sectionLabel
      });
      const children2 = toSessionChildren(limited.sessions);
      if (limited.showMore) {
        children2.push({
          element: limited.showMore
        });
      }
      return children2;
    };
    const renderSection2 = section => {
      const isWorkspaceGroup = grouping === "workspace" /* Workspace */ && section.id.startsWith("workspace:");
      const limitSessions = isWorkspaceGroup && !this.hasFindPattern && this.workspaceGroupCapped;
      let sectionChildren = renderSessionChildren(section.sessions, section.id, section.label, limitSessions);
      if (section.id === QUICK_CHATS_SECTION_ID && section.sessions.length === 0) {
        sectionChildren = [{
          element: {
            placeholder: true,
            sectionId: section.id,
            label: localize("recovered.4798", "No chats")
          }
        }];
      }
      let defaultCollapsed = 2 /* PreserveOrExpanded */;
      if (grouping === "date" /* Date */ && hasRecentSessions) {
        const olderSections = ["older", "archived"];
        if (olderSections.includes(section.id)) {
          defaultCollapsed = 3 /* PreserveOrCollapsed */;
        }
      }
      if (section.id === "archived") {
        defaultCollapsed = 3 /* PreserveOrCollapsed */;
      }
      if (section.id === "pinned" || section.id === QUICK_CHATS_SECTION_ID) {
        defaultCollapsed = 3 /* PreserveOrCollapsed */;
      }
      return {
        element: section,
        collapsible: true,
        collapsed: this.getSavedCollapseState(section.id) ?? defaultCollapsed,
        children: sectionChildren
      };
    };
    const renderGroup = groupItem => {
      const sectionId = `group:${groupItem.group.id}`;
      const groupChildren2 = groupItem.sessions.length === 0 ? [{
        element: {
          placeholder: true,
          sectionId,
          label: localize("recovered.4799", "No session"),
          hover: localize("recovered.4800", "Use Add to Group from a session's context menu, or drag it into this group.")
        }
      }] : renderSessionChildren(groupItem.sessions, sectionId, groupItem.group.name, !this.hasFindPattern && this.workspaceGroupCapped);
      return {
        element: groupItem,
        collapsible: true,
        collapsed: this.getSavedCollapseState(sectionId) ?? 2 /* PreserveOrExpanded */,
        children: groupChildren2
      };
    };
    const pinnedSection = sections.find(s => s.id === "pinned");
    if (pinnedSection) {
      children.push(renderSection2(pinnedSection));
    }
    const quickChatsSection = sections.find(s => s.id === QUICK_CHATS_SECTION_ID);
    if (quickChatsSection) {
      children.push(renderSection2(quickChatsSection));
    }
    const renderGroupById = id2 => {
      const groupItem = groupItemsById.get(id2.slice("group:".length));
      if (groupItem) {
        children.push(renderGroup(groupItem));
      }
    };
    if (grouping === "date" /* Date */) {
      const resolvedGroupIds = this._sessionSectionOrderService.resolveOrder(defaultGroupIds);
      this._topLevelOrder = resolvedGroupIds;
      for (const id2 of resolvedGroupIds) {
        renderGroupById(id2);
      }
      for (const section of sections) {
        if (section.id === "pinned" || section.id === "archived" || section.id === QUICK_CHATS_SECTION_ID) {
          continue;
        }
        children.push(renderSection2(section));
      }
      const archived = sections.find(s => s.id === "archived");
      if (archived) {
        children.push(renderSection2(archived));
      }
    } else {
      const workspaceSections = sections.filter(s => s.id.startsWith("workspace:"));
      const sectionById = new Map(workspaceSections.map(s => [s.id, s]));
      const primaryWorkspaceIds = workspaceSections.filter(s => !moreFolderSectionIds.has(s.id)).map(s => s.id);
      const defaultOrder = [...defaultGroupIds, ...primaryWorkspaceIds];
      const resolvedIds = this._sessionSectionOrderService.resolveOrder(defaultOrder);
      this._topLevelOrder = resolvedIds;
      for (const id2 of resolvedIds) {
        if (id2.startsWith("group:")) {
          renderGroupById(id2);
        } else {
          const section = sectionById.get(id2);
          if (section) {
            children.push(renderSection2(section));
          }
        }
      }
      const moreFolderSections = workspaceSections.filter(s => moreFolderSectionIds.has(s.id));
      if (moreFolderSections.length > 0) {
        if (this.expandedMoreFolders) {
          for (const section of moreFolderSections) {
            children.push(renderSection2(section));
          }
          children.push({
            element: {
              showMore: true,
              kind: "folders",
              mode: "less",
              sectionId: SHOW_MORE_FOLDERS_LABEL,
              sectionLabel: SHOW_MORE_FOLDERS_LABEL,
              remainingCount: 0
            }
          });
        } else {
          children.push({
            element: {
              showMore: true,
              kind: "folders",
              mode: "more",
              sectionId: SHOW_MORE_FOLDERS_LABEL,
              sectionLabel: SHOW_MORE_FOLDERS_LABEL,
              remainingCount: moreFolderSections.length
            }
          });
        }
      }
      const archivedSection = sections.find(s => s.id === "archived");
      if (archivedSection) {
        children.push(renderSection2(archivedSection));
      }
    }
    this.tree.setChildren(null, children);
    this._onDidUpdate.fire();
  }
  getVisibleSessions() {
    const sessions = new Set(this.sessions);
    const visibleSessions = [];
    const collect2 = node => {
      if (!node.visible) {
        return;
      }
      if (node.element && sessions.has(node.element)) {
        visibleSessions.push(node.element);
      }
      if (node.collapsed) {
        return;
      }
      for (const child of node.children) {
        collect2(child);
      }
    };
    const root = this.tree.getNode();
    for (const child of root.children) {
      collect2(child);
    }
    return visibleSessions;
  }
  reveal(sessionResource) {
    const resourceStr = sessionResource.toString();
    for (const session of this.sessions) {
      if (session.resource.toString() === resourceStr) {
        if (this.tree.hasElement(session)) {
          if (this.tree.getRelativeTop(session) === null) {
            this.tree.reveal(session, 0.5);
          }
          this.tree.setFocus([session]);
          this.tree.setSelection([session]);
          return true;
        }
      }
    }
    return false;
  }
  clearFocus() {
    this.tree.setFocus([]);
    this.tree.setSelection([]);
  }
  hasFocusOrSelection() {
    return this.tree.getFocus().length > 0 || this.tree.getSelection().length > 0;
  }
  setVisible(visible) {
    if (this.visible === visible) {
      return;
    }
    this.visible = visible;
    if (this.visible) {
      this.refresh();
    }
  }
  layout(height, width2) {
    this.tree.layout(height, width2);
  }
  focus() {
    this.tree.domFocus();
    if (this.tree.getFocus().length === 0) {
      this.tree.focusFirst();
    }
  }
  openFind() {
    this.tree.openFind();
  }
  closeFind() {
    this.tree.closeFind();
  }
  // Context menu
  /**
   * Whether a session may participate in manual reordering. Archived (Done)
   * sessions keep their fixed section.
   */
  isReorderable(session) {
    return !session.isArchived.get();
  }
  /**
   * Whether the dragged sessions can be reordered relative to the target.
   * Reordering stays within the same scope: dragged sessions must share the
   * target's group membership, and (when grouping by workspace) its workspace.
   */
  canReorderOnto(dragged, target) {
    const targetPinned = this.isSessionPinned(target);
    if (dragged.some(s => this.isSessionPinned(s) !== targetPinned)) {
      return false;
    }
    if (targetPinned) {
      return true;
    }
    const targetGroup = this._sessionGroupsService.getGroupOfSession(target.sessionId);
    if (dragged.some(s => this._sessionGroupsService.getGroupOfSession(s.sessionId) !== targetGroup)) {
      return false;
    }
    if (targetGroup === void 0 && this.options.grouping() === "workspace" /* Workspace */) {
      const targetLabel = sessionWorkspaceLabel(target);
      return dragged.every(s => sessionWorkspaceLabel(s) === targetLabel);
    }
    return true;
  }
  /**
   * Reorder the dragged sessions so they land as a contiguous block before or
   * after the target session, persisting a synthetic sort key (the midpoint of
   * the surrounding sessions' keys). When the dragged sessions' natural
   * timestamps already sort them into the dropped slot, any stored override is
   * dropped instead so the list falls back to natural ordering.
   */
  reorderSessions(dragged, target, position2) {
    const mode = sortingToMode(this.options.sorting());
    const grouping = this.options.grouping();
    const getKey = s => this._sessionsListModelService.getSortKey(s, mode);
    const targetPinned = this.isSessionPinned(target);
    let scope = this.getVisibleSessions().filter(s => this.isReorderable(s));
    scope = scope.filter(s => this.isSessionPinned(s) === targetPinned);
    if (!targetPinned) {
      const targetGroup = this._sessionGroupsService.getGroupOfSession(target.sessionId);
      scope = scope.filter(s => this._sessionGroupsService.getGroupOfSession(s.sessionId) === targetGroup);
      if (targetGroup === void 0 && grouping === "workspace" /* Workspace */) {
        const targetLabel = sessionWorkspaceLabel(target);
        scope = scope.filter(s => sessionWorkspaceLabel(s) === targetLabel);
      }
    }
    const draggedIds = new Set(dragged.map(s => s.sessionId));
    const draggedOrdered = scope.filter(s => draggedIds.has(s.sessionId));
    if (draggedOrdered.length === 0) {
      return;
    }
    const remaining = scope.filter(s => !draggedIds.has(s.sessionId));
    const targetIndex = remaining.findIndex(s => s.sessionId === target.sessionId);
    if (targetIndex === -1) {
      return;
    }
    const insertIndex = position2 === "before" ? targetIndex : targetIndex + 1;
    const above = remaining[insertIndex - 1];
    const below = remaining[insertIndex];
    const {
      set,
      clear
    } = computeReorderSortChanges({
      draggedIds: draggedOrdered.map(s => s.sessionId),
      naturalKeys: draggedOrdered.map(s => this._sessionsListModelService.getNaturalSortKey(s, mode)),
      aboveKey: above ? getKey(above) : void 0,
      belowKey: below ? getKey(below) : void 0,
      now: Date.now(),
      fallbackStep: SORT_FALLBACK_STEP_MS
    });
    this._sessionsListModelService.applySortChanges(mode, set, clear);
  }
  // -- Groups --
  /**
   * Create a new group containing the given sessions and start renaming it.
   * Archived (Done) sessions are ignored.
   */
  createGroupFromSessions(sessions) {
    const groupSessions = sessions.filter(session => !session.isArchived.get());
    if (groupSessions.length === 0) {
      return;
    }
    this.createGroup(groupSessions);
  }
  createGroup(groupSessions) {
    this._sessionsListModelService.unpinSessions(groupSessions);
    const group2 = this._sessionGroupsService.createGroup(localize("recovered.4797", "New Group"), groupSessions.map(s => s.sessionId));
    this._editingGroupId = group2.id;
    this.update();
    this.revealGroup(group2.id);
  }
  /** Scroll the group's header into view so its inline name editor is visible. */
  revealGroup(groupId) {
    const root = this.tree.getNode();
    for (const node of root.children) {
      const element = node.element;
      if (element && isSessionGroupItem(element) && element.group.id === groupId) {
        if (this.tree.hasElement(element) && this.tree.getRelativeTop(element) === null) {
          this.tree.reveal(element, 0.5);
        }
        return;
      }
    }
  }
  /** Begin inline renaming of the group's header. */
  beginRenameGroup(groupId) {
    if (!this._sessionGroupsService.getGroup(groupId)) {
      return;
    }
    this._editingGroupId = groupId;
    this.update();
  }
  addSessionsToGroup(sessions, groupId, target, position2) {
    const groupSessions = sessions.filter(session => !session.isArchived.get());
    this._sessionsListModelService.unpinSessions(groupSessions);
    this._sessionGroupsService.addToGroup(groupSessions.map(s => s.sessionId), groupId);
    if (target && position2) {
      this.reorderSessions(groupSessions, target, position2);
    }
  }
  commitGroupEdit(group2, name) {
    this._editingGroupId = void 0;
    const trimmed = name.trim();
    if (trimmed) {
      this._sessionGroupsService.renameGroup(group2.id, trimmed);
    }
    this.update();
  }
  cancelGroupEdit(_group) {
    this._editingGroupId = void 0;
    this.update();
  }
  /**
   * Reorder a top-level header (group or workspace section) so it lands
   * before/after the target header. The new order is persisted to the
   * section-order service. When the dragged header is a workspace it is also
   * promoted so it stays visible (escapes the "+N more workspaces" capping).
   */
  reorderSection(draggedId, targetId, position2, isWorkspace2) {
    this._sessionSectionOrderService.reorder(this._topLevelOrder, draggedId, targetId, position2, isWorkspace2 ? draggedId : void 0);
  }
  /**
   * Groups in their current top-to-bottom display order. Groups are fully
   * user-managed (see {@link ISessionSectionOrderService}); the order defaults
   * to newest-first and is shared with the list. Used to keep the "Add to
   * Group" / "Move to Group" menu consistent with the rendered order.
   */
  getGroupsInDisplayOrder() {
    const groups = this._sessionGroupsService.getGroups();
    const byId = new Map(groups.map(g => [`group:${g.id}`, g]));
    const defaultIds = [...groups].sort((a, b) => b.createdAt - a.createdAt).map(g => `group:${g.id}`);
    return this._sessionSectionOrderService.resolveOrder(defaultIds).map(id2 => byId.get(id2)).filter(g => !!g);
  }
  /**
   * The set of top-level reorder identities that currently exist (every group,
   * plus every workspace label present across all sessions, regardless of
   * grouping mode or capping). Used to garbage-collect stale manual order and
   * promotion entries. Reads sessions fresh from the management service so it
   * reflects the latest loaded state even when the list is not visible.
   */
  liveSectionOrderIds() {
    const ids = /* @__PURE__ */new Set();
    for (const group2 of this._sessionGroupsService.getGroups()) {
      ids.add(`group:${group2.id}`);
    }
    for (const session of this._sessionsManagementService.getSessions()) {
      ids.add(`workspace:${sessionWorkspaceLabel(session)}`);
    }
    return ids;
  }
  setDropTargetHeader(header2) {
    const current = this._dropTargetHeader;
    if (current?.kind === header2?.kind && current?.id === header2?.id) {
      this.toggleDropTargetHeader(header2, header2 !== void 0);
      return;
    }
    this.toggleDropTargetHeader(current, false);
    this._dropTargetHeader = header2;
    this.toggleDropTargetHeader(header2, true);
  }
  toggleDropTargetHeader(header2, active) {
    if (!header2) {
      return;
    }
    if (header2.kind === "group") {
      this._groupRenderer.setDropTarget(header2.id, active);
    } else {
      this._sectionRenderer.setDropTarget(header2.id, active);
    }
  }
  getMultiSelectedSessions(session) {
    const selection = this.tree.getSelection().filter(s => !!s && isSessionItem(s));
    return selection.includes(session) ? [session, ...selection.filter(s => s !== session)] : [session];
  }
  async handleToolbarAction(action, session) {
    const sessions = this.getMultiSelectedSessions(session);
    if (!shouldAnimateArchiveAction(action.id, sessions.length, this.accessibilityService.isMotionReduced())) {
      return false;
    }
    const sessionResources = sessions.map(session2 => session2.resource.toString());
    if (sessionResources.some(resource => this._archiveActionsInProgress.has(resource))) {
      return true;
    }
    const overlayHost = this.layoutService.getContainer(getWindow(this.listContainer));
    const animation = this._sessionRenderer.startArchiveAnimation(session, overlayHost);
    if (!animation) {
      return false;
    }
    for (const resource of sessionResources) {
      this._archiveActionsInProgress.add(resource);
    }
    try {
      await animation.finished;
      await action.run(sessions);
      return true;
    } finally {
      this._sessionRenderer.clearArchiveAnimation(session, animation);
      for (const resource of sessionResources) {
        this._archiveActionsInProgress.delete(resource);
      }
    }
  }
  onContextMenu(e4) {
    const element = e4.element;
    if (!element || isSessionSection(element) || isSessionShowMore(element) || isSessionPlaceholder(element)) {
      this.showCreateGroupContextMenu(e4.anchor);
      return;
    }
    if (isSessionGroupItem(element)) {
      this.showGroupContextMenu(element, e4.anchor);
      return;
    }
    const selectedSessions = this.getMultiSelectedSessions(element);
    const inGroup = this._sessionGroupsService.getGroupOfSession(element.sessionId) !== void 0;
    const contextOverlay = [[IsSessionPinnedContext.key, this.isSessionPinned(element)], [SessionIsArchivedContext.key, element.isArchived.get()], [SessionIsReadContext.key, element.isRead.get()], [SessionItemHasBranchNameContext.key, !!element.workspace.get()?.folders[0]?.gitRepository?.branchName?.trim()], [SessionItemInGroupContext.key, inGroup], [SessionTypeContext.key, element.sessionType], [SessionProviderIdContext.key, element.providerId], [SessionSupportsRenameContext.key, element.capabilities.get().supportsRename ?? false], [SessionSupportsDeleteContext.key, element.capabilities.get().supportsDelete ?? false], [SessionHasPullRequestContext.key, !!element.workspace.get()?.folders[0]?.gitRepository?.gitHubInfo.get()?.pullRequest]];
    const menu = this.menuService.createMenu(SessionItemContextMenuId, this.contextKeyService.createOverlay(contextOverlay));
    const marshalledArg = {
      $mid: 25 /* AgentSessionContext */,
      session: {
        resource: element.resource
      },
      sessions: selectedSessions.map(s => ({
        resource: s.resource
      }))
    };
    const wrapForExtensions = action => {
      if (!(action instanceof MenuItemAction) || !action.item.source) {
        return action;
      }
      const wrapped = new Action(action.id, action.label, action.class, action.enabled, () => this.commandService.executeCommand(action.id, marshalledArg));
      wrapped.tooltip = action.tooltip;
      wrapped.checked = action.checked;
      return wrapped;
    };
    this.contextMenuService.showContextMenu({
      getActions: () => {
        const base = Separator.join(...menu.getActions({
          arg: selectedSessions,
          shouldForwardArgs: true
        }).map(([, actions]) => actions.map(wrapForExtensions)));
        const groupActions = this.getGroupSessionActions(selectedSessions);
        return groupActions.length > 0 ? [...base, new Separator(), ...groupActions] : base;
      },
      getAnchor: () => e4.anchor,
      getKeyBinding: action => this.keybindingService.lookupKeybinding(action.id) ?? void 0
    });
    menu.dispose();
  }
  /**
   * Build the group-related context menu actions for the given session(s):
   * "Create Group", an "Add to Group"/"Move to Group" submenu listing the
   * groups in display order, and "Remove from Group" when applicable.
   */
  getGroupSessionActions(selected) {
    const actions = [];
    if (selected.some(session => session.isArchived.get())) {
      return actions;
    }
    actions.push(this.getCreateGroupAction(selected));
    const currentGroupIds = new Set(selected.map(s => this._sessionGroupsService.getGroupOfSession(s.sessionId)));
    const currentGroupId = currentGroupIds.size === 1 ? [...currentGroupIds][0] : void 0;
    const targetGroups = this.getGroupsInDisplayOrder().filter(g => g.id !== currentGroupId);
    if (targetGroups.length > 0) {
      const subActions = targetGroups.map(g => new Action(`sessions.addToGroup.${g.id}`, g.name, void 0, true, async () => {
        this.addSessionsToGroup(selected, g.id);
      }));
      const label3 = currentGroupId !== void 0 ? localize("recovered.4795", "Move to Group") : localize("recovered.4784", "Add to Group");
      actions.push(new SubmenuAction("sessions.addToGroupSubmenu", label3, subActions));
    }
    if (currentGroupId !== void 0) {
      actions.push(new Action("sessions.removeFromGroup", localize("recovered.4805", "Remove from Group"), void 0, true, async () => {
        for (const session of selected) {
          this._sessionGroupsService.removeFromGroup(session.sessionId);
        }
      }));
    }
    return actions;
  }
  getCreateGroupAction(sessions) {
    return new Action("sessions.createGroup", localize("recovered.4792", "Create Group"), void 0, true, async () => {
      if (sessions) {
        this.createGroupFromSessions(sessions);
      } else {
        this.createGroup([]);
      }
    });
  }
  showCreateGroupContextMenu(anchor) {
    this.contextMenuService.showContextMenu({
      getActions: () => [this.getCreateGroupAction()],
      getAnchor: () => anchor
    });
  }
  showGroupContextMenu(groupItem, anchor) {
    const actions = [this.getCreateGroupAction(), new Separator(), new Action("sessions.renameGroupAction", localize("recovered.4806", "Rename..."), void 0, true, async () => {
      this.beginRenameGroup(groupItem.group.id);
    }), new Action("sessions.deleteGroupAction", localize("recovered.4793", "Delete Group"), void 0, true, async () => {
      this._sessionGroupsService.deleteGroup(groupItem.group.id);
    })];
    this.contextMenuService.showContextMenu({
      getActions: () => actions,
      getAnchor: () => anchor
    });
  }
  resetSectionCollapseState() {
    this.storageService.remove(SessionsList.SECTION_COLLAPSE_STATE_KEY, 0 /* PROFILE */);
  }
  // -- Pinning --
  pinSession(session) {
    this._sessionsListModelService.pinSession(session);
  }
  pinSessions(sessions, target, position2) {
    const pinnable = sessions.filter(session => !session.isArchived.get());
    for (const session of pinnable) {
      this._sessionsListModelService.pinSession(session);
    }
    if (target && position2) {
      this.reorderSessions(pinnable, target, position2);
    }
  }
  unpinSession(session) {
    this._sessionsListModelService.unpinSession(session);
  }
  isSessionPinned(session) {
    return this._sessionsListModelService.isSessionPinned(session);
  }
  /** Whether any registered provider can create quick chats (gates the always-visible "Chats" section). */
  _someProviderSupportsQuickChats() {
    return this._sessionsProvidersService.getProviders().some(p => !!p.supportsQuickChats);
  }
  // -- Read/Unread --
  markRead(session) {
    this._sessionsManagementService.markRead(session);
  }
  markUnread(session) {
    this._sessionsManagementService.markUnread(session);
  }
  // -- Session type filtering --
  setSessionTypeExcluded(sessionTypeId, excluded) {
    if (excluded) {
      this.excludedSessionTypes.add(sessionTypeId);
    } else {
      this.excludedSessionTypes.delete(sessionTypeId);
    }
    this.saveExcludedSessionTypes();
    this.update();
  }
  isSessionTypeExcluded(sessionTypeId) {
    return this.excludedSessionTypes.has(sessionTypeId);
  }
  loadExcludedSessionTypes() {
    const raw = this.storageService.get(SessionsList.EXCLUDED_TYPES_KEY, 0 /* PROFILE */);
    if (raw) {
      try {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          return new Set(arr);
        }
      } catch {}
    }
    return /* @__PURE__ */new Set();
  }
  saveExcludedSessionTypes() {
    if (this.excludedSessionTypes.size === 0) {
      this.storageService.remove(SessionsList.EXCLUDED_TYPES_KEY, 0 /* PROFILE */);
    } else {
      this.storageService.store(SessionsList.EXCLUDED_TYPES_KEY, JSON.stringify([...this.excludedSessionTypes]), 0 /* PROFILE */, 0 /* USER */);
    }
  }
  // -- Status filtering --
  setStatusExcluded(status2, excluded) {
    if (excluded) {
      this.excludedStatuses.add(status2);
    } else {
      this.excludedStatuses.delete(status2);
    }
    this.saveExcludedStatuses();
    this.update();
  }
  isStatusExcluded(status2) {
    return this.excludedStatuses.has(status2);
  }
  loadExcludedStatuses() {
    const raw = this.storageService.get(SessionsList.EXCLUDED_STATUSES_KEY, 0 /* PROFILE */);
    if (raw) {
      try {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          return new Set(arr);
        }
      } catch {}
    }
    return /* @__PURE__ */new Set();
  }
  saveExcludedStatuses() {
    if (this.excludedStatuses.size === 0) {
      this.storageService.remove(SessionsList.EXCLUDED_STATUSES_KEY, 0 /* PROFILE */);
    } else {
      this.storageService.store(SessionsList.EXCLUDED_STATUSES_KEY, JSON.stringify([...this.excludedStatuses]), 0 /* PROFILE */, 0 /* USER */);
    }
  }
  // -- Archived / Read filtering --
  setExcludeArchived(exclude) {
    this._excludeArchived = exclude;
    this.storageService.store(SessionsList.EXCLUDE_ARCHIVED_KEY, exclude, 0 /* PROFILE */, 0 /* USER */);
    this.update();
  }
  isExcludeArchived() {
    return this._excludeArchived;
  }
  setExcludeRead(exclude) {
    this._excludeRead = exclude;
    this.storageService.store(SessionsList.EXCLUDE_READ_KEY, exclude, 0 /* PROFILE */, 0 /* USER */);
    this.update();
  }
  isExcludeRead() {
    return this._excludeRead;
  }
  resetFilters() {
    this.excludedSessionTypes.clear();
    this.saveExcludedSessionTypes();
    this.excludedStatuses.clear();
    this.saveExcludedStatuses();
    this._excludeArchived = true;
    this.storageService.store(SessionsList.EXCLUDE_ARCHIVED_KEY, true, 0 /* PROFILE */, 0 /* USER */);
    this._excludeRead = false;
    this.storageService.store(SessionsList.EXCLUDE_READ_KEY, false, 0 /* PROFILE */, 0 /* USER */);
    this.workspaceGroupCapped = true;
    this.storageService.store(SessionsList.WORKSPACE_GROUP_CAPPED_KEY, true, 0 /* PROFILE */, 0 /* USER */);
    this.expandedSessionGroups.clear();
    this.expandedMoreFolders = false;
    this.update();
  }
  // Session group capping
  setWorkspaceGroupCapped(capped) {
    this.workspaceGroupCapped = capped;
    this.storageService.store(SessionsList.WORKSPACE_GROUP_CAPPED_KEY, capped, 0 /* PROFILE */, 0 /* USER */);
    if (capped) {
      this.expandedSessionGroups.clear();
    }
    this.update();
  }
  isWorkspaceGroupCapped() {
    return this.workspaceGroupCapped;
  }
  setOpenWindowSourceFolder(folder) {
    const before = this.openWindowSourceFolder?.toString();
    const after2 = folder?.toString();
    if (before === after2) {
      return;
    }
    this.openWindowSourceFolder = folder;
    this.update();
  }
  collapseAllSections() {
    this.suspendCollapseStatePersistence = true;
    try {
      this.tree.collapseAll();
    } finally {
      this.suspendCollapseStatePersistence = false;
    }
    this.saveBulkCollapseState(true);
  }
  // -- Section collapse persistence --
  getSavedCollapseState(sectionId) {
    const raw = this.storageService.get(SessionsList.SECTION_COLLAPSE_STATE_KEY, 0 /* PROFILE */);
    if (raw) {
      try {
        const state = JSON.parse(raw);
        if (typeof state[sectionId] === "boolean") {
          return state[sectionId];
        }
      } catch {}
    }
    return void 0;
  }
  saveSectionCollapseState(sectionId, collapsed2) {
    let state = {};
    const raw = this.storageService.get(SessionsList.SECTION_COLLAPSE_STATE_KEY, 0 /* PROFILE */);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
          state = parsed;
        }
      } catch {}
    }
    state[sectionId] = collapsed2;
    this.storageService.store(SessionsList.SECTION_COLLAPSE_STATE_KEY, JSON.stringify(state), 0 /* PROFILE */, 0 /* USER */);
  }
  saveBulkCollapseState(collapsed2) {
    const state = {};
    for (const child of this.tree.getNode(null).children) {
      if (child.element && isSessionSection(child.element)) {
        state[child.element.id] = collapsed2;
      }
    }
    this.storageService.store(SessionsList.SECTION_COLLAPSE_STATE_KEY, JSON.stringify(state), 0 /* PROFILE */, 0 /* USER */);
  }
};
SessionsList = __decorateClass([__decorateParam(2, ISessionsManagementService), __decorateParam(3, ISessionsService), __decorateParam(4, ISessionsListModelService), __decorateParam(5, ISessionGroupsService), __decorateParam(6, ISessionSectionOrderService), __decorateParam(7, IAgentHostFilterService), __decorateParam(8, IInstantiationService), __decorateParam(9, IContextKeyService), __decorateParam(10, IStorageService), __decorateParam(11, IContextMenuService), __decorateParam(12, IMenuService), __decorateParam(13, IKeybindingService), __decorateParam(14, ICommandService), __decorateParam(15, IVoicePlaybackService), __decorateParam(16, IWorkbenchAssignmentService), __decorateParam(17, IConfigurationService), __decorateParam(18, IAccessibilityService), __decorateParam(19, ILayoutService)], SessionsList);
function getFirstApprovalAcrossChats(approvalModel, session, reader) {
  let oldest;
  for (const chat of session.chats.read(reader)) {
    const approval = approvalModel.getApproval(chat.resource).read(reader);
    if (approval && (!oldest || approval.since.getTime() < oldest.since.getTime())) {
      oldest = approval;
    }
  }
  return oldest;
}
function sessionMatchesFolder(session, folder) {
  const workspace = session.workspace.get();
  if (!workspace) {
    return false;
  }
  const folderStr = folder.toString();
  for (const folder2 of workspace.folders) {
    if (folder2.workingDirectory?.toString() === folderStr || folder2.root.toString() === folderStr) {
      return true;
    }
  }
  return false;
}
function sortSessions(sessions, sorting, getSortKey) {
  const key3 = getSortKey ?? defaultSortKey;
  return [...sessions].sort((a, b) => key3(b, sorting) - key3(a, sorting));
}
function limitSessionsForList(sessions, limit, options3) {
  if (!options3.enabled || sessions.length <= limit) {
    return {
      sessions,
      showMore: void 0
    };
  }
  if (options3.expanded) {
    return {
      sessions,
      showMore: {
        showMore: true,
        kind: "sessions",
        mode: "less",
        sectionId: options3.sectionId,
        sectionLabel: options3.sectionLabel,
        remainingCount: 0
      }
    };
  }
  return {
    sessions: sessions.slice(0, limit),
    showMore: {
      showMore: true,
      kind: "sessions",
      mode: "more",
      sectionId: options3.sectionId,
      sectionLabel: options3.sectionLabel,
      remainingCount: sessions.length - limit
    }
  };
}
function defaultSortKey(session, sorting) {
  if (sorting === "updated" /* Updated */) {
    return session.updatedAt.get().getTime();
  }
  return session.createdAt.getTime();
}
function computeReorderSortChanges(input) {
  const {
    draggedIds,
    naturalKeys,
    aboveKey,
    belowKey,
    now,
    fallbackStep
  } = input;
  const count2 = draggedIds.length;
  const upperFit = aboveKey ?? Number.POSITIVE_INFINITY;
  const lowerFit = belowKey ?? Number.NEGATIVE_INFINITY;
  let naturalFits = true;
  for (let i2 = 0; i2 < count2; i2++) {
    if (!(naturalKeys[i2] < upperFit && naturalKeys[i2] > lowerFit)) {
      naturalFits = false;
      break;
    }
    if (i2 > 0 && !(naturalKeys[i2] < naturalKeys[i2 - 1])) {
      naturalFits = false;
      break;
    }
  }
  const set = /* @__PURE__ */new Map();
  const clear = [];
  if (naturalFits) {
    for (const id2 of draggedIds) {
      clear.push(id2);
    }
  } else {
    const upper = aboveKey ?? now;
    const lower = belowKey ?? upper - (count2 + 1) * fallbackStep;
    const step = (upper - lower) / (count2 + 1);
    for (let i2 = 0; i2 < count2; i2++) {
      set.set(draggedIds[i2], upper - (i2 + 1) * step);
    }
  }
  return {
    set,
    clear
  };
}
var QUICK_CHATS_SECTION_ID = "quickchats";
function isQuickChatSession(session) {
  return session.isQuickChat?.get() ?? false;
}
function groupSessionsForList(sessions, grouping, sorting, isSessionPinned, getSortKey) {
  const sorted = sortSessions(sessions, sorting, getSortKey);
  const pinned = [];
  const archived = [];
  const quickChats = [];
  const regular = [];
  for (const session of sorted) {
    if (session.isArchived.get()) {
      archived.push(session);
    } else if (isSessionPinned(session)) {
      pinned.push(session);
    } else if (isQuickChatSession(session)) {
      quickChats.push(session);
    } else {
      regular.push(session);
    }
  }
  const sections = [];
  if (pinned.length > 0) {
    sections.push({
      id: "pinned",
      label: localize("recovered.4803", "Pinned"),
      sessions: pinned
    });
  }
  if (quickChats.length > 0) {
    sections.push({
      id: QUICK_CHATS_SECTION_ID,
      label: localize("recovered.4788", "Chats"),
      sessions: quickChats
    });
  }
  sections.push(...(grouping === "workspace" /* Workspace */ ? groupByWorkspace(regular) : groupByDate(regular, sorting, getSortKey)));
  if (archived.length > 0) {
    sections.push({
      id: "archived",
      label: localize("recovered.4787", "Done"),
      sessions: archived
    });
  }
  return sections;
}
function sessionWorkspaceLabel(session) {
  return session.workspace.get()?.label || localize("recovered.4824", "Unknown");
}
function groupByWorkspace(sessions) {
  const groups = /* @__PURE__ */new Map();
  for (const session of sessions) {
    const label3 = sessionWorkspaceLabel(session);
    let group2 = groups.get(label3);
    if (!group2) {
      group2 = [];
      groups.set(label3, group2);
    }
    group2.push(session);
  }
  const unknownWorkspaceLabel = localize("recovered.4824", "Unknown");
  const order = [...groups.keys()].filter(k => k !== unknownWorkspaceLabel).sort((a, b) => a.localeCompare(b));
  const result = order.map(label3 => ({
    id: `workspace:${label3}`,
    label: label3,
    sessions: groups.get(label3)
  }));
  const unknownWorkspace = groups.get(unknownWorkspaceLabel);
  if (unknownWorkspace) {
    result.push({
      id: `workspace:${unknownWorkspaceLabel}`,
      label: unknownWorkspaceLabel,
      sessions: unknownWorkspace
    });
  }
  return result;
}
var RECENT_SESSIONS_LIMIT = 10;
function groupByDate(sessions, sorting, getSortKey) {
  const key3 = getSortKey ?? defaultSortKey;
  const now = /* @__PURE__ */new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfWeek = startOfToday - 7 * 864e5;
  const recent = [];
  const older = [];
  for (const session of sessions) {
    const time = key3(session, sorting);
    if (time >= startOfWeek && recent.length < RECENT_SESSIONS_LIMIT) {
      recent.push(session);
    } else {
      older.push(session);
    }
  }
  const sections = [];
  const addGroup = (id2, label3, groupSessions) => {
    if (groupSessions.length > 0) {
      sections.push({
        id: id2,
        label: label3,
        sessions: groupSessions
      });
    }
  };
  addGroup("recent", localize("recovered.4804", "Recent"), recent);
  addGroup("older", localize("recovered.4801", "Older"), older);
  return sections;
}
var SessionsFlatList = class extends Disposable {
  constructor(container2, options3, _sessionsService, _sessionsListModelService, _sessionsManagementService, instantiationService, contextKeyService, markdownRendererService, hoverService, sessionsProvidersService, voicePlaybackService) {
    super();
    this.options = options3;
    this._sessionsService = _sessionsService;
    this._sessionsListModelService = _sessionsListModelService;
    this._sessionsManagementService = _sessionsManagementService;
    this._onDidChangeContentHeight = this._register(new Emitter());
    this.onDidChangeContentHeight = this._onDidChangeContentHeight.event;
    this._onDidApproveSession = this._register(new Emitter());
    /** Fires when a session's pending action is approved from its "Allow" button. */
    this.onDidApproveSession = this._onDidApproveSession.event;
    this._sessions = [];
    const listRoot = append(container2, $110(".sessions-list-control"));
    const approvalModel = this.options.approvalModel ?? this._register(instantiationService.createInstance(AgentSessionApprovalModel));
    const agentSessionsService = instantiationService.invokeFunction(accessor => accessor.get(IAgentSessionsService));
    const sessionRenderer = new SessionItemRenderer({
      grouping: () => "date" /* Date */,
      isPinned: s => this._sessionsListModelService.isSessionPinned(s),
      isRead: s => s.isRead.get(),
      visibleSessions: this._sessionsService.visibleSessions,
      getMultiSelectedSessions: s => [s],
      showHover: this.options.showSessionHover ?? true,
      approvalRowMaxLines: this.options.approvalRowMaxLines ?? DEFAULT_APPROVAL_ROW_MAX_LINES,
      toolbarMenuId: this.options.toolbarMenuId ?? SessionItemToolbarMenuId,
      handleToolbarAction: this.options.onToolbarAction
    }, approvalModel, this.options.ciFixModel, instantiationService, contextKeyService, markdownRendererService, hoverService, sessionsProvidersService, agentSessionsService, voicePlaybackService);
    this._delegate = new SessionsTreeDelegate(approvalModel, () => false, this.options.approvalRowMaxLines ?? DEFAULT_APPROVAL_ROW_MAX_LINES, this.options.ciFixModel);
    this.tree = this._register(instantiationService.createInstance(WorkbenchObjectTree, "SessionsFlatList", listRoot, this._delegate, [sessionRenderer], {
      accessibilityProvider: new SessionsAccessibilityProvider(),
      identityProvider: {
        getId: element => element.resource.toString()
      },
      horizontalScrolling: false,
      multipleSelectionSupport: false,
      indent: 0,
      overrideStyles: this.options.overrideStyles,
      renderIndentGuides: "none" /* None */,
      twistieAdditionalCssClass: () => "force-no-twistie"
    }));
    this._register(this.tree.onDidOpen(e4 => {
      const element = e4.element;
      if (!element || !isSessionItem(element)) {
        return;
      }
      this._sessionsManagementService.markRead(element);
      const isLeftClick = isMouseEvent(e4.browserEvent) && e4.browserEvent.button === 0;
      const preserveFocus = isLeftClick ? false : e4.editorOptions.preserveFocus ?? false;
      this.options.onSessionOpen(element.resource, preserveFocus, e4.sideBySide);
    }));
    this._register(sessionRenderer.onDidChangeItemHeight(session => {
      if (this.tree.hasElement(session)) {
        this.tree.updateElementHeight(session, this._delegate.getHeight(session));
        this._onDidChangeContentHeight.fire();
      }
    }));
    this._register(sessionRenderer.onDidApproveSession(approved => this._onDidApproveSession.fire(approved)));
  }
  static {
    this.ROW_HEIGHT = 54;
  }
  setSessions(sessions) {
    this._sessions = sessions;
    this.tree.setChildren(null, sessions.map(session => ({
      element: session
    })));
  }
  /** The total pixel height required to render all current rows without scrolling. */
  getContentHeight() {
    return this._sessions.reduce((total, session) => total + this._delegate.getHeight(session), 0);
  }
  getRowHeight() {
    return SessionsFlatList.ROW_HEIGHT;
  }
  layout(height, width2) {
    this.tree.layout(height, width2);
  }
  focus() {
    this.tree.domFocus();
  }
};
SessionsFlatList = __decorateClass([__decorateParam(2, ISessionsService), __decorateParam(3, ISessionsListModelService), __decorateParam(4, ISessionsManagementService), __decorateParam(5, IInstantiationService), __decorateParam(6, IContextKeyService), __decorateParam(7, IMarkdownRendererService), __decorateParam(8, IHoverService), __decorateParam(9, ISessionsProvidersService), __decorateParam(10, IVoicePlaybackService)], SessionsFlatList);

// src/vs/sessions/contrib/sessions/browser/customizationsToolbar.contribution.ts
export { $110, SESSION_SECTION_FOCUS_FROM_POINTER_CLASS, SESSION_HEADER_DROP_TARGET_CLASS, SessionItemToolbarMenuId, SessionItemContextMenuId, SessionSectionToolbarMenuId, SessionGroupToolbarMenuId, SESSIONS_LIST_SHOW_EMPTY_DEFAULT_GROUPS_SETTING, IsSessionPinnedContext, SessionItemHasBranchNameContext, SessionItemStatusContext, SessionItemInGroupContext, SessionSectionTypeContext, SessionGroupHasVisibleSessionsContext, SessionGroupIsEmptyContext, shouldAnimateArchiveAction, SessionsGrouping, SessionsSorting, sortingToMode, SORT_FALLBACK_STEP_MS, isSessionGroupItem, isSessionSection, isSessionShowMore, isSessionPlaceholder, isSessionItem, SHOW_MORE_FOLDERS_LABEL, FOUR_DAYS_MS, DEFAULT_APPROVAL_ROW_MAX_LINES, SessionsTreeDelegate, SessionItemActionRunner, SESSION_TITLE_SHIMMER_ANIMATION_NAME, SESSION_TITLE_SHIMMER_ANIMATION_NAMES, SESSION_TITLE_SHIMMER_PAUSED_CLASS, SessionItemRenderer, SessionSectionRenderer, SessionGroupRenderer, SessionShowMoreRenderer, SessionPlaceholderRenderer, SessionsAccessibilityProvider, SessionsListDragAndDrop, sectorToPosition, SessionsList, getFirstApprovalAcrossChats, sessionMatchesFolder, sortSessions, limitSessionsForList, defaultSortKey, computeReorderSortChanges, QUICK_CHATS_SECTION_ID, isQuickChatSession, groupSessionsForList, sessionWorkspaceLabel, groupByWorkspace, RECENT_SESSIONS_LIMIT, groupByDate, SessionsFlatList, $110 as $ };
