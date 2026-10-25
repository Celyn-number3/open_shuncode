// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { __toESM } from "../../../runtime/helpers.mjs";
import { init_define_SHUNCODE_BUILD_INFO } from "../../../runtime/build-info.mjs";
// extensions/shuncode/src/bridge-access-controller.ts
init_define_SHUNCODE_BUILD_INFO();
var vscode = __toESM(require("vscode"));
var LICENSE_REVALIDATION_INTERVAL_MS = 1800 * 60 * 1e3;
var BridgeAccessController = class {
  constructor(licenseService, bridge, output) {
    this.licenseService = licenseService;
    this.bridge = bridge;
    this.output = output;
  }
  licenseService;
  bridge;
  output;
  validationTimer;
  validationInFlight = false;
  usageReportInFlight = false;
  async start(domain) {
    const status = await this.bridge.start(domain);
    this.startValidationTimer();
    return status;
  }
  async stop() {
    this.stopValidationTimer();
    void this.reportPendingUsage();
    return await this.bridge.stop();
  }
  async getAccessStatus() {
    return await this.licenseService.getStatus();
  }
  async signIn() {
    return await this.licenseService.signIn();
  }
  async signInWithGitee() {
    return await this.licenseService.signInWithGitee();
  }
  async refreshSession() {
    return await this.licenseService.refreshSession();
  }
  async refresh() {
    const snapshot = await this.licenseService.refresh();
    await this.stopIfAccessLost(snapshot, "license refresh");
    return snapshot;
  }
  async signOut() {
    if (this.bridge.getStatus().state === "running" || this.bridge.getStatus().state === "starting") {
      await this.stop();
    }
    return await this.licenseService.signOut();
  }
  async redeem(code) {
    return await this.licenseService.redeem(code);
  }
  async loadPlans(force = false) {
    return await this.licenseService.loadPlans(force);
  }
  async createPayment(planId, paymentType) {
    return await this.licenseService.createPayment(planId, paymentType);
  }
  async getPaymentOrder(orderId = "") {
    const snapshot = await this.licenseService.getPaymentOrder(orderId);
    await this.stopIfAccessLost(snapshot, "payment/license update");
    return snapshot;
  }
  startValidationTimer() {
    this.stopValidationTimer();
    this.validationTimer = setInterval(() => void this.revalidateRunningBridge(), LICENSE_REVALIDATION_INTERVAL_MS);
    this.validationTimer.unref?.();
  }
  stopValidationTimer() {
    if (this.validationTimer) {
      clearInterval(this.validationTimer);
      this.validationTimer = void 0;
    }
  }
  async revalidateRunningBridge() {
    if (this.validationInFlight || this.bridge.getStatus().state !== "running") return;
    this.validationInFlight = true;
    try {
      await this.licenseService.requireFeature("bridge");
      await this.reportPendingUsage();
    } catch (error2) {
      const message = error2 instanceof Error ? error2.message : String(error2);
      this.output.appendLine(`[bridge-license] running Bridge authorization failed; stopping Bridge: ${message}`);
      await this.stop();
      await vscode.window.showWarningMessage(`ShunCode Bridge stopped because its license could not be renewed: ${message}`);
    } finally {
      this.validationInFlight = false;
    }
  }
  async reportPendingUsage() {
    if (this.usageReportInFlight) return;
    this.usageReportInFlight = true;
    try {
      const pending = this.bridge.takeToolCallsSinceLastReport();
      if (pending > 0) {
        const delivered = await this.licenseService.reportUsage(pending);
        if (!delivered) {
          this.bridge.returnToolCallsSinceLastReport(pending);
        }
      }
    } finally {
      this.usageReportInFlight = false;
    }
  }
  async stopIfAccessLost(snapshot, reason) {
    if (snapshot.licensed || this.bridge.getStatus().state === "stopped") return;
    this.output.appendLine(`[bridge-license] stopping Bridge after ${reason}: ${snapshot.error || "no active entitlement"}`);
    await this.stop();
  }
  dispose() {
    this.stopValidationTimer();
    void this.reportPendingUsage();
  }
};

// extensions/shuncode/src/bridge-license-service.ts
export { vscode, LICENSE_REVALIDATION_INTERVAL_MS, BridgeAccessController };
