// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
// src/vs/workbench/contrib/chat/browser/aiCustomization/shunCodeBridgePurchasePresentation.ts
function getShunCodeBridgePurchasePresentation(input) {
  const planState = input.planCount > 0 ? "available" : input.loading ? "loading" : input.plansError ? "failed" : "unavailable";
  return {
    mode: input.permanent ? "support" : input.licensed ? "renew" : "purchase",
    planState,
    canPurchase: planState === "available",
    canRetry: planState === "failed" || planState === "unavailable"
  };
}

// src/vs/workbench/contrib/chat/browser/aiCustomization/shunCodeBridgePublicUrlField.ts
export { getShunCodeBridgePurchasePresentation };
