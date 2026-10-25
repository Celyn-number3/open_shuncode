// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
var CUSTOMIZATION_NAVIGATION_BAR_HEIGHT = 32;
var navigationId = 0;
var CustomizationNavigationToggle = class {
  constructor(container3, sidebar, labels2, onVisibilityChanged) {
    this.sidebar = sidebar;
    this.labels = labels2;
    this.onVisibilityChanged = onVisibilityChanged;
    this.expanded = false;
    this.onClick = () => {
      this.expanded = !this.expanded;
      if (!this.expanded && this.sidebar.contains(this.sidebar.ownerDocument.activeElement)) {
        this.button.focus();
      }
      this.render();
      this.onVisibilityChanged(this.expanded);
    };
    const doc = container3.ownerDocument;
    this.bar = doc.createElement("div");
    this.bar.className = "customization-navigation-bar";
    this.button = doc.createElement("button");
    this.button.type = "button";
    this.button.className = "customization-navigation-toggle";
    if (!sidebar.id) {
      sidebar.id = `customization-navigation-${++navigationId}`;
    }
    this.button.setAttribute("aria-controls", sidebar.id);
    this.button.addEventListener("click", this.onClick);
    this.bar.appendChild(this.button);
    container3.prepend(this.bar);
    this.render();
  }
  render() {
    const label3 = this.expanded ? this.labels.collapse : this.labels.expand;
    this.button.textContent = label3;
    this.button.title = label3;
    this.button.setAttribute("aria-label", label3);
    this.button.setAttribute("aria-expanded", String(this.expanded));
    this.sidebar.hidden = !this.expanded;
    this.sidebar.inert = !this.expanded;
  }
  dispose() {
    this.button.removeEventListener("click", this.onClick);
    this.bar.remove();
  }
};
export { CUSTOMIZATION_NAVIGATION_BAR_HEIGHT, navigationId, CustomizationNavigationToggle };
