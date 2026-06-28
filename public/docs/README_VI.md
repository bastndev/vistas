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
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_ZH.md">中文 🇨🇳</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_DE.md">Deutsch 🇩🇪</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_FR.md">Français 🇫🇷</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_JA.md">日本語 🇯🇵</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_KO.md">한국어 🇰🇷</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_PT.md">Português 🇧🇷</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_RU.md">Русский 🇷🇺</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_HI.md">हिन्दी 🇮🇳</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_AR.md">العربية 🇸🇦</a><span>...</span>
</p>

</div>

<br>

> Một **bộ đếm lượt xem trang** nhỏ gọn, không phụ thuộc framework. Một nhiệm vụ duy nhất: đếm lượt xem thực tế theo route, đưa bạn số liệu và để bạn tùy ý chỉnh样式.

<br>

```bash
npm i vistaz
```

<br>

- 🪶 **Nhỏ gọn & zero dependency ở client** — lõi chỉ là `fetch` + storage.
- 🔁 **Chống refresh** — loại bỏ trùng lặp qua `localStorage`, nên việc tải lại không làm tăng số đếm.
- 🧩 **Hoạt động mọi nơi** — Astro, HTML thuần, Next.js, React, React Native, LynxJS.
- 🎨 **Giao diện của bạn** — lấy số liệu và render theo cách của bạn, hoặc thêm badge một dòng.
- 🏆 **Đếm theo trang + xếp hạng** — xem bài viết nào đang dẫn đầu, chỉ với một truy vấn.
- 📦 **Mang database của riêng bạn** — dữ liệu nằm trong _Redis Upstash miễn phí_ của bạn. Package không host gì cả.

> **Bạn cần:** một database miễn phí [Upstash Redis](https://console.upstash.com) và host
> chạy serverless endpoint (Vercel/Netlify/Cloudflare/Astro SSR). Endpoint
> giữ secret token; trình duyệt không bao giờ thấy nó.

---

## 1. Thiết lập database (một lần)

Tạo database miễn phí tại [console.upstash.com](https://console.upstash.com), rồi đặt
REST credentials vào `.env` (xem [`.env.example`](./.env.example)):

```bash
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-rest-token
```

## 2. Thêm API route (server)

Tạo một endpoint. Slug lấy từ URL, nên dùng route catch-all.

```ts
// Astro: src/pages/api/views/[...slug].ts
import { createUpstashAdapter, createRouteHandlers } from "vistaz/server";

const views = createUpstashAdapter(); // đọc UPSTASH_* từ env
export const { GET, POST } = createRouteHandlers(views);
```

```ts
// Next.js App Router: app/api/views/[...slug]/route.ts
import { createUpstashAdapter, createRouteHandlers } from "vistaz/server";

const views = createUpstashAdapter();
export const { GET, POST } = createRouteHandlers(views);
```

> **Lưu ý Astro:** API route cần SSR — thêm adapter như `@astrojs/vercel` và đặt
> `output: "server"` (hoặc `hybrid`). Build hoàn toàn static không thể chạy endpoint.

## 3. Hiển thị bộ đếm (client)

Chọn cách phù hợp. Cả ba đều giao tiếp với cùng một endpoint.

### Web component — Astro / HTML thuần (không React)

```astro---
// bất kỳ trang .astro nào
---
<p>Lượt xem: <vistaz-counter slug="blog">…</vistaz-counter></p>

<script>
  import { defineViztasCounter } from "vistaz/element";
  defineViztasCounter();
</script>

<style>
  vistaz-counter { font-weight: 600; } /* styled như bất kỳ element nào */
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

React Native (không `localStorage`, và endpoint phải là absolute):

```tsx
import AsyncStorage from "@react-native-async-storage/async-storage";

const { count } = useViews("blog", {
  endpoint: "https://yoursite.com/api/views",
  storage: AsyncStorage,
});
```

### Hàm thuần (xây dựng UI của riêng bạn)

```ts
import { trackView } from "vistaz";

const count = await trackView("blog"); // POST lượt đầu, GET sau đó
document.querySelector("#views").textContent = String(count);
```

### Badge — hoạt động ở bất kỳ đâu hình ảnh hoạt động (kể cả Markdown)

```html
<img src="https://yoursite.com/api/views/blog.svg" alt="lượt xem" />
```

Zero JS, nhưng mỗi lần tải đều đếm và bạn không thể style hình ảnh — dùng tùy chọn native
ở trên khi muốn chính xác + CSS riêng.

---

## Trang thống kê riêng tư (xếp hạng)

Thêm route thứ hai để đọc mọi trang theo thứ tự lượt truy cập:

```ts
// Astro: src/pages/api/views/ranking.ts   (Next: app/api/views/ranking/route.ts)
import { createUpstashAdapter, createRankingHandler } from "vistaz/server";

export const { GET } = createRankingHandler(createUpstashAdapter());
```

`GET /api/views/ranking` → `[{ "slug": "blog", "count": 152 }, ...]` (hỗ trợ `?limit=10`).
Render trên trang riêng tư `/admin` để có mini dashboard tức thì.

---

## API

### Client — `vistaz`

```ts
trackView(slug, options?): Promise<number>
createTracker(options?): { track(slug): Promise<number> }
```

`options`: `endpoint` (mặc định `"/api/views"`), `cooldown` (mặc định `"24h"`; số `ms`
hoặc `"30m"`/`"24h"`/`"7d"`), `storage` (mặc định `localStorage` → dự phòng bằng memory),
`fetch` (fetch tùy chỉnh). `trackView` không bao giờ throw vào UI — khi lỗi resolve `0`.

### Element — `vistaz/element`

```ts
defineViztasCounter(options?): void   // đăng ký <vistaz-counter slug endpoint cooldown>
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

Muốn dùng database khác? Triển khai interface `ViewsAdapter`
(`increment`, `get`, `getMany`, `getRanking`) và truyền cho handler.

---

## Cách đếm hoạt động

```
Trình duyệt / App ──fetch──▶  /api/views/[slug]      ──▶  Upstash Redis (database của bạn)
  localStorage dedup          route serverless của bạn    một sorted set:
  (1 đếm mỗi cooldown)       (giữ token)                đếm + xếp hạng
```

Lượt truy cập đầu tiên trong cooldown gửi `POST` (tăng); các lượt sau gửi `GET`
(chỉ đọc). Các số đếm nằm trong một sorted set Redis duy nhất, nên tổng theo trang và
xếp hạng đầy đủ đều lấy từ cùng cấu trúc.

## Giấy phép

MIT