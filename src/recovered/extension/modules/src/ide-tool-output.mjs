// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { init_define_SHUNCODE_BUILD_INFO } from "../runtime/build-info.mjs";
// src/ide-tool-output.ts
init_define_SHUNCODE_BUILD_INFO();
function ideToolStructuredContent(name, text) {
  const tags = {
    run_command: "RUN_COMMAND",
    get_command_output: "COMMAND_OUTPUT",
    cancel_command: "CANCEL_COMMAND",
    send_command_input: "SEND_COMMAND_INPUT"
  };
  const tag = tags[name];
  if (!tag) return {
    text
  };
  const fail2 = () => {
    throw new Error(`Invalid ${name} result envelope. The operation may already have executed; do not retry automatically.
${text}`);
  };
  const opening = `=== ${tag} BEGIN ===
`;
  const closing = `=== ${tag} END ===`;
  if (!text.startsWith(opening) || !text.endsWith(closing)) return fail2();
  const hasOutput = name === "run_command" || name === "get_command_output";
  const begin = "\n--- OUTPUT BEGIN ---\n";
  const end = `
--- OUTPUT END ---
${closing}`;
  const boundary = hasOutput ? text.indexOf(begin, opening.length) : text.length - closing.length - 1;
  if (boundary < opening.length || hasOutput && !text.endsWith(end)) return fail2();
  const result = {};
  const allowed = /* @__PURE__ */new Set(["command_id", "terminal_id", "terminal_name", "execution", "shell", "terminal_reused", "command", "status", "exit_code", "pipeline_exit_codes", "cwd", "background", "script_bridge", "shell_prompt_seq", "recovered_by_abort", "suspected_parser_error", "hint", "duration_ms", "next_offset", "total_output_bytes", "output_lost", "output_start_offset", "has_more", "status_before", "cancel_requested", "already_requested", "already_finished", "interrupt_sent", "force_required", "forced", "risk", "terminal_reusable", "bytes_sent", "append_newline"]);
  for (const line of text.slice(opening.length, boundary).split("\n")) {
    const match = /^([a-z_]+): (.*)$/.exec(line);
    if (!match || !allowed.has(match[1]) || Object.hasOwn(result, match[1])) return fail2();
    const [, key, value] = match;
    try {
      result[key] = JSON.parse(value);
    } catch {
      result[key] = value;
    }
  }
  if (typeof result.command_id !== "string" || !result.command_id.trim()) return fail2();
  if (typeof result.status !== "string" || !["running", "completed", "failed", "killed", "cancelled"].includes(result.status)) return fail2();
  for (const key of ["terminal_id", "cwd"]) if (result[key] !== void 0 && typeof result[key] !== "string") return fail2();
  if (result.exit_code !== void 0 && result.exit_code !== null && !Number.isSafeInteger(result.exit_code)) return fail2();
  if (result.pipeline_exit_codes !== void 0 && result.pipeline_exit_codes !== null && (!Array.isArray(result.pipeline_exit_codes) || !result.pipeline_exit_codes.every(Number.isSafeInteger))) return fail2();
  if (hasOutput) result.output = text.slice(boundary + begin.length, text.length - end.length);
  return result;
}

// src/bridge-activity-tracker.ts
export { ideToolStructuredContent };
