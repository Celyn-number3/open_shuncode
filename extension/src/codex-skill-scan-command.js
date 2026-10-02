"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const SKILL_FILE = "SKILL.md";
const MAX_SKILL_FILE_BYTES = 64 * 1024;
const MAX_SCAN_DIRECTORIES = 5000;
const MAX_SKILLS = 256;
const MAX_DEPTH = 6;
const IGNORED_DIRECTORIES = new Set([".git", "node_modules", "__pycache__", ".cache"]);

function addRoot(roots, seen, value, label) {
  if (!value || typeof value !== "string") return;
  const absolute = path.resolve(value);
  const key = process.platform === "win32" ? absolute.toLowerCase() : absolute;
  if (seen.has(key)) return;
  seen.add(key);
  roots.push({ path: absolute, label });
}

function discoverCodexSkillRoots(workspaceRoots = [], env = process.env, homeDir = os.homedir()) {
  const roots = [];
  const seen = new Set();
  const home = path.resolve(homeDir || os.homedir());
  addRoot(roots, seen, path.join(home, ".agents", "skills"), "User · ~/.agents/skills");
  const codexHome = typeof env.CODEX_HOME === "string" && env.CODEX_HOME.trim()
    ? path.resolve(env.CODEX_HOME.trim())
    : path.join(home, ".codex");
  addRoot(roots, seen, path.join(codexHome, "skills"), env.CODEX_HOME ? "CODEX_HOME · skills" : "User · ~/.codex/skills");

  for (const workspaceRoot of workspaceRoots) {
    if (typeof workspaceRoot !== "string" || !workspaceRoot.trim()) continue;
    const workspace = path.resolve(workspaceRoot);
    let gitRoot = workspace;
    let probe = workspace;
    for (let depth = 0; depth < 12; depth += 1) {
      try {
        fs.lstatSync(path.join(probe, ".git"));
        gitRoot = probe;
        break;
      } catch {
        const parent = path.dirname(probe);
        if (parent === probe) break;
        probe = parent;
      }
    }
    let current = workspace;
    for (let depth = 0; depth < 12; depth += 1) {
      const label = current === workspace
        ? `Workspace · ${path.basename(current) || current}`
        : `Workspace parent · ${path.basename(current) || current}`;
      addRoot(roots, seen, path.join(current, ".agents", "skills"), label);
      if (current === workspace) addRoot(roots, seen, path.join(current, ".codex", "skills"), `${label} · .codex/skills`);
      if (current === gitRoot) break;
      const parent = path.dirname(current);
      if (parent === current) break;
      current = parent;
    }
  }
  return roots;
}

