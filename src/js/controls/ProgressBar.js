import CalculateProgress from "../features/CalculateProgress.js";
import WuhcControl from "./WuhcControl.js";

/**
 * `Windows.UI.Html.Controls.ProgressBar`
 *
 * Web version of ProgressBar from Windows 10
 */
export default class ProgressBar extends WuhcControl {
  constructor() {
    super();
    this.internals = this.attachInternals();
    // this.internals.states.add("Indeterminate")
    // this.internals.states.add("Determinate")
  }
  static extraObsvedAttrbs = ["value", "is-indeterminate"];
  _isIndeterminate;
  _maximum;
  _minimum;
  _value;
  get IsIndeterminate() {
    return this._isIndeterminate;
  }
  set IsIndeterminate(boolean) {
    const oldValue = this._isIndeterminate;
    this._isIndeterminate = boolean;
    this.propertyChanged("IsIndeterminate", oldValue, boolean);
  }
  get Maximum() {
    return this._maximum;
  }
  set Maximum(number) {
    const oldValue = this._maximum;
    this._maximum = boolean;
    this.propertyChanged("IsIndeterminate", oldValue, number);
  }
  get Minimum() {
    return this._minimum;
  }
  set Minimum(number) {
    const oldValue = this._minimum;
    this._minimum = number;
    this.propertyChanged("IsIndeterminate", oldValue, number);
  }
  get Value() {
    return this._value;
  }
  set Value(number) {
    const oldValue = this._value;
    this._value = number;
    this.propertyChanged("Value", oldValue, number);
  }
  UpdateIsIndeterminate() {
    if (this._isIndeterminate) {
      this.internals.states.delete("--determinate");
      this.internals.states.add("--indeterminate");
    } else {
      this.internals.states.delete("--indeterminate");
      this.internals.states.add("--determinate");
    }
  }
  UpdateMaximum() {
    if (controlLogs) {
      console.log(
        `${this.UpdateMaximum.name}: Maximum value set to ${this._maximum} on`,
        this
      );
    }
    this.ariaValueMax = `${this._maximum}`;
  }
  UpdateMinimum() {
    if (controlLogs) {
      console.log(
        `${this.UpdateMinimum.name}: Minimum value set to ${this._minimum} on`,
        this
      );
    }
    this.ariaValueMin = `${this._minimum}`;
  }
  UpdateProgress() {
    if (controlLogs) {
      console.log(
        `${this.UpdateValue.name}: Progress value set to ${this._value} in`,
        this
      );
    }
    if (this._value < this._minimum) {
      if (controlLogs) {
        console.warn(
          `${this.UpdateValue.name}: The value ${this._value} is less than the minimum ${this._minimum}. Adjusting to the minimum.`
        );
      }
      this.setAttribute("value", `${this._minimum}`);
    }
    if (this._value > this._maximum) {
      if (controlLogs) {
        console.warn(
          `${this.UpdateValue.name}: The value ${this._value} is greater than the maximum ${this._maximum}. Adjusting to the maximum.`
        );
      }
      this.setAttribute("value", `${this._maximum}`);
    }
    const percentage = CalculateProgress(
      this._value,
      this._minimum,
      this._maximum
    );
    this.style.setProperty("--value", `${percentage}%`);
    this.ariaValueNow = `${this._value}`;
  }
  UpdateValue() {
    this.UpdateProgress();
  }
  InitializeProperties() {
    this._isIndeterminate =
      this.getAttribute("isindeterminate") === "true" ? true : false;
    this._maximum = Number(this.getAttribute("maximum")) || 100;
    this._minimum = Number(this.getAttribute("minimum")) || 0;
    this._value = Number(this.getAttribute("value")) || 0;
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
