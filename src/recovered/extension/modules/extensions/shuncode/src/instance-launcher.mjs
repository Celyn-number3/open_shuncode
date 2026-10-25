// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { __toESM } from "../../../runtime/helpers.mjs";
import { init_define_SHUNCODE_BUILD_INFO } from "../../../runtime/build-info.mjs";
// extensions/shuncode/src/instance-launcher.ts
init_define_SHUNCODE_BUILD_INFO();
var import_node_child_process9 = require("node:child_process");
var import_node_crypto15 = require("node:crypto");
var import_node_fs12 = require("node:fs");
var import_promises7 = require("node:fs/promises");
var import_node_path20 = __toESM(require("node:path"));
var import_node_url = require("node:url");
var DEFAULT_NAMED_LOCAL_PORT = 48271;
function userDataDirectoryOf(globalStorageFsPath) {
  return import_node_path20.default.resolve(globalStorageFsPath, "..", "..", "..");
}
function instanceIdentity(userDataDir) {
  return (0, import_node_crypto15.createHash)("sha256").update(import_node_path20.default.resolve(userDataDir)).digest("hex").slice(0, 16);
}
function applicationBundleOf(executablePath) {
  let found;
  let current = import_node_path20.default.resolve(executablePath);
  for (;;) {
    if (current.endsWith(".app")) found = current;
    const parent = import_node_path20.default.dirname(current);
    if (parent === current) return found;
    current = parent;
  }
}
function devExecutableOverride(env6 = process.env) {
  return env6.SHUNCODE_DEV_EXE?.trim() || void 0;
}
function applicationExecutableOf(executablePath) {
  let current = import_node_path20.default.dirname(import_node_path20.default.resolve(executablePath));
  for (let depth = 0; depth < 4; depth++) {
    const candidate = import_node_path20.default.join(current, "ShunCode.exe");
    if ((0, import_node_fs12.existsSync)(candidate)) return candidate;
    const parent = import_node_path20.default.dirname(current);
    if (parent === current) return void 0;
    current = parent;
  }
  return void 0;
}
function nextUserDataDirectory(current, inUse) {
  const used = /* @__PURE__ */new Set([import_node_path20.default.resolve(current), ...[...inUse].map(item => import_node_path20.default.resolve(item))]);
  const base = import_node_path20.default.resolve(current).replace(/-(\d+)$/, "");
  for (let ordinal = 2; ordinal < 1e3; ordinal++) {
    const candidate = `${base}-${ordinal}`;
    if (!used.has(candidate)) return {
      directory: candidate,
      ordinal
    };
  }
  throw new Error("Too many ShunCode instances.");
}
function localFileUri(value, what) {
  if (value === void 0) return void 0;
  if (!/^file:\/\//.test(value)) throw new Error(`\u53EA\u80FD\u5728\u65B0\u5B9E\u4F8B\u4E2D\u6253\u5F00\u672C\u5730${what}\u3002`);
  return value;
}
function buildOpenArguments(plan) {
  const folderUri = localFileUri(plan.folderUri, "\u6587\u4EF6\u5939");
  const fileUri = localFileUri(plan.fileUri, "\u6587\u4EF6");
  if (folderUri && fileUri) throw new Error("Cannot open both a folder and a file in one instance.");
  const args = ["-n", "-a", plan.bundle ?? ""];
  for (const [key, value] of Object.entries(plan.environment ?? {})) args.push("--env", `${key}=${value}`);
  args.push("--args");
  if (plan.developmentAppRoot) args.push(plan.developmentAppRoot);
  args.push("--user-data-dir", plan.userDataDir);
  if (folderUri) args.push("--folder-uri", folderUri);
  if (fileUri) args.push("--file-uri", fileUri);
  return args;
}
function buildSpawnArguments(plan) {
  const folderUri = localFileUri(plan.folderUri, "\u6587\u4EF6\u5939");
  const fileUri = localFileUri(plan.fileUri, "\u6587\u4EF6");
  if (folderUri && fileUri) throw new Error("Cannot open both a folder and a file in one instance.");
  const args = [];
  const target = folderUri ?? fileUri;
  if (target) args.push((0, import_node_url.fileURLToPath)(target));
  args.push("--user-data-dir", plan.userDataDir);
  return args;
}
async function seedInstanceSettings(userDataDir, ordinal) {
  const userDirectory = import_node_path20.default.join(userDataDir, "User");
  const settings = import_node_path20.default.join(userDirectory, "settings.json");
  try {
    await (0, import_promises7.access)(settings);
    return false;
  } catch {}
  await (0, import_promises7.mkdir)(userDirectory, {
    recursive: true,
    mode: 448
  });
  const payload = {
    "shuncode.bridge.cloudflareNamedLocalPort": DEFAULT_NAMED_LOCAL_PORT + ordinal - 1
  };
  await (0, import_promises7.writeFile)(settings, `${JSON.stringify(payload, null, 2)}
`, {
    encoding: "utf8",
    flag: "wx",
    mode: 384
  }).catch(error2 => {
    if (error2.code !== "EEXIST") throw error2;
  });
  return true;
}
function spawnDetached(executable, args, environment) {
  return new Promise((resolve, reject) => {
    let child;
    try {
      child = (0, import_node_child_process9.spawn)(executable, args, {
        detached: true,
        stdio: "ignore",
        windowsHide: true,
        env: {
          ...process.env,
          ...environment
        }
      });
    } catch (error2) {
      reject(new Error(`\u65E0\u6CD5\u542F\u52A8\u65B0\u7684 ShunCode \u5B9E\u4F8B\uFF1A${error2 instanceof Error ? error2.message : String(error2)}`));
      return;
    }
    child.on("error", error2 => reject(new Error(`\u65E0\u6CD5\u542F\u52A8\u65B0\u7684 ShunCode \u5B9E\u4F8B\uFF1A${error2.message}`)));
    child.on("spawn", () => {
      child.unref();
      resolve();
    });
  });
}
function launchInstance(plan) {
  if (plan.executable) return spawnDetached(plan.executable, buildSpawnArguments(plan), plan.environment);
  if (process.platform !== "darwin" || !plan.bundle) throw new Error("Opening a separate ShunCode instance is only supported on macOS and Windows.");
  return new Promise((resolve, reject) => {
    const child = (0, import_node_child_process9.spawn)("/usr/bin/open", buildOpenArguments(plan), {
      detached: true,
      stdio: ["ignore", "ignore", "pipe"]
    });
    let stderr = "";
    child.stderr?.setEncoding("utf8");
    child.stderr?.on("data", chunk => {
      if (stderr.length < 2e3) stderr += chunk;
    });
    child.on("error", error2 => reject(new Error(`\u65E0\u6CD5\u542F\u52A8\u65B0\u7684 ShunCode \u5B9E\u4F8B\uFF1A${error2.message}`)));
    child.on("exit", code => {
      if (code === 0) {
        child.unref();
        resolve();
        return;
      }
      const detail = stderr.trim() || `open \u9000\u51FA\u7801 ${code ?? "unknown"}`;
      reject(new Error(`\u65E0\u6CD5\u542F\u52A8\u65B0\u7684 ShunCode \u5B9E\u4F8B\uFF1A${detail}`));
    });
  });
}

// extensions/shuncode/src/workspace-hub.ts
export { import_node_child_process9, import_node_crypto15, import_node_fs12, import_promises7, import_node_path20, import_node_url, DEFAULT_NAMED_LOCAL_PORT, userDataDirectoryOf, instanceIdentity, applicationBundleOf, devExecutableOverride, applicationExecutableOf, nextUserDataDirectory, localFileUri, buildOpenArguments, buildSpawnArguments, seedInstanceSettings, spawnDetached, launchInstance };
