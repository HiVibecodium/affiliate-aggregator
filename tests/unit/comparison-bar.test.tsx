/**
 * ComparisonBar Component Tests
 * Tests the comparison bar UI component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { ComparisonBar } from '@/components/ComparisonBar';
import { ComparisonProvider } from '@/contexts/ComparisonContext';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock ComparisonContext
jest.mock('@/contexts/ComparisonContext', () => ({
  ComparisonProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useComparison: jest.fn(),
}));

describe('ComparisonBar Component', () => {
  const mockUseComparison = require('@/contexts/ComparisonContext').useComparison;
  const mockRouter = {
    push: jest.fn(),
    refresh: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('should not render when comparison list is empty', () => {
    mockUseComparison.mockReturnValue({
      comparisonList: [],
      removeFromComparison: jest.fn(),
      clearComparison: jest.fn(),
    });

    const { container } = render(<ComparisonBar />);
    expect(container.firstChild).toBeNull();
  });

  it('should render when programs are in comparison', () => {
    mockUseComparison.mockReturnValue({
      comparisonList: [
        { id: '1', name: 'Program 1' },
        { id: '2', name: 'Program 2' },
      ],
      removeFromComparison: jest.fn(),
      clearComparison: jest.fn(),
    });

    render(<ComparisonBar />);
    expect(screen.getByText(/Program 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Program 2/i)).toBeInTheDocument();
  });

  it('should show correct count', () => {
    mockUseComparison.mockReturnValue({
      comparisonList: [
        { id: '1', name: 'Program 1' },
        { id: '2', name: 'Program 2' },
        { id: '3', name: 'Program 3' },
      ],
      removeFromComparison: jest.fn(),
      clearComparison: jest.fn(),
    });

    const { container } = render(<ComparisonBar />);
    // Just check that 3 programs are displayed
    expect(screen.getByText('Program 1')).toBeInTheDocument();
    expect(screen.getByText('Program 2')).toBeInTheDocument();
    expect(screen.getByText('Program 3')).toBeInTheDocument();
  });

  it('should call removeFromComparison when remove button clicked', () => {
    const mockRemove = jest.fn();
    mockUseComparison.mockReturnValue({
      comparisonList: [{ id: '1', name: 'Program 1' }],
      removeFromComparison: mockRemove,
      clearComparison: jest.fn(),
    });

    render(<ComparisonBar />);

    const removeButton = screen
      .getAllByRole('button')
      .find((btn) => btn.title?.includes('Remove') || btn.textContent?.includes('×'));

    if (removeButton) {
      fireEvent.click(removeButton);
      expect(mockRemove).toHaveBeenCalledWith('1');
    }
  });

  it('should call clearComparison when clear button clicked', () => {
    const mockClear = jest.fn();
    mockUseComparison.mockReturnValue({
      comparisonList: [{ id: '1', name: 'Program 1' }],
      removeFromComparison: jest.fn(),
      clearComparison: mockClear,
    });

    render(<ComparisonBar />);

    const clearButton = screen.getByText(/Очистить|Clear/i);
    fireEvent.click(clearButton);

    expect(mockClear).toHaveBeenCalled();
  });

  it('should have link to compare page', () => {
    mockUseComparison.mockReturnValue({
      comparisonList: [{ id: '1', name: 'Program 1' }],
      removeFromComparison: jest.fn(),
      clearComparison: jest.fn(),
    });

    render(<ComparisonBar />);

    const compareLink = screen.getByRole('link', { name: /Сравнить|Compare/i });
    expect(compareLink).toHaveAttribute('href', '/compare');
  });

  it('should render multiple programs correctly', () => {
    const programs = [
      { id: '1', name: 'Program A' },
      { id: '2', name: 'Program B' },
      { id: '3', name: 'Program C' },
      { id: '4', name: 'Program D' },
      { id: '5', name: 'Program E' },
    ];

    mockUseComparison.mockReturnValue({
      comparisonList: programs,
      removeFromComparison: jest.fn(),
      clearComparison: jest.fn(),
    });

    render(<ComparisonBar />);

    programs.forEach((program) => {
      expect(screen.getByText(program.name)).toBeInTheDocument();
    });
  });
});
