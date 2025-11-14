/**
 * Saved Searches Utility
 * LocalStorage-based saved search management
 */

export interface SavedSearch {
  id: string;
  name: string;
  filters: {
    network?: string;
    category?: string;
    commissionType?: string;
    search?: string;
    minCommission?: string;
    maxCommission?: string;
  };
  createdAt: string;
}

const STORAGE_KEY = 'affiliate_saved_searches';

export function getSavedSearches(): SavedSearch[] {
  if (typeof window === 'undefined') return [];

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveSearch(name: string, filters: SavedSearch['filters']): SavedSearch {
  const newSearch: SavedSearch = {
    id: Date.now().toString(),
    name,
    filters,
    createdAt: new Date().toISOString(),
  };

  const searches = getSavedSearches();
  searches.unshift(newSearch);

  // Keep only last 10
  const limited = searches.slice(0, 10);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
  return newSearch;
}

export function deleteSavedSearch(id: string): void {
  const searches = getSavedSearches();
  const filtered = searches.filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function applySavedSearch(search: SavedSearch): URLSearchParams {
  const params = new URLSearchParams();

  Object.entries(search.filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  return params;
}
