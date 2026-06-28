<div align="center">

  <a href="https://www.gohit.xyz/package/vistas">
    <img alt="vistas logo" src="https://raw.githubusercontent.com/bastndev/vistas/main/public/banner.webp" height="128">
  </a>

<br>

<h1></h1>

<br>

<a href="https://www.npmjs.com/package/vistas"><img alt="NPM version" src="https://img.shields.io/npm/v/vistas.svg?style=for-the-badge&logo=npm&color=8B5E3C&labelColor=18181b"></a>
<a href="https://www.npmjs.com/package/vistas"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/vistas.svg?style=for-the-badge&logo=npm&color=8B5E3C&labelColor=18181b"></a>
<a href="https://github.com/bastndev/vistas/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/npm/l/vistas.svg?style=for-the-badge&color=8B5E3C&labelColor=18181b"></a>
<a href="https://github.com/bastndev/vistas/stargazers"><img alt="GitHub Stars" src="https://img.shields.io/github/stars/bastndev/vistas.svg?style=for-the-badge&logo=github&color=8B5E3C&labelColor=18181b"></a>

<h1></h1>

<p >
  <a href="https://github.com/bastndev/vistas/blob/main/README.md">English 🇺🇸</a> |
  <a href="https://github.com/bastndev/vistas/blob/main/public/docs/README_ES.md">Español 🇪🇸</a> |
  <a href="https://github.com/bastndev/vistas/blob/main/public/docs/README_ZH.md">中文 🇨🇳</a> |
  <a href="https://github.com/bastndev/vistas/blob/main/public/docs/README_DE.md">Deutsch 🇩🇪</a> |
  <a href="https://github.com/bastndev/vistas/blob/main/public/docs/README_FR.md">Français 🇫🇷</a> |
  <a href="https://github.com/bastndev/vistas/blob/main/public/docs/README_JA.md">日本語 🇯🇵</a> |
  <a href="https://github.com/bastndev/vistas/blob/main/public/docs/README_PT.md">Português 🇧🇷</a> |
  <a href="https://github.com/bastndev/vistas/blob/main/public/docs/README_RU.md">Русский 🇷🇺</a> |
  <a href="https://github.com/bastndev/vistas/blob/main/public/docs/README_VI.md">Tiếng Việt 🇻🇳</a> |
  <a href="https://github.com/bastndev/vistas/blob/main/public/docs/README_HI.md">हिन्दी 🇮🇳</a> |
  <a href="https://github.com/bastndev/vistas/blob/main/public/docs/README_AR.md">العربية 🇸🇦</a><span>...</span>
</p>

</div>

<br>

> 프레임워크에 의존하지 않는 **페이지 뷰 카운터**. 하나의 작업: 루트별 실제 조회수를 세고, 숫자를 전달하며, 원하는 대로 스타일을 지정할 수 있게 합니다.

<br>

```bash
npm i vistas
```

<br>

- 🪶 **가볍고 클라이언트 제로 의존성** — 핵심은 `fetch` + 스토리지뿐입니다.
- 🔁 **새로고침 방어** — `localStorage` 중복 제거로 리로드해도 카운트가 늘어나지 않습니다.
- 🧩 **어디서든 작동** — Astro, 순수 HTML, Next.js, React, React Native, LynxJS.
- 🎨 **나만의 UI** — 숫자를 받아 원하는 방식으로 렌더링하거나, 한 줄 배지를 추가하세요.
- 🏆 **페이지별 카운트 + 랭킹** — 어떤 기사가 인기인지 한 번의 쿼리로 확인.
- 📦 **데이터베이스는 직접 준비** — 데이터는 _여러분의_ 무료 Upstash Redis에 저장됩니다. 이 패키지는 호스팅하지 않습니다.

