<div align="center">

  <a href="https://www.gohit.xyz/package/viztas">
    <img alt="viztas logo" src="https://raw.githubusercontent.com/bastndev/vistaz/main/public/banner.webp" height="128">
  </a>

<br>

<h1></h1>

<br>

<a href="https://www.npmjs.com/package/viztas"><img alt="NPM version" src="https://img.shields.io/npm/v/viztas.svg?style=for-the-badge&logo=npm&color=8B5E3C&labelColor=18181b"></a>
<a href="https://www.npmjs.com/package/viztas"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/viztas.svg?style=for-the-badge&logo=npm&color=8B5E3C&labelColor=18181b"></a>
<a href="https://github.com/bastndev/vistaz/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/npm/l/viztas.svg?style=for-the-badge&color=8B5E3C&labelColor=18181b"></a>
<a href="https://github.com/bastndev/vistaz/stargazers"><img alt="GitHub Stars" src="https://img.shields.io/github/stars/bastndev/vistaz.svg?style=for-the-badge&logo=github&color=8B5E3C&labelColor=18181b"></a>

<h1></h1>

<p >
  <a href="https://github.com/bastndev/vistaz/blob/main/README.md">English 🇺🇸</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_ES.md">Español 🇪🇸</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_ZH.md">中文 🇨🇳</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_DE.md">Deutsch 🇩🇪</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_FR.md">Français 🇫🇷</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_KO.md">한국어 🇰🇷</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_PT.md">Português 🇧🇷</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_RU.md">Русский 🇷🇺</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_VI.md">Tiếng Việt 🇻🇳</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_HI.md">हिन्दी 🇮🇳</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_AR.md">العربية 🇸🇦</a><span>...</span>
</p>

</div>

<br>

> フレームワークに依存しない**ページビューカウンター**。一つの仕事：ルートごとの実際のビュー数をカウントし、数字を渡し、自由にスタイルを付けられるようにする。

<br>

```bash
npm i viztas
```

<br>

- 🪶 **小さくゼロ依存クライアント** — コアは `fetch` + ストレージのみ。
- 🔁 **リフレッシュ対応** — `localStorage` による重複排除で、リロードでカウントが膨らむことがない。
- 🧩 **どこでも動作** — Astro、プレーンHTML、Next.js、React、React Native、LynxJS。
- 🎨 **あなたのUI** — 数値を取得して自由にレンダリングするか、ワンラインバッジを追加。
- 🏆 **ページごとのカウント + ランキング** — どの記事が人気か、1回のクエリで確認。
- 📦 **データベースはお持ちのもの** — データは _あなたの_ 無料 Upstash Redis に保存。パッケージはホストしません。

