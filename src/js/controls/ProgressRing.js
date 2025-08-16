/**
 * `Windows.UI.Html.Controls.ProgressRing`
 *
 * Web version of ProgressRing from Windows 10
 */
export default class ProgressRing extends HTMLElement {
  constructor() {
    super();
    /** @type {boolean} Avoid multiple initializations */
    this._initialized = false;
  }

  /**
   * Static method that defines the observed attributes
   * @description This method returns a list of attributes that the element will observe for changes.
   * @returns {string[]} List of observed attributes
   */
  static get observedAttributes() {
    return ["background", "foreground", "height", "isactive", "width"];
  }
  get Background() {
    return this.getAttribute("background") || null;
  }
  set Background(string) {
    this.setAttribute("background", string);
  }
  get Width() {
    return (
      Number(this.getAttribute("width")) ||
      this.Height ||
      this.clientWidth ||
      20
    );
  }

  set Width(number) {
    this.setAttribute("width", `${number}`);
  }

  get Height() {
    return (
      Number(this.getAttribute("height")) ||
      this.Width ||
      this.clientHeight ||
      20
    );
  }

  set Height(number) {
    this.setAttribute("height", `${number}`);
  }

  get Foreground() {
    return this.getAttribute("foreground");
  }

  set Foreground(string) {
    this.setAttribute("foreground", string);
  }

  get IsActive() {
    return this.getAttribute("isactive") === "true";
  }

  set IsActive(bool) {
    this.setAttribute("isactive", bool ? "true" : "false");
  }
  /** Called when the element is connected to the DOM */
  connectedCallback() {
    if (!this._initialized) {
      if (debug) console.log(`${this.className} connected:`, this);
      this.#Initialize();
      this._initialized = true;
    }
  }

  /** Called when an observed attribute of the element is changed
   * @param {string} name Name of the changed attribute
   * @param {string} oldValue Previous value of the attribute
   * @param {string} newValue New value of the attribute */
  attributeChangedCallback(name, oldValue, newValue) {
    if (debug) {
      console.log(
        `Attribute "${name}" changed from ${oldValue} to "${newValue}"`
      );
    }

    const updates = {
      background: () => this.#UpdateBackground(),
      foreground: () => this.#UpdateForeground(),
      width: () => this.#UpdateSizes(),
      height: () => this.#UpdateSizes(),
      isactive: () => this.#UpdateVisibility(),
    };

    if (updates[name]) updates[name]();
  }
  #UpdateBackground() {
    if (this.Background) this.style.backgroundColor = this.Background;
  }
  /** Updates the foreground color of the ProgressRing based on the `foreground` attribute */
  #UpdateForeground() {
    this.style.color = this.Foreground;
    if (debug) {
      console.log(
        `${this.#UpdateForeground.name}: Foreground color set to ${
          this.Foreground
        } for`,
        this
      );
    }
  }

  /** Updates the size of the ProgressRing based on the `width` and `height` attributes */
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

  #UpdateVisibility() {
    this.style.visibility = this.IsActive ? "visible" : "collapse";
    if (debug)
      console.log(
        `${this.#UpdateVisibility.name}: Visibility updates to ${
          this.IsActive
        } for`,
        this
      );
  }
  /** Adds the HTML template to `<wuhc-progressring>` and updates its attributes */
  #Initialize() {
    if (debug) console.log(`${this.#Initialize.name}: Initialized for`, this);

    /** @type {string} HTML of ProgressRing */
    const template = `<div id="Ring"><wuhc-canvas id="E1R"><wuhc-ellipse id="E1" /></wuhc-canvas><wuhc-canvas id="E2R"><wuhc-ellipse id="E2" /></wuhc-canvas><wuhc-canvas id="E3R"><wuhc-ellipse id="E3" /></wuhc-canvas><wuhc-canvas id="E4R"><wuhc-ellipse id="E4" /></wuhc-canvas><wuhc-canvas id="E5R"><wuhc-ellipse id="E5" /></wuhc-canvas><wuhc-canvas id="E6R"><wuhc-ellipse id="E6" /></wuhc-canvas></div>`;
    this.innerHTML = template;

    if (debug) {
      console.log(
        `${this.#Initialize.name}: HTML template added successfully to`,
        this
      );
    }
  }
}
