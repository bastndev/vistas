import { useEffect, useRef, useState } from "react";
import { trackView, type TrackOptions } from "../client/index.js";

export interface UseViewsResult {
  /** Latest count, or `null` while the first request is in flight. */
  count: number | null;
  /** True until the first request settles. */
  loading: boolean;
  /** Set if the request threw (rare — `trackView` swallows network errors). */
  error: Error | null;
}

/**
 * Track and read a view count from a React component. Covers React, Next.js,
 * React Native, and LynxJS (ReactLynx). For React Native pass
 * `storage: AsyncStorage` and an absolute `endpoint` URL in `options`.
 *
 * ```tsx
 * const { count, loading } = useViews("/blog");
 * return <span>{loading ? "…" : count}</span>;
 * ```
 *
 * Guarded against React 18+ StrictMode double-invocation so the count is only
 * incremented once per mount.
 */
export function useViews(slug: string, options: TrackOptions = {}): UseViewsResult {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Serialize options so the effect only re-runs on a meaningful change.
  const optionsKey = JSON.stringify({
    endpoint: options.endpoint,
    cooldown: options.cooldown,
  });

  const startedKey = useRef<string | null>(null);

  useEffect(() => {
    const runKey = `${slug}|${optionsKey}`;
    if (startedKey.current === runKey) return; // StrictMode / duplicate guard
    startedKey.current = runKey;

    let active = true;
    setLoading(true);
    setError(null);

    trackView(slug, options)
      .then((value) => {
        if (active) setCount(value);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, optionsKey]);

  return { count, loading, error };
}

export type { TrackOptions } from "../client/index.js";
