// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { __commonJS } from "../../runtime/helpers.mjs";
import { init_define_SHUNCODE_BUILD_INFO } from "../../runtime/build-info.mjs";
import { require_parse } from "./lib/parse.mjs";
import { require_enoent } from "./lib/enoent.mjs";
// node_modules/cross-spawn/index.js
var require_cross_spawn = __commonJS({
  "node_modules/cross-spawn/index.js"(exports2, module2) {
    "use strict";

    init_define_SHUNCODE_BUILD_INFO();
    var cp = require("child_process");
    var parse3 = require_parse();
    var enoent = require_enoent();
    function spawn2(command, args, options) {
      const parsed = parse3(command, args, options);
      const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);
      enoent.hookChildProcess(spawned, parsed);
      return spawned;
    }
    function spawnSync(command, args, options) {
      const parsed = parse3(command, args, options);
      const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);
      result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);
      return result;
    }
    module2.exports = spawn2;
    module2.exports.spawn = spawn2;
    module2.exports.sync = spawnSync;
    module2.exports._parse = parse3;
    module2.exports._enoent = enoent;
  }
});

// src/agent-host.ts
export { require_cross_spawn };
