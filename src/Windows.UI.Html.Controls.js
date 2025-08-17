import Button from "./js/controls/Button.js";
import Checkbox from "./js/controls/CheckBox.js";
import ProgressBar from "./js/controls/ProgressBar.js";
import ProgressRing from "./js/controls/ProgressRing.js";
import Slider from "./js/controls/Slider.js";
import TextBox from "./js/controls/TextBox.js";
import { loadStyles } from "./js/core/StyleLoader.js";
import PlatformFilter from "./js/features/PlatformFilter.js";
import RevealLight from "./js/features/RevealLight.js";
import WuhcNodeRegistry from "./js/features/WuhcNodeRegistry.js";

globalThis.debug = true; // if true, console logs are enabled

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

  customElements.define("wuhc-button", Button, { extends: "button" });
  customElements.define("wuhc-checkbox", Checkbox);
  customElements.define("wuhc-progressbar", ProgressBar);
  customElements.define("wuhc-progressring", ProgressRing);
  customElements.define("wuhc-slider", Slider);
  customElements.define("wuhc-textbox", TextBox);

  // Initialize features
  WuhcNodeRegistry.init();
  RevealLight.init()
  PlatformFilter.init();
})();
