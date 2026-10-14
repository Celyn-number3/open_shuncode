"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");
const READ_TOOLS = new Set(["list_directory", "find_files", "search_files", "read_files", "read_image", "lsp", "get_diagnostics", "set_todos", "update_plan", "report_progress", "cancel_command"]);
const TERMINAL_TOOLS = new Set(["run_command", "get_command_output", "send_command_input"]);
const BUILTIN_TOOLS = new Set([...READ_TOOLS, ...TERMINAL_TOOLS, "apply_patch"]);
function redact(value) {
  if (typeof value !== "string") return value;
  return value
    .replace(/\/(mcp|healthz)\/[^\s/?#"'<>]+/gi, "/$1/[REDACTED]")
    .replace(/\bBearer\s+[A-Za-z0-9._~+/=-]+/gi, "Bearer [REDACTED]")
    .replace(/\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-(?:proj-|ant-)?[A-Za-z0-9_-]{20,})\b/g, "[REDACTED]")
    .replace(/((?:api[_-]?key|password|access[_-]?token|refresh[_-]?token|authorization|secret|token)\s*["']?\s*[:=]\s*["']?)([^\s,"'}]+)/gi, "$1[REDACTED]");
}
function redactObject(value) {
  if (typeof value === "string") return redact(value);
  if (Array.isArray(value)) return value.map(redactObject);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k,v]) => [k, /^(apiKey|password|accessToken|refreshToken|authorization|secret|token)$/i.test(k) ? "[REDACTED]" : redactObject(v)]));
  return value;
}
function inside(root, target) {
  const relative = path.relative(root, target);
  return relative === "" || (!path.isAbsolute(relative) && relative !== ".." && !relative.startsWith(".." + path.sep));
}
function realDestination(target) {
  let ancestor = path.resolve(target);
  const suffix = [];
  // Resolve the nearest existing ancestor, including symlinks/junctions. Do not
  // mistake permission errors or dangling links for safe nonexistent paths.
  while (true) {
    try { fs.lstatSync(ancestor); break; }
    catch (error) {
      if (error.code !== "ENOENT") throw error;
      const parent = path.dirname(ancestor);
      if (parent === ancestor) throw error;
      suffix.unshift(path.basename(ancestor)); ancestor = parent;
    }
  }
  return path.join(fs.realpathSync(ancestor), ...suffix);
}
function checkWorkspacePath(value, roots) {
  if (typeof value !== "string" || !value.trim()) throw new Error("INVALID_PATH");
  if (!roots.length) throw new Error("NO_WORKSPACE");
  const canonicalRoots = roots.map(root => fs.realpathSync(root));
  const raw = value.replace(/\\/g, path.sep);
  // A drive path on a non-Windows host must not become a relative filename.
  if (process.platform !== "win32" && /^[A-Za-z]:/.test(raw)) throw new Error("PATH_OUTSIDE_WORKSPACE");
  if (raw.startsWith("\\\\") || raw.startsWith("//")) throw new Error("PATH_OUTSIDE_WORKSPACE");
  const target = path.isAbsolute(raw) ? path.resolve(raw) : path.resolve(roots[0], raw);
  if (!roots.some(root => inside(path.resolve(root), target))) throw new Error("PATH_OUTSIDE_WORKSPACE");
  const resolved = realDestination(target);
  if (!canonicalRoots.some(root => inside(root, resolved))) throw new Error("PATH_OUTSIDE_WORKSPACE");
}
function validateToolPaths(tool, args, roots) {
  if (tool === "read_files") {
    if (!Array.isArray(args.files)) throw new Error("INVALID_INPUT");
    for (const file of args.files) checkWorkspacePath(file.path, roots);
  } else if (tool === "apply_patch") {
    if (typeof args.patch !== "string") throw new Error("INVALID_INPUT");
    const directives = [...args.patch.matchAll(/^\*\*\* (?:Add|Update|Delete|Move to)(?: File)?:\s*(.+)$/gm)];
    if (!directives.length) throw new Error("INVALID_PATCH");
    for (const directive of directives) checkWorkspacePath(directive[1].trim(), roots);
  } else if (["list_directory", "find_files", "search_files", "read_image", "lsp"].includes(tool)) {
    if (args.path !== undefined || tool !== "lsp") checkWorkspacePath(args.path ?? ".", roots);
  } else if (tool === "get_diagnostics") {
    for (const p of args.paths ?? []) checkWorkspacePath(p, roots);
    if (args.path !== undefined) checkWorkspacePath(args.path, roots);
  }
}
class BridgeSecurityPolicy {
  constructor({ now = Date.now, onRevoke = () => {}, maxSessions = 64, idleMs = 15 * 60_000 } = {}) {
    this.now = now; this.onRevoke = onRevoke; this.maxSessions = maxSessions; this.idleMs = idleMs;
    this.sessions = new Map(); this.audit = []; this.revision = 0;
  }
  touch(owner) {
    if (typeof owner !== "string" || !owner.startsWith("bridge:") || owner.length < 8) throw new Error("MCP_SESSION_UNAVAILABLE");
    this.expire();
    let session = this.sessions.get(owner);
    if (!session) {
      if (this.sessions.size >= this.maxSessions) throw new Error("SECURITY_SESSION_LIMIT");
      session = { owner, id: createHash("sha256").update(owner).digest("hex").slice(0,12), mode:"readOnly", terminal:false, customTools:false, lastActivity:this.now(), expiresAt:0 };
      this.sessions.set(owner,session); this.revision++;
    }
    session.lastActivity = this.now();
    return session;
  }
  grant(owner, { mode = "readOnly", terminal = false, customTools = false, minutes = 15 } = {}) {
    if (!["readOnly","project","device"].includes(mode) || !Number.isFinite(minutes) || minutes <= 0 || minutes > 60) throw new Error("INVALID_GRANT");
    if (mode !== "device" && (terminal || customTools)) throw new Error("DEVICE_CONSENT_REQUIRED");
    const s = this.touch(owner);
    // Downgrading also cancels commands created with the old capability.
    if (s.terminal || s.customTools) this.revoke(owner,"regrant");
    Object.assign(s,{ mode, terminal:!!terminal, customTools:!!customTools, expiresAt: mode === "readOnly" ? 0 : this.now()+minutes*60_000 });
    this.record(owner,"grant",mode); this.revision++;
    return this.snapshot();
  }
  revoke(owner, reason = "local-user") {
    const s = this.sessions.get(owner); if (!s) return;
    const had = s.mode !== "readOnly";
    Object.assign(s,{ mode:"readOnly", terminal:false, customTools:false, expiresAt:0 });
    if (had) { this.onRevoke(owner); this.record(owner,"revoke",reason); this.revision++; }
  }
  forget(owner,reason="disconnect") { this.revoke(owner,reason); if(this.sessions.delete(owner))this.revision++; }
  revokeAll(reason="local-user") { for(const owner of this.sessions.keys())this.revoke(owner,reason); }
  expire() {
    const now=this.now();
    for(const [owner,s] of [...this.sessions]) {
      if(s.expiresAt && now>=s.expiresAt)this.revoke(owner,"grant-expired");
      if(now-s.lastActivity>=this.idleMs)this.forget(owner,"idle-expired");
    }
  }
  allows(owner,tool) {
    const s=this.touch(owner);
    if(READ_TOOLS.has(tool))return true;
    if(tool === "apply_patch")return s.mode === "project" || s.mode === "device";
    if(TERMINAL_TOOLS.has(tool))return s.mode === "device" && s.terminal;
    return s.mode === "device" && s.customTools && !BUILTIN_TOOLS.has(tool);
  }
  record(owner,action,detail) {
    const id=this.sessions.get(owner)?.id ?? "unknown";
    this.audit.push({ at:this.now(), session:id, action, detail:redact(String(detail)) });
    if(this.audit.length>200)this.audit.shift();
  }
  snapshot() {
    this.expire();
    return { defaultMode:"readOnly", sandboxed:false, revision:this.revision, sessions:[...this.sessions.values()].map(({owner,...s})=>({...s})), audit:this.audit.map(x=>({...x})) };
  }
}
module.exports={ BridgeSecurityPolicy, READ_TOOLS, TERMINAL_TOOLS, BUILTIN_TOOLS, redact, redactObject, checkWorkspacePath, validateToolPaths };
