// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { init_define_SHUNCODE_BUILD_INFO } from "../runtime/build-info.mjs";
// src/deepseek-compat.ts
init_define_SHUNCODE_BUILD_INFO();
var DEEPSEEK_CONTEXT_WINDOW_TOKENS = 1e6;
var DEEPSEEK_MAX_OUTPUT_TOKENS = 384e3;
var DEEPSEEK_DEFAULT_REASONING_EFFORT = "max";
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

// src/agent-tool-content.ts
export { DEEPSEEK_CONTEXT_WINDOW_TOKENS, DEEPSEEK_MAX_OUTPUT_TOKENS, DEEPSEEK_DEFAULT_REASONING_EFFORT, isOfficialDeepSeekApiBaseUrl, normalizeOfficialDeepSeekApiBaseUrl };
