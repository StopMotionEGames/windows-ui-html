import Button from "./js/controls/Button.js";
import Checkbox from "./js/controls/CheckBox.js";
import ProgressBar from "./js/controls/ProgressBar.js";
import ProgressRing from "./js/controls/ProgressRing.js";
import Slider from "./js/controls/Slider.js";
import TextBox from "./js/controls/TextBox.js";
import loadStyles from "./js/core/StyleLoader.js";
import Binding from "./js/features/BindingEngine.js";
import PlatformFilter from "./js/features/PlatformFilter.js";
import RevealLight from "./js/features/RevealLight.js";
import WuhcNodeRegistry from "./js/features/WuhcNodeRegistry.js";

try {
  const response = await fetch("/Wuhc.Config.json");
  const config = await response.json();

  globalThis.timeLogs = config["logs"]["time-logs"] ? true : false;

  globalThis.generalLogs = config["logs"]["general-logs"] ? true : false;

  globalThis.controlLogs = config["logs"]["control-logs"] ? true : false;

  globalThis._wuhc_settings_ = { "css-path": config["css-path"] ? config["css-path"] : "/src/css" };
} catch (e) {
  console.log("Could not load settings. Default values will be used");
  console.error(e);

  globalThis.timeLogs = false;

  globalThis.generalLogs = false;

  globalThis.controlLogs = false;

  globalThis._wuhc_settings_ = { "css-path": "/src/css" };
}
if (timeLogs) console.time("Windows.UI.Html finished loading");
globalThis.controlsInitialized = false;

(async () => {
  const styles = [
    "themes/Common",
    "themes/Colors",
    "themes/Symbols",
    "themes/RevealLight",
    "themes/ControlsVariables",
    "controls/Button",
    "controls/CalendarDatePicker",
    "controls/CalendarView",
    "controls/Checkbox",
    "controls/PasswordBox",
    "controls/ProgressBar",
    "controls/ProgressRing",
    "controls/Slider",
    "controls/TextBox",
  ];
  loadStyles(styles);
  // Initialize features
  WuhcNodeRegistry.init();
  if (timeLogs) console.time("Controls initialized in");
  customElements.define("wuhc-button", Button);
  customElements.define("wuhc-checkbox", Checkbox);
  customElements.define("wuhc-progressbar", ProgressBar);
  customElements.define("wuhc-progressring", ProgressRing);
  customElements.define("wuhc-slider", Slider);
  customElements.define("wuhc-textbox", TextBox);
  controlsInitialized = true;
  if (timeLogs) console.timeEnd("Controls initialized in");

  dispatchEvent(new Event("ControlsInitialized"));
  Binding.init();
  RevealLight.init();
  PlatformFilter.init();
  if (timeLogs) console.timeEnd("Windows.UI.Html finished loading");
})();
