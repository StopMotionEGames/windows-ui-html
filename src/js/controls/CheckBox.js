import WuhcControl from "./WuhcControl.js";

/**
 * `Windows.UI.Html.Controls.Checkbox`
 *
 * Web version of Checkbox from Windows 10
 */
export default class Checkbox extends WuhcControl {
  constructor() {
    super();
    this.ContentPresenter = document.createElement("span");
    this.enabledProperties.IsChecked = true;
    this.enabledProperties.Content = true;
    this.needsInputElement = true;
  }

  UpdateContent() {
    this.ContentPresenter.textContent = this._properties.Content;
  }

  UpdateIsChecked() {
    if (controlLogs) {
      console.log(
        `${this.UpdateIsChecked.name}: IsChecked set to ${this._properties.IsChecked} on`,
        this
      );
    }
    this.inputElement.checked = this._properties.IsChecked;
    this.ariaChecked = this._properties.IsChecked;
  }
  InitializeControl() {
    const name = this.getAttribute("x:name");
    const label = document.createElement("label");
    const rectangle = document.createElement("wuhc-rectangle");
    const checkmark = document.createElement("wuhc-fonticon");
    this.role = "checkbox";
    checkmark.setAttribute("icon", "CheckGlyph");
    checkmark.ariaHidden = true;
    this.inputElement.name = name;
    this.inputElement.type = "checkbox";
    this.appendChild(label);
    label.appendChild(this.inputElement);
    label.appendChild(rectangle);
    label.appendChild(this.ContentPresenter);
    rectangle.appendChild(checkmark);
    this.inputElement.addEventListener(
      "input",
      () => (this.IsChecked = this.inputElement.checked)
    );
    if (controlLogs)
      console.log(
        `${this.InitializeControl.name}: Control initialized to`,
        this
      );
  }
}
