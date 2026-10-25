// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { __commonJSMin, __exportAll, __toESM2 } from "./chunk-Br0eD_fh.mjs";
import { declares2019Dialect } from "./dialects-DoSzNhcb.mjs";
import { toJSONSchema } from "../../../zod/v4/core/json-schema-processors.mjs";
import { iso_exports } from "../../../zod/v4/classic/iso.mjs";
import { safeParse2 } from "../../../zod/v4/classic/parse.mjs";
import { _enum2, _null3, array, boolean2, discriminatedUnion, email2, intersection, lazy, literal, looseObject, number2, object, optional, preprocess, record, string2, union, unknown, url } from "../../../zod/v4/classic/schemas.mjs";
import { AnnotationsSchema, AudioContentSchema, BaseMetadataSchema, BaseRequestParamsSchema, BlobResourceContentsSchema, BooleanSchemaSchema, CLIENT_CAPABILITIES_META_KEY, CLIENT_INFO_META_KEY, CallToolRequestParamsSchema, CallToolRequestSchema, CallToolResultSchema, CancelTaskRequestSchema, CancelTaskResultSchema, CancelledNotificationParamsSchema, CancelledNotificationSchema, ClientCapabilitiesSchema, ClientNotificationSchema, ClientRequestSchema, ClientResultSchema, ClientTasksCapabilitySchema, CompatibilityCallToolResultSchema, CompleteRequestParamsSchema, CompleteRequestSchema, CompleteResultSchema, ContentBlockSchema, CreateMessageRequestParamsSchema, CreateMessageRequestSchema, CreateMessageResultSchema, CreateMessageResultWithToolsSchema, CreateTaskResultSchema, CursorSchema, DiscoverRequestSchema, DiscoverResultSchema, ElicitRequestFormParamsSchema, ElicitRequestParamsSchema, ElicitRequestSchema, ElicitRequestURLParamsSchema, ElicitResultSchema, ElicitationCompleteNotificationParamsSchema, ElicitationCompleteNotificationSchema, EmbeddedResourceSchema, EmptyResultSchema, EnumSchemaSchema, GetPromptRequestParamsSchema, GetPromptRequestSchema, GetPromptResultSchema, GetTaskPayloadRequestSchema, GetTaskPayloadResultSchema, GetTaskRequestSchema, GetTaskResultSchema, IconSchema, IconsSchema, IdJagTokenExchangeResponseSchema, ImageContentSchema, ImplementationSchema, InitializeRequestParamsSchema, InitializeRequestSchema, InitializeResultSchema, InitializedNotificationSchema, JSONArraySchema, JSONObjectSchema, JSONRPCErrorResponseSchema, JSONRPCMessageSchema, JSONRPCNotificationSchema, JSONRPCRequestSchema, JSONRPCResponseSchema, JSONRPCResultResponseSchema, JSONValueSchema, LOG_LEVEL_META_KEY, LegacyTitledEnumSchemaSchema, ListChangedOptionsBaseSchema, ListPromptsRequestSchema, ListPromptsResultSchema, ListResourceTemplatesRequestSchema, ListResourceTemplatesResultSchema, ListResourcesRequestSchema, ListResourcesResultSchema, ListRootsRequestSchema, ListRootsResultSchema, ListTasksRequestSchema, ListTasksResultSchema, ListToolsRequestSchema, ListToolsResultSchema, LoggingLevelSchema, LoggingMessageNotificationParamsSchema, LoggingMessageNotificationSchema, ModelHintSchema, ModelPreferencesSchema, MultiSelectEnumSchemaSchema, NotificationSchema, NotificationsParamsSchema, NumberSchemaSchema, OAuthClientInformationFullSchema, OAuthClientInformationSchema, OAuthClientMetadataSchema, OAuthClientRegistrationErrorSchema, OAuthErrorResponseSchema, OAuthMetadataSchema, OAuthProtectedResourceMetadataSchema, OAuthTokenRevocationRequestSchema, OAuthTokensSchema, OpenIdProviderDiscoveryMetadataSchema, OpenIdProviderMetadataSchema, PROTOCOL_VERSION_META_KEY, PaginatedRequestParamsSchema, PaginatedRequestSchema, PaginatedResultSchema, PingRequestSchema, PrimitiveSchemaDefinitionSchema, ProgressNotificationParamsSchema, ProgressNotificationSchema, ProgressSchema, ProgressTokenSchema, PromptArgumentSchema, PromptListChangedNotificationSchema, PromptMessageSchema, PromptReferenceSchema, PromptSchema, ReadResourceRequestParamsSchema, ReadResourceRequestSchema, ReadResourceResultSchema, RelatedTaskMetadataSchema, RequestIdSchema, RequestMetaSchema, RequestSchema, ResourceContentsSchema, ResourceLinkSchema, ResourceListChangedNotificationSchema, ResourceRequestParamsSchema, ResourceSchema, ResourceTemplateReferenceSchema, ResourceTemplateSchema, ResourceUpdatedNotificationParamsSchema, ResourceUpdatedNotificationSchema, ResultMetaObjectSchema, ResultSchema, RoleSchema, RootSchema, RootsListChangedNotificationSchema, SERVER_INFO_META_KEY, SUPPORTED_PROTOCOL_VERSIONS, SamplingContentSchema, SamplingMessageContentBlockSchema, SamplingMessageSchema, ServerCapabilitiesSchema, ServerNotificationSchema, ServerRequestSchema, ServerResultSchema, ServerTasksCapabilitySchema, SetLevelRequestParamsSchema, SetLevelRequestSchema, SingleSelectEnumSchemaSchema, StringSchemaSchema, SubscribeRequestParamsSchema, SubscribeRequestSchema, SubscriptionFilterSchema, SubscriptionsAcknowledgedNotificationParamsSchema, SubscriptionsAcknowledgedNotificationSchema, SubscriptionsListenRequestParamsSchema, SubscriptionsListenRequestSchema, SubscriptionsListenResultMetaSchema, SubscriptionsListenResultSchema, TaskAugmentedRequestParamsSchema, TaskCreationParamsSchema, TaskMetadataSchema, TaskSchema, TaskStatusNotificationParamsSchema, TaskStatusNotificationSchema, TaskStatusSchema, TextContentSchema, TextResourceContentsSchema, TitledMultiSelectEnumSchemaSchema, TitledSingleSelectEnumSchemaSchema, ToolAnnotationsSchema, ToolChoiceSchema, ToolExecutionSchema, ToolListChangedNotificationSchema, ToolResultContentSchema, ToolSchema, ToolUseContentSchema, UnsubscribeRequestParamsSchema, UnsubscribeRequestSchema, UntitledMultiSelectEnumSchemaSchema, UntitledSingleSelectEnumSchemaSchema } from "../../core/dist/auth-CUe6YdwF.mjs";
// node_modules/@modelcontextprotocol/server/dist/src-CX2iR2pK.mjs
var BRANDS = /* @__PURE__ */Symbol.for("mcp.sdk.errorBrands");
function stampErrorBrands(instance, ctor) {
  const brands = /* @__PURE__ */new Set();
  let current = ctor;
  while (typeof current === "function") {
    const brand = current.mcpBrand;
    if (Object.prototype.hasOwnProperty.call(current, "mcpBrand") && typeof brand === "string") brands.add(brand);
    current = Object.getPrototypeOf(current);
  }
  if (brands.size === 0) return;
  Object.defineProperty(instance, BRANDS, {
    value: brands,
    enumerable: false,
    configurable: true
  });
}
function brandedHasInstance(cls, value) {
  try {
    if (typeof value === "object" && value !== null && Object.prototype.hasOwnProperty.call(cls, "mcpBrand") && typeof cls.mcpBrand === "string" && Object.prototype.hasOwnProperty.call(value, BRANDS)) {
      const carried = value[BRANDS];
      if (carried && typeof carried.has === "function" && carried.has(cls.mcpBrand)) return true;
    }
  } catch {}
  return Function.prototype[Symbol.hasInstance].call(cls, value);
}
var OAuthError = class OAuthError2 extends Error {
  static {
    Object.defineProperty(this, "mcpBrand", {
      value: "mcp.OAuthError"
    });
  }
  static [Symbol.hasInstance](value) {
    return brandedHasInstance(this, value);
  }
  /**
  * Brand-based type guard: equivalent to `value instanceof this`, as an
  * explicit static predicate (the axios/AWS-SDK `isInstance` style). Reads
  * the caller's own brand via `this`, so every branded subclass gets a
  * correctly-scoped guard by inheritance. Must be invoked on the class —
  * in callback position write `v => SdkError.isInstance(v)`, not
  * `.filter(SdkError.isInstance)` (detached calls throw rather than
  * silently matching nothing).
  */
  static isInstance(value) {
    if (typeof this !== "function") throw new TypeError("isInstance must be called on the class (e.g. `SdkError.isInstance(value)`); for callbacks use `v => SdkError.isInstance(v)`");
    return brandedHasInstance(this, value);
  }
  constructor(code, message, errorUri) {
    super(message);
    this.code = code;
    this.errorUri = errorUri;
    this.name = "OAuthError";
    stampErrorBrands(this, new.target);
  }
  /**
  * Converts the error to a standard OAuth error response object.
  */
  toResponseObject() {
    const response = {
      error: this.code,
      error_description: this.message
    };
    if (this.errorUri) response.error_uri = this.errorUri;
    return response;
  }
  /**
  * Creates an {@linkcode OAuthError} from an OAuth error response.
  */
  static fromResponse(response) {
    return new OAuthError2(response.error, response.error_description ?? response.error, response.error_uri);
  }
};
var SdkErrorCode = /* @__PURE__ */function (SdkErrorCode$1) {
  SdkErrorCode$1["NotConnected"] = "NOT_CONNECTED";
  SdkErrorCode$1["AlreadyConnected"] = "ALREADY_CONNECTED";
  SdkErrorCode$1["NotInitialized"] = "NOT_INITIALIZED";
  SdkErrorCode$1["CapabilityNotSupported"] = "CAPABILITY_NOT_SUPPORTED";
  SdkErrorCode$1["RequestTimeout"] = "REQUEST_TIMEOUT";
  SdkErrorCode$1["ConnectionClosed"] = "CONNECTION_CLOSED";
  SdkErrorCode$1["SendFailed"] = "SEND_FAILED";
  SdkErrorCode$1["InvalidResult"] = "INVALID_RESULT";
  SdkErrorCode$1["UnsupportedResultType"] = "UNSUPPORTED_RESULT_TYPE";
  SdkErrorCode$1["InputRequiredRoundsExceeded"] = "INPUT_REQUIRED_ROUNDS_EXCEEDED";
  SdkErrorCode$1["ListPaginationExceeded"] = "LIST_PAGINATION_EXCEEDED";
  SdkErrorCode$1["MethodNotSupportedByProtocolVersion"] = "METHOD_NOT_SUPPORTED_BY_PROTOCOL_VERSION";
  SdkErrorCode$1["EraNegotiationFailed"] = "ERA_NEGOTIATION_FAILED";
  SdkErrorCode$1["ClientHttpNotImplemented"] = "CLIENT_HTTP_NOT_IMPLEMENTED";
  SdkErrorCode$1["ClientHttpAuthentication"] = "CLIENT_HTTP_AUTHENTICATION";
  SdkErrorCode$1["ClientHttpForbidden"] = "CLIENT_HTTP_FORBIDDEN";
  SdkErrorCode$1["ClientHttpUnexpectedContent"] = "CLIENT_HTTP_UNEXPECTED_CONTENT";
  SdkErrorCode$1["ClientHttpFailedToOpenStream"] = "CLIENT_HTTP_FAILED_TO_OPEN_STREAM";
  SdkErrorCode$1["ClientHttpFailedToTerminateSession"] = "CLIENT_HTTP_FAILED_TO_TERMINATE_SESSION";
  return SdkErrorCode$1;
}({});
var SdkError = class extends Error {
  static {
    Object.defineProperty(this, "mcpBrand", {
      value: "mcp.SdkError"
    });
  }
  static [Symbol.hasInstance](value) {
    return brandedHasInstance(this, value);
  }
  /**
  * Brand-based type guard: equivalent to `value instanceof this`, as an
  * explicit static predicate (the axios/AWS-SDK `isInstance` style). Reads
  * the caller's own brand via `this`, so every branded subclass gets a
  * correctly-scoped guard by inheritance. Must be invoked on the class —
  * in callback position write `v => SdkError.isInstance(v)`, not
  * `.filter(SdkError.isInstance)` (detached calls throw rather than
  * silently matching nothing).
  */
  static isInstance(value) {
    if (typeof this !== "function") throw new TypeError("isInstance must be called on the class (e.g. `SdkError.isInstance(value)`); for callbacks use `v => SdkError.isInstance(v)`");
    return brandedHasInstance(this, value);
  }
  constructor(code, message, data) {
    super(message);
    this.code = code;
    this.data = data;
    this.name = "SdkError";
    stampErrorBrands(this, new.target);
  }
};
var SdkHttpError = class extends SdkError {
  static {
    Object.defineProperty(this, "mcpBrand", {
      value: "mcp.SdkHttpError"
    });
  }
  constructor(code, message, data) {
    super(code, message, data);
    this.name = "SdkHttpError";
  }
  get status() {
    return this.data.status;
  }
  get statusText() {
    return this.data.statusText;
  }
};
function isPlainObject$7(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function isImpliedCapabilityMember(capability, member, declaredValue) {
  return capability === "elicitation" && member === "form" && declaredValue["form"] === void 0 && declaredValue["url"] === void 0;
}
function requiredClientCapabilitiesForInputRequest(entry) {
  switch (entry.method) {
    case "elicitation/create":
      if (entry.params?.["mode"] === "url") return {
        elicitation: {
          url: {}
        }
      };
      return {
        elicitation: {
          form: {}
        }
      };
    case "sampling/createMessage":
      {
        const params = entry.params;
        if (params !== void 0 && (params["tools"] !== void 0 || params["toolChoice"] !== void 0)) return {
          sampling: {
            tools: {}
          }
        };
        return {
          sampling: {}
        };
      }
    case "roots/list":
      return {
        roots: {}
      };
    default:
      return;
  }
}
function missingClientCapabilities(required2, declared) {
  const missing = {};
  for (const [capability, requirement] of Object.entries(required2)) {
    if (requirement === void 0) continue;
    const declaredValue = declared === void 0 ? void 0 : declared[capability];
    if (declaredValue === void 0) {
      missing[capability] = requirement;
      continue;
    }
    if (isPlainObject$7(requirement) && isPlainObject$7(declaredValue)) {
      const missingMembers = {};
      for (const [member, memberRequirement] of Object.entries(requirement)) if (memberRequirement !== void 0 && declaredValue[member] === void 0 && !isImpliedCapabilityMember(capability, member, declaredValue)) missingMembers[member] = memberRequirement;
      if (Object.keys(missingMembers).length > 0) missing[capability] = missingMembers;
    }
  }
  return Object.keys(missing).length > 0 ? missing : void 0;
}
var FIRST_MODERN_PROTOCOL_VERSION = "2026-07-28";
function isModernProtocolVersion(version2) {
  return version2 >= FIRST_MODERN_PROTOCOL_VERSION;
}
function legacyProtocolVersions(versions) {
  return versions.filter(version2 => !isModernProtocolVersion(version2));
}
function modernProtocolVersions(versions) {
  return versions.filter(version2 => isModernProtocolVersion(version2));
}
function appendTextFallbackForNonObject(result) {
  const sc = result.structuredContent;
  if (sc === void 0) return result;
  if (!(typeof sc !== "object" || sc === null || Array.isArray(sc))) return result;
  if (result.content?.some(c => c.type === "text") ?? false) return result;
  return {
    ...result,
    content: [...(result.content ?? []), {
      type: "text",
      text: JSON.stringify(sc)
    }]
  };
}
var TOOL_RESULT_FOREIGN_FAMILY_KEYS = ["task", "inputRequests", "requestState"];
function normalizeContentlessToolResult(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value) || value.content !== void 0 || TOOL_RESULT_FOREIGN_FAMILY_KEYS.some(key => key in value)) return value;
  return {
    ...value,
    content: []
  };
}
function build$1() {
  const JSONValueSchema$1 = lazy(() => union([string2(), number2(), boolean2(), _null3(), record(string2(), JSONValueSchema$1), array(JSONValueSchema$1)]));
  const JSONObjectSchema$1 = record(string2(), JSONValueSchema$1);
  const ProgressTokenSchema$1 = union([string2(), number2().int()]);
  const CursorSchema$1 = string2();
  const TaskMetadataSchema$1 = object({
    ttl: number2().optional()
  });
  const RelatedTaskMetadataSchema$1 = object({
    taskId: string2()
  });
  const RequestMetaSchema$1 = looseObject({
    progressToken: ProgressTokenSchema$1.optional(),
    "io.modelcontextprotocol/related-task": RelatedTaskMetadataSchema$1.optional()
  });
  const BaseRequestParamsSchema$1 = object({
    _meta: RequestMetaSchema$1.optional()
  });
  const TaskAugmentedRequestParamsSchema$1 = BaseRequestParamsSchema$1.extend({
    task: TaskMetadataSchema$1.optional()
  });
  const RequestSchema$1 = object({
    method: string2(),
    params: BaseRequestParamsSchema$1.loose().optional()
  });
  const NotificationsParamsSchema$1 = object({
    _meta: RequestMetaSchema$1.optional()
  });
  const NotificationSchema$1 = object({
    method: string2(),
    params: NotificationsParamsSchema$1.loose().optional()
  });
  const ResultSchema$1 = looseObject({
    _meta: RequestMetaSchema$1.optional()
  });
  const RequestIdSchema$1 = union([string2(), number2().int()]);
  const EmptyResultSchema$1 = ResultSchema$1.strict();
  const CancelledNotificationParamsSchema$1 = NotificationsParamsSchema$1.extend({
    requestId: RequestIdSchema$1.optional(),
    reason: string2().optional()
  });
  const CancelledNotificationSchema$1 = NotificationSchema$1.extend({
    method: literal("notifications/cancelled"),
    params: CancelledNotificationParamsSchema$1
  });
  const IconSchema$1 = object({
    src: string2(),
    mimeType: string2().optional(),
    sizes: array(string2()).optional(),
    theme: _enum2(["light", "dark"]).optional()
  });
  const IconsSchema$1 = object({
    icons: array(IconSchema$1).optional()
  });
  const BaseMetadataSchema$1 = object({
    name: string2(),
    title: string2().optional()
  });
  const ImplementationSchema$1 = BaseMetadataSchema$1.extend({
    ...BaseMetadataSchema$1.shape,
    ...IconsSchema$1.shape,
    version: string2(),
    websiteUrl: string2().optional(),
    description: string2().optional()
  });
  const FormElicitationCapabilitySchema2 = intersection(object({
    applyDefaults: boolean2().optional()
  }), JSONObjectSchema$1);
  const ElicitationCapabilitySchema2 = preprocess(value => {
    if (value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0) return {
      form: {}
    };
    return value;
  }, intersection(object({
    form: FormElicitationCapabilitySchema2.optional(),
    url: JSONObjectSchema$1.optional()
  }), JSONObjectSchema$1.optional()));
  const ClientTasksCapabilitySchema$1 = looseObject({
    list: JSONObjectSchema$1.optional(),
    cancel: JSONObjectSchema$1.optional(),
    requests: looseObject({
      sampling: looseObject({
        createMessage: JSONObjectSchema$1.optional()
      }).optional(),
      elicitation: looseObject({
        create: JSONObjectSchema$1.optional()
      }).optional()
    }).optional()
  });
  const ServerTasksCapabilitySchema$1 = looseObject({
    list: JSONObjectSchema$1.optional(),
    cancel: JSONObjectSchema$1.optional(),
    requests: looseObject({
      tools: looseObject({
        call: JSONObjectSchema$1.optional()
      }).optional()
    }).optional()
  });
  const ClientCapabilitiesSchema$1 = object({
    experimental: record(string2(), JSONObjectSchema$1).optional(),
    sampling: object({
      context: JSONObjectSchema$1.optional(),
      tools: JSONObjectSchema$1.optional()
    }).optional(),
    elicitation: ElicitationCapabilitySchema2.optional(),
    roots: object({
      listChanged: boolean2().optional()
    }).optional(),
    tasks: ClientTasksCapabilitySchema$1.optional(),
    extensions: record(string2(), JSONObjectSchema$1).optional()
  });
  const InitializeRequestParamsSchema$1 = BaseRequestParamsSchema$1.extend({
    protocolVersion: string2(),
    capabilities: ClientCapabilitiesSchema$1,
    clientInfo: ImplementationSchema$1
  });
  const InitializeRequestSchema$1 = RequestSchema$1.extend({
    method: literal("initialize"),
    params: InitializeRequestParamsSchema$1
  });
  const ServerCapabilitiesSchema$1 = object({
    experimental: record(string2(), JSONObjectSchema$1).optional(),
    logging: JSONObjectSchema$1.optional(),
    completions: JSONObjectSchema$1.optional(),
    prompts: object({
      listChanged: boolean2().optional()
    }).optional(),
    resources: object({
      subscribe: boolean2().optional(),
      listChanged: boolean2().optional()
    }).optional(),
    tools: object({
      listChanged: boolean2().optional()
    }).optional(),
    tasks: ServerTasksCapabilitySchema$1.optional(),
    extensions: record(string2(), JSONObjectSchema$1).optional()
  });
  const InitializeResultSchema$1 = ResultSchema$1.extend({
    protocolVersion: string2(),
    capabilities: ServerCapabilitiesSchema$1,
    serverInfo: ImplementationSchema$1,
    instructions: string2().optional()
  });
  const InitializedNotificationSchema$1 = NotificationSchema$1.extend({
    method: literal("notifications/initialized"),
    params: NotificationsParamsSchema$1.optional()
  });
  const PingRequestSchema$1 = RequestSchema$1.extend({
    method: literal("ping"),
    params: BaseRequestParamsSchema$1.optional()
  });
  const ProgressSchema$1 = object({
    progress: number2(),
    total: optional(number2()),
    message: optional(string2())
  });
  const ProgressNotificationParamsSchema$1 = object({
    ...NotificationsParamsSchema$1.shape,
    ...ProgressSchema$1.shape,
    progressToken: ProgressTokenSchema$1
  });
  const ProgressNotificationSchema$1 = NotificationSchema$1.extend({
    method: literal("notifications/progress"),
    params: ProgressNotificationParamsSchema$1
  });
  const PaginatedRequestParamsSchema$1 = BaseRequestParamsSchema$1.extend({
    cursor: CursorSchema$1.optional()
  });
  const PaginatedRequestSchema$1 = RequestSchema$1.extend({
    params: PaginatedRequestParamsSchema$1.optional()
  });
  const PaginatedResultSchema$1 = ResultSchema$1.extend({
    nextCursor: CursorSchema$1.optional()
  });
  const ResourceContentsSchema$1 = object({
    uri: string2(),
    mimeType: optional(string2()),
    _meta: record(string2(), unknown()).optional()
  });
  const TextResourceContentsSchema$1 = ResourceContentsSchema$1.extend({
    text: string2()
  });
  const Base64Schema2 = string2().refine(val => {
    try {
      atob(val);
      return true;
    } catch {
      return false;
    }
  }, {
    message: "Invalid Base64 string"
  });
  const BlobResourceContentsSchema$1 = ResourceContentsSchema$1.extend({
    blob: Base64Schema2
  });
  const RoleSchema$1 = _enum2(["user", "assistant"]);
  const AnnotationsSchema$1 = object({
    audience: array(RoleSchema$1).optional(),
    priority: number2().min(0).max(1).optional(),
    lastModified: iso_exports.datetime({
      offset: true
    }).optional()
  });
  const ResourceSchema$1 = object({
    ...BaseMetadataSchema$1.shape,
    ...IconsSchema$1.shape,
    uri: string2(),
    description: optional(string2()),
    mimeType: optional(string2()),
    size: optional(number2()),
    annotations: AnnotationsSchema$1.optional(),
    _meta: optional(looseObject({}))
  });
  const ResourceTemplateSchema$1 = object({
    ...BaseMetadataSchema$1.shape,
    ...IconsSchema$1.shape,
    uriTemplate: string2(),
    description: optional(string2()),
    mimeType: optional(string2()),
    annotations: AnnotationsSchema$1.optional(),
    _meta: optional(looseObject({}))
  });
  const ListResourcesRequestSchema$1 = PaginatedRequestSchema$1.extend({
    method: literal("resources/list")
  });
  const ListResourcesResultSchema$1 = PaginatedResultSchema$1.extend({
    resources: array(ResourceSchema$1)
  });
  const ListResourceTemplatesRequestSchema$1 = PaginatedRequestSchema$1.extend({
    method: literal("resources/templates/list")
  });
  const ListResourceTemplatesResultSchema$1 = PaginatedResultSchema$1.extend({
    resourceTemplates: array(ResourceTemplateSchema$1)
  });
  const ResourceRequestParamsSchema$1 = BaseRequestParamsSchema$1.extend({
    uri: string2()
  });
  const ReadResourceRequestParamsSchema$1 = ResourceRequestParamsSchema$1;
  const ReadResourceRequestSchema$1 = RequestSchema$1.extend({
    method: literal("resources/read"),
    params: ReadResourceRequestParamsSchema$1
  });
  const ReadResourceResultSchema$1 = ResultSchema$1.extend({
    contents: array(union([TextResourceContentsSchema$1, BlobResourceContentsSchema$1]))
  });
  const ResourceListChangedNotificationSchema$1 = NotificationSchema$1.extend({
    method: literal("notifications/resources/list_changed"),
    params: NotificationsParamsSchema$1.optional()
  });
  const SubscribeRequestParamsSchema$1 = ResourceRequestParamsSchema$1;
  const SubscribeRequestSchema$1 = RequestSchema$1.extend({
    method: literal("resources/subscribe"),
    params: SubscribeRequestParamsSchema$1
  });
  const UnsubscribeRequestParamsSchema$1 = ResourceRequestParamsSchema$1;
  const UnsubscribeRequestSchema$1 = RequestSchema$1.extend({
    method: literal("resources/unsubscribe"),
    params: UnsubscribeRequestParamsSchema$1
  });
  const ResourceUpdatedNotificationParamsSchema$1 = NotificationsParamsSchema$1.extend({
    uri: string2()
  });
  const ResourceUpdatedNotificationSchema$1 = NotificationSchema$1.extend({
    method: literal("notifications/resources/updated"),
    params: ResourceUpdatedNotificationParamsSchema$1
  });
  const PromptArgumentSchema$1 = object({
    name: string2(),
    description: optional(string2()),
    required: optional(boolean2())
  });
  const PromptSchema$1 = object({
    ...BaseMetadataSchema$1.shape,
    ...IconsSchema$1.shape,
    description: optional(string2()),
    arguments: optional(array(PromptArgumentSchema$1)),
    _meta: optional(looseObject({}))
  });
  const ListPromptsRequestSchema$1 = PaginatedRequestSchema$1.extend({
    method: literal("prompts/list")
  });
  const ListPromptsResultSchema$1 = PaginatedResultSchema$1.extend({
    prompts: array(PromptSchema$1)
  });
  const GetPromptRequestParamsSchema$1 = BaseRequestParamsSchema$1.extend({
    name: string2(),
    arguments: record(string2(), string2()).optional()
  });
  const GetPromptRequestSchema$1 = RequestSchema$1.extend({
    method: literal("prompts/get"),
    params: GetPromptRequestParamsSchema$1
  });
  const TextContentSchema$1 = object({
    type: literal("text"),
    text: string2(),
    annotations: AnnotationsSchema$1.optional(),
    _meta: record(string2(), unknown()).optional()
  });
  const ImageContentSchema$1 = object({
    type: literal("image"),
    data: Base64Schema2,
    mimeType: string2(),
    annotations: AnnotationsSchema$1.optional(),
    _meta: record(string2(), unknown()).optional()
  });
  const AudioContentSchema$1 = object({
    type: literal("audio"),
    data: Base64Schema2,
    mimeType: string2(),
    annotations: AnnotationsSchema$1.optional(),
    _meta: record(string2(), unknown()).optional()
  });
  const ToolUseContentSchema$1 = object({
    type: literal("tool_use"),
    name: string2(),
    id: string2(),
    input: record(string2(), unknown()),
    _meta: record(string2(), unknown()).optional()
  });
  const EmbeddedResourceSchema$1 = object({
    type: literal("resource"),
    resource: union([TextResourceContentsSchema$1, BlobResourceContentsSchema$1]),
    annotations: AnnotationsSchema$1.optional(),
    _meta: record(string2(), unknown()).optional()
  });
  const ResourceLinkSchema$1 = ResourceSchema$1.extend({
    type: literal("resource_link")
  });
  const ContentBlockSchema$1 = union([TextContentSchema$1, ImageContentSchema$1, AudioContentSchema$1, ResourceLinkSchema$1, EmbeddedResourceSchema$1]);
  const PromptMessageSchema$1 = object({
    role: RoleSchema$1,
    content: ContentBlockSchema$1
  });
  const GetPromptResultSchema$1 = ResultSchema$1.extend({
    description: string2().optional(),
    messages: array(PromptMessageSchema$1)
  });
  const PromptListChangedNotificationSchema$1 = NotificationSchema$1.extend({
    method: literal("notifications/prompts/list_changed"),
    params: NotificationsParamsSchema$1.optional()
  });
  const ToolAnnotationsSchema$1 = object({
    title: string2().optional(),
    readOnlyHint: boolean2().optional(),
    destructiveHint: boolean2().optional(),
    idempotentHint: boolean2().optional(),
    openWorldHint: boolean2().optional()
  });
  const ToolExecutionSchema$1 = object({
    taskSupport: _enum2(["required", "optional", "forbidden"]).optional()
  });
  const ToolSchema$1 = object({
    ...BaseMetadataSchema$1.shape,
    ...IconsSchema$1.shape,
    description: string2().optional(),
    inputSchema: object({
      type: literal("object"),
      properties: record(string2(), JSONValueSchema$1).optional(),
      required: array(string2()).optional()
    }).catchall(unknown()),
    outputSchema: object({
      type: literal("object"),
      properties: record(string2(), JSONValueSchema$1).optional(),
      required: array(string2()).optional()
    }).catchall(unknown()).optional(),
    annotations: ToolAnnotationsSchema$1.optional(),
    execution: ToolExecutionSchema$1.optional(),
    _meta: record(string2(), unknown()).optional()
  });
  const ListToolsRequestSchema$1 = PaginatedRequestSchema$1.extend({
    method: literal("tools/list")
  });
  const ListToolsResultSchema$1 = PaginatedResultSchema$1.extend({
    tools: array(ToolSchema$1)
  });
  const CallToolResultSchema$1 = ResultSchema$1.extend({
    content: array(ContentBlockSchema$1),
    structuredContent: record(string2(), unknown()).optional(),
    isError: boolean2().optional()
  });
  const CallToolRequestParamsSchema$1 = TaskAugmentedRequestParamsSchema$1.extend({
    name: string2(),
    arguments: record(string2(), unknown()).optional()
  });
  const CallToolRequestSchema$1 = RequestSchema$1.extend({
    method: literal("tools/call"),
    params: CallToolRequestParamsSchema$1
  });
  const ToolListChangedNotificationSchema$1 = NotificationSchema$1.extend({
    method: literal("notifications/tools/list_changed"),
    params: NotificationsParamsSchema$1.optional()
  });
  const LoggingLevelSchema$1 = _enum2(["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"]);
  const SetLevelRequestParamsSchema$1 = BaseRequestParamsSchema$1.extend({
    level: LoggingLevelSchema$1
  });
  const SetLevelRequestSchema$1 = RequestSchema$1.extend({
    method: literal("logging/setLevel"),
    params: SetLevelRequestParamsSchema$1
  });
  const LoggingMessageNotificationParamsSchema$1 = NotificationsParamsSchema$1.extend({
    level: LoggingLevelSchema$1,
    logger: string2().optional(),
    data: unknown()
  });
  const LoggingMessageNotificationSchema$1 = NotificationSchema$1.extend({
    method: literal("notifications/message"),
    params: LoggingMessageNotificationParamsSchema$1
  });
  const ModelHintSchema$1 = object({
    name: string2().optional()
  });
  const ModelPreferencesSchema$1 = object({
    hints: array(ModelHintSchema$1).optional(),
    costPriority: number2().min(0).max(1).optional(),
    speedPriority: number2().min(0).max(1).optional(),
    intelligencePriority: number2().min(0).max(1).optional()
  });
  const ToolChoiceSchema$1 = object({
    mode: _enum2(["auto", "required", "none"]).optional()
  });
  const ToolResultContentSchema$1 = object({
    type: literal("tool_result"),
    toolUseId: string2().describe("The unique identifier for the corresponding tool call."),
    content: array(ContentBlockSchema$1),
    structuredContent: object({}).loose().optional(),
    isError: boolean2().optional(),
    _meta: record(string2(), unknown()).optional()
  });
  const SamplingContentSchema$1 = discriminatedUnion("type", [TextContentSchema$1, ImageContentSchema$1, AudioContentSchema$1]);
  const SamplingMessageContentBlockSchema$1 = discriminatedUnion("type", [TextContentSchema$1, ImageContentSchema$1, AudioContentSchema$1, ToolUseContentSchema$1, ToolResultContentSchema$1]);
  const SamplingMessageSchema$1 = object({
    role: RoleSchema$1,
    content: union([SamplingMessageContentBlockSchema$1, array(SamplingMessageContentBlockSchema$1)]),
    _meta: record(string2(), unknown()).optional()
  });
  const CreateMessageRequestParamsSchema$1 = TaskAugmentedRequestParamsSchema$1.extend({
    messages: array(SamplingMessageSchema$1),
    modelPreferences: ModelPreferencesSchema$1.optional(),
    systemPrompt: string2().optional(),
    includeContext: _enum2(["none", "thisServer", "allServers"]).optional(),
    temperature: number2().optional(),
    maxTokens: number2().int(),
    stopSequences: array(string2()).optional(),
    metadata: JSONObjectSchema$1.optional(),
    tools: array(ToolSchema$1).optional(),
    toolChoice: ToolChoiceSchema$1.optional()
  });
  const CreateMessageRequestSchema$1 = RequestSchema$1.extend({
    method: literal("sampling/createMessage"),
    params: CreateMessageRequestParamsSchema$1
  });
  const CreateMessageResultSchema$1 = ResultSchema$1.extend({
    model: string2(),
    stopReason: optional(_enum2(["endTurn", "stopSequence", "maxTokens"]).or(string2())),
    role: RoleSchema$1,
    content: SamplingContentSchema$1
  });
  const CreateMessageResultWithToolsSchema$1 = ResultSchema$1.extend({
    model: string2(),
    stopReason: optional(_enum2(["endTurn", "stopSequence", "maxTokens", "toolUse"]).or(string2())),
    role: RoleSchema$1,
    content: union([SamplingMessageContentBlockSchema$1, array(SamplingMessageContentBlockSchema$1)])
  });
  const BooleanSchemaSchema$1 = object({
    type: literal("boolean"),
    title: string2().optional(),
    description: string2().optional(),
    default: boolean2().optional()
  });
  const StringSchemaSchema$1 = object({
    type: literal("string"),
    title: string2().optional(),
    description: string2().optional(),
    minLength: number2().optional(),
    maxLength: number2().optional(),
    format: _enum2(["email", "uri", "date", "date-time"]).optional(),
    default: string2().optional()
  });
  const NumberSchemaSchema$1 = object({
    type: _enum2(["number", "integer"]),
    title: string2().optional(),
    description: string2().optional(),
    minimum: number2().optional(),
    maximum: number2().optional(),
    default: number2().optional()
  });
  const UntitledSingleSelectEnumSchemaSchema$1 = object({
    type: literal("string"),
    title: string2().optional(),
    description: string2().optional(),
    enum: array(string2()),
    default: string2().optional()
  });
  const TitledSingleSelectEnumSchemaSchema$1 = object({
    type: literal("string"),
    title: string2().optional(),
    description: string2().optional(),
    oneOf: array(object({
      const: string2(),
      title: string2()
    })),
    default: string2().optional()
  });
  const LegacyTitledEnumSchemaSchema$1 = object({
    type: literal("string"),
    title: string2().optional(),
    description: string2().optional(),
    enum: array(string2()),
    enumNames: array(string2()).optional(),
    default: string2().optional()
  });
  const SingleSelectEnumSchemaSchema$1 = union([UntitledSingleSelectEnumSchemaSchema$1, TitledSingleSelectEnumSchemaSchema$1]);
  const UntitledMultiSelectEnumSchemaSchema$1 = object({
    type: literal("array"),
    title: string2().optional(),
    description: string2().optional(),
    minItems: number2().optional(),
    maxItems: number2().optional(),
    items: object({
      type: literal("string"),
      enum: array(string2())
    }),
    default: array(string2()).optional()
  });
  const TitledMultiSelectEnumSchemaSchema$1 = object({
    type: literal("array"),
    title: string2().optional(),
    description: string2().optional(),
    minItems: number2().optional(),
    maxItems: number2().optional(),
    items: object({
      anyOf: array(object({
        const: string2(),
        title: string2()
      }))
    }),
    default: array(string2()).optional()
  });
  const MultiSelectEnumSchemaSchema$1 = union([UntitledMultiSelectEnumSchemaSchema$1, TitledMultiSelectEnumSchemaSchema$1]);
  const EnumSchemaSchema$1 = union([LegacyTitledEnumSchemaSchema$1, SingleSelectEnumSchemaSchema$1, MultiSelectEnumSchemaSchema$1]);
  const PrimitiveSchemaDefinitionSchema$1 = union([EnumSchemaSchema$1, BooleanSchemaSchema$1, StringSchemaSchema$1, NumberSchemaSchema$1]);
  const ElicitRequestFormParamsSchema$1 = TaskAugmentedRequestParamsSchema$1.extend({
    mode: literal("form").optional(),
    message: string2(),
    requestedSchema: object({
      type: literal("object"),
      properties: record(string2(), PrimitiveSchemaDefinitionSchema$1),
      required: array(string2()).optional()
    }).catchall(unknown())
  });
  const ElicitRequestURLParamsSchema$1 = TaskAugmentedRequestParamsSchema$1.extend({
    mode: literal("url"),
    message: string2(),
    elicitationId: string2(),
    url: string2().url()
  });
  const ElicitRequestParamsSchema$1 = union([ElicitRequestFormParamsSchema$1, ElicitRequestURLParamsSchema$1]);
  const ElicitRequestSchema$1 = RequestSchema$1.extend({
    method: literal("elicitation/create"),
    params: ElicitRequestParamsSchema$1
  });
  const ElicitationCompleteNotificationParamsSchema$1 = NotificationsParamsSchema$1.extend({
    elicitationId: string2()
  });
  const ElicitationCompleteNotificationSchema$1 = NotificationSchema$1.extend({
    method: literal("notifications/elicitation/complete"),
    params: ElicitationCompleteNotificationParamsSchema$1
  });
  const ElicitResultSchema$1 = ResultSchema$1.extend({
    action: _enum2(["accept", "decline", "cancel"]),
    content: preprocess(val => val === null ? void 0 : val, record(string2(), union([string2(), number2(), boolean2(), array(string2())])).optional())
  });
  const ResourceTemplateReferenceSchema$1 = object({
    type: literal("ref/resource"),
    uri: string2()
  });
  const PromptReferenceSchema$1 = object({
    type: literal("ref/prompt"),
    name: string2()
  });
  const CompleteRequestParamsSchema$1 = BaseRequestParamsSchema$1.extend({
    ref: union([PromptReferenceSchema$1, ResourceTemplateReferenceSchema$1]),
    argument: object({
      name: string2(),
      value: string2()
    }),
    context: object({
      arguments: record(string2(), string2()).optional()
    }).optional()
  });
  const CompleteRequestSchema$1 = RequestSchema$1.extend({
    method: literal("completion/complete"),
    params: CompleteRequestParamsSchema$1
  });
  const CompleteResultSchema$1 = ResultSchema$1.extend({
    completion: looseObject({
      values: array(string2()).max(100),
      total: optional(number2().int()),
      hasMore: optional(boolean2())
    })
  });
  const RootSchema$1 = object({
    uri: string2().startsWith("file://"),
    name: string2().optional(),
    _meta: record(string2(), unknown()).optional()
  });
  const ListRootsRequestSchema$1 = RequestSchema$1.extend({
    method: literal("roots/list"),
    params: BaseRequestParamsSchema$1.optional()
  });
  const ListRootsResultSchema$1 = ResultSchema$1.extend({
    roots: array(RootSchema$1)
  });
  const RootsListChangedNotificationSchema$1 = NotificationSchema$1.extend({
    method: literal("notifications/roots/list_changed"),
    params: NotificationsParamsSchema$1.optional()
  });
  const TaskCreationParamsSchema$1 = looseObject({
    ttl: number2().optional(),
    pollInterval: number2().optional()
  });
  const TaskStatusSchema$1 = _enum2(["working", "input_required", "completed", "failed", "cancelled"]);
  const TaskSchema$1 = object({
    taskId: string2(),
    status: TaskStatusSchema$1,
    ttl: union([number2(), _null3()]),
    createdAt: string2(),
    lastUpdatedAt: string2(),
    pollInterval: optional(number2()),
    statusMessage: optional(string2())
  });
  const CreateTaskResultSchema$1 = ResultSchema$1.extend({
    task: TaskSchema$1
  });
  const TaskStatusNotificationParamsSchema$1 = NotificationsParamsSchema$1.merge(TaskSchema$1);
  const TaskStatusNotificationSchema$1 = NotificationSchema$1.extend({
    method: literal("notifications/tasks/status"),
    params: TaskStatusNotificationParamsSchema$1
  });
  const GetTaskRequestSchema$1 = RequestSchema$1.extend({
    method: literal("tasks/get"),
    params: BaseRequestParamsSchema$1.extend({
      taskId: string2()
    })
  });
  const GetTaskResultSchema$1 = ResultSchema$1.merge(TaskSchema$1);
  const GetTaskPayloadRequestSchema$1 = RequestSchema$1.extend({
    method: literal("tasks/result"),
    params: BaseRequestParamsSchema$1.extend({
      taskId: string2()
    })
  });
  const GetTaskPayloadResultSchema$1 = ResultSchema$1.loose();
  const ListTasksRequestSchema$1 = PaginatedRequestSchema$1.extend({
    method: literal("tasks/list")
  });
  const ListTasksResultSchema$1 = PaginatedResultSchema$1.extend({
    tasks: array(TaskSchema$1)
  });
  const CancelTaskRequestSchema$1 = RequestSchema$1.extend({
    method: literal("tasks/cancel"),
    params: BaseRequestParamsSchema$1.extend({
      taskId: string2()
    })
  });
  return {
    JSONValueSchema: JSONValueSchema$1,
    JSONObjectSchema: JSONObjectSchema$1,
    ProgressTokenSchema: ProgressTokenSchema$1,
    CursorSchema: CursorSchema$1,
    TaskMetadataSchema: TaskMetadataSchema$1,
    RelatedTaskMetadataSchema: RelatedTaskMetadataSchema$1,
    RequestMetaSchema: RequestMetaSchema$1,
    BaseRequestParamsSchema: BaseRequestParamsSchema$1,
    TaskAugmentedRequestParamsSchema: TaskAugmentedRequestParamsSchema$1,
    RequestSchema: RequestSchema$1,
    NotificationsParamsSchema: NotificationsParamsSchema$1,
    NotificationSchema: NotificationSchema$1,
    ResultSchema: ResultSchema$1,
    RequestIdSchema: RequestIdSchema$1,
    EmptyResultSchema: EmptyResultSchema$1,
    CancelledNotificationParamsSchema: CancelledNotificationParamsSchema$1,
    CancelledNotificationSchema: CancelledNotificationSchema$1,
    IconSchema: IconSchema$1,
    IconsSchema: IconsSchema$1,
    BaseMetadataSchema: BaseMetadataSchema$1,
    ImplementationSchema: ImplementationSchema$1,
    ClientTasksCapabilitySchema: ClientTasksCapabilitySchema$1,
    ServerTasksCapabilitySchema: ServerTasksCapabilitySchema$1,
    ClientCapabilitiesSchema: ClientCapabilitiesSchema$1,
    InitializeRequestParamsSchema: InitializeRequestParamsSchema$1,
    InitializeRequestSchema: InitializeRequestSchema$1,
    ServerCapabilitiesSchema: ServerCapabilitiesSchema$1,
    InitializeResultSchema: InitializeResultSchema$1,
    InitializedNotificationSchema: InitializedNotificationSchema$1,
    PingRequestSchema: PingRequestSchema$1,
    ProgressSchema: ProgressSchema$1,
    ProgressNotificationParamsSchema: ProgressNotificationParamsSchema$1,
    ProgressNotificationSchema: ProgressNotificationSchema$1,
    PaginatedRequestParamsSchema: PaginatedRequestParamsSchema$1,
    PaginatedRequestSchema: PaginatedRequestSchema$1,
    PaginatedResultSchema: PaginatedResultSchema$1,
    ResourceContentsSchema: ResourceContentsSchema$1,
    TextResourceContentsSchema: TextResourceContentsSchema$1,
    BlobResourceContentsSchema: BlobResourceContentsSchema$1,
    RoleSchema: RoleSchema$1,
    AnnotationsSchema: AnnotationsSchema$1,
    ResourceSchema: ResourceSchema$1,
    ResourceTemplateSchema: ResourceTemplateSchema$1,
    ListResourcesRequestSchema: ListResourcesRequestSchema$1,
    ListResourcesResultSchema: ListResourcesResultSchema$1,
    ListResourceTemplatesRequestSchema: ListResourceTemplatesRequestSchema$1,
    ListResourceTemplatesResultSchema: ListResourceTemplatesResultSchema$1,
    ResourceRequestParamsSchema: ResourceRequestParamsSchema$1,
    ReadResourceRequestParamsSchema: ReadResourceRequestParamsSchema$1,
    ReadResourceRequestSchema: ReadResourceRequestSchema$1,
    ReadResourceResultSchema: ReadResourceResultSchema$1,
    ResourceListChangedNotificationSchema: ResourceListChangedNotificationSchema$1,
    SubscribeRequestParamsSchema: SubscribeRequestParamsSchema$1,
    SubscribeRequestSchema: SubscribeRequestSchema$1,
    UnsubscribeRequestParamsSchema: UnsubscribeRequestParamsSchema$1,
    UnsubscribeRequestSchema: UnsubscribeRequestSchema$1,
    ResourceUpdatedNotificationParamsSchema: ResourceUpdatedNotificationParamsSchema$1,
    ResourceUpdatedNotificationSchema: ResourceUpdatedNotificationSchema$1,
    PromptArgumentSchema: PromptArgumentSchema$1,
    PromptSchema: PromptSchema$1,
    ListPromptsRequestSchema: ListPromptsRequestSchema$1,
    ListPromptsResultSchema: ListPromptsResultSchema$1,
    GetPromptRequestParamsSchema: GetPromptRequestParamsSchema$1,
    GetPromptRequestSchema: GetPromptRequestSchema$1,
    TextContentSchema: TextContentSchema$1,
    ImageContentSchema: ImageContentSchema$1,
    AudioContentSchema: AudioContentSchema$1,
    ToolUseContentSchema: ToolUseContentSchema$1,
    EmbeddedResourceSchema: EmbeddedResourceSchema$1,
    ResourceLinkSchema: ResourceLinkSchema$1,
    ContentBlockSchema: ContentBlockSchema$1,
    PromptMessageSchema: PromptMessageSchema$1,
    GetPromptResultSchema: GetPromptResultSchema$1,
    PromptListChangedNotificationSchema: PromptListChangedNotificationSchema$1,
    ToolAnnotationsSchema: ToolAnnotationsSchema$1,
    ToolExecutionSchema: ToolExecutionSchema$1,
    ToolSchema: ToolSchema$1,
    ListToolsRequestSchema: ListToolsRequestSchema$1,
    ListToolsResultSchema: ListToolsResultSchema$1,
    CallToolResultSchema: CallToolResultSchema$1,
    CallToolRequestParamsSchema: CallToolRequestParamsSchema$1,
    CallToolRequestSchema: CallToolRequestSchema$1,
    ToolListChangedNotificationSchema: ToolListChangedNotificationSchema$1,
    LoggingLevelSchema: LoggingLevelSchema$1,
    SetLevelRequestParamsSchema: SetLevelRequestParamsSchema$1,
    SetLevelRequestSchema: SetLevelRequestSchema$1,
    LoggingMessageNotificationParamsSchema: LoggingMessageNotificationParamsSchema$1,
    LoggingMessageNotificationSchema: LoggingMessageNotificationSchema$1,
    ModelHintSchema: ModelHintSchema$1,
    ModelPreferencesSchema: ModelPreferencesSchema$1,
    ToolChoiceSchema: ToolChoiceSchema$1,
    ToolResultContentSchema: ToolResultContentSchema$1,
    SamplingContentSchema: SamplingContentSchema$1,
    SamplingMessageContentBlockSchema: SamplingMessageContentBlockSchema$1,
    SamplingMessageSchema: SamplingMessageSchema$1,
    CreateMessageRequestParamsSchema: CreateMessageRequestParamsSchema$1,
    CreateMessageRequestSchema: CreateMessageRequestSchema$1,
    CreateMessageResultSchema: CreateMessageResultSchema$1,
    CreateMessageResultWithToolsSchema: CreateMessageResultWithToolsSchema$1,
    BooleanSchemaSchema: BooleanSchemaSchema$1,
    StringSchemaSchema: StringSchemaSchema$1,
    NumberSchemaSchema: NumberSchemaSchema$1,
    UntitledSingleSelectEnumSchemaSchema: UntitledSingleSelectEnumSchemaSchema$1,
    TitledSingleSelectEnumSchemaSchema: TitledSingleSelectEnumSchemaSchema$1,
    LegacyTitledEnumSchemaSchema: LegacyTitledEnumSchemaSchema$1,
    SingleSelectEnumSchemaSchema: SingleSelectEnumSchemaSchema$1,
    UntitledMultiSelectEnumSchemaSchema: UntitledMultiSelectEnumSchemaSchema$1,
    TitledMultiSelectEnumSchemaSchema: TitledMultiSelectEnumSchemaSchema$1,
    MultiSelectEnumSchemaSchema: MultiSelectEnumSchemaSchema$1,
    EnumSchemaSchema: EnumSchemaSchema$1,
    PrimitiveSchemaDefinitionSchema: PrimitiveSchemaDefinitionSchema$1,
    ElicitRequestFormParamsSchema: ElicitRequestFormParamsSchema$1,
    ElicitRequestURLParamsSchema: ElicitRequestURLParamsSchema$1,
    ElicitRequestParamsSchema: ElicitRequestParamsSchema$1,
    ElicitRequestSchema: ElicitRequestSchema$1,
    ElicitationCompleteNotificationParamsSchema: ElicitationCompleteNotificationParamsSchema$1,
    ElicitationCompleteNotificationSchema: ElicitationCompleteNotificationSchema$1,
    ElicitResultSchema: ElicitResultSchema$1,
    ResourceTemplateReferenceSchema: ResourceTemplateReferenceSchema$1,
    PromptReferenceSchema: PromptReferenceSchema$1,
    CompleteRequestParamsSchema: CompleteRequestParamsSchema$1,
    CompleteRequestSchema: CompleteRequestSchema$1,
    CompleteResultSchema: CompleteResultSchema$1,
    RootSchema: RootSchema$1,
    ListRootsRequestSchema: ListRootsRequestSchema$1,
    ListRootsResultSchema: ListRootsResultSchema$1,
    RootsListChangedNotificationSchema: RootsListChangedNotificationSchema$1,
    TaskCreationParamsSchema: TaskCreationParamsSchema$1,
    TaskStatusSchema: TaskStatusSchema$1,
    TaskSchema: TaskSchema$1,
    CreateTaskResultSchema: CreateTaskResultSchema$1,
    TaskStatusNotificationParamsSchema: TaskStatusNotificationParamsSchema$1,
    TaskStatusNotificationSchema: TaskStatusNotificationSchema$1,
    GetTaskRequestSchema: GetTaskRequestSchema$1,
    GetTaskResultSchema: GetTaskResultSchema$1,
    GetTaskPayloadRequestSchema: GetTaskPayloadRequestSchema$1,
    GetTaskPayloadResultSchema: GetTaskPayloadResultSchema$1,
    ListTasksRequestSchema: ListTasksRequestSchema$1,
    ListTasksResultSchema: ListTasksResultSchema$1,
    CancelTaskRequestSchema: CancelTaskRequestSchema$1,
    CancelTaskResultSchema: ResultSchema$1.merge(TaskSchema$1),
    ClientRequestSchema: union([PingRequestSchema$1, InitializeRequestSchema$1, CompleteRequestSchema$1, SetLevelRequestSchema$1, GetPromptRequestSchema$1, ListPromptsRequestSchema$1, ListResourcesRequestSchema$1, ListResourceTemplatesRequestSchema$1, ReadResourceRequestSchema$1, SubscribeRequestSchema$1, UnsubscribeRequestSchema$1, CallToolRequestSchema$1, ListToolsRequestSchema$1, GetTaskRequestSchema$1, GetTaskPayloadRequestSchema$1, ListTasksRequestSchema$1, CancelTaskRequestSchema$1]),
    ClientNotificationSchema: union([CancelledNotificationSchema$1, ProgressNotificationSchema$1, InitializedNotificationSchema$1, RootsListChangedNotificationSchema$1, TaskStatusNotificationSchema$1]),
    ClientResultSchema: union([EmptyResultSchema$1, CreateMessageResultSchema$1, CreateMessageResultWithToolsSchema$1, ElicitResultSchema$1, ListRootsResultSchema$1, GetTaskResultSchema$1, ListTasksResultSchema$1, CreateTaskResultSchema$1]),
    ServerRequestSchema: union([PingRequestSchema$1, CreateMessageRequestSchema$1, ElicitRequestSchema$1, ListRootsRequestSchema$1, GetTaskRequestSchema$1, GetTaskPayloadRequestSchema$1, ListTasksRequestSchema$1, CancelTaskRequestSchema$1]),
    ServerNotificationSchema: union([CancelledNotificationSchema$1, ProgressNotificationSchema$1, LoggingMessageNotificationSchema$1, ResourceUpdatedNotificationSchema$1, ResourceListChangedNotificationSchema$1, ToolListChangedNotificationSchema$1, PromptListChangedNotificationSchema$1, TaskStatusNotificationSchema$1, ElicitationCompleteNotificationSchema$1]),
    ServerResultSchema: union([EmptyResultSchema$1, InitializeResultSchema$1, CompleteResultSchema$1, GetPromptResultSchema$1, ListPromptsResultSchema$1, ListResourcesResultSchema$1, ListResourceTemplatesResultSchema$1, ReadResourceResultSchema$1, CallToolResultSchema$1, ListToolsResultSchema$1, GetTaskResultSchema$1, ListTasksResultSchema$1, CreateTaskResultSchema$1]),
    CallToolResultWireSchema: unknown().superRefine((value, ctx) => {
      if (typeof value !== "object" || value === null || Array.isArray(value) || value.content !== void 0) return;
      for (const key of TOOL_RESULT_FOREIGN_FAMILY_KEYS) if (key in value) {
        ctx.addIssue({
          code: "custom",
          message: `content is required when the body carries '${key}' \u2014 another result family cannot default into an empty tools/call success`
        });
        return;
      }
    }).transform(normalizeContentlessToolResult).pipe(CallToolResultSchema$1)
  };
}
var memo$1;
function buildSchemas2025() {
  return memo$1 ??= build$1();
}
function isNonObjectJsonSchemaRoot(json2) {
  return json2["type"] !== "object";
}
var REF_REWRITE_DATA_POSITION_KEYS = /* @__PURE__ */new Set(["const", "enum", "default", "examples"]);
var REF_REWRITE_NAME_MAP_KEYS = /* @__PURE__ */new Set(["properties", "patternProperties", "$defs", "definitions", "dependentSchemas", "dependencies"]);
function establishesNewBase(id) {
  return id !== void 0 && !(typeof id === "string" && id.startsWith("#"));
}
function wrapOutputSchemaForLegacy(natural) {
  const $schema = typeof natural["$schema"] === "string" ? natural["$schema"] : void 0;
  if (establishesNewBase(natural["$id"])) return {
    ...($schema !== void 0 && {
      $schema
    }),
    type: "object",
    properties: {
      result: natural
    },
    required: ["result"]
  };
  const convertRecursiveRefs = declares2019Dialect(natural["$schema"]) && natural["$recursiveAnchor"] !== true;
  const rewriteRefs = (node, parentIsNameMap) => {
    if (Array.isArray(node)) return node.map(item => rewriteRefs(item, false));
    if (node === null || typeof node !== "object") return node;
    if (!parentIsNameMap && establishesNewBase(node["$id"])) return node;
    const out = {};
    let convertedRecursion = false;
    for (const [k, v] of Object.entries(node)) if (parentIsNameMap) out[k] = rewriteRefs(v, false);else if ((k === "$ref" || k === "$dynamicRef") && typeof v === "string") out[k] = v === "#" ? "#/properties/result" : v.startsWith("#/") ? `#/properties/result${v.slice(1)}` : v;else if (k === "$recursiveRef" && v === "#" && convertRecursiveRefs) convertedRecursion = true;else if (REF_REWRITE_DATA_POSITION_KEYS.has(k)) out[k] = v;else if (REF_REWRITE_NAME_MAP_KEYS.has(k)) out[k] = rewriteRefs(v, true);else out[k] = rewriteRefs(v, false);
    if (convertedRecursion) if ("$ref" in out) out["allOf"] = [...(Array.isArray(out["allOf"]) ? out["allOf"] : []), {
      $ref: "#/properties/result"
    }];else out["$ref"] = "#/properties/result";
    return out;
  };
  return {
    ...($schema !== void 0 && {
      $schema
    }),
    type: "object",
    properties: {
      result: rewriteRefs(natural, false)
    },
    required: ["result"]
  };
}
var requestMethodKeys$1 = {
  ping: null,
  initialize: null,
  "completion/complete": null,
  "logging/setLevel": null,
  "prompts/get": null,
  "prompts/list": null,
  "resources/list": null,
  "resources/templates/list": null,
  "resources/read": null,
  "resources/subscribe": null,
  "resources/unsubscribe": null,
  "tools/call": null,
  "tools/list": null,
  "tasks/get": null,
  "tasks/result": null,
  "tasks/list": null,
  "tasks/cancel": null,
  "sampling/createMessage": null,
  "elicitation/create": null,
  "roots/list": null
};
var notificationMethodKeys$1 = {
  "notifications/cancelled": null,
  "notifications/progress": null,
  "notifications/initialized": null,
  "notifications/roots/list_changed": null,
  "notifications/tasks/status": null,
  "notifications/message": null,
  "notifications/resources/updated": null,
  "notifications/resources/list_changed": null,
  "notifications/tools/list_changed": null,
  "notifications/prompts/list_changed": null,
  "notifications/elicitation/complete": null
};
var resultMethodKeys = {
  ping: null,
  initialize: null,
  "completion/complete": null,
  "logging/setLevel": null,
  "prompts/get": null,
  "prompts/list": null,
  "resources/list": null,
  "resources/templates/list": null,
  "resources/read": null,
  "resources/subscribe": null,
  "resources/unsubscribe": null,
  "tools/call": null,
  "tools/list": null,
  "sampling/createMessage": null,
  "elicitation/create": null,
  "roots/list": null
};
var maps$1;
function registryMaps() {
  if (maps$1) return maps$1;
  const s = buildSchemas2025();
  maps$1 = {
    requestSchemas: {
      ping: s.PingRequestSchema,
      initialize: s.InitializeRequestSchema,
      "completion/complete": s.CompleteRequestSchema,
      "logging/setLevel": s.SetLevelRequestSchema,
      "prompts/get": s.GetPromptRequestSchema,
      "prompts/list": s.ListPromptsRequestSchema,
      "resources/list": s.ListResourcesRequestSchema,
      "resources/templates/list": s.ListResourceTemplatesRequestSchema,
      "resources/read": s.ReadResourceRequestSchema,
      "resources/subscribe": s.SubscribeRequestSchema,
      "resources/unsubscribe": s.UnsubscribeRequestSchema,
      "tools/call": s.CallToolRequestSchema,
      "tools/list": s.ListToolsRequestSchema,
      "tasks/get": s.GetTaskRequestSchema,
      "tasks/result": s.GetTaskPayloadRequestSchema,
      "tasks/list": s.ListTasksRequestSchema,
      "tasks/cancel": s.CancelTaskRequestSchema,
      "sampling/createMessage": s.CreateMessageRequestSchema,
      "elicitation/create": s.ElicitRequestSchema,
      "roots/list": s.ListRootsRequestSchema
    },
    notificationSchemas: {
      "notifications/cancelled": s.CancelledNotificationSchema,
      "notifications/progress": s.ProgressNotificationSchema,
      "notifications/initialized": s.InitializedNotificationSchema,
      "notifications/roots/list_changed": s.RootsListChangedNotificationSchema,
      "notifications/tasks/status": s.TaskStatusNotificationSchema,
      "notifications/message": s.LoggingMessageNotificationSchema,
      "notifications/resources/updated": s.ResourceUpdatedNotificationSchema,
      "notifications/resources/list_changed": s.ResourceListChangedNotificationSchema,
      "notifications/tools/list_changed": s.ToolListChangedNotificationSchema,
      "notifications/prompts/list_changed": s.PromptListChangedNotificationSchema,
      "notifications/elicitation/complete": s.ElicitationCompleteNotificationSchema
    },
    resultSchemas: {
      ping: s.EmptyResultSchema,
      initialize: s.InitializeResultSchema,
      "completion/complete": s.CompleteResultSchema,
      "logging/setLevel": s.EmptyResultSchema,
      "prompts/get": s.GetPromptResultSchema,
      "prompts/list": s.ListPromptsResultSchema,
      "resources/list": s.ListResourcesResultSchema,
      "resources/templates/list": s.ListResourceTemplatesResultSchema,
      "resources/read": s.ReadResourceResultSchema,
      "resources/subscribe": s.EmptyResultSchema,
      "resources/unsubscribe": s.EmptyResultSchema,
      "tools/call": s.CallToolResultWireSchema,
      "tools/list": s.ListToolsResultSchema,
      "sampling/createMessage": s.CreateMessageResultWithToolsSchema,
      "elicitation/create": s.ElicitResultSchema,
      "roots/list": s.ListRootsResultSchema
    }
  };
  return maps$1;
}
function hasRequestMethod2025(method) {
  return Object.prototype.hasOwnProperty.call(requestMethodKeys$1, method);
}
function hasNotificationMethod2025(method) {
  return Object.prototype.hasOwnProperty.call(notificationMethodKeys$1, method);
}
function hasResultMethod(method) {
  return Object.prototype.hasOwnProperty.call(resultMethodKeys, method);
}
function getResultSchema(method) {
  return hasResultMethod(method) ? registryMaps().resultSchemas[method] : void 0;
}
function getRequestSchema(method) {
  return hasRequestMethod2025(method) ? registryMaps().requestSchemas[method] : void 0;
}
function getNotificationSchema(method) {
  return hasNotificationMethod2025(method) ? registryMaps().notificationSchemas[method] : void 0;
}
var rev2025RequestMethods = Object.keys(requestMethodKeys$1);
var rev2025NotificationMethods = Object.keys(notificationMethodKeys$1);
function isPlainObject$6(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function triState$1(schema, raw) {
  if (schema === void 0) return {
    ok: false,
    reason: "not-in-era"
  };
  const parsed = schema.safeParse(raw);
  return parsed.success ? {
    ok: true,
    value: parsed.data
  } : {
    ok: false,
    reason: "invalid",
    message: String(parsed.error)
  };
}
var NOT_IN_ERA$1 = {
  ok: false,
  reason: "not-in-era"
};
function toolNeedsLegacyWrap(t) {
  return isPlainObject$6(t) && isPlainObject$6(t["outputSchema"]) && isNonObjectJsonSchemaRoot(t["outputSchema"]);
}
function toNeutralResult(value) {
  return value;
}
var rev2025Codec = {
  era: "2025-11-25",
  hasRequestMethod: hasRequestMethod2025,
  hasNotificationMethod: hasNotificationMethod2025,
  validateRequest: (method, raw) => triState$1(getRequestSchema(method), raw),
  validateResult: (method, raw) => triState$1(getResultSchema(method), raw),
  validateNotification: (method, raw) => triState$1(getNotificationSchema(method), raw),
  hasInputRequestMethod: () => false,
  validateInputRequest: () => NOT_IN_ERA$1,
  validateInputResponse: () => NOT_IN_ERA$1,
  samplingResultVariant: (hasTools, raw) => {
    const s = buildSchemas2025();
    return triState$1(hasTools ? s.CreateMessageResultWithToolsSchema : s.CreateMessageResultSchema, raw);
  },
  outboundEnvelope: _material => void 0,
  validateEnvelopeMeta: _meta => [],
  projectCallToolResult(result, advertisedOutputSchema) {
    const withText = appendTextFallbackForNonObject(result);
    const sc = withText.structuredContent;
    if (sc === void 0) return withText;
    const valueIsNonObject = typeof sc !== "object" || sc === null || Array.isArray(sc);
    const schemaWrapped = advertisedOutputSchema !== void 0 && isNonObjectJsonSchemaRoot(advertisedOutputSchema);
    if (!valueIsNonObject && !schemaWrapped) return withText;
    return {
      ...withText,
      structuredContent: {
        result: sc
      }
    };
  },
  decodeResult(_method, raw) {
    if (isPlainObject$6(raw) && "resultType" in raw) {
      const stripped = {
        ...raw
      };
      delete stripped["resultType"];
      return {
        kind: "complete",
        result: toNeutralResult(stripped)
      };
    }
    return {
      kind: "complete",
      result: toNeutralResult(raw)
    };
  },
  encodeResult(method, result) {
    if (method !== "tools/list") return result;
    const tools = result.tools;
    if (!Array.isArray(tools) || !tools.some(t => toolNeedsLegacyWrap(t))) return result;
    return {
      ...result,
      tools: tools.map(t => toolNeedsLegacyWrap(t) ? {
        ...t,
        outputSchema: wrapOutputSchemaForLegacy(t.outputSchema)
      } : t)
    };
  },
  encodeErrorCode: code => code === -32002 ? -32602 : code,
  checkInboundEnvelope: _material => void 0
};
function build() {
  const JSONValueSchema$1 = lazy(() => union([string2(), number2(), boolean2(), _null3(), record(string2(), JSONValueSchema$1), array(JSONValueSchema$1)]));
  const JSONObjectSchema$1 = record(string2(), JSONValueSchema$1);
  const ProgressTokenSchema$1 = union([string2(), number2().int()]);
  const CursorSchema$1 = string2();
  const RequestIdSchema$1 = union([string2(), number2().int()]);
  const RoleSchema$1 = _enum2(["user", "assistant"]);
  const LoggingLevelSchema$1 = _enum2(["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"]);
  const Base64Schema2 = string2().refine(val => {
    try {
      atob(val);
      return true;
    } catch {
      return false;
    }
  }, {
    message: "Invalid Base64 string"
  });
  const TaskMetadataSchema$1 = object({
    ttl: number2().optional()
  });
  const RelatedTaskMetadataSchema$1 = object({
    taskId: string2()
  });
  const RequestMetaSchema$1 = looseObject({
    progressToken: ProgressTokenSchema$1.optional(),
    "io.modelcontextprotocol/related-task": RelatedTaskMetadataSchema$1.optional()
  });
  const BaseRequestParamsSchema$1 = object({
    _meta: RequestMetaSchema$1.optional()
  });
  const TaskAugmentedRequestParamsSchema$1 = BaseRequestParamsSchema$1.extend({
    task: TaskMetadataSchema$1.optional()
  });
  const NotificationsParamsSchema$1 = object({
    _meta: RequestMetaSchema$1.optional()
  });
  const NotificationSchema$1 = object({
    method: string2(),
    params: NotificationsParamsSchema$1.loose().optional()
  });
  const IconSchema$1 = object({
    src: string2(),
    mimeType: string2().optional(),
    sizes: array(string2()).optional(),
    theme: _enum2(["light", "dark"]).optional()
  });
  const IconsSchema$1 = object({
    icons: array(IconSchema$1).optional()
  });
  const BaseMetadataSchema$1 = object({
    name: string2(),
    title: string2().optional()
  });
  const ImplementationSchema$1 = BaseMetadataSchema$1.extend({
    ...BaseMetadataSchema$1.shape,
    ...IconsSchema$1.shape,
    version: string2(),
    websiteUrl: string2().optional(),
    description: string2().optional()
  });
  const FormElicitationCapabilitySchema2 = intersection(object({
    applyDefaults: boolean2().optional()
  }), JSONObjectSchema$1);
  const ElicitationCapabilitySchema2 = preprocess(value => {
    if (value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0) return {
      form: {}
    };
    return value;
  }, intersection(object({
    form: FormElicitationCapabilitySchema2.optional(),
    url: JSONObjectSchema$1.optional()
  }), JSONObjectSchema$1.optional()));
  const ClientTasksCapabilitySchema$1 = looseObject({
    list: JSONObjectSchema$1.optional(),
    cancel: JSONObjectSchema$1.optional(),
    requests: looseObject({
      sampling: looseObject({
        createMessage: JSONObjectSchema$1.optional()
      }).optional(),
      elicitation: looseObject({
        create: JSONObjectSchema$1.optional()
      }).optional()
    }).optional()
  });
  const ServerTasksCapabilitySchema$1 = looseObject({
    list: JSONObjectSchema$1.optional(),
    cancel: JSONObjectSchema$1.optional(),
    requests: looseObject({
      tools: looseObject({
        call: JSONObjectSchema$1.optional()
      }).optional()
    }).optional()
  });
  const ClientCapabilitiesSchema$1 = object({
    experimental: record(string2(), JSONObjectSchema$1).optional(),
    sampling: object({
      context: JSONObjectSchema$1.optional(),
      tools: JSONObjectSchema$1.optional()
    }).optional(),
    elicitation: ElicitationCapabilitySchema2.optional(),
    roots: object({
      listChanged: boolean2().optional()
    }).optional(),
    tasks: ClientTasksCapabilitySchema$1.optional(),
    extensions: record(string2(), JSONObjectSchema$1).optional()
  });
  const ServerCapabilitiesSchema$1 = object({
    experimental: record(string2(), JSONObjectSchema$1).optional(),
    logging: JSONObjectSchema$1.optional(),
    completions: JSONObjectSchema$1.optional(),
    prompts: object({
      listChanged: boolean2().optional()
    }).optional(),
    resources: object({
      subscribe: boolean2().optional(),
      listChanged: boolean2().optional()
    }).optional(),
    tools: object({
      listChanged: boolean2().optional()
    }).optional(),
    tasks: ServerTasksCapabilitySchema$1.optional(),
    extensions: record(string2(), JSONObjectSchema$1).optional()
  });
  const ProgressSchema$1 = object({
    progress: number2(),
    total: optional(number2()),
    message: optional(string2())
  });
  const ProgressNotificationParamsSchema$1 = object({
    ...NotificationsParamsSchema$1.shape,
    ...ProgressSchema$1.shape,
    progressToken: ProgressTokenSchema$1
  });
  const ProgressNotificationSchema$1 = NotificationSchema$1.extend({
    method: literal("notifications/progress"),
    params: ProgressNotificationParamsSchema$1
  });
  const LoggingMessageNotificationParamsSchema$1 = NotificationsParamsSchema$1.extend({
    level: LoggingLevelSchema$1,
    logger: string2().optional(),
    data: unknown()
  });
  const LoggingMessageNotificationSchema$1 = NotificationSchema$1.extend({
    method: literal("notifications/message"),
    params: LoggingMessageNotificationParamsSchema$1
  });
  const ResourceContentsSchema$1 = object({
    uri: string2(),
    mimeType: optional(string2()),
    _meta: record(string2(), unknown()).optional()
  });
  const TextResourceContentsSchema$1 = ResourceContentsSchema$1.extend({
    text: string2()
  });
  const BlobResourceContentsSchema$1 = ResourceContentsSchema$1.extend({
    blob: Base64Schema2
  });
  const AnnotationsSchema$1 = object({
    audience: array(RoleSchema$1).optional(),
    priority: number2().min(0).max(1).optional(),
    lastModified: iso_exports.datetime({
      offset: true
    }).optional()
  });
  const ResourceSchema$1 = object({
    ...BaseMetadataSchema$1.shape,
    ...IconsSchema$1.shape,
    uri: string2(),
    description: optional(string2()),
    mimeType: optional(string2()),
    size: optional(number2()),
    annotations: AnnotationsSchema$1.optional(),
    _meta: optional(looseObject({}))
  });
  const ResourceTemplateSchema$1 = object({
    ...BaseMetadataSchema$1.shape,
    ...IconsSchema$1.shape,
    uriTemplate: string2(),
    description: optional(string2()),
    mimeType: optional(string2()),
    annotations: AnnotationsSchema$1.optional(),
    _meta: optional(looseObject({}))
  });
  const ResourceListChangedNotificationSchema$1 = NotificationSchema$1.extend({
    method: literal("notifications/resources/list_changed"),
    params: NotificationsParamsSchema$1.optional()
  });
  const ResourceUpdatedNotificationParamsSchema$1 = NotificationsParamsSchema$1.extend({
    uri: string2()
  });
  const ResourceUpdatedNotificationSchema$1 = NotificationSchema$1.extend({
    method: literal("notifications/resources/updated"),
    params: ResourceUpdatedNotificationParamsSchema$1
  });
  const PromptArgumentSchema$1 = object({
    name: string2(),
    description: optional(string2()),
    required: optional(boolean2())
  });
  const PromptSchema$1 = object({
    ...BaseMetadataSchema$1.shape,
    ...IconsSchema$1.shape,
    description: optional(string2()),
    arguments: optional(array(PromptArgumentSchema$1)),
    _meta: optional(looseObject({}))
  });
  const PromptListChangedNotificationSchema$1 = NotificationSchema$1.extend({
    method: literal("notifications/prompts/list_changed"),
    params: NotificationsParamsSchema$1.optional()
  });
  const TextContentSchema$1 = object({
    type: literal("text"),
    text: string2(),
    annotations: AnnotationsSchema$1.optional(),
    _meta: record(string2(), unknown()).optional()
  });
  const ImageContentSchema$1 = object({
    type: literal("image"),
    data: Base64Schema2,
    mimeType: string2(),
    annotations: AnnotationsSchema$1.optional(),
    _meta: record(string2(), unknown()).optional()
  });
  const AudioContentSchema$1 = object({
    type: literal("audio"),
    data: Base64Schema2,
    mimeType: string2(),
    annotations: AnnotationsSchema$1.optional(),
    _meta: record(string2(), unknown()).optional()
  });
  const ToolUseContentSchema$1 = object({
    type: literal("tool_use"),
    name: string2(),
    id: string2(),
    input: record(string2(), unknown()),
    _meta: record(string2(), unknown()).optional()
  });
  const EmbeddedResourceSchema$1 = object({
    type: literal("resource"),
    resource: union([TextResourceContentsSchema$1, BlobResourceContentsSchema$1]),
    annotations: AnnotationsSchema$1.optional(),
    _meta: record(string2(), unknown()).optional()
  });
  const ResourceLinkSchema$1 = ResourceSchema$1.extend({
    type: literal("resource_link")
  });
  const ContentBlockSchema$1 = union([TextContentSchema$1, ImageContentSchema$1, AudioContentSchema$1, ResourceLinkSchema$1, EmbeddedResourceSchema$1]);
  const PromptMessageSchema$1 = object({
    role: RoleSchema$1,
    content: ContentBlockSchema$1
  });
  const ToolAnnotationsSchema$1 = object({
    title: string2().optional(),
    readOnlyHint: boolean2().optional(),
    destructiveHint: boolean2().optional(),
    idempotentHint: boolean2().optional(),
    openWorldHint: boolean2().optional()
  });
  const ToolListChangedNotificationSchema$1 = NotificationSchema$1.extend({
    method: literal("notifications/tools/list_changed"),
    params: NotificationsParamsSchema$1.optional()
  });
  const ModelHintSchema$1 = object({
    name: string2().optional()
  });
  const ModelPreferencesSchema$1 = object({
    hints: array(ModelHintSchema$1).optional(),
    costPriority: number2().min(0).max(1).optional(),
    speedPriority: number2().min(0).max(1).optional(),
    intelligencePriority: number2().min(0).max(1).optional()
  });
  const ToolChoiceSchema$1 = object({
    mode: _enum2(["auto", "required", "none"]).optional()
  });
  const BooleanSchemaSchema$1 = object({
    type: literal("boolean"),
    title: string2().optional(),
    description: string2().optional(),
    default: boolean2().optional()
  });
  const StringSchemaSchema$1 = object({
    type: literal("string"),
    title: string2().optional(),
    description: string2().optional(),
    minLength: number2().optional(),
    maxLength: number2().optional(),
    format: _enum2(["email", "uri", "date", "date-time"]).optional(),
    default: string2().optional()
  });
  const NumberSchemaSchema$1 = object({
    type: _enum2(["number", "integer"]),
    title: string2().optional(),
    description: string2().optional(),
    minimum: number2().optional(),
    maximum: number2().optional(),
    default: number2().optional()
  });
  const UntitledSingleSelectEnumSchemaSchema$1 = object({
    type: literal("string"),
    title: string2().optional(),
    description: string2().optional(),
    enum: array(string2()),
    default: string2().optional()
  });
  const TitledSingleSelectEnumSchemaSchema$1 = object({
    type: literal("string"),
    title: string2().optional(),
    description: string2().optional(),
    oneOf: array(object({
      const: string2(),
      title: string2()
    })),
    default: string2().optional()
  });
  const LegacyTitledEnumSchemaSchema$1 = object({
    type: literal("string"),
    title: string2().optional(),
    description: string2().optional(),
    enum: array(string2()),
    enumNames: array(string2()).optional(),
    default: string2().optional()
  });
  const SingleSelectEnumSchemaSchema$1 = union([UntitledSingleSelectEnumSchemaSchema$1, TitledSingleSelectEnumSchemaSchema$1]);
  const UntitledMultiSelectEnumSchemaSchema$1 = object({
    type: literal("array"),
    title: string2().optional(),
    description: string2().optional(),
    minItems: number2().optional(),
    maxItems: number2().optional(),
    items: object({
      type: literal("string"),
      enum: array(string2())
    }),
    default: array(string2()).optional()
  });
  const TitledMultiSelectEnumSchemaSchema$1 = object({
    type: literal("array"),
    title: string2().optional(),
    description: string2().optional(),
    minItems: number2().optional(),
    maxItems: number2().optional(),
    items: object({
      anyOf: array(object({
        const: string2(),
        title: string2()
      }))
    }),
    default: array(string2()).optional()
  });
  const MultiSelectEnumSchemaSchema$1 = union([UntitledMultiSelectEnumSchemaSchema$1, TitledMultiSelectEnumSchemaSchema$1]);
  const EnumSchemaSchema$1 = union([LegacyTitledEnumSchemaSchema$1, SingleSelectEnumSchemaSchema$1, MultiSelectEnumSchemaSchema$1]);
  const PrimitiveSchemaDefinitionSchema$1 = union([EnumSchemaSchema$1, BooleanSchemaSchema$1, StringSchemaSchema$1, NumberSchemaSchema$1]);
  const ElicitRequestFormParamsSchema$1 = TaskAugmentedRequestParamsSchema$1.extend({
    mode: literal("form").optional(),
    message: string2(),
    requestedSchema: object({
      type: literal("object"),
      properties: record(string2(), PrimitiveSchemaDefinitionSchema$1),
      required: array(string2()).optional()
    }).catchall(unknown())
  });
  const ResourceTemplateReferenceSchema$1 = object({
    type: literal("ref/resource"),
    uri: string2()
  });
  const PromptReferenceSchema$1 = object({
    type: literal("ref/prompt"),
    name: string2()
  });
  const RootSchema$1 = object({
    uri: string2().startsWith("file://"),
    name: string2().optional(),
    _meta: record(string2(), unknown()).optional()
  });
  const sharedClientCapabilityShape = ClientCapabilitiesSchema$1.shape;
  const ClientCapabilities2026Schema = object({
    experimental: sharedClientCapabilityShape.experimental,
    sampling: sharedClientCapabilityShape.sampling,
    elicitation: sharedClientCapabilityShape.elicitation,
    roots: sharedClientCapabilityShape.roots,
    extensions: sharedClientCapabilityShape.extensions
  });
  const sharedServerCapabilityShape = ServerCapabilitiesSchema$1.shape;
  const ServerCapabilities2026Schema = object({
    experimental: sharedServerCapabilityShape.experimental,
    logging: sharedServerCapabilityShape.logging,
    completions: sharedServerCapabilityShape.completions,
    prompts: sharedServerCapabilityShape.prompts,
    resources: sharedServerCapabilityShape.resources,
    tools: sharedServerCapabilityShape.tools,
    extensions: sharedServerCapabilityShape.extensions
  });
  const RequestMetaEnvelopeSchema = looseObject({
    progressToken: ProgressTokenSchema$1.optional(),
    [PROTOCOL_VERSION_META_KEY]: string2(),
    [CLIENT_INFO_META_KEY]: ImplementationSchema$1.optional(),
    [CLIENT_CAPABILITIES_META_KEY]: ClientCapabilities2026Schema,
    [LOG_LEVEL_META_KEY]: LoggingLevelSchema$1.optional()
  });
  const ToolSchema$1 = object({
    ...BaseMetadataSchema$1.shape,
    ...IconsSchema$1.shape,
    description: string2().optional(),
    inputSchema: looseObject({
      $schema: string2().optional(),
      type: literal("object")
    }),
    outputSchema: looseObject({
      $schema: string2().optional()
    }).optional(),
    annotations: ToolAnnotationsSchema$1.optional(),
    _meta: record(string2(), unknown()).optional()
  });
  const ToolResultContentSchema$1 = object({
    type: literal("tool_result"),
    toolUseId: string2(),
    content: array(ContentBlockSchema$1),
    structuredContent: unknown().optional(),
    isError: boolean2().optional(),
    _meta: record(string2(), unknown()).optional()
  });
  const SamplingMessageContentBlockSchema$1 = union([TextContentSchema$1, ImageContentSchema$1, AudioContentSchema$1, ToolUseContentSchema$1, ToolResultContentSchema$1]);
  const SamplingMessageSchema$1 = object({
    role: RoleSchema$1,
    content: union([SamplingMessageContentBlockSchema$1, array(SamplingMessageContentBlockSchema$1)]),
    _meta: record(string2(), unknown()).optional()
  });
  const ResultTypeSchema = string2();
  const ResultMetaSchema = looseObject({
    [SERVER_INFO_META_KEY]: ImplementationSchema$1.optional().catch(void 0)
  });
  const wireMeta = ResultMetaSchema.optional();
  function wireResult(shape) {
    return looseObject({
      _meta: wireMeta,
      resultType: ResultTypeSchema.default("complete"),
      ...shape
    });
  }
  const ResultSchema$1 = wireResult({});
  const PaginatedResultSchema$1 = wireResult({
    nextCursor: CursorSchema$1.optional()
  });
  const CallToolResultSchema$1 = wireResult({
    content: array(ContentBlockSchema$1),
    structuredContent: unknown().optional(),
    isError: boolean2().optional()
  });
  const ListToolsResultSchema$1 = wireResult({
    ttlMs: number2().int().min(0),
    cacheScope: _enum2(["public", "private"]),
    tools: array(ToolSchema$1),
    nextCursor: CursorSchema$1.optional()
  });
  const ListPromptsResultSchema$1 = wireResult({
    ttlMs: number2().int().min(0),
    cacheScope: _enum2(["public", "private"]),
    prompts: array(PromptSchema$1),
    nextCursor: CursorSchema$1.optional()
  });
  const GetPromptResultSchema$1 = wireResult({
    description: string2().optional(),
    messages: array(PromptMessageSchema$1)
  });
  const ListResourcesResultSchema$1 = wireResult({
    ttlMs: number2().int().min(0),
    cacheScope: _enum2(["public", "private"]),
    resources: array(ResourceSchema$1),
    nextCursor: CursorSchema$1.optional()
  });
  const ListResourceTemplatesResultSchema$1 = wireResult({
    ttlMs: number2().int().min(0),
    cacheScope: _enum2(["public", "private"]),
    resourceTemplates: array(ResourceTemplateSchema$1),
    nextCursor: CursorSchema$1.optional()
  });
  const ReadResourceResultSchema$1 = wireResult({
    ttlMs: number2().int().min(0),
    cacheScope: _enum2(["public", "private"]),
    contents: array(union([TextResourceContentsSchema$1, BlobResourceContentsSchema$1]))
  });
  const CompleteResultSchema$1 = wireResult({
    completion: object({
      values: array(string2()).max(100),
      total: number2().int().optional(),
      hasMore: boolean2().optional()
    }).loose()
  });
  const CacheableResultSchema = wireResult({
    ttlMs: number2().int().min(0),
    cacheScope: _enum2(["public", "private"])
  });
  const DiscoverResultSchema$1 = wireResult({
    ttlMs: number2().int().min(0).catch(0),
    cacheScope: _enum2(["public", "private"]).catch("private"),
    supportedVersions: array(string2()),
    capabilities: ServerCapabilities2026Schema,
    instructions: string2().optional()
  });
  const CreateMessageRequestParamsSchema$1 = object({
    messages: array(SamplingMessageSchema$1),
    modelPreferences: ModelPreferencesSchema$1.optional(),
    systemPrompt: string2().optional(),
    includeContext: _enum2(["none", "thisServer", "allServers"]).optional(),
    temperature: number2().optional(),
    maxTokens: number2().int(),
    stopSequences: array(string2()).optional(),
    metadata: JSONObjectSchema$1.optional(),
    tools: array(ToolSchema$1).optional(),
    toolChoice: ToolChoiceSchema$1.optional()
  });
  const CreateMessageRequestSchema$1 = object({
    method: literal("sampling/createMessage"),
    params: CreateMessageRequestParamsSchema$1
  });
  const ListRootsRequestSchema$1 = object({
    method: literal("roots/list"),
    params: object({
      _meta: record(string2(), unknown()).optional()
    }).optional()
  });
  const CreateMessageResultSchema$1 = object({
    ...SamplingMessageSchema$1.shape,
    model: string2(),
    stopReason: string2().optional()
  });
  const ListRootsResultSchema$1 = object({
    roots: array(RootSchema$1)
  });
  const ElicitResultSchema$1 = object({
    action: _enum2(["accept", "decline", "cancel"]),
    content: record(string2(), union([string2(), number2(), boolean2(), array(string2())])).optional()
  });
  const ElicitRequestURLParamsSchema$1 = object({
    mode: literal("url"),
    message: string2(),
    url: string2().url()
  });
  const ElicitRequestParamsSchema$1 = union([ElicitRequestFormParamsSchema$1, ElicitRequestURLParamsSchema$1]);
  const ElicitRequestSchema$1 = object({
    method: literal("elicitation/create"),
    params: ElicitRequestParamsSchema$1
  });
  const InputRequestSchema = union([CreateMessageRequestSchema$1, ListRootsRequestSchema$1, ElicitRequestSchema$1]);
  const InputResponseSchema = union([CreateMessageResultSchema$1, ListRootsResultSchema$1, ElicitResultSchema$1]);
  const InputRequestsSchema = record(string2(), InputRequestSchema);
  const InputResponsesSchema = record(string2(), InputResponseSchema);
  const InputRequiredResultSchema = wireResult({
    inputRequests: InputRequestsSchema.optional(),
    requestState: string2().optional()
  });
  const retryParamsShape = {
    inputResponses: InputResponsesSchema.optional(),
    requestState: string2().optional()
  };
  const InputResponseRequestParamsSchema = object({
    _meta: RequestMetaEnvelopeSchema,
    ...retryParamsShape
  });
  const DispatchRequestMetaSchema = looseObject({
    progressToken: ProgressTokenSchema$1.optional()
  });
  function wireRequest(method, paramsShape) {
    return object({
      method: literal(method),
      params: object({
        _meta: RequestMetaEnvelopeSchema,
        ...paramsShape
      })
    });
  }
  function dispatchRequest(method, paramsShape) {
    return object({
      method: literal(method),
      params: object({
        _meta: DispatchRequestMetaSchema.optional(),
        ...paramsShape
      }).optional()
    });
  }
  const callToolParamsShape = {
    name: string2(),
    arguments: record(string2(), unknown()).optional(),
    ...retryParamsShape
  };
  const paginatedParamsShape = {
    cursor: CursorSchema$1.optional()
  };
  const CallToolRequestSchema$1 = wireRequest("tools/call", callToolParamsShape);
  const ListToolsRequestSchema$1 = wireRequest("tools/list", paginatedParamsShape);
  const ListPromptsRequestSchema$1 = wireRequest("prompts/list", paginatedParamsShape);
  const GetPromptRequestSchema$1 = wireRequest("prompts/get", {
    name: string2(),
    arguments: record(string2(), string2()).optional(),
    ...retryParamsShape
  });
  const ListResourcesRequestSchema$1 = wireRequest("resources/list", paginatedParamsShape);
  const ListResourceTemplatesRequestSchema$1 = wireRequest("resources/templates/list", paginatedParamsShape);
  const ReadResourceRequestSchema$1 = wireRequest("resources/read", {
    uri: string2(),
    ...retryParamsShape
  });
  const completeParamsShape = {
    ref: union([PromptReferenceSchema$1, ResourceTemplateReferenceSchema$1]),
    argument: object({
      name: string2(),
      value: string2()
    }),
    context: object({
      arguments: record(string2(), string2()).optional()
    }).optional()
  };
  const CompleteRequestSchema$1 = wireRequest("completion/complete", completeParamsShape);
  const DiscoverRequestSchema$1 = wireRequest("server/discover", {});
  const SubscriptionFilterSchema$1 = object({
    toolsListChanged: boolean2().optional(),
    promptsListChanged: boolean2().optional(),
    resourcesListChanged: boolean2().optional(),
    resourceSubscriptions: array(string2()).optional()
  });
  const subscriptionsListenParamsShape = {
    notifications: SubscriptionFilterSchema$1
  };
  const SubscriptionsListenRequestSchema$1 = wireRequest("subscriptions/listen", subscriptionsListenParamsShape);
  const SubscriptionsListenResultMetaSchema$1 = ResultMetaSchema.extend({
    "io.modelcontextprotocol/subscriptionId": RequestIdSchema$1
  });
  const SubscriptionsListenResultSchema$1 = looseObject({
    _meta: SubscriptionsListenResultMetaSchema$1,
    resultType: ResultTypeSchema.default("complete")
  });
  const dispatchRequestSchemas = {
    "tools/call": dispatchRequest("tools/call", callToolParamsShape),
    "tools/list": dispatchRequest("tools/list", paginatedParamsShape),
    "prompts/get": dispatchRequest("prompts/get", {
      name: string2(),
      arguments: record(string2(), string2()).optional()
    }),
    "prompts/list": dispatchRequest("prompts/list", paginatedParamsShape),
    "resources/list": dispatchRequest("resources/list", paginatedParamsShape),
    "resources/templates/list": dispatchRequest("resources/templates/list", paginatedParamsShape),
    "resources/read": dispatchRequest("resources/read", {
      uri: string2()
    }),
    "completion/complete": dispatchRequest("completion/complete", completeParamsShape),
    "server/discover": dispatchRequest("server/discover", {}),
    "subscriptions/listen": dispatchRequest("subscriptions/listen", subscriptionsListenParamsShape)
  };
  function liftedResult(shape) {
    return looseObject({
      _meta: wireMeta,
      ...shape
    });
  }
  const dispatchResultSchemas = {
    "tools/call": liftedResult({
      content: array(ContentBlockSchema$1),
      structuredContent: unknown().optional(),
      isError: boolean2().optional()
    }),
    "tools/list": liftedResult({
      ttlMs: number2().int().min(0),
      cacheScope: _enum2(["public", "private"]),
      tools: array(ToolSchema$1),
      nextCursor: CursorSchema$1.optional()
    }),
    "prompts/get": liftedResult({
      description: string2().optional(),
      messages: array(PromptMessageSchema$1)
    }),
    "prompts/list": liftedResult({
      ttlMs: number2().int().min(0),
      cacheScope: _enum2(["public", "private"]),
      prompts: array(PromptSchema$1),
      nextCursor: CursorSchema$1.optional()
    }),
    "resources/list": liftedResult({
      ttlMs: number2().int().min(0),
      cacheScope: _enum2(["public", "private"]),
      resources: array(ResourceSchema$1),
      nextCursor: CursorSchema$1.optional()
    }),
    "resources/templates/list": liftedResult({
      ttlMs: number2().int().min(0),
      cacheScope: _enum2(["public", "private"]),
      resourceTemplates: array(ResourceTemplateSchema$1),
      nextCursor: CursorSchema$1.optional()
    }),
    "resources/read": liftedResult({
      ttlMs: number2().int().min(0),
      cacheScope: _enum2(["public", "private"]),
      contents: array(union([TextResourceContentsSchema$1, BlobResourceContentsSchema$1]))
    }),
    "completion/complete": liftedResult({
      completion: object({
        values: array(string2()).max(100),
        total: number2().int().optional(),
        hasMore: boolean2().optional()
      }).loose()
    }),
    "server/discover": liftedResult({
      ttlMs: number2().int().min(0).catch(0),
      cacheScope: _enum2(["public", "private"]).catch("private"),
      supportedVersions: array(string2()),
      capabilities: ServerCapabilities2026Schema,
      instructions: string2().optional()
    }),
    "subscriptions/listen": liftedResult({})
  };
  const NotificationMetaSchema = looseObject({
    "io.modelcontextprotocol/subscriptionId": RequestIdSchema$1.optional()
  });
  const SubscriptionsAcknowledgedNotificationSchema$1 = object({
    method: literal("notifications/subscriptions/acknowledged"),
    params: object({
      _meta: NotificationMetaSchema.optional(),
      notifications: SubscriptionFilterSchema$1
    })
  });
  const CancelledNotificationParamsSchema$1 = object({
    _meta: NotificationMetaSchema.optional(),
    requestId: RequestIdSchema$1,
    reason: string2().optional()
  });
  const CancelledNotificationSchema$1 = object({
    method: literal("notifications/cancelled"),
    params: CancelledNotificationParamsSchema$1
  });
  const notificationSchemas2026 = {
    "notifications/cancelled": CancelledNotificationSchema$1,
    "notifications/progress": ProgressNotificationSchema$1,
    "notifications/message": LoggingMessageNotificationSchema$1,
    "notifications/resources/updated": ResourceUpdatedNotificationSchema$1,
    "notifications/resources/list_changed": ResourceListChangedNotificationSchema$1,
    "notifications/tools/list_changed": ToolListChangedNotificationSchema$1,
    "notifications/prompts/list_changed": PromptListChangedNotificationSchema$1,
    "notifications/subscriptions/acknowledged": SubscriptionsAcknowledgedNotificationSchema$1
  };
  const wireResultResponse = result => object({
    jsonrpc: literal("2.0"),
    id: union([string2(), number2().int()]),
    result
  }).strict();
  return {
    JSONValueSchema: JSONValueSchema$1,
    JSONObjectSchema: JSONObjectSchema$1,
    ProgressTokenSchema: ProgressTokenSchema$1,
    CursorSchema: CursorSchema$1,
    RequestIdSchema: RequestIdSchema$1,
    RoleSchema: RoleSchema$1,
    LoggingLevelSchema: LoggingLevelSchema$1,
    TaskMetadataSchema: TaskMetadataSchema$1,
    RelatedTaskMetadataSchema: RelatedTaskMetadataSchema$1,
    RequestMetaSchema: RequestMetaSchema$1,
    BaseRequestParamsSchema: BaseRequestParamsSchema$1,
    TaskAugmentedRequestParamsSchema: TaskAugmentedRequestParamsSchema$1,
    NotificationsParamsSchema: NotificationsParamsSchema$1,
    NotificationSchema: NotificationSchema$1,
    IconSchema: IconSchema$1,
    IconsSchema: IconsSchema$1,
    BaseMetadataSchema: BaseMetadataSchema$1,
    ImplementationSchema: ImplementationSchema$1,
    ClientTasksCapabilitySchema: ClientTasksCapabilitySchema$1,
    ServerTasksCapabilitySchema: ServerTasksCapabilitySchema$1,
    ClientCapabilitiesSchema: ClientCapabilitiesSchema$1,
    ServerCapabilitiesSchema: ServerCapabilitiesSchema$1,
    ProgressSchema: ProgressSchema$1,
    ProgressNotificationParamsSchema: ProgressNotificationParamsSchema$1,
    ProgressNotificationSchema: ProgressNotificationSchema$1,
    LoggingMessageNotificationParamsSchema: LoggingMessageNotificationParamsSchema$1,
    LoggingMessageNotificationSchema: LoggingMessageNotificationSchema$1,
    ResourceContentsSchema: ResourceContentsSchema$1,
    TextResourceContentsSchema: TextResourceContentsSchema$1,
    BlobResourceContentsSchema: BlobResourceContentsSchema$1,
    AnnotationsSchema: AnnotationsSchema$1,
    ResourceSchema: ResourceSchema$1,
    ResourceTemplateSchema: ResourceTemplateSchema$1,
    ResourceListChangedNotificationSchema: ResourceListChangedNotificationSchema$1,
    ResourceUpdatedNotificationParamsSchema: ResourceUpdatedNotificationParamsSchema$1,
    ResourceUpdatedNotificationSchema: ResourceUpdatedNotificationSchema$1,
    PromptArgumentSchema: PromptArgumentSchema$1,
    PromptSchema: PromptSchema$1,
    PromptListChangedNotificationSchema: PromptListChangedNotificationSchema$1,
    TextContentSchema: TextContentSchema$1,
    ImageContentSchema: ImageContentSchema$1,
    AudioContentSchema: AudioContentSchema$1,
    ToolUseContentSchema: ToolUseContentSchema$1,
    EmbeddedResourceSchema: EmbeddedResourceSchema$1,
    ResourceLinkSchema: ResourceLinkSchema$1,
    ContentBlockSchema: ContentBlockSchema$1,
    PromptMessageSchema: PromptMessageSchema$1,
    ToolAnnotationsSchema: ToolAnnotationsSchema$1,
    ToolListChangedNotificationSchema: ToolListChangedNotificationSchema$1,
    ModelHintSchema: ModelHintSchema$1,
    ModelPreferencesSchema: ModelPreferencesSchema$1,
    ToolChoiceSchema: ToolChoiceSchema$1,
    BooleanSchemaSchema: BooleanSchemaSchema$1,
    StringSchemaSchema: StringSchemaSchema$1,
    NumberSchemaSchema: NumberSchemaSchema$1,
    UntitledSingleSelectEnumSchemaSchema: UntitledSingleSelectEnumSchemaSchema$1,
    TitledSingleSelectEnumSchemaSchema: TitledSingleSelectEnumSchemaSchema$1,
    LegacyTitledEnumSchemaSchema: LegacyTitledEnumSchemaSchema$1,
    SingleSelectEnumSchemaSchema: SingleSelectEnumSchemaSchema$1,
    UntitledMultiSelectEnumSchemaSchema: UntitledMultiSelectEnumSchemaSchema$1,
    TitledMultiSelectEnumSchemaSchema: TitledMultiSelectEnumSchemaSchema$1,
    MultiSelectEnumSchemaSchema: MultiSelectEnumSchemaSchema$1,
    EnumSchemaSchema: EnumSchemaSchema$1,
    PrimitiveSchemaDefinitionSchema: PrimitiveSchemaDefinitionSchema$1,
    ElicitRequestFormParamsSchema: ElicitRequestFormParamsSchema$1,
    ResourceTemplateReferenceSchema: ResourceTemplateReferenceSchema$1,
    PromptReferenceSchema: PromptReferenceSchema$1,
    RootSchema: RootSchema$1,
    ClientCapabilities2026Schema,
    ServerCapabilities2026Schema,
    RequestMetaEnvelopeSchema,
    ToolSchema: ToolSchema$1,
    ToolResultContentSchema: ToolResultContentSchema$1,
    SamplingMessageContentBlockSchema: SamplingMessageContentBlockSchema$1,
    SamplingMessageSchema: SamplingMessageSchema$1,
    ResultTypeSchema,
    ResultMetaSchema,
    ResultSchema: ResultSchema$1,
    PaginatedResultSchema: PaginatedResultSchema$1,
    CallToolResultSchema: CallToolResultSchema$1,
    ListToolsResultSchema: ListToolsResultSchema$1,
    ListPromptsResultSchema: ListPromptsResultSchema$1,
    GetPromptResultSchema: GetPromptResultSchema$1,
    ListResourcesResultSchema: ListResourcesResultSchema$1,
    ListResourceTemplatesResultSchema: ListResourceTemplatesResultSchema$1,
    ReadResourceResultSchema: ReadResourceResultSchema$1,
    CompleteResultSchema: CompleteResultSchema$1,
    CacheableResultSchema,
    DiscoverResultSchema: DiscoverResultSchema$1,
    CreateMessageRequestParamsSchema: CreateMessageRequestParamsSchema$1,
    CreateMessageRequestSchema: CreateMessageRequestSchema$1,
    ListRootsRequestSchema: ListRootsRequestSchema$1,
    CreateMessageResultSchema: CreateMessageResultSchema$1,
    ListRootsResultSchema: ListRootsResultSchema$1,
    ElicitResultSchema: ElicitResultSchema$1,
    ElicitRequestURLParamsSchema: ElicitRequestURLParamsSchema$1,
    ElicitRequestParamsSchema: ElicitRequestParamsSchema$1,
    ElicitRequestSchema: ElicitRequestSchema$1,
    InputRequestSchema,
    InputResponseSchema,
    InputRequestsSchema,
    InputResponsesSchema,
    InputRequiredResultSchema,
    InputResponseRequestParamsSchema,
    CallToolRequestSchema: CallToolRequestSchema$1,
    ListToolsRequestSchema: ListToolsRequestSchema$1,
    ListPromptsRequestSchema: ListPromptsRequestSchema$1,
    GetPromptRequestSchema: GetPromptRequestSchema$1,
    ListResourcesRequestSchema: ListResourcesRequestSchema$1,
    ListResourceTemplatesRequestSchema: ListResourceTemplatesRequestSchema$1,
    ReadResourceRequestSchema: ReadResourceRequestSchema$1,
    CompleteRequestSchema: CompleteRequestSchema$1,
    DiscoverRequestSchema: DiscoverRequestSchema$1,
    SubscriptionFilterSchema: SubscriptionFilterSchema$1,
    SubscriptionsListenRequestSchema: SubscriptionsListenRequestSchema$1,
    SubscriptionsListenResultMetaSchema: SubscriptionsListenResultMetaSchema$1,
    SubscriptionsListenResultSchema: SubscriptionsListenResultSchema$1,
    dispatchRequestSchemas,
    dispatchResultSchemas,
    NotificationMetaSchema,
    SubscriptionsAcknowledgedNotificationSchema: SubscriptionsAcknowledgedNotificationSchema$1,
    CancelledNotificationParamsSchema: CancelledNotificationParamsSchema$1,
    CancelledNotificationSchema: CancelledNotificationSchema$1,
    notificationSchemas2026,
    JSONRPCResultResponseSchema: wireResultResponse(ResultSchema$1),
    CallToolResultResponseSchema: wireResultResponse(union([CallToolResultSchema$1, InputRequiredResultSchema])),
    ListToolsResultResponseSchema: wireResultResponse(ListToolsResultSchema$1),
    ListPromptsResultResponseSchema: wireResultResponse(ListPromptsResultSchema$1),
    GetPromptResultResponseSchema: wireResultResponse(union([GetPromptResultSchema$1, InputRequiredResultSchema])),
    ListResourcesResultResponseSchema: wireResultResponse(ListResourcesResultSchema$1),
    ListResourceTemplatesResultResponseSchema: wireResultResponse(ListResourceTemplatesResultSchema$1),
    ReadResourceResultResponseSchema: wireResultResponse(union([ReadResourceResultSchema$1, InputRequiredResultSchema])),
    CompleteResultResponseSchema: wireResultResponse(CompleteResultSchema$1),
    DiscoverResultResponseSchema: wireResultResponse(DiscoverResultSchema$1)
  };
}
var memo;
function buildSchemas2026() {
  return memo ??= build();
}
var CACHEABLE_RESULT_METHODS = ["tools/list", "prompts/list", "resources/list", "resources/templates/list", "resources/read", "server/discover"];
function isCacheableResultMethod(method) {
  return CACHEABLE_RESULT_METHODS.includes(method);
}
var RESULT_CACHE_HINT_FALLBACK = /* @__PURE__ */Symbol("modelcontextprotocol.resultCacheHintFallback");
function attachCacheHintFallback(result, hint) {
  if (hint === void 0) return result;
  const attached = result[RESULT_CACHE_HINT_FALLBACK];
  if (attached === void 0) return {
    ...result,
    [RESULT_CACHE_HINT_FALLBACK]: hint
  };
  const merged = {};
  const ttlMs = attached.ttlMs ?? hint.ttlMs;
  if (ttlMs !== void 0) merged.ttlMs = ttlMs;
  const cacheScope = attached.cacheScope ?? hint.cacheScope;
  if (cacheScope !== void 0) merged.cacheScope = cacheScope;
  return {
    ...result,
    [RESULT_CACHE_HINT_FALLBACK]: merged
  };
}
function cacheHintFallbackOf(result) {
  return result[RESULT_CACHE_HINT_FALLBACK];
}
function isValidCacheTtlMs(value) {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
function isValidCacheScope(value) {
  return value === "public" || value === "private";
}
function assertValidCacheHint(hint, context) {
  if (hint.ttlMs !== void 0 && !isValidCacheTtlMs(hint.ttlMs)) throw new RangeError(`Invalid cache hint for ${context}: ttlMs must be a non-negative safe integer (got ${String(hint.ttlMs)})`);
  if (hint.cacheScope !== void 0 && !isValidCacheScope(hint.cacheScope)) throw new RangeError(`Invalid cache hint for ${context}: cacheScope must be 'public' or 'private' (got ${String(hint.cacheScope)})`);
}
var ProtocolErrorCode = /* @__PURE__ */function (ProtocolErrorCode$1) {
  ProtocolErrorCode$1[ProtocolErrorCode$1["ParseError"] = -32700] = "ParseError";
  ProtocolErrorCode$1[ProtocolErrorCode$1["InvalidRequest"] = -32600] = "InvalidRequest";
  ProtocolErrorCode$1[ProtocolErrorCode$1["MethodNotFound"] = -32601] = "MethodNotFound";
  ProtocolErrorCode$1[ProtocolErrorCode$1["InvalidParams"] = -32602] = "InvalidParams";
  ProtocolErrorCode$1[ProtocolErrorCode$1["InternalError"] = -32603] = "InternalError";
  ProtocolErrorCode$1[ProtocolErrorCode$1["ResourceNotFound"] = -32002] = "ResourceNotFound";
  ProtocolErrorCode$1[ProtocolErrorCode$1["MissingRequiredClientCapability"] = -32021] = "MissingRequiredClientCapability";
  ProtocolErrorCode$1[ProtocolErrorCode$1["UnsupportedProtocolVersion"] = -32022] = "UnsupportedProtocolVersion";
  ProtocolErrorCode$1[ProtocolErrorCode$1["UrlElicitationRequired"] = -32042] = "UrlElicitationRequired";
  return ProtocolErrorCode$1;
}({});
var ProtocolError = class ProtocolError2 extends Error {
  static {
    Object.defineProperty(this, "mcpBrand", {
      value: "mcp.ProtocolError"
    });
  }
  static [Symbol.hasInstance](value) {
    return brandedHasInstance(this, value);
  }
  /**
  * Brand-based type guard: equivalent to `value instanceof this`, as an
  * explicit static predicate (the axios/AWS-SDK `isInstance` style). Reads
  * the caller's own brand via `this`, so every branded subclass gets a
  * correctly-scoped guard by inheritance. Must be invoked on the class —
  * in callback position write `v => SdkError.isInstance(v)`, not
  * `.filter(SdkError.isInstance)` (detached calls throw rather than
  * silently matching nothing).
  */
  static isInstance(value) {
    if (typeof this !== "function") throw new TypeError("isInstance must be called on the class (e.g. `SdkError.isInstance(value)`); for callbacks use `v => SdkError.isInstance(v)`");
    return brandedHasInstance(this, value);
  }
  constructor(code, message, data) {
    super(message);
    this.code = code;
    this.data = data;
    this.name = "ProtocolError";
    stampErrorBrands(this, new.target);
  }
  /**
  * Factory method to create the appropriate error type based on the error code and data
  */
  static fromError(code, message, data) {
    if (code === ProtocolErrorCode.UrlElicitationRequired && data) {
      const errorData = data;
      if (errorData.elicitations) return new UrlElicitationRequiredError(errorData.elicitations, message);
    }
    if (code === ProtocolErrorCode.UnsupportedProtocolVersion && data) {
      const errorData = data;
      if (Array.isArray(errorData.supported) && typeof errorData.requested === "string") return new UnsupportedProtocolVersionError({
        supported: errorData.supported,
        requested: errorData.requested
      }, message);
    }
    if (code === ProtocolErrorCode.InvalidParams || code === ProtocolErrorCode.ResourceNotFound) {
      const errorData = data;
      if (typeof errorData?.uri === "string" && (code === ProtocolErrorCode.ResourceNotFound || Object.keys(errorData).length === 1)) return new ResourceNotFoundError(errorData.uri, message);
    }
    if (code === ProtocolErrorCode.MissingRequiredClientCapability && data) {
      const errorData = data;
      if (errorData.requiredCapabilities !== null && typeof errorData.requiredCapabilities === "object" && !Array.isArray(errorData.requiredCapabilities)) return new MissingRequiredClientCapabilityError({
        requiredCapabilities: errorData.requiredCapabilities
      }, message);
    }
    return new ProtocolError2(code, message, data);
  }
};
var ResourceNotFoundError = class extends ProtocolError {
  static {
    Object.defineProperty(this, "mcpBrand", {
      value: "mcp.ResourceNotFoundError"
    });
  }
  constructor(uri, message = `Resource not found: ${uri}`) {
    super(ProtocolErrorCode.InvalidParams, message, {
      uri
    });
  }
  /** The URI that was requested and not found. */
  get uri() {
    return this.data.uri;
  }
};
var UrlElicitationRequiredError = class extends ProtocolError {
  static {
    Object.defineProperty(this, "mcpBrand", {
      value: "mcp.UrlElicitationRequiredError"
    });
  }
  constructor(elicitations, message = `URL elicitation${elicitations.length > 1 ? "s" : ""} required`) {
    super(ProtocolErrorCode.UrlElicitationRequired, message, {
      elicitations
    });
  }
  get elicitations() {
    return this.data?.elicitations ?? [];
  }
};
var UnsupportedProtocolVersionError = class extends ProtocolError {
  static {
    Object.defineProperty(this, "mcpBrand", {
      value: "mcp.UnsupportedProtocolVersionError"
    });
  }
  constructor(data, message = `Unsupported protocol version: ${data.requested}`) {
    super(ProtocolErrorCode.UnsupportedProtocolVersion, message, data);
  }
  /**
  * Protocol versions the receiver supports.
  */
  get supported() {
    return this.data.supported;
  }
  /**
  * The protocol version that was requested.
  */
  get requested() {
    return this.data.requested;
  }
};
var MissingRequiredClientCapabilityError = class extends ProtocolError {
  static {
    Object.defineProperty(this, "mcpBrand", {
      value: "mcp.MissingRequiredClientCapabilityError"
    });
  }
  constructor(data, message = `Missing required client capabilities: ${Object.keys(data.requiredCapabilities).join(", ")}`) {
    super(ProtocolErrorCode.MissingRequiredClientCapability, message, data);
  }
  /**
  * The capabilities the server requires from the client to process the
  * request (only the missing capabilities are listed).
  */
  get requiredCapabilities() {
    return this.data.requiredCapabilities;
  }
};
var DEFAULT_CACHE_TTL_MS = 0;
var DEFAULT_CACHE_SCOPE = "private";
var EXTENDED_RESULT_TYPE_METHODS = ["tools/call", "prompts/get", "resources/read"];
function stampResultType(method, result) {
  const provided = result["resultType"];
  if (provided === void 0) return {
    ...result,
    resultType: "complete"
  };
  if (provided === "complete") return result;
  if (EXTENDED_RESULT_TYPE_METHODS.includes(method)) return result;
  throw new ProtocolError(ProtocolErrorCode.InternalError, `Handler for ${method} returned resultType '${String(provided)}', but results of ${method} only support 'complete' on protocol revision 2026-07-28`);
}
function fillCacheFields(method, result) {
  const fallback = cacheHintFallbackOf(result);
  if (result["resultType"] !== "complete" || !isCacheableResultMethod(method)) return fallback === void 0 ? result : stripCacheHintFallback(result);
  const provided = result;
  const ttlMs = isValidCacheTtlMs(provided["ttlMs"]) ? provided["ttlMs"] : resolveTtlMs(fallback);
  const cacheScope = isValidCacheScope(provided["cacheScope"]) ? provided["cacheScope"] : resolveCacheScope(fallback);
  const filled = {
    ...provided,
    ttlMs,
    cacheScope
  };
  delete filled[RESULT_CACHE_HINT_FALLBACK];
  return filled;
}
function isPlainObject$5(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function stampServerInfoMeta(result, serverInfo) {
  if (serverInfo === void 0) return result;
  const meta3 = result["_meta"];
  if (meta3 === void 0) return {
    ...result,
    _meta: {
      [SERVER_INFO_META_KEY]: serverInfo
    }
  };
  if (!isPlainObject$5(meta3)) return result;
  if (meta3[SERVER_INFO_META_KEY] !== void 0) return result;
  return {
    ...result,
    _meta: {
      ...meta3,
      [SERVER_INFO_META_KEY]: serverInfo
    }
  };
}
function resolveTtlMs(fallback) {
  return fallback !== void 0 && isValidCacheTtlMs(fallback.ttlMs) ? fallback.ttlMs : DEFAULT_CACHE_TTL_MS;
}
function resolveCacheScope(fallback) {
  return fallback !== void 0 && isValidCacheScope(fallback.cacheScope) ? fallback.cacheScope : DEFAULT_CACHE_SCOPE;
}
function stripCacheHintFallback(result) {
  const copy = {
    ...result
  };
  delete copy[RESULT_CACHE_HINT_FALLBACK];
  return copy;
}
var INPUT_REQUEST_METHODS_2026 = ["elicitation/create", "sampling/createMessage", "roots/list"];
var maps;
function inputSchemaMaps() {
  if (maps) return maps;
  const s = buildSchemas2026();
  maps = {
    request: {
      "elicitation/create": object({
        method: literal("elicitation/create"),
        params: s.ElicitRequestParamsSchema
      }),
      "sampling/createMessage": object({
        method: literal("sampling/createMessage"),
        params: s.CreateMessageRequestParamsSchema
      }),
      "roots/list": object({
        method: literal("roots/list"),
        params: looseObject({}).optional()
      })
    },
    response: {
      "elicitation/create": s.ElicitResultSchema,
      "sampling/createMessage": s.CreateMessageResultSchema,
      "roots/list": s.ListRootsResultSchema
    }
  };
  return maps;
}
function isInputRequestMethod2026(method) {
  return INPUT_REQUEST_METHODS_2026.includes(method);
}
function getInputRequestSchema2026(method) {
  return isInputRequestMethod2026(method) ? inputSchemaMaps().request[method] : void 0;
}
function getInputResponseSchema2026(method) {
  return isInputRequestMethod2026(method) ? inputSchemaMaps().response[method] : void 0;
}
var requestMethodKeys = {
  "tools/call": null,
  "tools/list": null,
  "prompts/get": null,
  "prompts/list": null,
  "resources/list": null,
  "resources/templates/list": null,
  "resources/read": null,
  "completion/complete": null,
  "server/discover": null,
  "subscriptions/listen": null
};
var notificationMethodKeys = {
  "notifications/cancelled": null,
  "notifications/progress": null,
  "notifications/message": null,
  "notifications/resources/updated": null,
  "notifications/resources/list_changed": null,
  "notifications/tools/list_changed": null,
  "notifications/prompts/list_changed": null,
  "notifications/subscriptions/acknowledged": null
};
function hasRequestMethod2026(method) {
  return Object.prototype.hasOwnProperty.call(requestMethodKeys, method);
}
function hasNotificationMethod2026(method) {
  return Object.prototype.hasOwnProperty.call(notificationMethodKeys, method);
}
function hasResultMethod2026(method) {
  return Object.prototype.hasOwnProperty.call(requestMethodKeys, method);
}
function getRequestSchema2026(method) {
  return hasRequestMethod2026(method) ? buildSchemas2026().dispatchRequestSchemas[method] : void 0;
}
function getResultSchema2026(method) {
  return hasResultMethod2026(method) ? buildSchemas2026().dispatchResultSchemas[method] : void 0;
}
function getNotificationSchema2026(method) {
  return hasNotificationMethod2026(method) ? buildSchemas2026().notificationSchemas2026[method] : void 0;
}
var rev2026RequestMethods = Object.keys(requestMethodKeys);
var rev2026NotificationMethods = Object.keys(notificationMethodKeys);
function isPlainObject$4(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function triState(schema, raw) {
  if (schema === void 0) return {
    ok: false,
    reason: "not-in-era"
  };
  const parsed = schema.safeParse(raw);
  return parsed.success ? {
    ok: true,
    value: parsed.data
  } : {
    ok: false,
    reason: "invalid",
    message: String(parsed.error)
  };
}
var NOT_IN_ERA = {
  ok: false,
  reason: "not-in-era"
};
var REQUIRED_ENVELOPE_KEYS = [PROTOCOL_VERSION_META_KEY, CLIENT_CAPABILITIES_META_KEY];
function enforceDeletedFields(method, result) {
  let next = result;
  let copied = false;
  const copy = () => {
    if (!copied) {
      next = {
        ...next
      };
      copied = true;
    }
    return next;
  };
  const tools = result.tools;
  if (method === "tools/list" && Array.isArray(tools) && tools.some(tool => isPlainObject$4(tool) && "execution" in tool)) copy().tools = tools.map(tool => {
    if (!isPlainObject$4(tool) || !("execution" in tool)) return tool;
    const rest = {
      ...tool
    };
    delete rest["execution"];
    return rest;
  });
  const capabilities = result.capabilities;
  if (isPlainObject$4(capabilities) && "tasks" in capabilities) {
    const rest = {
      ...capabilities
    };
    delete rest["tasks"];
    copy().capabilities = rest;
  }
  return next;
}
var rev2026Codec = {
  era: "2026-07-28",
  hasRequestMethod: hasRequestMethod2026,
  hasNotificationMethod: hasNotificationMethod2026,
  hasInputRequestMethod: method => getInputRequestSchema2026(method) !== void 0,
  validateRequest: (method, raw) => triState(getRequestSchema2026(method), raw),
  validateResult: (method, raw) => triState(getResultSchema2026(method), raw),
  validateNotification: (method, raw) => triState(getNotificationSchema2026(method), raw),
  validateInputRequest: (method, raw) => triState(getInputRequestSchema2026(method), raw),
  validateInputResponse: (method, raw) => triState(getInputResponseSchema2026(method), raw),
  samplingResultVariant: () => NOT_IN_ERA,
  outboundEnvelope(material) {
    return {
      [PROTOCOL_VERSION_META_KEY]: material.protocolVersion,
      [CLIENT_INFO_META_KEY]: material.clientInfo,
      [CLIENT_CAPABILITIES_META_KEY]: material.clientCapabilities,
      ...(material.logLevel !== void 0 && {
        [LOG_LEVEL_META_KEY]: material.logLevel
      })
    };
  },
  validateEnvelopeMeta(meta3) {
    const issues = [];
    for (const key of REQUIRED_ENVELOPE_KEYS) if (!(key in meta3)) issues.push({
      key,
      problem: "missing"
    });
    const parsed = buildSchemas2026().RequestMetaEnvelopeSchema.safeParse(meta3);
    if (!parsed.success) for (const issue2 of parsed.error.issues) {
      const path7 = issue2.path.map(String);
      const key = path7.length > 0 ? path7.join(".") : "_meta";
      if (path7.length === 1 && issues.some(existing => existing.key === key && existing.problem === "missing")) continue;
      issues.push({
        key,
        problem: issue2.message
      });
    }
    return issues;
  },
  projectCallToolResult: result => appendTextFallbackForNonObject(result),
  inputRequestSchema: getInputRequestSchema2026,
  decodeResult(method, raw) {
    if (!isPlainObject$4(raw)) return {
      kind: "invalid",
      error: new SdkError(SdkErrorCode.InvalidResult, `Invalid result for ${method}: not an object`, {
        method
      })
    };
    const rawResultType = raw["resultType"];
    if (rawResultType === void 0) return {
      kind: "invalid",
      error: new SdkError(SdkErrorCode.InvalidResult, `Invalid result for ${method}: missing required resultType \u2014 servers implementing protocol revision 2026-07-28 MUST include it (the absent-means-complete bridge applies only to earlier-revision servers)`, {
        method,
        violation: "missing-resultType"
      })
    };
    if (typeof rawResultType !== "string") return {
      kind: "invalid",
      error: new SdkError(SdkErrorCode.InvalidResult, `Invalid result for ${method}: non-string resultType`, {
        method,
        resultType: rawResultType
      })
    };
    if (rawResultType === "input_required") {
      const rawInputRequests = raw["inputRequests"];
      const inputRequests = isPlainObject$4(rawInputRequests) ? rawInputRequests : {};
      const requestState = raw["requestState"];
      if (Object.keys(inputRequests).length === 0 && typeof requestState !== "string") return {
        kind: "invalid",
        error: new SdkError(SdkErrorCode.InvalidResult, `Invalid result for ${method}: input_required carries neither inputRequests nor requestState (every input_required result must include at least one of the two)`, {
          method,
          violation: "input-required-missing-both"
        })
      };
      return {
        kind: "input_required",
        inputRequests,
        ...(typeof requestState === "string" && {
          requestState
        })
      };
    }
    if (rawResultType !== "complete") return {
      kind: "invalid",
      error: new SdkError(SdkErrorCode.UnsupportedResultType, `Unsupported result type '${rawResultType}' for ${method}`, {
        resultType: rawResultType,
        method
      })
    };
    const wireResultSchemas = getWireResultSchemas();
    const wireSchema = Object.hasOwn(wireResultSchemas, method) ? wireResultSchemas[method] : void 0;
    if (wireSchema !== void 0) {
      const parsed = wireSchema.safeParse(raw);
      if (!parsed.success) return {
        kind: "invalid",
        error: new SdkError(SdkErrorCode.InvalidResult, `Invalid result for ${method}: ${parsed.error}`, {
          method
        })
      };
    }
    const lifted = {
      ...raw
    };
    delete lifted["resultType"];
    return {
      kind: "complete",
      result: lifted
    };
  },
  encodeResult(method, result, serverInfo) {
    return stampServerInfoMeta(fillCacheFields(method, stampResultType(method, enforceDeletedFields(method, result))), serverInfo);
  },
  encodeErrorCode: code => code === -32002 ? -32602 : code,
  checkInboundEnvelope(material) {
    if (material.envelope === void 0) return "Request is missing the required _meta envelope for protocol revision 2026-07-28 (io.modelcontextprotocol/protocolVersion, io.modelcontextprotocol/clientCapabilities)";
    const parsed = buildSchemas2026().RequestMetaEnvelopeSchema.safeParse(material.envelope);
    if (!parsed.success) return `Invalid _meta envelope for protocol revision 2026-07-28: ${parsed.error.issues.map(issue2 => issue2.message).join("; ")}`;
  }
};
var wireResultSchemasMemo;
function getWireResultSchemas() {
  if (wireResultSchemasMemo) return wireResultSchemasMemo;
  const s = buildSchemas2026();
  wireResultSchemasMemo = {
    "tools/call": s.CallToolResultSchema,
    "tools/list": s.ListToolsResultSchema,
    "prompts/get": s.GetPromptResultSchema,
    "prompts/list": s.ListPromptsResultSchema,
    "resources/list": s.ListResourcesResultSchema,
    "resources/templates/list": s.ListResourceTemplatesResultSchema,
    "resources/read": s.ReadResourceResultSchema,
    "completion/complete": s.CompleteResultSchema,
    "server/discover": s.DiscoverResultSchema
  };
  return wireResultSchemasMemo;
}
var MODERN_WIRE_REVISION = "2026-07-28";
function codecForVersion(version2) {
  return version2 !== void 0 && isModernProtocolVersion(version2) ? rev2026Codec : rev2025Codec;
}
function classifiedWireEra(classification) {
  if (classification.revision !== void 0) return codecForVersion(classification.revision).era;
  return classification.era === "modern" ? rev2026Codec.era : rev2025Codec.era;
}
function isSpecRequestMethod(method) {
  return ALL_CODECS.some(codec2 => codec2.hasRequestMethod(method));
}
function isSpecNotificationMethod(method) {
  return ALL_CODECS.some(codec2 => codec2.hasNotificationMethod(method));
}
var ALL_CODECS = [rev2025Codec, rev2026Codec];
var schemas_exports3 = /* @__PURE__ */__exportAll({
  AnnotationsSchema: () => AnnotationsSchema,
  AudioContentSchema: () => AudioContentSchema,
  BaseMetadataSchema: () => BaseMetadataSchema,
  BaseRequestParamsSchema: () => BaseRequestParamsSchema,
  BlobResourceContentsSchema: () => BlobResourceContentsSchema,
  BooleanSchemaSchema: () => BooleanSchemaSchema,
  CallToolRequestParamsSchema: () => CallToolRequestParamsSchema,
  CallToolRequestSchema: () => CallToolRequestSchema,
  CallToolResultSchema: () => CallToolResultSchema,
  CancelTaskRequestSchema: () => CancelTaskRequestSchema,
  CancelTaskResultSchema: () => CancelTaskResultSchema,
  CancelledNotificationParamsSchema: () => CancelledNotificationParamsSchema,
  CancelledNotificationSchema: () => CancelledNotificationSchema,
  ClientCapabilitiesSchema: () => ClientCapabilitiesSchema,
  ClientNotificationSchema: () => ClientNotificationSchema,
  ClientRequestSchema: () => ClientRequestSchema,
  ClientResultSchema: () => ClientResultSchema,
  ClientTasksCapabilitySchema: () => ClientTasksCapabilitySchema,
  CompatibilityCallToolResultSchema: () => CompatibilityCallToolResultSchema,
  CompleteRequestParamsSchema: () => CompleteRequestParamsSchema,
  CompleteRequestSchema: () => CompleteRequestSchema,
  CompleteResultSchema: () => CompleteResultSchema,
  ContentBlockSchema: () => ContentBlockSchema,
  CreateMessageRequestParamsSchema: () => CreateMessageRequestParamsSchema,
  CreateMessageRequestSchema: () => CreateMessageRequestSchema,
  CreateMessageResultSchema: () => CreateMessageResultSchema,
  CreateMessageResultWithToolsSchema: () => CreateMessageResultWithToolsSchema,
  CreateTaskResultSchema: () => CreateTaskResultSchema,
  CursorSchema: () => CursorSchema,
  DiscoverRequestSchema: () => DiscoverRequestSchema,
  DiscoverResultSchema: () => DiscoverResultSchema,
  ElicitRequestFormParamsSchema: () => ElicitRequestFormParamsSchema,
  ElicitRequestParamsSchema: () => ElicitRequestParamsSchema,
  ElicitRequestSchema: () => ElicitRequestSchema,
  ElicitRequestURLParamsSchema: () => ElicitRequestURLParamsSchema,
  ElicitResultSchema: () => ElicitResultSchema,
  ElicitationCompleteNotificationParamsSchema: () => ElicitationCompleteNotificationParamsSchema,
  ElicitationCompleteNotificationSchema: () => ElicitationCompleteNotificationSchema,
  EmbeddedResourceSchema: () => EmbeddedResourceSchema,
  EmptyResultSchema: () => EmptyResultSchema,
  EnumSchemaSchema: () => EnumSchemaSchema,
  GetPromptRequestParamsSchema: () => GetPromptRequestParamsSchema,
  GetPromptRequestSchema: () => GetPromptRequestSchema,
  GetPromptResultSchema: () => GetPromptResultSchema,
  GetTaskPayloadRequestSchema: () => GetTaskPayloadRequestSchema,
  GetTaskPayloadResultSchema: () => GetTaskPayloadResultSchema,
  GetTaskRequestSchema: () => GetTaskRequestSchema,
  GetTaskResultSchema: () => GetTaskResultSchema,
  IconSchema: () => IconSchema,
  IconsSchema: () => IconsSchema,
  ImageContentSchema: () => ImageContentSchema,
  ImplementationSchema: () => ImplementationSchema,
  InitializeRequestParamsSchema: () => InitializeRequestParamsSchema,
  InitializeRequestSchema: () => InitializeRequestSchema,
  InitializeResultSchema: () => InitializeResultSchema,
  InitializedNotificationSchema: () => InitializedNotificationSchema,
  JSONArraySchema: () => JSONArraySchema,
  JSONObjectSchema: () => JSONObjectSchema,
  JSONRPCErrorResponseSchema: () => JSONRPCErrorResponseSchema,
  JSONRPCMessageSchema: () => JSONRPCMessageSchema,
  JSONRPCNotificationSchema: () => JSONRPCNotificationSchema,
  JSONRPCRequestSchema: () => JSONRPCRequestSchema,
  JSONRPCResponseSchema: () => JSONRPCResponseSchema,
  JSONRPCResultResponseSchema: () => JSONRPCResultResponseSchema,
  JSONValueSchema: () => JSONValueSchema,
  LegacyTitledEnumSchemaSchema: () => LegacyTitledEnumSchemaSchema,
  ListChangedOptionsBaseSchema: () => ListChangedOptionsBaseSchema,
  ListPromptsRequestSchema: () => ListPromptsRequestSchema,
  ListPromptsResultSchema: () => ListPromptsResultSchema,
  ListResourceTemplatesRequestSchema: () => ListResourceTemplatesRequestSchema,
  ListResourceTemplatesResultSchema: () => ListResourceTemplatesResultSchema,
  ListResourcesRequestSchema: () => ListResourcesRequestSchema,
  ListResourcesResultSchema: () => ListResourcesResultSchema,
  ListRootsRequestSchema: () => ListRootsRequestSchema,
  ListRootsResultSchema: () => ListRootsResultSchema,
  ListTasksRequestSchema: () => ListTasksRequestSchema,
  ListTasksResultSchema: () => ListTasksResultSchema,
  ListToolsRequestSchema: () => ListToolsRequestSchema,
  ListToolsResultSchema: () => ListToolsResultSchema,
  LoggingLevelSchema: () => LoggingLevelSchema,
  LoggingMessageNotificationParamsSchema: () => LoggingMessageNotificationParamsSchema,
  LoggingMessageNotificationSchema: () => LoggingMessageNotificationSchema,
  ModelHintSchema: () => ModelHintSchema,
  ModelPreferencesSchema: () => ModelPreferencesSchema,
  MultiSelectEnumSchemaSchema: () => MultiSelectEnumSchemaSchema,
  NotificationSchema: () => NotificationSchema,
  NotificationsParamsSchema: () => NotificationsParamsSchema,
  NumberSchemaSchema: () => NumberSchemaSchema,
  PaginatedRequestParamsSchema: () => PaginatedRequestParamsSchema,
  PaginatedRequestSchema: () => PaginatedRequestSchema,
  PaginatedResultSchema: () => PaginatedResultSchema,
  PingRequestSchema: () => PingRequestSchema,
  PrimitiveSchemaDefinitionSchema: () => PrimitiveSchemaDefinitionSchema,
  ProgressNotificationParamsSchema: () => ProgressNotificationParamsSchema,
  ProgressNotificationSchema: () => ProgressNotificationSchema,
  ProgressSchema: () => ProgressSchema,
  ProgressTokenSchema: () => ProgressTokenSchema,
  PromptArgumentSchema: () => PromptArgumentSchema,
  PromptListChangedNotificationSchema: () => PromptListChangedNotificationSchema,
  PromptMessageSchema: () => PromptMessageSchema,
  PromptReferenceSchema: () => PromptReferenceSchema,
  PromptSchema: () => PromptSchema,
  ReadResourceRequestParamsSchema: () => ReadResourceRequestParamsSchema,
  ReadResourceRequestSchema: () => ReadResourceRequestSchema,
  ReadResourceResultSchema: () => ReadResourceResultSchema,
  RelatedTaskMetadataSchema: () => RelatedTaskMetadataSchema,
  RequestIdSchema: () => RequestIdSchema,
  RequestMetaSchema: () => RequestMetaSchema,
  RequestSchema: () => RequestSchema,
  ResourceContentsSchema: () => ResourceContentsSchema,
  ResourceLinkSchema: () => ResourceLinkSchema,
  ResourceListChangedNotificationSchema: () => ResourceListChangedNotificationSchema,
  ResourceRequestParamsSchema: () => ResourceRequestParamsSchema,
  ResourceSchema: () => ResourceSchema,
  ResourceTemplateReferenceSchema: () => ResourceTemplateReferenceSchema,
  ResourceTemplateSchema: () => ResourceTemplateSchema,
  ResourceUpdatedNotificationParamsSchema: () => ResourceUpdatedNotificationParamsSchema,
  ResourceUpdatedNotificationSchema: () => ResourceUpdatedNotificationSchema,
  ResultMetaObjectSchema: () => ResultMetaObjectSchema,
  ResultSchema: () => ResultSchema,
  RoleSchema: () => RoleSchema,
  RootSchema: () => RootSchema,
  RootsListChangedNotificationSchema: () => RootsListChangedNotificationSchema,
  SamplingContentSchema: () => SamplingContentSchema,
  SamplingMessageContentBlockSchema: () => SamplingMessageContentBlockSchema,
  SamplingMessageSchema: () => SamplingMessageSchema,
  ServerCapabilitiesSchema: () => ServerCapabilitiesSchema,
  ServerNotificationSchema: () => ServerNotificationSchema,
  ServerRequestSchema: () => ServerRequestSchema,
  ServerResultSchema: () => ServerResultSchema,
  ServerTasksCapabilitySchema: () => ServerTasksCapabilitySchema,
  SetLevelRequestParamsSchema: () => SetLevelRequestParamsSchema,
  SetLevelRequestSchema: () => SetLevelRequestSchema,
  SingleSelectEnumSchemaSchema: () => SingleSelectEnumSchemaSchema,
  StringSchemaSchema: () => StringSchemaSchema,
  SubscribeRequestParamsSchema: () => SubscribeRequestParamsSchema,
  SubscribeRequestSchema: () => SubscribeRequestSchema,
  SubscriptionFilterSchema: () => SubscriptionFilterSchema,
  SubscriptionsAcknowledgedNotificationParamsSchema: () => SubscriptionsAcknowledgedNotificationParamsSchema,
  SubscriptionsAcknowledgedNotificationSchema: () => SubscriptionsAcknowledgedNotificationSchema,
  SubscriptionsListenRequestParamsSchema: () => SubscriptionsListenRequestParamsSchema,
  SubscriptionsListenRequestSchema: () => SubscriptionsListenRequestSchema,
  SubscriptionsListenResultMetaSchema: () => SubscriptionsListenResultMetaSchema,
  SubscriptionsListenResultSchema: () => SubscriptionsListenResultSchema,
  TaskAugmentedRequestParamsSchema: () => TaskAugmentedRequestParamsSchema,
  TaskCreationParamsSchema: () => TaskCreationParamsSchema,
  TaskMetadataSchema: () => TaskMetadataSchema,
  TaskSchema: () => TaskSchema,
  TaskStatusNotificationParamsSchema: () => TaskStatusNotificationParamsSchema,
  TaskStatusNotificationSchema: () => TaskStatusNotificationSchema,
  TaskStatusSchema: () => TaskStatusSchema,
  TextContentSchema: () => TextContentSchema,
  TextResourceContentsSchema: () => TextResourceContentsSchema,
  TitledMultiSelectEnumSchemaSchema: () => TitledMultiSelectEnumSchemaSchema,
  TitledSingleSelectEnumSchemaSchema: () => TitledSingleSelectEnumSchemaSchema,
  ToolAnnotationsSchema: () => ToolAnnotationsSchema,
  ToolChoiceSchema: () => ToolChoiceSchema,
  ToolExecutionSchema: () => ToolExecutionSchema,
  ToolListChangedNotificationSchema: () => ToolListChangedNotificationSchema,
  ToolResultContentSchema: () => ToolResultContentSchema,
  ToolSchema: () => ToolSchema,
  ToolUseContentSchema: () => ToolUseContentSchema,
  UnsubscribeRequestParamsSchema: () => UnsubscribeRequestParamsSchema,
  UnsubscribeRequestSchema: () => UnsubscribeRequestSchema,
  UntitledMultiSelectEnumSchemaSchema: () => UntitledMultiSelectEnumSchemaSchema,
  UntitledSingleSelectEnumSchemaSchema: () => UntitledSingleSelectEnumSchemaSchema
});
var isJSONRPCRequest = value => JSONRPCRequestSchema.safeParse(value).success;
var isJSONRPCNotification = value => JSONRPCNotificationSchema.safeParse(value).success;
var isJSONRPCResultResponse = value => JSONRPCResultResponseSchema.safeParse(value).success;
var isJSONRPCErrorResponse = value => JSONRPCErrorResponseSchema.safeParse(value).success;
var isInputRequiredResult = value => typeof value === "object" && value !== null && !Array.isArray(value) && value.resultType === "input_required";
function assertCompleteRequestPrompt(request) {
  if (request.params.ref.type !== "ref/prompt") throw new TypeError(`Expected CompleteRequestPrompt, but got ${request.params.ref.type}`);
}
function assertCompleteRequestResourceTemplate(request) {
  if (request.params.ref.type !== "ref/resource") throw new TypeError(`Expected CompleteRequestResourceTemplate, but got ${request.params.ref.type}`);
}
var X_MCP_HEADER_KEY = "x-mcp-header";
var RFC9110_TOKEN = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
var PERMITTED_X_MCP_HEADER_TYPES = /* @__PURE__ */new Set(["string", "integer", "boolean", "number"]);
function scanXMcpHeaderDeclarations(inputSchema) {
  const declarations = [];
  const seenLower = /* @__PURE__ */new Map();
  const visit = (node, path7, reachable) => {
    if (node === null || typeof node !== "object") return void 0;
    const schema = node;
    if (X_MCP_HEADER_KEY in schema) {
      if (!reachable || path7.length === 0) return `${pathName(path7)}: x-mcp-header is only permitted on properties statically reachable via a chain of 'properties' keys (not under items, additionalProperties, oneOf/anyOf/allOf/not, if/then/else, or $ref)`;
      const raw = schema[X_MCP_HEADER_KEY];
      if (typeof raw !== "string" || raw.length === 0) return `${pathName(path7)}: x-mcp-header MUST be a non-empty string`;
      if (!RFC9110_TOKEN.test(raw)) return `${pathName(path7)}: x-mcp-header '${raw}' is not a valid RFC 9110 token (no spaces, control characters or HTTP delimiters)`;
      const type = typeof schema.type === "string" ? schema.type : void 0;
      if (type === void 0 || !PERMITTED_X_MCP_HEADER_TYPES.has(type)) return `${pathName(path7)}: x-mcp-header is only permitted on primitive-typed properties (string, integer, boolean); got ${type ?? "<none>"}`;
      const lower = raw.toLowerCase();
      const prior = seenLower.get(lower);
      if (prior !== void 0) return `x-mcp-header '${raw}' is not case-insensitively unique (also declared as '${prior}')`;
      seenLower.set(lower, raw);
      declarations.push({
        path: path7,
        headerName: raw,
        type
      });
    }
    const properties = schema.properties;
    if (properties !== null && typeof properties === "object") for (const [key, child] of Object.entries(properties)) {
      const fault$1 = visit(child, [...path7, key], reachable);
      if (fault$1 !== void 0) return fault$1;
    }
    for (const k of NON_REACHABLE_SUBSCHEMA_KEYWORDS) {
      const sub = schema[k];
      if (sub === void 0) continue;
      const branches = Array.isArray(sub) ? sub : sub !== null && typeof sub === "object" && OBJECT_VALUED_SUBSCHEMA_KEYWORDS.has(k) ? Object.values(sub) : [sub];
      for (const branch of branches) {
        const fault$1 = visit(branch, [...path7, `<${k}>`], false);
        if (fault$1 !== void 0) return fault$1;
      }
    }
  };
  const fault = visit(inputSchema, [], true);
  return fault === void 0 ? {
    valid: true,
    declarations
  } : {
    valid: false,
    reason: fault
  };
}
var NON_REACHABLE_SUBSCHEMA_KEYWORDS = ["items", "prefixItems", "contains", "additionalProperties", "unevaluatedProperties", "unevaluatedItems", "propertyNames", "patternProperties", "dependentSchemas", "oneOf", "anyOf", "allOf", "not", "if", "then", "else", "$defs", "definitions"];
var OBJECT_VALUED_SUBSCHEMA_KEYWORDS = /* @__PURE__ */new Set(["patternProperties", "dependentSchemas", "$defs", "definitions"]);
function pathName(path7) {
  return path7.length === 0 ? "<root>" : path7.join(".");
}
var HEADER_MISMATCH_ERROR_CODE = -32020;
var INBOUND_VALIDATION_LADDER = [{
  rung: "http-method",
  order: 1,
  evaluatedAt: "edge",
  codes: [-32e3],
  conformance: [],
  rationale: "The modern era is POST-only; GET/DELETE are body-less 2025-era session operations and are method-routed to legacy serving (405 when legacy serving is not configured), before any body is read."
}, {
  rung: "jsonrpc-shape",
  order: 2,
  evaluatedAt: "edge",
  codes: [ProtocolErrorCode.InvalidRequest],
  conformance: ["server-stateless"],
  rationale: "The body must be a JSON-RPC request or notification: posted responses and batch arrays containing a modern or invalid element are rejected before classification (element-wise batch rule); all-legacy arrays stay legacy traffic."
}, {
  rung: "era-classification",
  order: 3,
  evaluatedAt: "edge",
  codes: [HEADER_MISMATCH_ERROR_CODE, ProtocolErrorCode.UnsupportedProtocolVersion],
  conformance: ["server-stateless", "http-header-validation", "http-custom-header-server-validation"],
  rationale: "Body-primary era classification with the protocol-version header as a cross-check; a header/body disagreement is rejected with -32020 (HeaderMismatch), and an envelope-less request on a modern-only endpoint is answered with the unsupported-protocol-version error naming the supported revisions."
}, {
  rung: "envelope",
  order: 4,
  evaluatedAt: "edge",
  codes: [ProtocolErrorCode.InvalidParams],
  conformance: ["server-stateless"],
  rationale: "A present envelope claim with a malformed envelope \u2014 and a missing envelope on a request whose protocol-version header names a modern revision \u2014 is an invalid-params rejection naming the offending or missing key(s); never a silent fall back to legacy handling. This is the only place an invalid-params rejection maps to HTTP 400."
}, {
  rung: "method-registry",
  order: 5,
  evaluatedAt: "dispatch",
  codes: [ProtocolErrorCode.MethodNotFound],
  conformance: ["server-stateless"],
  rationale: "Method existence outranks parameter validity: a method absent from the negotiated revision\u2019s registry (or with no handler installed) answers method-not-found before params or capabilities are looked at."
}, {
  rung: "request-params",
  order: 6,
  evaluatedAt: "dispatch",
  codes: [ProtocolErrorCode.InvalidParams],
  conformance: [],
  rationale: "Per-method params validation; emitted in-band by the dispatch layer (HTTP 200), never via the ladder status table."
}, {
  rung: "standard-header-validation",
  order: 7,
  evaluatedAt: "pre-dispatch",
  codes: [HEADER_MISMATCH_ERROR_CODE],
  conformance: ["http-header-validation"],
  rationale: "SEP-2243 standard `Mcp-Method` / `Mcp-Name` headers \u2014 presence, sentinel decoding, and `Mcp-Name` \u2194 body cross-check \u2014 are validated by the HTTP entry on a modern-classified request after the supported-revision gate and before dispatch. The classifier\u2019s own header-mismatch cells (protocol-version, `Mcp-Method` mismatch) stay on the edge `era-classification` rung; this rung carries the entry-layer presence/`Mcp-Name` half. Evaluated before the capability gate, the factory call, and the `Mcp-Param-*` rung so a request that fails several rungs is answered by the standard-header rung first. The documented order (after method-registry 5 and request-params 6) is NOT the observed precedence: serveModern evaluates this rung immediately after the supported-revision gate, so a request that also fails a dispatch rung is answered here before the dispatch rungs (5\u20136) are consulted."
}, {
  rung: "client-capabilities",
  order: 8,
  evaluatedAt: "pre-dispatch",
  codes: [ProtocolErrorCode.MissingRequiredClientCapability],
  conformance: ["server-stateless"],
  rationale: "The capability requirement is checked by the HTTP entry, pre-dispatch, against the validated envelope the classifier produced \u2014 pinning the spec-mandated HTTP 400 independently of how dispatch- and handler-produced errors are mapped. The documented order (after method resolution and params validation) is preserved observably only while the requirement table is empty: once a served method gains a requirement entry, a request that is missing the capability and would also fail a dispatch rung is answered by this gate first, so the entry must consult the method registry before the gate if the documented precedence is to stay observable."
}, {
  rung: "param-header-validation",
  order: 9,
  evaluatedAt: "pre-dispatch",
  codes: [HEADER_MISMATCH_ERROR_CODE],
  conformance: ["http-custom-header-server-validation"],
  rationale: "SEP-2243 `Mcp-Param-*` headers are validated against the named tool\u2019s `x-mcp-header` declarations and the body `arguments` after the tool registry is known and before dispatch reaches the handler; a missing/disagreeing/malformed header is rejected 400 / -32020 with the same shape as the standard-header cross-checks. The documented order (after method resolution and params validation) is preserved observably only when the body `arguments` would otherwise validate: the check runs pre-dispatch, so a `tools/call` that fails BOTH this rung and a dispatch-time rung (e.g. order-6 `request-params`, -32602) is answered by this gate first with 400 / -32020, not by the earlier-ordered rung."
}];
var LADDER_ERROR_HTTP_STATUS = {
  [ProtocolErrorCode.ParseError]: 400,
  [ProtocolErrorCode.InvalidRequest]: 400,
  [ProtocolErrorCode.MethodNotFound]: 404,
  [ProtocolErrorCode.UnsupportedProtocolVersion]: 400,
  [ProtocolErrorCode.MissingRequiredClientCapability]: 400,
  [HEADER_MISMATCH_ERROR_CODE]: 400
};
function parseSchema(schema, data) {
  return safeParse2(schema, data);
}
function shapeKeys(schemas) {
  return new Set(schemas.flatMap(schema => Object.keys(schema.shape)));
}
function isStandardSchema(schema) {
  if (schema == null) return false;
  const schemaType = typeof schema;
  if (schemaType !== "object" && schemaType !== "function") return false;
  if (!("~standard" in schema)) return false;
  return typeof schema["~standard"]?.validate === "function";
}
var warnedZodFallback = false;
var JSON_SCHEMA_CONVERSION_TARGET = "draft-2020-12";
function standardSchemaToJsonSchema(schema, io = "input") {
  const std = schema["~standard"];
  let result;
  if (std.jsonSchema) result = std.jsonSchema[io]({
    target: JSON_SCHEMA_CONVERSION_TARGET
  });else if (std.vendor === "zod") {
    if (!("_zod" in schema)) throw new Error("Schema appears to be from zod 3, which the SDK cannot convert to JSON Schema. Upgrade to zod >=4.2.0, or wrap your JSON Schema with fromJsonSchema().");
    if (!warnedZodFallback) {
      warnedZodFallback = true;
      console.warn("[mcp-sdk] Your zod version does not implement `~standard.jsonSchema` (added in zod 4.2.0). Falling back to z.toJSONSchema(). Upgrade to zod >=4.2.0 to silence this warning.");
    }
    result = toJSONSchema(schema, {
      target: JSON_SCHEMA_CONVERSION_TARGET,
      io
    });
  } else throw new Error(`Schema library "${std.vendor}" does not implement StandardJSONSchemaV1 (\`~standard.jsonSchema\`). Upgrade to a version that does, or wrap your JSON Schema with fromJsonSchema().`);
  if (io === "output") {
    if (result.type !== void 0) return result;
    return isProvablyObjectShapedRoot(result) ? {
      type: "object",
      ...result
    } : result;
  }
  if (result.type !== void 0 && result.type !== "object") throw new Error(`MCP tool and prompt schemas must describe objects (got type: ${JSON.stringify(result.type)}). Wrap your schema in z.object({...}) or equivalent.`);
  return {
    type: "object",
    ...result
  };
}
function isProvablyObjectShapedRoot(schema) {
  if ("properties" in schema || "patternProperties" in schema || "additionalProperties" in schema || "required" in schema) return true;
  for (const key of ["oneOf", "anyOf", "allOf"]) {
    const members = schema[key];
    if (Array.isArray(members) && members.length > 0) return members.every(m => m !== null && typeof m === "object" && (m.type === "object" || isProvablyObjectShapedRoot(m)));
  }
  return false;
}
function formatIssue(issue2) {
  if (!issue2.path?.length) return issue2.message;
  return `${issue2.path.map(p => String(typeof p === "object" ? p.key : p)).join(".")}: ${issue2.message}`;
}
async function validateStandardSchema(schema, data) {
  const result = await schema["~standard"].validate(data);
  if (result.issues && result.issues.length > 0) return {
    success: false,
    error: result.issues.map(i => formatIssue(i)).join(", ")
  };
  return {
    success: true,
    data: result.value
  };
}
function zodEmittedPattern(schema) {
  const jsonSchema = toJSONSchema(schema, {
    target: JSON_SCHEMA_CONVERSION_TARGET,
    io: "input"
  });
  return typeof jsonSchema.pattern === "string" ? jsonSchema.pattern : void 0;
}
var DATETIME_FRACTION_DIGITS = /\\\.\\d\{(\d+)\}/;
function datetimeReferenceSchemas(pattern) {
  const fractionDigits = DATETIME_FRACTION_DIGITS.exec(pattern);
  const precisions = [void 0, -1, 0];
  if (fractionDigits) precisions.push(Number(fractionDigits[1]));
  return [false, true].flatMap(local => [false, true].flatMap(offset => precisions.map(precision => iso_exports.datetime({
    local,
    offset,
    precision
  }))));
}
function referencePatternsForFormat(format, pattern) {
  let referenceSchemas;
  switch (format) {
    case "email":
      referenceSchemas = [email2()];
      break;
    case "uri":
      referenceSchemas = [url()];
      break;
    case "date":
      referenceSchemas = [iso_exports.date()];
      break;
    case "date-time":
      referenceSchemas = datetimeReferenceSchemas(pattern);
      break;
  }
  return new Set(referenceSchemas.map(schema => zodEmittedPattern(schema)).filter(emitted => emitted !== void 0));
}
function isLibraryFormatPattern(format, pattern, vendor) {
  if (vendor !== "zod") return true;
  return referencePatternsForFormat(format, pattern).has(pattern);
}
function promptArgumentsFromStandardSchema(schema) {
  const jsonSchema = standardSchemaToJsonSchema(schema, "input");
  const properties = jsonSchema.properties || {};
  const required2 = jsonSchema.required || [];
  return Object.entries(properties).map(([name, prop]) => ({
    name,
    description: prop?.description,
    required: required2.includes(name)
  }));
}
function isJsonObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function convertStandardElicitationSchema(schema) {
  try {
    return standardSchemaToJsonSchema(schema, "input");
  } catch (error51) {
    const detail = error51 instanceof Error ? error51.message : String(error51);
    throw new ProtocolError(ProtocolErrorCode.InvalidParams, `Elicitation requestedSchema must describe an object with flat primitive properties: ${detail}`);
  }
}
var ANNOTATION_ONLY_JSON_SCHEMA_KEYWORDS = /* @__PURE__ */new Set(["$comment", "deprecated", "description", "examples", "readOnly", "title", "writeOnly"]);
function isAnnotationOnlyJsonSchemaKeyword(key) {
  return ANNOTATION_ONLY_JSON_SCHEMA_KEYWORDS.has(key) || key.startsWith("x-");
}
var ROOT_KEYS = /* @__PURE__ */new Set(["$schema", ...Object.keys(ElicitRequestFormParamsSchema.shape.requestedSchema.shape)]);
var PROPERTY_KEYS_BY_TYPE = {
  string: shapeKeys([StringSchemaSchema, UntitledSingleSelectEnumSchemaSchema, TitledSingleSelectEnumSchemaSchema, LegacyTitledEnumSchemaSchema]),
  number: shapeKeys([NumberSchemaSchema]),
  integer: shapeKeys([NumberSchemaSchema]),
  boolean: shapeKeys([BooleanSchemaSchema]),
  array: shapeKeys([UntitledMultiSelectEnumSchemaSchema, TitledMultiSelectEnumSchemaSchema])
};
var SUPPORTED_STRING_FORMATS = new Set(StringSchemaSchema.shape.format.unwrap().options);
function walkProperty(node, path7, vendor, unsupported) {
  if (!isJsonObject(node)) return node;
  const allowedKeys = typeof node.type === "string" && Object.hasOwn(PROPERTY_KEYS_BY_TYPE, node.type) ? PROPERTY_KEYS_BY_TYPE[node.type] : void 0;
  if (allowedKeys === void 0) return node;
  const pruned = {};
  for (const [key, value] of Object.entries(node)) if (allowedKeys.has(key) || isAnnotationOnlyJsonSchemaKeyword(key)) pruned[key] = value;else if (key === "pattern" && node.type === "string" && typeof node.format === "string") {
    if (!SUPPORTED_STRING_FORMATS.has(node.format)) pruned[key] = value;else if (typeof value !== "string" || !isLibraryFormatPattern(node.format, value, vendor)) unsupported.push(`${path7}.${key}`);
  } else unsupported.push(`${path7}.${key}`);
  return pruned;
}
function walkRequestedSchema(converted, vendor) {
  const pruned = {};
  const unsupported = [];
  for (const [key, value] of Object.entries(converted)) if (key === "properties" && isJsonObject(value)) pruned[key] = Object.fromEntries(Object.entries(value).map(([name, node]) => [name, walkProperty(node, `properties.${name}`, vendor, unsupported)]));else if (ROOT_KEYS.has(key)) pruned[key] = value;else if (!isAnnotationOnlyJsonSchemaKeyword(key)) unsupported.push(key);
  if (unsupported.length > 0) throw new ProtocolError(ProtocolErrorCode.InvalidParams, `Elicitation requestedSchema contains unsupported JSON Schema constraint(s) after Standard Schema conversion: ${unsupported.join(", ")}`);
  return pruned;
}
function describeUnsupportedProperties(pruned, fallback) {
  if (!isJsonObject(pruned.properties)) return fallback;
  const offenders = Object.entries(pruned.properties).filter(([, node]) => !parseSchema(PrimitiveSchemaDefinitionSchema, node).success).map(([name]) => `properties.${name}`);
  return offenders.length > 0 ? offenders.join(", ") : fallback;
}
function findDroppedConstraintPaths(original, parsed, path7 = "") {
  if (Array.isArray(original) && Array.isArray(parsed)) return original.flatMap((item, index) => findDroppedConstraintPaths(item, parsed[index], `${path7}[${index}]`));
  if (!isJsonObject(original) || !isJsonObject(parsed)) return [];
  return Object.entries(original).flatMap(([key, value]) => {
    const childPath = path7 ? `${path7}.${key}` : key;
    if (!Object.prototype.hasOwnProperty.call(parsed, key)) return isAnnotationOnlyJsonSchemaKeyword(key) ? [] : [childPath];
    return findDroppedConstraintPaths(value, parsed[key], childPath);
  });
}
function normalizeElicitInputParams(input) {
  if (!isStandardSchema(input.requestedSchema)) return {
    ...input,
    mode: "form",
    requestedSchema: input.requestedSchema
  };
  const vendor = input.requestedSchema["~standard"].vendor;
  const pruned = walkRequestedSchema(convertStandardElicitationSchema(input.requestedSchema), vendor);
  const parsed = parseSchema(ElicitRequestFormParamsSchema.shape.requestedSchema, pruned);
  if (!parsed.success) throw new ProtocolError(ProtocolErrorCode.InvalidParams, `Elicitation requestedSchema only supports flat primitive properties (string, number, integer, boolean, and string enums): ${describeUnsupportedProperties(pruned, parsed.error.message)}`);
  const droppedConstraints = findDroppedConstraintPaths(pruned, parsed.data);
  if (droppedConstraints.length > 0) throw new ProtocolError(ProtocolErrorCode.InvalidParams, `Elicitation requestedSchema contains unsupported JSON Schema constraint(s) after Standard Schema conversion: ${droppedConstraints.join(", ")}`);
  const danglingRequired = (parsed.data.required ?? []).filter(key => !Object.prototype.hasOwnProperty.call(parsed.data.properties, key));
  if (danglingRequired.length > 0) throw new ProtocolError(ProtocolErrorCode.InvalidParams, `Elicitation requestedSchema lists required properties that are not defined in properties: ${danglingRequired.join(", ")}`);
  return {
    ...input,
    mode: "form",
    requestedSchema: parsed.data
  };
}
function buildInputRequired(spec) {
  const hasInputRequests = spec.inputRequests !== void 0 && Object.keys(spec.inputRequests).length > 0;
  const hasRequestState = typeof spec.requestState === "string";
  if (!hasInputRequests && !hasRequestState) throw new TypeError("inputRequired() requires at least one of inputRequests (with at least one entry) or requestState (spec: every InputRequiredResult MUST include at least one of the two)");
  return {
    resultType: "input_required",
    ...(spec.inputRequests !== void 0 && {
      inputRequests: spec.inputRequests
    }),
    ...(spec.requestState !== void 0 && {
      requestState: spec.requestState
    })
  };
}
var inputRequired = Object.assign(buildInputRequired, {
  elicit(params) {
    try {
      return {
        method: "elicitation/create",
        params: normalizeElicitInputParams(params)
      };
    } catch (error51) {
      throw error51 instanceof ProtocolError ? new TypeError(error51.message, {
        cause: error51
      }) : error51;
    }
  },
  elicitUrl(params) {
    return {
      method: "elicitation/create",
      params: {
        ...params,
        mode: "url"
      }
    };
  },
  createMessage(params) {
    return {
      method: "sampling/createMessage",
      params
    };
  },
  listRoots() {
    return {
      method: "roots/list"
    };
  }
});
var REQUEST_STATE_ONLY_LEG_PACING_MS = 250;
function inputRequiredRoundsExceededMessage(method, maxRounds) {
  return `Multi-round-trip request '${method}' still required input after ${maxRounds} rounds (inputRequired.maxRounds)`;
}
function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason instanceof SdkError ? signal.reason : new SdkError(SdkErrorCode.RequestTimeout, String(signal.reason)));
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(signal?.reason instanceof SdkError ? signal.reason : new SdkError(SdkErrorCode.RequestTimeout, String(signal?.reason)));
    };
    signal?.addEventListener("abort", onAbort, {
      once: true
    });
  });
}
function linkedRoundAbort(outer) {
  const controller = new AbortController();
  const onOuterAbort = () => controller.abort(outer?.reason);
  outer?.addEventListener("abort", onOuterAbort, {
    once: true
  });
  if (outer?.aborted) controller.abort(outer.reason);
  return {
    signal: controller.signal,
    abort: reason => controller.abort(reason),
    dispose: () => outer?.removeEventListener("abort", onOuterAbort)
  };
}
var SPEC_SCHEMA_KEYS = ["AnnotationsSchema", "AudioContentSchema", "BaseMetadataSchema", "BlobResourceContentsSchema", "BooleanSchemaSchema", "CallToolRequestSchema", "CallToolRequestParamsSchema", "CallToolResultSchema", "CancelledNotificationSchema", "CancelledNotificationParamsSchema", "CancelTaskRequestSchema", "CancelTaskResultSchema", "ClientCapabilitiesSchema", "ClientNotificationSchema", "ClientRequestSchema", "ClientResultSchema", "CompatibilityCallToolResultSchema", "CompleteRequestSchema", "CompleteRequestParamsSchema", "CompleteResultSchema", "ContentBlockSchema", "CreateMessageRequestSchema", "CreateMessageRequestParamsSchema", "CreateMessageResultSchema", "CreateMessageResultWithToolsSchema", "CreateTaskResultSchema", "CursorSchema", "DiscoverRequestSchema", "DiscoverResultSchema", "ElicitationCompleteNotificationSchema", "ElicitationCompleteNotificationParamsSchema", "ElicitRequestSchema", "ElicitRequestFormParamsSchema", "ElicitRequestParamsSchema", "ElicitRequestURLParamsSchema", "ElicitResultSchema", "EmbeddedResourceSchema", "EmptyResultSchema", "EnumSchemaSchema", "GetPromptRequestSchema", "GetPromptRequestParamsSchema", "GetPromptResultSchema", "GetTaskPayloadRequestSchema", "GetTaskPayloadResultSchema", "GetTaskRequestSchema", "GetTaskResultSchema", "IconSchema", "IconsSchema", "ImageContentSchema", "ImplementationSchema", "InitializedNotificationSchema", "InitializeRequestSchema", "InitializeRequestParamsSchema", "InitializeResultSchema", "JSONArraySchema", "JSONObjectSchema", "JSONRPCErrorResponseSchema", "JSONRPCMessageSchema", "JSONRPCNotificationSchema", "JSONRPCRequestSchema", "JSONRPCResponseSchema", "JSONRPCResultResponseSchema", "JSONValueSchema", "LegacyTitledEnumSchemaSchema", "ListPromptsRequestSchema", "ListPromptsResultSchema", "ListResourcesRequestSchema", "ListResourcesResultSchema", "ListResourceTemplatesRequestSchema", "ListResourceTemplatesResultSchema", "ListRootsRequestSchema", "ListRootsResultSchema", "ListTasksRequestSchema", "ListTasksResultSchema", "ListToolsRequestSchema", "ListToolsResultSchema", "LoggingLevelSchema", "LoggingMessageNotificationSchema", "LoggingMessageNotificationParamsSchema", "ModelHintSchema", "ModelPreferencesSchema", "MultiSelectEnumSchemaSchema", "NotificationSchema", "NumberSchemaSchema", "PaginatedRequestSchema", "PaginatedRequestParamsSchema", "PaginatedResultSchema", "PingRequestSchema", "PrimitiveSchemaDefinitionSchema", "ProgressSchema", "ProgressNotificationSchema", "ProgressNotificationParamsSchema", "ProgressTokenSchema", "PromptSchema", "PromptArgumentSchema", "PromptListChangedNotificationSchema", "PromptMessageSchema", "PromptReferenceSchema", "ReadResourceRequestSchema", "ReadResourceRequestParamsSchema", "ReadResourceResultSchema", "RelatedTaskMetadataSchema", "RequestSchema", "RequestIdSchema", "RequestMetaSchema", "ResourceSchema", "ResourceContentsSchema", "ResourceLinkSchema", "ResourceListChangedNotificationSchema", "ResourceRequestParamsSchema", "ResourceTemplateSchema", "ResourceTemplateReferenceSchema", "ResourceUpdatedNotificationSchema", "ResourceUpdatedNotificationParamsSchema", "ResultMetaObjectSchema", "ResultSchema", "RoleSchema", "RootSchema", "RootsListChangedNotificationSchema", "SamplingContentSchema", "SamplingMessageSchema", "SamplingMessageContentBlockSchema", "ServerCapabilitiesSchema", "ServerNotificationSchema", "ServerRequestSchema", "ServerResultSchema", "SetLevelRequestSchema", "SetLevelRequestParamsSchema", "SingleSelectEnumSchemaSchema", "StringSchemaSchema", "SubscribeRequestSchema", "SubscribeRequestParamsSchema", "SubscriptionFilterSchema", "SubscriptionsAcknowledgedNotificationSchema", "SubscriptionsAcknowledgedNotificationParamsSchema", "SubscriptionsListenRequestSchema", "SubscriptionsListenRequestParamsSchema", "SubscriptionsListenResultSchema", "SubscriptionsListenResultMetaSchema", "TaskAugmentedRequestParamsSchema", "TaskCreationParamsSchema", "TaskMetadataSchema", "TaskSchema", "TaskStatusSchema", "TaskStatusNotificationSchema", "TaskStatusNotificationParamsSchema", "TextContentSchema", "TextResourceContentsSchema", "TitledMultiSelectEnumSchemaSchema", "TitledSingleSelectEnumSchemaSchema", "ToolSchema", "ToolAnnotationsSchema", "ToolChoiceSchema", "ToolExecutionSchema", "ToolListChangedNotificationSchema", "ToolResultContentSchema", "ToolUseContentSchema", "UnsubscribeRequestSchema", "UnsubscribeRequestParamsSchema", "UntitledMultiSelectEnumSchemaSchema", "UntitledSingleSelectEnumSchemaSchema"];
var authSchemas = {
  IdJagTokenExchangeResponseSchema,
  OAuthClientInformationFullSchema,
  OAuthClientInformationSchema,
  OAuthClientMetadataSchema,
  OAuthClientRegistrationErrorSchema,
  OAuthErrorResponseSchema,
  OAuthMetadataSchema,
  OAuthProtectedResourceMetadataSchema,
  OAuthTokenRevocationRequestSchema,
  OAuthTokensSchema,
  OpenIdProviderDiscoveryMetadataSchema,
  OpenIdProviderMetadataSchema
};
var _specTypeSchemas = {};
var _isSpecType = {};
function register(key, schema) {
  const name = key.slice(0, -6);
  _specTypeSchemas[name] = schema;
  _isSpecType[name] = v => schema.safeParse(v).success;
}
for (const key of SPEC_SCHEMA_KEYS) register(key, schemas_exports3[key]);
for (const [key, schema] of Object.entries(authSchemas)) register(key, schema);
var specTypeSchemas = Object.freeze(_specTypeSchemas);
var isSpecType = Object.freeze(_isSpecType);
function bootstrapOutboundCodec(method) {
  switch (method) {
    case "initialize":
    case "notifications/initialized":
      return codecForVersion(void 0);
    case "server/discover":
      return codecForVersion(MODERN_WIRE_REVISION);
    default:
      return;
  }
}
var DEFAULT_REQUEST_TIMEOUT_MSEC = 6e4;
var RESERVED_ENVELOPE_META_KEYS = [PROTOCOL_VERSION_META_KEY, CLIENT_INFO_META_KEY, CLIENT_CAPABILITIES_META_KEY, LOG_LEVEL_META_KEY];
var RETRY_PARAMS_KEYS = ["inputResponses", "requestState"];
function liftWireOnlyMaterial(message, kind) {
  const params = message.params;
  if (!isPlainObject$1(params)) return {
    message,
    lifted: {}
  };
  const meta3 = params._meta;
  const envelopeKeys = isPlainObject$1(meta3) ? RESERVED_ENVELOPE_META_KEYS.filter(key => key in meta3) : [];
  const retryKeys = kind === "request" ? RETRY_PARAMS_KEYS.filter(key => key in params) : [];
  if (envelopeKeys.length === 0 && retryKeys.length === 0) return {
    message,
    lifted: {}
  };
  const lifted = {};
  const nextParams = {
    ...params
  };
  if (envelopeKeys.length > 0 && isPlainObject$1(meta3)) {
    const envelope = {};
    const nextMeta = {
      ...meta3
    };
    for (const key of envelopeKeys) {
      envelope[key] = meta3[key];
      delete nextMeta[key];
    }
    lifted.envelope = envelope;
    if (Object.keys(nextMeta).length > 0) nextParams._meta = nextMeta;else delete nextParams._meta;
  }
  for (const key of retryKeys) {
    if (key === "inputResponses") lifted.inputResponses = nextParams[key];
    if (key === "requestState") lifted.requestState = nextParams[key];
    delete nextParams[key];
  }
  return {
    message: {
      ...message,
      params: nextParams
    },
    lifted
  };
}
function codecResultValidator(codec2, method) {
  const probe = codec2.validateResult(method, void 0);
  if (!probe.ok && probe.reason === "not-in-era") return void 0;
  return {
    "~standard": {
      version: 1,
      vendor: "mcp-wire-codec",
      validate(value) {
        const outcome = codec2.validateResult(method, value);
        if (outcome.ok) return {
          value: outcome.value
        };
        return {
          issues: [{
            message: outcome.reason === "invalid" ? outcome.message : `not-in-era: ${method}`
          }]
        };
      }
    }
  };
}
function requestStateAccessor(value) {
  return () => value;
}
var NO_REQUEST_STATE = requestStateAccessor(void 0);
function withRequestStateValue(ctx, value) {
  return {
    ...ctx,
    mcpReq: {
      ...ctx.mcpReq,
      requestState: requestStateAccessor(value)
    }
  };
}
var writeNegotiatedProtocolVersion;
var Protocol = class {
  _transport;
  _requestMessageId = 0;
  _requestHandlers = /* @__PURE__ */new Map();
  _requestHandlerAbortControllers = /* @__PURE__ */new Map();
  _notificationHandlers = /* @__PURE__ */new Map();
  _responseHandlers = /* @__PURE__ */new Map();
  _progressHandlers = /* @__PURE__ */new Map();
  _timeoutInfo = /* @__PURE__ */new Map();
  _pendingDebouncedNotifications = /* @__PURE__ */new Set();
  /**
  * The protocol version negotiated for the current connection (`undefined`
  * before negotiation completes), which determines the wire era this
  * instance speaks. Set by the SDK's negotiation and initialize paths
  * (`Client.connect`, `Server._oninitialize`).
  */
  _negotiatedProtocolVersion;
  static {
    writeNegotiatedProtocolVersion = (instance, version2) => {
      instance._negotiatedProtocolVersion = version2;
    };
  }
  _supportedProtocolVersions;
  /**
  * Callback for when the connection is closed for any reason.
  *
  * This is invoked when {@linkcode Protocol.close | close()} is called as well.
  */
  onclose;
  /**
  * Callback for when an error occurs.
  *
  * Note that errors are not necessarily fatal; they are used for reporting any kind of exceptional condition out of band.
  */
  onerror;
  /**
  * A handler to invoke for any request types that do not have their own handler installed.
  */
  fallbackRequestHandler;
  /**
  * A handler to invoke for any notification types that do not have their own handler installed.
  */
  fallbackNotificationHandler;
  constructor(_options) {
    this._options = _options;
    this._supportedProtocolVersions = _options?.supportedProtocolVersions ?? SUPPORTED_PROTOCOL_VERSIONS;
    this.setNotificationHandler("notifications/cancelled", notification => {
      this._oncancel(notification);
    });
    this.setNotificationHandler("notifications/progress", notification => {
      this._onprogress(notification);
    });
    this.setRequestHandler("ping", _request => ({}));
  }
  /**
  * Drop consult for inbound messages whose transport did not classify them
  * at the edge — long-lived channels such as stdio, where a role class may
  * need to decline traffic the negotiated era has no answer for (the
  * client-side inbound-request drop on modern-era connections: the
  * 2026-07-28 era has no server→client request channel, and on stdio the
  * client must never write JSON-RPC responses).
  *
  * Consulted ONLY when the transport supplied no
  * {@linkcode MessageExtraInfo.classification}: edge-classified traffic
  * never reaches the hook. Returning `'drop'` discards the message without
  * writing any response (requests are surfaced via `onerror`). The base
  * implementation returns `undefined`: unclassified traffic keeps today's
  * dispatch path unchanged. Era selection never happens here — era is
  * instance state, owned by the serving entry that constructed and
  * connected the instance.
  */
  _shouldDropInbound(_message) {}
  /**
  * The per-request `_meta` envelope this instance attaches to every outgoing
  * request and notification, when one applies. The base implementation
  * returns `undefined` (no envelope — the 2025-era posture, so legacy-era
  * outbound traffic is byte-identical to a build without this seam).
  * `Client` overrides it on a connection that negotiated a modern (2026-07-28+)
  * era to return the reserved protocol-version / client-info /
  * client-capabilities keys. User-supplied `_meta` keys take precedence over
  * the auto-attached ones.
  */
  _outboundMetaEnvelope() {}
  /**
  * Attach this instance's outbound `_meta` envelope (when one is configured)
  * to a request or notification. A no-op when the seam returns `undefined`
  * — the message returns by reference, so the legacy-era wire stays
  * byte-identical. User-supplied `_meta` keys are spread last so they win
  * over the auto-attached envelope keys.
  */
  _envelopeOutbound(message) {
    const envelope = this._outboundMetaEnvelope();
    if (envelope === void 0) return message;
    const params = message.params ?? {};
    return {
      ...message,
      params: {
        ...params,
        _meta: {
          ...envelope,
          ...params._meta
        }
      }
    };
  }
  /**
  * Extension point for non-`complete` decoded results in the response
  * funnel: a result the wire codec discriminated into a kind other than
  * `'complete'` or `'invalid'` is handed here for the role class to
  * resolve. The base default surfaces it as a typed
  * {@linkcode SdkErrorCode.UnsupportedResultType} error (no retry).
  *
  * Intended consumers (named so the seam stays accountable):
  * - the `Client`'s multi-round-trip auto-fulfilment engine, which fulfils
  *   `'input_required'` results through the registered
  *   elicitation/sampling/roots handlers and retries via `flow.retry`;
  * - a future client-side terminal-result handler for
  *   `subscriptions/listen`, when the spec defines one.
  *
  * `Server` instances never receive `input_required` responses on their
  * outbound legs and leave the base behavior in place.
  */
  _resolveNonCompleteResult(decoded, flow) {
    return Promise.reject(new SdkError(SdkErrorCode.UnsupportedResultType, `Unsupported result type '${decoded.kind}' for ${flow.request.method}`, {
      resultType: decoded.kind,
      method: flow.request.method
    }));
  }
  /**
  * Protected accessor for a registered request handler. Used by role
  * classes that dispatch synthesized requests through the same stored
  * handler chain (e.g. the `Client` fulfilling an embedded multi-round-trip
  * input request).
  */
  _getRequestHandler(method) {
    return this._requestHandlers.get(method);
  }
  async _oncancel(notification) {
    if (!notification.params.requestId) return;
    this._requestHandlerAbortControllers.get(notification.params.requestId)?.abort(notification.params.reason);
  }
  _setupTimeout(messageId, timeout, maxTotalTimeout, onTimeout, resetTimeoutOnProgress = false) {
    this._timeoutInfo.set(messageId, {
      timeoutId: setTimeout(onTimeout, timeout),
      startTime: Date.now(),
      timeout,
      maxTotalTimeout,
      resetTimeoutOnProgress,
      onTimeout
    });
  }
  _resetTimeout(messageId) {
    const info = this._timeoutInfo.get(messageId);
    if (!info) return false;
    const totalElapsed = Date.now() - info.startTime;
    if (info.maxTotalTimeout && totalElapsed >= info.maxTotalTimeout) {
      this._timeoutInfo.delete(messageId);
      throw new SdkError(SdkErrorCode.RequestTimeout, "Maximum total timeout exceeded", {
        maxTotalTimeout: info.maxTotalTimeout,
        totalElapsed
      });
    }
    clearTimeout(info.timeoutId);
    info.timeoutId = setTimeout(info.onTimeout, info.timeout);
    return true;
  }
  _cleanupTimeout(messageId) {
    const info = this._timeoutInfo.get(messageId);
    if (info) {
      clearTimeout(info.timeoutId);
      this._timeoutInfo.delete(messageId);
    }
  }
  /**
  * Attaches to the given transport, starts it, and starts listening for messages.
  *
  * The caller assumes ownership of the {@linkcode Transport}, replacing any callbacks that have already been set, and expects that it is the only user of the {@linkcode Transport} instance going forward.
  */
  async connect(transport) {
    this._transport = transport;
    const _onclose = this.transport?.onclose;
    this._transport.onclose = () => {
      try {
        _onclose?.();
      } finally {
        this._onclose();
      }
    };
    const _onerror = this.transport?.onerror;
    this._transport.onerror = error51 => {
      _onerror?.(error51);
      this._onerror(error51);
    };
    const _onmessage = this._transport?.onmessage;
    this._transport.onmessage = (message, extra) => {
      _onmessage?.(message, extra);
      if (isJSONRPCResultResponse(message) || isJSONRPCErrorResponse(message)) this._onresponse(message);else if (isJSONRPCRequest(message)) this._onrequest(message, extra);else if (isJSONRPCNotification(message)) this._onnotification(message, extra);else this._onerror(/* @__PURE__ */new Error(`Unknown message type: ${JSON.stringify(message)}`));
    };
    transport.setSupportedProtocolVersions?.(this._supportedProtocolVersions);
    await this._transport.start();
  }
  /**
  * Transport-close hook. Subclass overrides MUST call `super._onclose()`
  * after their own cleanup — base teardown (response-handler settlement,
  * timeout clearing, in-flight request abort) does not run otherwise.
  */
  _onclose() {
    const responseHandlers = this._responseHandlers;
    this._responseHandlers = /* @__PURE__ */new Map();
    this._progressHandlers.clear();
    this._pendingDebouncedNotifications.clear();
    for (const info of this._timeoutInfo.values()) clearTimeout(info.timeoutId);
    this._timeoutInfo.clear();
    const requestHandlerAbortControllers = this._requestHandlerAbortControllers;
    this._requestHandlerAbortControllers = /* @__PURE__ */new Map();
    const error51 = new SdkError(SdkErrorCode.ConnectionClosed, "Connection closed");
    this._transport = void 0;
    try {
      this.onclose?.();
    } finally {
      for (const handler of responseHandlers.values()) handler(error51);
      for (const controller of requestHandlerAbortControllers.values()) controller.abort(error51);
    }
  }
  _onerror(error51) {
    this.onerror?.(error51);
  }
  /**
  * Inbound-notification dispatch. Subclass overrides MUST delegate
  * unmatched traffic to `super._onnotification(rawNotification, extra)` —
  * an override that consumes only what it owns and falls through to base
  * dispatch for everything else.
  */
  _onnotification(rawNotification, extra) {
    const {
      message: notification
    } = liftWireOnlyMaterial(rawNotification, "notification");
    const codec2 = this._negotiatedWireCodec();
    if (extra?.classification === void 0 && this._shouldDropInbound(rawNotification) === "drop") return;
    if (extra?.classification !== void 0) {
      const classified = classifiedWireEra(extra.classification);
      if (classified !== codec2.era) {
        this._onerror(/* @__PURE__ */new Error(`Era mismatch on inbound notification '${notification.method}': classified as ${classified} but this instance serves ${codec2.era}`));
        return;
      }
    }
    if (isSpecNotificationMethod(notification.method) && !codec2.hasNotificationMethod(notification.method)) return;
    const handler = this._notificationHandlers.get(notification.method);
    const fallback = this.fallbackNotificationHandler;
    if (handler === void 0 && fallback === void 0) return;
    Promise.resolve().then(() => handler === void 0 ? fallback(notification) : handler(notification, codec2)).catch(error51 => this._onerror(/* @__PURE__ */new Error(`Uncaught error in notification handler: ${error51}`)));
  }
  _onrequest(rawRequest, extra) {
    const {
      message: request,
      lifted
    } = liftWireOnlyMaterial(rawRequest, "request");
    const codec2 = this._negotiatedWireCodec();
    if (extra?.classification === void 0 && this._shouldDropInbound(rawRequest) === "drop") {
      this._onerror(/* @__PURE__ */new Error(`Dropped inbound request '${rawRequest.method}': not servable on this connection's protocol era`));
      return;
    }
    const capturedTransport = this._transport;
    const sendErrorResponse = (code, message, data) => {
      const errorResponse = {
        jsonrpc: "2.0",
        id: request.id,
        error: {
          code,
          message,
          ...(data !== void 0 && {
            data
          })
        }
      };
      capturedTransport?.send(errorResponse).catch(error51 => this._onerror(/* @__PURE__ */new Error(`Failed to send an error response: ${error51}`)));
    };
    if (extra?.classification !== void 0) {
      const classified = classifiedWireEra(extra.classification);
      if (classified !== codec2.era) {
        this._onerror(/* @__PURE__ */new Error(`Era mismatch on inbound request '${request.method}': classified as ${classified} but this instance serves ${codec2.era}`));
        const requested = extra.classification.revision ?? classified;
        sendErrorResponse(ProtocolErrorCode.UnsupportedProtocolVersion, `Unsupported protocol version: ${requested}`, {
          supported: this._supportedProtocolVersions,
          requested
        });
        return;
      }
    }
    if (isSpecRequestMethod(request.method) && !codec2.hasRequestMethod(request.method)) {
      sendErrorResponse(ProtocolErrorCode.MethodNotFound, "Method not found");
      return;
    }
    const handler = this._requestHandlers.get(request.method) ?? this.fallbackRequestHandler;
    if (handler === void 0) {
      sendErrorResponse(ProtocolErrorCode.MethodNotFound, "Method not found");
      return;
    }
    const envelopeError = codec2.checkInboundEnvelope(lifted);
    if (envelopeError !== void 0) {
      sendErrorResponse(ProtocolErrorCode.InvalidParams, envelopeError);
      return;
    }
    const sendNotification = (notification, options) => this._notificationViaCodec(this._resolveOutboundCodec(notification.method), notification, {
      ...options,
      relatedRequestId: request.id
    });
    const sendRequest = (r, resultSchema, options) => this._requestWithSchemaViaCodec(this._resolveOutboundCodec(r.method), r, resultSchema, {
      ...options,
      relatedRequestId: request.id
    });
    const abortController = new AbortController();
    this._requestHandlerAbortControllers.set(request.id, abortController);
    const partitionedInputResponses = lifted.inputResponses === void 0 ? void 0 : partitionInputResponses(lifted.inputResponses);
    const baseCtx = {
      sessionId: capturedTransport?.sessionId,
      mcpReq: {
        id: request.id,
        method: request.method,
        _meta: request.params?._meta,
        ...(lifted.envelope !== void 0 && {
          envelope: lifted.envelope
        }),
        ...(partitionedInputResponses !== void 0 && {
          inputResponses: partitionedInputResponses.accepted
        }),
        ...(partitionedInputResponses !== void 0 && partitionedInputResponses.droppedKeys.length > 0 && {
          droppedInputResponseKeys: partitionedInputResponses.droppedKeys
        }),
        requestState: lifted.requestState === void 0 ? NO_REQUEST_STATE : requestStateAccessor(lifted.requestState),
        signal: abortController.signal,
        send: (r, schemaOrOptions, maybeOptions) => {
          const sendCodec = this._resolveOutboundCodec(r.method);
          this._assertOutboundRequestInEra(sendCodec, r.method);
          if (isStandardSchema(schemaOrOptions)) return sendRequest(r, schemaOrOptions, maybeOptions);
          const validate = codecResultValidator(sendCodec, r.method);
          if (validate === void 0) throw new TypeError(`'${r.method}' is not a spec method; pass a result schema as the second argument to ctx.mcpReq.send().`);
          return sendRequest(r, validate, schemaOrOptions);
        },
        notify: sendNotification
      },
      http: extra?.authInfo ? {
        authInfo: extra.authInfo
      } : void 0
    };
    const ctx = this.buildContext(baseCtx, extra);
    Promise.resolve().then(() => handler(request, ctx)).then(async result => {
      if (abortController.signal.aborted) return;
      let encoded;
      try {
        encoded = codec2.encodeResult(request.method, result, this._outboundServerInfo());
      } catch (error51) {
        this._onerror(/* @__PURE__ */new Error(`Failed to encode result for ${request.method}: ${error51}`));
        sendErrorResponse(ProtocolErrorCode.InternalError, "Internal error");
        return;
      }
      const response = {
        result: encoded,
        jsonrpc: "2.0",
        id: request.id
      };
      await capturedTransport?.send(response);
    }, async error51 => {
      if (abortController.signal.aborted) return;
      const thrownCode = Number.isSafeInteger(error51["code"]) ? error51["code"] : ProtocolErrorCode.InternalError;
      const errorResponse = {
        jsonrpc: "2.0",
        id: request.id,
        error: {
          code: codec2.encodeErrorCode(thrownCode),
          message: error51.message ?? "Internal error",
          ...(error51["data"] !== void 0 && {
            data: error51["data"]
          })
        }
      };
      await capturedTransport?.send(errorResponse);
    }).catch(error51 => this._onerror(/* @__PURE__ */new Error(`Failed to send response: ${error51}`))).finally(() => {
      if (this._requestHandlerAbortControllers.get(request.id) === abortController) this._requestHandlerAbortControllers.delete(request.id);
    });
  }
  _onprogress(notification) {
    const {
      progressToken,
      ...params
    } = notification.params;
    const messageId = Number(progressToken);
    const handler = this._progressHandlers.get(messageId);
    if (!handler) {
      this._onerror(/* @__PURE__ */new Error(`Received a progress notification for an unknown token: ${JSON.stringify(notification)}`));
      return;
    }
    const responseHandler = this._responseHandlers.get(messageId);
    const timeoutInfo = this._timeoutInfo.get(messageId);
    if (timeoutInfo && responseHandler && timeoutInfo.resetTimeoutOnProgress) try {
      this._resetTimeout(messageId);
    } catch (error51) {
      this._responseHandlers.delete(messageId);
      this._progressHandlers.delete(messageId);
      this._cleanupTimeout(messageId);
      responseHandler(error51);
      return;
    }
    handler(params);
  }
  /**
  * Inbound-response dispatch. Subclass overrides MUST delegate unmatched
  * traffic to `super._onresponse(response)` — an override that consumes
  * only what it owns and falls through to base dispatch for everything
  * else.
  */
  _onresponse(response) {
    const messageId = Number(response.id);
    const handler = this._responseHandlers.get(messageId);
    if (handler === void 0) {
      this._onerror(/* @__PURE__ */new Error(`Received a response for an unknown message ID: ${JSON.stringify(response)}`));
      return;
    }
    this._responseHandlers.delete(messageId);
    this._cleanupTimeout(messageId);
    this._progressHandlers.delete(messageId);
    if (isJSONRPCResultResponse(response)) handler(response);else handler(ProtocolError.fromError(response.error.code, response.error.message, response.error.data));
  }
  get transport() {
    return this._transport;
  }
  /**
  * Closes the connection.
  */
  async close() {
    await this._transport?.close();
  }
  request(request, schemaOrOptions, maybeOptions) {
    const codec2 = this._resolveOutboundCodec(request.method);
    this._assertOutboundRequestInEra(codec2, request.method);
    if (isStandardSchema(schemaOrOptions)) return this._requestWithSchemaViaCodec(codec2, request, schemaOrOptions, maybeOptions);
    const validate = codecResultValidator(codec2, request.method);
    if (validate === void 0) throw new TypeError(`'${request.method}' is not a spec method; pass a result schema as the second argument to request().`);
    return this._requestWithSchemaViaCodec(codec2, request, validate, schemaOrOptions);
  }
  /**
  * The wire codec for this instance's negotiated era — the phase-2 truth:
  * everything an established connection sends and receives resolves
  * through it. Legacy until a version has been negotiated.
  */
  _negotiatedWireCodec() {
    return codecForVersion(this._negotiatedProtocolVersion);
  }
  /**
  * Protected accessor for the instance's negotiated wire codec, for role
  * classes (Client/Server/McpServer) routing era-dependent behavior
  * through the codec's function-only surface — `samplingResultVariant`,
  * `outboundEnvelope`, `projectCallToolResult` — instead of branching on
  * the protocol version themselves.
  */
  _wireCodec() {
    return this._negotiatedWireCodec();
  }
  /**
  * Outbound codec resolution: while the negotiated version is still unset
  * (the negotiation window), lifecycle messages are bootstrap-pinned BY
  * METHOD — they self-identify their era (`initialize` IS the legacy
  * handshake, `server/discover` IS the modern probe). Once a version has
  * been negotiated, the instance era is authoritative for everything — a
  * negotiated session never re-routes a method onto the other era.
  */
  _resolveOutboundCodec(method) {
    if (this._negotiatedProtocolVersion === void 0) {
      const pinned = bootstrapOutboundCodec(method);
      if (pinned) return pinned;
    }
    return this._negotiatedWireCodec();
  }
  /**
  * Era gate for outbound requests — deletions are physical in BOTH
  * directions: sending a spec method that the resolved era does not define
  * dies locally with a typed error before anything reaches the transport.
  * Methods outside the spec universe are consumer-owned extension methods
  * and stay era-blind.
  */
  _assertOutboundRequestInEra(codec2, method) {
    if (isSpecRequestMethod(method) && !codec2.hasRequestMethod(method)) throw new SdkError(SdkErrorCode.MethodNotSupportedByProtocolVersion, `Method '${method}' is not supported by the negotiated protocol version (wire era ${codec2.era})`, {
      method,
      era: codec2.era
    });
  }
  /**
  * Sends a request and waits for a response, using the provided schema for
  * validation instead of the era registry's method-keyed entry.
  *
  * This is the internal implementation used by SDK methods whose result
  * schema cannot be expressed as a method-keyed registry entry — the one
  * surviving case is `server.createMessage`, whose result schema depends
  * on the REQUEST params (tools vs no tools) — and by callers passing
  * explicit compatibility schemas. Spec methods are still era-gated here:
  * an explicit schema never smuggles a deleted method onto the wire.
  */
  _requestWithSchema(request, resultSchema, options) {
    const codec2 = this._resolveOutboundCodec(request.method);
    this._assertOutboundRequestInEra(codec2, request.method);
    return this._requestWithSchemaViaCodec(codec2, request, resultSchema, options);
  }
  /**
  * The request funnel proper, keyed by the resolved era codec: the codec
  * owns result decoding (raw-first `resultType` discrimination — V-1 —
  * and the era's lift posture) before the schema validation step.
  */
  _requestWithSchemaViaCodec(codec2, request, resultSchema, options) {
    const {
      relatedRequestId,
      resumptionToken,
      onresumptiontoken,
      headers
    } = options ?? {};
    const flowStartedAt = Date.now();
    let onAbort;
    let cleanupMessageId;
    return new Promise((resolve, reject) => {
      const earlyReject = error51 => {
        reject(error51);
      };
      if (!this._transport) {
        earlyReject(/* @__PURE__ */new Error("Not connected"));
        return;
      }
      if (this._options?.enforceStrictCapabilities === true) try {
        this.assertCapabilityForMethod(request.method);
      } catch (error51) {
        earlyReject(error51);
        return;
      }
      if (options?.signal?.aborted) {
        const reason = options.signal.reason;
        throw reason instanceof SdkError ? reason : new SdkError(SdkErrorCode.RequestTimeout, String(reason));
      }
      const requestAbort = codec2.era === MODERN_WIRE_REVISION && this._transport.hasPerRequestStream === true ? new AbortController() : void 0;
      const messageId = this._requestMessageId++;
      cleanupMessageId = messageId;
      const jsonrpcRequest = {
        ...request,
        jsonrpc: "2.0",
        id: messageId
      };
      if (options?.onprogress) {
        this._progressHandlers.set(messageId, options.onprogress);
        jsonrpcRequest.params = {
          ...request.params,
          _meta: {
            ...request.params?._meta,
            progressToken: messageId
          }
        };
      }
      const outbound = this._envelopeOutbound(jsonrpcRequest);
      let responseReceived = false;
      const cancel = reason => {
        if (responseReceived) return;
        this._progressHandlers.delete(messageId);
        if (requestAbort === void 0) this._transport?.send(this._envelopeOutbound({
          jsonrpc: "2.0",
          method: "notifications/cancelled",
          params: {
            requestId: messageId,
            reason: String(reason)
          }
        }), {
          relatedRequestId,
          resumptionToken,
          onresumptiontoken
        }).catch(error51 => this._onerror(/* @__PURE__ */new Error(`Failed to send cancellation: ${error51}`)));else requestAbort.abort();
        reject(reason instanceof SdkError ? reason : new SdkError(SdkErrorCode.RequestTimeout, String(reason)));
      };
      this._responseHandlers.set(messageId, response => {
        if (options?.signal?.aborted) return;
        responseReceived = true;
        if (response instanceof Error) return reject(response);
        let decoded;
        try {
          decoded = codec2.decodeResult(request.method, response.result);
        } catch (error51) {
          return reject(error51 instanceof Error ? error51 : new Error(String(error51)));
        }
        if (decoded.kind === "invalid") return reject(decoded.error);
        if (decoded.kind === "input_required") {
          if (options?.allowInputRequired === true) return resolve(manualInputRequiredValue(decoded));
          const flow = {
            codec: codec2,
            request,
            resultSchema,
            options,
            flowStartedAt,
            retry: (params, legOptions) => this._requestWithSchemaViaCodec(codec2, params === void 0 ? {
              method: request.method
            } : {
              method: request.method,
              params
            }, resultSchema, legOptions)
          };
          return resolve(this._resolveNonCompleteResult(decoded, flow));
        }
        const result = decoded.result;
        validateStandardSchema(resultSchema, result).then(parseResult => {
          if (parseResult.success) resolve(parseResult.data);else reject(new SdkError(SdkErrorCode.InvalidResult, `Invalid result for ${request.method}: ${parseResult.error}`));
        }, reject);
      });
      onAbort = () => cancel(options?.signal?.reason);
      options?.signal?.addEventListener("abort", onAbort, {
        once: true
      });
      const timeout = options?.timeout ?? DEFAULT_REQUEST_TIMEOUT_MSEC;
      const timeoutHandler = () => cancel(new SdkError(SdkErrorCode.RequestTimeout, "Request timed out", {
        timeout
      }));
      this._setupTimeout(messageId, timeout, options?.maxTotalTimeout, timeoutHandler, options?.resetTimeoutOnProgress ?? false);
      this._transport.send(outbound, {
        relatedRequestId,
        resumptionToken,
        onresumptiontoken,
        headers,
        requestSignal: requestAbort?.signal
      }).catch(error51 => {
        this._progressHandlers.delete(messageId);
        reject(error51);
      });
    }).finally(() => {
      if (onAbort) options?.signal?.removeEventListener("abort", onAbort);
      if (cleanupMessageId !== void 0) {
        this._responseHandlers.delete(cleanupMessageId);
        this._cleanupTimeout(cleanupMessageId);
      }
    });
  }
  /**
  * Emits a notification, which is a one-way message that does not expect a response.
  */
  async notification(notification, options) {
    return this._notificationViaCodec(this._resolveOutboundCodec(notification.method), notification, options);
  }
  /**
  * The notification funnel proper, keyed by the resolved era codec —
  * direct sends and related notifications (`ctx.mcpReq.notify`) alike
  * resolve through the instance's negotiated era at send time.
  */
  async _notificationViaCodec(codec2, notification, options) {
    if (!this._transport) throw new SdkError(SdkErrorCode.NotConnected, "Not connected");
    if (isSpecNotificationMethod(notification.method) && !codec2.hasNotificationMethod(notification.method)) throw new SdkError(SdkErrorCode.MethodNotSupportedByProtocolVersion, `Notification '${notification.method}' is not supported by the negotiated protocol version (wire era ${codec2.era})`, {
      method: notification.method,
      era: codec2.era
    });
    this.assertNotificationCapability(notification.method);
    const jsonrpcNotification = this._envelopeOutbound({
      jsonrpc: "2.0",
      ...notification
    });
    if ((this._options?.debouncedNotificationMethods ?? []).includes(notification.method) && !notification.params && !options?.relatedRequestId) {
      if (this._pendingDebouncedNotifications.has(notification.method)) return;
      this._pendingDebouncedNotifications.add(notification.method);
      Promise.resolve().then(() => {
        this._pendingDebouncedNotifications.delete(notification.method);
        if (!this._transport) return;
        this._transport?.send(jsonrpcNotification, options).catch(error51 => this._onerror(error51));
      });
      return;
    }
    await this._transport.send(jsonrpcNotification, options);
  }
  setRequestHandler(method, schemasOrHandler, maybeHandler) {
    this.assertRequestHandlerCapability(method);
    let stored;
    if (typeof schemasOrHandler === "function") {
      if (!isSpecRequestMethod(method)) throw new TypeError(`'${method}' is not a spec request method; pass schemas as the second argument to setRequestHandler().`);
      stored = (request, ctx) => {
        const dispatchCodec = this._negotiatedWireCodec();
        let outcome = dispatchCodec.validateRequest(method, request);
        if (!outcome.ok && outcome.reason === "not-in-era") outcome = dispatchCodec.validateInputRequest(method, request);
        if (!outcome.ok) {
          if (outcome.reason === "not-in-era") throw new ProtocolError(ProtocolErrorCode.InternalError, `No wire schema for ${method} in the resolved era`);
          throw new Error(outcome.message);
        }
        return Promise.resolve(schemasOrHandler(outcome.value, ctx));
      };
    } else if (maybeHandler) stored = async (request, ctx) => {
      const parsed = await validateStandardSchema(schemasOrHandler.params, {
        ...request.params
      });
      if (!parsed.success) throw new ProtocolError(ProtocolErrorCode.InvalidParams, `Invalid params for ${method}: ${parsed.error}`);
      return maybeHandler(parsed.data, ctx);
    };else throw new TypeError("setRequestHandler: handler is required");
    this._requestHandlers.set(method, this._wrapHandler(method, stored));
  }
  /**
  * Hook for subclasses to wrap a registered request handler with role-specific
  * validation or behavior (e.g. `Server` validates `tools/call` results, `Client`
  * validates `elicitation/create` mode and result). Runs for both the 2-arg and
  * 3-arg registration paths. The default implementation is identity.
  *
  * Subclasses overriding this hook avoid redeclaring `setRequestHandler`'s overload set.
  */
  _wrapHandler(_method, handler) {
    return handler;
  }
  /**
  * Hook for subclasses to supply the implementation identity the 2026-era
  * encode seam stamps into outbound result `_meta` under
  * `io.modelcontextprotocol/serverInfo` (spec PR #3002: servers SHOULD
  * identify themselves on every response). The default is `undefined` — no
  * stamp. Only `Server` overrides this: the key identifies the software
  * producing a response, and the 2025-era codec never stamps anything
  * regardless (the never-stamp guarantee).
  */
  _outboundServerInfo() {}
  /**
  * Removes the request handler for the given method.
  */
  removeRequestHandler(method) {
    this._requestHandlers.delete(method);
  }
  /**
  * Asserts that a request handler has not already been set for the given method, in preparation for a new one being automatically installed.
  */
  assertCanSetRequestHandler(method) {
    if (this._requestHandlers.has(method)) throw new Error(`A request handler for ${method} already exists, which would be overridden`);
  }
  setNotificationHandler(method, schemasOrHandler, maybeHandler) {
    if (typeof schemasOrHandler === "function") {
      if (!isSpecNotificationMethod(method)) throw new TypeError(`'${method}' is not a spec notification method; pass schemas as the second argument to setNotificationHandler().`);
      this._notificationHandlers.set(method, (notification, codec2) => {
        const outcome = codec2.validateNotification(method, notification);
        if (!outcome.ok) {
          if (outcome.reason === "not-in-era") throw new ProtocolError(ProtocolErrorCode.InternalError, `No wire schema for ${method} in the resolved era`);
          throw new Error(outcome.message);
        }
        return Promise.resolve(schemasOrHandler(outcome.value));
      });
      return;
    }
    if (!maybeHandler) throw new TypeError("setNotificationHandler: handler is required");
    this._notificationHandlers.set(method, async notification => {
      const parsed = await validateStandardSchema(schemasOrHandler.params, {
        ...notification.params
      });
      if (!parsed.success) throw new ProtocolError(ProtocolErrorCode.InvalidParams, `Invalid params for notification ${method}: ${parsed.error}`);
      await maybeHandler(parsed.data, notification);
    });
  }
  /**
  * Removes the notification handler for the given method.
  */
  removeNotificationHandler(method) {
    this._notificationHandlers.delete(method);
  }
};
function isPlainObject$1(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function mergeCapabilities(base, additional) {
  const result = {
    ...base
  };
  for (const key in additional) {
    const k = key;
    const addValue = additional[k];
    if (addValue === void 0) continue;
    const baseValue = result[k];
    result[k] = isPlainObject$1(baseValue) && isPlainObject$1(addValue) ? {
      ...baseValue,
      ...addValue
    } : addValue;
  }
  return result;
}
function isPlainObject2(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function partitionInputResponses(inputResponses) {
  const accepted = {};
  const droppedKeys = [];
  if (!isPlainObject2(inputResponses)) return {
    accepted,
    droppedKeys
  };
  for (const [key, entry] of Object.entries(inputResponses)) {
    if (!isPlainObject2(entry) || "method" in entry || "result" in entry) {
      droppedKeys.push(key);
      continue;
    }
    accepted[key] = entry;
  }
  return {
    accepted,
    droppedKeys
  };
}
function manualInputRequiredValue(decoded) {
  return {
    resultType: "input_required",
    inputRequests: decoded.inputRequests,
    ...(decoded.requestState !== void 0 && {
      requestState: decoded.requestState
    })
  };
}
var require_content_type = /* @__PURE__ */__commonJSMin(exports2 => {
  var PARAM_REGEXP = /; *([!#$%&'*+.^_`|~0-9A-Za-z-]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'*+.^_`|~0-9A-Za-z-]+) */g;
  var QESC_REGEXP = /\\([\u000b\u0020-\u00ff])/g;
  var TYPE_REGEXP = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;
  exports2.parse = parse3;
  function parse3(string4) {
    if (!string4) throw new TypeError("argument string is required");
    var header = typeof string4 === "object" ? getcontenttype(string4) : string4;
    if (typeof header !== "string") throw new TypeError("argument string is required to be a string");
    var index = header.indexOf(";");
    var type = index !== -1 ? header.slice(0, index).trim() : header.trim();
    if (!TYPE_REGEXP.test(type)) throw new TypeError("invalid media type");
    var obj = new ContentType(type.toLowerCase());
    if (index !== -1) {
      var key;
      var match;
      var value;
      PARAM_REGEXP.lastIndex = index;
      while (match = PARAM_REGEXP.exec(header)) {
        if (match.index !== index) throw new TypeError("invalid parameter format");
        index += match[0].length;
        key = match[1].toLowerCase();
        value = match[2];
        if (value.charCodeAt(0) === 34) {
          value = value.slice(1, -1);
          if (value.indexOf("\\") !== -1) value = value.replace(QESC_REGEXP, "$1");
        }
        obj.parameters[key] = value;
      }
      if (index !== header.length) throw new TypeError("invalid parameter format");
    }
    return obj;
  }
  function getcontenttype(obj) {
    var header;
    if (typeof obj.getHeader === "function") header = obj.getHeader("content-type");else if (typeof obj.headers === "object") header = obj.headers && obj.headers["content-type"];
    if (typeof header !== "string") throw new TypeError("content-type header is missing from object");
    return header;
  }
  function ContentType(type) {
    this.parameters = /* @__PURE__ */Object.create(null);
    this.type = type;
  }
});
var import_content_type = /* @__PURE__ */__toESM2(require_content_type(), 1);
var STDIO_DEFAULT_MAX_BUFFER_SIZE = 10 * 1024 * 1024;
var ReadBuffer = class {
  _buffer;
  _maxBufferSize;
  constructor(options) {
    this._maxBufferSize = options?.maxBufferSize ?? STDIO_DEFAULT_MAX_BUFFER_SIZE;
  }
  append(chunk) {
    if ((this._buffer?.length ?? 0) + chunk.length > this._maxBufferSize) {
      this.clear();
      throw new Error(`ReadBuffer exceeded maximum size of ${this._maxBufferSize} bytes`);
    }
    this._buffer = this._buffer ? Buffer.concat([this._buffer, chunk]) : chunk;
  }
  readMessage() {
    while (this._buffer) {
      const index = this._buffer.indexOf("\n");
      if (index === -1) return null;
      const line = this._buffer.toString("utf8", 0, index).replace(/\r$/, "");
      this._buffer = this._buffer.subarray(index + 1);
      try {
        return deserializeMessage(line);
      } catch (error51) {
        if (error51 instanceof SyntaxError) continue;
        throw error51;
      }
    }
    return null;
  }
  clear() {
    this._buffer = void 0;
  }
};
function deserializeMessage(line) {
  return JSONRPCMessageSchema.parse(JSON.parse(line));
}
function serializeMessage(message) {
  return JSON.stringify(message) + "\n";
}
var TOOL_NAME_REGEX = /^[A-Za-z0-9._-]{1,128}$/;
function validateToolName(name) {
  const warnings = [];
  if (name.length === 0) return {
    isValid: false,
    warnings: ["Tool name cannot be empty"]
  };
  if (name.length > 128) return {
    isValid: false,
    warnings: [`Tool name exceeds maximum length of 128 characters (current: ${name.length})`]
  };
  if (name.includes(" ")) warnings.push("Tool name contains spaces, which may cause parsing issues");
  if (name.includes(",")) warnings.push("Tool name contains commas, which may cause parsing issues");
  if (name.startsWith("-") || name.endsWith("-")) warnings.push("Tool name starts or ends with a dash, which may cause parsing issues in some contexts");
  if (name.startsWith(".") || name.endsWith(".")) warnings.push("Tool name starts or ends with a dot, which may cause parsing issues in some contexts");
  if (!TOOL_NAME_REGEX.test(name)) {
    const invalidChars = [...name].filter(char => !/[A-Za-z0-9._-]/.test(char)).filter((char, index, arr) => arr.indexOf(char) === index);
    warnings.push(`Tool name contains invalid characters: ${invalidChars.map(c => `"${c}"`).join(", ")}`, "Allowed characters are: A-Z, a-z, 0-9, underscore (_), dash (-), and dot (.)");
    return {
      isValid: false,
      warnings
    };
  }
  return {
    isValid: true,
    warnings
  };
}
function issueToolNameWarning(name, warnings) {
  if (warnings.length > 0) {
    console.warn(`Tool name validation warning for "${name}":`);
    for (const warning of warnings) console.warn(`  - ${warning}`);
    console.warn("Tool registration will proceed, but this may cause compatibility issues.");
    console.warn("Consider updating the tool name to conform to the MCP tool naming standard.");
    console.warn("See SEP: Specify Format for Tool Names (https://github.com/modelcontextprotocol/modelcontextprotocol/issues/986) for more details.");
  }
}
function validateAndWarnToolName(name) {
  const result = validateToolName(name);
  issueToolNameWarning(name, result.warnings);
  return result.isValid;
}
function isZodV4Schema(v) {
  return typeof v === "object" && v !== null && "_zod" in v;
}
function looksLikeZodV3(v) {
  return typeof v === "object" && v !== null && !("_zod" in v) && "_def" in v && typeof v._def?.typeName === "string";
}
function isZodRawShape(obj) {
  if (typeof obj !== "object" || obj === null) return false;
  if (isStandardSchema(obj)) return false;
  const proto = Object.getPrototypeOf(obj);
  if (proto !== Object.prototype && proto !== null) return false;
  return Object.values(obj).every(v => isZodV4Schema(v));
}
function normalizeRawShapeSchema(schema) {
  if (schema === void 0) return void 0;
  if (isZodRawShape(schema)) return object(schema);
  if (typeof schema === "object" && schema !== null && !isStandardSchema(schema) && Object.values(schema).some(v => looksLikeZodV3(v))) throw new TypeError("Raw-shape inputSchema/outputSchema/argsSchema fields must be Zod v4 schemas. Got a Zod v3 field schema. Import from `zod/v4` (or upgrade your zod import), or wrap with `z.object({...})` yourself.");
  if (!isStandardSchema(schema)) throw new TypeError("inputSchema/outputSchema/argsSchema must be a Standard Schema (e.g. z.object({...})) or a raw Zod shape ({ field: z.string() }).");
  return schema;
}
function fromJsonSchema(schema, validator) {
  const check2 = validator.getValidator(schema);
  return {
    "~standard": {
      version: 1,
      vendor: "mcp",
      jsonSchema: {
        input: () => schema,
        output: () => schema
      },
      validate: data => {
        const result = check2(data);
        return result.valid ? {
          value: result.data
        } : {
          issues: [{
            message: result.errorMessage
          }]
        };
      }
    }
  };
}

// node_modules/@modelcontextprotocol/server/dist/ajvProvider-CEoC__sr.mjs
export { BRANDS, stampErrorBrands, brandedHasInstance, OAuthError, SdkErrorCode, SdkError, SdkHttpError, isPlainObject$7, isImpliedCapabilityMember, requiredClientCapabilitiesForInputRequest, missingClientCapabilities, FIRST_MODERN_PROTOCOL_VERSION, isModernProtocolVersion, legacyProtocolVersions, modernProtocolVersions, appendTextFallbackForNonObject, TOOL_RESULT_FOREIGN_FAMILY_KEYS, normalizeContentlessToolResult, build$1, memo$1, buildSchemas2025, isNonObjectJsonSchemaRoot, REF_REWRITE_DATA_POSITION_KEYS, REF_REWRITE_NAME_MAP_KEYS, establishesNewBase, wrapOutputSchemaForLegacy, requestMethodKeys$1, notificationMethodKeys$1, resultMethodKeys, maps$1, registryMaps, hasRequestMethod2025, hasNotificationMethod2025, hasResultMethod, getResultSchema, getRequestSchema, getNotificationSchema, rev2025RequestMethods, rev2025NotificationMethods, isPlainObject$6, triState$1, NOT_IN_ERA$1, toolNeedsLegacyWrap, toNeutralResult, rev2025Codec, build, memo, buildSchemas2026, CACHEABLE_RESULT_METHODS, isCacheableResultMethod, RESULT_CACHE_HINT_FALLBACK, attachCacheHintFallback, cacheHintFallbackOf, isValidCacheTtlMs, isValidCacheScope, assertValidCacheHint, ProtocolErrorCode, ProtocolError, ResourceNotFoundError, UrlElicitationRequiredError, UnsupportedProtocolVersionError, MissingRequiredClientCapabilityError, DEFAULT_CACHE_TTL_MS, DEFAULT_CACHE_SCOPE, EXTENDED_RESULT_TYPE_METHODS, stampResultType, fillCacheFields, isPlainObject$5, stampServerInfoMeta, resolveTtlMs, resolveCacheScope, stripCacheHintFallback, INPUT_REQUEST_METHODS_2026, maps, inputSchemaMaps, isInputRequestMethod2026, getInputRequestSchema2026, getInputResponseSchema2026, requestMethodKeys, notificationMethodKeys, hasRequestMethod2026, hasNotificationMethod2026, hasResultMethod2026, getRequestSchema2026, getResultSchema2026, getNotificationSchema2026, rev2026RequestMethods, rev2026NotificationMethods, isPlainObject$4, triState, NOT_IN_ERA, REQUIRED_ENVELOPE_KEYS, enforceDeletedFields, rev2026Codec, wireResultSchemasMemo, getWireResultSchemas, MODERN_WIRE_REVISION, codecForVersion, classifiedWireEra, isSpecRequestMethod, isSpecNotificationMethod, ALL_CODECS, schemas_exports3, isJSONRPCRequest, isJSONRPCNotification, isJSONRPCResultResponse, isJSONRPCErrorResponse, isInputRequiredResult, assertCompleteRequestPrompt, assertCompleteRequestResourceTemplate, X_MCP_HEADER_KEY, RFC9110_TOKEN, PERMITTED_X_MCP_HEADER_TYPES, scanXMcpHeaderDeclarations, NON_REACHABLE_SUBSCHEMA_KEYWORDS, OBJECT_VALUED_SUBSCHEMA_KEYWORDS, pathName, HEADER_MISMATCH_ERROR_CODE, INBOUND_VALIDATION_LADDER, LADDER_ERROR_HTTP_STATUS, parseSchema, shapeKeys, isStandardSchema, warnedZodFallback, JSON_SCHEMA_CONVERSION_TARGET, standardSchemaToJsonSchema, isProvablyObjectShapedRoot, formatIssue, validateStandardSchema, zodEmittedPattern, DATETIME_FRACTION_DIGITS, datetimeReferenceSchemas, referencePatternsForFormat, isLibraryFormatPattern, promptArgumentsFromStandardSchema, isJsonObject, convertStandardElicitationSchema, ANNOTATION_ONLY_JSON_SCHEMA_KEYWORDS, isAnnotationOnlyJsonSchemaKeyword, ROOT_KEYS, PROPERTY_KEYS_BY_TYPE, SUPPORTED_STRING_FORMATS, walkProperty, walkRequestedSchema, describeUnsupportedProperties, findDroppedConstraintPaths, normalizeElicitInputParams, buildInputRequired, inputRequired, REQUEST_STATE_ONLY_LEG_PACING_MS, inputRequiredRoundsExceededMessage, sleep, linkedRoundAbort, SPEC_SCHEMA_KEYS, authSchemas, _specTypeSchemas, _isSpecType, register, specTypeSchemas, isSpecType, bootstrapOutboundCodec, DEFAULT_REQUEST_TIMEOUT_MSEC, RESERVED_ENVELOPE_META_KEYS, RETRY_PARAMS_KEYS, liftWireOnlyMaterial, codecResultValidator, requestStateAccessor, NO_REQUEST_STATE, withRequestStateValue, writeNegotiatedProtocolVersion, Protocol, isPlainObject$1, mergeCapabilities, isPlainObject2, partitionInputResponses, manualInputRequiredValue, require_content_type, import_content_type, STDIO_DEFAULT_MAX_BUFFER_SIZE, ReadBuffer, deserializeMessage, serializeMessage, TOOL_NAME_REGEX, validateToolName, issueToolNameWarning, validateAndWarnToolName, isZodV4Schema, looksLikeZodV3, isZodRawShape, normalizeRawShapeSchema, fromJsonSchema };
