/**
 * `Windows.UI.Html.Controls.ProgressBar`
 *
 * Web version of Checkbox from Windows 10
 */
export default class ProgressBar extends HTMLElement {
  constructor() {
    super();
    /** @type {boolean} Avoid multiple initializations */
    this._initialized = false;
  }
  /** Static method that defines the observed attributes
   * @returns {string[]} List of observed attributes */
  static get observedAttributes() {
    return [
      "width",
      "height",
      "foreground",
      "value",
      "isindeterminate",
      "maximum",
      "minimum",
    ];
  }
  get Background() {
    return (
      this.getAttribute("background") ||
      this.style.getPropertyValue("--SystemControlBackgroundBaseLowBrush") ||
      "var(--SystemControlBackgroundBaseLowBrush)" ||
      "#0003"
    );
  }
  set Background(string) {
    this.setAttribute(
      "background",
      string.toString() ||
        this.style.getPropertyValue("--SystemControlBackgroundBaseLowBrush") ||
        "var(--SystemControlBackgroundBaseLowBrush)" ||
        "#0003"
    );
  }
  get Foreground() {
    return this.getAttribute("foreground") || "var(--SystemAccentColor)";
  }
  set Foreground(string) {
    this.setAttribute(
      "foreground",
      string.toString() || "var(--SystemAccentColor)"
    );
  }
  get Height() {
    return (
      this.getAttribute("height") ||
      this.style.getPropertyValue("--ProgressBarThemeMinHeight") ||
      this.clientHeight ||
      "4"
    );
  }
  set Height(number) {
    this.setAttribute("height", `${number}`);
  }
  get IsIndeterminate() {
    return this.getAttribute("isindeterminate") === "true" ? true : false;
  }
  set IsIndeterminate(boolean) {
    this.setAttribute("isindeterminate", `${boolean}`);
  }
  get Maximum() {
    return Number(this.getAttribute("maximum")) || 100;
  }
  set Maximum(value) {
    this.setAttribute("maximum", `${value}`);
  }
  get Minimum() {
    return Number(this.getAttribute("minimum")) || 0;
  }
  set Minimum(number) {
    this.setAttribute("minimum", `${number}`);
  }
  get Value() {
    return Number(this.getAttribute("value")) || 0;
  }
  set Value(number) {
    this.setAttribute("value", `${number}`);
  }
  get Width() {
    return Number(this.getAttribute("width")) || this.clientWidth || null;
  }
  set Width(number) {
    this.setAttribute("width", `${number}` || null);
  }
  /** Called when the element is connected to the DOM */
  connectedCallback() {
    if (this._initialized) return;
    if (debug)
      console.log(
        `${this.connectedCallback.name}: Control initialized to`,
        this
      );
    this.#InitalizeControl();
    this.#UpdateForeground();
    this._initialized = true;
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
    this.ariaValueMax = `${this.Maximum}`;
  }
  #UpdateMinimum() {
    if (debug) {
      console.log(
        `${this.#UpdateMinimum.name}: Minimum value set to ${this.Minimum} on`,
        this
      );
    }
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
      this.setAttribute("value", `${this.Minimum}`);
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
      this.setAttribute("value", `${this.Maximum}`);
    }
    const percentage =
      ((this.Value - this.Minimum) / (this.Maximum - this.Minimum)) * 100;
    this.style.setProperty("--value", `${percentage}%`);
    this.ariaValueNow = `${this.Value}`;
  }
  #UpdateVisibility() {
    //this function is temporarily empty
  }

  #InitalizeControl() {
    if (debug)
      console.log(`${this.#InitalizeControl.name}: Initialized for`, this);
    // /** @type {string} HTML content of ProgressBar */
    const template = `<div id="IndeterminateRoot"><wuhc-border id="B5"><wuhc-ellipse id="E5"/></wuhc-border><wuhc-border id="B4"><wuhc-ellipse id="E4"/></wuhc-border><wuhc-border id="B3"><wuhc-ellipse id="E3"/></wuhc-border><wuhc-border id="B2"><wuhc-ellipse id="E2"/></wuhc-border><wuhc-border id="B1"><wuhc-ellipse id="E1"/></wuhc-border></div><wuhc-border id="DeterminateRoot"><wuhc-rectangle id="ProgressBarIndicator"></wuhc-rectangle></wuhc-border>`;
    // const IndeterminateRoot = document.createElement("div");
    // const DeterminateRoot = document.createElement("wuhc-border");

    // const B5 = document.createElement("wuhc-border");
    // const B4 = document.createElement("wuhc-border");
    // const B3 = document.createElement("wuhc-border");
    // const B2 = document.createElement("wuhc-border");
    // const B1 = document.createElement("wuhc-border");

    // const E5 = document.createElement("wuhc-ellipse");
    // const E4 = document.createElement("wuhc-ellipse");
    // const E3 = document.createElement("wuhc-ellipse");
    // const E2 = document.createElement("wuhc-ellipse");
    // const E1 = document.createElement("wuhc-ellipse");

    // const ProgressBarIndicator = document.createElement("wuhc-rectangle");

    // IndeterminateRoot.id = "IndeterminateRoot";
    // DeterminateRoot.id = "DeterminateRoot";

    // B5.id = "B5";
    // B4.id = "B4";
    // B3.id = "B3";
    // B2.id = "B2";
    // B1.id = "B1";

    // E5.id = "E5";
    // E4.id = "E4";
    // E3.id = "E3";
    // E2.id = "E2";
    // E1.id = "E1";

    // ProgressBarIndicator.id = "ProgressBarIndicator";

    // this.appendChild(IndeterminateRoot);

    // IndeterminateRoot.appendChild(B5);
    // IndeterminateRoot.appendChild(B4);
    // IndeterminateRoot.appendChild(B3);
    // IndeterminateRoot.appendChild(B2);
    // IndeterminateRoot.appendChild(B1);

    // B1.appendChild(E1);
    // B2.appendChild(E2);
    // B3.appendChild(E3);
    // B4.appendChild(E4);
    // B5.appendChild(E5);

    // this.appendChild(DeterminateRoot);
    // DeterminateRoot.appendChild(ProgressBarIndicator);

    this.innerHTML = template;
    this.role = "progressbar";
    this.ariaAtomic = "true"; // Indicates that the value of the ProgressBar is updated dynamically
    this.#UpdateSizes();
    if (debug)
      console.log(
        `${this.#InitalizeControl.name}: HTML embedded successfully in`,
        this
      );
  }
}
