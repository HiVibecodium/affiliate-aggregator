'use client';

import { useEffect, useState, useCallback } from 'react';

interface Variant {
  id: string;
  name: string;
  weight: number;
  config: Record<string, unknown>;
}

interface UseExperimentOptions {
  experimentId: string;
  userId: string;
  trackImpression?: boolean;
}

interface UseExperimentReturn {
  variant: Variant | null;
  isLoading: boolean;
  error: Error | null;
  trackEvent: (eventType: string, eventData?: Record<string, unknown>) => void;
}

/**
 * React hook for A/B testing experiments
 */
export function useExperiment({
  experimentId,
  userId,
  trackImpression = true,
}: UseExperimentOptions): UseExperimentReturn {
  const [variant, setVariant] = useState<Variant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch variant assignment
  useEffect(() => {
    const fetchVariant = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/experiments?action=assignment&experimentId=${experimentId}&userId=${userId}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch experiment variant');
        }

        const data = await response.json();
        setVariant(data.variant);

        // Track impression
        if (trackImpression && data.variant) {
          await fetch('/api/experiments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'track',
              experimentId,
              userId,
              eventType: 'impression',
            }),
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    if (experimentId && userId) {
      fetchVariant();
    }
  }, [experimentId, userId, trackImpression]);

  // Track custom event
  const trackEvent = useCallback(
    async (eventType: string, eventData?: Record<string, unknown>) => {
      if (!variant) return;

      try {
        await fetch('/api/experiments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'track',
            experimentId,
            userId,
            eventType,
            eventData,
          }),
        });
      } catch (err) {
        console.error('Failed to track experiment event:', err);
      }
    },
    [experimentId, userId, variant]
  );

  return {
    variant,
    isLoading,
    error,
    trackEvent,
  };
}

/**
 * Hook for feature flags
 */
export function useFeatureFlag(
  flagName: string,
  userId?: string
): {
  isEnabled: boolean;
  isLoading: boolean;
} {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFlag = async () => {
      try {
        const url = userId
          ? `/api/experiments?action=flag&name=${flagName}&userId=${userId}`
          : `/api/experiments?action=flag&name=${flagName}`;

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setIsEnabled(data.enabled);
        }
      } catch (err) {
        console.error('Failed to check feature flag:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkFlag();
  }, [flagName, userId]);

  return { isEnabled, isLoading };
}

/**
 * Component wrapper for A/B testing
 */
export function useABTest<T extends Record<string, unknown>>(
  experimentId: string,
  userId: string,
  variants: { [variantName: string]: T }
): { config: T | null; variantName: string | null; isLoading: boolean } {
  const { variant, isLoading } = useExperiment({
    experimentId,
    userId,
  });

  if (isLoading || !variant) {
    return { config: null, variantName: null, isLoading };
  }

  const config = variants[variant.name] || Object.values(variants)[0];

  return {
    config,
    variantName: variant.name,
    isLoading: false,
  };
}
