/**
 * Shared types and small helpers used by both the client and server entry points.
 * Kept dependency-free so the client bundle stays tiny.
 */

/** A single page's view count. */
export interface ViewResult {
  slug: string;
  count: number;
}

/** Result row for the full-site ranking. */
export interface RankingEntry {
  slug: string;
  count: number;
}

/**
 * Storage interface the client uses for refresh deduplication. Both sync
 * (`localStorage`) and async (`AsyncStorage`) implementations satisfy it, since
 * every call site `await`s the result.
 */
export interface StorageLike {
  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): void | Promise<void>;
}

/** Server-side store. Implement this to plug in a database other than Upstash. */
export interface ViewsAdapter {
  /** Increment a slug by one and return the new total. */
  increment(slug: string): Promise<number>;
  /** Read the current total for a slug (0 if never seen). */
  get(slug: string): Promise<number>;
  /** Read totals for many slugs at once. */
  getMany(slugs: string[]): Promise<Record<string, number>>;
  /** Read every page ordered by count, highest first. */
  getRanking(limit?: number): Promise<RankingEntry[]>;
}

/** Cooldown expressed as milliseconds, or a short string like `"24h"`, `"30m"`, `"7d"`. */
export type Duration = number | `${number}${"s" | "m" | "h" | "d"}`;

const UNIT_MS: Record<string, number> = {
  s: 1_000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
};

/** Convert a {@link Duration} to milliseconds. Falls back to 24h on bad input. */
export function parseDuration(value: Duration | undefined): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const match = /^(\d+)\s*([smhd])$/.exec(value.trim());
    if (match) return Number(match[1]) * UNIT_MS[match[2]];
  }
  return UNIT_MS.h * 24;
}

/**
 * Normalize a slug into a stable key. Trims surrounding slashes and whitespace
 * so `/blog/`, `blog`, and `/blog` all map to the same counter. Empty → `"index"`.
 */
export function normalizeSlug(slug: string | undefined | null): string {
  const trimmed = (slug ?? "").trim().replace(/^\/+|\/+$/g, "");
  return trimmed === "" ? "index" : trimmed;
}
