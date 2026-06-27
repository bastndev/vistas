import {
  normalizeSlug,
  parseDuration,
  type Duration,
  type StorageLike,
} from "../shared/types.js";
import { resolveStorage } from "./storage.js";

export interface TrackOptions {
  /** Base path/URL of the views endpoint. Default `"/api/views"`. */
  endpoint?: string;
  /** How long after a view to skip re-counting the same slug. Default `"24h"`. */
  cooldown?: Duration;
  /** Storage for dedup. Default `localStorage`, falls back to memory. */
  storage?: StorageLike;
  /** Custom fetch implementation for runtimes without a global `fetch`. */
  fetch?: typeof fetch;
}

const STORAGE_PREFIX = "vistas:viewed:";

function pickFetch(custom?: typeof fetch): typeof fetch {
  if (custom) return custom;
  if (typeof fetch !== "undefined") return fetch;
  throw new Error(
    "vistas: no global fetch found. Pass `fetch` in options for this runtime."
  );
}

/**
 * Track a view for `slug`.
 *
 * Sends a `POST` (increment) the first time within the cooldown window, then a
 * `GET` (read-only) on subsequent visits, so refreshes don't inflate the count.
 * Resolves to the latest count. Never throws into your UI — on a network error
 * it resolves to `0` so the page keeps rendering.
 */
export async function trackView(
  slug: string,
  options: TrackOptions = {}
): Promise<number> {
  const id = normalizeSlug(slug);
  const endpoint = (options.endpoint ?? "/api/views").replace(/\/+$/, "");
  const cooldownMs = parseDuration(options.cooldown ?? "24h");
  const storage = resolveStorage(options.storage);
  const doFetch = pickFetch(options.fetch);
  const key = STORAGE_PREFIX + id;

  let fresh = false;
  try {
    const last = await storage.getItem(key);
    fresh = last != null && Date.now() - Number(last) < cooldownMs;
  } catch {
    // If storage read fails, treat as a new view rather than blocking.
  }

  try {
    const res = await doFetch(`${endpoint}/${encodeURIComponent(id)}`, {
      method: fresh ? "GET" : "POST",
      headers: { Accept: "application/json" },
    });
    const data = (await res.json()) as { count?: number };

    if (!fresh) {
      try {
        await storage.setItem(key, String(Date.now()));
      } catch {
        // Persisting the timestamp is best-effort.
      }
    }
    return typeof data.count === "number" ? data.count : 0;
  } catch {
    return 0;
  }
}

export interface Tracker {
  /** Track a view for `slug` using the tracker's bound options. */
  track(slug: string): Promise<number>;
}

/**
 * Create a tracker with options bound once, so call sites only pass a slug.
 *
 * ```ts
 * const tracker = createTracker({ endpoint: "/api/views", cooldown: "12h" });
 * const count = await tracker.track("/blog");
 * ```
 */
export function createTracker(options: TrackOptions = {}): Tracker {
  return { track: (slug: string) => trackView(slug, options) };
}

export type { Duration, StorageLike } from "../shared/types.js";