> **必要なもの：** 無料の [Upstash Redis](https://console.upstash.com) データベースと、
> サーバーレスエンドポイントを実行するホスト（Vercel/Netlify/Cloudflare/Astro SSR）。エンドポイントは
> シークレットトークンを保持し、ブラウザはそれを表示しません。

---

## 1. データベースのセットアップ（一度だけ）

[console.upstash.com](https://console.upstash.com) で無料データベースを作成し、
RESTクレデンシャルを `.env` に設定してください（[`.env.example`](./.env.example) を参照）：

```bash
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-rest-token
```

## 2. APIルートの追加（サーバー）

エンドポイントを作成します。スラッグはURLから取得するので、キャッチオールルートを使用します。

```ts
// Astro: src/pages/api/views/[...slug].ts
import { createUpstashAdapter, createRouteHandlers } from "viztas/server";

const views = createUpstashAdapter(); // 環境変数から UPSTASH_* を読み取る
export const { GET, POST } = createRouteHandlers(views);
```

```ts
// Next.js App Router: app/api/views/[...slug]/route.ts
import { createUpstashAdapter, createRouteHandlers } from "viztas/server";

const views = createUpstashAdapter();
export const { GET, POST } = createRouteHandlers(views);
```

> **Astroの注意：** APIルートにはSSRが必要です — `@astrojs/vercel` のようなアダプターを追加し、
> `output: "server"`（または `hybrid`）を設定してください。完全に静的なビルドではエンドポイントを実行できません。

## 3. カウンターの表示（クライアント）

適切なものを選択してください。すべて同じエンドポイントと通信します。

### Webコンポーネント — Astro / プレーンHTML（React不要）

```astro
---
// 任意の .astro ページ
---
<p>ビュー数：<viztas-counter slug="blog">…</viztas-counter></p>

<script>
  import { defineViztasCounter } from "viztas/element";
  defineViztasCounter();
</script>

<style>
  viztas-counter { font-weight: 600; } /* 任意の要素のようにスタイル付け */
</style>
```

### React / Next.js / React Native / LynxJS

```tsx
import { useViews } from "viztas/react";

export function Views({ slug }: { slug: string }) {
  const { count, loading } = useViews(slug);
  return <span>{loading ? "…" : count}</span>;
}
```

React Native（`localStorage` なし、エンドポイントは絶対パス必須）：

```tsx
import AsyncStorage from "@react-native-async-storage/async-storage";

const { count } = useViews("blog", {
  endpoint: "https://yoursite.com/api/views",
  storage: AsyncStorage,
});
```

### プレーン関数（独自のUIを構築）

```ts
import { trackView } from "viztas";

const count = await trackView("blog"); // 初回访问はPOST、その後はGET
document.querySelector("#views").textContent = String(count);
```

### バッジ — 画像が使える場所ならどこでも動作（Markdownでも）

```html
<img src="https://yoursite.com/api/views/blog.svg" alt="views" />
```

JSゼロですが、毎回のロードがカウントされ、画像にはスタイルを適用できません — 正確さ + カスタムCSSが必要な場合は、上記のネイティブオプションを使用してください。

---

## プライベート統計ページ（ランキング）

トラフィック順に全ページを読み取る第二ルートを追加します：

```ts
// Astro: src/pages/api/views/ranking.ts   (Next: app/api/views/ranking/route.ts)
import { createUpstashAdapter, createRankingHandler } from "viztas/server";

export const { GET } = createRankingHandler(createUpstashAdapter());
```

`GET /api/views/ranking` → `[{ "slug": "blog", "count": 152 }, ...]`（`?limit=10` をサポート）。
プライベートな `/admin` ページでレンダリングすると、即座にミニダッシュボードが利用できます。

---

## API

### クライアント — `vistas`

```ts
trackView(slug, options?): Promise<number>
createTracker(options?): { track(slug): Promise<number> }
```

`options`：`endpoint`（デフォルト `"/api/views"`）、`cooldown`（デフォルト `"24h"`；`ms` 数値
または `"30m"`/`"24h"`/`"7d"`）、`storage`（デフォルト `localStorage` → メモリフォールバック）、
`fetch`（カスタムfetch）。`trackView` はUIに例外をスローしません — エラー時は `0` を解決します。

### エレメント — `vistas/element`

```ts
defineViztasCounter(options?): void   // <viztas-counter slug endpoint cooldown> を登録
```

### React — `viztas/react`

```ts
useViews(slug, options?): { count: number | null; loading: boolean; error: Error | null }
```

### サーバー — `vistas/server`

```ts
createUpstashAdapter(options?): ViewsAdapter   // { url?, token?, key?, redis? }
createRouteHandlers(views, options?): { GET, POST }
createRankingHandler(views): { GET }
renderCountSvg(count, options?): string
```

別のデータベースを使用したい場合は、`ViewsAdapter` インターフェースを実装してください
（`increment`、`get`、`getMany`、`getRanking`）。そしてハンドラーに渡します。

---

## カウントの仕組み

```
ブラウザ / アプリ ──fetch──▶  /api/views/[slug]      ──▶  Upstash Redis（あなたのDB）
  localStorage 重複排除        サーバーレスルート          ソートセット：
  （クールダウンごとに1回）   （トークンを保持）         カウント + ランキング
```

クールダウン内の初回访问は `POST`（インクリメント）を送信し、その後の访问は `GET`
（読み取り専用）を送信します。カウントは単一のRedisソートセットに保存されるため、
ページごとの合計と完全なランキングは同じ構造から取得されます。

## ライセンス

MIT