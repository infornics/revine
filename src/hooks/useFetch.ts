import { useState, useEffect } from "react";
import { revineFetch, RevineFetchOptions } from "../runtime/fetch.js";

export interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  revalidate: () => Promise<void>;
}

/**
 * A React hook for making cached API calls.
 * @param url The URL to fetch
 * @param options Fetch and cache options
 */
export function useFetch<T = any>(
  url: string,
  options: RevineFetchOptions = {}
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (isRevalidating: boolean = false) => {
    try {
      setLoading(true);
      const result = await revineFetch<T>(url, {
        ...options,
        revalidate: isRevalidating || options.revalidate,
      });
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url, JSON.stringify(options)]);

  return {
    data,
    loading,
    error,
    revalidate: () => fetchData(true),
  };
}
