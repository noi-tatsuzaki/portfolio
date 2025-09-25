---
title: "Sharky — AI Social Scheduler"
date: 2025-02-01
tags: [ai, web-development, hackathon]
url: ""
cover: "/assets/works/sharky.jpg"
summary: "Developed \"Sharky,\" an AI-powered SNS posting scheduling and content strategy support tool that automatically performs target audience identification, optimal posting time suggestions, content generation, and video script creation from user business ideas and location data. The system uses multiple AI nodes with React.js frontend and Django backend, successfully achieving above-average engagement on TikTok posts."
---

Developed "Sharky," an AI-powered SNS posting scheduling and content strategy support tool. By linking multiple AI nodes, the system automatically performs target audience identification → optimal posting time suggestions → content generation → video script creation from user business ideas and location data.

## 【Technical Information】

### Languages/Frameworks Used:
- Frontend: React.js
- Backend: Django
- Authentication: Supabase Auth

### APIs/Tools Used:
- Google Maps Geolocation API
- APIFY TikTok Data Scraper
- JSON2VIDEO API

### AI Node Architecture:
- Node 1: User location and idea acquisition (chat-based)
- Node 2: Target audience estimation (considering age, affiliation, religion, etc.)
- Node 3: Optimal posting time suggestions
- Content Generator: TikTok post ideas, scripts, and hashtag suggestions
- Video Maker: Automatic short video generation via JSON
- Data Integration: Persona used as common foundation across all nodes

### Results:
- Successfully posted on TikTok with above-average engagement on first post
- Implemented multi-layered AI integration and WebUI

---

## 【技術情報】

### 使用言語/フレームワーク：
- フロントエンド：React.js
- バックエンド：Django
- 認証：Supabase Auth

### 使用API/ツール：
- Google Maps Geolocation API
- APIFY TikTok Data Scraper
- JSON2VIDEO API

### AIノード構成：
- Node 1: ユーザー位置とアイディア取得 (チャットベース)
- Node 2: ターゲット層推定 (年齢・所属・宗教などを考慮)
- Node 3: 投稿に最適な時間帯を提案
- Content Generator: TikTok投稿案とスクリプト、ハッシュタグ提案
- Video Maker: JSON経由でショート動画を自動生成
- データ連携：各ノード間でPersonaを共通基盤として活用

### 成果：
- 実際にTikTok投稿を行い、初投稿で平均以上の反応を得る
- 多層構造のAI連携・WebUIを実装
