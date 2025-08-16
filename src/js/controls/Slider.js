/**
 * `Windows.UI.Html.Controls.Slider`
 *
 * Web version of Slider from Windows 10
 */
export default class Slider extends HTMLElement {
  constructor() {
    super();
    /** @type {boolean} Avoid multiple initializations */
    this._initialized = false;
    this.slider = document.createElement("input");
  }
  /** Static method that defines the observed attributes
   * @returns {string[]} List of observed attributes */
  static get observedAttributes() {
    return [
      "foreground",
      "height",
      "isenabled",
      "maximum",
      "minimum",
      "value",
      "width",
    ];
  }
  get Background() {
    return this.getAttribute("background");
  }
  set Background(string) {
    this.setAttribute("background", string);
  }
  get Foreground() {
    return this.getAttribute("foreground");
  }
  set Foreground(string) {
    this.setAttribute("foreground", string);
  }
  get Height() {
    return this.getAttribute("height") || null;
  }
  set Height(number) {
    this.setAttribute("height", `${number}`);
  }
  get IsEnabled() {
    return this.getAttribute("isenabled") == "true"
      ? true
      : this.getAttribute("isenabled") == "false"
      ? false
      : !this.slider.disabled;
  }
  set IsEnabled(boolean) {
    this.setAttribute("isenabled", `${boolean}`);
  }
  get Minimum() {
    return Number(this.getAttribute("minimum")) || Number(this.slider.min) || 0;
  }
  set Minimum(number) {
    this.setAttribute("minimum", `${number}`);
  }
  get Maximum() {
    return (
      Number(this.getAttribute("maximum")) || Number(this.slider.max) || 100
    );
  }
  set Maximum(number) {
    this.setAttribute("maximum", `${number}`);
  }
  get Value() {
    if (this.slider.value == "") return Number(this.getAttribute("value"));
    else return Number(this.slider.value);
  }
  set Value(number) {
    this.setAttribute("value", `${number}`);
  }
  get Width() {
    return Number(this.getAttribute("width")) || null;
  }
  set Width(number) {
    this.setAttribute("width", `${number}` || null);
  }
  /** Called when the element is connected to the DOM */
  connectedCallback() {
    if (this._initialized) return;
    this.#InitalizeControl();
    this.#UpdateForeground();
    this._initialized = true;
    if (debug)
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
    if (debug) {
      console.log(
        `Attribute "${name}" changed from ${oldValue} to "${newValue}"`
      );
    }

    const updates = {
      background: () => this.#UpdateBackground(),
      foreground: () => this.#UpdateForeground(),
      height: () => this.#UpdateSizes(),
      isenabled: () => this.#UpdateEnabledState(),
      maximum: () => this.#UpdateMaximum(),
      minimum: () => this.#UpdateMinimum(),
      value: () => this.#UpdateValue(),
      width: () => this.#UpdateSizes(),
    };

    if (updates[name]) updates[name]();
  }
  #UpdateBackground() {
    this.style.backgroundColor = this.Background;
    if (debug) {
      console.log(
        `${this.#UpdateBackground.name}: Background color set to ${
          this.Background
        } on`,
        this
      );
    }
  }
  #UpdateEnabledState() {
    this.slider.disabled = !this.IsEnabled;
  }
  #UpdateForeground() {
    this.style.color = this.Foreground;
  }
  #UpdateMaximum() {
    if (debug) {
      console.log(
        `${this.#UpdateMaximum.name}: Maximum value set to ${this.Maximum} on`,
        this
      );
    }
    this.slider.max = `${this.Maximum}`;
    this.ariaValueMax = `${this.Maximum}`;
  }
  #UpdateMinimum() {
    if (debug) {
      console.log(
        `${this.#UpdateMinimum.name}: Minimum value set to ${this.Minimum} on`,
        this
      );
    }
    this.slider.min = `${this.Minimum}`;
    this.ariaValueMin = `${this.Minimum}`;
  }
  #UpdateSizes() {
    this.style.width = `${this.Width}px`;
    this.style.height = `${this.Height}px`;
    if (debug) {
      console.log(
        `${this.#UpdateSizes.name}: Updated the width (${
          this.Width
        }px) and height (${this.Height}px) for`,
        this
      );
    }
  }
  #UpdateValue() {
    if (debug) {
      console.log(
        `${this.#UpdateValue.name}: Progress value set to ${this.Value} in`,
        this
      );
    }
    if (this.Value < this.Minimum) {
      if (debug) {
        console.warn(
          `${this.#UpdateValue.name}: The value ${
            this.Value
          } is less than the minimum ${this.Minimum}. Adjusting to the minimum.`
        );
      }
      console.log("value < min!");
      this.Value = this.Minimum;
    }
    if (this.Value > this.Maximum) {
      if (debug) {
        console.warn(
          `${this.#UpdateValue.name}: The value ${
            this.Value
          } is greater than the maximum ${
            this.Maximum
          }. Adjusting to the maximum.`
        );
      }
      console.log("value > max!");
      this.Value = this.Maximum;
    }
    const percentage =
      (100 * (this.Value - this.Minimum)) / (this.Maximum - this.Minimum);
    this.style.setProperty("--value", `${percentage}%`);
    this.ariaValueNow = `${this.Value}`;
  }
  #UpdateVisibility() {
    //this function is temporarily empty
  }

  #InitalizeControl() {
    this.appendChild(this.slider);
    this.slider.value = this.Value;
    this.slider.type = "range";
    this.slider.addEventListener("input", () => this.#UpdateValue());
    if (debug)
      console.log(`${this.#InitalizeControl.name}: Initialized for`, this);
  }
}
