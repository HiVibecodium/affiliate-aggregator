/**
 * Analytics Library Tests
 */

import { analytics, trackEvent } from '@/lib/analytics';

describe('Analytics Library', () => {
  const mockVa = jest.fn();
  const mockGtag = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup window mocks - assign directly to window properties
    window.va = mockVa;
    window.gtag = mockGtag;
  });

  afterEach(() => {
    // Cleanup
    delete (window as unknown as Record<string, unknown>).va;
    delete (window as unknown as Record<string, unknown>).gtag;
  });

  describe('trackEvent', () => {
    it('calls Vercel Analytics when available', () => {
      trackEvent('search', { query: 'test' });

      expect(mockVa).toHaveBeenCalledWith(
        'event',
        expect.objectContaining({
          name: 'search',
          query: 'test',
        })
      );
    });

    it('calls Google Analytics when available', () => {
      trackEvent('program_click', { program_id: '123' });

      expect(mockGtag).toHaveBeenCalledWith(
        'event',
        'program_click',
        expect.objectContaining({
          program_id: '123',
        })
      );
    });

    it('does not throw when window.va is undefined', () => {
      delete (window as unknown as Record<string, unknown>).va;

      expect(() => trackEvent('search', {})).not.toThrow();
    });

    it('does not throw when window.gtag is undefined', () => {
      delete (window as unknown as Record<string, unknown>).gtag;

      expect(() => trackEvent('search', {})).not.toThrow();
    });
  });

  describe('analytics.trackSearch', () => {
    it('tracks search with query and results count', () => {
      analytics.trackSearch('amazon', 150);

      expect(mockVa).toHaveBeenCalledWith(
        'event',
        expect.objectContaining({
          name: 'search',
          query: 'amazon',
          results_count: 150,
        })
      );
    });
  });

  describe('analytics.trackFilterApplied', () => {
    it('tracks filter with type and value', () => {
      analytics.trackFilterApplied('category', 'Finance');

      expect(mockVa).toHaveBeenCalledWith(
        'event',
        expect.objectContaining({
          name: 'filter_applied',
          filter_type: 'category',
          filter_value: 'Finance',
        })
      );
    });
  });

  describe('analytics.trackProgramClick', () => {
    it('tracks program click with all properties', () => {
      analytics.trackProgramClick('prog-123', 'Amazon Associates', 'search_results');

      expect(mockVa).toHaveBeenCalledWith(
        'event',
        expect.objectContaining({
          name: 'program_click',
          program_id: 'prog-123',
          program_name: 'Amazon Associates',
          source: 'search_results',
        })
      );
    });
  });

  describe('analytics.trackProgramView', () => {
    it('tracks program view with network', () => {
      analytics.trackProgramView('prog-456', 'Shopify Affiliate', 'ShareASale');

      expect(mockVa).toHaveBeenCalledWith(
        'event',
        expect.objectContaining({
          name: 'program_view',
          program_id: 'prog-456',
          program_name: 'Shopify Affiliate',
          network: 'ShareASale',
        })
      );
    });
  });

  describe('favorites tracking', () => {
    it('tracks add to favorites', () => {
      analytics.trackAddToFavorites('prog-789', 'ClickBank Product');

      expect(mockVa).toHaveBeenCalledWith(
        'event',
        expect.objectContaining({
          name: 'add_to_favorites',
          program_id: 'prog-789',
          program_name: 'ClickBank Product',
        })
      );
    });

    it('tracks remove from favorites', () => {
      analytics.trackRemoveFromFavorites('prog-789', 'ClickBank Product');

      expect(mockVa).toHaveBeenCalledWith(
        'event',
        expect.objectContaining({
          name: 'remove_from_favorites',
          program_id: 'prog-789',
          program_name: 'ClickBank Product',
        })
      );
    });
  });

  describe('comparison tracking', () => {
    it('tracks add to compare', () => {
      analytics.trackAddToCompare('prog-101', 'CJ Affiliate Program');

      expect(mockVa).toHaveBeenCalledWith(
        'event',
        expect.objectContaining({
          name: 'add_to_compare',
          program_id: 'prog-101',
          program_name: 'CJ Affiliate Program',
        })
      );
    });

    it('tracks remove from compare', () => {
      analytics.trackRemoveFromCompare('prog-101', 'CJ Affiliate Program');

      expect(mockVa).toHaveBeenCalledWith(
        'event',
        expect.objectContaining({
          name: 'remove_from_compare',
          program_id: 'prog-101',
          program_name: 'CJ Affiliate Program',
        })
      );
    });
  });

  describe('analytics.trackShare', () => {
    it('tracks share with method', () => {
      analytics.trackShare('prog-202', 'twitter');

      expect(mockVa).toHaveBeenCalledWith(
        'event',
        expect.objectContaining({
          name: 'share',
          program_id: 'prog-202',
          method: 'twitter',
        })
      );
    });
  });

  describe('conversion tracking', () => {
    it('tracks apply program', () => {
      analytics.trackApplyProgram('prog-303', 'Best Program', 'Awin');

      expect(mockVa).toHaveBeenCalledWith(
        'event',
        expect.objectContaining({
          name: 'apply_program',
          program_id: 'prog-303',
          program_name: 'Best Program',
          network: 'Awin',
        })
      );
    });

    it('tracks review submit', () => {
      analytics.trackReviewSubmit('prog-404', 5);

      expect(mockVa).toHaveBeenCalledWith(
        'event',
        expect.objectContaining({
          name: 'review_submit',
          program_id: 'prog-404',
          rating: 5,
        })
      );
    });

    it('tracks export favorites', () => {
      analytics.trackExportFavorites(10, 'csv');

      expect(mockVa).toHaveBeenCalledWith(
        'event',
        expect.objectContaining({
          name: 'export_favorites',
          count: 10,
          format: 'csv',
        })
      );
    });
  });

  describe('quick view tracking', () => {
    it('tracks quick view open', () => {
      analytics.trackQuickViewOpen('prog-505', 'Quick Program');

      expect(mockVa).toHaveBeenCalledWith(
        'event',
        expect.objectContaining({
          name: 'quick_view_open',
          program_id: 'prog-505',
          program_name: 'Quick Program',
        })
      );
    });

    it('tracks quick view close with duration', () => {
      analytics.trackQuickViewClose('prog-505', 5000);

      expect(mockVa).toHaveBeenCalledWith(
        'event',
        expect.objectContaining({
          name: 'quick_view_close',
          program_id: 'prog-505',
          view_duration_ms: 5000,
        })
      );
    });
  });

  describe('auth tracking', () => {
    it('tracks signup start', () => {
      analytics.trackSignupStart('google');

      expect(mockVa).toHaveBeenCalledWith(
        'event',
        expect.objectContaining({
          name: 'signup_start',
          method: 'google',
        })
      );
    });

    it('tracks signup complete', () => {
      analytics.trackSignupComplete('email');

      expect(mockVa).toHaveBeenCalledWith(
        'event',
        expect.objectContaining({
          name: 'signup_complete',
          method: 'email',
        })
      );
    });
  });

  describe('analytics.trackUpgradeClick', () => {
    it('tracks upgrade click', () => {
      analytics.trackUpgradeClick('pro', 'dashboard_banner');

      expect(mockVa).toHaveBeenCalledWith(
        'event',
        expect.objectContaining({
          name: 'upgrade_click',
          plan: 'pro',
          source: 'dashboard_banner',
        })
      );
    });
  });

  describe('navigation tracking', () => {
    it('tracks network click', () => {
      analytics.trackNetworkClick('ShareASale', 'sidebar');

      expect(mockVa).toHaveBeenCalledWith(
        'event',
        expect.objectContaining({
          name: 'network_click',
          network_name: 'ShareASale',
          source: 'sidebar',
        })
      );
    });

    it('tracks category click', () => {
      analytics.trackCategoryClick('Finance', 'filter_panel');

      expect(mockVa).toHaveBeenCalledWith(
        'event',
        expect.objectContaining({
          name: 'category_click',
          category: 'Finance',
          source: 'filter_panel',
        })
      );
    });

    it('tracks external link click', () => {
      analytics.trackExternalLinkClick('https://amazon.com', 'program_details');

      expect(mockVa).toHaveBeenCalledWith(
        'event',
        expect.objectContaining({
          name: 'external_link_click',
          url: 'https://amazon.com',
          context: 'program_details',
        })
      );
    });
  });
});
