// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
// src/vs/workbench/contrib/chat/browser/aiCustomization/shunCodeBridgeSelectOptions.ts
function syncShunCodeBridgeSelectOptions(select, desiredOptions) {
  const unchanged2 = select.options.length === desiredOptions.length && desiredOptions.every((desired, index2) => {
    const current = select.options.item(index2);
    return current?.value === desired.value && current.text === desired.label && current.disabled === Boolean(desired.disabled);
  });
  if (unchanged2) return;
  const selectedValue = select.value;
  const reusableByValue = /* @__PURE__ */new Map();
  for (const option2 of Array.from(select.options)) if (!reusableByValue.has(option2.value)) reusableByValue.set(option2.value, option2);
  const retained = /* @__PURE__ */new Set();
  for (let index2 = 0; index2 < desiredOptions.length; index2++) {
    const desired = desiredOptions[index2];
    let option2 = reusableByValue.get(desired.value);
    if (!option2 || retained.has(option2)) {
      option2 = select.ownerDocument.createElement("option");
      option2.value = desired.value;
    }
    retained.add(option2);
    if (option2.text !== desired.label) option2.text = desired.label;
    if (option2.disabled !== Boolean(desired.disabled)) option2.disabled = Boolean(desired.disabled);
    const current = select.options.item(index2);
    if (current !== option2) select.insertBefore(option2, current);
  }
  for (const option2 of Array.from(select.options)) if (!retained.has(option2)) option2.remove();
  if (desiredOptions.some(option2 => option2.value === selectedValue)) {
    if (select.value !== selectedValue) select.value = selectedValue;
  } else {
    select.selectedIndex = desiredOptions.length ? 0 : -1;
  }
}

// src/vs/workbench/contrib/chat/browser/aiCustomization/shunCodeBridgeStatusMessage.ts
export { syncShunCodeBridgeSelectOptions };
