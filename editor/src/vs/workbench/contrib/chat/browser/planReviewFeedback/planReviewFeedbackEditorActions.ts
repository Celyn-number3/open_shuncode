// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
import { localize } from "../../../../../nls.js";
import { localize2 } from "../../../../../nls.js";
import { Codicon } from "../../../../../base/common/codicons.js";
import { ContextKeyExpr } from "../../../../../platform/contextkey/common/contextkey.js";
import { RawContextKey } from "../../../../../platform/contextkey/common/contextkey.js";
import { MenuId } from "../../../../../platform/actions/common/actions.js";
import { MenuRegistry } from "../../../../../platform/actions/common/actions.js";
import { Action2 } from "../../../../../platform/actions/common/actions.js";
import { registerAction2 } from "../../../../../platform/actions/common/actions.js";
import { isCodeEditor } from "../../../../../editor/browser/editorBrowser.js";
import { IEditorService } from "../../../../services/editor/common/editorService.js";
import { CHAT_CATEGORY } from "../actions/chatActions.js";
import { IPlanReviewFeedbackService } from "./planReviewFeedbackService.js";
var PlanReviewFeedbackMenuId = MenuId.for("planReviewFeedback.editorContent");
var hasPlanReviewFeedback = new RawContextKey("planReviewFeedback.hasFeedback", false);
var navigatePreviousPlanReviewFeedbackActionId = "planReviewFeedback.action.navigatePrevious";
var navigateNextPlanReviewFeedbackActionId = "planReviewFeedback.action.navigateNext";
var clearAllPlanReviewFeedbackActionId = "planReviewFeedback.action.clearAll";
var navigationBearingFakeActionId2 = "planReviewFeedback.navigation.bearings";
function getActivePlanUri(accessor) {
  const editorService = accessor.get(IEditorService);
  const planReviewFeedbackService = accessor.get(IPlanReviewFeedbackService);
  const activeEditor = editorService.activeEditor;
  if (!activeEditor) {
    return void 0;
  }
  const resource = activeEditor.resource;
  if (!resource) {
    return void 0;
  }
  if (planReviewFeedbackService.isActivePlanReview(resource)) {
    return resource;
  }
  return void 0;
}
var NavigatePlanReviewFeedbackAction = class extends Action2 {
  constructor(_next) {
    super({
      id: _next ? navigateNextPlanReviewFeedbackActionId : navigatePreviousPlanReviewFeedbackActionId,
      title: _next ? localize2("recovered.10469", "Go to Next Feedback Comment") : localize2("recovered.10470", "Go to Previous Feedback Comment"),
      icon: _next ? Codicon.arrowDown : Codicon.arrowUp,
      category: CHAT_CATEGORY,
      f1: true,
      precondition: hasPlanReviewFeedback,
      menu: {
        id: PlanReviewFeedbackMenuId,
        group: "navigate",
        order: _next ? 2 : 1,
        when: hasPlanReviewFeedback
      }
    });
    this._next = _next;
  }
  run(accessor) {
    const planUri = getActivePlanUri(accessor);
    if (!planUri) {
      return;
    }
    const planReviewFeedbackService = accessor.get(IPlanReviewFeedbackService);
    const editorService = accessor.get(IEditorService);
    const item = planReviewFeedbackService.getNextFeedback(planUri, this._next);
    if (!item) {
      return;
    }
    const editor = editorService.activeTextEditorControl;
    if (editor && isCodeEditor(editor)) {
      editor.revealLineInCenter(item.line);
      editor.setPosition({
        lineNumber: item.line,
        column: item.column
      });
    }
  }
};
var ClearAllPlanReviewFeedbackAction = class extends Action2 {
  constructor() {
    super({
      id: clearAllPlanReviewFeedbackActionId,
      title: localize2("recovered.10466", "Clear"),
      tooltip: localize2("recovered.10467", "Clear All Feedback"),
      icon: Codicon.clearAll,
      category: CHAT_CATEGORY,
      f1: true,
      precondition: hasPlanReviewFeedback,
      menu: {
        id: PlanReviewFeedbackMenuId,
        group: "a_actions",
        order: 0,
        when: hasPlanReviewFeedback
      }
    });
  }
  run(accessor) {
    const planUri = getActivePlanUri(accessor);
    if (!planUri) {
      return;
    }
    const planReviewFeedbackService = accessor.get(IPlanReviewFeedbackService);
    planReviewFeedbackService.clearFeedback(planUri);
  }
};
function registerPlanReviewFeedbackEditorActions() {
  registerAction2(class extends NavigatePlanReviewFeedbackAction {
    constructor() {
      super(false);
    }
  });
  registerAction2(class extends NavigatePlanReviewFeedbackAction {
    constructor() {
      super(true);
    }
  });
  registerAction2(ClearAllPlanReviewFeedbackAction);
  MenuRegistry.appendMenuItem(PlanReviewFeedbackMenuId, {
    command: {
      id: navigationBearingFakeActionId2,
      title: localize("recovered.10468", "Navigation Status"),
      precondition: ContextKeyExpr.false()
    },
    group: "navigate",
    order: -1,
    when: hasPlanReviewFeedback
  });
}

// src/vs/workbench/contrib/chat/browser/planReviewFeedback/planReviewFeedbackEditorContribution.ts
export { PlanReviewFeedbackMenuId, hasPlanReviewFeedback, navigatePreviousPlanReviewFeedbackActionId, navigateNextPlanReviewFeedbackActionId, clearAllPlanReviewFeedbackActionId, navigationBearingFakeActionId2, getActivePlanUri, NavigatePlanReviewFeedbackAction, ClearAllPlanReviewFeedbackAction, registerPlanReviewFeedbackEditorActions, navigationBearingFakeActionId2 as navigationBearingFakeActionId };
