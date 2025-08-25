import CalculateProgress from "../features/CalculateProgress.js";
import WuhcInputControl from "./WuhcInputControl.js";

export default class WuhcValueInputControl extends WuhcInputControl {
  static extraObsvedAttrbs = [...super.extraObsvedAttrbs, "value"];
  _value;

  get Value() {
    return this._value;
  }
  set Value(number) {
    const oldValue = this._value;
    this._value = number;
    this.propertyChanged("Value", oldValue, number);
  }
  UpdateProgress() {
    if (controlLogs) {
      console.log(
        `${this.UpdateValue.name}: Progress value set to ${this._value} in`,
        this
      );
    }
    if (this._value < this._minimum) {
      // if (debug) {
        console.warn(
          `${this.UpdateValue.name}: The value ${this._value} is less than the minimum ${this._minimum}. Adjusting to the minimum.`
        );
      // }
      // console.log("value < min!");
      this._value = this._minimum;
    }
    if (this.Value > this.Maximum) {
      // if (debug) {
        console.warn(
          `${this.UpdateValue.name}: The value ${this._value} is greater than the maximum ${this._maximum}. Adjusting to the maximum.`
        );
      // }
      // console.log("value > max!");
      this._value = this._maximum;
    }
    this.style.setProperty(
      "--value",
      `${CalculateProgress(this._value, this._minimum, this._maximum)}%`
    );
    this.ariaValueNow = `${this._value}`;
  }
  UpdateValue() {
    this.inputElement.value = `${this._value}`;
    this.UpdateProgress();
  }
  InitializeProperties() {
    if (this._propertiesInitialized) return;
    this._value = Number(this.getAttribute("value")) || 0;
    this._maximum = Number(this.getAttribute("maximum")) || 100;
    this._minimum = Number(this.getAttribute("minimum")) || 0;
  }
}
