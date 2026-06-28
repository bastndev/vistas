<div align="center">

  <a href="https://www.gohit.xyz/package/vistaz">
    <img alt="vistaz logo" src="https://raw.githubusercontent.com/bastndev/vistaz/main/public/banner.webp" height="128">
  </a>

<br>

<h1></h1>

<br>

<a href="https://www.npmjs.com/package/vistaz"><img alt="NPM version" src="https://img.shields.io/npm/v/vistaz.svg?style=for-the-badge&logo=npm&color=8B5E3C&labelColor=18181b"></a>
<a href="https://www.npmjs.com/package/vistaz"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/vistaz.svg?style=for-the-badge&logo=npm&color=8B5E3C&labelColor=18181b"></a>
<a href="https://github.com/bastndev/vistaz/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/npm/l/vistaz.svg?style=for-the-badge&color=8B5E3C&labelColor=18181b"></a>
<a href="https://github.com/bastndev/vistaz/stargazers"><img alt="GitHub Stars" src="https://img.shields.io/github/stars/bastndev/vistaz.svg?style=for-the-badge&logo=github&color=8B5E3C&labelColor=18181b"></a>

<h1></h1>

<p >
  <a href="https://github.com/bastndev/vistaz/blob/main/README.md">English 🇺🇸</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_ES.md">Español 🇪🇸</a> |
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

> 一个轻量级、与框架无关的**页面浏览量计数器**。只做一件事：统计每个路由的真实浏览量，将数字交给你，然后让你随心所欲地设计样式。

<br>

```bash
npm i vistaz
```

<br>

- 🪶 **轻量且客户端零依赖** — 核心只是 `fetch` + 存储。
- 🔁 **刷新无忧** — `localStorage` 去重，所以刷新页面不会增加计数。
- 🧩 **随处可用** — Astro、纯 HTML、Next.js、React、React Native、LynxJS。
- 🎨 **你的界面** — 获取数字并按你的方式渲染，或者添加一行代码的徽章。
- 🏆 **每页计数 + 排名** — 一次查询即可查看哪篇文章最受欢迎。
- 📦 **自带数据库** — 你的数据存放在你自己的免费 Upstash Redis 中。该包不托管任何内容。

