import Utilities from "../core/Utilities.js";
import Binding from "../features/BindingEngine.js";
import PropertyChanged from "../features/Events/PropertyChanged.js";

export default class WuhcControl extends HTMLElement {
  _properties = new Object();
  constructor() {
    super();
    this.enabledProperties = {
      Background: true,
      Content: false,
      Foreground: true,
      Height: true,
      IsActive: false,
      IsChecked: false,
      IsEnabled: true,
      IsIndeterminate: false,
      Maximum: false,
      Minimum: false,
      Text: false,
      Value: false,
      Width: true,
    };
    this.inputElement = document.createElement("input");
    this.internals = this.attachInternals();
    this.needsInputElement = false;
    this.needsInternals = false;
  }
  _controlInitialized = false;
  _propertiesInitialized = false;
  DefineProperty(name) {
    Object.defineProperty(this, name, {
      get: () => {
        return this._properties[name];
      },
      set: (value) => {
        const oldValue = this._properties[name];
        if (oldValue !== value) {
          this._properties[name] = value;
          this.propertyChanged(name, oldValue, value);
        }
      },
      configurable: true,
      enumerable: true,
    });
  }
  /** Static method that defines the observed attributes
   * @returns {string[]} List of observed attributes */
  static get observedAttributes() {
    return [
      "background",
      "content",
      "foreground",
      "height",
      "is-active",
      "is-checked",
      "is-enabled",
      "is-indeterminate",
      "text",
      "value",
      "width",
    ];
  }
  /** Called when the element is connected to the DOM */
  connectedCallback() {
    if (this._controlInitialized) return;
    if (!this._propertiesInitialized) this.#InitializeProperties();
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
    if (this._propertiesInitialized === false) this.#InitializeProperties();

    if (newValue.startsWith("{") && newValue.endsWith("}"))
      Binding.create(this, newValue, Utilities.ToPascalCase(name));

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
    this.style.backgroundColor = this._properties.Background;
    if (controlLogs) {
      console.log(
        `${this.UpdateBackground.name}: Background color set to ${this._properties.Background} on`,
        this
      );
    }
  }
  UpdateIsEnabled() {
    if (this.inputElement)
      this.inputElement.disabled = !this._properties.IsEnabled;
    if (this.internals)
      this._properties.IsEnabled
        ? (this.internals.states.delete("disabled"), (this.inert = false))
        : (this.internals.states.add("disabled"), (this.inert = true));
  }
  UpdateForeground() {
    this.style.color = this.Foreground;
  }
  UpdateSizes() {
    if (this._properties.Width === "auto")
      this.style.width = /Firefox/.test(navigator.userAgent)
        ? "-moz-available"
        : "stretch";
    else this.style.width = `${this._properties.Width}px`;

    if (this._properties.Height === "auto")
      this.style.height = /Firefox/.test(navigator.userAgent)
        ? "-moz-available"
        : "stretch";
    else this.style.height = `${this._properties.Height}px`;

    if (controlLogs) {
      console.log(
        `${this.UpdateSizes.name}: Updated the width (${this._properties.Width}px) and height (${this._properties.Height}px) to`,
        this
      );
    }
  }
  UpdateProgress() {
    if (controlLogs) {
      console.log(
        `${this.UpdateValue.name}: Progress value set to ${this._properties.Value} in`,
        this
      );
    }
    if (this._properties.Value < this._properties.Minimum) {
      if (controlLogs) {
        console.warn(
          `${this.UpdateValue.name}: The value ${this._properties.Value} is less than the minimum ${this._properties.Minimum}. Adjusting to the minimum.`
        );
      }
      this._properties.Value = this._properties.Minimum;
    }
    if (this._properties.Value > this._properties.Maximum) {
      if (controlLogs) {
        console.warn(
          `${this.UpdateValue.name}: The value ${this._properties.Value} is greater than the maximum ${this._properties.Maximum}. Adjusting to the maximum.`
        );
      }
      this._properties.Value = this._properties.Maximum;
    }
    this.style.setProperty(
      "--value",
      `${Utilities.CalculateProgress(
        this._properties.Value,
        this._properties.Minimum,
        this._properties.Maximum
      )}%`
    );
    this.ariaValueNow = `${this._properties.Value}`;
  }
  UpdateText() {
    this.inputElement.value = this._properties.Text;
  }
  UpdateValue() {
    this.UpdateProgress();
  }
  UpdateWidth = () => this.UpdateSizes();
  UpdateHeight = () => this.UpdateSizes();