function yamlScalar(value) {
  const trimmed = value.trim();
  if (trimmed.length >= 2 && trimmed[0] === '"' && trimmed.at(-1) === '"') {
    try { return JSON.parse(trimmed); } catch { return trimmed.slice(1, -1); }
  }
  if (trimmed.length >= 2 && trimmed[0] === "'" && trimmed.at(-1) === "'") return trimmed.slice(1, -1).replace(/''/g, "'");
  return trimmed.replace(/\s+#.*$/, "").trim();
}

function skillMetadata(markdown, fallbackName) {
  const text = markdown.replace(/^\uFEFF/, "");
  const lines = text.split(/\r?\n/);
  if (lines[0]?.trim() !== "---") return { name: fallbackName, description: "" };
  const end = lines.findIndex((line, index) => index > 0 && (line.trim() === "---" || line.trim() === "..."));
  if (end < 0) return { name: fallbackName, description: "" };
  let name = "";
  let description = "";
  for (let index = 1; index < end; index += 1) {
    const match = lines[index].match(/^(name|description)\s*:\s*(.*)$/i);
    if (!match) continue;
    const key = match[1].toLowerCase();
    const value = match[2].trim();
    if (key === "name") {
      name = yamlScalar(value) || fallbackName;
      continue;
    }
    if (value === ">" || value === ">-" || value === ">+" || value === "|" || value === "|-" || value === "|+") {
      const parts = [];
      for (let cursor = index + 1; cursor < end; cursor += 1) {
        if (lines[cursor].trim() && !/^\s/.test(lines[cursor])) break;
        parts.push(lines[cursor].trim());
      }
      description = parts.filter(Boolean).join(" ");
    } else {
      description = yamlScalar(value);
    }
  }
  return { name: name || fallbackName, description };
}

function scanCodexSkills(roots, options = {}) {
  const maxDirectories = Number.isInteger(options.maxDirectories) ? Math.max(1, options.maxDirectories) : MAX_SCAN_DIRECTORIES;
  const maxSkills = Number.isInteger(options.maxSkills) ? Math.max(1, options.maxSkills) : MAX_SKILLS;
  const maxDepth = Number.isInteger(options.maxDepth) ? Math.max(0, options.maxDepth) : MAX_DEPTH;
  const candidates = [];
  const seenSkillDirs = new Set();
  let visitedDirectories = 0;

  for (const item of roots || []) {
    if (candidates.length >= maxSkills || visitedDirectories >= maxDirectories) break;
    const root = typeof item === "string" ? { path: item, label: item } : item;
    if (!root || typeof root.path !== "string") continue;
    let realRoot;
    try {
      realRoot = fs.realpathSync(root.path);
      if (!fs.statSync(realRoot).isDirectory()) continue;
    } catch {
      continue;
    }
    const queue = [{ directory: realRoot, depth: 0 }];
    const visitedInRoot = new Set();
    while (queue.length && candidates.length < maxSkills && visitedDirectories < maxDirectories) {
      const current = queue.shift();
      const dirKey = process.platform === "win32" ? current.directory.toLowerCase() : current.directory;
      if (visitedInRoot.has(dirKey)) continue;
      visitedInRoot.add(dirKey);
      visitedDirectories += 1;

      let skillFile;
      try {
        skillFile = path.join(current.directory, SKILL_FILE);
        const stat = fs.lstatSync(skillFile);
        if (!stat.isFile() || stat.isSymbolicLink()) skillFile = undefined;
      } catch {
        skillFile = undefined;
      }
      if (skillFile) {
        const key = process.platform === "win32" ? current.directory.toLowerCase() : current.directory;
        if (!seenSkillDirs.has(key)) {
          seenSkillDirs.add(key);
          let name = path.basename(current.directory);
          let description = "";
          let warning;
          try {
            const stat = fs.statSync(skillFile);
            if (stat.size > MAX_SKILL_FILE_BYTES) {
              warning = `SKILL.md exceeds ${MAX_SKILL_FILE_BYTES / 1024} KB and may not load.`;
            } else {
              const metadata = skillMetadata(fs.readFileSync(skillFile, "utf8"), name);
              name = metadata.name;
              description = metadata.description;
            }
          } catch {
            warning = "SKILL.md could not be read.";
          }
          candidates.push({
            name,
            description,
            directory: current.directory,
            sourceRoot: realRoot,
            sourceLabel: root.label || realRoot,
            warning,
          });
        }
        continue;
      }
      if (current.depth >= maxDepth) continue;
      let entries;
      try {
        entries = fs.readdirSync(current.directory, { withFileTypes: true });
      } catch {
        continue;
      }
      entries.sort((a, b) => a.name.localeCompare(b.name));
      for (const entry of entries) {
        if (entry.name.startsWith(".") || IGNORED_DIRECTORIES.has(entry.name)) continue;
        const child = path.join(current.directory, entry.name);
        if (entry.isDirectory()) {
          queue.push({ directory: child, depth: current.depth + 1 });
        } else if (entry.isSymbolicLink()) {
          try {
            const target = fs.realpathSync(child);
            if (fs.statSync(target).isDirectory()) queue.push({ directory: target, depth: current.depth + 1 });
          } catch {
            // Broken or inaccessible symlink; skip without blocking the scan.
          }
        }
      }
    }
  }
  return candidates.sort((a, b) => a.name.localeCompare(b.name) || a.directory.localeCompare(b.directory));
}

function registerCodexSkillScanCommand(vscode, bridge, bridgeReady) {
  return vscode.commands.registerCommand("shuncode.bridge.skills.scanCodex", async () => {
    await bridgeReady;
    const workspaceRoots = vscode.workspace.workspaceFolders?.map((folder) => folder.uri.fsPath) ?? [];
    if (!workspaceRoots.length) {
      await vscode.window.showWarningMessage("Open a workspace before importing Codex skills into the ShunCode Bridge.");
      return;
    }

    let roots = discoverCodexSkillRoots(workspaceRoots);
    let skills = scanCodexSkills(roots);
    let selectedDirectories = new Set();
    for (;;) {
      if (!skills.length) {
        const action = await vscode.window.showWarningMessage(
          "No Codex skills were found in the common user or workspace folders.",
          "Choose a folder to scan",
        );
        if (action !== "Choose a folder to scan") return;
        const folders = await vscode.window.showOpenDialog({
          canSelectFiles: false,
          canSelectFolders: true,
          canSelectMany: false,
          openLabel: "Scan skills in this folder",
          title: "Choose a folder containing Codex skills",
        });
        if (!folders?.length) return;
        roots = [...roots, { path: folders[0].fsPath, label: "Selected folder" }];
        skills = scanCodexSkills(roots);
        continue;
      }

      const items = skills.map((skill) => ({
        label: skill.name,
        description: skill.sourceLabel,
        detail: [skill.description, skill.warning, skill.directory].filter(Boolean).join(" · "),
        picked: selectedDirectories.has(skill.directory),
        skill,
      }));
      const picked = await vscode.window.showQuickPick(items, {
        canPickMany: true,
        ignoreFocusOut: true,
        matchOnDescription: true,
        matchOnDetail: true,
        title: "Import Codex Skills into ShunCode Bridge",
        placeHolder: "Select trusted skills to import. Scan an additional folder after this step if needed.",
      });
      if (!picked) return;
      const selected = picked.map((item) => item.skill);
      selectedDirectories = new Set(selected.map((skill) => skill.directory));
      const action = await vscode.window.showInformationMessage(
        `Found ${skills.length} skill(s); selected ${selected.length}.`,
        "Import selected",
        "Scan another folder",
        "Cancel",
      );
      if (action === "Scan another folder") {
        const folders = await vscode.window.showOpenDialog({
          canSelectFiles: false,
          canSelectFolders: true,
          canSelectMany: false,
          openLabel: "Scan skills in this folder",
          title: "Choose another Codex skills folder",
        });
        if (!folders?.length) continue;
        roots = [...roots, { path: folders[0].fsPath, label: "Selected folder" }];
        skills = scanCodexSkills(roots);
        continue;
      }
      if (action !== "Import selected") return;
      if (!selected.length) {
        await vscode.window.showWarningMessage("Select at least one skill to import.");
        continue;
      }

      const skillsEnabled = vscode.workspace.getConfiguration("shuncode").get("bridge.skillsEnabled", true);
      const disabledNote = skillsEnabled ? "" : " The Bridge skill switch is currently off, so imported skills will remain inactive until it is enabled.";
      const confirmed = await vscode.window.showWarningMessage(
        `Import ${selected.length} skill(s) into .shuncode/mcp-tools? They will be made available to agents connected through the ShunCode Bridge.${disabledNote} Scanning and importing do not run scripts, but a skill's entry script may run when a connected agent invokes it. Only import skills you trust.`,
        { modal: true },
        "Import selected skills",
      );
      if (confirmed !== "Import selected skills") return;

      const imported = [];
      const failed = [];
      for (const skill of selected) {
        try {
          const response = await bridge.importSkill(skill.directory);
          imported.push(response.result.name);
        } catch (error) {
          failed.push(`${skill.name}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      if (imported.length) {
        const suffix = failed.length ? `; ${failed.length} failed` : "";
        await vscode.window.showInformationMessage(`Imported ${imported.length} Codex skill(s) for the Bridge${suffix}: ${imported.join(", ")}`);
      }
      if (failed.length) await vscode.window.showWarningMessage(`Some skills could not be imported: ${failed.join("; ")}`);
      return;
    }
  });
}

module.exports = { discoverCodexSkillRoots, scanCodexSkills, registerCodexSkillScanCommand };