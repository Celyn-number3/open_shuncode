// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { __commonJS } from "../../runtime/helpers.mjs";
import { init_define_SHUNCODE_BUILD_INFO } from "../../runtime/build-info.mjs";
import { require_shebang_regex } from "../shebang-regex/index.mjs";
// node_modules/shebang-command/index.js
var require_shebang_command = __commonJS({
  "node_modules/shebang-command/index.js"(exports2, module2) {
    "use strict";

    init_define_SHUNCODE_BUILD_INFO();
    var shebangRegex = require_shebang_regex();
    module2.exports = (string4 = "") => {
      const match = string4.match(shebangRegex);
      if (!match) {
        return null;
      }
      const [path, argument] = match[0].replace(/#! ?/, "").split(" ");
      const binary = path.split("/").pop();
      if (binary === "env") {
        return argument;
      }
      return argument ? `${binary} ${argument}` : binary;
    };
  }
});

// node_modules/cross-spawn/lib/util/readShebang.js
export { require_shebang_command };
