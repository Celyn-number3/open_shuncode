// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
// src/vs/workbench/contrib/chat/browser/aiCustomization/shunCodeBridgePaymentPresentation.ts
function isBridgePaymentApplied(status2) {
  if (status2.paymentOrder.status !== "paid" || !status2.licensed || status2.error) return false;
  if (status2.permanent) return true;
  const expected = Date.parse(status2.paymentOrder.entitlementExpiresAt);
  const actual = Date.parse(status2.expiresAt);
  return Number.isFinite(expected) && Number.isFinite(actual) && actual >= expected;
}

// src/vs/workbench/contrib/chat/browser/aiCustomization/shunCodeBridgeOpenFolder.ts
export { isBridgePaymentApplied };
