// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { init_define_SHUNCODE_BUILD_INFO } from "../runtime/build-info.mjs";
// src/agent-tool-content.ts
init_define_SHUNCODE_BUILD_INFO();
var NATIVE_VISION_MIME_TYPES = /* @__PURE__ */new Set(["image/png", "image/jpeg", "image/gif", "image/webp"]);
function isBase64(data) {
  if (data.length % 4 !== 0 || /[^A-Za-z0-9+/=]/.test(data)) return false;
  const padding = data.indexOf("=");
  return padding === -1 || padding >= data.length - 2 && data.slice(padding) === "=".repeat(data.length - padding);
}
function agentToolResultContent(result) {
  if (!result || typeof result !== "object") return {
    text: String(result ?? ""),
    images: []
  };
  const record2 = result;
  const images = [];
  if (Array.isArray(record2.content)) {
    const parts = record2.content.map(item => {
      if (!item || typeof item !== "object") return JSON.stringify(item);
      const part = item;
      if (part.type === "text") return String(part.text ?? "");
      if (part.type !== "image") return JSON.stringify(item);
      if (record2.isError) return "[Image omitted because the tool failed.]";
      if (typeof part.mimeType !== "string" || !/^image\/[a-z0-9][a-z0-9.+-]*$/i.test(part.mimeType) || typeof part.data !== "string" || !part.data || !isBase64(part.data)) {
        return "[Image omitted: invalid MCP image content.]";
      }
      if (!NATIVE_VISION_MIME_TYPES.has(part.mimeType)) {
        return `[Image: ${part.mimeType}; metadata only. Native vision input supports PNG, JPEG, GIF, or WebP; this image format was not sent.]`;
      }
      images.push({
        mimeType: part.mimeType,
        data: part.data
      });
      return `[Image: ${part.mimeType}; attached as visual input.]`;
    }).filter(Boolean);
    if (parts.length) return {
      text: parts.join("\n"),
      images
    };
  }
  return {
    text: JSON.stringify(result),
    images
  };
}

// src/version.ts
export { NATIVE_VISION_MIME_TYPES, isBase64, agentToolResultContent };
