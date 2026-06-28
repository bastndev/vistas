<div align="center">

  <a href="https://www.gohit.xyz/package/vistaz">
    <img alt="vistaz logo" src="https://raw.githubusercontent.com/bastndev/vistaz/main/public/banner.webp" height="128">
  </a>

<br>

<h1></h1>

<br>

<a href="https://www.npmjs.com/package/vistaz"><img alt="NPM version" src="https://img.shields.io/npm/v/vistaz.svg?style=for-the-badge&logo=npm&logoColor=white&color=A8784E&labelColor=121214"></a>
<a href="https://www.npmjs.com/package/vistaz"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/vistaz.svg?style=for-the-badge&logo=npm&logoColor=white&color=A8784E&labelColor=121214"></a>
<a href="https://github.com/bastndev/vistaz/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/npm/l/vistaz.svg?style=for-the-badge&color=A8784E&labelColor=121214"></a>
<a href="https://github.com/bastndev/vistaz/stargazers"><img alt="GitHub Stars" src="https://img.shields.io/github/stars/bastndev/vistaz.svg?style=for-the-badge&logo=github&logoColor=white&color=A8784E&labelColor=121214"></a>

<h1></h1>

<p >
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_ES.md">Español 🇪🇸</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_ZH.md">中文 🇨🇳</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_DE.md">Deutsch 🇩🇪</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_FR.md">Français 🇫🇷</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_JA.md">日本語 🇯🇵</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_KO.md">한국어 🇰🇷</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_PT.md">Português 🇧🇷</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_RU.md">Русский 🇷🇺</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_VI.md">Tiếng Việt 🇻🇳</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_HI.md">हिन्दी 🇮🇳</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_AR.md">العربية 🇸🇦</a><span>...</span>
</p>

</div>

<br>

> A tiny, framework-agnostic **page-view counter**. One job: count real views per route, hand you the number, and let you style it however you like.

<br>

```bash
npm i vistaz
```

<br>

- 🪶 **Tiny & zero-dependency client** — the core is just `fetch` + storage.
- 🔁 **Refresh-proof** — `localStorage` dedup, so reloads don't inflate counts.
- 🧩 **Works everywhere** — Astro, plain HTML, Next.js, React, React Native, LynxJS.
- 🎨 **Your UI** — get a number and render it your way, or drop in a one-line badge.
- 🏆 **Per-page counts + ranking** — see which article is winning, in one query.
- 📦 **Bring Your Own Database** — your data lives in _your_ free Upstash Redis. The
  package hosts nothing.

