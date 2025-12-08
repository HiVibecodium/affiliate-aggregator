/**
 * useExperiment Hook Tests
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useExperiment, useFeatureFlag, useABTest } from '@/hooks/useExperiment';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('useExperiment Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
  });

  describe('useExperiment', () => {
    it('fetches variant on mount', async () => {
      const mockVariant = { id: 'v1', name: 'control', weight: 50, config: {} };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ variant: mockVariant }),
      });
      mockFetch.mockResolvedValueOnce({ ok: true }); // impression tracking

      const { result } = renderHook(() =>
        useExperiment({
          experimentId: 'exp-1',
          userId: 'user-1',
        })
      );

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.variant).toEqual(mockVariant);
      expect(result.current.error).toBeNull();
    });

    it('handles fetch error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      const { result } = renderHook(() =>
        useExperiment({
          experimentId: 'exp-1',
          userId: 'user-1',
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Failed to fetch experiment variant');
    });

    it('tracks impression when trackImpression is true', async () => {
      const mockVariant = { id: 'v1', name: 'control', weight: 50, config: {} };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ variant: mockVariant }),
      });
      mockFetch.mockResolvedValueOnce({ ok: true });

      renderHook(() =>
        useExperiment({
          experimentId: 'exp-1',
          userId: 'user-1',
          trackImpression: true,
        })
      );

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });

      expect(mockFetch).toHaveBeenLastCalledWith('/api/experiments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('impression'),
      });
    });

    it('does not track impression when trackImpression is false', async () => {
      const mockVariant = { id: 'v1', name: 'control', weight: 50, config: {} };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ variant: mockVariant }),
      });

      renderHook(() =>
        useExperiment({
          experimentId: 'exp-1',
          userId: 'user-1',
          trackImpression: false,
        })
      );

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });
    });

    it('provides trackEvent function', async () => {
      const mockVariant = { id: 'v1', name: 'control', weight: 50, config: {} };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ variant: mockVariant }),
      });
      mockFetch.mockResolvedValueOnce({ ok: true }); // impression
      mockFetch.mockResolvedValueOnce({ ok: true }); // custom event

      const { result } = renderHook(() =>
        useExperiment({
          experimentId: 'exp-1',
          userId: 'user-1',
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        result.current.trackEvent('click', { button: 'cta' });
      });

      expect(mockFetch).toHaveBeenLastCalledWith('/api/experiments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('click'),
      });
    });

    it('does not fetch without experimentId', async () => {
      renderHook(() =>
        useExperiment({
          experimentId: '',
          userId: 'user-1',
        })
      );

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('does not fetch without userId', async () => {
      renderHook(() =>
        useExperiment({
          experimentId: 'exp-1',
          userId: '',
        })
      );

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('useFeatureFlag', () => {
    it('checks feature flag on mount', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ enabled: true }),
      });

      const { result } = renderHook(() => useFeatureFlag('new-feature', 'user-1'));

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isEnabled).toBe(true);
    });

    it('returns false when flag is disabled', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ enabled: false }),
      });

      const { result } = renderHook(() => useFeatureFlag('disabled-feature'));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isEnabled).toBe(false);
    });

    it('handles fetch error gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() => useFeatureFlag('error-flag'));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isEnabled).toBe(false);
      consoleSpy.mockRestore();
    });

    it('includes userId in request when provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ enabled: true }),
      });

      renderHook(() => useFeatureFlag('user-feature', 'user-123'));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('userId=user-123'));
    });

    it('does not include userId when not provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ enabled: true }),
      });

      renderHook(() => useFeatureFlag('global-feature'));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      expect(mockFetch).toHaveBeenCalledWith(expect.not.stringContaining('userId='));
    });
  });

  describe('useABTest', () => {
    const variants = {
      control: { buttonColor: 'blue', text: 'Sign Up' },
      treatment: { buttonColor: 'green', text: 'Get Started' },
    };

    it('returns config for assigned variant', async () => {
      const mockVariant = { id: 'v2', name: 'treatment', weight: 50, config: {} };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ variant: mockVariant }),
      });
      mockFetch.mockResolvedValueOnce({ ok: true });

      const { result } = renderHook(() => useABTest('ab-test-1', 'user-1', variants));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.variantName).toBe('treatment');
      expect(result.current.config).toEqual(variants.treatment);
    });

    it('returns null config while loading', () => {
      mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

      const { result } = renderHook(() => useABTest('ab-test-1', 'user-1', variants));

      expect(result.current.isLoading).toBe(true);
      expect(result.current.config).toBeNull();
      expect(result.current.variantName).toBeNull();
    });

    it('falls back to first variant if variant name not found', async () => {
      const mockVariant = { id: 'v3', name: 'unknown', weight: 50, config: {} };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ variant: mockVariant }),
      });
      mockFetch.mockResolvedValueOnce({ ok: true });

      const { result } = renderHook(() => useABTest('ab-test-1', 'user-1', variants));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should fall back to first variant (control)
      expect(result.current.config).toEqual(variants.control);
    });
  });
});
