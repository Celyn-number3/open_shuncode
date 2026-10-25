// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { __toESM } from "../../../runtime/helpers.mjs";
import { init_define_SHUNCODE_BUILD_INFO } from "../../../runtime/build-info.mjs";
import { IDE_TOOL_DEFINITIONS, getIdeToolDefinition } from "../../../src/ide-tool-definitions.mjs";
import { ManagedCommandCanceller, NATIVE_MANAGED_COMMAND_OWNER_ID, forceCancellationRequiresConfirmation, managedCommandNotAccessibleError } from "../../../src/managed-command-cancellation.mjs";
import { createManagedCommandId, normalizeManagedCommandId } from "../../../src/managed-command-id.mjs";
import { managedCommandStateIdsToPrune } from "../../../src/managed-command-retention.mjs";
import { isManagedTerminalIdleExpired, managedTerminalIdleDelay } from "../../../src/managed-terminal-lifecycle.mjs";
import { invokeLspTool } from "./lsp-tool.mjs";
// extensions/shuncode/src/ide-tool-broker.ts
init_define_SHUNCODE_BUILD_INFO();
var child_process = __toESM(require("node:child_process"));
var import_node_fs11 = __toESM(require("node:fs"));
var import_node_os4 = __toESM(require("node:os"));
var import_node_path17 = __toESM(require("node:path"));
var import_node_string_decoder = require("node:string_decoder");
var vscode9 = __toESM(require("vscode"));

// src/managed-command-id.ts

// extensions/shuncode/src/ide-tool-broker.ts
var COMMON_EXCLUDES = /* @__PURE__ */new Set([".git", "node_modules", "dist", "build", "coverage", ".next", "target", "vendor"]);
var MAX_CAPTURED_OUTPUT_BYTES = 2 * 1024 * 1024;
var DEFAULT_OUTPUT_BYTES = 32 * 1024;
var MAX_OUTPUT_BYTES2 = 128 * 1024;
var MAX_IDLE_TERMINALS = 4;
var PTY_EXIT_DATA_FLUSH_MS = 100;
var COMMAND_ECHO_TIMEOUT_MS = 3e3;
var MAX_ECHO_HUNT_BYTES = 1024 * 1024;
var MANAGED_TERMINAL_NAME = /^ShunCode · \d+$/;
var CHAT_CAPTURE_COLUMNS = 1e3;
var CHAT_CAPTURE_INPUT_KEY = "__shuncodeChatCapture";
var nodePtyModule;
function getNodePty() {
  if (nodePtyModule) return nodePtyModule;
  const candidates = [import_node_path17.default.join(vscode9.env.appRoot, "node_modules.asar", "node-pty"), import_node_path17.default.join(vscode9.env.appRoot, "node_modules", "node-pty")];
  let lastError;
  for (const modulePath of candidates) {
    try {
      if (!import_node_fs11.default.existsSync(modulePath)) continue;
      const loaded = require(modulePath);
      if (typeof loaded.spawn !== "function") throw new Error("module does not export spawn()");
      nodePtyModule = loaded;
      return nodePtyModule;
    } catch (error2) {
      lastError = error2;
    }
  }
  const detail = lastError instanceof Error ? ` ${lastError.message}` : "";
  throw new Error(`ShunCode could not load the bundled node-pty runtime from ${vscode9.env.appRoot}.${detail}`);
}
function managedShellSpec(protocolToken) {
  if (process.platform === "win32") {
    const bundledBash = bundledGitBashExecutable();
    if (!bundledBash) {
      throw new Error("ShunCode managed terminal requires the product-bundled Git Bash runtime. Reinstall or rebuild ShunCode; PowerShell fallback is intentionally disabled.");
    }
    const gitRoot = import_node_path17.default.resolve(bundledBash, "..", "..");
    return {
      kind: "bash",
      executable: bundledBash,
      args: ["--noprofile", "--norc", "-i"],
      env: {
        PROMPT_COMMAND: bashPromptCommand(protocolToken),
        PS1: "$ ",
        SHELL: bundledBash,
        PATH: withBundledGitPath(gitRoot, process.env.PATH ?? process.env.Path ?? "")
      }
    };
  }
  const bash = "/bin/bash";
  if (import_node_fs11.default.existsSync(bash)) {
    const promptCommand = bashPromptCommand(protocolToken);
    return {
      kind: "bash",
      executable: bash,
      args: ["--noprofile", "--norc", "-i"],
      env: {
        PROMPT_COMMAND: promptCommand,
        PS1: "$ "
      }
    };
  }
  const sh = "/bin/sh";
  if (import_node_fs11.default.existsSync(sh)) {
    const promptExpression = ["__shuncode_ec=$?", "__shuncode_seq=$((${__shuncode_seq:-0}+1))", `__shuncode_cwd=$(printf '%s' "$PWD" | base64 | tr -d '\\r\\n')`, `printf '\\033]633;ShunCode;${protocolToken};%s;%s;%s\\007' "$__shuncode_seq" "$__shuncode_ec" "$__shuncode_cwd"`].join("; ");
    return {
      kind: "sh",
      executable: sh,
      args: ["-i"],
      env: {
        PS1: `$(${promptExpression})$ `
      }
    };
  }
  throw new Error("ShunCode managed terminal cannot find /bin/bash or /bin/sh.");
}
function managedProcessEnvironment() {
  const env6 = Object.fromEntries(Object.entries(process.env).filter(entry => typeof entry[1] === "string"));
  delete env6.VSCODE_INJECTION;
  delete env6.VSCODE_NONCE;
  delete env6.VSCODE_SHELL_INTEGRATION;
  delete env6.PROMPT_COMMAND;
  delete env6.PS1;
  delete env6.ENV;
  delete env6.BASH_ENV;
  env6.TERM = "xterm-256color";
  env6.COLORTERM = "truecolor";
  env6.SHUNCODE_AGENT_TERMINAL = "1";
  if (process.platform === "win32") {
    const vendorModules = bundledModulesDir();
    if (vendorModules) env6.PSModulePath = `${vendorModules};${env6.PSModulePath ?? ""}`;
  }
  return env6;
}
var cachedBundledModulesDir;
function bundledModulesDir() {
  if (cachedBundledModulesDir === null) return void 0;
  if (cachedBundledModulesDir) return cachedBundledModulesDir;
  const candidates = [import_node_path17.default.join(__dirname, "..", "vendor"), import_node_path17.default.join(vscode9.env.appRoot, "extensions", "shuncode", "vendor")];
  for (const dir of candidates) {
    if (import_node_fs11.default.existsSync(import_node_path17.default.join(dir, "PSReadLine", "PSReadLine.psd1"))) {
      cachedBundledModulesDir = dir;
      return dir;
    }
  }
  cachedBundledModulesDir = null;
  return void 0;
}
var cachedBundledGitBash;
function bundledGitBashExecutable() {
  if (cachedBundledGitBash === null) return void 0;
  if (cachedBundledGitBash) return cachedBundledGitBash;
  const candidates = [import_node_path17.default.join(__dirname, "..", "runtime", "git", "bin", "bash.exe"), import_node_path17.default.join(vscode9.env.appRoot, "extensions", "shuncode", "runtime", "git", "bin", "bash.exe")];
  for (const candidate of candidates) {
    if (import_node_fs11.default.existsSync(candidate)) {
      cachedBundledGitBash = candidate;
      return candidate;
    }
  }
  cachedBundledGitBash = null;
  return void 0;
}
function withBundledGitPath(gitRoot, existingPath) {
  const additions = [import_node_path17.default.join(gitRoot, "usr", "bin"), import_node_path17.default.join(gitRoot, "mingw64", "bin"), import_node_path17.default.join(gitRoot, "bin")];
  return [...additions, existingPath].filter(Boolean).join(";");
}
function bashPromptCommand(protocolToken) {
  return ['__shuncode_ec=$? __shuncode_pipe=("${PIPESTATUS[@]}")', "__shuncode_seq=$((${__shuncode_seq:-0}+1))", `__shuncode_cwd=$(printf '%s' "$PWD" | base64 | tr -d '\\r\\n')`, `__shuncode_pipeline=$(IFS=,; printf '%s' "\${__shuncode_pipe[*]}")`, `printf '\\033]633;ShunCode;${protocolToken};%s;%s;%s;%s\\007' "$__shuncode_seq" "$__shuncode_ec" "$__shuncode_cwd" "$__shuncode_pipeline"`].join("; ");
}
var ManagedCommandPseudoterminal = class {
  constructor(initialCwd) {
    this.initialCwd = initialCwd;
    this.currentCwdValue = initialCwd;
    this.openPromise = new Promise(resolve => {
      this.resolveOpen = resolve;
    });
  }
  initialCwd;
  writeEmitter = new vscode9.EventEmitter();
  onDidWrite = this.writeEmitter.event;
  closeEmitter = new vscode9.EventEmitter();
  onDidClose = this.closeEmitter.event;
  protocolToken = `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
  protocolPrefix = `\x1B]633;ShunCode;${this.protocolToken};`;
  shellKind = "powershell";
  /** Shell the persistent PTY actually launched; surfaced in the run_command result header. */
  get shellName() {
    return this.shellKind;
  }
  openPromise;
  resolveOpen;
  startPromise;
  ready = false;
  readyResolver;
  readyRejecter;
  protocolBuffer = "";
  // Echo gate state. The shell renders the typed command (and agent-sent input) back into the
  // PTY output stream (PSReadLine/Readline/tty echo), and ConPTY can deliver that rendering
  // late, interleaved with stale prompts, full-screen redraws (chat capture resizes the PTY
  // before each command) and cooked-echo/PSReadLine redraw races. The gate consumes the echo
  // so none of it leaks into the terminal display or the captured tool result.
  echoExpectation = "";
  echoMatchIndex = 0;
  echoGateActive = false;
  echoHuntBytesRemaining = 0;
  echoHuntDiscardAll = false;
  echoHuntingPromptLine = false;
  echoTimeoutTimer;
  activePty;
  activePtyDataSubscription;
  activePtyExitSubscription;
  activeCommand;
  nextCommandSequence = 1;
  lastPromptSequence = 0;
  continuationPromptSeen = false;
  currentCwdValue;
  cols = 80;
  rows = 24;
  disposed = false;
  get currentCwd() {
    return this.currentCwdValue;
  }
  open(initialDimensions) {
    if (initialDimensions) {
      this.cols = Math.max(1, initialDimensions.columns);
      this.rows = Math.max(1, initialDimensions.rows);
    }
    this.resolveOpen();
  }
  close() {
    this.dispose();
  }
  setDimensions(dimensions) {
    this.cols = Math.max(1, dimensions.columns);
    this.rows = Math.max(1, dimensions.rows);
    const pty = this.activePty;
    if (!pty) return;
    if (this.activeCommand) return;
    try {
      pty.resize(this.cols, this.rows);
    } catch {}
  }
  handleInput(data) {
    if (!this.activePty) return;
    this.activePty.write(data);
  }
  writeDisplay(text) {
    if (!this.disposed) this.writeEmitter.fire(text);
  }
  sendInput(text, appendNewline) {
    if (!this.activePty) {
      throw new Error("The ShunCode managed PTY is not accepting input.");
    }
    this.echoExpectation = text.replace(/[\r\n]+/g, "");
    this.echoMatchIndex = 0;
    this.echoHuntBytesRemaining = MAX_ECHO_HUNT_BYTES;
    this.echoHuntDiscardAll = true;
    this.echoHuntingPromptLine = false;
    this.echoGateActive = true;
    this.armEchoTimeout();
    this.activePty.write(appendNewline ? `${text}\r` : text);
  }
  /** Interrupt only the foreground command, preserving the Bash PTY for reuse. */
  interruptActiveCommand() {
    if (this.disposed || !this.activePty || !this.activeCommand || this.activeCommand.finishing) return false;
    this.resetEchoGate();
    if (this.echoTimeoutTimer) {
      clearTimeout(this.echoTimeoutTimer);
      this.echoTimeoutTimer = void 0;
    }
    try {
      this.activePty.write("");
      return true;
    } catch {
      return false;
    }
  }
  async ensureStarted() {
    if (!this.startPromise) this.startPromise = this.startPersistentShell();
    return this.startPromise;
  }
  async run(command, handlers, captureColumns) {
    await this.ensureStarted();
    if (this.disposed) throw new Error("The ShunCode managed terminal is closed.");
    if (!this.activePty) throw new Error("The ShunCode managed PTY shell is not running.");
    if (this.activeCommand) throw new Error("The ShunCode managed terminal is already running a command.");
    const sequence = this.nextCommandSequence++;
    this.activeCommand = {
      sequence,
      started: false,
      seqAtStart: this.lastPromptSequence,
      captureColumns,
      ...handlers
    };
    if (captureColumns) {
      try {
        this.activePty.resize(captureColumns, this.rows);
      } catch {}
    }
    this.writeDisplay(`${command.replace(/\r?\n/g, "\r\n")}\r
