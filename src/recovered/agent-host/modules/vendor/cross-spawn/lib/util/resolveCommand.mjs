// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { __commonJS } from "../../../../runtime/helpers.mjs";
import { init_define_SHUNCODE_BUILD_INFO } from "../../../../runtime/build-info.mjs";
import { require_which } from "../../../which/which.mjs";
import { require_path_key } from "../../../path-key/index.mjs";
// node_modules/cross-spawn/lib/util/resolveCommand.js
var require_resolveCommand = __commonJS({
  "node_modules/cross-spawn/lib/util/resolveCommand.js"(exports2, module2) {
    "use strict";

    init_define_SHUNCODE_BUILD_INFO();
    var path = require("path");
    var which = require_which();
    var getPathKey = require_path_key();
    function resolveCommandAttempt(parsed, withoutPathExt) {
      const env = parsed.options.env || process.env;
      const cwd = process.cwd();
      const hasCustomCwd = parsed.options.cwd != null;
      const shouldSwitchCwd = hasCustomCwd && process.chdir !== void 0 && !process.chdir.disabled;
      if (shouldSwitchCwd) {
        try {
          process.chdir(parsed.options.cwd);
        } catch (err) {}
      }
      let resolved;
      try {
        resolved = which.sync(parsed.command, {
          path: env[getPathKey({
            env
          })],
          pathExt: withoutPathExt ? path.delimiter : void 0
        });
      } catch (e) {} finally {
        if (shouldSwitchCwd) {
          process.chdir(cwd);
        }
      }
      if (resolved) {
        resolved = path.resolve(hasCustomCwd ? parsed.options.cwd : "", resolved);
      }
      return resolved;
    }
    function resolveCommand(parsed) {
      return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
    }
    module2.exports = resolveCommand;
  }
});

// node_modules/cross-spawn/lib/util/escape.js
export { require_resolveCommand };
