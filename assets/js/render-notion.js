// assets/js/render-notion.js
(function () {
  const JSON_URL = "./public/notion.json"; // 生成物の場所に合わせる
  const TARGET   = document.querySelector("#projects") || document.querySelector("#works");
  const tpl      = document.querySelector("#tpl-notion-card");

  if (!TARGET || !tpl) {
    console.warn("TARGET or template not found (need #projects/#works and #tpl-notion-card).");
    return;
  }

  function setText(el, v) { if(!el) return; if(v){ el.textContent = v; } else { el.remove(); } }
  function setHref(el, v) { if(!el) return; if(v){ el.setAttribute("href", v); } else { el.removeAttribute("href"); } }
  function setSrc (el, v) { if(!el) return; if(v){ el.setAttribute("src", v); } else { el.remove(); } }
  function fmtDate(s){ return s ? s.replaceAll("-", ".") : ""; }

  fetch(JSON_URL, { cache: "no-store" })
    .then(r => r.ok ? r.json() : [])
    .then(items => {
      if (!Array.isArray(items)) return;
      const frag = document.createDocumentFragment();
      items.forEach(x => {
        const node = tpl.content.cloneNode(true);
        node.querySelectorAll("[data-text]").forEach(el => {
          const key = el.getAttribute("data-text");
          setText(el, key === "date" ? fmtDate(x[key]) : x[key]);
        });
        node.querySelectorAll("[data-href]").forEach(el => {
          const key = el.getAttribute("data-href");
          setHref(el, x[key]);
        });
        node.querySelectorAll("[data-src]").forEach(el => {
          const key = el.getAttribute("data-src");
          setSrc(el, x[key]);
        });
        node.querySelectorAll("[data-tags]").forEach(el => {
          const key = el.getAttribute("data-tags");
          const arr = Array.isArray(x[key]) ? x[key] : [];
          if (!arr.length) { el.remove(); return; }
          el.textContent = arr.join(" · ");
        });
        frag.appendChild(node);
      });
      TARGET.appendChild(frag);
    })
    .catch(console.error);
})();
