/**
 * Skeleton Components Tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '@/components/skeletons/LoadingSpinner';
import {
  ProgramCardSkeleton,
  ProgramCardSkeletonList,
} from '@/components/skeletons/ProgramCardSkeleton';

describe('Skeleton Components', () => {
  describe('LoadingSpinner', () => {
    it('renders without text', () => {
      const { container } = render(<LoadingSpinner />);

      expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('renders with text', () => {
      render(<LoadingSpinner text="Loading..." />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders small size', () => {
      const { container } = render(<LoadingSpinner size="sm" />);

      expect(container.querySelector('.w-4')).toBeInTheDocument();
      expect(container.querySelector('.h-4')).toBeInTheDocument();
    });

    it('renders medium size by default', () => {
      const { container } = render(<LoadingSpinner />);

      expect(container.querySelector('.w-8')).toBeInTheDocument();
      expect(container.querySelector('.h-8')).toBeInTheDocument();
    });

    it('renders large size', () => {
      const { container } = render(<LoadingSpinner size="lg" />);

      expect(container.querySelector('.w-12')).toBeInTheDocument();
      expect(container.querySelector('.h-12')).toBeInTheDocument();
    });

    it('has animation class', () => {
      const { container } = render(<LoadingSpinner />);

      expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('has centered layout', () => {
      const { container } = render(<LoadingSpinner />);

      expect(container.querySelector('.items-center')).toBeInTheDocument();
      expect(container.querySelector('.justify-center')).toBeInTheDocument();
    });
  });

  describe('ProgramCardSkeleton', () => {
    it('renders skeleton card', () => {
      const { container } = render(<ProgramCardSkeleton />);

      expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('has skeleton placeholders', () => {
      const { container } = render(<ProgramCardSkeleton />);

      // Should have multiple gray placeholder divs
      const grayDivs = container.querySelectorAll('.bg-gray-200');
      expect(grayDivs.length).toBeGreaterThan(5);
    });

    it('has card styling', () => {
      const { container } = render(<ProgramCardSkeleton />);

      expect(container.querySelector('.bg-white')).toBeInTheDocument();
      expect(container.querySelector('.rounded-lg')).toBeInTheDocument();
      expect(container.querySelector('.border')).toBeInTheDocument();
    });

    it('has grid for stats', () => {
      const { container } = render(<ProgramCardSkeleton />);

      expect(container.querySelector('.grid')).toBeInTheDocument();
      expect(container.querySelector('.grid-cols-2')).toBeInTheDocument();
    });
  });

  describe('ProgramCardSkeletonList', () => {
    it('renders default 3 skeletons', () => {
      const { container } = render(<ProgramCardSkeletonList />);

      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBe(3);
    });

    it('renders specified number of skeletons', () => {
      const { container } = render(<ProgramCardSkeletonList count={5} />);

      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBe(5);
    });

    it('renders 1 skeleton when count is 1', () => {
      const { container } = render(<ProgramCardSkeletonList count={1} />);

      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBe(1);
    });

    it('renders 10 skeletons when count is 10', () => {
      const { container } = render(<ProgramCardSkeletonList count={10} />);

      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBe(10);
    });

    it('has grid layout', () => {
      const { container } = render(<ProgramCardSkeletonList />);

      expect(container.querySelector('.grid')).toBeInTheDocument();
      expect(container.querySelector('.gap-6')).toBeInTheDocument();
    });

    it('renders 0 skeletons when count is 0', () => {
      const { container } = render(<ProgramCardSkeletonList count={0} />);

      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBe(0);
    });
  });
});
