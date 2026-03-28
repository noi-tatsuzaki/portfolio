/**
 * News article detail — 12 列・軸表示あり。データ行は 5 行まで、指定マージのみ（以降の行・未結合セルなし）。
 */
(() => {
  const root = document.getElementById("newsDetailGrid");
  if (!root) return;

  const basePath = document.body?.getAttribute("data-base-path")?.trim() ?? "../..";
  const asset = (...parts) =>
    [basePath, ...parts].filter(Boolean).join("/").replace(/\/+/g, "/");
  const arrowSrc = asset("public/images/news-back-arrow.png");
  const thumbSrc = asset("public/images/sample-news.png");
  const navArrowSrc = asset("public/images/news-nav-arrow.png");

  const COLS = 12;
  const ROWS = 5;
  const BASE_ROW_PX = 56;
  const HEADER_ROW_PX = 28;
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").slice(0, COLS);

  const mergeSpecs = [
    { from: "1A", to: "1F" },
    { from: "1G", to: "1I" },
    { from: "1J", to: "1L" },
    { from: "2A", to: "2F" },
    { from: "2G", to: "2I" },
    { from: "2J", to: "2L" },
    { from: "3A", to: "3C" },
    { from: "3D", to: "3L" },
    { from: "4A", to: "4C" },
    { from: "4D", to: "4L" },
    { from: "5A", to: "5C" },
    { from: "5D", to: "5F" },
    { from: "5G", to: "5I" },
    { from: "5J", to: "5L" },
  ];

  const rowHeights = [`${HEADER_ROW_PX}px`];
  for (let r = 1; r <= ROWS; r++) {
    /** データ3行目(3D:3L 本文)は内容に合わせて伸ばす（px 固定だと計測ループ・未定義関数で壊れやすい） */
    if (r === 3) {
      rowHeights.push(`minmax(${BASE_ROW_PX}px, max-content)`);
    } else {
      rowHeights.push(`${BASE_ROW_PX}px`);
    }
  }
  /** grid 行インデックス: 0=見出し, 1=データ1行目, 2=データ2行目 */
  const DATA_ROW2_TEMPLATE_INDEX = 2;

  /** ダミー本文（約500字・リッチテキスト例）。本番は CMS 等から差し替え */
  const NEWS_DETAIL_BODY_DUMMY_HTML = `
<p>楽観と実装のあいだには、常に小さなズレが走ることがある。仕様書には写らない妥協点や、レビューでだけ姿を見せる例外処理。それでもプロダクトは日々動き続けるから、記録として残す一文があると助かる。</p>
<p>読む人が文脈を拾いやすいように、見出しと段落を分け、用語には説明を添える。外部資料へ誘導するときは<a href="#">参照用リンク</a>を置き、本文の流れを断たないようにする。繰り返し読まれる文章ほど、語尾やトーンをそろえた方が迷子になりにくい。</p>
<p>最後に、更新日と担当範囲を明記しておくと、あとから自分が助かる。詳細は<a href="#">関連ドラフト</a>もあわせて確認してほしい。これはニュース詳細の3D:3Lに表示する本文ブロックのダミーで、長さはおおよそ500文字前後である。</p>
`.trim();

  const applyGridTemplateRows = () => {
    root.style.gridTemplateRows = rowHeights.join(" ");
  };
  applyGridTemplateRows();

  const makeCell = (cls, text) => {
    const el = document.createElement("div");
    el.className = cls;
    if (text !== undefined) el.textContent = text;
    return el;
  };

  const colIndex = (letter) => {
    const idx = letters.indexOf(letter.toUpperCase());
    if (idx < 0) throw new Error(`Invalid column: ${letter}`);
    return idx + 1;
  };

  const parseRef = (ref) => {
    const m = String(ref).trim().match(/^(\d+)([A-Za-z])$/);
    if (!m) throw new Error(`Invalid ref: ${ref}`);
    return { row: Number(m[1]), col: colIndex(m[2]) };
  };

  const frag = document.createDocumentFragment();

  const corner = makeCell("dgCell dgHead dgCorner", "");
  corner.style.gridRow = "1";
  corner.style.gridColumn = "1";
  frag.appendChild(corner);

  for (let c = 1; c <= COLS; c++) {
    const el = makeCell("dgCell dgHead", letters[c - 1]);
    el.style.gridRow = "1";
    el.style.gridColumn = String(1 + c);
    frag.appendChild(el);
  }

  for (let r = 1; r <= ROWS; r++) {
    const el = makeCell("dgCell dgHead dgRow", "");
    el.dataset.dgRow = String(r);
    el.style.gridRow = String(1 + r);
    el.style.gridColumn = "1";
    if (r === 5) {
      el.classList.add("newsDetailRowHead--navRow");
      const num = document.createElement("span");
      num.className = "newsDetailRowHead__num";
      num.textContent = String(r);
      const prevHost = document.createElement("div");
      prevHost.className = "newsDetailNavPrevHost";
      el.append(num, prevHost);
    } else {
      el.textContent = String(r);
    }
    frag.appendChild(el);
  }

  for (const spec of mergeSpecs) {
    const a = parseRef(spec.from);
    const b = parseRef(spec.to);
    const r1 = Math.min(a.row, b.row);
    const r2 = Math.max(a.row, b.row);
    const c1 = Math.min(a.col, b.col);
    const c2 = Math.max(a.col, b.col);

    const el = makeCell("dgCell dgMerge", "");
    if (r2 === ROWS) el.classList.add("dgNoBottomEdge");
    el.style.gridRow = `${1 + r1} / ${1 + r2 + 1}`;
    el.style.gridColumn = `${1 + c1} / ${1 + c2 + 1}`;

    if (spec.from === "2A" && spec.to === "2F") {
      el.classList.add("newsDetailMerge--2a2f", "dgMerge--overflowVisible");
      const wrap = document.createElement("div");
      wrap.className = "dgMergeContent dgMergeContent--newsDetailBack";
      const intro = document.createElement("div");
      intro.className = "newsDetailIntro";
      const backLink = document.createElement("a");
      backLink.className = "newsDetailBackLink";
      backLink.href = "../index.html";
      backLink.setAttribute("aria-label", "Back to all articles");
      const img = document.createElement("img");
      img.className = "newsDetailBackLink__arrow";
      img.src = arrowSrc;
      img.alt = "";
      img.setAttribute("aria-hidden", "true");
      const span = document.createElement("span");
      span.className = "newsDetailBackLink__text";
      span.textContent = "BACK TO ALL ARTICLES";
      backLink.append(img, span);
      const titleEl = document.createElement("h1");
      titleEl.className = "newsDetailArticleTitle";
      titleEl.textContent = "Article Title";
      intro.append(backLink, titleEl);
      wrap.appendChild(intro);
      const thumbWrap = document.createElement("figure");
      thumbWrap.className = "newsDetailThumbWrap";
      const thumbImg = document.createElement("img");
      thumbImg.className = "newsDetailThumb";
      thumbImg.src = thumbSrc;
      thumbImg.alt = "";
      thumbImg.decoding = "async";
      thumbWrap.appendChild(thumbImg);
      wrap.appendChild(thumbWrap);
      el.appendChild(wrap);
    }

    if (spec.from === "2G" && spec.to === "2I") {
      el.classList.add("newsDetailMerge--2g2i");
      const meta = document.createElement("div");
      meta.className = "dgMergeContent dgMergeContent--newsMeta";
      const cat = document.createElement("span");
      cat.className = "dgNewsMeta__cat";
      cat.textContent = "Category";
      const date = document.createElement("span");
      date.className = "dgNewsMeta__date";
      date.textContent = "YYYY/MM/DD";
      meta.append(cat, date);
      el.appendChild(meta);
    }

    if (spec.from === "3D" && spec.to === "3L") {
      el.classList.add("newsDetailMerge--3d3l");
      const wrap = document.createElement("div");
      wrap.className = "dgMergeContent newsDetailArticleBody";
      const rich = document.createElement("div");
      rich.className = "newsDetailArticleBody__rich";
      rich.innerHTML = NEWS_DETAIL_BODY_DUMMY_HTML;
      wrap.appendChild(rich);
      el.appendChild(wrap);
    }

    frag.appendChild(el);
  }

  root.appendChild(frag);

  const newsDateSortKey = (raw) => {
    const s = String(raw ?? "").trim();
    let m = s.match(/^(\d{4})\/(\d{2})\/(\d{2})/);
    if (m) return Number(`${m[1]}${m[2]}${m[3]}`);
    m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return Number(`${m[1]}${m[2]}${m[3]}`);
    return 0;
  };

  const stripPathKey = (pathname) => {
    let p = String(pathname || "").replace(/\\/g, "/");
    p = p.replace(/\/index\.html?$/i, "");
    if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
    return p.toLowerCase();
  };

  const resolveArticleUrl = (urlFromJson) => {
    const u = String(urlFromJson || "").trim();
    if (!u) return "";
    if (/^https?:\/\//i.test(u)) return u;
    try {
      return new URL(u, location.origin).pathname;
    } catch (_) {
      return u.startsWith("/") ? u : `/${u}`;
    }
  };

  const pathMatchesArticle = (entryUrl, currentPathname) => {
    const a = stripPathKey(resolveArticleUrl(entryUrl));
    const b = stripPathKey(currentPathname);
    if (!a || !b) return false;
    if (a === b) return true;
    if (b.endsWith(a) || a.endsWith(b)) return true;
    const seg = (p) => p.split("/").filter(Boolean);
    const sa = seg(a);
    const sb = seg(b);
    if (sa.length && sb.length && sa[sa.length - 1] === sb[sb.length - 1]) return true;
    return false;
  };

  const wireNewsArticleNav = () => {
    const prevHost = root.querySelector(".newsDetailNavPrevHost");
    const nextHost = root.querySelector(".newsDetailNavNextHost");
    if (!prevHost || !nextHost) return;

    const jsonEl = document.getElementById("latest-news-data");
    let entries = [];
    if (jsonEl) {
      try {
        const parsed = JSON.parse(jsonEl.textContent || "[]");
        if (Array.isArray(parsed)) entries = parsed;
      } catch (_) {
        entries = [];
      }
    }

    const sorted = [...entries].sort(
      (a, b) => newsDateSortKey(b?.date) - newsDateSortKey(a?.date)
    );
    const idx = sorted.findIndex((e) => pathMatchesArticle(e?.url, location.pathname));
    const lang = document.documentElement.lang === "ja" ? "ja" : "en";
    const labelPrev =
      lang === "ja" ? "投稿日が一つ前の記事へ" : "Go to the previous article by date";
    const labelNext =
      lang === "ja" ? "投稿日が一つ後の記事へ" : "Go to the next article by date";

    const older = idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null;
    const newer = idx > 0 ? sorted[idx - 1] : null;

    const makeControl = (href, ariaLabel, isPrev) => {
      const wrap = document.createElement(href ? "a" : "span");
      wrap.className = `newsDetailNavBtn${isPrev ? " newsDetailNavBtn--prev" : " newsDetailNavBtn--next"}`;
      if (href) {
        wrap.href = href;
        wrap.setAttribute("aria-label", ariaLabel);
      } else {
        wrap.setAttribute("aria-disabled", "true");
        wrap.setAttribute("aria-label", ariaLabel);
        wrap.setAttribute("tabindex", "-1");
        wrap.classList.add("newsDetailNavBtn--disabled");
      }
      const img = document.createElement("img");
      img.src = navArrowSrc;
      img.alt = "";
      img.setAttribute("aria-hidden", "true");
      wrap.appendChild(img);
      return wrap;
    };

    prevHost.replaceChildren();
    nextHost.replaceChildren();
    const prevHref =
      older?.url && String(older.url).trim()
        ? resolveArticleUrl(older.url)
        : "";
    const nextHref =
      newer?.url && String(newer.url).trim()
        ? resolveArticleUrl(newer.url)
        : "";
    prevHost.appendChild(makeControl(prevHref, labelPrev, true));
    nextHost.appendChild(makeControl(nextHref, labelNext, false));
  };

  wireNewsArticleNav();

  /**
   * scrollHeight / ResizeObserver はセルが伸びるたびに再計測が連鎖するため、
   * padding + gap + 子の offsetHeight のみで高さを決める。
   */
  const layoutDetailDataRow2Height = () => {
    const cell = root.querySelector(".newsDetailMerge--2a2f");
    if (!cell) return;
    const inner = cell.querySelector(".dgMergeContent--newsDetailBack");
    if (!inner) return;

    const intro = inner.querySelector(".newsDetailIntro");
    const thumbWrap = inner.querySelector(".newsDetailThumbWrap");
    const cs = getComputedStyle(inner);
    const pt = parseFloat(cs.paddingTop) || 0;
    const pb = parseFloat(cs.paddingBottom) || 0;
    const titleToThumbPx = 30;

    let contentH = pt + pb;
    if (intro) contentH += intro.offsetHeight;
    if (intro && thumbWrap) contentH += titleToThumbPx;
    if (thumbWrap) contentH += thumbWrap.offsetHeight;

    const target = Math.max(BASE_ROW_PX, Math.ceil(contentH));
    const next = `${target}px`;
    if (rowHeights[DATA_ROW2_TEMPLATE_INDEX] !== next) {
      rowHeights[DATA_ROW2_TEMPLATE_INDEX] = next;
      applyGridTemplateRows();
    }
  };

  /** 2G:2I のメタ行の下辺を 2A:2F のタイトル下辺に合わせる */
  const layoutDetailMetaAlign = () => {
    const title = root.querySelector(".newsDetailArticleTitle");
    const cellG = root.querySelector(".newsDetailMerge--2g2i");
    const meta = cellG?.querySelector(".dgMergeContent--newsMeta");
    if (!title || !cellG || !meta) return;
    const cellRect = cellG.getBoundingClientRect();
    const titleRect = title.getBoundingClientRect();
    const titleBottomRel = titleRect.bottom - cellRect.top;
    const pad = Math.max(0, Math.round(titleBottomRel - meta.offsetHeight));
    cellG.style.paddingTop = `${pad}px`;
  };

  const scheduleDetailLayout = () => {
    requestAnimationFrame(() => {
      layoutDetailDataRow2Height();
      requestAnimationFrame(() => {
        layoutDetailMetaAlign();
      });
    });
  };

  scheduleDetailLayout();
  let resizeT = 0;
  window.addEventListener(
    "resize",
    () => {
      window.clearTimeout(resizeT);
      resizeT = window.setTimeout(scheduleDetailLayout, 100);
    },
    { passive: true }
  );
  if (document.fonts?.ready) {
    document.fonts.ready.then(scheduleDetailLayout);
  }

  const thumbImg = root.querySelector(".newsDetailThumb");
  if (thumbImg) {
    thumbImg.addEventListener("load", scheduleDetailLayout, { once: true });
    thumbImg.addEventListener("error", scheduleDetailLayout, { once: true });
  }
})();
