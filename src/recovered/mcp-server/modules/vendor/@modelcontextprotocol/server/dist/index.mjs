// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { fromJsonSchema } from "./src-CX2iR2pK.mjs";
import { AjvJsonSchemaValidator } from "./ajvProvider-CEoC__sr.mjs";
// node_modules/@modelcontextprotocol/server/dist/index.mjs
var _defaultValidator;
function fromJsonSchema2(schema, validator) {
  return fromJsonSchema(schema, validator ?? (_defaultValidator ??= new AjvJsonSchemaValidator()));
}

// node_modules/@modelcontextprotocol/server/dist/stdio.mjs
export { _defaultValidator, fromJsonSchema2 };
