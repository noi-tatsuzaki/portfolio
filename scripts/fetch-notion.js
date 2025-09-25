// scripts/fetch-notion.js
// Build-time sync: Notion DB -> public/notion.json
const fs = require("fs");
const path = require("path");

const HAS_SECRETS = !!(process.env.NOTION_TOKEN && process.env.NOTION_DB_ID);

async function main() {
  const outDir = path.join("public");
  const outFile = path.join(outDir, "notion.json");
  fs.mkdirSync(outDir, { recursive: true });

  // Secretsが無い時はMOCKで動作確認
  if (!HAS_SECRETS) {
    const mock = [
      {
        id: "mock-1",
        title: "Sample Project",
        tags: ["demo", "education"],
        url: "https://example.com",
        cover: "/assets/images/sample.jpg",
        summary: "これはNotion連携のデモデータです。",
        date: "2025-07-20",
        lastEdited: new Date().toISOString()
      },
      {
        id: "mock-2",
        title: "Another Work",
        tags: ["work"],
        url: "",
        cover: "",
        summary: "JSONが取得できていれば、このカードも表示されます。",
        date: "2025-06-01",
        lastEdited: new Date().toISOString()
      }
    ];
    fs.writeFileSync(outFile, JSON.stringify(mock, null, 2));
    console.log("No secrets found. Wrote MOCK data to public/notion.json");
    return;
  }

  const { Client } = require("@notionhq/client");
  const notion = new Client({ auth: process.env.NOTION_TOKEN });

  // === あなたのDBに合わせてプロパティ名を調整 ===
  const MAP = {
    title: ["Name", "Title"],       // title型
    summary: ["Summary", "概要"],   // rich_text
    tags: ["Tags", "タグ"],         // multi_select
    date: ["Date", "日付"],         // date
    url: ["URL", "Link"],           // url
    coverProp: ["Cover"],           // files or url（任意）
  };

  const dbId = process.env.NOTION_DB_ID;

  async function queryAll(database_id) {
    let results = [];
    let cursor;
    do {
      const res = await notion.databases.query({
        database_id,
        start_cursor: cursor,
        page_size: 100,
        sorts: [{ timestamp: "last_edited_time", direction: "descending" }],
      });
      results = results.concat(res.results);
      cursor = res.has_more ? res.next_cursor : undefined;
    } while (cursor);
    return results;
  }

  function pickProp(props, names) {
    if (!names) return undefined;
    for (const n of names) if (props[n]) return props[n];
    return undefined;
  }
  const readTitle = p => (p?.title?.[0]?.plain_text || "").trim();
  const readRich  = p => (p?.rich_text?.map(t => t.plain_text).join("") || "").trim();
  const readTags  = p => (p?.multi_select || []).map(t => t.name);
  const readDate  = p => p?.date?.start || "";
  const readURL   = p => p?.url || "";

  function readCover(page, props, MAP) {
    // ページcover（external優先。fileは期限切れのため不採用）
    const pageCover = page.cover?.external?.url || "";
    // プロパティ側（url or files: externalのみ）
    const coverProp = pickProp(page.properties, MAP.coverProp);
    let propCover = "";
    if (coverProp?.type === "url") {
      propCover = coverProp.url || "";
    } else if (coverProp?.type === "files") {
      const f = (coverProp.files || []).find(f => f.type === "external" && f.external?.url);
      if (f) propCover = f.external.url;
    }
    return propCover || pageCover || "";
  }

  const pages = await queryAll(dbId);
  const items = pages.map(page => {
    const props   = page.properties;
    const title   = readTitle(pickProp(props, MAP.title));
    const summary = readRich(pickProp(props, MAP.summary));
    const tags    = readTags(pickProp(props, MAP.tags));
    const date    = readDate(pickProp(props, MAP.date));
    const url     = readURL(pickProp(props, MAP.url)) || page.url;
    const cover   = readCover(page, props, MAP);

    return {
      id: page.id,
      title, summary, tags, date, url, cover,
      lastEdited: page.last_edited_time,
    };
  });

  fs.writeFileSync(outFile, JSON.stringify(items, null, 2));
  console.log(`Wrote ${items.length} items to ${outFile}`);
}

main().catch(err => { console.error(err); process.exit(1); });
