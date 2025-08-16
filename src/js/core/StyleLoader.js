// core/StyleLoader.js
export async function loadStyles(styles) {
  const stylesDir = "/src/styles/";
  
  for (const style of styles) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `${stylesDir}${style}.css`;
    document.head.appendChild(link);
    
    // Adicionar verificação de carregamento
    await new Promise((resolve) => {
      link.onload = resolve;
      link.onerror = () => console.error(`Failed to load: ${style}.css`);
    });
  }
}