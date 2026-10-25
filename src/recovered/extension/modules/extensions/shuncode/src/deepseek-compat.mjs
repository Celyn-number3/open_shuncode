// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { init_define_SHUNCODE_BUILD_INFO } from "../../../runtime/build-info.mjs";
// extensions/shuncode/src/deepseek-compat.mts
init_define_SHUNCODE_BUILD_INFO();
var DEEPSEEK_CONTEXT_WINDOW_TOKENS = 1e6;
var DEEPSEEK_MAX_OUTPUT_TOKENS = 384e3;
var DEEPSEEK_REASONING_EFFORTS = ["low", "high", "max"];
var DEEPSEEK_DEFAULT_REASONING_EFFORT = "max";
function resolveDeepSeekThinkingEffort(value) {
  const normalized = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (normalized === "disabled") return {
    thinking: "disabled"
  };
  const reasoningEffort = DEEPSEEK_REASONING_EFFORTS.find(effort => effort === normalized);
  return reasoningEffort ? {
    thinking: "enabled",
    reasoningEffort
  } : void 0;
}
function isOfficialDeepSeekApiBaseUrl(value) {
  try {
    const url2 = new URL(value);
    return url2.hostname.toLowerCase() === "api.deepseek.com" && !/^\/anthropic(?:\/|$)/i.test(url2.pathname);
  } catch {
    return false;
  }
}
function normalizeOfficialDeepSeekApiBaseUrl(value) {
  if (!isOfficialDeepSeekApiBaseUrl(value)) return value;
  const url2 = new URL(value);
  const pathname = url2.pathname.replace(/\/+$/, "");
  if (pathname === "/v1") url2.pathname = "";else if (pathname === "/v1/chat/completions") url2.pathname = "/chat/completions";
  url2.search = "";
  url2.hash = "";
  return url2.toString().replace(/\/+$/, "");
}

// extensions/shuncode/src/model-defaults.mts
export { DEEPSEEK_CONTEXT_WINDOW_TOKENS, DEEPSEEK_MAX_OUTPUT_TOKENS, DEEPSEEK_REASONING_EFFORTS, DEEPSEEK_DEFAULT_REASONING_EFFORT, resolveDeepSeekThinkingEffort, isOfficialDeepSeekApiBaseUrl, normalizeOfficialDeepSeekApiBaseUrl };
