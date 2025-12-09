'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
  disabled?: boolean;
}

export function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  disabled = false,
}: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (disabled || isRefreshing) return;

      const container = containerRef.current;
      if (!container) return;

      // Only enable pull-to-refresh when scrolled to top
      if (container.scrollTop > 0) return;

      startY.current = e.touches[0].clientY;
      currentY.current = startY.current;
      setIsPulling(true);
    },
    [disabled, isRefreshing]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isPulling || disabled || isRefreshing) return;

      const container = containerRef.current;
      if (!container) return;

      currentY.current = e.touches[0].clientY;
      const diff = currentY.current - startY.current;

      // Only allow pulling down
      if (diff < 0) {
        setPullDistance(0);
        return;
      }

      // Apply resistance to make pulling feel natural
      const resistance = 0.5;
      const distance = Math.min(diff * resistance, threshold * 1.5);

      // Prevent default scrolling when pulling
      if (distance > 0 && container.scrollTop === 0) {
        e.preventDefault();
      }

      setPullDistance(distance);
    },
    [isPulling, disabled, isRefreshing, threshold]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling || disabled) return;

    setIsPulling(false);

    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(threshold);

      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [isPulling, pullDistance, threshold, isRefreshing, onRefresh, disabled]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const progress = Math.min(pullDistance / threshold, 1);
  const rotation = progress * 180;

  return (
    <div ref={containerRef} className="relative overflow-auto h-full">
      {/* Pull indicator */}
      <div
        className="absolute left-0 right-0 flex justify-center items-center z-10 transition-transform duration-200 pointer-events-none"
        style={{
          transform: `translateY(${pullDistance - 60}px)`,
          opacity: progress,
        }}
      >
        <div
          className={`w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center ${
            isRefreshing ? 'animate-spin' : ''
          }`}
          style={{
            transform: isRefreshing ? undefined : `rotate(${rotation}deg)`,
          }}
        >
          {isRefreshing ? (
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          ) : (
            <svg
              className={`w-6 h-6 transition-colors ${
                progress >= 1 ? 'text-blue-600' : 'text-gray-400'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Content with transform */}
      <div
        style={{
          transform: pullDistance > 0 ? `translateY(${pullDistance}px)` : undefined,
          transition: isPulling ? 'none' : 'transform 0.2s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
}
