 (async () => {
  const COLS = 12; // A-L
  const ROWS = 27; // extended as needed
  const BASE_ROW_PX = 56; // 7 * 8 (8px system)
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").slice(0, COLS);

  const root = document.getElementById("debugGrid");
  if (!root) return;

  const resolveUrl = (p) => {
    const str = String(p || "").trim();
    if (!str) return "";
    if (/^(https?:)?\/\//i.test(str)) return str;
    return new URL(str, document.baseURI).toString();
  };

  const loadContent = async () => {
    try {
      const res = await fetch(resolveUrl("content.json"), { cache: "no-cache" });
      if (res.ok) return res.json();
    } catch (_) {
      // Fallback for local file previews where fetch can fail.
    }
    return {
      heroTitleLines: ["BUILDING", "THE FUTURE."],
      marqueeItems: [
        "ROBOTICS DESIGN",
        "MECHANICAL ENGINEERING",
        "STARTUPS",
        "PROTOTYPING",
      ],
      stats: [
        { big: "10+", small: "YEARS IN ROBOTICS" },
        { big: "280+", small: "MEDIA APPEARANCES" },
        { big: "5+", small: "PROJECTS" },
      ],
      whyBuild: "WHY I BUILD",
      coreSkillsLabel: "CORE SKILLS:",
      sampleText:
        "this is a sample text block for layout testing. it demonstrates readable body copy inside the grid area. this is a sample text block for layout testing. it demonstrates readable body copy inside the grid area. this is a sample text block for layout testing. it demonstrates readable body copy inside the grid area.",
      skills: {
        leftTop: {
          heading: "MECHANICAL DESIGN",
          pills: ["Autodesk Fusion", "SolidWorks", "3D Printing"],
        },
        rightTop: {
          heading: "PROGRAMMING",
          pills: ["C / C++", "Python", "Java", "JavaScript"],
        },
        leftBottom: {
          heading: "ROBOTICS & HARDWARE",
          pills: ["Arduino", "ESP32", "MQTT", "Sensors", "PID Control"],
        },
        rightBottom: {
          heading: "LANGUAGES",
          pills: ["Japanese (Native)", "English (Fluent)"],
        },
      },
      featuredWorksLines: ["FEATURED", "WORKS"],
      featuredProjectsLines: ["FEATURED", "PROJECTS"],
      experienceTitle: "EXPERIENCE",
      experienceRows: [
        { year: "2024 - Present", role: "FOUNDER & CEO", company: "LINOA Co., Ltd." },
        { year: "2024 - Present", role: "CO-FOUNDER", company: "ADvance Lab" },
        { year: "2024", role: "MECHANICAL ENGINEER INTERN", company: "Eco-Pork" },
        { year: "2023 - 2024", role: "MOLTING GENERATOR", company: "Leave a Nest" },
        {
          year: "2018 - 2023",
          role: "HARDWARE LEADER / TEAM CAPTAIN",
          company: "FRC TEAM 6909 SAKURA TEMPESTA",
        },
      ],
      awardsTitle: "AWARDS",
      awardsRows: [
        { bold: "Forbes JAPAN 30 UNDER 30 2022" },
        { bold: "Masason Foundation ", light: "Scholar" },
        { bold: "Dean's List Finalist Award ", light: "(FIRST Robotics Competition)" },
        { bold: "Chairman's Award ", light: "(FIRST Robotics Competition)" },
      ],
      mediaTitle: "MEDIA RECOGNITION",
      mediaRows: [
        { bold: 'Disney+ Documentary: Featured in "More Than Robots"' },
        { bold: "Lenovo New Realities" },
        { bold: "280+ Media Appearances" },
      ],
      latestNews: "LATEST NEWS",
      viewAllLabel: "View all",
      allWorks: { label: "All Works", count: "15" },
      allProjects: { label: "All Projects", count: "10" },
      profile: {
        nameLines: ["NOI", "TATSUZAKI"],
        bioTop: "Building robots, systems, and future concepts driven by curiosity.",
        bioBottom:
          "LINOA Co., Ltd. | Stevens Institute of Technology | ADvance Lab | ADvance Campus | Forbes JAPAN 30 UNDER 30 2022",
      },
      carousel: {
        worksCaption: "SAMPLE WORKS TITLE",
        projectsCaption: "SAMPLE PROJECT TITLE",
        newsTitle: "Sample article title",
        newsDate: "YYYY/MM/DD",
      },
      images: {
        worksCard: "public/images/sample-works.png",
        newsCard: "public/images/sample-news.png",
        portrait: "public/images/noi-portrait.png",
        bgFeatured: "public/images/featured-works.png",
        bgPurple: "public/images/bg-purple.png",
        bgSkillPhoto:
          "public/images/sample-works.png",
      },
    };
  };
  const C = await loadContent();

  const esc = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const heroHtml = `<div class="dgMergeContent dgMergeContent--23pt"><div class="dgHeroTitle" data-fit="hero-title"><span>${esc(
    C.heroTitleLines[0]
  )}</span><span>${esc(C.heroTitleLines[1])}</span></div></div>`;

  const marqueeLine = `${C.marqueeItems.map(esc).join(
    "&nbsp;&nbsp;&nbsp;///&nbsp;&nbsp;&nbsp;"
  )}&nbsp;&nbsp;&nbsp;///&nbsp;&nbsp;&nbsp;`;
  const marqueeHtml = `<div class="dgMergeContent dgMergeContent--marquee"><div class="dgMarquee" aria-label="Marquee"><div class="dgMarquee__track"><span class="dgMarquee__text">${marqueeLine}</span><span class="dgMarquee__text" aria-hidden="true">${marqueeLine}</span></div></div></div>`;

  const statHtml = (idx) =>
    `<div class="dgMergeContent dgMergeContent--23 dgMergeContent--centerBoth"><div class="dgStat"><div class="dgStat__big">${esc(
      C.stats[idx].big
    )}</div><div class="dgStat__small">${esc(C.stats[idx].small)}</div></div></div>`;

  const pillsHtml = (items) =>
    items.map((x) => `<span class="dgSkillPill">${esc(x)}</span>`).join("");

  const awardsRowsHtml = (rows) =>
    rows
      .map(
        (r) =>
          `<li><span class="dgAwardsList__bold">${esc(r.bold)}</span>${
            r.light
              ? `<span class="dgAwardsList__light">${esc(r.light)}</span>`
              : ""
          }</li>`
      )
      .join("");

  const parseFrontmatter = (md) => {
    const m = String(md).match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
    if (!m) return { data: {}, body: String(md) };
    const raw = m[1];
    const data = {};
    for (const line of raw.split("\n")) {
      const idx = line.indexOf(":");
      if (idx < 0) continue;
      const key = line.slice(0, idx).trim();
      let val = line.slice(idx + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      data[key] = val;
    }
    const body = String(md).slice(m[0].length);
    return { data, body };
  };

  const formatDateYmdSlash = (s) => {
    const str = String(s || "").trim();
    const m = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) return `${m[1]}/${m[2]}/${m[3]}`;
    return str;
  };

  const normalizeAssetPath = (p) => {
    const str = String(p || "").trim();
    if (!str) return "";
    return str.startsWith("/") ? str.slice(1) : str;
  };

  /** YYYY/MM/DD, YYYY-MM-DD, or ISO prefix — for stable sort when Jekyll cannot sort CMS dates. */
  const newsDateSortKey = (raw) => {
    const s = String(raw ?? "").trim();
    let m = s.match(/^(\d{4})\/(\d{2})\/(\d{2})/);
    if (m) return Number(`${m[1]}${m[2]}${m[3]}`);
    m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return Number(`${m[1]}${m[2]}${m[3]}`);
    return 0;
  };

  const loadNewsEntries = async () => {
    const jsonEl = document.getElementById("latest-news-data");
    if (!jsonEl) return [];
    try {
      const parsed = JSON.parse(jsonEl.textContent || "[]");
      if (!Array.isArray(parsed)) return [];
      const sorted = [...parsed].sort(
        (a, b) => newsDateSortKey(b?.date) - newsDateSortKey(a?.date)
      );
      const lang = document.documentElement.lang === "ja" ? "ja" : "en";
      return sorted.slice(0, 10).map((item) => {
        const title =
          lang === "ja"
            ? item?.title_ja || item?.title_en || item?.title
            : item?.title_en || item?.title_ja || item?.title;
        const thumbRaw =
          lang === "ja"
            ? item?.thumbnail_ja || item?.thumbnail_en || item?.thumbnail
            : item?.thumbnail_en || item?.thumbnail_ja || item?.thumbnail;
        return {
          title: title || C.carousel.newsTitle,
          date: formatDateYmdSlash(item?.date || C.carousel.newsDate),
          thumbnail: resolveUrl(
            normalizeAssetPath(thumbRaw || C.images.newsCard)
          ),
        };
      });
    } catch (_) {
      return [];
    }
  };

  const newsEntries = await loadNewsEntries();

  const homeLatestNewsCornerArrowSrc = esc(
    resolveUrl(normalizeAssetPath("public/images/corner-accent-arrow.png"))
  );

  /**
   * Home grid only (#debugGrid): row heights + hidden axis row.
   * Edit here for home. News uses news-grid.js separately.
   */
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

  const rowHeights = ["0px"]; /* collapse A–L header row (not shown on home) */
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
      html: heroHtml,
    },
    { from: "1G", to: "2I", cls: "" },
    { from: "1J", to: "2L", cls: "" },
    { from: "2A", to: "2F", cls: "" },
    {
      from: "3A",
      to: "3L",
      cls: "dgBlack",
      html: marqueeHtml,
    },
    {
      from: "4A",
      to: "4D",
      cls: "dgWhite",
      html: statHtml(0),
    },
    {
      from: "4E",
      to: "4H",
      cls: "dgWhite",
      html: statHtml(1),
    },
    {
      from: "4I",
      to: "4L",
      cls: "dgWhite",
      html: statHtml(2),
    },
    { from: "5A", to: "5C", cls: "" },
    { from: "5D", to: "5F", cls: "" },
    { from: "5G", to: "5I", cls: "" },
    { from: "5J", to: "5L", cls: "" },
    {
      from: "6A",
      to: "6F",
      cls: "dgWhite",
      html: `<div class="dgMergeContent dgMergeContent--x23 dgMergeContent--centerBoth"><div class="dgTitle" data-fit="title-block" data-sync="featured" data-scramble="1"><span>${esc(
        C.whyBuild
      )}</span></div></div>`,
    },
    {
      from: "6G",
      to: "6I",
      cls: "",
      html: `<div class="dgMergeContent dgMergeContent--10 dgMergeContent--bottomCenter"><div class="dgCoreSkills" data-sync="experience"><span>${esc(
        C.coreSkillsLabel
      )}</span></div></div>`,
    },
    { from: "6J", to: "6L", cls: "" },
    {
      from: "7A",
      to: "8C",
      cls: "",
      html: `<div class="dgMergeContent dgMergeContent--10"><p class="dgSampleText">${esc(
        C.sampleText
      )}</p></div>`,
    },
    {
      from: "7D",
      to: "8F",
      cls: "",
      html: '<div class="dgImageCorners"></div>',
    },
    {
      from: "7G",
      to: "7I",
      cls: "dgWhite",
      html: `<div class="dgMergeContent"><div class="dgCornerDot"></div><div class="dgSkillHeading">${esc(
        C.skills.leftTop.heading
      )}</div><div class="dgSkillPillsArea"><div class="dgSkillPills">${pillsHtml(
        C.skills.leftTop.pills
      )}</div></div></div>`,
    },
    {
      from: "7J",
      to: "7L",
      cls: "dgWhite",
      html: `<div class="dgMergeContent"><div class="dgCornerDot"></div><div class="dgSkillHeading">${esc(
        C.skills.rightTop.heading
      )}</div><div class="dgSkillPillsArea"><div class="dgSkillPills">${pillsHtml(
        C.skills.rightTop.pills
      )}</div></div></div>`,
    },
    {
      from: "8G",
      to: "8I",
      cls: "dgWhite",
      html: `<div class="dgMergeContent"><div class="dgCornerDot"></div><div class="dgSkillHeading">${esc(
        C.skills.leftBottom.heading
      )}</div><div class="dgSkillPillsArea"><div class="dgSkillPills">${pillsHtml(
        C.skills.leftBottom.pills
      )}</div></div></div>`,
    },
    {
      from: "8J",
      to: "8L",
      cls: "dgWhite",
      html: `<div class="dgMergeContent"><div class="dgCornerDot"></div><div class="dgSkillHeading">${esc(
        C.skills.rightBottom.heading
      )}</div><div class="dgSkillPillsArea"><div class="dgSkillPills">${pillsHtml(
        C.skills.rightBottom.pills
      )}</div></div></div>`,
    },
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
      html: `<div class="dgMergeContent dgMergeContent--10 dgMergeContent--bottomCenter"><div class="dgTitle dgTitle--center" data-fit="title-block" data-sync="experience" data-scramble="1"><span>${esc(
        C.experienceTitle
      )}</span></div></div>`,
    },
    { from: "20A", to: "20C", cls: "" },
    {
      from: "19D",
      to: "20L",
      cls: "",
      html: `<div class="dgMergeContent dgMergeContent--23"><div class="dgExperienceList">${C.experienceRows
        .map(
          (r) =>
            `<div class="dgExperienceRow"><div class="dgExperienceYear">${esc(
              r.year
            )}</div><div class="dgExperienceMain"><div class="dgExperienceRole">${esc(
              r.role
            )}</div><div class="dgExperienceCompany">${esc(
              r.company
            )}</div></div></div>`
        )
        .join("")}</div></div>`,
    },
    {
      from: "21A",
      to: "22F",
      cls: "",
      html: `<div class="dgMergeContent dgMergeContent--23" style="position:relative;"><div class="dgBadge"><div class="dgBadgeText" data-sync="experience" data-box="badge" data-scramble="1">${esc(
        C.awardsTitle
      )}</div></div><div class="dgAwardsPanel"><ul class="dgAwardsList">${awardsRowsHtml(
        C.awardsRows
      )}</ul></div></div>`,
    },
    {
      from: "21G",
      to: "22L",
      cls: "",
      html: `<div class="dgMergeContent dgMergeContent--23" style="position:relative;"><div class="dgBadge"><div class="dgBadgeText" data-sync="experience" data-box="badge" data-scramble="1">${esc(
        C.mediaTitle
      )}</div></div><div class="dgAwardsPanel"><ul class="dgAwardsList">${awardsRowsHtml(
        C.mediaRows
      )}</ul></div></div>`,
    },
    { from: "23A", to: "23C", cls: "" },
    { from: "23D", to: "23F", cls: "" },
    { from: "23G", to: "23I", cls: "" },
    { from: "23J", to: "23L", cls: "" },
    {
      from: "24A",
      to: "24F",
      cls: "dgWhite",
      html: `<div class="dgMergeContent dgMergeContent--23 dgMergeContent--centerBoth"><div class="dgTitle" data-fit="title-block" data-scramble="1"><span>${esc(
        C.latestNews
      )}</span></div></div>`,
    },
    {
      from: "24G",
      to: "24I",
      cls: "",
      html: `<div class="dgMergeContent dgMergeContent--viewAll"><div class="dgViewAllCluster"><button type="button" class="dgViewAllBox" aria-label="View all"><span class="dgViewAllText">${esc(
        C.viewAllLabel
      )}</span></button><button type="button" class="dgBlackCornerSquare dgBlackCornerSquare--inline" aria-label="View all arrow"><span class="dgBlackCornerArrow">→</span></button></div></div>`,
    },
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
    {
      from: "7D",
      to: "8F",
      img: C.images.bgSkillPhoto,
    },
    { from: "9A", to: "13L", img: C.images.bgFeatured },
    { from: "14A", to: "18L", img: C.images.bgPurple },
  ];

  const overlayRects = [
    {
      from: "1G",
      to: "2L",
      interactive: true,
      html: `<div class="dgMergeContent dgMergeContent--23"><div class="dgPortraitStack"><div class="rect dgInsetRect"></div><img class="dgPortraitImg" src="${esc(
        C.images.portrait
      )}" width="180" height="180" alt="Portrait" /><div class="dgImageCorners dgImageCorners--portrait"></div><div class="dgPortraitNameWrap"><div class="dgPortraitName" data-fit="portrait-name"><span>${esc(
        C.profile.nameLines[0]
      )}</span><span>${esc(
        C.profile.nameLines[1]
      )}</span></div></div><div class="dgPortraitBelow"><div class="dgPortraitBelow__a">${esc(
        C.profile.bioTop
      )}</div><div class="dgPortraitBelow__b">${esc(
        C.profile.bioBottom
      )}</div></div></div></div>`,
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
      html: `<div class="dgCarousel swiper js-carousel12" aria-label="Carousel"><div class="swiper-wrapper">${Array
        .from({ length: 6 })
        .map(
          () =>
            `<div class="swiper-slide dgCarouselSlide"><div class="dgCornerDot"></div><img class="dgCarouselWorkImg" src="${esc(
              C.images.worksCard
            )}" alt="Sample works" /><div class="dgCarouselWorkCaptionArea"><div class="dgCarouselWorkCaption">${esc(
              C.carousel.worksCaption
            )}</div></div></div>`
        )
        .join("")}</div></div>`,
    },
    {
      from: "17A",
      to: "17L",
      interactive: true,
      html: `<div class="dgCarousel swiper js-carousel17" aria-label="Carousel"><div class="swiper-wrapper">${Array
        .from({ length: 6 })
        .map(
          () =>
            `<div class="swiper-slide dgCarouselSlide"><div class="dgCornerDot"></div><img class="dgCarouselWorkImg" src="${esc(
              C.images.worksCard
            )}" alt="Sample works" /><div class="dgCarouselWorkCaptionArea"><div class="dgCarouselWorkCaption">${esc(
              C.carousel.projectsCaption
            )}</div></div></div>`
        )
        .join("")}</div></div>`,
    },
    {
      from: "26A",
      to: "26L",
      interactive: true,
      html: `<div class="dgCarousel swiper js-carousel26" aria-label="Row 26 Carousel"><div class="swiper-wrapper">${newsEntries
        .map(
          (n) =>
            `<div class="swiper-slide dgCarousel26Slide"><article class="latestNewsCard"><div class="homeLatestCard__mediaHost"><div class="latestNewsCard__media"><img class="latestNewsCard__thumbnail" src="${esc(
              n.thumbnail
            )}" alt="${esc(
              n.title
            )}" /><div class="homeLatestCard__cornerAccent" aria-hidden="true"><img class="homeLatestCard__cornerAccentArrow" src="${homeLatestNewsCornerArrowSrc}" alt="" aria-hidden="true" /></div></div></div><h3 class="latestNewsCard__title">${esc(
              n.title
            )}</h3><time class="latestNewsCard__date">${esc(
              n.date
            )}</time></article></div>`
        )
        .join("")}</div></div>`,
    },
    {
      from: "10A",
      to: "10E",
      interactive: true,
      html: `<div class="dgOverlayFill"><div class="dgOverlayCard dgRectToEcenter"><div class="rect rect--no-left dgInsetRect"></div><div class="dgMergeContent dgMergeContent--23 dgMergeContent--centerBoth"><div class="dgTitle dgTitle--left dgTitle--lh13" data-fit="title-block" data-sync="featured" data-scramble="1"><span>${esc(
        C.featuredWorksLines[0]
      )}</span><span>${esc(
        C.featuredWorksLines[1]
      )}</span></div></div></div></div>`,
    },
    {
      from: "10L",
      to: "10L",
      interactive: true,
      html: `<div class="dgOverlayAnchorTopRight"><button type="button" class="dgWhiteCornerRect" aria-label="All works"><div class="dgWhiteRectText"><div class="dgWhiteRectText__top" data-fit="white-meta">${esc(
        C.allWorks.label
      )}</div><div class="dgWhiteRectText__bottom">${esc(
        C.allWorks.count
      )}</div></div></button><button type="button" class="dgBlackCornerSquare" aria-label="Open works"><span class="dgBlackCornerArrow">→</span></button></div>`,
    },
    {
      from: "15A",
      to: "15E",
      interactive: true,
      html: `<div class="dgOverlayFill"><div class="dgOverlayCard dgRectToEcenter"><div class="rect rect--no-left dgInsetRect"></div><div class="dgMergeContent dgMergeContent--23 dgMergeContent--centerBoth"><div class="dgTitle dgTitle--left dgTitle--lh13" data-fit="title-block" data-scramble="1"><span>${esc(
        C.featuredProjectsLines[0]
      )}</span><span>${esc(
        C.featuredProjectsLines[1]
      )}</span></div></div></div></div>`,
    },
    {
      from: "15L",
      to: "15L",
      interactive: true,
      html: `<div class="dgOverlayAnchorTopRight"><button type="button" class="dgWhiteCornerRect" aria-label="All projects"><div class="dgWhiteRectText"><div class="dgWhiteRectText__top" data-fit="white-meta">${esc(
        C.allProjects.label
      )}</div><div class="dgWhiteRectText__bottom">${esc(
        C.allProjects.count
      )}</div></div></button><button type="button" class="dgBlackCornerSquare" aria-label="Open projects"><span class="dgBlackCornerArrow">→</span></button></div>`,
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
    if (r2 === ROWS) el.classList.add("dgNoBottomEdge");
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
      if (r === ROWS) el.classList.add("dgNoBottomEdge");
      el.style.gridRow = String(1 + r);
      el.style.gridColumn = String(1 + c);
      frag.appendChild(el);
    }
  }

  root.appendChild(frag);

  const fitText = (el, opts) => {
    const box = el.closest(".dgMergeContent");
    if (!box) return;

    const max = opts?.max ?? 140;
    const min = opts?.min ?? 18;

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

  const initHeroScrambleOnVisible = () => {
    const hero = document.querySelector('[data-fit="hero-title"]');
    if (!hero) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          scrambleOnceHeroTitle();
          io.disconnect();
          break;
        }
      },
      { threshold: 0.25 }
    );
    io.observe(hero);
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
  initHeroScrambleOnVisible();
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

  const initCarousel26 = () => {
    const el = document.querySelector(".js-carousel26");
    if (!el) return;
    if (el.dataset.inited === "1") return;
    if (typeof window.Swiper !== "function") return;
    el.dataset.inited = "1";

    new window.Swiper(el, {
      slidesPerView: "auto",
      spaceBetween: 80,
      slidesOffsetBefore: 40,
      slidesOffsetAfter: 40,
      centeredSlides: false,
      initialSlide: 0,
      speed: 500,
      grabCursor: true,
    });
  };

  /** LATEST NEWS 行の白「View all」ボタンと隣の黒矢印ボタン → News ページ */
  const initLatestNewsViewAllNav = () => {
    const cluster = document.querySelector(".dgMergeContent--viewAll .dgViewAllCluster");
    if (!cluster) return;
    const base = document.body?.getAttribute("data-base-path")?.trim() || ".";
    const rel = [base, "news/index.html"].join("/").replace(/\/+/g, "/");
    const href = new URL(rel, document.baseURI).href;
    const go = () => {
      window.location.assign(href);
    };
    cluster.querySelector(".dgViewAllBox")?.addEventListener("click", go);
    cluster.querySelector(".dgBlackCornerSquare--inline")?.addEventListener("click", go);
  };

  const fitWhiteMetaLine = () => {
    document.querySelectorAll('[data-fit="white-meta"]').forEach((el) => {
      const box = el.closest(".dgWhiteCornerRect");
      if (!box) return;
      const cs = getComputedStyle(box);
      const padL = parseFloat(cs.paddingLeft) || 0;
      const padR = parseFloat(cs.paddingRight) || 0;
      const availW = box.clientWidth - padL - padR;
      if (availW <= 0) return;

      let lo = 8;
      let hi = 28;
      let best = 8;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        el.style.fontSize = `${mid}px`;
        if (el.scrollWidth <= availW) {
          best = mid;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
      el.style.fontSize = `${best}px`;
    });
  };
  initCarousel12();
  initCarousel17();
  initCarousel26();
  initLatestNewsViewAllNav();
  fitWhiteMetaLine();
  window.addEventListener("layout:loaded", () => {
    initScrambleOnVisible();
  });
  window.addEventListener(
    "resize",
    () => {
      fitAll();
      fitSyncedText("featured");
      fitSyncedText("experience");
      fitWhiteMetaLine();
    },
    { passive: true }
  );
})();

