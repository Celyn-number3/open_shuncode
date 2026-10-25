// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { init_define_SHUNCODE_BUILD_INFO } from "../../../runtime/build-info.mjs";
// extensions/shuncode/src/bridge-payment-network.mts
init_define_SHUNCODE_BUILD_INFO();
var PaymentCreationUncertainError = class extends Error {
  constructor() {
    super("\u8BA2\u5355\u521B\u5EFA\u7ED3\u679C\u6682\u4E0D\u660E\u786E\uFF0C\u8BF7\u5148\u68C0\u67E5\u5DF2\u6709\u8BA2\u5355\uFF0C\u4E0D\u8981\u91CD\u590D\u4E0B\u5355\u3002\u6B64\u6B21\u8BF7\u6C42\u4E0D\u4F1A\u81EA\u52A8\u91CD\u53D1\u3002");
    this.name = "PaymentCreationUncertainError";
  }
};
async function sendPaymentOnce(target, init, routes, log = () => {}) {
  if (init.method?.toUpperCase() !== "POST") throw new Error("Payment transport accepts only POST");
  if (target.protocol !== "https:" && !["localhost", "127.0.0.1", "[::1]"].includes(target.hostname)) throw new Error("Payment transport requires HTTPS");
  const started = Date.now();
  const controller = new AbortController();
  const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(4e3), ...(init.signal ? [init.signal] : [])]);
  let route;
  try {
    route = await Promise.any(routes.map(async route2 => {
      const response = await route2.send(new URL("/health", target), {
        method: "GET",
        signal,
        redirect: "error",
        cache: "no-store"
      });
      if (!response.ok) {
        await response.body?.cancel();
        throw new Error("Health probe failed");
      }
      const health = await response.json();
      if (signal.aborted || health.ok !== true || health.service !== "shuncode-bridge-license") throw new Error("Health probe did not verify the license service");
      return route2;
    }));
  } catch {
    throw new Error("\u652F\u4ED8\u670D\u52A1\u8FDE\u63A5\u68C0\u67E5\u5931\u8D25\uFF0C\u5C1A\u672A\u53D1\u9001\u4E0B\u5355\u8BF7\u6C42\u3002\u8BF7\u68C0\u67E5\u7F51\u7EDC\u540E\u91CD\u8BD5\u3002");
  } finally {
    controller.abort();
  }
  if (init.signal?.aborted) throw init.signal.reason;
  log(`payment route ready: ${route.name}; probeMs=${Date.now() - started}`);
  const sent = Date.now();
  try {
    const response = await route.send(target, {
      ...init,
      redirect: "error"
    });
    log(`payment create response: HTTP ${response.status}; requestMs=${Date.now() - sent}`);
    if (response.status >= 500 || response.status >= 300 && response.status < 400) throw new PaymentCreationUncertainError();
    if (response.ok) {
      const body = await response.text();
      const parsed = JSON.parse(body);
      if (typeof parsed.order?.id !== "string" || !parsed.order.id || typeof parsed.checkoutUrl !== "string") throw new PaymentCreationUncertainError();
      return new Response(body, {
        status: response.status,
        headers: response.headers
      });
    }
    return response;
  } catch {
    throw new PaymentCreationUncertainError();
  }
}

// extensions/shuncode/src/bridge-license-claims.js
export { PaymentCreationUncertainError, sendPaymentOnce };
