// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { init_define_SHUNCODE_BUILD_INFO } from "../../../../runtime/build-info.mjs";
// node_modules/zod/v4/core/doc.js
init_define_SHUNCODE_BUILD_INFO();
var Doc = class {
  constructor(args = []) {
    this.content = [];
    this.indent = 0;
    if (this) this.args = args;
  }
  indented(fn) {
    this.indent += 1;
    fn(this);
    this.indent -= 1;
  }
  write(arg) {
    if (typeof arg === "function") {
      arg(this, {
        execution: "sync"
      });
      arg(this, {
        execution: "async"
      });
      return;
    }
    const content = arg;
    const lines = content.split("\n").filter(x => x);
    const minIndent = Math.min(...lines.map(x => x.length - x.trimStart().length));
    const dedented = lines.map(x => x.slice(minIndent)).map(x => " ".repeat(this.indent * 2) + x);
    for (const line of dedented) {
      this.content.push(line);
    }
  }
  compile() {
    const F = Function;
    const args = this?.args;
    const content = this?.content ?? [``];
    const lines = [...content.map(x => `  ${x}`)];
    return new F(...args, lines.join("\n"));
  }
};

// node_modules/zod/v4/core/versions.js
export { Doc };
