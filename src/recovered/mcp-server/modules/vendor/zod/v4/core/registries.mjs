// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
// node_modules/zod/v4/core/registries.js
var _a2;
var $output = /* @__PURE__ */Symbol("ZodOutput");
var $input = /* @__PURE__ */Symbol("ZodInput");
var $ZodRegistry = class {
  constructor() {
    this._map = /* @__PURE__ */new WeakMap();
    this._idmap = /* @__PURE__ */new Map();
  }
  add(schema, ..._meta) {
    const meta3 = _meta[0];
    this._map.set(schema, meta3);
    if (meta3 && typeof meta3 === "object" && "id" in meta3) {
      this._idmap.set(meta3.id, schema);
    }
    return this;
  }
  clear() {
    this._map = /* @__PURE__ */new WeakMap();
    this._idmap = /* @__PURE__ */new Map();
    return this;
  }
  remove(schema) {
    const meta3 = this._map.get(schema);
    if (meta3 && typeof meta3 === "object" && "id" in meta3) {
      this._idmap.delete(meta3.id);
    }
    this._map.delete(schema);
    return this;
  }
  get(schema) {
    const p = schema._zod.parent;
    if (p) {
      const pm = {
        ...(this.get(p) ?? {})
      };
      delete pm.id;
      const f = {
        ...pm,
        ...this._map.get(schema)
      };
      return Object.keys(f).length ? f : void 0;
    }
    return this._map.get(schema);
  }
  has(schema) {
    return this._map.has(schema);
  }
};
function registry() {
  return new $ZodRegistry();
}
(_a2 = globalThis).__zod_globalRegistry ?? (_a2.__zod_globalRegistry = registry());
var globalRegistry = globalThis.__zod_globalRegistry;

// node_modules/zod/v4/core/api.js
// @__NO_SIDE_EFFECTS__
export { _a2, $output, $input, $ZodRegistry, registry, globalRegistry };
