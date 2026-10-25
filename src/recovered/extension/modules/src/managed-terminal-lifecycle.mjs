// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { init_define_SHUNCODE_BUILD_INFO } from "../runtime/build-info.mjs";
// src/managed-terminal-lifecycle.ts
init_define_SHUNCODE_BUILD_INFO();
var MANAGED_TERMINAL_IDLE_TIMEOUT_MS = 2 * 60 * 60 * 1e3;
function managedTerminalIdleDelay(lastUsedAt, now = Date.now()) {
  return Math.max(0, lastUsedAt + MANAGED_TERMINAL_IDLE_TIMEOUT_MS - now);
}
function isManagedTerminalIdleExpired(lastUsedAt, now = Date.now()) {
  return managedTerminalIdleDelay(lastUsedAt, now) === 0;
}

// extensions/shuncode/src/lsp-tool.ts
export { MANAGED_TERMINAL_IDLE_TIMEOUT_MS, managedTerminalIdleDelay, isManagedTerminalIdleExpired };
