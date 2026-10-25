// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
import { __decorateClass } from "../../../../../base/common/shunCodeRecoveredHelpersWorkbench.js";
import { __decorateParam } from "../../../../../base/common/shunCodeRecoveredHelpersWorkbench.js";
import { localize } from "../../../../../nls.js";
import { canceledName } from "../../../../../base/common/errors.js";
import { coalesce } from "../../../../../base/common/arrays.js";
import { distinct } from "../../../../../base/common/arrays.js";
import { ResourceMap } from "../../../../../base/common/map.js";
import { Iterable } from "../../../../../base/common/iterator.js";
import { dispose } from "../../../../../base/common/lifecycle.js";
import { toDisposable } from "../../../../../base/common/lifecycle.js";
import { DisposableStore } from "../../../../../base/common/lifecycle.js";
import { Disposable } from "../../../../../base/common/lifecycle.js";
import { MutableDisposable } from "../../../../../base/common/lifecycle.js";
import { DisposableMap } from "../../../../../base/common/lifecycle.js";
import { Emitter } from "../../../../../base/common/event.js";
import { StandardKeyboardEvent } from "../../../../../base/browser/keyboardEvent.js";
import { URI } from "../../../../../base/common/uri.js";
import { Schemas } from "../../../../../base/common/network.js";
import { FileAccess } from "../../../../../base/common/network.js";
import { isEqual as isEqual2 } from "../../../../../base/common/resources.js";
import { basename as basename2 } from "../../../../../base/common/resources.js";
import { clamp } from "../../../../../base/common/numbers.js";
import { observableValue } from "../../../../../base/common/observableInternal/observables/observableValue.js";
import { autorun } from "../../../../../base/common/observableInternal/reactions/autorun.js";
import { getWindow } from "../../../../../base/browser/dom.js";
import { clearNode } from "../../../../../base/browser/dom.js";
import { addDisposableListener } from "../../../../../base/browser/dom.js";
import { addStandardDisposableListener } from "../../../../../base/browser/dom.js";
import { scheduleAtNextAnimationFrame } from "../../../../../base/browser/dom.js";
import { WindowIntervalTimer } from "../../../../../base/browser/dom.js";
import { findParentWithClass } from "../../../../../base/browser/dom.js";
import { getActiveElement } from "../../../../../base/browser/dom.js";
import { isAncestorOfActiveElement } from "../../../../../base/browser/dom.js";
import { isHTMLElement } from "../../../../../base/browser/dom.js";
import { EventType } from "../../../../../base/browser/dom.js";
import { append } from "../../../../../base/browser/dom.js";
import { reset } from "../../../../../base/browser/dom.js";
import { $ } from "../../../../../base/browser/dom.js";
import { show } from "../../../../../base/browser/dom.js";
import { hide } from "../../../../../base/browser/dom.js";
import { DisposableResizeObserver } from "../../../../../base/browser/dom.js";
import { alert } from "../../../../../base/browser/ui/aria/aria.js";
import { IInstantiationService } from "../../../../../platform/instantiation/common/instantiation.js";
import { Codicon } from "../../../../../base/common/codicons.js";
import { ThemeIcon } from "../../../../../base/common/themables.js";
import { ICommandService } from "../../../../../platform/commands/common/commands.js";
import { IContextKeyService } from "../../../../../platform/contextkey/common/contextkey.js";
import { MenuId } from "../../../../../platform/actions/common/actions.js";
import { MenuItemAction } from "../../../../../platform/actions/common/actions.js";
import { ITelemetryService } from "../../../../../platform/telemetry/common/telemetry.js";
import { toErrorMessage } from "../../../../../base/common/errorMessage.js";
import { ILogService } from "../../../../../platform/log/common/log.js";
import { IAccessibilityService } from "../../../../../platform/accessibility/common/accessibility.js";
import { IConfigurationService } from "../../../../../platform/configuration/common/configuration.js";
import { isDark } from "../../../../../platform/theme/common/theme.js";
import { IThemeService } from "../../../../../platform/theme/common/themeService.js";
import { ServiceCollection } from "../../../../../platform/instantiation/common/serviceCollection.js";
import { IAccessibilitySignalService } from "../../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js";
import { AccessibilitySignal } from "../../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js";
import { getDefaultHoverDelegate } from "../../../../../base/browser/ui/hover/hoverDelegateFactory.js";
import { CachedListVirtualDelegate } from "../../../../../base/browser/ui/list/list.js";
import { MarkdownString } from "../../../../../base/common/htmlContent.js";
import { MenuEntryActionViewItem } from "../../../../../platform/actions/browser/menuEntryActionViewItem.js";
import { createActionViewItem } from "../../../../../platform/actions/browser/menuEntryActionViewItem.js";
import { MenuWorkbenchToolBar } from "../../../../../platform/actions/browser/toolbar.js";
import { IHoverService } from "../../../../../platform/hover/browser/hover.js";
import { renderFormattedText } from "../../../../../base/browser/formattedTextRenderer.js";
import { IWorkbenchEnvironmentService } from "../../../../services/environment/common/environmentService.js";
import { IChatEntitlementService } from "../../../../services/chat/common/chatEntitlementService.js";
import { parseRemoteAgentHostSessionTypeAuthority } from "../../../../../platform/agentHost/common/agentHostSessionType.js";
import { SessionType } from "../../common/chatSessionsService.js";
import { isAgentHostTarget } from "../../common/chatSessionsService.js";
import { localChatSessionType } from "../../common/chatSessionsService.js";
import { getChatSessionType } from "../../common/model/chatUri.js";
import { CHAT_OPEN_AGENT_HOST_CHAT_COMMAND_ID } from "../../common/constants.js";
import { ChatContextKeys } from "../../common/actions/chatContextKeys.js";
import { IChatToolInvocation } from "../../common/chatService/chatService.js";
import { isChatFollowup } from "../../common/chatService/chatService.js";
import { IChatService } from "../../common/chatService/chatService.js";
import { getNWords } from "../../common/model/chatWordCounter.js";
import { isRequestVM } from "../../common/model/chatViewModel.js";
import { isResponseVM } from "../../common/model/chatViewModel.js";
import { isPendingDividerVM } from "../../common/model/chatViewModel.js";
import { getStickyScrollTargetItem } from "../../common/model/chatViewModel.js";
import { isPasteVariableEntry } from "../../common/attachments/chatVariableEntries.js";
import { isExplicitFileOrImageVariableEntry } from "../../common/attachments/chatVariableEntries.js";
import { getExplicitFileOrImageAttachmentSummary } from "../../common/attachments/chatVariableEntries.js";
import { IChatWidgetService } from "../chat.js";
import { AgentSessionProviders } from "../agentSessions/agentSessions.js";
import { chatSubcommandLeader } from "../../common/requestParser/chatParserTypes.js";
import { checkModeOption } from "../../common/chat.js";
import { ChatPlanReviewData } from "../../common/model/chatProgressTypes/chatPlanReviewData.js";
import { ChatQuestionCarouselData } from "../../common/model/chatProgressTypes/chatQuestionCarouselData.js";
import { CodiconActionViewItem } from "../../../notebook/browser/view/cellParts/cellActionView.js";
import { IChatBranchService } from "../chatBranchService.js";
import { RestoreCheckpointActionId } from "../chatEditing/chatEditingActions.js";
import { isCreateSessionTool } from "../../../../../platform/agentHost/common/openSessionLink.js";
import { isCreateChatTool } from "../../../../../platform/agentHost/common/openSessionLink.js";
import { isSendMessageTool } from "../../../../../platform/agentHost/common/openSessionLink.js";
import { ChatPlanReviewPart } from "./chatContentParts/chatPlanReviewPart.js";
import { ChatQuestionCarouselPart } from "./chatContentParts/chatQuestionCarouselPart.js";
import { ChatUsedReferencesListContentPart } from "./chatContentParts/chatReferencesContentPart.js";
import { CollapsibleListPool } from "./chatContentParts/chatReferencesContentPart.js";
import { annotateSpecialMarkdownContent } from "../../common/widget/annotations.js";
import { extractSubAgentInvocationIdFromText } from "../../common/widget/annotations.js";
import { hasCodeblockUriTag } from "../../common/widget/annotations.js";
import { hasEditCodeblockUriTag } from "../../common/widget/annotations.js";
import { formatChatResponseElapsedTime } from "../../common/chatProgressFormatting.js";
import { formatChatRequestTimestamp } from "../../common/chatProgressFormatting.js";
import { formatChatResponseDetails } from "../../common/chatProgressFormatting.js";
import { ForkConversationActionId } from "../actions/chatForkActions.js";
import { MarkHelpfulActionId } from "../actions/chatTitleActions.js";
import { AgentHostSnapshotController } from "../agentSessions/agentHost/agentHostSnapshotController.js";
import { ChatForkActionViewItem } from "./chatForkActionViewItem.js";
import { ChatRestoreCheckpointActionViewItem } from "./chatRestoreCheckpointActionViewItem.js";
import { ChatAgentHover } from "./chatAgentHover.js";
import { getChatAgentHoverOptions } from "./chatAgentHover.js";
import { ChatContentMarkdownRenderer } from "./chatContentMarkdownRenderer.js";
import { ChatAgentCommandContentPart } from "./chatContentParts/chatAgentCommandContentPart.js";
import { ChatAnonymousRateLimitedPart } from "./chatContentParts/chatAnonymousRateLimitedPart.js";
import { ChatAttachmentsContentPart } from "./chatContentParts/chatAttachmentsContentPart.js";
import { ChatAutoModeResolutionContentPart } from "./chatContentParts/chatAutoModeResolutionContentPart.js";
import { ChatCheckpointFileChangesSummaryContentPart } from "./chatContentParts/chatChangesSummaryPart.js";
import { isChatTurnStatusPillsEnabled } from "./chatTurnPills.js";
import { ChatTurnPillsContentPart } from "./chatContentParts/chatTurnPillsPart.js";
import { ChatCodeCitationContentPart } from "./chatContentParts/chatCodeCitationContentPart.js";
import { ChatCommandButtonContentPart } from "./chatContentParts/chatCommandContentPart.js";
import { ChatMarkdownDecorationsRenderer } from "./chatContentParts/chatMarkdownDecorationsRenderer.js";
import { ChatCodeBlockContentProvider } from "./chatContentParts/codeBlockPart.js";
import { ChatExtensionsContentPart } from "./chatContentParts/chatExtensionsContentPart.js";
import { isMcpToolInvocation } from "./chatContentParts/toolInvocationParts/chatToolPartUtilities.js";
import { getEffectiveThinkingDisplayMode } from "./chatContentParts/chatThinkingContentPart.js";
import { ChatThinkingContentPart } from "./chatContentParts/chatThinkingContentPart.js";
import { ChatProgressContentPart } from "./chatContentParts/chatProgressContentPart.js";
import { ChatWorkingProgressContentPart } from "./chatContentParts/chatProgressContentPart.js";
import { ChatMarkdownContentPart } from "./chatContentParts/chatMarkdownContentPart.js";
import { codeblockHasClosingBackticks } from "./chatContentParts/chatMarkdownContentPart.js";
import { ChatConfirmationContentPart } from "./chatContentParts/chatConfirmationContentPart.js";
import { EditorPool } from "./chatContentParts/chatContentCodePools.js";
import { DiffEditorPool } from "./chatContentParts/chatContentCodePools.js";
import { InlineTextModelCollection } from "./chatContentParts/chatContentParts.js";
import { ChatElicitationContentPart } from "./chatContentParts/chatElicitationContentPart.js";
import { ChatErrorContentPart } from "./chatContentParts/chatErrorContentPart.js";
import { ChatErrorConfirmationContentPart } from "./chatContentParts/chatErrorConfirmationPart.js";
import { ChatMcpServersInteractionContentPart } from "./chatContentParts/chatMcpServersInteractionContentPart.js";
import { ChatMcpAuthenticationContentPart } from "./chatContentParts/chatMcpAuthenticationContentPart.js";
import { ChatMcpServersStartingContentPart } from "./chatContentParts/chatMcpServersStartingContentPart.js";
import { ChatDisabledClaudeHooksContentPart } from "./chatContentParts/chatDisabledClaudeHooksContentPart.js";
import { ChatMultiDiffContentPart } from "./chatContentParts/chatMultiDiffContentPart.js";
import { ChatPullRequestContentPart } from "./chatContentParts/chatPullRequestContentPart.js";
import { ChatQuotaExceededPart } from "./chatContentParts/chatQuotaExceededPart.js";
import { ChatTaskContentPart } from "./chatContentParts/chatTaskContentPart.js";
import { ChatSystemNotificationContentPart } from "./chatContentParts/chatSystemNotificationContentPart.js";
import { ChatTextEditContentPart } from "./chatContentParts/chatTextEditContentPart.js";
import { ChatToolInvocationPart as ChatToolInvocationPart3 } from "./chatContentParts/toolInvocationParts/chatToolInvocationPart.js";
import { ChatSubagentContentPart } from "./chatContentParts/chatSubagentContentPart.js";
import { ChatTreeContentPart } from "./chatContentParts/chatTreeContentPart.js";
import { TreePool } from "./chatContentParts/chatTreeContentPart.js";
import { ChatWorkspaceEditContentPart } from "./chatContentParts/chatWorkspaceEditContentPart.js";
import { ChatExternalEditContentPart } from "./chatContentParts/chatExternalEditContentPart.js";
import { ChatHookContentPart } from "./chatContentParts/chatHookContentPart.js";
var $55 = $;
var COPILOT_USERNAME = "GitHub Copilot";
var WORKING_CAUGHT_UP_DEBOUNCE_MS = 750;
var DEFAULT_CHAT_ITEM_HORIZONTAL_PADDING = 40;
function escapeMarkdownLinkLabel2(label3) {
  return label3.replace(/\\/g, "\\\\").replace(/\]/g, "\\]");
}
function buildPlanReviewProgressContent(review, message) {
  const renderedAsUsed = !!review.isUsed;
  const data = renderedAsUsed && !review.data?.rejected ? review.data : void 0;
  let overall = data?.feedbackOverall?.trim();
  const inlineMd = data?.feedbackInlineMarkdown?.trim();
  if (!overall && !inlineMd && data?.feedback) {
    overall = data.feedback.trim();
  }
  const content2 = new MarkdownString(void 0, {
    supportThemeIcons: true
  });
  if (overall) {
    content2.appendText(localize("recovered.11350", "{0}: {1}", message, overall.replace(/\s+/g, " ")));
  } else {
    content2.appendText(message);
  }
  if (renderedAsUsed) {
    const reviewContent = review.content.trim();
    const planUri = review.planUri ? URI.revive(review.planUri) : void 0;
    if (reviewContent || planUri) {
      content2.appendMarkdown("\n\n");
      if (reviewContent) {
        content2.appendMarkdown(reviewContent);
      }
      if (planUri) {
        if (reviewContent) {
          content2.appendMarkdown("\n\n");
        }
        const planFileName = basename2(planUri);
        const label3 = planFileName ? localize("recovered.11352", "Open full plan file ({0})", planFileName) : localize("recovered.11351", "Open full plan file");
        const planWidgetUri = planUri.with({
          query: planUri.query ? `${planUri.query}&vscodeLinkType=file` : "vscodeLinkType=file"
        });
        content2.appendMarkdown(`[${escapeMarkdownLinkLabel2(label3)}](${planWidgetUri.toString(true)})`);
      }
    }
  }
  if (inlineMd) {
    content2.appendMarkdown("\n\n");
    content2.appendMarkdown(inlineMd);
  }
  return content2;
}
function shouldScheduleInitialHeightChange(normalizedHeight, allocatedHeight) {
  return typeof allocatedHeight !== "number" || normalizedHeight > allocatedHeight;
}
function getFinalResponseStartIndex(content2) {
  let index2 = content2.length - 1;
  while (index2 >= 0) {
    const part = content2[index2];
    if (part.kind === "markdownContent" && part.content.value.length) {
      break;
    }
    index2--;
  }
  if (index2 < 0) {
    return void 0;
  }
  while (index2 > 0 && content2[index2 - 1].kind === "markdownContent") {
    index2--;
  }
  return index2;
}
function formatCompletedResponseDisclosureLabel(stepCount, elapsedMs) {
  const elapsed = formatChatResponseElapsedTime(elapsedMs);
  if (stepCount === 1) {
    return elapsed ? localize("recovered.11361", "Completed 1 step in {0}", elapsed) : localize("recovered.11360", "Completed 1 step");
  }
  return elapsed ? localize("recovered.11363", "Completed {0} steps in {1}", stepCount, elapsed) : localize("recovered.11362", "Completed {0} steps", stepCount);
}
function getVisibleCompletedResponseItemCount(nodes) {
  let visibleItemCount = 0;
  for (const node of nodes) {
    if (isHTMLElement(node) && (node.hidden || node.style.display === "none")) {
      continue;
    }
    visibleItemCount++;
  }
  return visibleItemCount;
}
function reconcileChatItemHeight(normalizedHeight, currentRenderedHeight, isBeingRendered, allocatedHeight) {
  if (normalizedHeight === currentRenderedHeight) {
    return {
      nextRenderedHeight: currentRenderedHeight,
      kind: "none",
      height: normalizedHeight
    };
  }
  if (isBeingRendered) {
    return {
      nextRenderedHeight: currentRenderedHeight,
      kind: "deferReMeasure",
      height: normalizedHeight
    };
  }
  if (typeof currentRenderedHeight === "number") {
    return {
      nextRenderedHeight: normalizedHeight,
      kind: "fire",
      height: normalizedHeight
    };
  }
  if (!shouldScheduleInitialHeightChange(normalizedHeight, allocatedHeight)) {
    return {
      nextRenderedHeight: normalizedHeight,
      kind: "none",
      height: normalizedHeight
    };
  }
  return {
    nextRenderedHeight: normalizedHeight,
    kind: "scheduleInitial",
    height: normalizedHeight
  };
}
function renderChatResponseDetails(container3, details, completedAt, elapsedMs, verbose) {
  clearNode(container3);
  container3.classList.remove("chat-response-flip-active", "chat-response-flip-down", "chat-response-flip-reset");
  const completion = verbose ? formatChatRequestTimestamp(completedAt) : void 0;
  const elapsed = completion ? formatChatResponseElapsedTime(elapsedMs) : void 0;
  const alternate = completion?.isRelative ? formatChatResponseDetails(elapsed, completion.fullText) : elapsed;
  const responseDetails = formatChatResponseDetails(details, completion?.text);
  let completedAtElement;
  if (completion) {
    const timing = append(container3, $55("span.chat-response-timing"));
    completedAtElement = append(timing, $55("time.chat-response-completed-at", {
      datetime: completion.dateTime
    }, completion.text));
    if (alternate) {
      append(timing, $55("span.chat-response-alternate", void 0, alternate));
    }
    timing.classList.toggle("has-alternate", !!alternate);
  }
  if (completion && details) {
    append(container3, $55("span.chat-response-details-separator", {
      "aria-hidden": "true"
    }, "\u2022"));
  }
  if (details) {
    append(container3, $55("span.chat-response-model-details", void 0, details));
  }
  const accessibleTiming = completion ? localize("recovered.11366", "Completed {0}", completion.fullText) : void 0;
  const accessibleElapsed = elapsed ? localize("recovered.11367", "Elapsed time {0}", elapsed) : void 0;
  container3.ariaLabel = [accessibleTiming, accessibleElapsed, details].filter(Boolean).join(", ");
  container3.classList.toggle("hidden", !responseDetails);
  container3.tabIndex = responseDetails ? 0 : -1;
  return completedAtElement;
}
function renderChatRequestTimestamp(container3, timestamp) {
  const formatted = formatChatRequestTimestamp(timestamp);
  if (!formatted) {
    return void 0;
  }
  if (!formatted.isRelative) {
    const element2 = append(container3, $55("time.chat-request-timestamp", {
      datetime: formatted.dateTime,
      "aria-label": localize("recovered.11365", "Sent {0}", formatted.fullText),
      tabindex: 0
    }, formatted.text));
    return {
      element: element2,
      hoverText: formatted.fullText
    };
  }
  const element = append(container3, $55("span.chat-request-timestamp", {
    "aria-label": localize("recovered.11365", "Sent {0}", formatted.fullText),
    tabindex: 0
  }));
  const timing = append(element, $55("span.chat-request-timing.has-alternate"));
  append(timing, $55("time.chat-request-relative", {
    datetime: formatted.dateTime
  }, formatted.text));
  append(timing, $55("time.chat-request-full-date", {
    datetime: formatted.dateTime
  }, formatted.fullText));
  return {
    element
  };
}
function shouldRenderInitialProgressiveContentImmediately(isComplete, hasMarkdownParts, hasRenderData) {
  return !isComplete && hasMarkdownParts && !hasRenderData;
}
function shouldStartNewCollapsedThinkingGroup(displayMode, existingGroup, incomingGroup) {
  return displayMode === "collapsed" /* Collapsed */ && existingGroup !== incomingGroup;
}
function shouldCreateGroupedThinkingPart(collapsedToolsMode, separatedFromReasoning) {
  return collapsedToolsMode === "always" /* Always */ || separatedFromReasoning;
}
function shouldShowFileChangesSummaryForSettings(isComplete, isLocalSession, showFileChanges) {
  return isComplete && isLocalSession && showFileChanges;
}
function shouldShowPillsSummaryForSettings(isComplete, isAgentHostSession2, turnStatusPills) {
  return isComplete && isAgentHostSession2 && isChatTurnStatusPillsEnabled(turnStatusPills);
}
function shouldPinToolInvocationToThinking(state, hasConfirmationMessages, hasMcpAppData) {
  return !hasMcpAppData && state !== IChatToolInvocation.StateKind.WaitingForConfirmation && state !== IChatToolInvocation.StateKind.WaitingForPostApproval && state !== IChatToolInvocation.StateKind.WaitingForAuthentication && !hasConfirmationMessages;
}
function toolInvocationHasMcpAppData(toolInvocation) {
  return toolInvocation.toolSpecificData?.kind === "input" && !!toolInvocation.toolSpecificData.mcpAppData;
}
var forceVerboseLayoutTracing = false;
var mostRecentResponseClassName = "chat-most-recent-response";
function shouldHideChatUserIdentity(username, sessionResource, isResponse, isSessionsWindow, isSystemInitiatedRequest) {
  const sessionType = getChatSessionType(sessionResource);
  return username === COPILOT_USERNAME || isResponse && isAgentHostCopilotSessionType(sessionType) || isSessionsWindow || isSystemInitiatedRequest;
}
function isAgentHostCopilotSessionType(sessionType) {
  return sessionType === AgentSessionProviders.AgentHostCopilot || parseRemoteAgentHostSessionTypeAuthority(sessionType, SessionType.CopilotCLI) !== void 0;
}
function upvoteAnimationSettingToEnum(value2) {
  switch (value2) {
    case "confetti":
      return 1 /* Confetti */;
    case "floatingThumbs":
      return 2 /* FloatingIcons */;
    case "pulseWave":
      return 3 /* PulseWave */;
    case "radiantLines":
      return 4 /* RadiantLines */;
    default:
      return void 0;
  }
}
var ChatListItemRenderer = class extends Disposable {
  constructor(editorOptions2, rendererOptions, delegate, overflowWidgetsDomNode, viewModel, instantiationService, configService, logService, contextKeyService, themeService, commandService, hoverService, chatWidgetService, chatEntitlementService, chatService, chatBranchService, accessibilitySignalService, accessibilityService, environmentService, telemetryService) {
    super();
    this.rendererOptions = rendererOptions;
    this.delegate = delegate;
    this.viewModel = viewModel;
    this.instantiationService = instantiationService;
    this.configService = configService;
    this.logService = logService;
    this.contextKeyService = contextKeyService;
    this.themeService = themeService;
    this.commandService = commandService;
    this.hoverService = hoverService;
    this.chatWidgetService = chatWidgetService;
    this.chatEntitlementService = chatEntitlementService;
    this.chatService = chatService;
    this.chatBranchService = chatBranchService;
    this.accessibilitySignalService = accessibilitySignalService;
    this.accessibilityService = accessibilityService;
    this.environmentService = environmentService;
    this.telemetryService = telemetryService;
    this.codeBlocksByResponseId = /* @__PURE__ */new Map();
    this.codeBlocksByEditorUri = new ResourceMap();
    this.fileTreesByResponseId = /* @__PURE__ */new Map();
    this.focusedFileTreesByResponseId = /* @__PURE__ */new Map();
    this.templateDataByRequestId = /* @__PURE__ */new Map();
    this.responseTemplateDataByRequestId = /* @__PURE__ */new Map();
    this.templateDataByRow = /* @__PURE__ */new WeakMap();
    /** Track pending question carousels by session resource for auto-skip on chat submission */
    this.pendingQuestionCarousels = new ResourceMap();
    this._notifiedQuestionCarousels = /* @__PURE__ */new Set();
    this.workingProgressConfirmationEndListeners = /* @__PURE__ */new WeakSet();
    this._onDidClickFollowup = this._register(new Emitter());
    this.onDidClickFollowup = this._onDidClickFollowup.event;
    this._onDidClickRerunWithAgentOrCommandDetection = this._register(new Emitter());
    this.onDidClickRerunWithAgentOrCommandDetection = this._onDidClickRerunWithAgentOrCommandDetection.event;
    this._onDidClickRequest = this._register(new Emitter());
    this.onDidClickRequest = this._onDidClickRequest.event;
    this._onDidRerender = this._register(new Emitter());
    this.onDidRerender = this._onDidRerender.event;
    this._onDidDispose = this._register(new Emitter());
    this.onDidDispose = this._onDidDispose.event;
    this._onDidFocusOutside = this._register(new Emitter());
    this.onDidFocusOutside = this._onDidFocusOutside.event;
    this._onDidChangeItemHeight = this._register(new Emitter());
    this.onDidChangeItemHeight = this._onDidChangeItemHeight.event;
    this._onDidUpdateViewModel = this._register(new Emitter());
    this._currentLayoutWidth = observableValue(this, 0);
    this._isVisible = true;
    this._onDidChangeVisibility = this._register(new Emitter());
    /** Whether we have already logged the incremental-rendering telemetry event for this renderer instance. */
    this._incrementalRenderingTelemetryLogged = false;
    /**
     * Prevents re-announcement of already rendered chat progress
     * by screen readers
     */
    this._announcedToolProgressKeys = /* @__PURE__ */new Set();
    this.chatContentMarkdownRenderer = this.instantiationService.createInstance(ChatContentMarkdownRenderer);
    this.markdownDecorationsRenderer = this.instantiationService.createInstance(ChatMarkdownDecorationsRenderer);
    this._editorPool = this._register(this.instantiationService.createInstance(EditorPool, editorOptions2, delegate, overflowWidgetsDomNode, true));
    this._toolEditorPool = this._register(this.instantiationService.createInstance(EditorPool, editorOptions2, delegate, overflowWidgetsDomNode, true));
    this._diffEditorPool = this._register(this.instantiationService.createInstance(DiffEditorPool, editorOptions2, delegate, overflowWidgetsDomNode, true));
    this._treePool = this._register(this.instantiationService.createInstance(TreePool, this._onDidChangeVisibility.event));
    this._contentReferencesListPool = this._register(this.instantiationService.createInstance(CollapsibleListPool, this._onDidChangeVisibility.event, void 0, void 0));
    this._inlineTextModels = this._register(this.instantiationService.createInstance(InlineTextModelCollection));
    this._register(this.instantiationService.createInstance(ChatCodeBlockContentProvider));
    this._register(this.chatService.onDidSubmitRequest(e => {
      const carousels = this.pendingQuestionCarousels.get(e.chatSessionResource);
      if (carousels) {
        for (const carousel of carousels) {
          carousel.skip();
        }
        carousels.clear();
      }
    }));
    this._register(this.configService.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration("chat.autoReply" /* AutoReply */) && this.configService.getValue("chat.autoReply" /* AutoReply */)) {
        for (const [, carousels] of this.pendingQuestionCarousels) {
          for (const carousel of carousels) {
            carousel.skip();
          }
          carousels.clear();
        }
      }
    }));
  }
  static {
    this.ID = "item";
  }
  set pendingDragController(controller) {
    this._pendingDragController = controller;
  }
  updateOptions(options3) {
    this.rendererOptions = {
      ...this.rendererOptions,
      ...options3
    };
  }
  get templateId() {
    return ChatListItemRenderer.ID;
  }
  editorsInUse() {
    return Iterable.concat(this._editorPool.inUse(), this._toolEditorPool.inUse());
  }
  traceLayout(method, message) {
    if (forceVerboseLayoutTracing) {
      this.logService.info(`ChatListItemRenderer#${method}: ${message}`);
    } else {
      this.logService.trace(`ChatListItemRenderer#${method}: ${message}`);
    }
  }
  fireItemHeightChange(template2, measuredHeight) {
    if (!template2.currentElement || !template2.rowContainer.isConnected) {
      return;
    }
    const height = measuredHeight ?? template2.rowContainer.getBoundingClientRect().height;
    if (height === 0 || !height) {
      return;
    }
    const normalizedHeight = Math.ceil(height);
    const element = template2.currentElement;
    const update = reconcileChatItemHeight(normalizedHeight, element.currentRenderedHeight, element === this._elementBeingRendered, template2.allocatedHeight);
    element.currentRenderedHeight = update.nextRenderedHeight;
    if (update.kind === "fire") {
      this._onDidChangeItemHeight.fire({
        element,
        height: update.height
      });
    } else if (update.kind === "scheduleInitial") {
      const scheduledHeight = update.height;
      scheduleAtNextAnimationFrame(getWindow(template2.rowContainer), () => {
        if (template2.currentElement !== element || element.currentRenderedHeight !== scheduledHeight) {
          return;
        }
        this._onDidChangeItemHeight.fire({
          element,
          height: scheduledHeight
        });
      });
    } else if (update.kind === "deferReMeasure") {
      scheduleAtNextAnimationFrame(getWindow(template2.rowContainer), () => {
        if (template2.currentElement === element && element !== this._elementBeingRendered) {
          this.fireItemHeightChange(template2);
        }
      });
    }
  }
  /**
   * Compute a rate to render at in words/s.
   */
  getProgressiveRenderRate(element) {
    let Rate;
    (Rate2 => {
      Rate2[Rate2["Min"] = 40] = "Min";
      Rate2[Rate2["Max"] = 2e3] = "Max";
    })(Rate || (Rate = {}));
    const minAfterComplete = 80;
    const rate = element.contentUpdateTimings?.impliedWordLoadRate;
    if (element.isComplete) {
      if (typeof rate === "number") {
        return clamp(rate, minAfterComplete, 2e3 /* Max */);
      } else {
        return minAfterComplete;
      }
    }
    if (typeof rate === "number") {
      return clamp(rate, 40 /* Min */, 2e3 /* Max */);
    }
    return 8;
  }
  getCodeBlockInfosForResponse(response) {
    const codeBlocks = this.codeBlocksByResponseId.get(response.id);
    return codeBlocks ?? [];
  }
  updateViewModel(viewModel) {
    this.viewModel = viewModel;
    this._announcedToolProgressKeys.clear();
    this._notifiedQuestionCarousels.clear();
    this.codeBlocksByEditorUri.clear();
    this.codeBlocksByResponseId.clear();
    this.fileTreesByResponseId.clear();
    this.focusedFileTreesByResponseId.clear();
    this.responseTemplateDataByRequestId.clear();
    this.templateDataByRequestId.clear();
    this._onDidUpdateViewModel.fire();
    this._editorPool.clear();
    this._toolEditorPool.clear();
    this._diffEditorPool.clear();
    this._treePool.clear();
    this._contentReferencesListPool.clear();
  }
  getCodeBlockInfoForEditor(uri5) {
    return this.codeBlocksByEditorUri.get(uri5);
  }
  getFileTreeInfosForResponse(response) {
    const fileTrees = this.fileTreesByResponseId.get(response.id);
    return fileTrees ?? [];
  }
  getLastFocusedFileTreeForResponse(response) {
    const fileTrees = this.fileTreesByResponseId.get(response.id);
    const lastFocusedFileTreeIndex = this.focusedFileTreesByResponseId.get(response.id);
    if (fileTrees?.length && lastFocusedFileTreeIndex !== void 0 && lastFocusedFileTreeIndex < fileTrees.length) {
      return fileTrees[lastFocusedFileTreeIndex];
    }
    return void 0;
  }
  getTemplateDataForRequestId(requestId) {
    if (!requestId) {
      return void 0;
    }
    const templateData = this.templateDataByRequestId.get(requestId);
    if (templateData && templateData.currentElement?.id === requestId) {
      return templateData;
    }
    if (templateData) {
      this.templateDataByRequestId.delete(requestId);
    }
    return void 0;
  }
  setVisible(visible) {
    this._isVisible = visible;
    this._onDidChangeVisibility.fire(visible);
  }
  layout(width2) {
    const newWidth = width2 - (this.rendererOptions.contentHorizontalPadding ?? DEFAULT_CHAT_ITEM_HORIZONTAL_PADDING);
    if (newWidth !== this._currentLayoutWidth.get()) {
      this._currentLayoutWidth.set(newWidth, void 0);
      for (const editor of this._editorPool.inUse()) {
        editor.layout(newWidth);
      }
      for (const toolEditor of this._toolEditorPool.inUse()) {
        toolEditor.layout(newWidth);
      }
      for (const diffEditor of this._diffEditorPool.inUse()) {
        diffEditor.layout(newWidth);
      }
    }
  }
  /**
   * Returns the currently rendered chat item containing the node.
   */
  getElementFromNode(node) {
    let current = node;
    while (current && this.delegate.container.contains(current)) {
      const element = this.templateDataByRow.get(current)?.currentElement;
      if (element) {
        return element;
      }
      current = current.parentElement;
    }
    return void 0;
  }
  renderTemplate(container3) {
    const templateDisposables = new DisposableStore();
    const disabledOverlay = append(container3, $55(".chat-row-disabled-overlay"));
    const rowContainer = append(container3, $55(".interactive-item-container"));
    if (this.rendererOptions.renderStyle === "compact") {
      rowContainer.classList.add("interactive-item-compact");
    }
    let headerParent = rowContainer;
    let valueParent = rowContainer;
    let detailContainerParent;
    if (this.rendererOptions.renderStyle === "minimal") {
      rowContainer.classList.add("interactive-item-compact");
      rowContainer.classList.add("minimal");
      const lhsContainer = append(rowContainer, $55(".column.left"));
      const rhsContainer = append(rowContainer, $55(".column.right"));
      headerParent = lhsContainer;
      detailContainerParent = rhsContainer;
      valueParent = rhsContainer;
    }
    const header2 = append(headerParent, $55(".header"));
    const contextKeyService = templateDisposables.add(this.contextKeyService.createScoped(rowContainer));
    const scopedInstantiationService = templateDisposables.add(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, contextKeyService])));
    const requestHover = append(rowContainer, $55(".request-hover"));
    let titleToolbar;
    if (this.rendererOptions.noHeader) {
      header2.classList.add("hidden");
    } else {
      titleToolbar = templateDisposables.add(scopedInstantiationService.createInstance(MenuWorkbenchToolBar, requestHover, MenuId.ChatMessageTitle, {
        menuOptions: {
          shouldForwardArgs: true
        },
        toolbarOptions: {
          shouldInlineSubmenu: submenu => submenu.actions.length <= 1
        }
      }));
    }
    this.hoverHidden(requestHover);
    const checkpointContainer = append(rowContainer, $55(".checkpoint-container"));
    append(checkpointContainer, $55(".checkpoint-line-left"));
    const checkpointToolbar = templateDisposables.add(scopedInstantiationService.createInstance(MenuWorkbenchToolBar, checkpointContainer, MenuId.ChatMessageCheckpoint, {
      actionViewItemProvider: (action, options3) => {
        if (action instanceof MenuItemAction) {
          if (action.item.id === RestoreCheckpointActionId) {
            return this.instantiationService.createInstance(ChatRestoreCheckpointActionViewItem, action, {
              hoverDelegate: options3.hoverDelegate
            }, context2 => this.checkpointRestoreNeedsConfirmation(context2));
          }
          if (action.item.id === ForkConversationActionId) {
            return this.instantiationService.createInstance(ChatForkActionViewItem, action, {
              hoverDelegate: options3.hoverDelegate
            });
          }
          return this.instantiationService.createInstance(CodiconActionViewItem, action, {
            hoverDelegate: options3.hoverDelegate
          });
        }
        return void 0;
      },
      renderDropdownAsChildElement: true,
      menuOptions: {
        shouldForwardArgs: true
      },
      toolbarOptions: {
        shouldInlineSubmenu: submenu => submenu.actions.length <= 1
      }
    }));
    append(checkpointContainer, $55(".checkpoint-line-right"));
    const user = append(header2, $55(".user"));
    const avatarContainer = append(user, $55(".avatar-container"));
    const username = append(user, $55("h3.username"));
    username.tabIndex = 0;
    const detailContainer = append(detailContainerParent ?? user, $55("span.detail-container"));
    const detail2 = append(detailContainer, $55("span.detail"));
    append(detailContainer, $55("span.chat-animated-ellipsis"));
    const value2 = append(valueParent, $55(".value"));
    const elementDisposables = templateDisposables.add(new DisposableStore());
    const completedResponseDisclosureDisposables = templateDisposables.add(new DisposableStore());
    const footerToolbarContainer = append(rowContainer, $55(".chat-footer-toolbar"));
    if (this.rendererOptions.noFooter) {
      footerToolbarContainer.classList.add("hidden");
    }
    const footerToolbar = templateDisposables.add(scopedInstantiationService.createInstance(MenuWorkbenchToolBar, footerToolbarContainer, MenuId.ChatMessageFooter, {
      menuOptions: {
        shouldForwardArgs: true,
        renderShortTitle: true
      },
      toolbarOptions: {
        shouldInlineSubmenu: submenu => submenu.actions.length <= 1
      },
      actionViewItemProvider: (action, options3) => {
        if (action instanceof MenuItemAction && action.item.id === MarkHelpfulActionId) {
          const animation = upvoteAnimationSettingToEnum(this.configService.getValue("chat.upvoteAnimation"));
          return scopedInstantiationService.createInstance(MenuEntryActionViewItem, action, {
            ...options3,
            onClickAnimation: animation
          });
        }
        return createActionViewItem(scopedInstantiationService, action, options3);
      }
    }));
    const footerDetailsContainer = append(footerToolbar.getElement(), $55(".chat-footer-details"));
    footerDetailsContainer.tabIndex = 0;
    const checkpointRestoreContainer = append(rowContainer, $55(".checkpoint-restore-container"));
    append(checkpointRestoreContainer, $55(".checkpoint-line-left"));
    const label3 = append(checkpointRestoreContainer, $55("span.checkpoint-label-text"));
    label3.textContent = localize("recovered.11368", "Checkpoint Restored");
    const dot = append(checkpointRestoreContainer, $55("span.checkpoint-dot-separator"));
    dot.textContent = "\xB7";
    dot.setAttribute("aria-hidden", "true");
    const checkpointRestoreToolbar = templateDisposables.add(scopedInstantiationService.createInstance(MenuWorkbenchToolBar, checkpointRestoreContainer, MenuId.ChatMessageRestoreCheckpoint, {
      actionViewItemProvider: (action, options3) => {
        if (action instanceof MenuItemAction) {
          return this.instantiationService.createInstance(CodiconActionViewItem, action, {
            hoverDelegate: options3.hoverDelegate
          });
        }
        return void 0;
      },
      renderDropdownAsChildElement: true,
      menuOptions: {
        shouldForwardArgs: true
      },
      toolbarOptions: {
        shouldInlineSubmenu: submenu => submenu.actions.length <= 1
      }
    }));
    append(checkpointRestoreContainer, $55(".checkpoint-line-right"));
    const agentHover = templateDisposables.add(this.instantiationService.createInstance(ChatAgentHover));
    const hoverContent2 = () => {
      if (isResponseVM(template2.currentElement) && template2.currentElement.agent && !template2.currentElement.agent.isDefault) {
        agentHover.setAgent(template2.currentElement.agent.id);
        return agentHover.domNode;
      }
      return void 0;
    };
    const hoverOptions = getChatAgentHoverOptions(() => isResponseVM(template2.currentElement) ? template2.currentElement.agent : void 0, this.commandService);
    templateDisposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate("element"), user, hoverContent2, hoverOptions));
    templateDisposables.add(addDisposableListener(user, EventType.KEY_DOWN, e => {
      const ev = new StandardKeyboardEvent(e);
      if (ev.equals(10 /* Space */) || ev.equals(3 /* Enter */)) {
        const content2 = hoverContent2();
        if (content2) {
          this.hoverService.showInstantHover({
            content: content2,
            target: user,
            trapFocus: true,
            actions: hoverOptions.actions
          }, true);
        }
      } else if (ev.equals(9 /* Escape */)) {
        this.hoverService.hideHover();
      }
    }));
    const connectionObserver = document.createElement("connection-observer");
    append(container3, connectionObserver);
    const template2 = {
      header: header2,
      avatarContainer,
      requestHover,
      username,
      detail: detail2,
      value: value2,
      rowContainer,
      elementDisposables,
      templateDisposables,
      contextKeyService,
      instantiationService: scopedInstantiationService,
      agentHover,
      titleToolbar,
      footerToolbar,
      footerToolbarContainer,
      footerDetailsContainer,
      disabledOverlay,
      checkpointToolbar,
      checkpointRestoreToolbar,
      checkpointContainer,
      checkpointRestoreContainer,
      completedResponseDisclosureDisposables
    };
    this.templateDataByRow.set(rowContainer, template2);
    templateDisposables.add(this._onDidUpdateViewModel.event(() => {
      if (!template2.currentElement || !this.viewModel?.sessionResource || !isEqual2(template2.currentElement.sessionResource, this.viewModel.sessionResource)) {
        this.clearRenderedParts(template2);
      }
    }));
    templateDisposables.add(addDisposableListener(disabledOverlay, EventType.CLICK, e => {
      if (!this.viewModel?.editing) {
        return;
      }
      const current = template2.currentElement;
      if (!current || current.id === this.viewModel.editing.id) {
        return;
      }
      if (disabledOverlay.classList.contains("disabled")) {
        e.preventDefault();
        e.stopPropagation();
        this._onDidFocusOutside.fire();
      }
    }));
    const resizeObserver = templateDisposables.add(new DisposableResizeObserver("ChatListItemRenderer.itemHeight", entries2 => {
      const entry = entries2[0];
      if (entry) {
        this.fireItemHeightChange(template2, entry.borderBoxSize.at(0)?.blockSize);
      }
    }));
    const resizeObservation = templateDisposables.add(new MutableDisposable());
    connectionObserver.onDidConnect = () => {
      resizeObservation.value = resizeObserver.observe(rowContainer);
    };
    connectionObserver.onDidDisconnect = () => {
      template2.renderedPartsMounted = false;
      resizeObservation.clear();
    };
    if (rowContainer.isConnected) {
      connectionObserver.onDidConnect();
    }
    return template2;
  }
  /**
   * Determines whether restoring to the checkpoint at the given chat item
   * would discard file edits that the user should confirm in-place. Used by
   * the "Restore Checkpoint" button to present an inline confirm/cancel
   * affordance for agent host sessions, which do not surface the modal
   * removal-confirmation dialog used by the standard editing session.
   */
  checkpointRestoreNeedsConfirmation(context2) {
    if (!isRequestVM(context2) && !isResponseVM(context2)) {
      return false;
    }
    const requestId = isRequestVM(context2) ? context2.id : context2.requestId;
    const model = this.chatService.getSession(context2.sessionResource);
    const session = model?.editingSession;
    if (!model || !(session instanceof AgentHostSnapshotController)) {
      return false;
    }
    const requests = model.getRequests();
    const index2 = requests.findIndex(request2 => request2.id === requestId);
    if (index2 === -1) {
      return false;
    }
    return requests.slice(index2).some(request2 => session.hasEditsInRequest(request2.id));
  }
  renderElement(node, index2, templateData, details) {
    templateData.allocatedHeight = details?.height;
    this._elementBeingRendered = node.element;
    try {
      this.renderChatTreeItem(node.element, index2, templateData);
    } finally {
      this._elementBeingRendered = void 0;
    }
  }
  /**
   * Renders the branch variant badge (模型 · 分支 i/N · 主线) into the response
   * footer details line. Called after `renderChatResponseDetails` so the badge
   * is re-created whenever the details line is refreshed.
   */
  renderShunCodeBranchVariantBadge(container3, rowInfo, isResponse) {
    if (!rowInfo || !isResponse || rowInfo.variantCount <= 1) {
      return;
    }
    const parts = [];
    if (rowInfo.modelId) {
      parts.push(rowInfo.modelId);
    }
    parts.push(rowInfo.variantKind === "merge" ? localize("recovered.11381", "\u5408\u5E76\u603B\u7ED3") : localize("recovered.11382", "\u5206\u652F {0}/{1}", rowInfo.variantIndex + 1, rowInfo.variantCount));
    if (rowInfo.isCanonical) {
      parts.push(localize("recovered.11380", "\u4E3B\u7EBF"));
    }
    if (container3.childElementCount > 0) {
      append(container3, $55("span.chat-response-details-separator", {
        "aria-hidden": "true"
      }, "\u2022"));
    }
    append(container3, $55("span.shuncode-branch-badge", void 0, parts.join(" \xB7 ")));
    container3.classList.remove("hidden");
  }
  /**
   * Dispose the rendered parts in the template, which aren't done in disposeElement
   * so they can be reused when a new render is started.
   */
  clearRenderedParts(templateData) {
    this.removeCompletedResponseDisclosure(templateData);
    if (templateData.renderedParts) {
      dispose(coalesce(templateData.renderedParts));
      templateData.renderedParts = void 0;
      templateData.renderedContent = void 0;
      clearNode(templateData.value);
    } else if (isPendingDividerVM(templateData.currentElement)) {
      clearNode(templateData.value);
    }
    templateData.movedOutToolParts?.dispose();
    templateData.movedOutToolParts = void 0;
    if (templateData.titleToolbar) {
      templateData.titleToolbar.context = void 0;
    }
    templateData.footerToolbar.context = void 0;
    templateData.checkpointToolbar.context = void 0;
    templateData.checkpointRestoreToolbar.context = void 0;
    templateData.currentElement = void 0;
    templateData.completedResponseDisclosureOpen = void 0;
    templateData.completedResponseStartIndex = void 0;
    templateData.wasResponseComplete = void 0;
  }
  renderChatTreeItem(element, index2, templateData) {
    if (templateData.currentElement && templateData.currentElement.id !== element.id) {
      this.traceLayout("renderChatTreeItem", `Rendering a different element into the template, index=${index2}`);
      const mappedTemplateData = this.templateDataByRequestId.get(templateData.currentElement.id);
      if (mappedTemplateData && mappedTemplateData.currentElement?.id !== templateData.currentElement.id) {
        this.templateDataByRequestId.delete(templateData.currentElement.id);
      }
      this.clearRenderedParts(templateData);
    }
    templateData.currentElement = element;
    this.templateDataByRequestId.set(element.id, templateData);
    templateData.rowContainer.classList.remove("pending-item", "pending-divider", "pending-request", "chat-pending-dragging", "terminal-command-request");
    templateData.dragHandle?.remove();
    templateData.dragHandle = void 0;
    delete templateData.rowContainer.dataset.pendingRequestId;
    delete templateData.rowContainer.dataset.pendingKind;
    if (isPendingDividerVM(element)) {
      this.renderPendingDivider(element, templateData);
      return;
    }
    const kind = isRequestVM(element) ? "request" : isResponseVM(element) ? "response" : isPendingDividerVM(element) ? "pendingDivider" : "welcome";
    this.traceLayout("renderElement", `${kind}, index=${index2}`);
    ChatContextKeys.isResponse.bindTo(templateData.contextKeyService).set(isResponseVM(element));
    ChatContextKeys.itemId.bindTo(templateData.contextKeyService).set(element.id);
    ChatContextKeys.isRequest.bindTo(templateData.contextKeyService).set(isRequestVM(element));
    ChatContextKeys.isFirstRequest.bindTo(templateData.contextKeyService).set(isRequestVM(element) && this.viewModel?.model.getRequests()[0]?.id === element.id);
    ChatContextKeys.isPendingRequest.bindTo(templateData.contextKeyService).set(isRequestVM(element) && !!element.pendingKind);
    ChatContextKeys.responseDetectedAgentCommand.bindTo(templateData.contextKeyService).set(isResponseVM(element) && element.agentOrSlashCommandDetected);
    const shunCodeBranchRowInfo = this.viewModel ? this.chatBranchService.getRowInfo(this.viewModel.sessionResource, element.id) : void 0;
    ChatContextKeys.shunCodeBranchVariant.bindTo(templateData.contextKeyService).set(!!shunCodeBranchRowInfo);
    ChatContextKeys.shunCodeBranchCanMerge.bindTo(templateData.contextKeyService).set(shunCodeBranchRowInfo?.canMerge ?? false);
    ChatContextKeys.shunCodeBranchCanAdopt.bindTo(templateData.contextKeyService).set(shunCodeBranchRowInfo?.canAdopt ?? false);
    ChatContextKeys.shunCodeBranchCanDelete.bindTo(templateData.contextKeyService).set(shunCodeBranchRowInfo?.canDelete ?? false);
    ChatContextKeys.shunCodeBranchHasPrev.bindTo(templateData.contextKeyService).set(shunCodeBranchRowInfo?.hasPrev ?? false);
    ChatContextKeys.shunCodeBranchHasNext.bindTo(templateData.contextKeyService).set(shunCodeBranchRowInfo?.hasNext ?? false);
    if (isResponseVM(element)) {
      ChatContextKeys.responseSupportsIssueReporting.bindTo(templateData.contextKeyService).set(!!element.agent?.metadata.supportIssueReporting);
      ChatContextKeys.responseVote.bindTo(templateData.contextKeyService).set(element.vote === 1 /* Up */ ? "up" : element.vote === 0 /* Down */ ? "down" : "");
    } else {
      ChatContextKeys.responseVote.bindTo(templateData.contextKeyService).set("");
    }
    if (templateData.titleToolbar) {
      templateData.titleToolbar.context = element;
    }
    templateData.footerToolbar.context = element;
    const responseTimingListeners = templateData.elementDisposables.add(new MutableDisposable());
    const updateResponseDetails = () => {
      const details = isResponseVM(element) ? element.result?.details : void 0;
      const completedAtElement = renderChatResponseDetails(templateData.footerDetailsContainer, details, isResponseVM(element) ? element.model.completionTimestamp : void 0, isResponseVM(element) ? element.model.elapsedMs : void 0, isResponseVM(element) && this.configService.getValue("chat.verbose" /* Verbose */));
      this.renderShunCodeBranchVariantBadge(templateData.footerDetailsContainer, shunCodeBranchRowInfo, isResponseVM(element));
      if (!completedAtElement) {
        responseTimingListeners.clear();
        return;
      }
      const listeners = new DisposableStore();
      responseTimingListeners.value = listeners;
      let responseTimingBounds;
      listeners.add(addDisposableListener(completedAtElement, EventType.MOUSE_ENTER, e => {
        const bounds = completedAtElement.getBoundingClientRect();
        responseTimingBounds = bounds;
        templateData.footerDetailsContainer.classList.add("chat-response-flip-reset");
        templateData.footerDetailsContainer.classList.remove("chat-response-flip-active");
        templateData.footerDetailsContainer.classList.toggle("chat-response-flip-down", e.clientY < bounds.top + bounds.height / 2);
        void templateData.footerDetailsContainer.offsetWidth;
        templateData.footerDetailsContainer.classList.remove("chat-response-flip-reset");
        void templateData.footerDetailsContainer.offsetWidth;
        templateData.footerDetailsContainer.classList.add("chat-response-flip-active");
      }));
      listeners.add(addDisposableListener(templateData.footerDetailsContainer, EventType.MOUSE_MOVE, e => {
        if (responseTimingBounds && (e.clientX < responseTimingBounds.left || e.clientX > responseTimingBounds.right || e.clientY < responseTimingBounds.top || e.clientY > responseTimingBounds.bottom)) {
          responseTimingBounds = void 0;
          templateData.footerDetailsContainer.classList.remove("chat-response-flip-active");
        }
      }));
      listeners.add(addDisposableListener(templateData.footerDetailsContainer, EventType.MOUSE_LEAVE, () => {
        responseTimingBounds = void 0;
        templateData.footerDetailsContainer.classList.remove("chat-response-flip-active");
      }));
      listeners.add(addDisposableListener(templateData.footerDetailsContainer, EventType.FOCUS, () => {
        templateData.footerDetailsContainer.classList.remove("chat-response-flip-active", "chat-response-flip-down");
      }));
    };
    updateResponseDetails();
    ChatContextKeys.responseHasError.bindTo(templateData.contextKeyService).set(isResponseVM(element) && !!element.errorDetails);
    const isFiltered = !!(isResponseVM(element) && element.errorDetails?.responseIsFiltered);
    ChatContextKeys.responseIsFiltered.bindTo(templateData.contextKeyService).set(isFiltered);
    const location2 = this.chatWidgetService.getWidgetBySessionResource(element.sessionResource)?.location;
    templateData.rowContainer.classList.toggle("editing-session", location2 === "panel" /* Chat */);
    templateData.rowContainer.classList.toggle("interactive-request", isRequestVM(element));
    templateData.rowContainer.classList.toggle("interactive-response", isResponseVM(element));
    const progressMessageAtBottomOfResponse = checkModeOption(this.delegate.currentChatMode(), this.rendererOptions.progressMessageAtBottomOfResponse);
    templateData.rowContainer.classList.toggle("show-detail-progress", isResponseVM(element) && !element.isComplete && !element.progressMessages.length && !progressMessageAtBottomOfResponse);
    templateData.rowContainer.classList.toggle("chat-progress-reservable", isResponseVM(element) && !element.isComplete && !!progressMessageAtBottomOfResponse);
    const updateContainerCheckmarks = () => templateData.rowContainer.classList.toggle("show-checkmarks", !!this.configService.getValue("accessibility.chat.showCheckmarks" /* ShowChatCheckmarks */));
    updateContainerCheckmarks();
    const updateVerboseDetails = () => templateData.rowContainer.classList.toggle("show-verbose-details", !!this.configService.getValue("chat.verbose" /* Verbose */));
    updateVerboseDetails();
    templateData.elementDisposables.add(this.configService.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration("accessibility.chat.showCheckmarks" /* ShowChatCheckmarks */)) {
        updateContainerCheckmarks();
      }
      if (e.affectsConfiguration("chat.verbose" /* Verbose */)) {
        updateVerboseDetails();
        updateResponseDetails();
      }
      if (e.affectsConfiguration("chat.agent.collapseCompletedResponses" /* CollapseCompletedResponses */) && isResponseVM(element)) {
        this.updateCompletedResponseDisclosure(element, templateData.renderedContent ?? [], templateData, false);
      }
    }));
    if (!this.rendererOptions.noHeader) {
      this.renderAvatar(element, templateData);
    }
    const isSystemInitiatedRequest = isRequestVM(element) && !!element.isSystemInitiated;
    templateData.username.textContent = element.username;
    const hideChatUserIdentity = shouldHideChatUserIdentity(element.username, element.sessionResource, isResponseVM(element), this.environmentService.isSessionsWindow, isSystemInitiatedRequest);
    templateData.username.classList.toggle("hidden", hideChatUserIdentity);
    templateData.avatarContainer.classList.toggle("hidden", hideChatUserIdentity);
    this.hoverHidden(templateData.requestHover);
    clearNode(templateData.detail);
    if (isResponseVM(element)) {
      this.renderDetail(element, templateData);
    }
    templateData.checkpointToolbar.context = element;
    const supportsForkOrRestoration = this.rendererOptions.supportsFork || (this.rendererOptions.restorable ?? true);
    const checkpointEnabled = this.configService.getValue("chat.checkpoints.enabled" /* CheckpointsEnabled */) && supportsForkOrRestoration;
    const isPendingRequest = isRequestVM(element) && !!element.pendingKind;
    templateData.checkpointContainer.classList.toggle("hidden", isResponseVM(element) || isPendingRequest || isSystemInitiatedRequest || !checkpointEnabled);
    templateData.footerToolbar.refresh();
    templateData.checkpointToolbar.refresh();
    templateData.checkpointRestoreToolbar.refresh();
    if (isResponseVM(element)) {
      this.responseTemplateDataByRequestId.set(element.requestId, templateData);
      templateData.elementDisposables.add(toDisposable(() => this.responseTemplateDataByRequestId.delete(element.requestId)));
    }
    if (!isPendingRequest) {
      const setGroupHover = hovered => {
        const requestId = isRequestVM(element) ? element.id : isResponseVM(element) ? element.requestId : void 0;
        if (!requestId) {
          return;
        }
        const reqData = this.templateDataByRequestId.get(requestId);
        const resData = this.responseTemplateDataByRequestId.get(requestId);
        reqData?.rowContainer.classList.toggle("group-hovered", hovered);
        reqData?.checkpointContainer.classList.toggle("group-hovered", hovered);
        resData?.rowContainer.classList.toggle("group-hovered", hovered);
      };
      const hoverTargets = isResponseVM(element) ? [templateData.value, templateData.footerToolbarContainer] : [templateData.rowContainer];
      const isHoverTarget = target => isHTMLElement(target) && hoverTargets.some(hoverTarget => hoverTarget.contains(target));
      for (const hoverTarget of hoverTargets) {
        templateData.elementDisposables.add(addDisposableListener(hoverTarget, EventType.MOUSE_ENTER, () => setGroupHover(true)));
        templateData.elementDisposables.add(addDisposableListener(hoverTarget, EventType.MOUSE_LEAVE, e => {
          if (!isHoverTarget(e.relatedTarget)) {
            setGroupHover(false);
          }
        }));
      }
      templateData.elementDisposables.add(toDisposable(() => setGroupHover(false)));
    }
    const shouldShowRestore = this.viewModel?.model.checkpoint && !this.viewModel?.editing && index2 === this.delegate.getListLength() - 1 && !isPendingRequest;
    templateData.checkpointRestoreContainer.classList.toggle("hidden", !(shouldShowRestore && checkpointEnabled));
    const editing = element.id === this.viewModel?.editing?.id;
    const isInput = this.configService.getValue("chat.editRequests") === "input";
    templateData.elementDisposables.add(autorun(r2 => {
      const shouldBeBlocked = element.shouldBeBlocked.read(r2);
      templateData.disabledOverlay.classList.toggle("disabled", shouldBeBlocked && !editing && this.viewModel?.editing !== void 0);
    }));
    templateData.rowContainer.classList.toggle("editing", editing && !isInput);
    templateData.rowContainer.classList.toggle("editing-input", editing && isInput);
    templateData.requestHover.classList.toggle("editing", editing && isInput);
    templateData.requestHover.classList.toggle("hidden", !!this.viewModel?.editing && !editing || isResponseVM(element) || !this.rendererOptions.editable || isSystemInitiatedRequest);
    templateData.requestHover.classList.toggle("expanded", this.configService.getValue("chat.editRequests") === "hover");
    templateData.requestHover.classList.toggle("checkpoints-enabled", checkpointEnabled);
    templateData.elementDisposables.add(addStandardDisposableListener(templateData.rowContainer, EventType.CLICK, e => {
      const current = templateData.currentElement;
      if (current && this.viewModel?.editing && current.id !== this.viewModel.editing.id) {
        e.stopPropagation();
        e.preventDefault();
        this._onDidFocusOutside.fire();
      }
    }));
    const rowRoot = templateData.rowContainer.parentElement?.parentElement?.parentElement;
    rowRoot?.classList.toggle("request", isRequestVM(element));
    rowRoot?.classList.toggle("response", isResponseVM(element));
    templateData.rowContainer.classList.toggle(mostRecentResponseClassName, index2 === this.delegate.getListLength() - 1);
    templateData.rowContainer.classList.toggle("confirmation-message", isRequestVM(element) && !!element.confirmation);
    const isStickyScrollTargetItem = getStickyScrollTargetItem(this.viewModel?.getItems() ?? []) === element;
    const shouldShowHeader = isResponseVM(element) && !this.rendererOptions.noHeader && !isSystemInitiatedRequest;
    templateData.header?.classList.toggle("header-disabled", !shouldShowHeader);
    if (isRequestVM(element) && element.confirmation) {
      this.renderConfirmationAction(element, templateData);
    }
    const incrementalRendering = this.configService.getValue("chat.experimental.incrementalRendering.enabled" /* IncrementalRendering */);
    if (isResponseVM(element) && isStickyScrollTargetItem && (!element.isComplete || element.renderData)) {
      this.traceLayout("renderElement", `start progressive render, index=${index2}`);
      if (incrementalRendering && !element.renderData) {
        this.logIncrementalRenderingTelemetry();
        this.doIncrementalRender(element, index2, templateData);
      } else {
        const timer = templateData.elementDisposables.add(new WindowIntervalTimer());
        const runProgressiveRender = initial => {
          try {
            if (this.doNextProgressiveRender(element, index2, templateData, !!initial)) {
              timer.cancel();
            }
          } catch (err) {
            timer.cancel();
            this.logService.error(err);
          }
        };
        timer.cancelAndSet(runProgressiveRender, 50, getWindow(templateData.rowContainer));
        runProgressiveRender(true);
      }
    } else {
      if (isResponseVM(element)) {
        if (incrementalRendering) {
          const rate = this.getProgressiveRenderRate(element);
          this._updateMorpherRate(templateData, rate, true);
        }
        this.renderChatResponseBasic(element, index2, templateData);
      } else if (isRequestVM(element)) {
        this.renderChatRequest(element, index2, templateData);
      }
    }
    templateData.renderedPartsMounted = true;
  }
  renderPendingDivider(element, templateData) {
    templateData.rowContainer.classList.add("pending-item");
    templateData.rowContainer.classList.add("pending-divider");
    templateData.rowContainer.classList.remove("interactive-request", "interactive-response", "pending-request");
    templateData.avatarContainer.classList.add("hidden");
    templateData.username.classList.add("hidden");
    templateData.requestHover.classList.add("hidden");
    templateData.checkpointContainer.classList.add("hidden");
    templateData.checkpointRestoreContainer.classList.add("hidden");
    templateData.footerToolbar.getElement().classList.add("hidden");
    if (templateData.titleToolbar) {
      templateData.titleToolbar.getElement().classList.add("hidden");
    }
    clearNode(templateData.value);
    clearNode(templateData.detail);
    const dividerContent = $(".pending-divider-content");
    const label3 = append(dividerContent, $("span.pending-divider-label"));
    if (element.dividerKind === "steering" /* Steering */) {
      if (element.isSystemInitiated) {
        label3.textContent = localize("recovered.11385", "System Notification");
        label3.title = localize("recovered.11386", "System notification will be sent after the next tool call happens");
      } else {
        label3.textContent = localize("recovered.11383", "Steering");
        label3.title = localize("recovered.11384", "Steering message will be sent after the next tool call happens");
      }
    } else {
      label3.textContent = localize("recovered.11376", "Queued");
      label3.title = localize("recovered.11377", "Queued messages will be sent after the current request completes");
    }
    templateData.value.appendChild(dividerContent);
  }
  renderDetail(element, templateData) {
    clearNode(templateData.detail);
    if (element.agentOrSlashCommandDetected) {
      const msg = element.slashCommand ? localize("recovered.11388", "used {0} [[(rerun without)]]", `${chatSubcommandLeader}${element.slashCommand.name}`) : localize("recovered.11387", "[[(rerun without)]]");
      reset(templateData.detail, renderFormattedText(msg, {
        actionHandler: {
          disposables: templateData.elementDisposables,
          callback: content2 => {
            this._onDidClickRerunWithAgentOrCommandDetection.fire(element);
          }
        }
      }, $55("span.agentOrSlashCommandDetected")));
    } else if (this.rendererOptions.renderStyle !== "minimal" && !element.isComplete && !checkModeOption(this.delegate.currentChatMode(), this.rendererOptions.progressMessageAtBottomOfResponse)) {
      templateData.detail.textContent = localize("recovered.11389", "Working");
    }
  }
  renderConfirmationAction(element, templateData) {
    clearNode(templateData.detail);
    if (element.confirmation) {
      append(templateData.detail, $55("span.codicon.codicon-check", {
        "aria-hidden": "true"
      }));
      append(templateData.detail, $55("span.confirmation-text", void 0, localize("recovered.11364", "Selected \"{0}\"", element.confirmation)));
      templateData.header?.classList.remove("header-disabled");
      templateData.header?.classList.add("partially-disabled");
    }
  }
  renderAvatar(element, templateData) {
    if (isPendingDividerVM(element)) {
      return;
    }
    let icon2;
    if (isResponseVM(element)) {
      icon2 = this.getAgentIcon(element.agent?.metadata);
    } else if (isRequestVM(element)) {
      icon2 = element.avatarIcon ?? Codicon.account;
    } else {
      icon2 = Codicon.account;
    }
    if (icon2 instanceof URI) {
      const avatarIcon = $("img.icon");
      avatarIcon.src = FileAccess.uriToBrowserUri(icon2).toString(true);
      templateData.avatarContainer.replaceChildren($(".avatar", void 0, avatarIcon));
    } else {
      const avatarIcon = $(ThemeIcon.asCSSSelector(icon2));
      templateData.avatarContainer.replaceChildren($(".avatar.codicon-avatar", void 0, avatarIcon));
    }
  }
  getAgentIcon(agent) {
    if (agent?.themeIcon) {
      return agent.themeIcon;
    } else if (agent?.iconDark && isDark(this.themeService.getColorTheme().type)) {
      return agent.iconDark;
    } else if (agent?.icon) {
      return agent.icon;
    } else {
      return Codicon.chatSparkle;
    }
  }
  renderChatResponseBasic(element, index2, templateData) {
    templateData.rowContainer.classList.toggle("chat-response-loading", isResponseVM(element) && !element.isComplete);
    this.finalizeCompletedResponseParts(element, templateData);
    const content2 = [];
    const isFiltered = !!element.errorDetails?.responseIsFiltered;
    if (!isFiltered) {
      content2.push({
        kind: "references",
        references: element.contentReferences
      });
      content2.push(...annotateSpecialMarkdownContent(element.response.value));
      if (element.codeCitations.length) {
        content2.push({
          kind: "codeCitations",
          citations: element.codeCitations
        });
      }
    }
    if (element.model.response === element.model.entireResponse && !element.isCanceled && element.errorDetails?.message && element.errorDetails.message !== canceledName) {
      content2.push({
        kind: "errorDetails",
        errorDetails: element.errorDetails,
        isLast: getStickyScrollTargetItem(this.viewModel?.getItems() ?? []) === element
      });
    }
    const fileChangesSummaryPart = this.getChatFileChangesSummaryPart(element);
    if (fileChangesSummaryPart) {
      content2.push(fileChangesSummaryPart);
    }
    const turnPillsPart = this.getChatTurnPillsPart(element);
    if (turnPillsPart) {
      content2.push(turnPillsPart);
    }
    const workingProgress = this.shouldShowWorkingProgress(element, content2, false, templateData);
    if (workingProgress) {
      content2.push(workingProgress);
    }
    const diff4 = this.diff(templateData.renderedParts ?? [], content2, element);
    this.renderChatContentDiff(diff4, content2, element, index2, templateData);
    this.finalizeCompletedResponseParts(element, templateData);
  }
  finalizeCompletedResponseParts(element, templateData) {
    if (!element.isComplete && !element.isCanceled) {
      return;
    }
    const lastThinking = this.getLastThinkingPart(templateData.renderedParts);
    if (lastThinking?.domNode && lastThinking.getIsActive()) {
      lastThinking.finalizeTitleIfDefault();
      lastThinking.markAsInactive();
    }
    this.finalizeAllSubagentParts(templateData, true);
  }
  shouldShowWorkingProgress(element, partsToRender, moreContentAvailable, templateData) {
    if (element.agentOrSlashCommandDetected || this.rendererOptions.renderStyle === "minimal" || element.isComplete || !checkModeOption(this.delegate.currentChatMode(), this.rendererOptions.progressMessageAtBottomOfResponse)) {
      return void 0;
    }
    if (partsToRender.some(part => part.kind === "planReview" && !part.isUsed)) {
      return void 0;
    }
    if (endsWithSubagentContent(partsToRender)) {
      return void 0;
    }
    if (isResponseVM(element)) {
      const widget = this.chatWidgetService.getWidgetBySessionResource(element.sessionResource);
      if (widget?.inputPart.hasActiveToolConfirmationCarousel) {
        const nonSubagentConfirmationCount = this.getPendingToolConfirmationCount(partsToRender, false);
        if (nonSubagentConfirmationCount > 0) {
          return {
            kind: "working",
            content: new MarkdownString().appendText(this.getConfirmationPendingLabel(nonSubagentConfirmationCount))
          };
        }
        if (this.getPendingToolConfirmationCount(partsToRender, true) > 0) {
          return void 0;
        }
        return {
          kind: "working",
          content: new MarkdownString().appendText(this.getConfirmationPendingLabel(1))
        };
      }
    }
    if (isWaitingForMcpServers(partsToRender)) {
      return void 0;
    }
    const workingParts = getWorkingProgressRelevantParts(partsToRender);
    const lastPart = findLastMeaningfulPart(workingParts);
    if (workingParts.some(part => part.kind === "toolInvocation" && IChatToolInvocation.isStreaming(part))) {
      return void 0;
    }
    if (workingParts.some(part => part.kind === "toolInvocation" && !IChatToolInvocation.isComplete(part) && isMcpToolInvocation(part))) {
      return void 0;
    }
    const lastThinking = this.getLastThinkingPart(templateData.renderedParts);
    if (lastThinking) {
      return void 0;
    }
    if (lastPart && (lastPart.kind === "toolInvocation" || lastPart.kind === "toolInvocationSerialized")) {
      if (lastPart.isAttachedToThinking) {
        return void 0;
      }
      const isEffectivelyHiddenToolInvocation = IChatToolInvocation.isEffectivelyHidden(lastPart);
      const collapsedToolsMode = this.configService.getValue("chat.agent.thinking.collapsedTools");
      if (!isEffectivelyHiddenToolInvocation && collapsedToolsMode !== "off" /* Off */ && this.shouldPinPart(lastPart, isResponseVM(element) ? element : void 0)) {
        return void 0;
      }
    }
    const hasRenderedThinkingPart = (templateData.renderedParts ?? []).some(part => part instanceof ChatThinkingContentPart);
    const hasEditPillMarkdown = workingParts.some(part => part.kind === "markdownContent" && this.hasEditCodeblockUri(part));
    if (hasRenderedThinkingPart && hasEditPillMarkdown) {
      return void 0;
    }
    if (!lastPart || lastPart.kind === "references" || lastPart.kind === "markdownContent" && !moreContentAvailable && this.hasBeenCaughtUpLongEnough(element) || (lastPart.kind === "toolInvocation" || lastPart.kind === "toolInvocationSerialized") && (IChatToolInvocation.isComplete(lastPart) || IChatToolInvocation.isEffectivelyHidden(lastPart)) || (lastPart.kind === "textEditGroup" || lastPart.kind === "notebookEditGroup") && lastPart.done && !workingParts.some(part => part.kind === "toolInvocation" && !IChatToolInvocation.isComplete(part)) || lastPart.kind === "externalEdit" && !workingParts.some(part => part.kind === "toolInvocation" && !IChatToolInvocation.isComplete(part)) || lastPart.kind === "progressTask" && lastPart.deferred.isSettled || lastPart.kind === "mcpServersStarting" || lastPart.kind === "mcpAuthenticationRequired" || lastPart.kind === "mcpServersStartingSlow" || lastPart.kind === "disabledClaudeHooks" || lastPart.kind === "hook") {
      return {
        kind: "working"
      };
    }
    return void 0;
  }
  getPendingToolConfirmationCount(parts, includeSubagentConfirmations) {
    return parts.filter(part => {
      if (part.kind !== "toolInvocation") {
        return false;
      }
      const state = part.state.get();
      return state.type === IChatToolInvocation.StateKind.WaitingForConfirmation && !!state.confirmationMessages?.title && part.presentation !== "hidden" && part.source.type !== "mcp" && isSubagentToolInvocation(part) === includeSubagentConfirmations;
    }).length;
  }
  getConfirmationPendingLabel(count2) {
    return count2 === 1 ? localize("recovered.11369", "1 confirmation pending") : localize("recovered.11370", "{0} confirmations pending", count2);
  }
  removeWorkingProgressContentPart(templateData) {
    const renderedParts = templateData.renderedParts;
    if (!renderedParts) {
      return;
    }
    for (let i2 = renderedParts.length - 1; i2 >= 0; i2--) {
      const part = renderedParts[i2];
      if (part instanceof ChatWorkingProgressContentPart) {
        part.dispose();
        part.domNode?.remove();
        renderedParts.splice(i2, 1);
        this.fireItemHeightChange(templateData);
        return;
      }
    }
  }
  updateWorkingProgressForPendingConfirmations(templateData) {
    const originalElement = templateData.currentElement;
    queueMicrotask(() => {
      if (templateData.currentElement !== originalElement) {
        return;
      }
      this.doUpdateWorkingProgressForPendingConfirmations(templateData);
    });
  }
  doUpdateWorkingProgressForPendingConfirmations(templateData) {
    const element = templateData.currentElement;
    if (!isResponseVM(element)) {
      return;
    }
    const pendingConfirmationCount = this.getPendingToolConfirmationCount(element.response.value, false);
    if (pendingConfirmationCount === 0) {
      this.removeWorkingProgressContentPart(templateData);
      return;
    }
    const workingProgressPart = this.getWorkingProgressContentPart(templateData);
    if (workingProgressPart) {
      workingProgressPart.updateWorkingContent(new MarkdownString().appendText(this.getConfirmationPendingLabel(pendingConfirmationCount)));
    }
  }
  getWorkingProgressContentPart(templateData) {
    const renderedParts = templateData.renderedParts;
    if (!renderedParts) {
      return void 0;
    }
    for (let i2 = renderedParts.length - 1; i2 >= 0; i2--) {
      const part = renderedParts[i2];
      if (part instanceof ChatWorkingProgressContentPart) {
        return part;
      }
    }
    return void 0;
  }
  createUpdateWorkingProgressOnConfirmationEnd(toolInvocation, templateData) {
    if (this.workingProgressConfirmationEndListeners.has(toolInvocation)) {
      return void 0;
    }
    this.workingProgressConfirmationEndListeners.add(toolInvocation);
    let wasWaitingForConfirmation = false;
    const disposable = autorun(reader => {
      const currentState = toolInvocation.state.read(reader);
      const isWaitingForConfirmation = currentState.type === IChatToolInvocation.StateKind.WaitingForConfirmation;
      if (wasWaitingForConfirmation && !isWaitingForConfirmation) {
        this.updateWorkingProgressForPendingConfirmations(templateData);
        this.workingProgressConfirmationEndListeners.delete(toolInvocation);
        disposable.dispose();
      }
      wasWaitingForConfirmation = isWaitingForConfirmation;
    });
    return toDisposable(() => {
      this.workingProgressConfirmationEndListeners.delete(toolInvocation);
      disposable.dispose();
    });
  }
  hasBeenCaughtUpLongEnough(element) {
    const lastRenderTime = element.renderData?.lastRenderTime;
    if (typeof lastRenderTime !== "number" || lastRenderTime === 0) {
      return false;
    }
    return Date.now() - lastRenderTime >= WORKING_CAUGHT_UP_DEBOUNCE_MS;
  }
  /**
   * Returns the last part that visually contributes to the response, skipping
   * empty markdown placeholders.
   */
  /**
   * True while we have caught up to streamed markdown but are still within the
   * {@link WORKING_CAUGHT_UP_DEBOUNCE_MS} window before the working indicator
   * should appear. The progressive render loop keeps polling in this state so
   * the indicator can still surface after a genuine pause, instead of being
   * dropped when the loop would otherwise stop (the debounce itself avoids
   * flicker during normal token streaming).
   */
  isWorkingProgressDebouncePending(element, partsToRender) {
    if (element.isComplete) {
      return false;
    }
    if (partsToRender.some(part => part.kind === "working")) {
      return false;
    }
    return findLastMeaningfulPart(getWorkingProgressRelevantParts(partsToRender))?.kind === "markdownContent" && !this.hasBeenCaughtUpLongEnough(element);
  }
  getChatFileChangesSummaryPart(element) {
    if (this.shouldShowPillsSummary(element) || !this.shouldShowFileChangesSummary(element)) {
      return void 0;
    }
    const sessionType = getChatSessionType(element.sessionResource);
    if (!isAgentHostTarget(sessionType) && !element.model.entireResponse.value.some(part => part.kind === "textEditGroup" || part.kind === "notebookEditGroup")) {
      return void 0;
    }
    return {
      kind: "changesSummary",
      requestId: element.requestId,
      sessionResource: element.sessionResource
    };
  }
  getChatTurnPillsPart(element) {
    if (!this.shouldShowPillsSummary(element)) {
      return void 0;
    }
    return {
      kind: "turnPills",
      requestId: element.requestId,
      sessionResource: element.sessionResource
    };
  }
  renderChatRequest(element, index2, templateData) {
    templateData.rowContainer.classList.toggle("chat-response-loading", false);
    templateData.rowContainer.classList.toggle("pending-request", !!element.pendingKind);
    templateData.rowContainer.classList.toggle("system-initiated-request", !!element.isSystemInitiated);
    templateData.rowContainer.classList.toggle("terminal-command-request", !element.isSystemInitiated && element.isTerminalCommand);
    if (element.isSystemInitiated) {
      this.renderSystemInitiatedRequest(element, templateData);
      return;
    }
    if (element.pendingKind && this._pendingDragController) {
      templateData.rowContainer.dataset.pendingRequestId = element.id;
      templateData.rowContainer.dataset.pendingKind = element.pendingKind;
      const sameKindCount = (this.viewModel?.model.getPendingRequests() ?? []).filter(p => p.kind === element.pendingKind).length;
      if (sameKindCount > 1) {
        const handle2 = $(".chat-pending-drag-handle" + ThemeIcon.asCSSSelector(Codicon.gripper));
        templateData.rowContainer.prepend(handle2);
        templateData.dragHandle = handle2;
        this._pendingDragController.attachDragHandle(element, handle2, templateData.rowContainer, templateData.elementDisposables);
      }
    }
    if (element.id === this.viewModel?.editing?.id) {
      this._onDidRerender.fire(templateData);
    }
    if (this.configService.getValue("chat.editRequests") !== "none" && this.rendererOptions.editable) {
      templateData.elementDisposables.add(addDisposableListener(templateData.rowContainer, EventType.KEY_DOWN, e => {
        const ev = new StandardKeyboardEvent(e);
        if (ev.equals(10 /* Space */) || ev.equals(3 /* Enter */)) {
          if (this.viewModel?.editing?.id !== element.id) {
            ev.preventDefault();
            ev.stopPropagation();
            this._onDidClickRequest.fire(templateData);
          }
        }
      }));
    }
    let content2 = [];
    const explicitFileOrImageVariables = element.variables.filter(isExplicitFileOrImageVariableEntry);
    const explicitImageVariables = explicitFileOrImageVariables.filter(variable => variable.kind === "image");
    const explicitFileOrDirectoryVariables = element.variables.filter(variable => variable.kind === "file" || variable.kind === "directory" || isPasteVariableEntry(variable));
    const otherVariables = element.variables.filter(variable => !isExplicitFileOrImageVariableEntry(variable) && !isPasteVariableEntry(variable));
    if (!element.confirmation) {
      const markdown = isChatFollowup(element.message) ? element.message.message : this.markdownDecorationsRenderer.convertParsedRequestToMarkdown(element.sessionResource, element.message);
      const attachmentSummary = !element.messageText.trim() && !explicitFileOrImageVariables.length ? getExplicitFileOrImageAttachmentSummary(element.variables) : void 0;
      const requestMarkdown = markdown.trim() ? markdown : attachmentSummary;
      if (requestMarkdown) {
        content2 = [{
          content: new MarkdownString(requestMarkdown),
          kind: "markdownContent"
        }];
      }
      if (this.rendererOptions.renderStyle === "minimal" && !element.isComplete) {
        templateData.value.classList.add("inline-progress");
        templateData.elementDisposables.add(toDisposable(() => templateData.value.classList.remove("inline-progress")));
        content2.push({
          content: new MarkdownString("<span></span>", {
            supportHtml: true
          }),
          kind: "markdownContent"
        });
      } else {
        templateData.value.classList.remove("inline-progress");
      }
    }
    clearNode(templateData.value);
    const parts = [];
    const explicitImageAttachmentsPart = explicitImageVariables.length ? this.renderAttachments(explicitImageVariables, element.contentReferences, element.modelId, templateData, element.resolvedModelId) : void 0;
    if (explicitImageAttachmentsPart?.domNode) {
      explicitImageAttachmentsPart.domNode.classList.add("chat-request-attachment-cards", "chat-request-image-attachments");
      templateData.value.appendChild(explicitImageAttachmentsPart.domNode);
      templateData.elementDisposables.add(explicitImageAttachmentsPart);
    }
    const explicitFileAttachmentsPart = explicitFileOrDirectoryVariables.length ? this.renderAttachments(explicitFileOrDirectoryVariables, element.contentReferences, element.modelId, templateData) : void 0;
    if (explicitFileAttachmentsPart?.domNode) {
      explicitFileAttachmentsPart.domNode.classList.add("chat-request-attachment-cards", "chat-request-file-attachments");
      explicitFileAttachmentsPart.domNode.style.display = "flex";
      explicitFileAttachmentsPart.domNode.style.flexDirection = "column";
      explicitFileAttachmentsPart.domNode.style.alignItems = "flex-end";
      explicitFileAttachmentsPart.domNode.style.flexWrap = "nowrap";
      templateData.value.appendChild(explicitFileAttachmentsPart.domNode);
      templateData.elementDisposables.add(explicitFileAttachmentsPart);
    }
    const contentContainer = templateData.value;
    let inlineSlashCommandRendered = false;
    let codeBlockStartIndex = 0;
    content2.forEach((data, contentIndex) => {
      const context2 = {
        element,
        elementIndex: index2,
        contentIndex,
        content: content2,
        container: templateData.rowContainer,
        editorPool: this._editorPool,
        diffEditorPool: this._diffEditorPool,
        currentWidth: this._currentLayoutWidth,
        onDidChangeVisibility: this._onDidChangeVisibility.event,
        inlineTextModels: this._inlineTextModels,
        codeBlockStartIndex,
        treeStartIndex: 0
        // no trees in requests
      };
      const newPart = this.renderChatContentPart(data, templateData, context2);
      if (newPart) {
        if (this.rendererOptions.renderDetectedCommandsWithRequest && !inlineSlashCommandRendered && element.agentOrSlashCommandDetected && element.slashCommand && data.kind === "markdownContent") {
          if (newPart.domNode) {
            newPart.domNode.style.display = "inline-flex";
          }
          const cmdPart = this.instantiationService.createInstance(ChatAgentCommandContentPart, element.slashCommand, () => this._onDidClickRerunWithAgentOrCommandDetection.fire({
            sessionResource: element.sessionResource,
            requestId: element.id
          }));
          contentContainer.appendChild(cmdPart.domNode);
          parts.push(cmdPart);
          inlineSlashCommandRendered = true;
        }
        if (newPart.domNode && !newPart.domNode.parentElement) {
          contentContainer.appendChild(newPart.domNode);
        }
        parts.push(newPart);
        codeBlockStartIndex += newPart.codeblocks?.length ?? 0;
      }
    });
    if (templateData.renderedParts) {
      dispose(templateData.renderedParts);
    }
    templateData.renderedParts = parts;
    if (otherVariables.length) {
      const newPart = this.renderAttachments(otherVariables, element.contentReferences, element.modelId, templateData);
      if (newPart.domNode) {
        templateData.value.appendChild(newPart.domNode);
      }
      templateData.elementDisposables.add(newPart);
    }
    if (!element.pendingKind && !element.confirmation && this.rendererOptions.renderStyle !== "minimal" && templateData.value.childElementCount > 0) {
      const timestamp = renderChatRequestTimestamp(templateData.value, element.requestTimestamp);
      if (timestamp?.hoverText) {
        templateData.elementDisposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate("element"), timestamp.element, timestamp.hoverText));
      } else if (timestamp) {
        let requestTimingBounds;
        templateData.elementDisposables.add(addDisposableListener(timestamp.element, EventType.MOUSE_OVER, e => {
          const target = isHTMLElement(e.target) ? e.target.closest(".chat-request-relative") : void 0;
          if (!isHTMLElement(target) || !timestamp.element.contains(target)) {
            return;
          }
          const bounds = target.getBoundingClientRect();
          requestTimingBounds = bounds;
          timestamp.element.classList.add("chat-request-flip-reset");
          timestamp.element.classList.remove("chat-request-flip-active");
          timestamp.element.classList.toggle("chat-request-flip-down", e.clientY < bounds.top + bounds.height / 2);
          void timestamp.element.offsetWidth;
          timestamp.element.classList.remove("chat-request-flip-reset");
          void timestamp.element.offsetWidth;
          timestamp.element.classList.add("chat-request-flip-active");
        }));
        templateData.elementDisposables.add(addDisposableListener(timestamp.element, EventType.MOUSE_MOVE, e => {
          if (requestTimingBounds && (e.clientX < requestTimingBounds.left || e.clientX > requestTimingBounds.right || e.clientY < requestTimingBounds.top || e.clientY > requestTimingBounds.bottom)) {
            requestTimingBounds = void 0;
            timestamp.element.classList.remove("chat-request-flip-active");
          }
        }));
        templateData.elementDisposables.add(addDisposableListener(timestamp.element, EventType.MOUSE_LEAVE, () => {
          requestTimingBounds = void 0;
          timestamp.element.classList.remove("chat-request-flip-active");
        }));
        templateData.elementDisposables.add(addDisposableListener(timestamp.element, EventType.FOCUS, () => {
          timestamp.element.classList.remove("chat-request-flip-active", "chat-request-flip-down");
        }));
      }
    }
  }
  renderSystemInitiatedRequest(element, templateData) {
    clearNode(templateData.value);
    if (templateData.renderedParts) {
      dispose(templateData.renderedParts);
    }
    templateData.renderedParts = [];
    const label3 = element.systemInitiatedLabel ?? element.messageText;
    const notificationPart = this.instantiationService.createInstance(ChatSystemNotificationContentPart, {
      kind: "systemNotification",
      content: new MarkdownString(label3)
    }, this.chatContentMarkdownRenderer);
    templateData.elementDisposables.add(notificationPart);
    templateData.value.appendChild(notificationPart.domNode);
  }
  /**
   * Smooth streaming render path — event-driven, rAF-batched.
   *
   * Does a render pass that feeds the full content through
   * `getNextProgressiveRenderContent` → `diff` → `renderChatContentDiff`,
   * where the morpher intercepts markdown appends and schedules
   * rAF-batched re-renders through the standard markdown pipeline.
   *
   * Called on every `renderElement` invocation (which fires each time
   * the model changes). On completion/cancellation the morpher's
   * content is already correctly rendered, so we do a final diff pass
   * (not a destructive re-render) to finalize non-markdown parts like
   * thinking indicators, error details, and code citations.
   */
  doIncrementalRender(element, index2, templateData) {
    if (!this._isVisible) {
      return;
    }
    const rate = this.getProgressiveRenderRate(element);
    this._updateMorpherRate(templateData, rate, element.isComplete || element.isCanceled);
    if (element.isCanceled || element.isComplete) {
      element.renderData = void 0;
      templateData.rowContainer.classList.toggle("chat-response-loading", false);
      this.renderChatResponseBasic(element, index2, templateData);
      return;
    }
    templateData.rowContainer.classList.toggle("chat-response-loading", true);
    const contentForThisTurn = this.getNextProgressiveRenderContent(element, templateData);
    const partsToRender = this.diff(templateData.renderedParts ?? [], contentForThisTurn.content, element);
    const contentIsAlreadyRendered = partsToRender.every(part => part === null);
    if (!contentIsAlreadyRendered) {
      this.renderChatContentDiff(partsToRender, contentForThisTurn.content, element, index2, templateData);
    }
  }
  /**
   * Propagate the stream's word-rate estimate to any active morpher's
   * word buffer so it reveals content at the model's speed.
   */
  _updateMorpherRate(templateData, rate, isComplete) {
    const renderedParts = templateData.renderedParts;
    if (!renderedParts) {
      return;
    }
    for (const part of renderedParts) {
      if (part instanceof ChatMarkdownContentPart) {
        part.updateStreamRate(rate, isComplete);
      }
    }
  }
  logIncrementalRenderingTelemetry() {
    if (this._incrementalRenderingTelemetryLogged) {
      return;
    }
    this._incrementalRenderingTelemetryLogged = true;
    this.telemetryService.publicLog2("chatIncrementalRenderingSettings", {
      animationStyle: this.configService.getValue("chat.experimental.incrementalRendering.animationStyle" /* IncrementalRenderingStyle */) ?? "none",
      buffering: this.configService.getValue("chat.experimental.incrementalRendering.buffering" /* IncrementalRenderingBuffering */) ?? "word"
    });
  }
  /**
   *	@returns true if progressive rendering should be considered complete- the element's data is fully rendered or the view is not visible
   */
  doNextProgressiveRender(element, index2, templateData, isInRenderElement) {
    if (!this._isVisible) {
      return true;
    }
    if (element.isCanceled) {
      this.traceLayout("doNextProgressiveRender", `canceled, index=${index2}`);
      element.renderData = void 0;
      this.renderChatResponseBasic(element, index2, templateData);
      return true;
    }
    templateData.rowContainer.classList.toggle("chat-response-loading", true);
    this.traceLayout("doNextProgressiveRender", `START progressive render, index=${index2}`);
    const contentForThisTurn = this.getNextProgressiveRenderContent(element, templateData);
    const partsToRender = this.diff(templateData.renderedParts ?? [], contentForThisTurn.content, element);
    const contentIsAlreadyRendered = partsToRender.every(part => part === null);
    if (contentIsAlreadyRendered) {
      if (contentForThisTurn.moreContentAvailable) {
        this.traceLayout("doNextProgressiveRender", "not rendering any new content this tick, but more available");
        return false;
      } else if (element.isComplete) {
        this.traceLayout("doNextProgressiveRender", `END progressive render, index=${index2} and clearing renderData, response is complete`);
        element.renderData = void 0;
        this.renderChatResponseBasic(element, index2, templateData);
        return true;
      } else if (this.isWorkingProgressDebouncePending(element, contentForThisTurn.content)) {
        return false;
      } else {
        return true;
      }
    }
    this.traceLayout("doNextProgressiveRender", `doing progressive render, ${partsToRender.length} parts to render`);
    this.renderChatContentDiff(partsToRender, contentForThisTurn.content, element, index2, templateData);
    return false;
  }
  renderChatContentDiff(partsToRender, contentForThisTurn, element, elementIndex, templateData) {
    const renderedParts = templateData.renderedParts ?? [];
    templateData.renderedParts = renderedParts;
    templateData.renderedContent = contentForThisTurn;
    let codeBlockStartIndex = 0;
    let treeStartIndex = 0;
    let displacedWorkingPart;
    partsToRender.forEach((partToRender, contentIndex) => {
      if (contentIndex > 0) {
        const prevPart = renderedParts[contentIndex - 1];
        if (prevPart) {
          codeBlockStartIndex += prevPart.codeblocks?.length ?? 0;
          if (prevPart instanceof ChatTreeContentPart) {
            treeStartIndex++;
          }
        }
      }
      const alreadyRenderedPart = templateData.renderedParts?.[contentIndex];
      if (!partToRender) {
        if (!templateData.renderedPartsMounted) {
          alreadyRenderedPart?.onDidRemount?.();
        }
        return;
      }
      if (partToRender.kind === "working" && displacedWorkingPart?.hasSameContent(partToRender, contentForThisTurn.slice(contentIndex + 1), element)) {
        renderedParts[contentIndex] = displacedWorkingPart;
        displacedWorkingPart = void 0;
        return;
      }
      const preserveWorkingPart = alreadyRenderedPart instanceof ChatWorkingProgressContentPart && partToRender.kind !== "working" && contentForThisTurn.slice(contentIndex + 1).some(part => part.kind === "working");
      if (alreadyRenderedPart) {
        if (partToRender.kind === "thinking" && alreadyRenderedPart instanceof ChatThinkingContentPart) {
          if (!Array.isArray(partToRender.value)) {
            alreadyRenderedPart.updateThinking(partToRender);
          }
          renderedParts[contentIndex] = alreadyRenderedPart;
          return;
        } else if (alreadyRenderedPart instanceof ChatThinkingContentPart && this.shouldPinPart(partToRender, element)) {
          renderedParts[contentIndex] = alreadyRenderedPart;
          return;
        }
        if (partToRender.kind === "markdownContent" && alreadyRenderedPart instanceof ChatMarkdownContentPart && this.configService.getValue("chat.experimental.incrementalRendering.enabled" /* IncrementalRendering */)) {
          if (alreadyRenderedPart.tryIncrementalUpdate(partToRender)) {
            renderedParts[contentIndex] = alreadyRenderedPart;
            return;
          }
        }
        if (preserveWorkingPart) {
          displacedWorkingPart = alreadyRenderedPart;
        } else {
          alreadyRenderedPart.dispose();
        }
        if (alreadyRenderedPart.domNode) {
          const thinkingToolWrapper = findParentWithClass(alreadyRenderedPart.domNode, "chat-thinking-tool-wrapper");
          if (thinkingToolWrapper) {
            thinkingToolWrapper.replaceWith(alreadyRenderedPart.domNode);
          }
        }
      }
      const context2 = {
        element,
        elementIndex,
        content: contentForThisTurn,
        contentIndex,
        container: templateData.rowContainer,
        editorPool: this._editorPool,
        diffEditorPool: this._diffEditorPool,
        currentWidth: this._currentLayoutWidth,
        onDidChangeVisibility: this._onDidChangeVisibility.event,
        inlineTextModels: this._inlineTextModels,
        codeBlockStartIndex,
        treeStartIndex
      };
      const lastThinking = this.getLastThinkingPart(renderedParts);
      if (lastThinking && (partToRender.kind === "toolInvocation" || partToRender.kind === "toolInvocationSerialized" || partToRender.kind === "markdownContent" || partToRender.kind === "textEditGroup" || partToRender.kind === "externalEdit" || partToRender.kind === "hook") && this.shouldPinPart(partToRender, element)) {
        if (alreadyRenderedPart instanceof ChatMarkdownContentPart) {
          lastThinking.removeEditPillByPartId(alreadyRenderedPart.codeblocksPartId);
        }
        const newPart2 = this.renderChatContentPart(partToRender, templateData, context2);
        if (newPart2) {
          renderedParts[contentIndex] = newPart2;
          alreadyRenderedPart?.domNode?.remove();
        }
        return;
      }
      const newPart = this.renderChatContentPart(partToRender, templateData, context2);
      if (newPart) {
        renderedParts[contentIndex] = newPart;
        try {
          if (alreadyRenderedPart?.domNode) {
            if (newPart.domNode) {
              if (preserveWorkingPart) {
                alreadyRenderedPart.domNode.before(newPart.domNode);
              } else {
                alreadyRenderedPart.domNode.replaceWith(newPart.domNode);
              }
            } else {
              if (!preserveWorkingPart) {
                alreadyRenderedPart.domNode.remove();
              }
            }
          } else if (newPart.domNode && !newPart.domNode.parentElement) {
            templateData.value.appendChild(newPart.domNode);
          }
        } catch (err) {
          this.logService.error("ChatListItemRenderer#renderChatContentDiff: error replacing part", err);
        }
      } else {
        alreadyRenderedPart?.domNode?.remove();
      }
    });
    displacedWorkingPart?.dispose();
    displacedWorkingPart?.domNode?.remove();
    for (let i2 = partsToRender.length; i2 < renderedParts.length; i2++) {
      const part = renderedParts[i2];
      if (part) {
        part.dispose();
        part.domNode?.remove();
        delete renderedParts[i2];
      }
    }
    const animateCollapse = templateData.wasResponseComplete === false && element.isComplete;
    this.updateCompletedResponseDisclosure(element, contentForThisTurn, templateData, animateCollapse);
    templateData.wasResponseComplete = element.isComplete;
  }
  updateCompletedResponseDisclosure(element, content2, templateData, animateCollapse) {
    if (!element.isComplete || !this.configService.getValue("chat.agent.collapseCompletedResponses" /* CollapseCompletedResponses */)) {
      this.removeCompletedResponseDisclosure(templateData);
      templateData.completedResponseDisclosureOpen = void 0;
      return;
    }
    const finalResponseStartIndex = getFinalResponseStartIndex(content2);
    if (finalResponseStartIndex === void 0 || finalResponseStartIndex === 0 || !content2.slice(0, finalResponseStartIndex).some(part => part.kind !== "references" || part.references.length > 0)) {
      this.removeCompletedResponseDisclosure(templateData);
      return;
    }
    const finalResponseNode = templateData.renderedParts?.[finalResponseStartIndex]?.domNode;
    if (!finalResponseNode) {
      this.removeCompletedResponseDisclosure(templateData);
      return;
    }
    let finalResponseRoot = finalResponseNode;
    while (finalResponseRoot.parentElement && finalResponseRoot.parentElement !== templateData.value) {
      finalResponseRoot = finalResponseRoot.parentElement;
    }
    if (finalResponseRoot.parentElement !== templateData.value) {
      this.removeCompletedResponseDisclosure(templateData);
      return;
    }
    const existingDisclosure = templateData.completedResponseDisclosure;
    if (existingDisclosure && templateData.completedResponseStartIndex === finalResponseStartIndex && existingDisclosure.nextSibling === finalResponseRoot && templateData.renderedParts?.slice(0, finalResponseStartIndex).every(part => !part?.domNode || existingDisclosure.contains(part.domNode))) {
      return;
    }
    this.removeCompletedResponseDisclosure(templateData);
    const valueChildren = Array.from(templateData.value.childNodes);
    const nodesToCollapse = valueChildren.slice(0, valueChildren.indexOf(finalResponseRoot));
    const stepCount = getVisibleCompletedResponseItemCount(nodesToCollapse);
    if (stepCount < 2) {
      return;
    }
    const details = document.createElement("details");
    details.classList.add("completed-response-disclosure");
    const summary = details.appendChild(document.createElement("summary"));
    summary.classList.add("completed-response-summary", "chat-used-context-label");
    const button = summary.appendChild($55("span.monaco-button.monaco-text-button.monaco-icon-button"));
    const label3 = button.appendChild($55("span.monaco-button-mdlabel"));
    const chevron = button.appendChild($55("span.chat-collapsible-hover-chevron", {
      "aria-hidden": "true"
    }));
    chevron.classList.add(...ThemeIcon.asClassNameArray(Codicon.chevronRight));
    label3.textContent = formatCompletedResponseDisclosureLabel(stepCount, element.model.elapsedMs);
    const activeElement = getActiveElement();
    const keepOpenForFocus = nodesToCollapse.some(node => node.contains(activeElement));
    const shouldAnimateInitialCollapse = animateCollapse && !keepOpenForFocus && !this.accessibilityService.isMotionReduced() && templateData.completedResponseDisclosureOpen === void 0;
    if (keepOpenForFocus) {
      templateData.completedResponseDisclosureOpen = true;
    }
    details.open = templateData.completedResponseDisclosureOpen ?? shouldAnimateInitialCollapse;
    const updateExpansionState = () => {
      summary.setAttribute("aria-expanded", String(details.open));
      chevron.classList.toggle("expanded", details.open);
    };
    updateExpansionState();
    templateData.value.insertBefore(details, finalResponseRoot);
    details.append(...nodesToCollapse);
    templateData.completedResponseDisclosure = details;
    templateData.completedResponseStartIndex = finalResponseStartIndex;
    templateData.completedResponseDisclosureDisposables.add(addDisposableListener(details, "toggle", () => {
      templateData.completedResponseDisclosureOpen = details.open;
      updateExpansionState();
    }));
    if (shouldAnimateInitialCollapse) {
      const targetWindow = getWindow(details);
      const animationFrame = targetWindow.requestAnimationFrame(() => {
        if (templateData.completedResponseDisclosure === details && details.open) {
          details.open = false;
        }
      });
      templateData.completedResponseDisclosureDisposables.add(toDisposable(() => targetWindow.cancelAnimationFrame(animationFrame)));
    }
  }
  removeCompletedResponseDisclosure(templateData) {
    const details = templateData.completedResponseDisclosure;
    if (!details) {
      return;
    }
    templateData.completedResponseDisclosureDisposables.clear();
    while (details.childNodes.length > 1) {
      details.before(details.childNodes[1]);
    }
    details.remove();
    templateData.completedResponseDisclosure = void 0;
    templateData.completedResponseStartIndex = void 0;
  }
  /**
   * Returns all content parts that should be rendered, and trimmed markdown content. We will diff this with the current rendered set.
   */
  getNextProgressiveRenderContent(element, templateData) {
    const data = this.getDataForProgressiveRender(element);
    const incrementalRendering = this.configService.getValue("chat.experimental.incrementalRendering.enabled" /* IncrementalRendering */) === true;
    const renderableResponse = annotateSpecialMarkdownContent(element.response.value);
    this.traceLayout("getNextProgressiveRenderContent", `Want to render ${data.numWordsToRender} at ${data.rate} words/s, counting...`);
    let numNeededWords = data.numWordsToRender;
    const partsToRender = [];
    partsToRender.push({
      kind: "references",
      references: element.contentReferences
    });
    let moreContentAvailable = false;
    for (let i2 = 0; i2 < renderableResponse.length; i2++) {
      const part = renderableResponse[i2];
      if (part.kind === "markdownContent" && !incrementalRendering) {
        const wordCountResult = getNWords(part.content.value, numNeededWords);
        this.traceLayout("getNextProgressiveRenderContent", `  Chunk ${i2}: Want to render ${numNeededWords} words and found ${wordCountResult.returnedWordCount} words. Total words in chunk: ${wordCountResult.totalWordCount}`);
        numNeededWords -= wordCountResult.returnedWordCount;
        if (wordCountResult.isFullString) {
          partsToRender.push(part);
          for (const nextPart of renderableResponse.slice(i2 + 1)) {
            if (nextPart.kind !== "markdownContent") {
              i2++;
              partsToRender.push(nextPart);
            } else {
              break;
            }
          }
        } else {
          moreContentAvailable = true;
          partsToRender.push({
            ...part,
            content: new MarkdownString(wordCountResult.value, part.content)
          });
        }
        if (numNeededWords <= 0) {
          if (renderableResponse.slice(i2 + 1).some(part2 => part2.kind === "markdownContent")) {
            moreContentAvailable = true;
          }
          break;
        }
      } else {
        partsToRender.push(part);
      }
    }
    const lastWordCount = element.contentUpdateTimings?.lastWordCount ?? 0;
    const newRenderedWordCount = data.numWordsToRender - numNeededWords;
    const bufferWords = lastWordCount - newRenderedWordCount;
    this.traceLayout("getNextProgressiveRenderContent", `Want to render ${data.numWordsToRender} words. Rendering ${newRenderedWordCount} words. Buffer: ${bufferWords} words`);
    if (newRenderedWordCount > 0 && newRenderedWordCount !== element.renderData?.renderedWordCount) {
      element.renderData = {
        lastRenderTime: Date.now(),
        renderedWordCount: newRenderedWordCount,
        renderedParts: partsToRender
      };
    }
    const workingProgress = this.shouldShowWorkingProgress(element, partsToRender, moreContentAvailable, templateData);
    if (workingProgress) {
      partsToRender.push(workingProgress);
    }
    const fileChangesSummaryPart = this.getChatFileChangesSummaryPart(element);
    if (fileChangesSummaryPart) {
      partsToRender.push(fileChangesSummaryPart);
    }
    const turnPillsPart = this.getChatTurnPillsPart(element);
    if (turnPillsPart) {
      partsToRender.push(turnPillsPart);
    }
    return {
      content: partsToRender,
      moreContentAvailable
    };
  }
  shouldShowFileChangesSummary(element) {
    const sessionType = getChatSessionType(element.sessionResource);
    const isLocalSession = sessionType === localChatSessionType || isAgentHostTarget(sessionType);
    return shouldShowFileChangesSummaryForSettings(element.isComplete, isLocalSession, this.configService.getValue("chat.checkpoints.showFileChanges"));
  }
  shouldShowPillsSummary(element) {
    return shouldShowPillsSummaryForSettings(element.isComplete, isAgentHostTarget(getChatSessionType(element.sessionResource)), this.configService.getValue("chat.turnStatusPills" /* TurnStatusPills */));
  }
  getDataForProgressiveRender(element) {
    const hasMarkdownParts = element.response.value.some(part => part.kind === "markdownContent" && part.content.value.trim().length > 0);
    if (shouldRenderInitialProgressiveContentImmediately(element.isComplete, hasMarkdownParts, element.renderData !== void 0)) {
      return {
        numWordsToRender: Number.MAX_SAFE_INTEGER,
        rate: Number.MAX_SAFE_INTEGER
      };
    }
    const renderData = element.renderData ?? {
      lastRenderTime: 0,
      renderedWordCount: 0
    };
    const rate = this.getProgressiveRenderRate(element);
    const numWordsToRender = renderData.lastRenderTime === 0 ? 1 : renderData.renderedWordCount +
    // Additional words to render beyond what's already rendered
    Math.floor((Date.now() - renderData.lastRenderTime) / 1e3 * rate);
    return {
      numWordsToRender,
      rate
    };
  }
  diff(renderedParts, contentToRender, element) {
    const diff4 = [];
    for (let i2 = 0; i2 < contentToRender.length; i2++) {
      const content2 = contentToRender[i2];
      const renderedPart = renderedParts[i2];
      if (!renderedPart || !renderedPart.hasSameContent(content2, contentToRender.slice(i2 + 1), element)) {
        diff4.push(content2);
      } else {
        diff4.push(null);
      }
    }
    return diff4;
  }
  hasEditCodeblockUri(part) {
    if (part.kind !== "markdownContent") {
      return false;
    }
    return hasEditCodeblockUriTag(part.content.value);
  }
  isCodeblockComplete(part, element) {
    if (part.kind !== "markdownContent") {
      return true;
    }
    return !isResponseVM(element) || element.isComplete || codeblockHasClosingBackticks(part.content.value);
  }
  // todo @justschen initially split up each of the checks to easily see what should be pinned/not pinned, we can probably consolidate this down by a lot once we're more confident in the logic.
  shouldPinPart(part, element) {
    const collapsedToolsMode = this.configService.getValue("chat.agent.thinking.collapsedTools");
    if ((part.kind === "toolInvocation" || part.kind === "toolInvocationSerialized") && part.toolSpecificData?.kind === "simpleToolInvocation" && part.toolSpecificData.presentationStyle === "shuncode") {
      return false;
    }
    if ((part.kind === "toolInvocation" || part.kind === "toolInvocationSerialized") && part.toolId.startsWith("shuncode_") && this.configService.getValue("shuncode.chat.bridgeStyleUI") !== false) {
      return false;
    }
    if (part.kind === "thinking" || part.kind === "working") {
      return true;
    }
    if (part.kind === "undoStop") {
      return true;
    }
    if (part.kind === "hook") {
      if (part.subAgentInvocationId) {
        return false;
      }
      return part.hookType === "PreToolUse" /* PreToolUse */ || part.hookType === "PostToolUse" /* PostToolUse */;
    }
    if (collapsedToolsMode === "off" /* Off */) {
      return false;
    }
    if (this.hasEditCodeblockUri(part) || part.kind === "textEditGroup" || part.kind === "externalEdit") {
      return true;
    }
    const isMcpTool = (part.kind === "toolInvocation" || part.kind === "toolInvocationSerialized") && isMcpToolInvocation(part);
    if (isMcpTool) {
      return false;
    }
    const isMermaidTool = (part.kind === "toolInvocation" || part.kind === "toolInvocationSerialized") && part.toolId.toLowerCase().includes("mermaid");
    if (isMermaidTool) {
      return false;
    }
    const isAskQuestionsTool = (part.kind === "toolInvocation" || part.kind === "toolInvocationSerialized") && (part.toolId === "copilot_askQuestions" || part.toolId === "vscode_askQuestions");
    if (isAskQuestionsTool) {
      return false;
    }
    if ((part.kind === "toolInvocation" || part.kind === "toolInvocationSerialized") && isSubagentToolInvocation(part)) {
      return false;
    }
    if ((part.kind === "toolInvocation" || part.kind === "toolInvocationSerialized") && (isCreateSessionTool(part.toolId) || isCreateChatTool(part.toolId) || isSendMessageTool(part.toolId))) {
      return false;
    }
    const isTerminalTool = (part.kind === "toolInvocation" || part.kind === "toolInvocationSerialized") && part.toolSpecificData?.kind === "terminal";
    const isContributedTerminalToolInvocation = element && element.sessionResource.scheme !== Schemas.vscodeChatInput && getChatSessionType(element.sessionResource) !== localChatSessionType && part.kind === "toolInvocationSerialized" && part.toolSpecificData?.kind === "terminal";
    if (isTerminalTool && !isContributedTerminalToolInvocation) {
      if (part.kind === "toolInvocation" && IChatToolInvocation.getConfirmationMessages(part)) {
        return false;
      }
      const terminalToolsInThinking = this.configService.getValue("chat.agent.thinking.terminalTools" /* TerminalToolsInThinking */);
      return !!terminalToolsInThinking;
    }
    if (part.kind === "toolInvocation") {
      const state = part.state.get();
      return shouldPinToolInvocationToThinking(state.type, !!IChatToolInvocation.getConfirmationMessages(part), toolInvocationHasMcpAppData(part));
    }
    if (part.kind === "toolInvocationSerialized") {
      return !toolInvocationHasMcpAppData(part);
    }
    return false;
  }
  getLastThinkingPart(renderedParts) {
    if (!renderedParts || renderedParts.length === 0) {
      return void 0;
    }
    for (let i2 = renderedParts.length - 1; i2 >= 0; i2--) {
      const part = renderedParts[i2];
      if (part instanceof ChatThinkingContentPart && part.getIsActive()) {
        return part;
      }
    }
    return void 0;
  }
  getLastThinkingPartForGroupedItem(context2, templateData) {
    const lastThinking = this.getLastThinkingPart(templateData.renderedParts);
    const displayMode = getEffectiveThinkingDisplayMode(this.configService, this.contextKeyService);
    if (lastThinking?.hasReasoningContent() && shouldStartNewCollapsedThinkingGroup(displayMode, "reasoning", "items")) {
      this.finalizeCurrentThinkingPart(context2, templateData);
      return {
        part: void 0,
        separatedFromReasoning: true
      };
    }
    return {
      part: lastThinking,
      separatedFromReasoning: false
    };
  }
  /**
   * Determines if a thinking part at the given content index is "look-ahead complete".
   * A thinking part is look-ahead complete if there are subsequent parts that will NOT
   * be pinned to it, meaning we know this thinking part is already done even though
   * the overall response is still in progress.
   */
  isThinkingLookAheadComplete(context2, element) {
    if (element?.isComplete) {
      return true;
    }
    for (let i2 = context2.contentIndex + 1; i2 < context2.content.length; i2++) {
      const nextPart = context2.content[i2];
      if (!this.shouldPinPart(nextPart, element)) {
        return true;
      }
    }
    return false;
  }
  getSubagentPart(renderedParts, subAgentInvocationId) {
    if (!renderedParts || renderedParts.length === 0) {
      return void 0;
    }
    for (let i2 = renderedParts.length - 1; i2 >= 0; i2--) {
      const part = renderedParts[i2];
      if (part instanceof ChatSubagentContentPart) {
        if (subAgentInvocationId && part.subAgentInvocationId === subAgentInvocationId) {
          return part;
        }
        if (!subAgentInvocationId && part.getIsActive()) {
          return part;
        }
      }
    }
    return void 0;
  }
  finalizeAllSubagentParts(templateData, force = false) {
    if (!templateData.renderedParts) {
      return;
    }
    for (const part of templateData.renderedParts) {
      if (part instanceof ChatSubagentContentPart && part.getIsActive() && (force || !part.shouldRemainActive()) && (force || !part.hasToolsWaitingForConfirmation)) {
        part.markAsInactive(force);
      }
    }
  }
  handleSubagentToolGrouping(toolInvocation, subagentId, context2, templateData, codeBlockStartIndex) {
    this.finalizeCurrentThinkingPart(context2, templateData);
    const lastSubagent = this.getSubagentPart(templateData.renderedParts, subagentId);
    if (lastSubagent) {
      this.maybeRouteSubagentToolToCarousel(toolInvocation, lastSubagent, context2, templateData, codeBlockStartIndex);
      if (!isParentSubagentTool(toolInvocation)) {
        lastSubagent.appendToolInvocation(toolInvocation, codeBlockStartIndex);
        return this.renderNoContent(other => (other.kind === "toolInvocation" || other.kind === "toolInvocationSerialized") && other.toolCallId === toolInvocation.toolCallId);
      }
      return lastSubagent;
    }
    const subagentPart = this.instantiationService.createInstance(ChatSubagentContentPart, subagentId, toolInvocation, context2, this.chatContentMarkdownRenderer, this._contentReferencesListPool, this._toolEditorPool, () => this._currentLayoutWidth.get(), this._announcedToolProgressKeys);
    this.maybeRouteSubagentToolToCarousel(toolInvocation, subagentPart, context2, templateData, codeBlockStartIndex);
    if (!isParentSubagentTool(toolInvocation)) {
      subagentPart.appendToolInvocation(toolInvocation, codeBlockStartIndex);
    }
    return subagentPart;
  }
  /** Routes subagent confirmations to the input carousel and leaves a placeholder inline. */
  maybeRouteSubagentToolToCarousel(toolInvocation, subagentPart, context2, templateData, codeBlockStartIndex) {
    if (!this.configService.getValue("chat.tools.confirmationCarousel.enabled" /* ToolConfirmationCarousel */)) {
      return;
    }
    if (toolInvocation.kind !== "toolInvocation" || !isResponseVM(context2.element)) {
      return;
    }
    if (isParentSubagentTool(toolInvocation) || toolInvocation.presentation === "hidden" || toolInvocation.source.type === "mcp") {
      return;
    }
    if (!!this.viewModel?.editing) {
      return;
    }
    const widget = this.chatWidgetService.getWidgetBySessionResource(context2.element.sessionResource);
    if (!widget) {
      return;
    }
    const subAgentInvocationId = subagentPart.subAgentInvocationId;
    const agentName = subagentPart.getAgentLabel();
    const revealSubagent = targetSubAgentId => {
      const currentTemplateData = this.getTemplateDataForRequestId(context2.element.id);
      const currentSubagentPart = this.getSubagentPart(currentTemplateData?.renderedParts, targetSubAgentId) ?? subagentPart;
      const chatResource = currentSubagentPart.getChatResource();
      if (this.environmentService.isSessionsWindow && chatResource) {
        void this.commandService.executeCommand(CHAT_OPEN_AGENT_HOST_CHAT_COMMAND_ID, {
          chatResource
        });
      } else {
        currentSubagentPart.domNode.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
    };
    const revealSubagentLabel = this.environmentService.isSessionsWindow ? localize("recovered.11375", "Open {0} Chat", agentName) : void 0;
    const navigateToCarousel = targetSubAgentId => {
      widget.inputPart.activateCarouselForSubagent(targetSubAgentId);
    };
    const factory = tool => this.instantiationService.createInstance(ChatToolInvocationPart3, tool, context2, this.chatContentMarkdownRenderer, this._contentReferencesListPool, this._toolEditorPool, () => this._currentLayoutWidth.get(), this._announcedToolProgressKeys, codeBlockStartIndex);
    const addToolToCarousel = tool => {
      widget.inputPart.addToolToConfirmationCarousel(tool, factory, subAgentInvocationId, agentName, revealSubagent, revealSubagentLabel);
      const listener = this.createUpdateWorkingProgressOnConfirmationEnd(tool, templateData);
      if (listener) {
        templateData.elementDisposables.add(listener);
      }
    };
    const shouldUseCarouselForTool = (tool, state) => this.configService.getValue("chat.tools.confirmationCarousel.enabled" /* ToolConfirmationCarousel */) && !this.viewModel?.editing && tool.presentation !== "hidden" && tool.source.type !== "mcp" && state.type === IChatToolInvocation.StateKind.WaitingForConfirmation && !!state.confirmationMessages?.title;
    subagentPart.enableCarouselMode(navigateToCarousel, addToolToCarousel, shouldUseCarouselForTool, widget.inputPart.onDidChangeActiveConfirmationSubagent);
    subagentPart.setConfirmationActive(widget.inputPart.activeConfirmationSubagentId === subAgentInvocationId);
    const toolState = toolInvocation.state.get();
    if (toolState.type === IChatToolInvocation.StateKind.WaitingForConfirmation && toolState.confirmationMessages?.title) {
      addToolToCarousel(toolInvocation);
    }
  }
  finalizeCurrentThinkingPart(context2, templateData) {
    const lastThinking = this.getLastThinkingPart(templateData.renderedParts);
    if (!lastThinking) {
      return;
    }
    const style = getEffectiveThinkingDisplayMode(this.configService, this.contextKeyService);
    if (style === "collapsedPreview" /* CollapsedPreview */) {
      lastThinking.collapseContent();
    }
    lastThinking.finalizeTitleIfDefault();
    lastThinking.resetId();
    lastThinking.markAsInactive();
  }
  renderChatContentPart(content2, templateData, context2) {
    try {
      if (content2.kind === "thinking" && (Array.isArray(content2.value) ? content2.value.length === 0 : content2.value === "")) {
        const lastThinking = this.getLastThinkingPart(templateData.renderedParts);
        lastThinking?.resetId();
        return this.renderNoContent(other => content2.kind === other.kind);
      }
      const isResponseElement = isResponseVM(context2.element);
      const shouldPin = this.shouldPinPart(content2, isResponseElement ? context2.element : void 0);
      if (context2.element.isComplete && !shouldPin) {
        const elementTemplateData = this.getTemplateDataForRequestId(context2.element.id);
        if (elementTemplateData?.renderedParts) {
          const lastThinking = this.getLastThinkingPart(elementTemplateData.renderedParts);
          if (lastThinking?.getIsActive()) {
            this.finalizeCurrentThinkingPart(context2, elementTemplateData);
          }
        }
      }
      const isSubagentContent = (content2.kind === "toolInvocation" || content2.kind === "toolInvocationSerialized") && isSubagentToolInvocation(content2);
      if (context2.element.isComplete && !isSubagentContent) {
        const elementTemplateData = this.getTemplateDataForRequestId(context2.element.id);
        if (elementTemplateData) {
          this.finalizeAllSubagentParts(elementTemplateData);
        }
      }
      if (content2.kind === "treeData") {
        return this.renderTreeData(content2, templateData, context2);
      } else if (content2.kind === "multiDiffData") {
        return this.renderMultiDiffData(content2, templateData, context2);
      } else if (content2.kind === "progressMessage") {
        return this.instantiationService.createInstance(ChatProgressContentPart, content2, this.chatContentMarkdownRenderer, context2, void 0, void 0, void 0, void 0, content2.shimmer);
      } else if (content2.kind === "systemNotification") {
        return this.instantiationService.createInstance(ChatSystemNotificationContentPart, content2, this.chatContentMarkdownRenderer);
      } else if (content2.kind === "working") {
        return this.instantiationService.createInstance(ChatWorkingProgressContentPart, content2, this.chatContentMarkdownRenderer, context2);
      } else if (content2.kind === "progressTask" || content2.kind === "progressTaskSerialized") {
        return this.renderProgressTask(content2, templateData, context2);
      } else if (content2.kind === "command") {
        return this.instantiationService.createInstance(ChatCommandButtonContentPart, content2, context2);
      } else if (content2.kind === "textEditGroup") {
        return this.renderTextEdit(context2, content2, templateData);
      } else if (content2.kind === "confirmation") {
        return this.renderConfirmation(context2, content2, templateData);
      } else if (content2.kind === "warning") {
        return this.instantiationService.createInstance(ChatErrorContentPart, 1 /* Warning */, content2.content, content2, this.chatContentMarkdownRenderer);
      } else if (content2.kind === "info") {
        return this.instantiationService.createInstance(ChatErrorContentPart, 0 /* Info */, content2.content, content2, this.chatContentMarkdownRenderer);
      } else if (content2.kind === "hook") {
        return this.renderHookPart(content2, context2, templateData);
      } else if (content2.kind === "markdownContent") {
        return this.renderMarkdown(content2, templateData, context2);
      } else if (content2.kind === "references") {
        if (isResponseVM(context2.element) && context2.element.agent?.isDefault && !context2.element.agent.modes.includes("ask" /* Ask */)) {
          return this.renderNoContent(other => other.kind === content2.kind);
        }
        return this.renderContentReferencesListData(content2, void 0, context2, templateData);
      } else if (content2.kind === "codeCitations") {
        return this.renderCodeCitations(content2, context2, templateData);
      } else if (content2.kind === "toolInvocation" || content2.kind === "toolInvocationSerialized") {
        return this.renderToolInvocation(content2, context2, templateData);
      } else if (content2.kind === "extensions") {
        return this.renderExtensionsContent(content2, context2, templateData);
      } else if (content2.kind === "pullRequest") {
        return this.renderPullRequestContent(content2, context2, templateData);
      } else if (content2.kind === "undoStop") {
        return this.renderUndoStop(content2);
      } else if (content2.kind === "errorDetails") {
        return this.renderChatErrorDetails(context2, content2, templateData);
      } else if (content2.kind === "elicitation2" || content2.kind === "elicitationSerialized") {
        return this.renderElicitation(context2, content2, templateData);
      } else if (content2.kind === "questionCarousel") {
        return this.renderQuestionCarousel(context2, content2, templateData);
      } else if (content2.kind === "planReview") {
        return this.renderPlanReview(context2, content2, templateData);
      } else if (content2.kind === "changesSummary") {
        return this.renderChangesSummary(content2, context2, templateData);
      } else if (content2.kind === "turnPills") {
        return this.renderTurnPills(content2, context2);
      } else if (content2.kind === "mcpServersStarting") {
        return this.renderMcpServersInteractionRequired(content2, context2, templateData);
      } else if (content2.kind === "mcpAuthenticationRequired") {
        return this.instantiationService.createInstance(ChatMcpAuthenticationContentPart, content2);
      } else if (content2.kind === "mcpServersStartingSlow") {
        return this.instantiationService.createInstance(ChatMcpServersStartingContentPart, content2, {
          onDidFinishStarting: () => this.showWorkingProgressAfterMcp(context2, templateData)
        });
      } else if (content2.kind === "disabledClaudeHooks") {
        return this.renderDisabledClaudeHooks(content2, context2);
      } else if (content2.kind === "thinking") {
        return this.renderThinkingPart(content2, context2, templateData);
      } else if (content2.kind === "workspaceEdit") {
        return this.instantiationService.createInstance(ChatWorkspaceEditContentPart, content2, context2, this.chatContentMarkdownRenderer);
      } else if (content2.kind === "externalEdit") {
        return this.renderExternalEdit(content2, context2, templateData);
      } else if (content2.kind === "autoModeResolution") {
        return this.instantiationService.createInstance(ChatAutoModeResolutionContentPart, content2, context2, this.chatContentMarkdownRenderer);
      }
      return this.renderNoContent(other => content2.kind === other.kind);
    } catch (err) {
      alert(`Chat error: ${toErrorMessage(err, false)}`);
      this.logService.error("ChatListItemRenderer#renderChatContentPart: error rendering content", toErrorMessage(err, true));
      const errorPart = this.instantiationService.createInstance(ChatErrorContentPart, 2 /* Error */, new MarkdownString(localize("recovered.11378", "Failed to render content") + `: ${toErrorMessage(err, false)}`), content2, this.chatContentMarkdownRenderer);
      return {
        dispose: () => errorPart.dispose(),
        domNode: errorPart.domNode,
        hasSameContent: other => content2.kind === other.kind
      };
    }
  }
  showWorkingProgressAfterMcp(context2, templateData) {
    const originalElement = context2.element;
    const originalRenderedParts = templateData.renderedParts;
    queueMicrotask(() => {
      if (!isResponseVM(originalElement) || templateData.currentElement !== originalElement || originalElement.isComplete || originalElement.isCanceled) {
        return;
      }
      if (!originalRenderedParts || templateData.renderedParts !== originalRenderedParts || originalRenderedParts.some(part => part instanceof ChatWorkingProgressContentPart)) {
        return;
      }
      this.renderChatResponseBasic(originalElement, context2.elementIndex, templateData);
      this.fireItemHeightChange(templateData);
    });
  }
  dispose() {
    this._announcedToolProgressKeys.clear();
    super.dispose();
  }
  renderChatErrorDetails(context2, content2, templateData) {
    if (!isResponseVM(context2.element)) {
      return this.renderNoContent(other => content2.kind === other.kind);
    }
    const isLast = content2.isLast;
    if (content2.errorDetails.isQuotaExceeded) {
      const renderedError = this.instantiationService.createInstance(ChatQuotaExceededPart, context2.element, content2, this.chatContentMarkdownRenderer);
      return renderedError;
    } else if (content2.errorDetails.isRateLimited && this.chatEntitlementService.anonymous) {
      const renderedError = this.instantiationService.createInstance(ChatAnonymousRateLimitedPart, content2);
      return renderedError;
    } else if (content2.errorDetails.confirmationButtons && isLast) {
      const level = content2.errorDetails.level ?? 2 /* Error */;
      const errorConfirmation = this.instantiationService.createInstance(ChatErrorConfirmationContentPart, level, new MarkdownString(content2.errorDetails.message), content2, content2.errorDetails.confirmationButtons, this.chatContentMarkdownRenderer, context2);
      return errorConfirmation;
    } else {
      const level = content2.errorDetails.level ?? 2 /* Error */;
      return this.instantiationService.createInstance(ChatErrorContentPart, level, new MarkdownString(content2.errorDetails.message), content2, this.chatContentMarkdownRenderer);
    }
  }
  renderUndoStop(content2) {
    return this.renderNoContent(other => other.kind === content2.kind && other.id === content2.id);
  }
  renderNoContent(equals5) {
    return {
      dispose: () => {},
      domNode: void 0,
      hasSameContent: equals5
    };
  }
  renderTreeData(content2, templateData, context2) {
    const data = content2.treeData;
    const treePart = this.instantiationService.createInstance(ChatTreeContentPart, data, this._treePool);
    if (isResponseVM(context2.element)) {
      const fileTreeFocusInfo = {
        treeDataId: data.uri.toString(),
        treeIndex: context2.treeStartIndex,
        focus() {
          treePart.domFocus();
        }
      };
      treePart.addDisposable(treePart.onDidFocus(() => {
        this.focusedFileTreesByResponseId.set(context2.element.id, fileTreeFocusInfo.treeIndex);
      }));
      const fileTrees = this.fileTreesByResponseId.get(context2.element.id) ?? [];
      fileTrees.push(fileTreeFocusInfo);
      this.fileTreesByResponseId.set(context2.element.id, distinct(fileTrees, v2 => v2.treeDataId));
      treePart.addDisposable(toDisposable(() => this.fileTreesByResponseId.set(context2.element.id, fileTrees.filter(v2 => v2.treeDataId !== data.uri.toString()))));
    }
    return treePart;
  }
  renderMultiDiffData(content2, templateData, context2) {
    const multiDiffPart = this.instantiationService.createInstance(ChatMultiDiffContentPart, content2, context2.element);
    return multiDiffPart;
  }
  renderContentReferencesListData(references, labelOverride, context2, templateData) {
    const referencesPart = this.instantiationService.createInstance(ChatUsedReferencesListContentPart, references.references, labelOverride, context2, this._contentReferencesListPool, {
      expandedWhenEmptyResponse: checkModeOption(this.delegate.currentChatMode(), this.rendererOptions.referencesExpandedWhenEmptyResponse)
    });
    return referencesPart;
  }
  renderCodeCitations(citations, context2, templateData) {
    const citationsPart = this.instantiationService.createInstance(ChatCodeCitationContentPart, citations, context2);
    return citationsPart;
  }
  handleRenderedCodeblocks(element, part, codeBlockStartIndex) {
    if (!part.addDisposable || part.codeblocksPartId === void 0) {
      return;
    }
    const codeBlocksByResponseId = this.codeBlocksByResponseId.get(element.id) ?? [];
    this.codeBlocksByResponseId.set(element.id, codeBlocksByResponseId);
    part.addDisposable(toDisposable(() => {
      const codeBlocksByResponseId2 = this.codeBlocksByResponseId.get(element.id);
      if (codeBlocksByResponseId2) {
        part.codeblocks?.forEach((info, i2) => {
          const codeblock = codeBlocksByResponseId2[codeBlockStartIndex + i2];
          if (codeblock?.ownerMarkdownPartId === part.codeblocksPartId) {
            delete codeBlocksByResponseId2[codeBlockStartIndex + i2];
          }
        });
      }
    }));
    part.codeblocks?.forEach((info, i2) => {
      codeBlocksByResponseId[codeBlockStartIndex + i2] = info;
      const uri5 = info.uri;
      if (uri5) {
        this.codeBlocksByEditorUri.set(uri5, info);
        part.addDisposable(toDisposable(() => {
          const codeblock = this.codeBlocksByEditorUri.get(uri5);
          if (codeblock?.ownerMarkdownPartId === part.codeblocksPartId) {
            this.codeBlocksByEditorUri.delete(uri5);
          }
        }));
      }
    });
  }
  renderToolInvocation(toolInvocation, context2, templateData) {
    if (IChatToolInvocation.isComplete(toolInvocation) && IChatToolInvocation.isEffectivelyHidden(toolInvocation)) {
      const msg = toolInvocation.pastTenseMessage ?? toolInvocation.invocationMessage;
      const text2 = typeof msg === "string" ? msg : msg?.value;
      if (!text2 || text2.trim().length === 0) {
        return this.renderNoContent(other => (other.kind === "toolInvocation" || other.kind === "toolInvocationSerialized") && other.toolCallId === toolInvocation.toolCallId);
      }
    }
    if (this.configService.getValue("chat.agent.thinking.collapsedTools") === "off" /* Off */) {
      this.finalizeCurrentThinkingPart(context2, templateData);
    }
    const codeBlockStartIndex = context2.codeBlockStartIndex;
    let lazilyCreatedPart = void 0;
    const createToolPart = () => {
      lazilyCreatedPart = this.instantiationService.createInstance(ChatToolInvocationPart3, toolInvocation, context2, this.chatContentMarkdownRenderer, this._contentReferencesListPool, this._toolEditorPool, () => this._currentLayoutWidth.get(), this._announcedToolProgressKeys, codeBlockStartIndex);
      this.handleRenderedCodeblocks(context2.element, lazilyCreatedPart, codeBlockStartIndex);
      return {
        domNode: lazilyCreatedPart.domNode,
        disposable: lazilyCreatedPart,
        part: lazilyCreatedPart
      };
    };
    const collapsedToolsMode = this.configService.getValue("chat.agent.thinking.collapsedTools");
    if (isResponseVM(context2.element) && collapsedToolsMode !== "off" /* Off */) {
      const {
        part: lastThinking,
        separatedFromReasoning
      } = this.getLastThinkingPartForGroupedItem(context2, templateData);
      if (!lastThinking && !IChatToolInvocation.isEffectivelyHidden(toolInvocation) && this.shouldPinPart(toolInvocation, context2.element) && shouldCreateGroupedThinkingPart(collapsedToolsMode, separatedFromReasoning)) {
        const thinkingPart = this.renderThinkingPart({
          kind: "thinking"
        }, context2, templateData);
        if (thinkingPart instanceof ChatThinkingContentPart) {
          toolInvocation.isAttachedToThinking = true;
          thinkingPart.appendItem(createToolPart, toolInvocation.toolId, toolInvocation, templateData.value);
          this.setupConfirmationTransitionWatcher(toolInvocation, thinkingPart, () => lazilyCreatedPart, createToolPart, context2, templateData);
        }
        return thinkingPart;
      }
      if (this.shouldPinPart(toolInvocation, context2.element)) {
        if (lastThinking && !IChatToolInvocation.isEffectivelyHidden(toolInvocation)) {
          toolInvocation.isAttachedToThinking = true;
          lastThinking.appendItem(createToolPart, toolInvocation.toolId, toolInvocation, templateData.value);
          this.setupConfirmationTransitionWatcher(toolInvocation, lastThinking, () => lazilyCreatedPart, createToolPart, context2, templateData);
          return this.renderNoContent((other, followingContent, element) => lazilyCreatedPart ? lazilyCreatedPart.hasSameContent(other, followingContent, element) : toolInvocation.kind === other.kind);
        }
      } else {
        this.finalizeCurrentThinkingPart(context2, templateData);
      }
    }
    const subagentId = getSubagentId(toolInvocation);
    if (subagentId && isResponseVM(context2.element) && !IChatToolInvocation.isEffectivelyHidden(toolInvocation)) {
      return this.handleSubagentToolGrouping(toolInvocation, subagentId, context2, templateData, codeBlockStartIndex);
    }
    const {
      part
    } = createToolPart();
    if (this.configService.getValue("chat.tools.confirmationCarousel.enabled" /* ToolConfirmationCarousel */) && toolInvocation.kind === "toolInvocation" && isResponseVM(context2.element) && toolInvocation.source.type !== "mcp" && !this.viewModel?.editing) {
      const widget = this.chatWidgetService.getWidgetBySessionResource(context2.element.sessionResource);
      if (widget) {
        const factory = tool => this.instantiationService.createInstance(ChatToolInvocationPart3, tool, context2, this.chatContentMarkdownRenderer, this._contentReferencesListPool, this._toolEditorPool, () => this._currentLayoutWidth.get(), this._announcedToolProgressKeys, codeBlockStartIndex);
        const routePartToCarousel = () => {
          widget.inputPart.addToolToConfirmationCarousel(toolInvocation, factory);
          hide(part.domNode);
          return true;
        };
        let hasScheduledCarouselRoute = false;
        const scheduleRoutePartToCarousel = () => {
          if (hasScheduledCarouselRoute) {
            return;
          }
          hasScheduledCarouselRoute = true;
          part.addDisposable(scheduleAtNextAnimationFrame(getWindow(part.domNode), () => {
            hasScheduledCarouselRoute = false;
            const state = toolInvocation.state.get();
            if (state.type === IChatToolInvocation.StateKind.WaitingForConfirmation && state.confirmationMessages?.title && toolInvocation.presentation !== "hidden" && toolInvocation.source.type !== "mcp" && !this.viewModel?.editing) {
              routePartToCarousel();
            }
          }));
        };
        part.addDisposable(autorun(reader => {
          const state = toolInvocation.state.read(reader);
          const isCarouselConfirmation = state.type === IChatToolInvocation.StateKind.WaitingForConfirmation && !!state.confirmationMessages?.title && toolInvocation.presentation !== "hidden" && toolInvocation.source.type !== "mcp" && !this.viewModel?.editing;
          if (isCarouselConfirmation) {
            if (!routePartToCarousel()) {
              hide(part.domNode);
              scheduleRoutePartToCarousel();
            }
          } else if (IChatToolInvocation.isEffectivelyHidden(toolInvocation, reader)) {
            this.updateWorkingProgressForPendingConfirmations(templateData);
            hide(part.domNode);
          } else {
            this.updateWorkingProgressForPendingConfirmations(templateData);
            show(part.domNode);
          }
        }));
      }
    }
    return part;
  }
  // watch for confirmation part transition when tool invocation is streaming
  setupConfirmationTransitionWatcher(toolInvocation, thinkingPart, getCreatedPart, createToolPart, context2, templateData) {
    if (toolInvocation.kind !== "toolInvocation") {
      return;
    }
    const moveConfirmationWidgetOutOfThinking = () => {
      const createdPart = getCreatedPart();
      toolInvocation.isAttachedToThinking = false;
      let part;
      if (createdPart?.domNode) {
        part = createdPart;
        const wrapper = createdPart.domNode.parentElement;
        if (wrapper?.classList.contains("chat-thinking-tool-wrapper")) {
          wrapper.remove();
        }
        templateData.value.appendChild(createdPart.domNode);
        thinkingPart.removeMaterializedItem(toolInvocation.toolCallId);
        (templateData.movedOutToolParts ??= new DisposableMap()).set(toolInvocation.toolCallId, createdPart);
      } else {
        thinkingPart.removeLazyItem(toolInvocation.toolId);
        const {
          domNode,
          part: createdPart2
        } = createToolPart();
        part = createdPart2;
        (templateData.movedOutToolParts ??= new DisposableMap()).set(toolInvocation.toolCallId, createdPart2);
        templateData.value.appendChild(domNode);
      }
      this.finalizeCurrentThinkingPart(context2, templateData);
      if (thinkingPart.isEffectivelyEmpty()) {
        thinkingPart.domNode?.remove();
        thinkingPart.dispose();
      }
      return part;
    };
    const isWorkingState = type => type === IChatToolInvocation.StateKind.Streaming || type === IChatToolInvocation.StateKind.Executing;
    const tryRouteConfirmationToCarousel = () => {
      if (!this.configService.getValue("chat.tools.confirmationCarousel.enabled" /* ToolConfirmationCarousel */) || !isResponseVM(context2.element) || this.viewModel?.editing || toolInvocation.presentation === "hidden" || toolInvocation.source.type === "mcp") {
        return false;
      }
      const state = toolInvocation.state.get();
      if (state.type !== IChatToolInvocation.StateKind.WaitingForConfirmation || !state.confirmationMessages?.title) {
        return false;
      }
      const widget = this.chatWidgetService.getWidgetBySessionResource(context2.element.sessionResource);
      if (!widget) {
        return false;
      }
      const part = moveConfirmationWidgetOutOfThinking();
      const factory = tool => this.instantiationService.createInstance(ChatToolInvocationPart3, tool, context2, this.chatContentMarkdownRenderer, this._contentReferencesListPool, this._toolEditorPool, () => this._currentLayoutWidth.get(), this._announcedToolProgressKeys, context2.codeBlockStartIndex);
      part.addDisposable(autorun(reader => {
        const currentState2 = toolInvocation.state.read(reader);
        if (currentState2.type === IChatToolInvocation.StateKind.WaitingForConfirmation && currentState2.confirmationMessages?.title) {
          widget.inputPart.addToolToConfirmationCarousel(toolInvocation, factory);
          hide(part.domNode);
        } else if (IChatToolInvocation.isEffectivelyHidden(toolInvocation, reader)) {
          this.updateWorkingProgressForPendingConfirmations(templateData);
          hide(part.domNode);
        } else {
          this.updateWorkingProgressForPendingConfirmations(templateData);
          show(part.domNode);
        }
      }));
      return true;
    };
    const currentState = toolInvocation.state.get();
    if (toolInvocationHasMcpAppData(toolInvocation)) {
      moveConfirmationWidgetOutOfThinking();
      return;
    }
    if (currentState.type === IChatToolInvocation.StateKind.WaitingForConfirmation) {
      if (!tryRouteConfirmationToCarousel()) {
        moveConfirmationWidgetOutOfThinking();
      }
      return;
    }
    if (currentState.type === IChatToolInvocation.StateKind.WaitingForPostApproval) {
      moveConfirmationWidgetOutOfThinking();
      return;
    }
    if (!isWorkingState(currentState.type)) {
      return;
    }
    let didMoveToolOut = false;
    const disposable = autorun(reader => {
      const state = toolInvocation.state.read(reader);
      toolInvocation.toolSpecificDataKind.read(reader);
      if (toolInvocationHasMcpAppData(toolInvocation)) {
        if (didMoveToolOut) {
          return;
        }
        didMoveToolOut = true;
        disposable.dispose();
        moveConfirmationWidgetOutOfThinking();
        return;
      }
      if (state.type === IChatToolInvocation.StateKind.WaitingForConfirmation || state.type === IChatToolInvocation.StateKind.WaitingForPostApproval) {
        if (didMoveToolOut) {
          return;
        }
        didMoveToolOut = true;
        disposable.dispose();
        if (state.type !== IChatToolInvocation.StateKind.WaitingForConfirmation || !tryRouteConfirmationToCarousel()) {
          moveConfirmationWidgetOutOfThinking();
        }
      }
    });
    thinkingPart.addDisposable(disposable);
  }
  renderExtensionsContent(extensionsContent, context2, templateData) {
    const part = this.instantiationService.createInstance(ChatExtensionsContentPart, extensionsContent);
    return part;
  }
  renderHookPart(hookPart, context2, templateData) {
    if (!(hookPart.stopReason || hookPart.systemMessage)) {
      return this.renderNoContent(other => other.kind === "hook" && other.hookType === hookPart.hookType);
    }
    if (hookPart.subAgentInvocationId) {
      const subagentPart = this.getSubagentPart(templateData.renderedParts, hookPart.subAgentInvocationId);
      if (subagentPart) {
        subagentPart.appendHookItem(() => {
          const part2 = this.instantiationService.createInstance(ChatHookContentPart, hookPart, context2);
          return {
            domNode: part2.domNode,
            disposable: part2
          };
        }, hookPart);
        return this.renderNoContent(other => other.kind === "hook" && other.hookType === hookPart.hookType && other.subAgentInvocationId === hookPart.subAgentInvocationId);
      }
    }
    const shouldPinToThinking = hookPart.hookType === "PreToolUse" /* PreToolUse */ || hookPart.hookType === "PostToolUse" /* PostToolUse */;
    if (shouldPinToThinking) {
      const hookTitle = hookPart.stopReason ? hookPart.toolDisplayName ? localize("recovered.11371", "Blocked {0}", hookPart.toolDisplayName) : localize("recovered.11372", "Blocked by hook") : hookPart.toolDisplayName ? localize("recovered.11373", "Used {0}, but received a warning", hookPart.toolDisplayName) : localize("recovered.11374", "Tool call received a warning");
      let {
        part: thinkingPart
      } = this.getLastThinkingPartForGroupedItem(context2, templateData);
      if (!thinkingPart) {
        const newThinking = this.renderThinkingPart({
          kind: "thinking"
        }, context2, templateData);
        if (newThinking instanceof ChatThinkingContentPart) {
          thinkingPart = newThinking;
        }
      }
      if (thinkingPart) {
        thinkingPart.appendItem(() => {
          const part2 = this.instantiationService.createInstance(ChatHookContentPart, hookPart, context2);
          return {
            domNode: part2.domNode,
            disposable: part2
          };
        }, hookTitle, void 0, templateData.value);
        return thinkingPart;
      }
    }
    const part = this.instantiationService.createInstance(ChatHookContentPart, hookPart, context2);
    return part;
  }
  renderPullRequestContent(pullRequestContent, context2, templateData) {
    const part = this.instantiationService.createInstance(ChatPullRequestContentPart, pullRequestContent);
    return part;
  }
  renderProgressTask(task, templateData, context2) {
    if (!isResponseVM(context2.element)) {
      return;
    }
    this.finalizeCurrentThinkingPart(context2, templateData);
    const taskPart = this.instantiationService.createInstance(ChatTaskContentPart, task, this._contentReferencesListPool, this.chatContentMarkdownRenderer, context2);
    return taskPart;
  }
  renderConfirmation(context2, confirmation, templateData) {
    const part = this.instantiationService.createInstance(ChatConfirmationContentPart, confirmation, context2);
    return part;
  }
  renderElicitation(context2, elicitation, templateData) {
    if (elicitation.kind === "elicitationSerialized" ? elicitation.isHidden : elicitation.isHidden?.get()) {
      return this.renderNoContent(other => elicitation.kind === other.kind);
    }
    this.finalizeCurrentThinkingPart(context2, templateData);
    const part = this.instantiationService.createInstance(ChatElicitationContentPart, elicitation, context2);
    return part;
  }
  renderQuestionCarousel(context2, carousel, templateData) {
    this.finalizeCurrentThinkingPart(context2, templateData);
    this._notifyOnQuestionCarousel(context2, carousel);
    if (!carousel.terminalId && isResponseVM(context2.element)) {
      const responseElement = context2.element;
      const model = this.chatService.getSession(responseElement.sessionResource);
      const request2 = model?.getRequests().find(r2 => r2.id === responseElement.requestId);
      if (request2?.terminalExecutionId) {
        carousel.terminalId = request2.terminalExecutionId;
        this.logService.trace(`ChatListItemRenderer#renderQuestionCarousel: backfilled terminalId=${carousel.terminalId} for request=${responseElement.requestId}`);
      } else {
        this.logService.trace(`ChatListItemRenderer#renderQuestionCarousel: no terminalExecutionId to backfill for request=${responseElement.requestId}`);
      }
    }
    const widget = isResponseVM(context2.element) ? this.chatWidgetService.getWidgetBySessionResource(context2.element.sessionResource) : void 0;
    const shouldAutoFocus = !!widget && isAncestorOfActiveElement(widget.domNode) && widget.getInput() === "";
    const responseId = isResponseVM(context2.element) ? context2.element.requestId : void 0;
    const carouselKey = carousel.resolveId ?? `${responseId ?? ""}_${context2.contentIndex}`;
    const handleSubmit = async (answers, part2) => {
      const answersRecord = answers ? Object.fromEntries(answers) : void 0;
      carousel.data = answersRecord ?? {};
      carousel.isUsed = true;
      if (carousel instanceof ChatQuestionCarouselData) {
        carousel.draftAnswers = void 0;
        carousel.draftCurrentIndex = void 0;
        carousel.completion.complete({
          answers: answersRecord
        });
      }
      if (isResponseVM(context2.element) && carousel.resolveId) {
        this.chatService.notifyQuestionCarouselAnswer(context2.element.requestId, carousel.resolveId, answersRecord);
      }
      this.removeCarouselFromTracking(context2, part2);
      widget?.input.clearQuestionCarousel(void 0, carouselKey);
    };
    const responseIsComplete = isResponseVM(context2.element) && context2.element.isComplete;
    const inputPartHasCarousel = widget?.input.questionCarousel !== void 0;
    if (carousel.isUsed || responseIsComplete) {
      if (responseIsComplete && !carousel.isUsed && isResponseVM(context2.element) && carousel.resolveId) {
        carousel.data = {};
        carousel.isUsed = true;
        if (carousel instanceof ChatQuestionCarouselData) {
          carousel.draftAnswers = void 0;
          carousel.draftCurrentIndex = void 0;
          carousel.completion.complete({
            answers: void 0
          });
        }
        this.chatService.notifyQuestionCarouselAnswer(context2.element.requestId, carousel.resolveId, void 0);
        this.pendingQuestionCarousels.get(context2.element.sessionResource)?.clear();
      }
      if (inputPartHasCarousel) {
        if (carousel.isUsed) {
          widget?.input.clearQuestionCarousel(void 0, carouselKey);
        } else if (responseIsComplete && responseId) {
          widget?.input.clearQuestionCarousel(responseId);
        }
      }
      const part2 = this.instantiationService.createInstance(ChatQuestionCarouselPart, carousel, context2, {
        shouldAutoFocus: false,
        onSubmit: async answers => handleSubmit(answers, part2)
      });
      return part2;
    }
    const isEditing = !!this.viewModel?.editing;
    const part = isEditing ? void 0 : widget?.input.renderQuestionCarousel(carousel, context2, {
      shouldAutoFocus,
      onSubmit: async answers => handleSubmit(answers, part)
    });
    if (!part) {
      const fallbackPart = this.instantiationService.createInstance(ChatQuestionCarouselPart, carousel, context2, {
        shouldAutoFocus,
        onSubmit: async answers => handleSubmit(answers, fallbackPart)
      });
      return fallbackPart;
    }
    if (isResponseVM(context2.element) && carousel.allowSkip && !carousel.isUsed) {
      let carousels = this.pendingQuestionCarousels.get(context2.element.sessionResource);
      if (!carousels) {
        carousels = /* @__PURE__ */new Set();
        this.pendingQuestionCarousels.set(context2.element.sessionResource, carousels);
      }
      if (!carousels.has(part)) {
        carousels.add(part);
        part.addDisposable({
          dispose: () => this.removeCarouselFromTracking(context2, part)
        });
      }
    }
    return this.renderNoContent((other, _followingContent, element) => {
      if (carousel.isUsed || isResponseVM(element) && element.isComplete) {
        return false;
      }
      if (other.kind === "questionCarousel") {
        const otherCarousel = other;
        if (carousel.resolveId && otherCarousel.resolveId) {
          return carousel.resolveId === otherCarousel.resolveId;
        }
        return other === carousel;
      }
      return false;
    });
  }
  _getCarouselStableKey(context2, carousel) {
    const requestId = isResponseVM(context2.element) ? context2.element.requestId : void 0;
    if (!requestId || !carousel.resolveId) {
      return void 0;
    }
    return `${requestId}::${carousel.resolveId}`;
  }
  _notifyOnQuestionCarousel(context2, carousel) {
    if (carousel.isUsed) {
      return;
    }
    const stableKey = this._getCarouselStableKey(context2, carousel);
    if (stableKey ? this._notifiedQuestionCarousels.has(stableKey) : false) {
      return;
    }
    const questionCount = carousel.questions.length;
    const question = carousel.questions.length > 0 && carousel.questions[0].message ? carousel.questions[0].message : localize("recovered.11357", "Chat input required.");
    const stringQuestion = typeof question === "string" ? question : question.value;
    const alertMessage = questionCount === 1 ? localize("recovered.11356", "Chat input required (1 question): {0}", stringQuestion) : localize("recovered.11355", "Chat input required ({0} questions): {1}", questionCount, stringQuestion);
    this.accessibilityService.alert(alertMessage);
    if (stableKey) {
      this._notifiedQuestionCarousels.add(stableKey);
    }
    const signalMessage = questionCount === 1 ? localize("recovered.11359", "Chat needs your input (1 question).") : localize("recovered.11358", "Chat needs your input ({0} questions).", questionCount);
    this.accessibilitySignalService.playSignal(AccessibilitySignal.chatUserActionRequired, {
      allowManyInParallel: true,
      customAlertMessage: signalMessage
    });
  }
  renderPlanReview(context2, review, templateData) {
    const widget = isResponseVM(context2.element) ? this.chatWidgetService.getWidgetBySessionResource(context2.element.sessionResource) : void 0;
    const responseId = isResponseVM(context2.element) ? context2.element.requestId : void 0;
    const reviewKey = review.resolveId ?? `${responseId ?? ""}_${context2.contentIndex}`;
    this.finalizeCurrentThinkingPart(context2, templateData);
    const handleSubmit = result => {
      review.data = result;
      review.isUsed = true;
      if (review instanceof ChatPlanReviewData) {
        review.completion.complete(result);
      }
      widget?.input.clearPlanReview(void 0, reviewKey);
    };
    const responseIsComplete = isResponseVM(context2.element) && context2.element.isComplete;
    if (responseIsComplete && !review.isUsed) {
      review.isUsed = true;
      if (review instanceof ChatPlanReviewData) {
        review.completion.complete(void 0);
      }
    }
    if (responseIsComplete && responseId) {
      widget?.input.clearPlanReview(responseId);
    }
    const renderProgress = () => {
      const message = this.getPlanReviewProgressMessage(review);
      if (!message) {
        return this.renderNoContent(other => other.kind === "planReview");
      }
      const renderedAsUsed = !!review.isUsed;
      const isPending = !renderedAsUsed;
      const content2 = buildPlanReviewProgressContent(review, message);
      const progressPart = this.instantiationService.createInstance(ChatProgressContentPart, {
        content: content2
      }, this.chatContentMarkdownRenderer, context2, /* forceShowSpinner */
      isPending, /* forceShowMessage */
      true, /* icon */
      isPending ? void 0 : Codicon.check, void 0, /* shimmer */
      isPending);
      return {
        domNode: progressPart.domNode,
        dispose: () => progressPart.dispose(),
        hasSameContent: (other, _followingContent, _element) => {
          if (other.kind !== "planReview") {
            return false;
          }
          if (!!review.isUsed !== renderedAsUsed) {
            return false;
          }
          if (review.resolveId && other.resolveId) {
            return review.resolveId === other.resolveId;
          }
          return other === review;
        }
      };
    };
    if (review.isUsed) {
      return renderProgress();
    }
    const isEditing = !!this.viewModel?.editing;
    const dockedPart = isEditing ? void 0 : widget?.input.renderPlanReview(review, context2, {
      onSubmit: handleSubmit
    });
    if (!dockedPart) {
      const fallbackPart = this.instantiationService.createInstance(ChatPlanReviewPart, review, context2, {
        onSubmit: handleSubmit
      });
      return fallbackPart;
    }
    return renderProgress();
  }
  getPlanReviewProgressMessage(review) {
    if (!review.isUsed) {
      return localize("recovered.11354", "Plan review required");
    }
    const result = review.data;
    if (!result) {
      return void 0;
    }
    if (result.rejected) {
      return localize("recovered.11353", "Rejected plan");
    }
    if (result.feedback) {
      return localize("recovered.11349", "Provided feedback");
    }
    const action = review.actions.find(a => a.label === result.action);
    if (action?.permissionLevel === "autopilot") {
      return localize("recovered.11348", "Started implementation with Autopilot");
    }
    return localize("recovered.11347", "Approved plan");
  }
  removeCarouselFromTracking(context2, part) {
    if (isResponseVM(context2.element)) {
      const carousels = this.pendingQuestionCarousels.get(context2.element.sessionResource);
      if (carousels) {
        carousels.delete(part);
      }
    }
  }
  renderChangesSummary(content2, context2, templateData) {
    const part = this.instantiationService.createInstance(ChatCheckpointFileChangesSummaryContentPart, content2, context2);
    return part;
  }
  renderTurnPills(content2, context2) {
    return this.instantiationService.createInstance(ChatTurnPillsContentPart, content2, context2);
  }
  renderAttachments(variables, contentReferences, modelId, templateData, resolvedModelId) {
    return this.instantiationService.createInstance(ChatAttachmentsContentPart, {
      variables,
      contentReferences,
      modelId,
      resolvedModelId,
      domNode: void 0
    });
  }
  renderTextEdit(context2, chatTextEdit, templateData) {
    const textEditPart = this.instantiationService.createInstance(ChatTextEditContentPart, chatTextEdit, context2, this.rendererOptions, this._diffEditorPool, this._currentLayoutWidth.get());
    return textEditPart;
  }
  renderExternalEdit(content2, context2, templateData) {
    const editPart = this.instantiationService.createInstance(ChatExternalEditContentPart, content2, context2);
    const collapsedToolsMode = this.configService.getValue("chat.agent.thinking.collapsedTools");
    if (isResponseVM(context2.element) && collapsedToolsMode !== "off" /* Off */ && this.shouldPinPart(content2, context2.element)) {
      const partId = `externalEdit-${content2.uri.toString()}-${content2.undoStopId ?? ""}`;
      const {
        part: lastThinking,
        separatedFromReasoning
      } = this.getLastThinkingPartForGroupedItem(context2, templateData);
      if (!lastThinking && shouldCreateGroupedThinkingPart(collapsedToolsMode, separatedFromReasoning)) {
        const thinkingPart = this.renderThinkingPart({
          kind: "thinking"
        }, context2, templateData);
        if (thinkingPart instanceof ChatThinkingContentPart) {
          thinkingPart.appendItem(() => ({
            domNode: editPart.domNode,
            disposable: editPart
          }), partId, content2, templateData.value, editPart.onDidChangeDiff, editPart);
        }
        return thinkingPart;
      }
      if (lastThinking) {
        lastThinking.appendItem(() => ({
          domNode: editPart.domNode,
          disposable: editPart
        }), partId, content2, templateData.value, editPart.onDidChangeDiff, editPart);
        return this.renderNoContent(other => other.kind === content2.kind);
      }
    }
    return editPart;
  }
  renderMarkdown(markdown, templateData, context2) {
    const element = context2.element;
    const isBlankMarkdown = !markdown.content.value.trim();
    const hasPendingEditCodeblock = isResponseVM(element) && !element.isComplete && hasCodeblockUriTag(markdown.content.value) && !codeblockHasClosingBackticks(markdown.content.value);
    if (!this.hasEditCodeblockUri(markdown) && !isBlankMarkdown && !hasPendingEditCodeblock) {
      this.finalizeCurrentThinkingPart(context2, templateData);
    }
    const fillInIncompleteTokens2 = isResponseVM(element) && (!element.isComplete || element.isCanceled || element.errorDetails?.responseIsFiltered || element.errorDetails?.responseIsIncomplete || !!element.renderData);
    const codeBlockStartIndex = context2.codeBlockStartIndex;
    const markdownPart = templateData.instantiationService.createInstance(ChatMarkdownContentPart, markdown, context2, this._editorPool, fillInIncompleteTokens2, codeBlockStartIndex, this.chatContentMarkdownRenderer, void 0, this._currentLayoutWidth.get(), {
      codeBlockRenderOptions: this.rendererOptions.codeBlockRenderOptions
    });
    markdownPart.addDisposable(markdownPart.onDidChangeHeight(() => this.fireItemHeightChange(templateData)));
    if (isRequestVM(element)) {
      markdownPart.domNode.tabIndex = 0;
      if (this.configService.getValue("chat.editRequests") === "inline" && this.rendererOptions.editable) {
        markdownPart.domNode.classList.add("clickable");
        markdownPart.addDisposable(addDisposableListener(markdownPart.domNode, EventType.CLICK, e => {
          if (this.viewModel?.editing?.id === element.id) {
            return;
          }
          const clickedElement = e.target;
          if (clickedElement.tagName === "A") {
            return;
          }
          const selection = getWindow(templateData.rowContainer).getSelection();
          if (selection && !selection.isCollapsed && selection.toString().length > 0) {
            return;
          }
          const monacoEditor = findParentWithClass(clickedElement, "monaco-editor");
          if (monacoEditor) {
            const editorPart = Array.from(this.editorsInUse()).find(editor => editor.element.contains(monacoEditor));
            if (editorPart?.editor.getSelection()?.isEmpty() === false) {
              return;
            }
          }
          e.preventDefault();
          e.stopPropagation();
          this._onDidClickRequest.fire(templateData);
        }));
        markdownPart.addDisposable(this.hoverService.setupManagedHover(getDefaultHoverDelegate("element"), markdownPart.domNode, localize("recovered.11379", "Click to Edit"), {
          trapFocus: true
        }));
      }
      markdownPart.addDisposable(addDisposableListener(markdownPart.domNode, EventType.FOCUS, () => {
        this.hoverVisible(templateData.requestHover);
      }));
      markdownPart.addDisposable(addDisposableListener(markdownPart.domNode, EventType.BLUR, () => {
        this.hoverHidden(templateData.requestHover);
      }));
    }
    this.handleRenderedCodeblocks(element, markdownPart, codeBlockStartIndex);
    const collapsedToolsMode = this.configService.getValue("chat.agent.thinking.collapsedTools");
    if (isResponseVM(context2.element) && collapsedToolsMode !== "off" /* Off */) {
      const isComplete = this.isCodeblockComplete(markdown, context2.element);
      const subAgentInvocationId = extractSubAgentInvocationIdFromText(markdown.content.value);
      if (subAgentInvocationId) {
        const subagentPart = this.getSubagentPart(templateData.renderedParts, subAgentInvocationId);
        if (subagentPart && markdownPart?.domNode && isComplete) {
          subagentPart.appendMarkdownItem(() => ({
            domNode: markdownPart.domNode,
            disposable: markdownPart
          }), markdownPart.codeblocksPartId, markdown, templateData.value, markdownPart);
          return this.renderNoContent(other => other.kind === "markdownContent" && other.content.value === markdown.content.value && extractSubAgentInvocationIdFromText(other.content.value) === subAgentInvocationId);
        }
      }
      const shouldPin = this.shouldPinPart(markdown, context2.element);
      if (markdownPart?.domNode && shouldPin && isComplete) {
        const {
          part: lastThinking,
          separatedFromReasoning
        } = this.getLastThinkingPartForGroupedItem(context2, templateData);
        if (!lastThinking && shouldCreateGroupedThinkingPart(collapsedToolsMode, separatedFromReasoning)) {
          const thinkingPart = this.renderThinkingPart({
            kind: "thinking"
          }, context2, templateData);
          if (thinkingPart instanceof ChatThinkingContentPart) {
            thinkingPart.appendItem(() => ({
              domNode: markdownPart.domNode,
              disposable: markdownPart
            }), markdownPart.codeblocksPartId, markdown, templateData.value, markdownPart.onDidChangeDiff, markdownPart);
          }
          return thinkingPart;
        }
        if (lastThinking) {
          lastThinking.appendItem(() => ({
            domNode: markdownPart.domNode,
            disposable: markdownPart
          }), markdownPart.codeblocksPartId, markdown, templateData.value, markdownPart.onDidChangeDiff);
        }
      } else if (!shouldPin && !isBlankMarkdown && !hasPendingEditCodeblock) {
        this.finalizeCurrentThinkingPart(context2, templateData);
      }
    }
    return markdownPart;
  }
  renderThinkingPart(content2, context2, templateData) {
    if (!content2.id) {
      content2.id = Date.now().toString();
    }
    const element = isResponseVM(context2.element) ? context2.element : void 0;
    const streamingCompleted = this.isThinkingLookAheadComplete(context2, element);
    const lastThinkingPart = this.getLastThinkingPart(templateData.renderedParts);
    if (lastThinkingPart?.hasGroupedItems() && shouldStartNewCollapsedThinkingGroup(getEffectiveThinkingDisplayMode(this.configService, this.contextKeyService), "items", "reasoning")) {
      this.finalizeCurrentThinkingPart(context2, templateData);
    }
    if (Array.isArray(content2.value)) {
      if (content2.value.length < 1) {
        const lastThinking = this.getLastThinkingPart(templateData.renderedParts);
        lastThinking?.finalizeTitleIfDefault();
        return this.renderNoContent(other => content2.kind === other.kind);
      }
      let lastPart;
      for (const item of content2.value) {
        if (item) {
          const lastThinkingPart2 = lastPart instanceof ChatThinkingContentPart && lastPart.getIsActive() ? lastPart : void 0;
          if (lastThinkingPart2) {
            lastThinkingPart2.setupThinkingContainer({
              ...content2,
              value: item
            });
          } else {
            const itemContent = {
              ...content2,
              value: item
            };
            const itemPart = templateData.instantiationService.createInstance(ChatThinkingContentPart, itemContent, context2, this.chatContentMarkdownRenderer, streamingCompleted);
            lastPart = itemPart;
          }
        }
      }
      return lastPart ?? this.renderNoContent(other => content2.kind === other.kind);
    } else {
      const lastActiveThinking = this.getLastThinkingPart(templateData.renderedParts);
      if (lastActiveThinking) {
        lastActiveThinking.setupThinkingContainer(content2);
        return lastActiveThinking;
      } else {
        const part = templateData.instantiationService.createInstance(ChatThinkingContentPart, content2, context2, this.chatContentMarkdownRenderer, streamingCompleted);
        return part;
      }
    }
  }
  disposeElement(node, index2, templateData, details) {
    this.traceLayout("disposeElement", `Disposing element, index=${index2}`);
    templateData.elementDisposables.clear();
    if (templateData.currentElement && !this.viewModel?.editing) {
      this.templateDataByRequestId.delete(templateData.currentElement.id);
    }
    const codeBlocks = this.codeBlocksByResponseId.get(node.element.id);
    if (codeBlocks) {
      for (const info of codeBlocks) {
        if (info?.uri) {
          this.codeBlocksByEditorUri.delete(info.uri);
        }
      }
      this.codeBlocksByResponseId.delete(node.element.id);
    }
    this.fileTreesByResponseId.delete(node.element.id);
    this.focusedFileTreesByResponseId.delete(node.element.id);
    if (isRequestVM(node.element) && node.element.id === this.viewModel?.editing?.id && details?.onScroll) {
      this._onDidDispose.fire(templateData);
    }
    if (templateData.titleToolbar) {
      templateData.titleToolbar.context = void 0;
    }
    templateData.footerToolbar.context = void 0;
    templateData.checkpointToolbar.context = void 0;
    templateData.checkpointRestoreToolbar.context = void 0;
  }
  renderMcpServersInteractionRequired(content2, context2, templateData) {
    return this.instantiationService.createInstance(ChatMcpServersInteractionContentPart, content2, context2);
  }
  renderDisabledClaudeHooks(content2, context2) {
    return this.instantiationService.createInstance(ChatDisabledClaudeHooksContentPart, context2);
  }
  disposeTemplate(templateData) {
    this.clearRenderedParts(templateData);
    templateData.templateDisposables.dispose();
  }
  hoverVisible(requestHover) {
    requestHover.style.opacity = "1";
  }
  hoverHidden(requestHover) {
    requestHover.style.opacity = "0";
  }
};
ChatListItemRenderer = __decorateClass([__decorateParam(5, IInstantiationService), __decorateParam(6, IConfigurationService), __decorateParam(7, ILogService), __decorateParam(8, IContextKeyService), __decorateParam(9, IThemeService), __decorateParam(10, ICommandService), __decorateParam(11, IHoverService), __decorateParam(12, IChatWidgetService), __decorateParam(13, IChatEntitlementService), __decorateParam(14, IChatService), __decorateParam(15, IChatBranchService), __decorateParam(16, IAccessibilitySignalService), __decorateParam(17, IAccessibilityService), __decorateParam(18, IWorkbenchEnvironmentService), __decorateParam(19, ITelemetryService)], ChatListItemRenderer);
var ChatListDelegate = class extends CachedListVirtualDelegate {
  constructor(defaultElementHeight) {
    super();
    this.defaultElementHeight = defaultElementHeight;
  }
  estimateHeight(element) {
    return element.currentRenderedHeight ?? this.defaultElementHeight;
  }
  getTemplateId(element) {
    return ChatListItemRenderer.ID;
  }
  hasDynamicHeight(element) {
    return true;
  }
  getMeasuredHeight(element) {
    return this.getCachedHeight(element);
  }
};
function isParentSubagentTool(invocation) {
  return invocation.toolSpecificData?.kind === "subagent" && !invocation.subAgentInvocationId;
}
function getSubagentId(invocation) {
  if (isParentSubagentTool(invocation)) {
    return invocation.toolCallId;
  }
  return invocation.subAgentInvocationId;
}
function isSubagentToolInvocation(invocation) {
  return !!getSubagentId(invocation);
}
function getWorkingProgressRelevantParts(parts) {
  return parts.filter(part => {
    if (part.kind === "toolInvocation" || part.kind === "toolInvocationSerialized") {
      return !isSubagentToolInvocation(part);
    }
    if (part.kind === "hook") {
      return !part.subAgentInvocationId;
    }
    return part.kind !== "markdownContent" || !extractSubAgentInvocationIdFromText(part.content.value);
  });
}
function endsWithSubagentContent(parts) {
  const lastPart = findLastMeaningfulPart(parts);
  if (!lastPart) {
    return false;
  }
  if (lastPart.kind === "toolInvocation" || lastPart.kind === "toolInvocationSerialized") {
    return isParentSubagentTool(lastPart);
  }
  return false;
}
function isWaitingForMcpServers(parts) {
  return parts.some(part => part.kind === "mcpServersStartingSlow" && part.servers.get().length > 0);
}
function findLastMeaningfulPart(parts) {
  for (let i2 = parts.length - 1; i2 >= 0; i2--) {
    const part = parts[i2];
    if (part.kind !== "markdownContent" || part.content.value.trim().length > 0) {
      return part;
    }
  }
  return void 0;
}

