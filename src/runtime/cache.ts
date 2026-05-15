type CacheEntry<T> = {
  data: T;
  expiry: number;
};

class RevineCache {
  private memoryCache = new Map<string, CacheEntry<any>>();

  set<T>(key: string, data: T, ttl: number, persist: boolean = false) {
    const entry: CacheEntry<T> = {
      data,
      expiry: Date.now() + ttl,
    };

    this.memoryCache.set(key, entry);

    if (persist && typeof window !== "undefined") {
      try {
        localStorage.setItem(`revine_cache_${key}`, JSON.stringify(entry));
      } catch (e) {
        console.warn("Revine Cache: Failed to persist to localStorage", e);
      }
    }
  }

  get<T>(key: string): T | null {
    // Check memory cache first
    let entry = this.memoryCache.get(key);

    // If not in memory, check localStorage
    if (!entry && typeof window !== "undefined") {
      try {
        const persisted = localStorage.getItem(`revine_cache_${key}`);
        if (persisted) {
          entry = JSON.parse(persisted);
          // Sync back to memory cache
          if (entry) this.memoryCache.set(key, entry);
        }
      } catch (e) {
        console.warn("Revine Cache: Failed to read from localStorage", e);
      }
    }

    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string) {
    this.memoryCache.delete(key);
    if (typeof window !== "undefined") {
      localStorage.removeItem(`revine_cache_${key}`);
    }
  }

  clear() {
    this.memoryCache.clear();
    if (typeof window !== "undefined") {
      Object.keys(localStorage)
        .filter((key) => key.startsWith("revine_cache_"))
        .forEach((key) => localStorage.removeItem(key));
    }
  }
}

export const revineCache = new RevineCache();
