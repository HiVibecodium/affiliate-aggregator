'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchSuggestions } from '@/hooks/usePrograms';
import { useDebounce } from '@/hooks/useDebounce';
import { useAnalytics } from '@/hooks/useAnalytics';

export function HeroSearch() {
  const router = useRouter();
  const analytics = useAnalytics();
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounce the search query
  const debouncedQuery = useDebounce(query, 300);

  // Use SWR for cached search suggestions
  const { suggestions, isLoading } = useSearchSuggestions(debouncedQuery);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        analytics.trackSearch(query.trim(), suggestions.length);
        router.push(`/programs?search=${encodeURIComponent(query.trim())}`);
        setShowSuggestions(false);
      }
    },
    [query, router, analytics, suggestions.length]
  );

  const handleSuggestionClick = useCallback(
    (suggestionId: string, suggestionName: string) => {
      analytics.trackProgramClick(suggestionId, suggestionName, 'hero_search');
      router.push(`/programs/${suggestionId}`);
      setShowSuggestions(false);
    },
    [router, analytics]
  );

  const handlePopularSearch = useCallback(
    (term: string) => {
      router.push(`/programs?search=${encodeURIComponent(term)}`);
    },
    [router]
  );

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => query.length >= 2 && setShowSuggestions(true)}
            placeholder="Поиск программ... (например: Amazon, Shopify, финансы)"
            className="w-full px-6 py-4 pl-14 text-lg rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all shadow-lg"
          />
          <div className="absolute left-5 top-1/2 -translate-y-1/2">
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </div>
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors touch-target haptic-feedback"
          >
            Найти
          </button>
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-scale-in"
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion.id, suggestion.name)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left touch-target"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{suggestion.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{suggestion.network}</p>
              </div>
              <span className="text-green-600 dark:text-green-400 font-bold">
                {suggestion.commissionRate}%
              </span>
            </button>
          ))}
          <button
            onClick={() => {
              router.push(`/programs?search=${encodeURIComponent(query)}`);
              setShowSuggestions(false);
            }}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors touch-target"
          >
            Показать все результаты →
          </button>
        </div>
      )}

      {/* Popular searches - memoized */}
      <PopularSearches onSearch={handlePopularSearch} />
    </div>
  );
}

// Memoized popular searches component
const popularTerms = ['Amazon', 'Shopify', 'ClickBank', 'финансы', 'SaaS'];

function PopularSearches({ onSearch }: { onSearch: (term: string) => void }) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
      <span className="text-gray-500 dark:text-gray-400">Популярные:</span>
      {popularTerms.map((term) => (
        <button
          key={term}
          onClick={() => onSearch(term)}
          className="px-3 py-1 bg-white/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300 transition-colors"
        >
          {term}
        </button>
      ))}
    </div>
  );
}