`);
    const normalizedCommand = command.replace(/[\r\n]+/g, "");
    this.echoExpectation = normalizedCommand;
    this.echoMatchIndex = 0;
    this.echoHuntBytesRemaining = MAX_ECHO_HUNT_BYTES;
    this.echoHuntDiscardAll = true;
    this.echoHuntingPromptLine = false;
    this.echoGateActive = true;
    this.continuationPromptSeen = false;
    this.armEchoTimeout();
    try {
      this.activePty.write(`${command}\r`);
    } catch (error2) {
      this.activeCommand = void 0;
      this.resetEchoGate();
      this.restoreDisplayDimensions();
      throw error2;
    }
  }
  restoreDisplayDimensions() {
    if (!this.activePty) return;
    try {
      this.activePty.resize(this.cols, this.rows);
    } catch {}
  }
  /**
   * Cancel whatever the shell currently has buffered (PSReadLine continuation input, an
   * unclosed quote or here-string) with Esc + Ctrl+C, like a user clearing the line. The
   * interrupted command is marked recovered so it can never be reported as a success.
   */
  abortCurrentInput() {
    const active = this.activeCommand;
    if (active) active.recoveryInitiated = true;
    this.resetEchoGate();
    if (this.echoTimeoutTimer) {
      clearTimeout(this.echoTimeoutTimer);
      this.echoTimeoutTimer = void 0;
    }
    if (!this.activePty) return;
    try {
      this.activePty.write("\x1B");
    } catch {}
    setTimeout(() => {
      try {
        this.activePty?.write("");
      } catch {}
    }, 150);
  }
  get hasContinuationHint() {
    return this.continuationPromptSeen;
  }
  get lastSeenPromptSequence() {
    return this.lastPromptSequence;
  }
  async startPersistentShell() {
    await this.openPromise;
    if (this.disposed) throw new Error("The ShunCode managed terminal is closed.");
    const shell = managedShellSpec(this.protocolToken);
    this.shellKind = shell.kind;
    const env6 = {
      ...managedProcessEnvironment(),
      ...shell.env
    };
    const ptyProcess = getNodePty().spawn(shell.executable, shell.args, {
      name: process.platform === "win32" ? "cmd" : "xterm-256color",
      cwd: this.initialCwd,
      env: env6,
      cols: this.cols,
      rows: this.rows
    });
    this.activePty = ptyProcess;
    this.activePtyDataSubscription = ptyProcess.onData(data => {
      this.handlePtyData(data);
    });
    this.activePtyExitSubscription = ptyProcess.onExit(event => {
      setTimeout(() => {
        if (this.activePty === ptyProcess) this.activePty = void 0;
        const activeCommand = this.activeCommand;
        this.activeCommand = void 0;
        if (activeCommand?.finishTimer) {
          clearTimeout(activeCommand.finishTimer);
          activeCommand.finishTimer = void 0;
        }
        if (!this.ready) {
          this.readyRejecter?.(new Error(`ShunCode managed PTY shell exited before its first prompt (exit_code=${event.exitCode}).`));
        }
        activeCommand?.onExit(event.exitCode, void 0, {
          recovered: activeCommand.recoveryInitiated === true,
          signal: event.signal
        });
        this.disposeActivePtySubscriptions();
        if (!this.disposed) this.closeEmitter.fire(event.exitCode >= 0 ? event.exitCode : 1);
      }, PTY_EXIT_DATA_FLUSH_MS);
    });
    if (!this.ready) {
      await new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          if (this.ready) return;
          reject(new Error("ShunCode managed PTY shell did not reach its first prompt within 8 seconds."));
        }, 8e3);
        const finish = fn => () => {
          clearTimeout(timer);
          fn();
        };
        this.readyResolver = finish(resolve);
        this.readyRejecter = error2 => finish(() => reject(error2))();
      });
    }
  }
  handlePtyData(data) {
    this.protocolBuffer += data;
    while (this.protocolBuffer) {
      const markerStart = this.protocolBuffer.indexOf(this.protocolPrefix);
      if (markerStart < 0) {
        const keep = this.protocolPrefixOverlap(this.protocolBuffer);
        const visible = this.protocolBuffer.slice(0, this.protocolBuffer.length - keep);
        if (visible) this.emitPtyData(visible);
        this.protocolBuffer = keep ? this.protocolBuffer.slice(-keep) : "";
        return;
      }
      if (markerStart > 0) this.emitPtyData(this.protocolBuffer.slice(0, markerStart));
      const markerEnd = this.protocolBuffer.indexOf("\x07", markerStart + this.protocolPrefix.length);
      if (markerEnd < 0) {
        this.protocolBuffer = this.protocolBuffer.slice(markerStart);
        return;
      }
      const payload = this.protocolBuffer.slice(markerStart + this.protocolPrefix.length, markerEnd);
      this.protocolBuffer = this.protocolBuffer.slice(markerEnd + 1);
      this.handleProtocolMarker(payload);
    }
  }
  protocolPrefixOverlap(value) {
    const max = Math.min(value.length, this.protocolPrefix.length - 1);
    for (let length = max; length > 0; length--) {
      if (this.protocolPrefix.startsWith(value.slice(-length))) return length;
    }
    return 0;
  }
  emitPtyData(data) {
    if (this.activeCommand && this.echoGateActive) {
      const rest = this.consumeCommandEcho(data);
      if (rest === null) return;
      this.echoGateActive = false;
      if (this.echoTimeoutTimer) {
        clearTimeout(this.echoTimeoutTimer);
        this.echoTimeoutTimer = void 0;
      }
      data = rest;
    }
    this.writeDisplay(data);
    if (!this.activeCommand) return;
    if (this.activeCommand.finishing) {
      this.activeCommand.onOutput(this.stripPromptText(data));
      return;
    }
    this.activeCommand.onOutput(data);
  }
  /**
   * Consume the shell's rendering of the typed command or agent-sent input. PSReadLine,
   * Readline and tty drivers echo the text back into the PTY output, and ConPTY can deliver
   * that rendering late, preceded by stale prompt text, full-screen redraws (chat capture
   * resizes the PTY to CHAT_CAPTURE_COLUMNS before each command) and cooked-echo fragments
   * (the classic "p<BS>python" race between the console echo and PSReadLine's redraw).
   *
   * The gate therefore does not require the echo to start at the first byte: it hunts for the
   * echo text while discarding known noise (prompt lines, blank lines, ANSI sequences,
   * backspaces; in chat mode everything up to the echo anchor because a resize redraw can
   * re-render arbitrary previous output), matches the text tolerantly (skipping the same
   * control noise, undoing backspace erasures, restarting after carriage-return redraws), and
   * after the full echo swallows only the line-accept newline plus redraw noise — any ordinary
   * byte opens the gate so real program output is never consumed. Hunting is bounded by
   * MAX_ECHO_HUNT_BYTES and by COMMAND_ECHO_TIMEOUT_MS.
   */
  consumeCommandEcho(data) {
    const expectation = this.echoExpectation;
    let index = 0;
    while (index < data.length) {
      const ch = data[index];
      if (ch === "\r" || ch === "\n") {
        index++;
        continue;
      }
      const ansi = ansiEscapeLength(data, index);
      if (ansi > 0) {
        index += ansi;
        continue;
      }
      if (ch === "\b") {
        index++;
        if (this.echoMatchIndex > 0) this.echoMatchIndex--;
        continue;
      }
      if (this.echoMatchIndex === 0) {
        if (this.echoHuntDiscardAll) {
          if (this.echoHuntBytesRemaining <= 0) {
            this.resetEchoGate();
            return data.slice(index);
          }
          this.echoHuntBytesRemaining--;
          if (data.startsWith(">>", index)) this.continuationPromptSeen = true;
          if (ch === expectation[0]) {
            this.echoMatchIndex++;
            index++;
            continue;
          }
          index++;
          continue;
        }
        if (this.echoHuntBytesRemaining <= 0) {
          this.resetEchoGate();
          return data.slice(index);
        }
        this.echoHuntBytesRemaining--;
        if (ch === " " || ch === "	" || ch === "\x07") {
          index++;
          continue;
        }
        if (this.echoHuntingPromptLine) {
          let cursor = index;
          while (cursor < data.length && data[cursor] !== "\r" && data[cursor] !== "\n") cursor++;
          if (cursor < data.length) this.echoHuntingPromptLine = false;
          index = cursor;
          continue;
        }
        if (data.startsWith(">>", index)) this.continuationPromptSeen = true;
        const promptLength = promptTextLength(data, index);
        if (promptLength === -1) {
          this.echoHuntingPromptLine = true;
          return null;
        }
        if (promptLength > 0) {
          index += promptLength;
          continue;
        }
        if (ch !== expectation[0]) {
          this.resetEchoGate();
          return data.slice(index);
        }
        this.echoMatchIndex++;
        index++;
        continue;
      }
      if (ch === "\r") {
        this.echoMatchIndex = 0;
        index++;
        continue;
      }
      if (this.echoMatchIndex >= expectation.length) break;
      if (ch !== expectation[this.echoMatchIndex]) {
        this.echoMatchIndex = 0;
        continue;
      }
      this.echoMatchIndex++;
      index++;
    }
    if (this.echoMatchIndex >= expectation.length) {
      while (index < data.length) {
        const ch = data[index];
        if (ch === "\r" || ch === "\n") {
          index++;
          continue;
        }
        const ansi = ansiEscapeLength(data, index);
        if (ansi > 0) {
          index += ansi;
          continue;
        }
        if (ch === "\b") {
          index++;
          continue;
        }
        break;
      }
      this.resetEchoGate();
      return data.slice(index);
    }
    return null;
  }
  resetEchoGate() {
    this.echoExpectation = "";
    this.echoMatchIndex = 0;
    this.echoGateActive = false;
    this.echoHuntBytesRemaining = 0;
    this.echoHuntDiscardAll = false;
    this.echoHuntingPromptLine = false;
  }
  armEchoTimeout() {
    if (this.echoTimeoutTimer) clearTimeout(this.echoTimeoutTimer);
    this.echoTimeoutTimer = setTimeout(() => {
      this.echoTimeoutTimer = void 0;
      this.echoGateActive = false;
      const active = this.activeCommand;
      if (active && !active.started) active.started = true;
      if (active && !active.finishing && this.continuationPromptSeen) this.abortCurrentInput();
    }, COMMAND_ECHO_TIMEOUT_MS);
  }
  handleProtocolMarker(payload) {
    if (payload.startsWith("S;")) {
      const sequence2 = Number.parseInt(payload.slice(2), 10);
      if (this.activeCommand?.sequence === sequence2) this.activeCommand.started = true;
      return;
    }
    const [sequenceText, exitCodeText, cwdBase64, pipelineExitCodesText] = payload.split(";", 4);
    const sequence = Number.parseInt(sequenceText, 10);
    const exitCode = Number.parseInt(exitCodeText, 10);
    if (!Number.isFinite(sequence) || !Number.isFinite(exitCode)) return;
    if (sequence > this.lastPromptSequence) this.lastPromptSequence = sequence;
    if (cwdBase64) {
      try {
        const cwd = Buffer.from(cwdBase64, "base64").toString("utf8");
        if (cwd) this.currentCwdValue = cwd;
      } catch {}
    }
    if (!this.ready) {
      this.ready = true;
      this.readyResolver?.();
      this.readyResolver = void 0;
      this.readyRejecter = void 0;
      return;
    }
    const activeCommand = this.activeCommand;
    if (!activeCommand) return;
    if (activeCommand.finishing) return;
    if (sequence <= activeCommand.seqAtStart) return;
    activeCommand.finishing = true;
    activeCommand.finishExitCode = exitCode;
    activeCommand.finishPipelineExitCodes = pipelineExitCodesText === void 0 ? void 0 : pipelineExitCodesText === "" ? [] : pipelineExitCodesText.split(",").map(value => Number.parseInt(value, 10)).filter(value => Number.isFinite(value));
    activeCommand.finishTimer = setTimeout(() => {
      this.finishCommand(activeCommand);
    }, PTY_EXIT_DATA_FLUSH_MS);
  }
  finishCommand(command) {
    this.resetEchoGate();
    if (command.finishTimer) {
      clearTimeout(command.finishTimer);
      command.finishTimer = void 0;
    }
    if (this.echoTimeoutTimer) {
      clearTimeout(this.echoTimeoutTimer);
      this.echoTimeoutTimer = void 0;
    }
    if (this.activeCommand !== command) return;
    this.activeCommand = void 0;
    this.restoreDisplayDimensions();
    this.continuationPromptSeen = false;
    command.onExit(command.finishExitCode ?? null, command.finishPipelineExitCodes, {
      recovered: command.recoveryInitiated === true
    });
  }
  stripPromptText(text) {
    return text.replace(/(^|[\r\n])PS [^\r\n]*?>/g, "$1").replace(/(^|[\r\n])\$ /g, "$1");
  }
  terminateActiveProcess() {
    const activePty = this.activePty;
    if (!activePty) return;
    try {
      activePty.kill();
    } catch {}
  }
  disposeActivePtySubscriptions() {
    this.activePtyDataSubscription?.dispose();
    this.activePtyExitSubscription?.dispose();
    this.activePtyDataSubscription = void 0;
    this.activePtyExitSubscription = void 0;
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.terminateActiveProcess();
    this.activePty = void 0;
    if (this.activeCommand?.finishTimer) {
      clearTimeout(this.activeCommand.finishTimer);
      this.activeCommand.finishTimer = void 0;
    }
    if (this.echoTimeoutTimer) {
      clearTimeout(this.echoTimeoutTimer);
      this.echoTimeoutTimer = void 0;
    }
    this.resetEchoGate();
    this.continuationPromptSeen = false;
    this.activeCommand = void 0;
    this.disposeActivePtySubscriptions();
    this.writeEmitter.dispose();
    this.closeEmitter.dispose();
  }
};
function asRecord4(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function asString2(value, fallback = "") {
  return typeof value === "string" ? value : fallback;
}
function asBoolean2(value, fallback) {
  return typeof value === "boolean" ? value : fallback;
}
function asInteger2(value, fallback, min, max) {
  if (!Number.isInteger(value)) return fallback;
  return Math.min(max, Math.max(min, Number(value)));
}
function stripAnsi(text) {
  return text.replace(/[\u001B\u009B][[\]()#;?]*(?:(?:(?:[a-zA-Z\d]*(?:;[-a-zA-Z\d/#&.:=?%@~_]+)*)?\u0007)|(?:(?:\d{1,4}(?:[;:]\d{0,4})*)?[\dA-PR-TZcf-nq-uy=><~X]))/g, "");
}
var PARTIAL_ANSI_SUFFIX_RE = /[\u001B\u009B](?:[\[()#;?]*[0-9;:]*)?$/;
function ansiEscapeLength(text, index) {
  if (text[index] === "\x9B") {
    let cursor = index + 1;
    while (cursor < text.length && /[0-9;:?<>]/.test(text[cursor])) cursor++;
    if (cursor < text.length && text[cursor] >= "@" && text[cursor] <= "~") return cursor - index + 1;
    return text.length - index;
  }
  if (text[index] !== "\x1B") return 0;
  if (index + 1 >= text.length) return 1;
  const second = text[index + 1];
  if (second === "[") {
    let cursor = index + 2;
    while (cursor < text.length && /[0-9;:?<>]/.test(text[cursor])) cursor++;
    if (cursor < text.length && text[cursor] >= "@" && text[cursor] <= "~") return cursor - index + 1;
    return text.length - index;
  }
  if (second === "]") {
    let cursor = index + 2;
    while (cursor < text.length) {
      if (text[cursor] === "\x07") return cursor - index + 1;
      if (text[cursor] === "\x1B" && text[cursor + 1] === "\\") return cursor - index + 2;
      cursor++;
    }
    return text.length - index;
  }
  if (second === "(" || second === ")" || second === "#") {
    return index + 2 < text.length ? 3 : text.length - index;
  }
  if ("78=>DEHMcZ".includes(second)) return 2;
  return 0;
}
function promptTextLength(text, index) {
  if (text.startsWith("PS ", index)) {
    let cursor = index + 3;
    while (cursor < text.length && text[cursor] !== "\r" && text[cursor] !== "\n" && text[cursor] !== ">") cursor++;
    if (cursor < text.length && text[cursor] === ">") {
      cursor++;
      while (cursor < text.length && (text[cursor] === " " || text[cursor] === "	")) cursor++;
      return cursor - index;
    }
    return -1;
  }
  if (text.startsWith("$ ", index)) return 2;
  if (text.startsWith(">>> ", index)) return 4;
  if (text.startsWith("... ", index)) return 4;
  if (text.startsWith("> ", index)) return 2;
  return 0;
}
function normalizeRelativePath(value) {
  const normalized = value.trim().replace(/\\/g, "/").replace(/^\.\//, "");
  return normalized || ".";
}
function isInside2(root, candidate) {
  const rootResolved = import_node_path17.default.resolve(root);
  const candidateResolved = import_node_path17.default.resolve(candidate);
  const rootCmp = process.platform === "win32" ? rootResolved.toLowerCase() : rootResolved;
  const candidateCmp = process.platform === "win32" ? candidateResolved.toLowerCase() : candidateResolved;
  return candidateCmp === rootCmp || candidateCmp.startsWith(`${rootCmp}${import_node_path17.default.sep}`);
}
function workspaceRoot2() {
  const folder = vscode9.workspace.workspaceFolders?.[0];
  if (!folder) throw new Error("No workspace folder is open.");
  return folder.uri.fsPath;
}
function resolveWorkspacePath(relative = ".") {
  const root = workspaceRoot2();
  const rel = normalizeRelativePath(relative);
  if (import_node_path17.default.isAbsolute(rel)) throw new Error("Path must be workspace-relative.");
  const absolute = import_node_path17.default.resolve(root, rel);
  if (!isInside2(root, absolute)) throw new Error(`Path is outside the workspace: ${relative}`);
  const normalizedRelative = import_node_path17.default.relative(root, absolute).replace(/\\/g, "/") || ".";
  return {
    root,
    absolute,
    relative: normalizedRelative,
    uri: vscode9.Uri.file(absolute)
  };
}
function toolResult(text) {
  return new vscode9.LanguageModelToolResult([new vscode9.LanguageModelTextPart(text)]);
}
function summarizeCommand(command, maxLength = 48) {
  const firstLine = command.split(/\r?\n/, 1)[0]?.trim() ?? "";
  if (!firstLine) return "command";
  if (firstLine.length <= maxLength) return firstLine;
  return `${firstLine.slice(0, maxLength - 1)}\u2026`;
}
function writeTempScript(commandId, command, shellKind) {
  if (shellKind === "powershell") {
    const scriptPath2 = import_node_path17.default.join(import_node_os4.default.tmpdir(), `shuncode-run-${commandId}.ps1`);
    const prelude = "[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)\r\n";
    let content;
    const insertAt = encodingPreludeInsertIndex(command);
    if (insertAt >= 0) {
      content = `\uFEFF${command.slice(0, insertAt)}\r
