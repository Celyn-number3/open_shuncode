// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { init_define_SHUNCODE_BUILD_INFO } from "../runtime/build-info.mjs";
// src/read-files.ts
init_define_SHUNCODE_BUILD_INFO();
var DEFAULT_READ_FILES_CONFIG = {
  maxFilesPerCall: 20,
  concurrency: 8,
  maxLinesPerFile: 2e3,
  maxBytesPerFile: 64 * 1024,
  maxEstimatedTokensPerFile: 16e3,
  maxLineChars: 4e3,
  maxTotalBytesPerCall: 256 * 1024,
  maxEstimatedTokensPerCall: 5e4,
  veryLargeFileBytes: 2 * 1024 * 1024,
  binaryProbeBytes: 8 * 1024
};

// src/read-image.ts
export { DEFAULT_READ_FILES_CONFIG };
