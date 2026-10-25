// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
var BridgeStatusRefresher = class {
  constructor(request2, accept, reject, ready, timeoutMs = 5e3) {
    this.request = request2;
    this.accept = accept;
    this.reject = reject;
    this.ready = ready;
    this.timeoutMs = timeoutMs;
    this.running = false;
    this.queuedForce = false;
    this.disposed = false;
    this.failures = 0;
    this.retryAt = 0;
  }
  async refresh(force = false) {
    if (this.disposed || !this.ready()) {
      return;
    }
    if (this.running) {
      this.queuedForce ||= force;
      return;
    }
    if (!force && Date.now() < this.retryAt) {
      return;
    }
    this.running = true;
    let timer;
    const cancelled = /* @__PURE__ */Symbol("disposed");
    try {
      const deadline = new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error("Bridge status request timed out")), this.timeoutMs);
      });
      const disposal = new Promise(resolve3 => {
        this.cancelWait = () => resolve3(cancelled);
      });
      const value2 = await Promise.race([Promise.resolve().then(() => this.request()), deadline, disposal]);
      if (this.disposed || value2 === cancelled) {
        return;
      }
      if (value2 === void 0 || value2 === null) {
        throw new Error("Bridge status is unavailable");
      }
      this.failures = 0;
      this.retryAt = 0;
      if (this.ready()) {
        this.accept(value2, force);
      }
    } catch (error) {
      if (!this.disposed) {
        this.retryAt = Date.now() + Math.min(3e4, 1e3 * 2 ** Math.min(this.failures++, 5));
        this.reject(error);
      }
    } finally {
      clearTimeout(timer);
      this.cancelWait = void 0;
      this.running = false;
      if (this.queuedForce && !this.disposed) {
        this.queuedForce = false;
        void this.refresh(true);
      }
    }
  }
  dispose() {
    this.disposed = true;
    this.queuedForce = false;
    this.cancelWait?.();
  }
};
export { BridgeStatusRefresher };
