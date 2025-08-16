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
// Função para validar nomes de variáveis
export const isValidVariableName = (name) => {
  // Verifica caracteres inválidos
  if (!/^[a-zA-Z_$][\w$]*$/.test(name)) return false;

  // Verifica palavras reservadas
  if (RESERVED_WORDS.has(name)) return false;

  // Verifica propriedades perigosas do prototype
  if (name in Object.prototype || name in Function.prototype) return false;

  return true;
};

export function getRelativeCoordinates(event, element) {
  const rect = element.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}
