// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { __toESM } from "../../../runtime/helpers.mjs";
import { init_define_SHUNCODE_BUILD_INFO } from "../../../runtime/build-info.mjs";
import { getShunCodeModelConfig } from "./config.mjs";
import { CODEX_API_BASE_URL, CODEX_BETA_HEADER, CODEX_CLIENT_VERSION, CODEX_ORIGINATOR, CODEX_USER_AGENT, codexAuthManager } from "./codex-auth.mjs";
import { DEEPSEEK_CONTEXT_WINDOW_TOKENS, DEEPSEEK_DEFAULT_REASONING_EFFORT, DEEPSEEK_MAX_OUTPUT_TOKENS, DEEPSEEK_REASONING_EFFORTS, isOfficialDeepSeekApiBaseUrl, normalizeOfficialDeepSeekApiBaseUrl, resolveDeepSeekThinkingEffort } from "./deepseek-compat.mjs";
import { DEFAULT_API_CONTEXT_WINDOW, DEFAULT_API_MAX_OUTPUT_TOKENS, DEFAULT_CODEX_CONTEXT_WINDOW } from "./model-defaults.mjs";
import { MODEL_ID_SEPARATOR, deleteRuntimeModelsForNamespace, encodedModelId, normalizeProviderModelId } from "./model-provider-identifiers.mjs";
import { REASONING_EFFORTS, THINKING_MODES, genericReasoningPickerValues, resolveGenericReasoningOverride } from "./model-reasoning.mjs";
// extensions/shuncode/src/model-provider.ts
init_define_SHUNCODE_BUILD_INFO();
var import_node_crypto12 = require("node:crypto");
var vscode10 = __toESM(require("vscode"));

// extensions/shuncode/src/deepseek-compat.mts

