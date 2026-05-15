import { revineCache } from "./cache.js";

export interface RevineFetchOptions extends RequestInit {
  cacheTTL?: number; // TTL in milliseconds
  persist?: boolean; // Whether to persist cache to localStorage
  revalidate?: boolean; // If true, force fetch and update cache
}

/**
 * Enhanced fetch with caching capabilities.
 * @param url The URL to fetch
 * @param options Fetch options plus cache configuration
 */
export async function revineFetch<T = any>(
  url: string,
  options: RevineFetchOptions = {}
): Promise<T> {
  const { cacheTTL = 0, persist = false, revalidate = false, ...fetchOptions } = options;

  // Cache works if cacheTTL > 0. Usually only for GET, but GraphQL uses POST.
  const isCacheable = cacheTTL > 0;
  
  // Create a more robust cache key that includes the method and body for POST requests
  const method = (fetchOptions.method || "GET").toUpperCase();
  const bodyKey = fetchOptions.body ? `_body:${fetchOptions.body}` : "";
  const cacheKey = `fetch_${method}_${url}_${JSON.stringify(fetchOptions.headers || {})}${bodyKey}`;

  if (isCacheable && !revalidate) {
    const cachedData = revineCache.get<T>(cacheKey);
    if (cachedData !== null) {
      return cachedData;
    }
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const error: any = new Error(`Revine Fetch Error: ${response.status} ${response.statusText}`);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();

  if (isCacheable) {
    revineCache.set(cacheKey, data, cacheTTL, persist);
  }

  return data;
}
