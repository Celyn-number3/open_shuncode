// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { init_define_SHUNCODE_BUILD_INFO } from "../../../../runtime/build-info.mjs";
import { $constructor } from "../core/core.mjs";
import { jsonStringifyReplacer } from "../core/util.mjs";
import { $ZodError, flattenError, formatError } from "../core/errors.mjs";
// node_modules/zod/v4/classic/errors.js
init_define_SHUNCODE_BUILD_INFO();
var initializer2 = (inst, issues) => {
  $ZodError.init(inst, issues);
  inst.name = "ZodError";
  Object.defineProperties(inst, {
    format: {
      value: mapper => formatError(inst, mapper)
      // enumerable: false,
    },
    flatten: {
      value: mapper => flattenError(inst, mapper)
      // enumerable: false,
    },
    addIssue: {
      value: issue2 => {
        inst.issues.push(issue2);
        inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
      }
      // enumerable: false,
    },
    addIssues: {
      value: issues2 => {
        inst.issues.push(...issues2);
        inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
      }
      // enumerable: false,
    },
    isEmpty: {
      get() {
        return inst.issues.length === 0;
      }
      // enumerable: false,
    }
  });
};
var ZodRealError = /* @__PURE__ */$constructor("ZodError", initializer2, {
  Parent: Error
});

// node_modules/zod/v4/classic/parse.js
export { initializer2, ZodRealError };
