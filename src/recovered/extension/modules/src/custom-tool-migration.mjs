// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { __toESM } from "../runtime/helpers.mjs";
import { init_define_SHUNCODE_BUILD_INFO } from "../runtime/build-info.mjs";
import { CUSTOM_TOOLS_DIR_NAME, LEGACY_SKILLS_DIR_NAME } from "./custom-tool-contract.mjs";
// src/custom-tool-migration.ts
init_define_SHUNCODE_BUILD_INFO();
var import_node_fs4 = require("node:fs");
var import_node_path8 = __toESM(require("node:path"), 1);
var migratedLegacyRoots = /* @__PURE__ */new Set();
function migrateLegacySkillDirs(root, log) {
  const key = import_node_path8.default.resolve(root);
  if (migratedLegacyRoots.has(key)) return [];
  migratedLegacyRoots.add(key);
  const legacyDir = import_node_path8.default.join(root, LEGACY_SKILLS_DIR_NAME);
  let names;
  try {
    names = (0, import_node_fs4.readdirSync)(legacyDir, {
      withFileTypes: true
    }).filter(entry => entry.isDirectory() && !entry.name.startsWith(".")).map(entry => entry.name).sort();
  } catch {
    return [];
  }
  const moved = [];
  for (const name of names) {
    const from = import_node_path8.default.join(legacyDir, name);
    const to = import_node_path8.default.join(root, CUSTOM_TOOLS_DIR_NAME, name);
    if ((0, import_node_fs4.existsSync)(to)) {
      log?.(`[custom-tools] legacy skill "${name}" stays in ${LEGACY_SKILLS_DIR_NAME}: a same-named folder already exists in ${CUSTOM_TOOLS_DIR_NAME}.`);
      continue;
    }
    try {
      (0, import_node_fs4.mkdirSync)(import_node_path8.default.dirname(to), {
        recursive: true
      });
      (0, import_node_fs4.renameSync)(from, to);
      moved.push(name);
      log?.(`[custom-tools] migrated skill "${name}" from ${LEGACY_SKILLS_DIR_NAME} into ${CUSTOM_TOOLS_DIR_NAME}.`);
    } catch (error2) {
      log?.(`[custom-tools] failed to migrate legacy skill "${name}": ${error2 instanceof Error ? error2.message : String(error2)}.`);
    }
  }
  try {
    (0, import_node_fs4.rmdirSync)(legacyDir);
  } catch {}
  return moved;
}

// src/custom-tool-skill.ts
export { import_node_fs4, import_node_path8, migratedLegacyRoots, migrateLegacySkillDirs };
