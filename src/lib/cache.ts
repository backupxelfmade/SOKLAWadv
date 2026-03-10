const CACHE_VERSION = 'v1';

function makeKey(key: string) {
  return `sok_${CACHE_VERSION}_${key}`;
}

export function setCache<T>(key: string, data: T, ttlMs: number): void {
  try {
    localStorage.setItem(
      makeKey(key),
      JSON.stringify({ data, expiresAt: Date.now() + ttlMs })
    );
  } catch {
    // localStorage full — fail silently
  }
}

export function getCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(makeKey(key));
    if (!raw) return null;
    const { data, expiresAt } = JSON.parse(raw) as { data: T; expiresAt: number };
    if (Date.now() > expiresAt) {
      localStorage.removeItem(makeKey(key));
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function clearCache(key: string): void {
  localStorage.removeItem(makeKey(key));
}

export function clearAllCache(): void {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(`sok_${CACHE_VERSION}_`))
    .forEach((k) => localStorage.removeItem(k));
}
