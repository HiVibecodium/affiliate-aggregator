'use client';

import { useCallback } from 'react';
import { useComparison } from '@/contexts/ComparisonContext';

interface CompareItem {
  id: string;
  name: string;
}

export function useCompare() {
  const { comparisonList, addToComparison, removeFromComparison, clearComparison, isInComparison } =
    useComparison();

  const isInCompare = useCallback(
    (programId: string) => {
      return isInComparison(programId);
    },
    [isInComparison]
  );

  const toggleCompare = useCallback(
    (item: CompareItem) => {
      if (isInComparison(item.id)) {
        removeFromComparison(item.id);
      } else {
        // Add minimal data for comparison
        addToComparison({
          id: item.id,
          name: item.name,
          description: '',
          category: '',
          commissionRate: 0,
          commissionType: '',
          cookieDuration: 0,
          paymentThreshold: 0,
          paymentMethods: [],
          network: { name: '', website: '' },
        });
      }
    },
    [isInComparison, addToComparison, removeFromComparison]
  );

  const addToCompare = useCallback(
    (item: CompareItem) => {
      if (!isInComparison(item.id)) {
        addToComparison({
          id: item.id,
          name: item.name,
          description: '',
          category: '',
          commissionRate: 0,
          commissionType: '',
          cookieDuration: 0,
          paymentThreshold: 0,
          paymentMethods: [],
          network: { name: '', website: '' },
        });
      }
    },
    [isInComparison, addToComparison]
  );

  const removeFromCompare = useCallback(
    (programId: string) => {
      removeFromComparison(programId);
    },
    [removeFromComparison]
  );

  return {
    compareList: comparisonList,
    compareCount: comparisonList.length,
    isInCompare,
    toggleCompare,
    addToCompare,
    removeFromCompare,
    clearCompare: clearComparison,
  };
}
