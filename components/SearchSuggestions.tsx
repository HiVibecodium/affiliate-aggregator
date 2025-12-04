'use client';
import { logger } from '@/lib/logger';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Suggestion {
  id: string;
  name: string;
  category: string | null;
  network: {
    name: string;
  };
}

interface SearchSuggestionsProps {
  query: string;
  onSelect?: (suggestion: Suggestion) => void;
  onClose?: () => void;
}

export function SearchSuggestions({ query, onSelect, onClose }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/programs/suggestions?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
        }
      } catch (error) {
        logger.error('Failed to fetch suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose?.();
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex, suggestions]);

  const handleSelect = (suggestion: Suggestion) => {
    onSelect?.(suggestion);
    onClose?.();
  };

  if (query.length < 2) return null;

  return (
    <div
      ref={containerRef}
      className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
    >
      {loading && (
        <div className="px-4 py-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            Searching...
          </div>
        </div>
      )}

      {!loading && suggestions.length === 0 && (
        <div className="px-4 py-3 text-sm text-gray-600">
          No results found for &quot;{query}&quot;
        </div>
      )}

      {!loading && suggestions.length > 0 && (
        <div className="py-1">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Suggested Programs
          </div>
          {suggestions.map((suggestion, index) => (
            <Link
              key={suggestion.id}
              href={`/programs/${suggestion.id}`}
              onClick={() => handleSelect(suggestion)}
              className={`block px-4 py-3 hover:bg-blue-50 transition-colors border-l-4 ${
                index === selectedIndex ? 'bg-blue-50 border-blue-500' : 'border-transparent'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-900 mb-1">{suggestion.name}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">🏢 {suggestion.network.name}</span>
                    {suggestion.category && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="flex items-center gap-1">📂 {suggestion.category}</span>
                      </>
                    )}
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}

          {suggestions.length >= 5 && (
            <div className="px-4 py-3 bg-gray-50 border-t">
              <button
                onClick={onClose}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                See all results for &quot;{query}&quot; →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-500">
        <div className="flex items-center justify-between">
          <span>Use ↑↓ to navigate</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}
