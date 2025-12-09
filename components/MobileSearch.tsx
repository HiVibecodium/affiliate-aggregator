'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  name: string;
  category: string;
  network: string;
  commissionRate: number;
  commissionType: string;
}

interface MobileSearchProps {
  isOpen: boolean;
  onClose: () => void;
  initialValue?: string;
  onSearch?: (query: string) => void;
}

export function MobileSearch({ isOpen, onClose, initialValue = '', onSearch }: MobileSearchProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [popularCategories] = useState([
    'Finance',
    'E-commerce',
    'Health',
    'Technology',
    'Travel',
    'Gaming',
  ]);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recentSearches');
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch {
          setRecentSearches([]);
        }
      }
    }
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Update query when initialValue changes
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/programs?search=${encodeURIComponent(query)}&limit=5`);
        if (response.ok) {
          const data = await response.json();
          setResults(
            data.programs.map(
              (p: {
                id: string;
                name: string;
                category: string;
                network: { name: string };
                commissionRate: number;
                commissionType: string;
              }) => ({
                id: p.id,
                name: p.name,
                category: p.category,
                network: p.network.name,
                commissionRate: p.commissionRate,
                commissionType: p.commissionType,
              })
            )
          );
        }
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const saveRecentSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setRecentSearches((prev) => {
      const newSearches = [searchQuery, ...prev.filter((s) => s !== searchQuery)].slice(0, 5);
      if (typeof window !== 'undefined') {
        localStorage.setItem('recentSearches', JSON.stringify(newSearches));
      }
      return newSearches;
    });
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!query.trim()) return;

      saveRecentSearch(query);
      if (onSearch) {
        onSearch(query);
      } else {
        router.push(`/programs?search=${encodeURIComponent(query)}`);
      }
      onClose();
    },
    [query, saveRecentSearch, onSearch, router, onClose]
  );

  const handleResultClick = useCallback(
    (programId: string) => {
      router.push(`/programs/${programId}`);
      onClose();
    },
    [router, onClose]
  );

  const handleCategoryClick = useCallback(
    (category: string) => {
      router.push(`/programs?category=${encodeURIComponent(category)}`);
      onClose();
    },
    [router, onClose]
  );

  const handleRecentClick = useCallback(
    (searchTerm: string) => {
      setQuery(searchTerm);
      if (onSearch) {
        onSearch(searchTerm);
      } else {
        router.push(`/programs?search=${encodeURIComponent(searchTerm)}`);
      }
      onClose();
    },
    [onSearch, router, onClose]
  );

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('recentSearches');
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-gray-900 animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 safe-area-inset">
        <form onSubmit={handleSubmit} className="flex items-center gap-3 p-4">
          <button
            type="button"
            onClick={onClose}
            className="p-2 -ml-2 text-gray-500 dark:text-gray-400 touch-target"
            aria-label="Close search"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search programs..."
              className="w-full pl-10 pr-10 py-3 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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

            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {query && (
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-full font-medium touch-target"
            >
              Search
            </button>
          )}
        </form>
      </div>

      {/* Content */}
      <div className="overflow-y-auto h-[calc(100vh-80px)] pb-20">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Search Results */}
        {!isLoading && results.length > 0 && (
          <div className="px-4 py-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Results</h3>
            <div className="space-y-1">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-left transition-colors"
                >
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-lg">
                    {result.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {result.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {result.network} • {result.commissionRate}% {result.commissionType}
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ))}
            </div>

            {query && (
              <button
                onClick={handleSubmit}
                className="w-full mt-4 py-3 text-blue-600 dark:text-blue-400 font-medium"
              >
                See all results for &ldquo;{query}&rdquo;
              </button>
            )}
          </div>
        )}

        {/* Empty State - Show suggestions */}
        {!isLoading && !query && (
          <>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Recent Searches
                  </h3>
                  <button
                    onClick={clearRecentSearches}
                    className="text-sm text-blue-600 dark:text-blue-400"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentClick(term)}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300"
                    >
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Categories */}
            <div className="px-4 py-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                Popular Categories
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {popularCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-xl">
                      {category === 'Finance' && '💰'}
                      {category === 'E-commerce' && '🛒'}
                      {category === 'Health' && '🏥'}
                      {category === 'Technology' && '💻'}
                      {category === 'Travel' && '✈️'}
                      {category === 'Gaming' && '🎮'}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">{category}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search Tips */}
            <div className="px-4 py-4 bg-blue-50 dark:bg-blue-900/20 mx-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                Search Tips
              </h3>
              <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                <li>• Search by program name or keyword</li>
                <li>• Try category names like &ldquo;finance&rdquo; or &ldquo;travel&rdquo;</li>
                <li>• Filter by commission type (CPA, RevShare)</li>
              </ul>
            </div>
          </>
        )}

        {/* No Results */}
        {!isLoading && query && results.length === 0 && (
          <div className="px-4 py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
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
            </div>
            <p className="text-gray-900 dark:text-white font-medium mb-1">No results found</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Try a different search term or browse categories
            </p>
            <button
              onClick={() => setQuery('')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
