export default class Binding {
  static bindings = new Map();

  static #parseBindingString(bindingString) {
    const bindingPattern =
      /\{Binding\s+(\w+)(?:,\s*ElementName=(\w+))?(?:,\s*Mode=(OneWay|TwoWay))?\s*\}/i;
    const match = bindingString.match(bindingPattern);

    if (!match) {
      throw new Error(`Invalid binding string: ${bindingString}`);
    }

    return {
      targetProperty: match[1],
      elementName: match[2] || null,
      mode: match[3] || "OneWay",
    };
  }

  static create(sourceObject, bindingString, sourceProperty) {
    if (!this.bindings.has(sourceObject)) {
      this.bindings.set(sourceObject, new Map());
    }

    const { targetProperty, elementName, mode } =
      this.#parseBindingString(bindingString);

    // Store binding to quick access
    const bindingKey = `${elementName}-${targetProperty}`;
    this.bindings.get(sourceObject).set(bindingKey, {
      sourceProperty,
      targetProperty,
      elementName,
      mode,
    });

    const elementHandler = (e) => {
      if (
        e.detail.propertyName !== targetProperty ||
        e.detail.oldValue === e.detail.newValue
      )
        return;
      if (sourceProperty in sourceObject)
        sourceObject[sourceProperty] = e.detail.newValue;
      else console.warn("Unknow sourceProperty name", sourceProperty);
    };

    const sourceHandler = (e) => {
      if (e.detail.propertyName !== sourceProperty) return;
      if (targetProperty in wuhc_nodes[elementName])
        wuhc_nodes[elementName][targetProperty] = e.detail.newValue;
      else console.warn("Unknown targetPropery name", targetProperty);
    };

    // Add event listeners
    wuhc_nodes[elementName].addEventListener("propertyChanged", elementHandler);

    if (mode === "TwoWay") {
      sourceObject.addEventListener("propertyChanged", sourceHandler);

      this.bindings.get(sourceObject).get(bindingKey).handlers = {
        elementHandler,
        sourceHandler,
      };
    } else {
      this.bindings.get(sourceObject).get(bindingKey).handlers = {
        elementHandler,
      };
    }
  }

  // Method for remove a specific Binding
  static remove(sourceObject, elementName, targetProperty) {
    if (!this.bindings.has(sourceObject)) return;

    const bindingKey = `${elementName}-${targetProperty}`;
    const binding = this.bindings.get(sourceObject).get(bindingKey);

    if (!binding) return;

    // Remover listeners
    wuhc_nodes[elementName].removeEventListener(
      "propertyChanged",
      binding.handlers.elementHandler
    );

    if (binding.mode === "TwoWay") {
      sourceObject.removeEventListener(
        "propertyChanged",
        binding.handlers.sourceHandler
      );
    }

    // Remover from map
    this.bindings.get(sourceObject).delete(bindingKey);
  }
  static #processElements() {
      document.querySelectorAll("*").forEach((el) => {
      if (el.attributes.length == 0) return;
      for (let i = 0; i < el.attributes.length; i++) {
        const value = el.attributes.item(i).value;

        if (
          value.startsWith("{") &&
          value.endsWith("}") &&
          !el.outerHTML.startsWith("<wuhc-")
        ) {
          const sourceProperty = el.attributes.item(i).name;
          this.create(el, value, sourceProperty);
        }
      }
    });
  }
  static init() {
    if (timeLogs) console.time("binding started");
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        Binding.#processElements();
      });
    } else Binding.#processElements();
    if (timeLogs) console.timeEnd("binding started");
  }
}
