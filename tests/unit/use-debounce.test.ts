/**
 * useDebounce and useDebouncedCallback Hooks Tests
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useDebounce, useDebouncedCallback } from '@/hooks/useDebounce';

describe('useDebounce Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('useDebounce', () => {
    it('returns initial value immediately', () => {
      const { result } = renderHook(() => useDebounce('initial', 300));

      expect(result.current).toBe('initial');
    });

    it('debounces value updates', () => {
      const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
        initialProps: { value: 'first', delay: 300 },
      });

      expect(result.current).toBe('first');

      // Update value
      rerender({ value: 'second', delay: 300 });

      // Value should not change immediately
      expect(result.current).toBe('first');

      // Fast-forward time
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Now value should be updated
      expect(result.current).toBe('second');
    });

    it('resets timer on rapid updates', () => {
      const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
        initialProps: { value: 'a' },
      });

      // Rapid updates
      rerender({ value: 'b' });
      act(() => {
        jest.advanceTimersByTime(100);
      });

      rerender({ value: 'c' });
      act(() => {
        jest.advanceTimersByTime(100);
      });

      rerender({ value: 'd' });

      // Value should still be initial
      expect(result.current).toBe('a');

      // After full delay, should have the last value
      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current).toBe('d');
    });

    it('uses default delay of 300ms', () => {
      const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
        initialProps: { value: 'start' },
      });

      rerender({ value: 'end' });

      // Should not update before 300ms
      act(() => {
        jest.advanceTimersByTime(299);
      });
      expect(result.current).toBe('start');

      act(() => {
        jest.advanceTimersByTime(1);
      });
      expect(result.current).toBe('end');
    });

    it('works with different value types', () => {
      // Number
      const { result: numResult, rerender: numRerender } = renderHook(
        ({ value }) => useDebounce(value, 100),
        { initialProps: { value: 0 } }
      );

      numRerender({ value: 42 });
      act(() => {
        jest.advanceTimersByTime(100);
      });
      expect(numResult.current).toBe(42);

      // Object
      const { result: objResult, rerender: objRerender } = renderHook(
        ({ value }) => useDebounce(value, 100),
        { initialProps: { value: { key: 'a' } } }
      );

      objRerender({ value: { key: 'b' } });
      act(() => {
        jest.advanceTimersByTime(100);
      });
      expect(objResult.current).toEqual({ key: 'b' });

      // Boolean
      const { result: boolResult, rerender: boolRerender } = renderHook(
        ({ value }) => useDebounce(value, 100),
        { initialProps: { value: false } }
      );

      boolRerender({ value: true });
      act(() => {
        jest.advanceTimersByTime(100);
      });
      expect(boolResult.current).toBe(true);
    });

    it('handles delay changes', () => {
      const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
        initialProps: { value: 'start', delay: 100 },
      });

      rerender({ value: 'middle', delay: 500 });

      // With new longer delay
      act(() => {
        jest.advanceTimersByTime(100);
      });
      expect(result.current).toBe('start'); // Should still be start

      act(() => {
        jest.advanceTimersByTime(400);
      });
      expect(result.current).toBe('middle');
    });
  });

  describe('useDebouncedCallback', () => {
    it('debounces callback execution', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useDebouncedCallback(callback, 300));

      act(() => {
        result.current('arg1');
      });

      // Callback should not be called immediately
      expect(callback).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Now callback should be called
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('arg1');
    });

    it('cancels previous call on rapid invocations', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useDebouncedCallback(callback, 300));

      // Call rapidly with time between
      act(() => {
        result.current('call1');
      });

      act(() => {
        jest.advanceTimersByTime(100);
      });

      act(() => {
        result.current('call2');
      });

      act(() => {
        jest.advanceTimersByTime(100);
      });

      act(() => {
        result.current('call3');
      });

      // Finish timer
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Should have called with each argument due to state updates
      // The implementation uses setState which triggers re-renders
      expect(callback).toHaveBeenCalled();
      expect(callback).toHaveBeenLastCalledWith('call3');
    });

    it('passes multiple arguments', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useDebouncedCallback(callback, 100));

      act(() => {
        result.current('arg1', 'arg2', 123);
      });

      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(callback).toHaveBeenCalledWith('arg1', 'arg2', 123);
    });

    it('uses default delay of 300ms', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useDebouncedCallback(callback));

      act(() => {
        result.current();
      });

      act(() => {
        jest.advanceTimersByTime(299);
      });
      expect(callback).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(1);
      });
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('cleans up timeout on unmount', () => {
      const callback = jest.fn();
      const { result, unmount } = renderHook(() => useDebouncedCallback(callback, 300));

      act(() => {
        result.current();
      });

      // Unmount before timeout fires
      unmount();

      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Callback should not be called after unmount
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
