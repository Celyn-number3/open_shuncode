// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { __export } from "../../../../runtime/helpers.mjs";
import { init_define_SHUNCODE_BUILD_INFO } from "../../../../runtime/build-info.mjs";
import { $constructor } from "../core/core.mjs";
import { $ZodISODate, $ZodISODateTime, $ZodISODuration, $ZodISOTime } from "../core/schemas.mjs";
import { _isoDate, _isoDateTime, _isoDuration, _isoTime } from "../core/api.mjs";
import { ZodStringFormat } from "./schemas.mjs";
// node_modules/zod/v4/classic/iso.js
var iso_exports = {};
__export(iso_exports, {
  ZodISODate: () => ZodISODate,
  ZodISODateTime: () => ZodISODateTime,
  ZodISODuration: () => ZodISODuration,
  ZodISOTime: () => ZodISOTime,
  date: () => date2,
  datetime: () => datetime2,
  duration: () => duration2,
  time: () => time2
});
init_define_SHUNCODE_BUILD_INFO();
var ZodISODateTime = /* @__PURE__ */$constructor("ZodISODateTime", (inst, def) => {
  $ZodISODateTime.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function datetime2(params) {
  return _isoDateTime(ZodISODateTime, params);
}
var ZodISODate = /* @__PURE__ */$constructor("ZodISODate", (inst, def) => {
  $ZodISODate.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function date2(params) {
  return _isoDate(ZodISODate, params);
}
var ZodISOTime = /* @__PURE__ */$constructor("ZodISOTime", (inst, def) => {
  $ZodISOTime.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function time2(params) {
  return _isoTime(ZodISOTime, params);
}
var ZodISODuration = /* @__PURE__ */$constructor("ZodISODuration", (inst, def) => {
  $ZodISODuration.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function duration2(params) {
  return _isoDuration(ZodISODuration, params);
}

// node_modules/zod/v4/classic/parse.js
export { iso_exports, ZodISODateTime, datetime2, ZodISODate, date2, ZodISOTime, time2, ZodISODuration, duration2 };
