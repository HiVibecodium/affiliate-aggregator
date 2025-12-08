/**
 * Analytics Event Tracking
 * Unified analytics for user behavior tracking
 */

// Event types
export type AnalyticsEvent =
  | 'page_view'
  | 'search'
  | 'filter_applied'
  | 'program_click'
  | 'program_view'
  | 'add_to_favorites'
  | 'remove_from_favorites'
  | 'add_to_compare'
  | 'remove_from_compare'
  | 'share'
  | 'apply_program'
  | 'review_submit'
  | 'export_favorites'
  | 'quick_view_open'
  | 'quick_view_close'
  | 'signup_start'
  | 'signup_complete'
  | 'upgrade_click'
  | 'network_click'
  | 'category_click'
  | 'external_link_click';

interface AnalyticsEventData {
  event: AnalyticsEvent;
  properties?: Record<string, string | number | boolean | null | undefined>;
}

/**
 * Track an analytics event
 * Integrates with Vercel Analytics and optional third-party providers
 */
export function trackEvent(
  event: AnalyticsEvent,
  properties?: Record<string, string | number | boolean | null | undefined>
) {
  if (typeof window === 'undefined') return;

  const eventData: AnalyticsEventData = {
    event,
    properties: {
      ...properties,
      timestamp: Date.now(),
      url: window.location.href,
      referrer: document.referrer || null,
    },
  };

  // Vercel Analytics
  if (window.va) {
    window.va('event', {
      name: event,
      ...properties,
    });
  }

  // Google Analytics (if configured)
  if (window.gtag) {
    window.gtag('event', event, {
      event_category: getEventCategory(event),
      ...properties,
    });
  }

  // Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', eventData);
  }
}

/**
 * Get event category for GA4
 */
function getEventCategory(event: AnalyticsEvent): string {
  const categories: Record<AnalyticsEvent, string> = {
    page_view: 'navigation',
    search: 'engagement',
    filter_applied: 'engagement',
    program_click: 'engagement',
    program_view: 'engagement',
    add_to_favorites: 'engagement',
    remove_from_favorites: 'engagement',
    add_to_compare: 'engagement',
    remove_from_compare: 'engagement',
    share: 'engagement',
    apply_program: 'conversion',
    review_submit: 'conversion',
    export_favorites: 'conversion',
    quick_view_open: 'engagement',
    quick_view_close: 'engagement',
    signup_start: 'conversion',
    signup_complete: 'conversion',
    upgrade_click: 'conversion',
    network_click: 'navigation',
    category_click: 'navigation',
    external_link_click: 'outbound',
  };

  return categories[event] || 'other';
}

// Specific tracking functions for common events
export const analytics = {
  // Search & Discovery
  trackSearch: (query: string, resultsCount: number) =>
    trackEvent('search', { query, results_count: resultsCount }),

  trackFilterApplied: (filterType: string, filterValue: string) =>
    trackEvent('filter_applied', { filter_type: filterType, filter_value: filterValue }),

  // Program Interactions
  trackProgramClick: (programId: string, programName: string, source: string) =>
    trackEvent('program_click', { program_id: programId, program_name: programName, source }),

  trackProgramView: (programId: string, programName: string, network: string) =>
    trackEvent('program_view', { program_id: programId, program_name: programName, network }),

  // Favorites
  trackAddToFavorites: (programId: string, programName: string) =>
    trackEvent('add_to_favorites', { program_id: programId, program_name: programName }),

  trackRemoveFromFavorites: (programId: string, programName: string) =>
    trackEvent('remove_from_favorites', { program_id: programId, program_name: programName }),

  // Comparison
  trackAddToCompare: (programId: string, programName: string) =>
    trackEvent('add_to_compare', { program_id: programId, program_name: programName }),

  trackRemoveFromCompare: (programId: string, programName: string) =>
    trackEvent('remove_from_compare', { program_id: programId, program_name: programName }),

  // Sharing
  trackShare: (programId: string, method: string) =>
    trackEvent('share', { program_id: programId, method }),

  // Conversions
  trackApplyProgram: (programId: string, programName: string, network: string) =>
    trackEvent('apply_program', { program_id: programId, program_name: programName, network }),

  trackReviewSubmit: (programId: string, rating: number) =>
    trackEvent('review_submit', { program_id: programId, rating }),

  trackExportFavorites: (count: number, format: string) =>
    trackEvent('export_favorites', { count, format }),

  // Quick View
  trackQuickViewOpen: (programId: string, programName: string) =>
    trackEvent('quick_view_open', { program_id: programId, program_name: programName }),

  trackQuickViewClose: (programId: string, duration: number) =>
    trackEvent('quick_view_close', { program_id: programId, view_duration_ms: duration }),

  // Auth
  trackSignupStart: (method: string) => trackEvent('signup_start', { method }),

  trackSignupComplete: (method: string) => trackEvent('signup_complete', { method }),

  // Upgrade
  trackUpgradeClick: (plan: string, source: string) =>
    trackEvent('upgrade_click', { plan, source }),

  // Navigation
  trackNetworkClick: (networkName: string, source: string) =>
    trackEvent('network_click', { network_name: networkName, source }),

  trackCategoryClick: (category: string, source: string) =>
    trackEvent('category_click', { category, source }),

  trackExternalLinkClick: (url: string, context: string) =>
    trackEvent('external_link_click', { url, context }),
};

// Type declarations for window
declare global {
  interface Window {
    va?: (event: string, data: unknown) => void;
    gtag?: (command: string, action: string, params: Record<string, unknown>) => void;
  }
}
