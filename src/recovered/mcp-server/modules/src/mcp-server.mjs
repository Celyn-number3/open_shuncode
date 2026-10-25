// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { __export, __shuncodeImportMetaUrl, __toCommonJS, __toESM } from "../runtime/helpers.mjs";
import { external_exports } from "../vendor/zod/v4/classic/external.mjs";
import { McpServer } from "../vendor/@modelcontextprotocol/server/dist/mcp-DXXb3Vv3.mjs";
import { fromJsonSchema2 } from "../vendor/@modelcontextprotocol/server/dist/index.mjs";
import { StdioServerTransport } from "../vendor/@modelcontextprotocol/server/dist/stdio.mjs";
import { FILE_TOOL_DEFINITIONS, invokeFileTool } from "./file-tool-registry.mjs";
import { SHUNCODE_BEHAVIOR_VERSION } from "./version.mjs";
import { DEFAULT_MCP_CONCURRENCY, mcpConcurrencyLimiter, parallelLimit } from "./concurrency.mjs";
import { NEGOTIABLE_LATEST_PROTOCOL_VERSION, PROTOCOL_TRANSPORT_MODE, classifyProtocolEra } from "./mcp-protocol.mjs";
// src/mcp-server.ts
var mcp_server_exports = {};
__export(mcp_server_exports, {
  BATCH_TOOLS_TOOL: () => BATCH_TOOLS_TOOL,
  createFileToolsServer: () => createFileToolsServer
});
var import_node_path6 = __toESM(require("node:path"), 1);
var import_node_url = require("node:url");

// node_modules/@modelcontextprotocol/server/dist/chunk-Br0eD_fh.mjs

