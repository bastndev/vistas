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
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_VI.md">Tiếng Việt 🇻🇳</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_HI.md">हिन्दी 🇮🇳</a> |
  <a href="https://github.com/bastndev/vistaz/blob/main/public/docs/README_AR.md">العربية 🇸🇦</a><span>...</span>
</p>

</div>

<br>

> **عداد مشاهدات الصفحات** صغير ومستقل عن إطار العمل. مهمة واحدة فقط: عدّ المشاهدات الحقيقية لكل مسار، وأعطِك الرقم، ودعك تُنسّقه كما تشاء.

<br>

```bash
npm i vistaz
```

<br>

- 🪶 **صغير وبدون تبعيات في العميل** — النواة هي فقط `fetch` + التخزين.
- 🔁 **مقاوم للتحديث** — إزالة التكرار عبر `localStorage`، لذا إعادة التحميل لا تُضخّم العدّادات.
- 🧩 **يعمل في كل مكان** — Astro، HTML بسيط، Next.js، React، React Native، LynxJS.
- 🎨 **واجهتك** — احصل على رقم واعرضه بطريقتك، أو أضف شارة بسطر واحد.
- 🏆 **عدّ حسب الصفحة + الترتيب** — ارى أي مقال يفوز، باستعلام واحد.
- 📦 **أ bring قاعدة بياناتك الخاصة** — بياناتك تعيش في _Redis Upstash المجاني_ الخاص بك. الحزمة لا تستضيف أي شيء.

