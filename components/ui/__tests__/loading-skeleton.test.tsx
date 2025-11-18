import React from 'react';
import { render } from '@testing-library/react';
import {
  Skeleton,
  CardSkeleton,
  TableSkeleton,
  ProgramCardSkeleton,
  DashboardSkeleton,
} from '../loading-skeleton';

describe('Skeleton Components', () => {
  describe('Skeleton', () => {
    it('should render with default props', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.querySelector('.bg-gray-200');
      expect(skeleton).toBeInTheDocument();
    });

    it('should render with text variant', () => {
      const { container } = render(<Skeleton variant="text" />);
      const skeleton = container.querySelector('.rounded');
      expect(skeleton).toBeInTheDocument();
    });

    it('should render with circular variant', () => {
      const { container } = render(<Skeleton variant="circular" />);
      const skeleton = container.querySelector('.rounded-full');
      expect(skeleton).toBeInTheDocument();
    });

    it('should render with custom width and height', () => {
      const { container } = render(<Skeleton width="200px" height="100px" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.style.width).toBe('200px');
      expect(skeleton.style.height).toBe('100px');
    });

    it('should apply pulse animation by default', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.querySelector('.animate-pulse');
      expect(skeleton).toBeInTheDocument();
    });

    it('should apply wave animation when specified', () => {
      const { container } = render(<Skeleton animation="wave" />);
      const skeleton = container.querySelector('.animate-shimmer');
      expect(skeleton).toBeInTheDocument();
    });

    it('should not apply animation when set to none', () => {
      const { container } = render(<Skeleton animation="none" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).not.toContain('animate');
    });
  });

  describe('CardSkeleton', () => {
    it('should render card skeleton structure', () => {
      const { container } = render(<CardSkeleton />);
      const skeletons = container.querySelectorAll('.bg-gray-200');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('TableSkeleton', () => {
    it('should render default number of rows', () => {
      const { container } = render(<TableSkeleton />);
      const skeletons = container.querySelectorAll('.bg-gray-200');
      expect(skeletons.length).toBe(6); // 1 header + 5 rows
    });

    it('should render custom number of rows', () => {
      const { container } = render(<TableSkeleton rows={3} />);
      const skeletons = container.querySelectorAll('.bg-gray-200');
      expect(skeletons.length).toBe(4); // 1 header + 3 rows
    });
  });

  describe('ProgramCardSkeleton', () => {
    it('should render program card skeleton', () => {
      const { container } = render(<ProgramCardSkeleton />);
      expect(container.querySelector('.bg-white')).toBeInTheDocument();
    });
  });

  describe('DashboardSkeleton', () => {
    it('should render dashboard skeleton with stats cards', () => {
      const { container } = render(<DashboardSkeleton />);
      const cards = container.querySelectorAll('.bg-white');
      expect(cards.length).toBeGreaterThan(0);
    });
  });
});
