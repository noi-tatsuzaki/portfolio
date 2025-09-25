# Noi Tatsuzaki Portfolio

Portfolio website showcasing robotics, automation, and entrepreneurship projects.

## Features

- Responsive design with modern UI
- Multilingual support (English/Japanese)
- Dynamic content management
- Notion database integration

## Notion 同期（ビルド時）

### セットアップ手順

1. **GitHub Secrets に登録:**
   - `NOTION_TOKEN`: Notion内部統合トークン（DBをその統合に「共有」）
   - `NOTION_DB_ID`: 対象DBのID

2. **手動同期:**
   - GitHub Actions → "Sync Notion to JSON" → Run workflow

3. **定期同期:**
   - 6時間おきに自動実行

4. **出力ファイル:**
   - `public/notion.json`

5. **表示確認:**
   - `sample_notion.html` を開く（`#projects`へ描画）

### プロパティ名の調整

`scripts/fetch-notion.js` の `MAP` オブジェクトを編集して、Notionデータベースのプロパティ名に合わせてください：

```javascript
const MAP = {
  title: ["Name", "Title"],       // title型
  summary: ["Summary", "概要"],   // rich_text
  tags: ["Tags", "タグ"],         // multi_select
  date: ["Date", "日付"],         // date
  url: ["URL", "Link"],           // url
  coverProp: ["Cover"],           // files or url（任意）
};
```

### 画像について

- **推奨:** External URL（外部画像URL）
- **非推奨:** Notion file URL（期限切れのため）

### トラブルシューティング

- **Secrets未設定時:** MOCKデータで動作確認可能
- **JSON取得エラー:** GitHub Actions ログを確認
- **表示されない:** ブラウザの開発者ツールでコンソールエラーを確認

## 開発

### ローカル開発

```bash
# リポジトリをクローン
git clone <repository-url>
cd portfolio

# ローカルサーバーを起動（例：Python）
python -m http.server 8000
```

### ファイル構成

```
├── index.html              # メインポートフォリオページ
├── index.backup.html       # バックアップ
├── sample_notion.html      # Notion連携サンプルページ
├── css/style.css          # スタイルシート
├── assets/
│   ├── js/render-notion.js # Notion描画スクリプト
│   └── works/             # プロジェクト画像
├── scripts/
│   └── fetch-notion.js    # Notion取得スクリプト
├── .github/workflows/
│   └── sync-notion.yml    # GitHub Actions
└── public/
    └── notion.json        # 生成されるNotionデータ
```

## ライセンス

MIT License
