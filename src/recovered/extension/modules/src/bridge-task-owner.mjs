// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { init_define_SHUNCODE_BUILD_INFO } from "../runtime/build-info.mjs";
// src/bridge-task-owner.ts
init_define_SHUNCODE_BUILD_INFO();
var import_node_crypto4 = require("node:crypto");
var MODERN_COMMAND_OWNER_PREFIX = "modern:";
var MODERN_TASK_OWNER_PREFIX = "task-modern:";
function bridgeIdentityDigest(identity) {
  return (0, import_node_crypto4.createHash)("sha256").update(JSON.stringify(identity)).digest("hex");
}
function bridgeOwnerFromIdentity(prefix, identity) {
  return `${prefix}${bridgeIdentityDigest(identity)}`;
}

// extensions/shuncode/src/bridge-mcp-modern.ts
export { import_node_crypto4, MODERN_COMMAND_OWNER_PREFIX, MODERN_TASK_OWNER_PREFIX, bridgeIdentityDigest, bridgeOwnerFromIdentity };
