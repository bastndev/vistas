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
  <a href="https://github.com/bastndev/vistaz/blob/main/README.md">English 🇺🇸</a> |
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

> Un pequeño **contador de vistaz de página** independiente del framework. Un solo trabajo: contar las vistaz reales por ruta, devolverte el número y permitirte estilizarlo como quieras.

<br>

```bash
npm i vistaz
```

<br>

- 🪶 **Pequeño y cero dependencias en el cliente** — el núcleo es solo `fetch` + almacenamiento.
- 🔁 **Resistente a actualizaciones** — deduplicación con `localStorage`, para que las recargas no inflen los conteos.
- 🧩 **Funciona en todas partes** — Astro, HTML puro, Next.js, React, React Native, LynxJS.
- 🎨 **Tu interfaz** — obtén un número y renderízalo a tu manera, o usa un badge de una línea.
- 🏆 **Conteos por página + clasificación** — ve qué artículo está ganando, en una sola consulta.
- 📦 **Trae tu propia base de datos** — tus datos viven en _tu_ Redis Upstash gratuito. El paquete no aloja nada.

> **Necesitas:** una base de datos gratuita de [Upstash Redis](https://console.upstash.com) y un host
> que ejecute endpoints serverless (Vercel/Netlify/Cloudflare/Astro SSR). El endpoint
> mantiene el token secreto; el navegador nunca lo ve.

---

## 1. Configurar la base de datos (una vez)

Crea una base de datos gratuita en [console.upstash.com](https://console.upstash.com), luego pon
sus credenciales REST en `.env` (ve [`.env.example`](./.env.example)):

```bash
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-rest-token
```

## 2. Agregar la ruta API (servidor)

Crea un endpoint. El slug viene de la URL, así que usa una ruta catch-all.

```ts
// Astro: src/pages/api/views/[...slug].ts
import { createUpstashAdapter, createRouteHandlers } from "vistaz/server";

const views = createUpstashAdapter(); // lee UPSTASH_* del entorno
export const { GET, POST } = createRouteHandlers(views);
```

```ts
// Next.js App Router: app/api/views/[...slug]/route.ts
import { createUpstashAdapter, createRouteHandlers } from "vistaz/server";

const views = createUpstashAdapter();
export const { GET, POST } = createRouteHandlers(views);
```

> **Nota de Astro:** Las rutas API necesitan SSR — agrega un adaptador como `@astrojs/vercel` y establece
> `output: "server"` (o `hybrid`). Una compilación completamente estática no puede ejecutar endpoints.

### 🚀 Nota para usuarios de Astro / Vite

Dado que Astro y Vite exponen las variables de entorno de forma segura a través de `import.meta.env` en lugar
del global `process.env` de Node, la lectura automática de credenciales no funcionará de forma predeterminada.

Si usas Astro o Vite, debes pasar explícitamente tus credenciales de Upstash al adaptador:

```javascript
import { createUpstashAdapter, createRouteHandlers } from "vistaz/server";

const views = createUpstashAdapter({
  url: import.meta.env.UPSTASH_REDIS_REST_URL,
  token: import.meta.env.UPSTASH_REDIS_REST_TOKEN
});
export const { GET, POST } = createRouteHandlers(views);
```

## 3. Mostrar el contador (cliente)

Elige el que se ajuste. Los tres hablan con el mismo endpoint.

### Componente web — Astro / HTML puro (sin React)

```astro
---
// cualquier página .astro
---
<p>Vistaz: <vistaz-counter slug="blog">…</vistaz-counter></p>

<script>
  import { defineViztasCounter } from "vistaz/element";
  defineViztasCounter();
</script>

<style>
  vistaz-counter { font-weight: 600; } /* estilízalo como cualquier elemento */
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

React Native (sin `localStorage`, y el endpoint debe ser absoluto):

```tsx
import AsyncStorage from "@react-native-async-storage/async-storage";

const { count } = useViews("blog", {
  endpoint: "https://yoursite.com/api/views",
  storage: AsyncStorage,
});
```

### Función pura (construye tu propia interfaz)

```ts
import { trackView } from "vistaz";

const count = await trackView("blog"); // POST en la primera visita, GET después
document.querySelector("#views").textContent = String(count);
```

### Badge — funciona donde una imagen lo haga (incluso en Markdown)

```html
<img src="https://yoursite.com/api/views/blog.svg" alt="vistaz" />
```

Cero JS, pero cada carga cuenta y no puedes estilizar una imagen — usa una opción nativa
anterior cuando quieras precisión + tu propio CSS.

---

## Tu página de estadísticas privada (clasificación)

Agrega una segunda ruta para leer cada página ordenada por tráfico:

```ts
// Astro: src/pages/api/views/ranking.ts   (Next: app/api/views/ranking/route.ts)
import { createUpstashAdapter, createRankingHandler } from "vistaz/server";

export const { GET } = createRankingHandler(createUpstashAdapter());
```

`GET /api/views/ranking` → `[{ "slug": "blog", "count": 152 }, ...]` (soporta `?limit=10`).
Renderízalo en una página privada `/admin` para un mini-dashboard instantáneo.

---

## API

### Cliente — `vistaz`

```ts
trackView(slug, options?): Promise<number>
createTracker(options?): { track(slug): Promise<number> }
```

`options`: `endpoint` (por defecto `"/api/views"`), `cooldown` (por defecto `"24h"`; número `ms`
o `"30m"`/`"24h"`/`"7d"`), `storage` (por defecto `localStorage` → fallback a memoria),
`fetch` (fetch personalizado). `trackView` nunca lanza errores en tu interfaz — en caso de error resuelve `0`.

### Elemento — `vistaz/element`

```ts
defineViztasCounter(options?): void   // registra <vistaz-counter slug endpoint cooldown>
```

### React — `vistaz/react`

```ts
useViews(slug, options?): { count: number | null; loading: boolean; error: Error | null }
```

### Servidor — `vistaz/server`

```ts
createUpstashAdapter(options?): ViewsAdapter   // { url?, token?, key?, redis? }
createRouteHandlers(views, options?): { GET, POST }
createRankingHandler(views): { GET }
renderCountSvg(count, options?): string
```

¿Quieres una base de datos diferente? Implementa la interfaz `ViewsAdapter`
(`increment`, `get`, `getMany`, `getRanking`) y pásala a los handlers.

---

## Cómo funciona el conteo

```
Navegador / App ──fetch──▶  /api/views/[slug]      ──▶  Upstash Redis (tu DB)
  localStorage dedup        tu ruta serverless          un sorted set:
  (1 conteo por cooldown)   (mantiene el token)         conteo + clasificación
```

La primera visita dentro del cooldown envía `POST` (incrementar); las visitas posteriores envían `GET`
(solo lectura). Los conteos viven en un solo sorted set de Redis, por lo que los totales por página y la
clasificación completa provienen de la misma estructura.

## Licencia

MIT