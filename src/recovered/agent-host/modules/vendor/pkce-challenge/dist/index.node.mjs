// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { init_define_SHUNCODE_BUILD_INFO } from "../../../runtime/build-info.mjs";
// node_modules/pkce-challenge/dist/index.node.js
init_define_SHUNCODE_BUILD_INFO();
var crypto;
crypto = globalThis.crypto?.webcrypto ??
// Node.js [18-16] REPL
globalThis.crypto ??
// Node.js >18
import("node:crypto").then(m => m.webcrypto);

// node_modules/@modelcontextprotocol/client/dist/index.mjs
export { crypto };