> **You need:** a free [Upstash Redis](https://console.upstash.com) database and a host
> that runs serverless endpoints (Vercel/Netlify/Cloudflare/Astro SSR). The endpoint
> holds the secret token; the browser never sees it.

---

## 1. Set up the database (once)

Create a free database at [console.upstash.com](https://console.upstash.com), then put
its REST credentials in `.env` (see [`.env.example`](./.env.example)):

```bash
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-rest-token
```

## 2. Add the API route (server)

Create one endpoint. The slug comes from the URL, so use a catch-all route.

```ts
// Astro: src/pages/api/views/[...slug].ts
import { createUpstashAdapter, createRouteHandlers } from "vistaz/server";

const views = createUpstashAdapter(); // reads UPSTASH_* from env
export const { GET, POST } = createRouteHandlers(views);
```

```ts
// Next.js App Router: app/api/views/[...slug]/route.ts
import { createUpstashAdapter, createRouteHandlers } from "vistaz/server";

const views = createUpstashAdapter();
export const { GET, POST } = createRouteHandlers(views);
```

> **Astro note:** API routes need SSR — add an adapter like `@astrojs/vercel` and set
> `output: "server"` (or `hybrid`). A fully static build can't run endpoints.

### 🚀 Note for Astro / Vite Users

Because Astro and Vite securely expose environment variables through `import.meta.env` rather
than Node's global `process.env`, the automatic credential reading will not work out-of-the-box.

If you are using Astro or Vite, you must explicitly pass your Upstash credentials to the adapter:

```javascript
import { createUpstashAdapter } from "vistaz/server";

const views = createUpstashAdapter({
  url: import.meta.env.UPSTASH_REDIS_REST_URL,
  token: import.meta.env.UPSTASH_REDIS_REST_TOKEN
});
export const { GET, POST } = createRouteHandlers(views);
```

## 3. Show the counter (client)

Pick whichever fits. All three talk to the same endpoint.

### Web component — Astro / plain HTML (no React)

```astro
---
// any .astro page
---
<p>Views: <vistaz-counter slug="blog">…</vistaz-counter></p>

<script>
  import { defineViztasCounter } from "vistaz/element";
  defineViztasCounter();
</script>

<style>
  vistaz-counter { font-weight: 600; } /* style it like any element */
</style>
```

### React / Next.js / React Native / LynxJS

```tsx
import { useViews } from "vistaz/react";

export function Views({ slug }: { slug: string }) {
  const { count, loading } = useViews(slug);
  return <span>{loading ? "…" : count}</span>;
}
```

React Native (no `localStorage`, and the endpoint must be absolute):

```tsx
import AsyncStorage from "@react-native-async-storage/async-storage";

const { count } = useViews("blog", {
  endpoint: "https://yoursite.com/api/views",
  storage: AsyncStorage,
});
```

### Plain function (build your own UI)

```ts
import { trackView } from "vistaz";

const count = await trackView("blog"); // POST first visit, GET after
document.querySelector("#views").textContent = String(count);
```

### Badge — works anywhere an image does (even Markdown)

```html
<img src="https://yoursite.com/api/views/blog.svg" alt="views" />
```

Zero JS, but every load counts and you can't style an image — use a native option
above when you want accuracy + your own CSS.

---

## Your private stats page (ranking)

Add a second route to read every page ordered by traffic:

```ts
// Astro: src/pages/api/views/ranking.ts   (Next: app/api/views/ranking/route.ts)
import { createUpstashAdapter, createRankingHandler } from "vistaz/server";

export const { GET } = createRankingHandler(createUpstashAdapter());
```

`GET /api/views/ranking` → `[{ "slug": "blog", "count": 152 }, ...]` (supports `?limit=10`).
Render it in a private `/admin` page for an instant mini-dashboard.

---

## API

### Client — `vistaz`

```ts
trackView(slug, options?): Promise<number>
createTracker(options?): { track(slug): Promise<number> }
```

`options`: `endpoint` (default `"/api/views"`), `cooldown` (default `"24h"`; `ms` number
or `"30m"`/`"24h"`/`"7d"`), `storage` (default `localStorage` → memory fallback),
`fetch` (custom fetch). `trackView` never throws into your UI — on error it resolves `0`.

### Element — `vistaz/element`

```ts
defineViztasCounter(options?): void   // registers <vistaz-counter slug endpoint cooldown>
```

### React — `vistaz/react`

```ts
useViews(slug, options?): { count: number | null; loading: boolean; error: Error | null }
```

### Server — `vistaz/server`

```ts
createUpstashAdapter(options?): ViewsAdapter   // { url?, token?, key?, redis? }
createRouteHandlers(views, options?): { GET, POST }
createRankingHandler(views): { GET }
renderCountSvg(count, options?): string
```

Want a different database? Implement the `ViewsAdapter` interface
(`increment`, `get`, `getMany`, `getRanking`) and pass it to the handlers.

---

## How counting works

```
Browser / App ──fetch──▶  /api/views/[slug]      ──▶  Upstash Redis (your DB)
 localStorage dedup        your serverless route        one sorted set:
 (1 count per cooldown)    (holds the token)            count + ranking
```

First visit within the cooldown sends `POST` (increment); later visits send `GET`
(read-only). Counts live in a single Redis sorted set, so per-page totals and the
full ranking come from the same structure.

## License

MIT
