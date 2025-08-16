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

    // Setup default configuration
    const config = {
      offset: 90,
      ...options,
    };
    config.offset_squared = config.offset * config.offset;
    this.#config = config;

    // Inicializa observers
    this.#setupObservers(config);

    // Collect initial elements
    this.#collectInitialElements();

    // Update initial rectangles
    this.#updateRects();

    // Window events
    window.addEventListener("resize", () => this.#updateRects());
    window.addEventListener("scroll", this.#scrollHandler, { passive: true });
    window.addEventListener("mousemove", this.#handleMouseMove);
    window.addEventListener("mouseleave", this.#handleMouseLeave);

    this.#initialized = true;

    if (debug) {
      console.log("[RevealLight] Successfuly initialized", config);
    }
  }

  static #collectInitialElements() {
    // Reveal border elements
    document.querySelectorAll("[reveal-border=true i]").forEach((el) => {
      this.#revealElements.add(el);
      this.#observers.resize.observe(el);
    });

    // Reveal hover elements
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

    // Clear observers
    this.#observers.mutation?.disconnect();
    this.#observers.resize?.disconnect();

    // Remove event listeners
    window.removeEventListener("resize", this.#updateRects);
    window.removeEventListener("scroll", this.#scrollHandler);
    window.removeEventListener("mousemove", this.#handleMouseMove);
    window.removeEventListener("mouseleave", this.#handleMouseLeave);

    // Clear all sets and maps
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

      // Proccess elements with reveal-border
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

      // Process elements with reveal-hover
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

  /** Sets up hover events for an element
   *
   * ---
   * This method adds mousemove and mouseleave event listeners to an element.
   */
  static #setupHoverEvents(el) {
    const handleMouseMove = (e) => {
      const { x, y } = this.#getRelativeCoordinates(e, el);

      // Update custom properties for hover effect
      el.style.setProperty("--x", `${x}px`);
      el.style.setProperty("--y", `${y}px`);
    };

    const handleMouseLeave = () => {
      // Clear custom properties when mouse leaves
      el.style.removeProperty("--x");
      el.style.removeProperty("--y");
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    // Update reference for cleanup
    el._revealHandlers = { handleMouseMove, handleMouseLeave };
  }

  /** Handles mouse move event to update active elements
   *
   * ---
   * This method calculates the mouse position and updates the active elements
   * based on the current mouse position relative to the elements with `reveal-border`.
   */
  static #handleMouseMove = (e) => {
    const x = e.clientX;
    const y = e.clientY;

    if (x === this.#lastMousePos.x && y === this.#lastMousePos.y) return;
    this.#lastMousePos = { x, y };

    // Update active elements based on mouse position
    this.#updateActiveElements(x, y);
  };

  /** Handles mouse leave event to clear the border effects
   *
   * ---
   * This method clears the custom properties for all active elements when the mouse leaves the window. */
  static #handleMouseLeave = () => {
    // Clear the border effects when mouse leaves the window
    for (const element of this.#activeElements) {
      element.style.removeProperty("--bx");
      element.style.removeProperty("--by");
    }
    this.#activeElements.clear();
  };

  /** Updates the rectangles of all reveal elements
   *
   * ---
   * This method recalculates the bounding rectangles of all elements that have the `reveal-border` attribute.
   * It is called on window resize and scroll events to ensure the rectangles are up-to-date */
  static #updateRects() {
    this.#elementsRects.clear();
    for (const el of this.#revealElements) {
      if (document.body.contains(el)) {
        this.#elementsRects.set(el, el.getBoundingClientRect());
      } else {
        // Remove from sets if not in the document
        this.#revealElements.delete(el);
        this.#observers.resize.unobserve(el);
      }
    }
  }
  /** Updates the active elements based on the current mouse position */
  static #updateActiveElements(x, y) {
    const newActiveSet = new Set();

    for (const element of this.#revealElements) {
      const rect = this.#elementsRects.get(element);
      if (rect && this.#isElNearMouseCircle(rect, x, y)) {
        newActiveSet.add(element);
      }
    }

    // Remove elements that are no longer in the circle radius
    for (const element of this.#activeElements) {
      if (!newActiveSet.has(element)) {
        element.style.removeProperty("--bx");
        element.style.removeProperty("--by");
      }
    }

    // Update new active elements
    for (const element of newActiveSet) {
      const rect = element.getBoundingClientRect();
      element.style.setProperty("--bx", `${x - rect.left}px`);
      element.style.setProperty("--by", `${y - rect.top}px`);
    }

    this.#activeElements = newActiveSet;
  }
  /** Checks if the element is near the mouse circle based on the offset
   *
   * ---
   * @param {DOMRect} rect - The bounding rectangle of the element
   * @param {number} mouseX - The X coordinate of the mouse
   * @param {number} mouseY - The Y coordinate of the mouse
   * @returns {boolean} True if the element is near the mouse circle, false otherwise
   * @description This method calculates the closest point on the element's rectangle to the mouse position
   */
  static #isElNearMouseCircle(rect, mouseX, mouseY) {
    const closestX = Math.max(rect.left, Math.min(mouseX, rect.right));
    const closestY = Math.max(rect.top, Math.min(mouseY, rect.bottom));
    const dx = mouseX - closestX;
    const dy = mouseY - closestY;
    return dx * dx + dy * dy <= this.#config.offset_squared;
  }
  /** Gets the relative coordinates of the mouse event within the element
   *
   * ---
   * @param {MouseEvent} event - The mouse event
   * @param {HTMLElement} element - The element to get the coordinates relative to
   * @returns {{x: number, y: number}} The relative coordinates */
  static #getRelativeCoordinates(event, element) {
    const rect = element.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }
}
