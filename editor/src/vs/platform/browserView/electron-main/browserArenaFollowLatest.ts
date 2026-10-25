// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
import { __esm } from "../../../base/common/shunCodeRecoveredHelpersMain.js";
import { toDisposable } from "../../../base/common/lifecycle.js";
import { Disposable } from "../../../base/common/lifecycle.js";
import "../../../base/common/lifecycle.js";
import { Emitter } from "../../../base/common/event.js";
import "../../../base/common/event.js";
import { RunOnceScheduler } from "../../../base/common/async.js";
import "../../../base/common/async.js";
import { browserViewIsolatedWorldId } from "../common/browserView.js";
import "../common/browserView.js";
import { installArenaFollowLatest } from "./browserArenaFollowLatestPage.js";
import "./browserArenaFollowLatestPage.js";
var BrowserArenaFollowLatest;
BrowserArenaFollowLatest = class extends Disposable {
  constructor(contents) {
    super();
    this.contents = contents;
    this.enabled = true;
    this.configuredEnabled = true;
    this.stopped = false;
    this.revision = 0;
    this.queue = Promise.resolve();
    this.state = {
      enabled: true,
      generating: false
    };
    this.changed = this._register(new Emitter());
    this.onDidChange = this.changed.event;
    this.sampler = this._register(new RunOnceScheduler(() => {
      void this.sample();
    }, 500));
    const loaded = () => {
      this.apply();
    };
    contents.on("did-finish-load", loaded);
    this._register(toDisposable(() => contents.removeListener("did-finish-load", loaded)));
    this.apply();
  }
  get snapshot() {
    return {
      ...this.state
    };
  }
  setEnabled(enabled, currentTurn = false) {
    if (this.stopped) {
      return;
    }
    if (!currentTurn) {
      if (this.configuredEnabled === enabled) {
        return;
      }
      this.configuredEnabled = enabled;
    }
    this.enabled = enabled;
    this.apply();
  }
  available() {
    if (this.stopped || this.contents.isDestroyed() || this.contents.isLoadingMainFrame()) {
      return false;
    }
    const url = URL.parse(this.contents.getURL());
    return url?.protocol === "https:" && /^(www\.)?arena\.ai$/.test(url.hostname);
  }
  update(value) {
    if (!value || typeof value.enabled !== "boolean" || typeof value.generating !== "boolean") {
      return;
    }
    if (value.enabled !== this.state.enabled || value.generating !== this.state.generating) {
      this.state = {
        enabled: value.enabled,
        generating: value.generating
      };
      this.changed.fire(this.snapshot);
    }
  }
  apply() {
    this.revision++;
    this.queue = this.queue.then(async () => {
      if (!this.available()) {
        return;
      }
      const value = await this.contents.executeJavaScriptInIsolatedWorld(browserViewIsolatedWorldId, [{
        code: `(${installArenaFollowLatest.toString()})(${this.enabled}); window.__shuncodeArenaFollowLatest?.snapshot();`
      }]);
      if (!this.stopped) {
        this.update(value);
        this.sampler.schedule();
      }
    }).catch(() => {
      if (!this.stopped) {
        this.sampler.schedule();
      }
    });
  }
  async sample() {
    const revision = this.revision;
    try {
      if (!this.available()) {
        return;
      }
      const state = await this.contents.executeJavaScriptInIsolatedWorld(browserViewIsolatedWorldId, [{
        code: "window.__shuncodeArenaFollowLatest?.snapshot();"
      }]);
      if (!this.stopped && revision === this.revision) {
        this.update(state);
      }
    } catch {} finally {
      if (!this.stopped) {
        this.sampler.schedule();
      }
    }
  }
  dispose() {
    this.stopped = true;
    this.sampler.cancel();
    if (!this.contents.isDestroyed() && !this.contents.isLoadingMainFrame()) {
      void this.contents.executeJavaScriptInIsolatedWorld(browserViewIsolatedWorldId, [{
        code: "window.__shuncodeArenaFollowLatest?.dispose(); delete window.__shuncodeArenaFollowLatest;"
      }]).catch(() => {});
    }
    super.dispose();
  }
};
export { BrowserArenaFollowLatest };
