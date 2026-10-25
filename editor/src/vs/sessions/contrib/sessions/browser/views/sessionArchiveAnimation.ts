// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
import { DeferredPromise } from "../../../../../base/common/async.js";
var SESSION_ARCHIVE_ANIMATION_CLASS = "session-archive-animation";
var SESSION_ARCHIVE_PULSE_CLASS = "session-archive-catch-pulse";
var SESSION_ARCHIVE_ROW_ANIMATION_DURATION = 240;
var SESSION_ARCHIVE_PULSE_ANIMATION_DELAY = 110;
var SESSION_ARCHIVE_PULSE_ANIMATION_DURATION = 150;
var SessionArchiveAnimation = class {
  constructor(_element, _previousTransformOrigin, _pulseElement, _animations) {
    this._element = _element;
    this._previousTransformOrigin = _previousTransformOrigin;
    this._pulseElement = _pulseElement;
    this._animations = _animations;
    this._finished = new DeferredPromise();
    this.finished = this._finished.p;
    this._animationListeners = /* @__PURE__ */new Map();
    this._disposed = false;
    this._element.classList.add(SESSION_ARCHIVE_ANIMATION_CLASS);
    for (const animation of this._animations) {
      const listener = () => this._completeAnimation(animation);
      this._animationListeners.set(animation, listener);
      animation.addEventListener("finish", listener);
      animation.addEventListener("cancel", listener);
    }
  }
  _completeAnimation(animation) {
    const listener = this._animationListeners.get(animation);
    if (!listener) {
      return;
    }
    animation.removeEventListener("finish", listener);
    animation.removeEventListener("cancel", listener);
    this._animationListeners.delete(animation);
    if (this._animationListeners.size === 0) {
      this._pulseElement.remove();
      void this._finished.complete(void 0);
    }
  }
  dispose() {
    if (this._disposed) {
      return;
    }
    this._disposed = true;
    void this._finished.complete(void 0);
    for (const animation of this._animations) {
      const listener = this._animationListeners.get(animation);
      if (listener) {
        animation.removeEventListener("finish", listener);
        animation.removeEventListener("cancel", listener);
      }
      animation.cancel();
    }
    this._animationListeners.clear();
    this._pulseElement.remove();
    this._element.classList.remove(SESSION_ARCHIVE_ANIMATION_CLASS);
    this._element.style.transformOrigin = this._previousTransformOrigin;
  }
};
function createSessionArchiveAnimation(element, targetBounds, overlayHost, animationFactory) {
  const elementBounds = element.getBoundingClientRect();
  if (elementBounds.width <= 0 || elementBounds.height <= 0 || targetBounds.width <= 0 || targetBounds.height <= 0) {
    return void 0;
  }
  if (!animationFactory && typeof element.animate !== "function") {
    return void 0;
  }
  const originX = Math.min(elementBounds.width, Math.max(0, targetBounds.left + targetBounds.width / 2 - elementBounds.left));
  const originY = Math.min(elementBounds.height, Math.max(0, targetBounds.top + targetBounds.height / 2 - elementBounds.top));
  const transformOrigin = `${originX}px ${originY}px`;
  const previousTransformOrigin = element.style.transformOrigin;
  element.style.transformOrigin = transformOrigin;
  const rowKeyframes = [{
    opacity: 1,
    transform: "translate3d(0, 0, 0) scale(1) rotate(0deg)"
  }, {
    opacity: 1,
    transform: "translate3d(0, -1px, 0) scale(1.008) rotate(-0.25deg)",
    offset: 0.18
  }, {
    opacity: 0.88,
    transform: "translate3d(0, 0, 0) scale(0.98, 0.28) rotate(0.5deg)",
    offset: 0.62
  }, {
    opacity: 0,
    transform: "translate3d(0, 0, 0) scale(0.04) rotate(1deg)"
  }];
  const rowOptions = {
    duration: SESSION_ARCHIVE_ROW_ANIMATION_DURATION,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    fill: "forwards"
  };
  const pulseElement = element.ownerDocument.createElement("div");
  pulseElement.className = SESSION_ARCHIVE_PULSE_CLASS;
  pulseElement.setAttribute("aria-hidden", "true");
  pulseElement.style.left = `${targetBounds.left + targetBounds.width / 2}px`;
  pulseElement.style.top = `${targetBounds.top + targetBounds.height / 2}px`;
  overlayHost.appendChild(pulseElement);
  const pulseKeyframes = [{
    opacity: 0,
    transform: "translate(-50%, -50%) scale(0.55)"
  }, {
    opacity: 0.38,
    transform: "translate(-50%, -50%) scale(0.82)",
    offset: 0.35
  }, {
    opacity: 0,
    transform: "translate(-50%, -50%) scale(1.35)"
  }];
  const pulseOptions = {
    delay: SESSION_ARCHIVE_PULSE_ANIMATION_DELAY,
    duration: SESSION_ARCHIVE_PULSE_ANIMATION_DURATION,
    easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    fill: "both"
  };
  const animate2 = animationFactory ?? ((target, keyframes, options3) => target.animate(keyframes, options3));
  let rowAnimation;
  try {
    rowAnimation = animate2(element, rowKeyframes, rowOptions);
    const pulseAnimation = animate2(pulseElement, pulseKeyframes, pulseOptions);
    return new SessionArchiveAnimation(element, previousTransformOrigin, pulseElement, [rowAnimation, pulseAnimation]);
  } catch (error) {
    rowAnimation?.cancel();
    pulseElement.remove();
    element.style.transformOrigin = previousTransformOrigin;
    throw error;
  }
}

// src/vs/sessions/contrib/sessions/browser/views/sessionsList.ts
export { SESSION_ARCHIVE_ANIMATION_CLASS, SESSION_ARCHIVE_PULSE_CLASS, SESSION_ARCHIVE_ROW_ANIMATION_DURATION, SESSION_ARCHIVE_PULSE_ANIMATION_DELAY, SESSION_ARCHIVE_PULSE_ANIMATION_DURATION, SessionArchiveAnimation, createSessionArchiveAnimation };
