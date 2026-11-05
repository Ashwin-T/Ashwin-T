interface CacheEntry {
  data: unknown
  expiresAt: number
}

const store = new Map<string, CacheEntry>()

export function get(key: string): unknown | undefined {
  const entry = store.get(key)
  if (!entry) return undefined
  if (Date.now() > entry.expiresAt) {
    store.delete(key)
    return undefined
  }
  return entry.data
}

export function set(key: string, data: unknown, ttlMs: number) {
  store.set(key, { data, expiresAt: Date.now() + ttlMs })
}

const pending = new Map<string, Promise<unknown>>()

/**
 * Returns the cached value for `key`, or runs `load` and caches what it
 * returns. Concurrent callers share one load, and a failed load caches
 * nothing, so the next call tries again.
 */
export async function cached<T>(key: string, ttlMs: number, load: () => Promise<T>): Promise<T> {
  const hit = get(key)
  if (hit !== undefined) return hit as T

  let loading = pending.get(key) as Promise<T> | undefined
  if (!loading) {
    loading = load()
      .then((data) => {
        set(key, data, ttlMs)
        return data
      })
      .finally(() => pending.delete(key))
    pending.set(key, loading)
  }
  return loading
}