// src/mcp-server.ts
function getWorkspaceRoots() {
  const configured = process.env.MCP_WORKSPACE_ROOTS?.trim();
  if (!configured) return [process.cwd()];
  return configured.split(import_node_path6.default.delimiter).map(root => root.trim()).filter(Boolean);
}
var BATCH_TOOLS_TOOL = {
  name: "batch_file_tools",
  title: "Batch File Tools",
  description: ["Execute multiple ShunCode file tools in parallel with concurrency control.", "Each entry is {name, arguments}. Supports read_files, find_files, search_files, apply_patch, etc.", "Results preserve input order and include per-tool success/error.", "Use this to read many files or run searches concurrently, reducing round-trips.", "Concurrency is limited to 16 by default (maximum 16).", "Account login and chat history are preserved across workspace switches via machine-wide workspace-hub (macOS) / globalStorage (Linux/Windows)."].join(" "),
  inputSchema: {
    type: "object",
    properties: {
      calls: {
        type: "array",
        minItems: 1,
        maxItems: 20,
        description: "Array of tool calls to execute in parallel",
        items: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Tool name, e.g. read_files"
            },
            arguments: {
              type: "object",
              description: "Tool arguments"
            }
          },
          required: ["name", "arguments"],
          additionalProperties: false
        }
      },
      concurrency: {
        type: "integer",
        minimum: 1,
        maximum: DEFAULT_MCP_CONCURRENCY,
        description: "Max parallel executions (default 16, max 16)"
      }
    },
    required: ["calls"],
    additionalProperties: false
  },
  outputSchema: {
    type: "object",
    properties: {
      results: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: {
              type: "string"
            },
            success: {
              type: "boolean"
            },
            result: {
              type: "object",
              additionalProperties: true
            },
            error: {
              type: "string"
            }
          },
          required: ["name", "success"],
          additionalProperties: true
        }
      },
      summary: {
        type: "string"
      },
      concurrency: {
        type: "integer"
      }
    },
    required: ["results", "summary"],
    additionalProperties: true
  },
  annotations: {
    title: "Batch File Tools",
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: false
  }
};
function createFileToolsServer(dependencies = {}) {
  const server = new McpServer({
    name: "shuncode-file-tools",
    version: SHUNCODE_BEHAVIOR_VERSION,
    title: `ShunCode File Tools (MCP ${NEGOTIABLE_LATEST_PROTOCOL_VERSION}, ${PROTOCOL_TRANSPORT_MODE})`
  }, {
    capabilities: {
      tools: {}
    },
    cacheHints: {
      "tools/list": {
        ttlMs: 6e4,
        cacheScope: "public"
      },
      "server/discover": {
        ttlMs: 3e5,
        cacheScope: "public"
      }
    }
  });
  const resolveInvokeTool = () => dependencies.invokeTool ?? invokeFileTool;
  const resolveWorkspaceRoots = () => dependencies.getWorkspaceRoots ?? getWorkspaceRoots;
  const resolveSignal = ctx => ctx?.mcpReq?.signal ?? ctx?.signal;
  const resolveProtocolEra = ctx => classifyProtocolEra(ctx?.mcpReq?.protocolVersion ?? ctx?.protocolVersion ?? ctx?.session?.protocolVersion ?? ctx?.transport?.protocolVersion);
  const isAbort = error51 => error51?.name === "AbortError" || error51?.message === "Aborted";
  const toMessage = (error51, fallback) => error51 instanceof Error ? error51.message : fallback;
  const createSingleToolHandler = (targetName, label = targetName) => async (args, ctx) => {
    const requestSignal = resolveSignal(ctx);
    try {
      const result = await mcpConcurrencyLimiter.run(() => resolveInvokeTool()(targetName, args, {
        workspaceRoots: resolveWorkspaceRoots(),
        signal: requestSignal
      }), requestSignal);
      return {
        isError: result.isError || void 0,
        content: result.content ?? [{
          type: "text",
          text: result.text
        }],
        structuredContent: result.structuredContent
      };
    } catch (error51) {
      const text = isAbort(error51) ? "Tool execution aborted (concurrency limiter)" : toMessage(error51, `${label} failed`);
      return {
        isError: true,
        content: [{
          type: "text",
          text
        }]
      };
    }
  };
  const registerToolWithSchema = (registeredName, definition, handler) => {
    server.registerTool(registeredName, {
      title: definition.title ?? registeredName,
      description: definition.description,
      // The four casts below are the SDK boundary, not laziness: registerTool
      // is generic over a Zod shape it infers from `inputSchema`, while these
      // tools carry hand-written JSON Schema validated inside the registry.
      // Passing a passthrough object keeps the SDK from re-validating, and the
      // handler is typed against our own ToolContext rather than the inferred
      // generic. Narrowing these would mean re-deriving Zod types for all 14
      // tools with no runtime gain.
      inputSchema: external_exports.object({}).passthrough(),
      outputSchema: fromJsonSchema2(definition.outputSchema),
      annotations: definition.annotations
    }, handler);
  };
  const allTools = [...FILE_TOOL_DEFINITIONS, BATCH_TOOLS_TOOL];
  for (const tool of allTools) {
    if (tool.name === BATCH_TOOLS_TOOL.name) {
      registerToolWithSchema(tool.name, tool, async (args, ctx) => {
        const batchSignal = resolveSignal(ctx);
        const calls = args?.calls;
        const requested = Number(args?.concurrency ?? DEFAULT_MCP_CONCURRENCY);
        const concurrency = Number.isFinite(requested) ? Math.min(DEFAULT_MCP_CONCURRENCY, Math.max(1, Math.trunc(requested))) : DEFAULT_MCP_CONCURRENCY;
        if (!Array.isArray(calls) || calls.length === 0) {
          return {
            isError: true,
            content: [{
              type: "text",
              text: "calls must be a non-empty array"
            }]
          };
        }
        try {
          const results = await parallelLimit(calls, async call => {
            try {
              const result = await resolveInvokeTool()(call.name, call.arguments, {
                workspaceRoots: resolveWorkspaceRoots(),
                signal: batchSignal
              });
              return {
                name: call.name,
                success: !result.isError,
                result
              };
            } catch (error51) {
              return {
                name: call.name,
                success: false,
                error: toMessage(error51, String(error51))
              };
            }
          }, {
            concurrency,
            signal: batchSignal
          });
          const succeeded = results.filter(r => r.success).length;
          const summary = `Batch: ${succeeded}/${results.length} succeeded (concurrency=${concurrency}, active=${mcpConcurrencyLimiter.active}, protocol=${resolveProtocolEra(ctx)})`;
          const images = [];
          const metadataResults = results.map((entry, index) => {
            if (!entry.result?.content?.some(block => block.type === "image")) return entry;
            if (entry.success) {
              images.push({
                type: "text",
                text: `Image from batch call ${index + 1} (${entry.name}):`
              });
              images.push(...entry.result.content.filter(block => block.type === "image"));
            }
            return {
              ...entry,
              result: {
                ...entry.result,
                content: entry.result.content.filter(block => block.type === "text")
              }
            };
          });
          const textResults = metadataResults.map(entry => {
            if (entry.name !== "read_image" || !entry.result) return entry;
            const {
              base64: _base642,
              data_uri: _dataUri,
              ...metadata
            } = entry.result.structuredContent;
            return {
              ...entry,
              result: {
                ...entry.result,
                structuredContent: metadata
              }
            };
          });
          return {
            content: [{
              type: "text",
              text: `${summary}
${JSON.stringify(textResults, null, 2)}`
            }, ...images],
            structuredContent: {
              results: metadataResults,
              summary,
              concurrency
            }
          };
        } catch (error51) {
          return {
            isError: true,
            content: [{
              type: "text",
              text: toMessage(error51, "batch failed")
            }]
          };
        }
      });
    } else {
      registerToolWithSchema(tool.name, tool, createSingleToolHandler(tool.name));
    }
  }
  const readFilesTool = allTools.find(t => t.name === "read_files");
  if (readFilesTool) {
    registerToolWithSchema("read_file", {
      ...readFilesTool,
      title: readFilesTool.title ?? "Read Files"
    }, createSingleToolHandler("read_files", "read_file"));
  }
  return server;
}
async function main() {
  const server = createFileToolsServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
if (process.argv[1] && import_node_path6.default.resolve(process.argv[1]) === (0, import_node_url.fileURLToPath)(__shuncodeImportMetaUrl)) {
  void main().catch(error51 => {
    console.error(error51);
    process.exitCode = 1;
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BATCH_TOOLS_TOOL,
  createFileToolsServer
});
/*! Bundled license information:

@modelcontextprotocol/server/dist/src-CX2iR2pK.mjs:
  (*!
  * content-type
  * Copyright(c) 2015 Douglas Christopher Wilson
  * MIT Licensed
  *)
*/
//# sourceMappingURL=mcp-server.js.map
export { mcp_server_exports, import_node_path6, import_node_url, getWorkspaceRoots, BATCH_TOOLS_TOOL, createFileToolsServer, main };
