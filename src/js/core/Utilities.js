const RESERVED_WORDS = new Set([
  "arguments",
  "await",
  "boolean",
  "break",
  "case",
  "catch",
  "char",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "enum",
  "eval",
  "export",
  "extends",
  "false",
  "final",
  "finally",
  "for",
  "function",
  "goto",
  "if",
  "import",
  "in",
  "instanceof",
  "let",
  "new",
  "null",
  "package",
  "return",
  "static",
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "typeof",
  "var",
  "void",
  "while",
  "with",
  "yield",
  "window",
  "document",
  "console",
  "globalThis",
  "undefined",
  "NaN",
  "Infinity",
  "Object",
  "Array",
  "Function",
  "constructor",
  "prototype",
  "name",
  "length",
  "toString",
]);
export default class Utilities {
  /** Validade a variable name from a string.
   *
   * ---
   * @returns {boolean} true if the name is valid
   */
  static IsValidVariableName(name) {
    // Check for invalid characters
    if (!/^[a-zA-Z_$][\w$]*$/.test(name)) return false;

    // Check for reserved words
    if (RESERVED_WORDS.has(name)) return false;

    // Check dengerous properties in prototype
    if (name in Object.prototype || name in Function.prototype) return false;

    return true;
  }
  /** Get the relative coordenates of an element referent to pointer position
   *
   * ---
   * @param {MouseEvent}event
   * @param {HTMLElement}element
   * @returns {{x:number,y:number}}
   */
  static GetRelativeCoordinates(event, element) {
    const rect = element.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }
  /** Converts a string to Pascal Case.
   *
   * ---
   * There are 3 available separtors:
   *
   * * "-" dashes
   * * "_" underlines
   * * " " white spaces
   *
   * @param {string} str
   * @returns {string}
   */
  static ToPascalCase(str) {
    return str
      .toLowerCase() // Convert entire string to lower case
      .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : "")) // Captalize the first letter after separator and remove it
      .replace(/^\w/, (char) => char.toUpperCase()); // Captalize the first letter of string
  }
  /** Converts a Pascal Case string to attribute name format.
   *
   * ---
   * Example: "IsActive" => "is-active"
   *
   * @param {string} str
   * @returns {string}
   */
  static ToAttributeName(str) {
    return str
      .replace(/([a-z])([A-Z])/g, "$1-$2") // Insert dashes between lowercase and uppercase letters
      .toLowerCase(); // Convert entire string to lower case
  }
  static CalculateProgress(value, min, max) {
    if (max - min === 0) return 0;
    return ((value - min) / (max - min)) * 100;
  }
}
