// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
var BridgeTaskViewState = class {
  constructor() {
    this.completed = false;
    this.expanded = true;
  }
  update(taskId, complete) {
    if (this.taskId !== taskId) {
      this.taskId = taskId;
      this.expanded = true;
      this.completed = false;
    }
    if (complete && !this.completed) {
      this.expanded = false;
    }
    this.completed = complete;
  }
};
export { BridgeTaskViewState };
