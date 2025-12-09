'use client';

import { useTranslations } from 'next-intl';

export function useProgramsTranslations() {
  const t = useTranslations('programs');
  const common = useTranslations('common');

  return {
    // Page
    title: t('title'),
    subtitle: (count: number, networks: number) => t('subtitle', { count, networks }),
    searchPlaceholder: t('searchPlaceholder'),
    noResults: t('noResults'),
    noResultsHint: t('noResultsHint'),
    resetFilters: t('resetFilters'),

    // Sorting
    sortBy: t('sortBy'),
    sortByDate: t('sortByDate'),
    sortByCommission: t('sortByCommission'),
    sortByName: t('sortByName'),
    ascending: t('ascending'),
    descending: t('descending'),

    // Pagination
    page: (current: number, total: number) => t('page', { current, total }),
    showingPrograms: (count: number) => t('showingPrograms', { count }),

    // Filters
    filters: {
      network: t('filters.network'),
      allNetworks: t('filters.allNetworks'),
      category: t('filters.category'),
      allCategories: t('filters.allCategories'),
      commissionType: t('filters.commissionType'),
      allTypes: t('filters.allTypes'),
      country: t('filters.country'),
      allCountries: t('filters.allCountries'),
      commissionRange: t('filters.commissionRange'),
      from: t('filters.from'),
      to: t('filters.to'),
      paymentMethod: t('filters.paymentMethod'),
      allMethods: t('filters.allMethods'),
      cookieDuration: t('filters.cookieDuration'),
      min: t('filters.min'),
      max: t('filters.max'),
      paymentThreshold: t('filters.paymentThreshold'),
      difficulty: t('filters.difficulty'),
      easy: t('filters.easy'),
      medium: t('filters.medium'),
      hard: t('filters.hard'),
      hasReviews: t('filters.hasReviews'),
      hasReviewsHint: t('filters.hasReviewsHint'),
      statistics: t('filters.statistics'),
      totalPrograms: t('filters.totalPrograms'),
      totalNetworks: t('filters.totalNetworks'),
    },

    // Quick Filters
    quickFilters: {
      highCommission: t('quickFilters.highCommission'),
      longCookie: t('quickFilters.longCookie'),
      lowThreshold: t('quickFilters.lowThreshold'),
      paypal: t('quickFilters.paypal'),
      withReviews: t('quickFilters.withReviews'),
    },

    // Card
    card: {
      commission: t('card.commission'),
      cookie: t('card.cookie'),
      minPayout: t('card.minPayout'),
      viewDetails: t('card.viewDetails'),
      addToFavorites: t('card.addToFavorites'),
      removeFromFavorites: t('card.removeFromFavorites'),
      addToCompare: t('card.addToCompare'),
      removeFromCompare: t('card.removeFromCompare'),
      quickView: t('card.quickView'),
    },

    // Common
    common: {
      backToHome: common('backToHome'),
      filters: common('filters'),
      reset: common('reset'),
      back: common('back'),
      next: common('next'),
      days: common('days'),
    },
  };
}

export function useFavoritesTranslations() {
  const t = useTranslations('favorites');
  const common = useTranslations('common');

  return {
    title: t('title'),
    subtitle: (count: number) => t('subtitle', { count }),
    empty: t('empty'),
    emptyHint: t('emptyHint'),
    goToPrograms: t('goToPrograms'),
    addedOn: t('addedOn'),
    swipeHint: t('swipeHint'),
    removed: t('removed'),
    loginRequired: t('loginRequired'),

    common: {
      backToHome: common('backToHome'),
      exportCSV: common('exportCSV'),
      delete: common('delete'),
      days: common('days'),
    },
  };
}
