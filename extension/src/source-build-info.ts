/** Metadata is generated from current source inputs, never copied from an old dist directory. */
declare const __SHUNCODE_SOURCE_BUILD_INFO__: {
  version: string; sourceRevision: string; sourceHash: string; builtAt: string;
  release: boolean; sourceDirty: boolean; buildKind: string; fullSourceBuild: boolean;
};
export const sourceBuildInfo = typeof __SHUNCODE_SOURCE_BUILD_INFO__ === "undefined"
  ? { version: "development", sourceRevision: "unknown", sourceHash: "unknown", builtAt: "unknown", release: false, sourceDirty: true, buildKind: "development-source", fullSourceBuild: false }
  : __SHUNCODE_SOURCE_BUILD_INFO__;