${prelude}${command.slice(insertAt)}\r
`;
    } else if (/^\s*param\s*\(/.test(command)) {
      content = `\uFEFF${command}\r
`;
    } else {
      content = `\uFEFF${prelude}${command}\r
`;
    }
    const nativeExitGuard = "\r\nif (-not $?) { if ($LASTEXITCODE -is [int]) { exit $LASTEXITCODE } else { exit 1 } }\r\n";
    import_node_fs11.default.writeFileSync(scriptPath2, `${content}${nativeExitGuard}`, "utf8");
    return scriptPath2;
  }
  const scriptPath = import_node_path17.default.join(import_node_os4.default.tmpdir(), `shuncode-run-${commandId}.sh`);
  import_node_fs11.default.writeFileSync(scriptPath, `${command.replace(/\r\n?/g, "\n")}
`, {
    mode: 448
  });
  return scriptPath;
}
function encodingPreludeInsertIndex(command) {
  if (!/^\s*param\s*\(/.test(command)) return -1;
  const open6 = command.indexOf("(", command.indexOf("param"));
  if (open6 < 0) return -1;
  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  for (let i = open6; i < command.length; i++) {
    const ch = command[i];
    if (inSingle) {
      if (ch === "'") {
        if (command[i + 1] === "'") i++;else inSingle = false;
      }
      continue;
    }
    if (inDouble) {
      if (ch === '"') {
        if (command[i + 1] === '"') i++;else inDouble = false;
      }
      continue;
    }
    if (ch === "'") inSingle = true;else if (ch === '"') inDouble = true;else if (ch === "(") depth++;else if (ch === ")") {
      depth--;
      if (depth === 0) return i + 1;
    }
  }
  return -1;
}
function tempScriptCommand(scriptPath, shellKind) {
  if (shellKind === "powershell") {
    const windowsRoot = process.env.SystemRoot || process.env.WINDIR || "C:\\Windows";
    const powershell = import_node_path17.default.join(windowsRoot, "System32", "WindowsPowerShell", "v1.0", "powershell.exe");
    return `& "${powershell}" -NoProfile -ExecutionPolicy Bypass -File "${scriptPath}"`;
  }
  if (process.platform === "win32") {
    return `bash "${scriptPath.replace(/\\/g, "/")}"`;
  }
  const shell = import_node_fs11.default.existsSync("/bin/bash") ? "/bin/bash" : "/bin/sh";
  return `${shell} "${scriptPath}"`;
}
function parseExitCode(text) {
  const match = text.match(/^exit_code: (-?\d+|null)$/m);
  if (!match) return void 0;
  return match[1] === "null" ? null : Number.parseInt(match[1], 10);
}
function resultText(result) {
  return result.content.map(part => {
    if (typeof part?.value === "string") return part.value;
    if (part?.value && typeof part.value.value === "string") return part.value.value;
    return JSON.stringify(part);
  }).filter(Boolean).join("\n");
}
var TerminalCommandManager = class {
  states = /* @__PURE__ */new Map();
  slots = /* @__PURE__ */new Map();
  commandCanceller = new ManagedCommandCanceller();
  nextTerminalId = 1;
  disposables = [];
  constructor() {
    for (const terminal of vscode9.window.terminals) {
      if (MANAGED_TERMINAL_NAME.test(terminal.name)) terminal.dispose();
    }
    this.disposables.push(vscode9.window.onDidCloseTerminal(terminal => {
      for (const [slotId, slot] of this.slots) {
        if (slot.terminal !== terminal) continue;
        this.clearIdleTimer(slot);
        slot.closed = true;
        slot.pty.terminateActiveProcess();
        slot.busyCommandId = void 0;
        this.slots.delete(slotId);
      }
      for (const state of this.states.values()) {
        if (state.terminal !== terminal || state.status !== "running") continue;
        state.status = state.cancelRequestedAt === void 0 ? "killed" : "cancelled";
        state.exitCode = null;
        state.endedAt = Date.now();
        state.resolveDone();
      }
    }));
  }
  dispose() {
    for (const disposable of this.disposables) disposable.dispose();
    for (const state of this.states.values()) {
      if (state.kind !== "direct" || state.status !== "running") continue;
      try {
        state.child?.kill();
      } catch {}
      state.status = "killed";
      state.exitCode = null;
      state.endedAt = Date.now();
      state.resolveDone();
    }
    for (const slot of this.slots.values()) {
      this.clearIdleTimer(slot);
      if (!slot.closed) slot.terminal.dispose();
    }
    this.slots.clear();
    this.states.clear();
  }
  sameFileSystemPath(a, b) {
    return this.fileSystemPathKey(a) === this.fileSystemPathKey(b);
  }
  fileSystemPathKey(value) {
    const resolved = import_node_path17.default.resolve(value);
    return process.platform === "win32" ? resolved.toLowerCase() : resolved;
  }
  currentSlotCwd(slot) {
    return slot.pty.currentCwd || slot.initialCwd;
  }
  clearIdleTimer(slot) {
    if (!slot.idleTimer) return;
    clearTimeout(slot.idleTimer);
    slot.idleTimer = void 0;
  }
  scheduleIdleClose(slot) {
    this.clearIdleTimer(slot);
    if (slot.closed || slot.busyCommandId) return;
    slot.idleTimer = setTimeout(() => {
      slot.idleTimer = void 0;
      if (slot.closed || slot.busyCommandId) return;
      if (!isManagedTerminalIdleExpired(slot.lastUsedAt)) {
        this.scheduleIdleClose(slot);
        return;
      }
      this.disposeIdleSlot(slot);
    }, managedTerminalIdleDelay(slot.lastUsedAt));
    slot.idleTimer.unref?.();
  }
  disposeIdleSlot(slot) {
    if (slot.closed || slot.busyCommandId) return;
    this.clearIdleTimer(slot);
    slot.closed = true;
    this.slots.delete(slot.id);
    slot.terminal.dispose();
  }
  forceCloseSlot(slot) {
    if (slot.closed) return;
    this.clearIdleTimer(slot);
    slot.closed = true;
    slot.busyCommandId = void 0;
    this.slots.delete(slot.id);
    slot.pty.terminateActiveProcess();
    slot.terminal.dispose();
  }
  /**
   * Concurrency may temporarily require several terminals for the same cwd. Once commands
   * finish, collapse the pool back to one idle terminal per cwd and keep only a small LRU set
   * overall. Running/background terminals are never pruned.
   */
  pruneIdleTerminals() {
    const idle = [...this.slots.values()].filter(slot => !slot.closed && !slot.busyCommandId);
    const byCwd = /* @__PURE__ */new Map();
    for (const slot of idle) {
      const key = `${slot.ownerId}\0${this.fileSystemPathKey(this.currentSlotCwd(slot))}`;
      const group = byCwd.get(key) ?? [];
      group.push(slot);
      byCwd.set(key, group);
    }
    for (const group of byCwd.values()) {
      group.sort((a, b) => b.lastUsedAt - a.lastUsedAt);
      for (const duplicate of group.slice(1)) this.disposeIdleSlot(duplicate);
    }
    const remaining = [...this.slots.values()].filter(slot => !slot.closed && !slot.busyCommandId).sort((a, b) => b.lastUsedAt - a.lastUsedAt);
    for (const excess of remaining.slice(MAX_IDLE_TERMINALS)) this.disposeIdleSlot(excess);
  }
  async acquireTerminal(ownerId, commandId, cwdInfo) {
    const candidates = [...this.slots.values()].filter(slot2 => slot2.ownerId === ownerId && !slot2.closed && !slot2.busyCommandId).sort((a, b) => b.lastUsedAt - a.lastUsedAt);
    for (const slot2 of candidates) {
      if (slot2.closed || slot2.busyCommandId) continue;
      if (cwdInfo && !this.sameFileSystemPath(this.currentSlotCwd(slot2), cwdInfo.absolute)) continue;
      this.clearIdleTimer(slot2);
      slot2.busyCommandId = commandId;
      slot2.lastUsedAt = Date.now();
      slot2.terminal.show(true);
      return {
        slot: slot2,
        reused: true,
        effectiveCwd: this.currentSlotCwd(slot2)
      };
    }
    const initialCwd = cwdInfo?.absolute ?? resolveWorkspacePath(".").absolute;
    const terminalNumber = this.nextTerminalId++;
    const pty = new ManagedCommandPseudoterminal(initialCwd);
    const terminal = vscode9.window.createTerminal({
      name: `ShunCode \xB7 ${terminalNumber}`,
      pty,
      iconPath: new vscode9.ThemeIcon("shield"),
      color: new vscode9.ThemeColor("terminal.ansiBlue"),
      // Agent terminals are implementation detail of the current Extension Host session.
      // Persisting/restoring them creates orphan duplicates because command state is in memory.
      isTransient: true
    });
    const slot = {
      id: `terminal_${terminalNumber}`,
      ownerId,
      terminal,
      pty,
      initialCwd,
      busyCommandId: commandId,
      closed: false,
      lastUsedAt: Date.now()
    };
    this.slots.set(slot.id, slot);
    try {
      terminal.show(true);
      await pty.ensureStarted();
      return {
        slot,
        reused: false,
        effectiveCwd: this.currentSlotCwd(slot)
      };
    } catch (error2) {
      slot.closed = true;
      slot.busyCommandId = void 0;
      this.slots.delete(slot.id);
      terminal.dispose();
      throw error2;
    }
  }
  displayCwd(absolute) {
    const root = workspaceRoot2();
    if (!isInside2(root, absolute)) return absolute;
    return import_node_path17.default.relative(root, absolute).replace(/\\/g, "/") || ".";
  }
  appendOutput(state, text) {
    const previousPending = state.ansiPending;
    let clean = stripAnsi(previousPending + text);
    const pending = clean.match(PARTIAL_ANSI_SUFFIX_RE);
    if (pending) {
      state.ansiPending = pending[0];
      clean = clean.slice(0, clean.length - pending[0].length);
    } else {
      state.ansiPending = "";
      if (previousPending && clean.startsWith(previousPending)) {
        clean = clean.slice(previousPending.length);
      }
    }
    clean = clean.replace(/.?\u0008/g, "");
    if (state.output.length === 0) {
      clean = clean.replace(/^(?:\r?\n|[ \t])*/, "").replace(/^PS [^\r\n]*> ?/, "").replace(/^\$ /, "").replace(/^(?:\r?\n|[ \t])*/, "");
    }
    if (!clean) return;
    const bytes = Buffer.from(clean, "utf8");
    state.totalOutputBytes += bytes.length;
    state.output = Buffer.concat([state.output, bytes]);
    if (state.output.length > MAX_CAPTURED_OUTPUT_BYTES) {
      state.output = state.output.subarray(state.output.length - MAX_CAPTURED_OUTPUT_BYTES);
    }
    state.outputStartOffset = state.totalOutputBytes - state.output.length;
  }
  finishState(state, exitCode, status, meta2) {
    if (state.status !== "running") return;
    let finalStatus = state.cancelRequestedAt !== void 0 ? "cancelled" : status ?? (exitCode === 0 ? "completed" : "failed");
    const parserEvidence = /\+\s*CategoryInfo\s*:[^\r\n]*ParserError/i.test(state.output.toString("utf8"));
    state.suspectedParserError = finalStatus === "completed" && exitCode === 0 && parserEvidence;
    if (state.suspectedParserError) {
      finalStatus = "failed";
      exitCode = null;
    }
    state.recoveredByAbort = meta2?.recovered === true;
    state.exitCode = exitCode;
    state.status = finalStatus;
    state.endedAt = Date.now();
    if (state.slot) {
      state.slot.lastUsedAt = state.endedAt;
      if (state.slot.busyCommandId === state.id) state.slot.busyCommandId = void 0;
      if (!state.slot.closed) this.scheduleIdleClose(state.slot);
    }
    const tempScript = state.tempScriptPath;
    if (tempScript) {
      state.tempScriptPath = void 0;
      import_node_fs11.default.unlink(tempScript, () => {});
    }
    state.resolveDone();
    this.pruneCommandStates();
    this.pruneIdleTerminals();
  }
  pruneCommandStates() {
    const pruneIds = managedCommandStateIdsToPrune([...this.states.values()].map(state => ({
      id: state.id,
      ownerId: state.ownerId,
      status: state.status,
      endedAt: state.endedAt
    })));
    for (const id of pruneIds) this.states.delete(id);
  }
  readOutput(state, requestedOffset = 0, maxBytes = DEFAULT_OUTPUT_BYTES) {
    const limit = Math.min(MAX_OUTPUT_BYTES2, Math.max(1, maxBytes));
    const outputLost = requestedOffset < state.outputStartOffset;
    const actualOffset = Math.max(state.outputStartOffset, Math.min(requestedOffset, state.totalOutputBytes));
    const localStart = actualOffset - state.outputStartOffset;
    const available = state.output.subarray(localStart);
    const slice = available.subarray(0, limit);
    const nextOffset = actualOffset + slice.length;
    return {
      command_id: state.id,
      terminal_id: state.terminalId,
      execution: state.kind,
      terminal_name: state.terminalName,
      terminal_reused: state.terminalReused,
      status: state.status,
      exit_code: state.exitCode,
      pipeline_exit_codes: vscode9.workspace.getConfiguration("shuncode.terminal").get("pipelineExitCodes", true) ? state.pipelineExitCodes ?? null : null,
      cwd: state.cwd,
      background: state.background,
      duration_ms: (state.endedAt ?? Date.now()) - state.startedAt,
      output: slice.toString("utf8"),
      output_start_offset: actualOffset,
      next_offset: nextOffset,
      total_output_bytes: state.totalOutputBytes,
      output_lost: outputLost,
      has_more: nextOffset < state.totalOutputBytes
    };
  }
  async run(input, ownerId = NATIVE_MANAGED_COMMAND_OWNER_ID) {
    const command = asString2(input.command).trim();
    if (!command) throw new Error("command must be a non-empty string");
    const background = asBoolean2(input.background, false);
    const timeoutMs = asInteger2(input.timeout_ms, 12e4, 1e3, 12e4);
    const cwdInfo = typeof input.cwd === "string" && input.cwd.trim() ? resolveWorkspacePath(input.cwd) : void 0;
    if (input.execution !== void 0 && input.execution !== "pty") {
      throw new Error("The managed terminal uses the persistent Bash PTY only; direct execution is no longer part of the public terminal contract.");
    }
    const id = createManagedCommandId();
    let execCommand = command;
    let tempScriptPath;
    const {
      slot,
      reused,
      effectiveCwd
    } = await this.acquireTerminal(ownerId, id, cwdInfo);
    if (/\r|\n/.test(command) || /[^\x00-\x7F]/.test(command) || command.length > 1024) {
      const shellKind = slot.pty.shellName;
      tempScriptPath = writeTempScript(id, command, shellKind);
      execCommand = tempScriptCommand(tempScriptPath, shellKind);
    }
    const displayCwd = cwdInfo?.relative ?? this.displayCwd(effectiveCwd);
    const terminal = slot.terminal;
    let resolveDone;
    const done = new Promise(resolve => {
      resolveDone = resolve;
    });
    const state = {
      id,
      ownerId,
      kind: "pty",
      terminal,
      terminalName: terminal.name,
      terminalId: slot.id,
      terminalReused: reused,
      slot,
      command,
      cwd: displayCwd,
      startedAt: Date.now(),
      background,
      status: "running",
      exitCode: null,
      output: Buffer.alloc(0),
      outputStartOffset: 0,
      totalOutputBytes: 0,
      ansiPending: "",
      tempScriptPath,
      done,
      resolveDone
    };
    this.states.set(id, state);
    try {
      const captureColumns = asBoolean2(input[CHAT_CAPTURE_INPUT_KEY], false) && !background ? CHAT_CAPTURE_COLUMNS : void 0;
      await slot.pty.run(execCommand, {
        onOutput: text => this.appendOutput(state, text),
        onExit: (code, pipelineExitCodes, meta2) => {
          state.pipelineExitCodes = pipelineExitCodes;
          this.finishState(state, meta2?.recovered ? null : code, meta2?.recovered ? "failed" : void 0, meta2);
        }
      }, captureColumns);
    } catch (error2) {
      this.finishState(state, null, "failed");
      throw error2;
    }
    if (!background) {
      const finishedInTime = await Promise.race([done.then(() => true), new Promise(resolve => setTimeout(() => resolve(false), timeoutMs))]);
      if (!finishedInTime && state.status === "running") {
        const stuckEvidence = slot.pty.hasContinuationHint || /(^|[\r\n])>> ?/.test(state.output.toString("utf8"));
        if (stuckEvidence) {
          for (let attempt = 0; attempt < 2 && state.status === "running"; attempt++) {
            slot.pty.abortCurrentInput();
            await Promise.race([done.then(() => true), new Promise(resolve => setTimeout(() => resolve(false), 2500))]);
          }
          if (state.status === "running") {
            slot.closed = true;
            this.slots.delete(slot.id);
            slot.terminal.dispose();
            await Promise.race([done.then(() => true), new Promise(resolve => setTimeout(() => resolve(false), 1500))]);
          }
        }
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    const snapshot = this.readOutput(state, 0, 64 * 1024);
    return ["=== RUN_COMMAND BEGIN ===", `command_id: ${id}`, `terminal_id: ${state.terminalId}`, `terminal_name: ${JSON.stringify(state.terminalName)}`, `execution: ${state.kind}`, `shell: ${slot.pty.shellName}`, `terminal_reused: ${reused}`, `command: ${JSON.stringify(command)}`, `status: ${snapshot.status}`, `exit_code: ${snapshot.exit_code ?? "null"}`, `pipeline_exit_codes: ${snapshot.pipeline_exit_codes === null ? "null" : JSON.stringify(snapshot.pipeline_exit_codes)}`, `cwd: ${JSON.stringify(displayCwd)}`, `background: ${background}`, `script_bridge: ${tempScriptPath ? JSON.stringify(tempScriptPath) : "null"}`, `shell_prompt_seq: ${slot.pty.lastSeenPromptSequence}`, `recovered_by_abort: ${state.recoveredByAbort === true}`, `suspected_parser_error: ${state.suspectedParserError === true}`, `hint: ${snapshot.status === "running" ? "still running; poll with get_command_output using next_offset" : "none"}`, `duration_ms: ${snapshot.duration_ms}`, `next_offset: ${snapshot.next_offset}`, `total_output_bytes: ${snapshot.total_output_bytes}`, `output_lost: ${snapshot.output_lost}`, "--- OUTPUT BEGIN ---", String(snapshot.output ?? ""), "--- OUTPUT END ---", "=== RUN_COMMAND END ==="].join("\n");
  }
  /**
   * Execution mode "direct": run the command through a one-shot child process with piped
   * stdio instead of the persistent PTY. The exit code comes straight from the child
   * process, so it is trustworthy by construction: no prompt protocol, no echo gate, no
   * continuation state, no terminal slot consumed, and nothing appears in a terminal view.
   * stdin is closed, so interactive programs cannot be served here. On timeout the child
   * keeps running and the command stays pollable via get_command_output, mirroring PTY
   * semantics.
   */
  async runDirect(command, cwdInfo, timeoutMs) {
    const id = createManagedCommandId();
    let file;
    let args;
    let tempScriptPath;
    let directShell;
    const directEnv = managedProcessEnvironment();
    if (process.platform === "win32") {
      const bundledBash = bundledGitBashExecutable();
      if (!bundledBash) throw new Error("ShunCode direct compatibility path also requires the product-bundled Git Bash runtime.");
      directShell = "bash";
      file = bundledBash;
      args = ["--noprofile", "--norc", "-c", command];
      const gitRoot = import_node_path17.default.resolve(bundledBash, "..", "..");
      directEnv.PATH = withBundledGitPath(gitRoot, directEnv.PATH ?? directEnv.Path ?? "");
    } else {
      file = import_node_fs11.default.existsSync("/bin/bash") ? "/bin/bash" : "/bin/sh";
      args = ["-c", command];
      directShell = file === "/bin/bash" ? "bash" : "sh";
    }
    const cwd = cwdInfo?.absolute ?? resolveWorkspacePath(".").absolute;
    let resolveDone;
    const done = new Promise(resolve => {
      resolveDone = resolve;
    });
    const state = {
      id,
      ownerId: NATIVE_MANAGED_COMMAND_OWNER_ID,
      kind: "direct",
      terminal: null,
      terminalId: "direct",
      terminalName: "direct",
      terminalReused: false,
      command,
      cwd: cwdInfo?.relative ?? this.displayCwd(cwd),
      startedAt: Date.now(),
      background: false,
      status: "running",
      exitCode: null,
      output: Buffer.alloc(0),
      outputStartOffset: 0,
      totalOutputBytes: 0,
      ansiPending: "",
      tempScriptPath,
      done,
      resolveDone
    };
    this.states.set(id, state);
    try {
      const child = child_process.spawn(file, args, {
        cwd,
        env: directEnv,
        stdio: ["ignore", "pipe", "pipe"],
        windowsHide: true
      });
      state.child = child;
      const outDecoder = new import_node_string_decoder.StringDecoder("utf8");
      const errDecoder = new import_node_string_decoder.StringDecoder("utf8");
      child.stdout?.on("data", chunk => this.appendOutput(state, outDecoder.write(chunk)));
      child.stderr?.on("data", chunk => this.appendOutput(state, errDecoder.write(chunk)));
      child.on("error", error2 => {
        this.appendOutput(state, `[shuncode] failed to start the direct command: ${error2.message}
