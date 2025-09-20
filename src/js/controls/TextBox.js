import WuhcControl from "./WuhcControl.js";

/**
 * `Windows.UI.Html.Controls.TextBox`
 *
 * Web version of TextBox from Windows 10
 */
export default class TextBox extends WuhcControl {
  constructor() {
    super();
    this.needsInputElement = true;
    this.enabledProperties.Text = true;
    this.header = document.createElement("wuhc-textblock");
    this.description = document.createElement("wuhc-textblock");

  }

  InitializeControl() {
    this.inputElement.type = "text";
    this.appendChild(this.inputElement);
    if (controlLogs)
      console.log(
        `${this.InitializeControl.name}: Control initialized to`,
        this
      );
  }
}
