globalThis.timeLogs =
  document.documentElement.hasAttribute("time-logs") &&
  (document.documentElement.getAttribute("time-logs") === "true" ||
    document.documentElement.getAttribute("time-logs") == "");

if (timeLogs) console.time("Windows.UI.Html finished loading");
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

globalThis.controlLogs =
  document.documentElement.hasAttribute("control-logs") &&
  (document.documentElement.getAttribute("control-logs") === "true" ||
    document.documentElement.getAttribute("control-logs") == ""); // if true, console logs are enabled
globalThis.controlsInitialized = false;
(async () => {
  // Initialize features
  WuhcNodeRegistry.init();

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
  if (timeLogs) console.time("Controls initialized in");
  customElements.define("wuhc-button", Button, { extends: "button" });
  customElements.define("wuhc-checkbox", Checkbox);
  customElements.define("wuhc-progressbar", ProgressBar);
  customElements.define("wuhc-progressring", ProgressRing);
  customElements.define("wuhc-slider", Slider);
  customElements.define("wuhc-textbox", TextBox);
  globalThis.controlsInitialized = true;
  if (timeLogs) console.timeEnd("Controls initialized in");

  dispatchEvent(new Event("ControlsInitialized"));
  Binding.init();
  RevealLight.init();
  PlatformFilter.init();
  if (timeLogs) console.timeEnd("Windows.UI.Html finished loading");
})();
