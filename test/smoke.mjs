import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

import { trackView, createTracker } from '../dist/index.js';
import {
  createRouteHandlers,
  createRankingHandler,
  createUpstashAdapter,
  renderCountSvg,
} from '../dist/server.js';
import { defineVistazCounter } from '../dist/element.js';

/* ------------------------------------------------------------------ */
/* Client: trackView dedup behaviour                                  */
/* ------------------------------------------------------------------ */
{
  let serverCount = 0;
  const calls = [];
  const mockFetch = async (url, init) => {
    calls.push({ url, method: init.method });
    if (init.method === 'POST') serverCount++;
    return { json: async () => ({ count: serverCount }) };
  };
  const store = new Map();
  const storage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => void store.set(k, v),
  };

  // 1st visit → POST (increment)
  const c1 = await trackView('blog', { fetch: mockFetch, storage });
  assert.equal(c1, 1, 'first visit increments');
  assert.equal(calls[0].method, 'POST');
  assert.ok(store.has('vistaz:viewed:blog'), 'timestamp persisted');

  // 2nd visit within cooldown → GET (read-only)
  const c2 = await trackView('blog', { fetch: mockFetch, storage });
  assert.equal(c2, 1, 'refresh does not inflate');
  assert.equal(calls[1].method, 'GET');

  // Expired cooldown → POST again
  store.set('vistaz:viewed:blog', String(Date.now() - 25 * 3600 * 1000));
  const c3 = await trackView('blog', { fetch: mockFetch, storage });
  assert.equal(calls[2].method, 'POST', 'expired cooldown re-counts');
  assert.equal(c3, 2);

  // Slug normalization shares a counter
  await trackView('/blog/', { fetch: mockFetch, storage });
  assert.equal(calls[3].url.endsWith('/blog'), true, 'slug normalized in URL');

  // Network errors never throw into the UI
  const cErr = await trackView('x', {
    fetch: async () => {
      throw new Error('offline');
    },
    storage,
  });
  assert.equal(cErr, 0, 'errors resolve to 0');

  // createTracker binds options
  const tracker = createTracker({ fetch: mockFetch, storage });
  assert.equal(typeof tracker.track, 'function');
}

/* ------------------------------------------------------------------ */
/* Server: route handlers with a mock adapter                         */
/* ------------------------------------------------------------------ */
{
  const counts = {};
  const adapter = {
    async increment(slug) {
      counts[slug] = (counts[slug] ?? 0) + 1;
      return counts[slug];
    },
    async get(slug) {
      return counts[slug] ?? 0;
    },
    async getMany(slugs) {
      return Object.fromEntries(slugs.map((s) => [s, counts[s] ?? 0]));
    },
    async getRanking(limit) {
      const all = Object.entries(counts)
        .map(([slug, count]) => ({ slug, count }))
        .sort((a, b) => b.count - a.count);
      return limit ? all.slice(0, limit) : all;
    },
  };

  const { GET, POST } = createRouteHandlers(adapter);

  const postBody = await (await POST(new Request('http://x/api/views/blog', { method: 'POST' }))).json();
  assert.deepEqual(postBody, { slug: 'blog', count: 1 }, 'POST increments');

  const getBody = await (await GET(new Request('http://x/api/views/blog'))).json();
  assert.equal(getBody.count, 1, 'GET reads without incrementing');

  // Astro-style context with route params
  const ctxBody = await (
    await POST({ request: new Request('http://x/api/views/whatever'), params: { slug: 'astro-page' } })
  ).json();
  assert.equal(ctxBody.slug, 'astro-page', 'reads slug from route params');

  // Badge mode: .svg suffix → GET increments and returns SVG (blog 1 → 2)
  const svgRes = await GET(new Request('http://x/api/views/blog.svg'));
  assert.equal(svgRes.headers.get('content-type'), 'image/svg+xml; charset=utf-8');
  const svgText = await svgRes.text();
  assert.match(svgText, /<svg/);
  assert.match(svgText, /aria-label="2"/, 'badge GET increments');

  // Ranking
  const rank = await (await createRankingHandler(adapter).GET(new Request('http://x/api/views/ranking'))).json();
  assert.ok(Array.isArray(rank));
  assert.equal(rank[0].slug, 'blog', 'ranking sorted by count');
}

/* ------------------------------------------------------------------ */
/* Server: SVG renderer + Upstash adapter against a fake redis        */
/* ------------------------------------------------------------------ */
{
  const svg = renderCountSvg(1234, { label: 'views' });
  assert.match(svg, /1,234 views/, 'formats and labels the count');

  const map = new Map();
  const fakeRedis = {
    async zincrby(_key, by, member) {
      const v = (map.get(member) ?? 0) + by;
      map.set(member, v);
      return v;
    },
    async zscore(_key, member) {
      return map.has(member) ? map.get(member) : null;
    },
    async zmscore(_key, members) {
      return members.map((m) => (map.has(m) ? map.get(m) : null));
    },
    async zrange(_key, _start, _stop, _opts) {
      const out = [];
      for (const [m, s] of [...map.entries()].sort((a, b) => b[1] - a[1])) out.push(m, s);
      return out;
    },
  };

  const up = createUpstashAdapter({ redis: fakeRedis });
  assert.equal(await up.increment('/blog/'), 1, 'normalizes slug on increment');
  assert.equal(await up.get('blog'), 1);
  assert.equal(await up.increment('blog'), 2);
  const many = await up.getMany(['blog', 'missing']);
  assert.deepEqual(many, { blog: 2, missing: 0 });
  const rk = await up.getRanking();
  assert.deepEqual(rk[0], { slug: 'blog', count: 2 });
}

/* ------------------------------------------------------------------ */
/* Web component define is SSR-safe (no DOM → no-op, no throw)         */
/* ------------------------------------------------------------------ */
assert.equal(typeof defineVistazCounter, 'function');
defineVistazCounter();

/* ------------------------------------------------------------------ */
/* CJS builds load and expose the API                                 */
/* ------------------------------------------------------------------ */
{
  const require = createRequire(import.meta.url);
  assert.equal(typeof require('../dist/index.cjs').trackView, 'function', 'CJS index');
  assert.equal(typeof require('../dist/server.cjs').createUpstashAdapter, 'function', 'CJS server');
  assert.equal(typeof require('../dist/react.cjs').useViews, 'function', 'CJS react');
}

/* ------------------------------------------------------------------ */
/* Optional live Upstash check (runs only if credentials are present) */
/* ------------------------------------------------------------------ */
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const live = createUpstashAdapter({ key: 'vistaz:smoke-test' });
  const before = await live.get('smoke');
  const after = await live.increment('smoke');
  assert.equal(after, before + 1, 'live Upstash increment works');
  console.log(`✅ live Upstash check passed (smoke = ${after})`);
} else {
  console.log('ℹ️  skipped live Upstash check (no UPSTASH_* env set)');
}

console.log('✅ smoke test passed');
