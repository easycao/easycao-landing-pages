"use client";

import { useState, useEffect, useCallback } from "react";

interface UseCachedFetchOptions {
  key: string;
  url: string;
  enabled?: boolean;
}

export function useCachedFetch<T>({ key, url, enabled = true }: UseCachedFetchOptions) {
  const [data, setData] = useState<T | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const cached = localStorage.getItem(`cache:${key}`);
      if (cached) return JSON.parse(cached) as T;
    } catch {}
    return null;
  });
  const [loading, setLoading] = useState(data === null);

  const refetch = useCallback(async () => {
    try {
      const res = await fetch(url);
      const json = await res.json();
      setData(json);
      localStorage.setItem(`cache:${key}`, JSON.stringify(json));
    } catch {}
    setLoading(false);
  }, [url, key]);

  useEffect(() => {
    if (!enabled) return;
    refetch();
  }, [enabled, refetch]);

  return { data, loading, refetch };
}
