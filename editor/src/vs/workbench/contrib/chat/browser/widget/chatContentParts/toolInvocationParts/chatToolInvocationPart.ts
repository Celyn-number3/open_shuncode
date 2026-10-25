// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
import { __decorateClass } from "../../../../../../../base/common/shunCodeRecoveredHelpersWorkbench.js";
import { __decorateParam } from "../../../../../../../base/common/shunCodeRecoveredHelpersWorkbench.js";
import { DisposableStore } from "../../../../../../../base/common/lifecycle.js";
import { Disposable } from "../../../../../../../base/common/lifecycle.js";
import { MutableDisposable } from "../../../../../../../base/common/lifecycle.js";
import { Emitter } from "../../../../../../../base/common/event.js";
import { autorun } from "../../../../../../../base/common/observableInternal/reactions/autorun.js";
import { derivedOpts } from "../../../../../../../base/common/observableInternal/observables/derived.js";
import { constObservable } from "../../../../../../../base/common/observableInternal/observables/constObservable.js";
import { clearNode } from "../../../../../../../base/browser/dom.js";
import { $ } from "../../../../../../../base/browser/dom.js";
import { show } from "../../../../../../../base/browser/dom.js";
import { hide } from "../../../../../../../base/browser/dom.js";
import { IInstantiationService } from "../../../../../../../platform/instantiation/common/instantiation.js";
import { IConfigurationService } from "../../../../../../../platform/configuration/common/configuration.js";
import { isLegacyChatTerminalToolInvocationData } from "../../../../common/chatService/chatService.js";
import { IChatToolInvocation } from "../../../../common/chatService/chatService.js";
import { isToolResultInputOutputDetails } from "../../../../common/tools/languageModelToolsService.js";
import { isToolResultOutputDetails } from "../../../../common/tools/languageModelToolsService.js";
import { IChatTodoListService } from "../../../../common/tools/chatTodoListService.js";
import { ExtensionsInstallConfirmationWidgetSubPart } from "./chatExtensionsInstallToolSubPart.js";
import { ChatInputOutputMarkdownProgressPart } from "./chatInputOutputMarkdownProgressPart.js";
import { ChatMcpAppSubPart } from "./chatMcpAppSubPart.js";
import { ChatResultListSubPart } from "./chatResultListSubPart.js";
import { ChatAutomationConfiguredResultSubPart } from "./chatAutomationConfiguredResultSubPart.js";
import { ChatSessionCreatedResultSubPart } from "./chatSessionCreatedResultSubPart.js";
import { ChatSimpleToolProgressPart } from "./chatSimpleToolProgressPart.js";
import { ShunCodeChatToolProgressPart } from "./shunCodeChatToolProgressPart.js";
import { ChatSandboxPrerequisiteConfirmationSubPart } from "./chatSandboxPrerequisiteConfirmationSubPart.js";
import { ChatModifiedFilesConfirmationSubPart } from "./chatModifiedFilesConfirmationSubPart.js";
import { ChatAgentFeedbackReviewConfirmationSubPart } from "./chatAgentFeedbackReviewConfirmationSubPart.js";
import { ChatTerminalToolConfirmationSubPart } from "./chatTerminalToolConfirmationSubPart.js";
import { ChatTerminalToolProgressPart } from "./chatTerminalToolProgressPart.js";
import { ChatToolAuthenticationSubPart } from "./chatToolAuthenticationSubPart.js";
import { ToolConfirmationSubPart } from "./chatToolConfirmationSubPart.js";
import { ChatToolOutputSubPart } from "./chatToolOutputPart.js";
import { ChatToolPostExecuteConfirmationPart } from "./chatToolPostExecuteConfirmationPart.js";
import { ChatToolProgressSubPart } from "./chatToolProgressPart.js";
import { ChatToolStreamingSubPart } from "./chatToolStreamingSubPart.js";
import { ChatOtherClientToolProgressPart } from "./chatOtherClientToolProgressPart.js";
// src/vs/workbench/contrib/chat/browser/widget/chatContentParts/toolInvocationParts/chatToolInvocationPart.ts
function mcpAppRenderDataEquals(a, b) {
  if (a === b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  if (a.kind !== b.kind || a.resourceUri !== b.resourceUri || a.input !== b.input || a.sessionResource.toString() !== b.sessionResource.toString()) {
    return false;
  }
  if (a.kind === "agentHost" && b.kind === "agentHost") {
    return a.serverId === b.serverId && a.channel === b.channel;
  }
  if (a.kind === "local" && b.kind === "local") {
    return a.serverDefinitionId === b.serverDefinitionId && a.collectionId === b.collectionId;
  }
  return false;
}
var ChatToolInvocationPart3 = class extends Disposable {
  constructor(toolInvocation, context2, renderer, listPool, editorPool, currentWidthDelegate, announcedToolProgressKeys, codeBlockStartIndex, instantiationService, chatTodoListService, configurationService) {
    super();
    this.toolInvocation = toolInvocation;
    this.context = context2;
    this.renderer = renderer;
    this.listPool = listPool;
    this.editorPool = editorPool;
    this.currentWidthDelegate = currentWidthDelegate;
    this.announcedToolProgressKeys = announcedToolProgressKeys;
    this.codeBlockStartIndex = codeBlockStartIndex;
    this.instantiationService = instantiationService;
    this.chatTodoListService = chatTodoListService;
    this.mcpAppPart = this._register(new MutableDisposable());
    this._onDidRemount = this._register(new Emitter());
    this.domNode = $(".chat-tool-invocation-part");
    if (toolInvocation.toolId.startsWith("shuncode_") && configurationService.getValue("shuncode.chat.bridgeStyleUI") !== false) {
      this.domNode.classList.add("shuncode-chat-native-tool");
    }
    if (toolInvocation.toolSpecificData?.kind === "simpleToolInvocation" && toolInvocation.toolSpecificData.presentationStyle === "shuncode") {
      this.domNode.classList.add("shuncode-chat-card-tool");
    }
    if (toolInvocation.presentation === "hidden") {
      return;
    }
    if (toolInvocation.toolSpecificData?.kind === "todoList") {
      const sessionResource = context2.element.sessionResource;
      const todos = toolInvocation.toolSpecificData.todoList.map((todo, index2) => {
        const parsedId = parseInt(todo.id, 10);
        const id2 = Number.isNaN(parsedId) ? index2 + 1 : parsedId;
        return {
          id: id2,
          title: todo.title,
          status: todo.status
        };
      });
      this.chatTodoListService.setTodos(sessionResource, todos);
    }
    let appData = constObservable(void 0);
    if (toolInvocation.kind === "toolInvocation") {
      let previousState = toolInvocation.state.get();
      let previousDataKind = toolInvocation.toolSpecificDataKind.get();
      let previousToolSpecificData = toolInvocation.toolSpecificData;
      this._register(autorun(reader => {
        const state = toolInvocation.state.read(reader);
        const dataKind = toolInvocation.toolSpecificDataKind.read(reader);
        const toolSpecificData = toolInvocation.toolSpecificData;
        const stateChanged = state.type !== previousState.type;
        const dataKindChanged = dataKind !== previousDataKind;
        const dataChanged = state !== previousState && toolSpecificData !== previousToolSpecificData;
        const confirmationMessagesChanged = state.type === IChatToolInvocation.StateKind.WaitingForConfirmation && previousState.type === IChatToolInvocation.StateKind.WaitingForConfirmation && state.confirmationMessages !== previousState.confirmationMessages;
        previousState = state;
        previousDataKind = dataKind;
        previousToolSpecificData = toolSpecificData;
        if (stateChanged || dataKindChanged || dataChanged || confirmationMessagesChanged) {
          render();
        }
      }));
      appData = derivedOpts({
        owner: this,
        equalsFn: mcpAppRenderDataEquals
      }, reader => {
        reader.readObservable(toolInvocation.state);
        reader.readObservable(toolInvocation.toolSpecificDataKind);
        const data = this.getMcpAppRenderData();
        if (!data) {
          return void 0;
        }
        const outcome = IChatToolInvocation.executionConfirmedOrDenied(toolInvocation, reader);
        return !!outcome && outcome.type !== 0 /* Denied */ && outcome.type !== 5 /* Skipped */ ? data : void 0;
      });
    } else {
      const data = this.getMcpAppRenderData();
      if (data) {
        const outcome = IChatToolInvocation.executionConfirmedOrDenied(toolInvocation, void 0);
        appData = constObservable(!!outcome && outcome.type !== 0 /* Denied */ && outcome.type !== 5 /* Skipped */ ? data : void 0);
      }
    }
    const partStore = this._register(new DisposableStore());
    let subPartDomNode = document.createElement("div");
    this.domNode.appendChild(subPartDomNode);
    const render = () => {
      partStore.clear();
      if (toolInvocation.presentation === "hidden" /* Hidden */ || toolInvocation.presentation === "hiddenAfterComplete" /* HiddenAfterComplete */ && IChatToolInvocation.isComplete(toolInvocation)) {
        hide(this.domNode);
        return;
      }
      show(this.domNode);
      this.subPart = partStore.add(this.createToolInvocationSubPart());
      subPartDomNode.replaceWith(this.subPart.domNode);
      subPartDomNode = this.subPart.domNode;
      const isConfirmation = this.subPart instanceof ToolConfirmationSubPart || this.subPart instanceof ChatTerminalToolConfirmationSubPart || this.subPart instanceof ChatModifiedFilesConfirmationSubPart || this.subPart instanceof ChatSandboxPrerequisiteConfirmationSubPart || this.subPart instanceof ExtensionsInstallConfirmationWidgetSubPart || this.subPart instanceof ChatToolAuthenticationSubPart || this.subPart instanceof ChatToolPostExecuteConfirmationPart;
      this.domNode.classList.toggle("has-confirmation", isConfirmation);
      partStore.add(this.subPart.onNeedsRerender(render));
    };
    let appDomNode = document.createElement("div");
    this.domNode.appendChild(appDomNode);
    this._register(autorun(r2 => {
      const data = appData.read(r2);
      if (!data) {
        this.mcpAppPart.clear();
        clearNode(appDomNode);
        return;
      }
      this.mcpAppPart.value = this.instantiationService.createInstance(ChatMcpAppSubPart, this.toolInvocation, this._onDidRemount.event, context2, data);
      appDomNode.replaceWith(this.mcpAppPart.value.domNode);
      appDomNode = this.mcpAppPart.value.domNode;
    }));
    render();
  }
  get toolCallId() {
    return this.toolInvocation.toolCallId;
  }
  get codeblocks() {
    const codeblocks = this.subPart?.codeblocks ?? [];
    if (this.mcpAppPart) {
      codeblocks.push(...(this.mcpAppPart.value?.codeblocks ?? []));
    }
    return codeblocks;
  }
  get codeblocksPartId() {
    return this.subPart?.codeblocksPartId;
  }
  createToolInvocationSubPart() {
    if (this.toolInvocation.kind === "toolInvocation") {
      if (this.toolInvocation.otherClientToolCall && !IChatToolInvocation.isComplete(this.toolInvocation)) {
        return this.instantiationService.createInstance(ChatOtherClientToolProgressPart, this.toolInvocation, this.renderer, this.announcedToolProgressKeys);
      }
      if (this.toolInvocation.toolSpecificData?.kind === "extensions") {
        return this.instantiationService.createInstance(ExtensionsInstallConfirmationWidgetSubPart, this.toolInvocation, this.context);
      }
      const state = this.toolInvocation.state.get();
      if (state.type === IChatToolInvocation.StateKind.Streaming) {
        return this.instantiationService.createInstance(ChatToolStreamingSubPart, this.toolInvocation, this.context, this.renderer);
      }
      if (state.type === IChatToolInvocation.StateKind.WaitingForConfirmation) {
        if (this.toolInvocation.toolSpecificData?.kind === "terminal" && !isLegacyChatTerminalToolInvocationData(this.toolInvocation.toolSpecificData) && (this.toolInvocation.toolSpecificData.missingSandboxDependencies?.length || this.toolInvocation.toolSpecificData.sandboxRemediations?.length)) {
          return this.instantiationService.createInstance(ChatSandboxPrerequisiteConfirmationSubPart, this.toolInvocation, this.toolInvocation.toolSpecificData, this.context, this.renderer);
        } else if (this.toolInvocation.toolSpecificData?.kind === "terminal") {
          return this.instantiationService.createInstance(ChatTerminalToolConfirmationSubPart, this.toolInvocation, this.toolInvocation.toolSpecificData, this.context, this.renderer, this.editorPool, this.currentWidthDelegate, this.codeBlockStartIndex);
        } else if (this.toolInvocation.toolSpecificData?.kind === "modifiedFilesConfirmation") {
          return this.instantiationService.createInstance(ChatModifiedFilesConfirmationSubPart, this.toolInvocation, this.context, this.listPool);
        } else if (this.toolInvocation.toolSpecificData?.kind === "agentFeedbackReviewConfirmation") {
          return this.instantiationService.createInstance(ChatAgentFeedbackReviewConfirmationSubPart, this.toolInvocation, this.context);
        } else {
          return this.instantiationService.createInstance(ToolConfirmationSubPart, this.toolInvocation, this.context, this.renderer, this.editorPool, this.currentWidthDelegate, this.codeBlockStartIndex);
        }
      }
      if (state.type === IChatToolInvocation.StateKind.WaitingForAuthentication) {
        return this.instantiationService.createInstance(ChatToolAuthenticationSubPart, this.toolInvocation, this.context);
      }
      if (state.type === IChatToolInvocation.StateKind.WaitingForPostApproval) {
        return this.instantiationService.createInstance(ChatToolPostExecuteConfirmationPart, this.toolInvocation, this.context);
      }
    }
    if (this.toolInvocation.toolSpecificData?.kind === "sessionCreated") {
      return this.instantiationService.createInstance(ChatSessionCreatedResultSubPart, this.toolInvocation, this.toolInvocation.toolSpecificData, this.context, this.renderer);
    }
    if (this.toolInvocation.toolSpecificData?.kind === "automationConfigured") {
      return this.instantiationService.createInstance(ChatAutomationConfiguredResultSubPart, this.toolInvocation, this.toolInvocation.toolSpecificData, this.context, this.renderer);
    }
    if (this.toolInvocation.toolSpecificData?.kind === "terminal") {
      return this.instantiationService.createInstance(ChatTerminalToolProgressPart, this.toolInvocation, this.toolInvocation.toolSpecificData, this.context, this.renderer, this.editorPool, this.currentWidthDelegate, this.codeBlockStartIndex);
    }
    if (this.toolInvocation.toolSpecificData?.kind === "resources" && this.toolInvocation.toolSpecificData.values.length > 0) {
      return this.instantiationService.createInstance(ChatResultListSubPart, this.toolInvocation, this.context, this.toolInvocation.pastTenseMessage ?? this.toolInvocation.invocationMessage, this.toolInvocation.toolSpecificData.values, this.listPool);
    }
    if (this.toolInvocation.toolSpecificData?.kind === "simpleToolInvocation") {
      if (this.toolInvocation.toolSpecificData.presentationStyle === "shuncode") {
        return this.instantiationService.createInstance(ShunCodeChatToolProgressPart, this.toolInvocation, this.toolInvocation.pastTenseMessage ?? this.toolInvocation.invocationMessage, this.toolInvocation.originMessage, this.toolInvocation.toolSpecificData);
      }
      return this.instantiationService.createInstance(ChatSimpleToolProgressPart, this.toolInvocation, this.context, this.codeBlockStartIndex, this.toolInvocation.pastTenseMessage ?? this.toolInvocation.invocationMessage, this.toolInvocation.originMessage, this.toolInvocation.toolSpecificData, false);
    }
    const resultDetails = IChatToolInvocation.resultDetails(this.toolInvocation);
    if (Array.isArray(resultDetails) && resultDetails.length) {
      return this.instantiationService.createInstance(ChatResultListSubPart, this.toolInvocation, this.context, this.toolInvocation.pastTenseMessage ?? this.toolInvocation.invocationMessage, resultDetails, this.listPool);
    }
    if (isToolResultOutputDetails(resultDetails)) {
      return this.instantiationService.createInstance(ChatToolOutputSubPart, this.toolInvocation, this.context, this._onDidRemount.event);
    }
    if (isToolResultInputOutputDetails(resultDetails)) {
      return this.instantiationService.createInstance(ChatInputOutputMarkdownProgressPart, this.toolInvocation, this.context, this.codeBlockStartIndex, this.toolInvocation.pastTenseMessage ?? this.toolInvocation.invocationMessage, this.toolInvocation.originMessage, resultDetails.input, resultDetails.inputLanguage, resultDetails.output, !!resultDetails.isError);
    }
    if (this.toolInvocation.kind === "toolInvocation" && this.toolInvocation.toolSpecificData?.kind === "input" && !IChatToolInvocation.isComplete(this.toolInvocation)) {
      return this.instantiationService.createInstance(ChatInputOutputMarkdownProgressPart, this.toolInvocation, this.context, this.codeBlockStartIndex, this.toolInvocation.invocationMessage, this.toolInvocation.originMessage, typeof this.toolInvocation.toolSpecificData.rawInput === "string" ? this.toolInvocation.toolSpecificData.rawInput : JSON.stringify(this.toolInvocation.toolSpecificData.rawInput, null, 2), void 0, void 0, false);
    }
    return this.instantiationService.createInstance(ChatToolProgressSubPart, this.toolInvocation, this.context, this.renderer, this.announcedToolProgressKeys);
  }
  /**
   * Gets MCP App render data if this tool invocation has MCP App UI.
   * Returns data from either:
   * - toolSpecificData.mcpAppData (for in-progress tools)
   * - result details mcpOutput (for completed tools)
   */
  getMcpAppRenderData() {
    const toolSpecificData = this.toolInvocation.toolSpecificData;
    if (toolSpecificData?.kind === "input" && toolSpecificData.mcpAppData) {
      const rawInput = typeof toolSpecificData.rawInput === "string" ? toolSpecificData.rawInput : JSON.stringify(toolSpecificData.rawInput, null, 2);
      return {
        ...toolSpecificData.mcpAppData,
        input: rawInput,
        sessionResource: this.context.element.sessionResource
      };
    }
    return void 0;
  }
  onDidRemount() {
    this._onDidRemount.fire();
  }
  hasSameContent(other, followingContent, element) {
    if ((other.kind === "toolInvocation" || other.kind === "toolInvocationSerialized") && other.toolSpecificData?.kind === "subagent" && !other.subAgentInvocationId) {
      return false;
    }
    return (other.kind === "toolInvocation" || other.kind === "toolInvocationSerialized") && this.toolInvocation.toolCallId === other.toolCallId;
  }
  addDisposable(disposable) {
    this._register(disposable);
  }
};
ChatToolInvocationPart3 = __decorateClass([__decorateParam(8, IInstantiationService), __decorateParam(9, IChatTodoListService), __decorateParam(10, IConfigurationService)], ChatToolInvocationPart3);

// src/vs/workbench/contrib/chat/browser/widget/chatContentParts/chatSubagentContentPart.ts
export { mcpAppRenderDataEquals, ChatToolInvocationPart3, ChatToolInvocationPart3 as ChatToolInvocationPart };
