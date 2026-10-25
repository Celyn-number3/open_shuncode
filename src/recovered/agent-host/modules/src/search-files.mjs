// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { init_define_SHUNCODE_BUILD_INFO } from "../runtime/build-info.mjs";
// src/search-files.ts
init_define_SHUNCODE_BUILD_INFO();
var DEFAULT_SEARCH_FILES_CONFIG = {
  defaultContextLines: 1,
  maxContextLines: 5,
  defaultMaxResults: 100,
  hardMaxResults: 500,
  defaultMaxMatchesPerFile: 20,
  hardMaxMatchesPerFile: 100,
  maxOutputBytes: 128 * 1024,
  maxEstimatedTokens: 3e4,
  maxLineChars: 1200,
  maxFallbackFileBytes: 2 * 1024 * 1024,
  maxFallbackFilesScanned: 2e4,
  binaryProbeBytes: 8 * 1024,
  commonExcludes: ["**/.git/**", "**/node_modules/**", "**/dist/**", "**/build/**", "**/out/**", "**/out-build/**", "**/out-vscode/**", "**/coverage/**", "**/.next/**", "**/target/**", "**/vendor/**", "**/VSCode-darwin-*/**", "**/release/**", "**/*.zip"]
};

// src/tool-input-validation.ts
export { DEFAULT_SEARCH_FILES_CONFIG };
