import Utilities from "../core/Utilities.js";
import Binding from "../features/BindingEngine.js";
import PropertyChanged from "../features/Events/PropertyChanged.js";

export default class WuhcControl extends HTMLElement {
  constructor() {
    super();
  }
  _controlInitialized = false;
  _propertiesInitialized = false;
  _background;
  _foreground;
  _height;
  _isEnabled;
  _width;

  /** Static method that defines the observed attributes
   * @returns {string[]} List of observed attributes */
  static get observedAttributes() {
    return [
      "foreground",
      "height",
      "is-enabled",
      "width",
      ...this.extraObsvedAttrbs,
    ];
  }
  static extraObsvedAttrbs = [];
  get Background() {
    return this._background;
  }
  set Background(string) {
    const oldValue = this._background;
    this._background = string;
    this.propertyChanged("Background", oldValue, string);
  }
  get Foreground() {
    return this._foreground;
  }
  set Foreground(string) {
    const oldValue = this._foreground;
    this._foreground = string;
    this.propertyChanged("Foreground", oldValue, string);
  }
  get Height() {
    return this._height;
  }
  set Height(number) {
    const oldValue = this._height;
    this._height = number;
    this.propertyChanged("Height", oldValue, number);
  }
  get IsEnabled() {
    return this._isEnabled;
  }
  set IsEnabled(boolean) {
    const oldValue = this._isEnabled;
    this._isEnabled = boolean;
    this.propertyChanged("IsEnabled", oldValue, boolean);
  }

  get Width() {
    return this._width;
  }
  set Width(number) {
    const oldValue = this._width;
    this._width = number;
    this.propertyChanged("Width", oldValue, number);
  }
  /** Called when the element is connected to the DOM */
  connectedCallback() {
    if (this._controlInitialized) return;
    if (!this._propertiesInitialized) {
      this.#InitializeBaseProperties();
      this.InitializeProperties();
      this._propertiesInitialized = true;
    }
    this.#InitializeEventListeners();
    this.InitializeControl();
    this._controlInitialized = true;
    if (controlLogs)
      console.log(
        `${this.connectedCallback.name}: Control initialized to`,
        this
      );
  }
  /** Called when an observed attribute of the element is changed
   * @param {string} name - Name of the changed attribute
   * @param {string} oldValue - Old value of the attribute
   * @param {string} newValue - New value of the attribute */
  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue === oldValue) return;
    if (controlLogs) {
      console.log(
        `Attribute "${name}" changed from ${oldValue} to "${newValue}"`
      );
    }
    if (this._propertiesInitialized === false) {
      this.#InitializeBaseProperties();
      this.InitializeProperties();
      this._propertiesInitialized = true;
    }
    if (newValue.startsWith("{") && newValue.endsWith("}")) {
      if (controlsInitialized)
        Binding.create(this, newValue, Utilities.ToPascalCase(name));
      else
        addEventListener("ControlsInitialized", () =>
          Binding.create(this, newValue, Utilities.ToPascalCase(name))
        );
    }
    const functionName = "Update" + Utilities.ToPascalCase(name);
    if (this[functionName]) this[functionName]();
    else if (controlLogs) console.error("Unknow propery name:", name);
  }
  #InitializeEventListeners() {
    this.addEventListener("propertyChanged", (e) => {
      const propertyName =
        "Update" +
        e.detail.propertyName[0].toUpperCase() +
        e.detail.propertyName.slice(1);
      if (this[propertyName]) this[propertyName]();
      else if (controlLogs)
        console.error(
          "Unknow propery name from propertyChanged:",
          propertyName
        );
    });
  }
  UpdateBackground() {
    this.style.backgroundColor = this._background;
    if (controlLogs) {
      console.log(
        `${this.UpdateBackground.name}: Background color set to ${this._background} on`,
        this
      );
    }
  }
  UpdateIsEnabled() {
    this.slider.disabled = !this._isEnabled;
  }
  UpdateForeground() {
    this.style.color = this.Foreground;
  }
  UpdateSizes() {
    if (this._width === "auto")
      this.style.width = /Firefox/.test(navigator.userAgent)
        ? "-moz-available"
        : "stretch";
    else this.style.width = `${this._width}px`;

    if (this._height === "auto")
      this.style.height = /Firefox/.test(navigator.userAgent)
        ? "-moz-available"
        : "stretch";
    else this.style.height = `${this._height}px`;

    if (controlLogs) {
      console.log(
        `${this.UpdateSizes.name}: Updated the width (${this._width}px) and height (${this._height}px) to`,
        this
      );
    }
  }
  UpdateWidth = () => this.UpdateSizes();
  UpdateHeight = () => this.UpdateSizes();
  #InitializeBaseProperties() {
    if (this._propertiesInitialized) return;
    this._background = this.getAttribute("background") || "transparent";
    this._foreground = this.getAttribute("foreground") || "black";
    this._height = Number(this.getAttribute("height")) || null;
    this._isEnabled =
      this.getAttribute("isenabled") == "true"
        ? true
        : this.getAttribute("isenabled") == "false"
        ? false
        : true;
    this._width = Number(this.getAttribute("width")) || null;
  }
  propertyChanged(propertyName, oldValue, newValue) {
    this.dispatchEvent(new PropertyChanged(propertyName, oldValue, newValue));
  }
}
