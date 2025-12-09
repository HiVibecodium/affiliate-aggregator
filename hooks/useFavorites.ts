'use client';

import { useState, useEffect, useCallback } from 'react';

interface FavoriteItem {
  programId: string;
  addedAt: string;
}

const STORAGE_KEY = 'affiliate-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: FavoriteItem[] = JSON.parse(stored);
        setFavorites(parsed.map((f) => f.programId));
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
    setInitialized(true);
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (!initialized) return;

    const items: FavoriteItem[] = favorites.map((id) => ({
      programId: id,
      addedAt: new Date().toISOString(),
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [favorites, initialized]);

  const isFavorite = useCallback(
    (programId: string) => {
      return favorites.includes(programId);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(async (programId: string) => {
    setLoading(true);
    try {
      setFavorites((prev) => {
        if (prev.includes(programId)) {
          return prev.filter((id) => id !== programId);
        }
        return [...prev, programId];
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const addFavorite = useCallback((programId: string) => {
    setFavorites((prev) => {
      if (prev.includes(programId)) return prev;
      return [...prev, programId];
    });
  }, []);

  const removeFavorite = useCallback((programId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== programId));
  }, []);

  return {
    favorites,
    favoriteCount: favorites.length,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    loading,
    initialized,
  };
}
