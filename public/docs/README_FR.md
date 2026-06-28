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

> Un petit **compteur de vues de page** indépendant du framework. Un seul travail : compter les vraies vues par route, vous donner le nombre et vous laisser le styliser comme vous le souhaitez.

<br>

```bash
npm i viztas
```

<br>

- 🪶 **Léger et zéro dépendance côté client** — Le noyau n'est que `fetch` + stockage.
- 🔁 **Résistant au rafraîchissement** — Dédoublonnage via `localStorage`, donc les rechargements n'enflent pas les compteurs.
- 🧩 **Fonctionne partout** — Astro, HTML simple, Next.js, React, React Native, LynxJS.
- 🎨 **Votre interface** — Obtenez un nombre et rendez-le à votre manière, ou ajoutez un badge en une ligne.
- 🏆 **Comptes par page + classement** — Voyez quel article gagne, en une seule requête.
- 📦 **Apportez votre propre base de données** — Vos données vivent dans _votre_ Redis Upstash gratuit. Le package n'héberge rien.

> **Vous avez besoin :** d'une base de données gratuite [Upstash Redis](https://console.upstash.com) et d'un hébergeur
> qui exécute des endpoints serverless (Vercel/Netlify/Cloudflare/Astro SSR). L'endpoint
> détient le token secret ; le navigateur ne le voit jamais.

---

## 1. Configurer la base de données (une fois)

Créez une base de données gratuite sur [console.upstash.com](https://console.upstash.com), puis placez
ses identifiants REST dans `.env` (voir [`.env.example`](./.env.example)) :

```bash
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-rest-token
```

## 2. Ajouter la route API (serveur)

Créez un endpoint. Le slug vient de l'URL, donc utilisez une route catch-all.

```ts
// Astro: src/pages/api/views/[...slug].ts
import { createUpstashAdapter, createRouteHandlers } from "viztas/server";

const views = createUpstashAdapter(); // lit UPSTASH_* depuis l'environnement
export const { GET, POST } = createRouteHandlers(views);
```

```ts
// Next.js App Router: app/api/views/[...slug]/route.ts
import { createUpstashAdapter, createRouteHandlers } from "viztas/server";

const views = createUpstashAdapter();
export const { GET, POST } = createRouteHandlers(views);
```

> **Note Astro :** Les routes API nécessitent SSR — ajoutez un adaptateur comme `@astrojs/vercel` et définissez
> `output: "server"` (ou `hybrid`). Un build entièrement statique ne peut pas exécuter des endpoints.

## 3. Afficher le compteur (client)

Choisissez celui qui convient. Les trois communiquent avec le même endpoint.

### Composant web — Astro / HTML simple (pas de React)

```astro
---
// n'importe quelle page .astro
---
<p>Vues : <viztas-counter slug="blog">…</viztas-counter></p>

<script>
  import { defineViztasCounter } from "viztas/element";
  defineViztasCounter();
</script>

<style>
  viztas-counter { font-weight: 600; } /* stylisez-le comme n'importe quel élément */
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

React Native (pas de `localStorage`, et l'endpoint doit être absolu) :

```tsx
import AsyncStorage from "@react-native-async-storage/async-storage";

const { count } = useViews("blog", {
  endpoint: "https://yoursite.com/api/views",
  storage: AsyncStorage,
});
```

### Fonction pure (construisez votre propre interface)

```ts
import { trackView } from "viztas";

const count = await trackView("blog"); // POST lors de la première visite, GET ensuite
document.querySelector("#views").textContent = String(count);
```

### Badge — fonctionne partout où une image fonctionne (même en Markdown)

```html
<img src="https://yoursite.com/api/views/blog.svg" alt="vues" />
```

Zéro JS, mais chaque chargement compte et vous ne pouvez pas styliser une image — utilisez une option native
ci-dessus quand vous voulez de la précision + votre propre CSS.

---

## Votre page de statistiques privée (classement)

Ajoutez une deuxième route pour lire chaque page triée par trafic :

```ts
// Astro: src/pages/api/views/ranking.ts   (Next: app/api/views/ranking/route.ts)
import { createUpstashAdapter, createRankingHandler } from "viztas/server";

export const { GET } = createRankingHandler(createUpstashAdapter());
```

`GET /api/views/ranking` → `[{ "slug": "blog", "count": 152 }, ...]` (supporte `?limit=10`).
Rendez-le sur une page privée `/admin` pour un mini tableau de bord instantané.

---

## API

### Client — `viztas`

```ts
trackView(slug, options?): Promise<number>
createTracker(options?): { track(slug): Promise<number> }
```

`options` : `endpoint` (par défaut `"/api/views"`), `cooldown` (par défaut `"24h"` ; nombre `ms`
ou `"30m"`/`"24h"`/`"7d"`), `storage` (par défaut `localStorage` → fallback mémoire),
`fetch` (fetch personnalisé). `trackView` ne lance jamais dans votre interface — en cas d'erreur, il résout `0`.

### Élément — `vistas/element`

```ts
defineViztasCounter(options?): void   // enregistre <viztas-counter slug endpoint cooldown>
```

### React — `viztas/react`

```ts
useViews(slug, options?): { count: number | null; loading: boolean; error: Error | null }
```

### Serveur — `vistas/server`

```ts
createUpstashAdapter(options?): ViewsAdapter   // { url?, token?, key?, redis? }
createRouteHandlers(views, options?): { GET, POST }
createRankingHandler(views): { GET }
renderCountSvg(count, options?): string
```

Vous voulez une autre base de données ? Implémentez l'interface `ViewsAdapter`
(`increment`, `get`, `getMany`, `getRanking`) et passez-la aux gestionnaires.

---

## Comment fonctionne le comptage

```
Navigateur / App ──fetch──▶  /api/views/[slug]      ──▶  Upstash Redis (votre DB)
  localStorage dédoublonnage  votre route serverless     un sorted set :
  (1 compte par cooldown)    (garde le token)            compte + classement
```

La première visite dans le cooldown envoie `POST` (incrémentation) ; les visites suivantes envoient `GET`
(lecture seule). Les comptes vivent dans un seul sorted set Redis, donc les totaux par page et le
classement complet proviennent de la même structure.

## Licence

MIT