// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
import { __decorateClass } from "../../../../../base/common/shunCodeRecoveredHelpersWorkbench.js";
import { __decorateParam } from "../../../../../base/common/shunCodeRecoveredHelpersWorkbench.js";
import { localize } from "../../../../../nls.js";
import { ResourceSet } from "../../../../../base/common/map.js";
import { isDefined } from "../../../../../base/common/types.js";
import { Iterable } from "../../../../../base/common/iterator.js";
import { DisposableStore } from "../../../../../base/common/lifecycle.js";
import { Disposable } from "../../../../../base/common/lifecycle.js";
import { MutableDisposable } from "../../../../../base/common/lifecycle.js";
import { thenIfNotDisposed } from "../../../../../base/common/lifecycle.js";
import { Event as Event2 } from "../../../../../base/common/event.js";
import { Emitter } from "../../../../../base/common/event.js";
import { CancellationToken } from "../../../../../base/common/cancellation.js";
import { CancellationTokenSource } from "../../../../../base/common/cancellation.js";
import { URI } from "../../../../../base/common/uri.js";
import { Schemas } from "../../../../../base/common/network.js";
import { extUri } from "../../../../../base/common/resources.js";
import { isEqual as isEqual2 } from "../../../../../base/common/resources.js";
import { timeout } from "../../../../../base/common/async.js";
import { disposableTimeout } from "../../../../../base/common/async.js";
import { hash } from "../../../../../base/common/hash.js";
import { observableValue } from "../../../../../base/common/observableInternal/observables/observableValue.js";
import { autorun } from "../../../../../base/common/observableInternal/reactions/autorun.js";
import { derived } from "../../../../../base/common/observableInternal/observables/derived.js";
import { observableFromEvent } from "../../../../../base/common/observableInternal/observables/observableFromEvent.js";
import { getWindow } from "../../../../../base/browser/dom.js";
import { clearNode } from "../../../../../base/browser/dom.js";
import { addDisposableListener } from "../../../../../base/browser/dom.js";
import { addStandardDisposableListener } from "../../../../../base/browser/dom.js";
import { scheduleAtNextAnimationFrame } from "../../../../../base/browser/dom.js";
import { Dimension } from "../../../../../base/browser/dom.js";
import { getTopLeftOffset } from "../../../../../base/browser/dom.js";
import { isAncestor } from "../../../../../base/browser/dom.js";
import { findParentWithClass } from "../../../../../base/browser/dom.js";
import { EventType } from "../../../../../base/browser/dom.js";
import { append } from "../../../../../base/browser/dom.js";
import { $ } from "../../../../../base/browser/dom.js";
import { setVisibility } from "../../../../../base/browser/dom.js";
import { status } from "../../../../../base/browser/ui/aria/aria.js";
import { IInstantiationService } from "../../../../../platform/instantiation/common/instantiation.js";
import { ICodeEditorService } from "../../../../../editor/browser/services/codeEditorService.js";
import { Codicon } from "../../../../../base/common/codicons.js";
import { IContextKeyService } from "../../../../../platform/contextkey/common/contextkey.js";
import { MenuId } from "../../../../../platform/actions/common/actions.js";
import { ITelemetryService } from "../../../../../platform/telemetry/common/telemetry.js";
import { toErrorMessage } from "../../../../../base/common/errorMessage.js";
import { ILogService } from "../../../../../platform/log/common/log.js";
import { filter } from "../../../../../base/common/objects.js";
import { IAccessibilityService } from "../../../../../platform/accessibility/common/accessibility.js";
import { Range as Range2 } from "../../../../../editor/common/core/range.js";
import { IConfigurationService } from "../../../../../platform/configuration/common/configuration.js";
import product_default from "../../../../../platform/product/common/product.js";
import { OffsetRange } from "../../../../../editor/common/core/ranges/offsetRange.js";
import { IDialogService } from "../../../../../platform/dialogs/common/dialogs.js";
import { IThemeService } from "../../../../../platform/theme/common/themeService.js";
import { ServiceCollection } from "../../../../../platform/instantiation/common/serviceCollection.js";
import { bindContextKey } from "../../../../../platform/observable/common/platformObservableUtils.js";
import { Progress } from "../../../../../platform/progress/common/progress.js";
import { MarkdownString } from "../../../../../base/common/htmlContent.js";
import { ILifecycleService } from "../../../../services/lifecycle/common/lifecycle.js";
import { IsSessionsWindowContext } from "../../../../common/contextkeys.js";
import { ChatEntitlementContextKeys } from "../../../../services/chat/common/chatEntitlementService.js";
import { IChatEntitlementService } from "../../../../services/chat/common/chatEntitlementService.js";
import { localChatSessionType } from "../../common/chatSessionsService.js";
import { IChatSessionsService } from "../../common/chatSessionsService.js";
import { getChatSessionType } from "../../common/model/chatUri.js";
import { ChatContextKeys } from "../../common/actions/chatContextKeys.js";
import { ChatSendResult } from "../../common/chatService/chatService.js";
import { IChatService } from "../../common/chatService/chatService.js";
import { ChatPerfMark } from "../../common/chatPerf.js";
import { markChat } from "../../common/chatPerf.js";
import { clearChatMarks } from "../../common/chatPerf.js";
import { IChatAgentService } from "../../common/participants/chatAgents.js";
import { isRequestVM } from "../../common/model/chatViewModel.js";
import { isResponseVM } from "../../common/model/chatViewModel.js";
import { ChatViewModel } from "../../common/model/chatViewModel.js";
import { isWorkspaceVariableEntry } from "../../common/attachments/chatVariableEntries.js";
import { isPromptFileVariableEntry } from "../../common/attachments/chatVariableEntries.js";
import { isPromptTextVariableEntry } from "../../common/attachments/chatVariableEntries.js";
import { toPromptFileVariableEntry } from "../../common/attachments/chatVariableEntries.js";
import { ChatRequestVariableSet } from "../../common/attachments/chatVariableEntries.js";
import { IChatWidgetService } from "../chat.js";
import { IChatAccessibilityService } from "../chat.js";
import { isIChatViewViewContext } from "../chat.js";
import { isIChatResourceViewContext } from "../chat.js";
import { ChatDynamicVariableModel } from "../attachments/chatDynamicVariables.js";
import { IPromptsService } from "../../common/promptSyntax/service/promptsService.js";
import { IParsedChatRequest } from "../../common/requestParser/chatParserTypes.js";
import { chatAgentLeader } from "../../common/requestParser/chatParserTypes.js";
import { chatSubcommandLeader } from "../../common/requestParser/chatParserTypes.js";
import { ChatRequestToolPart } from "../../common/requestParser/chatParserTypes.js";
import { ChatRequestToolSetPart } from "../../common/requestParser/chatParserTypes.js";
import { ChatRequestAgentPart } from "../../common/requestParser/chatParserTypes.js";
import { ChatRequestSlashCommandPart } from "../../common/requestParser/chatParserTypes.js";
import { ChatRequestSlashPromptPart } from "../../common/requestParser/chatParserTypes.js";
import { ChatRequestDynamicVariablePart } from "../../common/requestParser/chatParserTypes.js";
import { formatChatQuestion } from "../../common/requestParser/chatParserTypes.js";
import { IChatSlashCommandService } from "../../common/participants/chatSlashCommands.js";
import { isToolSet } from "../../common/tools/languageModelToolsService.js";
import { ILanguageModelToolsService } from "../../common/tools/languageModelToolsService.js";
import { ChatRequestParser } from "../../common/requestParser/chatRequestParser.js";
import { getDynamicVariablesForWidget } from "../attachments/chatVariables.js";
import { getSelectedToolAndToolSetsForWidget } from "../attachments/chatVariables.js";
import { ICustomizationHarnessService } from "../../common/customizationHarnessService.js";
import { IChatEditingService } from "../../common/editing/chatEditingService.js";
import { decidedChatEditingResourceContextKey } from "../../common/editing/chatEditingService.js";
import { inChatEditingSessionContextKey } from "../../common/editing/chatEditingService.js";
import { hasUndecidedChatEditingResourceContextKey } from "../../common/editing/chatEditingService.js";
import { hasAppliedChatEditsContextKey } from "../../common/editing/chatEditingService.js";
import { applyingChatEditsFailedContextKey } from "../../common/editing/chatEditingService.js";
import { checkModeOption } from "../../common/chat.js";
import { logChangesToStateModel } from "../../common/model/chatModel.js";
import { IChatDebugService } from "../../common/chatDebugService.js";
import { IAgentSessionsService } from "../agentSessions/agentSessionsService.js";
import { ChatMode } from "../../common/chatModes.js";
import { getModeNameForTelemetry } from "../../common/chatModes.js";
import { GENERATE_AGENT_INSTRUCTIONS_COMMAND_ID } from "../actions/chatActions.js";
import { handleModeSwitch } from "../actions/chatActions.js";
import { IChatTodoListService } from "../../common/tools/chatTodoListService.js";
import { IChatLayoutService } from "../../common/widget/chatLayoutService.js";
import { IChatGoalSummaryService } from "../chatGoalSummaryService.js";
import { IChatBranchService } from "../chatBranchService.js";
import { ChatSuggestNextWidget } from "./chatContentParts/chatSuggestNextWidget.js";
import { ChatInputPart } from "./input/chatInputPart.js";
import { ChatContentMarkdownRenderer } from "./chatContentMarkdownRenderer.js";
import { ChatEditorOptions } from "./chatOptions.js";
import { ChatListWidget } from "./chatListWidget.js";
import { ChatViewWelcomePart } from "../viewsWelcome/chatViewWelcomeController.js";
import { IChatTipService } from "../chatTipService.js";
import { ChatTipContentPart } from "./chatContentParts/chatTipContentPart.js";
import { CHAT_READ_ONLY_BANNER_HEIGHT } from "./chatReadOnlyBanner.js";
import { ChatReadOnlyBanner } from "./chatReadOnlyBanner.js";
import { IChatSubmitRequestHandlerService } from "../chatSubmitRequestHandlerService.js";
import { ChatPetWidget } from "./chatPetWidget.js";
var $58 = $;
var SESSIONS_CHAT_ITEM_HORIZONTAL_PADDING = 64;
function isQuickChat(widget) {
  return isIChatResourceViewContext(widget.viewContext) && Boolean(widget.viewContext.isQuickChat);
}
function isInlineChat(widget) {
  return isIChatResourceViewContext(widget.viewContext) && Boolean(widget.viewContext.isInlineChat);
}
function getImmediateSilentSlashCommandPart(parsedRequest) {
  return parsedRequest.parts.find(part => part instanceof ChatRequestSlashCommandPart && part.range.start === 0 && part.slashCommand.executeImmediately === true && part.slashCommand.silent === true);
}
var supportsAllAttachments = {
  supportsFileAttachments: true,
  supportsToolAttachments: true,
  supportsMCPAttachments: true,
  supportsImageAttachments: true,
  supportsSearchResultAttachments: true,
  supportsInstructionAttachments: true,
  supportsSourceControlAttachments: true,
  supportsProblemAttachments: true,
  supportsSymbolAttachments: true,
  supportsTerminalAttachments: true,
  supportsPromptAttachments: true,
  supportsHandOffs: true,
  supportsCheckpoints: true
};
var DISCLAIMER = localize("recovered.11416", "AI responses may be inaccurate");
var ChatWidget = class extends Disposable {
  constructor(location2, viewContext, viewOptions, styles, codeEditorService, configurationService, dialogService, contextKeyService, instantiationService, chatService, chatBranchService, chatAgentService, chatWidgetService, chatAccessibilityService, logService, themeService, chatSlashCommandService, chatEditingService, telemetryService, promptsService, customizationHarnessService, toolsService, chatLayoutService, chatEntitlementService, chatSessionsService, agentSessionsService, chatTodoListService, lifecycleService, chatTipService, chatDebugService, accessibilityService, chatGoalSummaryService, chatSubmitRequestHandlerService) {
    super();
    this.viewOptions = viewOptions;
    this.styles = styles;
    this.codeEditorService = codeEditorService;
    this.configurationService = configurationService;
    this.dialogService = dialogService;
    this.contextKeyService = contextKeyService;
    this.instantiationService = instantiationService;
    this.chatService = chatService;
    this.chatBranchService = chatBranchService;
    this.chatAgentService = chatAgentService;
    this.chatWidgetService = chatWidgetService;
    this.chatAccessibilityService = chatAccessibilityService;
    this.logService = logService;
    this.themeService = themeService;
    this.chatSlashCommandService = chatSlashCommandService;
    this.telemetryService = telemetryService;
    this.promptsService = promptsService;
    this.customizationHarnessService = customizationHarnessService;
    this.toolsService = toolsService;
    this.chatLayoutService = chatLayoutService;
    this.chatEntitlementService = chatEntitlementService;
    this.chatSessionsService = chatSessionsService;
    this.agentSessionsService = agentSessionsService;
    this.chatTodoListService = chatTodoListService;
    this.lifecycleService = lifecycleService;
    this.chatTipService = chatTipService;
    this.chatDebugService = chatDebugService;
    this.accessibilityService = accessibilityService;
    this.chatGoalSummaryService = chatGoalSummaryService;
    this.chatSubmitRequestHandlerService = chatSubmitRequestHandlerService;
    this._onDidSubmitAgent = this._register(new Emitter());
    this.onDidSubmitAgent = this._onDidSubmitAgent.event;
    this._onDidChangeAgent = this._register(new Emitter());
    this.onDidChangeAgent = this._onDidChangeAgent.event;
    this._onDidFocus = this._register(new Emitter());
    this.onDidFocus = this._onDidFocus.event;
    this._onDidChangeViewModel = this._register(new Emitter());
    this.onDidChangeViewModel = this._onDidChangeViewModel.event;
    this._onDidScroll = this._register(new Emitter());
    this.onDidScroll = this._onDidScroll.event;
    this._onDidAcceptInput = this._register(new Emitter());
    this.onDidAcceptInput = this._onDidAcceptInput.event;
    this._onDidHide = this._register(new Emitter());
    this.onDidHide = this._onDidHide.event;
    this._onDidShow = this._register(new Emitter());
    this.onDidShow = this._onDidShow.event;
    this._onDidChangeParsedInput = this._register(new Emitter());
    this.onDidChangeParsedInput = this._onDidChangeParsedInput.event;
    this._onDidChangeActiveInputEditor = this._register(new Emitter());
    this.onDidChangeActiveInputEditor = this._onDidChangeActiveInputEditor.event;
    this._onWillMaybeChangeHeight = this._register(new Emitter());
    this.onWillMaybeChangeHeight = this._onWillMaybeChangeHeight.event;
    this._onDidChangeHeight = this._register(new Emitter());
    this.onDidChangeHeight = this._onDidChangeHeight.event;
    this._onDidChangeContentHeight = this._register(new Emitter());
    this.onDidChangeContentHeight = this._onDidChangeContentHeight.event;
    this._onDidChangeEmptyState = this._register(new Emitter());
    this.onDidChangeEmptyState = this._onDidChangeEmptyState.event;
    this.contribs = [];
    this.visibilityTimeoutDisposable = this._register(new MutableDisposable());
    this.visibilityAnimationFrameDisposable = this._register(new MutableDisposable());
    this.inputPartDisposable = this._register(new MutableDisposable());
    this.inlineInputPartDisposable = this._register(new MutableDisposable());
    this.recentlyRestoredCheckpoint = false;
    this.welcomePart = this._register(new MutableDisposable());
    this._gettingStartedTipPart = this._register(new MutableDisposable());
    this.visibleChangeCount = 0;
    this._visible = false;
    this._inputVisible = true;
    this._readOnly = false;
    this._isRenderingWelcome = false;
    this._attachmentCapabilities = supportsAllAttachments;
    this._goalBannerDismissedForCurrentRequest = false;
    this._goalBannerDismissListener = this._register(new MutableDisposable());
    this.viewModelDisposables = this._register(new DisposableStore());
    this._editingSession = observableValue(this, void 0);
    this._viewModelObs = observableFromEvent(this, this.onDidChangeViewModel, () => this.viewModel);
    this.readOnlyBanner = viewOptions.isSessionsWindow ? void 0 : this._register(instantiationService.createInstance(ChatReadOnlyBanner));
    this._lockedToCodingAgentContextKey = ChatContextKeys.lockedToCodingAgent.bindTo(this.contextKeyService);
    this._lockedCodingAgentIdContextKey = ChatContextKeys.lockedCodingAgentId.bindTo(this.contextKeyService);
    this._readOnlyContextKey = ChatContextKeys.readOnly.bindTo(this.contextKeyService);
    this._chatIsAgentHostSessionContextKey = ChatContextKeys.chatIsAgentHostSession.bindTo(this.contextKeyService);
    this._chatAgentHostProviderIdContextKey = ChatContextKeys.chatAgentHostProviderId.bindTo(this.contextKeyService);
    this._chatSessionSupportsForkContextKey = ChatContextKeys.chatSessionSupportsFork.bindTo(this.contextKeyService);
    this._agentSupportsAttachmentsContextKey = ChatContextKeys.agentSupportsAttachments.bindTo(this.contextKeyService);
    this._sessionIsEmptyContextKey = ChatContextKeys.chatSessionIsEmpty.bindTo(this.contextKeyService);
    this._hasPendingRequestsContextKey = ChatContextKeys.hasPendingRequests.bindTo(this.contextKeyService);
    this._sessionHasDebugDataContextKey = ChatContextKeys.chatSessionHasDebugData.bindTo(this.contextKeyService);
    this._register(this.chatDebugService.onDidAddEvent(e => {
      const sessionResource = this.viewModel?.sessionResource;
      if (sessionResource && e.sessionResource.toString() === sessionResource.toString()) {
        this._sessionHasDebugDataContextKey.set(true);
      }
    }));
    this._register(this.chatBranchService.onDidChange(sessionResource => {
      if (!this.viewModel || this.viewModel.sessionResource.toString() !== sessionResource.toString()) {
        return;
      }
      this._register(disposableTimeout(() => {
        if (this.visible) {
          this.listWidget?.rerender();
        }
      }, 0));
    }));
    this.viewContext = viewContext ?? {};
    const viewModelObs = this._viewModelObs;
    if (typeof location2 === "object") {
      this._location = location2;
    } else {
      this._location = {
        location: location2
      };
    }
    ChatContextKeys.inChatSession.bindTo(contextKeyService).set(true);
    ChatContextKeys.location.bindTo(contextKeyService).set(this._location.location);
    ChatContextKeys.inQuickChat.bindTo(contextKeyService).set(isQuickChat(this));
    this.agentInInput = ChatContextKeys.inputHasAgent.bindTo(contextKeyService);
    this.requestInProgress = ChatContextKeys.requestInProgress.bindTo(contextKeyService);
    this.hasActiveRequest = ChatContextKeys.hasActiveRequest.bindTo(contextKeyService);
    this._register(this.chatEntitlementService.onDidChangeAnonymous(() => this.renderWelcomeViewContentIfNeeded()));
    this._register(this.configurationService.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration("chat.tips.enabled")) {
        if (!this.configurationService.getValue("chat.tips.enabled")) {
          this.clearGettingStartedTip();
        } else {
          this.updateChatViewVisibility();
        }
      }
      if (e.affectsConfiguration("chat.progressBorder.enabled" /* ProgressBorder */)) {
        this.updateWorkingProgressBorder();
      }
    }));
    this._register(this.accessibilityService.onDidChangeReducedMotion(() => {
      this.updateWorkingProgressBorder();
      if (this.visible) {
        this.listWidget.rerender();
      }
    }));
    this._register(bindContextKey(decidedChatEditingResourceContextKey, contextKeyService, reader => {
      const currentSession = this._editingSession.read(reader);
      if (!currentSession) {
        return;
      }
      const entries2 = currentSession.entries.read(reader);
      const decidedEntries = entries2.filter(entry => entry.state.read(reader) !== 0 /* Modified */);
      return decidedEntries.map(entry => entry.entryId);
    }));
    this._register(bindContextKey(hasUndecidedChatEditingResourceContextKey, contextKeyService, reader => {
      const currentSession = this._editingSession.read(reader);
      const entries2 = currentSession?.entries.read(reader) ?? [];
      const decidedEntries = entries2.filter(entry => entry.state.read(reader) === 0 /* Modified */);
      return decidedEntries.length > 0;
    }));
    this._register(bindContextKey(hasAppliedChatEditsContextKey, contextKeyService, reader => {
      const currentSession = this._editingSession.read(reader);
      if (!currentSession) {
        return false;
      }
      const entries2 = currentSession.entries.read(reader);
      return entries2.length > 0;
    }));
    this._register(bindContextKey(inChatEditingSessionContextKey, contextKeyService, reader => {
      return this._editingSession.read(reader) !== null;
    }));
    this._register(bindContextKey(ChatContextKeys.chatEditingCanUndo, contextKeyService, r2 => {
      return this._editingSession.read(r2)?.canUndo.read(r2) || false;
    }));
    this._register(bindContextKey(ChatContextKeys.chatEditingCanRedo, contextKeyService, r2 => {
      return this._editingSession.read(r2)?.canRedo.read(r2) || false;
    }));
    this._register(bindContextKey(applyingChatEditsFailedContextKey, contextKeyService, r2 => {
      const chatModel = viewModelObs.read(r2)?.model;
      const editingSession = this._editingSession.read(r2);
      if (!editingSession || !chatModel) {
        return false;
      }
      const lastResponse = observableFromEvent(this, chatModel.onDidChange, () => chatModel.getRequests().at(-1)?.response).read(r2);
      return lastResponse?.result?.errorDetails && !lastResponse?.result?.errorDetails.responseIsIncomplete;
    }));
    this.chatSuggestNextWidget = this._register(this.instantiationService.createInstance(ChatSuggestNextWidget));
    this._register(autorun(r2 => {
      const viewModel = viewModelObs.read(r2);
      const inProgress = viewModel?.model.requestInProgress.read(r2) ?? false;
      if (!inProgress) {
        this._cancelGoalSummary();
        this.inputPartDisposable.value?.clearGoalBanner();
      }
    }));
    this._register(autorun(r2 => {
      const viewModel = viewModelObs.read(r2);
      const sessions = chatEditingService.editingSessionsObs.read(r2);
      const session = sessions.find(candidate => isEqual2(candidate.chatSessionResource, viewModel?.sessionResource));
      this._editingSession.set(void 0, void 0);
      this.renderChatEditingSessionState();
      if (!session) {
        return;
      }
      const entries2 = session.entries.read(r2);
      for (const entry of entries2) {
        entry.state.read(r2);
      }
      this._editingSession.set(session, void 0);
      r2.store.add(session.onDidDispose(() => {
        this._editingSession.set(void 0, void 0);
        this.renderChatEditingSessionState();
      }));
      r2.store.add(this.inputEditor.onDidChangeModelContent(() => {
        if (this.getInput() === "") {
          this.refreshParsedInput();
        }
      }));
      this.renderChatEditingSessionState();
    }));
    this._register(this.codeEditorService.registerCodeEditorOpenHandler(async (input, _source, _sideBySide) => {
      const resource = input.resource;
      if (resource.scheme !== Schemas.vscodeChatCodeBlock) {
        return null;
      }
      const responseId = resource.path.split("/").at(1);
      if (!responseId) {
        return null;
      }
      const item = this.viewModel?.getItems().find(item2 => item2.id === responseId);
      if (!item) {
        return null;
      }
      this.reveal(item);
      await timeout(0);
      for (const codeBlockPart of this.listWidget.editorsInUse()) {
        if (extUri.isEqual(codeBlockPart.uri, resource, true)) {
          const editor = codeBlockPart.editor;
          let relativeTop = 0;
          const editorDomNode = editor.getDomNode();
          if (editorDomNode) {
            const row = findParentWithClass(editorDomNode, "monaco-list-row");
            if (row) {
              relativeTop = getTopLeftOffset(editorDomNode).top - getTopLeftOffset(row).top;
            }
          }
          if (input.options?.selection) {
            const editorSelectionTopOffset = editor.getTopForPosition(input.options.selection.startLineNumber, input.options.selection.startColumn);
            relativeTop += editorSelectionTopOffset;
            editor.focus();
            editor.setSelection({
              startLineNumber: input.options.selection.startLineNumber,
              startColumn: input.options.selection.startColumn,
              endLineNumber: input.options.selection.endLineNumber ?? input.options.selection.startLineNumber,
              endColumn: input.options.selection.endColumn ?? input.options.selection.startColumn
            });
          }
          this.reveal(item, relativeTop);
          return editor;
        }
      }
      return null;
    }));
    this._register(this.onDidChangeParsedInput(() => this.updateChatInputContext()));
    this._register(this.chatTodoListService.onDidUpdateTodos(sessionResource => {
      if (isEqual2(this.viewModel?.sessionResource, sessionResource)) {
        this.inputPart.renderChatTodoListWidget(sessionResource);
      }
    }));
  }
  static {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.CONTRIBS = [];
  }
  get domNode() {
    return this.container;
  }
  get visible() {
    return this._visible;
  }
  set viewModel(viewModel) {
    if (this._viewModel === viewModel) {
      return;
    }
    const previousSessionResource = this._viewModel?.sessionResource;
    this.viewModelDisposables.clear();
    this._viewModel = viewModel;
    if (viewModel) {
      this.viewModelDisposables.add(viewModel);
      this.logService.debug("ChatWidget#setViewModel: have viewModel");
      if (viewModel.model.requestInProgress.get()) {
        this.chatAccessibilityService.acceptRequest(viewModel.sessionResource, true);
      }
    } else {
      this.logService.debug("ChatWidget#setViewModel: no viewModel");
    }
    this._onDidChangeViewModel.fire({
      previousSessionResource,
      currentSessionResource: this._viewModel?.sessionResource
    });
  }
  get viewModel() {
    return this._viewModel;
  }
  get parsedInput() {
    if (this.parsedChatRequest === void 0) {
      if (!this.viewModel) {
        return {
          text: "",
          parts: []
        };
      }
      this.parsedChatRequest = this.instantiationService.createInstance(ChatRequestParser).parseChatRequestWithReferences(getDynamicVariablesForWidget(this), getSelectedToolAndToolSetsForWidget(this), this.getInput(), this.location, {
        selectedAgent: this._lastSelectedAgent,
        mode: this.input.currentModeKind,
        attachmentCapabilities: this.attachmentCapabilities,
        forcedAgent: this._lockedAgent?.id ? this.chatAgentService.getAgent(this._lockedAgent.id) : void 0,
        sessionType: getChatSessionType(this.viewModel.model.sessionResource)
      });
      this._onDidChangeParsedInput.fire();
    }
    return this.parsedChatRequest;
  }
  get scopedContextKeyService() {
    return this.contextKeyService;
  }
  get location() {
    return this._location.location;
  }
  get supportsChangingModes() {
    return !!this.viewOptions.supportsChangingModes;
  }
  get locationData() {
    return this._location.resolveData?.();
  }
  set lastSelectedAgent(agent) {
    this.parsedChatRequest = void 0;
    this._lastSelectedAgent = agent;
    this._updateAgentCapabilitiesContextKeys(agent);
    this._onDidChangeParsedInput.fire();
  }
  get lastSelectedAgent() {
    return this._lastSelectedAgent;
  }
  _updateAgentCapabilitiesContextKeys(agent) {
    const capabilities = agent?.capabilities ?? (this._lockedAgent ? this.chatSessionsService.getCapabilitiesForSessionType(this._lockedAgent.id) : void 0);
    this._attachmentCapabilities = capabilities ?? supportsAllAttachments;
    const supportsAttachments = Object.keys(filter(this._attachmentCapabilities, (key3, value2) => value2 === true)).length > 0;
    this._agentSupportsAttachmentsContextKey.set(supportsAttachments);
  }
  get supportsFileReferences() {
    return !!this.viewOptions.supportsFileReferences;
  }
  get rendersInputOnTop() {
    return this.viewOptions.renderInputOnTop ?? false;
  }
  get attachmentCapabilities() {
    return this._attachmentCapabilities;
  }
  /**
   * Either the inline input (when editing) or the main input part
   */
  get input() {
    return this.viewModel?.editing && this.configurationService.getValue("chat.editRequests") !== "input" ? this.inlineInputPart : this.inputPart;
  }
  /**
   * The main input part at the buttom of the chat widget. Use `input` to get the active input (main or inline editing part).
   */
  get inputPart() {
    return this.inputPartDisposable.value;
  }
  get inlineInputPart() {
    return this.inlineInputPartDisposable.value;
  }
  updateWorkingProgressBorder() {
    const inputPart = this.inputPartDisposable.value;
    if (!inputPart) {
      return;
    }
    const inputContainer = inputPart.inputContainerElement;
    if (!inputContainer) {
      return;
    }
    const enabled = this.configurationService.getValue("chat.progressBorder.enabled" /* ProgressBorder */) === true && !this.accessibilityService.isMotionReduced() && !isInlineChat(this);
    const inProgress = !!this.viewModel?.model.requestInProgress.get();
    inputContainer.classList.toggle("working", enabled && inProgress);
  }
  get inputEditor() {
    return this.input.inputEditor;
  }
  get contentHeight() {
    return this.input.height.get() + this.listWidget.contentHeight + this.chatSuggestNextWidget.height;
  }
  get scrollTop() {
    return this.listWidget.scrollTop;
  }
  set scrollTop(value2) {
    this.listWidget.scrollTop = value2;
  }
  get scrollHeight() {
    return this.listWidget.scrollHeight;
  }
  get viewportHeight() {
    return this.listWidget.renderHeight;
  }
  get attachmentModel() {
    return this.input.attachmentModel;
  }
  render(parent) {
    const viewId = isIChatViewViewContext(this.viewContext) ? this.viewContext.viewId : void 0;
    this.editorOptions = this._register(this.instantiationService.createInstance(ChatEditorOptions, viewId, this.styles.listForeground, this.styles.inputEditorBackground, this.styles.resultEditorBackground));
    const renderInputOnTop = this.viewOptions.renderInputOnTop ?? false;
    const renderFollowups = this.viewOptions.renderFollowups ?? !renderInputOnTop;
    const renderStyle = this.viewOptions.renderStyle;
    const renderInputToolbarBelowInput = this.viewOptions.renderInputToolbarBelowInput ?? false;
    this.container = append(parent, $58(".interactive-session"));
    this.welcomeMessageContainer = append(this.container, $58(".chat-welcome-view-container", {
      style: "display: none"
    }));
    this._register(addStandardDisposableListener(this.welcomeMessageContainer, EventType.CLICK, () => this.focusInput()));
    this._register(this.chatSuggestNextWidget.onDidChangeHeight(() => {
      if (this.bodyDimension) {
        this.layout(this.bodyDimension.height, this.bodyDimension.width);
      }
    }));
    this._register(this.chatSuggestNextWidget.onDidSelectPrompt(({
      handoff,
      agentId,
      withAutopilot
    }) => {
      this.handleNextPromptSelection(handoff, agentId, withAutopilot);
    }));
    if (renderInputOnTop) {
      if (this.readOnlyBanner) {
        this.container.appendChild(this.readOnlyBanner.domNode);
      }
      this.createInput(this.container, {
        renderFollowups,
        renderStyle,
        renderInputToolbarBelowInput
      });
      this.listContainer = append(this.container, $58(`.interactive-list`));
    } else {
      this.listContainer = append(this.container, $58(`.interactive-list`));
      append(this.container, this.chatSuggestNextWidget.domNode);
      if (this.readOnlyBanner) {
        this.container.appendChild(this.readOnlyBanner.domNode);
      }
      this.createInput(this.container, {
        renderFollowups,
        renderStyle,
        renderInputToolbarBelowInput
      });
    }
    if (this.location === "panel" /* Chat */ && !isInlineChat(this)) {
      const inputContainer = this.inputPart.inputContainerElement;
      const petHost = inputContainer?.parentElement ?? this.inputPart.element;
      const inputHasContent = observableFromEvent(this, this.inputEditor.onDidChangeModelContent, () => this.inputEditor.getValue().length > 0);
      const isLatestFocusedWidget = observableFromEvent(this, this.chatWidgetService.onDidChangeFocusedWidget, () => this.chatWidgetService.lastFocusedWidget === this);
      this._register(this.instantiationService.createInstance(ChatPetWidget, petHost, inputContainer ?? petHost, this._viewModelObs.map(viewModel => viewModel?.model), inputHasContent, isLatestFocusedWidget, this.inputEditor.onDidChangeModelContent));
    }
    this.renderWelcomeViewContentIfNeeded();
    this.createList(this.listContainer, {
      editable: !isInlineChat(this) && !isQuickChat(this),
      contentHorizontalPadding: this.viewOptions.isSessionsWindow ? SESSIONS_CHAT_ITEM_HORIZONTAL_PADDING : void 0,
      ...this.viewOptions.rendererOptions,
      renderStyle
    });
    this._register(addDisposableListener(this.container, EventType.MOUSE_WHEEL, e => {
      if (e.defaultPrevented || e.target !== this.container) {
        return;
      }
      this.listWidget.delegateScrollFromMouseWheelEvent(e);
    }));
    this._register(addDisposableListener(parent, EventType.MOUSE_WHEEL, e => {
      if (e.defaultPrevented) {
        return;
      }
      const target = e.target;
      if (target && isAncestor(target, this.container)) {
        return;
      }
      this.listWidget.delegateScrollFromMouseWheelEvent(e);
    }));
    this._register(autorun(reader => {
      const fontFamily = this.chatLayoutService.fontFamily.read(reader);
      const fontSize = this.chatLayoutService.fontSize.read(reader);
      this.container.style.setProperty("--vscode-chat-font-family", fontFamily);
      this.container.style.fontSize = `${fontSize}px`;
      if (this.visible) {
        this.listWidget.rerender();
      }
    }));
    this._register(Event2.runAndSubscribe(this.editorOptions.onDidChange, () => this.onDidStyleChange()));
    if (this.viewModel) {
      this.onDidChangeItems();
      this.listWidget.scrollToEnd();
    }
    this.contribs = ChatWidget.CONTRIBS.map(contrib => {
      try {
        return this._register(this.instantiationService.createInstance(contrib, this));
      } catch (err) {
        this.logService.error("Failed to instantiate chat widget contrib", toErrorMessage(err));
        return void 0;
      }
    }).filter(isDefined);
    this._register(this.chatWidgetService.register(this));
    const parsedInput = observableFromEvent(this.onDidChangeParsedInput, () => this.parsedInput);
    this._register(autorun(r2 => {
      const input = parsedInput.read(r2);
      const newPromptAttachments = /* @__PURE__ */new Map();
      const oldPromptAttachments = /* @__PURE__ */new Set();
      for (const attachment of this.attachmentModel.attachments) {
        if (attachment.range) {
          oldPromptAttachments.add(attachment.id);
        }
      }
      for (const part of input.parts) {
        if (part instanceof ChatRequestToolPart || part instanceof ChatRequestToolSetPart || part instanceof ChatRequestDynamicVariablePart) {
          const entry = part.toVariableEntry();
          if (part instanceof ChatRequestDynamicVariablePart && part.isAttachmentReference) {
            continue;
          }
          newPromptAttachments.set(entry.id, entry);
          oldPromptAttachments.delete(entry.id);
        }
      }
      this.attachmentModel.updateContext(oldPromptAttachments, newPromptAttachments.values());
    }));
    if (!this.focusedInputDOM) {
      this.focusedInputDOM = this.container.appendChild($(".focused-input-dom"));
    }
  }
  focusInput() {
    if (!this._inputVisible) {
      if (this.listWidget.focusLastItem(true) < 0) {
        this.listWidget.focus();
      }
      this._onDidFocus.fire();
      return;
    }
    this.input.focus();
    this._onDidFocus.fire();
  }
  focusTodosView() {
    if (!this.input.hasVisibleTodos()) {
      return false;
    }
    return this.input.focusTodoList();
  }
  toggleTodosViewFocus() {
    if (!this.input.hasVisibleTodos()) {
      return false;
    }
    if (this.input.isTodoListFocused()) {
      this.focusInput();
      return true;
    }
    return this.input.focusTodoList();
  }
  focusQuestionCarousel() {
    if (!this.input.questionCarousel) {
      return false;
    }
    return this.input.focusQuestionCarousel();
  }
  toggleQuestionCarouselFocus() {
    if (!this.input.questionCarousel) {
      return false;
    }
    if (this.input.isQuestionCarouselFocused()) {
      this.focusInput();
      return true;
    }
    return this.input.focusQuestionCarousel();
  }
  navigateToPreviousQuestion() {
    if (!this.input.questionCarousel) {
      return false;
    }
    return this.input.navigateToPreviousQuestion();
  }
  navigateToNextQuestion() {
    if (!this.input.questionCarousel) {
      return false;
    }
    return this.input.navigateToNextQuestion();
  }
  focusQuestionCarouselTerminal() {
    return this.input.focusQuestionCarouselTerminal();
  }
  toggleTipFocus() {
    if (this._gettingStartedTipPartRef?.hasFocus()) {
      this.focusInput();
      return true;
    }
    if (!this._gettingStartedTipPartRef) {
      return false;
    }
    this._gettingStartedTipPartRef.focus();
    return true;
  }
  hasInputFocus() {
    return this.input.hasFocus();
  }
  refreshParsedInput() {
    if (!this.viewModel) {
      return;
    }
    const previous = this.parsedChatRequest;
    const context2 = {
      selectedAgent: this._lastSelectedAgent,
      mode: this.input.currentModeKind,
      attachmentCapabilities: this.attachmentCapabilities,
      sessionType: getChatSessionType(this.viewModel.model.sessionResource),
      forcedAgent: this._lockedAgent?.id ? this.chatAgentService.getAgent(this._lockedAgent.id) : void 0
    };
    this.parsedChatRequest = this.instantiationService.createInstance(ChatRequestParser).parseChatRequestWithReferences(getDynamicVariablesForWidget(this), getSelectedToolAndToolSetsForWidget(this), this.getInput(), this.location, context2);
    if (!previous || !IParsedChatRequest.equals(previous, this.parsedChatRequest)) {
      this._onDidChangeParsedInput.fire();
    }
  }
  getSibling(item, type) {
    if (!isResponseVM(item)) {
      return;
    }
    const items = this.viewModel?.getItems();
    if (!items) {
      return;
    }
    const responseItems = items.filter(i2 => isResponseVM(i2));
    const targetIndex = responseItems.indexOf(item);
    if (targetIndex === void 0) {
      return;
    }
    const indexToFocus = type === "next" ? targetIndex + 1 : targetIndex - 1;
    if (indexToFocus < 0 || indexToFocus > responseItems.length - 1) {
      return;
    }
    return responseItems[indexToFocus];
  }
  async clear(targetSessionType) {
    this.logService.debug("ChatWidget#clear");
    if (this._dynamicMessageLayoutData) {
      this._dynamicMessageLayoutData.enabled = true;
    }
    if (this.viewModel?.editing) {
      this.finishedEditing();
    }
    if (this.viewModel) {
      this.viewModel.resetInputPlaceholder();
    }
    if (this._lockedAgent) {
      this.lockToCodingAgent(this._lockedAgent.name, this._lockedAgent.displayName, this._lockedAgent.id, this._lockedAgent.agentHostProviderId);
    } else {
      this.unlockFromCodingAgent();
    }
    this.inputPart?.clearTodoListWidget(this.viewModel?.sessionResource, true);
    this.inputPart?.clearArtifactsWidget();
    this.chatSuggestNextWidget.hide();
    await this.viewOptions.clear?.(targetSessionType);
  }
  onDidChangeItems(skipDynamicLayout) {
    if (this._visible || !this.viewModel) {
      const items = this.viewModel?.getItems() ?? [];
      if (items.length > 0) {
        this.updateChatViewVisibility();
      } else {
        this.renderWelcomeViewContentIfNeeded();
      }
      this._onWillMaybeChangeHeight.fire();
      this.listWidget.setVisibleChangeCount(this.visibleChangeCount);
      this.listWidget.refresh();
      if (!skipDynamicLayout && this._dynamicMessageLayoutData) {
        this.layoutDynamicChatTreeItemMode();
      }
      this.renderFollowups();
    }
  }
  /**
   * Updates the DOM visibility of welcome view and chat list immediately
   */
  updateChatViewVisibility() {
    if (this.viewModel) {
      const isStandardLayout = this.viewOptions.renderStyle !== "compact" && this.viewOptions.renderStyle !== "minimal";
      const numItems = this.viewModel.getItems().length;
      setVisibility(numItems === 0, this.welcomeMessageContainer);
      setVisibility(numItems !== 0, this.listContainer);
      if (isStandardLayout && this.inputPart) {
        if (numItems === 0) {
          this.renderGettingStartedTipIfNeeded();
        } else {
          this.clearGettingStartedTip();
        }
      }
    }
    this.container.classList.toggle("chat-view-getting-started-disabled", this.chatEntitlementService.sentiment.completed || this.chatEntitlementService.hasByokModels);
    this._onDidChangeEmptyState.fire();
  }
  isEmpty() {
    return (this.viewModel?.getItems().length ?? 0) === 0;
  }
  /**
   * Renders the welcome view content when needed.
   */
  renderWelcomeViewContentIfNeeded() {
    if (this._isRenderingWelcome) {
      return;
    }
    if (!this.inputPartDisposable.value) {
      return;
    }
    this._isRenderingWelcome = true;
    try {
      if (this.viewOptions.renderStyle === "compact" || this.viewOptions.renderStyle === "minimal" || this.lifecycleService.willShutdown) {
        return;
      }
      const numItems = this.viewModel?.getItems().length ?? 0;
      if (!numItems) {
        const defaultAgent = this.chatAgentService.getDefaultAgent(this.location, this.input.currentModeKind);
        let additionalMessage;
        if (product_default.defaultChatAgent && this.chatEntitlementService.anonymous && !this.chatEntitlementService.sentiment.completed) {
          const providers2 = product_default.defaultChatAgent.provider;
          additionalMessage = new MarkdownString(localize("recovered.11422", "By continuing with {0} Copilot, you agree to {1}'s [Terms]({2}) and [Privacy Statement]({3}).", providers2.default.name, providers2.default.name, product_default.defaultChatAgent.termsStatementUrl, product_default.defaultChatAgent.privacyStatementUrl), {
            isTrusted: true
          });
        } else {
          additionalMessage = defaultAgent?.metadata.additionalWelcomeMessage;
        }
        if (!additionalMessage && !this._lockedAgent) {
          additionalMessage = this._getGenerateInstructionsMessage();
        }
        const welcomeContent = this.getWelcomeViewContent(additionalMessage);
        if (!this.welcomePart.value || this.welcomePart.value.needsRerender(welcomeContent)) {
          clearNode(this.welcomeMessageContainer);
          this.welcomePart.value = this.instantiationService.createInstance(ChatViewWelcomePart, welcomeContent, {
            location: this.location,
            isWidgetAgentWelcomeViewContent: this.input?.currentModeKind === "agent" /* Agent */
          });
          append(this.welcomeMessageContainer, this.welcomePart.value.element);
        }
      }
      this.updateChatViewVisibility();
    } finally {
      this._isRenderingWelcome = false;
    }
  }
  renderGettingStartedTipIfNeeded() {
    if (!this.inputPart || !this.viewModel) {
      return;
    }
    const tipContainer = this.inputPart.gettingStartedTipContainerElement;
    const tip = this.chatTipService.getWelcomeTip(this.contextKeyService);
    if (!tip) {
      this.clearGettingStartedTip();
      return;
    }
    if (this._gettingStartedTipPart.value) {
      setVisibility(true, tipContainer);
      return;
    }
    const store = new DisposableStore();
    const renderer = this.instantiationService.createInstance(ChatContentMarkdownRenderer);
    const tipPart = store.add(this.instantiationService.createInstance(ChatTipContentPart, tip, renderer));
    this._gettingStartedTipPartRef = tipPart;
    store.add(tipPart.onDidHide(() => {
      tipPart.domNode.remove();
      this._gettingStartedTipPartRef = void 0;
      this._gettingStartedTipPart.clear();
      setVisibility(false, tipContainer);
      this.focusInput();
    }));
    this._gettingStartedTipPart.value = store;
    clearNode(tipContainer);
    tipContainer.appendChild(tipPart.domNode);
    setVisibility(true, tipContainer);
  }
  clearGettingStartedTip() {
    this._gettingStartedTipPartRef = void 0;
    this._gettingStartedTipPart.clear();
    if (this.inputPart) {
      const tipContainer = this.inputPart.gettingStartedTipContainerElement;
      clearNode(tipContainer);
      setVisibility(false, tipContainer);
    }
  }
  _getGenerateInstructionsMessage() {
    if (!this._instructionFilesCheckPromise) {
      this._instructionFilesCheckPromise = this._checkForAgentInstructionFiles();
      this._register(thenIfNotDisposed(this._instructionFilesCheckPromise, hasFiles => {
        this._instructionFilesExist = hasFiles;
        const hasViewModelItems = this.viewModel?.getItems().length ?? 0;
        if (hasViewModelItems === 0) {
          this.renderWelcomeViewContentIfNeeded();
        }
      }));
    }
    if (this._instructionFilesExist === true) {
      return new MarkdownString("");
    } else if (this._instructionFilesExist === false) {
      return new MarkdownString(localize("recovered.11417", "[Generate Agent Instructions]({0}) to onboard AI onto your codebase.", `command:${GENERATE_AGENT_INSTRUCTIONS_COMMAND_ID}`), {
        isTrusted: {
          enabledCommands: [GENERATE_AGENT_INSTRUCTIONS_COMMAND_ID]
        }
      });
    }
    return new MarkdownString("");
  }
  /**
   * Checks if any agent instruction files (.github/copilot-instructions.md or AGENTS.md) exist in the workspace.
   * Used to determine whether to show the "Generate Agent Instructions" hint.
   *
   * @returns true if instruction files exist OR if instruction features are disabled (to hide the hint)
   */
  async _checkForAgentInstructionFiles() {
    try {
      return (await this.promptsService.listAgentInstructions(CancellationToken.None)).length > 0;
    } catch (error) {
      this.logService.warn("[ChatWidget] Error checking for instruction files:", error);
      return false;
    }
  }
  getWelcomeViewContent(additionalMessage) {
    if (this.isLockedToCodingAgent) {
      const contribution = this._lockedAgent ? this.chatSessionsService.getChatSessionContribution(this._lockedAgent.id) : void 0;
      const providerIcon = contribution?.icon;
      const providerTitle = contribution?.welcomeTitle;
      const providerMessage = contribution?.welcomeMessage;
      const message = providerMessage ? new MarkdownString(providerMessage) : this._lockedAgent?.prefix === "@copilot " ? new MarkdownString(localize("recovered.11419", "This chat session will be forwarded to the {0} [coding agent]({1}) where work is completed in the background. ", this._lockedAgent.prefix, "https://aka.ms/coding-agent-docs") + DISCLAIMER, {
        isTrusted: true
      }) : new MarkdownString(localize("recovered.11421", "This chat session will be forwarded to the {0} coding agent where work is completed in the background. ", this._lockedAgent?.prefix) + DISCLAIMER);
      return {
        title: providerTitle ?? localize("recovered.11418", "Delegate to {0}", this._lockedAgent?.prefix),
        message,
        icon: providerIcon ?? Codicon.sendToRemoteAgent,
        additionalMessage,
        useLargeIcon: !!providerIcon
      };
    }
    let title;
    if (this.input.currentModeKind === "ask" /* Ask */) {
      title = localize("recovered.11415", "Ask about your code");
    } else if (this.input.currentModeKind === "edit" /* Edit */) {
      title = localize("recovered.11420", "Edit in context");
    } else {
      title = localize("recovered.11408", "Build with Agent");
    }
    return {
      title,
      message: new MarkdownString(DISCLAIMER),
      icon: Codicon.chatSparkle,
      additionalMessage
    };
  }
  async renderChatEditingSessionState() {
    if (!this.input) {
      return;
    }
    this.input.renderChatEditingSessionState(this._editingSession.get() ?? null);
  }
  async renderFollowups() {
    const lastItem = this.listWidget.lastItem;
    if (lastItem && isResponseVM(lastItem) && lastItem.isComplete) {
      this.input.renderFollowups(lastItem.replyFollowups, lastItem);
    } else {
      this.input.renderFollowups(void 0, void 0);
    }
  }
  renderChatSuggestNextWidget() {
    if (this.lifecycleService.willShutdown) {
      return;
    }
    if (this._readOnly) {
      this.chatSuggestNextWidget.hide();
      return;
    }
    if (this.isLockedToCodingAgent && !this._attachmentCapabilities.supportsHandOffs) {
      this.chatSuggestNextWidget.hide();
      return;
    }
    const items = this.viewModel?.getItems() ?? [];
    if (!items.length) {
      return;
    }
    const lastItem = items[items.length - 1];
    const lastResponseComplete = lastItem && isResponseVM(lastItem) && lastItem.isComplete;
    if (!lastResponseComplete || lastItem.isCanceled) {
      this.chatSuggestNextWidget.hide();
      return;
    }
    const modeInfo = lastItem.model.request?.modeInfo;
    let responseMode;
    const modes = this.input.currentChatModesObs.get();
    if (modeInfo?.modeInstructions?.name) {
      responseMode = modes.findModeByName(modeInfo.modeInstructions.name);
    } else {
      responseMode = this.input.currentModeObs.get();
    }
    const handoffs = responseMode?.handOffs?.get();
    if (responseMode && handoffs && handoffs.length > 0) {
      const permissionLevel = this.inputPart.currentModeInfo.permissionLevel;
      if (permissionLevel === "autopilot" /* Autopilot */) {
        const autoSendHandoff = handoffs.find(h3 => h3.send);
        if (autoSendHandoff) {
          this.handleNextPromptSelection(autoSendHandoff);
          return;
        }
      }
      const wasHidden = this.chatSuggestNextWidget.domNode.style.display === "none";
      this.chatSuggestNextWidget.render(responseMode);
      if (wasHidden) {
        this.telemetryService.publicLog2("chat.handoffWidgetShown", {
          agent: getModeNameForTelemetry(responseMode),
          handoffCount: handoffs.length
        });
      }
    } else {
      this.chatSuggestNextWidget.hide();
    }
    if (this.bodyDimension) {
      this.layout(this.bodyDimension.height, this.bodyDimension.width);
    }
  }
  handleNextPromptSelection(handoff, agentId, withAutopilot) {
    this.chatSuggestNextWidget.hide();
    if (withAutopilot) {
      this.inputPart.setPermissionLevel("autopilot" /* Autopilot */);
    }
    const promptToUse = handoff.prompt;
    const currentMode = this.input.currentModeObs.get();
    const toMode = handoff.agent ? this.input.currentChatModesObs.get().findModeByName(handoff.agent) : void 0;
    this.telemetryService.publicLog2("chat.handoffClicked", {
      fromAgent: getModeNameForTelemetry(currentMode),
      toAgent: agentId || (toMode ? getModeNameForTelemetry(toMode) : ""),
      hasPrompt: Boolean(promptToUse),
      autoSend: Boolean(handoff.send)
    });
    this.executeHandoff(handoff, agentId).catch(e => {
      const target = agentId ?? handoff.agent ?? "unknown";
      this.logService.error(`[Handoff] Failed to execute handoff '${handoff.label}' to '${target}'`, e);
    });
  }
  async executeHandoff(handoff, agentId) {
    this.chatSuggestNextWidget.hide();
    const promptToUse = handoff.prompt;
    if (agentId) {
      this.input.setValue(`@${agentId} ${promptToUse}`, false);
      this.input.focus();
      this.acceptInput().catch(e => this.logService.error(`[Handoff] Failed to submit delegated handoff to '@${agentId}'`, e));
    } else if (handoff.agent) {
      const switched = await this._switchToAgentByName(handoff.agent);
      if (!switched) {
        this.logService.warn(`[Handoff] Did not execute handoff '${handoff.label}' to '${handoff.agent}' because switching agents was unsuccessful`);
        return;
      }
      const modelReady = handoff.model ? this.input.requestModelByQualifiedName([handoff.model]) : void 0;
      this.input.setValue(promptToUse, false);
      this.input.focus();
      if (handoff.send) {
        if (modelReady && !(await modelReady)) {
          return;
        }
        this.acceptInput().catch(e => this.logService.error(`[Handoff] Failed to submit handoff to '${handoff.agent}'`, e));
      }
    }
  }
  async handleDelegationExitIfNeeded(sourceAgent, targetAgent) {
    if (!this._shouldExitAfterDelegation(sourceAgent, targetAgent)) {
      return;
    }
    this.logService.debug(`[Delegation] Will exit after delegation: sourceAgent=${sourceAgent?.id}, targetAgent=${targetAgent?.id}`);
    try {
      await this._handleDelegationExit();
    } catch (e) {
      this.logService.error("[Delegation] Failed to handle delegation exit", e);
    }
  }
  _shouldExitAfterDelegation(sourceAgent, targetAgent) {
    if (!targetAgent) {
      this.logService.debug("[Delegation] _shouldExitAfterDelegation: false (no targetAgent)");
      return false;
    }
    if (!this.configurationService.getValue("chat.exitAfterDelegation" /* ExitAfterDelegation */)) {
      this.logService.debug("[Delegation] _shouldExitAfterDelegation: false (ExitAfterDelegation config disabled)");
      return false;
    }
    if (sourceAgent && sourceAgent.id === targetAgent.id) {
      this.logService.debug("[Delegation] _shouldExitAfterDelegation: false (source and target agents are the same)");
      return false;
    }
    if (!isIChatViewViewContext(this.viewContext)) {
      this.logService.debug("[Delegation] _shouldExitAfterDelegation: false (not in chat view context)");
      return false;
    }
    const contribution = this.chatSessionsService.getChatSessionContribution(targetAgent.id);
    if (!contribution) {
      this.logService.debug(`[Delegation] _shouldExitAfterDelegation: false (no contribution found for targetAgent.id=${targetAgent.id})`);
      return false;
    }
    if (contribution.canDelegate !== true) {
      this.logService.debug(`[Delegation] _shouldExitAfterDelegation: false (contribution.canDelegate=${contribution.canDelegate}, expected true)`);
      return false;
    }
    this.logService.debug("[Delegation] _shouldExitAfterDelegation: true");
    return true;
  }
  /**
   * Handles the exit of the panel chat when a delegation to another session occurs.
   * Waits for the response to complete and any pending confirmations to be resolved,
   * then clears the widget unless the final message is an error.
   */
  async _handleDelegationExit() {
    const viewModel = this.viewModel;
    if (!viewModel) {
      this.logService.debug("[Delegation] _handleDelegationExit: no viewModel, returning");
      return;
    }
    const parentSessionResource = viewModel.sessionResource;
    this.logService.debug(`[Delegation] _handleDelegationExit: parentSessionResource=${parentSessionResource.toString()}`);
    const checkIfShouldClear = () => {
      const items = viewModel.getItems();
      const lastItem = items[items.length - 1];
      if (lastItem && isResponseVM(lastItem) && lastItem.model && lastItem.isComplete && !lastItem.model.isPendingConfirmation.get()) {
        const hasError = Boolean(lastItem.result?.errorDetails);
        return !hasError;
      }
      return false;
    };
    if (checkIfShouldClear()) {
      this.logService.debug("[Delegation] Response complete, archiving session before clearing");
      await this.archiveLocalParentSession(parentSessionResource);
      await this.clear();
      return;
    }
    this.logService.debug("[Delegation] Waiting for response to complete...");
    const shouldClear = await new Promise(resolve3 => {
      const disposable = viewModel.onDidChange(() => {
        const result = checkIfShouldClear();
        if (result) {
          cleanup();
          resolve3(true);
        }
      });
      const timeout2 = setTimeout(() => {
        this.logService.debug("[Delegation] Timeout waiting for response to complete");
        cleanup();
        resolve3(false);
      }, 3e4);
      const cleanup = () => {
        clearTimeout(timeout2);
        disposable.dispose();
      };
    });
    if (shouldClear) {
      this.logService.debug("[Delegation] Response completed, archiving session before clearing");
      await this.archiveLocalParentSession(parentSessionResource);
      await this.clear();
    } else {
      this.logService.debug("[Delegation] Not clearing (timeout or error)");
    }
  }
  async archiveLocalParentSession(sessionResource) {
    if (getChatSessionType(sessionResource) !== localChatSessionType && !IsSessionsWindowContext.getValue(this.contextKeyService)) {
      return;
    }
    this.logService.debug(`[Delegation] archiveLocalParentSession: archiving session ${sessionResource.toString()}`);
    await this.chatService.getSession(sessionResource)?.editingSession?.accept();
    const session = this.agentSessionsService.getSession(sessionResource);
    if (session) {
      session.setArchived(true);
      this.logService.debug("[Delegation] archiveLocalParentSession: session archived successfully");
    } else {
      this.logService.warn(`[Delegation] archiveLocalParentSession: session not found in agentSessionsService for ${sessionResource.toString()}`);
    }
  }
  /**
   * Mark the chat shown in this widget as read-only (non-interactive) or not.
   * Read-only chats hide the composer and expose a context key so mutating
   * actions (e.g. Start Over, Restore Checkpoint) are not offered.
   */
  setReadOnly(readOnly) {
    const wasReadOnly = this._readOnly;
    this._readOnly = readOnly;
    this._readOnlyContextKey.set(readOnly);
    if (readOnly) {
      if (this.viewModel?.editing) {
        this.finishedEditing();
      }
      this.chatSuggestNextWidget.hide();
      if (this.hasInputFocus()) {
        if (this.listWidget.focusLastItem(true) < 0) {
          this.listWidget.focus();
        }
      }
    } else if (wasReadOnly) {
      this.renderChatSuggestNextWidget();
    }
    this.readOnlyBanner?.setVisible(readOnly);
    this.setInputVisible(!readOnly);
    this._applyRendererEditable(!readOnly);
    if (this.visible) {
      this.listWidget?.rerender();
    }
  }
  /**
   * Applies the renderer's `editable` option, forcing it off while the chat is
   * read-only so the lock/unlock transitions can never re-enable request
   * editing on a read-only chat.
   */
  _applyRendererEditable(editable) {
    this.listWidget?.updateRendererOptions({
      editable: editable && !this._readOnly
    });
  }
  /**
   * Show or hide the input part. Hidden inputs are removed from the DOM flow
   * unless they contain persistent content. Used to render read-only chats
   * without a composer while retaining input-adjacent status controls.
   */
  setInputVisible(visible) {
    const changed = this._inputVisible !== visible;
    this._inputVisible = visible;
    this._applyInputVisibility();
    if (changed && this.bodyDimension) {
      this._layoutListForInputHeight();
    }
  }
  _applyInputVisibility() {
    const inputElement = this.inputPartDisposable.value?.element;
    if (inputElement) {
      inputElement.classList.toggle("chat-input-hidden", !this._inputVisible);
      inputElement.style.display = "";
    }
  }
  setVisible(visible) {
    const wasVisible = this._visible;
    this._visible = visible;
    this.visibleChangeCount++;
    this.listWidget.setVisible(visible);
    this.input.setVisible(visible);
    if (visible) {
      if (!wasVisible) {
        this.visibilityTimeoutDisposable.value = disposableTimeout(() => {
          if (this._visible) {
            this.onDidChangeItems(true);
          }
        }, 0);
        this.visibilityAnimationFrameDisposable.value = scheduleAtNextAnimationFrame(getWindow(this.listContainer), () => {
          this._onDidShow.fire();
        });
      }
    } else if (wasVisible) {
      this._onDidHide.fire();
    }
  }
  createList(listContainer, options3) {
    const overflowWidgetsContainer = document.createElement("div");
    overflowWidgetsContainer.classList.add("chat-overflow-widget-container", "monaco-editor");
    listContainer.append(overflowWidgetsContainer);
    this.listWidget = this._register(this.instantiationService.createInstance(ChatListWidget, listContainer, {
      rendererOptions: options3,
      defaultElementHeight: this.viewOptions.defaultElementHeight ?? 200,
      overflowWidgetsDomNode: overflowWidgetsContainer,
      styles: {
        listForeground: this.styles.listForeground,
        listBackground: this.styles.listBackground
      },
      currentChatMode: () => this.input.currentModeKind,
      filter: this.viewOptions.filter ? {
        filter: this.viewOptions.filter.bind(this.viewOptions)
      } : void 0,
      viewModel: this.viewModel,
      editorOptions: this.editorOptions,
      location: this.location,
      getSelectedModelRequestOptions: () => this.getSelectedModelRequestOptions(),
      getCurrentModeInfo: () => this.input.currentModeInfo
    }));
    this._register(this.listWidget.onDidClickRequest(async item => {
      this.clickedRequest(item);
    }));
    this._register(this.listWidget.onDidRerender(item => {
      if (isRequestVM(item.currentElement) && this.configurationService.getValue("chat.editRequests") !== "input") {
        if (!item.rowContainer.contains(this.inputContainer)) {
          item.rowContainer.appendChild(this.inputContainer);
        }
        this.input.focus();
      }
    }));
    this._register(this.listWidget.onDidDispose(() => {
      this.focusedInputDOM.appendChild(this.inputContainer);
      this.input.focus();
    }));
    this._register(this.listWidget.onDidFocusOutside(() => {
      this.finishedEditing();
    }));
    this._register(this.listWidget.onDidClickFollowup(item => {
      this.acceptInput(item.message);
    }));
    this._register(this.listWidget.onDidChangeContentHeight(() => {
      this._onDidChangeContentHeight.fire();
    }));
    this._register(this.listWidget.onDidFocus(() => {
      this._onDidFocus.fire();
    }));
    this._register(this.listWidget.onDidScroll(() => {
      this._onDidScroll.fire();
    }));
  }
  startEditing(requestId) {
    if (this._readOnly) {
      return;
    }
    const editedRequest = this.listWidget.getTemplateDataForRequestId(requestId);
    if (editedRequest) {
      this.clickedRequest(editedRequest);
    }
  }
  clickedRequest(item) {
    const currentElement = item.currentElement;
    if (isRequestVM(currentElement) && !this.viewModel?.editing) {
      const requests = this.viewModel?.model.getRequests();
      if (!requests || !this.viewModel?.sessionResource) {
        return;
      }
      if (this.viewModel?.model.checkpoint) {
        this.recentlyRestoredCheckpoint = true;
      }
      this.viewModel?.model.setCheckpoint(currentElement.id);
      const currentContext = [];
      const addedContextIds = /* @__PURE__ */new Set();
      const addToContext = entry => {
        const dedupKey2 = entry.range ? `${entry.id}:${entry.range.start}-${entry.range.endExclusive}` : entry.id;
        if (addedContextIds.has(dedupKey2) || isWorkspaceVariableEntry(entry)) {
          return;
        }
        if ((isPromptFileVariableEntry(entry) || isPromptTextVariableEntry(entry)) && entry.automaticallyAdded) {
          return;
        }
        addedContextIds.add(dedupKey2);
        currentContext.push(entry);
      };
      for (let i2 = requests.length - 1; i2 >= 0; i2 -= 1) {
        const request2 = requests[i2];
        if (request2.id === currentElement.id) {
          request2.setShouldBeBlocked(false);
          request2.attachedContext?.forEach(addToContext);
        }
      }
      currentElement.variables.forEach(addToContext);
      this.viewModel?.setEditing(currentElement);
      if (item?.contextKeyService) {
        ChatContextKeys.currentlyEditing.bindTo(item.contextKeyService).set(true);
      }
      const isEditingSentRequest = currentElement.pendingKind === void 0 ? ChatContextKeys.EditingRequestType.Sent : currentElement.pendingKind === "queued" /* Queued */ ? ChatContextKeys.EditingRequestType.Queue : ChatContextKeys.EditingRequestType.Steer;
      const isInput = this.configurationService.getValue("chat.editRequests") === "input";
      this.inputPart?.setEditing(!!this.viewModel?.editing && isInput, isEditingSentRequest);
      if (!isInput) {
        const rowContainer = item.rowContainer;
        this.inputContainer = $(".chat-edit-input-container");
        rowContainer.appendChild(this.inputContainer);
        this.createInput(this.inputContainer);
        this.input.setChatMode(this.inputPart.currentModeObs.get().id);
        this.input.setPermissionLevel(this.inputPart.currentModeInfo.permissionLevel ?? "default" /* Default */);
        this.input.setEditing(true, isEditingSentRequest);
        this._onDidChangeActiveInputEditor.fire();
      } else {
        this.inputPart.element.classList.add("editing");
      }
      if (currentElement.modelId) {
        void this.input.requestModelByIdentifier(currentElement.modelId);
      }
      this.inputPart.toggleChatInputOverlay(!isInput);
      if (currentContext.length > 0) {
        this.input.attachmentModel.addContext(...currentContext);
      }
      this.inputPart.dnd.setDisabledOverlay(!isInput);
      this.input.renderAttachedContext();
      this.input.setValue(currentElement.messageText, false);
      const dynamicVariableModel = this.getContrib(ChatDynamicVariableModel.ID);
      const editorModel = this.input.inputEditor.getModel();
      if (dynamicVariableModel && editorModel) {
        const modelTextLength = editorModel.getValueLength();
        for (const entry of currentContext) {
          if (entry.range) {
            if (entry.range.start >= entry.range.endExclusive) {
              continue;
            }
            if (entry.range.start < 0 || entry.range.endExclusive > modelTextLength) {
              continue;
            }
            const startPos = editorModel.getPositionAt(entry.range.start);
            const endPos = editorModel.getPositionAt(entry.range.endExclusive);
            dynamicVariableModel.addReference({
              id: entry.id,
              range: new Range2(startPos.lineNumber, startPos.column, endPos.lineNumber, endPos.column),
              data: entry.value,
              fullName: entry.fullName,
              icon: entry.icon,
              modelDescription: entry.modelDescription,
              isFile: entry.kind === "file",
              isDirectory: entry.kind === "directory"
            });
          }
        }
      }
      this.listWidget.suppressAutoScroll = true;
      this.onDidChangeItems();
      this.input.inputEditor.focus();
      this._register(this.inputPart.onDidClickOverlay(() => {
        if (this.viewModel?.editing && this.configurationService.getValue("chat.editRequests") !== "input") {
          this.finishedEditing();
        }
      }));
      if (!isInput) {
        this._register(this.inlineInputPart.inputEditor.onDidChangeModelContent(() => {
          this.listWidget.scrollToCurrentItem(currentElement);
        }));
        this._register(this.inlineInputPart.inputEditor.onDidChangeCursorSelection(e => {
          this.listWidget.scrollToCurrentItem(currentElement);
        }));
      }
    }
    this.telemetryService.publicLog2("chat.startEditingRequests", {
      editRequestType: this.configurationService.getValue("chat.editRequests")
    });
  }
  finishedEditing(completedEdit) {
    this.listWidget.suppressAutoScroll = false;
    const editedRequest = this.listWidget.getTemplateDataForRequestId(this.viewModel?.editing?.id);
    if (this.recentlyRestoredCheckpoint) {
      this.recentlyRestoredCheckpoint = false;
    } else {
      this.viewModel?.model.setCheckpoint(void 0);
    }
    this.inputPart.dnd.setDisabledOverlay(false);
    if (editedRequest?.contextKeyService) {
      ChatContextKeys.currentlyEditing.bindTo(editedRequest.contextKeyService).set(false);
    }
    const isInput = this.configurationService.getValue("chat.editRequests") === "input";
    if (!isInput) {
      this.inputPart.setChatMode(this.input.currentModeObs.get().id);
      this.inputPart.setPermissionLevel(this.input.currentModeInfo.permissionLevel ?? "default" /* Default */);
      const editModelId = this.input.currentLanguageModel;
      if (editModelId) {
        void this.inputPart.requestModelByIdentifier(editModelId);
      }
      this.inputPart?.toggleChatInputOverlay(false);
      try {
        if (editedRequest?.rowContainer?.contains(this.inputContainer)) {
          editedRequest.rowContainer.removeChild(this.inputContainer);
        } else if (this.inputContainer.parentElement) {
          this.inputContainer.parentElement.removeChild(this.inputContainer);
        }
      } catch (e) {
        this.logService.error("Error occurred while finishing editing:", e);
      }
      this.inputContainer = $(".empty-chat-state");
      this.input.dispose();
    }
    if (isInput) {
      this.inputPart.element.classList.remove("editing");
    }
    this.viewModel?.setEditing(void 0);
    this.inputPart?.setEditing(false, void 0);
    if (!isInput) {
      this._onDidChangeActiveInputEditor.fire();
    }
    this.onDidChangeItems();
    this.telemetryService.publicLog2("chat.editRequestsFinished", {
      editRequestType: this.configurationService.getValue("chat.editRequests"),
      editCanceled: !completedEdit
    });
    this.inputPart.focus();
  }
  getWidgetViewKindTag() {
    if (!this.viewContext) {
      return "editor";
    } else if (isIChatViewViewContext(this.viewContext)) {
      return "view";
    } else {
      return "quick";
    }
  }
  createInput(container3, options3) {
    const commonConfig = {
      renderFollowups: options3?.renderFollowups ?? true,
      renderStyle: options3?.renderStyle === "minimal" ? "compact" : options3?.renderStyle,
      renderInputToolbarBelowInput: options3?.renderInputToolbarBelowInput ?? false,
      menus: {
        executeToolbar: MenuId.ChatExecute,
        telemetrySource: "chatWidget",
        ...this.viewOptions.menus
      },
      editorOverflowWidgetsDomNode: this.viewOptions.editorOverflowWidgetsDomNode,
      enableImplicitContext: this.viewOptions.enableImplicitContext,
      renderWorkingSet: this.viewOptions.enableWorkingSet === "explicit",
      supportsChangingModes: this.viewOptions.supportsChangingModes,
      dndContainer: this.viewOptions.dndContainer,
      inputEditorMinLines: this.viewOptions.inputEditorMinLines,
      widgetViewKindTag: this.getWidgetViewKindTag(),
      defaultMode: this.viewOptions.defaultMode,
      sessionTypePickerDelegate: this.viewOptions.sessionTypePickerDelegate,
      workspacePickerDelegate: this.viewOptions.workspacePickerDelegate,
      isSessionsWindow: this.viewOptions.isSessionsWindow
    };
    if (this.viewModel?.editing) {
      const editedRequest = this.listWidget.getTemplateDataForRequestId(this.viewModel?.editing?.id);
      const scopedInstantiationService = this._register(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, editedRequest?.contextKeyService])));
      this.inlineInputPartDisposable.value = scopedInstantiationService.createInstance(ChatInputPart, this.location, commonConfig, this.styles, true);
    } else {
      this.inputPartDisposable.value = this.instantiationService.createInstance(ChatInputPart, this.location, commonConfig, this.styles, false);
      this._register(autorun(reader => {
        this.inputPart.height.read(reader);
        if (!this.listWidget) {
          return;
        }
        if (this.bodyDimension) {
          this._layoutListForInputHeight();
        }
        this._onDidChangeContentHeight.fire();
      }));
    }
    this.input.render(container3, "", this);
    this._applyInputVisibility();
    if (this.bodyDimension?.width) {
      this.input.layout(this.bodyDimension.width);
    }
    this._register(this.input.onDidLoadInputState(() => {
      this.refreshParsedInput();
    }));
    this._register(this.input.onDidFocus(() => this._onDidFocus.fire()));
    this._register(this.input.onDidAcceptFollowup(e => {
      if (!this.viewModel) {
        return;
      }
      let msg = "";
      if (e.followup.agentId && e.followup.agentId !== this.chatAgentService.getDefaultAgent(this.location, this.input.currentModeKind)?.id) {
        const agent = this.chatAgentService.getAgent(e.followup.agentId);
        if (!agent) {
          return;
        }
        this.lastSelectedAgent = agent;
        msg = `${chatAgentLeader}${agent.name} `;
        if (e.followup.subCommand) {
          msg += `${chatSubcommandLeader}${e.followup.subCommand} `;
        }
      } else if (!e.followup.agentId && e.followup.subCommand && this.chatSlashCommandService.hasCommand(e.followup.subCommand, getChatSessionType(this.viewModel.model.sessionResource))) {
        msg = `${chatSubcommandLeader}${e.followup.subCommand} `;
      }
      msg += e.followup.message;
      this.acceptInput(msg);
      if (!e.response) {
        return;
      }
      this.chatService.notifyUserAction({
        sessionResource: this.viewModel.sessionResource,
        requestId: e.response.requestId,
        agentId: e.response.agent?.id,
        command: e.response.slashCommand?.name,
        result: e.response.result,
        action: {
          kind: "followUp",
          followup: e.followup
        }
      });
    }));
    this._register(this.inputEditor.onDidChangeModelContent(() => {
      this.parsedChatRequest = void 0;
      this.updateChatInputContext();
    }));
    this._register(this.chatAgentService.onDidChangeAgents(() => {
      this.parsedChatRequest = void 0;
      this.renderWelcomeViewContentIfNeeded();
    }));
    this._register(this.input.onDidChangeCurrentChatMode(() => {
      this.renderWelcomeViewContentIfNeeded();
      this.refreshParsedInput();
      this.renderFollowups();
      this.renderChatSuggestNextWidget();
    }));
    const foregroundSessionCountContextKeys = /* @__PURE__ */new Set([ChatContextKeys.foregroundSessionCount.key]);
    const hasByokModelsContextKeys = /* @__PURE__ */new Set([ChatEntitlementContextKeys.hasByokModels.key]);
    this._register(this.contextKeyService.onDidChangeContext(e => {
      if (e.affectsSome(foregroundSessionCountContextKeys) && this.isEmpty()) {
        this.renderGettingStartedTipIfNeeded();
      }
      if (e.affectsSome(hasByokModelsContextKeys)) {
        this.updateChatViewVisibility();
      }
    }));
    let previousModelIdentifier;
    this._register(autorun(reader => {
      const modelIdentifier = this.inputPart.selectedLanguageModel.read(reader)?.identifier;
      if (previousModelIdentifier === void 0) {
        previousModelIdentifier = modelIdentifier;
        return;
      }
      if (previousModelIdentifier === modelIdentifier) {
        return;
      }
      previousModelIdentifier = modelIdentifier;
      if (!this._gettingStartedTipPartRef) {
        return;
      }
      this.chatTipService.getWelcomeTip(this.contextKeyService);
    }));
    this._register(autorun(r2 => {
      const toolSetIds = /* @__PURE__ */new Set();
      const toolIds = /* @__PURE__ */new Set();
      for (const [entry, enabled] of this.input.selectedToolsModel.entriesMap.read(r2)) {
        if (enabled) {
          if (isToolSet(entry)) {
            toolSetIds.add(entry.id);
          } else {
            toolIds.add(entry.id);
          }
        }
      }
      const disabledTools = this.input.attachmentModel.attachments.filter(a => a.kind === "tool" && !toolIds.has(a.id) || a.kind === "toolset" && !toolSetIds.has(a.id)).map(a => a.id);
      this.input.attachmentModel.updateContext(disabledTools, Iterable.empty());
      this.refreshParsedInput();
    }));
  }
  onDidStyleChange() {
    this.container.style.setProperty("--vscode-interactive-result-editor-background-color", this.editorOptions.configuration.resultEditor.backgroundColor?.toString() ?? "");
    this.container.style.setProperty("--vscode-interactive-session-foreground", this.editorOptions.configuration.foreground?.toString() ?? "");
    this.container.style.setProperty("--vscode-chat-list-background", this.themeService.getColorTheme().getColor(this.styles.listBackground)?.toString() ?? "");
  }
  /**
   * Updates the widget's color styles after construction. Propagates the new
   * `listForeground`/`listBackground` to the list widget, pushes the new color
   * tokens into `editorOptions` so subscribers (code blocks, result/input editor
   * backgrounds, container CSS variables) pick them up via `onDidChange`, and
   * refreshes the CSS variables the chat container exposes for stylesheet rules.
   */
  setStyles(styles) {
    const oldStyles = this.styles;
    this.styles = styles;
    const listColorsChanged = oldStyles.listBackground !== styles.listBackground || oldStyles.listForeground !== styles.listForeground;
    if (listColorsChanged) {
      this.listWidget?.setStyles({
        listForeground: styles.listForeground,
        listBackground: styles.listBackground
      });
    }
    const editorColorsChanged = oldStyles.listForeground !== styles.listForeground || oldStyles.inputEditorBackground !== styles.inputEditorBackground || oldStyles.resultEditorBackground !== styles.resultEditorBackground;
    if (editorColorsChanged && this.container) {
      this.editorOptions.setColors(styles.listForeground, styles.inputEditorBackground, styles.resultEditorBackground);
    }
  }
  setModel(model) {
    if (!this.container || !this.inputPart) {
      this.logService.warn("ChatWidget#setModel called before render() completed");
      return;
    }
    const currentInputModel = this.viewModel?.model?.inputModel?.state?.get();
    if (!model) {
      logChangesToStateModel(this.viewModel?.model?.inputModel, `ChatWidget.setModel to empty, old ${this.viewModel?.sessionResource.toString()}`, void 0, currentInputModel, this.logService);
      this.inputPart.flushInputStateToModel();
      if (this.viewModel?.editing) {
        this.finishedEditing();
      }
      this.clearGettingStartedTip();
      this.viewModel = void 0;
      this.updateWorkingProgressBorder();
      this.onDidChangeItems();
      this._hasPendingRequestsContextKey.set(false);
      if (!this.viewOptions.isSessionsWindow) {
        this.setReadOnly(false);
      }
      return;
    }
    if (isEqual2(model.sessionResource, this.viewModel?.sessionResource)) {
      return;
    }
    logChangesToStateModel(model.inputModel, `ChatWidget.setModel new ${model.sessionResource.toString()}, old ${this.viewModel?.sessionResource.toString()}`, model.inputModel.state.get(), currentInputModel, this.logService);
    if (this.viewModel?.editing) {
      this.finishedEditing();
    }
    this.inputPart?.clearTodoListWidget(model.sessionResource, false);
    this.inputPart?.clearArtifactsWidget();
    this.chatSuggestNextWidget.hide();
    this.chatTipService.resetSession();
    this.clearGettingStartedTip();
    this.inputPart.setInputModel(model.inputModel, model.getRequests().length === 0, model.sessionResource);
    this.viewModel = this.instantiationService.createInstance(ChatViewModel, model, void 0);
    if (!this.viewOptions.isSessionsWindow) {
      this.viewModelDisposables.add(autorun(reader => this.setReadOnly(model.isReadOnly.read(reader))));
    }
    this.listWidget.setViewModel(this.viewModel);
    if (this._lockedAgent) {
      let placeholder = this.chatSessionsService.getChatSessionContribution(this._lockedAgent.id)?.inputPlaceholder;
      if (!placeholder) {
        placeholder = localize("recovered.11409", "Chat with {0}", this._lockedAgent.displayName || this._lockedAgent.name);
      }
      this.viewModel.setInputPlaceholder(placeholder);
      this.inputEditor.updateOptions({
        placeholder
      });
    } else if (this.viewModel.inputPlaceholder) {
      this.inputEditor.updateOptions({
        placeholder: this.viewModel.inputPlaceholder
      });
    }
    this.viewModelDisposables.add(Event2.runAndSubscribe(Event2.accumulate(this.viewModel.onDidChange), events => {
      if (!this.viewModel || this._store.isDisposed) {
        return;
      }
      this.requestInProgress.set(this.viewModel.model.requestInProgress.get());
      this.hasActiveRequest.set(this.viewModel.model.hasActiveRequest.get());
      this.updateWorkingProgressBorder();
      if (events?.some(e => e?.kind === "changePlaceholder")) {
        this.inputEditor.updateOptions({
          placeholder: this.viewModel.inputPlaceholder
        });
      }
      this.onDidChangeItems();
      if (events?.some(e => e?.kind === "addRequest") && this.visible) {
        this.listWidget.scrollToEnd();
      }
    }));
    this.viewModelDisposables.add(this.viewModel.onDidDisposeModel(() => {
      if (this.viewModel?.editing) {
        this.finishedEditing();
      }
      this.viewModel = void 0;
      this.updateWorkingProgressBorder();
      this.onDidChangeItems();
    }));
    this._sessionIsEmptyContextKey.set(model.getRequests().length === 0);
    const updateSupportsFork = () => {
      const supportsFork = this.chatSessionsService.sessionSupportsFork(model.sessionResource);
      this._chatSessionSupportsForkContextKey.set(supportsFork);
      this.listWidget?.updateRendererOptions({
        supportsFork
      });
    };
    updateSupportsFork();
    this.viewModelDisposables.add(this.chatSessionsService.onDidChangeAvailability(() => updateSupportsFork()));
    this._sessionHasDebugDataContextKey.set(this.chatDebugService.getEvents(model.sessionResource).length > 0);
    let lastSteeringCount = 0;
    const updatePendingRequestKeys = announceSteering => {
      const pendingRequests = model.getPendingRequests();
      const pendingCount = pendingRequests.length;
      this._hasPendingRequestsContextKey.set(pendingCount > 0);
      const steeringCount = pendingRequests.filter(pending => pending.kind === "steering" /* Steering */).length;
      if (announceSteering && steeringCount > 0 && lastSteeringCount === 0) {
        status(localize("recovered.11414", "Steering"));
      }
      lastSteeringCount = steeringCount;
    };
    updatePendingRequestKeys(false);
    this.viewModelDisposables.add(model.onDidChangePendingRequests(() => updatePendingRequestKeys(true)));
    this.refreshParsedInput();
    this.viewModelDisposables.add(model.onDidChange(e => {
      if (e.kind === "setAgent") {
        this._onDidChangeAgent.fire({
          agent: e.agent,
          slashCommand: e.command
        });
        this._updateAgentCapabilitiesContextKeys(e.agent);
      }
      if (e.kind === "addRequest") {
        this.inputPart?.clearTodoListWidget(this.viewModel?.sessionResource, false);
        this._sessionIsEmptyContextKey.set(false);
        this.chatSuggestNextWidget.hide();
      }
      if (e.kind === "removeRequest") {
        this.inputPart?.clearTodoListWidget(this.viewModel?.sessionResource, true);
        this.chatSuggestNextWidget.hide();
        this._sessionIsEmptyContextKey.set((this.viewModel?.model.getRequests().length ?? 0) === 0);
      }
      if (e.kind === "completedRequest") {
        const lastRequest2 = this.viewModel?.model.getRequests().at(-1);
        const wasCancelled = lastRequest2?.response?.isCanceled ?? false;
        if (wasCancelled) {
          this.inputPart?.clearTodoListWidget(this.viewModel?.sessionResource, true);
        }
        this.renderChatSuggestNextWidget();
        if (this.visible && this.viewModel?.sessionResource) {
          this.agentSessionsService.getSession(this.viewModel.sessionResource)?.setRead(true);
        }
      }
    }));
    if (this.listWidget && this.visible) {
      this.onDidChangeItems();
      this.listWidget.scrollToEnd();
    }
    this.renderChatSuggestNextWidget();
    this.updateChatInputContext();
    this.input.renderChatTodoListWidget(this.viewModel.sessionResource);
    this.input.renderArtifactsWidget(this.viewModel.sessionResource);
  }
  getFocus() {
    return this.listWidget.getFocus()[0] ?? void 0;
  }
  reveal(item, relativeTop) {
    this.listWidget.reveal(item, relativeTop);
  }
  /**
   * The top offset of an item in transcript content space (same space as
   * `scrollTop`/`scrollHeight`), or `undefined` if it is not in the list.
   * Virtualization-safe for off-screen items (reads the layout height model).
   */
  getElementTop(item) {
    return this.listWidget.getElementTop(item);
  }
  focus(item) {
    if (!this.listWidget.hasElement(item)) {
      return;
    }
    this.listWidget.focusItem(item);
  }
  setInputPlaceholder(placeholder) {
    this.viewModel?.setInputPlaceholder(placeholder);
  }
  resetInputPlaceholder() {
    this.viewModel?.resetInputPlaceholder();
  }
  setInput(value2 = "") {
    this.input.setValue(value2, false);
    this.refreshParsedInput();
  }
  getInput() {
    return this.input.inputEditor.getValue();
  }
  getContrib(id2) {
    return this.contribs.find(c => c.id === id2);
  }
  // Coding agent locking methods
  lockToCodingAgent(name, displayName, agentId, agentHostProviderId) {
    if (this._lockedAgent?.id === agentId && this._lockedAgent.name === name && this._lockedAgent.displayName === displayName && this._lockedAgent.agentHostProviderId === agentHostProviderId) {
      return;
    }
    this._lockedAgent = {
      id: agentId,
      name,
      prefix: `@${name} `,
      displayName,
      agentHostProviderId
    };
    this._lockedToCodingAgentContextKey.set(true);
    this._lockedCodingAgentIdContextKey.set(agentId);
    this._chatIsAgentHostSessionContextKey.set(!!agentHostProviderId);
    this._chatAgentHostProviderIdContextKey.set(agentHostProviderId ?? "");
    this.renderWelcomeViewContentIfNeeded();
    const agent = this.chatAgentService.getAgent(agentId);
    this._updateAgentCapabilitiesContextKeys(agent);
    const supportsCheckpoints = this._attachmentCapabilities.supportsCheckpoints ?? false;
    this.listWidget?.updateRendererOptions({
      restorable: supportsCheckpoints,
      editable: supportsCheckpoints && !this._readOnly,
      noFooter: false,
      progressMessageAtBottomOfResponse: true
    });
    if (this.visible) {
      this.listWidget?.rerender();
    }
  }
  unlockFromCodingAgent() {
    if (!this._lockedAgent) {
      return;
    }
    this._lockedAgent = void 0;
    this._lockedToCodingAgentContextKey.set(false);
    this._lockedCodingAgentIdContextKey.set("");
    this._chatIsAgentHostSessionContextKey.set(false);
    this._chatAgentHostProviderIdContextKey.set("");
    this._chatSessionSupportsForkContextKey.set(false);
    this._updateAgentCapabilitiesContextKeys(void 0);
    this.renderWelcomeViewContentIfNeeded();
    if (this.viewModel) {
      this.viewModel.resetInputPlaceholder();
    }
    this.inputEditor?.updateOptions({
      placeholder: void 0
    });
    this.listWidget?.updateRendererOptions({
      restorable: true,
      editable: !this._readOnly,
      progressMessageAtBottomOfResponse: mode => mode !== "ask" /* Ask */
    });
    if (this.visible) {
      this.listWidget?.rerender();
    }
  }
  get isLockedToCodingAgent() {
    return !!this._lockedAgent;
  }
  get lockedAgentId() {
    return this._lockedAgent?.id;
  }
  logInputHistory() {
    this.input.logInputHistory();
  }
  async acceptInput(query, options3) {
    if (this._readOnly || this.input.hasPendingProgrammaticModelSelection) {
      return void 0;
    }
    if (this.viewModel) {
      markChat(this.viewModel.sessionResource, ChatPerfMark.RequestStart);
    }
    const branchQuery = this._computeShunCodeBranchQuery(query, options3);
    if (branchQuery === void 0 && query === void 0 && !options3?.shunCodeBranchIntent && !this.getInput().trim() && this.input.isBranchEligible()) {
      return void 0;
    }
    const effectiveOptions = branchQuery !== void 0 ? {
      ...options3,
      shunCodeBranchIntent: {
        kind: "branch",
        groupId: void 0
      }
    } : options3;
    return this._acceptInput(query !== void 0 ? {
      query
    } : branchQuery !== void 0 ? {
      query: branchQuery
    } : void 0, effectiveOptions);
  }
  /**
   * ShunCode multi-model: an empty input send in Plan mode re-answers the
   * previous question as a new branch variant of the same turn. Returns the
   * anchor question text so the variant row is visible and the round's
   * question stays discoverable in history.
   */
  _computeShunCodeBranchQuery(query, options3) {
    if (options3?.shunCodeBranchIntent || query !== void 0 || this.getInput().trim()) {
      return void 0;
    }
    if (!this.input.isBranchEligible()) {
      return void 0;
    }
    const requests = this.viewModel?.model.getRequests() ?? [];
    for (let index2 = requests.length - 1; index2 >= 0; index2 -= 1) {
      const text2 = requests[index2].message.text.trim();
      if (text2) {
        return text2;
      }
    }
    return void 0;
  }
  async rerunLastRequest() {
    if (this._readOnly || !this.viewModel) {
      return;
    }
    const sessionResource = this.viewModel.sessionResource;
    const lastRequest2 = this.chatService.getSession(sessionResource)?.getRequests().at(-1);
    if (!lastRequest2) {
      return;
    }
    const options3 = {
      attempt: lastRequest2.attempt + 1,
      location: this.location,
      ...this.getSelectedModelRequestOptions(),
      modeInfo: this.input.currentModeInfo
    };
    const result = await this.chatService.resendRequest(lastRequest2, options3);
    this.logThinkingStyleUsage("rerun");
    return result;
  }
  getConfiguredThinkingStyle() {
    const thinkingStyle = this.configurationService.getValue("chat.agent.thinkingStyle" /* ThinkingStyle */);
    switch (thinkingStyle) {
      case "collapsed" /* Collapsed */:
      case "collapsedPreview" /* CollapsedPreview */:
      case "fixedScrolling" /* FixedScrolling */:
        return thinkingStyle;
      default:
        return "fixedScrolling" /* FixedScrolling */;
    }
  }
  logThinkingStyleUsage(requestKind) {
    this.telemetryService.publicLog2("chat.thinkingStyleUsage", {
      thinkingStyle: this.getConfiguredThinkingStyle(),
      location: this.location,
      requestKind
    });
  }
  _cancelGoalSummary() {
    this._goalSummaryTokenSource?.dispose(true);
    this._goalSummaryTokenSource = void 0;
  }
  _maybeStartGoalSummary(prompt) {
    const inputPart = this.inputPartDisposable.value;
    if (!inputPart) {
      return;
    }
    const sessionResource = this.viewModel?.model.sessionResource;
    const isLocalHarness = !!sessionResource && getChatSessionType(sessionResource) === localChatSessionType;
    const permissionLevel = inputPart.currentModeInfo?.permissionLevel;
    const goalModeOn = this.configurationService.getValue("chat.autopilot.advanced.enabled" /* AutopilotAdvancedEnabled */) === true;
    if (!isLocalHarness || permissionLevel !== "autopilot" /* Autopilot */ || !goalModeOn) {
      this._cancelGoalSummary();
      inputPart.clearGoalBanner();
      return;
    }
    this._goalBannerDismissedForCurrentRequest = false;
    this._goalBannerDismissListener.value = inputPart.onDidDismissGoalBanner(() => {
      this._goalBannerDismissedForCurrentRequest = true;
      this._cancelGoalSummary();
    });
    this._cancelGoalSummary();
    const cts = new CancellationTokenSource();
    this._goalSummaryTokenSource = cts;
    inputPart.showGoalBannerLoading();
    this.chatGoalSummaryService.summarize(prompt, cts.token).then(summary => {
      if (cts.token.isCancellationRequested || this._goalBannerDismissedForCurrentRequest) {
        return;
      }
      const current = this.inputPartDisposable.value;
      if (!current) {
        return;
      }
      if (summary) {
        current.setGoalBanner(summary);
      } else {
        current.clearGoalBanner();
      }
    }, () => {
      if (cts.token.isCancellationRequested) {
        return;
      }
      this.inputPartDisposable.value?.clearGoalBanner();
    });
  }
  /**
   * @returns `false` when the prompt metadata requested an agent switch that the
   * user cancelled, signalling that input submission should be aborted.
   */
  async _applyPromptFileIfSet(requestInput, sessionResource) {
    const agentSlashPromptPart = this.parsedInput.parts.find(r2 => r2 instanceof ChatRequestSlashPromptPart);
    if (!agentSlashPromptPart) {
      return true;
    }
    this.chatTipService.recordSlashCommandUsage(agentSlashPromptPart.name);
    const slashCommand = await this.customizationHarnessService.resolvePromptSlashCommand(agentSlashPromptPart.name, sessionResource, CancellationToken.None);
    if (!slashCommand) {
      return true;
    }
    const parseResult = slashCommand.parsedPromptFile;
    const refs = parseResult.body?.variableReferences.map(({
      name,
      offset,
      fullLength
    }) => ({
      name,
      range: new OffsetRange(offset, offset + fullLength)
    })) ?? [];
    const toolReferences = this.toolsService.toToolReferences(refs);
    requestInput.attachedContext.insertFirst(toPromptFileVariableEntry(parseResult.uri, "vscode.prompt.file" /* PromptFile */, void 0, true, toolReferences));
    const promptRunEvent = {
      storage: slashCommand.storage
    };
    if (slashCommand.extension) {
      promptRunEvent.extensionId = slashCommand.extension.identifier.value;
      promptRunEvent.promptName = slashCommand.name;
    } else {
      promptRunEvent.promptNameHash = hash(slashCommand.name).toString(16);
    }
    this.telemetryService.publicLog2("chat.promptRun", promptRunEvent);
    if (parseResult.header) {
      const applied = await this._applyPromptMetadata(parseResult.header, requestInput);
      if (!applied) {
        return false;
      }
    }
    return true;
  }
  async _acceptInput(query, options3 = {}) {
    if (!query && this.input.generating) {
      const generatingAutoSubmitWindow = 500;
      const start = Date.now();
      await this.input.generating;
      if (Date.now() - start > generatingAutoSubmitWindow) {
        return;
      }
    }
    while (!this._viewModel && !this._store.isDisposed) {
      await Event2.toPromise(this.onDidChangeViewModel, this._store);
    }
    if (!this.viewModel) {
      return;
    }
    if (this.viewOptions.submitHandler) {
      const inputValue2 = !query ? this.getInput() : query.query;
      const handled = await this.viewOptions.submitHandler(inputValue2, this.input.currentModeKind);
      if (handled) {
        return;
      }
    }
    const isUserQuery = !query;
    const inputValue = options3.forceEmptyInput ? "" : isUserQuery ? this.getInput() : query.query;
    if (this.viewModel.model.hasActiveRequest.get() && (await this._tryExecuteImmediateSlashCommand(inputValue, isUserQuery ? this.parsedInput : void 0))) {
      this.setInput("");
      return;
    }
    if (isUserQuery) {
      const preSubmitResult = await this.chatSubmitRequestHandlerService.tryHandle({
        sessionResource: this.viewModel.sessionResource,
        input: inputValue
      });
      if (preSubmitResult) {
        this.setInput("");
        return;
      }
    }
    if (!options3.preserveInput) {
      this._onDidAcceptInput.fire();
    }
    this.listWidget.setScrollLock(this.isLockedToCodingAgent || !!checkModeOption(this.input.currentModeKind, this.viewOptions.autoScroll));
    const requestInputs = {
      input: inputValue,
      // preserveInput means the input box holds an unrelated draft, so its
      // attachments belong to that draft and must not be sent with this query.
      attachedContext: options3?.preserveInput ? new ChatRequestVariableSet() : options3?.enableImplicitContext === false ? this.input.getAttachedContext() : this.input.getAttachedAndImplicitContext()
    };
    if (this.viewModel.model.requestInProgress.get() && (await this._executeSlashCommandDuringRequest(requestInputs.input, isUserQuery, options3.preserveFocus))) {
      return;
    }
    const isEditing = this.viewModel?.editing;
    const editedModelRequestOptions = isEditing && this.configurationService.getValue("chat.editRequests") !== "input" ? this.getSelectedModelRequestOptions() : void 0;
    let cancelledCurrentRequest = false;
    if (isEditing) {
      this.inputPart?.clearToolConfirmationCarousel();
      const editingPendingRequest = this.viewModel.editing.pendingKind;
      if (editingPendingRequest !== void 0) {
        const editingRequestId = this.viewModel.editing.id;
        this.chatService.removePendingRequest(this.viewModel.sessionResource, editingRequestId);
        if (!options3.cancelCurrentRequest) {
          options3.queue ??= editingPendingRequest;
        }
      } else {
        await this.chatService.cancelCurrentRequestForSession(this.viewModel.sessionResource, "acceptInput-editing");
        cancelledCurrentRequest = true;
        options3.queue = void 0;
      }
      const preserveCheckpoint = this._lockedAgent && !!this._attachmentCapabilities.supportsCheckpoints;
      if (preserveCheckpoint) {
        this.recentlyRestoredCheckpoint = true;
      }
      this.finishedEditing(true);
      if (!preserveCheckpoint) {
        this.viewModel.model?.setCheckpoint(void 0);
      }
    }
    const model = this.viewModel.model;
    if (options3.cancelCurrentRequest && model.requestInProgress.get() && !cancelledCurrentRequest) {
      await this.chatService.cancelCurrentRequestForSession(this.viewModel.sessionResource, "acceptInput-stopAndSend");
      cancelledCurrentRequest = true;
      options3.queue = void 0;
    }
    const requestInProgress = model.requestInProgress.get();
    if (!options3.cancelCurrentRequest && model.requestNeedsInput.get() && !model.getPendingRequests().length) {
      await this.chatService.cancelCurrentRequestForSession(this.viewModel.sessionResource, "acceptInput-needsInput");
      options3.queue ??= "queued" /* Queued */;
    }
    if (requestInProgress && !options3.cancelCurrentRequest) {
      options3.queue ??= "queued" /* Queued */;
    }
    if (!requestInProgress && !isEditing && !(await this.confirmPendingRequestsBeforeSend(model, options3))) {
      return;
    }
    if (!options3.preserveInput) {
      const promptApplied = await this._applyPromptFileIfSet(requestInputs, this.viewModel.sessionResource);
      if (!promptApplied) {
        return;
      }
    }
    if (this.viewOptions.enableWorkingSet !== void 0 && this.input.currentModeKind === "edit" /* Edit */) {
      const uniqueWorkingSetEntries = new ResourceSet();
      const editingSessionAttachedContext = requestInputs.attachedContext;
      const previousRequests = this.viewModel.model.getRequests();
      for (const request2 of previousRequests) {
        for (const variable of request2.variableData.variables) {
          if (URI.isUri(variable.value) && variable.kind === "file") {
            const uri5 = variable.value;
            if (!uniqueWorkingSetEntries.has(uri5)) {
              editingSessionAttachedContext.add(variable);
              uniqueWorkingSetEntries.add(variable.value);
            }
          }
        }
      }
      requestInputs.attachedContext = editingSessionAttachedContext;
      this.telemetryService.publicLog2("chatEditing/workingSetSize", {
        originalSize: uniqueWorkingSetEntries.size,
        actualSize: uniqueWorkingSetEntries.size
      });
    }
    this.input.validateAgentMode();
    if (this.viewModel.model.checkpoint) {
      const requests = this.viewModel.model.getRequests();
      for (let i2 = requests.length - 1; i2 >= 0; i2 -= 1) {
        const request2 = requests[i2];
        if (request2.shouldBeBlocked.get() || request2 === this.viewModel.model.checkpoint) {
          this.chatService.removeRequest(this.viewModel.sessionResource, request2.id);
        }
      }
      this.viewModel.model.setCheckpoint(void 0);
    }
    const submittedSessionResource = this.viewModel.sessionResource;
    const contribution = this._lockedAgent ? this.chatSessionsService.getChatSessionContribution(this._lockedAgent.id) : void 0;
    const autoAttachEnabled = contribution ? contribution.autoAttachReferences === true : true;
    const modeKind = this.input.currentModeKind;
    const modeInfo = this.input.currentModeInfo;
    const currentModelRequestOptions = this.getSelectedModelRequestOptions();
    const selectedModelRequestOptions = editedModelRequestOptions?.userSelectedModelId === currentModelRequestOptions.userSelectedModelId ? editedModelRequestOptions : currentModelRequestOptions;
    const result = await this.chatService.sendRequest(this.viewModel.sessionResource, requestInputs.input, {
      ...selectedModelRequestOptions,
      location: this.location,
      locationData: this._location.resolveData?.(),
      shunCodeBranchIntent: options3?.shunCodeBranchIntent,
      isSystemInitiated: options3?.isSystemInitiated,
      systemInitiatedLabel: options3?.systemInitiatedLabel,
      parserContext: {
        selectedAgent: this._lastSelectedAgent,
        mode: modeKind,
        attachmentCapabilities: this._lastSelectedAgent?.capabilities ?? this.attachmentCapabilities
      },
      attachedContext: requestInputs.attachedContext.asArray(),
      noCommandDetection: options3?.noCommandDetection,
      ...this.getModeRequestOptions(),
      modeInfo,
      agentIdSilent: this._lockedAgent?.id,
      queue: options3?.queue,
      instructionContext: autoAttachEnabled ? {
        modeKind,
        enabledTools: modeKind === "agent" /* Agent */ ? this.input.selectedToolsModel.userSelectedTools.get() : void 0,
        enabledSubAgents: modeKind === "agent" /* Agent */ ? this.input.currentModeObs.get().agents?.get() : void 0
      } : void 0
    });
    if (ChatSendResult.isRejected(result)) {
      if (result.newSessionResource) {
        const newModel = this.chatService.getSession(result.newSessionResource);
        if (newModel) {
          this.setModel(newModel);
        }
      }
      return;
    }
    this.logThinkingStyleUsage("submit");
    this.updateChatViewVisibility();
    this.input.acceptInput(options3?.storeToHistory ?? isUserQuery, options3?.preserveFocus, options3?.preserveInput);
    if (!options3.preserveInput) {
      this._maybeStartGoalSummary(requestInputs.input);
    }
    const sent = ChatSendResult.isQueued(result) ? await result.deferred : result;
    if (!ChatSendResult.isSent(sent)) {
      return;
    }
    if (!options3.preserveInput) {
      this._onDidSubmitAgent.fire({
        agent: sent.data.agent,
        slashCommand: sent.data.slashCommand
      });
    }
    this.handleDelegationExitIfNeeded(this._lockedAgent, sent.data.agent);
    if (sent.newSessionResource) {
      const newModel = this.chatService.getSession(sent.newSessionResource);
      if (newModel) {
        this.setModel(newModel);
      }
    }
    sent.data.responseCreatedPromise.then(() => {
      this.chatAccessibilityService.acceptRequest(submittedSessionResource);
      sent.data.responseCompletePromise.then(() => {
        const responses = this.viewModel?.getItems().filter(isResponseVM);
        const lastResponse = responses?.[responses.length - 1];
        this.chatAccessibilityService.acceptResponse(this, this.container, lastResponse, submittedSessionResource, options3?.isVoiceInput);
        if (lastResponse?.result?.nextQuestion) {
          const {
            prompt,
            participant,
            command: command4
          } = lastResponse.result.nextQuestion;
          const question = formatChatQuestion(this.chatAgentService, this.location, prompt, participant, command4);
          if (question) {
            this.input.setValue(question, false);
          }
        }
      });
    });
    return sent.data.responseCreatedPromise;
  }
  async _executeSlashCommandDuringRequest(input, storeToHistory, preserveFocus) {
    const viewModel = this.viewModel;
    if (!viewModel) {
      return false;
    }
    const parsedRequest = this.instantiationService.createInstance(ChatRequestParser).parseChatRequest(viewModel.sessionResource, input, this.location, {
      selectedAgent: this._lastSelectedAgent,
      mode: this.input.currentModeKind,
      attachmentCapabilities: this.attachmentCapabilities,
      forcedAgent: this._lockedAgent?.id ? this.chatAgentService.getAgent(this._lockedAgent.id) : void 0
    });
    const commandPart = parsedRequest.parts.find(part => part instanceof ChatRequestSlashCommandPart);
    if (!commandPart?.slashCommand.executeDuringRequest || commandPart.slashCommand.silent !== true) {
      return false;
    }
    const history = [];
    for (const request2 of viewModel.model.getRequests()) {
      if (!request2.response) {
        continue;
      }
      history.push({
        role: 1 /* User */,
        content: [{
          type: "text",
          value: request2.message.text
        }]
      });
      history.push({
        role: 2 /* Assistant */,
        content: [{
          type: "text",
          value: request2.response.response.toString()
        }]
      });
    }
    this.input.acceptInput(storeToHistory, preserveFocus);
    const prompt = parsedRequest.text.slice(commandPart.range.endExclusive).trimStart();
    try {
      await this.chatSlashCommandService.executeCommand(commandPart.slashCommand.command, prompt, Progress.None, history, this.location, viewModel.sessionResource, CancellationToken.None);
    } finally {
      clearChatMarks(viewModel.sessionResource);
    }
    return true;
  }
  async _tryExecuteImmediateSlashCommand(input, parsedInput) {
    const viewModel = this.viewModel;
    if (!viewModel) {
      return false;
    }
    const parsedRequest = parsedInput ?? this.instantiationService.createInstance(ChatRequestParser).parseChatRequestWithReferences(getDynamicVariablesForWidget(this), getSelectedToolAndToolSetsForWidget(this), input, this.location, {
      selectedAgent: this._lastSelectedAgent,
      mode: this.input.currentModeKind,
      attachmentCapabilities: this.attachmentCapabilities,
      forcedAgent: this._lockedAgent?.id ? this.chatAgentService.getAgent(this._lockedAgent.id) : void 0,
      sessionType: getChatSessionType(viewModel.model.sessionResource)
    });
    const commandPart = getImmediateSilentSlashCommandPart(parsedRequest);
    if (!commandPart) {
      return false;
    }
    const history = [];
    for (const request2 of viewModel.model.getRequests()) {
      if (!request2.response) {
        continue;
      }
      history.push({
        role: 1 /* User */,
        content: [{
          type: "text",
          value: request2.message.text
        }]
      });
      history.push({
        role: 2 /* Assistant */,
        content: [{
          type: "text",
          value: request2.response.response.toString()
        }]
      });
    }
    const command4 = commandPart.slashCommand.command;
    await this.chatSlashCommandService.executeCommand(command4, input.slice(commandPart.range.endExclusive).trimStart(), new Progress(() => {}), history, this.location, viewModel.sessionResource, CancellationToken.None);
    return true;
  }
  async confirmPendingRequestsBeforeSend(model, options3) {
    if (options3.queue) {
      return true;
    }
    const hasPendingRequests = model.getPendingRequests().length > 0;
    if (!hasPendingRequests) {
      return true;
    }
    const promptResult = await this.dialogService.prompt({
      type: "question",
      message: localize("recovered.11412", "You already have pending requests."),
      detail: localize("recovered.11410", "Do you want to keep them in the queue or remove them before sending this message?"),
      buttons: [{
        label: localize("recovered.11411", "Keep Pending Requests"),
        run: () => "keep"
      }, {
        label: localize("recovered.11413", "Remove Pending Requests"),
        run: () => "remove"
      }],
      cancelButton: true
    });
    if (!promptResult.result) {
      return false;
    }
    if (promptResult.result === "remove") {
      for (const pendingRequest of [...model.getPendingRequests()]) {
        this.chatService.removePendingRequest(model.sessionResource, pendingRequest.request.id);
      }
    }
    return true;
  }
  // Keep the selected model and its editor-scoped configuration together so
  // resend/confirmation flows preserve custom per-model settings.
  getSelectedModelRequestOptions() {
    const modelId = this.input.currentLanguageModel;
    return {
      userSelectedModelId: modelId,
      userSelectedModelConfiguration: modelId ? this.input.getModelConfiguration(modelId) : void 0
    };
  }
  getModeRequestOptions() {
    if (!this.inputPartDisposable.value) {
      return {};
    }
    const sessionResource = this.viewModel?.sessionResource;
    const capturedModeId = this.input.currentModeObs.get().id;
    const userSelectedTools = this.input.selectedToolsModel.userSelectedTools;
    let lastToolsSnapshot = userSelectedTools.get();
    const scopedTools = derived(reader => {
      if (this._store.isDisposed) {
        return lastToolsSnapshot;
      }
      const activeSession = this._viewModelObs.read(reader)?.sessionResource;
      const currentModeId = this.input.currentModeObs.read(reader).id;
      if (isEqual2(activeSession, sessionResource) && currentModeId === capturedModeId) {
        const tools = userSelectedTools.read(reader);
        lastToolsSnapshot = tools;
        return tools;
      }
      return lastToolsSnapshot;
    });
    return {
      modeInfo: this.input.currentModeInfo,
      userSelectedTools: scopedTools
    };
  }
  getCodeBlockInfosForResponse(response) {
    return this.listWidget.getCodeBlockInfosForResponse(response);
  }
  getCodeBlockInfoForEditor(uri5) {
    return this.listWidget.getCodeBlockInfoForEditor(uri5);
  }
  getFileTreeInfosForResponse(response) {
    return this.listWidget.getFileTreeInfosForResponse(response);
  }
  getLastFocusedFileTreeForResponse(response) {
    return this.listWidget.getLastFocusedFileTreeForResponse(response);
  }
  getElementFromNode(node) {
    return this.listWidget.getElementFromNode(node);
  }
  focusResponseItem(lastFocused) {
    this.listWidget.focusLastItem(lastFocused);
  }
  setInputPartMaxHeightOverride(maxHeight) {
    this.inputPartMaxHeightOverride = maxHeight;
  }
  layout(height, width2) {
    width2 = Math.min(width2, this.viewOptions.renderStyle === "minimal" ? width2 : 950);
    this.bodyDimension = new Dimension(width2, height);
    if (this.viewModel?.editing) {
      this.inlineInputPart?.layout(width2);
    }
    const chatSuggestNextWidgetHeight = this.chatSuggestNextWidget.height;
    const inputMaxHeight = this._dynamicMessageLayoutData || this.location !== "panel" /* Chat */ ? void 0 : this.inputPartMaxHeightOverride !== void 0 ? Math.max(0, this.inputPartMaxHeightOverride - chatSuggestNextWidgetHeight - MIN_LIST_HEIGHT) : Math.max(0, height - chatSuggestNextWidgetHeight - MIN_LIST_HEIGHT);
    this.inputPart.setMaxHeight(inputMaxHeight);
    this.inputPart.layout(width2);
    this._layoutListForInputHeight();
  }
  /**
   * Updates the widget's available space after the intrinsic input height changed.
   * The input has already laid itself out, so this only resizes the list-side
   * surfaces and must not call {@link ChatInputPart.layout}.
   */
  layoutForInputHeight(height, width2) {
    width2 = Math.min(width2, this.viewOptions.renderStyle === "minimal" ? width2 : 950);
    this.bodyDimension = new Dimension(width2, height);
    this._layoutListForInputHeight();
  }
  /**
   * Re-layout just the list, welcome container, and list container to match
   * the current input-part height. Called both from {@link layout} and from
   * the inputPart.height autorun so we never re-enter inputPart.layout when
   * only the input height changed.
   */
  _layoutListForInputHeight() {
    if (!this.bodyDimension) {
      return;
    }
    const {
      height,
      width: width2
    } = this.bodyDimension;
    const chatSuggestNextWidgetHeight = this.chatSuggestNextWidget.height;
    const inputHeight = this._inputVisible ? this.inputPart.height.get() : this.inputPart.element.offsetHeight;
    const readOnlyBannerHeight = this.readOnlyBanner?.visible ? CHAT_READ_ONLY_BANNER_HEIGHT : 0;
    const lastElementVisible = this.listWidget.isScrolledToBottom;
    const lastItem = this.listWidget.lastItem;
    const contentHeight = Math.max(0, height - inputHeight - readOnlyBannerHeight - chatSuggestNextWidgetHeight);
    this.listWidget.layout(contentHeight, width2);
    this.welcomeMessageContainer.style.height = `${contentHeight}px`;
    const lastResponseIsRendering = isResponseVM(lastItem) && lastItem.renderData;
    if (lastElementVisible && (!lastResponseIsRendering || checkModeOption(this.input.currentModeKind, this.viewOptions.autoScroll))) {
      this.listWidget.scrollToEnd();
    }
    this.listContainer.style.height = `${contentHeight}px`;
    this._onDidChangeHeight.fire(height);
  }
  // An alternative to layout, this allows you to specify the number of ChatTreeItems
  // you want to show, and the max height of the container. It will then layout the
  // tree to show that many items.
  // TODO@TylerLeonhardt: This could use some refactoring to make it clear which layout strategy is being used
  setDynamicChatTreeItemLayout(numOfChatTreeItems, maxHeight) {
    this._dynamicMessageLayoutData = {
      numOfMessages: numOfChatTreeItems,
      maxHeight,
      enabled: true
    };
    this._register(this.listWidget.onDidChangeItemHeight(() => this.layoutDynamicChatTreeItemMode()));
    const mutableDisposable = this._register(new MutableDisposable());
    this._register(this.listWidget.onDidScroll(e => {
      if (!this._dynamicMessageLayoutData?.enabled) {
        return;
      }
      mutableDisposable.value = scheduleAtNextAnimationFrame(getWindow(this.listContainer), () => {
        if (!e.scrollTopChanged || e.heightChanged || e.scrollHeightChanged) {
          return;
        }
        const renderHeight = e.height;
        const diff4 = e.scrollHeight - renderHeight - e.scrollTop;
        if (diff4 === 0) {
          return;
        }
        const possibleMaxHeight = this._dynamicMessageLayoutData?.maxHeight ?? maxHeight;
        const width2 = this.bodyDimension?.width ?? this.container.offsetWidth;
        this.input.layout(width2);
        const inputPartHeight = this.input.height.get();
        const chatSuggestNextWidgetHeight = this.chatSuggestNextWidget.height;
        const newHeight = Math.min(renderHeight + diff4, possibleMaxHeight - inputPartHeight - chatSuggestNextWidgetHeight);
        this.layout(newHeight + inputPartHeight + chatSuggestNextWidgetHeight, width2);
      });
    }));
  }
  updateDynamicChatTreeItemLayout(numOfChatTreeItems, maxHeight) {
    this._dynamicMessageLayoutData = {
      numOfMessages: numOfChatTreeItems,
      maxHeight,
      enabled: true
    };
    let hasChanged = false;
    let height = this.bodyDimension.height;
    let width2 = this.bodyDimension.width;
    if (maxHeight < this.bodyDimension.height) {
      height = maxHeight;
      hasChanged = true;
    }
    const containerWidth = this.container.offsetWidth;
    if (this.bodyDimension?.width !== containerWidth) {
      width2 = containerWidth;
      hasChanged = true;
    }
    if (hasChanged) {
      this.layout(height, width2);
    }
  }
  get isDynamicChatTreeItemLayoutEnabled() {
    return this._dynamicMessageLayoutData?.enabled ?? false;
  }
  set isDynamicChatTreeItemLayoutEnabled(value2) {
    if (!this._dynamicMessageLayoutData) {
      return;
    }
    this._dynamicMessageLayoutData.enabled = value2;
  }
  layoutDynamicChatTreeItemMode() {
    if (!this.viewModel || !this._dynamicMessageLayoutData?.enabled) {
      return;
    }
    const width2 = this.bodyDimension?.width ?? this.container.offsetWidth;
    this.input.layout(width2);
    const inputHeight = this.input.height.get();
    const chatSuggestNextWidgetHeight = this.chatSuggestNextWidget.height;
    const totalMessages = this.viewModel.getItems();
    const messages = totalMessages.slice(-this._dynamicMessageLayoutData.numOfMessages);
    const needsRerender = messages.some(m => m.currentRenderedHeight === void 0);
    const listHeight = needsRerender ? this._dynamicMessageLayoutData.maxHeight : messages.reduce((acc, message) => acc + message.currentRenderedHeight, 0);
    this.layout(Math.min(
    // we add an additional 18px in order to show that there is scrollable content
    inputHeight + chatSuggestNextWidgetHeight + listHeight + (totalMessages.length > 2 ? 18 : 0), this._dynamicMessageLayoutData.maxHeight), width2);
    if (needsRerender || !listHeight) {
      this.listWidget.scrollToEnd();
    }
  }
  saveState() {}
  getViewState() {
    return this.input.getCurrentInputState();
  }
  updateChatInputContext() {
    const currentAgent = this.parsedInput.parts.find(part => part instanceof ChatRequestAgentPart);
    this.agentInInput.set(!!currentAgent);
  }
  async _switchToAgentByName(agentName) {
    const currentAgent = this.input.currentModeObs.get();
    if (agentName === currentAgent.name.get()) {
      return true;
    }
    const agent = this.input.currentChatModesObs.get().findModeByName(agentName);
    if (!agent) {
      return false;
    }
    if (currentAgent.kind !== agent.kind) {
      const chatModeCheck = await this.instantiationService.invokeFunction(handleModeSwitch, currentAgent.kind, agent.kind, this.viewModel?.model.getRequests().length ?? 0, this.viewModel?.model);
      if (!chatModeCheck) {
        return false;
      }
      if (chatModeCheck.needToClearSession) {
        await this.clear();
      }
    }
    this.input.setChatMode(agent.id);
    return true;
  }
  /**
   * @returns `false` when the agent switch was cancelled (e.g. user dismissed the
   * mode-switch confirmation dialog), signalling that the caller should abort the
   * current input submission.
   */
  async _applyPromptMetadata({
    agent,
    tools,
    model
  }, requestInput) {
    if (tools !== void 0 && !agent && this.input.currentModeKind !== "agent" /* Agent */) {
      agent = ChatMode.Agent.name.get();
    }
    if (agent) {
      const switched = await this._switchToAgentByName(agent);
      if (!switched) {
        return false;
      }
    }
    if (tools !== void 0 && this.input.currentModeKind === "agent" /* Agent */) {
      const enablementMap = this.toolsService.toToolAndToolSetEnablementMap(tools, this.input.selectedLanguageModel.get()?.metadata);
      this.input.selectedToolsModel.set(enablementMap, true);
    }
    if (model !== void 0) {
      return this.input.requestModelByQualifiedName(model);
    }
    return true;
  }
  delegateScrollFromMouseWheelEvent(browserEvent) {
    this.listWidget.delegateScrollFromMouseWheelEvent(browserEvent);
  }
};
ChatWidget = __decorateClass([__decorateParam(4, ICodeEditorService), __decorateParam(5, IConfigurationService), __decorateParam(6, IDialogService), __decorateParam(7, IContextKeyService), __decorateParam(8, IInstantiationService), __decorateParam(9, IChatService), __decorateParam(10, IChatBranchService), __decorateParam(11, IChatAgentService), __decorateParam(12, IChatWidgetService), __decorateParam(13, IChatAccessibilityService), __decorateParam(14, ILogService), __decorateParam(15, IThemeService), __decorateParam(16, IChatSlashCommandService), __decorateParam(17, IChatEditingService), __decorateParam(18, ITelemetryService), __decorateParam(19, IPromptsService), __decorateParam(20, ICustomizationHarnessService), __decorateParam(21, ILanguageModelToolsService), __decorateParam(22, IChatLayoutService), __decorateParam(23, IChatEntitlementService), __decorateParam(24, IChatSessionsService), __decorateParam(25, IAgentSessionsService), __decorateParam(26, IChatTodoListService), __decorateParam(27, ILifecycleService), __decorateParam(28, IChatTipService), __decorateParam(29, IChatDebugService), __decorateParam(30, IAccessibilityService), __decorateParam(31, IChatGoalSummaryService), __decorateParam(32, IChatSubmitRequestHandlerService)], ChatWidget);
function layoutChatWidgetForInputHeight(widget, inputMaxHeight, height, width2) {
  widget.setInputPartMaxHeightOverride(inputMaxHeight);
  widget.layoutForInputHeight(height, width2);
}
var MIN_LIST_HEIGHT = 50;
export { $58, SESSIONS_CHAT_ITEM_HORIZONTAL_PADDING, isQuickChat, isInlineChat, getImmediateSilentSlashCommandPart, supportsAllAttachments, DISCLAIMER, ChatWidget, layoutChatWidgetForInputHeight, MIN_LIST_HEIGHT, $58 as $ };
