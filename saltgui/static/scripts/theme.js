(function () {
  const context = globalThis;
  const root = document.documentElement;
  const mediaQuery = context.matchMedia ? context.matchMedia("(prefers-color-scheme: dark)") : null;

  function getStoredTheme() {
    try {
      const sessionTheme = context.sessionStorage ? context.sessionStorage.getItem("theme") : null;
      if (sessionTheme) {
        return sessionTheme;
      }
      const defaultTheme = context.localStorage ? context.localStorage.getItem("theme_default") : null;
      if (defaultTheme) {
        return defaultTheme;
      }
    } catch (_error) {
      // Storage access can fail in restricted browser environments.
    }

    return "auto";
  }

  function getConfiguredTheme() {
    const theme = (getStoredTheme() || "auto").toLowerCase();
    if (theme === "light" || theme === "dark") {
      return theme;
    }
    return "auto";
  }

  function getParentHints() {
    const values = [];

    try {
      const parentDoc = context.parent && context.parent !== context ? context.parent.document : null;
      if (parentDoc) {
        values.push(parentDoc.documentElement.dataset.theme || "");
        values.push(parentDoc.documentElement.getAttribute("theme") || "");
        values.push(parentDoc.documentElement.className || "");
        values.push(parentDoc.body ? parentDoc.body.className || "" : "");
      }
    } catch (_error) {
      // Access to the parent frame can fail outside an embedded environment.
    }

    return values.join(" ").toLowerCase();
  }

  function wantsDarkTheme(configuredTheme) {
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

  function applyTheme() {
    const configuredTheme = getConfiguredTheme();
    root.dataset.themePreference = configuredTheme;
    root.dataset.theme = wantsDarkTheme(configuredTheme) ? "dark" : "light";
  }

  context.SaltGUITheme = {
    applyTheme,
    getConfiguredTheme,
  };

  applyTheme();

  if (mediaQuery && mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", applyTheme);
  } else if (mediaQuery && mediaQuery.addListener) {
    mediaQuery.addListener(applyTheme);
  }

  context.addEventListener("storage", applyTheme);

  try {
    const parentDoc = context.parent && context.parent !== context ? context.parent.document : null;
    if (parentDoc) {
      const observer = new MutationObserver(applyTheme);
      observer.observe(parentDoc.documentElement, {
        attributes: true,
        attributeFilter: ["class", "data-theme", "theme"],
      });
      if (parentDoc.body) {
        observer.observe(parentDoc.body, {
          attributes: true,
          attributeFilter: ["class", "data-theme", "theme"],
        });
      }
    }
  } catch (_error) {
    // Ignore parent observer failures outside embedded use.
  }
})();
