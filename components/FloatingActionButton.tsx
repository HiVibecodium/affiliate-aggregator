'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

interface FABAction {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  color?: string;
}

interface FloatingActionButtonProps {
  actions: FABAction[];
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  className?: string;
}

export function FloatingActionButton({
  actions,
  position = 'bottom-right',
  className = '',
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleActionClick = useCallback((action: FABAction) => {
    if (action.onClick) {
      action.onClick();
    }
    setIsOpen(false);
  }, []);

  const positionClasses = {
    'bottom-right': 'right-4 bottom-20 md:bottom-4',
    'bottom-left': 'left-4 bottom-20 md:bottom-4',
    'bottom-center': 'left-1/2 -translate-x-1/2 bottom-20 md:bottom-4',
  };

  return (
    <div className={`fixed z-40 ${positionClasses[position]} ${className}`}>
      {/* Actions menu */}
      <div
        className={`absolute bottom-16 right-0 flex flex-col-reverse gap-2 transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {actions.map((action, index) => {
          const content = (
            <>
              {/* Label */}
              <span className="absolute right-full mr-3 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-sm font-medium rounded-lg whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                {action.label}
              </span>
              {/* Icon button */}
              <span
                className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white transition-transform hover:scale-110 ${
                  action.color || 'bg-blue-500'
                }`}
              >
                {action.icon}
              </span>
            </>
          );

          if (action.href) {
            return (
              <Link
                key={index}
                href={action.href}
                className="group relative flex items-center justify-end"
                style={{
                  transitionDelay: `${index * 50}ms`,
                }}
                onClick={() => setIsOpen(false)}
              >
                {content}
              </Link>
            );
          }

          return (
            <button
              key={index}
              className="group relative flex items-center justify-end"
              style={{
                transitionDelay: `${index * 50}ms`,
              }}
              onClick={() => handleActionClick(action)}
            >
              {content}
            </button>
          );
        })}
      </div>

      {/* Main FAB button */}
      <button
        onClick={toggleMenu}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-300 ${
          isOpen
            ? 'bg-gray-700 dark:bg-gray-600 rotate-45'
            : 'bg-blue-600 hover:bg-blue-700 animate-fab-pulse'
        }`}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        <svg
          className="w-6 h-6 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/40 -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

/**
 * Simple single-action FAB
 */
export function SimpleFAB({
  icon,
  label,
  href,
  onClick,
  color = 'bg-blue-600 hover:bg-blue-700',
  position = 'bottom-right',
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  color?: string;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
}) {
  const positionClasses = {
    'bottom-right': 'right-4 bottom-20 md:bottom-4',
    'bottom-left': 'left-4 bottom-20 md:bottom-4',
    'bottom-center': 'left-1/2 -translate-x-1/2 bottom-20 md:bottom-4',
  };

  const className = `fixed z-40 ${positionClasses[position]} w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all ${color} touch-target haptic-feedback`;

  if (href) {
    return (
      <Link href={href} className={className} aria-label={label} title={label}>
        {icon}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className} aria-label={label} title={label}>
      {icon}
    </button>
  );
}

/**
 * Scroll-to-top FAB that appears when scrolled down
 */
export function ScrollToTopFAB() {
  const [isVisible, setIsVisible] = useState(false);

  // Check scroll position
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setIsVisible(window.scrollY > 300);
    });
  }

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed right-4 bottom-36 md:bottom-20 z-40 w-12 h-12 rounded-full shadow-lg flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white transition-all touch-target haptic-feedback animate-fade-in"
      aria-label="Scroll to top"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
}
