// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { init_define_SHUNCODE_BUILD_INFO } from "../../../runtime/build-info.mjs";
// extensions/shuncode/src/model-provider-identifiers.mts
init_define_SHUNCODE_BUILD_INFO();
var MODEL_ID_SEPARATOR = "::";
function encodedModelId(namespace, rawModelId) {
  return `${namespace.replaceAll(MODEL_ID_SEPARATOR, "-")}${MODEL_ID_SEPARATOR}${encodeURIComponent(rawModelId)}`;
}
function normalizeProviderModelId(modelId, vendorId) {
  let id = modelId;
  const vendorPrefix = `${vendorId}/`;
  if (id.startsWith(vendorPrefix)) {
    id = id.slice(vendorPrefix.length);
  }
  const slash = id.indexOf("/");
  if (slash > 0) {
    const rest = id.slice(slash + 1);
    if (rest.includes(MODEL_ID_SEPARATOR)) {
      id = rest;
    }
  }
  return id;
}
function deleteRuntimeModelsForNamespace(runtimeModels, namespace) {
  const prefix = encodedModelId(namespace, "");
  for (const id of [...runtimeModels.keys()]) {
    if (id.startsWith(prefix)) runtimeModels.delete(id);
  }
}

// extensions/shuncode/src/model-reasoning.mts
export { MODEL_ID_SEPARATOR, encodedModelId, normalizeProviderModelId, deleteRuntimeModelsForNamespace };
