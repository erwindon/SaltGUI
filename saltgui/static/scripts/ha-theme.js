(function () {
  const root = document.documentElement;
  const mediaQuery = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function hintText() {
    const values = [];

    try {
      const parentDoc = window.parent && window.parent !== window ? window.parent.document : null;
      if (parentDoc) {
        values.push(parentDoc.documentElement.getAttribute("data-theme") || "");
        values.push(parentDoc.documentElement.getAttribute("theme") || "");
        values.push(parentDoc.documentElement.className || "");
        values.push(parentDoc.body ? parentDoc.body.className || "" : "");
      }
    } catch (_error) {
      // Access to the parent frame can fail outside Home Assistant ingress.
    }

    return values.join(" ").toLowerCase();
  }

  function wantsDarkTheme() {
    const hints = hintText();

    if (/(^|\s)(light)(\s|$)/.test(hints)) {
      return false;
    }

    if (/(^|\s)(dark|night)(\s|$)/.test(hints)) {
      return true;
    }

    return mediaQuery ? mediaQuery.matches : false;
  }

  function applyTheme() {
    root.dataset.theme = wantsDarkTheme() ? "dark" : "light";
  }

  applyTheme();

  if (mediaQuery && mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", applyTheme);
  } else if (mediaQuery && mediaQuery.addListener) {
    mediaQuery.addListener(applyTheme);
  }

  try {
    const parentDoc = window.parent && window.parent !== window ? window.parent.document : null;
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
    // Ignore parent observer failures outside Home Assistant ingress.
  }
})();
