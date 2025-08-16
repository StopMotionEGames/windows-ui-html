import { isValidVariableName } from "../core/Utilities.js";

export default class WuhcNodeRegistry {
  static #initialized = false;
  static init() {
    if (this.#initialized) {
      if (debug) console.warn("WuhcNodeRegistry was already initialized.");
      return;
    }
    globalThis.wuhc_nodes = new Object();

    // Registra os nós no DOM
    // Executa quando o DOM estiver pronto
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

      if (isValidVariableName(name)) {
        // Adiciona ao contexto global
        wuhc_nodes[name] = element;

        // Opcional: expõe como variável global (use com cautela)
        // window[name] = element;
      } else {
        console.warn(
          `[x:name inválido] '${name}' não pode ser usado como identificador`
        );
      }
    });
  }
}
