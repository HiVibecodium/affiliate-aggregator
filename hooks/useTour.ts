/**
 * useTour Hook
 *
 * Manage welcome tour state and triggers
 */

'use client';

import { useEffect, useState } from 'react';
import Shepherd from 'shepherd.js';
import type { Tour } from 'shepherd.js';
import { tourSteps, tourOptions } from '@/lib/tour/tour-steps';

const TOUR_COMPLETED_KEY = 'affiliate-aggregator-tour-completed';

export function useTour() {
  const [tour, setTour] = useState<Tour | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Check if tour was completed
    const completed = localStorage.getItem(TOUR_COMPLETED_KEY) === 'true';
    setIsCompleted(completed);

    // Initialize tour
    const tourInstance = new Shepherd.Tour(tourOptions);

    // Add steps
    tourSteps.forEach((step) => {
      tourInstance.addStep(step);
    });

    // On complete - save to localStorage
    tourInstance.on('complete', () => {
      localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
      setIsCompleted(true);
    });

    // On cancel - save to localStorage
    tourInstance.on('cancel', () => {
      localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
      setIsCompleted(true);
    });

    setTour(tourInstance);

    // Cleanup
    return () => {
      if (tourInstance.isActive()) {
        tourInstance.complete();
      }
    };
  }, []);

  const startTour = () => {
    if (tour) {
      tour.start();
    }
  };

  const resetTour = () => {
    localStorage.removeItem(TOUR_COMPLETED_KEY);
    setIsCompleted(false);
  };

  const shouldShowTour = () => {
    // Show tour if:
    // 1. Not completed yet
    // 2. First visit to /programs page
    return !isCompleted;
  };

  return {
    tour,
    startTour,
    resetTour,
    isCompleted,
    shouldShowTour,
  };
}