`);
      });
      child.on("close", rawCode => {
        let code = typeof rawCode === "number" ? rawCode : null;
        if (code !== null && code > 2147483647) code -= 4294967296;
        const outRest = outDecoder.end();
        if (outRest) this.appendOutput(state, outRest);
        const errRest = errDecoder.end();
        if (errRest) this.appendOutput(state, errRest);
        this.finishState(state, typeof code === "number" ? code : null);
      });
    } catch (error2) {
      this.finishState(state, null, "failed");
      throw error2;
    }
    await Promise.race([done, new Promise(resolve => setTimeout(resolve, timeoutMs))]);
    const snapshot = this.readOutput(state, 0, 64 * 1024);
    return ["=== RUN_COMMAND BEGIN ===", `command_id: ${id}`, `terminal_id: ${state.terminalId}`, `terminal_name: ${JSON.stringify(state.terminalName)}`, `terminal_reused: false`, `command: ${JSON.stringify(command)}`, `execution: direct`, `shell: ${directShell}`, `status: ${snapshot.status}`, `exit_code: ${snapshot.exit_code ?? "null"}`, `cwd: ${JSON.stringify(state.cwd)}`, `background: false`, `script_bridge: ${tempScriptPath ? JSON.stringify(tempScriptPath) : "null"}`, `shell_prompt_seq: null`, `recovered_by_abort: ${state.recoveredByAbort === true}`, `suspected_parser_error: ${state.suspectedParserError === true}`, `hint: ${snapshot.status === "running" ? "still running; poll with get_command_output using next_offset" : "none"}`, `duration_ms: ${snapshot.duration_ms}`, `next_offset: ${snapshot.next_offset}`, `total_output_bytes: ${snapshot.total_output_bytes}`, `output_lost: ${snapshot.output_lost}`, "--- OUTPUT BEGIN ---", String(snapshot.output ?? ""), "--- OUTPUT END ---", "=== RUN_COMMAND END ==="].join("\n");
  }
  stateForOwner(commandId, ownerId) {
    const id = normalizeManagedCommandId(commandId);
    const state = this.states.get(id);
    if (!state || state.ownerId !== ownerId) throw managedCommandNotAccessibleError();
    return state;
  }
  cancellationTarget(state) {
    const manager = this;
    return {
      id: state.id,
      ownerId: state.ownerId,
      command: state.command,
      cwd: state.cwd,
      startedAt: state.startedAt,
      get status() {
        return state.status;
      },
      get exitCode() {
        return state.exitCode;
      },
      get cancelRequestedAt() {
        return state.cancelRequestedAt;
      },
      get cancelForced() {
        return state.cancelForced;
      },
      get terminalReusable() {
        return Boolean(state.slot && !state.slot.closed);
      },
      done: state.done,
      requestInterrupt(at) {
        if (state.status !== "running") return false;
        state.cancelRequestedAt = at;
        if (state.slot) return state.slot.pty.interruptActiveCommand();
        try {
          return state.child?.kill("SIGINT") === true;
        } catch {
          return false;
        }
      },
      forceClose() {
        if (state.status !== "running") return;
        state.cancelForced = true;
        if (state.slot) manager.forceCloseSlot(state.slot);else {
          try {
            state.child?.kill("SIGKILL");
          } catch {}
        }
      }
    };
  }
  async cancel(input, ownerId = NATIVE_MANAGED_COMMAND_OWNER_ID) {
    const state = this.stateForOwner(asString2(input.command_id), ownerId);
    const target = this.cancellationTarget(state);
    const graceMs = asInteger2(input.grace_ms, 1500, 100, 1e4);
    const force = asBoolean2(input.force, false);
    let forceConfirmed = false;
    const preview = this.commandCanceller.preview(target, ownerId);
    if (force && forceCancellationRequiresConfirmation(preview)) {
      this.commandCanceller.reserveForcePrompt(target, ownerId);
      const consequence = preview.riskConsequence ? `

