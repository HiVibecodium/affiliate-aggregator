/**
 * useInfiniteScroll Hook Tests
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
const mockDisconnect = jest.fn();
const mockObserve = jest.fn();

beforeAll(() => {
  global.IntersectionObserver = jest.fn().mockImplementation((callback) => {
    mockIntersectionObserver.mockImplementation(callback);
    return {
      observe: mockObserve,
      disconnect: mockDisconnect,
      unobserve: jest.fn(),
    };
  });
});

describe('useInfiniteScroll Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockFetchFn = (
    pages: Array<{ data: string[]; cursor?: string; hasMore: boolean }>
  ) => {
    let callIndex = 0;
    return jest.fn().mockImplementation(async () => {
      const result = pages[callIndex] || { data: [], cursor: undefined, hasMore: false };
      callIndex++;
      return result;
    });
  };

  it('loads initial data on mount', async () => {
    const fetchFn = createMockFetchFn([
      { data: ['item1', 'item2'], cursor: 'cursor1', hasMore: true },
    ]);

    const { result } = renderHook(() =>
      useInfiniteScroll({
        fetchFn,
        enabled: true,
      })
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(['item1', 'item2']);
    expect(result.current.hasMore).toBe(true);
    expect(fetchFn).toHaveBeenCalledTimes(1);
    expect(fetchFn).toHaveBeenCalledWith();
  });

  it('uses initialData when provided', async () => {
    const fetchFn = createMockFetchFn([
      { data: ['new1', 'new2'], cursor: 'cursor1', hasMore: true },
    ]);

    const { result } = renderHook(() =>
      useInfiniteScroll({
        fetchFn,
        initialData: ['initial1', 'initial2'],
        enabled: true,
      })
    );

    // Initial data should be available immediately
    expect(result.current.data).toEqual(['initial1', 'initial2']);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // After fetch, data should be replaced
    expect(result.current.data).toEqual(['new1', 'new2']);
  });

  it('does not fetch when disabled', async () => {
    const fetchFn = jest.fn();

    const { result } = renderHook(() =>
      useInfiniteScroll({
        fetchFn,
        enabled: false,
      })
    );

    // Wait a bit to ensure no fetch happens
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(fetchFn).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });

  it('handles loadMore correctly', async () => {
    const fetchFn = jest.fn();
    fetchFn.mockResolvedValueOnce({ data: ['page1-item1'], cursor: 'cursor1', hasMore: true });
    fetchFn.mockResolvedValueOnce({ data: ['page2-item1'], cursor: 'cursor2', hasMore: false });

    const { result } = renderHook(() =>
      useInfiniteScroll({
        fetchFn,
        enabled: true,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(['page1-item1']);

    // Load more
    await act(async () => {
      result.current.loadMore();
    });

    await waitFor(() => {
      expect(result.current.isLoadingMore).toBe(false);
    });

    expect(result.current.data).toEqual(['page1-item1', 'page2-item1']);
    expect(result.current.hasMore).toBe(false);
  });

  it('does not loadMore when already loading', async () => {
    const fetchFn = jest.fn();
    fetchFn.mockResolvedValueOnce({ data: ['item1'], cursor: 'cursor1', hasMore: true });
    fetchFn.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ data: ['item2'], hasMore: false }), 1000)
        )
    );

    const { result } = renderHook(() =>
      useInfiniteScroll({
        fetchFn,
        enabled: true,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Try to load more multiple times rapidly
    await act(async () => {
      result.current.loadMore();
      result.current.loadMore();
      result.current.loadMore();
    });

    // Should only fetch once more (after initial)
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  it('does not loadMore when no more items', async () => {
    const fetchFn = createMockFetchFn([{ data: ['item1'], cursor: undefined, hasMore: false }]);

    const { result } = renderHook(() =>
      useInfiniteScroll({
        fetchFn,
        enabled: true,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasMore).toBe(false);

    await act(async () => {
      result.current.loadMore();
    });

    // Should not fetch again
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it('handles refresh correctly', async () => {
    const fetchFn = jest.fn();
    fetchFn.mockResolvedValueOnce({ data: ['old1', 'old2'], cursor: 'cursor1', hasMore: true });
    fetchFn.mockResolvedValueOnce({ data: ['new1'], cursor: 'cursor2', hasMore: false });

    const { result } = renderHook(() =>
      useInfiniteScroll({
        fetchFn,
        enabled: true,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(['old1', 'old2']);

    // Refresh
    await act(async () => {
      result.current.refresh();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(['new1']);
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  it('handles fetch errors on initial load', async () => {
    const fetchFn = jest.fn().mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() =>
      useInfiniteScroll({
        fetchFn,
        enabled: true,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Network error');
    expect(result.current.data).toEqual([]);
  });

  it('handles fetch errors on loadMore', async () => {
    const fetchFn = jest.fn();
    fetchFn.mockResolvedValueOnce({ data: ['item1'], cursor: 'cursor1', hasMore: true });
    fetchFn.mockRejectedValueOnce(new Error('Load more failed'));

    const { result } = renderHook(() =>
      useInfiniteScroll({
        fetchFn,
        enabled: true,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      result.current.loadMore();
    });

    await waitFor(() => {
      expect(result.current.isLoadingMore).toBe(false);
    });

    expect(result.current.error?.message).toBe('Load more failed');
    // Original data should be preserved
    expect(result.current.data).toEqual(['item1']);
  });

  it('converts non-Error objects to Error', async () => {
    const fetchFn = jest.fn().mockRejectedValue('String error');

    const { result } = renderHook(() =>
      useInfiniteScroll({
        fetchFn,
        enabled: true,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Failed to fetch');
  });

  it('provides sentinelRef for intersection observer', async () => {
    const fetchFn = createMockFetchFn([{ data: ['item1'], cursor: 'cursor1', hasMore: true }]);

    const { result } = renderHook(() =>
      useInfiniteScroll({
        fetchFn,
        enabled: true,
        threshold: 500,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Call sentinelRef with a mock node
    const mockNode = document.createElement('div');
    act(() => {
      result.current.sentinelRef(mockNode);
    });

    expect(mockObserve).toHaveBeenCalledWith(mockNode);
  });

  it('disconnects observer on unmount', async () => {
    const fetchFn = createMockFetchFn([{ data: ['item1'], cursor: 'cursor1', hasMore: true }]);

    const { result, unmount } = renderHook(() =>
      useInfiniteScroll({
        fetchFn,
        enabled: true,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Setup observer
    const mockNode = document.createElement('div');
    act(() => {
      result.current.sentinelRef(mockNode);
    });

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('disconnects previous observer when sentinelRef is called again', async () => {
    const fetchFn = createMockFetchFn([{ data: ['item1'], cursor: 'cursor1', hasMore: true }]);

    const { result } = renderHook(() =>
      useInfiniteScroll({
        fetchFn,
        enabled: true,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // First call
    const mockNode1 = document.createElement('div');
    act(() => {
      result.current.sentinelRef(mockNode1);
    });

    // Second call
    const mockNode2 = document.createElement('div');
    act(() => {
      result.current.sentinelRef(mockNode2);
    });

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('does not setup observer when disabled', async () => {
    const fetchFn = jest.fn();

    const { result } = renderHook(() =>
      useInfiniteScroll({
        fetchFn,
        enabled: false,
      })
    );

    const mockNode = document.createElement('div');
    act(() => {
      result.current.sentinelRef(mockNode);
    });

    expect(mockObserve).not.toHaveBeenCalled();
  });
});
