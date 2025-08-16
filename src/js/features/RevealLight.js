export default class RevealLight {
  static #lastMousePos = { x: null, y: null };
  static #initialized = false;
  static #observers = {
    mutation: null,
    resize: null,
  };
  static #config = {};
  static #revealElements = new Set();
  static #activeElements = new Set();
  static #elementsRects = new Map();

  static init(options = {}) {
    if (this.#initialized) {
      if (debug) console.warn("RevealLight was already initialized.");
      return;
    }

    // Configurações
    const config = {
      offset: 90,
      ...options,
    };
    config.offset_squared = config.offset * config.offset;
    this.#config = config;

    // Inicializa observers
    this.#setupObservers(config);

    // Coletar elementos iniciais
    this.#collectInitialElements();

    // Atualizar rects iniciais
    this.#updateRects();

    // Eventos de janela (ADICIONADO O MOUSEMOVE GLOBAL)
    window.addEventListener("resize", () => this.#updateRects());
    window.addEventListener("scroll", this.#scrollHandler, { passive: true });
    window.addEventListener("mousemove", this.#handleMouseMove); // ESSE ERA O FALTANTE!
    window.addEventListener("mouseleave", this.#handleMouseLeave);

    this.#initialized = true;

    if (debug) {
      console.log("[RevealLight] Inicializado com sucesso", config);
    }
  }

  static #collectInitialElements() {
    // Elementos border
    document.querySelectorAll("[reveal-border=true i]").forEach((el) => {
      this.#revealElements.add(el);
      this.#observers.resize.observe(el);
    });

    // Elementos hover
    document.querySelectorAll("[reveal-hover=true i]").forEach((el) => {
      this.#setupHoverEvents(el);
    });
  }

  static #scrollHandler = () => {
    this.#updateRects();
    if (this.#lastMousePos.x !== null && this.#lastMousePos.y !== null) {
      this.#updateActiveElements(this.#lastMousePos.x, this.#lastMousePos.y);
    }
  };

  static destroy() {
    if (!this.#initialized) return;

    // Limpar observers
    this.#observers.mutation?.disconnect();
    this.#observers.resize?.disconnect();

    // Remover eventos globais (ADICIONADO REMOÇÃO DO MOUSEMOVE)
    window.removeEventListener("resize", this.#updateRects);
    window.removeEventListener("scroll", this.#scrollHandler);
    window.removeEventListener("mousemove", this.#handleMouseMove); // ADICIONADO
    window.removeEventListener("mouseleave", this.#handleMouseLeave);

    // Limpar conjuntos
    this.#revealElements.clear();
    this.#activeElements.clear();
    this.#elementsRects.clear();

    this.#initialized = false;
  }

  static #setupObservers() {
    // MutationObserver
    this.#observers.mutation = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        this.#processNodes(mutation.addedNodes);
        this.#processNodes(mutation.removedNodes);
      }
    });

    this.#observers.mutation.observe(document, {
      childList: true,
      subtree: true,
    });

    // ResizeObserver
    this.#observers.resize = new ResizeObserver(() => {
      this.#updateRects();
    });
  }

  static #processNodes(nodes) {
    for (const node of nodes) {
      if (node.nodeType !== 1) continue;

      // Processar elementos border
      if (node.matches("[reveal-border]")) {
        this.#revealElements.add(node);
        this.#observers.resize.observe(node);
      } else {
        const borderElements = node.querySelectorAll("[reveal-border]");
        for (const el of borderElements) {
          this.#revealElements.add(el);
          this.#observers.resize.observe(el);
        }
      }

      // Processar elementos hover
      if (node.matches("[reveal-hover]")) {
        this.#setupHoverEvents(node);
      } else {
        const hoverElements = node.querySelectorAll("[reveal-hover]");
        for (const el of hoverElements) {
          this.#setupHoverEvents(el);
        }
      }
    }
  }

  static #setupHoverEvents(el) {
    const handleMouseMove = (e) => {
      const { x, y } = this.#getRelativeCoordinates(e, el);

      // Atualiza posição para efeito hover interno
      el.style.setProperty("--x", `${x}px`);
      el.style.setProperty("--y", `${y}px`);
    };

    const handleMouseLeave = () => {
      // Limpa apenas propriedades do hover interno
      el.style.removeProperty("--x");
      el.style.removeProperty("--y");
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    // Armazenar referências para remoção posterior
    el._revealHandlers = { handleMouseMove, handleMouseLeave };
  }

  static #handleMouseMove = (e) => {
    const x = e.clientX;
    const y = e.clientY;

    if (x === this.#lastMousePos.x && y === this.#lastMousePos.y) return;
    this.#lastMousePos = { x, y };

    // Atualiza apenas o efeito de borda (border light)
    this.#updateActiveElements(x, y);
  };

  static #handleMouseLeave = () => {
    // Limpa apenas o efeito de borda (border light)
    for (const element of this.#activeElements) {
      element.style.removeProperty("--bx");
      element.style.removeProperty("--by");
    }
    this.#activeElements.clear();
  };

  static #updateRects() {
    this.#elementsRects.clear();
    for (const el of this.#revealElements) {
      if (document.body.contains(el)) {
        this.#elementsRects.set(el, el.getBoundingClientRect());
      } else {
        // Remover elementos que não estão mais no DOM
        this.#revealElements.delete(el);
        this.#observers.resize.unobserve(el);
      }
    }
  }

  static #updateActiveElements(x, y) {
    const newActiveSet = new Set();

    for (const element of this.#revealElements) {
      const rect = this.#elementsRects.get(element);
      if (rect && this.#isElNearMouseCircle(rect, x, y)) {
        newActiveSet.add(element);
      }
    }

    // Remover elementos que saíram da área
    for (const element of this.#activeElements) {
      if (!newActiveSet.has(element)) {
        element.style.removeProperty("--bx");
        element.style.removeProperty("--by");
      }
    }

    // Atualizar novos elementos ativos
    for (const element of newActiveSet) {
      const rect = element.getBoundingClientRect();
      element.style.setProperty("--bx", `${x - rect.left}px`);
      element.style.setProperty("--by", `${y - rect.top}px`);
    }

    this.#activeElements = newActiveSet;
  }

  static #isElNearMouseCircle(rect, mouseX, mouseY) {
    const closestX = Math.max(rect.left, Math.min(mouseX, rect.right));
    const closestY = Math.max(rect.top, Math.min(mouseY, rect.bottom));
    const dx = mouseX - closestX;
    const dy = mouseY - closestY;
    return dx * dx + dy * dy <= this.#config.offset_squared;
  }

  static #getRelativeCoordinates(event, element) {
    const rect = element.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }
}
