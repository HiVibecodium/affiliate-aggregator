/**
 * Home Page Header with Theme Toggle
 * Client component for interactive elements
 */

'use client';

import { ThemeToggle } from './ThemeToggle';

export function HomeHeader() {
  return (
    <div className="absolute top-4 right-4">
      <ThemeToggle />
    </div>
  );
}
