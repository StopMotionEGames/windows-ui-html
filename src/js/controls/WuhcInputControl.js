import WuhcControl from "./WuhcControl.js";

export default class WuhcInputControl extends WuhcControl {
  constructor() {
    super();
    this.inputElement = document.createElement("input");
  }
  static extraObsvedAttrbs = ["maximum", "minimum"];
  _value;
  _maximum;
  _minimum;

  get Maximum() {
    return this._maximum;
  }
  set Maximum(number) {
    const oldValue = this._maximum;
    this._maximum = number;
    this.propertyChanged("Maximum", oldValue, number);
  }
  get Minimum() {
    return this._minimum;
  }
  set Minimum(number) {
    const oldValue = this._minimum;
    this._minimum = number;
    this.propertyChanged("Minimum", oldValue, number);
  }
  UpdateMaximum() {
    if (controlLogs) {
      console.log(
        `${this.UpdateMaximum.name}: Maximum value set to ${this._maximum} on`,
        this
      );
    }
    this.inputElement.max = `${this._maximum}`;
    this.ariaValueMax = `${this._maximum}`;
  }
  UpdateMinimum() {
    if (controlLogs) {
      console.log(
        `${this.UpdateMinimum.name}: Minimum value set to ${this._minimum} on`,
        this
      );
    }
    this.inputElement.min = `${this._minimum}`;
    this.ariaValueMin = `${this._minimum}`;
  }
  InitializeProperties() {
    if (this._propertiesInitialized) return;
    this._maximum = Number(this.getAttribute("maximum")) || 100;
    this._minimum = Number(this.getAttribute("minimum")) || 0;
  }
}
