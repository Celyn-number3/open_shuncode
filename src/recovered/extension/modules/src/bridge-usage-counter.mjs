// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { init_define_SHUNCODE_BUILD_INFO } from "../runtime/build-info.mjs";
// src/bridge-usage-counter.ts
init_define_SHUNCODE_BUILD_INFO();
var BridgeUsageCounter = class {
  pending = 0;
  recordToolCall() {
    this.pending += 1;
  }
  take() {
    const count = this.pending;
    this.pending = 0;
    return count;
  }
  returnCount(count) {
    if (Number.isFinite(count) && count > 0) {
      this.pending += count;
    }
  }
  reset() {
    const changed = this.pending !== 0;
    this.pending = 0;
    return changed;
  }
};

// src/concurrency.ts
export { BridgeUsageCounter };
