// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { globalRegistry } from "../core/registries.mjs";
import { schemas_exports2 } from "./schemas.mjs";
import { checks_exports2 } from "./checks.mjs";
import { iso_exports } from "./iso.mjs";
// node_modules/zod/v4/classic/from-json-schema.js
var z = {
  ...schemas_exports2,
  ...checks_exports2,
  iso: iso_exports
};
var RECOGNIZED_KEYS = /* @__PURE__ */new Set([
// Schema identification
"$schema", "$ref", "$defs", "definitions",
// Core schema keywords
"$id", "id", "$comment", "$anchor", "$vocabulary", "$dynamicRef", "$dynamicAnchor",
// Type
"type", "enum", "const",
// Composition
"anyOf", "oneOf", "allOf", "not",
// Object
"properties", "required", "additionalProperties", "patternProperties", "propertyNames", "minProperties", "maxProperties",
// Array
"items", "prefixItems", "additionalItems", "minItems", "maxItems", "uniqueItems", "contains", "minContains", "maxContains",
// String
"minLength", "maxLength", "pattern", "format",
// Number
"minimum", "maximum", "exclusiveMinimum", "exclusiveMaximum", "multipleOf",
// Already handled metadata
"description", "default",
// Content
"contentEncoding", "contentMediaType", "contentSchema",
// Unsupported (error-throwing)
"unevaluatedItems", "unevaluatedProperties", "if", "then", "else", "dependentSchemas", "dependentRequired",
// OpenAPI
"nullable", "readOnly"]);
function detectVersion(schema, defaultTarget) {
  const $schema = schema.$schema;
  if ($schema === "https://json-schema.org/draft/2020-12/schema") {
    return "draft-2020-12";
  }
  if ($schema === "http://json-schema.org/draft-07/schema#") {
    return "draft-7";
  }
  if ($schema === "http://json-schema.org/draft-04/schema#") {
    return "draft-4";
  }
  return defaultTarget ?? "draft-2020-12";
}
function resolveRef(ref, ctx) {
  if (!ref.startsWith("#")) {
    throw new Error("External $ref is not supported, only local refs (#/...) are allowed");
  }
  const path7 = ref.slice(1).split("/").filter(Boolean);
  if (path7.length === 0) {
    return ctx.rootSchema;
  }
  const defsKey = ctx.version === "draft-2020-12" ? "$defs" : "definitions";
  if (path7[0] === defsKey) {
    const key = path7[1];
    if (!key || !ctx.defs[key]) {
      throw new Error(`Reference not found: ${ref}`);
    }
    return ctx.defs[key];
  }
  throw new Error(`Reference not found: ${ref}`);
}
function convertBaseSchema(schema, ctx) {
  if (schema.not !== void 0) {
    if (typeof schema.not === "object" && Object.keys(schema.not).length === 0) {
      return z.never();
    }
    throw new Error("not is not supported in Zod (except { not: {} } for never)");
  }
  if (schema.unevaluatedItems !== void 0) {
    throw new Error("unevaluatedItems is not supported");
  }
  if (schema.unevaluatedProperties !== void 0) {
    throw new Error("unevaluatedProperties is not supported");
  }
  if (schema.if !== void 0 || schema.then !== void 0 || schema.else !== void 0) {
    throw new Error("Conditional schemas (if/then/else) are not supported");
  }
  if (schema.dependentSchemas !== void 0 || schema.dependentRequired !== void 0) {
    throw new Error("dependentSchemas and dependentRequired are not supported");
  }
  if (schema.$ref) {
    const refPath = schema.$ref;
    if (ctx.refs.has(refPath)) {
      return ctx.refs.get(refPath);
    }
    if (ctx.processing.has(refPath)) {
      return z.lazy(() => {
        if (!ctx.refs.has(refPath)) {
          throw new Error(`Circular reference not resolved: ${refPath}`);
        }
        return ctx.refs.get(refPath);
      });
    }
    ctx.processing.add(refPath);
    const resolved = resolveRef(refPath, ctx);
    const zodSchema2 = convertSchema(resolved, ctx);
    ctx.refs.set(refPath, zodSchema2);
    ctx.processing.delete(refPath);
    return zodSchema2;
  }
  if (schema.enum !== void 0) {
    const enumValues = schema.enum;
    if (ctx.version === "openapi-3.0" && schema.nullable === true && enumValues.length === 1 && enumValues[0] === null) {
      return z.null();
    }
    if (enumValues.length === 0) {
      return z.never();
    }
    if (enumValues.length === 1) {
      return z.literal(enumValues[0]);
    }
    if (enumValues.every(v => typeof v === "string")) {
      return z.enum(enumValues);
    }
    const literalSchemas = enumValues.map(v => z.literal(v));
    if (literalSchemas.length < 2) {
      return literalSchemas[0];
    }
    return z.union([literalSchemas[0], literalSchemas[1], ...literalSchemas.slice(2)]);
  }
  if (schema.const !== void 0) {
    return z.literal(schema.const);
  }
  const type = schema.type;
  if (Array.isArray(type)) {
    const typeSchemas = type.map(t => {
      const typeSchema = {
        ...schema,
        type: t
      };
      return convertBaseSchema(typeSchema, ctx);
    });
    if (typeSchemas.length === 0) {
      return z.never();
    }
    if (typeSchemas.length === 1) {
      return typeSchemas[0];
    }
    return z.union(typeSchemas);
  }
  if (!type) {
    return z.any();
  }
  let zodSchema;
  switch (type) {
    case "string":
      {
        let stringSchema = z.string();
        if (schema.format) {
          const format = schema.format;
          if (format === "email") {
            stringSchema = stringSchema.check(z.email());
          } else if (format === "uri" || format === "uri-reference") {
            stringSchema = stringSchema.check(z.url());
          } else if (format === "uuid" || format === "guid") {
            stringSchema = stringSchema.check(z.uuid());
          } else if (format === "date-time") {
            stringSchema = stringSchema.check(z.iso.datetime());
          } else if (format === "date") {
            stringSchema = stringSchema.check(z.iso.date());
          } else if (format === "time") {
            stringSchema = stringSchema.check(z.iso.time());
          } else if (format === "duration") {
            stringSchema = stringSchema.check(z.iso.duration());
          } else if (format === "ipv4") {
            stringSchema = stringSchema.check(z.ipv4());
          } else if (format === "ipv6") {
            stringSchema = stringSchema.check(z.ipv6());
          } else if (format === "mac") {
            stringSchema = stringSchema.check(z.mac());
          } else if (format === "cidr") {
            stringSchema = stringSchema.check(z.cidrv4());
          } else if (format === "cidr-v6") {
            stringSchema = stringSchema.check(z.cidrv6());
          } else if (format === "base64") {
            stringSchema = stringSchema.check(z.base64());
          } else if (format === "base64url") {
            stringSchema = stringSchema.check(z.base64url());
          } else if (format === "e164") {
            stringSchema = stringSchema.check(z.e164());
          } else if (format === "jwt") {
            stringSchema = stringSchema.check(z.jwt());
          } else if (format === "emoji") {
            stringSchema = stringSchema.check(z.emoji());
          } else if (format === "nanoid") {
            stringSchema = stringSchema.check(z.nanoid());
          } else if (format === "cuid") {
            stringSchema = stringSchema.check(z.cuid());
          } else if (format === "cuid2") {
            stringSchema = stringSchema.check(z.cuid2());
          } else if (format === "ulid") {
            stringSchema = stringSchema.check(z.ulid());
          } else if (format === "xid") {
            stringSchema = stringSchema.check(z.xid());
          } else if (format === "ksuid") {
            stringSchema = stringSchema.check(z.ksuid());
          }
        }
        if (typeof schema.minLength === "number") {
          stringSchema = stringSchema.min(schema.minLength);
        }
        if (typeof schema.maxLength === "number") {
          stringSchema = stringSchema.max(schema.maxLength);
        }
        if (schema.pattern) {
          stringSchema = stringSchema.regex(new RegExp(schema.pattern));
        }
        zodSchema = stringSchema;
        break;
      }
    case "number":
    case "integer":
      {
        let numberSchema = type === "integer" ? z.number().int() : z.number();
        if (typeof schema.minimum === "number") {
          numberSchema = numberSchema.min(schema.minimum);
        }
        if (typeof schema.maximum === "number") {
          numberSchema = numberSchema.max(schema.maximum);
        }
        if (typeof schema.exclusiveMinimum === "number") {
          numberSchema = numberSchema.gt(schema.exclusiveMinimum);
        } else if (schema.exclusiveMinimum === true && typeof schema.minimum === "number") {
          numberSchema = numberSchema.gt(schema.minimum);
        }
        if (typeof schema.exclusiveMaximum === "number") {
          numberSchema = numberSchema.lt(schema.exclusiveMaximum);
        } else if (schema.exclusiveMaximum === true && typeof schema.maximum === "number") {
          numberSchema = numberSchema.lt(schema.maximum);
        }
        if (typeof schema.multipleOf === "number") {
          numberSchema = numberSchema.multipleOf(schema.multipleOf);
        }
        zodSchema = numberSchema;
        break;
      }
    case "boolean":
      {
        zodSchema = z.boolean();
        break;
      }
    case "null":
      {
        zodSchema = z.null();
        break;
      }
    case "object":
      {
        const shape = {};
        const properties = schema.properties || {};
        const requiredSet = new Set(schema.required || []);
        for (const [key, propSchema] of Object.entries(properties)) {
          const propZodSchema = convertSchema(propSchema, ctx);
          shape[key] = requiredSet.has(key) ? propZodSchema : propZodSchema.optional();
        }
        if (schema.propertyNames) {
          const keySchema = convertSchema(schema.propertyNames, ctx);
          const valueSchema = schema.additionalProperties && typeof schema.additionalProperties === "object" ? convertSchema(schema.additionalProperties, ctx) : z.any();
          if (Object.keys(shape).length === 0) {
            zodSchema = z.record(keySchema, valueSchema);
            break;
          }
          const objectSchema2 = z.object(shape).passthrough();
          const recordSchema = z.looseRecord(keySchema, valueSchema);
          zodSchema = z.intersection(objectSchema2, recordSchema);
          break;
        }
        if (schema.patternProperties) {
          const patternProps = schema.patternProperties;
          const patternKeys = Object.keys(patternProps);
          const looseRecords = [];
          for (const pattern of patternKeys) {
            const patternValue = convertSchema(patternProps[pattern], ctx);
            const keySchema = z.string().regex(new RegExp(pattern));
            looseRecords.push(z.looseRecord(keySchema, patternValue));
          }
          const schemasToIntersect = [];
          if (Object.keys(shape).length > 0) {
            schemasToIntersect.push(z.object(shape).passthrough());
          }
          schemasToIntersect.push(...looseRecords);
          if (schemasToIntersect.length === 0) {
            zodSchema = z.object({}).passthrough();
          } else if (schemasToIntersect.length === 1) {
            zodSchema = schemasToIntersect[0];
          } else {
            let result = z.intersection(schemasToIntersect[0], schemasToIntersect[1]);
            for (let i = 2; i < schemasToIntersect.length; i++) {
              result = z.intersection(result, schemasToIntersect[i]);
            }
            zodSchema = result;
          }
          break;
        }
        const objectSchema = z.object(shape);
        if (schema.additionalProperties === false) {
          zodSchema = objectSchema.strict();
        } else if (typeof schema.additionalProperties === "object") {
          zodSchema = objectSchema.catchall(convertSchema(schema.additionalProperties, ctx));
        } else {
          zodSchema = objectSchema.passthrough();
        }
        break;
      }
    case "array":
      {
        const prefixItems = schema.prefixItems;
        const items = schema.items;
        if (prefixItems && Array.isArray(prefixItems)) {
          const tupleItems = prefixItems.map(item => convertSchema(item, ctx));
          const rest = items && typeof items === "object" && !Array.isArray(items) ? convertSchema(items, ctx) : void 0;
          if (rest) {
            zodSchema = z.tuple(tupleItems).rest(rest);
          } else {
            zodSchema = z.tuple(tupleItems);
          }
          if (typeof schema.minItems === "number") {
            zodSchema = zodSchema.check(z.minLength(schema.minItems));
          }
          if (typeof schema.maxItems === "number") {
            zodSchema = zodSchema.check(z.maxLength(schema.maxItems));
          }
        } else if (Array.isArray(items)) {
          const tupleItems = items.map(item => convertSchema(item, ctx));
          const rest = schema.additionalItems && typeof schema.additionalItems === "object" ? convertSchema(schema.additionalItems, ctx) : void 0;
          if (rest) {
            zodSchema = z.tuple(tupleItems).rest(rest);
          } else {
            zodSchema = z.tuple(tupleItems);
          }
          if (typeof schema.minItems === "number") {
            zodSchema = zodSchema.check(z.minLength(schema.minItems));
          }
          if (typeof schema.maxItems === "number") {
            zodSchema = zodSchema.check(z.maxLength(schema.maxItems));
          }
        } else if (items !== void 0) {
          const element = convertSchema(items, ctx);
          let arraySchema = z.array(element);
          if (typeof schema.minItems === "number") {
            arraySchema = arraySchema.min(schema.minItems);
          }
          if (typeof schema.maxItems === "number") {
            arraySchema = arraySchema.max(schema.maxItems);
          }
          zodSchema = arraySchema;
        } else {
          zodSchema = z.array(z.any());
        }
        break;
      }
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
  return zodSchema;
}
function convertSchema(schema, ctx) {
  if (typeof schema === "boolean") {
    return schema ? z.any() : z.never();
  }
  let baseSchema = convertBaseSchema(schema, ctx);
  const hasExplicitType = schema.type || schema.enum !== void 0 || schema.const !== void 0;
  if (schema.anyOf && Array.isArray(schema.anyOf)) {
    const options = schema.anyOf.map(s => convertSchema(s, ctx));
    const anyOfUnion = z.union(options);
    baseSchema = hasExplicitType ? z.intersection(baseSchema, anyOfUnion) : anyOfUnion;
  }
  if (schema.oneOf && Array.isArray(schema.oneOf)) {
    const options = schema.oneOf.map(s => convertSchema(s, ctx));
    const oneOfUnion = z.xor(options);
    baseSchema = hasExplicitType ? z.intersection(baseSchema, oneOfUnion) : oneOfUnion;
  }
  if (schema.allOf && Array.isArray(schema.allOf)) {
    if (schema.allOf.length === 0) {
      baseSchema = hasExplicitType ? baseSchema : z.any();
    } else {
      let result = hasExplicitType ? baseSchema : convertSchema(schema.allOf[0], ctx);
      const startIdx = hasExplicitType ? 0 : 1;
      for (let i = startIdx; i < schema.allOf.length; i++) {
        result = z.intersection(result, convertSchema(schema.allOf[i], ctx));
      }
      baseSchema = result;
    }
  }
  if (schema.nullable === true && ctx.version === "openapi-3.0") {
    baseSchema = z.nullable(baseSchema);
  }
  if (schema.readOnly === true) {
    baseSchema = z.readonly(baseSchema);
  }
  if (schema.default !== void 0) {
    baseSchema = baseSchema.default(schema.default);
  }
  const extraMeta = {};
  const coreMetadataKeys = ["$id", "id", "$comment", "$anchor", "$vocabulary", "$dynamicRef", "$dynamicAnchor"];
  for (const key of coreMetadataKeys) {
    if (key in schema) {
      extraMeta[key] = schema[key];
    }
  }
  const contentMetadataKeys = ["contentEncoding", "contentMediaType", "contentSchema"];
  for (const key of contentMetadataKeys) {
    if (key in schema) {
      extraMeta[key] = schema[key];
    }
  }
  for (const key of Object.keys(schema)) {
    if (!RECOGNIZED_KEYS.has(key)) {
      extraMeta[key] = schema[key];
    }
  }
  if (Object.keys(extraMeta).length > 0) {
    ctx.registry.add(baseSchema, extraMeta);
  }
  if (schema.description) {
    baseSchema = baseSchema.describe(schema.description);
  }
  return baseSchema;
}
function fromJSONSchema(schema, params) {
  if (typeof schema === "boolean") {
    return schema ? z.any() : z.never();
  }
  let normalized;
  try {
    normalized = JSON.parse(JSON.stringify(schema));
  } catch {
    throw new Error("fromJSONSchema input is not valid JSON (possibly cyclic); use $defs/$ref for recursive schemas");
  }
  const version2 = detectVersion(normalized, params?.defaultTarget);
  const defs = normalized.$defs || normalized.definitions || {};
  const ctx = {
    version: version2,
    defs,
    refs: /* @__PURE__ */new Map(),
    processing: /* @__PURE__ */new Set(),
    rootSchema: normalized,
    registry: params?.registry ?? globalRegistry
  };
  return convertSchema(normalized, ctx);
}

// node_modules/zod/v4/classic/coerce.js
export { z, RECOGNIZED_KEYS, detectVersion, resolveRef, convertBaseSchema, convertSchema, fromJSONSchema };