// extensions/shuncode/src/model-provider.ts
function normalizeChatCompletionsUrl(baseUrl) {
  const trimmed = baseUrl.trim().replace(/\/+$/, "");
  if (!trimmed) throw new Error("ShunCode model Base URL is empty.");
  return trimmed.endsWith("/chat/completions") ? trimmed : `${trimmed}/chat/completions`;
}
function normalizeResponsesUrl(baseUrl) {
  const trimmed = baseUrl.trim().replace(/\/+$/, "");
  if (!trimmed) throw new Error("ShunCode model Base URL is empty.");
  return trimmed.endsWith("/responses") ? trimmed : `${trimmed}/responses`;
}
function normalizeAnthropicMessagesUrl(baseUrl) {
  const trimmed = baseUrl.trim().replace(/\/+$/, "");
  if (!trimmed) throw new Error("ShunCode provider Base URL is empty.");
  if (trimmed.endsWith("/messages")) return trimmed;
  if (trimmed.endsWith("/v1")) return `${trimmed}/messages`;
  return `${trimmed}/v1/messages`;
}
function normalizeAnthropicModelsUrl(baseUrl) {
  let normalized = baseUrl.trim().replace(/\/+$/, "");
  if (normalized.endsWith("/v1/messages")) {
    normalized = normalized.slice(0, -"/v1/messages".length).replace(/\/+$/, "");
  } else if (normalized.endsWith("/messages")) {
    normalized = normalized.slice(0, -"/messages".length).replace(/\/+$/, "");
  }
  return normalized.endsWith("/v1") ? `${normalized}/models` : `${normalized}/v1/models`;
}
var ANTHROPIC_API_VERSION = "2023-06-01";
var ANTHROPIC_EFFORT_THINKING_BUDGETS = {
  low: 2048,
  medium: 8192,
  high: 16384,
  xhigh: 24576,
  max: 32768,
  ultra: 32768
};
var DEFAULT_TIMEOUT_MS2 = 12e4;
var DEFAULT_FIRST_TOKEN_TIMEOUT_MS = 9e4;
var DEFAULT_IDLE_TIMEOUT_MS = 6e4;
var DEFAULT_TOTAL_TIMEOUT_MS = 6e5;
var DEFAULT_CONTEXT_WINDOW = 128e3;
var MODEL_DISCOVERY_TIMEOUT_MS = 3e4;
var PROVIDER_FINGERPRINT_SALT_SECRET = "shuncode.providerFingerprintSalt";
function stringValue(value) {
  return typeof value === "string" ? value.trim() : "";
}
function integerValue(value, fallback, min, max) {
  return Number.isInteger(value) ? Math.max(min, Math.min(max, Number(value))) : fallback;
}
function optionalInteger(value, min, max) {
  if (value === void 0 || value === null || value === "") return void 0;
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isInteger(numeric) && numeric >= min && numeric <= max ? numeric : void 0;
}
function optionalNumber(value, min, max) {
  if (value === void 0 || value === null || value === "") return void 0;
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numeric) && numeric >= min && numeric <= max ? numeric : void 0;
}
function optionalBoolean(value) {
  return typeof value === "boolean" ? value : void 0;
}
function enumValue(value, allowed) {
  const normalized = stringValue(value);
  return allowed.includes(normalized) ? normalized : void 0;
}
function reasoningEffortValues(value, fallback = REASONING_EFFORTS) {
  const values = Array.isArray(value) ? value : typeof value === "string" ? value.split(/[\n,;]+/) : [];
  const normalized = [...new Set(values.map(item => typeof item === "string" ? item.trim() : "").filter(item => REASONING_EFFORTS.includes(item)))];
  return normalized.length ? normalized : [...fallback];
}
function reasoningEffortOptions(value, defaultEffort, fallback = REASONING_EFFORTS) {
  const options = reasoningEffortValues(value, fallback);
  if (defaultEffort && !options.includes(defaultEffort)) {
    options.push(defaultEffort);
  }
  return options;
}
function reasoningEffortLabel(value) {
  switch (value) {
    case "none":
      return "None";
    case "minimal":
      return "Minimal";
    case "low":
      return "Low";
    case "medium":
      return "Medium";
    case "high":
      return "High";
    case "xhigh":
      return "Extra High";
    case "max":
      return "Max";
    case "ultra":
      return "Ultra";
  }
}
function reasoningEffortDescription(value) {
  switch (value) {
    case "none":
      return "No reasoning where supported.";
    case "minimal":
      return "Minimal reasoning for compatible models.";
    case "low":
      return "Low reasoning effort for faster responses.";
    case "medium":
      return "Balanced reasoning effort.";
    case "high":
      return "High reasoning effort.";
    case "xhigh":
      return "Extra-high reasoning effort.";
    case "max":
      return "Maximum reasoning effort for models that support it.";
    case "ultra":
      return "Maximum reasoning with automatic task delegation where supported.";
  }
}
function objectValue(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? {
    ...value
  } : void 0;
}
function stringRecordValue(value) {
  const record4 = objectValue(value);
  if (!record4) return void 0;
  const entries = Object.entries(record4).filter(entry => typeof entry[1] === "string");
  return entries.length ? Object.fromEntries(entries) : void 0;
}
function stringArrayValue(value, maxItems) {
  if (typeof value === "string") return value.trim() ? [value.trim()] : void 0;
  if (!Array.isArray(value)) return void 0;
  const values = value.map(item => typeof item === "string" ? item.trim() : "").filter(Boolean).slice(0, maxItems);
  return values.length ? values : void 0;
}
function normalizeApiBaseUrl(baseUrl) {
  let normalized = baseUrl.trim().replace(/\/+$/, "");
  if (!normalized) throw new Error("ShunCode provider Base URL is empty.");
  if (normalized.endsWith("/chat/completions")) {
    normalized = normalized.slice(0, -"/chat/completions".length).replace(/\/+$/, "");
  } else if (normalized.endsWith("/responses")) {
    normalized = normalized.slice(0, -"/responses".length).replace(/\/+$/, "");
  } else if (normalized.endsWith("/v1/messages")) {
    normalized = normalized.slice(0, -"/v1/messages".length).replace(/\/+$/, "");
  } else if (normalized.endsWith("/messages")) {
    normalized = normalized.slice(0, -"/messages".length).replace(/\/+$/, "");
  }
  return normalizeOfficialDeepSeekApiBaseUrl(normalized);
}
function normalizeModelsUrl(baseUrl, clientVersion) {
  const url2 = new URL(`${normalizeApiBaseUrl(baseUrl)}/models`);
  if (clientVersion) url2.searchParams.set("client_version", clientVersion);
  return url2.toString();
}
function parseManualModelIds(value) {
  const text = stringValue(value);
  if (!text) return [];
  return [...new Set(text.split(/[\n,;]+/).map(item => item.trim()).filter(Boolean))];
}
function providerFingerprint(config2, salt) {
  return (0, import_node_crypto12.createHmac)("sha256", salt).update(JSON.stringify([config2.protocol, normalizeApiBaseUrl(config2.baseUrl), config2.apiKey ?? ""])).digest("hex").slice(0, 16);
}
function parseDiscoveredModels(payload, codex = false) {
  const source = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : Array.isArray(payload?.models) ? payload.models : Array.isArray(payload?.results) ? payload.results : [];
  const models = [];
  const seen = /* @__PURE__ */new Set();
  for (const item of source) {
    if (typeof item === "string") {
      const id2 = item.trim();
      if (id2 && !seen.has(id2)) {
        seen.add(id2);
        models.push({
          id: id2,
          name: id2
        });
      }
      continue;
    }
    if (!item || typeof item !== "object") continue;
    if (codex && item.supported_in_api === false) continue;
    if (codex && typeof item.visibility === "string" && item.visibility !== "list") continue;
    if (codex && Array.isArray(item.output_modalities) && !item.output_modalities.includes("text")) continue;
    const id = stringValue(item.slug) || stringValue(item.id) || stringValue(item.name) || stringValue(item.model);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    const supportedReasoning = Array.isArray(item.supported_reasoning_levels) ? [...new Set(item.supported_reasoning_levels.map(level => typeof level === "string" ? level : level && typeof level === "object" ? stringValue(level.effort) : "").filter(level => REASONING_EFFORTS.includes(level)))] : [];
    const defaultReasoningEffort = enumValue(item.default_reasoning_level, REASONING_EFFORTS);
    if (defaultReasoningEffort && !supportedReasoning.includes(defaultReasoningEffort)) supportedReasoning.push(defaultReasoningEffort);
    const inputModalities = Array.isArray(item.input_modalities) ? item.input_modalities.map(modality => stringValue(modality).toLowerCase()).filter(Boolean) : void 0;
    const serviceTiers = [];
    let serviceTierMetadataPresent = false;
    if (codex && Array.isArray(item.service_tiers)) {
      serviceTierMetadataPresent = true;
      for (const tier of item.service_tiers) {
        if (!tier || typeof tier !== "object") continue;
        const id2 = enumValue(tier.id, ["priority", "fast"]);
        const name = stringValue(tier.name);
        if (!id2 || name && name.toLowerCase() !== "fast") continue;
        serviceTiers.push({
          id: id2,
          name: name || "Fast",
          description: stringValue(tier.description) || void 0
        });
      }
    }
    if (codex && Array.isArray(item.additional_speed_tiers)) {
      serviceTierMetadataPresent = true;
      if (serviceTiers.length === 0 && item.additional_speed_tiers.some(tier => {
        const value = typeof tier === "string" ? tier : tier && typeof tier === "object" ? tier.id ?? tier.name : void 0;
        return stringValue(value).toLowerCase() === "fast";
      })) {
        serviceTiers.push({
          id: "priority",
          name: "Fast",
          description: "Faster responses with increased usage."
        });
      }
    }
    const defaultServiceTier = serviceTiers.length ? enumValue(item.default_service_tier, ["default", ...serviceTiers.map(tier => tier.id)]) ?? "default" : void 0;
    models.push({
      id,
      name: stringValue(item.display_name) || id,
      description: stringValue(item.description) || void 0,
      contextWindow: optionalInteger(item.context_window ?? item.max_context_window, 1024, 1e7),
      maxOutputTokens: optionalInteger(item.max_output_tokens, 1, 1e6),
      imageInput: inputModalities ? inputModalities.includes("image") : void 0,
      reasoningEfforts: supportedReasoning.length ? supportedReasoning : void 0,
      defaultReasoningEffort,
      serviceTiers: serviceTierMetadataPresent ? serviceTiers : void 0,
      defaultServiceTier
    });
  }
  return models;
}
function isTransientStatus(status) {
  return status === 408 || status === 409 || status === 425 || status === 429 || status >= 500;
}
async function delayForRetry(attempt, token) {
  if (token.isCancellationRequested) throw new vscode10.CancellationError();
  await new Promise(resolve => setTimeout(resolve, Math.min(2e3, 250 * 2 ** attempt)));
  if (token.isCancellationRequested) throw new vscode10.CancellationError();
}
async function fetchJsonWithRetries(url2, init, token, timeoutMs, retries, label) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    if (token.isCancellationRequested) throw new vscode10.CancellationError();
    const controller = new AbortController();
    const cancellation = token.onCancellationRequested(() => controller.abort());
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url2, {
        ...init,
        signal: controller.signal
      });
      const raw = await response.text();
      let payload;
      try {
        payload = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(`${label} returned non-JSON (${response.status}): ${raw.slice(0, 1e3)}`);
      }
      if (!response.ok) {
        const message = payload?.error?.message ?? payload?.message ?? `${label} failed with HTTP ${response.status}`;
        const error2 = new Error(String(message));
        if (attempt < retries && isTransientStatus(response.status)) {
          lastError = error2;
        } else {
          throw error2;
        }
      } else {
        return payload;
      }
    } catch (error2) {
      if (token.isCancellationRequested) throw new vscode10.CancellationError();
      lastError = error2;
      if (attempt >= retries) throw error2;
    } finally {
      clearTimeout(timeout);
      cancellation.dispose();
    }
    await delayForRetry(attempt, token);
  }
  throw lastError instanceof Error ? lastError : new Error(`${label} failed.`);
}
async function fetchStreamWithRetries(url2, init, token, timeoutMs, retries, label) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    if (token.isCancellationRequested) throw new vscode10.CancellationError();
    const controller = new AbortController();
    const cancellation = token.onCancellationRequested(() => controller.abort());
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url2, {
        ...init,
        signal: controller.signal
      });
      if (response.ok) return response;
      const raw = await response.text();
      let payload;
      try {
        payload = raw ? JSON.parse(raw) : {};
      } catch {
        payload = void 0;
      }
      const message = payload?.error?.message ?? payload?.message ?? `${label} failed with HTTP ${response.status}`;
      const error2 = Object.assign(new Error(String(message)), {
        status: response.status
      });
      if (!isTransientStatus(response.status) || attempt >= retries) throw error2;
      lastError = error2;
    } catch (error2) {
      if (token.isCancellationRequested) throw new vscode10.CancellationError();
      const status = typeof error2 === "object" && error2 !== null && "status" in error2 ? Number(error2.status) : void 0;
      if (status !== void 0 && Number.isFinite(status) && !isTransientStatus(status)) throw error2;
      lastError = error2;
      if (attempt >= retries) throw error2;
    } finally {
      clearTimeout(timeout);
      cancellation.dispose();
    }
    await delayForRetry(attempt, token);
  }
  throw lastError instanceof Error ? lastError : new Error(`${label} failed.`);
}
function emitChatCompletionMessage(message, progress) {
  if (!message) return;
  const reasoningText = typeof message.reasoning_content === "string" ? message.reasoning_content : typeof message.reasoning === "string" ? message.reasoning : void 0;
  if (reasoningText) progress.report(new vscode10.LanguageModelThinkingPart(reasoningText));
  if (typeof message.content === "string" && message.content) {
    progress.report(new vscode10.LanguageModelTextPart(message.content));
  }
  for (const call of Array.isArray(message.tool_calls) ? message.tool_calls : []) {
    const name = call?.function?.name;
    if (!name) continue;
    let input = {};
    try {
      input = JSON.parse(call?.function?.arguments ?? "{}");
    } catch {
      input = {};
    }
    progress.report(new vscode10.LanguageModelToolCallPart(call.id ?? `tool-${Date.now()}`, name, input));
  }
}
async function emitChatCompletionStream(response, progress, token) {
  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.includes("text/event-stream")) {
    const raw = await response.text();
    let payload;
    try {
      payload = raw ? JSON.parse(raw) : {};
    } catch {
      throw new Error(`Chat Completions endpoint returned non-JSON: ${raw.slice(0, 1e3)}`);
    }
    if (payload?.error) throw new Error(String(payload.error?.message ?? payload.error));
    emitChatCompletionMessage(payload?.choices?.[0]?.message, progress);
    return;
  }
  if (!response.body) throw new Error("Chat Completions endpoint returned an empty stream.");
  const reader = response.body.getReader();
  const cancellation = token.onCancellationRequested(() => {
    void reader.cancel();
  });
  const decoder = new TextDecoder();
  let buffer = "";
  const toolCalls = /* @__PURE__ */new Map();
  const processEvent = event => {
    const data = event.split(/\r?\n/).filter(line => line.startsWith("data:")).map(line => line.slice(5).trimStart()).join("\n").trim();
    if (!data) return false;
    if (data === "[DONE]") return true;
    let payload;
    try {
      payload = JSON.parse(data);
    } catch {
      throw new Error(`Chat Completions stream returned invalid JSON: ${data.slice(0, 1e3)}`);
    }
    if (payload?.error) throw new Error(String(payload.error?.message ?? payload.error));
    for (const choice of Array.isArray(payload?.choices) ? payload.choices : []) {
      const delta = choice?.delta ?? choice?.message;
      if (!delta) continue;
      const reasoningText = typeof delta.reasoning_content === "string" ? delta.reasoning_content : typeof delta.reasoning === "string" ? delta.reasoning : void 0;
      if (reasoningText) progress.report(new vscode10.LanguageModelThinkingPart(reasoningText));
      if (typeof delta.content === "string" && delta.content) {
        progress.report(new vscode10.LanguageModelTextPart(delta.content));
      }
      for (const [fallbackIndex, call] of (Array.isArray(delta.tool_calls) ? delta.tool_calls : []).entries()) {
        const index = Number.isInteger(call?.index) ? call.index : fallbackIndex;
        const current = toolCalls.get(index) ?? {
          arguments: ""
        };
        if (typeof call?.id === "string" && call.id) current.id = call.id;
        if (typeof call?.function?.name === "string" && call.function.name) current.name = call.function.name;
        if (typeof call?.function?.arguments === "string") current.arguments += call.function.arguments;
        toolCalls.set(index, current);
      }
    }
    return false;
  };
  try {
    let done = false;
    while (!done) {
      if (token.isCancellationRequested) {
        await reader.cancel();
        throw new vscode10.CancellationError();
      }
      const chunk = await reader.read();
      if (chunk.done) break;
      buffer += decoder.decode(chunk.value, {
        stream: true
      });
      const events = buffer.split(/\r?\n\r?\n/);
      buffer = events.pop() ?? "";
      for (const event of events) {
        if (processEvent(event)) {
          done = true;
          break;
        }
      }
    }
    if (token.isCancellationRequested) throw new vscode10.CancellationError();
    buffer += decoder.decode();
    if (buffer.trim()) processEvent(buffer);
  } finally {
    cancellation.dispose();
    reader.releaseLock();
  }
  for (const [index, call] of [...toolCalls.entries()].sort((a, b) => a[0] - b[0])) {
    if (!call.name) continue;
    let input = {};
    try {
      input = JSON.parse(call.arguments || "{}");
    } catch {
      input = {};
    }
    progress.report(new vscode10.LanguageModelToolCallPart(call.id ?? `tool-${Date.now()}-${index}`, call.name, input));
  }
}
function textFromPart(part) {
  if (!part) return void 0;
  if (typeof part === "string") return part;
  if (typeof part.value === "string") return part.value;
  if (part.value && typeof part.value.value === "string") return part.value.value;
  return void 0;
}
function thinkingTextFromPart(part) {
  if (!(part instanceof vscode10.LanguageModelThinkingPart)) return void 0;
  if (typeof part.value === "string") return part.value;
  return Array.isArray(part.value) ? part.value.filter(value => typeof value === "string").join("") : void 0;
}
function estimatedTokens(value) {
  const text = typeof value === "string" ? value : JSON.stringify(value ?? "");
  let estimate = 0;
  for (const character of text) estimate += (character.codePointAt(0) ?? 0) <= 127 ? 0.25 : 1;
  return Math.max(1, Math.ceil(estimate));
}
function imageFromPart(part) {
  if (!part || typeof part.mimeType !== "string" || !part.mimeType.startsWith("image/") || !part.data) return void 0;
  const bytes = part.data instanceof Uint8Array ? part.data : new Uint8Array(part.data);
  if (bytes.byteLength === 0) return void 0;
  return {
    type: "image_url",
    image_url: {
      url: `data:${part.mimeType};base64,${Buffer.from(bytes).toString("base64")}`
    }
  };
}
function responsesImageFromPart(part) {
  const image = imageFromPart(part);
  return image ? {
    type: "input_image",
    image_url: image.image_url.url
  } : void 0;
}
function toOpenAIMessages(messages, options) {
  const result = [];
  for (const message of messages) {
    const isAssistant = message.role === vscode10.LanguageModelChatMessageRole.Assistant;
    const texts = [];
    const userContent = [];
    const toolCalls = [];
    const toolResults = [];
    const reasoningTexts = [];
    for (const part of message.content ?? []) {
      if (part instanceof vscode10.LanguageModelToolCallPart || part && typeof part.callId === "string" && typeof part.name === "string" && part.input !== void 0) {
        toolCalls.push({
          id: part.callId,
          type: "function",
          function: {
            name: part.name,
            arguments: JSON.stringify(part.input ?? {})
          }
        });
        continue;
      }
      if (part instanceof vscode10.LanguageModelToolResultPart || part && typeof part.callId === "string" && Array.isArray(part.content)) {
        const content = (part.content ?? []).map(value => textFromPart(value) ?? JSON.stringify(value)).join("\n");
        toolResults.push({
          role: "tool",
          tool_call_id: part.callId,
          content
        });
        continue;
      }
      const thinkingText = thinkingTextFromPart(part);
      if (thinkingText !== void 0 && isAssistant) {
        if (options.preserveReasoningContent) reasoningTexts.push(thinkingText);else if (thinkingText) texts.push(thinkingText);
        continue;
      }
      const image = imageFromPart(part);
      if (image) {
        userContent.push(image);
        continue;
      }
      const text = textFromPart(part);
      if (text) {
        texts.push(text);
        userContent.push({
          type: "text",
          text
        });
      }
    }
    if (isAssistant) {
      result.push({
        role: "assistant",
        content: texts.join("\n") || (options.preserveReasoningContent && toolCalls.length ? "" : null),
        ...(options.preserveReasoningContent && (reasoningTexts.length || toolCalls.length) ? {
          reasoning_content: reasoningTexts.join("")
        } : {}),
        ...(toolCalls.length ? {
          tool_calls: toolCalls
        } : {})
      });
    } else {
      if (userContent.length) {
        const hasImage = userContent.some(part => part.type === "image_url");
        result.push({
          role: "user",
          content: hasImage ? userContent : texts.join("\n")
        });
      }
      result.push(...toolResults);
    }
  }
  return result;
}
function anthropicSourceFromImageUrl(url2) {
  const trimmed = url2.trim();
  const dataUrl = /^data:([^;,]+);base64,(.*)$/s.exec(trimmed);
  if (dataUrl) return {
    type: "base64",
    media_type: dataUrl[1],
    data: dataUrl[2]
  };
  if (/^https?:\/\//i.test(trimmed)) return {
    type: "url",
    url: trimmed
  };
  return void 0;
}
function toAnthropicChatMessages(messages) {
  const output = [];
  const pushUserBlocks = blocks => {
    if (!blocks.length) return;
    const previous = output[output.length - 1];
    if (previous && previous.role === "user") {
      previous.content = [...previous.content, ...blocks];
      return;
    }
    output.push({
      role: "user",
      content: blocks
    });
  };
  for (const message of messages) {
    const isAssistant = message.role === vscode10.LanguageModelChatMessageRole.Assistant;
    const blocks = [];
    const toolResults = [];
    for (const part of message.content ?? []) {
      if (part instanceof vscode10.LanguageModelToolCallPart || part && typeof part.callId === "string" && typeof part.name === "string" && part.input !== void 0) {
        blocks.push({
          type: "tool_use",
          id: part.callId,
          name: part.name,
          input: part.input ?? {}
        });
        continue;
      }
      if (part instanceof vscode10.LanguageModelToolResultPart || part && typeof part.callId === "string" && Array.isArray(part.content)) {
        const content = (part.content ?? []).map(value => textFromPart(value) ?? JSON.stringify(value)).join("\n");
        toolResults.push({
          type: "tool_result",
          tool_use_id: part.callId,
          content
        });
        continue;
      }
      const image = imageFromPart(part);
      if (image) {
        const source = anthropicSourceFromImageUrl(image.image_url?.url ?? "");
        if (source) blocks.push({
          type: "image",
          source
        });
        continue;
      }
      const text = textFromPart(part);
      if (text) blocks.push({
        type: "text",
        text
      });
    }
    if (isAssistant) {
      if (blocks.length) output.push({
        role: "assistant",
        content: blocks
      });
      continue;
    }
    if (toolResults.length) {
      pushUserBlocks(toolResults);
      pushUserBlocks(blocks);
      continue;
    }
    pushUserBlocks(blocks);
  }
  return {
    messages: output
  };
}
function toResponsesInput(messages) {
  const result = [];
  for (const message of messages) {
    const isAssistant = message.role === vscode10.LanguageModelChatMessageRole.Assistant;
    const content = [];
    const toolCalls = [];
    const toolResults = [];
    for (const part of message.content ?? []) {
      if (part instanceof vscode10.LanguageModelToolCallPart || part && typeof part.callId === "string" && typeof part.name === "string" && part.input !== void 0) {
        toolCalls.push({
          type: "function_call",
          call_id: part.callId,
          name: part.name,
          arguments: JSON.stringify(part.input ?? {})
        });
        continue;
      }
      if (part instanceof vscode10.LanguageModelToolResultPart || part && typeof part.callId === "string" && Array.isArray(part.content)) {
        const output = (part.content ?? []).map(value => textFromPart(value) ?? JSON.stringify(value)).join("\n");
        toolResults.push({
          type: "function_call_output",
          call_id: part.callId,
          output
        });
        continue;
      }
      const image = responsesImageFromPart(part);
      if (image) {
        if (!isAssistant) content.push(image);
        continue;
      }
      const text = textFromPart(part);
      if (text) content.push({
        type: isAssistant ? "output_text" : "input_text",
        text
      });
    }
    if (content.length) {
      result.push({
        role: isAssistant ? "assistant" : "user",
        content
      });
    }
    result.push(...toolCalls, ...toolResults);
  }
  return result;
}
function toCodexResponsesInput(messages) {
  return toResponsesInput(messages).map(message => {
    if (message.type === "function_call" || message.type === "function_call_output") return message;
    const content = typeof message.content === "string" ? [{
      type: message.role === "assistant" ? "output_text" : "input_text",
      text: message.content
    }] : Array.isArray(message.content) ? message.content : [];
    return {
      type: "message",
      role: message.role,
      content
    };
  });
}
function codexReasoningEffort(effort) {
  if (!effort || effort === "none") return void 0;
  return effort;
}
function extractResponsesOutputText(response) {
  const texts = [];
  for (const item of Array.isArray(response?.output) ? response.output : []) {
    if (item?.type !== "message") continue;
    for (const content of Array.isArray(item.content) ? item.content : []) {
      if (content?.type === "output_text" && typeof content.text === "string") texts.push(content.text);
      if (content?.type === "refusal" && typeof content.refusal === "string") texts.push(content.refusal);
    }
  }
  return texts.join("");
}
async function emitResponsesStream(response, progress, token) {
  if (!response.body) throw new Error("Codex Responses endpoint returned an empty stream.");
  const reader = response.body.getReader();
  const cancellation = token.onCancellationRequested(() => {
    void reader.cancel();
  });
  const decoder = new TextDecoder();
  let buffer = "";
  let emittedText = false;
  const callArguments = /* @__PURE__ */new Map();
  const emittedCalls = /* @__PURE__ */new Set();
  const emitCall = key => {
    const call = callArguments.get(key);
    if (!call || !call.name || emittedCalls.has(key)) return;
    emittedCalls.add(key);
    let input = {};
    try {
      input = JSON.parse(call.arguments || "{}");
    } catch {
      input = {};
    }
    progress.report(new vscode10.LanguageModelToolCallPart(call.callId ?? key, call.name, input));
  };
  const handleEvent = payload => {
    const type = typeof payload?.type === "string" ? payload.type : "";
    switch (type) {
      case "response.output_text.delta":
        {
          if (typeof payload.delta === "string" && payload.delta) {
            emittedText = true;
            progress.report(new vscode10.LanguageModelTextPart(payload.delta));
          }
          break;
        }
      case "response.reasoning_summary_text.delta":
      case "response.reasoning_text.delta":
        {
          if (typeof payload.delta === "string" && payload.delta) {
            progress.report(new vscode10.LanguageModelThinkingPart(payload.delta));
          }
          break;
        }
      case "response.function_call_arguments.delta":
        {
          const key = typeof payload.item_id === "string" ? payload.item_id : `fc-${payload.output_index ?? 0}`;
          const current = callArguments.get(key) ?? {
            arguments: ""
          };
          if (typeof payload.delta === "string") current.arguments += payload.delta;
          callArguments.set(key, current);
          break;
        }
      case "response.output_item.done":
        {
          const item = payload?.item;
          if (item?.type === "function_call" && typeof item.name === "string") {
            const key = typeof item.id === "string" ? item.id : typeof item.call_id === "string" ? item.call_id : `fc-${callArguments.size}`;
            const current = callArguments.get(key) ?? {
              arguments: ""
            };
            current.name = item.name;
            current.callId = typeof item.call_id === "string" ? item.call_id : current.callId;
            if (typeof item.arguments === "string") current.arguments = item.arguments;
            callArguments.set(key, current);
            emitCall(key);
          }
          break;
        }
      case "response.completed":
        {
          if (!emittedText) {
            const snapshotText = extractResponsesOutputText(payload?.response ?? payload);
            if (snapshotText) {
              emittedText = true;
              progress.report(new vscode10.LanguageModelTextPart(snapshotText));
            }
          }
          break;
        }
      case "error":
        {
          throw new Error(typeof payload?.message === "string" ? payload.message : "Codex Responses stream error.");
        }
    }
  };
  const processEvent = event => {
    const data = event.split(/\r?\n/).filter(line => line.startsWith("data:")).map(line => line.slice(5).trimStart()).join("\n").trim();
    if (!data) return;
    let payload;
    try {
      payload = JSON.parse(data);
    } catch {
      throw new Error(`Codex Responses stream returned invalid JSON: ${data.slice(0, 1e3)}`);
    }
    handleEvent(payload);
  };
  try {
    while (true) {
      if (token.isCancellationRequested) {
        await reader.cancel();
        throw new vscode10.CancellationError();
      }
      const chunk = await reader.read();
      if (chunk.done) break;
      buffer += decoder.decode(chunk.value, {
        stream: true
      });
      const events = buffer.split(/\r?\n\r?\n/);
      buffer = events.pop() ?? "";
      for (const event of events) processEvent(event);
    }
    if (token.isCancellationRequested) throw new vscode10.CancellationError();
    buffer += decoder.decode();
    if (buffer.trim()) processEvent(buffer);
  } finally {
    cancellation.dispose();
    reader.releaseLock();
  }
  for (const [key, call] of callArguments) emitCall(key);
}
function modelConfigurationSchema(config2) {
  const reasoningOptions = config2.deepSeek || config2.codex ? [...config2.reasoningEfforts] : [... /* @__PURE__ */new Set([...REASONING_EFFORTS, ...config2.reasoningEfforts])];
  if (config2.deepSeek) {
    const defaultEffort = config2.thinking === "disabled" ? "disabled" : config2.reasoningEffort ?? DEEPSEEK_DEFAULT_REASONING_EFFORT;
    return {
      properties: {
        reasoningEffort: {
          type: "string",
          title: "Thinking Effort",
          group: "navigation",
          enum: ["disabled", ...reasoningOptions],
          enumItemLabels: ["Disabled", ...reasoningOptions.map(reasoningEffortLabel)],
          enumDescriptions: ["Disable thinking mode.", ...reasoningOptions.map(reasoningEffortDescription)],
          default: defaultEffort
        }
      }
    };
  }
  if (config2.codex) {
    const properties2 = {
      reasoningEffort: {
        type: "string",
        title: "Thinking Effort",
        group: "navigation",
        enum: ["inherit", ...reasoningOptions],
        enumItemLabels: ["Account Default", ...reasoningOptions.map(reasoningEffortLabel)],
        enumDescriptions: ["Use the default thinking effort for this Codex model.", ...reasoningOptions.map(reasoningEffortDescription)],
        default: "inherit"
      }
    };
    if (config2.serviceTiers?.length) {
      properties2.serviceTier = {
        type: "string",
        title: "Speed",
        group: "speed",
        enum: ["default", ...config2.serviceTiers.map(tier => tier.id)],
        enumItemLabels: ["Standard", ...config2.serviceTiers.map(tier => tier.name)],
        enumDescriptions: ["Use standard Codex processing.", ...config2.serviceTiers.map(tier => tier.description ?? "Use the faster Codex service tier with increased usage.")],
        default: config2.serviceTier ?? "default"
      };
    }
    return {
      properties: properties2
    };
  }
  const genericReasoningValues = genericReasoningPickerValues(reasoningOptions);
  const properties = {
    reasoningEffort: {
      type: "string",
      title: "Thinking Effort",
      group: "navigation",
      enum: genericReasoningValues,
      enumItemLabels: ["Provider Default", "Enabled", "Disabled", ...reasoningOptions.map(reasoningEffortLabel)],
      enumDescriptions: ["Use the provider's configured thinking mode and effort.", "Enable thinking while keeping the provider's configured effort.", "Disable reasoning parameters for this request.", ...reasoningOptions.map(reasoningEffortDescription)],
      default: "inherit"
    }
  };
  return {
    properties
  };
}
function inheritedEnum(value, allowed, fallback) {
  const normalized = stringValue(value);
  if (!normalized || normalized === "inherit") return fallback;
  return enumValue(normalized, allowed) ?? fallback;
}
function resolveRequestConfig(base, modelConfiguration) {
  if (!modelConfiguration) return base;
  const allowedReasoningEfforts = base.reasoningEfforts;
  const deepSeekSelection = base.deepSeek ? resolveDeepSeekThinkingEffort(modelConfiguration.reasoningEffort) : void 0;
  const genericSelection = !base.deepSeek && !base.codex ? resolveGenericReasoningOverride(modelConfiguration.reasoningEffort, allowedReasoningEfforts, base.reasoningEffort) : void 0;
  let resolvedThinking;
  let reasoningEffort;
  if (deepSeekSelection) {
    resolvedThinking = deepSeekSelection.thinking;
    reasoningEffort = deepSeekSelection.reasoningEffort;
  } else if (genericSelection) {
    resolvedThinking = genericSelection.thinking;
    reasoningEffort = genericSelection.reasoningEffort;
  } else {
    resolvedThinking = inheritedEnum(modelConfiguration.thinking, THINKING_MODES, base.thinking);
    reasoningEffort = inheritedEnum(modelConfiguration.reasoningEffort, allowedReasoningEfforts, base.reasoningEffort);
  }
  if (!base.deepSeek && resolvedThinking === "enabled" && !reasoningEffort) {
    reasoningEffort = "medium";
  }
  const allowedServiceTiers = base.codex && base.serviceTiers?.length ? ["default", ...base.serviceTiers.map(tier => tier.id)] : ["auto", "default", "flex", "scale", "priority", "fast"];
  return {
    ...base,
    thinking: resolvedThinking,
    contextWindow: optionalInteger(modelConfiguration.contextSize ?? modelConfiguration.contextWindow, 1024, 1e7) ?? base.contextWindow,
    maxOutputTokens: optionalInteger(modelConfiguration.maxOutputTokens, 1, 1e6) ?? base.maxOutputTokens,
    firstTokenTimeoutMs: optionalInteger(modelConfiguration.firstTokenTimeoutMs, 1e3, 18e5) ?? base.firstTokenTimeoutMs,
    idleTimeoutMs: optionalInteger(modelConfiguration.idleTimeoutMs, 1e3, 18e5) ?? base.idleTimeoutMs,
    totalTimeoutMs: optionalInteger(modelConfiguration.totalTimeoutMs, 1e3, 18e5) ?? base.totalTimeoutMs,
    reasoningEffort,
    reasoningEfforts: reasoningEffortOptions(modelConfiguration.reasoningEfforts, reasoningEffort, allowedReasoningEfforts),
    reasoningSummary: inheritedEnum(modelConfiguration.reasoningSummary, ["auto", "concise", "detailed"], base.reasoningSummary),
    reasoningContext: inheritedEnum(modelConfiguration.reasoningContext, ["auto", "current_turn", "all_turns"], base.reasoningContext),
    reasoningMode: inheritedEnum(modelConfiguration.reasoningMode, ["standard", "pro"], base.reasoningMode),
    verbosity: inheritedEnum(modelConfiguration.verbosity, ["low", "medium", "high"], base.verbosity),
    temperature: optionalNumber(modelConfiguration.temperature, 0, 2) ?? base.temperature,
    topP: optionalNumber(modelConfiguration.topP, 0, 1) ?? base.topP,
    parallelToolCalls: optionalBoolean(modelConfiguration.parallelToolCalls) ?? base.parallelToolCalls,
    maxToolCalls: optionalInteger(modelConfiguration.maxToolCalls, 1, 128) ?? base.maxToolCalls,
    serviceTier: inheritedEnum(modelConfiguration.serviceTier, allowedServiceTiers, base.serviceTier),
    store: optionalBoolean(modelConfiguration.store) ?? base.store,
    truncation: inheritedEnum(modelConfiguration.truncation, ["auto", "disabled"], base.truncation),
    promptCacheKey: stringValue(modelConfiguration.promptCacheKey) || base.promptCacheKey,
    promptCacheMode: inheritedEnum(modelConfiguration.promptCacheMode, ["implicit", "explicit"], base.promptCacheMode),
    promptCacheTtl: inheritedEnum(modelConfiguration.promptCacheTtl, ["30m"], base.promptCacheTtl),
    promptCacheRetention: inheritedEnum(modelConfiguration.promptCacheRetention, ["in_memory", "24h"], base.promptCacheRetention),
    safetyIdentifier: stringValue(modelConfiguration.safetyIdentifier) || base.safetyIdentifier,
    seed: optionalInteger(modelConfiguration.seed, -2147483648, 2147483647) ?? base.seed,
    presencePenalty: optionalNumber(modelConfiguration.presencePenalty, -2, 2) ?? base.presencePenalty,
    frequencyPenalty: optionalNumber(modelConfiguration.frequencyPenalty, -2, 2) ?? base.frequencyPenalty,
    stop: stringArrayValue(modelConfiguration.stop, 4) ?? base.stop,
    responseFormat: objectValue(modelConfiguration.responseFormat) ?? base.responseFormat,
    requestMetadata: stringRecordValue(modelConfiguration.requestMetadata) ?? base.requestMetadata,
    extraBody: {
      ...(base.extraBody ?? {}),
      ...(objectValue(modelConfiguration.extraBody) ?? {})
    }
  };
}
var PROTECTED_REQUEST_KEYS = /* @__PURE__ */new Set(["model", "messages", "input", "instructions", "tools", "tool_choice", "stream", "background", "service_tier"]);
function safeExtraBody(value) {
  if (!value) return {};
  return Object.fromEntries(Object.entries(value).filter(([key]) => !PROTECTED_REQUEST_KEYS.has(key)));
}
var ShunCodeLanguageModelProvider = class {
  constructor(context, providerMode = "api") {
    this.context = context;
    this.providerMode = providerMode;
  }
  context;
  providerMode;
  changeEmitter = new vscode10.EventEmitter();
  runtimeModels = /* @__PURE__ */new Map();
  /**
   * Last successful model discovery per provider fingerprint. A failed or empty
   * re-discovery falls back to this list so a transient network/auth failure can
   * never wipe the model picker (VS Code clears the vendor's cached models when
   * the provider rejects or returns nothing).
   */
  discoveredModelCache = /* @__PURE__ */new Map();
  onDidChangeLanguageModelChatInformation = this.changeEmitter.event;
  refresh() {
    this.changeEmitter.fire();
  }
  async getProviderFingerprintSalt() {
    const existing = await this.context.secrets.get(PROVIDER_FINGERPRINT_SALT_SECRET);
    if (existing?.trim()) return existing;
    const generated = (0, import_node_crypto12.randomBytes)(32).toString("hex");
    await this.context.secrets.store(PROVIDER_FINGERPRINT_SALT_SECRET, generated);
    return generated;
  }
  async legacyRuntimeModel(modelOverride) {
    const legacy = await getShunCodeModelConfig(this.context);
    const baseUrl = normalizeApiBaseUrl(legacy.baseUrl);
    const deepSeek = isOfficialDeepSeekApiBaseUrl(baseUrl);
    return {
      protocol: "openai-chat-completions",
      baseUrl,
      apiKey: legacy.apiKey,
      model: modelOverride || legacy.model,
      timeoutMs: DEFAULT_TIMEOUT_MS2,
      firstTokenTimeoutMs: DEFAULT_FIRST_TOKEN_TIMEOUT_MS,
      idleTimeoutMs: DEFAULT_IDLE_TIMEOUT_MS,
      totalTimeoutMs: DEFAULT_TOTAL_TIMEOUT_MS,
      retries: 0,
      contextWindow: deepSeek ? DEEPSEEK_CONTEXT_WINDOW_TOKENS : DEFAULT_CONTEXT_WINDOW,
      maxOutputTokens: deepSeek ? DEEPSEEK_MAX_OUTPUT_TOKENS : void 0,
      thinking: "enabled",
      reasoningEffort: deepSeek ? DEEPSEEK_DEFAULT_REASONING_EFFORT : "medium",
      reasoningEfforts: deepSeek ? [...DEEPSEEK_REASONING_EFFORTS] : [...REASONING_EFFORTS],
      deepSeek,
      codex: false,
      imageInput: true,
      providerKey: "legacy",
      legacy: true
    };
  }
  configuredRuntimeBase(configuration) {
    const protocol = enumValue(configuration.protocol, ["openai-chat-completions", "openai-responses", "anthropic-messages"]) ?? "openai-chat-completions";
    const baseUrl = normalizeApiBaseUrl(stringValue(configuration.baseUrl));
    const deepSeek = protocol === "openai-chat-completions" && isOfficialDeepSeekApiBaseUrl(baseUrl);
    const defaultReasoningEfforts = deepSeek ? DEEPSEEK_REASONING_EFFORTS : REASONING_EFFORTS;
    const reasoningEffort = enumValue(configuration.reasoningEffort, defaultReasoningEfforts) ?? (deepSeek ? DEEPSEEK_DEFAULT_REASONING_EFFORT : "medium");
    const legacyTimeoutMs = integerValue(configuration.timeoutMs, DEFAULT_TIMEOUT_MS2, 1e3, 3e5);
    return {
      protocol,
      baseUrl,
      apiKey: stringValue(configuration.apiKey) || void 0,
      timeoutMs: legacyTimeoutMs,
      firstTokenTimeoutMs: integerValue(configuration.firstTokenTimeoutMs, Math.min(DEFAULT_FIRST_TOKEN_TIMEOUT_MS, legacyTimeoutMs), 1e3, 18e5),
      idleTimeoutMs: integerValue(configuration.idleTimeoutMs, Math.min(DEFAULT_IDLE_TIMEOUT_MS, legacyTimeoutMs), 1e3, 18e5),
      totalTimeoutMs: integerValue(configuration.totalTimeoutMs, Math.max(DEFAULT_TOTAL_TIMEOUT_MS, legacyTimeoutMs), 1e3, 18e5),
      retries: integerValue(configuration.retries, 2, 0, 5),
      contextWindow: integerValue(configuration.contextWindow, DEFAULT_API_CONTEXT_WINDOW, 1024, 1e7),
      maxOutputTokens: optionalInteger(configuration.maxOutputTokens, 1, 1e6) ?? DEFAULT_API_MAX_OUTPUT_TOKENS,
      description: stringValue(configuration.description) || void 0,
      thinking: enumValue(configuration.thinking, THINKING_MODES) ?? "enabled",
      reasoningEffort,
      reasoningEfforts: reasoningEffortOptions(configuration.reasoningEfforts, reasoningEffort, defaultReasoningEfforts),
      deepSeek,
      codex: false,
      imageInput: true
    };
  }
  codexRuntimeBase() {
    return {
      protocol: "openai-responses",
      baseUrl: CODEX_API_BASE_URL,
      timeoutMs: DEFAULT_TIMEOUT_MS2,
      firstTokenTimeoutMs: DEFAULT_FIRST_TOKEN_TIMEOUT_MS,
      idleTimeoutMs: DEFAULT_IDLE_TIMEOUT_MS,
      totalTimeoutMs: DEFAULT_TOTAL_TIMEOUT_MS,
      retries: 2,
      contextWindow: DEFAULT_CODEX_CONTEXT_WINDOW,
      reasoningEffort: "medium",
      reasoningEfforts: ["low", "medium", "high", "xhigh", "max", "ultra"],
      serviceTier: "default",
      serviceTiers: [{
        id: "priority",
        name: "Fast",
        description: "Faster responses with increased usage."
      }],
      deepSeek: false,
      codex: true,
      imageInput: true,
      description: "ChatGPT subscription"
    };
  }
  async discoverModels(base, token, manualModelIds = []) {
    if (manualModelIds.length > 0) {
      return manualModelIds.map(id => ({
        id,
        name: id
      }));
    }
    if (base.codex) {
      let auth;
      try {
        auth = await codexAuthManager.getRequestContext();
      } catch {
        return [];
      }
      const headers2 = {
        accept: "application/json",
        authorization: `Bearer ${auth.accessToken}`,
        "ChatGPT-Account-ID": auth.accountId,
        originator: CODEX_ORIGINATOR,
        "User-Agent": CODEX_USER_AGENT,
        "OpenAI-Beta": CODEX_BETA_HEADER
      };
      const payload2 = await fetchJsonWithRetries(normalizeModelsUrl(base.baseUrl, CODEX_CLIENT_VERSION), {
        method: "GET",
        headers: headers2
      }, token, Math.min(base.timeoutMs, MODEL_DISCOVERY_TIMEOUT_MS), base.retries, "Codex model discovery");
      const models2 = parseDiscoveredModels(payload2, true);
      if (models2.length === 0) {
        throw new Error("Codex model discovery returned no compatible text model IDs.");
      }
      return models2;
    }
    const headers = {
      accept: "application/json"
    };
    if (base.apiKey?.trim()) headers.authorization = `Bearer ${base.apiKey.trim()}`;
    if (base.protocol === "anthropic-messages") {
      if (base.apiKey?.trim()) headers["x-api-key"] = base.apiKey.trim();
      headers["anthropic-version"] = ANTHROPIC_API_VERSION;
    }
    const payload = await fetchJsonWithRetries(base.protocol === "anthropic-messages" ? normalizeAnthropicModelsUrl(base.baseUrl) : normalizeModelsUrl(base.baseUrl), {
      method: "GET",
      headers
    }, token, Math.min(base.timeoutMs, MODEL_DISCOVERY_TIMEOUT_MS), base.retries, "Model discovery");
    const models = parseDiscoveredModels(payload);
    if (models.length === 0) {
      throw new Error("Model discovery succeeded but returned no model IDs. Enter Model IDs manually for endpoints that do not expose GET /models.");
    }
    return models;
  }
  async resolveRuntimeModel(modelId, modelConfiguration) {
    let resolved;
    if (modelId) {
      const normalizedId = normalizeProviderModelId(modelId, this.providerMode === "codex" ? "shuncode-codex" : "shuncode");
      resolved = this.runtimeModels.get(normalizedId);
      if (!resolved && normalizedId !== modelId) {
        resolved = this.runtimeModels.get(modelId);
      }
      if (!resolved) {
        if (normalizedId.includes(MODEL_ID_SEPARATOR)) return void 0;
        resolved = await this.legacyRuntimeModel(normalizedId);
      }
    } else if (this.providerMode === "api") {
      resolved = await this.legacyRuntimeModel();
    } else {
      return void 0;
    }
    return resolveRequestConfig({
      ...resolved
    }, modelConfiguration);
  }
  async provideLanguageModelChatInformation(options, token) {
    const configuration = options?.configuration;
    if (this.providerMode === "api" && (!configuration || !stringValue(configuration.baseUrl))) {
      return [];
    }
    const base = this.providerMode === "codex" ? this.codexRuntimeBase() : this.configuredRuntimeBase(configuration);
    const providerKey = providerFingerprint(base, await this.getProviderFingerprintSalt());
    const modelNamespace = providerKey;
    const manualModelIds = parseManualModelIds(configuration?.modelIds);
    let discoveredModels;
    try {
      discoveredModels = await this.discoverModels(base, token, manualModelIds);
    } catch (error2) {
      const cached2 = this.discoveredModelCache.get(modelNamespace);
      if (!cached2) throw error2;
      discoveredModels = cached2;
    }
    if (discoveredModels.length === 0) {
      const cached2 = this.discoveredModelCache.get(modelNamespace);
      if (!cached2?.length) return [];
      discoveredModels = cached2;
    } else {
      this.discoveredModelCache.set(modelNamespace, discoveredModels);
      if (this.discoveredModelCache.size > 64) {
        const oldestKey = this.discoveredModelCache.keys().next().value;
        if (oldestKey !== void 0) {
          this.discoveredModelCache.delete(oldestKey);
        }
      }
    }
    deleteRuntimeModelsForNamespace(this.runtimeModels, modelNamespace);
    return discoveredModels.map((discoveredModel, index) => {
      const rawModelId = discoveredModel.id;
      let id = encodedModelId(modelNamespace, rawModelId);
      let suffix = 2;
      while (this.runtimeModels.has(id)) {
        id = encodedModelId(`${modelNamespace}-${suffix}`, rawModelId);
        suffix += 1;
      }
      const reasoningEfforts = discoveredModel.reasoningEfforts?.length ? [...discoveredModel.reasoningEfforts] : [...base.reasoningEfforts];
      const reasoningEffort = discoveredModel.defaultReasoningEffort ?? (base.reasoningEffort && reasoningEfforts.includes(base.reasoningEffort) ? base.reasoningEffort : reasoningEfforts[0]);
      const serviceTiers = discoveredModel.serviceTiers !== void 0 ? discoveredModel.serviceTiers : base.serviceTiers;
      const config2 = {
        ...base,
        model: rawModelId,
        providerKey,
        contextWindow: discoveredModel.contextWindow ?? base.contextWindow,
        maxOutputTokens: discoveredModel.maxOutputTokens ?? base.maxOutputTokens,
        reasoningEffort,
        reasoningEfforts,
        serviceTier: serviceTiers?.length ? discoveredModel.defaultServiceTier ?? "default" : void 0,
        serviceTiers,
        imageInput: true,
        description: discoveredModel.description ?? base.description
      };
      this.runtimeModels.set(id, config2);
      return {
        id,
        name: discoveredModel.name,
        family: rawModelId,
        version: "configured",
        tooltip: discoveredModel.description || `${rawModelId} \xB7 ${base.baseUrl}`,
        detail: discoveredModel.description || base.description || `${base.codex ? "Codex" : "Chat Completions"} \xB7 ${base.baseUrl}`,
        maxInputTokens: config2.contextWindow,
        // Generic API providers always carry an explicit output budget from
        // DEFAULT_API_MAX_OUTPUT_TOKENS; this fallback only covers Codex models.
        maxOutputTokens: config2.maxOutputTokens ?? Math.min(32768, Math.max(4096, Math.floor(config2.contextWindow / 4))),
        capabilities: {
          toolCalling: true,
          imageInput: config2.imageInput
        },
        configurationSchema: modelConfigurationSchema(config2),
        isBYOK: true,
        isDefault: false,
        isUserSelectable: true,
        _shuncodeRuntimeConfig: config2,
        _shuncodeProviderOrder: index
      };
    });
  }
  async provideTokenCount(_model, input, token) {
    if (token.isCancellationRequested) throw new vscode10.CancellationError();
    const text = typeof input === "string" ? input : Array.isArray(input?.content) ? input.content.map(part => textFromPart(part) ?? JSON.stringify(part)).join("\n") : String(input ?? "");
    return Math.max(1, Math.ceil(text.length / 4));
  }
  async provideLanguageModelChatResponse(model, messages, options, progress, token) {
    const baseConfig = model?._shuncodeRuntimeConfig ?? (await this.resolveRuntimeModel(typeof model?.id === "string" ? model.id : void 0));
    if (!baseConfig) {
      throw new Error("The selected ShunCode API provider is no longer available. Refresh the provider or select another model.");
    }
    const config2 = resolveRequestConfig(baseConfig, objectValue(options?.modelConfiguration));
    if (config2.codex) {
      await this.provideCodexChatResponse(config2, messages, options, progress, token);
      return;
    }
    const headers = {
      "content-type": "application/json",
      accept: "text/event-stream"
    };
    if (config2.apiKey?.trim()) headers.authorization = `Bearer ${config2.apiKey.trim()}`;
    const rawTools = Array.isArray(options?.tools) ? options.tools : [];
    const toolChoice = rawTools.length ? options?.toolMode === vscode10.LanguageModelChatToolMode.Required ? "required" : "auto" : void 0;
    if (config2.protocol === "openai-responses") {
      const reasoning = config2.thinking === "disabled" ? {} : {
        ...(config2.reasoningEffort ? {
          effort: config2.reasoningEffort
        } : {}),
        ...(config2.reasoningSummary ? {
          summary: config2.reasoningSummary
        } : {}),
        ...(config2.reasoningContext ? {
          context: config2.reasoningContext
        } : {}),
        ...(config2.reasoningMode ? {
          mode: config2.reasoningMode
        } : {})
      };
      const promptCacheOptions = {
        ...(config2.promptCacheMode ? {
          mode: config2.promptCacheMode
        } : {}),
        ...(config2.promptCacheTtl ? {
          ttl: config2.promptCacheTtl
        } : {})
      };
      const responseTools = rawTools.map(tool => ({
        type: "function",
        name: tool.name,
        description: tool.description ?? "",
        parameters: tool.inputSchema ?? {
          type: "object",
          properties: {}
        }
      }));
      const extra2 = safeExtraBody(config2.extraBody);
      const extraText = objectValue(extra2.text);
      delete extra2.text;
      const body2 = {
        ...extra2,
        model: config2.model,
        input: toResponsesInput(messages),
        ...(config2.maxOutputTokens !== void 0 ? {
          max_output_tokens: config2.maxOutputTokens
        } : {}),
        ...(Object.keys(reasoning).length ? {
          reasoning
        } : {}),
        ...(config2.verbosity || extraText ? {
          text: {
            ...(extraText ?? {}),
            ...(config2.verbosity ? {
              verbosity: config2.verbosity
            } : {})
          }
        } : {}),
        ...(config2.temperature !== void 0 ? {
          temperature: config2.temperature
        } : {}),
        ...(config2.topP !== void 0 ? {
          top_p: config2.topP
        } : {}),
        ...(config2.parallelToolCalls !== void 0 ? {
          parallel_tool_calls: config2.parallelToolCalls
        } : {}),
        ...(config2.maxToolCalls !== void 0 ? {
          max_tool_calls: config2.maxToolCalls
        } : {}),
        ...(config2.serviceTier ? {
          service_tier: config2.serviceTier
        } : {}),
        ...(config2.store !== void 0 ? {
          store: config2.store
        } : {}),
        ...(config2.truncation ? {
          truncation: config2.truncation
        } : {}),
        ...(config2.promptCacheKey ? {
          prompt_cache_key: config2.promptCacheKey
        } : {}),
        ...(Object.keys(promptCacheOptions).length ? {
          prompt_cache_options: promptCacheOptions
        } : {}),
        ...(config2.promptCacheRetention ? {
          prompt_cache_retention: config2.promptCacheRetention
        } : {}),
        ...(config2.safetyIdentifier ? {
          safety_identifier: config2.safetyIdentifier
        } : {}),
        ...(config2.requestMetadata ? {
          metadata: config2.requestMetadata
        } : {}),
        ...(responseTools.length ? {
          tools: responseTools,
          tool_choice: toolChoice
        } : {})
      };
      const payload = await fetchJsonWithRetries(normalizeResponsesUrl(config2.baseUrl), {
        method: "POST",
        headers,
        body: JSON.stringify(body2)
      }, token, config2.timeoutMs, config2.retries, "Responses endpoint");
      if (payload?.status === "failed") {
        throw new Error(payload?.error?.message ?? "ShunCode Responses API request failed.");
      }
      let emittedText = false;
      for (const item of Array.isArray(payload?.output) ? payload.output : []) {
        if (item?.type === "reasoning") {
          const summaries = (Array.isArray(item.summary) ? item.summary : []).map(entry => typeof entry?.text === "string" ? entry.text : "").filter(Boolean);
          if (summaries.length) {
            progress.report(new vscode10.LanguageModelThinkingPart(summaries, item.id, {
              context: payload?.reasoning?.context,
              mode: payload?.reasoning?.mode
            }));
          }
          continue;
        }
        if (item?.type === "message") {
          for (const content of Array.isArray(item.content) ? item.content : []) {
            const text = content?.type === "output_text" && typeof content.text === "string" ? content.text : content?.type === "refusal" && typeof content.refusal === "string" ? content.refusal : void 0;
            if (text) {
              emittedText = true;
              progress.report(new vscode10.LanguageModelTextPart(text));
            }
          }
          continue;
        }
        if (item?.type === "function_call" && typeof item.name === "string") {
          let input = {};
          try {
            input = JSON.parse(typeof item.arguments === "string" ? item.arguments : "{}");
          } catch {
            input = {};
          }
          progress.report(new vscode10.LanguageModelToolCallPart(item.call_id ?? item.id ?? `tool-${Date.now()}`, item.name, input));
        }
      }
      if (!emittedText && typeof payload?.output_text === "string" && payload.output_text) {
        progress.report(new vscode10.LanguageModelTextPart(payload.output_text));
      }
      return;
    }
    if (config2.protocol === "anthropic-messages") {
      if (config2.apiKey?.trim()) headers["x-api-key"] = config2.apiKey.trim();
      headers["anthropic-version"] = ANTHROPIC_API_VERSION;
      const anthropicTools = rawTools.map(tool => ({
        name: tool.name,
        description: tool.description ?? "",
        input_schema: tool.inputSchema ?? {
          type: "object",
          properties: {}
        }
      }));
      const maxOutputTokens = config2.maxOutputTokens ?? 8192;
      const effort = config2.thinking !== "disabled" && config2.reasoningEffort && config2.reasoningEffort !== "none" && config2.reasoningEffort !== "minimal" ? config2.reasoningEffort : void 0;
      const thinkingBudget = effort ? Math.max(1024, Math.min(ANTHROPIC_EFFORT_THINKING_BUDGETS[effort] ?? 8192, maxOutputTokens - 1024)) : 0;
      const extra2 = safeExtraBody(config2.extraBody);
      const body2 = {
        ...extra2,
        model: config2.model,
        messages: toAnthropicChatMessages(messages).messages,
        max_tokens: maxOutputTokens,
        ...(thinkingBudget >= 1024 && thinkingBudget < maxOutputTokens ? {
          thinking: {
            type: "enabled",
            budget_tokens: thinkingBudget
          }
        } : {}),
        ...(anthropicTools.length ? {
          tools: anthropicTools,
          tool_choice: {
            type: toolChoice === "required" ? "any" : "auto"
          }
        } : {})
      };
      const payload = await fetchJsonWithRetries(normalizeAnthropicMessagesUrl(config2.baseUrl), {
        method: "POST",
        headers,
        body: JSON.stringify(body2)
      }, token, config2.timeoutMs, config2.retries, "Anthropic Messages endpoint");
      if (payload?.type === "error" || payload?.error) {
        throw new Error(String(payload?.error?.message ?? "ShunCode Anthropic Messages request failed."));
      }
      for (const block of Array.isArray(payload?.content) ? payload.content : []) {
        if (!block || typeof block !== "object") continue;
        if (block.type === "thinking" && typeof block.thinking === "string" && block.thinking) {
          progress.report(new vscode10.LanguageModelThinkingPart(block.thinking, block.id));
          continue;
        }
        if (block.type === "text" && typeof block.text === "string" && block.text) {
          progress.report(new vscode10.LanguageModelTextPart(block.text));
          continue;
        }
        if (block.type === "tool_use" && typeof block.name === "string") {
          progress.report(new vscode10.LanguageModelToolCallPart(typeof block.id === "string" && block.id ? block.id : `tool-${Date.now()}`, block.name, block.input && typeof block.input === "object" ? block.input : {}));
        }
      }
      return;
    }
    const chatTools = rawTools.map(tool => ({
      type: "function",
      function: {
        name: tool.name,
        description: tool.description ?? "",
        parameters: tool.inputSchema ?? {
          type: "object",
          properties: {}
        }
      }
    }));
    const deepSeekThinking = config2.deepSeek && config2.thinking !== "disabled";
    const extra = safeExtraBody(config2.extraBody);
    const chatMessages = toOpenAIMessages(messages, {
      preserveReasoningContent: deepSeekThinking
    });
    const availableOutputTokens = config2.deepSeek ? config2.contextWindow - estimatedTokens({
      messages: chatMessages,
      tools: chatTools
    }) - 1024 : void 0;
    if (availableOutputTokens !== void 0 && availableOutputTokens < 1) {
      throw new Error("The DeepSeek request exceeds the configured context window after reserving response space.");
    }
    const requestMaxOutputTokens = config2.maxOutputTokens !== void 0 ? availableOutputTokens === void 0 ? config2.maxOutputTokens : Math.min(config2.maxOutputTokens, availableOutputTokens) : void 0;
    const body = {
      ...extra,
      model: config2.model,
      messages: chatMessages,
      ...(requestMaxOutputTokens !== void 0 ? {
        max_tokens: requestMaxOutputTokens
      } : {}),
      ...(config2.deepSeek && config2.thinking ? {
        thinking: {
          type: config2.thinking
        }
      } : {}),
      ...(config2.reasoningEffort && (config2.deepSeek ? deepSeekThinking : config2.thinking !== "disabled") ? {
        reasoning_effort: config2.reasoningEffort
      } : {}),
      ...(!deepSeekThinking && config2.temperature !== void 0 ? {
        temperature: config2.temperature
      } : {}),
      ...(!deepSeekThinking && config2.topP !== void 0 ? {
        top_p: config2.topP
      } : {}),
      ...(config2.responseFormat ? {
        response_format: config2.responseFormat
      } : {}),
      ...(config2.stop ? {
        stop: config2.stop
      } : {}),
      ...(config2.seed !== void 0 ? {
        seed: config2.seed
      } : {}),
      ...(!deepSeekThinking && config2.presencePenalty !== void 0 ? {
        presence_penalty: config2.presencePenalty
      } : {}),
      ...(!deepSeekThinking && config2.frequencyPenalty !== void 0 ? {
        frequency_penalty: config2.frequencyPenalty
      } : {}),
      ...(chatTools.length ? {
        tools: chatTools,
        ...(!deepSeekThinking ? {
          tool_choice: toolChoice
        } : {})
      } : {}),
      stream: true
    };
    const response = await fetchStreamWithRetries(normalizeChatCompletionsUrl(config2.baseUrl), {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    }, token, config2.timeoutMs, config2.retries, "Chat Completions endpoint");
    await emitChatCompletionStream(response, progress, token);
  }
  async provideCodexChatResponse(config2, messages, options, progress, token) {
    const auth = await codexAuthManager.getRequestContext();
    const headers = {
      "content-type": "application/json",
      accept: "text/event-stream",
      authorization: `Bearer ${auth.accessToken}`,
      "ChatGPT-Account-ID": auth.accountId,
      originator: CODEX_ORIGINATOR,
      "User-Agent": CODEX_USER_AGENT,
      "OpenAI-Beta": CODEX_BETA_HEADER
    };
    const rawTools = Array.isArray(options?.tools) ? options.tools : [];
    const toolChoice = rawTools.length ? options?.toolMode === vscode10.LanguageModelChatToolMode.Required ? "required" : "auto" : void 0;
    const effort = codexReasoningEffort(config2.reasoningEffort);
    const serviceTier = config2.serviceTier === "default" ? void 0 : config2.serviceTier;
    const reasoning = {
      ...(effort ? {
        effort
      } : {}),
      ...(config2.reasoningSummary ? {
        summary: config2.reasoningSummary
      } : {}),
      ...(config2.reasoningContext ? {
        context: config2.reasoningContext
      } : {}),
      ...(config2.reasoningMode ? {
        mode: config2.reasoningMode
      } : {})
    };
    const responseTools = rawTools.map(tool => ({
      type: "function",
      name: tool.name,
      description: tool.description ?? "",
      parameters: tool.inputSchema ?? {
        type: "object",
        properties: {}
      }
    }));
    const extra = safeExtraBody(config2.extraBody);
    const extraText = objectValue(extra.text);
    delete extra.text;
    const body = {
      ...extra,
      model: config2.model,
      instructions: "You are Codex, OpenAI's coding agent.",
      input: toCodexResponsesInput(messages),
      store: false,
      stream: true,
      ...(Object.keys(reasoning).length ? {
        reasoning
      } : {}),
      ...(config2.verbosity || extraText ? {
        text: {
          ...(extraText ?? {}),
          ...(config2.verbosity ? {
            verbosity: config2.verbosity
          } : {})
        }
      } : {}),
      ...(config2.parallelToolCalls !== void 0 ? {
        parallel_tool_calls: config2.parallelToolCalls
      } : {}),
      ...(serviceTier ? {
        service_tier: serviceTier
      } : {}),
      ...(config2.promptCacheKey ? {
        prompt_cache_key: config2.promptCacheKey
      } : {}),
      ...(responseTools.length ? {
        tools: responseTools,
        tool_choice: toolChoice
      } : {})
    };
    const url2 = normalizeResponsesUrl(config2.baseUrl);
    const attempt = () => fetchStreamWithRetries(url2, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    }, token, config2.timeoutMs, config2.retries, "Codex Responses endpoint");
    let response;
    try {
      response = await attempt();
    } catch (error2) {
      const status = typeof error2 === "object" && error2 !== null && "status" in error2 ? Number(error2.status) : void 0;
      if (status !== 401) throw error2;
      const refreshedAuth = await codexAuthManager.forceRefresh();
      headers.authorization = `Bearer ${refreshedAuth.accessToken}`;
      headers["ChatGPT-Account-ID"] = refreshedAuth.accountId;
      response = await attempt();
    }
    await emitResponsesStream(response, progress, token);
  }
  dispose() {
    this.changeEmitter.dispose();
  }
};

