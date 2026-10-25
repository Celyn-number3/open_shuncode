// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
import { __decorateClass } from "../../../../../base/common/shunCodeRecoveredHelpersWorkbench.js";
import { __decorateParam } from "../../../../../base/common/shunCodeRecoveredHelpersWorkbench.js";
import { localize } from "../../../../../nls.js";
import { DisposableStore } from "../../../../../base/common/lifecycle.js";
import { Disposable } from "../../../../../base/common/lifecycle.js";
import { Emitter } from "../../../../../base/common/event.js";
import { observableValue } from "../../../../../base/common/observableInternal/observables/observableValue.js";
import { autorun } from "../../../../../base/common/observableInternal/reactions/autorun.js";
import { getWindow } from "../../../../../base/browser/dom.js";
import { addStandardDisposableListener } from "../../../../../base/browser/dom.js";
import { IInstantiationService } from "../../../../../platform/instantiation/common/instantiation.js";
import { Action } from "../../../../../base/common/actions.js";
import { Codicon } from "../../../../../base/common/codicons.js";
import { ThemeIcon } from "../../../../../base/common/themables.js";
import { IContextKeyService } from "../../../../../platform/contextkey/common/contextkey.js";
import { registerEditorContribution } from "../../../../../editor/browser/editorExtensions.js";
import { Range as Range2 } from "../../../../../editor/common/core/range.js";
import { themeColorFromId as themeColorFromId2 } from "../../../../../platform/theme/common/themeService.js";
import { overviewRulerInfo } from "../../../../../editor/common/core/editorColorRegistry.js";
import { ActionViewItem } from "../../../../../base/browser/ui/actionbar/actionViewItems.js";
import { ActionBar } from "../../../../../base/browser/ui/actionbar/actionbar.js";
import { MenuWorkbenchToolBar } from "../../../../../platform/actions/browser/toolbar.js";
import { IPlanReviewFeedbackService } from "./planReviewFeedbackService.js";
import { PlanReviewFeedbackMenuId } from "./planReviewFeedbackEditorActions.js";
import { hasPlanReviewFeedback } from "./planReviewFeedbackEditorActions.js";
import { navigationBearingFakeActionId as navigationBearingFakeActionId2 } from "./planReviewFeedbackEditorActions.js";
var PlanReviewFeedbackInputWidget = class _PlanReviewFeedbackInputWidget {
  constructor(_editor) {
    this._editor = _editor;
    this.allowEditorOverflow = false;
    this._position = null;
    this._lineHeight = 22;
    this._onDidTriggerAdd = new Emitter();
    this.onDidTriggerAdd = this._onDidTriggerAdd.event;
    this._domNode = document.createElement("div");
    this._domNode.classList.add("plan-review-feedback-input-widget");
    this._domNode.style.display = "none";
    this._inputElement = document.createElement("textarea");
    this._inputElement.rows = 1;
    this._inputElement.placeholder = localize("recovered.10472", "Add Feedback");
    this._domNode.appendChild(this._inputElement);
    this._measureElement = document.createElement("span");
    this._measureElement.classList.add("plan-review-feedback-input-measure");
    this._domNode.appendChild(this._measureElement);
    const actionsContainer = document.createElement("div");
    actionsContainer.classList.add("plan-review-feedback-input-actions");
    this._domNode.appendChild(actionsContainer);
    this._addAction = new Action("planReviewFeedback.add", localize("recovered.10471", "Add Feedback (Enter)"), ThemeIcon.asClassName(Codicon.plus), false, () => {
      this._onDidTriggerAdd.fire();
      return Promise.resolve();
    });
    this._actionBar = new ActionBar(actionsContainer);
    this._actionBar.push(this._addAction, {
      icon: true,
      label: false,
      keybinding: localize("recovered.10473", "Enter")
    });
    this._inputElement.style.lineHeight = `${this._lineHeight}px`;
  }
  static {
    this._ID = "planReviewFeedback.inputWidget";
  }
  static {
    this._MIN_WIDTH = 150;
  }
  static {
    this._MAX_WIDTH = 400;
  }
  getId() {
    return _PlanReviewFeedbackInputWidget._ID;
  }
  getDomNode() {
    return this._domNode;
  }
  getPosition() {
    return this._position;
  }
  get inputElement() {
    return this._inputElement;
  }
  setPosition(position2) {
    this._position = position2;
    this._editor.layoutOverlayWidget(this);
  }
  show() {
    this._domNode.style.display = "";
  }
  hide() {
    this._domNode.style.display = "none";
  }
  clearInput() {
    this._inputElement.value = "";
    this._updateActionEnabled();
    this._autoSize();
  }
  autoSize() {
    this._autoSize();
  }
  updateActionEnabled() {
    this._updateActionEnabled();
  }
  _updateActionEnabled() {
    const hasText = this._inputElement.value.trim().length > 0;
    this._addAction.enabled = hasText;
  }
  _autoSize() {
    const text2 = this._inputElement.value || this._inputElement.placeholder;
    this._measureElement.textContent = text2;
    const textWidth = this._measureElement.scrollWidth;
    const width2 = Math.max(_PlanReviewFeedbackInputWidget._MIN_WIDTH, Math.min(textWidth + 10, _PlanReviewFeedbackInputWidget._MAX_WIDTH));
    this._inputElement.style.width = `${width2}px`;
    this._inputElement.style.height = "auto";
    const newHeight = Math.max(this._inputElement.scrollHeight, this._lineHeight);
    this._inputElement.style.height = `${newHeight}px`;
  }
  dispose() {
    this._actionBar.dispose();
    this._addAction.dispose();
    this._onDidTriggerAdd.dispose();
  }
};
var PlanReviewFeedbackOverlayWidget = class _PlanReviewFeedbackOverlayWidget {
  constructor(_codeEditor, _instaService) {
    this._instaService = _instaService;
    this._showStore = new DisposableStore();
    this._navigationBearings = observableValue("planReviewFeedbackBearings", {
      activeIdx: -1,
      totalCount: 0
    });
    this._domNode = document.createElement("div");
    this._domNode.classList.add("plan-review-feedback-overlay-widget");
    this._domNode.style.display = "none";
    this._toolbarNode = document.createElement("div");
    this._toolbarNode.classList.add("plan-review-feedback-overlay-toolbar");
    this._domNode.appendChild(this._toolbarNode);
  }
  static {
    this._ID = "planReviewFeedback.overlayWidget";
  }
  getId() {
    return _PlanReviewFeedbackOverlayWidget._ID;
  }
  getDomNode() {
    return this._domNode;
  }
  getPosition() {
    return {
      preference: 1 /* BOTTOM_RIGHT_CORNER */
    };
  }
  show(navigationBearings) {
    this._showStore.clear();
    this._navigationBearings.set(navigationBearings, void 0);
    this._domNode.style.display = "";
    this._showStore.add(this._instaService.createInstance(MenuWorkbenchToolBar, this._toolbarNode, PlanReviewFeedbackMenuId, {
      telemetrySource: "planReviewFeedback.overlayToolbar",
      hiddenItemStrategy: 0 /* Ignore */,
      toolbarOptions: {
        primaryGroup: () => true,
        useSeparatorsInPrimaryActions: true
      },
      menuOptions: {
        renderShortTitle: true
      },
      actionViewItemProvider: (action, options3) => {
        if (action.id === navigationBearingFakeActionId2) {
          const that = this;
          return new class extends ActionViewItem {
            constructor() {
              super(void 0, action, {
                ...options3,
                icon: false,
                label: true,
                keybindingNotRenderedWithLabel: true
              });
            }
            render(container3) {
              super.render(container3);
              container3.classList.add("label-item");
              this._store.add(autorun(r2 => {
                if (!this.label) {
                  return;
                }
                const {
                  activeIdx,
                  totalCount
                } = that._navigationBearings.read(r2);
                if (totalCount > 0) {
                  const current = activeIdx === -1 ? 1 : activeIdx + 1;
                  this.label.innerText = localize("recovered.10474", "{0}/{1}", current, totalCount);
                } else {
                  this.label.innerText = localize("recovered.10475", "0/0");
                }
              }));
            }
          }();
        }
        return new ActionViewItem(void 0, action, {
          ...options3,
          icon: true,
          label: false,
          keybindingNotRenderedWithLabel: true
        });
      }
    }));
  }
  hide() {
    this._showStore.clear();
    this._domNode.style.display = "none";
    this._navigationBearings.set({
      activeIdx: -1,
      totalCount: 0
    }, void 0);
  }
  dispose() {
    this._showStore.dispose();
  }
};
var PlanReviewFeedbackEditorContribution = class extends Disposable {
  constructor(_editor, _planReviewFeedbackService, contextKeyService, _instantiationService) {
    super();
    this._editor = _editor;
    this._planReviewFeedbackService = _planReviewFeedbackService;
    this._instantiationService = _instantiationService;
    this._visible = false;
    this._mouseDown = false;
    this._suppressSelectionChangeOnce = false;
    this._isActivePlan = false;
    this._widgetListeners = this._register(new DisposableStore());
    this._decorations = this._editor.createDecorationsCollection();
    this._hasFeedbackContextKey = hasPlanReviewFeedback.bindTo(contextKeyService);
    this._register(this._editor.onDidChangeCursorSelection(() => this._onSelectionChanged()));
    this._register(this._editor.onDidChangeModel(() => this._onModelChanged()));
    this._register(this._editor.onDidScrollChange(() => {
      if (this._visible) {
        this._updatePosition();
      }
    }));
    this._register(this._editor.onMouseDown(e => {
      if (this._isWidgetTarget(e.event.target)) {
        return;
      }
      this._mouseDown = true;
      this._hide();
    }));
    this._register(this._editor.onMouseUp(e => {
      this._mouseDown = false;
      if (this._isWidgetTarget(e.event.target)) {
        return;
      }
      this._onSelectionChanged();
    }));
    this._register(this._editor.onDidBlurEditorWidget(() => {
      if (!this._visible) {
        return;
      }
      getWindow(this._editor.getDomNode()).setTimeout(() => {
        if (!this._visible) {
          return;
        }
        if (this._isWidgetTarget(getWindow(this._editor.getDomNode()).document.activeElement)) {
          return;
        }
        this._hide();
      }, 0);
    }));
    this._register(this._editor.onDidFocusEditorText(() => this._onSelectionChanged()));
    this._register(this._planReviewFeedbackService.onDidChangeRegistrations(() => this._onModelChanged()));
    this._register(this._planReviewFeedbackService.onDidChangeFeedback(() => this._updateDecorations()));
    this._register(this._planReviewFeedbackService.onDidChangeNavigation(() => this._updateDecorations()));
    this._onModelChanged();
  }
  static {
    this.ID = "planReviewFeedback.editorContribution";
  }
  _isWidgetTarget(target) {
    return !!this._widget && !!target && this._widget.getDomNode().contains(target);
  }
  _ensureWidget() {
    if (!this._widget) {
      this._widget = new PlanReviewFeedbackInputWidget(this._editor);
      this._register(this._widget.onDidTriggerAdd(() => this._addFeedback()));
      this._editor.addOverlayWidget(this._widget);
    }
    return this._widget;
  }
  _onModelChanged() {
    this._hide();
    this._suppressSelectionChangeOnce = false;
    const model = this._editor.getModel();
    this._isActivePlan = !!model && this._planReviewFeedbackService.isActivePlanReview(model.uri);
    this._updateDecorations();
  }
  _onSelectionChanged() {
    if (this._suppressSelectionChangeOnce) {
      this._suppressSelectionChangeOnce = false;
      return;
    }
    if (this._mouseDown || !this._editor.hasTextFocus()) {
      return;
    }
    if (!this._isActivePlan) {
      this._hide();
      return;
    }
    const selection = this._editor.getSelection();
    if (!selection) {
      this._hide();
      return;
    }
    const model = this._editor.getModel();
    if (!model) {
      this._hide();
      return;
    }
    this._show();
  }
  _show() {
    const widget = this._ensureWidget();
    const wasVisible = this._visible;
    if (!wasVisible) {
      this._visible = true;
      this._registerWidgetListeners(widget);
      widget.clearInput();
    }
    widget.show();
    this._updatePosition();
  }
  _hide() {
    if (!this._visible) {
      return;
    }
    this._visible = false;
    this._widgetListeners.clear();
    if (this._widget) {
      this._widget.hide();
      this._widget.setPosition(null);
      this._widget.clearInput();
    }
  }
  _registerWidgetListeners(widget) {
    this._widgetListeners.clear();
    const editorDomNode = this._editor.getDomNode();
    if (editorDomNode) {
      this._widgetListeners.add(addStandardDisposableListener(editorDomNode, "keydown", e => {
        if (!this._visible) {
          return;
        }
        if (!this._editor.hasTextFocus()) {
          return;
        }
        if (e.keyCode === 5 /* Ctrl */ || e.keyCode === 4 /* Shift */ || e.keyCode === 6 /* Alt */ || e.keyCode === 57 /* Meta */) {
          return;
        }
        if (e.keyCode === 9 /* Escape */) {
          this._hide();
          this._editor.focus();
          return;
        }
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 39 /* KeyI */) {
          e.preventDefault();
          e.stopPropagation();
          widget.inputElement.focus();
          return;
        }
        if (e.ctrlKey || e.altKey || e.metaKey) {
          return;
        }
        if (e.keyCode === 16 /* UpArrow */ || e.keyCode === 18 /* DownArrow */ || e.keyCode === 15 /* LeftArrow */ || e.keyCode === 17 /* RightArrow */) {
          return;
        }
        if (!this._editor.getOption(104 /* readOnly */)) {
          return;
        }
        if (getWindow(widget.inputElement).document.activeElement !== widget.inputElement) {
          widget.inputElement.focus();
        }
      }));
    }
    this._widgetListeners.add(addStandardDisposableListener(widget.inputElement, "keydown", e => {
      if (e.keyCode === 9 /* Escape */) {
        e.preventDefault();
        e.stopPropagation();
        this._hide();
        this._editor.focus();
        return;
      }
      if (e.keyCode === 3 /* Enter */ && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        this._addFeedback();
        return;
      }
    }));
    this._widgetListeners.add(addStandardDisposableListener(widget.inputElement, "keypress", e => {
      e.stopPropagation();
    }));
    this._widgetListeners.add(addStandardDisposableListener(widget.inputElement, "input", () => {
      widget.autoSize();
      widget.updateActionEnabled();
      this._updatePosition();
    }));
    this._widgetListeners.add(addStandardDisposableListener(widget.inputElement, "blur", () => {
      const win = getWindow(widget.inputElement);
      win.setTimeout(() => {
        if (!this._visible) {
          return;
        }
        if (this._editor.hasWidgetFocus()) {
          return;
        }
        this._hide();
      }, 0);
    }));
  }
  _hideAndRefocusEditor() {
    this._suppressSelectionChangeOnce = true;
    this._hide();
    this._editor.focus();
  }
  _addFeedback() {
    if (!this._widget) {
      return false;
    }
    const text2 = this._widget.inputElement.value.trim();
    if (!text2) {
      return false;
    }
    const selection = this._editor.getSelection();
    const model = this._editor.getModel();
    if (!selection || !model) {
      return false;
    }
    const line = selection.startLineNumber;
    const column = selection.startColumn;
    this._planReviewFeedbackService.addFeedback(model.uri, line, column, text2);
    this._hideAndRefocusEditor();
    return true;
  }
  _updatePosition() {
    if (!this._widget || !this._visible) {
      return;
    }
    const selection = this._editor.getSelection();
    if (!selection) {
      this._hide();
      return;
    }
    const lineHeight = this._editor.getOption(75 /* lineHeight */);
    const layoutInfo = this._editor.getLayoutInfo();
    const widgetDom = this._widget.getDomNode();
    const widgetHeight = widgetDom.offsetHeight || 30;
    const widgetWidth = widgetDom.offsetWidth || 150;
    const cursorPosition = selection.getDirection() === 0 /* LTR */ ? selection.getEndPosition() : selection.getStartPosition();
    const scrolledPosition = this._editor.getScrolledVisiblePosition(cursorPosition);
    if (!scrolledPosition) {
      this._widget.setPosition(null);
      return;
    }
    let top2;
    if (selection.getDirection() === 0 /* LTR */) {
      top2 = scrolledPosition.top + lineHeight;
      if (top2 + widgetHeight > layoutInfo.height) {
        top2 = scrolledPosition.top - widgetHeight;
      }
    } else {
      top2 = scrolledPosition.top - widgetHeight;
      if (top2 < 0) {
        top2 = scrolledPosition.top + lineHeight;
      }
    }
    top2 = Math.max(0, Math.min(top2, layoutInfo.height - widgetHeight));
    const left = Math.max(0, Math.min(scrolledPosition.left, layoutInfo.width - widgetWidth));
    this._widget.setPosition({
      preference: {
        top: top2,
        left
      }
    });
  }
  _updateDecorations() {
    const model = this._editor.getModel();
    if (!model || !this._isActivePlan) {
      this._decorations.clear();
      this._hasFeedbackContextKey.set(false);
      this._hideOverlayToolbar();
      return;
    }
    const items = this._planReviewFeedbackService.getFeedback(model.uri);
    this._hasFeedbackContextKey.set(items.length > 0);
    if (items.length > 0) {
      const bearings = this._planReviewFeedbackService.getNavigationBearing(model.uri);
      this._showOverlayToolbar(bearings);
    } else {
      this._hideOverlayToolbar();
    }
    this._decorations.set(items.map(item => ({
      range: new Range2(item.line, item.column, item.line, item.column),
      options: {
        description: "plan-review-feedback",
        glyphMarginClassName: ThemeIcon.asClassName(Codicon.comment),
        glyphMarginHoverMessage: {
          value: item.text
        },
        overviewRuler: {
          color: themeColorFromId2(overviewRulerInfo),
          position: 2 /* Center */
        },
        lineNumberClassName: "plan-review-feedback-line-number"
      }
    })));
  }
  _ensureOverlayWidget() {
    if (!this._overlayWidget) {
      this._overlayWidget = new PlanReviewFeedbackOverlayWidget(this._editor, this._instantiationService);
      this._editor.addOverlayWidget(this._overlayWidget);
    }
    return this._overlayWidget;
  }
  _showOverlayToolbar(bearings) {
    const widget = this._ensureOverlayWidget();
    widget.show(bearings);
  }
  _hideOverlayToolbar() {
    if (this._overlayWidget) {
      this._overlayWidget.hide();
    }
  }
  dispose() {
    if (this._widget) {
      this._editor.removeOverlayWidget(this._widget);
      this._widget.dispose();
      this._widget = void 0;
    }
    if (this._overlayWidget) {
      this._editor.removeOverlayWidget(this._overlayWidget);
      this._overlayWidget.dispose();
      this._overlayWidget = void 0;
    }
    super.dispose();
  }
};
PlanReviewFeedbackEditorContribution = __decorateClass([__decorateParam(1, IPlanReviewFeedbackService), __decorateParam(2, IContextKeyService), __decorateParam(3, IInstantiationService)], PlanReviewFeedbackEditorContribution);
registerEditorContribution(PlanReviewFeedbackEditorContribution.ID, PlanReviewFeedbackEditorContribution, 3 /* Eventually */);

// src/vs/workbench/contrib/chat/browser/pluginUrlHandler.ts
export { PlanReviewFeedbackInputWidget, PlanReviewFeedbackOverlayWidget, PlanReviewFeedbackEditorContribution };
