import WuhcControl from "./WuhcControl.js";

/**
 * `Windows.UI.Html.Controls.ProgressBar`
 *
 * Web version of ProgressBar from Windows 10
 */
export default class ProgressBar extends WuhcControl {
  constructor() {
    super();
    this.enabledProperties.IsIndeterminate = true;
    this.enabledProperties.Minimum = true;
    this.enabledProperties.Maximum = true;
    this.enabledProperties.Value = true;
    this.needsInternals = true;
  }
  UpdateIsIndeterminate() {
    if (this._properties.IsIndeterminate) {
      this.internals.states.delete("determinate");
      this.internals.states.add("indeterminate");
    } else {
      this.internals.states.delete("indeterminate");
      this.internals.states.add("determinate");
    }
  }
  UpdateMaximum() {
    if (controlLogs) {
      console.log(
        `${this.UpdateMaximum.name}: Maximum value set to ${this._properties.Maximum} on`,
        this
      );
    }
    this.ariaValueMax = `${this._properties.Maximum}`;
  }
  UpdateMinimum() {
    if (controlLogs) {
      console.log(
        `${this.UpdateMinimum.name}: Minimum value set to ${this._properties.Minimum} on`,
        this
      );
    }
    this.ariaValueMin = `${this._properties.Minimum}`;
  }
  InitializeControl() {
    if (controlLogs)
      console.log(`${this.InitializeControl.name}: Initialized for`, this);
    // /** @type {string} HTML content of ProgressBar */
    const template = `<div id="IndeterminateRoot"><wuhc-border id="B5"><wuhc-ellipse id="E5"/></wuhc-border><wuhc-border id="B4"><wuhc-ellipse id="E4"/></wuhc-border><wuhc-border id="B3"><wuhc-ellipse id="E3"/></wuhc-border><wuhc-border id="B2"><wuhc-ellipse id="E2"/></wuhc-border><wuhc-border id="B1"><wuhc-ellipse id="E1"/></wuhc-border></div><wuhc-border id="DeterminateRoot"><wuhc-rectangle id="ProgressBarIndicator"></wuhc-rectangle></wuhc-border>`;
    this.innerHTML = template;
    this.role = "progressbar";
    this.ariaAtomic = "true"; // Indicates that the value of the ProgressBar is updated dynamically
    // this.#UpdateSizes();
    if (controlLogs)
      console.log(
        `${this.InitializeControl.name}: HTML embedded successfully in`,
        this
      );
  }
}
