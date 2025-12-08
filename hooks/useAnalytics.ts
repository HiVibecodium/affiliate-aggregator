'use client';

import { useCallback, useEffect, useRef } from 'react';
import { analytics, trackEvent, AnalyticsEvent } from '@/lib/analytics';

/**
 * React hook for analytics tracking
 * Provides memoized tracking functions and automatic page view tracking
 */
export function useAnalytics() {
  return {
    trackEvent,
    ...analytics,
  };
}

/**
 * Track page view automatically on mount
 */
export function usePageView(
  pageName: string,
  properties?: Record<string, string | number | boolean | null | undefined>
) {
  const tracked = useRef(false);

  useEffect(() => {
    if (!tracked.current) {
      tracked.current = true;
      trackEvent('page_view', {
        page_name: pageName,
        ...properties,
      });
    }
  }, [pageName, properties]);
}

/**
 * Track time spent on page
 */
export function useTimeOnPage(pageName: string) {
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    startTime.current = Date.now();

    return () => {
      const duration = Date.now() - startTime.current;
      if (duration > 1000) {
        // Only track if more than 1 second
        trackEvent('page_view', {
          page_name: pageName,
          time_on_page_ms: duration,
          event_type: 'exit',
        });
      }
    };
  }, [pageName]);
}

/**
 * Track click events with automatic analytics
 */
export function useTrackClick(
  event: AnalyticsEvent,
  properties?: Record<string, string | number | boolean | null | undefined>
) {
  return useCallback(() => {
    trackEvent(event, properties);
  }, [event, properties]);
}

/**
 * Track external link clicks
 */
export function useExternalLinkTracking() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      if (anchor && anchor.href) {
        const url = new URL(anchor.href);
        const currentHost = window.location.host;

        if (url.host !== currentHost && !url.href.startsWith('javascript:')) {
          analytics.trackExternalLinkClick(url.href, anchor.textContent || 'unknown');
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
}

/**
 * Track scroll depth
 */
export function useScrollTracking(thresholds: number[] = [25, 50, 75, 100]) {
  const trackedThresholds = useRef<Set<number>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

      thresholds.forEach((threshold) => {
        if (scrollPercent >= threshold && !trackedThresholds.current.has(threshold)) {
          trackedThresholds.current.add(threshold);
          trackEvent('page_view', {
            event_type: 'scroll_depth',
            scroll_depth: threshold,
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [thresholds]);
}
