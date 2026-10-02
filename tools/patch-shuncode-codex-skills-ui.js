#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const COMMAND_ID = "shuncode.bridge.skills.scanCodex";
const COMMAND_TITLE = "ShunCode: Import Codex Skills to Bridge";
const BACKUP_SUFFIX = ".codex-skills-ui.bak";

function count(text, needle) {
  let matches = 0;
  let at = 0;
  while ((at = text.indexOf(needle, at)) >= 0) {
    matches += 1;
    at += needle.length;
  }
  return matches;
}

function replaceOnce(text, needle, replacement, label) {
  const matches = count(text, needle);
  if (matches !== 1) throw new Error(`${label}: expected one patch anchor, found ${matches}. This release bundle may be incompatible.`);
  return text.replace(needle, replacement);
}

function patchWorkbench(source, file) {
  const hasButton = source.includes("scanCodexSkillsButton");
  const hasConstant = source.includes("BRIDGE_SKILLS_SCAN_CODEX");
  const hasStrings = source.includes("shuncodeBridge.scanCodexSkillsTitle");
  if (hasButton && hasConstant && hasStrings) return { source, changed: false };
  if (hasButton || hasConstant || hasStrings) throw new Error(`${file}: partial Codex Skills UI patch detected; restore the backup before retrying.`);

  let result = replaceOnce(
    source,
    'var BRIDGE_SKILLS_IMPORT = "shuncode.bridge.skills.import";',
    'var BRIDGE_SKILLS_IMPORT = "shuncode.bridge.skills.import"; var BRIDGE_SKILLS_SCAN_CODEX = "shuncode.bridge.skills.scanCodex";',
    file,
  );
  result = replaceOnce(
    result,
    '"shuncodeBridge.skillsOn":',
    '"shuncodeBridge.scanCodexSkills":"\\u626B\\u63CF Codex Skills\\u2026","shuncodeBridge.scanCodexSkillsTitle":"\\u626B\\u63CF\\u672C\\u673A Codex \\u6280\\u80FD\\u76EE\\u5F55\\u5E76\\u9009\\u62E9\\u8981\\u5BFC\\u5165\\u7684\\u6280\\u80FD","shuncodeBridge.skillsOn":',
    file,
  );
  const button = [
    'const scanCodexSkillsButton = this._register(new Button(customToolsControls, { ...defaultButtonStyles, secondary: true, supportIcons: true }));',
    'scanCodexSkillsButton.label = `$(${Codicon.search.id}) ${localizeBridge("shuncodeBridge.scanCodexSkills", "Scan Codex Skills…")}`;',
    'scanCodexSkillsButton.setTitle(localizeBridge("shuncodeBridge.scanCodexSkillsTitle", "Scan local Codex skill folders and choose which to import."));',
    'this._register(scanCodexSkillsButton.onDidClick(() => { void this.commandService.executeCommand(BRIDGE_SKILLS_SCAN_CODEX); }));',
  ].join("\n");
  result = replaceOnce(
    result,
    'this._register(importSkillButton.onDidClick(() => this.importSkill()));',
    `this._register(importSkillButton.onDidClick(() => this.importSkill()));\n${button}`,
    file,
  );
  return { source: result, changed: true };
}

function patchExtensionBundle(source, file) {
  if (source.includes("registerCodexSkillScanCommand")) return { source, changed: false };
  if (source.includes(COMMAND_ID)) throw new Error(`${file}: scan command ID exists without its registration; refusing a partial patch.`);

  const activationAnchor = /const customAgentDiscoveryCts = new ([A-Za-z_$][\w$]*)\.CancellationTokenSource\(\);/g;
  const matches = [...source.matchAll(activationAnchor)];
  if (matches.length !== 1) throw new Error(`${file}: expected one extension activation anchor, found ${matches.length}.`);
  const vscodeName = matches[0][1];
  let result = source.replace(
    activationAnchor,
    `const customAgentDiscoveryCts = new ${vscodeName}.CancellationTokenSource();\n  const codexSkillScanCommand = require("../src/codex-skill-scan-command.js").registerCodexSkillScanCommand(${vscodeName}, bridge, bridgeReady);`,
  );
  result = replaceOnce(result, "    customAgentDiscoveryCts,", "    customAgentDiscoveryCts,\n    codexSkillScanCommand,", file);
  return { source: result, changed: true };
}

