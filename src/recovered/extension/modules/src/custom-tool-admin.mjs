// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { __toESM } from "../runtime/helpers.mjs";
import { init_define_SHUNCODE_BUILD_INFO } from "../runtime/build-info.mjs";
import { CUSTOM_TOOLS_DIR_NAME, SKILLS_DIR_NAME, isRecord } from "./custom-tool-contract.mjs";
import { SKILL_SIDECAR_FILE } from "./custom-tool-skill.mjs";
import { loadCustomTools } from "./custom-tools.mjs";
// src/custom-tool-admin.ts
init_define_SHUNCODE_BUILD_INFO();
var import_node_fs8 = require("node:fs");
var import_node_path12 = __toESM(require("node:path"), 1);
function toggleCustomTool(workspaceRoots, name, log) {
  const manifest = loadCustomTools(workspaceRoots, log).find(tool => tool.name === name);
  if (!manifest) throw new Error(`Unknown custom tool: ${name}.`);
  if (manifest.skillDir) {
    const sidecarPath = import_node_path12.default.join(manifest.skillDir, SKILL_SIDECAR_FILE);
    let value = {};
    if ((0, import_node_fs8.existsSync)(sidecarPath)) {
      const parsed2 = JSON.parse((0, import_node_fs8.readFileSync)(sidecarPath, "utf8"));
      if (!isRecord(parsed2)) throw new Error(`Custom tool sidecar is invalid: ${sidecarPath}.`);
      value = parsed2;
    }
    const next2 = {
      ...value,
      enabled: !manifest.enabled
    };
    (0, import_node_fs8.writeFileSync)(sidecarPath, JSON.stringify(next2, null, 2) + "\n");
    return {
      name,
      enabled: next2.enabled
    };
  }
  const parsed = JSON.parse((0, import_node_fs8.readFileSync)(manifest.sourcePath, "utf8"));
  if (!isRecord(parsed)) throw new Error(`Custom tool manifest is invalid: ${manifest.sourcePath}.`);
  const next = {
    ...parsed,
    enabled: !manifest.enabled
  };
  (0, import_node_fs8.writeFileSync)(manifest.sourcePath, JSON.stringify(next, null, 2) + "\n");
  return {
    name,
    enabled: next.enabled
  };
}
function deleteCustomTool(workspaceRoots, name, log) {
  const manifest = loadCustomTools(workspaceRoots, log).find(tool => tool.name === name);
  if (!manifest) throw new Error(`Unknown custom tool: ${name}.`);
  if (manifest.skillDir) {
    if (!workspaceRoots.some(root => import_node_path12.default.dirname(manifest.skillDir) === import_node_path12.default.join(root, SKILLS_DIR_NAME))) throw new Error(`Custom tool directory is outside the skills directory: ${manifest.skillDir}.`);
    (0, import_node_fs8.rmSync)(manifest.skillDir, {
      recursive: true
    });
    return {
      name,
      deleted: manifest.skillDir
    };
  }
  const contained = workspaceRoots.some(root => manifest.sourcePath.startsWith(import_node_path12.default.join(root, CUSTOM_TOOLS_DIR_NAME) + import_node_path12.default.sep) && manifest.sourcePath.endsWith(".json"));
  if (!contained) throw new Error(`Custom tool manifest is outside the tools directory: ${manifest.sourcePath}.`);
  (0, import_node_fs8.unlinkSync)(manifest.sourcePath);
  return {
    name,
    deleted: manifest.sourcePath
  };
}

// src/custom-tool-skill-import.ts
export { import_node_fs8, import_node_path12, toggleCustomTool, deleteCustomTool };
