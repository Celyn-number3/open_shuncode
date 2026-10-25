// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { init_define_SHUNCODE_BUILD_INFO } from "../runtime/build-info.mjs";
import { parseBridgeTodos } from "./bridge-coordination-validation.mjs";
// src/bridge-task-store.ts
init_define_SHUNCODE_BUILD_INFO();
var import_node_crypto9 = require("node:crypto");

// src/bridge-coordination-validation.ts

// src/bridge-task-store.ts
var copyTodos = todos => todos.map(t => ({
  ...t
}));
var record2 = value => value !== null && typeof value === "object" && !Array.isArray(value) ? value : {};
var BridgeTaskStore = class {
  constructor(maxTodos, now = Date.now, maxTasks = 16, maxHistory = 8) {
    this.maxTodos = maxTodos;
    this.now = now;
    this.maxTasks = maxTasks;
    this.maxHistory = maxHistory;
  }
  maxTodos;
  now;
  maxTasks;
  maxHistory;
  tasks = /* @__PURE__ */new Map();
  currentByOwner = /* @__PURE__ */new Map();
  selectedId;
  resolve(owner, value) {
    const input = record2(value);
    if (input.task_id !== void 0 && (typeof input.task_id !== "string" || !input.task_id || input.task_id.length > 80)) throw new Error("task_id must be a non-empty task handle returned by Bridge.");
    const id = input.task_id;
    const task = this.tasks.get(id ?? this.currentByOwner.get(owner) ?? "");
    if (id && !task) throw new Error("Unknown or expired task_id. Start a new task; do not replay an obsolete snapshot.");
    if (task && task.owner !== owner) throw new Error("task_id belongs to a different client session; start a new task instead of adopting it.");
    return task;
  }
  update(owner, todos, value) {
    const input = record2(value);
    if (input.new_task !== void 0 && typeof input.new_task !== "boolean") throw new Error("new_task must be boolean.");
    if (input.new_task && (input.task_id !== void 0 || input.expected_revision !== void 0)) throw new Error("new_task cannot resume or revise an existing task.");
    if (input.mode !== void 0 && input.mode !== "replace" && input.mode !== "patch") throw new Error("mode must be replace or patch.");
    if (input.lifecycle !== void 0 && !["running", "completed", "blocked", "cancelled"].includes(String(input.lifecycle))) throw new Error("Invalid task lifecycle.");
    let previous = input.new_task ? void 0 : this.resolve(owner, input);
    const explicit = input.task_id !== void 0;
    if ((explicit || input.mode === "patch") && input.expected_revision === void 0) throw new Error("Provide expected_revision from the last acknowledgement for task_id or patch updates.");
    if (input.expected_revision !== void 0) {
      if (!Number.isSafeInteger(input.expected_revision) || input.expected_revision !== previous?.revision) throw new Error(`Task revision conflict; current revision is ${previous?.revision ?? "missing"}. No changes applied.`);
    }
    if (input.mode === "patch") {
      if (!previous) throw new Error("A patch requires an existing task.");
      const patch = new Map(todos.map(t => [t.id, t]));
      todos = [...previous.todos.map(t => patch.get(t.id) ?? t), ...todos.filter(t => !previous.todos.some(old => old.id === t.id))];
    }
    todos = parseBridgeTodos({
      todos
    }, this.maxTodos);
    const complete = todos.length > 0 && todos.every(t => t.status === "completed");
    if (input.lifecycle === "completed" && !complete) throw new Error("Completion requires a non-empty, fully completed snapshot.");
    if (!todos.length && !explicit && !input.new_task) {
      if (previous) this.forget(previous.id);
      return void 0;
    }
    if (!explicit && !input.new_task && input.mode !== "patch" && input.expected_revision === void 0 && previous && ["completed", "cancelled", "cleared"].includes(previous.state) && todos.length && !complete) previous = void 0;
    if (!previous && !todos.length && !input.new_task) return void 0;
    const state = complete ? "completed" : !todos.length ? input.new_task ? "waiting_plan" : "cleared" : input.lifecycle ?? "running";
    const at = this.now();
    const removed = previous?.todos.filter(t => !todos.some(next => next.id === t.id)) ?? [];
    const revision = (previous?.revision ?? 0) + 1;
    const task = {
      id: previous?.id ?? (0, import_node_crypto9.randomUUID)(),
      owner,
      revision,
      updatedAt: at,
      state,
      todos: copyTodos(todos),
      history: [...(previous?.history ?? []), {
        revision,
        at,
        state,
        completed: todos.filter(t => t.status === "completed").length,
        total: todos.length,
        removed: copyTodos(removed)
      }].slice(-this.maxHistory)
    };
    if (previous && previous.owner !== owner && this.currentByOwner.get(previous.owner) === task.id) this.currentByOwner.delete(previous.owner);
    this.tasks.delete(task.id);
    this.tasks.set(task.id, task);
    this.currentByOwner.set(owner, task.id);
    this.selectedId = task.id;
    while (this.tasks.size > this.maxTasks) {
      const oldest = this.tasks.keys().next().value;
      this.tasks.delete(oldest);
      for (const [key, id] of this.currentByOwner) if (id === oldest) this.currentByOwner.delete(key);
    }
    return this.publicTask(task);
  }
  /** Transient progress may link by capability, but cannot claim completion or steal selection. */
  forProgress(owner, value) {
    const task = this.resolve(owner, value);
    return task ? this.publicTask(task) : void 0;
  }
  touch(id) {
    const task = this.tasks.get(id);
    if (task && ["running", "waiting_plan"].includes(task.state)) task.updatedAt = this.now();
  }
  /** Drop a job and its selection; used by the legacy clear form and by capacity eviction. */
  forget(id) {
    this.tasks.delete(id);
    for (const [owner, taskId] of this.currentByOwner) if (taskId === id) this.currentByOwner.delete(owner);
    if (this.selectedId === id) this.selectedId = void 0;
  }
  disconnect(owner) {
    let changed = false;
    for (const task of this.tasks.values()) {
      if (task.owner === owner && ["running", "waiting_plan"].includes(task.state)) {
        task.state = "interrupted";
        task.revision++;
        task.updatedAt = this.now();
        task.history = [...task.history, {
          revision: task.revision,
          at: task.updatedAt,
          state: task.state,
          completed: task.todos.filter(t => t.status === "completed").length,
          total: task.todos.length,
          removed: []
        }].slice(-this.maxHistory);
        changed = true;
      }
    }
    return changed;
  }
  publicTask(task) {
    const state = ["running", "waiting_plan"].includes(task.state) && this.now() - task.updatedAt >= 9e4 ? "awaiting_sync" : task.state;
    return {
      id: task.id,
      revision: task.revision,
      updatedAt: task.updatedAt,
      state,
      todos: copyTodos(task.todos),
      history: task.history.map(h => ({
        ...h,
        removed: copyTodos(h.removed)
      }))
    };
  }
  snapshot() {
    return {
      taskId: this.selectedId,
      tasks: [...this.tasks.values()].reverse().map(t => this.publicTask(t))
    };
  }
  selectedTodos() {
    return copyTodos(this.tasks.get(this.selectedId ?? "")?.todos ?? []);
  }
};

// src/ide-tool-output.ts
export { import_node_crypto9, copyTodos, record2, BridgeTaskStore };
