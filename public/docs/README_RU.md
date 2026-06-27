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
  <a href="https://github.com/bastndev/vistas/blob/main/public/docs/README_KO.md">한국어 🇰🇷</a> |
  <a href="https://github.com/bastndev/vistas/blob/main/public/docs/README_PT.md">Português 🇧🇷</a> |
  <a href="https://github.com/bastndev/vistas/blob/main/public/docs/README_VI.md">Tiếng Việt 🇻🇳</a> |
  <a href="https://github.com/bastndev/vistas/blob/main/public/docs/README_HI.md">हिन्दी 🇮🇳</a> |
  <a href="https://github.com/bastndev/vistas/blob/main/public/docs/README_AR.md">العربية 🇸🇦</a><span>...</span>
</p>

</div>

<br>

> Миниатюрный **счётчик просмотров страниц**, не привязанный к фреймворку. Одна задача: считать реальные просмотры по маршруту, передавать число и позволять стилизовать его как угодно.

<br>

```bash
npm i vistas
```

<br>

- 🪶 **Крошечный и нулевые зависимости на клиенте** — ядро — это просто `fetch` + хранилище.
- 🔁 **Устойчивость к обновлению** — дедупликация через `localStorage`, поэтому перезагрузки не раздувают счётчики.
- 🧩 **Работает везде** — Astro, чистый HTML, Next.js, React, React Native, LynxJS.
- 🎨 **Ваш интерфейс** — получите число и отрендерите его своим способом, или добавьте значок в одну строку.
- 🏆 **Подсчёт по страницам + рейтинг** — увидьте, какая статья побеждает, одним запросом.
- 📣 **Собственная база данных** — ваши данные хранятся в _вашем_ бесплатном Redis Upstash. Пакет ничего не хостит.

> **Вам нужно:** бесплатная база данных [Upstash Redis](https://console.upstash.com) и хост,
> выполняющий серверless-эндпоинты (Vercel/Netlify/Cloudflare/Astro SSR). Эндпоинт
> хранит секретный токен; браузер никогда его не видит.

---

## 1. Настройка базы данных (один раз)

Создайте бесплатную базу данных на [console.upstash.com](https://console.upstash.com), затем поместите
её REST-учётные данные в `.env` (см. [`.env.example`](./.env.example)):

```bash
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-rest-token
```

## 2. Добавление API-маршрута (сервер)

Создайте эндпоинт. Слаг берётся из URL, поэтому используйте маршрут-ловушку.

```ts
// Astro: src/pages/api/views/[...slug].ts
import { createUpstashAdapter, createRouteHandlers } from "vistas/server";

const views = createUpstashAdapter(); // читает UPSTASH_* из переменных окружения
export const { GET, POST } = createRouteHandlers(views);
```

```ts
// Next.js App Router: app/api/views/[...slug]/route.ts
import { createUpstashAdapter, createRouteHandlers } from "vistas/server";

const views = createUpstashAdapter();
export const { GET, POST } = createRouteHandlers(views);
```

> **Заметка для Astro:** API-маршруты требуют SSR — добавьте адаптер, такой как `@astrojs/vercel`, и установите
> `output: "server"` (или `hybrid`). Полностью статическая сборка не может запускать эндпоинты.

## 3. Отображение счётчика (клиент)

Выберите подходящий вариант. Все три общаются с одним и тем же эндпоинтом.

### Веб-компонент — Astro / чистый HTML (без React)

```astro
---
// любая страница .astro
---
<p>Просмотры: <vistas-counter slug="blog">…</vistas-counter></p>

<script>
  import { defineVistasCounter } from "vistas/element";
  defineVistasCounter();
</script>

<style>
  vistas-counter { font-weight: 600; } /* стилизуйте как любой элемент */
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

React Native (без `localStorage`, и эндпоинт должен быть абсолютным):

```tsx
import AsyncStorage from "@react-native-async-storage/async-storage";

const { count } = useViews("blog", {
  endpoint: "https://yoursite.com/api/views",
  storage: AsyncStorage,
});
```

### Чистая функция (создайте свой интерфейс)

```ts
import { trackView } from "vistas";

const count = await trackView("blog"); // POST при первом визите, GET после
document.querySelector("#views").textContent = String(count);
```

### Значок — работает там, где работает изображение (даже в Markdown)

```html
<img src="https://yoursite.com/api/views/blog.svg" alt="просмотры" />
```

Ноль JS, но каждая загрузка считается, и вы не можете стилизовать изображение — используйте нативную опцию выше, когда нужна точность + собственный CSS.

---

## Ваша приватная страница статистики (рейтинг)

Добавьте второй маршрут для чтения всех страниц, упорядоченных по трафику:

```ts
// Astro: src/pages/api/views/ranking.ts   (Next: app/api/views/ranking/route.ts)
import { createUpstashAdapter, createRankingHandler } from "vistas/server";

export const { GET } = createRankingHandler(createUpstashAdapter());
```

`GET /api/views/ranking` → `[{ "slug": "blog", "count": 152 }, ...]` (поддерживает `?limit=10`).
Отрендерьте его на приватной странице `/admin` для мгновенной мини-панели управления.

---

## API

### Клиент — `vistas`

```ts
trackView(slug, options?): Promise<number>
createTracker(options?): { track(slug): Promise<number> }
```

`options`: `endpoint` (по умолчанию `"/api/views"`), `cooldown` (по умолчанию `"24h"`; число `ms`
или `"30m"`/`"24h"`/`"7d"`), `storage` (по умолчанию `localStorage` → запас в памяти),
`fetch` (кастомный fetch). `trackView` никогда не бросает ошибку в ваш интерфейс — при ошибке возвращает `0`.

### Элемент — `vistas/element`

```ts
defineVistasCounter(options?): void   // регистрирует <vistas-counter slug endpoint cooldown>
```

### React — `vistas/react`

```ts
useViews(slug, options?): { count: number | null; loading: boolean; error: Error | null }
```

### Сервер — `vistas/server`

```ts
createUpstashAdapter(options?): ViewsAdapter   // { url?, token?, key?, redis? }
createRouteHandlers(views, options?): { GET, POST }
createRankingHandler(views): { GET }
renderCountSvg(count, options?): string
```

Хотите другую базу данных? Реализуйте интерфейс `ViewsAdapter`
(`increment`, `get`, `getMany`, `getRanking`) и передайте его обработчикам.

---

## Как работает подсчёт

```
Браузер / Приложение ──fetch──▶  /api/views/[slug]      ──▶  Upstash Redis (ваша БД)
  localStorage дедупликация       ваш серверless-маршрут     одно отсортированное множество:
  (1 счёт за cooldown)           (хранит токен)             счёт + рейтинг
```

Первый визит в пределах cooldown отправляет `POST` (инкремент); последующие визиты отправляют `GET`
(только чтение). Счётчики хранятся в одном отсортированном множестве Redis, поэтому итоги по страницам и
полный рейтинг берутся из одной структуры.

## Лицензия

MIT © [bastndev](https://github.com/bastndev)