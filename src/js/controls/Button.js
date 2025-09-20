import WuhcControl from "./WuhcControl.js";

/**
 * `Windows.UI.Html.Controls.Button`
 *
 * Web version of Button from Windows 10
 */
export default class Button extends WuhcControl {
  constructor() {
    super();
    this.enabledProperties.Content = true;
    this.needsInternals = true;
  }
  UpdateContent() {
    this.textContent = this._properties.Content;
  }
  #setActive(bool) {
    bool
      ? this.internals.states.add("active")
      : this.internals.states.delete("active");
  }
  /**@param {KeyboardEvent} e */
  #KeyDownHandle(e) {
    if (e.key === " " || e.key === "Enter") {
      this.#setActive(true);
      e.preventDefault();
      return;
    }
  }
  /**@param {KeyboardEvent} e */
  #KeyUpHandle(e) {
    if (e.key === " " || e.key === "Enter") {
      this.#setActive(false);
      this.click();
    }
  }
  InitializeControl() {
    this.role = "button";
    this.tabIndex = 0;
    this.addEventListener("keydown", this.#KeyDownHandle);
    this.addEventListener("keyup", this.#KeyUpHandle);
    if (controlLogs) console.log("A ProgressRing have been started", this);
  }
}
