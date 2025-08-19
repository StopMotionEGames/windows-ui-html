export default class PlatformFilter {
  static #platformInfo = null;

  static init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        PlatformFilter.#processElements().catch((error) =>
          console.error("An error ocurred while trying to process PlatformFilter elements:", error)
        );
      });
    } else {
      PlatformFilter.#processElements().catch((error) =>
        console.error("An error ocurred while trying to process PlatformFilter elements:", error)
      );
    }
  }

  static async #getPlatformInfo() {
    if (this.#platformInfo) return this.#platformInfo;

    const baseInfo = this.#getBasePlatformInfo();
    let version = baseInfo.version;
    let versionNumber = baseInfo.versionNumber;

    if (baseInfo.platform === "windows" && navigator.userAgentData) {
      try {
        const ua = await navigator.userAgentData.getHighEntropyValues([
          "platformVersion",
        ]);
        const parts = ua.platformVersion.split(".").map(Number);
        versionNumber = parseFloat(parts[0] + "." + (parts[1] || 0));

        if (versionNumber >= 13.0) version = "11";
        else if (versionNumber >= 10.0) version = "10";
        else if (versionNumber > 0) version = "pre10";
      } catch (e) {
        console.warn("Falha ao obter versão do Windows", e);
      }
    }


    if (baseInfo.platform === "linux" && navigator.userAgentData) {
      try {
        const ua = await navigator.userAgentData.getHighEntropyValues([
          "platform",
        ]);
        if (ua.platform.toLowerCase().includes("chrome")) {
          baseInfo.platform = "chromeos";
        }
      } catch (e) {
        if (/cros/i.test(navigator.userAgent)) {
          baseInfo.platform = "chromeos";
        }
      }
    }

    this.#platformInfo = {
      platform: baseInfo.platform,
      version: version,
      versionNumber: versionNumber,
    };

    return this.#platformInfo;
  }

  static #getBasePlatformInfo() {
    const ua = navigator.userAgent.toLowerCase();
    let platform = "unknown";
    let version = null;
    let versionNumber = null;

    // iOS
    if (/iphone|ipad|ipod/.test(ua)) {
      platform = "ios";
      version = this.#getIOSVersion(ua);
      versionNumber = version ? parseFloat(version) : null;
    }
    // Android
    else if (/android/.test(ua)) {
      platform = "android";
      version = this.#getAndroidVersion(ua);
      versionNumber = version ? parseFloat(version) : null;
    }
    // Windows
    else if (/win/.test(ua)) {
      platform = "windows";
      const winInfo = this.#getLegacyWindowsVersion(ua);
      version = winInfo.version;
      versionNumber = winInfo.versionNumber;
    }
    // macOS
    else if (/mac/.test(ua)) {
      platform = "mac";
      version = this.#getMacVersion(ua);
      versionNumber = version ? parseFloat(version) : null;
    }
    // Linux/ChromeOS
    else if (/linux/.test(ua) || /cros/.test(ua)) {
      platform = /cros/.test(ua) ? "chromeos" : "linux";
    }

    return { platform, version, versionNumber };
  }

  // Helper: Windows Legacy Version Detection
  static #getLegacyWindowsVersion(ua) {
    const versionMap = {
      "10.0": { version: "10/11", versionNumber: 10.0 }, // can't check between 10/11
      6.3: { version: "8.1", versionNumber: 6.3 },
      6.2: { version: "8", versionNumber: 6.2 },
      6.1: { version: "7", versionNumber: 6.1 },
      "6.0": { version: "vista", versionNumber: 6.0 },
      5.2: { version: "xp", versionNumber: 5.2 },
      5.1: { version: "xp", versionNumber: 5.1 },
    };

    const match = ua.match(/windows nt (\d+\.\d+)/);
    if (match && versionMap[match[1]]) {
      return versionMap[match[1]];
    }

    if (/windows 98/i.test(ua)) return { version: "98", versionNumber: 4.1 };
    if (/windows 95/i.test(ua)) return { version: "95", versionNumber: 4.0 };

    return { version: null, versionNumber: null };
  }

  // Helper: iOS Version
  static #getIOSVersion(ua) {
    const match = ua.match(/os (\d+)_(\d+)_?(\d+)?/);
    return match ? `${match[1]}.${match[2]}` : null;
  }

  // Helper: Android Version
  static #getAndroidVersion(ua) {
    const match = ua.match(/android (\d+)(\.\d+)?/);
    return match ? match[1] : null;
  }

  // Helper: Mac Version
  static #getMacVersion(ua) {
    const match = ua.match(/mac os x (10[._]\d+)([._]\d+)?/);
    return match ? match[1].replace("_", ".") : null;
  }

  static async #processElements() {
    const { platform, version } = await this.#getPlatformInfo();

    document.querySelectorAll("wuhc-platformfilter").forEach((el) => {
      const platforms =
        el.getAttribute("platforms")?.replace(/\s/g, "").split(",") || [];

      const shouldKeep = platforms.some((platformSpec) => {
        const [targetPlatform, targetVersion] = platformSpec.split(":");

        const versionMatch =
          !targetVersion ||
          targetVersion === version ||
          this.#compareVersions(targetVersion, version);

        return targetPlatform === platform && versionMatch;
      });

      if (!shouldKeep) el.remove();
    });
  }

  // Helper: Version Comparison (supports >, <, >=, <= operators)
  static #compareVersions(condition, currentVersion) {
    if (!currentVersion) return false;

    const operator = condition.match(/^([<>]=?)?/)[0];
    const versionValue = condition.replace(operator, "");

    const normalize = (v) => parseFloat(v.replace("pre", "0"));

    const current = normalize(currentVersion);
    const target = normalize(versionValue);

    switch (operator) {
      case ">":
        return current > target;
      case "<":
        return current < target;
      case ">=":
        return current >= target;
      case "<=":
        return current <= target;
      default:
        return current === target;
    }
  }
}
