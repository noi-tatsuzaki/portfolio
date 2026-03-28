(() => {
  const STORAGE_KEY = "portfolio-lang";

  const currentLang = () =>
    document.documentElement.getAttribute("lang") === "ja" ? "ja" : "en";

  const syncToggleUi = () => {
    const lang = currentLang();
    document.querySelectorAll(".siteHeaderLangBtn[data-lang]").forEach((btn) => {
      const on = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  };

  const wire = () => {
    if (!document.querySelector(".siteHeaderLangBtn[data-lang]")) return;
    syncToggleUi();
    document.querySelectorAll(".siteHeaderLangBtn[data-lang]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = btn.getAttribute("data-lang");
        if (!next || next === currentLang()) return;
        try {
          localStorage.setItem(STORAGE_KEY, next);
        } catch (_) {}
        document.documentElement.setAttribute("lang", next);
        window.location.reload();
      });
    });
  };

  document.addEventListener("layout:loaded", wire);
})();
