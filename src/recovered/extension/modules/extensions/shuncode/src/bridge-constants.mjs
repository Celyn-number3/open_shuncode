// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { init_define_SHUNCODE_BUILD_INFO } from "../../../runtime/build-info.mjs";
import { FILE_TOOL_DEFINITIONS } from "../../../src/file-tool-registry.mjs";
import { BRIDGE_EXCLUDED_TOOL_NAMES, IDE_TOOL_DEFINITIONS } from "../../../src/ide-tool-definitions.mjs";
// extensions/shuncode/src/bridge-constants.ts
init_define_SHUNCODE_BUILD_INFO();
var MAX_REQUEST_BYTES = 8 * 1024 * 1024;
var MAX_ACTIVITY = 60;
var MAX_TODOS = 24;
var SESSION_IDLE_TIMEOUT_MS = Number.POSITIVE_INFINITY;
var SESSION_PRUNE_INTERVAL_MS = 6e4;
var MAX_SESSIONS = 64;
var SESSION_KEEPALIVE_INTERVAL_MS = 15e3;
var SESSION_RETRY_INTERVAL_MS = 2e3;
var SESSION_EVENT_STORE_LIMIT = 512;
var BRIDGE_SERVER_INSTRUCTIONS = `You are connected to the local Windows host running the currently open ShunCode workspace.

ShunCode executes tools and displays your task state, progress, and tool activity to the local user.

Use:
- list_directory/find_files to discover files
- search_files for raw text search
- lsp for semantic code navigation
- read_files before editing
- apply_patch for workspace changes
- get_diagnostics after edits
- run_command for builds and tests
- set_todos to maintain the complete task list for multi-step work
- update_plan for Codex-style { plan: [{ step, status }] } clients (Bridge-owned compatibility form of set_todos)
- report_progress to report transient progress for the current task

Parallelism: independent tool calls may be issued concurrently and the Bridge runs them in parallel; measured throughput rises roughly linearly with the number of in-flight calls, so batching independent reads, searches and probes into one parallel round is markedly faster than issuing them one after another. Serialize only where a real dependency exists: an edit that must observe a prior read, or a command whose input depends on an earlier result. Do not parallelize writes to the same file. The host caps how many tool calls execute at once and queues the remainder, so a large parallel burst stays correct and merely finishes in successive waves rather than failing \u2014 there is no need to self-throttle or to stagger calls defensively. cancel_command, get_command_output and send_command_input are never queued, so a long-running command can always be inspected or stopped even while the cap is saturated.

Task coordination:
- At the start of each new multi-step job, before other work, call this Bridge set_todos with new_task=true and the full plan (or an empty plan to announce planning). Reuse its task_id and task_revision as expected_revision in subsequent updates.
- Use set_todos for multi-step work, significant replanning, or validation workflows.
- Send acknowledged updates at meaningful step transitions. Default mode=replace requires the whole list; mode=patch merges stable IDs and requires expected_revision.
- Before every final reply send lifecycle=completed with all steps completed, or lifecycle=blocked/cancelled with truthful unfinished steps. Await acknowledgement. Never rely on disconnect or idle to finish a task.
- Task history is bounded to the last 16 jobs and 8 updates per job in this running Bridge; restart does not persist tasks.
- Send the complete ordered todo list whenever task state changes.
- Keep at most one todo in_progress.
- Use stable todo IDs across updates.
- Keep todos at the goal level; do not create one todo per tool call.
- Use report_progress for what you are doing right now, not for durable task state.
- When there is exactly one in_progress todo, report_progress is automatically associated with it.
- Pass todo_id only when an explicit association is needed.
- Send an empty todo list when the task state should be cleared.

Tool guidance:
- Prefer semantic navigation over broad text search when locating code symbols.
- Do not assume an empty LSP result means a symbol does not exist.
- Use search_files for exact text and lsp for symbols, definitions, references, and type information.
- Reread affected files after stale patch or context-mismatch failures before retrying.
- Prefer small, focused patches with enough unique context.
- Run diagnostics and relevant tests after meaningful edits.
- Report meaningful progress periodically during long work, but avoid progress updates for every tool call.

Deliverable sync: every analysis, audit, plan, or review produced during a session is written into this repository under docs/ before the session ends, following the existing docs/mcp-<topic>.md naming, with LF endings and no trailing whitespace, and intra-document references rewritten to repo paths. Probe scripts, machine-readable baselines, and logs stay outside docs/ unless the user asks for them.`;
var DEFAULT_BRIDGE_TOOL_CONCURRENCY = 16;
var MAX_BRIDGE_TOOL_CONCURRENCY = 64;
var BRIDGE_TOOL_CONCURRENCY_SETTING = "bridge.toolConcurrency";
function resolveBridgeToolConcurrency(configured) {
  const value = Number(configured);
  if (!Number.isFinite(value)) return DEFAULT_BRIDGE_TOOL_CONCURRENCY;
  return Math.min(MAX_BRIDGE_TOOL_CONCURRENCY, Math.max(1, Math.trunc(value)));
}
var SET_TODOS_TOOL = {
  name: "set_todos",
  title: "Set Todos",
  description: "Set the complete durable task list for the current remote-agent job in ShunCode. Use this for multi-step work so the local user can see what is done, in progress, and still pending. Send the full list whenever the plan changes; keep at most one item in_progress. Immediately before a final answer, send the terminal snapshot and wait for acknowledgement; if the work is complete every item must be completed. Use report_progress for transient details instead of creating tool-call-sized todos. Send an empty list to clear only the current job. Use new_task=true at the start of a different job; reuse acknowledged task_id/expected_revision when continuing or resuming. Use lifecycle=blocked/cancelled when ending with unfinished work. mode=patch preserves omitted steps and requires expected_revision.",
  inputSchema: {
    type: "object",
    required: ["todos"],
    properties: {
      task_id: {
        type: "string",
        minLength: 1,
        maxLength: 80,
        description: "Opaque Bridge task handle returned by a previous acknowledgement; supports explicit reconnect/resume."
      },
      expected_revision: {
        type: "integer",
        minimum: 1,
        description: "Last acknowledged task_revision. Required with task_id or patch to reject stale writes."
      },
      new_task: {
        type: "boolean",
        description: "Start a distinct job/turn without clearing another task. Do not combine with task_id or expected_revision."
      },
      lifecycle: {
        type: "string",
        enum: ["running", "completed", "blocked", "cancelled"],
        description: "Explicit task state. Before final reply send completed only if every step is complete; otherwise send blocked/cancelled truthfully."
      },
      mode: {
        type: "string",
        enum: ["replace", "patch"],
        description: "replace (default) replaces the full plan. patch merges stable IDs, requires expected_revision, and preserves omitted steps."
      },
      todos: {
        type: "array",
        maxItems: MAX_TODOS,
        description: "Complete ordered todo snapshot for the current job.",
        items: {
          type: "object",
          required: ["id", "title", "status"],
          properties: {
            id: {
              type: "string",
              minLength: 1,
              maxLength: 80,
              description: "Stable id reused across later set_todos updates."
            },
            title: {
              type: "string",
              minLength: 1,
              maxLength: 400,
              description: "Goal-level task title, not an individual tool call."
            },
            status: {
              type: "string",
              enum: ["pending", "in_progress", "completed"],
              description: "Current todo state. Keep at most one todo in_progress."
            }
          },
          additionalProperties: false
        }
      }
    },
    additionalProperties: false
  },
  outputSchema: {
    type: "object",
    required: ["todos"],
    properties: {
      todos: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string"
            },
            title: {
              type: "string"
            },
            status: {
              type: "string",
              enum: ["pending", "in_progress", "completed"]
            }
          },
          required: ["id", "title", "status"]
        }
      }
    },
    additionalProperties: true
  },
  annotations: {
    title: "Set Todos",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  }
};
var UPDATE_PLAN_TOOL = {
  name: "update_plan",
  title: "Update Plan",
  description: "Compatibility plan updater for the current remote-agent job in ShunCode. It accepts the Codex-style plan array and publishes it to the same durable task card as set_todos. This must be the Bridge MCP tool call: updating only a client-local plan does not update ShunCode. Send the full plan whenever state changes, and immediately before a final answer send the terminal snapshot and wait for acknowledgement. When work is complete every item must be completed; when blocked or incomplete keep truthful non-terminal statuses and set lifecycle=blocked. Start with new_task=true; reuse acknowledged task_id and expected_revision to avoid stale writes.",
  inputSchema: {
    type: "object",
    required: ["plan"],
    properties: {
      task_id: {
        type: "string",
        minLength: 1,
        maxLength: 80,
        description: "Opaque Bridge task handle returned by a previous acknowledgement; supports explicit reconnect/resume."
      },
      expected_revision: {
        type: "integer",
        minimum: 1,
        description: "Last acknowledged task_revision. Required with task_id or patch to reject stale writes."
      },
      new_task: {
        type: "boolean",
        description: "Start a distinct job/turn without clearing another task. Do not combine with task_id or expected_revision."
      },
      lifecycle: {
        type: "string",
        enum: ["running", "completed", "blocked", "cancelled"],
        description: "Explicit task state. Before final reply send completed only if every step is complete; otherwise send blocked/cancelled truthfully."
      },
      explanation: {
        type: "string",
        maxLength: 2e3,
        description: "Optional concise reason for the plan update; task-card state is derived from plan."
      },
      plan: {
        type: "array",
        maxItems: MAX_TODOS,
        description: "Complete ordered plan snapshot for the current job.",
        items: {
          type: "object",
          required: ["step", "status"],
          properties: {
            step: {
              type: "string",
              minLength: 1,
              maxLength: 400,
              description: "Goal-level step title displayed in the ShunCode task card."
            },
            status: {
              type: "string",
              enum: ["pending", "in_progress", "completed"],
              description: "Current step status. Keep at most one item in_progress."
            }
          },
          additionalProperties: false
        }
      }
    },
    additionalProperties: false
  },
  outputSchema: {
    type: "object",
    required: ["plan"],
    properties: {
      plan: {
        type: "array",
        items: {
          type: "object",
          properties: {
            step: {
              type: "string"
            },
            status: {
              type: "string",
              enum: ["pending", "in_progress", "completed"]
            }
          },
          required: ["step", "status"]
        }
      }
    },
    additionalProperties: true
  },
  annotations: {
    title: "Update Plan",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  }
};
var REPORT_PROGRESS_TOOL = {
  name: "report_progress",
  title: "Report Progress",
  description: "Report concise transient progress from the remote MCP agent to the ShunCode Bridge UI. For multi-step work, maintain durable task state with set_todos and use report_progress for what you are doing right now. todo_id is optional: when omitted, ShunCode automatically associates progress with the sole in_progress todo. This tool does not modify workspace files.",
  inputSchema: {
    type: "object",
    required: ["message"],
    properties: {
      task_id: {
        type: "string",
        minLength: 1,
        maxLength: 80,
        description: "Optional task handle to scope progress to a specific job; never completes the task."
      },
      message: {
        type: "string",
        minLength: 1,
        maxLength: 2e3,
        description: "Human-readable progress update."
      },
      phase: {
        type: "string",
        maxLength: 160,
        description: "Optional short phase label, such as Reading, Editing, Testing, or Done."
      },
      percent: {
        type: "integer",
        minimum: 0,
        maximum: 100,
        description: "Optional completion estimate from 0 to 100 for the current activity/todo."
      },
      todo_id: {
        type: "string",
        minLength: 1,
        maxLength: 80,
        description: "Optional todo id from set_todos. Omit when there is exactly one in_progress todo; ShunCode will link it automatically."
      }
    },
    additionalProperties: false
  },
  outputSchema: {
    type: "object",
    required: ["message"],
    properties: {
      message: {
        type: "string"
      },
      phase: {
        type: "string"
      },
      percent: {
        type: "integer"
      }
    },
    additionalProperties: true
  },
  annotations: {
    title: "Report Progress",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  }
};
var BRIDGE_TOOL_DEFINITIONS = [...FILE_TOOL_DEFINITIONS, ...IDE_TOOL_DEFINITIONS.filter(tool => !BRIDGE_EXCLUDED_TOOL_NAMES.has(tool.name)), SET_TODOS_TOOL, UPDATE_PLAN_TOOL, REPORT_PROGRESS_TOOL];

// extensions/shuncode/src/bridge-mcp-transport.ts
export { MAX_REQUEST_BYTES, MAX_ACTIVITY, MAX_TODOS, SESSION_IDLE_TIMEOUT_MS, SESSION_PRUNE_INTERVAL_MS, MAX_SESSIONS, SESSION_KEEPALIVE_INTERVAL_MS, SESSION_RETRY_INTERVAL_MS, SESSION_EVENT_STORE_LIMIT, BRIDGE_SERVER_INSTRUCTIONS, DEFAULT_BRIDGE_TOOL_CONCURRENCY, MAX_BRIDGE_TOOL_CONCURRENCY, BRIDGE_TOOL_CONCURRENCY_SETTING, resolveBridgeToolConcurrency, SET_TODOS_TOOL, UPDATE_PLAN_TOOL, REPORT_PROGRESS_TOOL, BRIDGE_TOOL_DEFINITIONS };
