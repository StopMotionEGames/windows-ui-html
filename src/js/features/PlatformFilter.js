export default class PlatformFilter {
  static init() {
    if (document.readyState === "loading")
      document.addEventListener(
        "DOMContentLoaded",
        PlatformFilter.#processElements
      );
    else PlatformFilter.#processElements();
  }

  static #getUserPlatform() {
    const userAgent = navigator.userAgent.toLowerCase();

    if (/iphone|ipad|ipod/.test(userAgent)) return "ios";
    if (/android/.test(userAgent)) return "android";
    if (/win/.test(userAgent)) return "windows";
    if (/mac/.test(userAgent)) return "mac";
    if (/linux/.test(userAgent)) return "linux";

    return "unknown";
  }

  static #processElements() {
    document.querySelectorAll("wuhc-platformfilter").forEach((el) => {
      const platforms =
        el.getAttribute("platforms")?.replaceAll(/\s/g, "").split(",") || [];

      const currentPlatform = PlatformFilter.#getUserPlatform();

      // Remove the element that is not in the platforms list
      if (!platforms.includes(currentPlatform)) {
        el.remove();
      }
    });
  }
}
