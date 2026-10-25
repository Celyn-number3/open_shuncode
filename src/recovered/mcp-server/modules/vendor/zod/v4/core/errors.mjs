// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { $constructor } from "./core.mjs";
import { jsonStringifyReplacer } from "./util.mjs";
// node_modules/zod/v4/core/errors.js
var initializer = (inst, def) => {
  inst.name = "$ZodError";
  Object.defineProperty(inst, "_zod", {
    value: inst._zod,
    enumerable: false
  });
  Object.defineProperty(inst, "issues", {
    value: def,
    enumerable: false
  });
  inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
  Object.defineProperty(inst, "toString", {
    value: () => inst.message,
    enumerable: false
  });
};
var $ZodError = $constructor("$ZodError", initializer);
var $ZodRealError = $constructor("$ZodError", initializer, {
  Parent: Error
});
function flattenError(error51, mapper = issue2 => issue2.message) {
  const fieldErrors = {};
  const formErrors = [];
  for (const sub of error51.issues) {
    if (sub.path.length > 0) {
      fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
      fieldErrors[sub.path[0]].push(mapper(sub));
    } else {
      formErrors.push(mapper(sub));
    }
  }
  return {
    formErrors,
    fieldErrors
  };
}
function formatError(error51, mapper = issue2 => issue2.message) {
  const fieldErrors = {
    _errors: []
  };
  const processError = (error52, path7 = []) => {
    for (const issue2 of error52.issues) {
      if (issue2.code === "invalid_union" && issue2.errors.length) {
        issue2.errors.map(issues => processError({
          issues
        }, [...path7, ...issue2.path]));
      } else if (issue2.code === "invalid_key") {
        processError({
          issues: issue2.issues
        }, [...path7, ...issue2.path]);
      } else if (issue2.code === "invalid_element") {
        processError({
          issues: issue2.issues
        }, [...path7, ...issue2.path]);
      } else {
        const fullpath = [...path7, ...issue2.path];
        if (fullpath.length === 0) {
          fieldErrors._errors.push(mapper(issue2));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < fullpath.length) {
            const el = fullpath[i];
            const terminal = i === fullpath.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || {
                _errors: []
              };
            } else {
              curr[el] = curr[el] || {
                _errors: []
              };
              curr[el]._errors.push(mapper(issue2));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    }
  };
  processError(error51);
  return fieldErrors;
}
function treeifyError(error51, mapper = issue2 => issue2.message) {
  const result = {
    errors: []
  };
  const processError = (error52, path7 = []) => {
    var _a3, _b;
    for (const issue2 of error52.issues) {
      if (issue2.code === "invalid_union" && issue2.errors.length) {
        issue2.errors.map(issues => processError({
          issues
        }, [...path7, ...issue2.path]));
      } else if (issue2.code === "invalid_key") {
        processError({
          issues: issue2.issues
        }, [...path7, ...issue2.path]);
      } else if (issue2.code === "invalid_element") {
        processError({
          issues: issue2.issues
        }, [...path7, ...issue2.path]);
      } else {
        const fullpath = [...path7, ...issue2.path];
        if (fullpath.length === 0) {
          result.errors.push(mapper(issue2));
          continue;
        }
        let curr = result;
        let i = 0;
        while (i < fullpath.length) {
          const el = fullpath[i];
          const terminal = i === fullpath.length - 1;
          if (typeof el === "string") {
            curr.properties ?? (curr.properties = {});
            (_a3 = curr.properties)[el] ?? (_a3[el] = {
              errors: []
            });
            curr = curr.properties[el];
          } else {
            curr.items ?? (curr.items = []);
            (_b = curr.items)[el] ?? (_b[el] = {
              errors: []
            });
            curr = curr.items[el];
          }
          if (terminal) {
            curr.errors.push(mapper(issue2));
          }
          i++;
        }
      }
    }
  };
  processError(error51);
  return result;
}
function toDotPath(_path) {
  const segs = [];
  const path7 = _path.map(seg => typeof seg === "object" ? seg.key : seg);
  for (const seg of path7) {
    if (typeof seg === "number") segs.push(`[${seg}]`);else if (typeof seg === "symbol") segs.push(`[${JSON.stringify(String(seg))}]`);else if (/[^\w$]/.test(seg)) segs.push(`[${JSON.stringify(seg)}]`);else {
      if (segs.length) segs.push(".");
      segs.push(seg);
    }
  }
  return segs.join("");
}
function prettifyError(error51) {
  const lines = [];
  const issues = [...error51.issues].sort((a, b) => (a.path ?? []).length - (b.path ?? []).length);
  for (const issue2 of issues) {
    lines.push(`\u2716 ${issue2.message}`);
    if (issue2.path?.length) lines.push(`  \u2192 at ${toDotPath(issue2.path)}`);
  }
  return lines.join("\n");
}

// node_modules/zod/v4/core/parse.js
export { initializer, $ZodError, $ZodRealError, flattenError, formatError, treeifyError, toDotPath, prettifyError };