  #InitializeProperties() {
    if (this._propertiesInitialized) return;
    let excs = 0;
    let names = [];
    for (let name in this.enabledProperties) {
      if (this.enabledProperties[name]) {
        this.DefineProperty(name);
        names[excs++] = name;
      }
    }
    for (let name of names)
      switch (name) {
        case "Background": {
          const newValue = this.getAttribute("background");
          this._properties.Background = newValue;
          this.propertyChanged(name, undefined, newValue);
          break;
        }
        case "Content": {
          const newValue = this.getAttribute("content");
          this._properties.Content = newValue;
          this.propertyChanged(name, undefined, newValue);
          break;
        }
        case "Foreground": {
          const newValue = this.getAttribute("foreground");
          this._properties.Foreground = newValue;
          this.propertyChanged(name, undefined, newValue);
          break;
        }
        case "Height": {
          const newValue = Number(this.getAttribute("height")) || null;
          this._properties.Height = newValue;
          this.propertyChanged(name, undefined, newValue);
          break;
        }
        case "IsActive": {
          const newValue =
            this.getAttribute("is-active") == "true"
              ? true
              : this.getAttribute("is-active") == "false"
              ? false
              : true;
          this._properties.IsActive = newValue;
          this.propertyChanged(name, undefined, newValue);
          break;
        }
        case "IsChecked": {
          const newValue =
            this.getAttribute("is-checked") == "true"
              ? true
              : this.getAttribute("is-checked") == "false"
              ? false
              : true;
          this._properties.IsChecked = newValue;
          this.propertyChanged(name, undefined, newValue);
          break;
        }
        case "IsEnabled": {
          const newValue =
            this.getAttribute("is-enabled") == "true"
              ? true
              : this.getAttribute("is-enabled") == "false"
              ? false
              : true;
          this._properties.IsEnabled = newValue;
          this.propertyChanged(name, undefined, newValue);
          break;
        }
        case "IsIndeterminate": {
          const newValue =
            this.getAttribute("is-indeterminate") == "true"
              ? true
              : this.getAttribute("is-indeterminate") == "false"
              ? false
              : true;
          this._properties.IsIndeterminate = newValue;
          this.propertyChanged(name, undefined, newValue);
          break;
        }
        case "Maximum": {
          const newValue = Number(this.getAttribute("maximum")) || 100;
          this._properties.Maximum = newValue;
          this.propertyChanged(name, undefined, newValue);
          break;
        }
        case "Minimum": {
          const newValue = Number(this.getAttribute("minimum")) || 0;
          this._properties.Minimum = newValue;
          this.propertyChanged(name, undefined, newValue);
          break;
        }
        case "Text": {
          const newValue = this.getAttribute("text");
          this._properties.Text = newValue;
          this.propertyChanged(name, undefined, newValue);
          break;
        }
        case "Value": {
          const newValue = Number(this.getAttribute("value"));
          this._properties.Value = newValue;
          this.propertyChanged(name, undefined, newValue);
          break;
        }
        case "Width": {
          const newValue =
            this.getAttribute("width") === "auto"
              ? "auto"
              : Number(this.getAttribute("width")) || null;
          this._properties.Width = newValue;
          this.propertyChanged(name, undefined, newValue);
          break;
        }
      }
    if (!this.needsInputElement) {
      delete this.inputElement;
      delete this.needsInputElement;
    }
    if (!this.needsInternals) {
      delete this.needsInternals;
      delete this.internals;
    }
    delete this.enabledProperties;
    this._propertiesInitialized = true;
  }
  propertyChanged(propertyName, oldValue, newValue) {
    if (!controlsInitialized)
      addEventListener("ControlsInitialized", () =>
        this.dispatchEvent(
          new PropertyChanged(propertyName, oldValue, newValue)
        )
      );
    else
      this.dispatchEvent(new PropertyChanged(propertyName, oldValue, newValue));
  }
}
