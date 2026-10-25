// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { __toESM } from "../runtime/helpers.mjs";
import { init_define_SHUNCODE_BUILD_INFO } from "../runtime/build-info.mjs";
import { validateToolInput } from "./tool-input-validation.mjs";
// src/custom-tool-sandbox.ts
init_define_SHUNCODE_BUILD_INFO();
var import_node_child_process5 = require("node:child_process");
var import_node_fs6 = require("node:fs");
var import_node_path10 = __toESM(require("node:path"), 1);
var CUSTOM_TOOL_ARGS_ENV = "SHUNCODE_TOOL_ARGS";
var CUSTOM_TOOL_NAME_ENV = "SHUNCODE_TOOL_NAME";
var MAX_OUTPUT_BYTES = 2 * 1024 * 1024;
var FORCE_KILL_GRACE_MS = 5e3;
var SKILL_INTERPRETERS = /* @__PURE__ */new Set(["powershell.exe", "pwsh.exe", "cmd.exe", "py.exe", "python.exe", "python3.exe", "bash.exe"]);
function runChild(cwd, executable, argv, tool, args, signal) {
  return new Promise(resolve => {
    if (signal?.aborted) {
      resolve({
        exitCode: null,
        stdout: "",
        stderr: "",
        timedOut: false,
        aborted: true
      });
      return;
    }
    let settled = false,
      timedOut = false,
      aborted2 = false;
    let forceTimer;
    const child = (0, import_node_child_process5.execFile)(executable, [...argv], {
      cwd,
      maxBuffer: MAX_OUTPUT_BYTES,
      windowsHide: true,
      env: {
        ...process.env,
        [CUSTOM_TOOL_ARGS_ENV]: JSON.stringify(args),
        [CUSTOM_TOOL_NAME_ENV]: tool.name
      }
    }, (error2, stdout, stderr) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve({
        exitCode: child.exitCode,
        stdout: String(stdout ?? ""),
        stderr: String(stderr ?? "") + (error2 && !timedOut && !aborted2 ? `
${error2.message}` : ""),
        timedOut,
        aborted: aborted2
      });
    });
    const kill = () => {
      if (settled) return;
      child.kill();
      forceTimer = setTimeout(() => {
        if (!settled) child.kill();
      }, FORCE_KILL_GRACE_MS);
    };
    const timer = setTimeout(() => {
      timedOut = true;
      kill();
    }, tool.timeoutMs);
    const onAbort = () => {
      aborted2 = true;
      kill();
    };
    signal?.addEventListener("abort", onAbort, {
      once: true
    });
    const cleanup = () => {
      clearTimeout(timer);
      if (forceTimer) clearTimeout(forceTimer);
      signal?.removeEventListener("abort", onAbort);
    };
  });
}
async function executeCustomTool(workspaceRoots, tool, args, options = {}) {
  validateToolInput(tool.name, tool.inputSchema, args);
  const cwd = workspaceRoots[0];
  if (!cwd) throw new Error(`Custom tool ${tool.name} needs an open workspace folder.`);
  const head = tool.command[0];
  if (!head) throw new Error(`Custom tool ${tool.name} has an empty command.`);
  let executable = head;
  if (head === "node") executable = process.execPath;else if (!(tool.skillDir && SKILL_INTERPRETERS.has(head.toLowerCase()))) {
    const resolved = import_node_path10.default.resolve(cwd, head);
    if (resolved !== cwd && !resolved.startsWith(cwd + import_node_path10.default.sep)) throw new Error(`Custom tool ${tool.name} escapes the workspace: ${head}.`);
    if (!(0, import_node_fs6.existsSync)(resolved)) throw new Error(`Custom tool ${tool.name} script not found: ${head}.`);
    executable = resolved;
  }
  const startedAt = Date.now();
  const outcome = await runChild(cwd, executable, tool.command.slice(1), tool, args, options.signal);
  const durationMs = Date.now() - startedAt;
  const lines = [`Custom tool ${tool.name} ${outcome.aborted ? "aborted" : outcome.timedOut ? "timed out" : `exit_code=${outcome.exitCode ?? "null"}`} in ${durationMs}ms.`];
  if (outcome.stdout) lines.push("--- stdout (tail) ---", outcome.stdout.slice(-6e3));
  if (outcome.stderr) lines.push("--- stderr (tail) ---", outcome.stderr.slice(-2e3));
  return {
    isError: outcome.aborted || outcome.timedOut || outcome.exitCode !== 0,
    text: lines.join("\n"),
    structuredContent: {
      exit_code: outcome.exitCode,
      timed_out: outcome.timedOut,
      aborted: outcome.aborted,
      duration_ms: durationMs
    }
  };
}

// src/custom-tools.ts
export { import_node_child_process5, import_node_fs6, import_node_path10, CUSTOM_TOOL_ARGS_ENV, CUSTOM_TOOL_NAME_ENV, MAX_OUTPUT_BYTES, FORCE_KILL_GRACE_MS, SKILL_INTERPRETERS, runChild, executeCustomTool };
