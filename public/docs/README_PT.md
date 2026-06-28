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
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_JA.md">日本語 🇯🇵</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_KO.md">한국어 🇰🇷</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_RU.md">Русский 🇷🇺</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_VI.md">Tiếng Việt 🇻🇳</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_HI.md">हिन्दी 🇮🇳</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_AR.md">العربية 🇸🇦</a><span>...</span>
</p>

</div>

<br>

> Um pequeno **contador de visualizações de página** independente de framework. Um único trabalho: contar visualizações reais por rota, entregar o número e permitir que você estilize como quiser.

<br>

```bash
npm i viztas
```

<br>

- 🪶 **Pequeno e zero dependências no cliente** — O núcleo é apenas `fetch` + armazenamento.
- 🔁 **Resistente a atualizações** — Deduplicação via `localStorage`, para que recargas não inflam as contagens.
- 🧩 **Funciona em qualquer lugar** — Astro, HTML puro, Next.js, React, React Native, LynxJS.
- 🎨 **Sua UI** — Receba um número e renderize do seu jeito, ou adicione um badge de uma linha.
- 🏆 **Contagens por página + ranking** — Veja qual artigo está ganhando, em uma única consulta.
- 📦 **Traga seu próprio banco de dados** — Seus dados ficam no _seu_ Redis Upstash gratuito. O pacote não hospeda nada.

> **Você precisa:** de um banco de dados gratuito [Upstash Redis](https://console.upstash.com) e de um host
> que execute endpoints serverless (Vercel/Netlify/Cloudflare/Astro SSR). O endpoint
> guarda o token secreto; o navegador nunca o vê.

---

## 1. Configurar o banco de dados (uma vez)

Crie um banco de dados gratuito em [console.upstash.com](https://console.upstash.com), depois coloque
suas credenciais REST no `.env` (veja [`.env.example`](./.env.example)):

```bash
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-rest-token
```

## 2. Adicionar a rota API (servidor)

Crie um endpoint. O slug vem da URL, então use uma rota catch-all.

```ts
// Astro: src/pages/api/views/[...slug].ts
import { createUpstashAdapter, createRouteHandlers } from "viztas/server";

const views = createUpstashAdapter(); // lê UPSTASH_* do ambiente
export const { GET, POST } = createRouteHandlers(views);
```

```ts
// Next.js App Router: app/api/views/[...slug]/route.ts
import { createUpstashAdapter, createRouteHandlers } from "viztas/server";

const views = createUpstashAdapter();
export const { GET, POST } = createRouteHandlers(views);
```

> **Nota Astro:** Rotas de API precisam de SSR — adicione um adaptador como `@astrojs/vercel` e defina
> `output: "server"` (ou `hybrid`). Uma compilação totalmente estática não pode executar endpoints.

## 3. Exibir o contador (cliente)

Escolha o que se encaixa. Todos os três se comunicam com o mesmo endpoint.

### Componente web — Astro / HTML puro (sem React)

```astro
---
// qualquer página .astro
---
<p>Visualizações: <viztas-counter slug="blog">…</viztas-counter></p>

<script>
  import { defineViztasCounter } from "viztas/element";
  defineViztasCounter();
</script>

<style>
  viztas-counter { font-weight: 600; } /* estilize como qualquer elemento */
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

React Native (sem `localStorage`, e o endpoint deve ser absoluto):

```tsx
import AsyncStorage from "@react-native-async-storage/async-storage";

const { count } = useViews("blog", {
  endpoint: "https://yoursite.com/api/views",
  storage: AsyncStorage,
});
```

### Função pura (construa sua própria UI)

```ts
import { trackView } from "viztas";

const count = await trackView("blog"); // POST na primeira visita, GET depois
document.querySelector("#views").textContent = String(count);
```

### Badge — funciona onde uma imagem funciona (até em Markdown)

```html
<img src="https://yoursite.com/api/views/blog.svg" alt="visualizações" />
```

Zero JS, mas cada carga conta e você não pode estilizar uma imagem — use uma opção nativa
acima quando quiser precisão + seu próprio CSS.

---

## Sua página de estatísticas privada (ranking)

Adicione uma segunda rota para ler cada página ordenada por tráfego:

```ts
// Astro: src/pages/api/views/ranking.ts   (Next: app/api/views/ranking/route.ts)
import { createUpstashAdapter, createRankingHandler } from "viztas/server";

export const { GET } = createRankingHandler(createUpstashAdapter());
```

`GET /api/views/ranking` → `[{ "slug": "blog", "count": 152 }, ...]` (suporta `?limit=10`).
Renderize em uma página privada `/admin` para um mini-dashboard instantâneo.

---

## API

### Cliente — `vistas`

```ts
trackView(slug, options?): Promise<number>
createTracker(options?): { track(slug): Promise<number> }
```

`options`: `endpoint` (padrão `"/api/views"`), `cooldown` (padrão `"24h"`; número `ms`
ou `"30m"`/`"24h"`/`"7d"`), `storage` (padrão `localStorage` → fallback em memória),
`fetch` (fetch personalizado). `trackView` nunca lança erro na sua UI — em caso de erro resolve `0`.

### Elemento — `vistas/element`

```ts
defineViztasCounter(options?): void   // registra <viztas-counter slug endpoint cooldown>
```

### React — `viztas/react`

```ts
useViews(slug, options?): { count: number | null; loading: boolean; error: Error | null }
```

### Servidor — `vistas/server`

```ts
createUpstashAdapter(options?): ViewsAdapter   // { url?, token?, key?, redis? }
createRouteHandlers(views, options?): { GET, POST }
createRankingHandler(views): { GET }
renderCountSvg(count, options?): string
```

Quer um banco de dados diferente? Implemente a interface `ViewsAdapter`
(`increment`, `get`, `getMany`, `getRanking`) e passe para os handlers.

---

## Como a contagem funciona

```
Navegador / App ──fetch──▶  /api/views/[slug]      ──▶  Upstash Redis (seu DB)
  localStorage dedup        sua rota serverless        um sorted set:
  (1 contagem por cooldown) (guarda o token)           contagem + ranking
```

A primeira visita dentro do cooldown envia `POST` (incremento); visitas subsequentes enviam `GET`
(somente leitura). As contagens ficam em um único sorted set do Redis, então totais por página e o
ranking completo vêm da mesma estrutura.

## Licença

MIT