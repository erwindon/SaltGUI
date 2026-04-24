(function initializeTheme () {
  const context = globalThis;
  const root = document.documentElement;
  const mediaQuery = context.matchMedia ? context.matchMedia("(prefers-color-scheme: dark)") : null;

  function wantsDarkTheme () {
    return mediaQuery ? mediaQuery.matches : false;
  }

  function applyTheme () {
    root.dataset.theme = wantsDarkTheme() ? "dark" : "light";
  }

  applyTheme();
  if (mediaQuery && typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", applyTheme);
  } else if (mediaQuery && typeof mediaQuery.addListener === "function") {
    mediaQuery.addListener(applyTheme);
  }
})();
