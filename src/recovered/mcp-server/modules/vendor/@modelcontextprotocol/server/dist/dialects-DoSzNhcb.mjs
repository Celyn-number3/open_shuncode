// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
// node_modules/@modelcontextprotocol/server/dist/dialects-DoSzNhcb.mjs
var DRAFT_2020_12_URIS = /* @__PURE__ */new Set(["https://json-schema.org/draft/2020-12/schema", "http://json-schema.org/draft/2020-12/schema"]);
var DRAFT_2019_09_URIS = /* @__PURE__ */new Set(["https://json-schema.org/draft/2019-09/schema", "http://json-schema.org/draft/2019-09/schema"]);
var DRAFT_07_URIS = /* @__PURE__ */new Set(["https://json-schema.org/draft-07/schema", "http://json-schema.org/draft-07/schema"]);
var DRAFT_06_URIS = /* @__PURE__ */new Set(["https://json-schema.org/draft-06/schema", "http://json-schema.org/draft-06/schema"]);
function declares2019Dialect($schema) {
  return typeof $schema === "string" && DRAFT_2019_09_URIS.has($schema.replace(/#$/, ""));
}
function declaredDialect(schema, remedy) {
  if (!("$schema" in schema) || typeof schema.$schema !== "string") return "2020-12";
  const declared = schema.$schema.replace(/#$/, "");
  if (DRAFT_2020_12_URIS.has(declared)) return "2020-12";
  if (DRAFT_2019_09_URIS.has(declared)) return "2019-09";
  if (DRAFT_07_URIS.has(declared) || DRAFT_06_URIS.has(declared)) return "draft-7";
  throw new Error(`JSON Schema declares an unsupported dialect ("$schema": "${schema.$schema.slice(0, 200)}"). The default validator supports JSON Schema 2020-12, 2019-09, draft-07, and draft-06; ${remedy}`);
}

// node_modules/zod/v4/classic/external.js
export { DRAFT_2020_12_URIS, DRAFT_2019_09_URIS, DRAFT_07_URIS, DRAFT_06_URIS, declares2019Dialect, declaredDialect };