${preview.riskConsequence}` : "";
      const choice = await vscode9.window.showWarningMessage(`Force-stop this ShunCode managed terminal?

${preview.command}${consequence}`, {
        modal: true,
        detail: `High-risk command: ${preview.riskReason ?? "destructive operation"}. Only this owner-scoped terminal will be closed.`
      }, "Force Stop");
      if (choice !== "Force Stop") throw new Error("FORCE_CANCEL_DECLINED: local user did not approve force-closing the managed terminal.");
      forceConfirmed = true;
    }
    const result = await this.commandCanceller.cancel(target, {
      ownerId,
      graceMs,
      force,
      forceConfirmed
    });
    return ["=== CANCEL_COMMAND BEGIN ===", `command_id: ${state.id}`, `status_before: ${result.statusBefore}`, `status: ${result.status}`, `exit_code: ${result.exitCode ?? "null"}`, `cancel_requested: ${result.cancelRequested}`, `already_requested: ${result.alreadyRequested}`, `already_finished: ${result.alreadyFinished}`, `interrupt_sent: ${result.interruptSent}`, `force_required: ${result.forceRequired}`, `forced: ${result.forced}`, `risk: ${result.riskLevel}`, `terminal_reusable: ${result.terminalReusable}`, "=== CANCEL_COMMAND END ==="].join("\n");
  }
  releaseOwner(ownerId) {
    this.commandCanceller.releaseOwner(ownerId);
    for (const state of [...this.states.values()]) {
      if (state.ownerId !== ownerId) continue;
      if (state.status === "running" && state.slot) this.forceCloseSlot(state.slot);
      this.states.delete(state.id);
    }
    for (const slot of [...this.slots.values()]) if (slot.ownerId === ownerId && !slot.busyCommandId) this.disposeIdleSlot(slot);
  }
  getOutput(input, ownerId = NATIVE_MANAGED_COMMAND_OWNER_ID) {
    const state = this.stateForOwner(asString2(input.command_id), ownerId);
    const id = state.id;
    const offset = asInteger2(input.offset, 0, 0, Number.MAX_SAFE_INTEGER);
    const maxBytes = asInteger2(input.max_bytes, DEFAULT_OUTPUT_BYTES, 1, MAX_OUTPUT_BYTES2);
    const snapshot = this.readOutput(state, offset, maxBytes);
    return ["=== COMMAND_OUTPUT BEGIN ===", `command_id: ${id}`, `execution: ${String(snapshot.execution)}`, `terminal_id: ${snapshot.terminal_id}`, `terminal_name: ${JSON.stringify(snapshot.terminal_name)}`, `status: ${snapshot.status}`, `exit_code: ${snapshot.exit_code ?? "null"}`, `pipeline_exit_codes: ${snapshot.pipeline_exit_codes === null ? "null" : JSON.stringify(snapshot.pipeline_exit_codes)}`, `recovered_by_abort: ${state.recoveredByAbort === true}`, `suspected_parser_error: ${state.suspectedParserError === true}`, `duration_ms: ${snapshot.duration_ms}`, `output_start_offset: ${snapshot.output_start_offset}`, `next_offset: ${snapshot.next_offset}`, `total_output_bytes: ${snapshot.total_output_bytes}`, `output_lost: ${snapshot.output_lost}`, `has_more: ${snapshot.has_more}`, "--- OUTPUT BEGIN ---", String(snapshot.output ?? ""), "--- OUTPUT END ---", "=== COMMAND_OUTPUT END ==="].join("\n");
  }
  sendInput(input, ownerId = NATIVE_MANAGED_COMMAND_OWNER_ID) {
    const state = this.stateForOwner(asString2(input.command_id), ownerId);
    const id = state.id;
    if (state.status !== "running") throw new Error(`Command ${id} is not running (status=${state.status}).`);
    if (state.kind === "direct") {
      throw new Error(`Command ${id} runs in direct mode without a terminal; interactive input requires the default PTY execution mode.`);
    }
    const text = asString2(input.input);
    const appendNewline = asBoolean2(input.append_newline, true);
    state.slot?.pty.sendInput(text, appendNewline);
    return ["=== SEND_COMMAND_INPUT BEGIN ===", `command_id: ${id}`, `terminal_id: ${state.terminalId}`, `status: ${state.status}`, `bytes_sent: ${Buffer.byteLength(text, "utf8")}`, `append_newline: ${appendNewline}`, "=== SEND_COMMAND_INPUT END ==="].join("\n");
  }
  revealTerminal(terminalId) {
    const slot = this.slots.get(terminalId);
    if (!slot || slot.closed) return false;
    slot.terminal.show(false);
    return true;
  }
};
async function listDirectory(input) {
  const scope = resolveWorkspacePath(asString2(input.path, "."));
  const depth = asInteger2(input.depth, 1, 1, 2);
  const includeHidden = asBoolean2(input.include_hidden, false);
  const noIgnore = asBoolean2(input.no_ignore, false);
  const maxEntries = asInteger2(input.max_entries, 200, 1, 500);
  const entries = [];
  let truncated = false;
  const visit = async (uri, relative, level) => {
    if (truncated) return;
    const children = await vscode9.workspace.fs.readDirectory(uri);
    children.sort((a, b) => {
      const ad = a[1] === vscode9.FileType.Directory ? 0 : 1;
      const bd = b[1] === vscode9.FileType.Directory ? 0 : 1;
      return ad - bd || a[0].localeCompare(b[0]);
    });
    for (const [name, type] of children) {
      if (!includeHidden && name.startsWith(".")) continue;
      if (!noIgnore && COMMON_EXCLUDES.has(name)) continue;
      const childRelative = relative === "." ? name : `${relative}/${name}`;
      entries.push({
        type: type === vscode9.FileType.Directory ? "dir" : type === vscode9.FileType.File ? "file" : type === vscode9.FileType.SymbolicLink ? "symlink" : "unknown",
        path: childRelative
      });
      if (entries.length >= maxEntries) {
        truncated = true;
        break;
      }
      if (level < depth && type === vscode9.FileType.Directory) {
        await visit(vscode9.Uri.joinPath(uri, name), childRelative, level + 1);
        if (truncated) break;
      }
    }
  };
  await visit(scope.uri, scope.relative, 1);
  return ["=== LIST_DIRECTORY BEGIN ===", `path: ${JSON.stringify(scope.relative)}`, `depth: ${depth}`, `include_hidden: ${includeHidden}`, `no_ignore: ${noIgnore}`, `returned_entries: ${entries.length}`, `truncated: ${truncated}`, "--- ENTRIES ---", ...entries.map(entry => `${entry.type === "dir" ? "[DIR]" : entry.type === "file" ? "[FILE]" : entry.type === "symlink" ? "[LINK]" : "[OTHER]"} ${entry.path}`), "=== LIST_DIRECTORY END ==="].join("\n");
}
function severityName(severity) {
  switch (severity) {
    case vscode9.DiagnosticSeverity.Error:
      return "error";
    case vscode9.DiagnosticSeverity.Warning:
      return "warning";
    case vscode9.DiagnosticSeverity.Information:
      return "information";
    default:
      return "hint";
  }
}
function diagnosticCode(code) {
  if (code === void 0) return void 0;
  if (typeof code === "string" || typeof code === "number") return code;
  return code.value;
}
function getDiagnostics(input) {
  const root = workspaceRoot2();
  const scope = input.path === void 0 ? void 0 : resolveWorkspacePath(asString2(input.path));
  const severities = Array.isArray(input.severity) ? new Set(input.severity.filter(value => typeof value === "string")) : void 0;
  const maxResults = asInteger2(input.max_results, 100, 1, 500);
  const rows = [];
  let totalMatching = 0;
  for (const [uri, diagnostics] of vscode9.languages.getDiagnostics()) {
    if (uri.scheme !== "file" || !isInside2(root, uri.fsPath)) continue;
    if (scope) {
      const scopePath = import_node_path17.default.resolve(scope.absolute);
      const candidate = import_node_path17.default.resolve(uri.fsPath);
      if (!(candidate === scopePath || candidate.startsWith(`${scopePath}${import_node_path17.default.sep}`))) continue;
    }
    for (const diagnostic of diagnostics) {
      const severity = severityName(diagnostic.severity);
      if (severities && !severities.has(severity)) continue;
      totalMatching += 1;
      if (rows.length >= maxResults) continue;
      rows.push({
        path: import_node_path17.default.relative(root, uri.fsPath).replace(/\\/g, "/"),
        line: diagnostic.range.start.line + 1,
        column: diagnostic.range.start.character + 1,
        end_line: diagnostic.range.end.line + 1,
        end_column: diagnostic.range.end.character + 1,
        severity,
        source: diagnostic.source ?? null,
        code: diagnosticCode(diagnostic.code) ?? null,
        message: diagnostic.message
      });
    }
  }
  rows.sort((a, b) => {
    const order = {
      error: 0,
      warning: 1,
      information: 2,
      hint: 3
    };
    return (order[String(a.severity)] ?? 9) - (order[String(b.severity)] ?? 9) || String(a.path).localeCompare(String(b.path)) || Number(a.line) - Number(b.line) || Number(a.column) - Number(b.column);
  });
  const returned = rows.slice(0, maxResults);
  return ["=== GET_DIAGNOSTICS BEGIN ===", `scope: ${JSON.stringify(scope?.relative ?? ".")}`, `returned: ${returned.length}`, `total_matching: ${totalMatching}`, `truncated: ${totalMatching > returned.length}`, "--- DIAGNOSTICS ---", ...returned.map((row, index) => [`--- DIAGNOSTIC ${index + 1} ---`, `${row.path}:${row.line}:${row.column}`, `severity: ${row.severity}`, `source: ${JSON.stringify(row.source)}`, `code: ${JSON.stringify(row.code)}`, String(row.message)].join("\n")), "=== GET_DIAGNOSTICS END ==="].join("\n");
}
var IdeToolBroker = class {
  terminalManager = new TerminalCommandManager();
  registrations = [];
  async runTerminalSmokeTest() {
    const firstCommand = `export SHUNCODE_PERSISTENT_SMOKE=yes; printf 'shuncode-terminal-smoke-1\\n'; printf 'bash=%s\\n' "$BASH_VERSION"; printf 'git=%s\\n' "$(command -v git || true)"`;
    const secondCommand = `printf 'shuncode-terminal-smoke-2:%s\\n' "$SHUNCODE_PERSISTENT_SMOKE"`;
    const first = await this.terminalManager.run({
      command: firstCommand,
      cwd: ".",
      background: false,
      timeout_ms: 15e3
    });
    const second = await this.terminalManager.run({
      command: secondCommand,
      background: false,
      timeout_ms: 15e3
    });
    return `${first}
