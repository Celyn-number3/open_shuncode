// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { extractDefs, finalize, initializeContext, process2 } from "./to-json-schema.mjs";
import { allProcessors } from "./json-schema-processors.mjs";
// node_modules/zod/v4/core/json-schema-generator.js
var JSONSchemaGenerator = class {
  /** @deprecated Access via ctx instead */
  get metadataRegistry() {
    return this.ctx.metadataRegistry;
  }
  /** @deprecated Access via ctx instead */
  get target() {
    return this.ctx.target;
  }
  /** @deprecated Access via ctx instead */
  get unrepresentable() {
    return this.ctx.unrepresentable;
  }
  /** @deprecated Access via ctx instead */
  get override() {
    return this.ctx.override;
  }
  /** @deprecated Access via ctx instead */
  get io() {
    return this.ctx.io;
  }
  /** @deprecated Access via ctx instead */
  get counter() {
    return this.ctx.counter;
  }
  set counter(value) {
    this.ctx.counter = value;
  }
  /** @deprecated Access via ctx instead */
  get seen() {
    return this.ctx.seen;
  }
  constructor(params) {
    let normalizedTarget = params?.target ?? "draft-2020-12";
    if (normalizedTarget === "draft-4") normalizedTarget = "draft-04";
    if (normalizedTarget === "draft-7") normalizedTarget = "draft-07";
    this.ctx = initializeContext({
      processors: allProcessors,
      target: normalizedTarget,
      ...(params?.metadata && {
        metadata: params.metadata
      }),
      ...(params?.unrepresentable && {
        unrepresentable: params.unrepresentable
      }),
      ...(params?.override && {
        override: params.override
      }),
      ...(params?.io && {
        io: params.io
      })
    });
  }
  /**
   * Process a schema to prepare it for JSON Schema generation.
   * This must be called before emit().
   */
  process(schema, _params = {
    path: [],
    schemaPath: []
  }) {
    return process2(schema, this.ctx, _params);
  }
  /**
   * Emit the final JSON Schema after processing.
   * Must call process() first.
   */
  emit(schema, _params) {
    if (_params) {
      if (_params.cycles) this.ctx.cycles = _params.cycles;
      if (_params.reused) this.ctx.reused = _params.reused;
      if (_params.external) this.ctx.external = _params.external;
    }
    extractDefs(this.ctx, schema);
    const result = finalize(this.ctx, schema);
    const {
      "~standard": _,
      ...plainResult
    } = result;
    return plainResult;
  }
};

// node_modules/zod/v4/core/json-schema.js
export { JSONSchemaGenerator };
