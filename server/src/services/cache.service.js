class TTLCache {
  constructor(defaultTtlMs = 3600000) {
    this.store = new Map();
    this.defaultTtlMs = defaultTtlMs;
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key, value, ttlMs = this.defaultTtlMs) {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  has(key) {
    return this.get(key) !== undefined;
  }

  clear() {
    this.store.clear();
  }

  get size() {
    return this.store.size;
  }
}

export const cache = new TTLCache();
export default cache;
