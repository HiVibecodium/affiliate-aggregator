'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions<T> {
  fetchFn: (cursor?: string) => Promise<{
    data: T[];
    cursor?: string;
    hasMore: boolean;
  }>;
  initialData?: T[];
  enabled?: boolean;
  threshold?: number; // pixels from bottom to trigger load
}

interface UseInfiniteScrollResult<T> {
  data: T[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  sentinelRef: (node: HTMLElement | null) => void;
}

/**
 * Custom hook for infinite scroll with cursor-based pagination
 * Uses Intersection Observer for efficient scroll detection
 */
export function useInfiniteScroll<T>({
  fetchFn,
  initialData = [],
  enabled = true,
  threshold = 200,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollResult<T> {
  const [data, setData] = useState<T[]>(initialData);
  const [cursor, setCursor] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef(false);

  // Initial load
  useEffect(() => {
    if (!enabled) return;

    const loadInitial = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchFn();
        setData(result.data);
        setCursor(result.cursor);
        setHasMore(result.hasMore);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch'));
      } finally {
        setIsLoading(false);
      }
    };

    loadInitial();
  }, [enabled, fetchFn]);

  // Load more function
  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore || !cursor) return;

    loadingRef.current = true;
    setIsLoadingMore(true);
    setError(null);

    try {
      const result = await fetchFn(cursor);
      setData((prev) => [...prev, ...result.data]);
      setCursor(result.cursor);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch more'));
    } finally {
      setIsLoadingMore(false);
      loadingRef.current = false;
    }
  }, [cursor, hasMore, fetchFn]);

  // Refresh function
  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setCursor(undefined);
    setHasMore(true);

    try {
      const result = await fetchFn();
      setData(result.data);
      setCursor(result.cursor);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh'));
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn]);

  // Intersection Observer callback for sentinel element
  const sentinelRef = useCallback(
    (node: HTMLElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (!node || !enabled) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
            loadMore();
          }
        },
        {
          rootMargin: `${threshold}px`,
        }
      );

      observerRef.current.observe(node);
    },
    [enabled, hasMore, loadMore, threshold]
  );

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    data,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
    sentinelRef,
  };
}

/**
 * Hook for fetching programs with infinite scroll
 */
export function useInfinitePrograms(filters: Record<string, string> = {}) {
  const fetchPrograms = useCallback(
    async (cursor?: string) => {
      const params = new URLSearchParams({
        ...filters,
        paginationType: 'cursor',
        limit: '20',
        ...(cursor ? { cursor } : {}),
      });

      const response = await fetch(`/api/programs?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch programs');
      }

      const json = await response.json();
      return {
        data: json.programs,
        cursor: json.pagination.cursor,
        hasMore: json.pagination.hasMore,
      };
    },
    [filters]
  );

  return useInfiniteScroll({
    fetchFn: fetchPrograms,
    enabled: true,
  });
}
