// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
import { __decorateClass } from "../../../../../../base/common/shunCodeRecoveredHelpersWorkbench.js";
import { __decorateParam } from "../../../../../../base/common/shunCodeRecoveredHelpersWorkbench.js";
import { localize } from "../../../../../../nls.js";
import { isCancellationError } from "../../../../../../base/common/errors.js";
import { toDisposable } from "../../../../../../base/common/lifecycle.js";
import { DisposableStore } from "../../../../../../base/common/lifecycle.js";
import { MutableDisposable } from "../../../../../../base/common/lifecycle.js";
import { Event as Event2 } from "../../../../../../base/common/event.js";
import { StandardMouseEvent } from "../../../../../../base/browser/mouseEvent.js";
import { CancellationToken } from "../../../../../../base/common/cancellation.js";
import { CancellationTokenSource } from "../../../../../../base/common/cancellation.js";
import { URI } from "../../../../../../base/common/uri.js";
import { isEqual as isEqual2 } from "../../../../../../base/common/resources.js";
import { disposableTimeout } from "../../../../../../base/common/async.js";
import { observableValue } from "../../../../../../base/common/observableInternal/observables/observableValue.js";
import { autorun } from "../../../../../../base/common/observableInternal/reactions/autorun.js";
import { getWindow } from "../../../../../../base/browser/dom.js";
import { addDisposableListener } from "../../../../../../base/browser/dom.js";
import { EventType } from "../../../../../../base/browser/dom.js";
import { EventHelper } from "../../../../../../base/browser/dom.js";
import { append } from "../../../../../../base/browser/dom.js";
import { $ } from "../../../../../../base/browser/dom.js";
import { setVisibility } from "../../../../../../base/browser/dom.js";
import { IInstantiationService } from "../../../../../../platform/instantiation/common/instantiation.js";
import { ICommandService } from "../../../../../../platform/commands/common/commands.js";
import { CommandsRegistry } from "../../../../../../platform/commands/common/commands.js";
import { IContextKeyService } from "../../../../../../platform/contextkey/common/contextkey.js";
import { MenuId } from "../../../../../../platform/actions/common/actions.js";
import { ITelemetryService } from "../../../../../../platform/telemetry/common/telemetry.js";
import { toErrorMessage } from "../../../../../../base/common/errorMessage.js";
import { ILogService } from "../../../../../../platform/log/common/log.js";
import { IConfigurationService } from "../../../../../../platform/configuration/common/configuration.js";
import { editorBackground } from "../../../../../../platform/theme/common/colors/editorColors.js";
import { DomScrollableElement } from "../../../../../../base/browser/ui/scrollbar/scrollableElement.js";
import { IOpenerService } from "../../../../../../platform/opener/common/opener.js";
import { IThemeService } from "../../../../../../platform/theme/common/themeService.js";
import { INotificationService } from "../../../../../../platform/notification/common/notification.js";
import { IKeybindingService } from "../../../../../../platform/keybinding/common/keybinding.js";
import { ServiceCollection } from "../../../../../../platform/instantiation/common/serviceCollection.js";
import { IProgressService } from "../../../../../../platform/progress/common/progress.js";
import { IContextMenuService } from "../../../../../../platform/contextview/browser/contextView.js";
import { Sash } from "../../../../../../base/browser/ui/sash/sash.js";
import { IWorkspaceContextService } from "../../../../../../platform/workspace/common/workspace.js";
import { IStorageService } from "../../../../../../platform/storage/common/storage.js";
import { defaultButtonStyles } from "../../../../../../platform/theme/browser/defaultStyles.js";
import { MenuWorkbenchToolBar } from "../../../../../../platform/actions/browser/toolbar.js";
import { IHoverService } from "../../../../../../platform/hover/browser/hover.js";
import { Button } from "../../../../../../base/browser/ui/button/button.js";
import { ILifecycleService } from "../../../../../services/lifecycle/common/lifecycle.js";
import { SIDE_BAR_FOREGROUND } from "../../../../../common/theme.js";
import { IWorkbenchEnvironmentService } from "../../../../../services/environment/common/environmentService.js";
import { ChatEntitlementContextKeys } from "../../../../../services/chat/common/chatEntitlementService.js";
import { IChatEntitlementService } from "../../../../../services/chat/common/chatEntitlementService.js";
import { localChatSessionType } from "../../../common/chatSessionsService.js";
import { IChatSessionsService } from "../../../common/chatSessionsService.js";
import { LocalChatSessionUri } from "../../../common/model/chatUri.js";
import { getChatSessionType } from "../../../common/model/chatUri.js";
import { isUntitledChatSession } from "../../../common/model/chatUri.js";
import { IAgentHostEnablementService } from "../../../../../../platform/agentHost/common/agentHostEnablementService.js";
import { getDefaultNewChatSessionType } from "../../../common/constants.js";
import { getDefaultNewChatSessionResource } from "../../../common/constants.js";
import { ChatContextKeys } from "../../../common/actions/chatContextKeys.js";
import { CHAT_PROVIDER_ID } from "../../../common/participants/chatParticipantContribTypes.js";
import { IChatService } from "../../../common/chatService/chatService.js";
import { IChatAgentService } from "../../../common/participants/chatAgents.js";
import { IChatWidgetService } from "../../chat.js";
import { setModelPreservingInputTypedWhileLoading } from "../../chat.js";
import { ChatViewId } from "../../chat.js";
import { Memento } from "../../../../../common/memento.js";
import { IViewDescriptorService } from "../../../../../common/views.js";
import { IHostService } from "../../../../../services/host/browser/host.js";
import { IWorkbenchLayoutService } from "../../../../../services/layout/browser/layoutService.js";
import { ViewPane } from "../../../../../browser/parts/views/viewPane.js";
import { IActivityService } from "../../../../../services/activity/common/activity.js";
import { ProgressBadge } from "../../../../../services/activity/common/activity.js";
import { IAgentSessionsService } from "../../agentSessions/agentSessionsService.js";
import { ACTION_ID_NEW_CHAT } from "../../actions/chatActions.js";
import { IMicCaptureService } from "../../voiceClient/micCaptureService.js";
import { ITtsPlaybackService } from "../../voiceClient/ttsPlaybackService.js";
import { IVoicePlaybackService } from "../../../common/voicePlaybackService.js";
import { IVoiceSessionController } from "../../voiceClient/voiceSessionController.js";
import { isGlowingVoiceState } from "../../voiceClient/voiceGlow.js";
import { readVoiceGlowIntensity } from "../../voiceClient/voiceGlow.js";
import { computeVoiceGlowStyle } from "../../voiceClient/voiceGlow.js";
import { IVoiceInputModeService } from "../../voiceInputMode/voiceInputMode.js";
import { ChatViewWelcomeController } from "../../viewsWelcome/chatViewWelcomeController.js";
import { ChatWidget } from "../../widget/chatWidget.js";
import { layoutChatWidgetForInputHeight } from "../../widget/chatWidget.js";
import { AgentSessionsFilter } from "../../agentSessions/agentSessionsFilter.js";
import { IAgentTitleBarStatusService } from "../../agentSessions/experiments/agentTitleBarStatusService.js";
import { localizeBridge } from "../../aiCustomization/shunCodeBridgeLocalization.js";
import { ChatViewTitleControl } from "./chatViewTitleControl.js";
import { AgentSessionsControl } from "../../agentSessions/agentSessionsControl.js";
import { combineVoiceInput } from "../../voiceClient/voiceInputUtils.js";
import { ShunCodeBridgeSessionView } from "./shunCodeBridgeSessionView.js";
var ChatViewPane = class extends ViewPane {
  constructor(options3, keybindingService2, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService, storageService, chatService, chatAgentService, logService, notificationService, layoutService, chatSessionsService, telemetryService, lifecycleService, progressService, agentSessionsService, chatEntitlementService, commandService, activityService, hostService, micCaptureService, ttsPlaybackService, voiceSessionController, voiceInputModeService, _chatWidgetService, _agentTitleBarStatusService, _voicePlaybackService, _workbenchEnvironmentService, workspaceContextService, agentHostEnablementService) {
    super(options3, keybindingService2, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);
    this.storageService = storageService;
    this.chatService = chatService;
    this.chatAgentService = chatAgentService;
    this.logService = logService;
    this.notificationService = notificationService;
    this.layoutService = layoutService;
    this.chatSessionsService = chatSessionsService;
    this.telemetryService = telemetryService;
    this.progressService = progressService;
    this.agentSessionsService = agentSessionsService;
    this.chatEntitlementService = chatEntitlementService;
    this.commandService = commandService;
    this.activityService = activityService;
    this.hostService = hostService;
    this.micCaptureService = micCaptureService;
    this.ttsPlaybackService = ttsPlaybackService;
    this.voiceSessionController = voiceSessionController;
    this.voiceInputModeService = voiceInputModeService;
    this.workspaceContextService = workspaceContextService;
    this.agentHostEnablementService = agentHostEnablementService;
    this.lastDimensionsPerOrientation = /* @__PURE__ */new Map();
    this.loadSessionCts = this._register(new MutableDisposable());
    this._applyModelCts = this._register(new MutableDisposable());
    /** While > 0 the sessions list is suppressed so a session transition's transiently-empty widget does not reveal it (see {@link beginSessionsListSuppression}). */
    this._sessionsListSuppressionCount = 0;
    this.modelRef = this._register(new MutableDisposable());
    this.activityBadge = this._register(new MutableDisposable());
    this._currentSessionResource = observableValue(this, void 0);
    this.bridgeMode = false;
    this.persistentBridgeStartupScheduled = false;
    this._voiceBarDisposables = this._register(new DisposableStore());
    this.sessionsViewerOrientation = 1 /* Stacked */;
    this.sessionsViewerOrientationConfiguration = "sideBySide";
    this.sessionsViewerSashDisposables = this._register(new MutableDisposable());
    //#region Layout
    this.layoutingBody = false;
    this.bridgeModeContext = ChatContextKeys.shunCodeBridgeMode.bindTo(contextKeyService);
    this._register(toDisposable(() => this.bridgeModeContext.reset()));
    this.memento = new Memento(`interactive-session-view-${CHAT_PROVIDER_ID}`, this.storageService);
    this.viewState = this.memento.getMemento(1 /* WORKSPACE */, 1 /* MACHINE */);
    if (lifecycleService.startupKind !== 3 /* ReloadedWindow */ && this.configurationService.getValue("chat.restoreLastPanelSession" /* RestoreLastPanelSession */) === false) {
      this.viewState.sessionId = void 0;
      this.viewState.sessionResource = void 0;
    }
    this.sessionsViewerVisible = false;
    this.sessionsViewerSidebarWidth = Math.max(ChatViewPane.SESSIONS_SIDEBAR_MIN_WIDTH, this.viewState.sessionsSidebarWidth ?? ChatViewPane.SESSIONS_SIDEBAR_DEFAULT_WIDTH);
    this.chatViewLocationContext = ChatContextKeys.panelLocation.bindTo(contextKeyService);
    this.sessionsViewerOrientationContext = ChatContextKeys.agentSessionsViewerOrientation.bindTo(contextKeyService);
    this.sessionsViewerPositionContext = ChatContextKeys.agentSessionsViewerPosition.bindTo(contextKeyService);
    this.sessionsViewerVisibilityContext = ChatContextKeys.agentSessionsViewerVisible.bindTo(contextKeyService);
    this.updateContextKeys();
    this.registerListeners();
    this._register(CommandsRegistry.registerCommand("_shuncode.bridge.showSession", () => this.showBridgeSession()));
    this._register(CommandsRegistry.registerCommand("_shuncode.bridge.showChat", () => this.showChatSession()));
    this._register(toDisposable(() => {
      this.containerTitleModel?.setTitle(void 0);
      this.containerTitleModel = void 0;
    }));
  }
  getModeViewTitle() {
    return this.bridgeMode ? localize("recovered.11626", "Bridge") : localize("recovered.11627", "Chat");
  }
  get singleViewPaneContainerTitle() {
    return this.getModeViewTitle();
  }
  renderHeader(container3) {
    super.renderHeader(container3);
    this.updateTitle(this.getModeViewTitle());
  }
  updateTitle(_title) {
    const title = this.getModeViewTitle();
    super.updateTitle(title);
    this.updateContainerTitle(title);
  }
  updateContainerTitle(title) {
    const viewContainer5 = this.viewDescriptorService.getViewContainerByViewId(this.id);
    const model = viewContainer5 ? this.viewDescriptorService.getViewContainerModel(viewContainer5) : void 0;
    if (this.containerTitleModel && this.containerTitleModel !== model) {
      this.containerTitleModel.setTitle(void 0);
    }
    this.containerTitleModel = model;
    if (!model) {
      return;
    }
    const ownsContainerTitle = model.visibleViewDescriptors.every(view => view.id === this.id);
    model.setTitle(ownsContainerTitle ? title : void 0);
  }
  updateContextKeys() {
    const {
      position: position2,
      location: location2
    } = this.getViewPositionAndLocation();
    this.chatViewLocationContext.set(location2 ?? 2 /* AuxiliaryBar */);
    this.sessionsViewerOrientationContext.set(this.sessionsViewerOrientation);
    this.sessionsViewerPositionContext.set(position2 === 1 /* RIGHT */ ? 2 /* Right */ : 1 /* Left */);
  }
  getViewPositionAndLocation() {
    const viewLocation = this.viewDescriptorService.getViewLocationById(this.id);
    const sideBarPosition = this.layoutService.getSideBarPosition();
    const panelPosition = this.layoutService.getPanelPosition();
    let sideSessionsOnRightPosition;
    switch (viewLocation) {
      case 0 /* Sidebar */:
        sideSessionsOnRightPosition = sideBarPosition === 1 /* RIGHT */;
        break;
      case 1 /* Panel */:
        sideSessionsOnRightPosition = panelPosition !== 0 /* LEFT */;
        break;
      default:
        sideSessionsOnRightPosition = sideBarPosition === 0 /* LEFT */;
        break;
    }
    return {
      position: sideSessionsOnRightPosition ? 1 /* RIGHT */ : 0 /* LEFT */,
      location: viewLocation ?? 2 /* AuxiliaryBar */
    };
  }
  getSessionHoverPosition() {
    const viewLocation = this.viewDescriptorService.getViewLocationById(this.id);
    const sideBarPosition = this.layoutService.getSideBarPosition();
    if (this.sessionsViewerOrientation === 2 /* SideBySide */) {
      return viewLocation === 0 /* Sidebar */ && sideBarPosition === 1 /* RIGHT */ ? 0 /* LEFT */ : 1 /* RIGHT */;
    }
    return {
      [0 /* LEFT */]: 1 /* RIGHT */,
      [1 /* RIGHT */]: 0 /* LEFT */,
      [3 /* TOP */]: 2 /* BELOW */,
      [2 /* BOTTOM */]: 3 /* ABOVE */
    }[viewLocation === 1 /* Panel */ ? this.layoutService.getPanelPosition() : sideBarPosition];
  }
  updateViewPaneClasses(fromEvent) {
    const activityBarLocationDefault = this.configurationService.getValue("workbench.activityBar.location" /* ACTIVITY_BAR_LOCATION */) === "default";
    this.viewPaneContainer?.classList.toggle("activity-bar-location-default", activityBarLocationDefault);
    this.viewPaneContainer?.classList.toggle("activity-bar-location-other", !activityBarLocationDefault);
    const {
      position: position2,
      location: location2
    } = this.getViewPositionAndLocation();
    this.viewPaneContainer?.classList.toggle("chat-view-location-auxiliarybar", location2 === 2 /* AuxiliaryBar */);
    this.viewPaneContainer?.classList.toggle("chat-view-location-sidebar", location2 === 0 /* Sidebar */);
    this.viewPaneContainer?.classList.toggle("chat-view-location-panel", location2 === 1 /* Panel */);
    this.viewPaneContainer?.classList.toggle("chat-view-position-left", position2 === 0 /* LEFT */);
    this.viewPaneContainer?.classList.toggle("chat-view-position-right", position2 === 1 /* RIGHT */);
    if (fromEvent) {
      this.relayout();
    }
  }
  registerListeners() {
    this._register(this.chatAgentService.onDidChangeAgents(() => this.onDidChangeAgents()));
    this._register(this.chatSessionsService.onDidCommitSession(async e => {
      if (!this.modelRef.value) {
        return;
      }
      if (!isEqual2(e.original, this.modelRef.value.object.sessionResource)) {
        return;
      }
      const modelRef = await this.chatService.acquireOrLoadSession(e.committed, "panel" /* Chat */, CancellationToken.None, "ChatViewPane#onDidCommitSession");
      await this.showModel(CancellationToken.None, modelRef);
    }));
    this._register(Event2.any(Event2.filter(this.configurationService.onDidChangeConfiguration, e => e.affectsConfiguration("workbench.sideBar.location")), this.layoutService.onDidChangePanelPosition, Event2.filter(this.viewDescriptorService.onDidChangeContainerLocation, e => e.viewContainer === this.viewDescriptorService.getViewContainerByViewId(this.id)))(() => {
      this.updateContextKeys();
      this.updateViewPaneClasses(true
      /* layout here */);
    }));
    this._register(Event2.filter(this.configurationService.onDidChangeConfiguration, e => {
      return e.affectsConfiguration("workbench.activityBar.location" /* ACTIVITY_BAR_LOCATION */);
    })(() => this.updateViewPaneClasses(true)));
  }
  onDidChangeAgents() {
    if (this.chatAgentService.getDefaultAgent("panel" /* Chat */)) {
      if (!this._widget?.viewModel && !this.restoringSession) {
        this.restoringSession = this.acquireTransferredOrPersistedSession(CancellationToken.None, "ChatViewPane#onDidChangeAgents").then(async modelRef => {
          if (!this._widget) {
            return;
          }
          const wasVisible = this._widget.visible;
          try {
            this._widget.setVisible(false);
            await this.showModel(CancellationToken.None, modelRef, true, !modelRef);
          } finally {
            this._widget.setVisible(wasVisible);
          }
        });
        this.restoringSession.finally(() => this.restoringSession = void 0);
      }
    }
    this._onDidChangeViewWelcomeState.fire();
  }
  getTransferredOrPersistedSessionInfo() {
    if (this.chatService.transferredSessionResource) {
      return this.chatService.transferredSessionResource;
    }
    if (this.viewState.sessionResource) {
      return this.viewState.sessionResource;
    }
    return this.viewState.sessionId ? LocalChatSessionUri.forSession(this.viewState.sessionId) : void 0;
  }
  renderBody(parent) {
    super.renderBody(parent);
    this.telemetryService.publicLog2("chatViewPaneOpened");
    this.viewPaneContainer = parent;
    this.viewPaneContainer.classList.add("chat-viewpane");
    this.viewPaneContainer.classList.toggle("shuncode-bridge-mode", this.bridgeMode);
    this.updateViewPaneClasses(false);
    const controlsWrapper = append(parent, $(".voice-agent-controls-wrapper"));
    this.createControls(controlsWrapper);
    this._voiceBarContainer = $(".voice-agent-bar-host");
    this._voiceBarContainer.style.display = "none";
    this._updateVoiceBar(this._voiceBarContainer);
    const inputContainerEl = this._widget.inputPart.inputContainerElement;
    if (inputContainerEl) {
      this._setupVoiceTranscriptOverlay(inputContainerEl);
    }
    this._register(this.configurationService.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration("agents.voice.enabled")) {
        this._updateVoiceBar(this._voiceBarContainer);
      }
    }));
    this.setupContextMenu(parent);
    this.applyModel();
  }
  showBridgeSession() {
    this.bridgeMode = true;
    this.bridgeModeContext.set(true);
    this.updateTitle(this.getModeViewTitle());
    this.viewPaneContainer?.classList.add("shuncode-bridge-mode");
    this._widget?.setVisible(false);
    this.bridgeSessionView?.setVisible(this.isBodyVisible());
    this.refreshSessionsControlVisibility();
    this.relayout();
  }
  showChatSession() {
    this.bridgeModeContext.set(false);
    if (!this.bridgeMode) {
      this.updateTitle(this.getModeViewTitle());
      return;
    }
    this.bridgeMode = false;
    this.updateTitle(this.getModeViewTitle());
    this.viewPaneContainer?.classList.remove("shuncode-bridge-mode");
    this.bridgeSessionView?.setVisible(false);
    this._widget?.setVisible(this.isBodyVisible() && !this.welcomeController?.isShowingWelcome.get());
    this.refreshSessionsControlVisibility();
    this.relayout();
    this._widget?.focusInput();
  }
  schedulePersistentBridgeStartup(container3) {
    if (this.persistentBridgeStartupScheduled || this.configurationService.getValue("shuncode.bridge.persistentMode") !== true) {
      return;
    }
    this.persistentBridgeStartupScheduled = true;
    const targetWindow = getWindow(container3);
    let firstFrame = 0;
    let secondFrame = 0;
    let startupTimer;
    firstFrame = targetWindow.requestAnimationFrame(() => {
      secondFrame = targetWindow.requestAnimationFrame(() => {
        startupTimer = targetWindow.setTimeout(() => {
          if (this.configurationService.getValue("shuncode.bridge.persistentMode") !== true) {
            this.showChatSession();
            return;
          }
          this.showBridgeSession();
          void this.commandService.executeCommand("shuncode.bridge.start").catch(error => {
            this.notificationService.error(localizeBridge("shuncodeBridge.autoStartFailed", "Bridge could not be started automatically: {0}", toErrorMessage(error)));
          });
        }, 300);
      });
    });
    this._register(toDisposable(() => {
      targetWindow.cancelAnimationFrame(firstFrame);
      targetWindow.cancelAnimationFrame(secondFrame);
      if (startupTimer !== void 0) {
        targetWindow.clearTimeout(startupTimer);
      }
    }));
  }
  createControls(parent) {
    const sessionsControl = this.createSessionsControl(parent);
    const welcomeController = this.welcomeController = this._register(this.instantiationService.createInstance(ChatViewWelcomeController, parent, this, "panel" /* Chat */));
    const chatWidget = this.createChatControl(parent);
    this.registerControlsListeners(sessionsControl, chatWidget, welcomeController);
    this.updateSessionsControlVisibility();
  }
  _updateVoiceBar(container3) {
    this._voiceBarDisposables.clear();
    container3.replaceChildren();
    container3.style.display = "none";
    if (this.configurationService.getValue("agents.voice.enabled")) {
      this._voiceBarDisposables.add(CommandsRegistry.registerCommand("_chat.voice.acceptInput", (accessor, text2) => {
        const chatWidgetService = accessor.get(IChatWidgetService);
        const focusedWidget = chatWidgetService.lastFocusedWidget;
        const widget = focusedWidget?.hasInputFocus() ? focusedWidget : this._widget;
        if (text2 && widget?.viewModel) {
          if (widget.viewModel.editing) {
            widget.input.setValue(text2, false);
          } else {
            widget.acceptInput(combineVoiceInput(widget.getInput(), text2), {
              preserveFocus: true
            });
          }
        }
      }));
      this._voiceBarDisposables.add(CommandsRegistry.registerCommand("_chat.voice.switchToSession", async (_accessor, resourceStr) => {
        if (!resourceStr) {
          return false;
        }
        try {
          const resource = URI.parse(resourceStr);
          this.viewState.sessionResource = resource;
          this.applyModel();
          await this.restoringSession;
          const restoredResource = this._widget?.viewModel?.sessionResource;
          return !!restoredResource && isEqual2(restoredResource, resource);
        } catch {
          return false;
        }
      }));
      this._voiceBarDisposables.add(CommandsRegistry.registerCommand("_chat.voice.getCurrentSession", _accessor => {
        return this._widget?.viewModel?.sessionResource?.toString();
      }));
    }
  }
  _setupVoiceTranscriptOverlay(inputContainerEl) {
    inputContainerEl.style.position = "relative";
    const transcriptOverlay = $(".voice-transcript-overlay");
    const transcriptScrollable = this._register(new DomScrollableElement(transcriptOverlay, {
      horizontal: 2 /* Hidden */,
      vertical: 1 /* Auto */
    }));
    const transcriptOverlayNode = transcriptScrollable.getDomNode();
    transcriptOverlayNode.classList.add("voice-transcript-overlay-scrollable");
    transcriptOverlayNode.style.display = "none";
    inputContainerEl.append(transcriptOverlayNode);
    let animFrameId;
    const glowDataArrayRef = {
      value: void 0
    };
    const win = getWindow(inputContainerEl);
    let lastGlowTarget;
    let voiceUiOwner;
    const getEffectiveVoice = () => {
      const sim = this.voiceInputModeService.simulatedVoiceState.get();
      if (sim === "idle" || sim === "listening" || sim === "speaking") {
        return {
          connected: true,
          voiceState: sim,
          simulating: true
        };
      }
      if (sim === "off" || sim === "connecting" || sim === "dictating") {
        return {
          connected: false,
          voiceState: "idle",
          simulating: true
        };
      }
      return {
        connected: this.voiceSessionController.isConnected.get(),
        voiceState: this.voiceSessionController.voiceState.get(),
        simulating: false
      };
    };
    const startGlowAnimation = () => {
      if (animFrameId !== void 0) {
        return;
      }
      const animate2 = () => {
        animFrameId = win.requestAnimationFrame(animate2);
        const {
          connected,
          voiceState,
          simulating
        } = getEffectiveVoice();
        const currentSession = this._currentSessionResource.get();
        const isOwner = !voiceUiOwner || !currentSession || isEqual2(voiceUiOwner, currentSession);
        const glowActive = connected && isGlowingVoiceState(voiceState) && (simulating || isOwner);
        const target = inputContainerEl;
        if (lastGlowTarget && lastGlowTarget !== target) {
          lastGlowTarget.style.borderColor = "";
          lastGlowTarget.style.boxShadow = "";
          lastGlowTarget.classList.remove("voice-active", "voice-listening", "voice-speaking");
        }
        lastGlowTarget = target;
        if (!glowActive) {
          target.style.borderColor = "";
          target.style.boxShadow = "";
          target.classList.remove("voice-active", "voice-listening", "voice-speaking");
          return;
        }
        const analyser = this.ttsPlaybackService.analyserNode ?? (voiceState === "listening" ? this.micCaptureService.analyserNode : null) ?? null;
        let intensity;
        if (!analyser && simulating) {
          const t2 = Date.now() / 1e3;
          intensity = Math.min(1, 0.28 + 0.34 * Math.abs(Math.sin(t2 * 6.1)) + 0.22 * Math.abs(Math.sin(t2 * 11.3 + 1)));
        } else {
          intensity = readVoiceGlowIntensity(analyser, glowDataArrayRef);
        }
        const transcriptHidden = this.configurationService.getValue("agents.voice.showTranscript") === false;
        const {
          borderColor,
          boxShadow
        } = computeVoiceGlowStyle(voiceState, intensity, transcriptHidden);
        target.style.borderColor = borderColor;
        target.style.boxShadow = boxShadow;
        target.classList.add("voice-active");
        target.classList.toggle("voice-listening", voiceState === "listening");
        target.classList.toggle("voice-speaking", voiceState === "speaking");
      };
      animFrameId = win.requestAnimationFrame(animate2);
    };
    const stopGlowAnimation = () => {
      if (animFrameId !== void 0) {
        win.cancelAnimationFrame(animFrameId);
        animFrameId = void 0;
      }
      const target = lastGlowTarget ?? inputContainerEl;
      target.style.borderColor = "";
      target.style.boxShadow = "";
      target.classList.remove("voice-active", "voice-listening", "voice-speaking");
      lastGlowTarget = void 0;
    };
    this._register(autorun(reader => {
      const connected = this.voiceSessionController.isConnected.read(reader);
      const voiceState = this.voiceSessionController.voiceState.read(reader);
      const sim = this.voiceInputModeService.simulatedVoiceState.read(reader);
      const simGlow = sim === "listening" || sim === "speaking";
      if (simGlow || connected && isGlowingVoiceState(voiceState)) {
        startGlowAnimation();
      } else {
        stopGlowAnimation();
      }
    }));
    this._register({
      dispose: () => stopGlowAnimation()
    });
    let listeningSession;
    let ownerSession;
    this._register(autorun(reader => {
      const simState = this.voiceInputModeService.simulatedVoiceState.read(reader);
      const simVersion = this.voiceInputModeService.simulatedVersion.read(reader);
      if (simState !== void 0) {
        if (simState === "idle" && simVersion) {
          transcriptOverlayNode.style.display = "";
          transcriptOverlayNode.classList.remove("has-transcript");
          transcriptOverlay.replaceChildren();
          const hint = $("span.partial");
          switch (simVersion) {
            case "handsFree":
              hint.textContent = localize("recovered.11636", "Hands-free \u2014 just start talking");
              break;
            case "keyboardHold":
              {
                const kbLabel = this.keybindingService.lookupKeybinding("workbench.action.chat.voiceInputMode.holdToTalk")?.getLabel();
                hint.textContent = kbLabel ? localize("recovered.11632", "Hold {0} to talk", kbLabel) : localize("recovered.11637", "Hold Space to talk");
                break;
              }
            case "buttonHold":
              hint.textContent = localize("recovered.11634", "Hold the button to talk, tap to turn off");
              break;
            case "clickToggle":
              hint.textContent = localize("recovered.11635", "Tap the button to start listening");
              break;
          }
          transcriptOverlay.append(hint);
          transcriptScrollable.scanDomNode();
        } else {
          transcriptOverlayNode.style.display = "none";
          transcriptOverlayNode.classList.remove("has-transcript");
        }
        return;
      }
      const turns = this.voiceSessionController.transcriptTurns.read(reader);
      const connected = this.voiceSessionController.isConnected.read(reader);
      const voiceState = this.voiceSessionController.voiceState.read(reader);
      const targetSession = this.voiceSessionController.targetSession.read(reader);
      const currentSession = this._currentSessionResource.read(reader);
      const showTranscript = this.configurationService.getValue("agents.voice.showTranscript") !== false;
      const visible = turns.filter(t2 => t2.text.length > 0 || t2.speaker === "user" && t2.isPartial);
      if (!connected) {
        listeningSession = void 0;
        ownerSession = void 0;
        voiceUiOwner = void 0;
        transcriptOverlayNode.style.display = "none";
        transcriptOverlayNode.classList.remove("has-transcript");
        return;
      }
      if (voiceState === "listening") {
        if (!listeningSession) {
          listeningSession = targetSession ?? currentSession;
          ownerSession = listeningSession;
        } else if (!targetSession && currentSession && !isEqual2(currentSession, listeningSession)) {
          const dictationSession = listeningSession;
          const activelyDictating = turns.some(t2 => t2.speaker === "user" && t2.isPartial && t2.text.trim().length > 0);
          if (activelyDictating) {
            this.voiceSessionController.finishListeningAndSubmitTo(dictationSession);
            listeningSession = void 0;
          } else if (isUntitledChatSession(currentSession)) {
            listeningSession = currentSession;
            ownerSession = currentSession;
          } else {
            this.voiceSessionController.discardListening();
            listeningSession = void 0;
          }
        }
      } else {
        listeningSession = void 0;
      }
      const effectiveOwner = targetSession ?? ownerSession;
      voiceUiOwner = effectiveOwner;
      if (effectiveOwner && currentSession && !isEqual2(effectiveOwner, currentSession)) {
        transcriptOverlayNode.style.display = "none";
        transcriptOverlayNode.classList.remove("has-transcript");
        return;
      }
      if (visible.length === 0 || !showTranscript) {
        const handsFree = this.configurationService.getValue("agents.voice.handsFree") === true;
        if (!showTranscript && voiceState === "listening") {
          transcriptOverlayNode.style.display = "";
          transcriptOverlayNode.classList.remove("has-transcript");
          transcriptOverlay.replaceChildren();
          const listening = $("span.listening");
          listening.textContent = localize("recovered.11631", "Listening...");
          transcriptOverlay.append(listening);
          transcriptScrollable.scanDomNode();
        } else if (!showTranscript && voiceState === "speaking") {
          transcriptOverlayNode.style.display = "";
          transcriptOverlayNode.classList.remove("has-transcript");
          transcriptOverlay.replaceChildren();
          const hint = $("span.partial");
          const kb = this.keybindingService.lookupKeybinding("workbench.action.chat.voiceInputMode.holdToTalk") ?? this.keybindingService.lookupKeybinding("agentsVoice.pushToTalk");
          const kbLabel = kb?.getLabel();
          hint.textContent = kbLabel ? localize("recovered.11628", "Speak or use {0}", kbLabel) : localize("recovered.11629", "Speak to barge in");
          transcriptOverlay.append(hint);
          transcriptScrollable.scanDomNode();
        } else if (voiceState === "idle" && visible.length === 0 && showTranscript && !handsFree) {
          transcriptOverlayNode.style.display = "";
          transcriptOverlayNode.classList.remove("has-transcript");
          transcriptOverlay.replaceChildren();
          const hint = $("span.partial");
          const kb = this.keybindingService.lookupKeybinding("agentsVoice.pushToTalk");
          const kbLabel = kb?.getLabel();
          hint.textContent = kbLabel ? localize("recovered.11633", "Press {0} to talk or barge in", kbLabel) : localize("recovered.11630", "Click voice mode to talk or barge in");
          transcriptOverlay.append(hint);
          transcriptScrollable.scanDomNode();
        } else {
          transcriptOverlayNode.style.display = "none";
          transcriptOverlayNode.classList.remove("has-transcript");
        }
        return;
      }
      transcriptOverlayNode.style.display = "";
      transcriptOverlayNode.classList.add("has-transcript");
      const lastTurn = visible[visible.length - 1];
      const contentElements = [];
      if (lastTurn.speaker === "user") {
        const span = $("span");
        if (lastTurn.isPartial) {
          const committedPart = lastTurn.committed || "";
          const unsurePart = lastTurn.text.slice(committedPart.length);
          if (committedPart) {
            const c = $("span.committed");
            c.textContent = committedPart;
            span.append(c);
          }
          const u = $("span.partial");
          u.textContent = unsurePart + "\u2589";
          span.append(u);
        } else {
          span.className = "committed";
          span.textContent = lastTurn.text;
        }
        contentElements.push(span);
      } else {
        const div = $("div.assistant-text");
        div.textContent = lastTurn.text;
        contentElements.push(div);
      }
      transcriptOverlay.replaceChildren(...contentElements);
      transcriptScrollable.scanDomNode();
      transcriptScrollable.setScrollPosition({
        scrollTop: 0
      });
    }));
  }
  static {
    //#endregion
    //#region Sessions Control
    this.SESSIONS_SIDEBAR_MIN_WIDTH = 200;
  }
  static {
    this.SESSIONS_SIDEBAR_SNAP_THRESHOLD = this.SESSIONS_SIDEBAR_MIN_WIDTH / 2;
  }
  static {
    // snap to hide when dragged below half of minimum width
    this.SESSIONS_SIDEBAR_DEFAULT_WIDTH = 300;
  }
  static {
    this.CHAT_WIDGET_DEFAULT_WIDTH = 300;
  }
  static {
    this.SESSIONS_SIDEBAR_VIEW_MIN_WIDTH = this.CHAT_WIDGET_DEFAULT_WIDTH + this.SESSIONS_SIDEBAR_DEFAULT_WIDTH;
  }
  get agentSessionsControl() {
    return this.sessionsControl;
  }
  createSessionsControl(parent) {
    const sessionsContainer = this.sessionsContainer = parent.appendChild($(".agent-sessions-container"));
    const sessionsTitleContainer = this.sessionsTitleContainer = append(sessionsContainer, $(".agent-sessions-title-container"));
    const sessionsTitle = this.sessionsTitle = append(sessionsTitleContainer, $("span.agent-sessions-title"));
    sessionsTitle.textContent = localize("recovered.11625", "Sessions");
    this._register(addDisposableListener(sessionsTitle, EventType.CLICK, () => {
      this.sessionsControl?.scrollToTop();
      this.sessionsControl?.focus();
    }));
    const sessionsToolbarContainer = append(sessionsTitleContainer, $(".agent-sessions-toolbar"));
    const sessionsToolbar = this._register(this.instantiationService.createInstance(MenuWorkbenchToolBar, sessionsToolbarContainer, MenuId.AgentSessionsToolbar, {
      menuOptions: {
        shouldForwardArgs: true
      }
    }));
    const sessionsFilter = this._register(this.instantiationService.createInstance(AgentSessionsFilter, {
      filterMenuId: MenuId.AgentSessionsViewerFilterSubMenu,
      groupResults: () => this.sessionsViewerOrientation === 1 /* Stacked */ ? "capped" /* Capped */ : "date" /* Date */
    }));
    this._register(Event2.runAndSubscribe(sessionsFilter.onDidChange, () => {
      sessionsToolbarContainer.classList.toggle("filtered", !sessionsFilter.isDefault());
    }));
    const newSessionButtonContainer = this.sessionsNewButtonContainer = append(sessionsContainer, $(".agent-sessions-new-button-container"));
    const newSessionButton = this._register(new Button(newSessionButtonContainer, {
      ...defaultButtonStyles,
      secondary: true
    }));
    newSessionButton.label = localize("recovered.11623", "New Session");
    this._register(newSessionButton.onDidClick(() => this.commandService.executeCommand(ACTION_ID_NEW_CHAT, this.getActionsContext())));
    this.sessionsControlContainer = append(sessionsContainer, $(".agent-sessions-control-container"));
    const sessionsControl = this.sessionsControl = this._register(this.instantiationService.createInstance(AgentSessionsControl, this.sessionsControlContainer, {
      source: "chatViewPane",
      filter: sessionsFilter,
      overrideStyles: this.getLocationBasedColors().listOverrideStyles,
      getHoverPosition: () => this.getSessionHoverPosition(),
      trackActiveEditorSession: () => {
        return !this._widget || this._widget.isEmpty();
      },
      overrideSessionOpenOptions: openEvent => {
        if (this.sessionsViewerOrientation === 1 /* Stacked */ && !openEvent.sideBySide) {
          return {
            ...openEvent,
            editorOptions: {
              ...openEvent.editorOptions,
              preserveFocus: false
              /* focus the chat widget when opening from stacked sessions viewer since this closes the stacked viewer */
            }
          };
        }
        return openEvent;
      }
    }));
    this._register(this.onDidChangeBodyVisibility(visible => sessionsControl.setVisible(visible)));
    sessionsToolbar.context = sessionsControl;
    this._register(this.hostService.onDidChangeFocus(hasFocus => {
      if (hasFocus) {
        sessionsControl.refresh();
      }
    }));
    this._register(Event2.runAndSubscribe(Event2.filter(this.configurationService.onDidChangeConfiguration, e => e.affectsConfiguration("chat.viewSessions.orientation" /* ChatViewSessionsOrientation */)), e => {
      const newSessionsViewerOrientationConfiguration = this.configurationService.getValue("chat.viewSessions.orientation" /* ChatViewSessionsOrientation */);
      this.doUpdateConfiguredSessionsViewerOrientation(newSessionsViewerOrientationConfiguration, {
        updateConfiguration: false,
        layout: !!e
      });
    }));
    return sessionsControl;
  }
  getSessionsViewerOrientation() {
    return this.sessionsViewerOrientation;
  }
  updateConfiguredSessionsViewerOrientation(orientation) {
    return this.doUpdateConfiguredSessionsViewerOrientation(orientation, {
      updateConfiguration: true,
      layout: true
    });
  }
  doUpdateConfiguredSessionsViewerOrientation(orientation, options3) {
    const oldSessionsViewerOrientationConfiguration = this.sessionsViewerOrientationConfiguration;
    let validatedOrientation;
    if (orientation === "stacked" || orientation === "sideBySide") {
      validatedOrientation = orientation;
    } else {
      validatedOrientation = "sideBySide";
    }
    this.sessionsViewerOrientationConfiguration = validatedOrientation;
    if (oldSessionsViewerOrientationConfiguration === this.sessionsViewerOrientationConfiguration) {
      return;
    }
    if (options3.updateConfiguration) {
      this.configurationService.updateValue("chat.viewSessions.orientation" /* ChatViewSessionsOrientation */, validatedOrientation);
    }
    if (options3.layout) {
      this.relayout();
    }
  }
  updateSessionsControlVisibility() {
    if (!this.sessionsContainer || !this.viewPaneContainer) {
      return {
        changed: false,
        visible: false
      };
    }
    let newSessionsContainerVisible;
    if (this.bridgeMode) {
      newSessionsContainerVisible = false;
    } else if (!this.configurationService.getValue("chat.viewSessions.enabled" /* ChatViewSessionsEnabled */)) {
      newSessionsContainerVisible = false;
    } else {
      if (this.sessionsViewerOrientation === 1 /* Stacked */) {
        newSessionsContainerVisible = (!!this.chatEntitlementService.sentiment.completed || this.chatEntitlementService.hasByokModels) && (
        // chat is setup (otherwise make room for terms and welcome)
        !this._widget || this._widget.isEmpty() && !!this._widget.viewModel && !this._widget.viewModel.model.title) &&
        // chat widget empty (but not when model is loading or has a title)
        this._sessionsListSuppressionCount === 0 &&
        // not mid-transition (a slow session transiently shows an empty widget)
        !this.welcomeController?.isShowingWelcome.get();
      } else {
        newSessionsContainerVisible = !this.welcomeController?.isShowingWelcome.get() &&
        // welcome not showing
        !!this.lastDimensions && this.lastDimensions.width >= ChatViewPane.SESSIONS_SIDEBAR_VIEW_MIN_WIDTH;
      }
    }
    this.viewPaneContainer.classList.toggle("has-sessions-control", newSessionsContainerVisible);
    const sessionsContainerVisible = this.sessionsContainer.style.display !== "none";
    setVisibility(newSessionsContainerVisible, this.sessionsContainer);
    this.sessionsViewerVisible = newSessionsContainerVisible;
    this.sessionsViewerVisibilityContext.set(newSessionsContainerVisible);
    return {
      changed: sessionsContainerVisible !== newSessionsContainerVisible,
      visible: newSessionsContainerVisible
    };
  }
  refreshSessionsControlVisibility() {
    const {
      changed
    } = this.updateSessionsControlVisibility();
    if (changed) {
      this.relayout();
    }
  }
  /**
   * Suppresses the sessions list until the returned disposable is disposed.
   * Used to span a whole session transition (e.g. a "Continue in…" migration:
   * load → materializing send → rebind) so the transiently-empty widget never
   * falls back to the list.
   */
  beginSessionsListSuppression() {
    this._sessionsListSuppressionCount++;
    this.refreshSessionsControlVisibility();
    return toDisposable(() => {
      this._sessionsListSuppressionCount--;
      this.refreshSessionsControlVisibility();
    });
  }
  getFocusedSessions() {
    return this.sessionsControl?.getFocus() ?? [];
  }
  static {
    //#endregion
    //#region Chat Control
    this.MIN_CHAT_WIDGET_HEIGHT = 116;
  }
  get widget() {
    return this._widget;
  }
  createChatControl(parent) {
    const chatControlsContainer = append(parent, $(".chat-controls-container"));
    const locationBasedColors = this.getLocationBasedColors();
    const editorOverflowWidgetsDomNode = this.layoutService.getContainer(getWindow(chatControlsContainer)).appendChild($(".chat-editor-overflow.monaco-editor"));
    this._register(toDisposable(() => editorOverflowWidgetsDomNode.remove()));
    this.createChatTitleControl(chatControlsContainer);
    const scopedInstantiationService = this._register(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, this.scopedContextKeyService])));
    this._widget = this._register(scopedInstantiationService.createInstance(ChatWidget, "panel" /* Chat */, {
      viewId: this.id
    }, {
      autoScroll: mode => mode !== "ask" /* Ask */,
      renderFollowups: true,
      supportsFileReferences: true,
      clear: () => this.clear(),
      rendererOptions: {
        renderTextEditsAsSummary: uri5 => {
          return true;
        },
        referencesExpandedWhenEmptyResponse: false,
        progressMessageAtBottomOfResponse: mode => mode !== "ask" /* Ask */
      },
      editorOverflowWidgetsDomNode,
      enableImplicitContext: true,
      enableWorkingSet: "explicit",
      supportsChangingModes: true,
      dndContainer: parent
    }, {
      listForeground: SIDE_BAR_FOREGROUND,
      listBackground: locationBasedColors.background,
      overlayBackground: locationBasedColors.overlayBackground,
      inputEditorBackground: locationBasedColors.background,
      resultEditorBackground: editorBackground
    }));
    this._widget.render(chatControlsContainer);
    this.bridgeSessionView = this._register(this.instantiationService.createInstance(ShunCodeBridgeSessionView, chatControlsContainer));
    this.bridgeSessionView.setVisible(this.bridgeMode && this.isBodyVisible());
    const updateWidgetVisibility = reader => this._widget.setVisible(!this.bridgeMode && this.isBodyVisible() && !this.welcomeController?.isShowingWelcome.read(reader));
    this._register(this.onDidChangeBodyVisibility(() => {
      updateWidgetVisibility();
      this.bridgeSessionView?.setVisible(this.bridgeMode && this.isBodyVisible());
    }));
    this._register(autorun(reader => updateWidgetVisibility(reader)));
    this.schedulePersistentBridgeStartup(chatControlsContainer);
    return this._widget;
  }
  createChatTitleControl(parent) {
    this.titleControl = this._register(this.instantiationService.createInstance(ChatViewTitleControl, parent, {
      focusChat: () => this._widget.focusInput()
    }));
    this._register(this.titleControl.onDidChangeHeight(() => {
      this.relayout();
    }));
  }
  //#endregion
  registerControlsListeners(sessionsControl, chatWidget, welcomeController) {
    const hasByokModelsContextKeys = /* @__PURE__ */new Set([ChatEntitlementContextKeys.hasByokModels.key]);
    this._register(Event2.any(chatWidget.onDidChangeEmptyState, Event2.fromObservable(welcomeController.isShowingWelcome), Event2.filter(this.configurationService.onDidChangeConfiguration, e => e.affectsConfiguration("chat.viewSessions.enabled" /* ChatViewSessionsEnabled */)), Event2.filter(this.contextKeyService.onDidChangeContext, e => e.affectsSome(hasByokModelsContextKeys)))(() => {
      if (this.sessionsViewerOrientation === 1 /* Stacked */) {
        sessionsControl.clearFocus();
      }
      const {
        changed: visibilityChanged
      } = this.updateSessionsControlVisibility();
      if (visibilityChanged) {
        this.relayout();
      }
    }));
    this._register(chatWidget.onDidChangeViewModel(() => {
      const model = chatWidget.viewModel?.model;
      this.titleControl?.update(model);
      this._currentSessionResource.set(chatWidget.viewModel?.sessionResource, void 0);
      if (this.sessionsViewerOrientation === 1 /* Stacked */) {
        return;
      }
      const sessionResource = chatWidget.viewModel?.sessionResource;
      if (sessionResource) {
        const revealed = sessionsControl.reveal(sessionResource);
        if (!revealed) {
          sessionsControl.clearFocus();
        }
      }
    }));
    this._register(this.agentSessionsService.model.onDidChangeSessions(() => {
      if (this.sessionsViewerOrientation === 1 /* Stacked */) {
        return;
      }
      if (sessionsControl.hasFocusOrSelection()) {
        return;
      }
      const sessionResource = chatWidget.viewModel?.sessionResource;
      if (sessionResource) {
        sessionsControl.reveal(sessionResource);
      }
    }));
    this._register(this.agentSessionsService.model.onDidChangeSessionArchivedState(e => {
      if (e.isArchived()) {
        const currentSessionResource = chatWidget.viewModel?.sessionResource;
        if (currentSessionResource && isEqual2(currentSessionResource, e.resource)) {
          this.clear();
        }
      }
    }));
    this._register(autorun(reader => {
      chatWidget.inputPart.height.read(reader);
      if (this.sessionsViewerVisible && this.sessionsViewerOrientation === 1 /* Stacked */) {
        this.relayoutForInputHeight();
      }
    }));
    const progressBadgeDisposables = this._register(new MutableDisposable());
    const updateProgressBadge = () => {
      progressBadgeDisposables.value = new DisposableStore();
      if (!this.configurationService.getValue("chat.viewProgressBadge.enabled" /* ChatViewProgressBadgeEnabled */)) {
        this.activityBadge.clear();
        return;
      }
      const model = chatWidget.viewModel?.model;
      if (model) {
        progressBadgeDisposables.value.add(autorun(reader => {
          if (model.requestInProgress.read(reader)) {
            this.activityBadge.value = this.activityService.showViewActivity(this.id, {
              badge: new ProgressBadge(() => localize("recovered.11624", "Agent Session in Progress"))
            });
          } else {
            this.activityBadge.clear();
          }
        }));
      } else {
        this.activityBadge.clear();
      }
    };
    this._register(chatWidget.onDidChangeViewModel(() => updateProgressBadge()));
    this._register(Event2.filter(this.configurationService.onDidChangeConfiguration, e => e.affectsConfiguration("chat.viewProgressBadge.enabled" /* ChatViewProgressBadgeEnabled */))(() => updateProgressBadge()));
    updateProgressBadge();
  }
  setupContextMenu(parent) {
    this._register(addDisposableListener(parent, EventType.CONTEXT_MENU, e => {
      EventHelper.stop(e, true);
      this.contextMenuService.showContextMenu({
        menuId: MenuId.ChatWelcomeContext,
        contextKeyService: this.contextKeyService,
        getAnchor: () => new StandardMouseEvent(getWindow(parent), e)
      });
    }));
  }
  //#region Model Management
  applyModel() {
    this._applyModelCts.value?.cancel();
    const cts = this._applyModelCts.value = new CancellationTokenSource();
    this.restoringSession = this._applyModel(cts.token).catch(err => {
      if (!isCancellationError(err)) {
        this.logService.error("ChatViewPane#applyModel failed", err);
      }
    });
    this.restoringSession.finally(() => this.restoringSession = void 0);
  }
  async _applyModel(token) {
    const modelRef = await this.acquireTransferredOrPersistedSession(token, "ChatViewPane#applyModel");
    await this.showModel(token, modelRef, true, !modelRef);
  }
  /**
   * Force-start a new local chat session in the view, bypassing the
   * default-provider override applied by `showModel()`. Used by the
   * picker when the user explicitly selects "Local", and by New Local Chat.
   */
  async startNewLocalSession() {
    this._applyModelCts.value?.cancel();
    const ref = this.chatService.startNewLocalSession("panel" /* Chat */, {
      debugOwner: "ChatViewPane#startNewLocalSession"
    });
    return this.showModel(CancellationToken.None, ref);
  }
  /**
   * When the remembered or computed default session type is a non-local
   * provider (for example when the agent host is enabled), return a new session
   * reference for it instead of the built-in local provider. Returns
   * `undefined` to fall back to `startNewLocalSession`.
   */
  async acquireDefaultNewSession(token) {
    const workspace = this.workspaceContextService.getWorkspace();
    const defaultType = getDefaultNewChatSessionType(this.configurationService, this.chatSessionsService, this.storageService, workspace, this.agentHostEnablementService.enabled.get());
    if (defaultType === localChatSessionType) {
      return void 0;
    }
    const resource = getDefaultNewChatSessionResource(this.configurationService, this.chatSessionsService, this.storageService, workspace, this.agentHostEnablementService.enabled.get());
    try {
      return await this.chatService.acquireOrLoadSession(resource, "panel" /* Chat */, token, "ChatViewPane#acquireDefaultNewSession");
    } catch (error) {
      if (isCancellationError(error)) {
        throw error;
      }
      this.logService.warn(`[ChatViewPane] Failed to acquire default agent-host session, falling back to local`, error);
      return void 0;
    }
  }
  async acquireTransferredOrPersistedSession(token, debugOwner) {
    const sessionResource = this.getTransferredOrPersistedSessionInfo();
    if (!sessionResource) {
      return void 0;
    }
    const modelRef = await this.chatService.acquireOrLoadSession(sessionResource, "panel" /* Chat */, token, debugOwner);
    if (!modelRef) {
      return void 0;
    }
    if (this.shouldSkipRestoredLocalSession(sessionResource, modelRef.object)) {
      modelRef.dispose();
      return void 0;
    }
    return modelRef;
  }
  shouldSkipRestoredLocalSession(sessionResource, model) {
    const workspace = this.workspaceContextService.getWorkspace();
    const defaultType = getDefaultNewChatSessionType(this.configurationService, this.chatSessionsService, this.storageService, workspace, this.agentHostEnablementService.enabled.get());
    return defaultType !== localChatSessionType && getChatSessionType(sessionResource) === localChatSessionType && !model.hasRequests;
  }
  async showModel(token, modelRef, startNewSession = true, ignoreTransferredSession = false, inputBeforeLoad) {
    const oldModelResource = this.modelRef.value?.object.sessionResource;
    this.modelRef.value = void 0;
    const baselineInput = inputBeforeLoad ?? this._widget?.getInput() ?? "";
    let ref;
    if (startNewSession) {
      if (modelRef) {
        ref = modelRef;
      } else if (!ignoreTransferredSession && this.chatService.transferredSessionResource) {
        ref = await this.chatService.acquireOrLoadSession(this.chatService.transferredSessionResource, "panel" /* Chat */, token, "ChatViewPane#showModel");
      } else {
        ref = (await this.acquireDefaultNewSession(token)) ?? this.chatService.startNewLocalSession("panel" /* Chat */, {
          debugOwner: "ChatViewPane#showModel"
        });
      }
      if (!ref) {
        throw new Error("Could not start chat session");
      }
    }
    if (token.isCancellationRequested) {
      ref?.dispose();
      return void 0;
    }
    this.modelRef.value = ref;
    const model = ref?.object;
    if (model) {
      await this.updateWidgetLockState(getChatSessionType(model.sessionResource));
      if (token.isCancellationRequested) {
        this.modelRef.value = void 0;
        return void 0;
      }
      this.viewState.sessionResource = model.sessionResource;
    }
    if (model) {
      setModelPreservingInputTypedWhileLoading(this._widget, baselineInput, () => this._widget.setModel(model));
    } else {
      this._widget.setModel(model);
    }
    this.titleControl?.update(model);
    this.updateActions();
    if (oldModelResource) {
      const capturedOldResource = oldModelResource;
      this._register(disposableTimeout(() => {
        const oldSession = this.agentSessionsService.model.getSession(capturedOldResource);
        if (oldSession && !oldSession.isMarkedUnread()) {
          oldSession.setRead(true);
        }
      }, 0));
    }
    return model;
  }
  async updateWidgetLockState(sessionType) {
    if (sessionType === localChatSessionType) {
      this._widget.unlockFromCodingAgent();
      return;
    }
    let canResolve = false;
    try {
      canResolve = await this.chatSessionsService.canResolveChatSession(sessionType);
    } catch (error) {
      this.logService.warn(`Failed to resolve chat session type '${sessionType}' for locking`, error);
    }
    if (!canResolve) {
      this._widget.unlockFromCodingAgent();
      return;
    }
    const contribution = this.chatSessionsService.getChatSessionContribution(sessionType);
    if (contribution) {
      this._widget.lockToCodingAgent(contribution.name, contribution.displayName, sessionType, contribution.agentHostProviderId);
    } else {
      this._widget.unlockFromCodingAgent();
    }
  }
  async clear() {
    this.loadSessionCts.value?.cancel();
    this.updateViewState();
    await this.showModel(CancellationToken.None);
    this.updateActions();
  }
  async loadSession(sessionResource) {
    const t0 = Date.now();
    this.logService.trace(`[ChatViewPane] loadSession start uri=${sessionResource.toString()}`);
    const inputBeforeLoad = this._widget?.getInput() ?? "";
    this.loadSessionCts.value?.cancel();
    const cts = this.loadSessionCts.value = new CancellationTokenSource();
    const token = cts.token;
    if (this.restoringSession) {
      await this.restoringSession;
    }
    if (token.isCancellationRequested) {
      this.logService.trace(`[ChatViewPane] loadSession done total=${Date.now() - t0}ms uri=${sessionResource.toString()} cancelled=true phase=preAcquire`);
      return void 0;
    }
    return this.progressService.withProgress({
      location: ChatViewId,
      delay: 200
    }, async () => {
      let queue = Promise.resolve();
      const clearWidget = disposableTimeout(() => {
        if (token.isCancellationRequested || this.loadSessionCts.value !== cts) {
          return;
        }
        queue = this.showModel(token, void 0, false).then(() => {});
      }, 100);
      const clearWidgetCancellationListener = token.onCancellationRequested(() => clearWidget.dispose());
      try {
        const newModelRef = await this.chatService.acquireOrLoadSession(sessionResource, "panel" /* Chat */, token, "ChatViewPane#loadSession");
        clearWidget.dispose();
        await queue;
        if (token.isCancellationRequested) {
          newModelRef?.dispose();
          this.logService.trace(`[ChatViewPane] loadSession done total=${Date.now() - t0}ms uri=${sessionResource.toString()} cancelled=true phase=postAcquire`);
          return void 0;
        }
        const result = await this.showModel(token, newModelRef, true, false, inputBeforeLoad);
        this.logService.trace(`[ChatViewPane] loadSession done total=${Date.now() - t0}ms uri=${sessionResource.toString()}`);
        return result;
      } catch (err) {
        clearWidget.dispose();
        await queue;
        if (token.isCancellationRequested) {
          this.logService.trace(`[ChatViewPane] loadSession done total=${Date.now() - t0}ms uri=${sessionResource.toString()} cancelled=true phase=error`);
          return void 0;
        }
        this.logService.error(`Failed to load chat session '${sessionResource.toString()}'`, err);
        this.notificationService.error(localize("recovered.11622", "Failed to open chat session: {0}", toErrorMessage(err)));
        const result = await this.showModel(token, void 0, true, false, inputBeforeLoad);
        this.logService.trace(`[ChatViewPane] loadSession done total=${Date.now() - t0}ms uri=${sessionResource.toString()} error=true`);
        return result;
      } finally {
        clearWidgetCancellationListener.dispose();
      }
    });
  }
  //#endregion
  focus() {
    super.focus();
    this.focusInput();
  }
  focusInput() {
    if (this.bridgeMode) {
      return;
    }
    this._widget.focusInput();
  }
  focusSessions() {
    if (this.sessionsContainer?.style.display === "none") {
      return false;
    }
    this.sessionsControl?.focus();
    return true;
  }
  relayout() {
    if (!this.bridgeMode && !this._widget?.visible) {
      return;
    }
    if (this.lastDimensions) {
      this.layoutBody(this.lastDimensions.height, this.lastDimensions.width);
    }
  }
  relayoutForInputHeight() {
    if (this.layoutingBody || !this._widget?.visible || !this.lastDimensions) {
      return;
    }
    this.layoutChatAndSessions(this.lastDimensions.height, this.lastDimensions.width, false);
  }
  layoutBody(height, width2) {
    if (this.layoutingBody) {
      return;
    }
    this.layoutingBody = true;
    try {
      this.doLayoutBody(height, width2);
    } finally {
      this.layoutingBody = false;
    }
  }
  doLayoutBody(height, width2) {
    super.layoutBody(height, width2);
    this.lastDimensions = {
      height,
      width: width2
    };
    this.layoutChatAndSessions(height, width2, true);
  }
  layoutChatAndSessions(height, width2, layoutInput) {
    if (this.bridgeMode) {
      this.sessionsViewerSashDisposables.clear();
      this.sessionsViewerSash = void 0;
      this.lastDimensionsPerOrientation.set(this.sessionsViewerOrientation, {
        height,
        width: width2
      });
      return;
    }
    let remainingHeight = height;
    const remainingWidth = width2;
    const titleHeight = this.titleControl?.getHeight() ?? 0;
    remainingHeight -= titleHeight;
    const {
      heightReduction,
      widthReduction
    } = this.layoutSessionsControl(remainingHeight, remainingWidth);
    const inputMaxHeight = this.sessionsViewerOrientation === 1 /* Stacked */ ? remainingHeight : void 0;
    if (layoutInput) {
      this._widget.setInputPartMaxHeightOverride(inputMaxHeight);
      this._widget.layout(remainingHeight - heightReduction, remainingWidth - widthReduction);
    } else {
      layoutChatWidgetForInputHeight(this._widget, inputMaxHeight, remainingHeight - heightReduction, remainingWidth - widthReduction);
    }
    this.lastDimensionsPerOrientation.set(this.sessionsViewerOrientation, {
      height,
      width: width2
    });
  }
  layoutSessionsControl(height, width2) {
    let heightReduction = 0;
    let widthReduction = 0;
    if (!this.sessionsContainer || !this.sessionsControlContainer || !this.sessionsControl || !this.viewPaneContainer || !this.sessionsTitleContainer || !this.sessionsTitle) {
      return {
        heightReduction,
        widthReduction
      };
    }
    const oldSessionsViewerOrientation = this.sessionsViewerOrientation;
    let newSessionsViewerOrientation;
    switch (this.sessionsViewerOrientationConfiguration) {
      // Stacked
      case "stacked":
        newSessionsViewerOrientation = 1 /* Stacked */;
        break;
      // Update orientation based on available width
      default:
        newSessionsViewerOrientation = width2 >= ChatViewPane.SESSIONS_SIDEBAR_VIEW_MIN_WIDTH ? 2 /* SideBySide */ : 1 /* Stacked */;
    }
    this.sessionsViewerOrientation = newSessionsViewerOrientation;
    if (newSessionsViewerOrientation === 2 /* SideBySide */) {
      this.viewPaneContainer.classList.toggle("sessions-control-orientation-sidebyside", true);
      this.viewPaneContainer.classList.toggle("sessions-control-orientation-stacked", false);
      this.sessionsViewerOrientationContext.set(2 /* SideBySide */);
    } else {
      this.viewPaneContainer.classList.toggle("sessions-control-orientation-sidebyside", false);
      this.viewPaneContainer.classList.toggle("sessions-control-orientation-stacked", true);
      this.sessionsViewerOrientationContext.set(1 /* Stacked */);
    }
    if (oldSessionsViewerOrientation !== this.sessionsViewerOrientation) {
      const updatePromise = this.sessionsControl.update();
      if (this.sessionsViewerOrientation === 2 /* SideBySide */) {
        updatePromise.then(didUpdate => {
          if (!didUpdate) {
            return;
          }
          const sessionResource = this._widget?.viewModel?.sessionResource;
          if (sessionResource) {
            this.sessionsControl?.reveal(sessionResource);
          }
        });
      }
    }
    const {
      visible: sessionsContainerVisible
    } = this.updateSessionsControlVisibility();
    if (!sessionsContainerVisible || this.sessionsViewerOrientation === 1 /* Stacked */) {
      this.sessionsViewerSashDisposables.clear();
      this.sessionsViewerSash = void 0;
    } else if (this.sessionsViewerOrientation === 2 /* SideBySide */) {
      if (!this.sessionsViewerSashDisposables.value && this.viewPaneContainer) {
        this.createSessionsViewerSash(this.viewPaneContainer, height, width2);
      }
    }
    if (!sessionsContainerVisible) {
      return {
        heightReduction: 0,
        widthReduction: 0
      };
    }
    let availableSessionsHeight = height - this.sessionsTitleContainer.offsetHeight;
    if (this.sessionsViewerOrientation === 1 /* Stacked */) {
      availableSessionsHeight -= Math.max(ChatViewPane.MIN_CHAT_WIDGET_HEIGHT, this._widget?.input?.height.get() ?? 0);
    } else {
      availableSessionsHeight -= this.sessionsNewButtonContainer?.offsetHeight ?? 0;
    }
    if (this.sessionsViewerOrientation === 2 /* SideBySide */) {
      const sessionsViewerSidebarWidth = this.computeEffectiveSideBySideSessionsSidebarWidth(width2);
      this.sessionsControlContainer.style.height = `${availableSessionsHeight}px`;
      this.sessionsControlContainer.style.width = `${sessionsViewerSidebarWidth}px`;
      this.sessionsControl.layout(availableSessionsHeight, sessionsViewerSidebarWidth);
      this.sessionsViewerSash?.layout();
      heightReduction = 0;
      widthReduction = this.sessionsContainer.offsetWidth;
    } else {
      this.sessionsControlContainer.style.height = `${availableSessionsHeight}px`;
      this.sessionsControlContainer.style.width = ``;
      this.sessionsControl.layout(availableSessionsHeight, width2);
      heightReduction = this.sessionsContainer.offsetHeight;
      widthReduction = 0;
    }
    return {
      heightReduction,
      widthReduction
    };
  }
  computeEffectiveSideBySideSessionsSidebarWidth(width2, sessionsViewerSidebarWidth = this.sessionsViewerSidebarWidth) {
    return Math.max(ChatViewPane.SESSIONS_SIDEBAR_MIN_WIDTH,
    // never smaller than min width for side by side sessions
    Math.min(sessionsViewerSidebarWidth, width2 - ChatViewPane.CHAT_WIDGET_DEFAULT_WIDTH
    // never so wide that chat widget is smaller than default width
    ));
  }
  getLastDimensions(orientation) {
    return this.lastDimensionsPerOrientation.get(orientation);
  }
  createSessionsViewerSash(container3, height, width2) {
    const disposables = this.sessionsViewerSashDisposables.value = new DisposableStore();
    const sash = this.sessionsViewerSash = disposables.add(new Sash(container3, {
      getVerticalSashLeft: () => {
        const sessionsViewerSidebarWidth = this.computeEffectiveSideBySideSessionsSidebarWidth(this.lastDimensions?.width ?? width2);
        const {
          position: position2
        } = this.getViewPositionAndLocation();
        if (position2 === 1 /* RIGHT */) {
          return (this.lastDimensions?.width ?? width2) - sessionsViewerSidebarWidth;
        }
        return sessionsViewerSidebarWidth;
      }
    }, {
      orientation: 0 /* VERTICAL */
    }));
    let sashStartWidth;
    disposables.add(sash.onDidStart(() => sashStartWidth = this.sessionsViewerSidebarWidth));
    disposables.add(sash.onDidEnd(() => sashStartWidth = void 0));
    disposables.add(sash.onDidChange(e => {
      if (sashStartWidth === void 0 || !this.lastDimensions) {
        return;
      }
      const {
        position: position2
      } = this.getViewPositionAndLocation();
      const delta2 = e.currentX - e.startX;
      const newWidth = position2 === 1 /* RIGHT */ ? sashStartWidth - delta2 : sashStartWidth + delta2;
      if (newWidth < ChatViewPane.SESSIONS_SIDEBAR_SNAP_THRESHOLD) {
        this.updateConfiguredSessionsViewerOrientation("stacked");
        return;
      }
      this.sessionsViewerSidebarWidth = this.computeEffectiveSideBySideSessionsSidebarWidth(this.lastDimensions.width, newWidth);
      this.viewState.sessionsSidebarWidth = this.sessionsViewerSidebarWidth;
      this.layoutBody(this.lastDimensions.height, this.lastDimensions.width);
    }));
    disposables.add(sash.onDidReset(() => {
      this.sessionsViewerSidebarWidth = ChatViewPane.SESSIONS_SIDEBAR_DEFAULT_WIDTH;
      this.viewState.sessionsSidebarWidth = this.sessionsViewerSidebarWidth;
      this.relayout();
    }));
  }
  //#endregion
  saveState() {
    if (this._widget?.viewModel) {
      this._widget.saveState();
      this.updateViewState();
      this.memento.saveMemento();
    }
    super.saveState();
  }
  updateViewState(viewState) {
    const newViewState = viewState ?? this._widget.getViewState();
    if (newViewState) {
      for (const [key3, value2] of Object.entries(newViewState)) {
        this.viewState[key3] = value2;
      }
    }
  }
  shouldShowWelcome() {
    const noPersistedSessions = !this.chatService.hasSessions();
    const hasCoreAgent = this.chatAgentService.getAgents().some(agent => agent.isCore && agent.locations.includes("panel" /* Chat */));
    const hasDefaultAgent = this.chatAgentService.getDefaultAgent("panel" /* Chat */) !== void 0;
    const shouldShow = !hasCoreAgent && (!hasDefaultAgent || !this._widget?.viewModel && noPersistedSessions);
    this.logService.trace(`ChatViewPane#shouldShowWelcome() = ${shouldShow}: hasCoreAgent=${hasCoreAgent} hasDefaultAgent=${hasDefaultAgent} || noViewModel=${!this._widget?.viewModel} && noPersistedSessions=${noPersistedSessions}`);
    return !!shouldShow;
  }
  getMatchingWelcomeView() {
    return this.welcomeController?.getMatchingWelcomeView();
  }
  getActionsContext() {
    return this._widget?.viewModel ? {
      sessionResource: this._widget.viewModel.sessionResource,
      $mid: 19 /* ChatViewContext */
    } : void 0;
  }
};
ChatViewPane = __decorateClass([__decorateParam(1, IKeybindingService), __decorateParam(2, IContextMenuService), __decorateParam(3, IConfigurationService), __decorateParam(4, IContextKeyService), __decorateParam(5, IViewDescriptorService), __decorateParam(6, IInstantiationService), __decorateParam(7, IOpenerService), __decorateParam(8, IThemeService), __decorateParam(9, IHoverService), __decorateParam(10, IStorageService), __decorateParam(11, IChatService), __decorateParam(12, IChatAgentService), __decorateParam(13, ILogService), __decorateParam(14, INotificationService), __decorateParam(15, IWorkbenchLayoutService), __decorateParam(16, IChatSessionsService), __decorateParam(17, ITelemetryService), __decorateParam(18, ILifecycleService), __decorateParam(19, IProgressService), __decorateParam(20, IAgentSessionsService), __decorateParam(21, IChatEntitlementService), __decorateParam(22, ICommandService), __decorateParam(23, IActivityService), __decorateParam(24, IHostService), __decorateParam(25, IMicCaptureService), __decorateParam(26, ITtsPlaybackService), __decorateParam(27, IVoiceSessionController), __decorateParam(28, IVoiceInputModeService), __decorateParam(29, IChatWidgetService), __decorateParam(30, IAgentTitleBarStatusService), __decorateParam(31, IVoicePlaybackService), __decorateParam(32, IWorkbenchEnvironmentService), __decorateParam(33, IWorkspaceContextService), __decorateParam(34, IAgentHostEnablementService)], ChatViewPane);

// src/vs/workbench/contrib/chat/browser/chatParticipant.contribution.ts
export { ChatViewPane };
