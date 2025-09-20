import WuhcControl from "./WuhcControl.js";

export default class WuhcValueInputControl extends WuhcControl {
  constructor() {
    super();
    this.enabledProperties.Value = true;
    this.enabledProperties.Maximum = true;
    this.enabledProperties.Minimum = true;
    this.needsInputElement = true;
  }
  UpdateValue() {
    this.inputElement.value = `${this._properties.Value}`;
  }

  UpdateMaximum() {
    if (controlLogs) {
      console.log(
        `${this.UpdateMaximum.name}: Maximum value set to ${this._properties.Maximum} on`,
        this
      );
    }
    this.inputElement.max = `${this._properties.Maximum}`;
    this.ariaValueMax = `${this._properties.Maximum}`;
  }
  UpdateMinimum() {
    if (controlLogs) {
      console.log(
        `${this.UpdateMinimum.name}: Minimum value set to ${this._properties.Minimum} on`,
        this
      );
    }
    this.inputElement.min = `${this._properties.Minimum}`;
    this.ariaValueMin = `${this._properties.Minimum}`;
  }
}
