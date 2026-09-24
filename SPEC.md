# boorain.space ブログ移行プロジェクト仕様書

**プロジェクト名：** boorain.space（boo's brain）ブログ構築・移行  
**プロジェクト所有者：** Sak（Sakumi Kurosawa）  
**作成日：** 2026年9月19日  
**最終更新：** 2026年9月24日  
**バージョン：** 2.0（移行・公開完了、追加機能フェーズ）

**現状：** ✅ 本番公開済み（https://boorain.space）

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
| **WHOIS代行** | 有効（お名前.com が代行、個人情報非公開） |

**登録状態：** ✅ 完了（2026年9月19日）

### DNS設定（実際の構成、2026年9月24日設定完了）

Vercelのネームサーバーへの完全移管ではなく、**お名前.comのDNSレコード設定機能＋Aレコード**方式を採用。

| 項目 | 値 |
|------|-----|
| **ネームサーバー** | 01.dnsv.jp〜04.dnsv.jp（お名前.comのDNSレコード設定用） |
| **Aレコード** | `@` → `76.76.21.21`（Vercel） |

設定手順（実施済み）：
1. お名前.com → ドメインDNS設定 → Aレコード追加（ホスト名空欄、値 `76.76.21.21`）
2. ネームサーバーを「お名前.comのネームサーバーを使う（01〜04.dnsv.jp）」に変更
3. 反映確認（今回は数十分〜1時間程度で反映）

**注意：** お名前.comは「ネームサーバー変更をしない」を選んだ場合でも、DNSレコード設定機能を使うにはネームサーバーをdnsv.jp系に変更する必要がある（お名前.com独自の仕様、無料）。

---

## 5. 実装ステップ

### Phase 1: データ準備

| No. | タスク | 実行者 | ステータス |
|-----|--------|--------|-----------|
| 1-1 | WordPress export（XML） | Sak | ✅ 完了 |
| 1-2 | Markdown 変換 | Claude | ✅ 完了 |

### Phase 2: 静的サイト構築

| No. | タスク | コマンド | ステータス |
|-----|--------|---------|-----------|
| 2-1 | Astro プロジェクト初期化 | `npm create astro -- --template blog` | ✅ 完了 |
| 2-2 | CSS カスタマイズ（lime green + layout） | Manual edit | ✅ 完了 |
| 2-3 | Apple SF Symbols download・配置 | Manual | ✅ 完了 |
| 2-4 | Markdown ファイル配置 | Copy to `/src/content/blog/` | ✅ 完了 |
| 2-5 | ローカル確認 | `npm run dev` | ✅ 完了 |

### Phase 3: GitHub・Vercel 連携

| No. | タスク | ステータス |
|-----|--------|-----------|
| 3-1 | GitHub repository 作成・初期化 | ✅ 完了 |
| 3-2 | ローカルから push | ✅ 完了 |
| 3-3 | Vercel import（GitHub repo連携） | ✅ 完了 |
| 3-4 | Vercel build・deploy | ✅ 完了 |
| 3-5 | Vercel nameservers 確認 | ✅ 完了 |

### Phase 4: DNS設定・反映

| No. | タスク | ステータス |
|-----|--------|-----------|
| 4-1 | お名前.com nameservers 入力 | ✅ 完了 |
| 4-2 | DNS propagation 確認（24h） | ✅ 完了 |
| 4-3 | boorain.space アクセス確認 | ✅ 完了 |

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
| **URL** | https://github.com/sakeoe15-png/boorain-blog |
| **アカウント** | sakeoe15-png（個人用） |
| **公開設定** | Public（WordPress全記事の内容確認済み、公開して問題ない） |
| **Branch** | main（デフォルト） |
| **.gitignore** | Node標準 + `.vercel`（vercel linkが自動追加） |

**複数GitHubアカウント環境での注意：** `gh auth switch --user sakeoe15-png` だけではgit pushの認証情報が切り替わらないことがある。`gh auth setup-git` を追加実行してcredential helperを再同期する必要あり（gwsaccount000-cpuのまま403エラーになる場合の対処法）。

### Vercel 設定

| 項目 | 値 |
|------|-----|
| **Framework Preset** | Astro |
| **Build Command** | npm run build |
| **Output Directory** | dist |
| **Install Command** | npm install |
| **Environment Variables** | なし（static site） |
| **Custom Domain** | boorain.space |
| **アカウント** | sakeoe15-8292（個人用、Vercelチーム名「Sak's projects」） |
| **プロジェクト名** | boorain |
| **GitHub連携** | 有効（push → 自動デプロイ、GitHub App「Vercel」をboorain-blogにインストール済み） |

