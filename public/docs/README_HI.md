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
  <a href="https://github.com/bastndev/vistas/blob/main/public/docs/README_RU.md">Русский 🇷🇺</a> |
  <a href="https://github.com/bastndev/vistas/blob/main/public/docs/README_VI.md">Tiếng Việt 🇻🇳</a> |
  <a href="https://github.com/bastndev/vistas/blob/main/public/docs/README_AR.md">العربية 🇸🇦</a><span>...</span>
</p>

</div>

<br>

> एक छोटा, फ्रेमवर्क-अज्ञ **पेज-व्यू काउंटर**। एक ही काम: प्रति रूट वास्तविक व्यू गिनें, आपको संख्या दें, और आप इसे जैसे चाहें स्टाइल कर सकें।

<br>

```bash
npm i vistas
```

<br>

- 🪶 **छोटा और ज़ीरो डिपेंडेंसी क्लाइंट** — कोर बस `fetch` + स्टोरेज है।
- 🔁 **रिफ्रेश-प्रूफ** — `localStorage` डिड्यूप, ताकि रीलोड से काउंट न बढ़ें।
- 🧩 **हर जगह काम करता है** — Astro, प्लेन HTML, Next.js, React, React Native, LynxJS।
- 🎨 **आपकी UI** — एक संख्या प्राप्त करें और अपने तरीके से रेंडर करें, या एक लाइन का बैज डालें।
- 🏆 **पेज-वाइज़ काउंट + रैंकिंग** — देखें कौन सा लेख जीत रहा है, एक ही क्वेरी में।
- 📦 **अपना डेटाबेस लाएं** — आपका डेटा _आपके_ मुफ्त Upstash Redis में रहता है। पैकेज कुछ भी होस्ट नहीं करता।

