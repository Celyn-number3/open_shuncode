// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
var BRIDGE_QUICK_LINKS_SETTING = "shuncode.bridge.quickLinks";
var QUICK_LINK_MAX_NAME_LENGTH = 40;
var QUICK_LINK_MAX_URL_LENGTH = 500;
var ARENA_URL = "https://arena.ai/agent";
var DEVIN_URL = "https://app.devin.ai/";
var DEFAULT_QUICK_LINKS = [{
  name: "ChatGPT",
  url: "https://chatgpt.com/"
}, {
  name: "Arena",
  url: ARENA_URL
}, {
  name: "Devin",
  url: DEVIN_URL
}, {
  name: "WorkBuddy",
  url: "https://www.workbuddy.cn/app"
}, {
  name: "Trae",
  url: "https://work.trae.cn"
}, {
  name: "Qwen",
  url: "https://qwenwork.cn/app/chat"
}, {
  name: "Manus",
  url: "https://manus.im/app"
}, {
  name: "Browser Use",
  url: "https://cloud.browser-use.com/agents"
}, {
  name: "Z.ai",
  url: "https://chat.z.ai/"
}, {
  name: "Agnes AI",
  url: "https://app.agnes-ai.com/"
}];
function defaultQuickLinks() {
  return DEFAULT_QUICK_LINKS.map(link2 => ({
    ...link2
  }));
}
function isValidQuickLinkUrl(value2) {
  return /^https?:\/\/\S+$/i.test(value2);
}
function parseQuickLinks(value2) {
  if (value2 === void 0 || value2 === null) return defaultQuickLinks();
  if (!Array.isArray(value2)) return [];
  const links = [];
  for (const item of value2) {
    if (!item || typeof item !== "object") continue;
    const record = item;
    const name = typeof record.name === "string" ? record.name.trim() : "";
    const url = typeof record.url === "string" ? record.url.trim() : "";
    if (!name || !url) continue;
    links.push({
      name: name.slice(0, QUICK_LINK_MAX_NAME_LENGTH),
      url: url.slice(0, QUICK_LINK_MAX_URL_LENGTH)
    });
  }
  return links;
}
function readQuickLinks(configurationService) {
  return parseQuickLinks(configurationService.getValue(BRIDGE_QUICK_LINKS_SETTING));
}

// src/vs/workbench/contrib/chat/browser/aiCustomization/shunCodeBridgePurchasePresentation.ts
export { BRIDGE_QUICK_LINKS_SETTING, QUICK_LINK_MAX_NAME_LENGTH, QUICK_LINK_MAX_URL_LENGTH, ARENA_URL, DEVIN_URL, DEFAULT_QUICK_LINKS, defaultQuickLinks, isValidQuickLinkUrl, parseQuickLinks, readQuickLinks };
