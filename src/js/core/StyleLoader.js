export default async function loadStyles(styles) {
  const stylesDir = globalThis._wuhc_settings_["css-path"];

  const isChromeWithVersion123OrHigher = (() => {
    const match = navigator.userAgent.match(/Chrome\/(\d+)/);
    return match && parseInt(match[1], 10) >= 123;
  })();

  if (isChromeWithVersion123OrHigher) {
    for (const style of styles) {
      try {
        if (timeLogs) console.time(`Loaded ${style}.css`);
        import(stylesDir + style + ".css", {
          with: { type: "css" },
        }).then((css) => {
          if (!document.adoptedStyleSheets.includes(css.default))
            document.adoptedStyleSheets.push(css.default);
          if (timeLogs) console.timeEnd(`Loaded ${style}.css`);
        });
      } catch (error) {
        if (timeLogs) console.timeEnd(`Loaded ${style}.css`);
        console.error("Error loading CSS module:", error);
      }
    }
  } else {
    for (const style of styles) {
      try {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = `${stylesDir}${style}.css`;
        if (timeLogs) console.time(`Loaded ${style}.css`);
        document.head.appendChild(link);

        link.addEventListener("load", async () => {
          if (timeLogs) console.timeEnd(`Loaded ${style}.css`);
        });
        new Promise(async (resolve) => {
          link.onload = resolve;
          link.onerror = () => console.error(`Failed to load: ${style}.css`);
        });
      } catch (error) {
        if (timeLogs) console.timeEnd(`Loaded ${style}.css`);
        console.error("Error loading CSS:", error);
      }
    }
  }
}