function patchExtensionSource(source, file) {
  const importLine = 'import { registerCodexSkillScanCommand } from "./codex-skill-scan-command.js";';
  const registrationLine = "const codexSkillScanCommand = registerCodexSkillScanCommand(vscode, bridge, bridgeReady);";
  const hasImport = source.includes(importLine);
  const hasRegistration = source.includes(registrationLine);
  const hasDisposable = source.includes("    codexSkillScanCommand,");
  if (hasImport && hasRegistration && hasDisposable) return { source, changed: false };
  if (hasImport || hasRegistration || hasDisposable) throw new Error(`${file}: partial source patch detected; refusing to continue.`);
  let result = replaceOnce(
    source,
    'import { WorkspaceHubController } from "./workspace-hub.js";',
    'import { WorkspaceHubController } from "./workspace-hub.js";\nimport { registerCodexSkillScanCommand } from "./codex-skill-scan-command.js";',
    file,
  );
  result = replaceOnce(
    result,
    '  const customAgentDiscoveryCts = new vscode.CancellationTokenSource();',
    '  const customAgentDiscoveryCts = new vscode.CancellationTokenSource();\n  const codexSkillScanCommand = registerCodexSkillScanCommand(vscode, bridge, bridgeReady);',
    file,
  );
  result = replaceOnce(result, '    customAgentDiscoveryCts,', '    customAgentDiscoveryCts,\n    codexSkillScanCommand,', file);
  return { source: result, changed: true };
}
function inside(root, file) {
  const relative = path.relative(root, file);
  return relative !== "" && !relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative);
}

function planPatch(appRoot) {
  const repoRoot = path.resolve(__dirname, "..");
  const extRoot = path.join(appRoot, "resources", "app", "extensions", "shuncode");
  const workbenchFiles = [
    path.join(appRoot, "resources", "app", "out", "vs", "workbench", "workbench.desktop.main.js"),
    path.join(appRoot, "resources", "app", "out", "vs", "sessions", "sessions.desktop.main.js"),
  ];
  const extensionDist = path.join(extRoot, "dist", "extension.js");
  const extensionPackage = path.join(extRoot, "package.json");
  const extensionSource = path.join(extRoot, "src");
  const extensionSourceTs = path.join(extensionSource, "extension.ts");
  const required = [
    path.join(appRoot, "ShunCode.exe"),
    ...workbenchFiles,
    extensionDist,
    extensionPackage,
    extensionSource,
    extensionSourceTs,
  ];
  for (const file of required) if (!fs.existsSync(file)) throw new Error(`Required ShunCode release file is missing: ${file}`);
  for (const file of required.slice(1, 5)) if (!inside(appRoot, file)) throw new Error(`Refusing a path outside the application root: ${file}`);

  const changes = [];
  for (const file of workbenchFiles) {
    const patched = patchWorkbench(fs.readFileSync(file, "utf8"), file);
    if (patched.changed) changes.push({ file, content: patched.source });
  }

  const bundle = patchExtensionBundle(fs.readFileSync(extensionDist, "utf8"), extensionDist);
  if (bundle.changed) changes.push({ file: extensionDist, content: bundle.source });

  const sourcePatch = patchExtensionSource(fs.readFileSync(extensionSourceTs, "utf8"), extensionSourceTs);
  if (sourcePatch.changed) changes.push({ file: extensionSourceTs, content: sourcePatch.source });

  const packageText = fs.readFileSync(extensionPackage, "utf8");
  const manifest = JSON.parse(packageText);
  const repoManifest = JSON.parse(fs.readFileSync(path.join(repoRoot, "extension", "package.json"), "utf8"));
  if (typeof repoManifest.version === "string") manifest.version = repoManifest.version;
  manifest.activationEvents ??= [];
  if (!manifest.activationEvents.includes(`onCommand:${COMMAND_ID}`)) manifest.activationEvents.push(`onCommand:${COMMAND_ID}`);
  manifest.contributes ??= {};
  manifest.contributes.commands ??= [];
  if (!manifest.contributes.commands.some((entry) => entry.command === COMMAND_ID)) {
    manifest.contributes.commands.push({ command: COMMAND_ID, title: COMMAND_TITLE, icon: "$(search)" });
  }
  const nextPackageText = JSON.stringify(manifest);
  if (nextPackageText !== packageText) changes.push({ file: extensionPackage, content: nextPackageText });

  for (const filename of ["codex-skill-scan-command.js", "codex-skill-scan-command.d.ts"]) {
    const source = path.join(repoRoot, "extension", "src", filename);
    const target = path.join(extensionSource, filename);
    if (!fs.existsSync(source)) throw new Error(`Repository feature file is missing: ${source}`);
    const content = fs.readFileSync(source);
    if (!fs.existsSync(target) || !fs.readFileSync(target).equals(content)) changes.push({ file: target, content });
  }
  return changes;
}

