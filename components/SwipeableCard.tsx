'use client';

import { useState, useRef, useCallback } from 'react';

interface SwipeAction {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}

interface SwipeableCardProps {
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  className?: string;
  disabled?: boolean;
}

export function SwipeableCard({
  children,
  leftActions = [],
  rightActions = [],
  onSwipeLeft,
  onSwipeRight,
  threshold = 80,
  className = '',
  disabled = false,
}: SwipeableCardProps) {
  const [offsetX, setOffsetX] = useState(0);
  const [isRevealed, setIsRevealed] = useState<'left' | 'right' | null>(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);
  const isHorizontalSwipe = useRef<boolean | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const maxSwipe = Math.max(leftActions.length * 80, rightActions.length * 80, 120);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled) return;
      startX.current = e.touches[0].clientX;
      startY.current = e.touches[0].clientY;
      currentX.current = startX.current;
      isDragging.current = true;
      isHorizontalSwipe.current = null;
    },
    [disabled]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || !isDragging.current) return;

      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      const diffX = touchX - startX.current;
      const diffY = touchY - startY.current;

      // Determine swipe direction on first significant movement
      if (isHorizontalSwipe.current === null) {
        if (Math.abs(diffX) > 10 || Math.abs(diffY) > 10) {
          isHorizontalSwipe.current = Math.abs(diffX) > Math.abs(diffY);
        }
      }

      // Only handle horizontal swipes
      if (!isHorizontalSwipe.current) {
        return;
      }

      currentX.current = touchX;
      let diff = diffX;

      // Prevent swiping in wrong direction if no actions
      if (diff > 0 && leftActions.length === 0 && !onSwipeRight) {
        diff = diff * 0.2; // Add resistance
      }
      if (diff < 0 && rightActions.length === 0 && !onSwipeLeft) {
        diff = diff * 0.2; // Add resistance
      }

      // Limit the swipe distance
      diff = Math.max(-maxSwipe, Math.min(maxSwipe, diff));

      setOffsetX(diff);
    },
    [disabled, maxSwipe, leftActions.length, rightActions.length, onSwipeLeft, onSwipeRight]
  );

  const handleTouchEnd = useCallback(() => {
    if (disabled || !isDragging.current) return;
    isDragging.current = false;

    const diff = currentX.current - startX.current;

    if (diff < -threshold) {
      // Swiped left
      if (onSwipeLeft) {
        onSwipeLeft();
        setOffsetX(0);
        setIsRevealed(null);
      } else if (rightActions.length > 0) {
        setOffsetX(-rightActions.length * 80);
        setIsRevealed('left');
      } else {
        setOffsetX(0);
      }
    } else if (diff > threshold) {
      // Swiped right
      if (onSwipeRight) {
        onSwipeRight();
        setOffsetX(0);
        setIsRevealed(null);
      } else if (leftActions.length > 0) {
        setOffsetX(leftActions.length * 80);
        setIsRevealed('right');
      } else {
        setOffsetX(0);
      }
    } else {
      // Reset position
      setOffsetX(0);
      setIsRevealed(null);
    }

    isHorizontalSwipe.current = null;
  }, [disabled, threshold, onSwipeLeft, onSwipeRight, leftActions.length, rightActions.length]);

  const reset = useCallback(() => {
    setOffsetX(0);
    setIsRevealed(null);
  }, []);

  const handleActionClick = (action: SwipeAction) => {
    action.onClick();
    reset();
  };

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Left actions (revealed when swiping right) */}
      {leftActions.length > 0 && (
        <div className="absolute left-0 top-0 bottom-0 flex items-stretch">
          {leftActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleActionClick(action)}
              className={`w-20 flex flex-col items-center justify-center ${action.color} text-white transition-opacity ${
                isRevealed === 'right' ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                transform: `translateX(${Math.min(0, offsetX - leftActions.length * 80 + index * 80)}px)`,
              }}
            >
              <span className="text-2xl mb-1">{action.icon}</span>
              <span className="text-xs font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Right actions (revealed when swiping left) */}
      {rightActions.length > 0 && (
        <div className="absolute right-0 top-0 bottom-0 flex items-stretch">
          {rightActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleActionClick(action)}
              className={`w-20 flex flex-col items-center justify-center ${action.color} text-white transition-opacity ${
                isRevealed === 'left' ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                transform: `translateX(${Math.max(0, offsetX + rightActions.length * 80 - index * 80)}px)`,
              }}
            >
              <span className="text-2xl mb-1">{action.icon}</span>
              <span className="text-xs font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main content */}
      <div
        className="relative bg-white dark:bg-gray-800 touch-pan-y"
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: isDragging.current ? 'none' : 'transform 0.3s ease-out',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={isRevealed ? reset : undefined}
      >
        {children}
      </div>
    </div>
  );
}
