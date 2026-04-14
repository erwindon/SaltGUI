(function initializeTheme () {
  const context = globalThis;
  const root = document.documentElement;
  const mediaQuery = context.matchMedia ? context.matchMedia("(prefers-color-scheme: dark)") : null;

  function reportIgnoredError (message, error) {
    context.console?.debug?.(message, error);
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
      parentDoc.body?.className || "",
    ].join(" ").toLowerCase();
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
  mediaQuery?.addEventListener("change", applyTheme);
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
