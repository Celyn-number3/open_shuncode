// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
import { __esm } from "../../../base/common/shunCodeRecoveredHelpersMain.js";
// src/vs/platform/browserView/electron-main/browserArenaFollowLatestPage.ts
function installArenaFollowLatest(initialEnabled) {
  const host = window;
  if (location.protocol !== "https:" || !/^(www\.)?arena\.ai$/.test(location.hostname)) {
    host.__shuncodeArenaFollowLatest?.dispose();
    delete host.__shuncodeArenaFollowLatest;
    return;
  }
  if (host.__shuncodeArenaFollowLatest) {
    host.__shuncodeArenaFollowLatest.setEnabled(initialEnabled);
    return;
  }
  const visible = element => element.getClientRects().length > 0 && getComputedStyle(element).visibility !== "hidden";
  const label = element => (element.getAttribute("aria-label") || element.getAttribute("title") || element.textContent || "").trim().replace(/\s+/g, " ");
  const forbidden = /copy|clipboard|copied|复制|拷贝|share|more|thumb|like|dislike|send|stop|attach|new chat|sidebar|发送|停止|赞|踩/i;
  let enabled = initialEnabled,
    generating = false,
    disposed = false,
    suspended = false;
  let lastClick = -Infinity,
    touchY;
  let scheduled, interval;
  const tops = /* @__PURE__ */new WeakMap();
  const snapshot = () => ({
    enabled,
    generating
  });
  const mainElement = () => [...document.querySelectorAll("main")].find(visible);
  const isGenerating = main => {
    const explicit = main.querySelectorAll('[data-is-streaming="true"],[data-streaming="true"],[data-message-author-role="assistant"][aria-busy="true"]');
    if ([...explicit].some(visible)) {
      return true;
    }
    return [...main.querySelectorAll('button,[role="button"]')].some(button => visible(button) && !button.closest('[role="log"],[role="dialog"],dialog') && (/^(stop( generating| generation| response| responding)?|停止(生成|回答|响应|输出)?|停止する|生成を停止|중지|생성 중지)$/i.test(label(button)) || /^(stop-button|stop-generating|stop-generation|stop-response)$/.test(button.getAttribute("data-testid") || "")));
  };
  const pause = () => {
    enabled = false;
    if (scheduled !== void 0) {
      window.clearTimeout(scheduled);
      scheduled = void 0;
    }
  };
  const selection = () => {
    const value = document.getSelection();
    return !!value && !value.isCollapsed;
  };
  const reconcile = main => {
    const next = !!main && isGenerating(main);
    if (next && !generating) {
      enabled = true;
      lastClick = -Infinity;
    }
    generating = next;
  };
  const trackScrollers = main => {
    for (const element of [document.scrollingElement, main, ...main.querySelectorAll("*")].slice(0, 512)) {
      if (element && element.scrollHeight > element.clientHeight) {
        tops.set(element, element.scrollTop);
      }
    }
  };
  const tick = () => {
    if (disposed || suspended) {
      return;
    }
    const main = mainElement();
    reconcile(main);
    if (!main || !generating || !enabled || document.hidden) {
      return;
    }
    if (Date.now() - lastClick < 1200 || [...document.querySelectorAll('[role="dialog"],dialog[open]')].some(visible)) {
      return;
    }
    trackScrollers(main);
    const buttons = [...main.querySelectorAll('button,[role="button"]')].filter(button => visible(button) && !button.hasAttribute("disabled") && button.getAttribute("aria-disabled") !== "true" && !button.closest('[role="log"],[role="dialog"],dialog') && !forbidden.test(label(button)));
    let jump = buttons.find(button => /^(scroll to (bottom|latest)|jump to (bottom|latest)|latest message|回到底部|滚动到最新|最新消息)$/i.test(label(button)));
    if (!jump) {
      const composer = [...main.querySelectorAll('[contenteditable="true"],textarea')].find(visible);
      if (!composer) {
        return;
      }
      const box = composer.getBoundingClientRect();
      jump = buttons.find(button => {
        const text = label(button);
        if (text && !/^[↓▼]$/.test(text)) {
          return false;
        }
        if (!/^[↓▼]$/.test(text) && !button.querySelector('svg.lucide-arrow-down,svg.lucide-chevron-down,svg[data-lucide="arrow-down"]')) {
          return false;
        }
        const rect = button.getBoundingClientRect();
        return rect.width >= 24 && rect.width <= 56 && rect.height >= 24 && rect.height <= 56 && Math.abs(rect.width - rect.height) <= 12 && rect.bottom <= box.top + 16 && rect.bottom >= box.top - 120 && rect.left >= box.left && rect.right <= box.right;
      });
    }
    if (jump) {
      lastClick = Date.now();
      jump.click();
    }
  };
  const schedule = () => {
    if (disposed || suspended) {
      return;
    }
    reconcile(mainElement());
    if (scheduled === void 0) {
      scheduled = window.setTimeout(() => {
        scheduled = void 0;
        tick();
      }, 100);
    }
  };
  const wheel = event => {
    if (generating && event.deltaY < 0) {
      pause();
    }
  };
  const touchStart = event => {
    touchY = event.touches[0]?.clientY;
  };
  const touchMove = event => {
    const y = event.touches[0]?.clientY;
    if (generating && y !== void 0 && touchY !== void 0 && y > touchY + 2) {
      pause();
    }
    touchY = y;
  };
  const key = event => {
    const target = event.target;
    if (target instanceof Element && target.closest('input,textarea,[contenteditable="true"]')) {
      return;
    }
    if (generating && (["ArrowUp", "PageUp", "Home"].includes(event.key) || event.key === " " && event.shiftKey)) {
      pause();
    }
  };
  const selected = () => {
    if (generating && selection()) {
      pause();
    }
  };
  const scrolled = event => {
    const target = event.target === document ? document.scrollingElement : event.target;
    if (!(target instanceof Element)) {
      return;
    }
    const before = tops.get(target);
    if (generating && before !== void 0 && target.scrollTop < before - 1) {
      pause();
    }
    tops.set(target, target.scrollTop);
  };
  const observer = new MutationObserver(schedule);
  const start = () => {
    if (disposed) {
      return;
    }
    suspended = false;
    if (document.documentElement) {
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ["aria-busy", "data-is-streaming", "data-streaming", "aria-label", "title", "data-testid", "hidden", "style", "class"]
      });
    }
    if (interval === void 0) {
      interval = window.setInterval(tick, 500);
    }
    tick();
  };
  const suspend = () => {
    suspended = true;
    observer.disconnect();
    if (interval !== void 0) {
      window.clearInterval(interval);
      interval = void 0;
    }
    if (scheduled !== void 0) {
      window.clearTimeout(scheduled);
      scheduled = void 0;
    }
  };
  const dispose3 = () => {
    disposed = true;
    suspend();
    window.removeEventListener("wheel", wheel, true);
    window.removeEventListener("touchstart", touchStart, true);
    window.removeEventListener("touchmove", touchMove, true);
    window.removeEventListener("keydown", key, true);
    document.removeEventListener("selectionchange", selected);
    document.removeEventListener("scroll", scrolled, true);
    window.removeEventListener("pagehide", suspend);
    window.removeEventListener("pageshow", start);
  };
  host.__shuncodeArenaFollowLatest = {
    version: "shuncode-arena-turn-follow-v1",
    dispose: dispose3,
    snapshot,
    setEnabled(value) {
      enabled = value;
      if (!value) {
        pause();
      } else {
        tick();
      }
    }
  };
  window.addEventListener("wheel", wheel, {
    capture: true,
    passive: true
  });
  window.addEventListener("touchstart", touchStart, {
    capture: true,
    passive: true
  });
  window.addEventListener("touchmove", touchMove, {
    capture: true,
    passive: true
  });
  window.addEventListener("keydown", key, true);
  document.addEventListener("selectionchange", selected);
  document.addEventListener("scroll", scrolled, true);
  window.addEventListener("pagehide", suspend);
  window.addEventListener("pageshow", start);
  start();
}
export { installArenaFollowLatest };