**GitHub連携のセットアップで詰まった点：**
- 初回は「Login Connection」未設定でエラー → Vercelアカウント設定でGitHubログイン連携が必要
- 次に「Vercel」GitHub Appがリポジトリへのアクセス権を持っておらずエラー → https://github.com/apps/vercel でインストール・リポジトリ選択が必要
- 自動デプロイは正常に動作するが、**反映まで数分（時に5分以上）かかることがある**。慌てて手動`vercel --prod`を打たなくても、待てば自動で反映される

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

## 8. ビジュアル追加機能（2026年9月24日実装、すべて本番反映済み）

| 機能 | 内容 | 実装場所 |
|------|------|---------|
| 絵文字背景エフェクト | 🧠🫍🦄🐶🦕🐈🌞🌝🌛🌜🌚🌎🌏🌍🪐💫🌟✨⚡️☄️🫯🌈❄️🍙🍿🍭🪂🧚🏻‍♀️👼🏼 が背景に散らばり回転しながら上から下に流れる | `src/components/EmojiBackground.astro`, `src/scripts/emojiBackground.ts` |
| 花火エフェクト | 背景の絵文字をクリック/タップすると花火(ショッキングピンク #f862f9のパーティクル)が開いてその絵文字だけ消える | 同上（click イベント、絵文字はCSS colorで色指定できないためCSS描画の円形パーティクルを使用） |
| ヘッダー固定 | スクロールしても「boorain.space」ヘッダーが常に画面上部に表示 | `src/components/Header.astro`（`position: sticky`） |
| サイト説明文 | 「boo's brain — 思考の記録」→「☆彡」に変更 | `src/consts.ts` の `SITE_DESCRIPTION` |
| ファビコン | Astroデフォルトのロケット→📡（衛星アンテナ）に変更。favicon.svg・favicon.ico（Chromiumでカラーレンダリングして生成、librsvgはカラー絵文字非対応で黒シルエットになるため要注意）・apple-touch-icon.png（iOS用、lime green背景）の3点セット | `public/favicon.svg`, `public/favicon.ico`, `public/apple-touch-icon.png`, `src/components/BaseHead.astro` |
| スマホのタップ時グレーハイライト抑制 | 背景絵文字・記事タイトル・リンクをタップした際に出る標準のグレー表示/長押しメニューを`-webkit-tap-highlight-color: transparent`等で抑制 | `src/styles/global.css`, `src/components/EmojiBackground.astro` |
| スマホでのズーム誤爆修正 | スワイプ操作でブラウザ標準のダブルタップ/ピンチズームが渦巻きエフェクトと競合していたのを`touch-action: pan-y`で修正 | `src/styles/global.css` |
| 渦巻きエフェクトの負荷軽減 | 毎フレームの`getBoundingClientRect()`（強制レイアウト計算、文字数が多い記事ほど重くなる）呼び出しをやめ、文字の基準位置を初期化時にキャッシュしてスクロール差分だけで復元する方式に変更 | `src/scripts/swirl.ts` |

## 9. 既知の技術的落とし穴

### 「?」等のURL予約文字を含む記事タイトルが404になる問題（2026年9月24日発見・修正済み）

**症状：** タイトルに `?` を含む記事（例:「音楽好きだけどどこから入る?」）のリンクをクリックすると404になる。

**原因：** Astroの静的ビルドは `getStaticPaths` の `params.slug` に含まれる `?` `#` `%` 等のURL予約文字を、出力ファイル名生成時に**自動でpercent-encodeする**（`?` → 文字列としての`%3F`）。ここでリンク生成側（`<a href>`や`rss.xml.js`）でも同じ文字を`encodeURIComponent`していると、実ファイル名（Astroが1回エンコード）とリンク先URL（手動で1回エンコード）の間でズレが生じ、ブラウザ側の1回のURLデコードでは一致しなくなり404になる。

**対処：** URLパス生成では予約文字を**エンコードせず単純に除去**する方式に統一（`src/lib/slug.ts` の `toSlugPath()`）。表示用タイトル（`<h1>`等）には影響しない。`getStaticPaths`・`<a href>`・RSSの`<link>`すべてこの1関数に統一し、重複実装によるズレの再発を防止。

**教訓：** 静的サイトジェネレータが独自にURLエンコードを行うケースがあるため、リンク側で手動エンコードする前に、実際にビルドして`dist/`配下の実ファイル名を確認すること。

### librsvg（sharp）はカラー絵文字フォントを持たない

SVGをsharp/librsvg経由でPNG/ICOに変換すると、絵文字が黒いシルエットになる（カラー絵文字フォントが無いため）。Chromium（Playwright）でHTMLとしてレンダリング→スクリーンショットする方式なら正しいカラー絵文字が得られる。

## 10. LINE投稿機能（2026年9月24日 実装完了・本番動作確認済み）

### 目的

PCを毎回立ち上げず、スマホ（LINE）から新規記事を投稿できるようにする。

### 採用方式：LINE公式アカウント（Messaging API）+ Vercel Serverless Function

当初はGCP Cloud Functionを検討したが、コスト比較の結果Vercel Serverless Functionに変更。**Vercel Hobbyプランはカード登録不要・月100万回実行まで無料**で、boorain.spaceが既に乗っているVercelプロジェクトにAPIルートを1つ追加するだけで済むため、新規GCPアカウントが不要になった。

### アーキテクチャ（実装済み）

```
LINEでメッセージ送信（「タイトル: ○○○」「本文: ○○○」形式）
  ↓ Webhook (x-line-signatureで署名検証)
Vercel Serverless Function（src/pages/api/line-webhook.ts）
  ↓ GitHub Contents API (PUT) でファイル作成・commit・push
GitHub Repository（boorain-blog, main branch）
  ↓ 既存のVercel Git連携による自動デプロイ
boorain.space に反映（数分後）
  ↓ 完了通知（reply、無料）
LINEに「投稿しました」＋公開URLを返信
```

### 実装詳細

- `src/pages/api/line-webhook.ts`（`export const prerender = false` でこのルートのみサーバーレンダリング化）
- `astro.config.mjs`: `@astrojs/vercel`アダプター追加、`output: 'static'` + `adapter: vercel()`（他の全ページは従来通り静的ビルド）
- メッセージフォーマット: `タイトル: ○○○` `本文: ○○○` を正規表現でパース、フォーマット不一致時はLINEにエラー文言を返信
- ファイル命名: `YYYY-MM-DD.md`（同日複数件はGitHub API側で既存ファイルの有無を確認し`-2`等のサフィックスを付与）
- 認証: `LINE_CHANNEL_SECRET`でHMAC-SHA256署名検証（Vercel環境変数、production、sensitive設定）

### 環境変数（Vercel Production、すべてsensitive）

| 変数名 | 用途 |
|---|---|
| `LINE_CHANNEL_SECRET` | Webhook署名検証 |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINEへの返信送信 |
| `GH_CONTENT_TOKEN` | GitHub Contents API書き込み（fine-grained PAT、`sakeoe15-png/boorain-blog`のみ、Contents: Read and write） |

### LINE公式アカウント設定

- プロバイダー「Sak個人」配下にチャネル「boorain.space」（@519awqwo）を新規作成（既存の英会話アプリ用チャネルとは別）
- Webhook URL: `https://boorain.space/api/line-webhook`、Webhook有効化
- 「応答メッセージ」はオフ（LINE標準の自動応答とBotの返信が二重に来るのを防ぐため）

### 動作確認（2026年9月24日）

「タイトル: LINEからのテスト投稿」を送信 → GitHub commit確認 → 数分後に本番URLで記事表示確認 → テスト記事は削除済み。一連のフロー、実機で成功。

### 今後の拡張候補（未着手）

- draft（下書き投稿）をLINE経由でも使うかどうかは未検討

---

## 11. 参考資料

### ビジュアル参考

- WordPress 現在デザイン: `/uploads/S__780599300.jpg`
- 色コード: #A4D65E（lime green）、#FC0FC0（ショッキングピンク、タイトル下線）、#f862f9（花火パーティクル・コピーライト）

### ドキュメント

- Astro 公式: https://astro.build
- Vercel Docs: https://vercel.com/docs
- GitHub: https://docs.github.com

---

## 12. トラブルシューティング

### よくある問題

| 問題 | 原因 | 解決策 |
|------|------|--------|
| DNSが反映されない | お名前.comのDNSレコード設定機能はdnsv.jp系ネームサーバーへの変更が別途必要 | ネームサーバー設定を「お名前.comのネームサーバーを使う」に変更 |
| Vercel build エラー | markdown front matter 不正 | YAML 形式確認 |
| 記事が表示されない | `/src/content/blog/` 外、またはdraft: true | ファイルパス・frontmatter確認 |
| 「?」等を含むタイトルの記事が404 | 上記9章参照 | `src/lib/slug.ts`のtoSlugPathを使っているか確認 |
| pushしても自動デプロイが反映されない | 実際は発火しているが数分〜十数分のタイムラグがあることがある | 焦って手動デプロイせず、まず数分待つ |
| git pushが403エラー | 複数GitHubアカウント環境でcredential helperが古いアカウントのまま | `gh auth switch --user sakeoe15-png && gh auth setup-git` |
| favicon.icoがカラーにならない | librsvg/sharpがカラー絵文字未対応 | Chromiumでレンダリングして生成し直す（9章参照） |

---

## 13. 承認・署名

| 項目 | 情報 |
|------|------|
| **作成者** | Claude |
| **承認者** | Sak（Sakumi Kurosawa） |
| **作成日** | 2026年9月19日 |
| **承認日** | ✅ 完了 |
| **本番公開日** | 2026年9月24日 |

---

**End of Specification**
