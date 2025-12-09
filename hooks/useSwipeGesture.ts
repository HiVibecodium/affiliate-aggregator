'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export type SwipeDirection = 'left' | 'right' | 'up' | 'down' | null;

interface SwipeState {
  direction: SwipeDirection;
  distance: number;
  velocity: number;
  isActive: boolean;
}

interface SwipeConfig {
  threshold?: number;
  velocityThreshold?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  preventScroll?: boolean;
  disabled?: boolean;
}

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

export function useSwipeGesture(config: SwipeConfig = {}) {
  const {
    threshold = 50,
    velocityThreshold = 0.5,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    preventScroll = false,
    disabled = false,
  } = config;

  const [swipeState, setSwipeState] = useState<SwipeState>({
    direction: null,
    distance: 0,
    velocity: 0,
    isActive: false,
  });

  const startPoint = useRef<TouchPoint | null>(null);
  const currentPoint = useRef<TouchPoint | null>(null);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (disabled) return;

      const touch = e.touches[0];
      startPoint.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
      currentPoint.current = startPoint.current;

      setSwipeState({
        direction: null,
        distance: 0,
        velocity: 0,
        isActive: true,
      });
    },
    [disabled]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (disabled || !startPoint.current) return;

      const touch = e.touches[0];
      currentPoint.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };

      const deltaX = currentPoint.current.x - startPoint.current.x;
      const deltaY = currentPoint.current.y - startPoint.current.y;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      let direction: SwipeDirection = null;
      let distance = 0;

      if (absX > absY) {
        direction = deltaX > 0 ? 'right' : 'left';
        distance = absX;
        if (preventScroll && absX > 10) {
          e.preventDefault();
        }
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
        distance = absY;
      }

      const timeDiff = (currentPoint.current.time - startPoint.current.time) / 1000;
      const velocity = timeDiff > 0 ? distance / timeDiff : 0;

      setSwipeState({
        direction,
        distance,
        velocity,
        isActive: true,
      });
    },
    [disabled, preventScroll]
  );

  const handleTouchEnd = useCallback(() => {
    if (disabled || !startPoint.current || !currentPoint.current) {
      setSwipeState((prev) => ({ ...prev, isActive: false }));
      return;
    }

    const deltaX = currentPoint.current.x - startPoint.current.x;
    const deltaY = currentPoint.current.y - startPoint.current.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    const timeDiff = (currentPoint.current.time - startPoint.current.time) / 1000;

    const isHorizontal = absX > absY;
    const distance = isHorizontal ? absX : absY;
    const velocity = timeDiff > 0 ? distance / timeDiff : 0;

    const meetsThreshold = distance >= threshold || velocity >= velocityThreshold * 1000;

    if (meetsThreshold) {
      if (isHorizontal) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      } else {
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp();
        }
      }
    }

    startPoint.current = null;
    currentPoint.current = null;

    setSwipeState({
      direction: null,
      distance: 0,
      velocity: 0,
      isActive: false,
    });
  }, [disabled, threshold, velocityThreshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  const handlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };

  return {
    ...swipeState,
    handlers,
  };
}

/**
 * Hook for swipeable card with reveal actions
 */
export function useSwipeableCard(config: {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftThreshold?: number;
  rightThreshold?: number;
  maxSwipe?: number;
  disabled?: boolean;
}) {
  const {
    onSwipeLeft,
    onSwipeRight,
    leftThreshold = 80,
    rightThreshold = 80,
    maxSwipe = 120,
    disabled = false,
  } = config;

  const [offsetX, setOffsetX] = useState(0);
  const [isRevealed, setIsRevealed] = useState<'left' | 'right' | null>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled) return;
      startX.current = e.touches[0].clientX;
      currentX.current = startX.current;
      isDragging.current = true;
    },
    [disabled]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || !isDragging.current) return;

      currentX.current = e.touches[0].clientX;
      let diff = currentX.current - startX.current;

      // Limit the swipe distance
      diff = Math.max(-maxSwipe, Math.min(maxSwipe, diff));

      // Add resistance at the edges
      if (Math.abs(diff) > maxSwipe * 0.8) {
        const resistance = 0.3;
        const excess = Math.abs(diff) - maxSwipe * 0.8;
        diff = Math.sign(diff) * (maxSwipe * 0.8 + excess * resistance);
      }

      setOffsetX(diff);
    },
    [disabled, maxSwipe]
  );

  const handleTouchEnd = useCallback(() => {
    if (disabled) return;
    isDragging.current = false;

    const diff = currentX.current - startX.current;

    if (diff < -leftThreshold) {
      // Swiped left - reveal right actions or trigger callback
      if (onSwipeLeft) {
        onSwipeLeft();
        setOffsetX(0);
      } else {
        setOffsetX(-maxSwipe);
        setIsRevealed('left');
      }
    } else if (diff > rightThreshold) {
      // Swiped right - reveal left actions or trigger callback
      if (onSwipeRight) {
        onSwipeRight();
        setOffsetX(0);
      } else {
        setOffsetX(maxSwipe);
        setIsRevealed('right');
      }
    } else {
      // Reset position
      setOffsetX(0);
      setIsRevealed(null);
    }
  }, [disabled, leftThreshold, rightThreshold, maxSwipe, onSwipeLeft, onSwipeRight]);

  const reset = useCallback(() => {
    setOffsetX(0);
    setIsRevealed(null);
  }, []);

  return {
    offsetX,
    isRevealed,
    reset,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    style: {
      transform: `translateX(${offsetX}px)`,
      transition: isDragging.current ? 'none' : 'transform 0.3s ease-out',
    },
  };
}
