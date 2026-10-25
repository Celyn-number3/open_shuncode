// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { __commonJS } from "../../runtime/helpers.mjs";
import { init_define_SHUNCODE_BUILD_INFO } from "../../runtime/build-info.mjs";
// node_modules/path-key/index.js
var require_path_key = __commonJS({
  "node_modules/path-key/index.js"(exports2, module2) {
    "use strict";

    init_define_SHUNCODE_BUILD_INFO();
    var pathKey = (options = {}) => {
      const environment = options.env || process.env;
      const platform = options.platform || process.platform;
      if (platform !== "win32") {
        return "PATH";
      }
      return Object.keys(environment).reverse().find(key => key.toUpperCase() === "PATH") || "Path";
    };
    module2.exports = pathKey;
    module2.exports.default = pathKey;
  }
});

// node_modules/cross-spawn/lib/util/resolveCommand.js
export { require_path_key };