--- SECOND COMMAND ---
${second}`;
  }
  async runLspSmokeTest() {
    return invokeLspTool({
      operation: "workspace_symbols",
      query: "RuntimeClient",
      max_results: 20
    });
  }
  revealTerminal(terminalId) {
    return this.terminalManager.revealTerminal(terminalId);
  }
  releaseCommandOwner(ownerId) {
    this.terminalManager.releaseOwner(ownerId);
  }
  async executeTool(name, input, commandOwnerId = NATIVE_MANAGED_COMMAND_OWNER_ID) {
    switch (name) {
      case "list_directory":
        return toolResult(await listDirectory(input));
      case "run_command":
        return this.terminalResult(name, input, await this.terminalManager.run(input, commandOwnerId));
      case "get_command_output":
        return this.terminalResult(name, input, this.terminalManager.getOutput(input, commandOwnerId));
      case "cancel_command":
        return this.terminalResult(name, input, await this.terminalManager.cancel(input, commandOwnerId));
      case "send_command_input":
        return this.terminalResult(name, input, this.terminalManager.sendInput(input, commandOwnerId));
      case "wait":
        return toolResult(await this.waitImpl(input));
      case "get_diagnostics":
        return toolResult(getDiagnostics(input));
      case "lsp":
        return toolResult(await invokeLspTool(input));
      default:
        throw new Error(`Unsupported IDE tool: ${name}`);
    }
  }
  /**
   * Blocks for the requested duration. Lets the model wait out a background
   * command or watcher before polling with get_command_output, instead of
   * hammering the terminal in a tight loop.
   */
  async waitImpl(input) {
    const ms = asInteger2(input.ms, 1e4, 100, 12e4);
    await new Promise(resolve => setTimeout(resolve, ms));
    return `Waited ${ms} ms.`;
  }
  /**
   * Wraps a terminal tool result in the structured result type so the Chat UI shows a compact
   * step summary with success/failure and exit code instead of dumping the raw terminal
   * transcript into the response stream. The full transcript still reaches the model as the
   * text content and stays available in the step's expandable details.
   */
  terminalResult(name, input, text) {
    const result = new vscode9.ExtendedLanguageModelToolResult([new vscode9.LanguageModelTextPart(text)]);
    const exitCode = parseExitCode(text);
    const command = typeof input.command === "string" ? input.command.trim() : "";
    const summary = summarizeCommand(command || (typeof input.input === "string" ? input.input : ""));
    switch (name) {
      case "run_command":
        result.toolResultMessage = exitCode === void 0 || exitCode === null ? `Ran ${summary}` : exitCode === 0 ? `Ran ${summary} \xB7 exit 0` : `Command failed: ${summary} \xB7 exit ${exitCode}`;
        break;
      case "get_command_output":
        result.toolResultMessage = exitCode === void 0 || exitCode === null || exitCode === 0 ? "Read command output" : `Command output \xB7 exit ${exitCode}`;
        break;
      case "send_command_input":
        result.toolResultMessage = typeof input.command_id === "string" && input.command_id ? `Sent command input \xB7 ${input.command_id}` : "Sent command input";
        break;
      case "cancel_command":
        result.toolResultMessage = /^status: cancelled$/m.test(text) ? "Command cancelled" : /^force_required: true$/m.test(text) ? "Command still running \xB7 force stop available" : "Cancellation requested";
        break;
    }
    return result;
  }
  constructor() {
    for (const definition of IDE_TOOL_DEFINITIONS) {
      this.registrations.push(vscode9.lm.registerTool(definition.vscodeToolName, {
        prepareInvocation: async options => {
          if (definition.name !== "run_command") {
            const title = definition.name === "get_command_output" ? "Read command output" : definition.name === "send_command_input" ? "Send command input" : definition.name === "wait" ? "Wait" : definition.name;
            return {
              invocationMessage: title
            };
          }
          const input = asRecord4(options.input);
          const command = asString2(input.command).trim();
          const cwd = normalizeRelativePath(asString2(input.cwd, "."));
          const background = asBoolean2(input.background, false);
          const markdown = new vscode9.MarkdownString();
          markdown.appendMarkdown(`Run this command in the integrated terminal?