// extensions/shuncode/src/native-chat.ts
export { import_node_crypto12, vscode10, normalizeChatCompletionsUrl, normalizeResponsesUrl, normalizeAnthropicMessagesUrl, normalizeAnthropicModelsUrl, ANTHROPIC_API_VERSION, ANTHROPIC_EFFORT_THINKING_BUDGETS, DEFAULT_TIMEOUT_MS2, DEFAULT_FIRST_TOKEN_TIMEOUT_MS, DEFAULT_IDLE_TIMEOUT_MS, DEFAULT_TOTAL_TIMEOUT_MS, DEFAULT_CONTEXT_WINDOW, MODEL_DISCOVERY_TIMEOUT_MS, PROVIDER_FINGERPRINT_SALT_SECRET, stringValue, integerValue, optionalInteger, optionalNumber, optionalBoolean, enumValue, reasoningEffortValues, reasoningEffortOptions, reasoningEffortLabel, reasoningEffortDescription, objectValue, stringRecordValue, stringArrayValue, normalizeApiBaseUrl, normalizeModelsUrl, parseManualModelIds, providerFingerprint, parseDiscoveredModels, isTransientStatus, delayForRetry, fetchJsonWithRetries, fetchStreamWithRetries, emitChatCompletionMessage, emitChatCompletionStream, textFromPart, thinkingTextFromPart, estimatedTokens, imageFromPart, responsesImageFromPart, toOpenAIMessages, anthropicSourceFromImageUrl, toAnthropicChatMessages, toResponsesInput, toCodexResponsesInput, codexReasoningEffort, extractResponsesOutputText, emitResponsesStream, modelConfigurationSchema, inheritedEnum, resolveRequestConfig, PROTECTED_REQUEST_KEYS, safeExtraBody, ShunCodeLanguageModelProvider };
