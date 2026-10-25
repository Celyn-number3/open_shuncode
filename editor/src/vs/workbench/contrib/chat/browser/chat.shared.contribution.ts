// @ts-nocheck
import './aiCustomization/aiCustomizationWorkspaceService.js';
import './aiCustomization/customizationHarnessService.js';
import './aiCustomization/aiCustomizationManagement.contribution.js';
import './aiCustomization/aiCustomizationItemsModel.js';
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
import { __decorateClass } from "../../../../base/common/shunCodeRecoveredHelpersWorkbench.js";
import { __decorateParam } from "../../../../base/common/shunCodeRecoveredHelpersWorkbench.js";
import { localize } from "../../../../nls.js";
import { DisposableStore } from "../../../../base/common/lifecycle.js";
import { Disposable } from "../../../../base/common/lifecycle.js";
import { DisposableMap } from "../../../../base/common/lifecycle.js";
import { isMacintosh } from "../../../../base/common/platform.js";
import { Event as Event2 } from "../../../../base/common/event.js";
import { Schemas } from "../../../../base/common/network.js";
import { autorun } from "../../../../base/common/observableInternal/reactions/autorun.js";
import { observableFromEvent } from "../../../../base/common/observableInternal/observables/observableFromEvent.js";
import { IInstantiationService } from "../../../../platform/instantiation/common/instantiation.js";
import { CommandsRegistry } from "../../../../platform/commands/common/commands.js";
import { IContextKeyService } from "../../../../platform/contextkey/common/contextkey.js";
import { Registry } from "../../../../platform/registry/common/platform.js";
import { registerAction2 } from "../../../../platform/actions/common/actions.js";
import { ITelemetryService } from "../../../../platform/telemetry/common/telemetry.js";
import { IConfigurationService } from "../../../../platform/configuration/common/configuration.js";
import { SyncDescriptor } from "../../../../platform/instantiation/common/descriptors.js";
import { registerSingleton } from "../../../../platform/instantiation/common/extensions.js";
import { Extensions as Extensions3 } from "../../../../platform/jsonschemas/common/jsonContributionRegistry.js";
import product_default from "../../../../platform/product/common/product.js";
import { Extensions as Extensions4 } from "../../../../platform/configuration/common/configurationRegistry.js";
import { registerEditorFeature } from "../../../../editor/common/editorFeatures.js";
import { AccessibleViewRegistry } from "../../../../platform/accessibility/browser/accessibleViewRegistry.js";
import { WorkbenchPhase } from "../../../common/contributions.js";
import { registerWorkbenchContribution2 } from "../../../common/contributions.js";
import { EditorExtensions } from "../../../common/editor.js";
import { IPathService } from "../../../services/path/common/pathService.js";
import { ILanguageModelIgnoredFilesService } from "../common/ignoredFiles.js";
import { LanguageModelIgnoredFilesService } from "../common/ignoredFiles.js";
import { ChatAIDisabledSettingId } from "../../../../platform/chat/common/chatSettings.js";
import { IChatEntitlementService } from "../../../services/chat/common/chatEntitlementService.js";
import { COPILOT_DISABLE_BYPASS_PERMISSIONS_MODE_KEY } from "../../../../platform/policy/common/copilotManagedSettings.js";
import { COPILOT_ENABLED_PLUGINS_KEY } from "../../../../platform/policy/common/copilotManagedSettings.js";
import { COPILOT_EXTRA_MARKETPLACES_KEY } from "../../../../platform/policy/common/copilotManagedSettings.js";
import { COPILOT_STRICT_MARKETPLACES_KEY } from "../../../../platform/policy/common/copilotManagedSettings.js";
import { COPILOT_ALLOWED_MCP_SERVERS_KEY } from "../../../../platform/policy/common/copilotManagedSettings.js";
import { COPILOT_DENIED_MCP_SERVERS_KEY } from "../../../../platform/policy/common/copilotManagedSettings.js";
import { COPILOT_MODEL_KEY } from "../../../../platform/policy/common/copilotManagedSettings.js";
import { managedSettingValue } from "../../../../platform/policy/common/copilotManagedSettings.js";
import { managedModelValue } from "../../../../platform/policy/common/copilotManagedSettings.js";
import { IChatSessionsService } from "../common/chatSessionsService.js";
import { ChatContextKeys } from "../common/actions/chatContextKeys.js";
import { ILanguageModelsConfigurationService } from "../common/languageModelsConfiguration.js";
import { ILanguageModelsService } from "../common/languageModels.js";
import { LanguageModelsService } from "../common/languageModels.js";
import { IChatService } from "../common/chatService/chatService.js";
import { IChatAgentService } from "../common/participants/chatAgents.js";
import { ChatAgentService } from "../common/participants/chatAgents.js";
import { IChatAgentNameService } from "../common/participants/chatAgents.js";
import { ChatAgentNameService } from "../common/participants/chatAgents.js";
import { IChatWidgetService } from "./chat.js";
import { IQuickChatService } from "./chat.js";
import { IChatAccessibilityService } from "./chat.js";
import { isIChatViewViewContext } from "./chat.js";
import { isIChatResourceViewContext } from "./chat.js";
import { IChatCodeBlockContextProviderService } from "./chat.js";
import { ChatViewId } from "./chat.js";
import { IChatVariablesService } from "../common/attachments/chatVariables.js";
import { ChatDynamicVariableModel } from "./attachments/chatDynamicVariables.js";
import { IPromptsService } from "../common/promptSyntax/service/promptsService.js";
import { PROMPT_DOCUMENTATION_URL } from "../common/promptSyntax/promptTypes.js";
import { INSTRUCTIONS_DOCUMENTATION_URL } from "../common/promptSyntax/promptTypes.js";
import { AGENT_DOCUMENTATION_URL } from "../common/promptSyntax/promptTypes.js";
import { SKILL_DOCUMENTATION_URL } from "../common/promptSyntax/promptTypes.js";
import { HOOK_DOCUMENTATION_URL } from "../common/promptSyntax/promptTypes.js";
import { AgentHostAgentDebugLogEnabledSettingId } from "../common/promptSyntax/promptTypes.js";
import { AgentHostAgentDebugLogMaxEventsSettingId } from "../common/promptSyntax/promptTypes.js";
import { IChatSlashCommandService } from "../common/participants/chatSlashCommands.js";
import { ChatSlashCommandService } from "../common/participants/chatSlashCommands.js";
import { ILanguageModelToolsService } from "../common/tools/languageModelToolsService.js";
import { ChatVariablesService } from "./attachments/chatVariables.js";
import { PROMPT_FILE_EXTENSION } from "../common/promptSyntax/config/promptFileLocations.js";
import { INSTRUCTION_FILE_EXTENSION } from "../common/promptSyntax/config/promptFileLocations.js";
import { LEGACY_MODE_FILE_EXTENSION } from "../common/promptSyntax/config/promptFileLocations.js";
import { AGENT_FILE_EXTENSION } from "../common/promptSyntax/config/promptFileLocations.js";
import { SKILL_FILENAME } from "../common/promptSyntax/config/promptFileLocations.js";
import { PROMPT_DEFAULT_SOURCE_FOLDER } from "../common/promptSyntax/config/promptFileLocations.js";
import { INSTRUCTIONS_DEFAULT_SOURCE_FOLDER } from "../common/promptSyntax/config/promptFileLocations.js";
import { LEGACY_MODE_DEFAULT_SOURCE_FOLDER } from "../common/promptSyntax/config/promptFileLocations.js";
import { AGENTS_SOURCE_FOLDER } from "../common/promptSyntax/config/promptFileLocations.js";
import { CLAUDE_AGENTS_SOURCE_FOLDER } from "../common/promptSyntax/config/promptFileLocations.js";
import { COPILOT_USER_AGENTS_SOURCE_FOLDER } from "../common/promptSyntax/config/promptFileLocations.js";
import { DEFAULT_SKILL_SOURCE_FOLDERS } from "../common/promptSyntax/config/promptFileLocations.js";
import { DEFAULT_INSTRUCTIONS_SOURCE_FOLDERS } from "../common/promptSyntax/config/promptFileLocations.js";
import { DEFAULT_HOOK_FILE_PATHS } from "../common/promptSyntax/config/promptFileLocations.js";
import { PromptsConfig } from "../common/promptSyntax/config/config.js";
import { isTildePath } from "../common/promptSyntax/config/config.js";
import { VALID_PROMPT_FOLDER_PATTERN } from "../common/promptSyntax/utils/promptFilesLocator.js";
import { hookFileSchema } from "../common/promptSyntax/hookSchema.js";
import { HOOK_SCHEMA_URI } from "../common/promptSyntax/hookSchema.js";
import { IAgentPluginService } from "../common/plugins/agentPluginService.js";
import { agentPluginDiscoveryRegistry } from "../common/plugins/agentPluginService.js";
import { PromptsService } from "../common/promptSyntax/service/promptsServiceImpl.js";
import { ICodeMapperService } from "../common/editing/chatCodeMapperService.js";
import { CodeMapperService } from "../common/editing/chatCodeMapperService.js";
import { LanguageModelToolsExtensionPointHandler } from "../common/tools/languageModelToolsContribution.js";
import { IChatEditingService } from "../common/editing/chatEditingService.js";
import { EditorPaneDescriptor } from "../../../browser/editor.js";
import { ChatEditorInput } from "./widgetHosts/editor/chatEditorInput.js";
import { ChatEditorInputSerializer } from "./widgetHosts/editor/chatEditorInput.js";
import { Extensions as Extensions14 } from "../../../common/configuration.js";
import { IEditorResolverService } from "../../../services/editor/common/editorResolverService.js";
import { mcpAccessConfig } from "../../../../platform/mcp/common/mcpManagement.js";
import { mcpAllowedServersConfig } from "../../../../platform/mcp/common/mcpManagement.js";
import { mcpDeniedServersConfig } from "../../../../platform/mcp/common/mcpManagement.js";
import { mcpGalleryServiceUrlConfig } from "../../../../platform/mcp/common/mcpManagement.js";
import { mcpGalleryServiceEnablementConfig } from "../../../../platform/mcp/common/mcpManagement.js";
import { mcpAutoStartConfig } from "../../../../platform/mcp/common/mcpManagement.js";
import { mcpAppsEnabledConfig } from "../../../../platform/mcp/common/mcpManagement.js";
import { IWorkbenchAssignmentService } from "../../../services/assignment/common/assignmentService.js";
import { IAgentNetworkFilterService } from "../../../../platform/networkFilter/common/networkFilterService.js";
import { AgentNetworkFilterService } from "../../../../platform/networkFilter/common/networkFilterService.js";
import { IViewsService } from "../../../services/views/common/viewsService.js";
import { IChatOutputRendererService } from "./chatOutputItemRenderer.js";
import { ChatOutputRendererService } from "./chatOutputItemRenderer.js";
import { IChatSpeechToTextService } from "./speechToText/chatSpeechToTextService.js";
import { ChatSpeechToTextService } from "./speechToText/chatSpeechToTextService.js";
import { allDiscoverySources } from "../../mcp/common/mcpConfiguration.js";
import { discoverySourceSettingsLabel } from "../../mcp/common/mcpConfiguration.js";
import { mcpDiscoverySection } from "../../mcp/common/mcpConfiguration.js";
import { mcpServerSamplingSection } from "../../mcp/common/mcpConfiguration.js";
import { mcpServerCollisionBehaviorSection } from "../../mcp/common/mcpConfiguration.js";
import { mcpEnterpriseManagedAuthIdpSection } from "../../mcp/common/mcpConfiguration.js";
import { IChatContextPickService } from "./attachments/chatContextPickService.js";
import { ChatContextPickService } from "./attachments/chatContextPickService.js";
import { IChatDebugService } from "../common/chatDebugService.js";
import { IChatModeService } from "../common/chatModes.js";
import { ChatModeService } from "../common/chatModes.js";
import { IChatWidgetHistoryService } from "../common/widget/chatWidgetHistoryService.js";
import { ChatWidgetHistoryService } from "../common/widget/chatWidgetHistoryService.js";
import { ILanguageModelStatsService } from "../common/languageModelStats.js";
import { LanguageModelStatsService } from "../common/languageModelStats.js";
import { ILanguageModelToolsConfirmationService } from "../common/tools/languageModelToolsConfirmationService.js";
import { ModeOpenChatGlobalAction } from "./actions/chatActions.js";
import { registerChatActions } from "./actions/chatActions.js";
import { IAgentHostImportConversationStore } from "./agentSessions/agentHost/agentHostImportConversationStore.js";
import { AgentHostImportConversationStore } from "./agentSessions/agentHost/agentHostImportConversationStore.js";
import { AgentHostAhpJsonlLoggingSettingId } from "../../../../platform/agentHost/common/agentService.js";
import { AgentHostSdkSandboxEnabledSettingId } from "../../../../platform/agentHost/common/agentService.js";
import { ClaudePreferAgentHostAgentsSettingId } from "../../../../platform/agentHost/common/agentService.js";
import { ClaudePreferAgentHostEditorSettingId } from "../../../../platform/agentHost/common/agentService.js";
import { CodexPreferAgentHostEditorSettingId } from "../../../../platform/agentHost/common/agentService.js";
import { IChatArtifactsService } from "../common/tools/chatArtifactsService.js";
import { ChatArtifactsService } from "../common/tools/chatArtifactsService.js";
import { IChatTodoListService } from "../common/tools/chatTodoListService.js";
import { ChatTodoListService } from "../common/tools/chatTodoListService.js";
import { IChatLayoutService } from "../common/widget/chatLayoutService.js";
import { IChatGoalSummaryService } from "./chatGoalSummaryService.js";
import { ChatGoalSummaryService } from "./chatGoalSummaryService.js";
import { IChatBranchService } from "./chatBranchService.js";
import { ChatBranchService } from "./chatBranchService.js";
import { ChatEditingEditorContextKeys } from "./chatEditing/chatEditingEditorContextKeys.js";
import { registerChatExecuteActions } from "./actions/chatExecuteActions.js";
import { CONFIGURE_DICTATION_INSTRUCTIONS_ACTION_ID } from "./actions/configureVoiceInstructionsAction.js";
import { registerConfigureSpeechInstructionsActions } from "./actions/configureVoiceInstructionsAction.js";
import { ChatVoiceInputModeAction } from "./voiceInputMode/voiceInputModeActionViewItem.js";
import { ChatVoiceInputModeToggleListenAction } from "./voiceInputMode/voiceInputModeActionViewItem.js";
import { registerVoiceInputModeSimulateActions } from "./voiceInputMode/voiceInputModeActionViewItem.js";
import { registerChatSpeechToTextActions } from "./actions/chatSpeechToTextActions.js";
import { ChatPasteProvidersFeature } from "./widget/input/editor/chatPasteProviders.js";
import { IChatAttachmentResolveService } from "./attachments/chatAttachmentResolveService.js";
import { ChatAttachmentResolveService } from "./attachments/chatAttachmentResolveService.js";
import { IChatAttachmentWidgetRegistry } from "./attachments/chatAttachmentWidgetRegistry.js";
import { ChatAttachmentWidgetRegistry } from "./attachments/chatAttachmentWidgetRegistry.js";
import { IChatImageCarouselService } from "./chatImageCarouselService.js";
import { ChatImageCarouselService } from "./chatImageCarouselService.js";
import { ChatImplicitContextContribution } from "./attachments/chatImplicitContext.js";
import { IPlanReviewFeedbackService } from "./planReviewFeedback/planReviewFeedbackService.js";
import { PlanReviewFeedbackService } from "./planReviewFeedback/planReviewFeedbackService.js";
import { IChatMarkdownAnchorService } from "./widget/chatContentParts/chatMarkdownAnchorService.js";
import { ChatMarkdownAnchorService } from "./widget/chatContentParts/chatMarkdownAnchorService.js";
import { ChatContextContributions } from "./actions/chatContext.js";
import { UserToolSetsContributions } from "./tools/toolSetsContribution.js";
import { ConfigureToolSets } from "./tools/toolSetsContribution.js";
import { registerChatToolActions } from "./actions/chatToolActions.js";
import { registerChatTitleActions } from "./actions/chatTitleActions.js";
import { IChatResponseFileChangesService } from "./chatResponseFileChangesService.js";
import { ChatResponseFileChangesService } from "./chatResponseFileChangesService.js";
import { registerChatElicitationActions } from "./actions/chatElicitationActions.js";
import { IChatToolRiskAssessmentService } from "./tools/chatToolRiskAssessmentService.js";
import { ChatToolRiskAssessmentService } from "./tools/chatToolRiskAssessmentService.js";
import { IChatResponseResourceFileSystemProvider } from "../common/widget/chatResponseResourceFileSystemProvider.js";
import { ChatResponseResourceFileSystemProvider } from "../common/widget/chatResponseResourceFileSystemProvider.js";
import { ChatResponseResourceWorkbenchContribution } from "../common/widget/chatResponseResourceFileSystemProvider.js";
import { IChatTipService } from "./chatTipService.js";
import { ChatTipService } from "./chatTipService.js";
import { IChatSubmitRequestHandlerService } from "./chatSubmitRequestHandlerService.js";
import { ChatSubmitRequestHandlerService } from "./chatSubmitRequestHandlerService.js";
import { IChatPetService } from "./chatPetService.js";
import { ChatPetService } from "./chatPetService.js";
import { ChatWidget } from "./widget/chatWidget.js";
import { AgentHostCustomTerminalToolEnabledSettingId } from "../../../../platform/agentHost/common/copilotCliConfig.js";
import { AgentHostCopilotSdkLogLevelSettingId } from "../../../../platform/agentHost/common/copilotCliConfig.js";
import { AgentHostOpus48PromptEnabledSettingId } from "../../../../platform/agentHost/common/copilotCliConfig.js";
import { AgentHostToolSearchEnabledSettingId } from "../../../../platform/agentHost/common/copilotCliConfig.js";
import { AgentHostReasoningEffortOverrideSettingId } from "../../../../platform/agentHost/common/copilotCliConfig.js";
import { AgentHostModelCapabilityOverridesSettingId } from "../../../../platform/agentHost/common/copilotCliConfig.js";
import { copilotSdkLogLevelSettingValues } from "../../../../platform/agentHost/common/copilotCliConfig.js";
import { ChatSessionArchiveActionWordingSettingId } from "../../../../platform/chat/common/sessionArchiveActions.js";
import { AssistedTypes } from "../../mcp/browser/mcpCommandsAddConfiguration.js";
import { IChatSideChatService } from "../common/chatSideChatService.js";
import { ChatSideChatService } from "../common/chatSideChatService.js";
import { IChatTransferService } from "../common/model/chatTransferService.js";
import { ChatTransferService } from "../common/model/chatTransferService.js";
import { ChatService } from "../common/chatService/chatServiceImpl.js";
import { ChatPromptFilesExtensionPointHandler } from "../common/promptSyntax/chatPromptFilesContribution.js";
import { PromptLanguageFeaturesProvider } from "./promptSyntax/promptFileContributions.js";
import { ClientToolSetsContribution } from "./tools/clientToolSetsContribution.js";
import { BuiltinToolsContribution } from "../common/tools/builtinTools/tools.js";
import { RenameToolContribution } from "./tools/renameTool.js";
import { UsagesToolContribution } from "./tools/usagesTool.js";
import { IVoiceChatService } from "../common/voiceChatService.js";
import { VoiceChatService } from "../common/voiceChatService.js";
import { ChatResponseAccessibleView } from "./accessibility/chatResponseAccessibleView.js";
import { registerChatAccessibilityActions } from "./actions/chatAccessibilityActions.js";
import { PanelChatAccessibilityHelp } from "./actions/chatAccessibilityHelp.js";
import { QuickChatAccessibilityHelp } from "./actions/chatAccessibilityHelp.js";
import { EditsChatAccessibilityHelp } from "./actions/chatAccessibilityHelp.js";
import { AgentChatAccessibilityHelp } from "./actions/chatAccessibilityHelp.js";
import { ChatCopyActionRendering } from "./actions/chatCopyActions.js";
import { registerChatCopyActions } from "./actions/chatCopyActions.js";
import { CodeBlockActionRendering } from "./actions/chatCodeblockActions.js";
import { registerChatCodeBlockActions } from "./actions/chatCodeblockActions.js";
import { registerChatCodeCompareBlockActions } from "./actions/chatCodeblockActions.js";
import { registerQuickChatActions } from "./actions/chatQuickInputActions.js";
import { registerChatContextActions } from "./actions/chatContextActions.js";
import { registerChatBranchActions } from "./actions/chatBranchActions.js";
import { registerChatDeveloperActions } from "./actions/chatDeveloperActions.js";
import { registerChatFileTreeActions } from "./actions/chatFileTreeActions.js";
import { ChatGettingStartedContribution } from "./actions/chatGettingStarted.js";
import { registerChatExportActions } from "./actions/chatImportExport.js";
import { registerLanguageModelActions } from "./actions/chatLanguageModelActions.js";
import { IAgentPluginRepositoryService } from "../common/plugins/agentPluginRepositoryService.js";
import { IPluginInstallService } from "../common/plugins/pluginInstallService.js";
import { IWorkspacePluginSettingsService } from "../common/plugins/workspacePluginSettingsService.js";
import { WorkspacePluginSettingsService } from "../common/plugins/workspacePluginSettingsService.js";
import { IPluginMarketplaceService } from "../common/plugins/pluginMarketplaceService.js";
import { PluginMarketplaceService } from "../common/plugins/pluginMarketplaceService.js";
import { registerChatPluginActions } from "./actions/chatPluginActions.js";
import { ChatEditor } from "./widgetHosts/editor/chatEditor.js";
import { registerMoveActions } from "./actions/chatMoveActions.js";
import { registerNewChatActions } from "./actions/chatNewActions.js";
import { registerChatPromptNavigationActions } from "./actions/chatPromptNavigationActions.js";
import { registerChatQueueActions } from "./actions/chatQueueActions.js";
import { ChatAgentRecommendation } from "./actions/chatAgentRecommendationActions.js";
import { ChatTransferContribution } from "./actions/chatTransfer.js";
import { ChatDebugEditorInput } from "./chatDebug/chatDebugEditorInput.js";
import { ChatDebugEditorInputSerializer } from "./chatDebug/chatDebugEditorInput.js";
import { registerChatOpenAgentDebugPanelAction } from "./actions/chatOpenAgentDebugPanelAction.js";
import { ChatDebugServiceImpl } from "../common/chatDebugServiceImpl.js";
import { ChatDebugEditor } from "./chatDebug/chatDebugEditor.js";
import { PromptsDebugContribution } from "./promptsDebugContribution.js";
import { AgentHostChatDebugContribution } from "./chatDebug/agentHostChatDebugProvider.js";
import { ChatAccessibilityService } from "./accessibility/chatAccessibilityService.js";
import { ChatReferenceAttachmentWidgetContribution } from "./attachments/chatReferenceAttachmentWidget.contribution.js";
import { ChatInputBoxContentProvider } from "./widget/input/editor/chatEditorInputContentProvider.js";
import { ChatEditingEditorAccessibility } from "./chatEditing/chatEditingEditorAccessibility.js";
import { registerChatEditorActions } from "./chatEditing/chatEditingEditorActions.js";
import { ChatEditingEditorOverlay } from "./chatEditing/chatEditingEditorOverlay.js";
import { ChatEditingNotebookFileSystemProviderContrib } from "./chatEditing/notebook/chatEditingNotebookFileSystemProvider.js";
import { ChatEditingService } from "./chatEditing/chatEditingServiceImpl.js";
import { ChatOutlineCreator } from "./chatOutlineCreator.js";
import { ChatLayoutService } from "./widget/chatLayoutService.js";
import { LanguageModelsConfigurationService } from "./languageModelsConfigurationService.js";
import { ChatLanguageModelsDataContribution } from "./languageModelsConfigurationService.js";
import { ChatExtensionPointHandler } from "./chatParticipant.contribution.js";
import { ChatCompatibilityNotifier } from "./chatParticipant.contribution.js";
import { QuickChatService } from "./widgetHosts/chatQuick.js";
import { ChatTerminalOutputAccessibleView } from "./accessibility/chatTerminalOutputAccessibleView.js";
import { ChatSetupContribution } from "./chatSetup/chatSetupContributions.js";
import { ChatTeardownContribution } from "./chatSetup/chatSetupContributions.js";
import { ChatQuotaNotificationContribution } from "./chatQuotaNotification.js";
import { ChatPromoNotificationContribution } from "./chatPromoNotification.js";
import { HasByokModelsContribution } from "./hasByokModelsContribution.js";
import { ChatStatusBarEntry } from "./chatStatus/chatStatusEntry.js";
import { ChatCodeBlockContextProviderService } from "./codeBlockContextProviderService.js";
import { LanguageModelToolsConfirmationService } from "./tools/languageModelToolsConfirmationService.js";
import { IToolResultCompressor } from "../common/tools/toolResultCompressor.js";
import { globalAutoApproveDescription } from "./tools/languageModelToolsService.js";
import { LanguageModelToolsService } from "./tools/languageModelToolsService.js";
import { ToolResultCompressorService } from "./tools/toolResultCompressorService.js";
import { AgentPluginService } from "../common/plugins/agentPluginServiceImpl.js";
import { ConfiguredAgentPluginDiscovery } from "../common/plugins/agentPluginServiceImpl.js";
import { MarketplaceAgentPluginDiscovery } from "../common/plugins/agentPluginServiceImpl.js";
import { CopilotCliAgentPluginDiscovery } from "../common/plugins/agentPluginServiceImpl.js";
import { ExtensionAgentPluginDiscovery } from "../common/plugins/agentPluginServiceImpl.js";
import { AgentPluginRecommendations } from "./claudePluginRecommendations.js";
import { AgentPluginEditor } from "./agentPluginEditor/agentPluginEditor.js";
import { AgentPluginEditorInput } from "./agentPluginEditor/agentPluginEditorInput.js";
import { IPluginGitService } from "../common/plugins/pluginGitService.js";
import { AgentPluginRepositoryService } from "./agentPluginRepositoryService.js";
import { BrowserPluginGitCommandService } from "./pluginGitCommandService.js";
import { PluginInstallService } from "./pluginInstallService.js";
import { PluginAutoUpdate } from "./pluginAutoUpdate.js";
import { ChatSlashCommandsContribution } from "./chatSlashCommands.js";
import { ChatSessionOptionSlashCommandsContribution } from "./chatSlashCommands.js";
import { registerPlanReviewFeedbackEditorActions } from "./planReviewFeedback/planReviewFeedbackEditorActions.js";
import { PluginUrlHandler } from "./pluginUrlHandler.js";
import { PromptUrlHandler } from "./promptSyntax/promptUrlHandler.js";
import { ChatViewsWelcomeHandler } from "./viewsWelcome/chatViewsWelcomeHandler.js";
import { ChatWidgetService } from "./widget/chatWidgetService.js";
import { ChatWindowNotifier } from "./chatWindowNotifier.js";
import { ChatRepoInfoContribution } from "./chatRepoInfo.js";
import { ChatQueuePickerRendering } from "./widget/input/chatQueuePickerActionItem.js";
import { ExploreAgentDefaultModel } from "./exploreAgentDefaultModel.js";
import { PlanAgentDefaultModel } from "./planAgentDefaultModel.js";
import { UtilityModelContribution } from "./utilityModelContribution.js";
import { UtilitySmallModelContribution } from "./utilityModelContribution.js";
// src/vs/workbench/contrib/chat/browser/chat.shared.contribution.ts
CommandsRegistry.registerCommand("_chat.notifyQuestionCarouselAnswer", (accessor, resolveId, answers) => {
  accessor.get(IChatService).notifyQuestionCarouselAnswer("", resolveId, answers);
});
var toolReferenceNameEnumValues = [];
var toolReferenceNameEnumDescriptions = [];
var jsonContributionRegistry2 = Registry.as(Extensions3.JSONContribution);
jsonContributionRegistry2.registerSchema(HOOK_SCHEMA_URI, hookFileSchema);
var configurationRegistry14 = Registry.as(Extensions4.Configuration);
configurationRegistry14.registerConfiguration({
  id: "chatSidebar",
  title: localize("recovered.9347", "Chat"),
  type: "object",
  properties: {
    "chat.experimentalSessionsWindowOverride": {
      type: "boolean",
      description: localize("recovered.9180", "When true, enables sessions-window-specific behavior for extensions."),
      default: false,
      tags: ["experimental"],
      agentsWindow: {
        default: true
      }
    },
    "chat.fontSize": {
      type: "number",
      description: localize("recovered.9185", "Controls the font size in pixels in chat messages."),
      default: 13,
      minimum: 6,
      maximum: 100
    },
    "chat.fontFamily": {
      type: "string",
      description: localize("recovered.9184", "Controls the font family in chat messages."),
      default: "default"
    },
    "dictation.enabled": {
      type: "boolean",
      markdownDescription: localize("recovered.9333", "Enables dictation across the product (chat input, editor, and terminal). When enabled on a supported platform, a microphone button appears in the chat input and the dictation shortcut becomes available; the on-device transcription model is downloaded on first use and runs locally."),
      default: true,
      tags: ["experimental"],
      policy: {
        name: "DictationEnabled",
        category: "InteractiveSession" /* InteractiveSession */,
        minimumVersion: "1.131",
        localization: {
          description: {
            key: "dictation.enabled.policy",
            value: localize("recovered.9334", "Controls whether dictation is available across the product (chat input, editor, and terminal).")
          }
        }
      }
    },
    "dictation.model": {
      type: "string",
      enum: ["nemotron-speech-streaming-en-0.6b", "mai"],
      enumItemLabels: [localize("recovered.9340", "Nemotron Streaming (English) \u2014 On-Device"), localize("recovered.9338", "MAI \u2014 Cloud")],
      markdownEnumDescriptions: [localize("recovered.9339", "NVIDIA Nemotron streaming RNN-T (English), run on-device through Microsoft Foundry Local. Works offline; no audio leaves the device. Downloaded on first use and cached on disk."), localize("recovered.9337", "Cloud transcription through the same Microsoft AI voice service used by Voice Mode. Requires a network connection and GitHub sign-in; audio is streamed to the service.")],
      markdownDescription: localize("recovered.9336", "The model used for dictation. On-device models download on first use and run locally through Microsoft Foundry Local; the cloud option streams audio to the Microsoft AI voice service."),
      default: "nemotron-speech-streaming-en-0.6b",
      tags: ["experimental"]
    },
    ["dictation.showTranscript" /* ShowTranscript */]: {
      type: "boolean",
      markdownDescription: localize("recovered.9341", "Controls whether the transcript is shown while dictating. The final transcript is inserted when dictation ends."),
      default: true,
      tags: ["experimental"]
    },
    "dictation.experimental.llmCleanup": {
      type: "boolean",
      markdownDescription: localize("recovered.9335", "Experimental: periodically refine finalized text while dictating, then pass the final transcript through a small language model to restore punctuation, capitalization, paragraphs, and lists. Requires Copilot to be enabled; the transcript is sent to the language model for cleanup. Falls back to the raw transcript when no model is available. Use [dictation instructions](command:{0}) to customize terminology and formatting.", CONFIGURE_DICTATION_INSTRUCTIONS_ACTION_ID),
      default: true,
      tags: ["experimental"]
    },
    "chat.editor.fontSize": {
      type: "number",
      description: localize("recovered.9343", "Controls the font size in pixels in chat codeblocks."),
      default: isMacintosh ? 12 : 14
    },
    "chat.editor.fontFamily": {
      type: "string",
      description: localize("recovered.9342", "Controls the font family in chat codeblocks."),
      default: "default"
    },
    "chat.editor.fontWeight": {
      type: "string",
      description: localize("recovered.9344", "Controls the font weight in chat codeblocks."),
      default: "default"
    },
    "chat.editor.wordWrap": {
      type: "string",
      description: localize("recovered.9346", "Controls whether lines should wrap in chat codeblocks."),
      default: "off",
      enum: ["on", "off"]
    },
    "chat.editor.lineHeight": {
      type: "number",
      description: localize("recovered.9345", "Controls the line height in pixels in chat codeblocks. Use 0 to compute the line height from the font size."),
      default: 0
    },
    ["chat.agentsControl.enabled" /* AgentStatusEnabled */]: {
      type: "string",
      enum: ["hidden", "badge", "compact"],
      enumDescriptions: [localize("recovered.9098", "The agent status indicator is hidden from the title bar."), localize("recovered.9095", "Shows the agent status as a badge next to the command center."), localize("recovered.9096", "Replaces the command center search box with a compact agent status indicator and unified chat widget.")],
      markdownDescription: localize("recovered.9097", "Controls how the 'Agent Status' indicator appears in the title bar command center. When set to `hidden`, the indicator is not shown. Other values show the indicator and automatically enable {0}. The unread and in-progress session indicators require {1} to be enabled.", "`#window.commandCenter#`", "`#chat.viewSessions.enabled#`"),
      default: "compact",
      tags: ["experimental"]
    },
    ["chat.unifiedAgentsBar.enabled" /* UnifiedAgentsBar */]: {
      type: "boolean",
      markdownDescription: localize("recovered.9301", "Replaces the command center search box with a unified chat and search widget."),
      default: false,
      tags: ["experimental"]
    },
    ["chat.agentSessionProjection.enabled" /* AgentSessionProjectionEnabled */]: {
      type: "boolean",
      markdownDescription: localize("recovered.9099", "Controls whether Agent Session Projection mode is enabled for reviewing agent sessions in a focused workspace."),
      default: false,
      tags: ["experimental"]
    },
    "chat.implicitContext.enabled": {
      type: "object",
      description: localize("recovered.9190", "Enables automatically using the active editor as chat context for specified chat locations."),
      additionalProperties: {
        type: "string",
        enum: ["never", "first", "always"],
        description: localize("recovered.9193", "The value for the implicit context."),
        enumDescriptions: [localize("recovered.9196", "Implicit context is never enabled."), localize("recovered.9195", "Implicit context is enabled for the first interaction."), localize("recovered.9194", "Implicit context is always enabled.")]
      },
      default: {
        "panel": "always"
      },
      tags: ["experimental"],
      experiment: {
        mode: "startup"
      },
      agentsWindow: {
        default: {
          "panel": "never"
        }
      }
    },
    "chat.implicitContext.suggestedContext": {
      type: "boolean",
      markdownDescription: localize("recovered.9192", "Controls whether the new implicit context flow is shown. In Ask and Edit modes, the context will automatically be included. When using an agent, context will be suggested as an attachment. Selections are always included as context."),
      default: true,
      agentsWindow: {
        default: false
      }
    },
    "chat.implicitContext.includeActiveEditor": {
      type: "boolean",
      markdownDescription: localize("recovered.9191", "When enabled, the active editor is automatically forwarded as context, even when it would otherwise only be suggested. Selections and explicitly attached files are always included regardless of this setting.\n\nNote: this setting currently only applies to Agent Host sessions (such as the Copilot CLI)."),
      default: true,
      tags: ["experimental"],
      agentsWindow: {
        default: false
      }
    },
    "chat.editing.autoAcceptDelay": {
      type: "number",
      markdownDescription: localize("recovered.9149", "Delay after which changes made by chat are automatically accepted. Values are in seconds, `0` means disabled and `100` seconds is the maximum."),
      default: 0,
      minimum: 0,
      maximum: 100
    },
    "chat.editing.confirmEditRequestRemoval": {
      type: "boolean",
      scope: 1 /* APPLICATION */,
      markdownDescription: localize("recovered.9150", "Whether to show a confirmation before removing a request and its associated edits."),
      default: true
    },
    "chat.editing.confirmEditRequestRetry": {
      type: "boolean",
      scope: 1 /* APPLICATION */,
      markdownDescription: localize("recovered.9151", "Whether to show a confirmation before retrying a request and its associated edits."),
      default: true
    },
    "chat.editing.explainChanges.enabled": {
      type: "boolean",
      markdownDescription: localize("recovered.9152", "Controls whether the Explain button in the Chat panel and the Explain Changes context menu in the SCM view are shown. This is an experimental feature."),
      default: false,
      tags: ["experimental"],
      experiment: {
        mode: "auto"
      }
    },
    ["chat.editing.revealNextChangeOnResolve" /* RevealNextChangeOnResolve */]: {
      type: "boolean",
      markdownDescription: localize("recovered.9154", "Controls whether the editor automatically reveals the next change after keeping or undoing a chat edit."),
      default: true
    },
    ["chat.editing.openChangedFileInDiffEditor" /* OpenChangedFileInDiffEditor */]: {
      type: "boolean",
      markdownDescription: localize("recovered.9153", "Controls whether selecting a file in the changed files list of a chat response opens it in a diff editor showing the changes made by chat, or in a regular editor. Holding `kbstyle(Alt)` while selecting the file opens it with the opposite behavior."),
      default: true
    },
    "chat.tips.enabled": {
      type: "boolean",
      scope: 1 /* APPLICATION */,
      description: localize("recovered.9281", "Controls whether tips are shown above user messages in chat. New tips are added frequently, so this is a helpful way to stay up to date with the latest features."),
      default: true
    },
    "chat.upvoteAnimation": {
      type: "string",
      enum: ["off", "confetti", "floatingThumbs", "pulseWave", "radiantLines"],
      enumDescriptions: [localize("recovered.9305", "No animation is shown."), localize("recovered.9303", "Shows a confetti burst animation around the thumbs up button."), localize("recovered.9304", "Shows floating thumbs up icons rising from the button."), localize("recovered.9306", "Shows expanding pulse rings from the button."), localize("recovered.9307", "Shows radiant lines emanating from the button.")],
      description: localize("recovered.9302", "Controls whether an animation is shown when clicking the thumbs up button on a chat response."),
      default: "floatingThumbs"
    },
    "chat.experimental.detectParticipant.enabled": {
      type: "boolean",
      deprecationMessage: localize("recovered.9162", "This setting is deprecated. Please use `chat.detectParticipant.enabled` instead."),
      description: localize("recovered.9161", "Enables chat participant autodetection for panel chat."),
      default: null
    },
    ["chat.experimental.incrementalRendering.enabled" /* IncrementalRendering */]: {
      type: "boolean",
      description: localize("recovered.9175", "Enables incremental rendering with optional block-level animation when streaming chat responses."),
      default: false,
      tags: ["experimental"]
    },
    ["chat.experimental.incrementalRendering.animationStyle" /* IncrementalRenderingStyle */]: {
      type: "string",
      enum: ["none", "fade", "rise", "blur", "scale", "slide", "reveal"],
      enumDescriptions: [localize("recovered.9166", "No animation. Content appears instantly."), localize("recovered.9165", "Simple opacity fade from 0 to 1."), localize("recovered.9168", "Content fades in while rising upward."), localize("recovered.9164", "Content fades in from a blurred state."), localize("recovered.9169", "Content scales up from slightly smaller."), localize("recovered.9170", "Content slides in from the left."), localize("recovered.9167", "Content reveals top-to-bottom with a soft gradient edge.")],
      description: localize("recovered.9163", "Controls the animation style for incremental rendering."),
      default: "fade",
      tags: ["experimental"]
    },
    ["chat.experimental.incrementalRendering.buffering" /* IncrementalRenderingBuffering */]: {
      type: "string",
      enum: ["off", "word", "paragraph"],
      enumDescriptions: [localize("recovered.9172", "Renders content immediately as tokens arrive."), localize("recovered.9174", "Reveals content word by word."), localize("recovered.9173", "Buffers content until a paragraph break before rendering.")],
      description: localize("recovered.9171", "Controls how content is buffered before rendering during incremental rendering. Lower buffering levels render faster but may show incomplete sentences or partially formed markdown."),
      default: "word",
      tags: ["experimental"]
    },
    ["chat.agent.collapseCompletedResponses" /* CollapseCompletedResponses */]: {
      type: "boolean",
      description: localize("recovered.9057", "Controls whether completed chat responses collapse intermediate work while keeping the final response visible."),
      default: product_default.quality !== "stable"
    },
    "chat.detectParticipant.enabled": {
      type: "boolean",
      description: localize("recovered.9147", "Enables chat participant autodetection for panel chat."),
      default: true
    },
    ["chat.inlineReferences.style" /* InlineReferencesStyle */]: {
      type: "string",
      enum: ["box", "link"],
      enumDescriptions: [localize("recovered.9202", "Display file and symbol references as boxed widgets with icons."), localize("recovered.9203", "Display file and symbol references as simple blue links without icons.")],
      description: localize("recovered.9201", "Controls how file and symbol references are displayed in chat messages."),
      default: "box"
    },
    ["chat.editorAssociations" /* EditorAssociations */]: {
      type: "object",
      markdownDescription: localize("recovered.9157", "Configure [glob patterns](https://aka.ms/vscode-glob-patterns) to editors for opening files from chat (for example `\"*.md\": \"vscode.markdown.preview.editor\"`)."),
      additionalProperties: {
        type: "string"
      },
      default: {}
    },
    ["chat.notifyWindowOnConfirmation" /* NotifyWindowOnConfirmation */]: {
      type: "string",
      enum: ["off", "windowNotFocused", "always"],
      enumDescriptions: [localize("recovered.9242", "Never show OS notifications for confirmations."), localize("recovered.9243", "Show OS notifications for confirmations when the window is not focused."), localize("recovered.9241", "Always show OS notifications for confirmations, even when the window is focused.")],
      description: localize("recovered.9240", "Controls whether a chat session should present the user with an OS notification when a confirmation or question needs input. This includes a window badge as well as notification toast."),
      default: "windowNotFocused"
    },
    ["chat.autoReply" /* AutoReply */]: {
      default: false,
      markdownDescription: localize("recovered.9122", "Automatically skip question carousels by telling the agent that the user is not available and to use its best judgment. This is an advanced setting and can lead to unintended choices or actions based on incomplete context."),
      type: "boolean",
      scope: 3 /* APPLICATION_MACHINE */,
      tags: ["experimental", "advanced"]
    },
    ["chat.autopilot.advanced.enabled" /* AutopilotAdvancedEnabled */]: {
      type: "boolean",
      markdownDescription: localize("recovered.9121", "Enables **Advanced Autopilot**, a single switch that turns on all advanced Autopilot behaviors that delegate more of the loop to the agent. Currently, after each Autopilot turn a small, fast model evaluates whether your original request is complete; if not, Autopilot keeps working using that evaluation as guidance for the next turn, instead of relying on the agent to signal completion itself."),
      default: false,
      tags: ["experimental"]
    },
    ["chat.planReview.inlineEditor.enabled" /* PlanReviewInlineEditorEnabled */]: {
      type: "boolean",
      markdownDescription: localize("recovered.9256", "When enabled, the plan review widget mounts an editor inline, as opposed to in a separate editor tab."),
      default: true
    },
    ["chat.permissions.default" /* DefaultPermissionLevel */]: {
      type: "string",
      enum: ["default" /* Default */, "autoApprove" /* AutoApprove */, "autopilot" /* Autopilot */],
      enumItemLabels: [localize("recovered.9253", "Default Approvals"), localize("recovered.9249", "Bypass Approvals"), localize("recovered.9251", "Autopilot (Preview)")],
      enumDescriptions: [localize("recovered.9252", "Start new chat sessions with Default Approvals."), localize("recovered.9248", "Start new chat sessions in Bypass Approvals mode."), localize("recovered.9250", "Start new chat sessions in Autopilot mode.")],
      description: localize("recovered.9254", "Controls the default permissions picker mode for new local chat sessions. You can still change the permission mode per session, and each session remembers the permission mode that was used. If enterprise policy disables auto approval, new sessions use Default Approvals."),
      default: "default" /* Default */
    },
    ["chat.assistedPermissions.enabled" /* AssistedPermissionsEnabled */]: {
      type: "boolean",
      default: product_default.quality !== "stable",
      description: localize("recovered.9120", "Controls whether Assisted permissions is shown in Agent Host approval pickers."),
      tags: ["experimental"],
      experiment: {
        mode: "auto"
      }
    },
    ["chat.experimental.permissionsSandboxToggle.enabled" /* PermissionsSandboxToggleEnabled */]: {
      type: "boolean",
      default: false,
      markdownDescription: localize("recovered.9176", "Controls whether the permissions picker shows an inline \"Sandboxing for terminal\" toggle on the Default Approvals option. The toggle reflects and updates `#chat.agent.sandbox.enabled#`."),
      tags: ["experimental"],
      experiment: {
        mode: "auto"
      }
    },
    ["chat.defaultConfiguration" /* DefaultConfiguration */]: {
      type: "object",
      additionalProperties: false,
      properties: {
        mode: {
          type: "string",
          enum: ["interactive", "plan", "autopilot"],
          enumDescriptions: [localize("recovered.9142", "Interactive \u2014 step-by-step collaboration."), localize("recovered.9143", "Plan \u2014 plan first, execute when ready."), localize("recovered.9140", "Autopilot \u2014 autonomously iterate from start to finish.")],
          default: "interactive",
          description: localize("recovered.9141", "The starting mode for new agent sessions.")
        },
        approvals: {
          type: "string",
          enum: ["default" /* Default */, "assisted" /* Assisted */, "allowAll" /* AllowAll */],
          enumDescriptions: [localize("recovered.9138", "Ask When Needed \u2014 asks when approval settings don't apply."), localize("recovered.9137", "Assisted permissions \u2014 evaluates risk before running tools."), localize("recovered.9136", "Allow All \u2014 runs tool calls without asking.")],
          default: "default" /* Default */,
          description: localize("recovered.9139", "The starting approval behavior for new agent sessions. If enterprise policy disables auto approval, new sessions use Ask When Needed.")
        }
      },
      default: {
        mode: "interactive",
        approvals: "default" /* Default */
      },
      markdownDescription: localize("recovered.9144", "Controls the default configuration for new agent sessions (such as Copilot CLI). You can still change the mode and approval behavior per session, and each session remembers what was used.")
    },
    ["chat.defaultModel" /* DefaultModel */]: {
      type: "string",
      default: "",
      markdownDescription: localize("recovered.9145", "The default model for new chat conversations. Use \"auto\" to let Copilot pick a model, a model family name (such as \"opus\" or \"gemini\") to use the latest available model in that family, or a full model id. You can still switch the model within a conversation; each new conversation starts at this model."),
      experiment: {
        mode: "auto"
      },
      policy: {
        name: "ChatDefaultModel",
        category: "InteractiveSession" /* InteractiveSession */,
        minimumVersion: "1.127",
        value: managedModelValue(),
        managedSettings: {
          [COPILOT_MODEL_KEY]: {
            type: "string"
          }
        },
        localization: {
          description: {
            key: "chat.defaultModel.policy",
            value: localize("recovered.9146", "Sets the default chat model for new conversations. Accepts \"auto\", a model family name (such as \"opus\" or \"gemini\"), or a full model id. Users can still switch the model within a conversation.")
          }
        }
      }
    },
    ["chat.tools.global.autoApprove" /* GlobalAutoApprove */]: {
      default: false,
      markdownDescription: globalAutoApproveDescription.value,
      type: "boolean",
      scope: 3 /* APPLICATION_MACHINE */,
      tags: ["experimental"],
      policy: {
        name: "ChatToolsAutoApprove",
        category: "InteractiveSession" /* InteractiveSession */,
        minimumVersion: "1.99",
        value: policyData => policyData.managedSettings?.[COPILOT_DISABLE_BYPASS_PERMISSIONS_MODE_KEY] === "disable" || policyData.chat_preview_features_enabled === false ? false : void 0,
        managedSettings: {
          [COPILOT_DISABLE_BYPASS_PERMISSIONS_MODE_KEY]: {
            type: "string"
          }
        },
        localization: {
          description: {
            key: "autoApprove3.description",
            value: localize("recovered.9054", "Global auto approve also known as \"YOLO mode\" disables manual approval completely for all tools in all workspaces, allowing the agent to act fully autonomously. This is extremely dangerous and is *never* recommended, even containerized environments like Codespaces and Dev Containers have user keys forwarded into the container that could be compromised.\n\nThis feature disables critical security protections and makes it much easier for an attacker to compromise the machine.\n\nNote: This setting only controls tool approval and does not prevent the agent from asking questions. To automatically answer agent questions, use the `#chat.autoReply#` setting.")
          }
        }
      }
    },
    ["chat.sessionSync.enabled" /* SessionSyncEnabled */]: {
      default: false,
      markdownDescription: localize("recovered.9276", "Enable session sync to GitHub.com. When enabled, Copilot session data is synced to your GitHub account for cross-device access and richer insights. Requires `#github.copilot.chat.localIndex.enabled#` to also be enabled."),
      type: "boolean",
      tags: ["experimental"],
      experiment: {
        mode: "auto"
      },
      policy: {
        name: "CopilotSessionSync",
        category: "InteractiveSession" /* InteractiveSession */,
        minimumVersion: "1.121",
        value: policyData => policyData.cloud_session_storage_enabled === false ? false : void 0,
        localization: {
          description: {
            key: "chat.sessionSync.enabled.policy",
            value: localize("recovered.9277", "Enable session sync to GitHub.com for cross-device Copilot session history. When disabled by organization policy, session data is kept local only.")
          }
        }
      }
    },
    ["chat.sessionSync.excludeRepositories" /* SessionSyncExcludeRepositories */]: {
      type: "array",
      items: {
        type: "string"
      },
      default: [],
      markdownDescription: localize("recovered.9278", "Repository patterns to exclude from session sync. Use exact `owner/repo` names or glob patterns like `my-org/*`. Sessions from matching repositories will only be stored locally."),
      tags: ["experimental", "advanced"]
    },
    ["chat.tools.edits.autoApprove" /* AutoApproveEdits */]: {
      default: {
        "**/*": true,
        "**/.vscode/*.json": false,
        "**/.git/**": false,
        "**/{package.json,server.xml,build.rs,web.config,.gitattributes,.env,Cargo.toml}": false,
        "**/*.{code-workspace,csproj,fsproj,vbproj,vcxproj,proj,targets,props,gradle,gradle.kts}": false,
        "**/gradle.properties": false,
        "**/ruby_lsp/*/addon": false,
        // Auto-included Ruby addons
        "**/*.lock": false,
        // yarn.lock, bun.lock, etc.
        "**/*-lock.{yaml,json}": false
        // pnpm-lock.yaml, package-lock.json
      },
      markdownDescription: localize("recovered.9285", "Controls whether edits made by the agent are automatically approved. The default is to approve all edits except those made to certain files which have the potential to cause immediate unintended side-effects, such as `**/.vscode/*.json`.\n\nSet to `true` to automatically approve edits to matching files, `false` to always require explicit approval. The last pattern matching a given file will determine whether the edit is automatically approved."),
      type: "object",
      additionalProperties: {
        type: "boolean"
      }
    },
    ["chat.tools.urls.autoApprove" /* AutoApprovedUrls */]: {
      default: {
        "https://code.visualstudio.com": true,
        "https://github.com/microsoft/vscode/wiki/*": true
      },
      markdownDescription: localize("recovered.9290", "Controls which URLs are automatically approved when requested by chat tools. Keys are URL patterns and values can be `true` to approve both requests and responses, `false` to deny, or an object with `approveRequest` and `approveResponse` properties for granular control.\n\nExamples:\n- `\"https://example.com\": true` - Approve all requests to example.com\n- `\"https://*.example.com\": true` - Approve all requests to any subdomain of example.com\n- `\"https://example.com/api/*\": { \"approveRequest\": true, \"approveResponse\": false }` - Approve requests but not responses for example.com/api paths"),
      type: "object",
      additionalProperties: {
        oneOf: [{
          type: "boolean"
        }, {
          type: "object",
          properties: {
            approveRequest: {
              type: "boolean"
            },
            approveResponse: {
              type: "boolean"
            }
          }
        }]
      }
    },
    ["chat.tools.eligibleForAutoApproval" /* EligibleForAutoApproval */]: {
      default: {},
      markdownDescription: localize("recovered.9289", "Controls which tools are eligible for automatic approval. Tools set to 'false' will always present a confirmation and will never offer the option to auto-approve. The default behavior (or setting a tool to 'true') may result in the tool offering auto-approval options."),
      type: "object",
      propertyNames: {
        enum: toolReferenceNameEnumValues,
        enumDescriptions: toolReferenceNameEnumDescriptions
      },
      additionalProperties: {
        type: "boolean"
      },
      examples: [{
        "fetch": false,
        "runTask": false
      }],
      policy: {
        name: "ChatToolsEligibleForAutoApproval",
        category: "InteractiveSession" /* InteractiveSession */,
        minimumVersion: "1.107",
        localization: {
          description: {
            key: "chat.tools.eligibleForAutoApproval",
            value: localize("recovered.9289", "Controls which tools are eligible for automatic approval. Tools set to 'false' will always present a confirmation and will never offer the option to auto-approve. The default behavior (or setting a tool to 'true') may result in the tool offering auto-approval options.")
          }
        }
      }
    },
    ["chat.artifacts.enabled" /* ArtifactsEnabled */]: {
      default: false,
      description: localize("recovered.9110", "Controls whether the artifacts view is available in chat."),
      type: "boolean",
      tags: ["experimental"]
    },
    ["chat.artifacts.rules.byMimeType" /* ArtifactsRulesByMimeType */]: {
      default: {
        "image/*": {
          groupName: "Screenshots",
          onlyShowGroup: true
        }
      },
      description: localize("recovered.9117", "Rules for extracting artifacts from tool results by MIME type. Maps MIME type patterns (e.g. 'image/*') to group configuration."),
      type: "object",
      additionalProperties: {
        type: "object",
        properties: {
          groupName: {
            type: "string",
            description: localize("recovered.9118", "Display name for the artifact group.")
          },
          onlyShowGroup: {
            type: "boolean",
            description: localize("recovered.9119", "When true, show only the group header instead of individual items.")
          }
        },
        required: ["groupName"]
      },
      tags: ["experimental"]
    },
    ["chat.artifacts.rules.byFilePath" /* ArtifactsRulesByFilePath */]: {
      default: {
        "**/*plan*.md": {
          groupName: "Plans"
        }
      },
      description: localize("recovered.9111", "Rules for extracting artifacts from written files by file path pattern. Maps glob patterns to group configuration."),
      type: "object",
      additionalProperties: {
        type: "object",
        properties: {
          groupName: {
            type: "string",
            description: localize("recovered.9112", "Display name for the artifact group.")
          },
          onlyShowGroup: {
            type: "boolean",
            description: localize("recovered.9113", "When true, show only the group header instead of individual items.")
          }
        },
        required: ["groupName"]
      },
      tags: ["experimental"]
    },
    ["chat.artifacts.rules.byMemoryFilePath" /* ArtifactsRulesByMemoryFilePath */]: {
      default: {
        "**/*plan*.md": {
          groupName: "Plans"
        }
      },
      description: localize("recovered.9114", "Rules for extracting artifacts from memory tool calls by memory file path pattern. Maps glob patterns to group configuration."),
      type: "object",
      additionalProperties: {
        type: "object",
        properties: {
          groupName: {
            type: "string",
            description: localize("recovered.9115", "Display name for the artifact group.")
          },
          onlyShowGroup: {
            type: "boolean",
            description: localize("recovered.9116", "When true, show only the group header instead of individual items.")
          }
        },
        required: ["groupName"]
      },
      tags: ["experimental"]
    },
    "chat.undoRequests.restoreInput": {
      default: true,
      markdownDescription: localize("recovered.9300", "Controls whether the input of the chat should be restored when an undo request is made. The input will be filled with the text of the request that was restored."),
      type: "boolean"
    },
    "chat.editRequests": {
      markdownDescription: localize("recovered.9158", "Enables editing of requests in the chat. This allows you to change the request content and resubmit it to the model."),
      type: "string",
      enum: ["inline", "hover", "input", "none"],
      default: "inline"
    },
    ["chat.viewSessions.enabled" /* ChatViewSessionsEnabled */]: {
      type: "boolean",
      default: true,
      description: localize("recovered.9328", "Show chat agent sessions when chat is empty or to the side when chat view is wide enough."),
      agentsWindow: {
        default: false
      }
    },
    ["chat.viewSessions.orientation" /* ChatViewSessionsOrientation */]: {
      type: "string",
      enum: ["stacked", "sideBySide"],
      enumDescriptions: [localize("recovered.9331", "Display chat sessions vertically stacked above the chat input unless a chat session is visible."), localize("recovered.9330", "Display chat sessions side by side if space is sufficient, otherwise fallback to stacked above the chat input unless a chat session is visible.")],
      default: "sideBySide",
      description: localize("recovered.9329", "Controls the orientation of the chat agent sessions view when it is shown alongside the chat.")
    },
    ["chat.viewProgressBadge.enabled" /* ChatViewProgressBadgeEnabled */]: {
      type: "boolean",
      default: false,
      description: localize("recovered.9327", "Show a progress badge on the chat view when an agent session is in progress that is opened in that view.")
    },
    [ChatSessionArchiveActionWordingSettingId]: {
      type: "string",
      enum: ["archive", "done"],
      enumDescriptions: [localize("recovered.9178", "Use Archive, Archive All, Unarchive, and Unarchive All."), localize("recovered.9179", "Use Mark as Done, Mark All as Done, Restore, and Restore All.")],
      default: "archive",
      tags: ["experimental"],
      experiment: {
        mode: "startup"
      },
      description: localize("recovered.9177", "Controls the wording and icons used by actions that archive and unarchive chat sessions.")
    },
    ["chat.agentsHandoffTip.mode" /* AgentsHandoffTipMode */]: {
      type: "string",
      enum: ["hidden", "default", "custom"],
      enumDescriptions: [localize("recovered.9103", "Never show the handoff tip."), localize("recovered.9102", "Show the handoff tip with the default description."), localize("recovered.9101", "Show the handoff tip with an alternate description.")],
      default: "hidden",
      tags: ["experimental"],
      experiment: {
        mode: "startup"
      },
      description: localize("recovered.9100", "Controls the tip shown above the chat input offering to continue eligible agent sessions in the Agents Window.")
    },
    [ClaudePreferAgentHostAgentsSettingId]: {
      type: "boolean",
      markdownDescription: localize("recovered.9092", "When enabled, Claude sessions opened from the Agents Window run inside the agent host process instead of the GitHub Copilot Chat extension. Only one Claude implementation surfaces per window. Requires `#chat.agentHost.enabled#`."),
      default: false,
      tags: ["experimental"],
      experiment: {
        mode: "startup"
      }
    },
    [ClaudePreferAgentHostEditorSettingId]: {
      type: "boolean",
      description: localize("recovered.9155", "When enabled, Claude sessions opened from the regular workbench (sidebar chat) run inside the agent host process instead of the GitHub Copilot Chat extension. Only one Claude implementation surfaces per window."),
      default: false,
      tags: ["experimental"],
      experiment: {
        mode: "startup"
      }
    },
    [CodexPreferAgentHostEditorSettingId]: {
      type: "boolean",
      markdownDescription: localize("recovered.9156", "When enabled, Codex sessions opened from the regular workbench (sidebar chat) run inside the agent host process using the Codex App Server instead of the OpenAI extension. Only one Codex implementation surfaces per window. Requires `#chat.agentHost.enabled#` and `#chat.agentHost.codexAgent.enabled#`."),
      default: false,
      tags: ["experimental"],
      experiment: {
        mode: "startup"
      }
    },
    ["chat.contextUsage.enabled" /* ChatContextUsageEnabled */]: {
      type: "boolean",
      default: true,
      description: localize("recovered.9133", "Show the context window usage indicator in the chat input.")
    },
    ["chat.verbose" /* Verbose */]: {
      type: "boolean",
      default: true,
      description: localize("recovered.9326", "Show request and completion timestamps. Hover over a completion timestamp to show the elapsed response time.")
    },
    ["chat.progressBorder.enabled" /* ProgressBorder */]: {
      type: "boolean",
      default: true,
      markdownDescription: localize("recovered.9266", "Show an animated gradient border around the chat input while the agent is working or thinking. Has no effect when reduced motion is enabled.")
    },
    ["chat.notifyWindowOnResponseReceived" /* NotifyWindowOnResponseReceived */]: {
      type: "string",
      enum: ["off", "windowNotFocused", "always"],
      enumDescriptions: [localize("recovered.9246", "Never show OS notifications for responses."), localize("recovered.9247", "Show OS notifications for responses when the window is not focused."), localize("recovered.9245", "Always show OS notifications for responses, even when the window is focused.")],
      default: "windowNotFocused",
      description: localize("recovered.9244", "Controls whether a chat session should present the user with an OS notification when a response is received. This includes a window badge as well as notification toast.")
    },
    "chat.checkpoints.enabled": {
      type: "boolean",
      default: true,
      description: localize("recovered.9130", "Enables checkpoints in chat. Checkpoints allow you to restore the chat to a previous state.")
    },
    "chat.checkpoints.showFileChanges": {
      type: "boolean",
      description: localize("recovered.9131", "Controls whether to show chat checkpoint file changes."),
      default: false
    },
    ["chat.turnStatusPills" /* TurnStatusPills */]: {
      anyOf: [{
        type: "boolean"
      }, {
        type: "object",
        properties: {
          changes: {
            type: "boolean",
            default: false,
            description: localize("recovered.9297", "Show a pill summarizing the files changed and the lines added and removed in the turn.")
          },
          preview: {
            type: "boolean",
            default: false,
            description: localize("recovered.9299", "Show a pill to preview a Markdown or HTML file created or edited in the turn.")
          },
          browser: {
            type: "boolean",
            default: false,
            description: localize("recovered.9296", "Show a pill for browser activity in the turn.")
          }
        },
        additionalProperties: false,
        deprecationMessage: localize("recovered.9298", "The per-pill object form is deprecated. Use a boolean value instead.")
      }],
      markdownDescription: localize("recovered.9295", "Controls whether agent status pills are shown above the chat input while a turn is in progress and inside the completed response. Only applies to agent sessions."),
      default: true
    },
    [mcpAccessConfig]: {
      type: "string",
      description: localize("recovered.9208", "Controls access to installed Model Context Protocol servers."),
      enum: ["none" /* None */, "registry" /* Registry */, "all" /* All */],
      enumDescriptions: [localize("recovered.9210", "No access to MCP servers."), localize("recovered.9211", "Allows access to MCP servers installed from the registry that VS Code is connected to."), localize("recovered.9209", "Allow access to any installed MCP server.")],
      default: "all" /* All */,
      policy: {
        name: "ChatMCP",
        category: "InteractiveSession" /* InteractiveSession */,
        minimumVersion: "1.99",
        value: policyData => {
          if (policyData.mcp === false) {
            return "none" /* None */;
          }
          if (policyData.mcpAccess === "registry_only") {
            return "registry" /* Registry */;
          }
          return void 0;
        },
        localization: {
          description: {
            key: "chat.mcp.access",
            value: localize("recovered.9208", "Controls access to installed Model Context Protocol servers.")
          },
          enumDescriptions: [{
            key: "chat.mcp.access.none",
            value: localize("recovered.9210", "No access to MCP servers.")
          }, {
            key: "chat.mcp.access.registry",
            value: localize("recovered.9211", "Allows access to MCP servers installed from the registry that VS Code is connected to.")
          }, {
            key: "chat.mcp.access.any",
            value: localize("recovered.9209", "Allow access to any installed MCP server.")
          }]
        }
      }
    },
    [mcpAllowedServersConfig]: {
      type: ["array", "null"],
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          serverName: {
            type: "string",
            minLength: 1,
            description: localize("recovered.9215", "Match a server by its configured name.")
          },
          serverUrl: {
            type: "string",
            minLength: 1,
            description: localize("recovered.9216", "Match a remote server by its URL. Supports `*` wildcards, for example `https://*.example.com/*`.")
          },
          serverCommand: {
            type: "array",
            minItems: 1,
            items: {
              type: "string"
            },
            description: localize("recovered.9214", "Match a local server by its exact command invocation, given as the command followed by its arguments.")
          }
        },
        oneOf: [{
          required: ["serverName"]
        }, {
          required: ["serverUrl"]
        }, {
          required: ["serverCommand"]
        }]
      },
      markdownDescription: localize("recovered.9212", "Enterprise-managed allowlist that controls which Model Context Protocol servers may be installed and run. When set, only servers matching an entry are permitted; any other server is blocked. Servers can be matched by name, remote URL pattern (with `*` wildcards), or local command invocation. Omit entirely to allow all servers (subject to the deny list). Delivered via enterprise policy for governance; this setting is not surfaced to end users."),
      default: null,
      scope: 1 /* APPLICATION */,

      // Governance-only: delivered via the `ChatAllowedMcpServers` enterprise policy and hidden
      // from the Settings UI so it is not configurable by end users.
      included: false,
      policy: {
        name: "ChatAllowedMcpServers",
        category: "InteractiveSession" /* InteractiveSession */,
        minimumVersion: "1.130",
        value: managedSettingValue(COPILOT_ALLOWED_MCP_SERVERS_KEY),
        managedSettings: {
          [COPILOT_ALLOWED_MCP_SERVERS_KEY]: {
            type: "string"
          }
        },
        localization: {
          description: {
            key: "chat.mcp.allowedServers.policy",
            value: localize("recovered.9213", "Allowlist of Model Context Protocol servers. When set, only servers matching an entry may be installed or run; omit entirely to allow all servers (subject to the deny list).")
          }
        }
      }
    },
    [mcpDeniedServersConfig]: {
      type: ["array", "null"],
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          serverName: {
            type: "string",
            minLength: 1,
            description: localize("recovered.9228", "Match a server by its configured name.")
          },
          serverUrl: {
            type: "string",
            minLength: 1,
            description: localize("recovered.9229", "Match a remote server by its URL. Supports `*` wildcards, for example `https://*.example.com/*`.")
          },
          serverCommand: {
            type: "array",
            minItems: 1,
            items: {
              type: "string"
            },
            description: localize("recovered.9227", "Match a local server by its exact command invocation, given as the command followed by its arguments.")
          }
        },
        oneOf: [{
          required: ["serverName"]
        }, {
          required: ["serverUrl"]
        }, {
          required: ["serverCommand"]
        }]
      },
      markdownDescription: localize("recovered.9225", "Enterprise-managed denylist of Model Context Protocol servers. Servers matching any entry are unconditionally blocked from being installed or run, even if they also match the allow list \u2014 deny rules always take precedence. Servers can be matched by name, remote URL pattern (with `*` wildcards), or local command invocation. Delivered via enterprise policy for governance; this setting is not surfaced to end users."),
      default: null,
      scope: 1 /* APPLICATION */,

      // Governance-only: delivered via the `ChatDeniedMcpServers` enterprise policy and hidden
      // from the Settings UI so it is not configurable by end users.
      included: false,
      policy: {
        name: "ChatDeniedMcpServers",
        category: "InteractiveSession" /* InteractiveSession */,
        minimumVersion: "1.130",
        value: managedSettingValue(COPILOT_DENIED_MCP_SERVERS_KEY),
        managedSettings: {
          [COPILOT_DENIED_MCP_SERVERS_KEY]: {
            type: "string"
          }
        },
        localization: {
          description: {
            key: "chat.mcp.deniedServers.policy",
            value: localize("recovered.9226", "Denylist of Model Context Protocol servers. Servers matching any entry are blocked from being installed or run, even if they also match the allow list; deny rules always take precedence.")
          }
        }
      }
    },
    [mcpAutoStartConfig]: {
      type: "string",
      description: localize("recovered.9218", "Controls whether MCP servers should be automatically started when the chat messages are submitted."),
      default: "newAndOutdated" /* NewAndOutdated */,
      enum: ["never" /* Never */, "onlyNew" /* OnlyNew */, "newAndOutdated" /* NewAndOutdated */],
      enumDescriptions: [localize("recovered.9219", "Never automatically start MCP servers."), localize("recovered.9221", "Only automatically start new MCP servers that have never been run."), localize("recovered.9220", "Automatically start new and outdated MCP servers that are not yet running.")],
      tags: ["experimental"]
    },
    [mcpAppsEnabledConfig]: {
      type: "boolean",
      description: localize("recovered.9235", "Controls whether MCP servers can provide custom UI for tool invocations."),
      default: true,
      tags: ["experimental"]
    },
    [mcpEnterpriseManagedAuthIdpSection]: {
      type: "object",
      default: {},
      scope: 1 /* APPLICATION */,
      tags: ["preview", "experimental"],
      additionalProperties: false,
      included: false,
      properties: {
        issuer: {
          type: "string",
          format: "uri",
          markdownDescription: localize("recovered.9352", "The OAuth/OIDC issuer URL of the SSO authorization server. Must be an `https://` URL.")
        },
        clientId: {
          type: "string",
          markdownDescription: localize("recovered.9350", "The OAuth client ID registered with the SSO issuer for this device.")
        },
        clientSecret: {
          type: "string",
          markdownDescription: localize("recovered.9351", "The OAuth client secret paired with `clientId`. Intended for local development only.")
        }
      },
      markdownDescription: localize("recovered.9349", "(Preview) The OAuth/OIDC IdP configuration used for enterprise-managed Model Context Protocol (MCP) servers. Typically delivered via enterprise policy (Windows Group Policy / macOS managed preferences / Linux `/etc/vscode/policy.json`); developers may hand-edit `settings.json` for local testing. Properties: `issuer` (HTTPS URL), `clientId`, `clientSecret`."),
      policy: {
        name: "McpEnterpriseManagedAuthIdp",
        category: "InteractiveSession" /* InteractiveSession */,
        minimumVersion: "1.122",
        localization: {
          description: {
            key: "mcp.enterpriseManagedAuth.idp.policy",
            value: localize("recovered.9353", "The OAuth/OIDC IdP configuration used for enterprise-managed Model Context Protocol (MCP) server authentication.")
          }
        }
      }
    },
    [mcpServerCollisionBehaviorSection]: {
      type: "string",
      description: localize("recovered.9222", "Controls behavior when multiple MCP servers are discovered with the same name. 'disable' disables lower-priority duplicates. 'suffix' appends numeric suffixes to disambiguate."),
      enum: ["disable" /* Disable */, "suffix" /* Suffix */],
      enumDescriptions: [localize("recovered.9223", "Disable lower-priority servers with duplicate names."), localize("recovered.9224", "Append numeric suffixes to servers with duplicate names.")],
      default: "disable" /* Disable */
    },
    [mcpServerSamplingSection]: {
      type: "object",
      description: localize("recovered.9231", "Configures which models are exposed to MCP servers for sampling (making model requests in the background). This setting can be edited in a graphical way under the `{0}` command.", "MCP: " + localize("recovered.9355", "List Servers")),
      scope: 5 /* RESOURCE */,
      additionalProperties: {
        type: "object",
        properties: {
          allowedDuringChat: {
            type: "boolean",
            description: localize("recovered.9232", "Whether this server is allowed to make sampling requests during its tool calls in a chat session."),
            default: true
          },
          allowedOutsideChat: {
            type: "boolean",
            description: localize("recovered.9233", "Whether this server is allowed to make sampling requests outside of a chat session."),
            default: false
          },
          allowedModels: {
            type: "array",
            items: {
              type: "string",
              description: localize("recovered.9234", "A model the MCP server has access to.")
            }
          }
        }
      }
    },
    [AssistedTypes[4 /* NuGetPackage */].enabledConfigKey]: {
      type: "boolean",
      description: localize("recovered.9217", "Enables NuGet packages for AI-assisted MCP server installation. Used to install MCP servers by name from the central registry for .NET packages (NuGet.org)."),
      default: false,
      tags: ["experimental"],
      experiment: {
        mode: "startup"
      }
    },
    ["chat.extensionTools.enabled" /* ExtensionToolsEnabled */]: {
      type: "boolean",
      description: localize("recovered.9182", "Enable using tools contributed by third-party extensions."),
      default: true,
      policy: {
        name: "ChatAgentExtensionTools",
        category: "InteractiveSession" /* InteractiveSession */,
        minimumVersion: "1.99",
        localization: {
          description: {
            key: "chat.extensionToolsEnabled",
            value: localize("recovered.9182", "Enable using tools contributed by third-party extensions.")
          }
        }
      }
    },
    ["chat.plugins.enabled" /* PluginsEnabled */]: {
      type: "boolean",
      description: localize("recovered.9258", "Enable agent plugin integration in chat."),
      default: true,
      policy: {
        name: "ChatPluginsEnabled",
        category: "InteractiveSession" /* InteractiveSession */,
        minimumVersion: "1.116",
        localization: {
          description: {
            key: "chat.plugins.enabled",
            value: localize("recovered.9258", "Enable agent plugin integration in chat.")
          }
        }
      }
    },
    ["chat.pluginLocations" /* PluginLocations */]: {
      type: "object",
      additionalProperties: {
        type: "boolean"
      },
      restricted: true,
      markdownDescription: localize("recovered.9257", "Plugin directories to discover. Each key is a path that points directly to a plugin folder, and the value enables (`true`) or disables (`false`) it. Paths can be absolute, relative to the workspace root, or start with `~/` for the user's home directory."),
      scope: 2 /* MACHINE */,
      tags: ["experimental"]
    },
    ["chat.plugins.enabledPlugins" /* EnabledPlugins */]: {
      type: "object",
      additionalProperties: {
        type: "boolean"
      },
      markdownDescription: localize("recovered.9259", "Controls which [agent plugins](https://aka.ms/vscode-agent-plugins) are enabled or disabled. Keys are plugin IDs in `<plugin>@<marketplace>` form (where marketplace is defined in {1}); values enable (`true`) or disable (`false`) the plugin. Discovered alongside the path-keyed entries in {0}. When set by policy, entries are additive: plugins mapped to `true` are enabled in addition to the user's own plugins, and only plugins mapped to `false` are blocked from loading.", `\`#${"chat.pluginLocations" /* PluginLocations */}#\``, `\`#${"chat.plugins.marketplaces" /* PluginMarketplaces */}#\``),
      scope: 1 /* APPLICATION */,
      policy: {
        name: "ChatEnabledPlugins",
        category: "InteractiveSession" /* InteractiveSession */,
        minimumVersion: "1.122",
        value: managedSettingValue(COPILOT_ENABLED_PLUGINS_KEY),
        managedSettings: {
          [COPILOT_ENABLED_PLUGINS_KEY]: {
            type: "string"
          }
        },
        localization: {
          description: {
            key: "chat.plugins.enabledPlugins.policy",
            value: localize("recovered.9260", "Plugin enablement. Keys are plugin IDs in `{plugin}@{marketplace}` form; values enable or disable the plugin.")
          }
        }
      }
    },
    ["chat.plugins.marketplaces" /* PluginMarketplaces */]: {
      type: "array",
      items: {
        type: "string"
      },
      markdownDescription: localize("recovered.9263", "Plugin marketplaces to query. Entries may be GitHub shorthand (`owner/repo` or `owner/repo#ref`), direct Git repository URIs (`https://...git`, `ssh://...git`, or `git@host:path.git`, each optionally suffixed with `#ref`), or local repository URIs (`file:///...`). Equivalent GitHub shorthand and URI entries are deduplicated."),
      default: ["github/copilot-plugins", "github/awesome-copilot#marketplace"],
      scope: 1 /* APPLICATION */,
      tags: ["experimental"]
    },
    ["chat.plugins.extraMarketplaces" /* ExtraMarketplaces */]: {
      // Policy-only delivery slot for enterprise-managed marketplace entries (via the
      // `ChatExtraMarketplaces` policy). Consumers union this with `chat.plugins.marketplaces`.
      //
      // Stored as a `{ [name]: url-or-shorthand }` object so that:
      //   - The Settings Editor (ComplexObject renderer) can display entries inline when
      //     managed by policy, rather than only showing "Edit in settings.json".
      //   - Marketplace names are preserved for `enabledPlugins["plugin@<name>"]` resolution.
      //
      // `additionalProperties: { type: ['string'] }` uses the single-element array form of
      // JSON Schema's `type` keyword (equivalent to `type: 'string'`) to trigger VS Code's
      // ComplexObject renderer, which shows key-value rows inline and hides the
      // "Edit in settings.json" link when the value is managed by policy.
      type: "object",
      additionalProperties: {
        type: ["string"]
      },
      default: {},
      scope: 1 /* APPLICATION */,
      included: false,
      markdownDescription: localize("recovered.9261", "Enterprise-managed additional plugin marketplaces. Unioned with {0}.", `\`#${"chat.plugins.marketplaces" /* PluginMarketplaces */}#\``),
      policy: {
        name: "ChatExtraMarketplaces",
        category: "InteractiveSession" /* InteractiveSession */,
        minimumVersion: "1.122",
        value: managedSettingValue(COPILOT_EXTRA_MARKETPLACES_KEY),
        managedSettings: {
          [COPILOT_EXTRA_MARKETPLACES_KEY]: {
            type: "string"
          }
        },
        localization: {
          description: {
            key: "chat.plugins.extraMarketplaces.policy",
            value: localize("recovered.9262", "Additional plugin marketplaces to query. Keys are marketplace names; values are GitHub shorthand (`owner/repo[#ref]`) or Git URIs (`{url}[#ref]`).")
          }
        }
      }
    },
    ["chat.plugins.strictMarketplaces" /* StrictMarketplaces */]: {
      type: ["array", "null"],
      items: {
        type: "object",
        properties: {
          source: {
            type: "string",
            enum: ["github", "git", "url", "npm", "file", "directory", "hostPattern", "pathPattern"]
          },
          repo: {
            type: "string"
          },
          url: {
            type: "string"
          },
          ref: {
            type: "string"
          },
          path: {
            type: "string"
          },
          package: {
            type: "string"
          },
          hostPattern: {
            type: "string"
          },
          pathPattern: {
            type: "string"
          },
          headers: {
            type: "object",
            additionalProperties: {
              type: "string"
            }
          }
        },
        required: ["source"]
      },
      markdownDescription: localize("recovered.9264", "Enterprise-managed allowlist of plugin marketplace sources. When set, only marketplaces matching one of these entries can be installed; an empty array blocks all marketplaces. This does not retroactively disable already-installed plugins. Each entry is an object with a `source` discriminator (`github`, `git`, `url`, `npm`, `file`, `directory`, `hostPattern`, or `pathPattern`) and the corresponding fields. Typically delivered via enterprise policy."),
      default: null,
      restricted: true,
      scope: 1 /* APPLICATION */,
      tags: ["experimental"],
      policy: {
        name: "ChatStrictMarketplaces",
        category: "InteractiveSession" /* InteractiveSession */,
        minimumVersion: "1.122",
        value: managedSettingValue(COPILOT_STRICT_MARKETPLACES_KEY),
        managedSettings: {
          [COPILOT_STRICT_MARKETPLACES_KEY]: {
            type: "string"
          }
        },
        localization: {
          description: {
            key: "chat.plugins.strictMarketplaces.policy",
            value: localize("recovered.9265", "Allowlist of plugin marketplace sources. When set, only marketplaces matching an entry are trusted; an empty array blocks all marketplaces.")
          }
        }
      }
    },
    ["chat.agent.enabled" /* AgentEnabled */]: {
      type: "boolean",
      description: localize("recovered.9059", "When enabled, agent mode can be activated from chat and tools in agentic contexts with side effects can be used."),
      default: true,
      order: 1,
      policy: {
        name: "ChatAgentMode",
        category: "InteractiveSession" /* InteractiveSession */,
        minimumVersion: "1.99",
        value: policyData => policyData.chat_agent_enabled === false ? false : void 0,
        localization: {
          description: {
            key: "chat.agent.enabled.description",
            value: localize("recovered.9059", "When enabled, agent mode can be activated from chat and tools in agentic contexts with side effects can be used.")
          }
        }
      }
    },
    ["chat.agent.networkFilter" /* NetworkFilter */]: {
      markdownDescription: localize("recovered.9061", "When enabled, network access by agent tools (fetch tool, integrated browser) is restricted according to {0} and {1}. Domain filtering is also applied to those tools when {2} is enabled.", `\`#${"chat.agent.allowedNetworkDomains" /* AllowedNetworkDomains */}#\``, `\`#${"chat.agent.deniedNetworkDomains" /* DeniedNetworkDomains */}#\``, `\`#${"chat.agent.sandbox.enabled" /* AgentSandboxEnabled */}#\``),
      type: "boolean",
      default: false,
      restricted: true,
      policy: {
        name: "ChatAgentNetworkFilter",
        category: "InteractiveSession" /* InteractiveSession */,
        minimumVersion: "1.116",
        localization: {
          description: {
            key: "chat.agent.networkFilter",
            value: localize("recovered.9061", "When enabled, network access by agent tools (fetch tool, integrated browser) is restricted according to {0} and {1}. Domain filtering is also applied to those tools when {2} is enabled.", `\`#${"chat.agent.allowedNetworkDomains" /* AllowedNetworkDomains */}#\``, `\`#${"chat.agent.deniedNetworkDomains" /* DeniedNetworkDomains */}#\``, `\`#${"chat.agent.sandbox.enabled" /* AgentSandboxEnabled */}#\``)
          }
        }
      }
    },
    ["chat.agent.allowedNetworkDomains" /* AllowedNetworkDomains */]: {
      markdownDescription: localize("recovered.9056", "Allowed domains for network access by agent tools (fetch tool, integrated browser). Applies when {0} or {1} is enabled. When {2} is enabled, all domains are allowed. Supports wildcards like {3}. When both allowed and denied lists are empty, all domains are blocked. Denied domains (see {4}) take precedence.", `\`#${"chat.agent.networkFilter" /* NetworkFilter */}#\``, `\`#${"chat.agent.sandbox.enabled" /* AgentSandboxEnabled */}#\``, `\`#${"chat.agent.sandbox.allowNetwork" /* AgentSandboxAllowNetwork */}#\``, "`*.example.com`", `\`#${"chat.agent.deniedNetworkDomains" /* DeniedNetworkDomains */}#\``),
      type: "array",
      items: {
        type: "string"
      },
      default: [],
      restricted: true,
      policy: {
        name: "ChatAgentAllowedNetworkDomains",
        category: "InteractiveSession" /* InteractiveSession */,
        minimumVersion: "1.116",
        localization: {
          description: {
            key: "chat.agent.allowedNetworkDomains",
            value: localize("recovered.9056", "Allowed domains for network access by agent tools (fetch tool, integrated browser). Applies when {0} or {1} is enabled. When {2} is enabled, all domains are allowed. Supports wildcards like {3}. When both allowed and denied lists are empty, all domains are blocked. Denied domains (see {4}) take precedence.", `\`#${"chat.agent.networkFilter" /* NetworkFilter */}#\``, `\`#${"chat.agent.sandbox.enabled" /* AgentSandboxEnabled */}#\``, `\`#${"chat.agent.sandbox.allowNetwork" /* AgentSandboxAllowNetwork */}#\``, "`*.example.com`", `\`#${"chat.agent.deniedNetworkDomains" /* DeniedNetworkDomains */}#\``)
          }
        }
      }
    },
    ["chat.agent.deniedNetworkDomains" /* DeniedNetworkDomains */]: {
      markdownDescription: localize("recovered.9058", "Denied domains for network access by agent tools (fetch tool, integrated browser). Applies when {0} or {1} is enabled. This does not apply when {2} is enabled. Takes precedence over {3}. Supports wildcards like {4}.", `\`#${"chat.agent.networkFilter" /* NetworkFilter */}#\``, `\`#${"chat.agent.sandbox.enabled" /* AgentSandboxEnabled */}#\``, `\`#${"chat.agent.sandbox.allowNetwork" /* AgentSandboxAllowNetwork */}#\``, `\`#${"chat.agent.allowedNetworkDomains" /* AllowedNetworkDomains */}#\``, "`*.example.com`"),
      type: "array",
      items: {
        type: "string"
      },
      default: [],
      restricted: true,
      policy: {
        name: "ChatAgentDeniedNetworkDomains",
        category: "InteractiveSession" /* InteractiveSession */,
        minimumVersion: "1.116",
        localization: {
          description: {
            key: "chat.agent.deniedNetworkDomains",
            value: localize("recovered.9058", "Denied domains for network access by agent tools (fetch tool, integrated browser). Applies when {0} or {1} is enabled. This does not apply when {2} is enabled. Takes precedence over {3}. Supports wildcards like {4}.", `\`#${"chat.agent.networkFilter" /* NetworkFilter */}#\``, `\`#${"chat.agent.sandbox.enabled" /* AgentSandboxEnabled */}#\``, `\`#${"chat.agent.sandbox.allowNetwork" /* AgentSandboxAllowNetwork */}#\``, `\`#${"chat.agent.allowedNetworkDomains" /* AllowedNetworkDomains */}#\``, "`*.example.com`")
          }
        }
      }
    },
    ["chat.newSession.defaultMode" /* DefaultNewSessionMode */]: {
      type: "string",
      description: localize("recovered.9239", "The default mode for new chat sessions. When empty, the chat view's default mode is used."),
      default: ""
    },
    [AgentHostAhpJsonlLoggingSettingId]: {
      type: "boolean",
      description: localize("recovered.9077", "When enabled, logs all AHP transport messages for agent host connections to JSONL files under the window's log directory."),
      default: product_default.quality !== "stable",
      tags: ["experimental", "advanced"]
    },
    [AgentHostAgentDebugLogEnabledSettingId]: {
      type: "boolean",
      markdownDescription: localize("recovered.9075", "Enable agent debug logging for agent host sessions: surface their debug events in the agent debug panel. Takes effect immediately; only sessions that run while this is enabled are captured."),
      default: false,
      tags: ["experimental", "advanced"],
      experiment: {
        mode: "startup"
      }
    },
    [AgentHostAgentDebugLogMaxEventsSettingId]: {
      type: "number",
      minimum: 10,
      markdownDescription: localize("recovered.9076", "Maximum number of debug events kept in memory per agent host session for the agent debug panel. Older events beyond this limit are dropped from the in-memory buffer, which also lowers the totals (such as token usage) shown in the panel overview."),
      default: 1e4,
      tags: ["experimental", "advanced"],
      experiment: {
        mode: "startup"
      }
    },
    [AgentHostCustomTerminalToolEnabledSettingId]: {
      type: "boolean",
      description: localize("recovered.9082", "When enabled, Copilot SDK sessions use the Agent Host terminal tool override instead of the SDK's default terminal behavior."),
      default: false,
      tags: ["experimental", "advanced"]
    },
    [AgentHostCopilotSdkLogLevelSettingId]: {
      type: "string",
      enum: [...copilotSdkLogLevelSettingValues],
      enumDescriptions: [localize("recovered.9080", "Log informational messages. Running VS Code with trace logging still enables all Copilot SDK runtime diagnostics."), localize("recovered.9081", "Log all Copilot SDK runtime diagnostics.")],
      markdownDescription: localize("recovered.9079", "Controls the log level for the Copilot SDK runtime used by the local agent host. Changing this setting restarts the Copilot SDK client; active sessions are reloaded when next used."),
      default: "info",
      scope: 1 /* APPLICATION */,
      tags: ["experimental", "advanced"]
    },
    [AgentHostOpus48PromptEnabledSettingId]: {
      type: "boolean",
      description: localize("recovered.9085", "When enabled, Copilot SDK sessions running a Claude Opus 4.8 model apply Opus 4.8-tuned system-prompt section overrides on top of the default system message."),
      default: false,
      tags: ["experimental", "advanced"]
    },
    [AgentHostToolSearchEnabledSettingId]: {
      type: "boolean",
      description: localize("recovered.9078", "When enabled, Copilot SDK sessions defer MCP and non-core VS Code tools behind a tool-search tool so the model discovers them on demand instead of loading every tool definition up front."),
      default: false,
      tags: ["experimental", "advanced"]
    },
    [AgentHostReasoningEffortOverrideSettingId]: {
      type: "string",
      markdownDescription: localize("recovered.9086", "Overrides the reasoning effort for Copilot SDK agent sessions regardless of the per-model picker value. Set it to a level the selected model supports (for example `low`, `medium`, `high`, or `xhigh`) \u2014 choosing a level the model does not support may be rejected by the model. A value that isn't a recognized effort level is ignored and the session falls back to the picker value. Applied when a session is created and when its model changes. Only affects Copilot CLI agent sessions.\n\n**Note**: This is an advanced setting for experimentation."),
      default: "",
      tags: ["experimental", "advanced"]
    },
    [AgentHostModelCapabilityOverridesSettingId]: {
      type: "object",
      markdownDescription: localize("recovered.9083", "Per-model capability overrides for Copilot SDK agent sessions, keyed by model id, intended for evaluating preview models against an existing model's profile. For each model id, declare an aliased `family` (for example `claude-opus-4-8`) to route the model to that family's tuned system prompt without a code change; the model id sent to the runtime is unaffected. Only affects Copilot CLI agent sessions.\n\n**Note**: This is an advanced setting for experimentation."),
      additionalProperties: {
        type: "object",
        properties: {
          family: {
            type: "string",
            description: localize("recovered.9084", "Alias the model's family for prompt/capability routing (e.g. `claude-opus-4-8`).")
          }
        }
      },
      default: {},
      tags: ["experimental", "advanced"]
    },
    [AgentHostSdkSandboxEnabledSettingId]: {
      type: "string",
      enum: ["off" /* Off */, "on" /* On */, "allowNetwork" /* AllowNetwork */],
      enumDescriptions: [localize("recovered.9089", "No sandbox policy is forwarded for the SDK's built-in shell tool \u2014 commands run unsandboxed."), localize("recovered.9090", "The SDK's built-in shell tool runs inside a sandbox using the configured filesystem policy and host-list-restricted network."), localize("recovered.9088", "The SDK's built-in shell tool runs inside a sandbox with unrestricted outbound network access.")],
      markdownDescription: localize("recovered.9087", "Sandbox mode for the Copilot SDK's built-in shell tool. Only takes effect when `#chat.agentHost.customTerminalTool.enabled#` is `false`; when the Agent Host's own terminal tool is enabled, the engine sandbox is controlled by `#chat.agent.sandbox.enabled#`. The sandbox applies only to requests that run with default approvals \u2014 not when approvals are bypassed \u2014 and is not supported on Windows yet."),
      default: "off" /* Off */,
      tags: ["experimental", "advanced"],
      experiment: {
        mode: "auto"
      }
    },
    ["chat.tools.confirmationCarousel.enabled" /* ToolConfirmationCarousel */]: {
      type: "boolean",
      description: localize("recovered.9288", "When enabled, multiple tool confirmations are batched into a carousel above the input."),
      default: true
    },
    ["chat.tools.riskAssessment.enabled" /* ToolRiskAssessmentEnabled */]: {
      type: "boolean",
      description: localize("recovered.9291", "When enabled, tool confirmations show an LLM-generated risk level (Safe / Caution / Review carefully) and a short explanation."),
      default: true,
      experiment: {
        mode: "auto"
      }
    },
    ["chat.tools.riskAssessment.model" /* ToolRiskAssessmentModel */]: {
      type: "string",
      description: localize("recovered.9292", "The language model id used to generate tool risk assessments. Should be a small, fast model."),
      default: "copilot-utility-small",
      tags: ["experimental", "advanced"],
      experiment: {
        mode: "auto"
      }
    },
    ["chat.planAgent.defaultModel" /* PlanAgentDefaultModel */]: {
      type: "string",
      description: localize("recovered.9255", "Select the default language model to use for the Plan agent from the available providers."),
      default: "",
      enum: PlanAgentDefaultModel.modelIds,
      enumItemLabels: PlanAgentDefaultModel.modelLabels,
      markdownEnumDescriptions: PlanAgentDefaultModel.modelDescriptions
    },
    ["chat.exploreAgent.defaultModel" /* ExploreAgentDefaultModel */]: {
      type: "string",
      description: localize("recovered.9181", "Select the default language model to use for the Explore subagent from the available providers."),
      default: "",
      enum: ExploreAgentDefaultModel.modelIds,
      enumItemLabels: ExploreAgentDefaultModel.modelLabels,
      markdownEnumDescriptions: ExploreAgentDefaultModel.modelDescriptions
    },
    ["chat.byokUtilityModelDefault" /* BYOKUtilityModelDefault */]: {
      type: "string",
      markdownDescription: localize("recovered.9125", "Controls the default model used by built-in utility flows when the selected main agent model is a bring your own key (BYOK) model. This setting has no effect when the selected main agent model is provided by GitHub Copilot. A specific model configured in {0} or {1} takes precedence.", "`#chat.utilityModel#`", "`#chat.utilitySmallModel#`"),
      enum: ["none" /* None */, "mainAgent" /* MainAgent */, "copilot" /* Copilot */],
      enumItemLabels: [localize("recovered.9129", "None"), localize("recovered.9127", "Main Agent Model"), localize("recovered.9124", "GitHub Copilot")],
      markdownEnumDescriptions: [localize("recovered.9128", "Do not use a default utility model."), localize("recovered.9126", "Use the selected BYOK main agent model."), localize("recovered.9123", "Use the default GitHub Copilot utility models.")],
      default: "copilot" /* Copilot */
    },
    ["chat.utilityModel" /* UtilityModel */]: {
      type: "string",
      description: localize("recovered.9324", "Override the language model used by built-in utility flows. Leave empty to use the configured default behavior."),
      default: "",
      enum: UtilityModelContribution.modelIds,
      enumItemLabels: UtilityModelContribution.modelLabels,
      markdownEnumDescriptions: UtilityModelContribution.modelDescriptions
    },
    ["chat.utilitySmallModel" /* UtilitySmallModel */]: {
      type: "string",
      description: localize("recovered.9325", "Override the language model used by built-in small/fast utility flows. A fast and inexpensive model is recommended. Leave empty to use the configured default behavior."),
      default: "",
      enum: UtilitySmallModelContribution.modelIds,
      enumItemLabels: UtilitySmallModelContribution.modelLabels,
      markdownEnumDescriptions: UtilitySmallModelContribution.modelDescriptions
    },
    ["chat.requestQueuing.defaultAction" /* RequestQueueingDefaultAction */]: {
      type: "string",
      enum: ["queue", "steer"],
      enumDescriptions: [localize("recovered.9271", "Queue the message to send after the current request completes."), localize("recovered.9272", "Steer the current request by sending the message immediately, signaling the current request to yield.")],
      description: localize("recovered.9270", "Controls which action is the default for the queue button when a request is in progress."),
      default: "steer"
    },
    ["chat.math.enabled" /* EnableMath */]: {
      type: "boolean",
      description: localize("recovered.9207", "Enable math rendering in chat responses using KaTeX."),
      default: true
    },
    ["chat.agent.codeBlockProgress" /* ShowCodeBlockProgressAnimation */]: {
      type: "boolean",
      description: localize("recovered.9132", "When applying edits, show a progress animation in the code block pill. If disabled, shows the progress percentage instead."),
      default: true,
      tags: ["experimental"]
    },
    [mcpDiscoverySection]: {
      type: "object",
      properties: Object.fromEntries(allDiscoverySources.map(k => [k, {
        type: "boolean",
        description: discoverySourceSettingsLabel[k]
      }])),
      additionalProperties: false,
      default: Object.fromEntries(allDiscoverySources.map(k => [k, false])),
      markdownDescription: localize("recovered.9348", "Configures discovery of Model Context Protocol servers from configuration from various other applications.")
    },
    [mcpGalleryServiceEnablementConfig]: {
      type: "boolean",
      default: false,
      tags: ["preview"],
      description: localize("recovered.9230", "Enables the default Marketplace for Model Context Protocol (MCP) servers."),
      included: product_default.quality === "stable"
    },
    [mcpGalleryServiceUrlConfig]: {
      type: "string",
      description: localize("recovered.9354", "Configure the MCP Gallery service URL to connect to"),
      default: "",
      scope: 1 /* APPLICATION */,
      tags: ["usesOnlineServices", "advanced"],
      included: false,
      policy: {
        name: "McpGalleryServiceUrl",
        category: "InteractiveSession" /* InteractiveSession */,
        minimumVersion: "1.101",
        value: policyData => policyData.mcpRegistryUrl,
        localization: {
          description: {
            key: "mcp.gallery.serviceUrl",
            value: localize("recovered.9354", "Configure the MCP Gallery service URL to connect to")
          }
        }
      }
    },
    [PromptsConfig.INSTRUCTIONS_LOCATION_KEY]: {
      type: "object",
      title: localize("recovered.9205", "Instructions File Locations"),
      markdownDescription: localize("recovered.9204", "Specify location(s) of instructions files (`*{0}`) that can be attached in Chat sessions. [Learn More]({1}).\n\nRelative paths are resolved from the root folder(s) of your workspace.\n\nThis setting is only used by the Local agent harness.", INSTRUCTION_FILE_EXTENSION, INSTRUCTIONS_DOCUMENTATION_URL),
      default: {
        ...DEFAULT_INSTRUCTIONS_SOURCE_FOLDERS.map(folder => ({
          [folder.path]: true
        })).reduce((acc, curr) => ({
          ...acc,
          ...curr
        }), {})
      },
      additionalProperties: {
        type: "boolean"
      },
      propertyNames: {
        pattern: VALID_PROMPT_FOLDER_PATTERN,
        patternErrorMessage: localize("recovered.9206", "Paths must be relative or start with '~/'. Absolute paths and '\\' separators are not supported. Glob patterns are deprecated and will be removed in future versions.")
      },
      restricted: true,
      tags: ["prompts", "reusable prompts", "prompt snippets", "instructions"],
      examples: [{
        [DEFAULT_INSTRUCTIONS_SOURCE_FOLDERS[0].path]: true
      }, {
        [INSTRUCTIONS_DEFAULT_SOURCE_FOLDER]: true,
        "/Users/vscode/repos/instructions": true
      }]
    },
    [PromptsConfig.PROMPT_LOCATIONS_KEY]: {
      type: "object",
      title: localize("recovered.9275", "Prompt File Locations"),
      markdownDescription: localize("recovered.9274", "Specify location(s) of reusable prompt files (`*{0}`) that can be run in Chat sessions. [Learn More]({1}).\n\nRelative paths are resolved from the root folder(s) of your workspace.\n\nThis setting is only used by the Local agent harness.", PROMPT_FILE_EXTENSION, PROMPT_DOCUMENTATION_URL),
      default: {
        [PROMPT_DEFAULT_SOURCE_FOLDER]: true
      },
      additionalProperties: {
        type: "boolean"
      },
      unevaluatedProperties: {
        type: "boolean"
      },
      propertyNames: {
        pattern: VALID_PROMPT_FOLDER_PATTERN,
        patternErrorMessage: localize("recovered.9267", "Paths must be relative or start with '~/'. Absolute paths and '\\' separators are not supported. Glob patterns are deprecated and will be removed in future versions.")
      },
      restricted: true,
      tags: ["prompts", "reusable prompts", "prompt snippets", "instructions"],
      examples: [{
        [PROMPT_DEFAULT_SOURCE_FOLDER]: true
      }, {
        [PROMPT_DEFAULT_SOURCE_FOLDER]: true,
        "/Users/vscode/repos/prompts": true
      }]
    },
    [PromptsConfig.MODE_LOCATION_KEY]: {
      type: "object",
      title: localize("recovered.9238", "Mode File Locations"),
      markdownDescription: localize("recovered.9237", "Specify location(s) of custom chat mode files (`*{0}`). [Learn More]({1}).\n\nRelative paths are resolved from the root folder(s) of your workspace.\n\nThis setting is only used by the Local agent harness.", LEGACY_MODE_FILE_EXTENSION, AGENT_DOCUMENTATION_URL),
      default: {
        [LEGACY_MODE_DEFAULT_SOURCE_FOLDER]: true
      },
      deprecationMessage: localize("recovered.9236", "This setting is deprecated and will be removed in future releases. Chat modes are now called custom agents and are located in `.github/agents`"),
      additionalProperties: {
        type: "boolean"
      },
      unevaluatedProperties: {
        type: "boolean"
      },
      restricted: true,
      tags: ["experimental", "prompts", "reusable prompts", "prompt snippets", "instructions"],
      examples: [{
        [LEGACY_MODE_DEFAULT_SOURCE_FOLDER]: true
      }, {
        [LEGACY_MODE_DEFAULT_SOURCE_FOLDER]: true,
        "/Users/vscode/repos/chatmodes": true
      }]
    },
    [PromptsConfig.AGENTS_LOCATION_KEY]: {
      type: "object",
      title: localize("recovered.9094", "Agent File Locations"),
      markdownDescription: localize("recovered.9093", "Specify location(s) of custom agent files (`*{0}`). [Learn More]({1}).\n\nRelative paths are resolved from the root folder(s) of your workspace.\n\nThis setting is only used by the Local agent harness.", AGENT_FILE_EXTENSION, AGENT_DOCUMENTATION_URL),
      default: {
        [AGENTS_SOURCE_FOLDER]: true,
        [CLAUDE_AGENTS_SOURCE_FOLDER]: true,
        [COPILOT_USER_AGENTS_SOURCE_FOLDER]: true
      },
      additionalProperties: {
        type: "boolean"
      },
      propertyNames: {
        pattern: VALID_PROMPT_FOLDER_PATTERN,
        patternErrorMessage: localize("recovered.9091", "Paths must be relative or start with '~/'. Absolute paths and '\\' separators are not supported.")
      },
      restricted: true,
      tags: ["prompts", "reusable prompts", "prompt snippets", "instructions"],
      examples: [{
        [AGENTS_SOURCE_FOLDER]: true
      }, {
        [AGENTS_SOURCE_FOLDER]: true,
        "my-agents": true,
        "../shared-agents": true,
        "~/.copilot/agents": true
      }]
    },
    [PromptsConfig.USE_AGENT_MD]: {
      type: "boolean",
      title: localize("recovered.9309", "Use AGENTS.md file"),
      markdownDescription: localize("recovered.9308", "Controls whether instructions from `AGENTS.md` file found in a workspace roots are attached to all chat requests. This setting is only used by the Local agent harness."),
      default: true,
      restricted: true,
      disallowConfigurationDefault: true,
      tags: ["prompts", "reusable prompts", "prompt snippets", "instructions"]
    },
    [PromptsConfig.USE_NESTED_AGENT_MD]: {
      type: "boolean",
      title: localize("recovered.9321", "Use nested AGENTS.md files"),
      markdownDescription: localize("recovered.9320", "Controls whether instructions from nested `AGENTS.md` files found in the workspace are listed in all chat requests. The language model can load these skills on-demand if the `read` tool is available. This setting is only used by the Local agent harness."),
      default: false,
      restricted: true,
      disallowConfigurationDefault: true,
      tags: ["experimental", "prompts", "reusable prompts", "prompt snippets", "instructions"]
    },
    [PromptsConfig.USE_CLAUDE_MD]: {
      type: "boolean",
      title: localize("recovered.9315", "Use CLAUDE.md file"),
      markdownDescription: localize("recovered.9314", "Controls whether instructions from `CLAUDE.md` file found in workspace roots, .claude and ~/.claude folder are attached to all chat requests. This setting is only used by the Local agent harness."),
      default: true,
      restricted: true,
      disallowConfigurationDefault: true,
      tags: ["prompts", "reusable prompts", "prompt snippets", "instructions"]
    },
    [PromptsConfig.USE_AGENT_SKILLS]: {
      type: "boolean",
      title: localize("recovered.9311", "Use Agent skills"),
      markdownDescription: localize("recovered.9310", "Controls whether skills are provided as specialized capabilities to the chat requests. Skills are loaded from the folders configured in `#chat.agentSkillsLocations#`. The language model can load these skills on-demand if the `read` tool is available. Learn more about [Agent Skills](https://aka.ms/vscode-agent-skills). This setting is only used by the Local agent harness."),
      default: true,
      restricted: true,
      disallowConfigurationDefault: true,
      tags: ["prompts", "reusable prompts", "prompt snippets", "instructions"]
    },
    [PromptsConfig.USE_SKILL_ADHERENCE_PROMPT]: {
      type: "boolean",
      title: localize("recovered.9323", "Use Skill Adherence Prompt"),
      markdownDescription: localize("recovered.9322", "Controls whether a stronger skill adherence prompt is used that encourages the model to immediately invoke skills when relevant rather than just announcing them. This setting is only used by the Local agent harness."),
      default: false,
      restricted: true,
      disallowConfigurationDefault: true,
      tags: ["experimental", "prompts", "reusable prompts", "prompt snippets", "instructions"],
      experiment: {
        mode: "auto"
      }
    },
    [PromptsConfig.INCLUDE_APPLYING_INSTRUCTIONS]: {
      type: "boolean",
      title: localize("recovered.9198", "Include Applying Instructions"),
      markdownDescription: localize("recovered.9197", "Controls whether instructions with a matching 'applyTo' attribute are automatically included in chat requests. This setting is only used by the Local agent harness."),
      default: true,
      restricted: true,
      disallowConfigurationDefault: true,
      tags: ["prompts", "reusable prompts", "prompt snippets", "instructions"]
    },
    [PromptsConfig.INCLUDE_REFERENCED_INSTRUCTIONS]: {
      type: "boolean",
      title: localize("recovered.9200", "Include Referenced Instructions"),
      markdownDescription: localize("recovered.9199", "Controls whether referenced instructions are automatically included in chat requests. This setting is only used by the Local agent harness."),
      default: false,
      restricted: true,
      disallowConfigurationDefault: true,
      tags: ["prompts", "reusable prompts", "prompt snippets", "instructions"]
    },
    [PromptsConfig.USE_CUSTOMIZATIONS_IN_PARENT_REPOS]: {
      type: "boolean",
      title: localize("recovered.9317", "Use Customizations in Parent Repositories"),
      markdownDescription: localize("recovered.9316", "Controls whether to use chat customization files in parent repositories. This setting is only used by the Local agent harness."),
      default: false,
      restricted: true,
      disallowConfigurationDefault: true,
      tags: ["prompts", "reusable prompts", "prompt snippets", "instructions"]
    },
    [PromptsConfig.SKILLS_LOCATION_KEY]: {
      type: "object",
      title: localize("recovered.9106", "Agent Skills Locations"),
      markdownDescription: localize("recovered.9104", "Specify location(s) of agent skills (`{0}`) that can be used in Chat Sessions. [Learn More]({1}).\n\nEach path should contain skill subfolders with SKILL.md files (e.g., add `my-skills` if you have `my-skills/skillA/SKILL.md`). Relative paths are resolved from the root folder(s) of your workspace.\n\nThis setting is only used by the Local agent harness.", SKILL_FILENAME, SKILL_DOCUMENTATION_URL),
      default: {
        ...DEFAULT_SKILL_SOURCE_FOLDERS.map(folder => ({
          [folder.path]: true
        })).reduce((acc, curr) => ({
          ...acc,
          ...curr
        }), {})
      },
      additionalProperties: {
        type: "boolean"
      },
      propertyNames: {
        pattern: VALID_PROMPT_FOLDER_PATTERN,
        patternErrorMessage: localize("recovered.9105", "Paths must be relative or start with '~/'. Absolute paths and '\\' separators are not supported.")
      },
      restricted: true,
      tags: ["prompts", "reusable prompts", "prompt snippets", "instructions"],
      examples: [{
        [DEFAULT_SKILL_SOURCE_FOLDERS[0].path]: true
      }, {
        [DEFAULT_SKILL_SOURCE_FOLDERS[0].path]: true,
        "my-skills": true,
        "../shared-skills": true,
        "~/.custom/skills": true
      }]
    },
    [PromptsConfig.HOOKS_LOCATION_KEY]: {
      type: "object",
      title: localize("recovered.9189", "Hook File Locations"),
      markdownDescription: localize("recovered.9187", "Specify paths to hook configuration files that define custom shell commands to execute at strategic points in an agent's workflow. [Learn More]({0}).\n\nRelative paths are resolved from the root folder(s) of your workspace. Supports Copilot hooks (`*.json`) and Claude Code hooks (`settings.json`, `settings.local.json`).\n\nThis setting is only used by the Local agent harness.", HOOK_DOCUMENTATION_URL),
      default: {
        ...DEFAULT_HOOK_FILE_PATHS.map(f => ({
          [f.path]: true
        })).reduce((acc, curr) => ({
          ...acc,
          ...curr
        }), {})
      },
      additionalProperties: {
        type: "boolean"
      },
      propertyNames: {
        pattern: VALID_PROMPT_FOLDER_PATTERN,
        patternErrorMessage: localize("recovered.9188", "Paths must be relative or start with '~/'. Absolute paths and '\\' separators are not supported.")
      },
      restricted: true,
      tags: ["preview", "prompts", "hooks", "agent"],
      examples: [{
        [DEFAULT_HOOK_FILE_PATHS[0].path]: true
      }, {
        [DEFAULT_HOOK_FILE_PATHS[0].path]: true,
        "custom-hooks/hooks.json": true
      }],
      agentsWindow: {
        default: {
          ".claude/settings.local.json": false,
          ".claude/settings.json": false,
          "~/.claude/settings.json": false
        }
      }
    },
    [PromptsConfig.USE_CHAT_HOOKS]: {
      type: "boolean",
      title: localize("recovered.9319", "Use Chat Hooks"),
      markdownDescription: localize("recovered.9318", "Controls whether chat hooks are executed at strategic points during an agent's workflow. Hooks are loaded from the files configured in `#chat.hookFilesLocations#`. This setting is only used by the Local agent harness."),
      default: true,
      restricted: true,
      disallowConfigurationDefault: true,
      tags: ["preview", "prompts", "hooks", "agent"],
      policy: {
        name: "ChatHooks",
        category: "InteractiveSession" /* InteractiveSession */,
        minimumVersion: "1.109",
        value: policyData => policyData.chat_preview_features_enabled === false ? false : void 0,
        localization: {
          description: {
            key: "chat.useHooks.description",
            value: localize("recovered.9318", "Controls whether chat hooks are executed at strategic points during an agent's workflow. Hooks are loaded from the files configured in `#chat.hookFilesLocations#`. This setting is only used by the Local agent harness.")
          }
        }
      }
    },
    [PromptsConfig.USE_CLAUDE_HOOKS]: {
      type: "boolean",
      title: localize("recovered.9313", "Use Claude Hooks"),
      markdownDescription: localize("recovered.9312", "Controls whether hooks from Claude configuration files can execute. When disabled, only Copilot-format hooks are used. Hooks are loaded from the files configured in `#chat.hookFilesLocations#`. This setting is only used by the Local agent harness."),
      default: false,
      restricted: true,
      disallowConfigurationDefault: true,
      tags: ["preview", "prompts", "hooks", "agent"]
    },
    [PromptsConfig.PROMPT_FILES_SUGGEST_KEY]: {
      type: "object",
      scope: 5 /* RESOURCE */,
      title: localize("recovered.9269", "Prompt File Recommendations"),
      markdownDescription: localize("recovered.9268", "Configure which prompt files to recommend in the chat welcome view. Each key is a prompt file name, and the value can be `true` to always recommend, `false` to never recommend, or a [when clause](https://aka.ms/vscode-when-clause) expression like `resourceExtname == .js` or `resourceLangId == markdown`."),
      default: {},
      additionalProperties: {
        oneOf: [{
          type: "boolean"
        }, {
          type: "string"
        }]
      },
      tags: ["prompts", "reusable prompts", "prompt snippets", "instructions"],
      examples: [{
        "plan": true,
        "a11y-audit": "resourceExtname == .html",
        "document": "resourceLangId == markdown"
      }]
    },
    ["chat.tools.todos.showWidget" /* TodosShowWidget */]: {
      type: "boolean",
      default: true,
      description: localize("recovered.9294", "Controls whether to show the todo list widget above the chat input. When enabled, the widget displays todo items created by the agent and updates as progress is made.")
    },
    ["chat.agent.thinkingStyle" /* ThinkingStyle */]: {
      type: "string",
      default: "fixedScrolling",
      enum: ["collapsed", "collapsedPreview", "fixedScrolling"],
      enumDescriptions: [localize("recovered.9071", "Thinking parts will be collapsed by default."), localize("recovered.9072", "Thinking parts will be expanded first, then collapse once we reach a part that is not thinking."), localize("recovered.9073", "Show thinking in a fixed-height streaming panel that auto-scrolls; click header to expand to full height.")],
      description: localize("recovered.9074", "Controls how thinking is rendered."),
      tags: ["experimental"]
    },
    ["chat.agent.thinking.generateTitles" /* ThinkingGenerateTitles */]: {
      type: "boolean",
      default: true,
      description: localize("recovered.9066", "Controls whether to use an LLM to generate summary titles for thinking sections."),
      tags: ["experimental"]
    },
    "chat.agent.thinking.collapsedTools": {
      type: "string",
      default: "always",
      enum: ["off", "withThinking", "always"],
      enumDescriptions: [localize("recovered.9064", "Tool calls are shown separately, not collapsed into thinking."), localize("recovered.9065", "Tool calls are collapsed into thinking sections when thinking is present."), localize("recovered.9063", "Tool calls are always collapsed, even without thinking.")],
      markdownDescription: localize("recovered.9062", "Controls how tool calls are displayed in relation to thinking sections."),
      tags: ["experimental"]
    },
    ["chat.agent.thinking.terminalTools" /* TerminalToolsInThinking */]: {
      type: "boolean",
      default: true,
      markdownDescription: localize("recovered.9070", "When enabled, terminal tool calls are displayed inside the thinking dropdown with a simplified view."),
      tags: ["experimental"]
    },
    ["chat.tools.terminal.simpleCollapsible" /* SimpleTerminalCollapsible */]: {
      type: "boolean",
      default: true,
      markdownDescription: localize("recovered.9293", "When enabled, terminal tool calls are always displayed in a collapsible container with a simplified view."),
      tags: ["experimental"]
    },
    ["chat.tools.compressOutput.enabled" /* CompressOutputEnabled */]: {
      type: "boolean",
      default: false,
      markdownDescription: localize("recovered.9287", "Post-process tool output (for example `git diff`, `ls -l`, or `npm install`) to reduce token usage before it is sent to the model."),
      tags: ["preview"],
      experiment: {
        mode: "auto"
      }
    },
    ["chat.agent.thinking.phrases" /* ThinkingPhrases */]: {
      type: "object",
      default: {
        mode: "append",
        phrases: []
      },
      properties: {
        mode: {
          type: "string",
          enum: ["replace", "append"],
          default: "append",
          description: localize("recovered.9068", "'replace' replaces all default phrases entirely; 'append' adds your phrases to all default categories.")
        },
        phrases: {
          type: "array",
          items: {
            type: "string"
          },
          default: [],
          description: localize("recovered.9069", "Custom loading messages to show during thinking, working progress, terminal, and tool operations.")
        }
      },
      additionalProperties: false,
      markdownDescription: localize("recovered.9067", "Customize the loading messages shown during agent thinking and progress indicators. Use `\"mode\": \"replace\"` to use only your phrases, or `\"mode\": \"append\"` to add them to the defaults."),
      tags: ["experimental"]
    },
    ["chat.tools.autoExpandFailures" /* AutoExpandToolFailures */]: {
      type: "boolean",
      default: true,
      markdownDescription: localize("recovered.9286", "When enabled, tool failures are automatically expanded in the chat UI to show error details.")
    },
    [ChatAIDisabledSettingId]: {
      type: "boolean",
      description: localize("recovered.9148", "Disable and hide built-in AI features provided by GitHub Copilot, including chat and inline suggestions."),
      default: false,
      scope: 4 /* WINDOW */
    },
    ["chat.titleBar.signIn.enabled" /* TitleBarSignInEnabled */]: {
      type: "boolean",
      description: localize("recovered.9283", "Controls whether the Copilot Sign In button is shown in the title bar when signed out. When disabled, the Sign In affordance falls back to the status bar."),
      default: true
    },
    ["chat.titleBar.openInAgentsWindow.enabled" /* TitleBarOpenInAgentsWindowEnabled */]: {
      type: "boolean",
      description: localize("recovered.9282", "Controls whether the Open in Agents Window button is shown in the title bar."),
      default: true
    },
    "chat.approvedAccountOrganizations": {
      type: "array",
      items: {
        type: "string"
      },
      description: localize("recovered.9108", "List of GitHub organization logins whose members are permitted to use AI features. When set to a non-empty list, AI features are disabled until the user signs into a GitHub account that belongs to one of the specified organizations and account-level policy data has been resolved. Set to '*' to allow any authenticated GitHub or GitHub Enterprise account."),
      default: [],
      included: false,
      policy: {
        name: "ChatApprovedAccountOrganizations",
        category: "InteractiveSession" /* InteractiveSession */,
        minimumVersion: "1.118",
        localization: {
          description: {
            key: "chat.approvedAccountOrganizations.policy.description",
            value: localize("recovered.9109", "Setting this policy to a non-empty list activates the Approved Account gate: all AI features are disabled until the user signs into a GitHub account whose organizations intersect this list AND the account-side policy data has resolved. Comparison is case-insensitive. Use '*' as a wildcard to accept any signed-in GitHub or GHE account (use this for GHE deployments where the organization list is not surfaced).")
          }
        }
      }
    },
    "chat.allowAnonymousAccess": {
      // TODO@bpasero remove me eventually
      type: "boolean",
      description: localize("recovered.9107", "Controls whether anonymous access is allowed in chat."),
      default: false,
      included: false,
      tags: ["experimental"],
      experiment: {
        mode: "auto"
      }
    },
    ["chat.growthNotification.enabled" /* GrowthNotificationEnabled */]: {
      type: "boolean",
      description: localize("recovered.9186", "Controls whether to show a growth notification in the agent sessions view to encourage new users to try Copilot."),
      default: false,
      tags: ["experimental"],
      experiment: {
        mode: "auto"
      }
    },
    ["chat.restoreLastPanelSession" /* RestoreLastPanelSession */]: {
      type: "boolean",
      description: localize("recovered.9273", "Controls whether the last session is restored in panel after restart."),
      default: false
    },
    ["chat.exitAfterDelegation" /* ExitAfterDelegation */]: {
      type: "boolean",
      description: localize("recovered.9159", "Controls whether the chat panel automatically exits after delegating a request to another session."),
      default: false,
      tags: ["preview"]
    },
    "chat.extensionUnification.enabled": {
      type: "boolean",
      description: localize("recovered.9183", "Enables the unification of GitHub Copilot extensions. When enabled, all GitHub Copilot functionality is served from the GitHub Copilot Chat extension. When disabled, the GitHub Copilot and GitHub Copilot Chat extensions operate independently."),
      default: true,
      tags: ["experimental"],
      experiment: {
        mode: "auto"
      }
    },
    ["chat.subagents.allowInvocationsFromSubagents" /* SubagentsAllowInvocationsFromSubagents */]: {
      type: "boolean",
      description: localize("recovered.9279", "Allow subagents to invoke subagents."),
      markdownDescription: localize("recovered.9280", "Controls whether subagents can invoke other subagents. When enabled, nesting is limited to a maximum depth of 5."),
      default: false,
      experiment: {
        mode: "auto"
      }
    },
    ["chat.experimental.collectInstructionsInExtension" /* CollectInstructionsInExtension */]: {
      type: "boolean",
      description: localize("recovered.9160", "When enabled, automatic instruction collection (.instructions.md, agent instructions, customizations index) is performed by the GitHub Copilot Chat extension instead of the core workbench."),
      default: false,
      tags: ["experimental"]
    },
    ["chat.customizations.structuredPreview.enabled" /* ChatCustomizationsStructuredPreviewEnabled */]: {
      type: "boolean",
      tags: ["preview"],
      description: localize("recovered.9135", "Controls whether the Chat Customizations editor shows a structured preview for markdown customization files (agents, skills, instructions, prompts). When disabled, the editor always opens the raw markdown in the embedded code editor."),
      default: false
    },
    ["chat.customizations.promptMigration.enabled" /* ChatCustomizationsPromptMigrationEnabled */]: {
      type: "boolean",
      tags: ["experimental"],
      description: localize("recovered.9134", "Controls whether the Chat Customizations editor shows the prompt file migration affordances for agent-host harnesses. When disabled, the migration card and sidebar shortcut are hidden."),
      default: false
    }
  }
});
Registry.as(EditorExtensions.EditorPane).registerEditorPane(EditorPaneDescriptor.create(ChatEditor, ChatEditorInput.EditorID, localize("recovered.9055", "Chat")), [new SyncDescriptor(ChatEditorInput)]);
Registry.as(EditorExtensions.EditorPane).registerEditorPane(EditorPaneDescriptor.create(ChatDebugEditor, ChatDebugEditorInput.ID, localize("recovered.9332", "Debug View")), [new SyncDescriptor(ChatDebugEditorInput)]);
Registry.as(EditorExtensions.EditorPane).registerEditorPane(EditorPaneDescriptor.create(AgentPluginEditor, AgentPluginEditor.ID, localize("recovered.9053", "Agent Plugin")), [new SyncDescriptor(AgentPluginEditorInput)]);
function isStringKeyedObject(value2) {
  return !!value2 && typeof value2 === "object" && !Array.isArray(value2);
}
function migrateChatDefaultConfiguration(value2) {
  if (!isStringKeyedObject(value2) || value2.approvals !== "autoApprove" /* AutoApprove */) {
    return void 0;
  }
  return {
    ...value2,
    approvals: "allowAll" /* AllowAll */
  };
}
Registry.as(Extensions14.ConfigurationMigration).registerConfigurationMigrations([{
  key: "chat.agentSessions.defaultConfiguration",
  migrateFn: (value2, _accessor) => [["chat.agentSessions.defaultConfiguration", {
    value: void 0
  }], ["chat.defaultConfiguration" /* DefaultConfiguration */, {
    value: migrateChatDefaultConfiguration(value2) ?? value2
  }]]
}, {
  key: "chat.defaultConfiguration" /* DefaultConfiguration */,
  migrateFn: value2 => ({
    value: migrateChatDefaultConfiguration(value2) ?? value2
  })
}, {
  key: "chat.experimental.autoApprovals.enabled",
  migrateFn: (value2, accessor) => {
    const pairs = [["chat.experimental.autoApprovals.enabled", {
      value: void 0
    }]];
    if (accessor("chat.assistedPermissions.enabled" /* AssistedPermissionsEnabled */) === void 0) {
      pairs.push(["chat.assistedPermissions.enabled" /* AssistedPermissionsEnabled */, {
        value: value2
      }]);
    }
    return pairs;
  }
}, {
  key: "chat.experimental.detectParticipant.enabled",
  migrateFn: (value2, _accessor) => [["chat.experimental.detectParticipant.enabled", {
    value: void 0
  }], ["chat.detectParticipant.enabled", {
    value: value2 !== false
  }]]
}, {
  key: "chat.useCopilotModelsForUtilityModels",
  migrateFn: (value2, valueAccessor) => {
    const result = [["chat.useCopilotModelsForUtilityModels", {
      value: void 0
    }]];
    if (typeof value2 === "boolean" && valueAccessor("chat.byokUtilityModelDefault" /* BYOKUtilityModelDefault */) === void 0) {
      result.push(["chat.byokUtilityModelDefault" /* BYOKUtilityModelDefault */, {
        value: value2 ? "copilot" /* Copilot */ : "none" /* None */
      }]);
    }
    return result;
  }
}, {
  key: "chat.useClaudeSkills",
  migrateFn: (value2, _accessor) => [["chat.useClaudeSkills", {
    value: void 0
  }], ["chat.useAgentSkills", {
    value: value2
  }]]
}, {
  key: mcpDiscoverySection,
  migrateFn: value2 => {
    if (typeof value2 === "boolean") {
      return {
        value: Object.fromEntries(allDiscoverySources.map(k => [k, value2]))
      };
    }
    return {
      value: value2
    };
  }
}, {
  key: "chat.notifyWindowOnConfirmation" /* NotifyWindowOnConfirmation */,
  migrateFn: value2 => {
    if (value2 === true) {
      return {
        value: "windowNotFocused" /* WindowNotFocused */
      };
    } else if (value2 === false) {
      return {
        value: "off" /* Off */
      };
    }
    return [];
  }
}, {
  key: "chat.notifyWindowOnResponseReceived" /* NotifyWindowOnResponseReceived */,
  migrateFn: value2 => {
    if (value2 === true) {
      return {
        value: "windowNotFocused" /* WindowNotFocused */
      };
    } else if (value2 === false) {
      return {
        value: "off" /* Off */
      };
    }
    return [];
  }
}, {
  key: "chat.plugins.paths",
  migrateFn: (value2, _accessor) => [["chat.plugins.paths", {
    value: void 0
  }], ["chat.pluginLocations" /* PluginLocations */, {
    value: value2
  }]]
}, {
  // The on-device dictation runtime moved to Foundry Local; the old
  // transformers.js/onnxruntime model IDs no longer resolve and would fail
  // with an unknown-model error. Map any explicitly-stored legacy value to
  // the new default so existing users keep working. Also migrate the setting
  // from its old `chat.speechToText.model` id to `dictation.model`.
  key: "chat.speechToText.model",
  migrateFn: (value2, accessor) => {
    const legacyModelIds = ["onnx-community/whisper-tiny", "onnx-community/whisper-base", "onnx-community/whisper-small", "onnx-community/nemotron-3.5-asr-streaming-0.6b-onnx-int4"];
    const migrated = typeof value2 === "string" && legacyModelIds.includes(value2) ? "nemotron-speech-streaming-en-0.6b" : value2;
    const pairs = [["chat.speechToText.model", {
      value: void 0
    }]];
    if (accessor("dictation.model") === void 0) {
      pairs.push(["dictation.model", {
        value: migrated
      }]);
    }
    return pairs;
  }
}, {
  // Dictation settings were regrouped under the top-level `dictation.*`
  // namespace (they govern dictation across chat, editor, and terminal).
  key: "chat.speechToText.enabled",
  migrateFn: (value2, accessor) => {
    const pairs = [["chat.speechToText.enabled", {
      value: void 0
    }]];
    if (accessor("dictation.enabled") === void 0) {
      pairs.push(["dictation.enabled", {
        value: value2
      }]);
    }
    return pairs;
  }
}, {
  // `chat.speechToText.mode` was removed (the shortcut is always tap-toggle /
  // hold-to-talk); clear it so it does not linger as an unknown setting.
  key: "chat.speechToText.mode",
  migrateFn: () => [["chat.speechToText.mode", {
    value: void 0
  }]]
}]);
var ChatResolverContribution = class extends Disposable {
  constructor(chatSessionsService, editorResolverService, instantiationService) {
    super();
    this.editorResolverService = editorResolverService;
    this.instantiationService = instantiationService;
    this._editorRegistrations = this._register(new DisposableMap());
    this._registerEditor(Schemas.vscodeChatEditor);
    this._registerEditor(Schemas.vscodeLocalChatSession);
    this._register(chatSessionsService.onDidChangeContentProviderSchemes(e => {
      for (const scheme of e.added) {
        this._registerEditor(scheme);
      }
      for (const scheme of e.removed) {
        this._editorRegistrations.deleteAndDispose(scheme);
      }
    }));
    for (const scheme of chatSessionsService.getContentProviderSchemes()) {
      this._registerEditor(scheme);
    }
  }
  static {
    this.ID = "workbench.contrib.chatResolver";
  }
  _registerEditor(scheme) {
    this._editorRegistrations.set(scheme, this.editorResolverService.registerEditor(`${scheme}:**/**`, {
      id: ChatEditorInput.EditorID,
      label: localize("recovered.9055", "Chat"),
      priority: "builtin" /* builtin */
    }, {
      singlePerResource: true,
      canSupportResource: resource => resource.scheme === scheme
    }, {
      createEditorInput: ({
        resource,
        options: options3
      }) => {
        return {
          editor: this.instantiationService.createInstance(ChatEditorInput, resource, options3),
          options: options3
        };
      }
    }));
  }
};
ChatResolverContribution = __decorateClass([__decorateParam(0, IChatSessionsService), __decorateParam(1, IEditorResolverService), __decorateParam(2, IInstantiationService)], ChatResolverContribution);
var CopilotTelemetryContribution = class extends Disposable {
  constructor(telemetryService, chatEntitlementService) {
    super();
    this.telemetryService = telemetryService;
    this.chatEntitlementService = chatEntitlementService;
    this.updateCommonProperties();
    this._register(this.chatEntitlementService.onDidChangeEntitlement(() => {
      this.updateCommonProperties();
    }));
  }
  static {
    this.ID = "workbench.contrib.copilotTelemetry";
  }
  updateCommonProperties() {
    const copilotTrackingId = this.chatEntitlementService.copilotTrackingId;
    if (copilotTrackingId) {
      this.telemetryService.setCommonProperty("common.copilotTrackingId", copilotTrackingId);
    }
    if (this.chatEntitlementService.isInternal) {
      this.telemetryService.setCommonProperty("common.msftInternal", true);
    }
  }
};
CopilotTelemetryContribution = __decorateClass([__decorateParam(0, ITelemetryService), __decorateParam(1, IChatEntitlementService)], CopilotTelemetryContribution);
var ChatDebugResolverContribution = class {
  static {
    this.ID = "workbench.contrib.chatDebugResolver";
  }
  constructor(editorResolverService) {
    editorResolverService.registerEditor(`${ChatDebugEditorInput.RESOURCE.scheme}:**/**`, {
      id: ChatDebugEditorInput.ID,
      label: localize("recovered.9332", "Debug View"),
      priority: "exclusive" /* exclusive */
    }, {
      singlePerResource: true,
      canSupportResource: resource => resource.scheme === ChatDebugEditorInput.RESOURCE.scheme
    }, {
      createEditorInput: () => {
        return {
          editor: ChatDebugEditorInput.instance,
          options: {
            pinned: true
          }
        };
      }
    });
  }
};
ChatDebugResolverContribution = __decorateClass([__decorateParam(0, IEditorResolverService)], ChatDebugResolverContribution);
var ChatAgentSettingContribution = class extends Disposable {
  constructor(experimentService, entitlementService, contextKeyService) {
    super();
    this.experimentService = experimentService;
    this.entitlementService = entitlementService;
    this.contextKeyService = contextKeyService;
    this.newChatButtonExperimentIcon = ChatContextKeys.newChatButtonExperimentIcon.bindTo(this.contextKeyService);
    this.registerMaxRequestsSetting();
    this.registerNewChatButtonIcon();
    this.registerDefaultModeSetting();
  }
  static {
    this.ID = "workbench.contrib.chatAgentSetting";
  }
  registerMaxRequestsSetting() {
    let lastNode;
    const registerMaxRequestsSetting = () => {
      const treatmentId = this.entitlementService.entitlement === 5 /* Free */ ? "chatAgentMaxRequestsFree" : "chatAgentMaxRequestsPro";
      this.experimentService.getTreatment(treatmentId).then(value2 => {
        const node = {
          id: "chatSidebar",
          title: localize("recovered.9347", "Chat"),
          type: "object",
          properties: {
            "chat.agent.maxRequests": {
              type: "number",
              markdownDescription: localize("recovered.9060", "The maximum number of requests to allow per-turn when using an agent. When the limit is reached, will ask to confirm to continue."),
              default: value2 ?? 50,
              order: 2,
              agentsWindow: {
                default: 1e3
              }
            }
          }
        };
        configurationRegistry14.updateConfigurations({
          remove: lastNode ? [lastNode] : [],
          add: [node]
        });
        lastNode = node;
      });
    };
    this._register(Event2.runAndSubscribe(Event2.debounce(this.entitlementService.onDidChangeEntitlement, () => {}, 1e3), () => registerMaxRequestsSetting()));
  }
  registerNewChatButtonIcon() {
    this.experimentService.getTreatment("chatNewButtonIcon").then(value2 => {
      const supportedValues = ["copilot", "new-session", "comment"];
      if (typeof value2 === "string" && supportedValues.includes(value2)) {
        this.newChatButtonExperimentIcon.set(value2);
      } else {
        this.newChatButtonExperimentIcon.reset();
      }
    });
  }
  registerDefaultModeSetting() {
    this.experimentService.getTreatment("chatDefaultNewSessionMode").then(value2 => {
      const node = {
        id: "chatSidebar",
        title: localize("recovered.9347", "Chat"),
        type: "object",
        properties: {
          ["chat.newSession.defaultMode" /* DefaultNewSessionMode */]: {
            type: "string",
            description: localize("recovered.9239", "The default mode for new chat sessions. When empty, the chat view's default mode is used."),
            default: typeof value2 === "string" ? value2 : ""
          }
        }
      };
      configurationRegistry14.updateConfigurations({
        add: [node],
        remove: []
      });
    });
  }
};
ChatAgentSettingContribution = __decorateClass([__decorateParam(0, IWorkbenchAssignmentService), __decorateParam(1, IChatEntitlementService), __decorateParam(2, IContextKeyService)], ChatAgentSettingContribution);
var ChatForegroundSessionCountContribution = class extends Disposable {
  constructor(contextKeyService, chatWidgetService, viewsService) {
    super();
    this.contextKeyService = contextKeyService;
    this.chatWidgetService = chatWidgetService;
    this.viewsService = viewsService;
    this.foregroundSessionCountContextKey = ChatContextKeys.foregroundSessionCount.bindTo(this.contextKeyService);
    this._register(this.chatWidgetService.onDidAddWidget(() => {
      this.updateForegroundSessionCount();
    }));
    this._register(this.chatWidgetService.onDidChangeWidgetVisibility(() => {
      this.updateForegroundSessionCount();
    }));
    this._register(Event2.filter(this.viewsService.onDidChangeViewVisibility, e => e.id === ChatViewId)(() => {
      this.updateForegroundSessionCount();
    }));
    this.updateForegroundSessionCount();
  }
  static {
    this.ID = "workbench.contrib.chatForegroundSessionCount";
  }
  updateForegroundSessionCount() {
    let count2 = this.viewsService.isViewVisible(ChatViewId) ? 1 : 0;
    for (const widget of this.chatWidgetService.getWidgetsByLocations("panel" /* Chat */)) {
      if (!widget.visible) {
        continue;
      }
      if (isIChatViewViewContext(widget.viewContext)) {
        continue;
      }
      if (isIChatResourceViewContext(widget.viewContext) && widget.viewContext.isQuickChat) {
        continue;
      }
      count2++;
    }
    this.foregroundSessionCountContextKey.set(count2);
  }
};
ChatForegroundSessionCountContribution = __decorateClass([__decorateParam(0, IContextKeyService), __decorateParam(1, IChatWidgetService), __decorateParam(2, IViewsService)], ChatForegroundSessionCountContribution);
function getCustomModesWithUniqueNames(builtinModes, customModes) {
  const customModeIds = /* @__PURE__ */new Set();
  const builtinNames = new Set(builtinModes.map(mode => mode.name.get()));
  const customNameToId = /* @__PURE__ */new Map();
  for (const mode of customModes) {
    const modeName = mode.name.get();
    if (builtinNames.has(modeName)) {
      continue;
    }
    const existingId = customNameToId.get(modeName);
    if (existingId) {
      customModeIds.delete(existingId);
    }
    customNameToId.set(modeName, mode.id);
    customModeIds.add(mode.id);
  }
  return customModeIds;
}
var ChatAgentActionsContribution = class extends Disposable {
  constructor(_chatModeService, chatWidgetService) {
    super();
    this.chatWidgetService = chatWidgetService;
    this._modeActionDisposables = new DisposableMap();
    this._store.add(this._modeActionDisposables);
    const focusedWidget = observableFromEvent(this, this.chatWidgetService.onDidChangeFocusedSession, () => this.chatWidgetService.lastFocusedWidget);
    this._register(autorun(reader => {
      const chatModes = focusedWidget.read(reader)?.input.currentChatModesObs.read(reader);
      this._syncModeActions(chatModes);
    }));
  }
  static {
    this.ID = "workbench.contrib.chatAgentActions";
  }
  _syncModeActions(chatModes) {
    if (!chatModes) {
      this._modeActionDisposables.clearAndDisposeAll();
      return;
    }
    const {
      builtin,
      custom
    } = chatModes;
    const currentModeIds = getCustomModesWithUniqueNames(builtin, custom);
    for (const modeId of this._modeActionDisposables.keys()) {
      if (!currentModeIds.has(modeId)) {
        this._modeActionDisposables.deleteAndDispose(modeId);
      }
    }
    for (const mode of custom) {
      if (currentModeIds.has(mode.id) && !this._modeActionDisposables.has(mode.id)) {
        this._registerModeAction(mode);
      }
    }
  }
  _registerModeAction(mode) {
    const actionClass = class extends ModeOpenChatGlobalAction {
      constructor() {
        super(mode);
      }
    };
    this._modeActionDisposables.set(mode.id, registerAction2(actionClass));
  }
};
ChatAgentActionsContribution = __decorateClass([__decorateParam(0, IChatModeService), __decorateParam(1, IChatWidgetService)], ChatAgentActionsContribution);
var HookSchemaAssociationContribution = class extends Disposable {
  constructor(_configurationService, _pathService) {
    super();
    this._configurationService = _configurationService;
    this._pathService = _pathService;
    this._registrations = this._register(new DisposableStore());
    this._updateAssociations();
    this._register(this._configurationService.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration(PromptsConfig.HOOKS_LOCATION_KEY)) {
        this._updateAssociations();
      }
    }));
  }
  static {
    this.ID = "workbench.contrib.hookSchemaAssociation";
  }
  async _updateAssociations() {
    this._registrations.clear();
    const folders = PromptsConfig.promptSourceFolders(this._configurationService, "hook" /* hook */);
    const userHomeUri = await this._pathService.userHome();
    const userHome = userHomeUri.fsPath ?? userHomeUri.path;
    for (const folder of folders) {
      if (folder.source === "claude-workspace" /* ClaudeWorkspace */ || folder.source === "claude-workspace-local" /* ClaudeWorkspaceLocal */ || folder.source === "claude-personal" /* ClaudePersonal */) {
        continue;
      }
      const resolvedPath = isTildePath(folder.path) ? userHome + folder.path.substring(1) : folder.path;
      const glob = resolvedPath.toLowerCase().endsWith(".json") ? resolvedPath : `${resolvedPath}/*.json`;
      this._registrations.add(jsonContributionRegistry2.registerSchemaAssociation(HOOK_SCHEMA_URI, glob));
    }
  }
};
HookSchemaAssociationContribution = __decorateClass([__decorateParam(0, IConfigurationService), __decorateParam(1, IPathService)], HookSchemaAssociationContribution);
var ToolReferenceNamesContribution = class extends Disposable {
  constructor(_languageModelToolsService) {
    super();
    this._languageModelToolsService = _languageModelToolsService;
    this._updateToolReferenceNames();
    this._register(this._languageModelToolsService.onDidChangeTools(() => this._updateToolReferenceNames()));
  }
  static {
    this.ID = "workbench.contrib.toolReferenceNames";
  }
  _updateToolReferenceNames() {
    const tools = Array.from(this._languageModelToolsService.getAllToolsIncludingDisabled()).filter(tool => typeof tool.toolReferenceName === "string").sort((a, b) => a.toolReferenceName.localeCompare(b.toolReferenceName));
    toolReferenceNameEnumValues.length = 0;
    toolReferenceNameEnumDescriptions.length = 0;
    for (const tool of tools) {
      toolReferenceNameEnumValues.push(tool.toolReferenceName);
      toolReferenceNameEnumDescriptions.push(localize("recovered.9284", "{0} - {1}", tool.toolReferenceName, tool.userDescription || tool.displayName));
    }
    configurationRegistry14.notifyConfigurationSchemaUpdated({
      id: "chatSidebar",
      properties: {
        ["chat.tools.eligibleForAutoApproval" /* EligibleForAutoApproval */]: {}
      }
    });
  }
};
ToolReferenceNamesContribution = __decorateClass([__decorateParam(0, ILanguageModelToolsService)], ToolReferenceNamesContribution);
var ChatSpeechToTextInitContribution = class {
  static {
    this.ID = "workbench.contrib.chatSpeechToTextInit";
  }
  constructor(_chatSpeechToTextService) {}
};
ChatSpeechToTextInitContribution = __decorateClass([__decorateParam(0, IChatSpeechToTextService)], ChatSpeechToTextInitContribution);
AccessibleViewRegistry.register(new ChatTerminalOutputAccessibleView());
AccessibleViewRegistry.register(new ChatResponseAccessibleView());
AccessibleViewRegistry.register(new PanelChatAccessibilityHelp());
AccessibleViewRegistry.register(new QuickChatAccessibilityHelp());
AccessibleViewRegistry.register(new EditsChatAccessibilityHelp());
AccessibleViewRegistry.register(new AgentChatAccessibilityHelp());
registerEditorFeature(ChatInputBoxContentProvider);
Registry.as(EditorExtensions.EditorFactory).registerEditorSerializer(ChatEditorInput.TypeID, ChatEditorInputSerializer);
Registry.as(EditorExtensions.EditorFactory).registerEditorSerializer(ChatDebugEditorInput.ID, ChatDebugEditorInputSerializer);
registerWorkbenchContribution2(CopilotTelemetryContribution.ID, CopilotTelemetryContribution, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(ChatSpeechToTextInitContribution.ID, ChatSpeechToTextInitContribution, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(ChatResolverContribution.ID, ChatResolverContribution, WorkbenchPhase.BlockStartup);
registerWorkbenchContribution2(ChatDebugResolverContribution.ID, ChatDebugResolverContribution, WorkbenchPhase.BlockStartup);
registerWorkbenchContribution2(PromptsDebugContribution.ID, PromptsDebugContribution, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(AgentHostChatDebugContribution.ID, AgentHostChatDebugContribution, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(ChatLanguageModelsDataContribution.ID, ChatLanguageModelsDataContribution, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(ChatSlashCommandsContribution.ID, ChatSlashCommandsContribution, WorkbenchPhase.Eventually);
registerWorkbenchContribution2(ChatSessionOptionSlashCommandsContribution.ID, ChatSessionOptionSlashCommandsContribution, WorkbenchPhase.Eventually);
registerWorkbenchContribution2(ChatOutlineCreator.ID, ChatOutlineCreator, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(ChatExtensionPointHandler.ID, ChatExtensionPointHandler, WorkbenchPhase.BlockStartup);
registerWorkbenchContribution2(LanguageModelToolsExtensionPointHandler.ID, LanguageModelToolsExtensionPointHandler, WorkbenchPhase.BlockStartup);
registerWorkbenchContribution2(ChatPromptFilesExtensionPointHandler.ID, ChatPromptFilesExtensionPointHandler, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(ChatCompatibilityNotifier.ID, ChatCompatibilityNotifier, WorkbenchPhase.Eventually);
registerWorkbenchContribution2(CodeBlockActionRendering.ID, CodeBlockActionRendering, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(ChatCopyActionRendering.ID, ChatCopyActionRendering, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(ChatImplicitContextContribution.ID, ChatImplicitContextContribution, WorkbenchPhase.Eventually);
registerWorkbenchContribution2(ChatViewsWelcomeHandler.ID, ChatViewsWelcomeHandler, WorkbenchPhase.BlockStartup);
registerWorkbenchContribution2(ChatGettingStartedContribution.ID, ChatGettingStartedContribution, WorkbenchPhase.Eventually);
registerWorkbenchContribution2(ChatSetupContribution.ID, ChatSetupContribution, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(ChatQuotaNotificationContribution.ID, ChatQuotaNotificationContribution, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(ChatPromoNotificationContribution.ID, ChatPromoNotificationContribution, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(HasByokModelsContribution.ID, HasByokModelsContribution, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(ChatTeardownContribution.ID, ChatTeardownContribution, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(ChatStatusBarEntry.ID, ChatStatusBarEntry, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(BuiltinToolsContribution.ID, BuiltinToolsContribution, WorkbenchPhase.Eventually);
registerWorkbenchContribution2(ClientToolSetsContribution.ID, ClientToolSetsContribution, WorkbenchPhase.Eventually);
registerWorkbenchContribution2(UsagesToolContribution.ID, UsagesToolContribution, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(RenameToolContribution.ID, RenameToolContribution, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(ChatAgentSettingContribution.ID, ChatAgentSettingContribution, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(ChatForegroundSessionCountContribution.ID, ChatForegroundSessionCountContribution, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(ChatAgentActionsContribution.ID, ChatAgentActionsContribution, WorkbenchPhase.Eventually);
registerWorkbenchContribution2(HookSchemaAssociationContribution.ID, HookSchemaAssociationContribution, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(ToolReferenceNamesContribution.ID, ToolReferenceNamesContribution, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(ChatAgentRecommendation.ID, ChatAgentRecommendation, WorkbenchPhase.Eventually);
registerWorkbenchContribution2(ChatEditingEditorAccessibility.ID, ChatEditingEditorAccessibility, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(ChatQueuePickerRendering.ID, ChatQueuePickerRendering, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(ChatEditingEditorOverlay.ID, ChatEditingEditorOverlay, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(ChatEditingEditorContextKeys.ID, ChatEditingEditorContextKeys, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(ChatTransferContribution.ID, ChatTransferContribution, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(ChatContextContributions.ID, ChatContextContributions, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(PromptUrlHandler.ID, PromptUrlHandler, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(PluginUrlHandler.ID, PluginUrlHandler, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(ChatEditingNotebookFileSystemProviderContrib.ID, ChatEditingNotebookFileSystemProviderContrib, WorkbenchPhase.BlockStartup);
registerWorkbenchContribution2(ChatResponseResourceWorkbenchContribution.ID, ChatResponseResourceWorkbenchContribution, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(UserToolSetsContributions.ID, UserToolSetsContributions, WorkbenchPhase.Eventually);
registerWorkbenchContribution2(PromptLanguageFeaturesProvider.ID, PromptLanguageFeaturesProvider, WorkbenchPhase.Eventually);
registerWorkbenchContribution2(ChatWindowNotifier.ID, ChatWindowNotifier, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(ChatRepoInfoContribution.ID, ChatRepoInfoContribution, WorkbenchPhase.Eventually);
registerWorkbenchContribution2(AgentPluginRecommendations.ID, AgentPluginRecommendations, WorkbenchPhase.Eventually);
registerWorkbenchContribution2(PluginAutoUpdate.ID, PluginAutoUpdate, WorkbenchPhase.Eventually);
registerWorkbenchContribution2(ChatReferenceAttachmentWidgetContribution.ID, ChatReferenceAttachmentWidgetContribution, WorkbenchPhase.AfterRestored);
registerChatActions();
registerChatAccessibilityActions();
registerChatCopyActions();
registerChatBranchActions();
registerChatOpenAgentDebugPanelAction();
registerChatCodeBlockActions();
registerChatCodeCompareBlockActions();
registerChatFileTreeActions();
registerChatPromptNavigationActions();
registerChatTitleActions();
registerChatExecuteActions();
registerAction2(ChatVoiceInputModeAction);
registerAction2(ChatVoiceInputModeToggleListenAction);
registerVoiceInputModeSimulateActions();
registerChatSpeechToTextActions();
registerConfigureSpeechInstructionsActions();
registerChatQueueActions();
registerQuickChatActions();
registerChatExportActions();
registerMoveActions();
registerNewChatActions();
registerChatContextActions();
registerChatDeveloperActions();
registerChatEditorActions();
registerChatElicitationActions();
registerChatToolActions();
registerLanguageModelActions();
registerChatPluginActions();
registerPlanReviewFeedbackEditorActions();
registerAction2(ConfigureToolSets);
registerEditorFeature(ChatPasteProvidersFeature);
agentPluginDiscoveryRegistry.register(new SyncDescriptor(ConfiguredAgentPluginDiscovery), 10 /* Configured */);
agentPluginDiscoveryRegistry.register(new SyncDescriptor(MarketplaceAgentPluginDiscovery), 20 /* Marketplace */);
agentPluginDiscoveryRegistry.register(new SyncDescriptor(ExtensionAgentPluginDiscovery), 30 /* Extension */);
agentPluginDiscoveryRegistry.register(new SyncDescriptor(CopilotCliAgentPluginDiscovery), 40 /* CopilotCli */);
registerSingleton(IChatResponseResourceFileSystemProvider, ChatResponseResourceFileSystemProvider, 1 /* Delayed */);
registerSingleton(IChatSpeechToTextService, ChatSpeechToTextService, 0 /* Eager */);
registerSingleton(IChatTransferService, ChatTransferService, 1 /* Delayed */);
registerSingleton(IChatService, ChatService, 1 /* Delayed */);
registerSingleton(IChatWidgetService, ChatWidgetService, 1 /* Delayed */);
registerSingleton(IChatBranchService, ChatBranchService, 1 /* Delayed */);
registerSingleton(IChatSideChatService, ChatSideChatService, 1 /* Delayed */);
registerSingleton(IChatPetService, ChatPetService, 1 /* Delayed */);
registerSingleton(IQuickChatService, QuickChatService, 1 /* Delayed */);
registerSingleton(IChatAccessibilityService, ChatAccessibilityService, 1 /* Delayed */);
registerSingleton(IChatWidgetHistoryService, ChatWidgetHistoryService, 1 /* Delayed */);
registerSingleton(ILanguageModelsConfigurationService, LanguageModelsConfigurationService, 1 /* Delayed */);
registerSingleton(ILanguageModelsService, LanguageModelsService, 1 /* Delayed */);
registerSingleton(ILanguageModelStatsService, LanguageModelStatsService, 1 /* Delayed */);
registerSingleton(IChatSlashCommandService, ChatSlashCommandService, 1 /* Delayed */);
registerSingleton(IChatAgentService, ChatAgentService, 1 /* Delayed */);
registerSingleton(IChatAgentNameService, ChatAgentNameService, 1 /* Delayed */);
registerSingleton(IChatVariablesService, ChatVariablesService, 1 /* Delayed */);
registerSingleton(IAgentPluginService, AgentPluginService, 1 /* Delayed */);
registerSingleton(IPluginMarketplaceService, PluginMarketplaceService, 1 /* Delayed */);
registerSingleton(IWorkspacePluginSettingsService, WorkspacePluginSettingsService, 1 /* Delayed */);
registerSingleton(IAgentPluginRepositoryService, AgentPluginRepositoryService, 1 /* Delayed */);
registerSingleton(IPluginGitService, BrowserPluginGitCommandService, 1 /* Delayed */);
registerSingleton(IPluginInstallService, PluginInstallService, 1 /* Delayed */);
registerSingleton(ILanguageModelToolsService, LanguageModelToolsService, 1 /* Delayed */);
registerSingleton(IToolResultCompressor, ToolResultCompressorService, 1 /* Delayed */);
registerSingleton(ILanguageModelToolsConfirmationService, LanguageModelToolsConfirmationService, 1 /* Delayed */);
registerSingleton(IChatToolRiskAssessmentService, ChatToolRiskAssessmentService, 1 /* Delayed */);
registerSingleton(IChatGoalSummaryService, ChatGoalSummaryService, 1 /* Delayed */);
registerSingleton(IChatResponseFileChangesService, ChatResponseFileChangesService, 1 /* Delayed */);
registerSingleton(IChatSubmitRequestHandlerService, ChatSubmitRequestHandlerService, 1 /* Delayed */);
registerSingleton(IVoiceChatService, VoiceChatService, 1 /* Delayed */);
registerSingleton(IChatCodeBlockContextProviderService, ChatCodeBlockContextProviderService, 1 /* Delayed */);
registerSingleton(ICodeMapperService, CodeMapperService, 1 /* Delayed */);
registerSingleton(IChatEditingService, ChatEditingService, 1 /* Delayed */);
registerSingleton(IChatMarkdownAnchorService, ChatMarkdownAnchorService, 1 /* Delayed */);
registerSingleton(IAgentNetworkFilterService, AgentNetworkFilterService, 1 /* Delayed */);
registerSingleton(ILanguageModelIgnoredFilesService, LanguageModelIgnoredFilesService, 1 /* Delayed */);
registerSingleton(IPromptsService, PromptsService, 1 /* Delayed */);
registerSingleton(IChatContextPickService, ChatContextPickService, 1 /* Delayed */);
registerSingleton(IChatModeService, ChatModeService, 1 /* Delayed */);
registerSingleton(IChatAttachmentResolveService, ChatAttachmentResolveService, 1 /* Delayed */);
registerSingleton(IChatAttachmentWidgetRegistry, ChatAttachmentWidgetRegistry, 1 /* Delayed */);
registerSingleton(IChatTodoListService, ChatTodoListService, 1 /* Delayed */);
registerSingleton(IChatArtifactsService, ChatArtifactsService, 1 /* Delayed */);
registerSingleton(IChatOutputRendererService, ChatOutputRendererService, 1 /* Delayed */);
registerSingleton(IChatLayoutService, ChatLayoutService, 1 /* Delayed */);
registerSingleton(IPlanReviewFeedbackService, PlanReviewFeedbackService, 1 /* Delayed */);
registerSingleton(IChatTipService, ChatTipService, 1 /* Delayed */);
registerSingleton(IChatDebugService, ChatDebugServiceImpl, 1 /* Delayed */);
registerSingleton(IChatImageCarouselService, ChatImageCarouselService, 1 /* Delayed */);
registerSingleton(IAgentHostImportConversationStore, AgentHostImportConversationStore, 1 /* Delayed */);
ChatWidget.CONTRIBS.push(ChatDynamicVariableModel);

// src/vs/workbench/contrib/chat/browser/actions/exportAgentHostDebugLogsAction.ts
export { toolReferenceNameEnumValues, toolReferenceNameEnumDescriptions, jsonContributionRegistry2, configurationRegistry14, isStringKeyedObject, migrateChatDefaultConfiguration, ChatResolverContribution, CopilotTelemetryContribution, ChatDebugResolverContribution, ChatAgentSettingContribution, ChatForegroundSessionCountContribution, getCustomModesWithUniqueNames, ChatAgentActionsContribution, HookSchemaAssociationContribution, ToolReferenceNamesContribution, ChatSpeechToTextInitContribution, jsonContributionRegistry2 as jsonContributionRegistry, configurationRegistry14 as configurationRegistry };
