// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { init_define_SHUNCODE_BUILD_INFO } from "../../../runtime/build-info.mjs";
// extensions/shuncode/src/bridge-route-token.ts
init_define_SHUNCODE_BUILD_INFO();
var DurableBridgeRouteToken = class {
  constructor(deps) {
    this.deps = deps;
  }
  deps;
  token = "";
  pending = Promise.resolve();
  get value() {
    return this.token;
  }
  initialize() {
    return this.enqueue(async () => {
      const stored = await this.deps.read();
      const candidate = stored || this.token || this.deps.generate();
      if (!stored) await this.deps.write(candidate);
      this.token = candidate;
    });
  }
  rotate() {
    return this.enqueue(async () => {
      const candidate = this.deps.generate();
      await this.deps.write(candidate);
      this.token = candidate;
    });
  }
  enqueue(action) {
    const result = this.pending.then(() => this.deps.withLock ? this.deps.withLock(action) : action());
    this.pending = result.catch(() => {});
    return result;
  }
};

// extensions/shuncode/src/bridge-tunnel-lease.ts
export { DurableBridgeRouteToken };
