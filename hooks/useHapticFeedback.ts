'use client';

import { useCallback } from 'react';

type FeedbackType = 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning' | 'error';

interface HapticFeedbackOptions {
  type?: FeedbackType;
  duration?: number;
}

const vibrationPatterns: Record<FeedbackType, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 30,
  selection: 10,
  success: [10, 50, 30],
  warning: [20, 100, 20],
  error: [50, 100, 50, 100, 50],
};

/**
 * Hook for providing haptic feedback on mobile devices
 * Uses the Vibration API when available
 */
export function useHapticFeedback() {
  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  const trigger = useCallback(
    (options: HapticFeedbackOptions = {}) => {
      if (!isSupported) return false;

      const { type = 'medium', duration } = options;

      try {
        const pattern = duration ?? vibrationPatterns[type];
        navigator.vibrate(pattern);
        return true;
      } catch {
        return false;
      }
    },
    [isSupported]
  );

  const light = useCallback(() => trigger({ type: 'light' }), [trigger]);
  const medium = useCallback(() => trigger({ type: 'medium' }), [trigger]);
  const heavy = useCallback(() => trigger({ type: 'heavy' }), [trigger]);
  const selection = useCallback(() => trigger({ type: 'selection' }), [trigger]);
  const success = useCallback(() => trigger({ type: 'success' }), [trigger]);
  const warning = useCallback(() => trigger({ type: 'warning' }), [trigger]);
  const error = useCallback(() => trigger({ type: 'error' }), [trigger]);

  return {
    isSupported,
    trigger,
    light,
    medium,
    heavy,
    selection,
    success,
    warning,
    error,
  };
}

/**
 * Component wrapper that triggers haptic feedback on click/tap
 */
export function withHapticFeedback<T extends HTMLElement>(
  element: React.RefObject<T>,
  feedbackType: FeedbackType = 'light'
) {
  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  if (!isSupported || !element.current) return;

  const handler = () => {
    const pattern = vibrationPatterns[feedbackType];
    navigator.vibrate(pattern);
  };

  element.current.addEventListener('touchstart', handler, { passive: true });

  return () => {
    element.current?.removeEventListener('touchstart', handler);
  };
}
