const chrome = (() => {
  const match = navigator.userAgent.match(/Chrome\/(\d+)/);
  return {
    isChrome: !!match,
    compatibleWithCSM: !!match ? parseInt(match[1], 10) >= 123 : null,
  };
})();
const firefox = (() => {
  const match = navigator.userAgent.match(/Firefox\/(\d+)/);
  return {
    isFirefox: !!match,
    compatibleWithCSM: !!match ? parseInt(match[1], 10) >= 145 : null,
  };
})();

// parâmetro styles é um array de strings, que contém o nome do CSS (sem .css)
export default async function loadStyles(styles) {
  if (chrome.isChrome && !chrome.compatibleWithCSM)
    console.info(
      "Update your Chrome to the latest version to support CSS Module Scripts"
    );

  if (firefox.isFirefox && !firefox.compatibleWithCSM)
    console.info(
      "Update your Firefox to the latest version to support CSS Module Scripts"
    );

  if (
    (firefox.compatibleWithCSM && (await testFirefoxCSMCompatibility())) ||
    chrome.compatibleWithCSM
  )
    for (const style of styles) {
      if (timeLogs) console.time(`Loaded ${style}.css`);
      loadWithImport(style);
    }
  else
    for (const style of styles) {
      if (timeLogs) console.time(`Loaded ${style}.css`);
      loadWithLink(style);
    }
}
function loadWithImport(style) {
  const stylesDir = "../../styles/";
  try {
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

async function loadWithLink(style) {
  const stylesDir = _wuhc_settings_["css-path"];
  try {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `${stylesDir}${style}.css`;
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

async function testFirefoxCSMCompatibility() {
  try {
    await import(
      "/src/styles/themes/RevealLight.css",
      { with: { type: "css" } }
    );
    return true;
  } catch (_) {
    console.info(
      "Try to enable layout.css.module-scripts.enabled in about:config"
    );
    return false;
  }
}
