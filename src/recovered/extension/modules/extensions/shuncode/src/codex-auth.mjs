// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { __toESM } from "../../../runtime/helpers.mjs";
import { init_define_SHUNCODE_BUILD_INFO } from "../../../runtime/build-info.mjs";
import { fetchWithExtensionHostFallbacks, resolveExtensionHostProxy } from "./extension-host-proxy.mjs";
// extensions/shuncode/src/codex-auth.ts
init_define_SHUNCODE_BUILD_INFO();
var import_node_crypto10 = require("node:crypto");
var import_node_fs10 = __toESM(require("node:fs"));
var import_node_http4 = __toESM(require("node:http"));
var import_node_os3 = __toESM(require("node:os"));
var import_node_path15 = __toESM(require("node:path"));
var vscode5 = __toESM(require("vscode"));
var CODEX_CLIENT_ID = "app_EMoamEEZ73f0CkXaXp7hrann";
var CODEX_ISSUER = "https://auth.openai.com";
var CODEX_AUTHORIZE_URL = `${CODEX_ISSUER}/oauth/authorize`;
var CODEX_TOKEN_URL = `${CODEX_ISSUER}/oauth/token`;
var CODEX_REVOKE_URL = `${CODEX_ISSUER}/oauth/revoke`;
var CODEX_API_BASE_URL = "https://chatgpt.com/backend-api/codex";
var CODEX_REDIRECT_PORT = 1455;
var CODEX_REDIRECT_URI = `http://localhost:${CODEX_REDIRECT_PORT}/auth/callback`;
var CODEX_SCOPE = "openid profile email offline_access api.connectors.read api.connectors.invoke";
var CODEX_ORIGINATOR = "codex_cli_rs";
var CODEX_CLIENT_VERSION = "0.153.0";
var CODEX_USER_AGENT = `codex_cli_rs/${CODEX_CLIENT_VERSION}`;
var CODEX_BETA_HEADER = "responses=experimental";
var CODEX_AUTH_TIMEOUT_MS = 3e5;
var CODEX_TOKEN_REQUEST_TIMEOUT_MS = 2e4;
var REFRESH_LEAD_TIME_MS = 5 * 6e4;
var authChangeEmitter = new vscode5.EventEmitter();
var loginStateChangeEmitter = new vscode5.EventEmitter();
var onCodexAuthChange = authChangeEmitter.event;
var onCodexLoginStateChange = loginStateChangeEmitter.event;
function codexHomeDir() {
  const home = process.env.CODEX_HOME?.trim();
  return home ? import_node_path15.default.resolve(home) : import_node_path15.default.join(import_node_os3.default.homedir(), ".codex");
}
function authFilePath() {
  return import_node_path15.default.join(codexHomeDir(), "auth.json");
}
function readAuthFile() {
  try {
    const file = authFilePath();
    if (!import_node_fs10.default.existsSync(file)) return void 0;
    return JSON.parse(import_node_fs10.default.readFileSync(file, "utf8"));
  } catch {
    return void 0;
  }
}
function writeAuthFile(auth) {
  const file = authFilePath();
  import_node_fs10.default.mkdirSync(import_node_path15.default.dirname(file), {
    recursive: true
  });
  const temporary = `${file}.tmp-${process.pid}-${Date.now()}`;
  import_node_fs10.default.writeFileSync(temporary, `${JSON.stringify(auth, null, 2)}
`, {
    mode: 384
  });
  import_node_fs10.default.renameSync(temporary, file);
}
function storedTokens(auth) {
  const tokens = auth?.tokens ?? {};
  return {
    access_token: tokens.access_token ?? auth?.access_token,
    refresh_token: tokens.refresh_token ?? auth?.refresh_token,
    id_token: tokens.id_token ?? auth?.id_token,
    account_id: tokens.account_id ?? auth?.account_id,
    plan_type: tokens.plan_type ?? auth?.plan_type
  };
}
function decodeJwtPayload(token) {
  try {
    const segment = token.split(".")[1];
    if (!segment) return void 0;
    const padded = segment.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(Buffer.from(padded, "base64").toString("utf8"));
  } catch {
    return void 0;
  }
}
function tokenExpirySeconds(accessToken) {
  const claims = decodeJwtPayload(accessToken);
  return typeof claims?.exp === "number" && Number.isFinite(claims.exp) ? claims.exp : void 0;
}
function authClaim(claims) {
  const value = claims?.["https://api.openai.com/auth"];
  return value && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
function accountFromAuth(auth) {
  if (!auth) return void 0;
  const tokens = storedTokens(auth);
  if (!tokens.access_token) return void 0;
  const claims = typeof tokens.id_token === "string" ? decodeJwtPayload(tokens.id_token) : void 0;
  const authInfo = authClaim(claims);
  const accountId = tokens.account_id ?? (typeof authInfo?.chatgpt_account_id === "string" ? authInfo.chatgpt_account_id : void 0) ?? (typeof authInfo?.account_id === "string" ? authInfo.account_id : void 0);
  if (!accountId) return void 0;
  return {
    accountId,
    email: typeof authInfo?.email === "string" ? authInfo.email : typeof claims?.email === "string" ? claims.email : void 0,
    planType: tokens.plan_type ?? (typeof authInfo?.chatgpt_plan_type === "string" ? authInfo.chatgpt_plan_type : void 0)
  };
}
async function postTokenEndpoint(body, contentType, label) {
  const target = new URL(CODEX_TOKEN_URL);
  const httpConfiguration = vscode5.workspace.getConfiguration("http");
  const proxySupport = httpConfiguration.get("proxySupport");
  const configuredProxy = httpConfiguration.get("proxy")?.trim();
  const proxyUrl = proxySupport === "off" ? void 0 : resolveExtensionHostProxy(target, configuredProxy);
  const signal = AbortSignal.timeout(CODEX_TOKEN_REQUEST_TIMEOUT_MS);
  let response;
  try {
    response = await fetchWithExtensionHostFallbacks(target, {
      method: "POST",
      headers: {
        "content-type": contentType
      },
      body,
      signal,
      proxyUrl,
      configuredProxy,
      rejectUnauthorized: httpConfiguration.get("proxyStrictSSL", true),
      useElectron: proxySupport !== "off",
      proxySupport: proxySupport === "off" ? "off" : void 0,
      attemptTimeoutMs: 8e3
    });
  } catch (error2) {
    const timedOut = signal.aborted || error2 instanceof Error && (error2.name === "TimeoutError" || error2.name === "AbortError");
    const detail = timedOut ? "token request timed out" : error2 instanceof Error ? error2.message : String(error2);
    throw new Error(`${label}: ${detail}.`);
  }
  const raw = await response.text();
  let payload = {};
  try {
    payload = raw ? JSON.parse(raw) : {};
  } catch {}
  if (!response.ok) {
    const detail = typeof payload?.error_description === "string" ? payload.error_description : typeof payload?.error === "string" ? payload.error : typeof payload?.detail === "string" ? payload.detail : raw.slice(0, 300);
    throw new Error(`${label}: ${detail || `HTTP ${response.status}`}`);
  }
  if (typeof payload?.access_token !== "string") throw new Error(`${label}: the token endpoint returned no access token.`);
  return payload;
}
async function exchangeCode(code, codeVerifier) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: CODEX_REDIRECT_URI,
    client_id: CODEX_CLIENT_ID,
    code_verifier: codeVerifier
  }).toString();
  const payload = await postTokenEndpoint(body, "application/x-www-form-urlencoded", "Codex sign-in failed");
  return {
    access_token: payload.access_token,
    refresh_token: typeof payload.refresh_token === "string" ? payload.refresh_token : void 0,
    id_token: typeof payload.id_token === "string" ? payload.id_token : void 0
  };
}
async function refreshTokens(tokens, auth) {
  if (!tokens.refresh_token) {
    throw new Error("Codex session has no refresh token. Sign in again with 'ShunCode: Sign in with Codex'.");
  }
  const body = JSON.stringify({
    client_id: CODEX_CLIENT_ID,
    grant_type: "refresh_token",
    refresh_token: tokens.refresh_token
  });
  const refreshed = await postTokenEndpoint(body, "application/json", "Codex session refresh failed");
  const nextIdToken = typeof refreshed.id_token === "string" ? refreshed.id_token : tokens.id_token;
  const claims = typeof nextIdToken === "string" ? decodeJwtPayload(nextIdToken) : void 0;
  const authInfo = authClaim(claims);
  const accountId = tokens.account_id ?? (typeof authInfo?.chatgpt_account_id === "string" ? authInfo.chatgpt_account_id : void 0);
  if (!accountId) {
    throw new Error("Codex session refresh succeeded but the account ID could not be determined. Sign in again.");
  }
  writeAuthFile({
    ...(auth ?? {}),
    auth_mode: auth?.auth_mode ?? "chatgpt",
    tokens: {
      access_token: refreshed.access_token,
      refresh_token: typeof refreshed.refresh_token === "string" ? refreshed.refresh_token : tokens.refresh_token,
      id_token: claims ?? nextIdToken,
      account_id: accountId,
      plan_type: tokens.plan_type ?? (typeof authInfo?.chatgpt_plan_type === "string" ? authInfo.chatgpt_plan_type : void 0)
    },
    last_refresh: (/* @__PURE__ */new Date()).toISOString()
  });
  authChangeEmitter.fire();
  return {
    accessToken: refreshed.access_token,
    accountId
  };
}
var refreshInFlight;
async function getRequestContext(forceRefresh = false) {
  if (forceRefresh && refreshInFlight) return refreshInFlight;
  const auth = readAuthFile();
  const tokens = storedTokens(auth);
  if (!tokens.access_token) {
    throw new Error("Not signed in to Codex. Run 'ShunCode: Sign in with Codex' first.");
  }
  const account = accountFromAuth(auth);
  if (!account) {
    throw new Error("Codex credentials are missing the account ID. Sign in again with 'ShunCode: Sign in with Codex'.");
  }
  const expiresAt = tokenExpirySeconds(tokens.access_token);
  const needsRefresh = forceRefresh || expiresAt === void 0 || expiresAt * 1e3 < Date.now() + REFRESH_LEAD_TIME_MS;
  if (!needsRefresh) return {
    accessToken: tokens.access_token,
    accountId: account.accountId
  };
  if (!refreshInFlight) {
    refreshInFlight = refreshTokens(tokens, auth).finally(() => {
      refreshInFlight = void 0;
    });
  }
  return refreshInFlight;
}
async function getStatus() {
  const auth = readAuthFile();
  const account = accountFromAuth(auth);
  if (!account) return {
    signedIn: false
  };
  const tokens = storedTokens(auth);
  return {
    signedIn: true,
    account,
    expiresAt: tokenExpirySeconds(tokens.access_token ?? "")
  };
}
async function revokeTokensBestEffort(tokens) {
  const token = tokens.refresh_token ?? tokens.access_token;
  if (!token) return;
  try {
    await fetch(CODEX_REVOKE_URL, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        client_id: CODEX_CLIENT_ID,
        token
      }).toString(),
      signal: AbortSignal.timeout(5e3)
    });
  } catch {}
}
async function signOut() {
  const auth = readAuthFile();
  const tokens = storedTokens(auth);
  if (auth?.openai_api_key && !tokens.access_token) {
    throw new Error("~/.codex/auth.json contains an API-key login. ShunCode only manages ChatGPT sign-in; sign out with the Codex CLI instead.");
  }
  await revokeTokensBestEffort(tokens);
  const file = authFilePath();
  if (import_node_fs10.default.existsSync(file)) import_node_fs10.default.rmSync(file, {
    force: true
  });
  authChangeEmitter.fire();
  loginStateChangeEmitter.fire();
}
function escapeHtml(value) {
  return value.replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character] ?? character);
}
async function startLogin(cancellationToken) {
  const existing = await getStatus();
  if (existing.signedIn) {
    throw new Error(`Already signed in to Codex as ${existing.account?.email ?? existing.account?.accountId}. Sign out first to switch accounts.`);
  }
  const codeVerifier = (0, import_node_crypto10.randomBytes)(48).toString("base64url");
  const codeChallenge = (0, import_node_crypto10.createHash)("sha256").update(codeVerifier).digest("base64url");
  const state = (0, import_node_crypto10.randomBytes)(16).toString("hex");
  const authorizeParams = new URLSearchParams({
    response_type: "code",
    client_id: CODEX_CLIENT_ID,
    redirect_uri: CODEX_REDIRECT_URI,
    scope: CODEX_SCOPE,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    id_token_add_organizations: "true",
    codex_cli_simplified_flow: "true",
    state,
    originator: CODEX_ORIGINATOR
  });
  const authorizeUrl = `${CODEX_AUTHORIZE_URL}?${authorizeParams.toString()}`;
  let server;
  let settled = false;
  let resolveCode;
  let rejectLogin;
  const settle = result => {
    if (settled) return;
    settled = true;
    if (server) {
      try {
        server.close();
      } catch {}
      server = void 0;
    }
    if (typeof result === "string") resolveCode?.(result);else rejectLogin?.(result);
  };
  server = import_node_http4.default.createServer((request, response) => {
    let url2;
    try {
      url2 = new URL(request.url ?? "/", CODEX_REDIRECT_URI);
    } catch {
      response.writeHead(400);
      response.end("Bad request");
      return;
    }
    if (url2.pathname !== "/auth/callback") {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    const errorCode = url2.searchParams.get("error");
    if (errorCode) {
      const description = url2.searchParams.get("error_description") ?? "The authorization request was denied.";
      response.writeHead(400, {
        "content-type": "text/html; charset=utf-8"
      });
      response.end(`<!doctype html><meta charset="utf-8"><h3>Codex sign-in failed</h3><p>${escapeHtml(description)}</p><p>You can close this window and try again.</p>`);
      settle(new Error(`Codex sign-in was not completed: ${description}`));
      return;
    }
    const returnedState = url2.searchParams.get("state");
    if (returnedState !== state) {
      response.writeHead(400, {
        "content-type": "text/html; charset=utf-8"
      });
      response.end('<!doctype html><meta charset="utf-8"><h3>Codex sign-in failed</h3><p>The callback state did not match. You can close this window and try again.</p>');
      settle(new Error("Codex sign-in callback state mismatch."));
      return;
    }
    const code2 = url2.searchParams.get("code");
    if (!code2) {
      response.writeHead(400, {
        "content-type": "text/html; charset=utf-8"
      });
      response.end('<!doctype html><meta charset="utf-8"><h3>Codex sign-in failed</h3><p>Missing authorization code. You can close this window and try again.</p>');
      settle(new Error("Codex sign-in callback was missing the authorization code."));
      return;
    }
    response.writeHead(200, {
      "content-type": "text/html; charset=utf-8"
    });
    response.end('<!doctype html><meta charset="utf-8"><h3>Signed in to Codex</h3><p>You can close this window and return to ShunCode.</p>');
    settle(code2);
  });
  const codePromise = new Promise((resolve, reject) => {
    resolveCode = resolve;
    rejectLogin = reject;
  });
  const timeout = setTimeout(() => settle(new Error(`Codex sign-in timed out after ${CODEX_AUTH_TIMEOUT_MS / 1e3} seconds.`)), CODEX_AUTH_TIMEOUT_MS);
  const cancellation = cancellationToken?.onCancellationRequested(() => settle(new vscode5.CancellationError()));
  const cleanup = () => {
    clearTimeout(timeout);
    cancellation?.dispose();
  };
  try {
    await new Promise((resolveListen, rejectListen) => {
      server?.once("error", error2 => {
        if (error2.code === "EADDRINUSE") {
          rejectListen(new Error(`Port ${CODEX_REDIRECT_PORT} is already in use. Free it (it is the Codex OAuth callback port) and try again.`));
        } else {
          rejectListen(error2);
        }
      });
      server?.listen(CODEX_REDIRECT_PORT, "localhost", resolveListen);
    });
  } catch (error2) {
    cleanup();
    try {
      server?.close();
    } catch {}
    throw error2;
  }
  const opened = await vscode5.env.openExternal(vscode5.Uri.parse(authorizeUrl));
  if (!opened) {
    cleanup();
    throw new Error("Could not open the browser for Codex sign-in. Run 'ShunCode: Show Codex Account Status' for help.");
  }
  let code;
  try {
    code = await codePromise;
  } finally {
    cleanup();
  }
  const tokens = await exchangeCode(code, codeVerifier);
  const claims = typeof tokens.id_token === "string" ? decodeJwtPayload(tokens.id_token) : void 0;
  const authInfo = authClaim(claims);
  const accountId = typeof authInfo?.chatgpt_account_id === "string" ? authInfo.chatgpt_account_id : "";
  if (!accountId) {
    throw new Error("Codex sign-in succeeded but the account ID could not be read from the token. Try signing in again.");
  }
  const account = {
    accountId,
    email: typeof authInfo?.email === "string" ? authInfo.email : typeof claims?.email === "string" ? claims.email : void 0,
    planType: typeof authInfo?.chatgpt_plan_type === "string" ? authInfo.chatgpt_plan_type : void 0
  };
  writeAuthFile({
    auth_mode: "chatgpt",
    tokens: {
      id_token: claims ?? tokens.id_token,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      account_id: accountId,
      plan_type: account.planType
    },
    last_refresh: (/* @__PURE__ */new Date()).toISOString()
  });
  authChangeEmitter.fire();
  loginStateChangeEmitter.fire();
  return account;
}
var codexAuthManager = {
  getStatus,
  getRequestContext,
  forceRefresh: () => getRequestContext(true),
  startLogin,
  signOut
};

// extensions/shuncode/src/branch-state.ts
export { import_node_crypto10, import_node_fs10, import_node_http4, import_node_os3, import_node_path15, vscode5, CODEX_CLIENT_ID, CODEX_ISSUER, CODEX_AUTHORIZE_URL, CODEX_TOKEN_URL, CODEX_REVOKE_URL, CODEX_API_BASE_URL, CODEX_REDIRECT_PORT, CODEX_REDIRECT_URI, CODEX_SCOPE, CODEX_ORIGINATOR, CODEX_CLIENT_VERSION, CODEX_USER_AGENT, CODEX_BETA_HEADER, CODEX_AUTH_TIMEOUT_MS, CODEX_TOKEN_REQUEST_TIMEOUT_MS, REFRESH_LEAD_TIME_MS, authChangeEmitter, loginStateChangeEmitter, onCodexAuthChange, onCodexLoginStateChange, codexHomeDir, authFilePath, readAuthFile, writeAuthFile, storedTokens, decodeJwtPayload, tokenExpirySeconds, authClaim, accountFromAuth, postTokenEndpoint, exchangeCode, refreshTokens, refreshInFlight, getRequestContext, getStatus, revokeTokensBestEffort, signOut, escapeHtml, startLogin, codexAuthManager };
