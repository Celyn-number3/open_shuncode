// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { __toESM } from "../../../runtime/helpers.mjs";
import { init_define_SHUNCODE_BUILD_INFO } from "../../../runtime/build-info.mjs";
// extensions/shuncode/src/config.ts
init_define_SHUNCODE_BUILD_INFO();
var vscode4 = __toESM(require("vscode"));
var API_KEY_SECRET = "shuncode.apiKey";
async function getShunCodeModelConfig(context) {
  const config2 = vscode4.workspace.getConfiguration("shuncode");
  return {
    baseUrl: config2.get("model.baseUrl", "https://api.openai.com/v1").trim(),
    model: config2.get("model.name", "gpt-5.4").trim(),
    apiKey: await context.secrets.get(API_KEY_SECRET)
  };
}
async function configureShunCodeModel(context) {
  const current = await getShunCodeModelConfig(context);
  const baseUrl = await vscode4.window.showInputBox({
    title: "ShunCode Model \xB7 Base URL",
    prompt: "OpenAI Chat Completions-compatible base URL.",
    value: current.baseUrl,
    ignoreFocusOut: true
  });
  if (baseUrl === void 0) return false;
  const model = await vscode4.window.showInputBox({
    title: "ShunCode Model \xB7 Model",
    prompt: "Model identifier sent to the configured endpoint.",
    value: current.model,
    ignoreFocusOut: true
  });
  if (model === void 0) return false;
  const apiKey = await vscode4.window.showInputBox({
    title: "ShunCode Model \xB7 API Key",
    prompt: "Stored in SecretStorage. Leave blank to keep the existing key; enter CLEAR to delete it.",
    password: true,
    ignoreFocusOut: true
  });
  if (apiKey === void 0) return false;
  const config2 = vscode4.workspace.getConfiguration("shuncode");
  await Promise.all([config2.update("model.baseUrl", baseUrl.trim(), vscode4.ConfigurationTarget.Global), config2.update("model.name", model.trim(), vscode4.ConfigurationTarget.Global)]);
  if (apiKey.trim().toUpperCase() === "CLEAR") {
    await context.secrets.delete(API_KEY_SECRET);
  } else if (apiKey.trim()) {
    await context.secrets.store(API_KEY_SECRET, apiKey.trim());
  }
  return true;
}
async function setShunCodeApiKey(context) {
  const value = await vscode4.window.showInputBox({
    title: "ShunCode API Key",
    password: true,
    ignoreFocusOut: true,
    prompt: "Stored securely in VS Code SecretStorage. Submit an empty value to clear it."
  });
  if (value === void 0) return;
  if (value.trim()) await context.secrets.store(API_KEY_SECRET, value.trim());else await context.secrets.delete(API_KEY_SECRET);
  await vscode4.window.showInformationMessage(value.trim() ? "ShunCode API key saved." : "ShunCode API key cleared.");
}

// extensions/shuncode/src/codex-auth.ts
export { vscode4, API_KEY_SECRET, getShunCodeModelConfig, configureShunCodeModel, setShunCodeApiKey };
