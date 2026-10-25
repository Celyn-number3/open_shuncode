// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { init_define_SHUNCODE_BUILD_INFO } from "../../../runtime/build-info.mjs";
import { isFileToolCompatibilityAlias, normalizeFileToolInput, normalizeFileToolName } from "../../../src/file-tool-input-compat.mjs";
import { validateToolInput } from "../../../src/tool-input-validation.mjs";
import { invokeFileTool, isFileToolName } from "../../../src/file-tool-registry.mjs";
import { BRIDGE_EXCLUDED_TOOL_NAMES, getIdeToolDefinition } from "../../../src/ide-tool-definitions.mjs";
import { executeCustomTool } from "../../../src/custom-tool-sandbox.mjs";
import { findCustomTool } from "../../../src/custom-tools.mjs";
import { NATIVE_MANAGED_COMMAND_OWNER_ID } from "../../../src/managed-command-cancellation.mjs";
import { BRIDGE_TOOL_DEFINITIONS, DEFAULT_BRIDGE_TOOL_CONCURRENCY, MAX_ACTIVITY, MAX_BRIDGE_TOOL_CONCURRENCY, MAX_TODOS, REPORT_PROGRESS_TOOL, SET_TODOS_TOOL, UPDATE_PLAN_TOOL } from "./bridge-constants.mjs";
import { parseBridgePlan, parseBridgeProgress, parseBridgeTodos } from "../../../src/bridge-coordination-validation.mjs";
import { BridgeTaskStore } from "../../../src/bridge-task-store.mjs";
import { ideToolStructuredContent } from "../../../src/ide-tool-output.mjs";
import { BridgeActivityTracker } from "../../../src/bridge-activity-tracker.mjs";
import { resolveBridgeToolName } from "../../../src/bridge-tool-name.mjs";
import { BridgeUsageCounter } from "../../../src/bridge-usage-counter.mjs";
import { Semaphore } from "../../../src/concurrency.mjs";
import { AdaptiveConcurrencyController } from "../../../src/adaptive-concurrency.mjs";
import { asRecord3, bridgePresentation } from "./bridge-utils.mjs";
// extensions/shuncode/src/bridge-tool-dispatcher.ts
init_define_SHUNCODE_BUILD_INFO();

// src/bridge-task-store.ts

