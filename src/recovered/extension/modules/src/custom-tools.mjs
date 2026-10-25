// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { __toESM } from "../runtime/helpers.mjs";
import { init_define_SHUNCODE_BUILD_INFO } from "../runtime/build-info.mjs";
import { CUSTOM_TOOLS_DIR_NAME } from "./custom-tool-contract.mjs";
import { readManifest } from "./custom-tool-manifest.mjs";
import { migrateLegacySkillDirs } from "./custom-tool-migration.mjs";
import { loadSkillTools } from "./custom-tool-skill.mjs";
// src/custom-tools.ts
init_define_SHUNCODE_BUILD_INFO();
var import_node_fs7 = require("node:fs");
var import_node_path11 = __toESM(require("node:path"), 1);

// src/custom-tool-contract.ts

// src/custom-tools.ts
var MAX_MANIFESTS_PER_ROOT = 64;
function loadCustomTools(workspaceRoots, log, options = {}) {
  const tools = /* @__PURE__ */new Map();
  for (const root of workspaceRoots) {
    let entries;
    try {
      entries = (0, import_node_fs7.readdirSync)(import_node_path11.default.join(root, CUSTOM_TOOLS_DIR_NAME));
    } catch {
      continue;
    }
    for (const file of entries.filter(entry => entry.endsWith(".json")).sort().slice(0, MAX_MANIFESTS_PER_ROOT)) {
      const manifest = readManifest(import_node_path11.default.join(root, CUSTOM_TOOLS_DIR_NAME, file), log);
      if (!manifest) continue;
      if (tools.has(manifest.name)) {
        log?.(`[custom-tools] duplicate tool ${manifest.name}; keeping first.`);
        continue;
      }
      tools.set(manifest.name, manifest);
    }
  }
  if (options.skillsEnabled !== false) for (const root of workspaceRoots) {
    migrateLegacySkillDirs(root, log);
    for (const manifest of loadSkillTools(root, log)) {
      if (tools.has(manifest.name)) {
        log?.(`[custom-tools] duplicate tool ${manifest.name}; keeping first.`);
        continue;
      }
      tools.set(manifest.name, manifest);
    }
  }
  return [...tools.values()];
}
function listEnabledCustomTools(workspaceRoots, log, options = {}) {
  return loadCustomTools(workspaceRoots, log, options).filter(tool => tool.enabled);
}
function findCustomTool(workspaceRoots, name, log, options = {}) {
  return listEnabledCustomTools(workspaceRoots, log, options).find(tool => tool.name === name);
}
function toStatusEntries(tools) {
  return tools.map(tool => ({
    name: tool.name,
    title: tool.title,
    description: tool.description,
    enabled: tool.enabled,
    source: tool.skillDir ? "skill" : "manifest"
  }));
}
function customToolsFingerprint(tools) {
  return tools.map(tool => `${tool.name}:${tool.enabled ? "1" : "0"}`).sort().join(",");
}

// src/bridge-event-store.ts
export { import_node_fs7, import_node_path11, MAX_MANIFESTS_PER_ROOT, loadCustomTools, listEnabledCustomTools, findCustomTool, toStatusEntries, customToolsFingerprint };
