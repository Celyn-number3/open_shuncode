// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { define_SHUNCODE_BUILD_INFO_default, init_define_SHUNCODE_BUILD_INFO } from "../runtime/build-info.mjs";
import { SHUNCODE_BEHAVIOR_VERSION } from "./version.mjs";
// src/build-info.ts
init_define_SHUNCODE_BUILD_INFO();

// src/version.ts

// src/build-info.ts
function injectedBuildInfo() {
  if (typeof define_SHUNCODE_BUILD_INFO_default === "undefined") return {};
  return define_SHUNCODE_BUILD_INFO_default ?? {};
}
function asNonEmptyString(value) {
  return typeof value === "string" && value.length > 0 ? value : void 0;
}
function getBuildInfo() {
  const injected = injectedBuildInfo();
  return {
    version: asNonEmptyString(injected.version) ?? SHUNCODE_BEHAVIOR_VERSION,
    gitSha: asNonEmptyString(injected.gitSha) ?? "unknown",
    builtAt: asNonEmptyString(injected.builtAt) ?? "unknown",
    release: injected.release === true
  };
}

// src/mcp-protocol.ts
export { injectedBuildInfo, asNonEmptyString, getBuildInfo };
