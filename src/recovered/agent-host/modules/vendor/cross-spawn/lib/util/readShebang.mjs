// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { __commonJS } from "../../../../runtime/helpers.mjs";
import { init_define_SHUNCODE_BUILD_INFO } from "../../../../runtime/build-info.mjs";
import { require_shebang_command } from "../../../shebang-command/index.mjs";
// node_modules/cross-spawn/lib/util/readShebang.js
var require_readShebang = __commonJS({
  "node_modules/cross-spawn/lib/util/readShebang.js"(exports2, module2) {
    "use strict";

    init_define_SHUNCODE_BUILD_INFO();
    var fs = require("fs");
    var shebangCommand = require_shebang_command();
    function readShebang(command) {
      const size = 150;
      const buffer = Buffer.alloc(size);
      let fd;
      try {
        fd = fs.openSync(command, "r");
        fs.readSync(fd, buffer, 0, size, 0);
        fs.closeSync(fd);
      } catch (e) {}
      return shebangCommand(buffer.toString());
    }
    module2.exports = readShebang;
  }
});

// node_modules/cross-spawn/lib/parse.js
export { require_readShebang };
