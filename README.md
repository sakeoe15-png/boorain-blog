# boorain.space ブログ構築 - ターミナル実装ガイド

**プロジェクトディレクトリ：** `/Users/sakumi/CTO/ClaudeCode/個人/boorain/`

---

## クイックスタート

```bash
cd /Users/sakumi/CTO/ClaudeCode/個人/boorain
```

---

## ステップ1: WordPress Export XML の配置

Sak が `/Users/sakumi/CTO/ClaudeCode/個人/` から WordPress export XML をアップロードしたら、以下で移動：

```bash
# WordPress export ファイルをプロジェクトルートに配置
# ファイル名: boorain-export.xml（仮）
cp /path/to/boorain-export.xml /Users/sakumi/CTO/ClaudeCode/個人/boorain/
```

---

## ステップ2: Markdown 変換（Python/pandoc）

```bash
# pandoc で XML → Markdown 変換
pandoc boorain-export.xml -f rst -t markdown -o boorain-posts.md

# または npm 依存ツール使用
npm install -g wordpress-export-to-markdown
wpe2m boorain-export.xml --output-dir ./posts-markdown
```

**出力：** `./posts-markdown/` フォルダ内に markdown ファイル群

---

## ステップ3: Astro Project 初期化

```bash
# Astro blog template で新規プロジェクト初期化
npm create astro -- --template blog --directory .

# 依存パッケージインストール
npm install
```

**生成ファイル構成：**
```
/Users/sakumi/CTO/ClaudeCode/個人/boorain/
├── src/
│   ├── content/blog/       ← markdown ファイルここに配置
│   ├── layouts/
│   ├── pages/
│   └── styles/
├── public/
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

## ステップ4: CSS カスタマイズ（Lime Green）

**ファイル：** `src/styles/global.css`

```css
:root {
  --color-bg: #A4D65E;      /* lime green */
  --color-text: #000000;    /* black */
  --color-accent: #8B6B8E;  /* soft purple（optional） */
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 18px;
  line-height: 1.6;
}

/* ホームページ・グリッド レイアウト */
.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.blog-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.blog-card img {
  width: 48px;
  height: 48px;
}
```

---

## ステップ5: Apple SF Symbols ダウンロード＆配置

```bash
# public/icons/ フォルダ作成
mkdir -p public/icons

# SF Symbols を SVG で download
# (developer.apple.com/sf-symbols から手動 DL)
# または直接コピー可能な SVG を public/icons/ に配置

# 例：
# public/icons/book.svg
# public/icons/gear.svg
# public/icons/brain.svg
```

**ホームページ実装例（`src/pages/index.astro`）：**

```astro
---
import { getCollection } from 'astro:content';

const posts = await getCollection('blog');
const sortedPosts = posts.sort((a, b) => 
  b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);
---

<html>
  <head>
    <title>boorain.space</title>
  </head>
  <body>
    <div class="blog-grid">
      {sortedPosts.map(post => (
        <a href={`/blog/${post.slug}`} class="blog-card">
          <img src={`/icons/${post.data.icon}.svg`} alt="" />
          <h3>{post.data.title}</h3>
        </a>
      ))}
    </div>
  </body>
</html>

<style>
  @import '../styles/global.css';