> **تحتاج إلى:** قاعدة بيانات مجانية [Upstash Redis](https://console.upstash.com) ومضيف
> يشغّل نقاط نهاية بدون خادم (Vercel/Netlify/Cloudflare/Astro SSR). النقطة النهائية
> تحتفظ بالرمز السري؛ المتصفح لا يراه أبداً.

---

## 1. إعداد قاعدة البيانات (مرة واحدة)

أنشئ قاعدة بيانات مجانية على [console.upstash.com](https://console.upstash.com)، ثم ضع
بيانات اعتماد REST في `.env` (انظر [`.env.example`](./.env.example)):

```bash
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-rest-token
```

## 2. إضافة مسار API (خادم)

أنشئ نقطة نهاية واحدة. يأتي الـ slug من URL، لذا استخدم مسار catch-all.

```ts
// Astro: src/pages/api/views/[...slug].ts
import { createUpstashAdapter, createRouteHandlers } from "vistaz/server";

const views = createUpstashAdapter(); // يقرأ UPSTASH_* من متغيرات البيئة
export const { GET, POST } = createRouteHandlers(views);
```

```ts
// Next.js App Router: app/api/views/[...slug]/route.ts
import { createUpstashAdapter, createRouteHandlers } from "vistaz/server";

const views = createUpstashAdapter();
export const { GET, POST } = createRouteHandlers(views);
```

> **ملاحظة Astro:** مسارات API تحتاج إلى SSR — أضف محولاً مثل `@astrojs/vercel` وعيّن
> `output: "server"` (أو `hybrid`). البناء الثابت تماماً لا يمكنه تشغيل نقاط النهاية.

### 🚀 ملاحظة لمستخدمي Astro / Vite

نظرًا لأن Astro وVite يكشفان متغيرات البيئة بأمان عبر `import.meta.env` بدلاً من `process.env`
العالمي في Node، فإن القراءة التلقائية للبيانات الاعتمادية لن تعمل افتراضيًا.

إذا كنت تستخدم Astro أو Vite، يجب تمرير بيانات اعتماد Upstash صراحةً إلى المحول:

```javascript
import { createUpstashAdapter, createRouteHandlers } from "vistaz/server";

const views = createUpstashAdapter({
  url: import.meta.env.UPSTASH_REDIS_REST_URL,
  token: import.meta.env.UPSTASH_REDIS_REST_TOKEN
});
export const { GET, POST } = createRouteHandlers(views);
```

## 3. عرض العدّاد (عميل)

اختر ما يناسب. الثلاثة يتواصلون مع نفس النقطة النهائية.

### مكوّن ويب — Astro / HTML بسيط (بدون React)

```astro
---
// أي صفحة .astro
---
<p>المشاهدات: <vistaz-counter slug="blog">…</vistaz-counter></p>

<script>
  import { defineViztasCounter } from "vistaz/element";
  defineViztasCounter();
</script>

<style>
  vistaz-counter { font-weight: 600; } /*نسّقه كما أي عنصر */
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

React Native (بدون `localStorage`، والنقطة النهائية يجب أن تكون مطلقة):

```tsx
import AsyncStorage from "@react-native-async-storage/async-storage";

const { count } = useViews("blog", {
  endpoint: "https://yoursite.com/api/views",
  storage: AsyncStorage,
});
```

### دالة بسيطة (ابنِ واجهتك الخاصة)

```ts
import { trackView } from "vistaz";

const count = await trackView("blog"); // POST في الزيارة الأولى، GET بعدها
document.querySelector("#views").textContent = String(count);
```

### شارة — تعمل في أي مكان تعمل فيه الصورة (حتى في Markdown)

```html
<img src="https://yoursite.com/api/views/blog.svg" alt="مشاهدات" />
```

صفر JS، لكن كل تحميل يُعدّ ولا يمكنك تسمية الصورة — استخدم الخيار الأصلي
أعلاه عندما تريد الدقة + CSS الخاص بك.

---

## صفحة إحصاءاتك الخاصة (الترتيب)

أضف مساراً ثانياً لقراءة كل صفحة مرتبة حسب حركة المرور:

```ts
// Astro: src/pages/api/views/ranking.ts   (Next: app/api/views/ranking/route.ts)
import { createUpstashAdapter, createRankingHandler } from "vistaz/server";

export const { GET } = createRankingHandler(createUpstashAdapter());
```

`GET /api/views/ranking` → `[{ "slug": "blog", "count": 152 }, ...]` (يدعم `?limit=10`).
اعرضه في صفحة خاصة `/admin` للحصول على لوحة معلومات فورية.

---

## API

### عميل — `vistaz`

```ts
trackView(slug, options?): Promise<number>
createTracker(options?): { track(slug): Promise<number> }
```

`options`: `endpoint` (الافتراضي `"/api/views"`)، `cooldown` (الافتراضي `"24h"`؛ رقم `ms`
أو `"30m"`/`"24h"`/`"7d"`)، `storage` (الافتراضي `localStorage` → احتياطي بالذاكرة)，
`fetch` (fetch مخصص). `trackView` لا يرمي خطأ في واجهتك — عند الخطأ يُرجع `0`.

### عنصر — `vistaz/element`

```ts
defineViztasCounter(options?): void   // يسجّل <vistaz-counter slug endpoint cooldown>
```

### React — `vistaz/react`

```ts
useViews(slug, options?): { count: number | null; loading: boolean; error: Error | null }
```

### خادم — `vistaz/server`

```ts
createUpstashAdapter(options?): ViewsAdapter   // { url?, token?, key?, redis? }
createRouteHandlers(views, options?): { GET, POST }
createRankingHandler(views): { GET }
renderCountSvg(count, options?): string
```

تريد قاعدة بيانات مختلفة؟ نفّذ واجهة `ViewsAdapter`
(`increment`，`get`，`getMany`，`getRanking`) ومرّرها للمعالجات.

---

## كيف يعمل العدّ

```
المتصفح / التطبيق ──fetch──▶  /api/views/[slug]      ──▶  Upstash Redis (قاعدة بياناتك)
  localStorage إزالة التكرار   مسارك بدون خادم          مجموعة مرتبة واحدة:
  (عدّ واحد لكل cooldown)     (تحتفظ بالرمز)          عدّ + ترتيب
```

الزيارة الأولى ضمن cooldown ترسل `POST` (زيادة)؛ الزيارات اللاحقة ترسل `GET`
(قراءة فقط). العدّادات تعيش في مجموعة مرتبة واحدة في Redis، لذا المجاميع لكل صفحة وال
الترتيب الكامل يأتيان من نفس البنية.

## الترخيص

MIT