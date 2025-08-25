import WuhcInputControl from "./WuhcInputControl.js";

/**
 * `Windows.UI.Html.Controls.Checkbox`
 *
 * Web version of Checkbox from Windows 10
 */
export default class Checkbox extends WuhcInputControl {
  constructor() {
    super();
    this.ContentPresenter = document.createElement("span");
  }

  static extraObsvedAttrbs = ["content", "is-checked"];
  _isChecked;
  _content;
  get Content() {
    return this._content;
  }

  set Content(text) {
    const oldValue = this._content;
    this._content = text;
    this.propertyChanged("Content", oldValue, text);
  }

  get IsChecked() {
    return this._isChecked;
  }
  set IsChecked(boolean) {
    const oldValue = this._isChecked;
    this._isChecked = boolean;
    this.propertyChanged("IsChecked", oldValue, boolean);
  }
  UpdateContent() {
    this.ContentPresenter.textContent = this._content;
  }

  UpdateIsEnabled() {
    this.inputElement.disabled = !this._isEnabled;
  }
  InitializeProperties() {
    if (this._propertiesInitialized) return;
    this._content =
      this.getAttribute("content") || this.ContentPresenter.textContent || null;
    this._isChecked = this.getAttribute("is-checked") === "true";
  }
  UpdateIsChecked() {
    if (controlLogs) {
      console.log(
        `${this.UpdateIsChecked.name}: IsChecked set to ${this._isChecked} on`,
        this
      );
    }
    this.inputElement.checked = this._isChecked;
    this.ariaChecked = this._isChecked;
  }
  UpdateIschecked = () => this.UpdateIsChecked();
  InitializeControl() {
    const label = document.createElement("label");
    const rectangle = document.createElement("wuhc-rectangle");
    const checkmark = document.createElement("wuhc-fonticon");
    this.role = "checkbox";
    checkmark.setAttribute("icon", "CheckGlyph");
    this.inputElement.type = "checkbox";
    this.appendChild(label);
    label.appendChild(this.inputElement);
    label.appendChild(rectangle);
    label.appendChild(this.ContentPresenter);
    rectangle.appendChild(checkmark);
    this.IsChecked = this.inputElement.checked;
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