> **你需要：** 一个免费的 [Upstash Redis](https://console.upstash.com) 数据库和一个运行无服务器端点的主机（Vercel/Netlify/Cloudflare/Astro SSR）。端点保存密钥令牌；浏览器永远看不到它。

---

## 1. 设置数据库（一次）

在 [console.upstash.com](https://console.upstash.com) 创建一个免费数据库，然后将其 REST 凭据放入 `.env`（参见 [`.env.example`](./.env.example)）：

```bash
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-rest-token
```

## 2. 添加 API 路由（服务器）

创建一个端点。slug 来自 URL，因此使用一个通配路由。

```ts
// Astro: src/pages/api/views/[...slug].ts
import { createUpstashAdapter, createRouteHandlers } from "vistaz/server";

const views = createUpstashAdapter(); // 从环境变量读取 UPSTASH_*
export const { GET, POST } = createRouteHandlers(views);
```

```ts
// Next.js App Router: app/api/views/[...slug]/route.ts
import { createUpstashAdapter, createRouteHandlers } from "vistaz/server";

const views = createUpstashAdapter();
export const { GET, POST } = createRouteHandlers(views);
```

> **Astro 注意：** API 路由需要 SSR — 添加一个适配器如 `@astrojs/vercel` 并设置
> `output: "server"`（或 `hybrid`）。完全静态的构建无法运行端点。

### 🚀 Astro / Vite 用户须知

由于 Astro 和 Vite 通过 `import.meta.env` 而非 Node 全局 `process.env` 安全地暴露环境变量，
自动读取凭据的功能将无法开箱即用。

如果你使用 Astro 或 Vite，必须将 Upstash 凭据显式传递给适配器：

```javascript
import { createUpstashAdapter, createRouteHandlers } from "vistaz/server";

const views = createUpstashAdapter({
  url: import.meta.env.UPSTASH_REDIS_REST_URL,
  token: import.meta.env.UPSTASH_REDIS_REST_TOKEN
});
export const { GET, POST } = createRouteHandlers(views);
```

## 3. 显示计数器（客户端）

选择适合你的方式。三者都与同一个端点通信。

### Web 组件 — Astro / 纯 HTML（无 React）

```astro
---
// 任何 .astro 页面
---
<p>浏览量：<vistaz-counter slug="blog">…</vistaz-counter></p>

<script>
  import { defineViztasCounter } from "vistaz/element";
  defineViztasCounter();
</script>

<style>
  vistaz-counter { font-weight: 600; } /* 像任何元素一样设置样式 */
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

React Native（无 `localStorage`，且端点必须是绝对路径）：

```tsx
import AsyncStorage from "@react-native-async-storage/async-storage";

const { count } = useViews("blog", {
  endpoint: "https://yoursite.com/api/views",
  storage: AsyncStorage,
});
```

### 纯函数（构建你自己的界面）

```ts
import { trackView } from "vistaz";

const count = await trackView("blog"); // 首次访问发送 POST，之后发送 GET
document.querySelector("#views").textContent = String(count);
```

### 徽章 — 在任何可以使用图片的地方都可以使用（包括 Markdown）

```html
<img src="https://yoursite.com/api/views/blog.svg" alt="views" />
```

零 JS，但每次加载都会计数，且你无法为图片设置样式 — 当你需要准确性 + 自定义 CSS 时，请使用上述原生选项。

---

## 你的私有统计页面（排名）

添加第二个路由来读取按流量排序的所有页面：

```ts
// Astro: src/pages/api/views/ranking.ts   (Next: app/api/views/ranking/route.ts)
import { createUpstashAdapter, createRankingHandler } from "vistaz/server";

export const { GET } = createRankingHandler(createUpstashAdapter());
```

`GET /api/views/ranking` → `[{ "slug": "blog", "count": 152 }, ...]`（支持 `?limit=10`）。
在私有 `/admin` 页面中渲染它，即可获得即时迷你仪表板。

---

## API

### 客户端 — `vistaz`

```ts
trackView(slug, options?): Promise<number>
createTracker(options?): { track(slug): Promise<number> }
```

`options`：`endpoint`（默认 `"/api/views"`）、`cooldown`（默认 `"24h"`；`ms` 数字
或 `"30m"`/`"24h"`/`"7d"`）、`storage`（默认 `localStorage` → 内存回退）、
`fetch`（自定义 fetch）。`trackView` 永远不会在你的界面中抛出错误 — 出错时解析为 `0`。

### 元素 — `vistaz/element`

```ts
defineViztasCounter(options?): void   // 注册 <vistaz-counter slug endpoint cooldown>
```

### React — `vistaz/react`

```ts
useViews(slug, options?): { count: number | null; loading: boolean; error: Error | null }
```

### 服务器 — `vistaz/server`

```ts
createUpstashAdapter(options?): ViewsAdapter   // { url?, token?, key?, redis? }
createRouteHandlers(views, options?): { GET, POST }
createRankingHandler(views): { GET }
renderCountSvg(count, options?): string
```

想要使用不同的数据库？实现 `ViewsAdapter` 接口（`increment`、`get`、`getMany`、`getRanking`）并将其传递给处理程序。

---

## 计数工作原理

```
浏览器 / 应用 ──fetch──▶  /api/views/[slug]      ──▶  Upstash Redis（你的数据库）
  localStorage 去重        你的无服务器路由            一个有序集合：
  （每次冷却 1 次计数）    （保存令牌）               计数 + 排名
```

冷却期内的首次访问发送 `POST`（递增）；之后的访问发送 `GET`（只读）。计数存储在单个 Redis 有序集合中，因此每页总数和完整排名来自同一结构。

## 许可证

MIT