// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { init_define_SHUNCODE_BUILD_INFO } from "../../../runtime/build-info.mjs";
import { DurableBridgeRouteToken } from "./bridge-route-token.mjs";
import { acquireBridgeTunnelLease, isBridgeTunnelLeaseConflict } from "./bridge-tunnel-lease.mjs";
// extensions/shuncode/src/bridge-route-token-storage.ts
init_define_SHUNCODE_BUILD_INFO();
var import_node_crypto3 = require("node:crypto");

// extensions/shuncode/src/bridge-route-token.ts

// extensions/shuncode/src/bridge-route-token-storage.ts
var ROUTE_TOKEN_SECRET = "shuncode.bridge.routeToken";
function createWindowsBridgeRouteIdentity(context) {
  return new DurableBridgeRouteToken({
    read: async () => context.secrets.get(ROUTE_TOKEN_SECRET),
    write: async token => context.secrets.store(ROUTE_TOKEN_SECRET, token),
    generate: () => (0, import_node_crypto3.randomBytes)(16).toString("hex"),
    withLock: async action => {
      const resource = `route-identity:${context.globalStorageUri.toString()}:${ROUTE_TOKEN_SECRET}`;
      for (let attempt = 0;; attempt++) {
        let release;
        try {
          release = await acquireBridgeTunnelLease([resource]);
        } catch (error2) {
          if (!isBridgeTunnelLeaseConflict(error2) || attempt >= 49) throw error2;
          await new Promise(resolve => setTimeout(resolve, 100));
          continue;
        }
        try {
          return await action();
        } finally {
          await release();
        }
      }
    }
  });
}

// extensions/shuncode/src/bridge-mcp-transport.ts
export { import_node_crypto3, ROUTE_TOKEN_SECRET, createWindowsBridgeRouteIdentity };
