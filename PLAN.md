# vistas — Implementation Plan

> A tiny, framework-agnostic **page-view counter** you can publish to npm.
> One job: count real views per route, return the number, let you style it.
> This file consolidates the three drafts in `plan/` into the version being built.

---

## 1. What it is (and isn't)

- ✅ Counts real views per route/slug (`/blog`, `/articles`, `f1`, …), with refresh **dedup**.
- ✅ Gives you the number to render **your own way** (no forced UI), plus a one-line **badge** mode.
- ✅ Per-tab counter **and** a ranking of all pages in one query.
- ✅ Works in Astro (no React needed), plain HTML, Next.js, React, React Native, LynxJS.
- ❌ Not an analytics platform. No dashboards, no tracking pixels-as-a-service, no funnels.

## 2. The model: BYOD (Bring Your Own Database)

The package ships **code only**. It hosts nothing and costs the author nothing.
Each user supplies:

```
Browser / App ──fetch──▶  /api/views/[slug]      ──▶  Upstash Redis (free)
 (localStorage dedup)      serverless route on            the actual counts,
                           the user's own host            in the user's own DB
```

- **Data store:** Upstash Redis (serverless, REST, free tier — *not* self-hosted redis.io).
- **Compute:** a serverless endpoint the user already gets from their host (Vercel/Netlify/
  Cloudflare/Astro SSR). The endpoint holds the secret token; the client never sees it.
- **Why Upstash Redis:** one `ZINCRBY` on a single sorted set gives increment **and** ranking
  **and** batch reads. REST works from any runtime. Free, no credit card.

> Security: the Redis REST **token is a write key** — it lives only in server `.env`,
> never in client code. The endpoint is the gatekeeper.

## 3. Two consumption modes (same backend)

| Mode | Usage | Trade-off |
|---|---|---|
| **Native** (default) | `<vistas-counter slug="blog">` web component, or `trackView()`, or `useViews()` | Accurate (localStorage dedup), fully stylable with your own CSS |
| **Badge** | `<img src="https://you.com/api/views/blog.svg">` | Works anywhere incl. markdown, zero JS; every load counts, not stylable |

Astro/HTML use the **web component** or `trackView` — **no React required**. React is only for
the Next.js / React Native / LynxJS family via the `useViews` hook.

## 4. Package shape (single package, subpath exports)

```
vistas              → core client: trackView, createTracker, types        (zero deps)
vistas/element      → defineVistasCounter() — the <vistas-counter> web component
vistas/react        → useViews() hook (React / Next / RN / Lynx)           (peer: react)
vistas/server       → createUpstashAdapter, createRouteHandlers, createRankingHandler,
                       renderCountSvg                                       (peer: @upstash/redis)
```

`@upstash/redis` and `react` are **optional peer dependencies** — client/RN users don't pull
Redis; static sites don't pull React. The core client stays dependency-free and tiny.

### Source layout
```
src/
├── index.ts                  re-exports the client core
├── shared/types.ts           shared types + helpers (normalizeSlug, parseDuration)
├── client/
│   ├── storage.ts            StorageLike abstraction (localStorage → memory fallback, async-safe)
│   ├── index.ts              trackView(slug, opts), createTracker(opts)
│   └── element.ts            defineVistasCounter() — SSR-safe custom element
├── react/index.ts            useViews(slug, opts) — StrictMode-safe
└── server/
    ├── adapters/upstash.ts   createUpstashAdapter({ url?, token? })  (defaults to env)
    ├── svg.ts                renderCountSvg(count, opts)
    ├── handler.ts            createRouteHandlers(views, opts) → { GET, POST }
    └── index.ts              createViews(adapter), ViewsAdapter type, re-exports
```

## 5. Data model (Upstash Redis)

One sorted set, key `vistas:ranking`:

| Op | Redis | Returns |
|---|---|---|
| increment | `ZINCRBY vistas:ranking 1 <slug>` | new count |
| get one | `ZSCORE vistas:ranking <slug>` | count or 0 |
| get many | `ZMSCORE vistas:ranking <slugs…>` | `{ slug: count }` |
| ranking | `ZRANGE vistas:ranking 0 N REV WITHSCORES` | `[{ slug, count }]` desc |

Adapter interface (so Supabase/SQLite/etc. can be added later without touching the client):
```ts
interface ViewsAdapter {
  increment(slug: string): Promise<number>;
  get(slug: string): Promise<number>;
  getMany(slugs: string[]): Promise<Record<string, number>>;
  getRanking(limit?: number): Promise<{ slug: string; count: number }[]>;
}
```

## 6. Client behaviour

`trackView(slug, { endpoint='/api/views', cooldown='24h', storage?, fetch?, count=true })`:
1. normalize slug → key `vistas:viewed:<slug>`.
2. read last timestamp; `fresh = now - last < cooldown`.
3. `fresh ? GET : POST` to `${endpoint}/${slug}` → `{ count }`.
4. if not fresh, store `now`.
5. return count. **Never throws** into the page — failures resolve to a safe value.

- Storage is **injectable + async-safe**: defaults to `localStorage`; in SSR/RN/Lynx (no
  `localStorage`) falls back to in-memory; RN users pass `AsyncStorage`, Lynx its own storage.
- `fetch` is injectable for runtimes without a global `fetch`.

## 7. Server wiring (what the user writes)

```ts
// src/pages/api/views/[...slug].ts   (Astro example)
import { createUpstashAdapter, createRouteHandlers } from "vistas/server";

const views = createUpstashAdapter(); // reads UPSTASH_* from env
export const { GET, POST } = createRouteHandlers(views);
```
- `.svg` suffix or `Accept: image/svg+xml` → returns the **badge** SVG.
- JSON otherwise → `{ slug, count }`.
- A `/api/views/ranking` route (or `?ranking`) returns the full ranking for a private stats page.
- `Cache-Control: no-store` to avoid proxy/browser cache distorting counts.

## 8. Build & publish

- `tsup` multi-entry → ESM + CJS + `.d.ts`, `@upstash/redis` and `react` marked external.
- `target: es2020`, `platform: neutral`, `shims: false` (keep the client lean & browser-safe).
- `package.json` `exports` map per subpath; optional peer deps; `files: ["dist"]`.
- Smoke test: client logic against a mock `fetch`, server logic against a mock adapter
  (no network); optional live test if `UPSTASH_*` env is present.
- Name: ship as `vistas`; if taken on npm, fall back to scoped `@bastndev/vistas`.

## 9. Phases

- **Phase 1 (this pass):** core client + web component + Upstash adapter + route handlers +
  SVG badge + React hook + build wiring + tests + README.
- **Phase 2 (later, only if needed):** server-side cooldown (IP hash) for badge accuracy,
  bot filtering, extra DB adapters (Supabase/SQLite/Turso), dedicated Vue/Svelte wrappers.

Out of scope on purpose: monorepo, middleware system, SPA auto-tracking — added only if a real
need shows up.
