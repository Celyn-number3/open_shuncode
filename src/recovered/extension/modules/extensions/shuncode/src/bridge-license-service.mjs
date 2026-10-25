// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { __toESM } from "../../../runtime/helpers.mjs";
import { init_define_SHUNCODE_BUILD_INFO } from "../../../runtime/build-info.mjs";
import { PaymentCreationUncertainError } from "./bridge-payment-network.mjs";
import { validateTokenClaims } from "./bridge-license-claims.mjs";
import { BRIDGE_LICENSE_BUILD_CONFIG } from "./bridge-license-config.mjs";
import { fetchPaymentOrderOnce, fetchWithExtensionHostFallbacks, resolveExtensionHostProxy } from "./extension-host-proxy.mjs";
// extensions/shuncode/src/bridge-license-service.ts
init_define_SHUNCODE_BUILD_INFO();

// extensions/shuncode/src/bridge-payment-network.mts

// extensions/shuncode/src/bridge-license-service.ts
var import_node_crypto = require("node:crypto");
var import_node_http2 = require("node:http");
var vscode2 = __toESM(require("vscode"));

// extensions/shuncode/src/bridge-license-config.ts

// extensions/shuncode/src/bridge-license-service.ts
var SESSION_TOKEN_KEY = "shuncode.bridgeLicense.sessionToken";
var LICENSE_TOKEN_KEY = "shuncode.bridgeLicense.licenseToken";
var INSTALLATION_ID_KEY = "shuncode.bridgeLicense.installationId";
var ACCOUNT_STATE_KEY = "shuncode.bridgeLicense.account";
var PAYMENT_ORDER_STATE_KEY = "shuncode.bridgeLicense.paymentOrder";
var PAYMENT_POLL_INTERVAL_MS = 3e3;
var PAYMENT_POLL_MAX_INTERVAL_MS = 15e3;
var PAYMENT_POLL_ERROR_NOTIFY_COUNT = 5;
var PAYMENT_PLAN_CACHE_MS = 5 * 60 * 1e3;
var REQUEST_TIMEOUT_MS = 3e4;
var PAYMENT_PLAN_DISPLAY_NAMES = Object.freeze({
  day_1: "\u4F53\u9A8C\u5361",
  week_1: "\u5468\u5361",
  month_1: "\u6708\u5361"
});
var GITHUB_SCOPES = ["read:user"];
var GITEE_SIGNIN_PATH = "/shuncode/gitee/signin";
var GITEE_CALLBACK_PATH = "/shuncode/gitee/callback";
var GITEE_RELAY_PATH = "/v1/auth/gitee/callback";
var GITEE_LOGIN_TIMEOUT_MS = 5 * 60 * 1e3;
var GITEE_CALLBACK_PAGE_PENDING = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ShunCode</title></head><body style="font-family:system-ui;padding:24px;line-height:1.6"><h2 id="title">Gitee \u6388\u6743\u5DF2\u6536\u5230</h2><p id="detail">ShunCode \u6B63\u5728\u5B8C\u6210\u767B\u5F55\uFF0C\u8BF7\u4FDD\u6301\u6B64\u9875\u9762\u6253\u5F00\u3002</p>`;
var GITEE_CALLBACK_PAGE_DENIED = `<!doctype html><html><head><meta charset="utf-8"><title>ShunCode</title></head><body style="font-family: system-ui; padding: 24px;"><h2>Gitee \u6388\u6743\u5DF2\u53D6\u6D88</h2><p>\u53EF\u4EE5\u5173\u95ED\u6B64\u9875\u9762\u5E76\u8FD4\u56DE ShunCode\u3002</p></body></html>`;
var GITEE_CALLBACK_PAGE_INVALID = `<!doctype html><html><head><meta charset="utf-8"><title>ShunCode</title></head><body style="font-family: system-ui; padding: 24px;"><h2>Gitee \u767B\u5F55\u56DE\u8C03\u65E0\u6548</h2><p>\u8BF7\u8FD4\u56DE ShunCode \u540E\u91CD\u65B0\u767B\u5F55\u3002</p></body></html>`;
var LicenseHttpError = class extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
  status;
};
var BridgeLicenseService = class {
  constructor(context, output) {
    this.context = context;
    this.output = output;
  }
  context;
  output;
  // Authentication writes are ordered; responses from a prior login cannot restore it.
  authGeneration = 0;
  authStateWrite = Promise.resolve();
  installationIdInFlight;
  licenseRefreshInFlight;
  paymentMonitorGeneration = 0;
  paymentMonitorTimer;
  plans = [];
  paymentTypes = ["alipay"];
  plansFetchedAt = 0;
  plansError = "";
  async initialize() {
    const storedOrder = this.context.globalState.get(PAYMENT_ORDER_STATE_KEY);
    if (storedOrder?.id && storedOrder.status === "pending") {
      this.startPaymentMonitor(storedOrder.id, 1e3);
    }
    try {
      await this.loadPlans();
    } catch (error2) {
      this.output.appendLine(`[bridge-license] failed to preload payment plans: ${this.messageOf(error2)}`);
    }
  }
  get configuration() {
    const allowDevelopmentOverrides = this.context.extensionMode === vscode2.ExtensionMode.Development;
    const developmentServerUrl = allowDevelopmentOverrides ? process.env.SHUNCODE_BRIDGE_LICENSE_SERVER_URL : void 0;
    const developmentPublicKey = allowDevelopmentOverrides ? process.env.SHUNCODE_BRIDGE_LICENSE_PUBLIC_KEY_PEM : void 0;
    const developmentIssuer = allowDevelopmentOverrides ? process.env.SHUNCODE_BRIDGE_LICENSE_ISSUER : void 0;
    const developmentAudience = allowDevelopmentOverrides ? process.env.SHUNCODE_BRIDGE_LICENSE_AUDIENCE : void 0;
    const developmentGiteeClientId = allowDevelopmentOverrides ? process.env.SHUNCODE_BRIDGE_LICENSE_GITEE_CLIENT_ID : void 0;
    const developmentGiteeRedirectUri = allowDevelopmentOverrides ? process.env.SHUNCODE_BRIDGE_LICENSE_GITEE_REDIRECT_URI : void 0;
    const serverUrl = (developmentServerUrl || BRIDGE_LICENSE_BUILD_CONFIG.serverUrl).trim().replace(/\/+$/, "");
    return {
      serverUrl,
      publicKeyPem: (developmentPublicKey || BRIDGE_LICENSE_BUILD_CONFIG.publicKeyPem).trim().replace(/\\n/g, "\n"),
      issuer: (developmentIssuer || BRIDGE_LICENSE_BUILD_CONFIG.issuer || serverUrl).trim().replace(/\/+$/, ""),
      audience: (developmentAudience || BRIDGE_LICENSE_BUILD_CONFIG.audience).trim() || "shuncode-desktop",
      giteeClientId: (developmentGiteeClientId || BRIDGE_LICENSE_BUILD_CONFIG.giteeClientId || "").trim(),
      giteeRedirectUri: (developmentGiteeRedirectUri || (serverUrl ? `${serverUrl}${GITEE_RELAY_PATH}` : "")).trim()
    };
  }
  async getStatus(error2 = "") {
    const stateWrite = this.authStateWrite;
    await stateWrite;
    const generation = this.authGeneration;
    const {
      serverUrl,
      publicKeyPem,
      issuer
    } = this.configuration;
    const account = this.context.globalState.get(ACCOUNT_STATE_KEY);
    const [licenseToken, sessionToken, installationId] = await Promise.all([this.context.secrets.get(LICENSE_TOKEN_KEY), this.context.secrets.get(SESSION_TOKEN_KEY), this.getInstallationId()]);
    let licensed = false;
    let expiresAt = "";
    let permanent = false;
    let tokenError = "";
    if (licenseToken) {
      try {
        const claims = await this.verifyLicenseToken(licenseToken, "bridge");
        licensed = true;
        permanent = claims.entitlement_exp === null;
        expiresAt = typeof claims.entitlement_exp === "number" ? new Date(claims.entitlement_exp * 1e3).toISOString() : "";
      } catch (cause) {
        tokenError = this.messageOf(cause);
      }
    }
    if (generation !== this.authGeneration || stateWrite !== this.authStateWrite) return await this.getStatus(error2);
    return {
      serverConfigured: Boolean(serverUrl && publicKeyPem && issuer),
      signedIn: Boolean(account && sessionToken),
      installationId,
      githubUserId: account?.githubUserId ?? "",
      githubLogin: account?.githubLogin ?? "",
      giteeUserId: account?.giteeUserId ?? "",
      giteeLogin: account?.giteeLogin ?? "",
      email: account?.email ?? "",
      avatarUrl: account?.avatarUrl ?? "",
      licensed,
      expiresAt,
      permanent,
      error: error2 || tokenError || (this.context.globalState.get(this.paymentUncertainKey()) ? "\u4E0A\u6B21\u4E0B\u5355\u7ED3\u679C\u5C1A\u672A\u786E\u8BA4\uFF0C\u8BF7\u5148\u68C0\u67E5\u5DF2\u6709\u8BA2\u5355\uFF0C\u4E0D\u8981\u91CD\u590D\u4E0B\u5355\u3002" : ""),
      paymentCreationUncertain: Boolean(this.context.globalState.get(this.paymentUncertainKey())),
      plans: this.plans.map(plan => ({
        ...plan
      })),
      paymentTypes: [...this.paymentTypes],
      plansError: this.plansError,
      paymentOrder: this.context.globalState.get(PAYMENT_ORDER_STATE_KEY) ?? this.emptyPaymentOrder("")
    };
  }
  async signIn() {
    return await this.completeSignIn(() => this.exchangeGitHubSession(true));
  }
  /**
   * Signs in with Gitee using the OAuth authorization-code flow. A browser
   * window opens gitee.com/oauth/authorize and the code is delivered to a
   * local loopback callback, then exchanged by the license server (the
   * Gitee client secret never leaves the server).
   */
  async signInWithGitee() {
    return await this.completeSignIn(() => this.exchangeGiteeSession());
  }
  async completeSignIn(exchange) {
    ++this.authGeneration;
    const generation = this.authGeneration;
    try {
      await exchange();
      if (generation !== this.authGeneration) throw new Error("Bridge account changed during sign-in.");
      try {
        await this.refreshLicense(false);
      } catch (error2) {
        const missingEntitlement = error2 instanceof LicenseHttpError && error2.status === 403 && /no active bridge entitlement/i.test(error2.message);
        if (this.isNoEntitlementError(error2)) {
          await this.commitAuthState(generation, () => this.context.secrets.delete(LICENSE_TOKEN_KEY));
        } else if (!(error2 instanceof LicenseHttpError) || error2.status !== 404 && !missingEntitlement) {
          throw error2;
        }
      }
      const status = await this.getStatus();
      void this.loadPlans(true);
      return status;
    } catch (error2) {
      return await this.getStatus(await this.describeError(error2));
    }
  }
  async refreshSession() {
    ++this.authGeneration;
    const generation = this.authGeneration;
    try {
      await this.recoverStoredProviderSession(true, false);
      if (generation !== this.authGeneration) throw new Error("Bridge account changed during session recovery.");
      try {
        await this.refreshLicense(false);
      } catch (error2) {
        const missingEntitlement = error2 instanceof LicenseHttpError && error2.status === 403 && /no active bridge entitlement/i.test(error2.message);
        if (this.isNoEntitlementError(error2)) {
          await this.commitAuthState(generation, () => this.context.secrets.delete(LICENSE_TOKEN_KEY));
        } else if (!(error2 instanceof LicenseHttpError) || error2.status !== 404 && !missingEntitlement) {
          throw error2;
        }
      }
      return await this.getStatus();
    } catch (error2) {
      return await this.getStatus(await this.describeError(error2));
    }
  }
  async redeem(activationCode) {
    const generation = this.authGeneration;
    const code = activationCode.trim();
    if (!code) return await this.getStatus("Activation code is required.");
    try {
      const sessionToken = await this.ensureSessionToken(true);
      const installationId = await this.getInstallationId();
      const response = await this.request("/v1/licenses/redeem", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionToken}`
        },
        body: JSON.stringify({
          code,
          installationId
        })
      });
      await this.storeLicenseResponse(response, generation);
      return await this.getStatus();
    } catch (error2) {
      return await this.getStatus(await this.describeError(error2));
    }
  }
  async reportUsage(toolCalls) {
    if (!Number.isFinite(toolCalls) || toolCalls <= 0) return false;
    try {
      const sessionToken = await this.ensureSessionToken(false);
      const installationId = await this.getInstallationId();
      await this.request("/v1/usage/report", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionToken}`
        },
        body: JSON.stringify({
          installationId,
          toolCalls
        })
      });
      return true;
    } catch (error2) {
      this.output.appendLine(`[bridge-license] failed to report tool usage: ${this.messageOf(error2)}`);
      return false;
    }
  }
  async refresh() {
    const generation = this.authGeneration;
    let errorMessage2 = "";
    try {
      await this.refreshLicense(true);
    } catch (error2) {
      if (this.isNoEntitlementError(error2)) {
        await this.commitAuthState(generation, () => this.context.secrets.delete(LICENSE_TOKEN_KEY));
      } else {
        errorMessage2 = await this.describeError(error2);
      }
    }
    await this.loadPlans(true);
    return await this.getStatus(errorMessage2);
  }
  async signOut() {
    const generation = ++this.authGeneration;
    this.stopPaymentMonitor();
    await this.commitAuthState(generation, async () => {
      await Promise.all([this.context.secrets.delete(SESSION_TOKEN_KEY), this.context.secrets.delete(LICENSE_TOKEN_KEY), this.context.globalState.update(ACCOUNT_STATE_KEY, void 0), this.context.globalState.update(PAYMENT_ORDER_STATE_KEY, void 0)]);
    });
    return await this.getStatus();
  }
  async loadPlans(force = false) {
    if (!force && this.plans.length && Date.now() - this.plansFetchedAt < PAYMENT_PLAN_CACHE_MS) {
      return await this.getStatus();
    }
    try {
      const response = await this.request("/v1/payments/plans", {
        method: "GET"
      });
      this.plans = this.parsePaymentPlans(response);
      this.paymentTypes = Array.isArray(response.paymentTypes) ? response.paymentTypes.filter(value => typeof value === "string" && Boolean(value.trim())) : ["alipay"];
      if (!this.paymentTypes.length) this.paymentTypes = ["alipay"];
      this.plansFetchedAt = Date.now();
      this.plansError = this.plans.length ? "" : "Payment plans are currently unavailable.";
      return await this.getStatus();
    } catch (error2) {
      this.plansError = this.messageOf(error2);
      this.output.appendLine(`[bridge-license] failed to load payment plans: ${this.plansError}`);
      return await this.getStatus();
    }
  }
  paymentUncertainKey() {
    const account = this.context.globalState.get(ACCOUNT_STATE_KEY);
    return `shuncode.bridgeLicense.paymentCreationUncertain.${encodeURIComponent(account?.id || "anonymous")}`;
  }
  paymentCreateInFlight;
  async createPayment(planId, paymentType) {
    if (this.paymentCreateInFlight) return this.paymentCreateInFlight;
    const run = this.createPaymentInternal(planId, paymentType);
    this.paymentCreateInFlight = run;
    try {
      return await run;
    } finally {
      if (this.paymentCreateInFlight === run) this.paymentCreateInFlight = void 0;
    }
  }
  async createPaymentInternal(planId, paymentType) {
    if (this.context.globalState.get(this.paymentUncertainKey())) {
      return await this.getStatus("\u4E0A\u6B21\u4E0B\u5355\u7ED3\u679C\u5C1A\u672A\u786E\u8BA4\uFF0C\u8BF7\u5148\u68C0\u67E5\u5DF2\u6709\u8BA2\u5355\uFF0C\u4E0D\u8981\u91CD\u590D\u4E0B\u5355\u3002");
    }
    try {
      const sessionToken = await this.ensureSessionToken(true);
      const response = await this.request("/v1/payments/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionToken}`
        },
        body: JSON.stringify({
          planId: planId.trim(),
          paymentType: paymentType.trim() || "alipay"
        })
      });
      const order = this.toPaymentOrder(response);
      this.validateCheckoutUrl(order.checkoutUrl);
      await this.persistPaymentOrder(order);
      this.startPaymentMonitor(order.id);
      await vscode2.env.openExternal(vscode2.Uri.parse(order.checkoutUrl));
      return await this.getStatus();
    } catch (error2) {
      if (error2 instanceof PaymentCreationUncertainError) {
        const previous = this.context.globalState.get(PAYMENT_ORDER_STATE_KEY);
        await this.context.globalState.update(this.paymentUncertainKey(), {
          previousId: previous?.id ?? "",
          at: Date.now(),
          planId,
          paymentType
        });
      }
      return await this.getStatus(this.messageOf(error2));
    }
  }
  async getPaymentOrder(orderId = "") {
    const generation = this.authGeneration;
    const storedOrder = this.context.globalState.get(PAYMENT_ORDER_STATE_KEY);
    const uncertain = this.context.globalState.get(this.paymentUncertainKey());
    const resolvedOrderId = uncertain ? "" : orderId.trim() || storedOrder?.id || "";
    try {
      const sessionToken = await this.ensureSessionToken(false);
      const path22 = resolvedOrderId ? `/v1/payments/orders/${encodeURIComponent(resolvedOrderId)}` : "/v1/payments/orders/latest";
      const response = await this.request(path22, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionToken}`
        }
      });
      const order = this.toPaymentOrder(response);
      if (uncertain && order.id !== uncertain.previousId && order.planId === uncertain.planId && order.paymentType === uncertain.paymentType && Date.parse(order.createdAt) >= uncertain.at - 6e4) {
        await this.context.globalState.update(this.paymentUncertainKey(), void 0);
      }
      await this.persistPaymentOrder(order);
      if (order.status === "paid") {
        this.stopPaymentMonitor();
        try {
          await this.refreshLicense(true);
        } catch (error2) {
          this.output.appendLine(`[bridge-license] payment succeeded but license refresh failed: ${this.messageOf(error2)}`);
          if (this.isNoEntitlementError(error2)) {
            await this.commitAuthState(generation, () => this.context.secrets.delete(LICENSE_TOKEN_KEY));
          }
          const detail = await this.describeError(error2);
          void vscode2.window.showErrorMessage(`Bridge \u6388\u6743\u5237\u65B0\u5931\u8D25\uFF1A${detail}`);
          return await this.getStatus(detail);
        }
      } else if (["expired", "failed", "refunded"].includes(order.status)) {
        this.stopPaymentMonitor();
      }
      return await this.getStatus();
    } catch (error2) {
      if (!resolvedOrderId && error2 instanceof LicenseHttpError && error2.status === 404) {
        return await this.getStatus();
      }
      return await this.getStatus(this.messageOf(error2));
    }
  }
  async requireFeature(feature) {
    const generation = this.authGeneration;
    const {
      serverUrl,
      publicKeyPem,
      issuer
    } = this.configuration;
    if (!serverUrl || !publicKeyPem || !issuer) {
      throw new Error("Bridge licensing trust anchor is not configured in this build.");
    }
    const cachedToken = await this.context.secrets.get(LICENSE_TOKEN_KEY);
    let cachedClaims;
    if (cachedToken) {
      try {
        cachedClaims = await this.verifyLicenseToken(cachedToken, feature);
      } catch {
        cachedClaims = void 0;
      }
    }
    try {
      await this.refreshLicense(true);
      if (generation !== this.authGeneration) throw new Error("Bridge account changed during license validation.");
    } catch (error2) {
      if (generation !== this.authGeneration) throw new Error("Bridge account changed during license validation.");
      if (error2 instanceof LicenseHttpError && [401, 403, 404].includes(error2.status)) {
        if (error2.status === 403) await this.commitAuthState(generation, () => this.context.secrets.delete(LICENSE_TOKEN_KEY));
        throw new Error(await this.describeError(error2));
      }
      if (cachedClaims && cachedToken) {
        await this.verifyLicenseToken(cachedToken, feature);
        if (generation !== this.authGeneration) throw new Error("Bridge account changed during offline validation.");
        this.output.appendLine(`[bridge-license] online refresh failed; using still-valid cached license: ${this.messageOf(error2)}`);
        return;
      }
      throw new Error(`Bridge is not activated. ${this.messageOf(error2)}`);
    }
  }
  async refreshLicense(retryAuthentication) {
    const generation = this.authGeneration;
    const current = this.licenseRefreshInFlight;
    if (current && current.generation === generation && current.retry === retryAuthentication) return await current.promise;
    const promise = this.performLicenseRefresh(retryAuthentication, generation);
    const flight = {
      generation,
      retry: retryAuthentication,
      promise
    };
    this.licenseRefreshInFlight = flight;
    try {
      return await promise;
    } finally {
      if (this.licenseRefreshInFlight === flight) this.licenseRefreshInFlight = void 0;
    }
  }
  async performLicenseRefresh(retryAuthentication, generation) {
    let sessionToken = await this.ensureSessionToken(false);
    const installationId = await this.getInstallationId();
    try {
      const response = await this.request("/v1/licenses/refresh", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionToken}`
        },
        body: JSON.stringify({
          installationId
        })
      });
      await this.storeLicenseResponse(response, generation);
      return await this.verifyLicenseToken(response.licenseToken, "bridge");
    } catch (error2) {
      if (!(error2 instanceof LicenseHttpError) || error2.status !== 401 || !retryAuthentication) throw error2;
      if (generation !== this.authGeneration) throw new Error("Bridge account changed during session recovery.");
      sessionToken = await this.recoverStoredProviderSession(false, false);
      const response = await this.request("/v1/licenses/refresh", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionToken}`
        },
        body: JSON.stringify({
          installationId
        })
      });
      await this.storeLicenseResponse(response, generation);
      return await this.verifyLicenseToken(response.licenseToken, "bridge");
    }
  }
  async ensureSessionToken(interactive) {
    const generation = this.authGeneration;
    const stored = await this.context.secrets.get(SESSION_TOKEN_KEY);
    if (generation !== this.authGeneration) throw new Error("Bridge account changed during session read.");
    if (stored) return stored;
    return await this.recoverStoredProviderSession(interactive, interactive);
  }
  storedAuthProvider() {
    const account = this.context.globalState.get(ACCOUNT_STATE_KEY);
    if (account?.authProvider === "github" || account?.authProvider === "gitee") return account.authProvider;
    return account?.giteeUserId || account?.giteeLogin ? "gitee" : "github";
  }
  async recoverStoredProviderSession(interactiveGitee, interactiveGitHub) {
    if (this.storedAuthProvider() === "gitee") {
      if (!interactiveGitee) {
        await this.commitAuthState(this.authGeneration, () => this.context.secrets.delete(SESSION_TOKEN_KEY));
        throw new Error("Gitee Bridge session expired. Sign in with Gitee again to renew the session.");
      }
      return await this.exchangeGiteeSession();
    }
    return await this.exchangeGitHubSession(interactiveGitHub);
  }
  async exchangeGitHubSession(interactive) {
    const generation = this.authGeneration;
    const session = await vscode2.authentication.getSession("github", GITHUB_SCOPES, interactive ? {
      forceNewSession: true,
      clearSessionPreference: true
    } : {
      createIfNone: false,
      silent: true
    });
    if (!session) {
      throw new Error("Sign in with GitHub before activating Bridge.");
    }
    if (generation !== this.authGeneration) throw new Error("Bridge account changed during sign-in.");
    return await this.exchangeGitHubToken(session.accessToken);
  }
  async exchangeGitHubToken(githubToken) {
    const generation = this.authGeneration;
    const installationId = await this.getInstallationId();
    const response = await this.request("/v1/auth/github", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${githubToken}`
      },
      body: JSON.stringify({
        installationId
      })
    });
    await this.persistAuthResponse(response, "github", generation);
    return response.sessionToken;
  }
  async exchangeGiteeSession() {
    const generation = this.authGeneration;
    const {
      giteeClientId: clientId,
      giteeRedirectUri: redirectUri
    } = this.configuration;
    if (!clientId) throw new Error("Gitee sign-in is not configured in this ShunCode build.");
    if (!redirectUri) throw new Error("Gitee sign-in redirect is not configured in this ShunCode build.");
    this.output.appendLine(`[bridge-license] gitee sign-in started with clientId ${clientId.slice(0, 8)}\u2026`);
    const authorization = await this.captureGiteeAuthorizationCode(clientId, redirectUri);
    try {
      this.output.appendLine("[bridge-license] gitee authorization code received; exchanging with license service");
      const installationId = await this.getInstallationId();
      const response = await this.request("/v1/auth/gitee", {
        method: "POST",
        body: JSON.stringify({
          code: authorization.code,
          redirectUri,
          installationId
        })
      });
      await this.persistAuthResponse(response, "gitee", generation);
      this.output.appendLine(`[bridge-license] gitee sign-in completed for ${response.user.giteeLogin || response.user.githubLogin || response.user.id}`);
      authorization.complete();
      return response.sessionToken;
    } catch (error2) {
      authorization.complete(error2);
      throw error2;
    }
  }
  captureGiteeAuthorizationCode(clientId, redirectUri) {
    return new Promise((resolve, reject) => {
      let settled = false;
      const nonce = (0, import_node_crypto.randomUUID)();
      let expectedState = "";
      let authorizeUrl = "";
      const closeServerSoon = () => {
        const closeTimer = setTimeout(() => server.close(), 5e3);
        closeTimer.unref?.();
      };
      const settleError = error2 => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        server.close();
        this.output.appendLine(`[bridge-license] gitee sign-in failed before code exchange: ${error2.message}`);
        reject(error2);
      };
      const server = (0, import_node_http2.createServer)((request, response) => {
        const address = server.address();
        const port = address && typeof address !== "string" ? address.port : 0;
        const url2 = new URL(request.url ?? "/", `http://127.0.0.1:${port || 80}`);
        if (url2.pathname === GITEE_SIGNIN_PATH) {
          if (!authorizeUrl || url2.searchParams.get("nonce") !== nonce) {
            response.writeHead(400, {
              "Content-Type": "text/plain; charset=utf-8",
              "Cache-Control": "no-store"
            });
            response.end("Invalid ShunCode Gitee sign-in request.");
            return;
          }
          response.writeHead(302, {
            Location: authorizeUrl,
            "Cache-Control": "no-store"
          });
          response.end();
          return;
        }
        if (url2.pathname !== GITEE_CALLBACK_PATH) {
          response.writeHead(404);
          response.end();
          return;
        }
        const error2 = url2.searchParams.get("error");
        const state = url2.searchParams.get("state");
        const code = url2.searchParams.get("code");
        this.output.appendLine(`[bridge-license] gitee callback received: error=${error2 ?? ""} hasCode=${Boolean(code)}`);
        if (error2 === "access_denied") {
          response.writeHead(200, {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "no-store"
          });
          response.end(GITEE_CALLBACK_PAGE_DENIED);
          settleError(new Error("Gitee authorization was cancelled. Try again to sign in."));
          return;
        }
        if (!expectedState || state !== expectedState || !code || settled) {
          response.writeHead(400, {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "no-store"
          });
          response.end(GITEE_CALLBACK_PAGE_INVALID);
          if (!settled) settleError(new Error("Gitee returned an invalid authorization callback. Try again."));
          return;
        }
        settled = true;
        clearTimeout(timer);
        response.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache"
        });
        response.write(GITEE_CALLBACK_PAGE_PENDING);
        resolve({
          code,
          complete: completionError => {
            const ok = completionError === void 0;
            const title = ok ? "Gitee \u767B\u5F55\u6210\u529F" : "Gitee \u6388\u6743\u6210\u529F\uFF0C\u4F46 ShunCode \u767B\u5F55\u5931\u8D25";
            const detail = ok ? "ShunCode \u5DF2\u5B8C\u6210\u767B\u5F55\uFF0C\u53EF\u4EE5\u5173\u95ED\u6B64\u9875\u9762\u3002" : `\u8BF7\u8FD4\u56DE ShunCode \u67E5\u770B\u9519\u8BEF\u5E76\u91CD\u8BD5\u3002${this.messageOf(completionError) ? ` \u9519\u8BEF\uFF1A${this.messageOf(completionError)}` : ""}`;
            const safeTitle = JSON.stringify(title).replace(/</g, "\\u003c");
            const safeDetail = JSON.stringify(detail).replace(/</g, "\\u003c");
            response.end(`<script>document.getElementById("title").textContent=${safeTitle};document.getElementById("detail").textContent=${safeDetail};</script></body></html>`);
            closeServerSoon();
          }
        });
      });
      const timer = setTimeout(() => settleError(new Error("Gitee sign-in timed out. Open the authorization page and complete it within 5 minutes.")), GITEE_LOGIN_TIMEOUT_MS);
      timer.unref?.();
      server.on("error", error2 => {
        settleError(error2);
      });
      server.listen(0, "127.0.0.1", () => {
        const address = server.address();
        if (!address || typeof address === "string") {
          settleError(new Error("Gitee sign-in could not determine the local callback port."));
          return;
        }
        const callbackUri = `http://127.0.0.1:${address.port}${GITEE_CALLBACK_PATH}`;
        expectedState = Buffer.from(JSON.stringify({
          v: 1,
          callback: callbackUri,
          nonce
        }), "utf8").toString("base64url");
        authorizeUrl = `https://gitee.com/oauth/authorize?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=${encodeURIComponent(expectedState)}`;
        const signinUrl = `http://127.0.0.1:${address.port}${GITEE_SIGNIN_PATH}?nonce=${encodeURIComponent(nonce)}`;
        this.output.appendLine(`[bridge-license] gitee callback server listening on ${callbackUri}; relay=${redirectUri}`);
        void vscode2.env.openExternal(vscode2.Uri.parse(signinUrl)).then(opened => {
          if (opened) {
            this.output.appendLine("[bridge-license] gitee authorization page opened in the external browser");
            void vscode2.window.showInformationMessage("Gitee \u6388\u6743\u9875\u9762\u5DF2\u5728\u6D4F\u89C8\u5668\u4E2D\u6253\u5F00\uFF0C\u8BF7\u5B8C\u6210\u6388\u6743\u540E\u8FD4\u56DE ShunCode\u3002");
          } else {
            this.output.appendLine("[bridge-license] openExternal returned false, offering the manual authorization link");
            this.showGiteeManualLink(authorizeUrl);
          }
        }, error2 => {
          this.output.appendLine(`[bridge-license] openExternal failed: ${this.messageOf(error2)}`);
          this.showGiteeManualLink(authorizeUrl);
        });
      });
    });
  }
  showGiteeManualLink(authorizeUrl) {
    void vscode2.window.showInformationMessage("\u65E0\u6CD5\u81EA\u52A8\u6253\u5F00\u6D4F\u89C8\u5668\u3002\u8BF7\u624B\u52A8\u5728\u6D4F\u89C8\u5668\u4E2D\u6253\u5F00 Gitee \u6388\u6743\u9875\u9762\u5B8C\u6210\u767B\u5F55\u3002", "\u590D\u5236\u6388\u6743\u94FE\u63A5").then(choice => {
      if (choice === "\u590D\u5236\u6388\u6743\u94FE\u63A5") void vscode2.env.clipboard.writeText(authorizeUrl);
    });
  }
  async commitAuthState(generation, write) {
    const pending = (this.authStateWrite ?? Promise.resolve()).then(async () => {
      if (generation !== this.authGeneration) throw new Error("Bridge account changed; stale response discarded.");
      await write();
    });
    this.authStateWrite = pending.catch(() => {});
    await pending;
  }
  async persistAuthResponse(response, authProvider, generation) {
    const account = this.toAccountState(response.user, authProvider);
    await this.commitAuthState(generation, async () => {
      const previous = this.context.globalState.get(ACCOUNT_STATE_KEY);
      if (previous?.id !== account.id) await this.context.secrets.delete(LICENSE_TOKEN_KEY);
      await Promise.all([this.context.secrets.store(SESSION_TOKEN_KEY, response.sessionToken), this.context.globalState.update(ACCOUNT_STATE_KEY, account)]);
    });
  }
  toAccountState(user, authProvider) {
    return {
      id: user.id,
      authProvider,
      githubUserId: user.githubUserId ? String(user.githubUserId) : "",
      githubLogin: user.githubLogin ?? "",
      giteeUserId: user.giteeUserId ? String(user.giteeUserId) : "",
      giteeLogin: user.giteeLogin ?? "",
      email: user.email ?? "",
      avatarUrl: user.avatarUrl
    };
  }
  startPaymentMonitor(orderId, initialDelay = PAYMENT_POLL_INTERVAL_MS) {
    this.stopPaymentMonitor();
    const generation = this.paymentMonitorGeneration;
    let attempts = 0;
    let warnedNetwork = false;
    const poll = async () => {
      if (generation !== this.paymentMonitorGeneration) return;
      const snapshot = await this.getPaymentOrder(orderId);
      if (generation !== this.paymentMonitorGeneration) return;
      if (snapshot.paymentOrder.status === "pending" || snapshot.error) {
        attempts += 1;
        if (snapshot.error && attempts >= PAYMENT_POLL_ERROR_NOTIFY_COUNT && !warnedNetwork) {
          warnedNetwork = true;
          const detail = snapshot.error.length > 120 ? `${snapshot.error.slice(0, 120)}\u2026` : snapshot.error;
          void vscode2.window.showWarningMessage(`Bridge \u652F\u4ED8\u72B6\u6001\u68C0\u67E5\u6682\u65F6\u5931\u8D25\uFF08${detail}\uFF09\uFF0C\u5C06\u7EE7\u7EED\u81EA\u52A8\u91CD\u8BD5\u3002`);
        }
        const delay = Math.min(PAYMENT_POLL_INTERVAL_MS * 2 ** attempts, PAYMENT_POLL_MAX_INTERVAL_MS);
        this.paymentMonitorTimer = setTimeout(poll, delay);
        this.paymentMonitorTimer.unref?.();
      }
    };
    this.paymentMonitorTimer = setTimeout(poll, initialDelay);
    this.paymentMonitorTimer.unref?.();
  }
  stopPaymentMonitor() {
    this.paymentMonitorGeneration += 1;
    if (this.paymentMonitorTimer) {
      clearTimeout(this.paymentMonitorTimer);
      this.paymentMonitorTimer = void 0;
    }
  }
  parsePaymentPlans(response) {
    return (response.plans ?? []).flatMap(value => {
      if (!value || typeof value !== "object") return [];
      const record4 = value;
      const id = typeof record4.id === "string" ? record4.id : "";
      const serverName = typeof record4.name === "string" ? record4.name : "";
      const name = PAYMENT_PLAN_DISPLAY_NAMES[id] ?? serverName;
      if (!id || !name) return [];
      const amountCents = Number(record4.amountCents ?? record4.amount_cents);
      const rawDuration = record4.durationDays === void 0 ? record4.duration_days : record4.durationDays;
      const durationDays = rawDuration === null || rawDuration === void 0 ? null : Number(rawDuration);
      if (!Number.isFinite(amountCents) || durationDays !== null && !Number.isFinite(durationDays)) return [];
      return [{
        id,
        name,
        amount: typeof record4.amount === "string" ? record4.amount : (amountCents / 100).toFixed(2),
        amountCents,
        durationDays
      }];
    });
  }
  async persistPaymentOrder(order) {
    await this.context.globalState.update(PAYMENT_ORDER_STATE_KEY, order);
  }
  async storeLicenseResponse(response, generation) {
    await this.verifyLicenseToken(response.licenseToken, "bridge");
    await this.commitAuthState(generation, async () => {
      await this.context.secrets.store(LICENSE_TOKEN_KEY, response.licenseToken);
      if (response.user) {
        await this.context.globalState.update(ACCOUNT_STATE_KEY, this.toAccountState(response.user, this.storedAuthProvider()));
      }
    });
  }
  async verifyLicenseToken(token, feature) {
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("Stored Bridge license has an invalid format.");
    let header;
    let claims;
    try {
      header = JSON.parse(this.decodeBase64Url(parts[0]));
      claims = JSON.parse(this.decodeBase64Url(parts[1]));
    } catch {
      throw new Error("Stored Bridge license has invalid encoding.");
    }
    if (!header || typeof header !== "object" || Array.isArray(header)) throw new Error("Invalid license header.");
    if (header.alg !== "EdDSA") throw new Error("Stored Bridge license uses an unsupported signing algorithm.");
    const keyInfo = await this.getPublicKeyInfo();
    const signatureValid = (0, import_node_crypto.verify)(null, Buffer.from(`${parts[0]}.${parts[1]}`, "utf8"), (0, import_node_crypto.createPublicKey)(keyInfo.publicKeyPem), Buffer.from(parts[2], "base64url"));
    if (!signatureValid) throw new Error("Stored Bridge license signature is invalid.");
    const now = Math.floor(Date.now() / 1e3);
    validateTokenClaims(claims, {
      now,
      issuer: keyInfo.issuer,
      audience: keyInfo.audience,
      kind: "license"
    });
    if (claims.kind !== "license") throw new Error("Stored token is not a Bridge license.");
    if (claims.iss !== keyInfo.issuer) throw new Error("Stored Bridge license has an invalid issuer.");
    const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    if (!audiences.includes(keyInfo.audience)) throw new Error("Stored Bridge license has an invalid audience.");
    if (!claims.exp || claims.exp <= now) throw new Error("Stored Bridge license has expired.");
    if (!claims.features?.includes(feature)) throw new Error(`Stored license does not include the ${feature} feature.`);
    if (claims.installation_id !== (await this.getInstallationId())) {
      throw new Error("Stored Bridge license belongs to a different installation.");
    }
    return claims;
  }
  async getPublicKeyInfo() {
    const {
      publicKeyPem,
      issuer,
      audience
    } = this.configuration;
    if (!publicKeyPem || !issuer || !audience) {
      throw new Error("Bridge licensing trust anchor is not configured in this build.");
    }
    return {
      publicKeyPem,
      issuer,
      audience
    };
  }
  async getInstallationId() {
    if (this.installationIdInFlight) return await this.installationIdInFlight;
    const pending = this.readOrCreateInstallationId();
    this.installationIdInFlight = pending;
    try {
      return await pending;
    } finally {
      if (this.installationIdInFlight === pending) this.installationIdInFlight = void 0;
    }
  }
  async readOrCreateInstallationId() {
    let value = await this.context.secrets.get(INSTALLATION_ID_KEY);
    if (!value) {
      value = (0, import_node_crypto.randomUUID)();
      await this.context.secrets.store(INSTALLATION_ID_KEY, value);
    }
    return value;
  }
  async request(path22, init) {
    const {
      serverUrl
    } = this.configuration;
    if (!serverUrl) throw new Error("Bridge license server URL is not configured.");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const url2 = new URL(`${serverUrl}${path22}`);
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "shuncode-bridge-license-client",
        ...(init.headers ? Object.fromEntries(new Headers(init.headers).entries()) : {})
      };
      const httpConfiguration = vscode2.workspace.getConfiguration("http");
      const configuredProxy = httpConfiguration.get("proxy")?.trim();
      const proxySupport = httpConfiguration.get("proxySupport");
      const proxyUrl = proxySupport === "off" ? void 0 : resolveExtensionHostProxy(url2, configuredProxy);
      const transport = path22 === "/v1/payments/orders" && init.method === "POST" ? fetchPaymentOrderOnce : fetchWithExtensionHostFallbacks;
      const response = await transport(url2, {
        method: init.method ?? "GET",
        headers,
        body: typeof init.body === "string" ? init.body : void 0,
        signal: controller.signal,
        proxyUrl,
        configuredProxy,
        rejectUnauthorized: httpConfiguration.get("proxyStrictSSL", true),
        useElectron: proxySupport !== "off",
        proxySupport: proxySupport === "off" ? "off" : void 0,
        attemptTimeoutMs: 8e3,
        log: message => this.output.appendLine(`[bridge-license] network ${message}`)
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new LicenseHttpError(body.error || `License server returned HTTP ${response.status}.`, response.status);
      }
      return body;
    } catch (error2) {
      if (error2 instanceof LicenseHttpError) throw error2;
      if (error2 instanceof Error && error2.name === "AbortError") throw new Error("License server request timed out.");
      throw error2;
    } finally {
      clearTimeout(timeout);
    }
  }
  validateCheckoutUrl(value) {
    const checkoutUrl = new URL(value);
    const serverUrl = new URL(this.configuration.serverUrl);
    const isDevelopmentLocalhost = this.context.extensionMode === vscode2.ExtensionMode.Development && checkoutUrl.protocol === "http:" && ["127.0.0.1", "localhost", "::1"].includes(checkoutUrl.hostname);
    if (checkoutUrl.protocol !== "https:" && !isDevelopmentLocalhost || checkoutUrl.origin !== serverUrl.origin) {
      throw new Error("Payment server returned an untrusted checkout URL.");
    }
  }
  toPaymentOrder(response) {
    return {
      id: response.order.id,
      status: response.order.status,
      checkoutUrl: response.checkoutUrl ?? "",
      planId: response.order.planId,
      planName: PAYMENT_PLAN_DISPLAY_NAMES[response.order.planId] ?? response.order.planName,
      amount: response.order.amount,
      paymentType: response.order.paymentType,
      createdAt: response.order.createdAt,
      expiresAt: response.order.expiresAt,
      paidAt: response.order.paidAt ?? "",
      entitlementExpiresAt: response.order.entitlementExpiresAt ?? "",
      error: ""
    };
  }
  emptyPaymentOrder(error2, id = "") {
    return {
      id,
      status: "",
      checkoutUrl: "",
      planId: "",
      planName: "",
      amount: "",
      paymentType: "",
      createdAt: "",
      expiresAt: "",
      paidAt: "",
      entitlementExpiresAt: "",
      error: error2
    };
  }
  decodeBase64Url(value) {
    return Buffer.from(value, "base64url").toString("utf8");
  }
  messageOf(error2) {
    return error2 instanceof Error ? error2.message : String(error2);
  }
  async describeError(error2) {
    const message = this.messageOf(error2);
    if (error2 instanceof LicenseHttpError && error2.status === 401 && /GitHub authentication failed/i.test(message)) {
      return `${message}. The GitHub token was rejected or GitHub is unreachable. Sign in with GitHub again, or paste a fresh GitHub personal access token.`;
    }
    if (error2 instanceof LicenseHttpError && error2.status === 403 && /installation limit reached/i.test(message)) {
      const installationId = await this.getInstallationId();
      return `${message}. This ShunCode installation ID is ${installationId}. In the license admin, unbind one active device, then restore this installation or click Refresh license here.`;
    }
    if (error2 instanceof LicenseHttpError && error2.status === 403 && /installation has been revoked/i.test(message)) {
      const installationId = await this.getInstallationId();
      return `${message}. This ShunCode installation ID is ${installationId}. Restore it in the license admin, then click Refresh license.`;
    }
    return message;
  }
  isNoEntitlementError(error2) {
    return error2 instanceof LicenseHttpError && error2.status === 403 && /(no active .*entitlement|entitlement has expired)/i.test(error2.message);
  }
  dispose() {
    this.stopPaymentMonitor();
  }
};

// extensions/shuncode/src/bridge-server.ts
export { import_node_crypto, import_node_http2, vscode2, SESSION_TOKEN_KEY, LICENSE_TOKEN_KEY, INSTALLATION_ID_KEY, ACCOUNT_STATE_KEY, PAYMENT_ORDER_STATE_KEY, PAYMENT_POLL_INTERVAL_MS, PAYMENT_POLL_MAX_INTERVAL_MS, PAYMENT_POLL_ERROR_NOTIFY_COUNT, PAYMENT_PLAN_CACHE_MS, REQUEST_TIMEOUT_MS, PAYMENT_PLAN_DISPLAY_NAMES, GITHUB_SCOPES, GITEE_SIGNIN_PATH, GITEE_CALLBACK_PATH, GITEE_RELAY_PATH, GITEE_LOGIN_TIMEOUT_MS, GITEE_CALLBACK_PAGE_PENDING, GITEE_CALLBACK_PAGE_DENIED, GITEE_CALLBACK_PAGE_INVALID, LicenseHttpError, BridgeLicenseService };
