(() => {
  const base = document.body?.dataset?.basePath || ".";
  const FALLBACK_HEADER =
    '<header class="siteHeader" aria-label="Header"><div class="siteHeader__inner"><a href="/" class="siteHeaderHomeLink" aria-label="Go to home">NOI TATSUZAKI</a><nav class="siteHeaderNav" aria-label="Section"><a class="siteHeaderNewsLink" href="news/index.html"><span class="siteHeaderNewsLink__corners" aria-hidden="true"></span><span class="siteHeaderNewsLink__text">NEWS</span></a></nav></div></header>';
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

  /** NEWS ラベル: ホバーで先頭からランダム→確定（main.js の scramble と同系） */
  function initSiteHeaderNewsScramble() {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-";

    const scrambleLine = (el, finalText) =>
      new Promise((resolve) => {
        const start = performance.now();
        const durationMs = 720;
        const frameMs = 28;
        const len = finalText.length;
        const tick = (now) => {
          const t = Math.min(1, (now - start) / durationMs);
          const revealed = Math.floor(len * t);
          let out = "";
          for (let i = 0; i < len; i++) {
            const ch = finalText[i];
            if (ch === " ") out += " ";
            else if (i < revealed) out += ch;
            else out += chars[(Math.random() * chars.length) | 0];
          }
          el.textContent = out;
          if (t >= 1) {
            el.textContent = finalText;
            resolve();
            return;
          }
          setTimeout(() => requestAnimationFrame(tick), frameMs);
        };
        requestAnimationFrame(tick);
      });

    document.querySelectorAll(".siteHeaderNewsLink__text").forEach((textEl) => {
      const finalText = (textEl.textContent || "NEWS").trim() || "NEWS";
      textEl.dataset.scrambleFinal = finalText;

      const link = textEl.closest(".siteHeaderNewsLink");
      if (!link) return;

      link.addEventListener("mouseenter", () => {
        const fin = textEl.dataset.scrambleFinal || "NEWS";
        textEl.textContent = fin.replace(/[^\s]/g, " ");
        scrambleLine(textEl, fin).catch(() => {});
      });
    });
  }

  const init = async () => {
    await Promise.all([
      loadInto("#site-header-placeholder", "header.html", FALLBACK_HEADER),
      loadInto("#site-footer-placeholder", "footer.html", FALLBACK_FOOTER),
    ]);
    const joinPath = (a, b) => [a, b].join("/").replace(/\/+/g, "/");

    document.querySelectorAll(".siteHeaderHomeLink").forEach((el) => {
      el.setAttribute("href", joinPath(base, "index.html"));
    });

    const path = (location.pathname || "").replace(/\/+$/, "") || "/";
    const onNewsPage =
      /\/news(\/index)?(\.html)?$/i.test(path) || /(^|\/)news$/i.test(path);

    document.querySelectorAll(".siteHeaderNewsLink").forEach((link) => {
      link.setAttribute("href", joinPath(base, "news/index.html"));
      if (onNewsPage) {
        link.setAttribute("aria-current", "page");
        link.classList.add("siteHeaderNewsLink--current");
      }
    });

    initSiteHeaderNewsScramble();

    window.dispatchEvent(new CustomEvent("layout:loaded"));
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
