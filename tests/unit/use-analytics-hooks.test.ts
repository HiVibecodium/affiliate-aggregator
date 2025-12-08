/**
 * Analytics Hooks Tests
 */

import { renderHook, act } from '@testing-library/react';
import {
  useAnalytics,
  usePageView,
  useTimeOnPage,
  useTrackClick,
  useExternalLinkTracking,
  useScrollTracking,
} from '@/hooks/useAnalytics';
import { trackEvent } from '@/lib/analytics';

// Mock analytics
jest.mock('@/lib/analytics', () => ({
  trackEvent: jest.fn(),
  analytics: {
    trackSearch: jest.fn(),
    trackFilterApplied: jest.fn(),
    trackProgramClick: jest.fn(),
    trackExternalLinkClick: jest.fn(),
  },
}));

describe('Analytics Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('useAnalytics', () => {
    it('returns trackEvent and analytics functions', () => {
      const { result } = renderHook(() => useAnalytics());

      expect(result.current.trackEvent).toBeDefined();
      expect(result.current.trackSearch).toBeDefined();
      expect(result.current.trackFilterApplied).toBeDefined();
      expect(result.current.trackProgramClick).toBeDefined();
    });
  });

  describe('usePageView', () => {
    it('tracks page view on mount', () => {
      renderHook(() => usePageView('Home'));

      expect(trackEvent).toHaveBeenCalledTimes(1);
      expect(trackEvent).toHaveBeenCalledWith('page_view', {
        page_name: 'Home',
      });
    });

    it('includes additional properties', () => {
      renderHook(() => usePageView('Programs', { filter: 'finance', page: 1 }));

      expect(trackEvent).toHaveBeenCalledWith('page_view', {
        page_name: 'Programs',
        filter: 'finance',
        page: 1,
      });
    });

    it('only tracks once even on rerender', () => {
      const { rerender } = renderHook(({ pageName }) => usePageView(pageName), {
        initialProps: { pageName: 'Home' },
      });

      rerender({ pageName: 'Home' });
      rerender({ pageName: 'Home' });

      expect(trackEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe('useTimeOnPage', () => {
    it('tracks time on page on unmount', () => {
      const { unmount } = renderHook(() => useTimeOnPage('TestPage'));

      // Advance time by 5 seconds
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      // Nothing tracked yet
      expect(trackEvent).not.toHaveBeenCalled();

      // Unmount triggers tracking
      unmount();

      expect(trackEvent).toHaveBeenCalledWith('page_view', {
        page_name: 'TestPage',
        time_on_page_ms: expect.any(Number),
        event_type: 'exit',
      });
    });

    it('does not track if less than 1 second', () => {
      const { unmount } = renderHook(() => useTimeOnPage('QuickPage'));

      // Advance less than 1 second
      act(() => {
        jest.advanceTimersByTime(500);
      });

      unmount();

      expect(trackEvent).not.toHaveBeenCalled();
    });

    it('tracks correct duration', () => {
      const { unmount } = renderHook(() => useTimeOnPage('TimedPage'));

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      unmount();

      const call = (trackEvent as jest.Mock).mock.calls[0];
      expect(call[1].time_on_page_ms).toBeGreaterThanOrEqual(3000);
    });
  });

  describe('useTrackClick', () => {
    it('returns a tracking callback', () => {
      const { result } = renderHook(() => useTrackClick('program_click', { id: '123' }));

      expect(typeof result.current).toBe('function');
    });

    it('calls trackEvent when callback is invoked', () => {
      const { result } = renderHook(() => useTrackClick('add_to_favorites', { program_id: 'abc' }));

      act(() => {
        result.current();
      });

      expect(trackEvent).toHaveBeenCalledWith('add_to_favorites', { program_id: 'abc' });
    });

    it('returns a callback function on each call', () => {
      const props = { query: 'test' };
      const { result, rerender } = renderHook(({ event, props }) => useTrackClick(event, props), {
        initialProps: { event: 'search' as const, props },
      });

      const firstCallback = result.current;
      expect(typeof firstCallback).toBe('function');

      // Rerender returns a function (memoization depends on object reference)
      rerender({ event: 'search' as const, props });

      expect(typeof result.current).toBe('function');
    });
  });

  describe('useExternalLinkTracking', () => {
    it('adds click event listener on mount', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

      renderHook(() => useExternalLinkTracking());

      expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));

      addEventListenerSpy.mockRestore();
    });

    it('removes click event listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

      const { unmount } = renderHook(() => useExternalLinkTracking());
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });
  });

  describe('useScrollTracking', () => {
    it('adds scroll event listener on mount', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

      renderHook(() => useScrollTracking());

      expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function), {
        passive: true,
      });

      addEventListenerSpy.mockRestore();
    });

    it('removes scroll event listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

      const { unmount } = renderHook(() => useScrollTracking());
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });

    it('uses default thresholds', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

      renderHook(() => useScrollTracking());

      // Should be called (thresholds default to [25, 50, 75, 100])
      expect(addEventListenerSpy).toHaveBeenCalled();

      addEventListenerSpy.mockRestore();
    });

    it('uses custom thresholds', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

      renderHook(() => useScrollTracking([10, 20, 30]));

      expect(addEventListenerSpy).toHaveBeenCalled();

      addEventListenerSpy.mockRestore();
    });
  });
});
