import WuhcValueInputControl from "./WuhcValueInputControl.js";

/**
 * `Windows.UI.Html.Controls.Slider`
 *
 * Web version of Slider from Windows 10
 */
export default class Slider extends WuhcValueInputControl {
  UpdateValue() {
    this.inputElement.value = `${this._properties.Value}`;
    this.UpdateProgress();
  }
  InitializeControl() {
    this.appendChild(this.inputElement);
    this.inputElement.value = this._value;
    this.inputElement.type = "range";
    this.inputElement.addEventListener(
      "input",
      () => (this.Value = Number(this.inputElement.value))
    );
    if (controlLogs)
      console.log(`${this.InitializeControl.name}: Initialized for`, this);
  }
}