> **필요한 것:** 무료 [Upstash Redis](https://console.upstash.com) 데이터베이스와 서버리스 엔드포인트를 실행하는 호스트
> (Vercel/Netlify/Cloudflare/Astro SSR). 엔드포인트는 시크릿 토큰을 보관하며, 브라우저에는 절대 노출되지 않습니다.

---

## 1. 데이터베이스 설정 (한 번만)

[console.upstash.com](https://console.upstash.com)에서 무료 데이터베이스를 생성한 후,
REST 자격 증명을 `.env`에 넣으세요 ([`.env.example`](./.env.example) 참조):

```bash
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-rest-token
```

## 2. API 라우트 추가 (서버)

엔드포인트를 하나 생성하세요. 슬러그는 URL에서 가져오므로, catch-all 라우트를 사용합니다.

```ts
// Astro: src/pages/api/views/[...slug].ts
import { createUpstashAdapter, createRouteHandlers } from "vistas/server";

const views = createUpstashAdapter(); // 환경변수에서 UPSTASH_* 읽기
export const { GET, POST } = createRouteHandlers(views);
```

```ts
// Next.js App Router: app/api/views/[...slug]/route.ts
import { createUpstashAdapter, createRouteHandlers } from "vistas/server";

const views = createUpstashAdapter();
export const { GET, POST } = createRouteHandlers(views);
```

> **Astro 참고:** API 라우트에는 SSR이 필요합니다 — `@astrojs/vercel` 같은 어댑터를 추가하고
> `output: "server"`(또는 `hybrid`)로 설정하세요. 완전히 정적인 빌드는 엔드포인트를 실행할 수 없습니다.

## 3. 카운터 표시 (클라이언트)

적절한 것을 선택하세요. 세 가지 모두 같은 엔드포인트와 통신합니다.

### 웹 컴포넌트 — Astro / 순수 HTML (React 없음)

```astro
---
// 임의의 .astro 페이지
---
<p>조회수: <vistas-counter slug="blog">…</vistas-counter></p>

<script>
  import { defineVistasCounter } from "vistas/element";
  defineVistasCounter();
</script>

<style>
  vistas-counter { font-weight: 600; } /* 어떤 요소처럼 스타일 지정 */
</style>
```

### React / Next.js / React Native / LynxJS

```tsx
import { useViews } from "vistas/react";

export function Views({ slug }: { slug: string }) {
  const { count, loading } = useViews(slug);
  return <span>{loading ? "…" : count}</span>;
}
```

React Native (`localStorage` 없음, 엔드포인트는 절대 경로여야 함):

```tsx
import AsyncStorage from "@react-native-async-storage/async-storage";

const { count } = useViews("blog", {
  endpoint: "https://yoursite.com/api/views",
  storage: AsyncStorage,
});
```

### 순수 함수 (직접 UI 구축)

```ts
import { trackView } from "vistas";

const count = await trackView("blog"); // 첫 방문시 POST, 이후 GET
document.querySelector("#views").textContent = String(count);
```

### 배지 — 이미지가 사용되는 곳이면 어디서든 작동 (Markdown 포함)

```html
<img src="https://yoursite.com/api/views/blog.svg" alt="views" />
```

JS 제로이지만, 매 로드마다 카운트되며 이미지에는 스타일을 적용할 수 없습니다 — 정확성 + 커스텀 CSS가 필요할 때는 위의 네이티브 옵션을 사용하세요.

---

## 비공개 통계 페이지 (랭킹)

트래픽 순으로 모든 페이지를 읽는 두 번째 라우트를 추가하세요:

```ts
// Astro: src/pages/api/views/ranking.ts   (Next: app/api/views/ranking/route.ts)
import { createUpstashAdapter, createRankingHandler } from "vistas/server";

export const { GET } = createRankingHandler(createUpstashAdapter());
```

`GET /api/views/ranking` → `[{ "slug": "blog", "count": 152 }, ...]` (`?limit=10` 지원).
비공개 `/admin` 페이지에서 렌더링하면 즉시 미니 대시보드를 사용할 수 있습니다.

---

## API

### 클라이언트 — `vistas`

```ts
trackView(slug, options?): Promise<number>
createTracker(options?): { track(slug): Promise<number> }
```

`options`: `endpoint` (기본값 `"/api/views"`), `cooldown` (기본값 `"24h"`; `ms` 숫자
또는 `"30m"`/`"24h"`/`"7d"`), `storage` (기본값 `localStorage` → 메모리 폴백),
`fetch` (커스텀 fetch). `trackView`는 UI에 에러를 던지지 않습니다 — 에러 시 `0`을 반환합니다.

### 엘리먼트 — `vistas/element`

```ts
defineVistasCounter(options?): void   // <vistas-counter slug endpoint cooldown> 등록
```

### React — `vistas/react`

```ts
useViews(slug, options?): { count: number | null; loading: boolean; error: Error | null }
```

### 서버 — `vistas/server`

```ts
createUpstashAdapter(options?): ViewsAdapter   // { url?, token?, key?, redis? }
createRouteHandlers(views, options?): { GET, POST }
createRankingHandler(views): { GET }
renderCountSvg(count, options?): string
```

다른 데이터베이스를 사용하고 싶으시면 `ViewsAdapter` 인터페이스를 구현하세요
(`increment`, `get`, `getMany`, `getRanking`) 그리고 핸들러에 전달하세요.

---

## 카운팅 작동 방식

```
브라우저 / 앱 ──fetch──▶  /api/views/[slug]      ──▶  Upstash Redis (여러분의 DB)
  localStorage 중복제거     서버리스 라우트             정렬 집합:
  (쿨다운당 1회 카운트)     (토큰 보관)               카운트 + 랭킹
```

쿨다운 내 첫 방문은 `POST`(증가)를 보내며, 이후 방문은 `GET`(읽기 전용)을 보냅니다. 카운트는 단일 Redis 정렬 집합에 저장되므로, 페이지별 합계와 전체 랭킹이 같은 구조에서 나옵니다.

## 라이선스

MIT