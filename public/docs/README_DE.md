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

> Ein kleines, framework-unabhängiges **Seitenaufruf-Zähler**. Eine Aufgabe: Echte Aufrufe pro Route zählen, dir die Zahl geben und sie dir gestalten lassen, wie du möchtest.

<br>

```bash
npm i viztas
```

<br>

- 🪶 **Klein & null Abhängigkeiten im Client** — Der Kern ist nur `fetch` + Speicher.
- 🔁 **Refresh-resistent** — `localStorage` Deduplizierung, damit Neuladen die Zahlen nicht aufbläht.
- 🧩 **Funktioniert überall** — Astro, einfaches HTML, Next.js, React, React Native, LynxJS.
- 🎨 **Deine UI** — Erhalte eine Zahl und rendere sie auf deine Weise, oder füge ein einzeiliges Badge hinzu.
- 🏆 **Pro-Seite Zählung + Ranking** — Sieh, welcher Artikel gewinnt, in einer einzigen Abfrage.
- 📦 **Bring deine eigene Datenbank mit** — Deine Daten leben in _deinem_ kostenlosen Upstash Redis. Das Paket hostet nichts.

> **Du brauchst:** Eine kostenlose [Upstash Redis](https://console.upstash.com) Datenbank und einen Host,
> der serverlose Endpoints ausführt (Vercel/Netlify/Cloudflare/Astro SSR). Der Endpoint
> hält das geheime Token; der Browser sieht es nie.

---

## 1. Datenbank einrichten (einmalig)

Erstelle eine kostenlose Datenbank auf [console.upstash.com](https://console.upstash.com) und lege
deren REST-Anmeldedaten in `.env` ab (siehe [`.env.example`](./.env.example)):

```bash
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-rest-token
```

## 2. API-Route hinzufügen (Server)

Erstelle einen Endpoint. Der Slug kommt aus der URL, also verwende eine Catch-All-Route.

```ts
// Astro: src/pages/api/views/[...slug].ts
import { createUpstashAdapter, createRouteHandlers } from "viztas/server";

const views = createUpstashAdapter(); // liest UPSTASH_* aus der Umgebung
export const { GET, POST } = createRouteHandlers(views);
```

```ts
// Next.js App Router: app/api/views/[...slug]/route.ts
import { createUpstashAdapter, createRouteHandlers } from "viztas/server";

const views = createUpstashAdapter();
export const { GET, POST } = createRouteHandlers(views);
```

> **Astro-Hinweis:** API-Routen benötigen SSR — füge einen Adapter wie `@astrojs/vercel` hinzu und setze
> `output: "server"` (oder `hybrid`). Ein vollständig statischer Build kann keine Endpoints ausführen.

## 3. Zähler anzeigen (Client)

Wähle die Option, die passt. Alle drei kommunizieren mit demselben Endpoint.

### Web-Komponente — Astro / einfaches HTML (kein React)

```astro
---
// jede beliebige .astro-Seite
---
<p>Aufrufe: <viztas-counter slug="blog">…</viztas-counter></p>

<script>
  import { defineViztasCounter } from "viztas/element";
  defineViztasCounter();
</script>

<style>
  viztas-counter { font-weight: 600; } /* gestalte es wie jedes andere Element */
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

React Native (kein `localStorage`, und der Endpoint muss absolut sein):

```tsx
import AsyncStorage from "@react-native-async-storage/async-storage";

const { count } = useViews("blog", {
  endpoint: "https://yoursite.com/api/views",
  storage: AsyncStorage,
});
```

### Reine Funktion (baue deine eigene UI)

```ts
import { trackView } from "viztas";

const count = await trackView("blog"); // POST beim ersten Besuch, danach GET
document.querySelector("#views").textContent = String(count);
```

### Badge — funktioniert überall, wo ein Bild funktioniert (sogar in Markdown)

```html
<img src="https://yoursite.com/api/views/blog.svg" alt="Aufrufe" />
```

Null JS, aber jeder Aufruf zählt und du kannst ein Bild nicht gestalten — verwende eine native Option
oben, wenn du Genauigkeit + dein eigenes CSS möchtest.

---

## Deine private Statistikseite (Ranking)

Füge eine zweite Route hinzu, um jede Seite nach Traffic sortiert zu lesen:

```ts
// Astro: src/pages/api/views/ranking.ts   (Next: app/api/views/ranking/route.ts)
import { createUpstashAdapter, createRankingHandler } from "viztas/server";

export const { GET } = createRankingHandler(createUpstashAdapter());
```

`GET /api/views/ranking` → `[{ "slug": "blog", "count": 152 }, ...]` (unterstützt `?limit=10`).
Rendere es auf einer privaten `/admin`-Seite für ein sofortiges Mini-Dashboard.

---

## API

### Client — `viztas`

```ts
trackView(slug, options?): Promise<number>
createTracker(options?): { track(slug): Promise<number> }
```

`options`: `endpoint` (Standard `"/api/views"`), `cooldown` (Standard `"24h"`; `ms`-Zahl
oder `"30m"`/`"24h"`/`"7d"`), `storage` (Standard `localStorage` → Speicher-Fallback),
`fetch` (benutzerdefiniertes Fetch). `trackView` wirft nie in deine UI — bei Fehler resolved es `0`.

### Element — `viztas/element`

```ts
defineViztasCounter(options?): void   // registriert <viztas-counter slug endpoint cooldown>
```

### React — `viztas/react`

```ts
useViews(slug, options?): { count: number | null; loading: boolean; error: Error | null }
```

### Server — `viztas/server`

```ts
createUpstashAdapter(options?): ViewsAdapter   // { url?, token?, key?, redis? }
createRouteHandlers(views, options?): { GET, POST }
createRankingHandler(views): { GET }
renderCountSvg(count, options?): string
```

Möchtest du eine andere Datenbank? Implementiere die `ViewsAdapter`-Schnittstelle
(`increment`, `get`, `getMany`, `getRanking`) und übergebe sie an die Handler.

---

## So funktioniert das Zählen

```
Browser / App ──fetch──▶  /api/views/[slug]      ──▶  Upstash Redis (deine DB)
  localStorage Dedup       dein serverloser Route       eine Sorted Set:
  (1 Zählung pro Cooldown) (hält das Token)            Zählung + Ranking
```

Der erste Besuch innerhalb des Cooldowns sendet `POST` (Erhöhung); spätere Besuche senden `GET`
(nur lesen). Zählungen leben in einem einzigen Redis Sorted Set, sodass pro-Seite-Total und
vollständiges Ranking aus derselben Struktur stammen.

## Lizenz

MIT