> **आपको चाहिए:** एक मुफ्त [Upstash Redis](https://console.upstash.com) डेटाबेस और एक होस्ट
> जो सर्वरलेस एंडपॉइंट चलाए (Vercel/Netlify/Cloudflare/Astro SSR)। एंडपॉइंट
> सीक्रेट टोकन रखता है; ब्राउज़र कभी नहीं देखता।

---

## 1. डेटाबेस सेट करें (एक बार)

[console.upstash.com](https://console.upstash.com) पर एक मुफ्त डेटाबेस बनाएं, फिर उसके
REST क्रेडेंशियल्स को `.env` में डालें ([`.env.example`](./.env.example) देखें):

```bash
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-rest-token
```

## 2. API रूट जोड़ें (सर्वर)

एक एंडपॉइंट बनाएं। स्लैग URL से आता है, इसलिए कैच-ऑल रूट का उपयोग करें।

```ts
// Astro: src/pages/api/views/[...slug].ts
import { createUpstashAdapter, createRouteHandlers } from "vistas/server";

const views = createUpstashAdapter(); // env से UPSTASH_* पढ़ता है
export const { GET, POST } = createRouteHandlers(views);
```

```ts
// Next.js App Router: app/api/views/[...slug]/route.ts
import { createUpstashAdapter, createRouteHandlers } from "vistas/server";

const views = createUpstashAdapter();
export const { GET, POST } = createRouteHandlers(views);
```

> **Astro नोट:** API रूट्स को SSR चाहिए — `@astrojs/vercel` जैसा एडैप्टर जोड़ें और
> `output: "server"` (या `hybrid`) सेट करें। पूरी तरह से स्टैटिक बिल्ड एंडपॉइंट नहीं चला सकता।

## 3. काउंटर दिखाएं (क्लाइंट)

जो उपयुक्त हो चुनें। तीनों एक ही एंडपॉइंट से बात करते हैं।

### वेब कंपोनेंट — Astro / प्लेन HTML (React नहीं)

```astro
---
// कोई भी .astro पेज
---
<p>व्यूज़: <vistas-counter slug="blog">…</vistas-counter></p>

<script>
  import { defineVistasCounter } from "vistas/element";
  defineVistasCounter();
</script>

<style>
  vistas-counter { font-weight: 600; } /* किसी भी एलिमेंट की तरह स्टाइल करें */
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

React Native (`localStorage` नहीं, और एंडपॉइंट एब्सोल्यूट होना चाहिए):

```tsx
import AsyncStorage from "@react-native-async-storage/async-storage";

const { count } = useViews("blog", {
  endpoint: "https://yoursite.com/api/views",
  storage: AsyncStorage,
});
```

### प्लेन फंक्शन (अपनी UI बनाएं)

```ts
import { trackView } from "vistas";

const count = await trackView("blog"); // पहली विज़िट पर POST, बाद में GET
document.querySelector("#views").textContent = String(count);
```

### बैज — कहीं भी काम करता है जहाँ इमेज काम करे (Markdown में भी)

```html
<img src="https://yoursite.com/api/views/blog.svg" alt="व्यूज़" />
```

ज़ीरो JS, लेकिन हर लोड काउंट होता है और आप इमेज को स्टाइल नहीं कर सकते — जब आपको सटीकता + अपना CSS चाहिए तो ऊपर नेटिव विकल्प का उपयोग करें।

---

## आपका प्राइवेट स्टैट्स पेज (रैंकिंग)

दूसरा रूट जोड़ें ताकि ट्रैफ़िक के अनुसार सभी पेज पढ़े जा सकें:

```ts
// Astro: src/pages/api/views/ranking.ts   (Next: app/api/views/ranking/route.ts)
import { createUpstashAdapter, createRankingHandler } from "vistas/server";

export const { GET } = createRankingHandler(createUpstashAdapter());
```

`GET /api/views/ranking` → `[{ "slug": "blog", "count": 152 }, ...]` (`?limit=10` सपोर्ट करता है)।
इसे प्राइवेट `/admin` पेज पर रेंडर करें तुरंत मिनी-डैशबोर्ड के लिए।

---

## API

### क्लाइंट — `vistas`

```ts
trackView(slug, options?): Promise<number>
createTracker(options?): { track(slug): Promise<number> }
```

`options`: `endpoint` (डिफ़ॉल्ट `"/api/views"`), `cooldown` (डिफ़ॉल्ट `"24h"`; `ms` नंबर
या `"30m"`/`"24h"`/`"7d"`), `storage` (डिफ़ॉल्ट `localStorage` → मेमोरी फॉलबैक),
`fetch` (कस्टम fetch)। `trackView` कभी आपकी UI में थ्रो नहीं करता — एरर पर `0` रिज़ॉल्व करता है।

### एलिमेंट — `vistas/element`

```ts
defineVistasCounter(options?): void   // <vistas-counter slug endpoint cooldown> रजिस्टर करता है
```

### React — `vistas/react`

```ts
useViews(slug, options?): { count: number | null; loading: boolean; error: Error | null }
```

### सर्वर — `vistas/server`

```ts
createUpstashAdapter(options?): ViewsAdapter   // { url?, token?, key?, redis? }
createRouteHandlers(views, options?): { GET, POST }
createRankingHandler(views): { GET }
renderCountSvg(count, options?): string
``>

अलग डेटाबेस चाहिए? `ViewsAdapter` इंटरफ़ेस लागू करें
(`increment`, `get`, `getMany`, `getRanking`) और हैंडलर्स को पास करें।

---

## काउंटिंग कैसे काम करती है

```
ब्राउज़र / ऐप ──fetch──▶  /api/views/[slug]      ──▶  Upstash Redis (आपका DB)
  localStorage डिड्यूप       आपका सर्वरलेस रूट       एक सॉर्टेड सेट:
  (1 काउंट प्रति कूलडाउन)   (टोकन रखता है)          काउंट + रैंकिंग
```

कूलडाउन के भीतर पहली विज़िट `POST` (बढ़ाना) भेजती है; बाद की विज़िट्स `GET`
(केवल पढ़ना) भेजती हैं। काउंट्स एक ही Redis सॉर्टेड सेट में रहते हैं, इसलिए पेज-वाइज़ टोटल्स और
पूरी रैंकिंग एक ही संरचना से आती है।

## लाइसेंस

MIT © [bastndev](https://github.com/bastndev)