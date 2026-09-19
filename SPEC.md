# boorain.space ブログ移行プロジェクト仕様書

**プロジェクト名：** boorain.space（boo's brain）ブログ構築・移行  
**プロジェクト所有者：** Sak（Sakumi Kurosawa）  
**作成日：** 2026年9月19日  
**バージョン：** 1.0

---

## 1. プロジェクト概要

個人創作ブログ「boorain（boo の脳 = 思考空間）」を WordPress.com から Astro + Vercel へ移行するプロジェクトです。カスタムドメイン boorain.space を取得し、自由度の高い static site で運営します。

### プロジェクト目標

- WordPress.com から全記事を Astro ベースの static site に移行
- lime green (#A4D65E) をベースカラーとした独特のビジュアル実装
- GitHub markdown 編集 → Vercel 自動デプロイのワークフロー確立
- セキュアで低コストなホスティング運用

---

## 2. 現状分析

### 現在のプラットフォーム

| 項目 | 内容 |
|------|------|
| **現在のURL** | boorain.wordpress.com |
| **プラットフォーム** | WordPress.com 無料プラン |
| **記事形式** | WordPress ポスト形式 |
| **ビジュアル** | lime green 背景 + Apple SF Symbols |
| **デザイン参考** | /uploads/S__780599300.jpg |

### 課題

- WordPress 無料プランは広告表示
- ドメイン無料枠に制限あり
- Server-side 脆弱性リスク
- ビジュアルカスタマイズが限定的

---

## 3. 目標状態（To-Be）

### プラットフォーク構成

```
boorain.space（お名前.com ドメイン）
    ↓ DNS設定（Vercel nameservers）
GitHub Repository（markdown 管理）
    ↓ Auto-deploy
Vercel（Static site hosting）
```

### ホスティング詳細

| 要素 | サービス | コスト | 特徴 |
|------|---------|--------|------|
| **ドメイン** | お名前.com | ¥3,168/年（2年目以降） | boorain.space |
| **静的サイト生成** | Astro | 無料 | Framework |
| **ホスティング** | Vercel | 無料 | Auto-deploy on push |
| **リポジトリ** | GitHub | 無料 | markdown 管理 |

### ビジュアル仕様

- **背景色：** lime green (#A4D65E)
- **タイポグラフィ：** 大きく、太い sans-serif（-apple-system など）
- **アイコン：** Apple SF Symbols（SVG化、public/icons/ に配置）
- **レイアウト：** 記事タイトル + アイコン グリッド表示

### 編集フロー

```
GitHub web editor（ブラウザ）
    ↓
/src/content/blog/ に markdown ファイル追加
    ↓
Commit & Push
    ↓
Vercel が自動検知 → ビルド（~60秒）
    ↓
boorain.space に反映（即座）
```

---

## 4. ドメイン・インフラ情報

### ドメイン登録

| 項目 | 値 |
|------|-----|
| **ドメイン** | boorain.space |
| **レジストラ** | お名前.com |
| **登録日** | 2026年9月19日 |
| **初年度費用** | ¥0（クーポン割引適用） |
| **2年目以降** | ¥3,168/年 |
| **WHOIS代行** | 無料（お名前.com が代行） |
| **クーポン有効期限** | 2026年9月30日 23:59 |

**登録状態：** ✅ 完了（2026年9月19日）

### DNS設定（Vercel nameservers）

Vercel project 作成後、以下の nameservers に変更します：

```
※ Vercel dashboard → Project Settings → Domains で確認可能
NS1: ns-XXX.vercel-dns.com
NS2: ns-YYY.vercel-dns.com
NS3: ns-ZZZ.vercel-dns.com
NS4: ns-WWW.vercel-dns.com
```

設定手順：
1. お名前.com ダッシュボード → boorain.space → DNS設定
2. 「ネームサーバー設定」で上記を入力
3. 反映待ち（最大24時間）

---

## 5. 実装ステップ

### Phase 1: データ準備

| No. | タスク | 実行者 | ステータス |
|-----|--------|--------|-----------|
| 1-1 | WordPress export（XML） | Sak | ⏳ 予定 |
| 1-2 | Markdown 変換 | Claude | ⏳ 予定 |

### Phase 2: 静的サイト構築

| No. | タスク | コマンド | ステータス |
|-----|--------|---------|-----------|
| 2-1 | Astro プロジェクト初期化 | `npm create astro -- --template blog` | ⏳ 予定 |
| 2-2 | CSS カスタマイズ（lime green + layout） | Manual edit | ⏳ 予定 |
| 2-3 | Apple SF Symbols download・配置 | Manual | ⏳ 予定 |
| 2-4 | Markdown ファイル配置 | Copy to `/src/content/blog/` | ⏳ 予定 |
| 2-5 | ローカル確認 | `npm run dev` | ⏳ 予定 |

### Phase 3: GitHub・Vercel 連携

| No. | タスク | ステータス |
|-----|--------|-----------|
| 3-1 | GitHub repository 作成・初期化 | ⏳ 予定 |
| 3-2 | ローカルから push | ⏳ 予定 |
| 3-3 | Vercel import（GitHub repo連携） | ⏳ 予定 |
| 3-4 | Vercel build・deploy | ⏳ 予定 |
| 3-5 | Vercel nameservers 確認 | ⏳ 予定 |

### Phase 4: DNS設定・反映

| No. | タスク | ステータス |
|-----|--------|-----------|
| 4-1 | お名前.com nameservers 入力 | ⏳ 予定 |
| 4-2 | DNS propagation 確認（24h） | ⏳ 予定 |
| 4-3 | boorain.space アクセス確認 | ⏳ 予定 |

---

## 6. 技術仕様

### ローカル環境

```bash
# 作業ディレクトリ
/Users/sakumi/CTO/ClaudeCode/個人/boorain/

# Node.js version
Node 18+（推奨）

# 主要パッケージ
- astro: Static site generator
- @astrojs/markdown-remark: Markdown parsing
```

### Astro プロジェクト構成

```
/Users/sakumi/CTO/ClaudeCode/個人/boorain/
├── SPEC.md（本仕様書）
├── README.md（ターミナルガイド）
├── package.json
├── astro.config.mjs
├── src/
│   ├── pages/
│   │   ├── index.astro（ホーム）
│   │   └── [slug].astro（個別ページ）
│   ├── layouts/
│   │   └── BlogLayout.astro
│   ├── content/
│   │   └── blog/
│   │       ├── article-1.md
│   │       ├── article-2.md
│   │       └── ...（全WordPress記事）
│   └── styles/
│       └── global.css（lime green & layout）
├── public/
│   └── icons/（Apple SF Symbols SVG）
└── dist/（build output）
```

### Front Matter フォーマット

各 markdown ファイルの先頭：

```yaml
---
title: "記事タイトル"
date: 2026-09-19
icon: "book"（使用するアイコン filename）
---

記事本文...
```

### CSS 主要カラー

```css
:root {
  --color-bg: #A4D65E;      /* lime green */
  --color-text: #000000;    /* black */
  --color-accent: #8B6B8E;  /* soft purple */
}
```

### GitHub Repository 設定

| 項目 | 値 |
|------|-----|
| **リポジトリ名** | boorain-blog |
| **アカウント** | sakeoe15-png |
| **公開設定** | Public |
| **Branch** | main（デフォルト） |
| **.gitignore** | Node 標準（node_modules など） |

### Vercel 設定

| 項目 | 値 |
|------|-----|
| **Framework Preset** | Astro |
| **Build Command** | npm run build |
| **Output Directory** | dist |
| **Install Command** | npm install |
| **Environment Variables** | なし（static site） |
| **Custom Domain** | boorain.space |

---

## 7. セキュリティ・運用方針

### セキュリティ

- **Static site による脆弱性排除** → Server-side コード実行なし
- **HTTPS 自動** → Vercel が Let's Encrypt で対応
- **API keys 不要** → Claude 連携なし（static site のみ）

### 記事編集ポリシー

- GitHub web editor で markdown を直編集
- Draft 機能がないため、Commit = 即公開
- Branch 分け（draft-* など）で運用管理可能

### デプロイ・更新フロー

- **トリガー：** GitHub push to main
- **デプロイ時間：** 30～60秒
- **Rollback：** GitHub history から復帰可能

---

## 8. Vercel Nameservers（設定用）

**※ Vercel project 作成後、以下を確認して入力してください**

```
Vercel Dashboard → [project] → Settings → Domains
→ boorain.space の詳細を開く
→ "Nameservers" セクションを確認
```

通常、以下の形式です（example）：

```
ns1.vercel-dns.com
ns2.vercel-dns.com
ns3.vercel-dns.com
ns4.vercel-dns.com
```

**入力先：** お名前.com → boorain.space → ネームサーバー設定

---

## 9. 参考資料

### ビジュアル参考

- WordPress 現在デザイン: `/uploads/S__780599300.jpg`
- 色コード: #A4D65E（lime green）

### ドキュメント

- Astro 公式: https://astro.build
- Vercel Docs: https://vercel.com/docs
- GitHub: https://docs.github.com

---

## 10. トラブルシューティング

### よくある問題

| 問題 | 原因 | 解決策 |
|------|------|--------|
| nameservers が反映されない | DNS キャッシュ | 24～48時間待機 |
| Vercel build エラー | markdown front matter 不正 | YAML 形式確認 |
| 記事が表示されない | `/src/content/blog/` 外 | ファイルパス確認 |

---

## 11. 承認・署名

| 項目 | 情報 |
|------|------|
| **作成者** | Claude |
| **承認者** | Sak（Sakumi Kurosawa） |
| **作成日** | 2026年9月19日 |
| **承認日** | ⏳ 予定 |

---

**End of Specification**
