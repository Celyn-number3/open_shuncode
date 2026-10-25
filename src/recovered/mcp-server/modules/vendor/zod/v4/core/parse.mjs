// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { $ZodAsyncError, config } from "./core.mjs";
import { captureStackTrace, finalizeIssue } from "./util.mjs";
import { $ZodError, $ZodRealError } from "./errors.mjs";
// node_modules/zod/v4/core/parse.js
var _parse = _Err => (schema, value, _ctx, _params) => {
  const ctx = _ctx ? {
    ..._ctx,
    async: false
  } : {
    async: false
  };
  const result = schema._zod.run({
    value,
    issues: []
  }, ctx);
  if (result instanceof Promise) {
    throw new $ZodAsyncError();
  }
  if (result.issues.length) {
    const e = new (_params?.Err ?? _Err)(result.issues.map(iss => finalizeIssue(iss, ctx, config())));
    captureStackTrace(e, _params?.callee);
    throw e;
  }
  return result.value;
};
var parse = /* @__PURE__ */_parse($ZodRealError);
var _parseAsync = _Err => async (schema, value, _ctx, params) => {
  const ctx = _ctx ? {
    ..._ctx,
    async: true
  } : {
    async: true
  };
  let result = schema._zod.run({
    value,
    issues: []
  }, ctx);
  if (result instanceof Promise) result = await result;
  if (result.issues.length) {
    const e = new (params?.Err ?? _Err)(result.issues.map(iss => finalizeIssue(iss, ctx, config())));
    captureStackTrace(e, params?.callee);
    throw e;
  }
  return result.value;
};
var parseAsync = /* @__PURE__ */_parseAsync($ZodRealError);
var _safeParse = _Err => (schema, value, _ctx) => {
  const ctx = _ctx ? {
    ..._ctx,
    async: false
  } : {
    async: false
  };
  const result = schema._zod.run({
    value,
    issues: []
  }, ctx);
  if (result instanceof Promise) {
    throw new $ZodAsyncError();
  }
  return result.issues.length ? {
    success: false,
    error: new (_Err ?? $ZodError)(result.issues.map(iss => finalizeIssue(iss, ctx, config())))
  } : {
    success: true,
    data: result.value
  };
};
var safeParse = /* @__PURE__ */_safeParse($ZodRealError);
var _safeParseAsync = _Err => async (schema, value, _ctx) => {
  const ctx = _ctx ? {
    ..._ctx,
    async: true
  } : {
    async: true
  };
  let result = schema._zod.run({
    value,
    issues: []
  }, ctx);
  if (result instanceof Promise) result = await result;
  return result.issues.length ? {
    success: false,
    error: new _Err(result.issues.map(iss => finalizeIssue(iss, ctx, config())))
  } : {
    success: true,
    data: result.value
  };
};
var safeParseAsync = /* @__PURE__ */_safeParseAsync($ZodRealError);
var _encode = _Err => (schema, value, _ctx) => {
  const ctx = _ctx ? {
    ..._ctx,
    direction: "backward"
  } : {
    direction: "backward"
  };
  return _parse(_Err)(schema, value, ctx);
};
var encode = /* @__PURE__ */_encode($ZodRealError);
var _decode = _Err => (schema, value, _ctx) => {
  return _parse(_Err)(schema, value, _ctx);
};
var decode = /* @__PURE__ */_decode($ZodRealError);
var _encodeAsync = _Err => async (schema, value, _ctx) => {
  const ctx = _ctx ? {
    ..._ctx,
    direction: "backward"
  } : {
    direction: "backward"
  };
  return _parseAsync(_Err)(schema, value, ctx);
};
var encodeAsync = /* @__PURE__ */_encodeAsync($ZodRealError);
var _decodeAsync = _Err => async (schema, value, _ctx) => {
  return _parseAsync(_Err)(schema, value, _ctx);
};
var decodeAsync = /* @__PURE__ */_decodeAsync($ZodRealError);
var _safeEncode = _Err => (schema, value, _ctx) => {
  const ctx = _ctx ? {
    ..._ctx,
    direction: "backward"
  } : {
    direction: "backward"
  };
  return _safeParse(_Err)(schema, value, ctx);
};
var safeEncode = /* @__PURE__ */_safeEncode($ZodRealError);
var _safeDecode = _Err => (schema, value, _ctx) => {
  return _safeParse(_Err)(schema, value, _ctx);
};
var safeDecode = /* @__PURE__ */_safeDecode($ZodRealError);
var _safeEncodeAsync = _Err => async (schema, value, _ctx) => {
  const ctx = _ctx ? {
    ..._ctx,
    direction: "backward"
  } : {
    direction: "backward"
  };
  return _safeParseAsync(_Err)(schema, value, ctx);
};
var safeEncodeAsync = /* @__PURE__ */_safeEncodeAsync($ZodRealError);
var _safeDecodeAsync = _Err => async (schema, value, _ctx) => {
  return _safeParseAsync(_Err)(schema, value, _ctx);
};
var safeDecodeAsync = /* @__PURE__ */_safeDecodeAsync($ZodRealError);

// node_modules/zod/v4/core/regexes.js
export { _parse, parse, _parseAsync, parseAsync, _safeParse, safeParse, _safeParseAsync, safeParseAsync, _encode, encode, _decode, decode, _encodeAsync, encodeAsync, _decodeAsync, decodeAsync, _safeEncode, safeEncode, _safeDecode, safeDecode, _safeEncodeAsync, safeEncodeAsync, _safeDecodeAsync, safeDecodeAsync };
