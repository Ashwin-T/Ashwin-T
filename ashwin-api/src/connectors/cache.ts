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
