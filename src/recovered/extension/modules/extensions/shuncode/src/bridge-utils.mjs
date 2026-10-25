// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { init_define_SHUNCODE_BUILD_INFO } from "../../../runtime/build-info.mjs";
// extensions/shuncode/src/bridge-utils.ts
init_define_SHUNCODE_BUILD_INFO();
function asRecord3(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function boundedText(value, maxChars = 16e3) {
  if (value === void 0 || value === null) return void 0;
  const text = typeof value === "string" ? value : JSON.stringify(value, null, 2);
  if (!text) return void 0;
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars)}
\u2026[truncated for Bridge UI]`;
}
function recordArray(value) {
  return Array.isArray(value) ? value.filter(item => Boolean(item) && typeof item === "object" && !Array.isArray(item)) : [];
}
function uniqueStrings(values) {
  return [...new Set(values.filter(value => Boolean(value?.trim())).map(value => value.trim()))];
}
function stringField(text, field2) {
  if (!text) return void 0;
  const match = text.match(new RegExp(`^${field2}:\\s*(.+)$`, "m"));
  if (!match) return void 0;
  const raw = match[1].trim();
  if (raw === "null") return void 0;
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "string" ? parsed : String(parsed);
  } catch {
    return raw;
  }
}
function numberField(text, field2) {
  const raw = stringField(text, field2);
  if (raw === void 0) return void 0;
  if (raw === "null") return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : void 0;
}
function blockBetween(text, begin, end) {
  if (!text) return void 0;
  const start = text.indexOf(begin);
  if (start < 0) return void 0;
  const contentStart = start + begin.length;
  const finish = text.indexOf(end, contentStart);
  const value = text.slice(contentStart, finish >= 0 ? finish : void 0).replace(/^\r?\n/, "").replace(/\r?\n$/, "");
  return value || void 0;
}
function parseListDirectoryItems(text) {
  if (!text) return [];
  const items = [];
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\[(DIR|FILE|LINK|OTHER)\]\s+(.+)$/);
    if (!match) continue;
    items.push({
      kind: match[1] === "DIR" ? "folder" : "file",
      path: match[2]
    });
  }
  return items;
}
function parseDiagnosticsItems(text) {
  if (!text) return [];
  const items = [];
  const blocks = text.split(/--- DIAGNOSTIC \d+ ---/).slice(1);
  for (const block of blocks) {
    const lines = block.trim().split(/\r?\n/);
    const location = lines[0]?.match(/^(.+):(\d+):(\d+)$/);
    if (!location) continue;
    const severity = stringField(block, "severity");
    const messageStart = lines.findIndex(line => line.startsWith("code:"));
    const message = messageStart >= 0 ? lines.slice(messageStart + 1).join(" ").trim() : void 0;
    items.push({
      kind: "diagnostic",
      path: location[1],
      line: Number(location[2]),
      column: Number(location[3]),
      label: message || void 0,
      severity
    });
  }
  return items;
}
function parseLspItems(text) {
  if (!text) return [];
  const items = [];
  const blocks = text.split(/--- RESULT \d+ ---/).slice(1);
  for (const block of blocks) {
    const pathValue = stringField(block, "path");
    if (!pathValue || /^[a-z]+:\/\//i.test(pathValue)) continue;
    const range = stringField(block, "selection_range") ?? stringField(block, "range");
    const position = range?.match(/^(\d+):(\d+)/);
    items.push({
      kind: "symbol",
      path: pathValue,
      line: position ? Number(position[1]) : void 0,
      column: position ? Number(position[2]) : void 0,
      label: stringField(block, "name"),
      description: stringField(block, "kind") ?? stringField(block, "container")
    });
  }
  return items;
}
var MAX_DIFF_PREVIEW_FILES = 8;
var MAX_DIFF_PREVIEW_HUNKS_PER_FILE = 4;
var MAX_DIFF_PREVIEW_LINES_PER_HUNK = 18;
function diffPath(header) {
  const value = header.trim();
  if (!value || value === "/dev/null") return void 0;
  return value.replace(/^[ab]\//, "");
}
function parseUnifiedDiffPreview(diff) {
  if (!diff) return [];
  const lines = diff.split(/\r?\n/);
  const files = [];
  let currentFile;
  let currentHunk;
  let oldLine = 0;
  let newLine = 0;
  const finishHunk = () => {
    if (!currentFile || !currentHunk) return;
    if (currentFile.hunks.length < MAX_DIFF_PREVIEW_HUNKS_PER_FILE) currentFile.hunks.push(currentHunk);else currentFile.truncated = true;
    currentHunk = void 0;
  };
  const finishFile = () => {
    finishHunk();
    if (!currentFile) return;
    const path22 = currentFile.newPath ?? currentFile.oldPath;
    if (path22) {
      if (files.length < MAX_DIFF_PREVIEW_FILES) files.push({
        path: path22,
        ...currentFile
      });else if (files.length > 0) files[files.length - 1] = {
        ...files[files.length - 1],
        truncated: true
      };
    }
    currentFile = void 0;
  };
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.startsWith("--- ")) {
      finishFile();
      const oldPath = diffPath(line.slice(4));
      const next = lines[index + 1];
      const newPath = next?.startsWith("+++ ") ? diffPath(next.slice(4)) : void 0;
      currentFile = {
        oldPath,
        newPath,
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
        oldStart: oldLine,
        newStart: newLine,
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
    if (currentHunk.lines.length < MAX_DIFF_PREVIEW_LINES_PER_HUNK) currentHunk.lines.push(previewLine);else currentHunk.truncated = true;
    if (marker !== "+") oldLine += 1;
    if (marker !== "-") newLine += 1;
  }
  finishFile();
  return files;
}
function bridgePresentation(toolName, args, resultText2, structuredContent, isError = false) {
  const input = boundedText(args, 8e3);
  const output = boundedText(resultText2, 24e3);
  const structured = structuredContent ?? {};
  if (toolName === "read_files") {
    const requested = recordArray(args.files).map(file => typeof file.path === "string" ? file.path : void 0);
    const returned = recordArray(structured.files).map(file => typeof file.path === "string" ? file.path : void 0);
    const files = uniqueStrings([...requested, ...returned]);
    return {
      kind: "files",
      title: files.length === 1 ? `Read ${files[0]}` : `Read ${files.length || "workspace"} files`,
      subtitle: isError ? "File read failed" : files.length ? `${files.length} file${files.length === 1 ? "" : "s"}` : void 0,
      files,
      items: files.map(file => ({
        kind: "file",
        path: file
      })),
      input: void 0,
      output: isError ? output : void 0
    };
  }
  if (toolName === "find_files") {
    const files = uniqueStrings(recordArray(structured.files).map(file => typeof file.path === "string" ? file.path : void 0));
    const patterns = Array.isArray(args.patterns) ? args.patterns.filter(value => typeof value === "string") : [];
    return {
      kind: "files",
      title: files.length ? `Found ${files.length} file${files.length === 1 ? "" : "s"}` : "Find files",
      subtitle: patterns.length ? patterns.join(", ") : void 0,
      files,
      items: files.map(file => ({
        kind: "file",
        path: file
      })),
      input: void 0,
      output: isError ? output : void 0
    };
  }
  if (toolName === "search_files") {
    const matches = recordArray(structured.matches);
    const files = uniqueStrings(matches.map(match => typeof match.path === "string" ? match.path : void 0));
    const pattern = typeof args.pattern === "string" ? args.pattern : "";
    const items = matches.flatMap(match => {
      if (typeof match.path !== "string") return [];
      return [{
        kind: "match",
        path: match.path,
        line: typeof match.line === "number" ? match.line : void 0,
        column: typeof match.column === "number" ? match.column : void 0,
        label: typeof match.text === "string" ? match.text.trim() : void 0
      }];
    });
    return {
      kind: "search",
      title: pattern ? `Searched \u201C${pattern}\u201D` : "Searched workspace",
      subtitle: matches.length ? `${matches.length} match${matches.length === 1 ? "" : "es"} in ${files.length} file${files.length === 1 ? "" : "s"}` : void 0,
      files,
      items,
      input: void 0,
      output: isError ? output : void 0
    };
  }
  if (toolName === "apply_patch") {
    const fileRows = recordArray(structured.files);
    const files = uniqueStrings(fileRows.map(file => typeof file.destination_path === "string" ? file.destination_path : typeof file.path === "string" ? file.path : void 0));
    const summary = asRecord3(structured.summary);
    const additions = typeof summary.additions === "number" ? summary.additions : void 0;
    const deletions = typeof summary.deletions === "number" ? summary.deletions : void 0;
    const changeSummary = additions !== void 0 || deletions !== void 0 ? `+${additions ?? 0} -${deletions ?? 0}` : void 0;
    const diff = boundedText(structured.diff, 32e3);
    return {
      kind: "edit",
      title: files.length === 1 ? `Edited ${files[0]}` : `Edited ${files.length || "workspace"} files`,
      subtitle: isError ? "Edit failed" : changeSummary,
      files,
      items: fileRows.flatMap(file => typeof file.path === "string" ? [{
        kind: "file",
        path: typeof file.destination_path === "string" ? file.destination_path : file.path,
        description: typeof file.action === "string" ? file.action : void 0,
        additions: typeof file.additions === "number" ? file.additions : void 0,
        deletions: typeof file.deletions === "number" ? file.deletions : void 0
      }] : []),
      input: void 0,
      output: isError ? output : void 0,
      diff,
      diffPreview: parseUnifiedDiffPreview(diff)
    };
  }
  if (toolName === "list_directory") {
    const target = typeof args.path === "string" && args.path.trim() ? args.path.trim() : "workspace";
    const items = parseListDirectoryItems(resultText2);
    return {
      kind: "files",
      title: `Explored ${target}`,
      subtitle: items.length ? `${items.length} item${items.length === 1 ? "" : "s"}` : void 0,
      items,
      files: items.filter(item => item.kind === "file").map(item => item.path),
      input: void 0,
      output: isError ? output : void 0
    };
  }
  if (toolName === "run_command") {
    const command = typeof args.command === "string" ? args.command.trim() : "Run command";
    const cwd = typeof args.cwd === "string" && args.cwd.trim() ? args.cwd.trim() : void 0;
    const terminalId = stringField(resultText2, "terminal_id");
    const terminalName = stringField(resultText2, "terminal_name");
    const commandId = stringField(resultText2, "command_id");
    const exitCode = numberField(resultText2, "exit_code");
    const terminalOutput = blockBetween(resultText2, "--- OUTPUT BEGIN ---", "--- OUTPUT END ---");
    const status = stringField(resultText2, "status");
    const subtitle = [terminalName, cwd, status && status !== "completed" ? status : void 0, exitCode !== void 0 && exitCode !== null ? `exit ${exitCode}` : void 0].filter(Boolean).join(" \xB7 ") || void 0;
    return {
      kind: "terminal",
      title: command || "Run command",
      subtitle,
      input: void 0,
      output: terminalOutput ?? (isError ? output : void 0),
      terminalId,
      commandId,
      exitCode
    };
  }
  if (toolName === "get_command_output") {
    const commandId = typeof args.command_id === "string" ? args.command_id : void 0;
    return {
      kind: "terminal",
      title: "Read command output",
      subtitle: [stringField(resultText2, "terminal_name"), stringField(resultText2, "status") ?? commandId].filter(Boolean).join(" \xB7 ") || void 0,
      input: void 0,
      output: blockBetween(resultText2, "--- OUTPUT BEGIN ---", "--- OUTPUT END ---") ?? output,
      terminalId: stringField(resultText2, "terminal_id"),
      commandId,
      exitCode: numberField(resultText2, "exit_code")
    };
  }
  if (toolName === "cancel_command") {
    const commandId = typeof args.command_id === "string" ? args.command_id : void 0;
    const status = stringField(resultText2, "status");
    const forceRequired = stringField(resultText2, "force_required") === "true";
    return {
      kind: "terminal",
      title: status === "cancelled" ? "Cancelled command" : forceRequired ? "Command needs force confirmation" : "Requested command cancellation",
      subtitle: [status, commandId].filter(Boolean).join(" \xB7 ") || void 0,
      input: void 0,
      output: isError ? output : void 0,
      terminalId: stringField(resultText2, "terminal_id"),
      commandId,
      exitCode: numberField(resultText2, "exit_code")
    };
  }
  if (toolName === "send_command_input") {
    const commandId = typeof args.command_id === "string" ? args.command_id : void 0;
    return {
      kind: "terminal",
      title: "Sent command input",
      subtitle: commandId,
      input: boundedText(args.input, 2e3),
      terminalId: stringField(resultText2, "terminal_id"),
      commandId,
      output: isError ? output : void 0
    };
  }
  if (toolName === "get_diagnostics") {
    const scope = typeof args.path === "string" && args.path.trim() ? args.path.trim() : "workspace";
    const items = parseDiagnosticsItems(resultText2);
    const errors = items.filter(item => item.severity === "error").length;
    const warnings = items.filter(item => item.severity === "warning").length;
    const summary = items.length ? `${errors} error${errors === 1 ? "" : "s"} \xB7 ${warnings} warning${warnings === 1 ? "" : "s"}` : "No diagnostics";
    return {
      kind: "diagnostics",
      title: `Checked diagnostics \xB7 ${scope}`,
      subtitle: summary,
      items,
      input: void 0,
      output: isError ? output : void 0
    };
  }
  if (toolName === "lsp") {
    const operationId = typeof args.operation === "string" ? args.operation : "";
    const operation = operationId ? operationId.replace(/_/g, " ") : "code intelligence";
    const subject = typeof args.query === "string" && args.query.trim() ? args.query.trim() : typeof args.path === "string" && args.path.trim() ? args.path.trim() : void 0;
    const items = parseLspItems(resultText2);
    const resultSummary = items.length ? `${items.length} result${items.length === 1 ? "" : "s"}` : subject;
    const hoverOutput = operationId === "hover" ? blockBetween(resultText2, "--- CONTENT BEGIN ---", "--- CONTENT END ---") : void 0;
    return {
      kind: "lsp",
      title: `LSP \xB7 ${operation}`,
      subtitle: resultSummary,
      items,
      input: void 0,
      output: isError ? output : hoverOutput
    };
  }
  return {
    kind: "generic",
    title: toolName,
    input,
    output
  };
}

// extensions/shuncode/src/bridge-tool-dispatcher.ts
export { asRecord3, boundedText, recordArray, uniqueStrings, stringField, numberField, blockBetween, parseListDirectoryItems, parseDiagnosticsItems, parseLspItems, MAX_DIFF_PREVIEW_FILES, MAX_DIFF_PREVIEW_HUNKS_PER_FILE, MAX_DIFF_PREVIEW_LINES_PER_HUNK, diffPath, parseUnifiedDiffPreview, bridgePresentation };