`);
          markdown.appendCodeblock(command || "(empty command)", "shell");
          markdown.appendMarkdown(`
Working directory: \`${cwd}\`

Background: \`${background}\``);
          return {
            // Bounded title keeps the collapsed step compact; the full command lives in the
            // confirmation message and the expandable step details.
            invocationMessage: `Run ${summarizeCommand(command)}`,
            confirmationMessages: {
              title: "Run terminal command",
              message: markdown
            }
          };
        },
        invoke: async options => this.executeTool(definition.name, asRecord4(options.input))
      }));
    }
  }
  async invoke(name, args, context, allowRegisteredTool = false) {
    const definition = getIdeToolDefinition(name);
    if (!definition && !allowRegisteredTool) return {
      text: `Unknown IDE tool: ${name}`,
      isError: true
    };
    try {
      const result = await vscode9.lm.invokeTool(definition?.vscodeToolName ?? name, {
        input: definition?.name === "run_command" ? {
          ...args,
          [CHAT_CAPTURE_INPUT_KEY]: true
        } : args,
        toolInvocationToken: context.toolInvocationToken
      }, context.cancellationToken);
      return {
        text: resultText(result),
        isError: false
      };
    } catch (error2) {
      const message = error2 instanceof Error ? error2.message : String(error2);
      const mcpHint = !definition && (name.startsWith("mcp__") || /could not be started|MCP server/i.test(message)) ? " The MCP server may be disconnected; restart it from the MCP servers view and send a new message." : "";
      return {
        text: `${definition ? "IDE" : "Registered"} tool ${name} failed: ${message}${mcpHint}`,
        isError: true
      };
    }
  }
  /**
   * Executes the same implementation registered with vscode.lm, but without a native Chat
   * invocation token. The HTTP Bridge uses this path because the remote MCP client owns its
   * confirmation UX; tool semantics, terminal state, diagnostics and LSP behavior remain shared.
   */
  async invokeDirect(name, args, cancellationToken, commandOwnerId = NATIVE_MANAGED_COMMAND_OWNER_ID) {
    if (!getIdeToolDefinition(name)) return {
      text: `Unknown IDE tool: ${name}`,
      isError: true
    };
    if (cancellationToken?.isCancellationRequested) return {
      text: `IDE tool ${name} canceled.`,
      isError: true
    };
    try {
      const result = await this.executeTool(name, args, commandOwnerId);
      if (cancellationToken?.isCancellationRequested) return {
        text: `IDE tool ${name} canceled.`,
        isError: true
      };
      return {
        text: resultText(result),
        isError: false
      };
    } catch (error2) {
      const message = error2 instanceof Error ? error2.message : String(error2);
      return {
        text: `IDE tool ${name} failed: ${message}`,
        isError: true
      };
    }
  }
  dispose() {
    this.terminalManager.dispose();
    for (const registration of this.registrations) registration.dispose();
  }
};

