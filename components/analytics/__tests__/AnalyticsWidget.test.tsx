/**
 * Tests for AnalyticsWidget components
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { AnalyticsWidget, ChartWidget, MetricCard } from '../AnalyticsWidget';

describe('AnalyticsWidget', () => {
  it('should render title and value', () => {
    render(<AnalyticsWidget title="Total Users" value={1234} />);

    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('1234')).toBeInTheDocument();
  });

  it('should display change percentage', () => {
    render(<AnalyticsWidget title="Revenue" value="$1,234" change={15.5} />);

    expect(screen.getByText(/15.5%/)).toBeInTheDocument();
  });

  it('should show trend indicator', () => {
    const { container } = render(
      <AnalyticsWidget title="Clicks" value={100} change={10} trend="up" />
    );

    expect(container.querySelector('.text-green-600')).toBeInTheDocument();
  });

  it('should render loading state', () => {
    render(<AnalyticsWidget title="Loading" value="..." loading={true} />);

    const skeletons = document.querySelectorAll('.bg-gray-200');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render icon when provided', () => {
    const icon = <span data-testid="test-icon">📊</span>;
    render(<AnalyticsWidget title="Stats" value={100} icon={icon} />);

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('should render footer content', () => {
    const footer = <div>Footer content</div>;
    render(<AnalyticsWidget title="Test" value={100} footer={footer} />);

    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('should show change label', () => {
    render(<AnalyticsWidget title="Test" value={100} change={5} changeLabel="vs yesterday" />);

    expect(screen.getByText(/vs yesterday/)).toBeInTheDocument();
  });

  it('should handle down trend', () => {
    const { container } = render(
      <AnalyticsWidget title="Test" value={100} change={-5} trend="down" />
    );

    expect(container.querySelector('.text-red-600')).toBeInTheDocument();
  });
});

describe('ChartWidget', () => {
  it('should render title and children', () => {
    render(
      <ChartWidget title="Revenue Chart">
        <div>Chart content</div>
      </ChartWidget>
    );

    expect(screen.getByText('Revenue Chart')).toBeInTheDocument();
    expect(screen.getByText('Chart content')).toBeInTheDocument();
  });

  it('should render loading state', () => {
    render(
      <ChartWidget title="Loading Chart" loading={true}>
        <div>Chart</div>
      </ChartWidget>
    );

    const skeletons = document.querySelectorAll('.bg-gray-200');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render actions', () => {
    const actions = <button>Export</button>;
    render(
      <ChartWidget title="Chart" actions={actions}>
        <div>Content</div>
      </ChartWidget>
    );

    expect(screen.getByText('Export')).toBeInTheDocument();
  });
});

describe('MetricCard', () => {
  it('should render label and value', () => {
    render(<MetricCard label="Active Users" value={42} />);

    expect(screen.getByText('Active Users')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('should render subValue', () => {
    render(<MetricCard label="Test" value={100} subValue="+10% increase" />);

    expect(screen.getByText('+10% increase')).toBeInTheDocument();
  });

  it('should apply color theme', () => {
    const { container } = render(<MetricCard label="Test" value={100} color="green" />);

    expect(container.querySelector('.bg-green-50')).toBeInTheDocument();
  });

  it('should handle different color themes', () => {
    const colors: Array<'blue' | 'green' | 'yellow' | 'red' | 'purple'> = [
      'blue',
      'green',
      'yellow',
      'red',
      'purple',
    ];

    colors.forEach((color) => {
      const { container } = render(<MetricCard label="Test" value={100} color={color} />);

      expect(container.querySelector(`[class*="bg-${color}"]`)).toBeInTheDocument();
    });
  });

  it('should handle string values', () => {
    render(<MetricCard label="Status" value="Active" />);

    expect(screen.getByText('Active')).toBeInTheDocument();
  });
});
