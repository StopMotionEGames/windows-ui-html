import WuhcControl from "./WuhcControl.js";

/**
 * `Windows.UI.Html.Controls.ProgressRing`
 *
 * Web version of ProgressRing from Windows 10
 */
export default class ProgressRing extends WuhcControl {
  constructor() {
    super();
    this.enabledProperties.IsActive = true;
    this.needsInternals = true
  }

  UpdateIsActive() {
    if (this._properties.IsActive) {
      this.internals.states.delete("notactived");
      this.internals.states.add("actived");
    } else {
      this.internals.states.delete("actived");
      this.internals.states.add("notactived");
    }

    this.style.visibility = this._properties.IsActive ? "visible" : "collapse";
    if (controlLogs)
      console.log(
        `${this.UpdateIsActive.name}: Visibility updates to ${this._properties.IsActive} for`,
        this
      );
  }
  InitializeControl() {
    /** @type {string} HTML of ProgressRing */
    const template = `<div id="Ring"><wuhc-canvas id="E1R"><wuhc-ellipse id="E1" /></wuhc-canvas><wuhc-canvas id="E2R"><wuhc-ellipse id="E2" /></wuhc-canvas><wuhc-canvas id="E3R"><wuhc-ellipse id="E3" /></wuhc-canvas><wuhc-canvas id="E4R"><wuhc-ellipse id="E4" /></wuhc-canvas><wuhc-canvas id="E5R"><wuhc-ellipse id="E5" /></wuhc-canvas><wuhc-canvas id="E6R"><wuhc-ellipse id="E6" /></wuhc-canvas></div>`;
    this.innerHTML = template;

    if (controlLogs)
      console.log(`${this.InitializeControl.name}: Initialized for`, this);
  }
}