// extensions/shuncode/src/model-provider.ts
export { child_process, import_node_fs11, import_node_os4, import_node_path17, import_node_string_decoder, vscode9, COMMON_EXCLUDES, MAX_CAPTURED_OUTPUT_BYTES, DEFAULT_OUTPUT_BYTES, MAX_OUTPUT_BYTES2, MAX_IDLE_TERMINALS, PTY_EXIT_DATA_FLUSH_MS, COMMAND_ECHO_TIMEOUT_MS, MAX_ECHO_HUNT_BYTES, MANAGED_TERMINAL_NAME, CHAT_CAPTURE_COLUMNS, CHAT_CAPTURE_INPUT_KEY, nodePtyModule, getNodePty, managedShellSpec, managedProcessEnvironment, cachedBundledModulesDir, bundledModulesDir, cachedBundledGitBash, bundledGitBashExecutable, withBundledGitPath, bashPromptCommand, ManagedCommandPseudoterminal, asRecord4, asString2, asBoolean2, asInteger2, stripAnsi, PARTIAL_ANSI_SUFFIX_RE, ansiEscapeLength, promptTextLength, normalizeRelativePath, isInside2, workspaceRoot2, resolveWorkspacePath, toolResult, summarizeCommand, writeTempScript, encodingPreludeInsertIndex, tempScriptCommand, parseExitCode, resultText, TerminalCommandManager, listDirectory, severityName, diagnosticCode, getDiagnostics, IdeToolBroker };
