// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { __toESM } from "../../../runtime/helpers.mjs";
import { init_define_SHUNCODE_BUILD_INFO } from "../../../runtime/build-info.mjs";
// extensions/shuncode/src/lsp-tool.ts
init_define_SHUNCODE_BUILD_INFO();
var import_node_path16 = __toESM(require("node:path"));
var vscode8 = __toESM(require("vscode"));
var HARD_MAX_RESULTS = 500;
var MAX_OUTPUT_CHARS = 64e3;
var MAX_HOVER_ITEM_CHARS = 16e3;
var WORKSPACE_SYMBOL_WARMUP_MAX_CANDIDATES = 64;
var WORKSPACE_SYMBOL_WARMUP_MAX_DOCUMENTS = 3;
var WORKSPACE_SYMBOL_SOURCE_EXTENSIONS = "{ts,tsx,js,jsx,mts,cts,mjs,cjs,py,pyi,go,rs,java,kt,kts,cs,c,cc,cpp,cxx,h,hpp,hxx,rb,php,swift,scala,lua}";
var WORKSPACE_SYMBOL_EXCLUDE_GLOB = "{**/.git/**,**/.carrier/**,**/node_modules/**,**/dist/**,**/build/**,**/coverage/**,**/.next/**,**/target/**,**/vendor/**}";
function asString(value, fallback = "") {
  return typeof value === "string" ? value : fallback;
}
function asBoolean(value, fallback) {
  return typeof value === "boolean" ? value : fallback;
}
function asInteger(value, fallback, min, max) {
  if (!Number.isInteger(value)) return fallback;
  return Math.min(max, Math.max(min, Number(value)));
}
function workspaceRoot() {
  const folder = vscode8.workspace.workspaceFolders?.[0];
  if (!folder) throw new Error("No workspace folder is open.");
  return folder.uri.fsPath;
}
function isInside(root, candidate) {
  const rootResolved = import_node_path16.default.resolve(root);
  const candidateResolved = import_node_path16.default.resolve(candidate);
  const rootCmp = process.platform === "win32" ? rootResolved.toLowerCase() : rootResolved;
  const candidateCmp = process.platform === "win32" ? candidateResolved.toLowerCase() : candidateResolved;
  return candidateCmp === rootCmp || candidateCmp.startsWith(`${rootCmp}${import_node_path16.default.sep}`);
}
function resolveWorkspaceFile(inputPath) {
  const root = workspaceRoot();
  const raw = inputPath.trim();
  if (!raw) throw new Error("path must be a non-empty workspace path");
  const normalized = raw.replace(/\\/g, "/").replace(/^\.\//, "");
  const absolute = import_node_path16.default.isAbsolute(raw) || import_node_path16.default.isAbsolute(normalized) ? import_node_path16.default.resolve(raw) : import_node_path16.default.resolve(root, normalized);
  if (!isInside(root, absolute)) throw new Error(`Path is outside the workspace: ${inputPath}`);
  const relative = import_node_path16.default.relative(root, absolute).replace(/\\/g, "/") || ".";
  return {
    root,
    relative,
    uri: vscode8.Uri.file(absolute)
  };
}
function symbolQueryTokens(query) {
  const expanded = query.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return [...new Set(expanded.split(/[^A-Za-z0-9]+/).map(part => part.toLowerCase()).filter(part => part.length >= 3))];
}
function warmupCandidateScore(relativePath, query, tokens) {
  const lowerPath = relativePath.toLowerCase();
  const lowerBase = import_node_path16.default.basename(relativePath).toLowerCase();
  const lowerQuery = query.toLowerCase();
  let score = 0;
  if (lowerBase.includes(lowerQuery)) score += 200;
  if (lowerPath.includes(lowerQuery)) score += 100;
  for (const token of tokens) {
    if (lowerBase.includes(token)) score += 30;else if (lowerPath.includes(token)) score += 10;
  }
  return score;
}
async function warmWorkspaceSymbolProjects(query, anchorPath) {
  const root = workspaceRoot();
  const candidates = /* @__PURE__ */new Map();
  let searchBase;
  if (anchorPath?.trim()) {
    const anchor = resolveWorkspaceFile(anchorPath);
    try {
      const stat7 = await vscode8.workspace.fs.stat(anchor.uri);
      if (stat7.type & vscode8.FileType.Directory) searchBase = anchor.uri;else candidates.set(anchor.relative, anchor.uri);
    } catch {}
  }
  const tokens = symbolQueryTokens(query);
  for (const token of tokens.slice(0, 3)) {
    const pattern = `**/*${token}*.${WORKSPACE_SYMBOL_SOURCE_EXTENSIONS}`;
    const matches = await vscode8.workspace.findFiles(searchBase ? new vscode8.RelativePattern(searchBase, pattern) : pattern, WORKSPACE_SYMBOL_EXCLUDE_GLOB, 16);
    for (const uri of matches) {
      if (uri.scheme !== "file" || !isInside(root, uri.fsPath)) continue;
      const relative = import_node_path16.default.relative(root, uri.fsPath).replace(/\\/g, "/");
      candidates.set(relative, uri);
      if (candidates.size >= WORKSPACE_SYMBOL_WARMUP_MAX_CANDIDATES) break;
    }
    if (candidates.size >= WORKSPACE_SYMBOL_WARMUP_MAX_CANDIDATES) break;
  }
  if (candidates.size < WORKSPACE_SYMBOL_WARMUP_MAX_DOCUMENTS) {
    const broadPattern = `**/*.${WORKSPACE_SYMBOL_SOURCE_EXTENSIONS}`;
    const broadMatches = await vscode8.workspace.findFiles(searchBase ? new vscode8.RelativePattern(searchBase, broadPattern) : broadPattern, WORKSPACE_SYMBOL_EXCLUDE_GLOB, WORKSPACE_SYMBOL_WARMUP_MAX_CANDIDATES);
    for (const uri of broadMatches) {
      if (uri.scheme !== "file" || !isInside(root, uri.fsPath)) continue;
      const relative = import_node_path16.default.relative(root, uri.fsPath).replace(/\\/g, "/");
      candidates.set(relative, uri);
      if (candidates.size >= WORKSPACE_SYMBOL_WARMUP_MAX_CANDIDATES) break;
    }
  }
  const ranked = [...candidates.entries()].map(([relative, uri]) => ({
    relative,
    uri,
    score: warmupCandidateScore(relative, query, tokens)
  })).sort((a, b) => b.score - a.score || a.relative.localeCompare(b.relative));
  const warmupLimit = ranked[0]?.score > 0 ? 1 : WORKSPACE_SYMBOL_WARMUP_MAX_DOCUMENTS;
  const opened = [];
  for (const {
    relative,
    uri
  } of ranked.slice(0, warmupLimit)) {
    try {
      await vscode8.workspace.openTextDocument(uri);
      opened.push(relative);
    } catch {}
  }
  return opened;
}
async function resolvePosition(input) {
  const file = resolveWorkspaceFile(asString(input.path));
  if (!Number.isInteger(input.line) || Number(input.line) < 1) throw new Error("line must be a 1-based integer >= 1");
  if (!Number.isInteger(input.column) || Number(input.column) < 1) throw new Error("column must be a 1-based integer >= 1");
  const document2 = await vscode8.workspace.openTextDocument(file.uri);
  const lineIndex = Number(input.line) - 1;
  if (lineIndex >= document2.lineCount) {
    throw new Error(`line ${input.line} is outside ${file.relative} (line count: ${document2.lineCount})`);
  }
  const line = document2.lineAt(lineIndex);
  const character = Number(input.column) - 1;
  if (character > line.text.length) {
    throw new Error(`column ${input.column} is outside ${file.relative}:${input.line} (line length: ${line.text.length})`);
  }
  return {
    ...file,
    position: new vscode8.Position(lineIndex, character),
    languageId: document2.languageId
  };
}
function operationDefaultMax(operation) {
  switch (operation) {
    case "definition":
      return 20;
    case "implementation":
      return 50;
    case "workspace_symbols":
      return 50;
    case "hover":
      return 20;
    case "document_symbols":
      return 100;
    case "references":
      return 100;
  }
}
function symbolKindName(kind) {
  const row = Object.entries(vscode8.SymbolKind).find(([, value]) => value === kind);
  return row?.[0] ?? String(kind);
}
function uriDisplay(root, uri) {
  if (uri.scheme === "file" && isInside(root, uri.fsPath)) {
    return {
      path: import_node_path16.default.relative(root, uri.fsPath).replace(/\\/g, "/"),
      workspace: true
    };
  }
  return {
    path: uri.toString(),
    workspace: false
  };
}
function positionText(position) {
  return `${position.line + 1}:${position.character + 1}`;
}
function rangeText(range) {
  return `${positionText(range.start)}-${positionText(range.end)}`;
}
function locationRow(value) {
  if ("targetUri" in value) {
    return {
      uri: value.targetUri,
      range: value.targetRange,
      selectionRange: value.targetSelectionRange,
      originSelectionRange: value.originSelectionRange
    };
  }
  return {
    uri: value.uri,
    range: value.range
  };
}
function locationKey(value, preferSelection = false) {
  const range = preferSelection && value.selectionRange ? value.selectionRange : value.range;
  return `${value.uri.toString()}#${range.start.line}:${range.start.character}:${range.end.line}:${range.end.character}`;
}
function markdownText(value) {
  if (typeof value === "string") return value;
  if (value instanceof vscode8.MarkdownString) return value.value;
  if (value && typeof value === "object") {
    const row = value;
    if (typeof row.value === "string") {
      return typeof row.language === "string" && row.language ? `\`\`\`${row.language}
${row.value}
\`\`\`` : row.value;
    }
  }
  return String(value ?? "");
}
function boundedText2(text, maxChars) {
  if (text.length <= maxChars) return {
    text,
    truncated: false
  };
  const marker = "\n...[truncated]...\n";
  const budget = Math.max(0, maxChars - marker.length);
  const head = Math.floor(budget * 0.4);
  return {
    text: `${text.slice(0, head)}${marker}${text.slice(-(budget - head))}`,
    truncated: true
  };
}
function providerMetadataLines(metadata) {
  return [`provider_state: ${metadata.providerState}`, `provider_state_basis: ${metadata.providerStateBasis}`, `project_anchor: ${JSON.stringify(metadata.projectAnchor ?? null)}`, `project_anchor_source: ${metadata.projectAnchorSource}`, `warmup_performed: ${metadata.warmupPerformed}`, `semantic_result_inconclusive: ${metadata.semanticResultInconclusive}`];
}
function resultProviderMetadata(resultCount, projectAnchor, projectAnchorSource = projectAnchor ? "explicit" : "none") {
  return {
    providerState: resultCount > 0 ? "ready" : "unknown",
    providerStateBasis: resultCount > 0 ? "semantic_results" : "public_api_ambiguous_empty_result",
    projectAnchor,
    projectAnchorSource,
    warmupPerformed: false,
    semanticResultInconclusive: resultCount === 0
  };
}
function emitEnvelope(operation, metadata, blocks, totalResults, maxResults) {
  const selected = blocks.slice(0, maxResults);
  const lines = ["=== LSP BEGIN ===", `operation: ${operation}`, ...metadata, `total_results: ${totalResults}`, `max_results: ${maxResults}`];
  let truncated = totalResults > selected.length;
  let used = lines.join("\n").length;
  const emitted = [];
  for (const block of selected) {
    if (used + block.length + 1 > MAX_OUTPUT_CHARS) {
      truncated = true;
      break;
    }
    emitted.push(block);
    used += block.length + 1;
  }
  return [...lines, `returned_results: ${emitted.length}`, `truncated: ${truncated}`, "--- RESULTS ---", ...emitted, "=== LSP END ==="].join("\n");
}
function formatLocations(root, operation, rows, maxResults, metadata) {
  const blocks = rows.map((row, index) => {
    const display = uriDisplay(root, row.uri);
    return [`--- RESULT ${index + 1} ---`, `path: ${JSON.stringify(display.path)}`, `workspace: ${display.workspace}`, `range: ${rangeText(row.range)}`, ...(row.selectionRange ? [`selection_range: ${rangeText(row.selectionRange)}`] : []), ...(row.originSelectionRange ? [`origin_selection_range: ${rangeText(row.originSelectionRange)}`] : [])].join("\n");
  });
  return emitEnvelope(operation, metadata, blocks, rows.length, maxResults);
}
async function locationOperation(operation, input, maxResults) {
  const source = await resolvePosition(input);
  const command = operation === "definition" ? "vscode.executeDefinitionProvider" : operation === "references" ? "vscode.executeReferenceProvider" : "vscode.executeImplementationProvider";
  const raw = await vscode8.commands.executeCommand(command, source.uri, source.position);
  let rows = (raw ?? []).map(locationRow);
  const providerMetadata = resultProviderMetadata(rows.length, source.relative);
  if (operation === "references" && !asBoolean(input.include_declaration, true) && rows.length > 0) {
    const definitions = await vscode8.commands.executeCommand("vscode.executeDefinitionProvider", source.uri, source.position);
    const definitionKeys = new Set((definitions ?? []).map(value => locationKey(locationRow(value), true)));
    rows = rows.filter(row => !definitionKeys.has(locationKey(row)));
  }
  return formatLocations(source.root, operation, rows, maxResults, [`source: ${JSON.stringify(source.relative)}`, `position: ${positionText(source.position)}`, `language_id: ${JSON.stringify(source.languageId)}`, ...providerMetadataLines(providerMetadata), ...(operation === "references" ? [`include_declaration: ${asBoolean(input.include_declaration, true)}`] : [])]);
}
async function workspaceSymbols(input, maxResults) {
  const root = workspaceRoot();
  const query = asString(input.query).trim();
  if (!query) throw new Error("workspace_symbols requires a non-empty query");
  const anchorPath = asString(input.path).trim();
  const explicitAnchor = anchorPath ? resolveWorkspaceFile(anchorPath) : void 0;
  let warmupDocuments = [];
  let symbols = (await vscode8.commands.executeCommand("vscode.executeWorkspaceSymbolProvider", query)) ?? [];
  const initialResults = symbols.length;
  if (symbols.length === 0) {
    warmupDocuments = await warmWorkspaceSymbolProjects(query, explicitAnchor?.relative);
    if (warmupDocuments.length > 0) {
      symbols = (await vscode8.commands.executeCommand("vscode.executeWorkspaceSymbolProvider", query)) ?? [];
    }
  }
  const inconclusive = symbols.length === 0;
  const projectAnchor = explicitAnchor?.relative || warmupDocuments[0];
  const projectAnchorSource = explicitAnchor ? "explicit" : warmupDocuments[0] ? "warmup_candidate" : "none";
  const providerMetadata = {
    providerState: symbols.length > 0 ? "ready" : "unknown",
    providerStateBasis: symbols.length > 0 ? "semantic_results" : "public_api_ambiguous_empty_result",
    projectAnchor,
    projectAnchorSource,
    warmupPerformed: warmupDocuments.length > 0,
    semanticResultInconclusive: inconclusive
  };
  const blocks = symbols.map((symbol, index) => {
    const display = uriDisplay(root, symbol.location.uri);
    return [`--- RESULT ${index + 1} ---`, `name: ${JSON.stringify(symbol.name)}`, `kind: ${symbolKindName(symbol.kind)}`, `container: ${JSON.stringify(symbol.containerName || null)}`, `path: ${JSON.stringify(display.path)}`, `workspace: ${display.workspace}`, `range: ${rangeText(symbol.location.range)}`].join("\n");
  });
  return emitEnvelope("workspace_symbols", [`query: ${JSON.stringify(query)}`, `anchor_path: ${JSON.stringify(explicitAnchor?.relative ?? null)}`, `initial_results: ${initialResults}`, `provider_state_before_retry: ${initialResults === 0 && warmupDocuments.length > 0 ? "warming" : "null"}`, ...providerMetadataLines(providerMetadata), `warmup_attempted: ${warmupDocuments.length > 0}`, `warmup_documents: ${JSON.stringify(warmupDocuments)}`, ...(inconclusive ? ["note: Empty workspace-symbol results do not prove that the symbol is absent. Language providers may only index active/open projects. Fall back to search_files for exact symbol text, or retry with path as a project/file anchor."] : [])], blocks, symbols.length, maxResults);
}
async function documentSymbols(input, maxResults) {
  const file = resolveWorkspaceFile(asString(input.path));
  const document2 = await vscode8.workspace.openTextDocument(file.uri);
  const symbols = (await vscode8.commands.executeCommand("vscode.executeDocumentSymbolProvider", file.uri)) ?? [];
  const blocks = symbols.map((symbol, index) => {
    if ("location" in symbol) {
      const display = uriDisplay(file.root, symbol.location.uri);
      return [`--- RESULT ${index + 1} ---`, `name: ${JSON.stringify(symbol.name)}`, `kind: ${symbolKindName(symbol.kind)}`, `container: ${JSON.stringify(symbol.containerName || null)}`, `path: ${JSON.stringify(display.path)}`, `workspace: ${display.workspace}`, `range: ${rangeText(symbol.location.range)}`].join("\n");
    }
    return [`--- RESULT ${index + 1} ---`, `name: ${JSON.stringify(symbol.name)}`, `kind: ${symbolKindName(symbol.kind)}`, `detail: ${JSON.stringify(symbol.detail || null)}`, `path: ${JSON.stringify(file.relative)}`, "workspace: true", `range: ${rangeText(symbol.range)}`, `selection_range: ${rangeText(symbol.selectionRange)}`].join("\n");
  });
  return emitEnvelope("document_symbols", [`path: ${JSON.stringify(file.relative)}`, `language_id: ${JSON.stringify(document2.languageId)}`, ...providerMetadataLines(resultProviderMetadata(symbols.length, file.relative))], blocks, symbols.length, maxResults);
}
async function hover(input, maxResults) {
  const source = await resolvePosition(input);
  const hovers = (await vscode8.commands.executeCommand("vscode.executeHoverProvider", source.uri, source.position)) ?? [];
  let contentTruncated = false;
  const blocks = hovers.map((item, index) => {
    const bounded = boundedText2(item.contents.map(markdownText).filter(Boolean).join("\n\n"), MAX_HOVER_ITEM_CHARS);
    contentTruncated ||= bounded.truncated;
    return [`--- RESULT ${index + 1} ---`, ...(item.range ? [`range: ${rangeText(item.range)}`] : []), "--- CONTENT BEGIN ---", bounded.text, "--- CONTENT END ---"].join("\n");
  });
  return emitEnvelope("hover", [`source: ${JSON.stringify(source.relative)}`, `position: ${positionText(source.position)}`, `language_id: ${JSON.stringify(source.languageId)}`, ...providerMetadataLines(resultProviderMetadata(hovers.length, source.relative)), `content_truncated: ${contentTruncated}`], blocks, hovers.length, maxResults);
}
async function invokeLspTool(input) {
  const operation = asString(input.operation);
  const validOperations = /* @__PURE__ */new Set(["workspace_symbols", "document_symbols", "definition", "references", "implementation", "hover"]);
  if (!validOperations.has(operation)) {
    throw new Error(`Unsupported lsp operation: ${JSON.stringify(input.operation)}`);
  }
  const maxResults = asInteger(input.max_results, operationDefaultMax(operation), 1, HARD_MAX_RESULTS);
  switch (operation) {
    case "workspace_symbols":
      return workspaceSymbols(input, maxResults);
    case "document_symbols":
      return documentSymbols(input, maxResults);
    case "definition":
      return locationOperation("definition", input, maxResults);
    case "references":
      return locationOperation("references", input, maxResults);
    case "implementation":
      return locationOperation("implementation", input, maxResults);
    case "hover":
      return hover(input, maxResults);
  }
}

// extensions/shuncode/src/ide-tool-broker.ts
export { import_node_path16, vscode8, HARD_MAX_RESULTS, MAX_OUTPUT_CHARS, MAX_HOVER_ITEM_CHARS, WORKSPACE_SYMBOL_WARMUP_MAX_CANDIDATES, WORKSPACE_SYMBOL_WARMUP_MAX_DOCUMENTS, WORKSPACE_SYMBOL_SOURCE_EXTENSIONS, WORKSPACE_SYMBOL_EXCLUDE_GLOB, asString, asBoolean, asInteger, workspaceRoot, isInside, resolveWorkspaceFile, symbolQueryTokens, warmupCandidateScore, warmWorkspaceSymbolProjects, resolvePosition, operationDefaultMax, symbolKindName, uriDisplay, positionText, rangeText, locationRow, locationKey, markdownText, boundedText2, providerMetadataLines, resultProviderMetadata, emitEnvelope, formatLocations, locationOperation, workspaceSymbols, documentSymbols, hover, invokeLspTool };
