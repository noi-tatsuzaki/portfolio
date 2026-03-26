(() => {
  const base = document.body?.dataset?.basePath || ".";
  const FALLBACK_HEADER =
    '<header class="siteHeader" aria-label="Header"><div class="siteHeader__inner"><a href="/" class="siteHeaderHomeLink" aria-label="Go to home">NOI TATSUZAKI</a></div></header>';
  const FALLBACK_FOOTER =
    '<footer class="siteFooter" aria-label="Footer"><div class="siteFooter__inner"><div class="siteFooterTagline" data-scramble="1"><span>LET&#39;S BUILD</span><span>THE FUTURE</span><span>TOGETHER.</span></div><div class="siteFooterCopyright">🄫 2026 NOI TATSUZAKI. All rights reserved.</div></div></footer>';

  const loadInto = async (selector, file, fallbackHtml) => {
    const target = document.querySelector(selector);
    if (!target) return;
    try {
      const res = await fetch(`${base}/${file}`, { cache: "no-cache" });
      if (!res.ok) {
        target.innerHTML = fallbackHtml;
        return;
      }
      target.innerHTML = await res.text();
    } catch (_) {
      // Fallback keeps layout stable in local file previews, etc.
      target.innerHTML = fallbackHtml;
    }
  };

  const init = async () => {
    await Promise.all([
      loadInto("#site-header-placeholder", "header.html", FALLBACK_HEADER),
      loadInto("#site-footer-placeholder", "footer.html", FALLBACK_FOOTER),
    ]);
    window.dispatchEvent(new CustomEvent("layout:loaded"));
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
