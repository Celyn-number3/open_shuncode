// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { init_define_SHUNCODE_BUILD_INFO } from "../../../runtime/build-info.mjs";
// extensions/shuncode/src/model-reasoning.mts
init_define_SHUNCODE_BUILD_INFO();
var REASONING_EFFORTS = ["none", "minimal", "low", "medium", "high", "xhigh", "max", "ultra"];
var THINKING_MODES = ["enabled", "disabled"];
function genericReasoningPickerValues(reasoningEfforts) {
  return ["inherit", "enabled", "disabled", ...new Set(reasoningEfforts)];
}
function resolveGenericReasoningOverride(value, allowedReasoningEfforts, fallbackEffort) {
  const normalized = typeof value === "string" ? value.trim() : "";
  if (normalized === "enabled") {
    return {
      thinking: "enabled",
      reasoningEffort: fallbackEffort ?? "medium"
    };
  }
  if (normalized === "disabled") {
    return {
      thinking: "disabled"
    };
  }
  if (allowedReasoningEfforts.includes(normalized)) {
    return {
      thinking: "enabled",
      reasoningEffort: normalized
    };
  }
  return void 0;
}
function resolveMergeReasoningOverride(value, profile) {
  const normalized = typeof value === "string" ? value.trim() : "";
  if (normalized === "disabled") {
    if (profile.codex) return void 0;
    return {
      thinking: "disabled"
    };
  }
  if (profile.reasoningEfforts.includes(normalized)) {
    return profile.codex ? {
      reasoningEffort: normalized
    } : {
      thinking: "enabled",
      reasoningEffort: normalized
    };
  }
  return void 0;
}

// extensions/shuncode/src/model-provider.ts
export { REASONING_EFFORTS, THINKING_MODES, genericReasoningPickerValues, resolveGenericReasoningOverride, resolveMergeReasoningOverride };
