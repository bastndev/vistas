import { Redis } from "@upstash/redis";
import {
  normalizeSlug,
  type RankingEntry,
  type ViewsAdapter,
} from "../../shared/types.js";

export interface UpstashAdapterOptions {
  /** Upstash REST URL. Defaults to `process.env.UPSTASH_REDIS_REST_URL`. */
  url?: string;
  /** Upstash REST token. Defaults to `process.env.UPSTASH_REDIS_REST_TOKEN`. */
  token?: string;
  /** Sorted-set key holding every page's count. Default `"vistaz:ranking"`. */
  key?: string;
  /** Use an existing `@upstash/redis` client instead of building one. */
  redis?: Redis;
}

function envValue(name: string): string | undefined {
  return typeof process !== "undefined" ? process.env?.[name] : undefined;
}

/**
 * Store view counts in a single Upstash Redis sorted set. One structure gives
 * per-page counts, fast batch reads, and the full ranking.
 *
 * Reads `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` from the
 * environment when `url`/`token` aren't passed. Keep the token server-side only.
 */
export function createUpstashAdapter(
  options: UpstashAdapterOptions = {}
): ViewsAdapter {
  const key = options.key ?? "vistaz:ranking";
  const url = options.url ?? envValue("UPSTASH_REDIS_REST_URL");
  const token = options.token ?? envValue("UPSTASH_REDIS_REST_TOKEN");

  const redis =
    options.redis ??
    (() => {
      if (!url || !token) {
        throw new Error(
          "vistaz: missing Upstash credentials. Set UPSTASH_REDIS_REST_URL and " +
            "UPSTASH_REDIS_REST_TOKEN, or pass { url, token } to createUpstashAdapter()."
        );
      }
      return new Redis({ url, token });
    })();

  return {
    async increment(slug) {
      return redis.zincrby(key, 1, normalizeSlug(slug));
    },

    async get(slug) {
      const score = await redis.zscore(key, normalizeSlug(slug));
      return typeof score === "number" ? score : 0;
    },

    async getMany(slugs) {
      const ids = slugs.map(normalizeSlug);
      const result: Record<string, number> = {};
      if (ids.length === 0) return result;
      const scores = (await redis.zmscore(key, ids)) ?? [];
      ids.forEach((id, i) => {
        const score = scores[i];
        result[id] = typeof score === "number" ? score : 0;
      });
      return result;
    },

    async getRanking(limit) {
      const stop = limit && limit > 0 ? limit - 1 : -1;
      const raw = (await redis.zrange(key, 0, stop, {
        rev: true,
        withScores: true,
      })) as (string | number)[];

      const ranking: RankingEntry[] = [];
      for (let i = 0; i < raw.length; i += 2) {
        ranking.push({ slug: String(raw[i]), count: Number(raw[i + 1]) });
      }
      return ranking;
    },
  };
}
