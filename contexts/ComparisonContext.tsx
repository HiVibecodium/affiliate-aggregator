'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Program {
  id: string;
  name: string;
  description: string;
  category: string;
  commissionRate: number;
  commissionType: string;
  cookieDuration: number;
  paymentThreshold: number;
  paymentMethods: string[];
  network: {
    name: string;
    website: string;
  };
}

interface ComparisonContextType {
  comparisonList: Program[];
  addToComparison: (program: Program) => void;
  removeFromComparison: (programId: string) => void;
  clearComparison: () => void;
  isInComparison: (programId: string) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const MAX_COMPARISON_ITEMS = 5;
const STORAGE_KEY = 'affiliate-comparison';

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [comparisonList, setComparisonList] = useState<Program[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setComparisonList(parsed);
      } catch (error) {
        console.error('Failed to parse comparison list:', error);
      }
    }
  }, []);

  // Save to localStorage whenever list changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comparisonList));
  }, [comparisonList]);

  const addToComparison = (program: Program) => {
    setComparisonList(prev => {
      // Check if already in list
      if (prev.some(p => p.id === program.id)) {
        return prev;
      }

      // Check max limit
      if (prev.length >= MAX_COMPARISON_ITEMS) {
        alert(`Вы можете сравнить максимум ${MAX_COMPARISON_ITEMS} программ`);
        return prev;
      }

      return [...prev, program];
    });
  };

  const removeFromComparison = (programId: string) => {
    setComparisonList(prev => prev.filter(p => p.id !== programId));
  };

  const clearComparison = () => {
    setComparisonList([]);
  };

  const isInComparison = (programId: string) => {
    return comparisonList.some(p => p.id === programId);
  };

  return (
    <ComparisonContext.Provider
      value={{
        comparisonList,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}