function applyChanges(changes) {
  const written = [];
  try {
    for (const change of changes) {
      const backup = `${change.file}${BACKUP_SUFFIX}`;
      const existed = fs.existsSync(change.file);
      if (existed && fs.existsSync(backup)) throw new Error(`Backup already exists; inspect it before applying again: ${backup}`);
      if (existed) fs.copyFileSync(change.file, backup, fs.constants.COPYFILE_EXCL);
      const temporary = `${change.file}.codex-skills-ui.tmp`;
      if (fs.existsSync(temporary)) throw new Error(`Temporary file already exists: ${temporary}`);
      try {
        fs.writeFileSync(temporary, change.content);
        fs.renameSync(temporary, change.file);
      } catch (error) {
        if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
        throw error;
      }
      written.push({ file: change.file, backup, existed });
    }
  } catch (error) {
    for (const item of written.reverse()) {
      if (item.existed && fs.existsSync(item.backup)) fs.copyFileSync(item.backup, item.file);
      else if (!item.existed && fs.existsSync(item.file)) fs.unlinkSync(item.file);
    }
    throw error;
  }
  return written;
}
function main(argv) {
  const appArg = argv.find((arg) => !arg.startsWith("--"));
  const apply = argv.includes("--apply");
  const dryRun = argv.includes("--dry-run") || !apply;
  if (!appArg || (argv.includes("--apply") && argv.includes("--dry-run"))) {
    console.error("Usage: node tools/patch-shuncode-codex-skills-ui.js <extracted-app-root> [--dry-run | --apply]");
    process.exitCode = 2;
    return;
  }
  const appRoot = fs.realpathSync(path.resolve(appArg));
  const changes = planPatch(appRoot);
  if (!changes.length) {
    console.log("The Codex Skills scan button is already patched into this ShunCode package.");
    return;
  }
  console.log(`${dryRun ? "Dry run" : "Apply"}: ${changes.length} file(s) would be changed in ${appRoot}`);
  for (const change of changes) console.log(`  ${path.relative(appRoot, change.file)}`);
  if (dryRun) {
    console.log("No files changed. Close all ShunCode windows for this package, then rerun with --apply.");
    return;
  }
  console.warn("Applying changes to the extracted ShunCode package. Close its running editor windows first.");
  const written = applyChanges(changes);
  console.log(`Patched ${written.length} file(s). Existing files were backed up next to the app; helper files were added.`);
}

try {
  main(process.argv.slice(2));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}