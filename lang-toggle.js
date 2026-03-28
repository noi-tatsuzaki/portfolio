(() => {
  const STORAGE_KEY = "portfolio-lang";

  const siteBaseFromBody = () =>
    (document.body?.getAttribute("data-site-baseurl") || "").trim().replace(/\/$/, "");

  const pathIsJaSection = () => {
    const base = siteBaseFromBody();
    const path = (location.pathname || "").replace(/\/+$/, "") || "/";
    const jaP = base ? `${base}/ja` : "/ja";
    return path === jaP || path.startsWith(`${jaP}/`);
  };

  const currentLang = () =>
    document.documentElement.getAttribute("lang") === "ja" ? "ja" : "en";

  const normalizePath = (pathname) => {
    let p = String(pathname || "").replace(/\/+$/, "") || "/";
    p = p.replace(/\/index\.html?$/i, "");
    if (!p) p = "/";
    return p;
  };

  const isArticlePath = (pathname) => /\/content\/news\//i.test(pathname || "");

  /**
   * 言語に応じた URL へ遷移（/ja/* と記事 ?lang=ja）。
   * 日本語版のないページから JA へは /ja/ へフォールバック。
   */
  const targetUrlForLang = (desired) => {
    const base = siteBaseFromBody();
    const cur = normalizePath(location.pathname);
    const jaRoot = base ? `${base}/ja` : "/ja";
    const enNews = base ? `${base}/news` : "/news";
    const jaNews = `${jaRoot}/news`;
    const enHome = base || "/";

    if (desired === "ja") {
      if (pathIsJaSection()) return location.href;
      if (isArticlePath(location.pathname)) {
        const u = new URL(location.href);
        u.searchParams.set("lang", "ja");
        return u.href;
      }
      if (cur === enNews || cur === `${enNews}/index` || cur.startsWith(`${enNews}/`)) {
        return new URL(`${jaNews}/index.html`, location.origin).href;
      }
      if (cur === enHome || (!base && cur === "/")) {
        return new URL(`${jaRoot}/`, location.origin).href;
      }
      return new URL(`${jaRoot}/`, location.origin).href;
    }

    /* en */
    if (pathIsJaSection()) {
      if (cur === jaNews || cur === `${jaNews}/index` || cur.startsWith(`${jaNews}/`)) {
        return new URL(`${enNews}/index.html`, location.origin).href;
      }
      return new URL(enHome ? `${enHome}/` : "/", location.origin).href;
    }
    if (isArticlePath(location.pathname)) {
      const sp = new URLSearchParams(location.search);
      if (sp.get("lang") === "ja") {
        const u = new URL(location.href);
        u.searchParams.delete("lang");
        const qs = u.searchParams.toString();
        return u.origin + u.pathname + (qs ? `?${qs}` : "") + u.hash;
      }
    }
    return location.href;
  };

  const syncToggleUi = () => {
    const lang = currentLang();
    document.querySelectorAll(".siteHeaderLangBtn[data-lang]").forEach((btn) => {
      const on = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  };

  const onLangClick = (e) => {
    const btn = e.target.closest(".siteHeaderLangBtn[data-lang]");
    if (!btn) return;
    const next = btn.getAttribute("data-lang");
    if (!next || next === currentLang()) return;
    e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (_) {}
    const target = targetUrlForLang(next);
    if (target !== location.href) {
      location.assign(target);
    } else {
      document.documentElement.setAttribute("lang", next);
      location.reload();
    }
  };

  document.addEventListener("click", onLangClick);
  document.addEventListener("layout:loaded", syncToggleUi);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", syncToggleUi, { once: true });
  } else {
    syncToggleUi();
  }
})();
