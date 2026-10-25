// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { __export } from "../../../../runtime/helpers.mjs";
import { init_define_SHUNCODE_BUILD_INFO } from "../../../../runtime/build-info.mjs";
import { _coercedBigint, _coercedBoolean, _coercedDate, _coercedNumber, _coercedString } from "../core/api.mjs";
import { ZodBigInt, ZodBoolean, ZodDate, ZodNumber, ZodString } from "./schemas.mjs";
// node_modules/zod/v4/classic/coerce.js
var coerce_exports = {};
__export(coerce_exports, {
  bigint: () => bigint2,
  boolean: () => boolean3,
  date: () => date3,
  number: () => number3,
  string: () => string3
});
init_define_SHUNCODE_BUILD_INFO();
function string3(params) {
  return _coercedString(ZodString, params);
}
function number3(params) {
  return _coercedNumber(ZodNumber, params);
}
function boolean3(params) {
  return _coercedBoolean(ZodBoolean, params);
}
function bigint2(params) {
  return _coercedBigint(ZodBigInt, params);
}
function date3(params) {
  return _coercedDate(ZodDate, params);
}

// node_modules/zod/v4/classic/external.js
export { coerce_exports, string3, number3, boolean3, bigint2, date3 };