</style>
```

---

## ステップ6: Markdown ファイル を /src/content/blog/ に配置

```bash
# 変換済み markdown を blog フォルダに移動
cp posts-markdown/* src/content/blog/

# または手動で配置（Markdown 先頭に front matter 追加）
# 形式：
# ---
# title: "記事タイトル"
# pubDate: 2026-09-19
# icon: "book"
# ---
# 記事本文...
```

---

## ステップ7: ローカル確認

```bash
# 開発サーバー起動
npm run dev

# → http://localhost:3000 でアクセス
# → Ctrl+C で終了
```

---

## ステップ8: ビルド確認

```bash
# 本番ビルド実行
npm run build

# ビルド確認
ls -la dist/

# プレビュー
npm run preview
```

---

## ステップ9: GitHub Repository 作成＆初期化

```bash
# Git 初期化（まだなら）
git init

# .gitignore 確認・作成
cat > .gitignore << 'EOF'
node_modules/
dist/
.env
.env.local
*.log
EOF

# ステージング＆コミット
git add .
git commit -m "Initial boorain blog setup with Astro"

# GitHub で新規 repo 作成後（boorain-blog）
git remote add origin https://github.com/sakeoe15-png/boorain-blog.git
git branch -M main
git push -u origin main
```

---

## ステップ10: Vercel Deploy

### Option A: Vercel CLI 使用

```bash
# Vercel CLI インストール
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# 対話形式でプロジェクト設定
# - Scope: Personal account
# - Project name: boorain-blog
# - Framework: Astro
# - Output Directory: dist
```

### Option B: Vercel Web から GitHub 連携

1. vercel.com にアクセス
2. GitHub でログイン
3. "Import Project" → GitHub repo `boorain-blog` 選択
4. Settings 確認（Framework: Astro、Output: dist）
5. Deploy

**デプロイ後、Vercel から以下を確認：**

```
Settings → Domains → boorain.space
→ Nameservers セクション
→ 以下をコピー：

ns1.vercel-dns.com
ns2.vercel-dns.com
ns3.vercel-dns.com
ns4.vercel-dns.com
```

---

## ステップ11: お名前.com で Nameservers 設定

```
1. onamae.com ダッシュボード
2. boorain.space → ネームサーバー設定
3. 「その他のサービス」タブ
4. 上記 Vercel nameservers を入力
5. 確認
```

**DNS反映待ち：** 最大24時間

---

## ステップ12: デプロイ後の編集フロー

**以降のブログ更新：**

```bash
# ローカルで記事作成
vim src/content/blog/new-article.md

# プレビュー確認
npm run dev

# GitHub に push
git add src/content/blog/new-article.md
git commit -m "Add new article: new-article"
git push

# → Vercel が自動ビルド・デプロイ（~60秒）
# → boorain.space に反映（即座）
```

---

## トラブルシューティング

### Astro ビルドエラー

```bash
# キャッシュクリア
rm -rf node_modules .astro dist
npm install
npm run build
```

### Front Matter エラー

```bash
# YAML 形式を確認
# 全 markdown ファイルの先頭：

---
title: "記事タイトル"
pubDate: 2026-09-19
icon: "book"
---
```

### Vercel デプロイ失敗

```bash
# ローカルでビルド確認
npm run build

# エラーログを Vercel dashboard で確認
# Settings → Function logs / Build logs
```

---

## 重要なファイル・フォルダ

| パス | 用途 |
|------|------|
| `SPEC.md` | プロジェクト仕様書 |
| `README.md` | 本ガイド |
| `src/content/blog/` | **全 markdown 記事** |
| `src/styles/global.css` | **Lime green スタイル** |
| `public/icons/` | **Apple SF Symbols SVG** |
| `astro.config.mjs` | Astro 設定 |
| `package.json` | NPM 依存パッケージ |

---

## 作業ディレクトリ構成（最終形）

```
/Users/sakumi/CTO/ClaudeCode/個人/boorain/
├── SPEC.md                    ← プロジェクト仕様書
├── README.md                  ← このガイド
├── package.json
├── astro.config.mjs
├── src/
│   ├── content/blog/
│   │   ├── article-1.md
│   │   ├── article-2.md
│   │   └── ... (全記事)
│   ├── pages/
│   │   ├── index.astro
│   │   └── [slug].astro
│   ├── layouts/
│   │   └── BlogLayout.astro
│   └── styles/
│       └── global.css
├── public/
│   └── icons/
│       ├── book.svg
│       ├── gear.svg
│       └── ...
└── dist/                      ← build output
```

---

## 次のステップ

1. **WordPress export XML を Sak からアップロード**
2. **ステップ1から順番に実行**
3. **各ステップで確認・デバッグ**
4. **GitHub push → Vercel deploy → DNS反映**

---

**Ready to go? Let's build boorain.space 🚀**
