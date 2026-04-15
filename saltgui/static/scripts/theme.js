(function initializeTheme () {
  const context = globalThis;
  const root = document.documentElement;
  const mediaQuery = context.matchMedia ? context.matchMedia("(prefers-color-scheme: dark)") : null;

  function reportIgnoredError (message, error) {
    if (context.console && typeof context.console.debug === "function") {
      context.console.debug(message, error);
    }
  }

  function getStoredTheme () {
    try {
      const sessionTheme = context.sessionStorage ? context.sessionStorage.getItem("theme") : null;
      if (sessionTheme) {
        return sessionTheme;
      }
      const defaultTheme = context.localStorage ? context.localStorage.getItem("theme_default") : null;
      if (defaultTheme) {
        return defaultTheme;
      }
    } catch (error) {
      // Storage access can fail in restricted browser environments.
      reportIgnoredError("SaltGUI theme: storage unavailable", error);
    }

    return "auto";
  }

  function getConfiguredTheme () {
    const theme = (getStoredTheme() || "auto").toLowerCase();
    if (theme === "light" || theme === "dark") {
      return theme;
    }
    return "auto";
  }

  function getParentDocument () {
    if (context.self === context.top) {
      return null;
    }
    try {
      return context.parent.document;
    } catch (error) {
      // Access to the parent frame can fail outside an embedded environment.
      reportIgnoredError("SaltGUI theme: parent frame unavailable", error);
      return null;
    }
  }

  function getParentHints () {
    const parentDoc = getParentDocument();
    if (!parentDoc) {
      return "";
    }

    return [
      parentDoc.documentElement.dataset.theme || "",
      parentDoc.documentElement.getAttribute("theme") || "",
      parentDoc.documentElement.className || "",
      parentDoc.body ? parentDoc.body.className : "",
    ].join(" ").toLowerCase();
  }

  function parseColor (value) {
    if (!value || value === "transparent") {
      return null;
    }

    // Newer engines can return space-separated rgb syntax such as:
    // rgb(12 34 56 / 0.9)
    value = value.replace(/\s*\/\s*/g, ", ").replace(/\s+/g, " ");

    const rgbMatch = value.match(/^rgba?\(([^)]+)\)$/i);
    if (!rgbMatch) {
      return null;
    }

    let channelParts = rgbMatch[1].split(",").map((channel) => channel.trim()).filter((channel) => channel !== "");
    if (channelParts.length === 1) {
      // Legacy fallback for plain space-separated rgb without commas.
      channelParts = channelParts[0].split(" ").map((channel) => channel.trim()).filter((channel) => channel !== "");
    }

    const channels = channelParts.map((channel) => Number.parseFloat(channel));
    if (channels.length < 3 || channels.slice(0, 3).some((channel) => Number.isNaN(channel))) {
      return null;
    }

    const alpha = channels.length > 3 ? channels[3] : 1;
    if (Number.isNaN(alpha) || alpha <= 0) {
      return null;
    }

    return channels.slice(0, 3);
  }

  function isDarkColor (value) {
    const channels = parseColor(value);
    if (!channels) {
      return null;
    }

    const [red, green, blue] = channels;
    const brightness = (red * 299 + green * 587 + blue * 114) / 1000;
    return brightness < 140;
  }

  function getParentComputedTheme () {
    const parentDoc = getParentDocument();
    if (!parentDoc || !context.getComputedStyle) {
      return null;
    }

    try {
      const candidates = [context.getComputedStyle(parentDoc.documentElement).backgroundColor];
      if (parentDoc.body) {
        candidates.push(context.getComputedStyle(parentDoc.body).backgroundColor);
      }

      for (const candidate of candidates) {
        const isDark = isDarkColor(candidate);
        if (isDark !== null) {
          return isDark;
        }
      }
    } catch (error) {
      reportIgnoredError("SaltGUI theme: parent style unavailable", error);
    }

    return null;
  }

  function wantsDarkTheme (configuredTheme) {
    if (configuredTheme === "dark") {
      return true;
    }
    if (configuredTheme === "light") {
      return false;
    }

    const hints = getParentHints();
    if (/(^|\s)(light)(\s|$)/.test(hints)) {
      return false;
    }
    if (/(^|\s)(dark|night)(\s|$)/.test(hints)) {
      return true;
    }

    const computedTheme = getParentComputedTheme();
    if (computedTheme !== null) {
      return computedTheme;
    }

    return mediaQuery ? mediaQuery.matches : false;
  }

  function applyTheme () {
    const configuredTheme = getConfiguredTheme();
    root.dataset.themePreference = configuredTheme;
    root.dataset.theme = wantsDarkTheme(configuredTheme) ? "dark" : "light";
  }

  context.SaltGUITheme = {
    applyTheme,
    getConfiguredTheme,
  };

  applyTheme();
  if (mediaQuery && typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", applyTheme);
  } else if (mediaQuery && typeof mediaQuery.addListener === "function") {
    mediaQuery.addListener(applyTheme);
  }
  context.addEventListener("storage", applyTheme);

  const parentDoc = getParentDocument();
  if (!parentDoc) {
    return;
  }

  try {
    const observer = new MutationObserver(applyTheme);
    observer.observe(parentDoc.documentElement, {
      attributeFilter: ["class", "data-theme", "theme"],
      attributes: true,
    });
    if (parentDoc.body) {
      observer.observe(parentDoc.body, {
        attributeFilter: ["class", "data-theme", "theme"],
        attributes: true,
      });
    }
  } catch (error) {
    reportIgnoredError("SaltGUI theme: parent observer unavailable", error);
  }
})();
