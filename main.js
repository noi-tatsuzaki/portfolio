(() => {
  const COLS = 12; // A-L
  const ROWS = 27; // extended as needed
  const BASE_ROW_PX = 56; // 7 * 8 (8px system)
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").slice(0, COLS);

  const root = document.getElementById("debugGrid");
  if (!root) return;

  // Row height rules (Excel-like row numbers):
  // - Row 1: base * 5
  // - Row 2: base * 2
  // - Row 4: base * 2.5
  // - Others: base
  const multiplierByRow = new Map([
    [1, 5],
    [2, 2],
    [3, 0.7],
    [4, 2.5],
    [6, 1.8],
    [7, 2],
    [8, 2],
    [10, 4],
    [12, 6],
    [15, 4],
    [17, 6],
    [19, 2],
    [20, 5],
    [21, 1.5],
    [22, 3.5],
    [24, 2],
    [26, 7],
  ]);

  const rowHeights = [`${BASE_ROW_PX}px`]; // header row (A-L)
  for (let r = 1; r <= ROWS; r++) {
    const mul = multiplierByRow.get(r) ?? 1;
    rowHeights.push(`${BASE_ROW_PX * mul}px`);
  }
  root.style.gridTemplateRows = rowHeights.join(" ");

  const frag = document.createDocumentFragment();

  const makeCell = (cls, text) => {
    const el = document.createElement("div");
    el.className = cls;
    if (text !== undefined) el.textContent = text;
    return el;
  };

  const colIndex = (letter) => {
    const idx = letters.indexOf(letter.toUpperCase());
    if (idx < 0) throw new Error(`Invalid column: ${letter}`);
    return idx + 1; // 1..12
  };

  const parseRef = (ref) => {
    const m = String(ref).trim().match(/^(\d+)([A-Za-z])$/);
    if (!m) throw new Error(`Invalid ref: ${ref}`);
    return { row: Number(m[1]), col: colIndex(m[2]) };
  };

  const mergeSpecs = [
    {
      from: "1A",
      to: "1F",
      cls: "dgWhite",
      html: '<div class="dgMergeContent dgMergeContent--23pt"><div class="dgHeroTitle" data-fit="hero-title"><span>BUILDING</span><span>THE FUTURE.</span></div></div>',
    },
    { from: "1G", to: "2I", cls: "" },
    { from: "1J", to: "2L", cls: "" },
    { from: "2A", to: "2F", cls: "" },
    {
      from: "3A",
      to: "3L",
      cls: "dgBlack",
      html: '<div class="dgMergeContent dgMergeContent--marquee"><div class="dgMarquee" aria-label="Marquee"><div class="dgMarquee__track"><span class="dgMarquee__text">ROBOTICS DESIGN&nbsp;&nbsp;&nbsp;///&nbsp;&nbsp;&nbsp;MECHANICAL ENGINEERING&nbsp;&nbsp;&nbsp;///&nbsp;&nbsp;&nbsp;STARTUPS&nbsp;&nbsp;&nbsp;///&nbsp;&nbsp;&nbsp;PROTOTYPING&nbsp;&nbsp;&nbsp;///&nbsp;&nbsp;&nbsp;</span><span class="dgMarquee__text" aria-hidden="true">ROBOTICS DESIGN&nbsp;&nbsp;&nbsp;///&nbsp;&nbsp;&nbsp;MECHANICAL ENGINEERING&nbsp;&nbsp;&nbsp;///&nbsp;&nbsp;&nbsp;STARTUPS&nbsp;&nbsp;&nbsp;///&nbsp;&nbsp;&nbsp;PROTOTYPING&nbsp;&nbsp;&nbsp;///&nbsp;&nbsp;&nbsp;</span></div></div></div>',
    },
    { from: "4A", to: "4D", cls: "dgWhite" },
    { from: "4E", to: "4H", cls: "dgWhite" },
    { from: "4I", to: "4L", cls: "dgWhite" },
    { from: "5A", to: "5C", cls: "" },
    { from: "5D", to: "5F", cls: "" },
    { from: "5G", to: "5I", cls: "" },
    { from: "5J", to: "5L", cls: "" },
    {
      from: "6A",
      to: "6F",
      cls: "dgWhite",
      html: '<div class="dgMergeContent dgMergeContent--x23 dgMergeContent--centerBoth"><div class="dgTitle" data-fit="title-block" data-sync="featured" data-scramble="1"><span>WHY I BUILD</span></div></div>',
    },
    { from: "6G", to: "6I", cls: "" },
    { from: "6J", to: "6L", cls: "" },
    { from: "7A", to: "8C", cls: "" },
    { from: "7D", to: "8F", cls: "" },
    { from: "7G", to: "7I", cls: "dgWhite" },
    { from: "7J", to: "7L", cls: "dgWhite" },
    { from: "8G", to: "8I", cls: "dgWhite" },
    { from: "8J", to: "8L", cls: "dgWhite" },
    { from: "9A", to: "13C", cls: "" },
    { from: "9D", to: "13F", cls: "" },
    { from: "9G", to: "13I", cls: "" },
    { from: "9J", to: "13L", cls: "" },
    { from: "14A", to: "18C", cls: "" },
    { from: "14D", to: "18F", cls: "" },
    { from: "14G", to: "18I", cls: "" },
    { from: "14J", to: "18L", cls: "" },
    {
      from: "19A",
      to: "19C",
      cls: "dgWhite",
      html: '<div class="dgMergeContent dgMergeContent--10 dgMergeContent--bottomCenter"><div class="dgTitle dgTitle--center" data-fit="title-block" data-sync="experience" data-scramble="1"><span>EXPERIENCE</span></div></div>',
    },
    { from: "20A", to: "20C", cls: "" },
    { from: "19D", to: "20L", cls: "" },
    {
      from: "21A",
      to: "22F",
      cls: "",
      html: '<div class="dgMergeContent dgMergeContent--23" style="position:relative;"><div class="dgBadge"><div class="dgBadgeText" data-sync="experience" data-box="badge" data-scramble="1">AWARDS</div></div></div>',
    },
    {
      from: "21G",
      to: "22L",
      cls: "",
      html: '<div class="dgMergeContent dgMergeContent--23" style="position:relative;"><div class="dgBadge"><div class="dgBadgeText" data-sync="experience" data-box="badge" data-scramble="1">MEDIA RECOGNITION</div></div></div>',
    },
    { from: "23A", to: "23C", cls: "" },
    { from: "23D", to: "23F", cls: "" },
    { from: "23G", to: "23I", cls: "" },
    { from: "23J", to: "23L", cls: "" },
    {
      from: "24A",
      to: "24F",
      cls: "dgWhite",
      html: '<div class="dgMergeContent dgMergeContent--23 dgMergeContent--centerBoth"><div class="dgTitle" data-fit="title-block" data-scramble="1"><span>LATEST NEWS</span></div></div>',
    },
    { from: "24G", to: "24I", cls: "" },
    { from: "24J", to: "24L", cls: "" },
    { from: "25A", to: "27C", cls: "" },
    { from: "25D", to: "27F", cls: "" },
    { from: "25G", to: "27I", cls: "" },
    { from: "25J", to: "27L", cls: "" },
  ];

  const covered = new Set();
  const key = (r, c) => `${r}:${c}`;
  const inRange = (r, c, r1, c1, r2, c2) =>
    r >= r1 && r <= r2 && c >= c1 && c <= c2;

  const bgSpecs = [
    { from: "9A", to: "13L", img: "public/images/featured-works.png" },
    { from: "14A", to: "18L", img: "public/images/bg-purple.png" },
  ];

  const overlayRects = [
    {
      from: "1G",
      to: "2L",
      html: '<div class="dgMergeContent dgMergeContent--23"><div class="dgPortraitStack"><div class="rect dgInsetRect"></div><img class="dgPortraitImg" src="public/images/noi-portrait.png" width="160" height="160" alt="Portrait" /><div class="dgPortraitNameWrap"><div class="dgPortraitName" data-fit="portrait-name"><span>NOI</span><span>TATSUZAKI</span></div></div></div></div>',
    },
    {
      from: "2A",
      to: "2F",
      html: '<div class="dgMergeContent dgMergeContent--23"><div class="rect dgInsetRect"></div></div>',
    },
    {
      from: "12A",
      to: "12L",
      interactive: true,
      html: '<div class="dgCarousel swiper js-carousel12" aria-label="Carousel"><div class="swiper-wrapper"><div class="swiper-slide dgCarouselSlide">box1</div><div class="swiper-slide dgCarouselSlide">box2</div><div class="swiper-slide dgCarouselSlide">box3</div><div class="swiper-slide dgCarouselSlide">box4</div><div class="swiper-slide dgCarouselSlide">box5</div><div class="swiper-slide dgCarouselSlide">box6</div></div></div>',
    },
    {
      from: "17A",
      to: "17L",
      interactive: true,
      html: '<div class="dgCarousel swiper js-carousel17" aria-label="Carousel"><div class="swiper-wrapper"><div class="swiper-slide dgCarouselSlide">box1</div><div class="swiper-slide dgCarouselSlide">box2</div><div class="swiper-slide dgCarouselSlide">box3</div><div class="swiper-slide dgCarouselSlide">box4</div><div class="swiper-slide dgCarouselSlide">box5</div><div class="swiper-slide dgCarouselSlide">box6</div></div></div>',
    },
    {
      from: "10A",
      to: "10E",
      html: '<div class="dgOverlayFill"><div class="dgOverlayCard dgRectToEcenter"><div class="rect rect--no-left dgInsetRect"></div><div class="dgMergeContent dgMergeContent--23 dgMergeContent--centerBoth"><div class="dgTitle dgTitle--left dgTitle--lh13" data-fit="title-block" data-sync="featured" data-scramble="1"><span>FEATURED</span><span>WORKS</span></div></div></div></div>',
    },
    {
      from: "15A",
      to: "15E",
      html: '<div class="dgOverlayFill"><div class="dgOverlayCard dgRectToEcenter"><div class="rect rect--no-left dgInsetRect"></div><div class="dgMergeContent dgMergeContent--23 dgMergeContent--centerBoth"><div class="dgTitle dgTitle--left dgTitle--lh13" data-fit="title-block" data-scramble="1"><span>FEATURED</span><span>PROJECTS</span></div></div></div></div>',
    },
  ];

  // headers
  const corner = makeCell("dgCell dgHead dgCorner", "");
  corner.style.gridRow = "1";
  corner.style.gridColumn = "1";
  frag.appendChild(corner);

  for (let c = 1; c <= COLS; c++) {
    const el = makeCell("dgCell dgHead", letters[c - 1]);
    el.style.gridRow = "1";
    el.style.gridColumn = String(1 + c); // + row header column
    frag.appendChild(el);
  }

  for (let r = 1; r <= ROWS; r++) {
    const el = makeCell("dgCell dgHead dgRow", String(r));
    el.style.gridRow = String(1 + r); // + header row
    el.style.gridColumn = "1";
    frag.appendChild(el);
  }

  // background images (behind grid lines)
  for (const bg of bgSpecs) {
    const a = parseRef(bg.from);
    const b = parseRef(bg.to);
    const r1 = Math.min(a.row, b.row);
    const r2 = Math.max(a.row, b.row);
    const c1 = Math.min(a.col, b.col);
    const c2 = Math.max(a.col, b.col);

    const el = makeCell("dgBg", "");
    el.style.gridRow = `${1 + r1} / ${1 + r2 + 1}`;
    el.style.gridColumn = `${1 + c1} / ${1 + c2 + 1}`;
    el.style.backgroundImage = `url("${bg.img}")`;
    frag.appendChild(el);
  }

  // overlay rectangles (above cell fills, below grid lines)
  for (const ov of overlayRects) {
    const a = parseRef(ov.from);
    const b = parseRef(ov.to);
    const r1 = Math.min(a.row, b.row);
    const r2 = Math.max(a.row, b.row);
    const c1 = Math.min(a.col, b.col);
    const c2 = Math.max(a.col, b.col);

    const el = makeCell("dgOverlay", "");
    el.style.gridRow = `${1 + r1} / ${1 + r2 + 1}`;
    el.style.gridColumn = `${1 + c1} / ${1 + c2 + 1}`;
    el.innerHTML = ov.html;
    if (ov.interactive) el.style.pointerEvents = "auto";
    frag.appendChild(el);
  }

  // merges
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
    } else {
      el.textContent = `${spec.from}:${spec.to}`;
    }
    el.style.gridRow = `${1 + r1} / ${1 + r2 + 1}`;
    el.style.gridColumn = `${1 + c1} / ${1 + c2 + 1}`;
    frag.appendChild(el);
  }

  // remaining body cells
  for (let r = 1; r <= ROWS; r++) {
    for (let c = 1; c <= COLS; c++) {
      if (covered.has(key(r, c))) continue;
      let cls = "dgCell dgBody";
      const clearRanges = [
        ...bgSpecs.map((x) => ({ from: x.from, to: x.to })),
        ...overlayRects.map((x) => ({ from: x.from, to: x.to })),
      ];
      for (const cr of clearRanges) {
        const a = parseRef(cr.from);
        const b = parseRef(cr.to);
        const r1 = Math.min(a.row, b.row);
        const r2 = Math.max(a.row, b.row);
        const c1 = Math.min(a.col, b.col);
        const c2 = Math.max(a.col, b.col);
        if (inRange(r, c, r1, c1, r2, c2)) {
          cls += " dgClear";
          break;
        }
      }
      const el = makeCell(cls, "");
      el.style.gridRow = String(1 + r);
      el.style.gridColumn = String(1 + c);
      frag.appendChild(el);
    }
  }

  root.appendChild(frag);

  const fitText = (el) => {
    const box = el.closest(".dgMergeContent");
    if (!box) return;

    const max = 140;
    const min = 18;

    // available size inside padding
    const padL = parseFloat(getComputedStyle(box).paddingLeft) || 0;
    const padR = parseFloat(getComputedStyle(box).paddingRight) || 0;
    const padT = parseFloat(getComputedStyle(box).paddingTop) || 0;
    const padB = parseFloat(getComputedStyle(box).paddingBottom) || 0;
    const availW = box.clientWidth - padL - padR;
    const availH = box.clientHeight - padT - padB;
    if (availW <= 0 || availH <= 0) return;

    // binary search font-size so it fits both width and height
    let lo = min;
    let hi = max;
    let best = min;

    const fits = (px) => {
      el.style.fontSize = `${px}px`;
      const spans = Array.from(el.querySelectorAll("span"));
      if (spans.length === 0) return false;
      const lineMaxW = Math.max(...spans.map((s) => s.getBoundingClientRect().width));
      const h = el.getBoundingClientRect().height;
      // small safety margin to avoid 1px overflow due to subpixel rounding
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

  const fitAll = () => {
    document.querySelectorAll('[data-fit="hero-title"]').forEach((el) => fitText(el));
    document
      .querySelectorAll('[data-fit="title-block"]:not([data-sync])')
      .forEach((el) => fitText(el));

    document.querySelectorAll('[data-fit="portrait-name"]').forEach((el) => {
      const wrap = el.closest(".dgPortraitNameWrap");
      if (!wrap) return;

      const cs = getComputedStyle(wrap);
      const padL = parseFloat(cs.paddingLeft) || 0;
      const padR = parseFloat(cs.paddingRight) || 0;
      const padT = parseFloat(cs.paddingTop) || 0;
      const padB = parseFloat(cs.paddingBottom) || 0;

      // inner content box (excluding padding) — this is what the text can occupy
      const availW = wrap.clientWidth - padL - padR;
      const availH = wrap.clientHeight - padT - padB;
      if (availW <= 0 || availH <= 0) return;

      const max = 220;
      const min = 10;

      const fits = (px) => {
        el.style.fontSize = `${px}px`;
        // scroll sizes reflect the real rendered multi-line box
        return el.scrollWidth <= availW && el.scrollHeight <= availH;
      };

      let lo = min;
      let hi = max;
      let best = min;
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
    });
  };

  const fitSyncedText = (key) => {
    const els = Array.from(document.querySelectorAll(`[data-sync="${key}"]`));
    if (els.length === 0) return;

    const getAvail = (el) => {
      if (el.dataset.box === "badge") {
        const box = el.closest(".dgBadge");
        if (!box) return null;
        const cs = getComputedStyle(box);
        const padL = parseFloat(cs.paddingLeft) || 0;
        const padR = parseFloat(cs.paddingRight) || 0;
        const padT = parseFloat(cs.paddingTop) || 0;
        const padB = parseFloat(cs.paddingBottom) || 0;
        return {
          box,
          availW: box.clientWidth - padL - padR,
          availH: box.clientHeight - padT - padB,
        };
      }

      const box = el.closest(".dgMergeContent");
      if (!box) return null;
      const cs = getComputedStyle(box);
      const padL = parseFloat(cs.paddingLeft) || 0;
      const padR = parseFloat(cs.paddingRight) || 0;
      const padT = parseFloat(cs.paddingTop) || 0;
      const padB = parseFloat(cs.paddingBottom) || 0;
      return {
        box,
        availW: box.clientWidth - padL - padR,
        availH: box.clientHeight - padT - padB,
      };
    };

    const max = 160;
    const min = 10;

    const fits = (px) => {
      for (const el of els) {
        el.style.fontSize = `${px}px`;
      }
      for (const el of els) {
        const a = getAvail(el);
        if (!a || a.availW <= 0 || a.availH <= 0) return false;
        if (el.scrollWidth > a.availW || el.scrollHeight > a.availH) return false;
      }
      return true;
    };

    let lo = min;
    let hi = max;
    let best = min;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (fits(mid)) {
        best = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }

    for (const el of els) el.style.fontSize = `${best}px`;
  };

  const scrambleOnceHeroTitle = () => {
    const hero = document.querySelector('[data-fit="hero-title"]');
    if (!hero) return;
    if (hero.dataset.scrambled === "1") return;
    hero.dataset.scrambled = "1";

    const spans = Array.from(hero.querySelectorAll("span"));
    if (spans.length === 0) return;

    const finals = spans.map((s) => s.textContent ?? "");
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-";

    const scrambleLine = (span, finalText, opts) =>
      new Promise((resolve) => {
        const start = performance.now();
        const durationMs = opts?.durationMs ?? 900;
        const frameMs = opts?.frameMs ?? 32;

        const len = finalText.length;
        const tick = (now) => {
          const t = Math.min(1, (now - start) / durationMs);
          const revealed = Math.floor(len * t);

          let out = "";
          for (let i = 0; i < len; i++) {
            if (i < revealed) out += finalText[i];
            else out += chars[(Math.random() * chars.length) | 0];
          }
          span.textContent = out;

          if (t >= 1) {
            span.textContent = finalText;
            resolve();
            return;
          }
          setTimeout(() => requestAnimationFrame(tick), frameMs);
        };

        requestAnimationFrame(tick);
      });

    // Fit to final text size first, then animate without re-fitting mid-scramble.
    spans.forEach((s, i) => (s.textContent = finals[i]));
    fitText(hero);

    // Start first line immediately, second line slightly after for nicer rhythm.
    spans.forEach((s, i) => (s.textContent = finals[i].replace(/./g, " ")));
    scrambleLine(spans[0], finals[0], { durationMs: 800, frameMs: 28 }).catch(() => {});
    setTimeout(() => {
      scrambleLine(spans[1], finals[1], { durationMs: 900, frameMs: 28 }).catch(
        () => {}
      );
    }, 160);
  };

  const initScrambleOnVisible = () => {
    const targets = Array.from(document.querySelectorAll("[data-scramble]"));
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
        spans.forEach((s, i) => (s.textContent = lines[i] ?? ""));
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
      // keep final size (already fit) and avoid mid-animation resize calls
      setLines(el, finals.map((t) => t.replace(/[^\s]/g, " ")));

      const spans = Array.from(el.querySelectorAll("span"));
      if (spans.length > 0) {
        spans.forEach((s, i) => {
          scrambleLine((txt) => (s.textContent = txt), finals[i] ?? "", {
            durationMs: 800 + i * 120,
          }).catch(() => {});
        });
      } else {
        scrambleLine((txt) => (el.textContent = txt), finals[0] ?? "", {
          durationMs: 850,
        }).catch(() => {});
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          runOnce(e.target);
          io.unobserve(e.target);
        }
      },
      { threshold: 0.25 }
    );

    targets.forEach((t) => io.observe(t));
  };

  fitAll();
  fitSyncedText("featured");
  fitSyncedText("experience");
  initScrambleOnVisible();
  scrambleOnceHeroTitle();
  const initCarousel12 = () => {
    const el = document.querySelector(".js-carousel12");
    if (!el) return;
    if (el.dataset.inited === "1") return;
    if (typeof window.Swiper !== "function") return;
    el.dataset.inited = "1";

    // 12A:12L — show 3 boxes, left-aligned at start.
    // Positions:
    // - box1 left = 40px inset
    // - box2 center = center of container (F/G line)
    // - box3 right = 40px inset
    // - spacing = 30px
    // Achieved via offsets + symmetric layout.
    new window.Swiper(el, {
      slidesPerView: "auto",
      spaceBetween: 30,
      slidesOffsetBefore: 40,
      slidesOffsetAfter: 40,
      centeredSlides: false,
      initialSlide: 0,
      speed: 500,
      grabCursor: true,
    });
  };

  const initCarousel17 = () => {
    const el = document.querySelector(".js-carousel17");
    if (!el) return;
    if (el.dataset.inited === "1") return;
    if (typeof window.Swiper !== "function") return;
    el.dataset.inited = "1";

    new window.Swiper(el, {
      slidesPerView: "auto",
      spaceBetween: 30,
      slidesOffsetBefore: 40,
      slidesOffsetAfter: 40,
      centeredSlides: false,
      initialSlide: 0,
      speed: 500,
      grabCursor: true,
    });
  };
  initCarousel12();
  initCarousel17();
  window.addEventListener(
    "resize",
    () => {
      fitAll();
      fitSyncedText("featured");
      fitSyncedText("experience");
    },
    { passive: true }
  );
})();

