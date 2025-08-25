import Utilities from "../core/Utilities.js";

globalThis.wuhc_nodes = new Object();
export default class WuhcNodeRegistry {
  static #initialized = false;
  static init() {
    if (this.#initialized) {
      if (generalLogs)
        console.warn("WuhcNodeRegistry was already initialized.");
      return;
    }

    if (document.readyState === "loading")
      document.addEventListener(
        "DOMContentLoaded",
        WuhcNodeRegistry.#registerNodes
      );
    else WuhcNodeRegistry.#registerNodes();
    this.#initialized = true;
  }
  static #registerNodes() {
    const elements = document.querySelectorAll("[x\\:name]");

    elements.forEach((element) => {
      const name = element.getAttribute("x:name");

      if (!name) return;

      if (Utilities.IsValidVariableName(name)) {
        // Adiciona ao contexto global
        wuhc_nodes[name] = element;
      } else {
        console.warn(
          `[x:name inválido] '${name}' não pode ser usado como identificador`
        );
      }
    });
  }
}
