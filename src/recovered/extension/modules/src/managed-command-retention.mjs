// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { init_define_SHUNCODE_BUILD_INFO } from "../runtime/build-info.mjs";
// src/managed-command-retention.ts
init_define_SHUNCODE_BUILD_INFO();
var MANAGED_COMMAND_COMPLETED_STATE_TTL_MS = 60 * 60 * 1e3;
var MAX_COMPLETED_COMMAND_STATES_PER_OWNER = 32;
function managedCommandStateIdsToPrune(records, now = Date.now()) {
  const prune = /* @__PURE__ */new Set();
  const retainedByOwner = /* @__PURE__ */new Map();
  for (const record4 of records) {
    if (record4.status === "running") continue;
    if (record4.endedAt === void 0 || now - record4.endedAt >= MANAGED_COMMAND_COMPLETED_STATE_TTL_MS) {
      prune.add(record4.id);
      continue;
    }
    const retained = retainedByOwner.get(record4.ownerId) ?? [];
    retained.push(record4);
    retainedByOwner.set(record4.ownerId, retained);
  }
  for (const retained of retainedByOwner.values()) {
    retained.sort((a, b) => (b.endedAt ?? 0) - (a.endedAt ?? 0) || a.id.localeCompare(b.id));
    for (const excess of retained.slice(MAX_COMPLETED_COMMAND_STATES_PER_OWNER)) prune.add(excess.id);
  }
  return [...prune];
}

// src/managed-terminal-lifecycle.ts
export { MANAGED_COMMAND_COMPLETED_STATE_TTL_MS, MAX_COMPLETED_COMMAND_STATES_PER_OWNER, managedCommandStateIdsToPrune };
