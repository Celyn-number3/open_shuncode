// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { __toESM } from "../../../runtime/helpers.mjs";
import { init_define_SHUNCODE_BUILD_INFO } from "../../../runtime/build-info.mjs";
// extensions/shuncode/src/custom-agents.ts
init_define_SHUNCODE_BUILD_INFO();
var vscode7 = __toESM(require("vscode"));
function registerShunCodeCustomAgents(context) {
  const askUri = vscode7.Uri.joinPath(context.extensionUri, "agents", "shuncode-ask.agent.md");
  const planUri = vscode7.Uri.joinPath(context.extensionUri, "agents", "shuncode-plan.agent.md");
  const codeUri = vscode7.Uri.joinPath(context.extensionUri, "agents", "shuncode-code.agent.md");
  return vscode7.chat.registerCustomAgentProvider({
    provideCustomAgents: () => [{
      uri: askUri
    }, {
      uri: planUri
    }, {
      uri: codeUri
    }]
  });
}

// extensions/shuncode/src/ide-tool-broker.ts
export { vscode7, registerShunCodeCustomAgents };
