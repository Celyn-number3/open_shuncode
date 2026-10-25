// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { __toESM } from "../../../runtime/helpers.mjs";
import { init_define_SHUNCODE_BUILD_INFO } from "../../../runtime/build-info.mjs";
import { boundedTechnicalText } from "./chat-history.mjs";
// extensions/shuncode/src/tool-presentation.ts
init_define_SHUNCODE_BUILD_INFO();
var vscode12 = __toESM(require("vscode"));
var MAX_PREVIEW_ITEMS = 12;
function presentationKind(toolName) {
  switch (toolName) {
    case "find_files":
    case "read_files":
    case "list_directory":
      return "files";
    case "search_files":
      return "search";
    case "apply_patch":
      return "edit";
    case "run_command":
    case "get_command_output":
    case "send_command_input":
      return "terminal";
    case "get_diagnostics":
      return "diagnostics";
    case "lsp":
      return "lsp";
    default:
      return "generic";
  }
}
function field(text, name) {
  const match = text.match(new RegExp(`^${name}:\\s*(.+)$`, "m"));
  return match?.[1]?.trim();
}
function integerField(text, name) {
  const value = field(text, name);
  if (!value) return void 0;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : void 0;
}
function parseJsonString(value) {
  if (!value) return void 0;
  try {
    const parsed = JSON.parse(value);
    return typeof parsed === "string" ? parsed : value;
  } catch {
    return value.replace(/^"|"$/g, "");
  }
}
function blockBetween2(text, begin, end) {
  const start = text.indexOf(begin);
  if (start < 0) return void 0;
  const contentStart = start + begin.length;
  const finish = text.indexOf(end, contentStart);
  const value = text.slice(contentStart, finish >= 0 ? finish : void 0).replace(/^\r?\n/, "").replace(/\r?\n$/, "");
  return value || void 0;
}
function relativeResource(root, relativePath, line, column) {
  if (!root || !relativePath || relativePath.startsWith("(") || relativePath.startsWith("\u2026")) return void 0;
  const clean = relativePath.replace(/\\/g, "/").replace(/^\.\//, "");
  const uri = vscode12.Uri.joinPath(root, ...clean.split("/").filter(Boolean));
  if (!line) return uri;
  const start = new vscode12.Position(Math.max(0, line - 1), Math.max(0, (column ?? 1) - 1));
  return new vscode12.Location(uri, new vscode12.Range(start, start));
}
function durationMetric(durationMs) {
  if (durationMs === void 0) return [];
  return [{
    label: "Duration",
    value: durationMs < 1e3 ? `${durationMs} ms` : `${(durationMs / 1e3).toFixed(1)} s`
  }];
}
function formatDurationMs(ms) {
  return ms >= 1e3 && ms % 1e3 === 0 ? `${ms / 1e3} s` : `${ms} ms`;
}
function withOverflowItem(items, total) {
  if (items.length <= MAX_PREVIEW_ITEMS) return items;
  const visible = items.slice(0, MAX_PREVIEW_ITEMS);
  visible.push({
    label: `\u2026 ${Math.max(0, total - MAX_PREVIEW_ITEMS)} more`
  });
  return visible;
}
function findFilesPresentation(text, root, durationMs) {
  const total = integerField(text, "returned_files") ?? 0;
  const marker = "--- FILES ---";
  const section = text.includes(marker) ? text.split(marker, 2)[1] ?? "" : "";
  const paths = section.split(/\r?\n/).map(line => line.trim()).filter(line => line && !line.startsWith("===") && !line.startsWith("NOTE:") && line !== "(no matching files)");
  const pattern = field(text, "patterns");
  const scope = parseJsonString(field(text, "scope")) ?? ".";
  return {
    title: total === 1 ? "Found 1 file" : `Found ${total} files`,
    summary: pattern ? `Searched ${scope} for ${pattern}.` : `Searched ${scope}.`,
    items: withOverflowItem(paths.map(path22 => ({
      label: path22,
      resource: relativeResource(root, path22)
    })), total),
    metrics: [{
      label: "Files",
      value: String(total)
    }, ...durationMetric(durationMs)]
  };
}
function searchFilesPresentation(text, root, durationMs) {
  const total = integerField(text, "returned_matches") ?? 0;
  const files = integerField(text, "files_with_matches") ?? 0;
  const pattern = parseJsonString(field(text, "pattern")) ?? "";
  const scope = parseJsonString(field(text, "scope")) ?? ".";
  const items = [];
  const seen = /* @__PURE__ */new Set();
  for (const match of text.matchAll(/^(.+?):(\d+):(\d+)$/gm)) {
    const path22 = match[1]?.trim();
    const line = Number(match[2]);
    const column = Number(match[3]);
    const key = `${path22}:${line}:${column}`;
    if (!path22 || seen.has(key)) continue;
    seen.add(key);
    items.push({
      label: path22,
      description: `Line ${line}`,
      resource: relativeResource(root, path22, line, column)
    });
  }
  return {
    title: total === 1 ? "Found 1 match" : `Found ${total} matches`,
    summary: pattern ? `Searched ${scope} for \u201C${pattern}\u201D.` : `Searched ${scope}.`,
    items: withOverflowItem(items, total),
    metrics: [{
      label: "Matches",
      value: String(total)
    }, {
      label: "Files",
      value: String(files)
    }, ...durationMetric(durationMs)]
  };
}
function readFilesPresentation(text, root, durationMs) {
  const requested = integerField(text, "requested") ?? 0;
  const succeeded = integerField(text, "succeeded") ?? requested;
  const failed = integerField(text, "failed") ?? 0;
  const truncated = integerField(text, "truncated") ?? 0;
  const items = [];
  for (const block of text.split("=== FILE BEGIN ===").slice(1)) {
    const path22 = parseJsonString(field(block, "path"));
    if (!path22) continue;
    const status = field(block, "status") ?? "unknown";
    const lines = field(block, "lines");
    const startLine = lines ? Number.parseInt(lines.split("-", 1)[0] ?? "1", 10) : void 0;
    items.push({
      label: path22,
      description: status === "success" ? lines ? `Lines ${lines}` : "Read" : status,
      resource: relativeResource(root, path22, Number.isFinite(startLine) ? startLine : void 0)
    });
  }
  return {
    title: succeeded === 1 ? "Read 1 file" : `Read ${succeeded} files`,
    summary: failed > 0 ? `${succeeded} succeeded and ${failed} failed.` : `${succeeded} file${succeeded === 1 ? "" : "s"} read successfully.`,
    items: withOverflowItem(items, items.length),
    metrics: [{
      label: "Requested",
      value: String(requested)
    }, ...(truncated ? [{
      label: "Truncated",
      value: String(truncated)
    }] : []), ...durationMetric(durationMs)]
  };
}
function applyPatchPresentation(text, root, durationMs) {
  const filesChanged = integerField(text, "files_changed") ?? 0;
  const additions = integerField(text, "additions") ?? 0;
  const deletions = integerField(text, "deletions") ?? 0;
  const items = [];
  for (const block of text.split("--- FILE ---").slice(1)) {
    const path22 = parseJsonString(field(block, "destination_path")) ?? parseJsonString(field(block, "path"));
    if (!path22) continue;
    items.push({
      label: path22,
      description: field(block, "action") ?? "updated",
      resource: relativeResource(root, path22),
      added: integerField(block, "additions"),
      removed: integerField(block, "deletions")
    });
  }
  const diff = blockBetween2(text, "--- CANONICAL APPLIED DIFF ---", "=== APPLY_PATCH END ===")?.replace(/\r?\nNOTE: Diff display was truncated;[\s\S]*$/, "");
  return {
    title: filesChanged === 1 ? "Updated 1 file" : `Updated ${filesChanged} files`,
    summary: `${additions} line${additions === 1 ? "" : "s"} added and ${deletions} removed.`,
    items: withOverflowItem(items, filesChanged),
    metrics: [{
      label: "Files",
      value: String(filesChanged)
    }, {
      label: "Added",
      value: `+${additions}`
    }, {
      label: "Removed",
      value: `\u2212${deletions}`
    }, ...durationMetric(durationMs)],
    diff,
    diffPreview: parseUnifiedDiffPreview2(diff)
  };
}
var MAX_DIFF_PREVIEW_FILES2 = 8;
var MAX_DIFF_PREVIEW_HUNKS_PER_FILE2 = 4;
var MAX_DIFF_PREVIEW_LINES_PER_HUNK2 = 18;
function diffPath2(header) {
  const value = header.trim();
  if (!value || value === "/dev/null") return void 0;
  return value.replace(/^[ab]\//, "");
}
function parseUnifiedDiffPreview2(diff) {
  if (!diff) return [];
  const lines = diff.split(/\r?\n/);
  const files = [];
  let currentFile;
  let currentHunk;
  let oldLine = 0;
  let newLine = 0;
  const finishHunk = () => {
    if (!currentFile || !currentHunk) return;
    if (currentFile.hunks.length < MAX_DIFF_PREVIEW_HUNKS_PER_FILE2) currentFile.hunks.push(currentHunk);else currentFile.truncated = true;
    currentHunk = void 0;
  };
  const finishFile = () => {
    finishHunk();
    if (!currentFile) return;
    if (files.length < MAX_DIFF_PREVIEW_FILES2) files.push(currentFile);else if (files.length) files[files.length - 1].truncated = true;
    currentFile = void 0;
  };
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.startsWith("--- ")) {
      finishFile();
      const oldPath = diffPath2(line.slice(4));
      const next = lines[index + 1];
      const newPath = next?.startsWith("+++ ") ? diffPath2(next.slice(4)) : void 0;
      const path22 = newPath ?? oldPath;
      if (path22) currentFile = {
        path: path22,
        hunks: []
      };
      if (next?.startsWith("+++ ")) index += 1;
      continue;
    }
    if (!currentFile) continue;
    const hunk = line.match(/^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (hunk) {
      finishHunk();
      oldLine = Number(hunk[1]);
      newLine = Number(hunk[2]);
      currentHunk = {
        lines: []
      };
      continue;
    }
    if (!currentHunk || line === "\\ No newline at end of file" || line === "... <diff truncated>") continue;
    const marker = line[0];
    if (marker !== " " && marker !== "+" && marker !== "-") continue;
    const previewLine = marker === "+" ? {
      kind: "add",
      newLine,
      text: line.slice(1)
    } : marker === "-" ? {
      kind: "delete",
      oldLine,
      text: line.slice(1)
    } : {
      kind: "context",
      oldLine,
      newLine,
      text: line.slice(1)
    };
    if (currentHunk.lines.length < MAX_DIFF_PREVIEW_LINES_PER_HUNK2) currentHunk.lines.push(previewLine);else currentHunk.truncated = true;
    if (marker !== "+") oldLine += 1;
    if (marker !== "-") newLine += 1;
  }
  finishFile();
  return files;
}
function listDirectoryPresentation(text, root, durationMs, args) {
  const items = [...text.matchAll(/^\[(DIR|FILE|LINK|OTHER)\]\s+(.+)$/gm)].map(match => {
    const path22 = match[2]?.trim() ?? "";
    return {
      label: path22,
      description: match[1] === "DIR" ? "Folder" : void 0,
      resource: relativeResource(root, path22)
    };
  }).filter(item => item.label);
  const target = typeof args.path === "string" && args.path.trim() ? args.path.trim() : "workspace";
  return {
    title: `Explored ${target}`,
    summary: `${items.length} item${items.length === 1 ? "" : "s"}.`,
    items: withOverflowItem(items, items.length),
    metrics: [{
      label: "Items",
      value: String(items.length)
    }, ...durationMetric(durationMs)]
  };
}
function diagnosticsPresentation(text, root, durationMs) {
  const total = integerField(text, "returned") ?? integerField(text, "total_matching") ?? 0;
  const items = [];
  for (const block of text.split(/--- DIAGNOSTIC \d+ ---/).slice(1)) {
    const lines = block.trim().split(/\r?\n/);
    const location = lines[0]?.match(/^(.+):(\d+):(\d+)$/);
    if (!location) continue;
    const severity = field(block, "severity");
    const messageStart = lines.findIndex(line => line.startsWith("code:"));
    const message = messageStart >= 0 ? lines.slice(messageStart + 1).join(" ").trim() : void 0;
    items.push({
      label: message || location[1],
      description: [severity, `${location[1]}:${location[2]}:${location[3]}`].filter(Boolean).join(" \xB7 "),
      resource: relativeResource(root, location[1], Number(location[2]), Number(location[3]))
    });
  }
  return {
    title: total === 0 ? "No diagnostics" : total === 1 ? "Found 1 diagnostic" : `Found ${total} diagnostics`,
    summary: total === 0 ? "No matching editor or language-service diagnostics." : void 0,
    items: withOverflowItem(items, total),
    metrics: [{
      label: "Diagnostics",
      value: String(total)
    }, ...durationMetric(durationMs)]
  };
}
function lspPresentation(text, root, durationMs, args) {
  const total = integerField(text, "returned_results") ?? integerField(text, "returned") ?? 0;
  const items = [];
  for (const block of text.split(/--- RESULT \d+ ---/).slice(1)) {
    const path22 = parseJsonString(field(block, "path"));
    if (!path22 || /^[a-z]+:\/\//i.test(path22)) continue;
    const range = field(block, "selection_range") ?? field(block, "range");
    const position = range?.match(/^(\d+):(\d+)/);
    const line = position ? Number(position[1]) : void 0;
    const column = position ? Number(position[2]) : void 0;
    items.push({
      label: parseJsonString(field(block, "name")) ?? path22,
      description: [field(block, "kind"), field(block, "container"), line ? `${path22}:${line}:${column ?? 1}` : path22].filter(Boolean).join(" \xB7 "),
      resource: relativeResource(root, path22, line, column)
    });
  }
  const operation = typeof args.operation === "string" ? args.operation : "LSP query";
  return {
    title: `${operation.replaceAll("_", " ")} \xB7 ${total} result${total === 1 ? "" : "s"}`,
    summary: field(text, "provider_state") ? `Provider: ${field(text, "provider_state")}` : void 0,
    items: withOverflowItem(items, total),
    metrics: [{
      label: "Results",
      value: String(total)
    }, ...durationMetric(durationMs)]
  };
}
function terminalPresentation(text, durationMs, args, toolName) {
  const command = typeof args.command === "string" ? args.command.trim() : typeof args.input === "string" ? args.input.trim() : "";
  const terminalId = field(text, "terminal_id");
  const terminalName = field(text, "terminal_name");
  const status = field(text, "status");
  const exitCode = field(text, "exit_code");
  const output = blockBetween2(text, "--- OUTPUT BEGIN ---", "--- OUTPUT END ---");
  const title = toolName === "run_command" ? `Ran ${command || "terminal command"}` : toolName === "get_command_output" ? "Read command output" : "Sent command input";
  return {
    title,
    summary: [terminalName, status && status !== "completed" ? status : void 0, exitCode && exitCode !== "null" ? `exit ${exitCode}` : void 0].filter(Boolean).join(" \xB7 ") || void 0,
    output,
    terminalId,
    metrics: [...(exitCode && exitCode !== "null" ? [{
      label: "Exit",
      value: exitCode
    }] : []), ...durationMetric(durationMs)]
  };
}
function waitPresentation(text, durationMs) {
  const match = text.match(/Waited (\d+) ms\./);
  const requestedMs = match ? Number(match[1]) : void 0;
  return {
    title: requestedMs !== void 0 && Number.isFinite(requestedMs) ? `Waited ${formatDurationMs(requestedMs)}` : "Waited",
    summary: "Wait completed.",
    metrics: durationMetric(durationMs)
  };
}
function runningPresentation(toolName, args, root) {
  switch (toolName) {
    case "find_files":
      {
        const patterns = Array.isArray(args.patterns) ? args.patterns.filter(value => typeof value === "string") : [];
        return {
          title: "Finding files",
          summary: patterns.length ? `Searching for ${patterns.join(", ")}.` : "Searching workspace paths.",
          items: []
        };
      }
    case "search_files":
      return {
        title: "Searching files",
        summary: typeof args.pattern === "string" ? `Searching for \u201C${args.pattern}\u201D.` : "Searching file contents.",
        items: []
      };
    case "read_files":
      {
        const files = Array.isArray(args.files) ? args.files.filter(file => !!file && typeof file === "object") : [];
        return {
          title: files.length === 1 ? "Reading 1 file" : `Reading ${files.length} files`,
          summary: "Reading requested source ranges.",
          items: withOverflowItem(files.map(file => {
            const path22 = typeof file.path === "string" ? file.path : "file";
            const start = typeof file.start_line === "number" ? file.start_line : void 0;
            const end = typeof file.end_line === "number" ? file.end_line : void 0;
            return {
              label: path22,
              description: start ? `Lines ${start}${end ? `\u2013${end}` : "\u2013EOF"}` : void 0,
              resource: relativeResource(root, path22, start)
            };
          }), files.length)
        };
      }
    case "apply_patch":
      {
        const patch = typeof args.patch === "string" ? args.patch : "";
        const paths = [...patch.matchAll(/^\*\*\* (?:Update|Add|Delete) File: (.+)$/gm)].map(match => match[1]?.trim()).filter(value => !!value);
        return {
          title: paths.length === 1 ? "Updating 1 file" : `Updating ${paths.length || "workspace"} files`,
          summary: "Applying source changes.",
          items: withOverflowItem(paths.map(path22 => ({
            label: path22,
            resource: relativeResource(root, path22)
          })), paths.length)
        };
      }
    case "list_directory":
      return {
        title: `Exploring ${typeof args.path === "string" && args.path.trim() ? args.path.trim() : "workspace"}`,
        summary: "Reading directory contents.",
        items: []
      };
    case "get_diagnostics":
      return {
        title: "Checking diagnostics",
        summary: "Reading current editor and language-service diagnostics.",
        items: []
      };
    case "lsp":
      return {
        title: typeof args.operation === "string" ? args.operation.replaceAll("_", " ") : "Running code intelligence",
        summary: "Querying active language services.",
        items: []
      };
    case "run_command":
      return {
        title: `Running ${typeof args.command === "string" ? args.command.trim() : "terminal command"}`,
        summary: typeof args.cwd === "string" ? args.cwd : void 0,
        items: []
      };
    case "get_command_output":
      return {
        title: "Reading command output",
        summary: typeof args.command_id === "string" ? args.command_id : void 0,
        items: []
      };
    case "send_command_input":
      return {
        title: "Sending command input",
        summary: typeof args.command_id === "string" ? args.command_id : void 0,
        items: []
      };
    case "wait":
      {
        const ms = typeof args.ms === "number" && Number.isFinite(args.ms) ? args.ms : void 0;
        return {
          title: "Waiting",
          summary: ms !== void 0 ? `Waiting ${formatDurationMs(ms)}.` : "Waiting for the requested duration.",
          items: []
        };
      }
    default:
      return {
        title: `${toolName} running`,
        summary: void 0,
        items: []
      };
  }
}
function createToolPresentation(invocation, output, options) {
  const rawOutput = options.isComplete ? boundedTechnicalText(output ?? "") : "";
  const technicalInput = boundedTechnicalText(invocation.args);
  const parsed = options.isComplete && typeof output === "string" ? invocation.toolName === "find_files" ? findFilesPresentation(output, options.workspaceRoot, options.durationMs) : invocation.toolName === "search_files" ? searchFilesPresentation(output, options.workspaceRoot, options.durationMs) : invocation.toolName === "read_files" ? readFilesPresentation(output, options.workspaceRoot, options.durationMs) : invocation.toolName === "apply_patch" && !options.isError ? applyPatchPresentation(output, options.workspaceRoot, options.durationMs) : invocation.toolName === "list_directory" ? listDirectoryPresentation(output, options.workspaceRoot, options.durationMs, invocation.args) : invocation.toolName === "get_diagnostics" ? diagnosticsPresentation(output, options.workspaceRoot, options.durationMs) : invocation.toolName === "lsp" ? lspPresentation(output, options.workspaceRoot, options.durationMs, invocation.args) : ["run_command", "get_command_output", "send_command_input"].includes(invocation.toolName) ? terminalPresentation(output, options.durationMs, invocation.args, invocation.toolName) : invocation.toolName === "wait" ? waitPresentation(output, options.durationMs) : void 0 : void 0;
  const presentation = parsed ?? runningPresentation(invocation.toolName, invocation.args, options.workspaceRoot);
  const failedTitle = options.isError ? `${invocation.toolName} failed` : presentation.title;
  const kind = presentationKind(invocation.toolName);
  return {
    title: failedTitle,
    data: {
      input: options.isError || kind === "generic" ? technicalInput : "",
      output: options.isError ? rawOutput : presentation.output ?? (kind === "generic" ? rawOutput : ""),
      presentationStyle: options.useShunCodeStyle ? "shuncode" : void 0,
      presentationKind: kind,
      isError: Boolean(options.isError),
      durationMs: options.durationMs,
      terminalId: presentation.terminalId,
      diff: presentation.diff,
      diffPreview: presentation.diffPreview,
      summary: options.isError ? "The tool did not complete successfully. Open technical details for the reported error." : presentation.summary,
      detailsLabel: "Technical details",
      items: presentation.items,
      metrics: options.isComplete ? presentation.metrics : void 0
    }
  };
}

// extensions/shuncode/src/merge-contract.ts
export { vscode12, MAX_PREVIEW_ITEMS, presentationKind, field, integerField, parseJsonString, blockBetween2, relativeResource, durationMetric, formatDurationMs, withOverflowItem, findFilesPresentation, searchFilesPresentation, readFilesPresentation, applyPatchPresentation, MAX_DIFF_PREVIEW_FILES2, MAX_DIFF_PREVIEW_HUNKS_PER_FILE2, MAX_DIFF_PREVIEW_LINES_PER_HUNK2, diffPath2, parseUnifiedDiffPreview2, listDirectoryPresentation, diagnosticsPresentation, lspPresentation, terminalPresentation, waitPresentation, runningPresentation, createToolPresentation };
