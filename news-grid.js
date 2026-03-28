/**
 * News page grid ONLY (#newsGrid).
 * Home uses main.js + #debugGrid — independent config.
 */
(() => {
  const root = document.getElementById("newsGrid");
  if (!root) return;

  const basePath = document.body?.getAttribute("data-base-path")?.trim() ?? "";
  const siteBaseurl = document.body?.getAttribute("data-site-baseurl")?.trim() ?? "";

  /** Leading-slash paths are host-root; on GitHub Project Pages they need site.baseurl prefix. */
  const rootAbsolutePath = (path) => {
    const s = String(path || "").trim();
    if (!s || /^(https?:)?\/\//i.test(s)) return s;
    if (!s.startsWith("/")) return s;
    const base = siteBaseurl.replace(/\/$/, "");
    if (!base) return s;
    if (s === base || s.startsWith(`${base}/`)) return s;
    return `${base}${s}`;
  };

  const resolveUrl = (p) => {
    const str = String(p || "").trim();
    if (!str) return "";
    if (/^(https?:)?\/\//i.test(str)) return str;
    return new URL(str, document.baseURI).toString();
  };

  const normalizeAssetPath = (p) => {
    const str = String(p || "").trim();
    if (!str) return "";
    return str.startsWith("/") ? str.slice(1) : str;
  };

  const fallbackThumb = [basePath, "public/images/sample-news.png"].filter(Boolean).join("/").replace(/\/+/g, "/");
  const newsPageLang = document.documentElement.lang === "en" ? "en" : "ja";

  const pickLocalized = (ja, en, legacy) => {
    const j = String(ja ?? "").trim();
    const e = String(en ?? "").trim();
    const l = String(legacy ?? "").trim();
    if (newsPageLang === "en") return e || j || l || "";
    return j || e || l || "";
  };

  const latestNewsFallback = {
    title_ja: "Latest article",
    title_en: "Latest article",
    title: "Latest article",
    date: "2026/01/01",
    thumbnail_ja: fallbackThumb,
    thumbnail_en: fallbackThumb,
    thumbnail: fallbackThumb,
    category: "announcement",
    body_ja: "",
    body_en: "",
    body: "",
    url: "#",
  };

  const resolveThumbString = (raw) => {
    if (!raw) return fallbackThumb;
    const s = String(raw).trim();
    if (!s) return fallbackThumb;
    if (/^(https?:)?\/\//i.test(s)) return s;
    if (s.startsWith("/")) {
      try {
        return new URL(rootAbsolutePath(s), document.baseURI).toString();
      } catch {
        return fallbackThumb;
      }
    }
    return resolveUrl(normalizeAssetPath(s)) || fallbackThumb;
  };

  /** YYYY/MM/DD, YYYY-MM-DD, or ISO prefix — matches main.js (Jekyll sort: date removed for CMS safety). */
  const newsDateSortKey = (raw) => {
    const s = String(raw ?? "").trim();
    let m = s.match(/^(\d{4})\/(\d{2})\/(\d{2})/);
    if (m) return Number(`${m[1]}${m[2]}${m[3]}`);
    m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return Number(`${m[1]}${m[2]}${m[3]}`);
    return 0;
  };

  const parseLatestNewsItem = (item, fallback = latestNewsFallback) => {
    if (!item || typeof item !== "object") return { ...fallback };
    const titleJa = String(item.title_ja ?? item.title ?? "").trim();
    const titleEn = String(item.title_en ?? item.title ?? "").trim();
    const thumbJaResolved = resolveThumbString(item.thumbnail_ja ?? item.thumbnail);
    const thumbEnResolved = resolveThumbString(item.thumbnail_en ?? item.thumbnail);
    const bodyJa = String(item.body_ja ?? item.body ?? "").trim();
    const bodyEn = String(item.body_en ?? item.body ?? "").trim();

    const catRaw = String(item.category ?? fallback.category ?? "announcement")
      .toLowerCase()
      .trim();
    const category = catRaw || "announcement";
    let url = String(item.url ?? fallback.url ?? "#").trim() || "#";
    if (url.startsWith("/")) {
      try {
        url = new URL(rootAbsolutePath(url), document.baseURI).toString();
      } catch {
        url = "#";
      }
    }
    if (newsPageLang === "ja" && url !== "#") {
      try {
        const u = new URL(url, document.baseURI);
        if (/\/content\/news\//i.test(u.pathname)) {
          u.searchParams.set("lang", "ja");
          url = u.href;
        }
      } catch (_) {}
    }
    return {
      title_ja: titleJa,
      title_en: titleEn,
      title: pickLocalized(titleJa, titleEn, item.title),
      date: item.date || fallback.date,
      thumbnail_ja: thumbJaResolved,
      thumbnail_en: thumbEnResolved,
      thumbnail: newsPageLang === "en" ? thumbEnResolved || thumbJaResolved : thumbJaResolved || thumbEnResolved,
      category,
      body_ja: bodyJa,
      body_en: bodyEn,
      body: pickLocalized(bodyJa, bodyEn, item.body),
      url,
    };
  };

  const loadLatestNewsAll = () => {
    const jsonEl = document.getElementById("latest-news-data");
    if (!jsonEl) return [latestNewsFallback];
    try {
      const arr = JSON.parse(jsonEl.textContent || "[]");
      if (!Array.isArray(arr) || arr.length === 0) return [latestNewsFallback];
      const sorted = [...arr].sort(
        (a, b) => newsDateSortKey(b?.date) - newsDateSortKey(a?.date)
      );
      return sorted.map((item) => parseLatestNewsItem(item));
    } catch {
      return [latestNewsFallback];
    }
  };

  const COLS = 12;
  const ROWS = 9;
  const BASE_ROW_PX = 56;
  /** Same multiplier as home #debugGrid row 6 (main.js multiplierByRow.get(6)) */
  const HOME_ROW6_MUL = 1.8;
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").slice(0, COLS);

  const rowHeightPx = (dataRow) => {
    switch (dataRow) {
      case 1:
        return BASE_ROW_PX * HOME_ROW6_MUL;
      case 2:
      case 4:
        return BASE_ROW_PX * 0.8;
      case 3:
        return BASE_ROW_PX * 5 * 0.95;
      case 6:
        return BASE_ROW_PX * 1.3;
      case 7:
        return BASE_ROW_PX * 6;
      case 8:
      case 9:
        return BASE_ROW_PX;
      default:
        return BASE_ROW_PX;
    }
  };

  /* Collapse axis header row (A–L hidden in CSS; same idea as home) */
  const rowHeights = ["0px"];
  for (let r = 1; r <= ROWS; r++) {
    rowHeights.push(`${rowHeightPx(r)}px`);
  }
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

  /** Same block as home row 6 "WHY I BUILD" (main.js merge 6A:6F). */
  const newsTitleHtml = `<div class="dgMergeContent dgMergeContent--x23 dgMergeContent--centerBoth"><div class="dgTitle" data-fit="title-block" data-scramble="1"><span>NEWS</span></div></div>`;

  /** Same structure as home 7G:7I (MECHANICAL DESIGN): dot + .dgSkillHeading; left-aligned text. */
  const latestLatestHtml = `<div class="dgMergeContent dgLatestLive"><div class="dgCornerDot dgLatestLive-dot" aria-hidden="true"></div><div class="dgSkillHeading dgSkillHeading--left dgLatestLive-label"><span class="dgLatestLive-labelInner">LATEST</span></div></div>`;

  /**
   * 2D:3F merge: white box from B column center → F right (left -50%, width 150% of D–F).
   * --article-top: row-3 top inside the 2-row merge (row2 height / (row2+row3) * 100%).
   * overflow visible so the box can extend over B–C (2A:4C).
   */
  const hRow2 = rowHeightPx(2);
  const hRow3 = rowHeightPx(3);
  const articleTopPct = (hRow2 / (hRow2 + hRow3)) * 100;
  const latestArticleTitleHtml = `<div class="dgMergeContent dgMergeContent--articleTitleHost" style="--article-top:${articleTopPct}%"><div class="dgArticleTitleBox"><a class="dgArticleTitleLink" href="#"><div class="dgArticleTitleText">Latest Article Title</div></a></div></div>`;

  const newsMetaRowHtml = `<div class="dgMergeContent dgMergeContent--newsMeta"><span class="dgNewsMeta__cat">Category</span><span class="dgNewsMeta__date">YYYY/MM/DD</span></div>`;

  /** All + plausible news categories (matches content slugs where applicable). */
  const NEWS_FILTER_ITEMS = [
    { slug: "all", label: "All" },
    { slug: "announcement", label: "Announcement" },
    { slug: "achievement", label: "Achievement" },
    { slug: "activity", label: "Activity" },
    { slug: "media", label: "Media" },
    { slug: "interview", label: "Interview" },
  ];

  const getNewsCategoryLabel = (slug) => {
    const s = String(slug || "").toLowerCase();
    const row = NEWS_FILTER_ITEMS.find((x) => x.slug === s);
    return row ? row.label : slug || "—";
  };

  const matchesNewsSearch = (entry, query) => {
    const q = String(query || "").trim().toLowerCase();
    if (!q) return true;
    const hay = [
      entry.title_ja,
      entry.title_en,
      entry.title,
      entry.date,
      entry.category,
      entry.body_ja,
      entry.body_en,
      entry.body,
      entry.url,
    ]
      .join("\n")
      .toLowerCase();
    return hay.includes(q);
  };

  const filterNewsArticles = (articles, categorySlug, searchQuery) => {
    let list = Array.isArray(articles) ? articles.slice() : [];
    const cat = String(categorySlug || "all").toLowerCase();
    if (cat && cat !== "all") {
      list = list.filter((a) => String(a.category).toLowerCase() === cat);
    }
    return list.filter((a) => matchesNewsSearch(a, searchQuery));
  };

  const newsViewState = {
    allArticles: [],
    selectedCategory: "all",
    searchQuery: "",
  };

  const updateNewsHeroRow = (hero) => {
    const titleEl = root.querySelector(".dgArticleTitleText");
    const titleLink = root.querySelector(".dgArticleTitleLink");
    const photoLink = root.querySelector(".newsGridPhotoLayer__link");
    const catEl = root.querySelector(".dgNewsMeta__cat");
    const dateEl = root.querySelector(".dgNewsMeta__date");
    const imgEl = root.querySelector(".newsGridPhotoLayer__img");

    if (hero) {
      if (titleEl) titleEl.textContent = hero.title;
      if (titleLink) {
        titleLink.href = hero.url || "#";
        titleLink.setAttribute("aria-label", hero.title);
        titleLink.style.pointerEvents = "";
      }
      if (photoLink) {
        photoLink.href = hero.url || "#";
        photoLink.setAttribute("aria-label", hero.title);
        photoLink.style.pointerEvents = "";
      }
      if (catEl) catEl.textContent = getNewsCategoryLabel(hero.category);
      if (dateEl) dateEl.textContent = hero.date;
      if (imgEl) {
        imgEl.src = hero.thumbnail;
        imgEl.alt = hero.title;
      }
    } else {
      if (titleEl) titleEl.textContent = "No articles yet";
      if (titleLink) {
        titleLink.href = "#";
        titleLink.removeAttribute("aria-label");
        titleLink.style.pointerEvents = "none";
      }
      if (photoLink) {
        photoLink.href = "#";
        photoLink.removeAttribute("aria-label");
        photoLink.style.pointerEvents = "none";
      }
      if (catEl) catEl.textContent = "—";
      if (dateEl) dateEl.textContent = "—";
      if (imgEl) {
        imgEl.src = fallbackThumb;
        imgEl.alt = "";
      }
    }
  };

  const escAttr = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");

  const newsFilterButtonsHtml = NEWS_FILTER_ITEMS.map((item, i) => {
    const selected = i === 0;
    const selClass = selected ? " is-selected" : "";
    const pressed = selected ? "true" : "false";
    return `<button type="button" class="newsFilterBtn${selClass}" data-news-filter="${escAttr(item.slug)}" aria-pressed="${pressed}">${escAttr(item.label)}</button>`;
  }).join("");

  const newsFilterBarHtml = `<div class="dgMergeContent dgMergeContent--newsFilters">${newsFilterButtonsHtml}</div>`;

  const newsSearchIconSrc = [basePath, "public/images/search-icon.png"].filter(Boolean).join("/").replace(/\/+/g, "/");
  const newsSearchHtml = `<div class="dgMergeContent dgMergeContent--newsSearch"><div class="newsSearchBox" role="search"><img class="newsSearchBox__icon" src="${escAttr(
    newsSearchIconSrc
  )}" width="16" height="16" alt="" aria-hidden="true" /><input type="search" class="newsSearchBox__input" placeholder="Search articles..." autocomplete="off" enterkeyhint="search" /></div></div>`;

  /** 8E:8H — gray pagination shell (filled by JS when items > 15) */
  const newsPaginationHtml = `<div class="dgMergeContent dgMergeContent--newsPagination"><nav class="newsPagination" aria-label="Page navigation" hidden><button type="button" class="newsPagination__edge newsPagination__prev" aria-label="Previous page">‹</button><ol class="newsPagination__list"></ol><button type="button" class="newsPagination__edge newsPagination__next" aria-label="Next page">›</button></nav></div>`;

  const mergeSpecs = [
    { from: "1A", to: "1F", cls: "dgWhite", html: newsTitleHtml },
    { from: "1G", to: "1I", cls: "" },
    { from: "1J", to: "1L", cls: "" },
    { from: "2A", to: "4C", cls: "", html: latestLatestHtml },
    { from: "2D", to: "3F", cls: "dgMerge--overflowVisible", html: latestArticleTitleHtml },
    { from: "4D", to: "4F", cls: "", html: newsMetaRowHtml },
    { from: "2G", to: "4L", cls: "newsGridMerge--2g4l", html: '<div class="dgImageCorners dgImageCorners--inward"></div>' },
    { from: "5A", to: "5C", cls: "" },
    { from: "5D", to: "5F", cls: "" },
    { from: "5G", to: "5I", cls: "" },
    { from: "5J", to: "5L", cls: "" },
    { from: "6A", to: "6F", cls: "newsGridMerge--row6Filters", html: newsFilterBarHtml },
    { from: "6G", to: "6L", cls: "", html: newsSearchHtml },
    { from: "7A", to: "7B", cls: "" },
    { from: "7C", to: "7D", cls: "" },
    { from: "7E", to: "7F", cls: "" },
    { from: "7G", to: "7H", cls: "" },
    { from: "7I", to: "7J", cls: "" },
    { from: "7K", to: "7L", cls: "" },
    { from: "8A", to: "8B", cls: "" },
    { from: "8C", to: "8D", cls: "" },
    { from: "8E", to: "8H", cls: "newsGridMerge--pagination", html: newsPaginationHtml },
    { from: "8I", to: "8J", cls: "" },
    { from: "8K", to: "8L", cls: "" },
    { from: "9A", to: "9B", cls: "" },
    { from: "9C", to: "9D", cls: "" },
    { from: "9E", to: "9F", cls: "" },
    { from: "9G", to: "9H", cls: "" },
    { from: "9I", to: "9J", cls: "" },
    { from: "9K", to: "9L", cls: "" },
  ];

  const covered = new Set();
  const key = (r, c) => `${r}:${c}`;

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
    const el = makeCell("dgCell dgHead dgRow", String(r));
    el.style.gridRow = String(1 + r);
    el.style.gridColumn = "1";
    frag.appendChild(el);
  }

  for (const spec of mergeSpecs) {
    const a = parseRef(spec.from);
    const b = parseRef(spec.to);
    const r1 = Math.min(a.row, b.row);
    const r2 = Math.max(a.row, b.row);
    const c1 = Math.min(a.col, b.col);
    const c2 = Math.max(a.col, b.col);

    for (let r = r1; r <= r2; r++) {
      for (let c = c1; c <= c2; c++) covered.add(key(r, c));
    }

    const el = makeCell(`dgCell dgMerge ${spec.cls}`.trim(), "");
    if (spec.html) {
      el.innerHTML = spec.html;
    }
    /* 空マージは座標テキストを出さない（CSS未適用時のゴースト表示を防ぐ） */
    el.style.gridRow = `${1 + r1} / ${1 + r2 + 1}`;
    el.style.gridColumn = `${1 + c1} / ${1 + c2 + 1}`;
    if (r2 === ROWS) el.classList.add("dgNoBottomEdge");
    frag.appendChild(el);
  }

  for (let r = 1; r <= ROWS; r++) {
    for (let c = 1; c <= COLS; c++) {
      if (covered.has(key(r, c))) continue;
      const el = makeCell("dgCell dgBody", "");
      if (r === ROWS) el.classList.add("dgNoBottomEdge");
      el.style.gridRow = String(1 + r);
      el.style.gridColumn = String(1 + c);
      frag.appendChild(el);
    }
  }

  root.appendChild(frag);

  /** 7A:7L repeater overlay (罫線は下層セル、z-index で上に表示) */
  const row7RepeaterLayer = document.createElement("div");
  row7RepeaterLayer.className = "newsGridRow7RepeaterLayer";
  const ref7A = parseRef("7A");
  const ref7L = parseRef("7L");
  row7RepeaterLayer.style.gridRow = `${1 + ref7A.row} / ${1 + ref7A.row + 1}`;
  row7RepeaterLayer.style.gridColumn = `${1 + ref7A.col} / ${1 + ref7L.col + 1}`;
  const row7RepeaterWrap = document.createElement("div");
  row7RepeaterWrap.className = "newsGridRow7RepeaterWrap";
  const row7RepeaterHost = document.createElement("div");
  row7RepeaterHost.className = "newsGridRow7Repeater";
  row7RepeaterHost.setAttribute("data-max-items", "15");
  row7RepeaterWrap.appendChild(row7RepeaterHost);
  row7RepeaterLayer.appendChild(row7RepeaterWrap);
  root.appendChild(row7RepeaterLayer);

  /** 3G:3L overlay: sample-news.png above grid lines; height = row 3; H-center at I|J (center of G–L). */
  const newsPhotoSrc = [basePath, "public/images/sample-news.png"].filter(Boolean).join("/").replace(/\/+/g, "/");
  const cornerAccentArrowSrc = [basePath, "public/images/corner-accent-arrow.png"].filter(Boolean).join("/").replace(/\/+/g, "/");
  const photoLayer = document.createElement("div");
  photoLayer.className = "newsGridPhotoLayer";
  const refG = parseRef("3G");
  const refL = parseRef("3L");
  const r3 = refG.row;
  photoLayer.style.gridRow = `${1 + r3} / ${1 + r3 + 1}`;
  photoLayer.style.gridColumn = `${1 + refG.col} / ${1 + refL.col + 1}`;
  const photoLink = document.createElement("a");
  photoLink.className = "newsGridPhotoLayer__link";
  photoLink.href = "#";
  const newsPhotoFrame = document.createElement("div");
  newsPhotoFrame.className = "newsGridPhotoLayer__frame";
  const newsPhotoImg = document.createElement("img");
  newsPhotoImg.className = "newsGridPhotoLayer__img";
  newsPhotoImg.src = newsPhotoSrc;
  newsPhotoImg.alt = "";
  newsPhotoFrame.appendChild(newsPhotoImg);
  const newsPhotoCornerAccent = document.createElement("div");
  newsPhotoCornerAccent.className = "newsGridPhotoLayer__cornerAccent";
  newsPhotoCornerAccent.setAttribute("aria-hidden", "true");
  const newsPhotoCornerArrow = document.createElement("img");
  newsPhotoCornerArrow.className = "newsGridPhotoLayer__cornerAccentArrow";
  newsPhotoCornerArrow.src = cornerAccentArrowSrc;
  newsPhotoCornerArrow.alt = "";
  newsPhotoCornerArrow.setAttribute("aria-hidden", "true");
  newsPhotoCornerAccent.appendChild(newsPhotoCornerArrow);
  newsPhotoFrame.appendChild(newsPhotoCornerAccent);
  photoLink.appendChild(newsPhotoFrame);
  photoLayer.appendChild(photoLink);
  root.appendChild(photoLayer);

  /** 3×5 グリッド＝1ページあたり最大15件。16件以上でページネーションと連動 */
  const NEWS_REPEATER_PAGE_SIZE = 15;
  /** リピーターは行優先で並べ、同じ列（縦）のカード高さを列内最大に揃える */
  const NEWS_REPEATER_NUM_COLS = 3;

  const createRow7RepeaterCard = (entry) => {
    const item = document.createElement("div");
    item.className = "newsGridRow7RepeaterItem";
    const inner = document.createElement("div");
    inner.className = "newsGridLatestCardInner newsGridLatestCardInner--repeater";
    const slide = document.createElement("div");
    slide.className = "dgCarousel26Slide newsGridLatestCardSlide";
    const link = document.createElement("a");
    link.className = "newsGridLatestCard__link";
    link.href = entry.url || "#";
    const article = document.createElement("article");
    article.className = "latestNewsCard newsGridLatestCard__article";
    const media = document.createElement("div");
    media.className = "newsGridLatestCard__media";
    const img = document.createElement("img");
    img.className = "latestNewsCard__thumbnail";
    img.src = entry.thumbnail;
    img.alt = entry.title;
    const mediaHost = document.createElement("div");
    mediaHost.className = "newsGridRow7Card__mediaHost";
    const corner = document.createElement("div");
    corner.className = "newsGridRow7Card__cornerAccent";
    corner.setAttribute("aria-hidden", "true");
    const cornerArrow = document.createElement("img");
    cornerArrow.className = "newsGridRow7Card__cornerAccentArrow";
    cornerArrow.src = cornerAccentArrowSrc;
    cornerArrow.alt = "";
    cornerArrow.setAttribute("aria-hidden", "true");
    corner.appendChild(cornerArrow);
    /* 青四角をメディア内に置き、hover の scale が画像と一体で効く */
    media.append(img, corner);
    mediaHost.appendChild(media);
    const title = document.createElement("h3");
    title.className = "latestNewsCard__title";
    title.textContent = entry.title;
    const date = document.createElement("time");
    date.className = "latestNewsCard__date";
    date.textContent = entry.date;
    article.append(mediaHost, title, date);
    link.appendChild(article);
    slide.appendChild(link);
    inner.appendChild(slide);
    item.appendChild(inner);
    return item;
  };

  const balanceRepeaterColumnCardHeights = (host) => {
    if (!host) return;
    const cols = host.querySelectorAll(":scope > .newsGridRow7Column");
    if (!cols.length) return;
    cols.forEach((col) => {
      const items = col.querySelectorAll(":scope > .newsGridRow7RepeaterItem");
      items.forEach((el) => {
        el.style.minHeight = "";
      });
    });
    void host.offsetHeight;
    cols.forEach((col) => {
      const items = [...col.querySelectorAll(":scope > .newsGridRow7RepeaterItem")];
      if (items.length === 0) return;
      let maxH = 0;
      for (const el of items) {
        maxH = Math.max(maxH, el.scrollHeight);
      }
      for (const el of items) {
        el.style.minHeight = `${maxH}px`;
      }
    });
  };

  const wireRepeaterImagesForColumnBalance = (host) => {
    if (!host) return;
    host.querySelectorAll("img").forEach((img) => {
      if (img.complete) return;
      img.addEventListener(
        "load",
        () => {
          balanceRepeaterColumnCardHeights(host);
          layoutNewsRow7();
        },
        { once: true }
      );
    });
  };

  const pageNumberSlots = (current, total) => {
    if (total <= 1) return [1];
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = new Set([1, total]);
    for (let i = current - 2; i <= current + 2; i++) {
      if (i >= 1 && i <= total) pages.add(i);
    }
    const sorted = [...pages].sort((a, b) => a - b);
    const out = [];
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) out.push("ellipsis");
      out.push(sorted[i]);
    }
    return out;
  };

  /** Row 6: grow height when filter buttons wrap; center filter cluster; search field centered vertically in 6G:6L (CSS). */
  const NEWS_DATA_ROW_6 = 6;
  const NEWS_DATA_ROW_7 = 7;
  /** リピーター上端・下端から 7 行目の行境界まで（CSS の padding と一致） */
  const ROW7_EDGE_PAD_TOP = 60;
  const ROW7_EDGE_PAD_BOTTOM = 0;

  /**
   * リピーターが空のとき、1段分（カード1〜3枚と同じ1行）の高さを測る。
   * body 直下だと #newsGrid 配下用の CSS が効かず画像が縦に伸びて異常値になるため、必ず root (#newsGrid) 内に置く。
   */
  const measureRow7RepeaterOneRowHeightPx = (repeaterEl) => {
    const probeEntry = newsViewState.allArticles[0] || latestNewsFallback;
    const scratch = document.createElement("div");
    scratch.className = repeaterEl.className;
    scratch.setAttribute("aria-hidden", "true");
    const w = Math.max(1, Math.ceil(repeaterEl.getBoundingClientRect().width));
    scratch.style.cssText = `position:absolute;left:-10000px;top:0;width:${w}px;visibility:hidden;pointer-events:none;box-sizing:border-box;`;
    for (let c = 0; c < NEWS_REPEATER_NUM_COLS; c++) {
      const col = document.createElement("div");
      col.className = "newsGridRow7Column";
      col.appendChild(createRow7RepeaterCard(probeEntry));
      scratch.appendChild(col);
    }
    root.appendChild(scratch);
    balanceRepeaterColumnCardHeights(scratch);
    const h = Math.ceil(scratch.offsetHeight);
    root.removeChild(scratch);
    return h;
  };

  const layoutNewsRow7 = () => {
    const repeater = root.querySelector(".newsGridRow7Repeater");
    if (!repeater) return;

    const row7Min = BASE_ROW_PX;
    rowHeights[NEWS_DATA_ROW_7] = "3200px";
    applyGridTemplateRows();
    void root.offsetHeight;

    let contentH;
    if (repeater.children.length === 0) {
      contentH = measureRow7RepeaterOneRowHeightPx(repeater);
    } else {
      contentH = Math.ceil(repeater.offsetHeight);
    }

    const total = Math.max(row7Min, contentH + ROW7_EDGE_PAD_TOP + ROW7_EDGE_PAD_BOTTOM);
    rowHeights[NEWS_DATA_ROW_7] = `${total}px`;
    applyGridTemplateRows();
    void root.offsetHeight;
  };

  if (typeof ResizeObserver !== "undefined") {
    const row7ObsTarget = root.querySelector(".newsGridRow7Repeater");
    if (row7ObsTarget) {
      const row7Ro = new ResizeObserver(() => {
        balanceRepeaterColumnCardHeights(row7ObsTarget);
        layoutNewsRow7();
      });
      row7Ro.observe(row7ObsTarget);
    }
  }

  const newsRepeaterState = {
    items: [],
    page: 1,
    pageSize: NEWS_REPEATER_PAGE_SIZE,
  };

  const renderPaginationUi = (current, totalPages, totalItems) => {
    const nav = root.querySelector(".newsPagination");
    if (!nav) return;
    const needsPagination = totalItems > NEWS_REPEATER_PAGE_SIZE;
    nav.hidden = !needsPagination;
    if (!needsPagination) return;

    const prev = nav.querySelector(".newsPagination__prev");
    const next = nav.querySelector(".newsPagination__next");
    const list = nav.querySelector(".newsPagination__list");
    if (!prev || !next || !list) return;

    prev.disabled = current <= 1;
    next.disabled = current >= totalPages;

    list.replaceChildren();
    const slots = pageNumberSlots(current, totalPages);
    for (const slot of slots) {
      const li = document.createElement("li");
      if (slot === "ellipsis") {
        const span = document.createElement("span");
        span.className = "newsPagination__ellipsis";
        span.setAttribute("aria-hidden", "true");
        span.textContent = "…";
        li.appendChild(span);
      } else if (slot === current) {
        const span = document.createElement("span");
        span.className = "newsPagination__num is-current";
        span.setAttribute("aria-current", "page");
        span.textContent = String(slot);
        li.appendChild(span);
      } else {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "newsPagination__num";
        btn.dataset.page = String(slot);
        btn.textContent = String(slot);
        li.appendChild(btn);
      }
      list.appendChild(li);
    }
  };

  const renderNewsRepeaterView = () => {
    const { items, pageSize } = newsRepeaterState;
    const totalItems = items.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const needsPagination = totalItems > NEWS_REPEATER_PAGE_SIZE;

    let page = newsRepeaterState.page;
    if (!needsPagination) page = 1;
    else page = Math.min(Math.max(1, page), totalPages);
    newsRepeaterState.page = page;

    const start = needsPagination ? (page - 1) * pageSize : 0;
    const slice = items.slice(start, start + (needsPagination ? pageSize : items.length));

    const host = root.querySelector(".newsGridRow7Repeater");
    if (host) {
      host.replaceChildren();
      if (slice.length === 0) {
        layoutNewsRow7();
      } else {
        for (let c = 0; c < NEWS_REPEATER_NUM_COLS; c++) {
          const col = document.createElement("div");
          col.className = "newsGridRow7Column";
          for (let r = 0; r * NEWS_REPEATER_NUM_COLS + c < slice.length; r++) {
            const idx = r * NEWS_REPEATER_NUM_COLS + c;
            if (idx < slice.length) col.appendChild(createRow7RepeaterCard(slice[idx]));
          }
          if (col.childElementCount > 0) host.appendChild(col);
        }
        requestAnimationFrame(() => {
          balanceRepeaterColumnCardHeights(host);
          wireRepeaterImagesForColumnBalance(host);
          layoutNewsRow7();
        });
      }
    }

    renderPaginationUi(page, totalPages, totalItems);
    if (!host) layoutNewsRow7();
  };

  root.addEventListener("click", (e) => {
    const nav = e.target.closest(".newsPagination");
    if (!nav || !root.contains(nav) || nav.hidden) return;

    const totalItems = newsRepeaterState.items.length;
    if (totalItems <= NEWS_REPEATER_PAGE_SIZE) return;

    const totalPages = Math.max(1, Math.ceil(totalItems / newsRepeaterState.pageSize));
    const prev = e.target.closest(".newsPagination__prev");
    const next = e.target.closest(".newsPagination__next");
    const num = e.target.closest(".newsPagination__num[data-page]");

    if (prev && !prev.disabled) {
      newsRepeaterState.page -= 1;
      renderNewsRepeaterView();
      e.preventDefault();
    } else if (next && !next.disabled) {
      newsRepeaterState.page += 1;
      renderNewsRepeaterView();
      e.preventDefault();
    } else if (num) {
      const p = parseInt(num.dataset.page, 10);
      if (!Number.isNaN(p) && p >= 1 && p <= totalPages) {
        newsRepeaterState.page = p;
        renderNewsRepeaterView();
      }
      e.preventDefault();
    }
  });

  root.addEventListener("news:filter", (e) => {
    newsViewState.selectedCategory = e.detail?.category ?? "all";
    applyNewsView();
  });

  const layoutNewsRow6 = () => {
    const bar = root.querySelector(".dgMergeContent--newsFilters");
    const searchWrap = root.querySelector(".dgMergeContent--newsSearch");
    if (!bar || !searchWrap) return;

    const row6Min = rowHeightPx(NEWS_DATA_ROW_6);
    const searchBox = searchWrap.querySelector(".newsSearchBox");
    if (searchBox) searchBox.style.marginTop = "";

    rowHeights[NEWS_DATA_ROW_6] = "2400px";
    applyGridTemplateRows();
    bar.classList.add("newsFilters--measure");
    searchWrap.classList.add("newsSearch--measure");
    void root.offsetHeight;

    const barNatural = Math.ceil(bar.offsetHeight);
    const searchNatural = Math.ceil(searchWrap.offsetHeight);

    bar.classList.remove("newsFilters--measure");
    searchWrap.classList.remove("newsSearch--measure");

    const merged = Math.max(row6Min, barNatural, searchNatural);
    rowHeights[NEWS_DATA_ROW_6] = `${merged}px`;
    applyGridTemplateRows();
    void root.offsetHeight;
  };

  const initNewsFilterBar = () => {
    const bar = root.querySelector(".dgMergeContent--newsFilters");
    if (!bar) return;
    bar.addEventListener("click", (e) => {
      const btn = e.target.closest(".newsFilterBtn");
      if (!btn || !bar.contains(btn)) return;
      bar.querySelectorAll(".newsFilterBtn").forEach((b) => {
        b.classList.remove("is-selected");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("is-selected");
      btn.setAttribute("aria-pressed", "true");
      root.dispatchEvent(
        new CustomEvent("news:filter", {
          detail: { category: btn.dataset.newsFilter ?? "all" },
          bubbles: true,
        })
      );
    });
  };

  initNewsFilterBar();

  const fitTitleBlock = () => {
    const el = root.querySelector('[data-fit="title-block"]');
    if (!el) return;
    const box = el.closest(".dgMergeContent");
    if (!box) return;

    const max = 160;
    const min = 10;
    const padL = parseFloat(getComputedStyle(box).paddingLeft) || 0;
    const padR = parseFloat(getComputedStyle(box).paddingRight) || 0;
    const padT = parseFloat(getComputedStyle(box).paddingTop) || 0;
    const padB = parseFloat(getComputedStyle(box).paddingBottom) || 0;
    const availW = box.clientWidth - padL - padR;
    const availH = box.clientHeight - padT - padB;
    if (availW <= 0 || availH <= 0) return;

    let lo = min;
    let hi = max;
    let best = min;

    const fits = (px) => {
      el.style.fontSize = `${px}px`;
      const spans = Array.from(el.querySelectorAll("span"));
      if (spans.length === 0) return false;
      const lineMaxW = Math.max(...spans.map((s) => s.getBoundingClientRect().width));
      const h = el.getBoundingClientRect().height;
      return lineMaxW <= availW - 1 && h <= availH - 1;
    };

    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (fits(mid)) {
        best = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }

    el.style.fontSize = `${best}px`;
  };

  /** 3行目 LATEST＝常に全体で最新1件。7行目＝検索・カテゴリ適用後（ヒーローと同一記事は重複しない） */
  function applyNewsView() {
    const all = newsViewState.allArticles;
    const globalLatest = all.length ? all[0] : null;
    updateNewsHeroRow(globalLatest);

    const filtered = filterNewsArticles(all, newsViewState.selectedCategory, newsViewState.searchQuery);
    const heroUrl = String(globalLatest?.url ?? "");
    const rest = heroUrl ? filtered.filter((e) => String(e.url ?? "") !== heroUrl) : filtered.slice();

    newsRepeaterState.items = rest;
    newsRepeaterState.page = 1;
    renderNewsRepeaterView();
    requestAnimationFrame(() => fitTitleBlock());
  }

  const initNewsSearch = () => {
    const input = root.querySelector(".newsSearchBox__input");
    if (!input) return;
    input.addEventListener("input", () => {
      newsViewState.searchQuery = input.value;
      applyNewsView();
    });
  };
  initNewsSearch();

  newsViewState.allArticles = loadLatestNewsAll();
  applyNewsView();

  /** Same character-reveal animation as home `initScrambleOnVisible` (main.js). */
  const initNewsTitleScramble = () => {
    const targets = Array.from(root.querySelectorAll("[data-scramble]"));
    if (targets.length === 0) return;

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-";

    const getLines = (el) => {
      const spans = Array.from(el.querySelectorAll("span"));
      if (spans.length > 0) return spans.map((s) => s.textContent ?? "");
      return [el.textContent ?? ""];
    };

    const setLines = (el, lines) => {
      const spans = Array.from(el.querySelectorAll("span"));
      if (spans.length > 0) {
        spans.forEach((s, i) => {
          s.textContent = lines[i] ?? "";
        });
      } else {
        el.textContent = lines[0] ?? "";
      }
    };

    const scrambleLine = (setText, finalText, opts) =>
      new Promise((resolve) => {
        const start = performance.now();
        const durationMs = opts?.durationMs ?? 850;
        const frameMs = opts?.frameMs ?? 28;

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
          setText(out);

          if (t >= 1) {
            setText(finalText);
            resolve();
            return;
          }
          setTimeout(() => requestAnimationFrame(tick), frameMs);
        };

        requestAnimationFrame(tick);
      });

    const runOnce = (el) => {
      if (el.dataset.scrambled === "1") return;
      el.dataset.scrambled = "1";

      const finals = getLines(el);
      setLines(el, finals.map((t) => t.replace(/[^\s]/g, " ")));

      const spans = Array.from(el.querySelectorAll("span"));
      if (spans.length > 0) {
        Promise.all(
          spans.map((s, i) =>
            scrambleLine((txt) => {
              s.textContent = txt;
            }, finals[i] ?? "", {
              durationMs: 800 + i * 120,
            })
          )
        )
          .then(() => fitTitleBlock())
          .catch(() => {});
      } else {
        scrambleLine((txt) => {
          el.textContent = txt;
        }, finals[0] ?? "", { durationMs: 850 })
          .then(() => fitTitleBlock())
          .catch(() => {});
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          runOnce(e.target);
          io.unobserve(e.target);
          break;
        }
      },
      { threshold: 0.25 }
    );

    targets.forEach((t) => io.observe(t));
  };

  const onNewsGridResize = () => {
    layoutNewsRow6();
    layoutNewsRow7();
    fitTitleBlock();
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      layoutNewsRow6();
      layoutNewsRow7();
      fitTitleBlock();
    });
  });

  initNewsTitleScramble();
  window.addEventListener("resize", onNewsGridResize, { passive: true });
  window.addEventListener("layout:loaded", onNewsGridResize);
})();
