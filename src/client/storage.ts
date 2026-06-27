import type { StorageLike } from "../shared/types.js";

/**
 * In-memory fallback used when no persistent storage is available (SSR, some
 * native runtimes). It keeps the page from crashing; dedup simply won't survive
 * a reload in that environment.
 */
function createMemoryStorage(): StorageLike {
  const map = new Map<string, string>();
  return {
    getItem: (key) => (map.has(key) ? map.get(key)! : null),
    setItem: (key, value) => void map.set(key, value),
  };
}

/**
 * Resolve the storage to use for dedup. Prefers an explicitly injected store
 * (e.g. React Native's `AsyncStorage`), then the browser's `localStorage`, and
 * finally an in-memory fallback so the client never throws on a server.
 */
export function resolveStorage(injected?: StorageLike): StorageLike {
  if (injected) return injected;
  try {
    if (typeof localStorage !== "undefined") return localStorage;
  } catch {
    // Accessing localStorage can throw (e.g. privacy mode, sandboxed iframe).
  }
  return createMemoryStorage();
}