// extensions/shuncode/src/bridge-tool-dispatcher.ts
var CONCURRENCY_EXEMPT_TOOLS = /* @__PURE__ */new Set(["cancel_command", "get_command_output", "send_command_input"]);
var BridgeToolDispatcher = class {
  constructor(deps, concurrency = DEFAULT_BRIDGE_TOOL_CONCURRENCY) {
    this.deps = deps;
    this.toolGate = new Semaphore(concurrency);
    this.adaptive = new AdaptiveConcurrencyController({
      min: concurrency,
      max: Math.max(concurrency, MAX_BRIDGE_TOOL_CONCURRENCY)
    });
  }
  deps;
  usageCounter = new BridgeUsageCounter();
  activityTracker = new BridgeActivityTracker(MAX_ACTIVITY);
  taskStore = new BridgeTaskStore(MAX_TODOS);
  /** task owner -> command owner seen with it, so a vanished MCP session can still interrupt its job. */
  taskCommandOwners = /* @__PURE__ */new Map();
  revision_ = 0;
  /**
   * Caps tool calls executed at once across BOTH protocol eras.
   *
   * The modern (2026) path is stateless — every request builds its own server
   * and nothing serialises them — so without this a client can hold an
   * unbounded number of managed terminals open at the same time. Callers over
   * the limit queue instead of failing, so a burst stays correct and merely
   * takes longer.
   */
  toolGate;
  /**
   * Tunes `toolGate` from observed load. Bandwidth is not a usable signal here
   * (see adaptive-concurrency.ts); queueing, latency and failures are.
   */
  adaptive;
  /** Tool-side revision counter; the facade adds this to its own for getStatus(). */
  get revision() {
    return this.revision_;
  }
  /** Copy of the current todos for BridgeStatus. */
  snapshotTodos() {
    return this.taskStore.selectedTodos();
  }
  snapshotTaskState() {
    return this.taskStore.snapshot();
  }
  /** Activity + stats snapshot for BridgeStatus. */
  snapshotActivity() {
    return this.activityTracker.snapshot();
  }
  /** Clears finished tool calls (keeping running ones) and bumps the revision. */
  clearActivity() {
    const removed = this.activityTracker.clear();
    if (removed > 0) {
      this.revision_ += 1;
    }
    return removed;
  }
  // ---- Usage counter (facade delegates its two public methods here) --------
  takeToolCallsSinceLastReport() {
    return this.usageCounter.take();
  }
  returnToolCallsSinceLastReport(count) {
    this.usageCounter.returnCount(count);
  }
  beginRemoteConversation(_commandOwnerId) {}
  endRemoteConversation(commandOwnerId) {
    let changed = this.taskStore.disconnect(commandOwnerId);
    for (const [taskOwnerId, seenCommandOwnerId] of this.taskCommandOwners) {
      if (seenCommandOwnerId === commandOwnerId) changed = this.taskStore.disconnect(taskOwnerId) || changed;
    }
    if (changed) this.revision_ += 1;
  }
  rememberTaskCommandOwner(taskOwnerId, commandOwnerId) {
    this.taskCommandOwners.delete(taskOwnerId);
    this.taskCommandOwners.set(taskOwnerId, commandOwnerId);
    while (this.taskCommandOwners.size > 32) this.taskCommandOwners.delete(this.taskCommandOwners.keys().next().value);
  }
  // ---- Dispatch ------------------------------------------------------------
  /**
   * Record the call for usage accounting, then route it. Mirrors the legacy
   * "recordToolCall() then handleToolCall()" ordering exactly.
   */
  async dispatch(rawToolName, args, extra) {
    const commandOwnerId = extra.commandOwnerId ?? NATIVE_MANAGED_COMMAND_OWNER_ID;
    this.usageCounter.recordToolCall();
    const run = () => this.handleToolCall(rawToolName, args, {
      signal: extra.signal,
      commandOwnerId,
      taskOwnerId: extra.taskOwnerId
    });
    if (CONCURRENCY_EXEMPT_TOOLS.has(rawToolName)) return run();
    const queued = this.toolGate.waiting;
    const startedAt = Date.now();
    let failed = false;
    try {
      const result = await this.toolGate.run(run, extra.signal);
      failed = result.isError === true;
      return result;
    } catch (error2) {
      failed = true;
      throw error2;
    } finally {
      this.applyAdaptiveDecision({
        durationMs: Date.now() - startedAt,
        failed,
        queued
      });
    }
  }
  /** Feed one completion to the controller and resize the gate if it decides to. */
  applyAdaptiveDecision(sample) {
    const decision = this.adaptive.record(sample);
    if (!decision.changed) return;
    this.toolGate.setLimit(decision.limit);
    this.deps.log(`[bridge] tool concurrency ${decision.reason} -> ${decision.limit} (active=${this.toolGate.active}, waiting=${this.toolGate.waiting})`);
  }
  /** In-flight and queued tool calls plus the current adaptive ceiling. */
  concurrencySnapshot() {
    return {
      active: this.toolGate.active,
      waiting: this.toolGate.waiting,
      limit: this.toolGate.limit
    };
  }
  /** Never throws: a malformed manifest must not break built-in tool dispatch. */
  findCustomToolSafe(toolName) {
    try {
      return findCustomTool(this.deps.workspaceRoots(), toolName, message => this.deps.log(message), {
        skillsEnabled: this.deps.skillsEnabled?.() ?? true
      });
    } catch {
      return void 0;
    }
  }
  async handleToolCall(rawToolName, args, extra) {
    const resolvedToolName = resolveBridgeToolName(rawToolName, name => name === SET_TODOS_TOOL.name || name === UPDATE_PLAN_TOOL.name || name === REPORT_PROGRESS_TOOL.name || isFileToolName(name) || isFileToolCompatibilityAlias(name) || !BRIDGE_EXCLUDED_TOOL_NAMES.has(name) && getIdeToolDefinition(name) !== void 0 || this.findCustomToolSafe(name) !== void 0);
    const toolName = normalizeFileToolName(resolvedToolName);
    const publicDefinition = BRIDGE_TOOL_DEFINITIONS.find(tool => tool.name === toolName);
    if (toolName === SET_TODOS_TOOL.name || toolName === UPDATE_PLAN_TOOL.name || toolName === REPORT_PROGRESS_TOOL.name) {
      if (publicDefinition) {
        try {
          validateToolInput(publicDefinition.name, publicDefinition.inputSchema, args);
        } catch (error2) {
          return {
            isError: true,
            content: [{
              type: "text",
              text: error2 instanceof Error ? error2.message : String(error2)
            }]
          };
        }
      }
      try {
        const taskOwnerId = extra.taskOwnerId ?? extra.commandOwnerId;
        if (taskOwnerId !== extra.commandOwnerId) this.rememberTaskCommandOwner(taskOwnerId, extra.commandOwnerId);
        if (toolName === SET_TODOS_TOOL.name) {
          return this.handleSetTodos(args, taskOwnerId);
        }
        if (toolName === UPDATE_PLAN_TOOL.name) {
          return this.handleUpdatePlan(args, taskOwnerId);
        }
        return this.handleReportProgress(args, taskOwnerId);
      } catch (error2) {
        return {
          isError: true,
          content: [{
            type: "text",
            text: error2 instanceof Error ? error2.message : String(error2)
          }]
        };
      }
    }
    const activityId = this.pushActivity({
      tool: toolName,
      status: "running",
      presentation: bridgePresentation(toolName, args)
    });
    const startedAt = Date.now();
    try {
      let presentationArgs = args;
      if (isFileToolName(toolName)) {
        try {
          presentationArgs = normalizeFileToolInput(toolName, args);
        } catch {
          presentationArgs = args;
        }
      } else if (publicDefinition) {
        validateToolInput(publicDefinition.name, publicDefinition.inputSchema, args);
      }
      if (isFileToolName(toolName)) {
        const result = await invokeFileTool(toolName, args, {
          // Lazy on purpose: resolving it here would throw before the registry could envelope it.
          workspaceRoots: () => this.deps.workspaceRoots(),
          signal: extra.signal
        });
        this.finishActivity(activityId, result.isError ? "error" : "completed", Date.now() - startedAt, result.isError ? result.text : void 0, bridgePresentation(toolName, presentationArgs, result.text, result.structuredContent, result.isError));
        return {
          isError: result.isError || void 0,
          content: result.content ?? [{
            type: "text",
            text: result.text
          }],
          structuredContent: result.structuredContent
        };
      }
      const customTool = this.findCustomToolSafe(toolName);
      if (customTool) {
        validateToolInput(customTool.name, customTool.inputSchema, args);
        const result = await executeCustomTool(this.deps.workspaceRoots(), customTool, args, {
          signal: extra.signal,
          log: message => this.deps.log(message)
        });
        this.finishActivity(activityId, result.isError ? "error" : "completed", Date.now() - startedAt, result.isError ? result.text : void 0, bridgePresentation(toolName, args, result.text, result.structuredContent, result.isError));
        return {
          isError: result.isError || void 0,
          content: [{
            type: "text",
            text: result.text
          }],
          structuredContent: result.structuredContent
        };
      }
      if (BRIDGE_EXCLUDED_TOOL_NAMES.has(toolName)) {
        throw new Error(`The ${toolName} tool is not available in Bridge mode.`);
      }
      const definition = getIdeToolDefinition(toolName);
      if (definition) {
        const result = await this.deps.invokeIdeTool(toolName, asRecord3(args), extra.signal, extra.commandOwnerId);
        const structuredContent = result.structuredContent ?? (result.isError ? {
          error: result.text
        } : ideToolStructuredContent(toolName, result.text));
        this.finishActivity(activityId, result.isError ? "error" : "completed", Date.now() - startedAt, result.isError ? result.text : void 0, bridgePresentation(toolName, args, result.text, structuredContent, result.isError));
        return {
          isError: result.isError || void 0,
          content: [{
            type: "text",
            text: result.text
          }],
          structuredContent
        };
      }
      throw new Error(toolName === rawToolName ? `Unknown Bridge tool: ${toolName}` : `Unknown Bridge tool: ${rawToolName} (after stripping MCP server prefix: ${toolName})`);
    } catch (error2) {
      const message = error2 instanceof Error ? error2.message : String(error2);
      this.finishActivity(activityId, "error", Date.now() - startedAt, message, bridgePresentation(toolName, args, message, void 0, true));
      return {
        isError: true,
        content: [{
          type: "text",
          text: message
        }]
      };
    }
  }
  handleReportProgress(value, commandOwnerId) {
    const task = this.taskStore.forProgress(commandOwnerId, value);
    const linkableTodos = task?.todos ?? [];
    const {
      message,
      phase,
      percent,
      linkedTodo
    } = parseBridgeProgress(value, linkableTodos);
    if (task) this.taskStore.touch(task.id);
    this.pushActivity({
      taskId: task?.id,
      tool: REPORT_PROGRESS_TOOL.name,
      status: "progress",
      message,
      phase,
      percent,
      todoId: linkedTodo?.id,
      todoTitle: linkedTodo?.title
    });
    this.deps.log(`[bridge-progress]${linkedTodo ? ` [${linkedTodo.id}]` : ""}${phase ? ` ${phase}:` : ""} ${message}${percent !== void 0 ? ` (${percent}%)` : ""}`);
    return {
      structuredContent: {
        message,
        ...(phase !== void 0 ? {
          phase
        } : {}),
        ...(percent !== void 0 ? {
          percent
        } : {}),
        ...(linkedTodo ? {
          todo_id: linkedTodo.id
        } : {})
      },
      content: [{
        type: "text",
        text: linkedTodo ? `Progress reported to ShunCode for todo ${linkedTodo.id}.` : "Progress reported to ShunCode."
      }]
    };
  }
  handleSetTodos(value, commandOwnerId) {
    return this.storeTodos(parseBridgeTodos(value, MAX_TODOS), commandOwnerId, SET_TODOS_TOOL.name, value);
  }
  handleUpdatePlan(value, commandOwnerId) {
    return this.storeTodos(parseBridgePlan(value, MAX_TODOS), commandOwnerId, UPDATE_PLAN_TOOL.name, value);
  }
  storeTodos(nextTodos, commandOwnerId, sourceTool, value) {
    if (sourceTool === UPDATE_PLAN_TOOL.name && asRecord3(value).mode === "patch") throw new Error("update_plan uses positional IDs and only supports replace; use set_todos with stable IDs for patches.");
    const task = this.taskStore.update(commandOwnerId, nextTodos, value);
    this.revision_ += 1;
    const taskContract = {
      task_protocol: "task-lifecycle-v1",
      ...(task ? {
        task_id: task.id,
        task_revision: task.revision,
        lifecycle: task.state,
        history: task.history
      } : {})
    };
    const todos = task?.todos ?? [];
    const completed = todos.filter(todo => todo.status === "completed").length;
    const current = todos.find(todo => todo.status === "in_progress");
    this.deps.log(`[bridge-todos] ${completed}/${todos.length} completed via ${sourceTool} \xB7 state: ${task?.state ?? "cleared"}`);
    return {
      structuredContent: sourceTool === UPDATE_PLAN_TOOL.name ? {
        plan: todos.map(({
          title,
          status
        }) => ({
          step: title,
          status
        })),
        ...taskContract
      } : {
        todos: todos.map(todo => ({
          ...todo
        })),
        ...taskContract
      },
      content: [{
        type: "text",
        text: task ? `Todo state updated in ShunCode via ${sourceTool}: ${completed}/${todos.length} completed${current ? `; current todo ${current.id}: ${current.title}` : ""}. task_id=${task.id}; task_revision=${task.revision}; lifecycle=${task.state}. Reuse task_id and expected_revision for the next update; send new_task=true for a different job. Final replies require an acknowledged terminal snapshot; idle never means complete.` : "Todo state cleared in ShunCode."
      }]
    };
  }
  pushActivity(input) {
    const id = this.activityTracker.push(input);
    this.revision_ += 1;
    return id;
  }
  finishActivity(id, status, durationMs, message, presentation) {
    if (this.activityTracker.finish(id, status, durationMs, message, presentation)) {
      this.revision_ += 1;
    }
  }
};

// extensions/shuncode/src/bridge-server.ts
export { CONCURRENCY_EXEMPT_TOOLS, BridgeToolDispatcher };
