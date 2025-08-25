export default class PropertyChanged extends CustomEvent {
  constructor(propertyName, oldValue, newValue) {
    super("propertyChanged", {
      bubbles: false,
      detail: { oldValue, newValue, propertyName },
    });
  }
}
