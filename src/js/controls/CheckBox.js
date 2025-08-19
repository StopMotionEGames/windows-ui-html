/**
 * `Windows.UI.Html.Controls.Checkbox`
 *
 * Web version of Checkbox from Windows 10
 */
export default class Checkbox extends HTMLElement {
  constructor() {
    super();
    /** @type {boolean} Avoid multiple initializations */
    this._initialized = false;
    this.chkbx = document.createElement("input");
    this.ContentPresenter = document.createElement("span");
  }

  /**
   * Static method that defines the observed attributes
   * @description This method returns a list of attributes that the element will observe for changes.
   * @returns {string[]} Observed attributes list
   */
  static get observedAttributes() {
    return [
      "content",
      "width",
      "height",
      "foreground",
      "ischecked",
      "isenabled",
      "background",
    ];
  }
  get Background() {
    return this.getAttribute("background");
  }

  set Background(value) {
    this.setAttribute("background", `${value}`);
  }

  get Content() {
    return (
      this.getAttribute("content") || this.ContentPresenter.textContent || null
    );
  }

  set Content(text) {
    this.setAttribute("content", `${text}`);
  }

  get Foreground() {
    return this.getAttribute("foreground");
  }

  set Foreground(string) {
    this.setAttribute("foreground", `${string}`);
  }
  get Height() {
    return this.getAttribute("height") || "auto";
  }

  set Height(number) {
    this.setAttribute("height", `${number}`);
  }
  get IsChecked() {
    if (!this._initialized) return this.getAttribute("ischecked") === "true";
    return this.chkbx.checked;
  }
  set IsChecked(boolean) {
    this.setAttribute("ischecked", `${boolean}`);
  }
  get IsEnabled() {
    return this.getAttribute("isenabled") === "true"
      ? true
      : this.getAttribute("isenabled") === "false"
      ? false
      : !this.chkbx.disabled;
  }
  set IsEnabled(boolean) {
    this.setAttribute("isenabled", boolean ? "true" : "false");
  }
  get Width() {
    return this.getAttribute("width") || "auto";
  }

  set Width(number_or_string) {
    this.setAttribute("width", `${number_or_string}`);
  }

  /** Called when the element is connected to the DOM */
  connectedCallback() {
    if (!this._initialized) {
      if (debug) console.log(`${this.className} connected:`, this);
      this.#InitializeControl();
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
        `"${name}" attribute changed from ${oldValue} to "${newValue}"`
      );
    }

    const updates = {
      background: () => this.#UpdateBackground(),
      content: () => this.#UpdateContent(),
      foreground: () => this.#UpdateForeground(),
      height: () => this.#UpdateSizes(),
      ischecked: () => this.#UpdateCheckedState(),
      isenabled: () => this.#UpdateEnabledState(),
      width: () => this.#UpdateSizes(),
    };

    if (updates[name]) updates[name]();
  }

  #UpdateBackground() {
    this.style.background = this.Background;
    if (debug) {
      console.log(
        `${this.#UpdateBackground.name}: Background color is defined as ${
          this.Background
        } in`,
        this
      );
    }
  }
  #UpdateCheckedState() {
    this.chkbx.checked = this.IsChecked;
  }
  #UpdateContent() {
    this.ContentPresenter.textContent = this.Content;
  }
  /** Updates the text color based on the `foreground` attribute */
  #UpdateForeground() {
    this.style.color = this.Foreground;
    if (debug) {
      console.log(
        `${this.#UpdateForeground.name}: Text color is defined as ${
          this.Foreground
        } in`,
        this
      );
    }
  }
  #UpdateEnabledState() {
    this.chkbx.disabled = !this.IsEnabled;
  }
  /** Updates the size of the wuhc-checkbox based on `width` and `height` */
  #UpdateSizes() {
    if (this.Width === "auto")
      this.style.width = /Firefox/.test(navigator.userAgent)
        ? "-moz-available"
        : "stretch";
    else this.style.width = `${this.Width}px`;

    if (this.Height === "auto")
      this.style.height = /Firefox/.test(navigator.userAgent)
        ? "-moz-available"
        : "stretch";
    else this.style.height = this.Height;

    this.style.height = `${this.Height}px`;
    if (debug) {
      console.log(
        `${this.#UpdateSizes.name}: Updated the width (${
          this.Width
        }px) and height (${this.Height}px) to`,
        this
      );
    }
  }
  #InitializeControl() {
    let label = document.createElement("label");
    let rectangle = document.createElement("wuhc-rectangle");
    let checkmark = document.createElement("wuhc-fonticon");
    this.role = "checkbox";
    checkmark.setAttribute("icon", "CheckGlyph");
    this.chkbx.type = "checkbox";
    this.appendChild(label);
    label.appendChild(this.chkbx);
    label.appendChild(rectangle);
    label.appendChild(this.ContentPresenter);
    rectangle.appendChild(checkmark);
    if (debug)
      console.log(
        `${this.#InitializeControl.name}: Control initialized to`,
        this
      );
  }
}