// src/vs/workbench/contrib/chat/browser/widget/chatOptions.ts
export { $55, COPILOT_USERNAME, WORKING_CAUGHT_UP_DEBOUNCE_MS, DEFAULT_CHAT_ITEM_HORIZONTAL_PADDING, escapeMarkdownLinkLabel2, buildPlanReviewProgressContent, shouldScheduleInitialHeightChange, getFinalResponseStartIndex, formatCompletedResponseDisclosureLabel, getVisibleCompletedResponseItemCount, reconcileChatItemHeight, renderChatResponseDetails, renderChatRequestTimestamp, shouldRenderInitialProgressiveContentImmediately, shouldStartNewCollapsedThinkingGroup, shouldCreateGroupedThinkingPart, shouldShowFileChangesSummaryForSettings, shouldShowPillsSummaryForSettings, shouldPinToolInvocationToThinking, toolInvocationHasMcpAppData, forceVerboseLayoutTracing, mostRecentResponseClassName, shouldHideChatUserIdentity, isAgentHostCopilotSessionType, upvoteAnimationSettingToEnum, ChatListItemRenderer, ChatListDelegate, isParentSubagentTool, getSubagentId, isSubagentToolInvocation, getWorkingProgressRelevantParts, endsWithSubagentContent, isWaitingForMcpServers, findLastMeaningfulPart, $55 as $, escapeMarkdownLinkLabel2 as escapeMarkdownLinkLabel };
