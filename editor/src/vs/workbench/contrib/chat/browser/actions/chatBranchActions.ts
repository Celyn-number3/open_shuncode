// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
import { localize2 } from "../../../../../nls.js";
import { Codicon } from "../../../../../base/common/codicons.js";
import { ICommandService } from "../../../../../platform/commands/common/commands.js";
import { ContextKeyExpr } from "../../../../../platform/contextkey/common/contextkey.js";
import { MenuId } from "../../../../../platform/actions/common/actions.js";
import { Action2 } from "../../../../../platform/actions/common/actions.js";
import { registerAction2 } from "../../../../../platform/actions/common/actions.js";
import { IConfigurationService } from "../../../../../platform/configuration/common/configuration.js";
import { ChatContextKeys } from "../../common/actions/chatContextKeys.js";
import { IChatService } from "../../common/chatService/chatService.js";
import { isRequestVM } from "../../common/model/chatViewModel.js";
import { isResponseVM } from "../../common/model/chatViewModel.js";
import { IChatWidgetService } from "../chat.js";
import { CHAT_CATEGORY } from "./chatActions.js";
import { IChatBranchService } from "../chatBranchService.js";
// src/vs/workbench/contrib/chat/browser/actions/chatBranchActions.ts
function getBranchRowContext(accessor, args2) {
  const element = args2[0];
  const widgetService = accessor.get(IChatWidgetService);
  const widget = widgetService.lastFocusedWidget;
  if (!widget?.viewModel) {
    return void 0;
  }
  const item = element && (isRequestVM(element) || isResponseVM(element)) ? element : widget.getFocus();
  if (!item) {
    return void 0;
  }
  return {
    widget,
    rowId: item.id
  };
}
var ChatBranchNavigateAction = class extends Action2 {
  constructor(direction) {
    const isNext = direction === "next";
    super({
      id: isNext ? "workbench.action.chat.shuncode.branchNext" : "workbench.action.chat.shuncode.branchPrev",
      title: isNext ? localize2("recovered.7757", "\u25B6") : localize2("recovered.7758", "\u25C0"),
      f1: false,
      category: CHAT_CATEGORY,
      menu: {
        id: MenuId.ChatMessageFooter,
        group: "navigation",
        order: direction === "next" ? 0.55 : 0.5,
        when: ContextKeyExpr.and(ChatContextKeys.isResponse, isNext ? ChatContextKeys.shunCodeBranchHasNext : ChatContextKeys.shunCodeBranchHasPrev)
      }
    });
    this.direction = direction;
  }
  run(accessor, ...args2) {
    const context2 = getBranchRowContext(accessor, args2);
    if (!context2) {
      return;
    }
    const branchService = accessor.get(IChatBranchService);
    const viewModel = context2.widget.viewModel;
    if (!viewModel) {
      return;
    }
    const sessionResource = viewModel.sessionResource;
    if (!sessionResource) {
      return;
    }
    const info = branchService.getRowInfo(sessionResource, context2.rowId);
    if (!info) {
      return;
    }
    const model = viewModel.model;
    if (model.requestInProgress.get() || model.hasActiveRequest.get()) {
      return;
    }
    const targetIndex = info.variantIndex + (this.direction === "next" ? 1 : -1);
    const target = info.group.variants[targetIndex];
    if (!target) {
      return;
    }
    branchService.setActiveVariant(sessionResource, info.group.id, target.requestId);
  }
};
var ChatBranchMergeAction = class extends Action2 {
  constructor() {
    super({
      id: "workbench.action.chat.shuncode.branchMerge",
      title: localize2("recovered.7756", "\u5408\u5E76\u603B\u7ED3"),
      f1: false,
      category: CHAT_CATEGORY,
      icon: Codicon.gitMerge,
      menu: {
        id: MenuId.ChatMessageFooter,
        group: "navigation",
        order: 1.2,
        when: ContextKeyExpr.and(ChatContextKeys.isResponse, ChatContextKeys.shunCodeBranchCanMerge)
      }
    });
  }
  async run(accessor, ...args2) {
    const context2 = getBranchRowContext(accessor, args2);
    if (!context2) {
      return;
    }
    const {
      widget,
      rowId
    } = context2;
    const sessionResource = widget.viewModel?.sessionResource;
    if (!sessionResource) {
      return;
    }
    const model = widget.viewModel.model;
    if (model.requestInProgress.get() || model.hasActiveRequest.get()) {
      return;
    }
    if (!(accessor.get(IConfigurationService).getValue("shuncode.multiModel.enabled") ?? true)) {
      return;
    }
    const branchService = accessor.get(IChatBranchService);
    const info = branchService.getRowInfo(sessionResource, rowId);
    if (!info || info.canMerge === false) {
      return;
    }
    await widget.acceptInput(void 0, {
      shunCodeBranchIntent: {
        kind: "merge",
        groupId: info.group.id
      },
      forceEmptyInput: true,
      isSystemInitiated: true,
      systemInitiatedLabel: "\u5408\u5E76\u603B\u7ED3"
    });
  }
};
var ChatBranchAdoptAction = class extends Action2 {
  constructor() {
    super({
      id: "workbench.action.chat.shuncode.branchAdopt",
      title: localize2("recovered.7754", "\u91C7\u7EB3"),
      f1: false,
      category: CHAT_CATEGORY,
      icon: Codicon.check,
      menu: {
        id: MenuId.ChatMessageFooter,
        group: "navigation",
        order: 1.4,
        when: ContextKeyExpr.and(ChatContextKeys.isResponse, ChatContextKeys.shunCodeBranchCanAdopt)
      }
    });
  }
  async run(accessor, ...args2) {
    const context2 = getBranchRowContext(accessor, args2);
    if (!context2) {
      return;
    }
    const {
      widget,
      rowId
    } = context2;
    const sessionResource = widget.viewModel?.sessionResource;
    if (!sessionResource) {
      return;
    }
    const branchService = accessor.get(IChatBranchService);
    const info = branchService.getRowInfo(sessionResource, rowId);
    if (!info) {
      return;
    }
    const variant = info.group.variants[info.variantIndex];
    branchService.adoptVariant(sessionResource, variant.requestId);
    await accessor.get(ICommandService).executeCommand("shuncode.branch.adoptVariant", info.group.id, variant.requestId);
  }
};
var ChatBranchDeleteAction = class extends Action2 {
  constructor() {
    super({
      id: "workbench.action.chat.shuncode.branchDelete",
      title: localize2("recovered.7755", "\u5220\u9664\u5206\u652F"),
      f1: false,
      category: CHAT_CATEGORY,
      icon: Codicon.trash,
      menu: {
        id: MenuId.ChatMessageFooter,
        group: "navigation",
        order: 1.6,
        when: ContextKeyExpr.and(ChatContextKeys.isResponse, ChatContextKeys.shunCodeBranchCanDelete)
      }
    });
  }
  async run(accessor, ...args2) {
    const context2 = getBranchRowContext(accessor, args2);
    if (!context2) {
      return;
    }
    const {
      widget,
      rowId
    } = context2;
    const sessionResource = widget.viewModel?.sessionResource;
    if (!sessionResource) {
      return;
    }
    const model = widget.viewModel.model;
    if (model.requestInProgress.get() || model.hasActiveRequest.get()) {
      return;
    }
    const branchService = accessor.get(IChatBranchService);
    const info = branchService.getRowInfo(sessionResource, rowId);
    if (!info || info.canDelete === false) {
      return;
    }
    const variant = info.group.variants[info.variantIndex];
    await accessor.get(IChatService).removeRequest(sessionResource, variant.requestId);
    branchService.removeRequest(sessionResource, variant.requestId);
  }
};
function registerChatBranchActions() {
  registerAction2(class ChatBranchPrevAction extends ChatBranchNavigateAction {
    constructor() {
      super("previous");
    }
  });
  registerAction2(class ChatBranchNextAction extends ChatBranchNavigateAction {
    constructor() {
      super("next");
    }
  });
  registerAction2(ChatBranchMergeAction);
  registerAction2(ChatBranchAdoptAction);
  registerAction2(ChatBranchDeleteAction);
}

// src/vs/workbench/contrib/chat/browser/actions/openCopilotCliStateFileAction.ts
export { getBranchRowContext, ChatBranchNavigateAction, ChatBranchMergeAction, ChatBranchAdoptAction, ChatBranchDeleteAction, registerChatBranchActions };
