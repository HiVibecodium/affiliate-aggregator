/**
 * EmptyState Component Tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  EmptyState,
  NoResultsEmptyState,
  NoFavoritesEmptyState,
  NoComparisonEmptyState,
  ErrorEmptyState,
  NoApplicationsEmptyState,
  ComingSoonEmptyState,
} from '@/components/EmptyState';

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

describe('EmptyState Component', () => {
  describe('Base EmptyState', () => {
    it('renders title correctly', () => {
      render(<EmptyState title="Test Title" />);

      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('renders description when provided', () => {
      render(<EmptyState title="Title" description="Test description" />);

      expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('does not render description when not provided', () => {
      render(<EmptyState title="Title" />);

      expect(screen.queryByText('Test description')).not.toBeInTheDocument();
    });

    it('renders icon when provided', () => {
      render(<EmptyState title="Title" icon={<div data-testid="test-icon">Icon</div>} />);

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('renders action button with href', () => {
      render(<EmptyState title="Title" action={{ label: 'Click me', href: '/test' }} />);

      const link = screen.getByRole('link', { name: 'Click me' });
      expect(link).toHaveAttribute('href', '/test');
    });

    it('renders action button with onClick', () => {
      const handleClick = jest.fn();
      render(<EmptyState title="Title" action={{ label: 'Click me', onClick: handleClick }} />);

      const button = screen.getByRole('button', { name: 'Click me' });
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalled();
    });

    it('renders secondary action with href', () => {
      render(
        <EmptyState title="Title" secondaryAction={{ label: 'Secondary', href: '/secondary' }} />
      );

      const link = screen.getByRole('link', { name: 'Secondary' });
      expect(link).toHaveAttribute('href', '/secondary');
    });

    it('renders secondary action with onClick', () => {
      const handleClick = jest.fn();
      render(
        <EmptyState title="Title" secondaryAction={{ label: 'Secondary', onClick: handleClick }} />
      );

      const button = screen.getByRole('button', { name: 'Secondary' });
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalled();
    });

    it('renders both primary and secondary actions', () => {
      render(
        <EmptyState
          title="Title"
          action={{ label: 'Primary', href: '/primary' }}
          secondaryAction={{ label: 'Secondary', href: '/secondary' }}
        />
      );

      expect(screen.getByText('Primary')).toBeInTheDocument();
      expect(screen.getByText('Secondary')).toBeInTheDocument();
    });

    describe('Variants', () => {
      it('applies default variant styles', () => {
        const { container } = render(<EmptyState title="Title" variant="default" />);

        expect(container.firstChild).toHaveClass('py-16', 'px-8');
      });

      it('applies compact variant styles', () => {
        const { container } = render(<EmptyState title="Title" variant="compact" />);

        expect(container.firstChild).toHaveClass('py-8', 'px-6');
      });

      it('applies card variant styles', () => {
        const { container } = render(<EmptyState title="Title" variant="card" />);

        expect(container.firstChild).toHaveClass(
          'py-12',
          'px-8',
          'bg-white',
          'rounded-xl',
          'shadow-lg'
        );
      });
    });
  });

  describe('NoResultsEmptyState', () => {
    it('renders with correct title and description', () => {
      render(<NoResultsEmptyState />);

      expect(screen.getByText('Ничего не найдено')).toBeInTheDocument();
      expect(
        screen.getByText('Попробуйте изменить параметры поиска или сбросить фильтры')
      ).toBeInTheDocument();
    });

    it('renders reset button when onReset is provided', () => {
      const handleReset = jest.fn();
      render(<NoResultsEmptyState onReset={handleReset} />);

      const resetButton = screen.getByRole('button', { name: 'Сбросить фильтры' });
      fireEvent.click(resetButton);

      expect(handleReset).toHaveBeenCalled();
    });

    it('does not render reset button when onReset is not provided', () => {
      render(<NoResultsEmptyState />);

      expect(screen.queryByRole('button', { name: 'Сбросить фильтры' })).not.toBeInTheDocument();
    });

    it('renders search icon', () => {
      render(<NoResultsEmptyState />);

      const svg = document.querySelector('svg.w-16.h-16');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('NoFavoritesEmptyState', () => {
    it('renders with correct title and description', () => {
      render(<NoFavoritesEmptyState />);

      expect(screen.getByText('Нет избранных программ')).toBeInTheDocument();
      expect(
        screen.getByText('Добавляйте программы в избранное, чтобы быстро к ним возвращаться')
      ).toBeInTheDocument();
    });

    it('renders link to programs page', () => {
      render(<NoFavoritesEmptyState />);

      const link = screen.getByRole('link', { name: 'Смотреть программы' });
      expect(link).toHaveAttribute('href', '/programs');
    });

    it('renders heart icon', () => {
      render(<NoFavoritesEmptyState />);

      const svg = document.querySelector('svg.w-16.h-16');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('NoComparisonEmptyState', () => {
    it('renders with correct title and description', () => {
      render(<NoComparisonEmptyState />);

      expect(screen.getByText('Нет программ для сравнения')).toBeInTheDocument();
      expect(
        screen.getByText('Добавьте минимум 2 программы для сравнения характеристик')
      ).toBeInTheDocument();
    });

    it('renders link to programs page', () => {
      render(<NoComparisonEmptyState />);

      const link = screen.getByRole('link', { name: 'Добавить программы' });
      expect(link).toHaveAttribute('href', '/programs');
    });

    it('renders chart icon', () => {
      render(<NoComparisonEmptyState />);

      const svg = document.querySelector('svg.w-16.h-16');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('ErrorEmptyState', () => {
    it('renders with correct title and description', () => {
      render(<ErrorEmptyState />);

      expect(screen.getByText('Что-то пошло не так')).toBeInTheDocument();
      expect(
        screen.getByText('Произошла ошибка при загрузке данных. Попробуйте обновить страницу.')
      ).toBeInTheDocument();
    });

    it('renders retry button when onRetry is provided', () => {
      const handleRetry = jest.fn();
      render(<ErrorEmptyState onRetry={handleRetry} />);

      const retryButton = screen.getByRole('button', { name: 'Попробовать снова' });
      fireEvent.click(retryButton);

      expect(handleRetry).toHaveBeenCalled();
    });

    it('does not render retry button when onRetry is not provided', () => {
      render(<ErrorEmptyState />);

      expect(screen.queryByRole('button', { name: 'Попробовать снова' })).not.toBeInTheDocument();
    });

    it('renders link to home page', () => {
      render(<ErrorEmptyState />);

      const link = screen.getByRole('link', { name: 'На главную' });
      expect(link).toHaveAttribute('href', '/');
    });

    it('renders red warning icon', () => {
      render(<ErrorEmptyState />);

      const svg = document.querySelector('svg.w-16.h-16.text-red-400');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('NoApplicationsEmptyState', () => {
    it('renders with correct title and description', () => {
      render(<NoApplicationsEmptyState />);

      expect(screen.getByText('Нет заявок')).toBeInTheDocument();
      expect(
        screen.getByText('Вы ещё не подавали заявки на партнёрские программы')
      ).toBeInTheDocument();
    });

    it('renders link to programs page', () => {
      render(<NoApplicationsEmptyState />);

      const link = screen.getByRole('link', { name: 'Найти программу' });
      expect(link).toHaveAttribute('href', '/programs');
    });

    it('renders document icon', () => {
      render(<NoApplicationsEmptyState />);

      const svg = document.querySelector('svg.w-16.h-16');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('ComingSoonEmptyState', () => {
    it('renders with correct title and feature description', () => {
      render(<ComingSoonEmptyState feature="API Integration" />);

      expect(screen.getByText('Скоро будет!')).toBeInTheDocument();
      expect(
        screen.getByText('API Integration находится в разработке и скоро появится')
      ).toBeInTheDocument();
    });

    it('renders different feature descriptions', () => {
      const { rerender } = render(<ComingSoonEmptyState feature="Reports" />);
      expect(
        screen.getByText('Reports находится в разработке и скоро появится')
      ).toBeInTheDocument();

      rerender(<ComingSoonEmptyState feature="Notifications" />);
      expect(
        screen.getByText('Notifications находится в разработке и скоро появится')
      ).toBeInTheDocument();
    });

    it('renders link to blog', () => {
      render(<ComingSoonEmptyState feature="Feature X" />);

      const link = screen.getByRole('link', { name: 'Узнать больше' });
      expect(link).toHaveAttribute('href', '/blog');
    });

    it('renders flask/lab icon', () => {
      render(<ComingSoonEmptyState feature="Feature" />);

      const svg = document.querySelector('svg.w-16.h-16');
      expect(svg).toBeInTheDocument();
    });
  });
});
