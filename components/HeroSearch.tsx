'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface SearchSuggestion {
  id: string;
  name: string;
  network: string;
  commissionRate: number;
}

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions on query change
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/programs/search?q=${encodeURIComponent(query)}&limit=5`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.suggestions || []);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/programs?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    router.push(`/programs/${suggestion.id}`);
  };

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
              onClick={() => handleSuggestionClick(suggestion)}
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

      {/* Popular searches */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
        <span className="text-gray-500 dark:text-gray-400">Популярные:</span>
        {['Amazon', 'Shopify', 'ClickBank', 'финансы', 'SaaS'].map((term) => (
          <button
            key={term}
            onClick={() => router.push(`/programs?search=${encodeURIComponent(term)}`)}
            className="px-3 py-1 bg-white/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300 transition-colors"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
