/**
 * Billing Components Tests
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PricingTable } from '@/components/billing/PricingTable';
import { UsageStats } from '@/components/billing/UsageStats';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock alert
const mockAlert = jest.fn();
global.alert = mockAlert;

describe('PricingTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
  });

  it('renders all four plans', () => {
    render(<PricingTable />);

    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('Business')).toBeInTheDocument();
    expect(screen.getByText('Enterprise')).toBeInTheDocument();
  });

  it('renders plan descriptions', () => {
    render(<PricingTable />);

    expect(screen.getByText('Perfect for getting started')).toBeInTheDocument();
    expect(screen.getByText('For serious affiliate marketers')).toBeInTheDocument();
    expect(screen.getByText('For teams and agencies')).toBeInTheDocument();
    expect(screen.getByText('Custom solutions for large organizations')).toBeInTheDocument();
  });

  it('renders pricing for monthly by default', () => {
    render(<PricingTable />);

    expect(screen.getByText('$0')).toBeInTheDocument();
    expect(screen.getByText('$12')).toBeInTheDocument();
    expect(screen.getByText('$49')).toBeInTheDocument();
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('switches to yearly pricing when clicked', () => {
    render(<PricingTable />);

    const yearlyButton = screen.getByText('Yearly', { exact: false });
    fireEvent.click(yearlyButton);

    // Should show yearly prices (per month equivalent)
    expect(screen.getByText('$8.25')).toBeInTheDocument();
    expect(screen.getByText('$33.25')).toBeInTheDocument();
  });

  it('shows savings text for yearly plans', () => {
    render(<PricingTable />);

    const yearlyButton = screen.getByText('Yearly', { exact: false });
    fireEvent.click(yearlyButton);

    expect(screen.getByText('30% off yearly')).toBeInTheDocument();
    expect(screen.getByText('32% off yearly')).toBeInTheDocument();
  });

  it('marks Pro as most popular', () => {
    render(<PricingTable />);

    expect(screen.getByText('MOST POPULAR')).toBeInTheDocument();
  });

  it('shows current plan badge', () => {
    render(<PricingTable currentTier="pro" />);

    expect(screen.getByText('CURRENT PLAN')).toBeInTheDocument();
  });

  it('disables button for current plan', () => {
    render(<PricingTable currentTier="pro" />);

    const currentPlanButtons = screen.getAllByText('Current Plan');
    expect(currentPlanButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('renders plan features', () => {
    render(<PricingTable />);

    // Free plan features
    expect(screen.getByText('5 favorites')).toBeInTheDocument();
    expect(screen.getByText('3 comparisons per day')).toBeInTheDocument();

    // Pro plan features
    expect(screen.getByText('Unlimited favorites')).toBeInTheDocument();
    expect(screen.getByText('Export to CSV/Excel')).toBeInTheDocument();

    // Business plan features
    expect(screen.getByText('API access (10,000 calls/month)')).toBeInTheDocument();
    expect(screen.getByText('Up to 5 team members')).toBeInTheDocument();

    // Enterprise features
    expect(screen.getByText('Unlimited API calls')).toBeInTheDocument();
    expect(screen.getByText('24/7 phone support')).toBeInTheDocument();
  });

  it('shows contact info', () => {
    render(<PricingTable />);

    expect(screen.getByText('Contact us')).toBeInTheDocument();
    expect(screen.getByText(/All plans include 14-day free trial/)).toBeInTheDocument();
  });

  it('alerts when trying to upgrade without login', async () => {
    render(<PricingTable />);

    const upgradeButton = screen.getByText('Upgrade to Pro');
    fireEvent.click(upgradeButton);

    expect(mockAlert).toHaveBeenCalledWith('Please sign in to upgrade');
  });

  it('calls checkout API on upgrade click', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ url: 'https://checkout.stripe.com/session123' }),
    });

    render(<PricingTable userId="user-123" userEmail="test@example.com" />);

    const upgradeButton = screen.getByText('Upgrade to Pro');
    fireEvent.click(upgradeButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user-123',
          email: 'test@example.com',
          tier: 'pro',
          interval: 'month',
        }),
      });
    });
  });

  it('shows error alert on API failure', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ error: 'Payment failed' }),
    });

    render(<PricingTable userId="user-123" userEmail="test@example.com" />);

    const upgradeButton = screen.getByText('Upgrade to Pro');
    fireEvent.click(upgradeButton);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Payment failed');
    });
  });

  it('shows loading state during checkout', async () => {
    mockFetch.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                json: () => Promise.resolve({ url: 'https://checkout.stripe.com/session' }),
              }),
            100
          )
        )
    );

    render(<PricingTable userId="user-123" userEmail="test@example.com" />);

    const upgradeButton = screen.getByText('Upgrade to Pro');
    fireEvent.click(upgradeButton);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('does not call fetch on free plan click', () => {
    render(<PricingTable userId="user-123" userEmail="test@example.com" />);

    // Free plan button should say "Current Plan" and be disabled
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('does not call fetch on enterprise plan click', () => {
    render(<PricingTable userId="user-123" userEmail="test@example.com" />);

    const contactButton = screen.getByText('Contact Sales');
    fireEvent.click(contactButton);

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('renders monthly toggle as active by default', () => {
    render(<PricingTable />);

    const monthlyButton = screen.getByText('Monthly');
    expect(monthlyButton.closest('button')).toHaveClass('bg-white');
  });

  it('switches toggle styles on yearly click', () => {
    render(<PricingTable />);

    const yearlyButton = screen.getByText('Yearly', { exact: false });
    fireEvent.click(yearlyButton);

    expect(yearlyButton.closest('button')).toHaveClass('bg-white');
  });
});

describe('UsageStats', () => {
  const mockUsage = {
    favorites: { current: 3, limit: 5, percentage: 60 },
    comparisons: { current: 2, limit: 3, percentage: 66.7 },
    saved_searches: { current: 0, limit: 0, percentage: 0 },
    api_access: { current: 0, limit: false, percentage: 0 },
  };

  it('renders usage statistics title', () => {
    render(<UsageStats tier="free" usage={mockUsage} />);

    expect(screen.getByText('Usage Statistics')).toBeInTheDocument();
  });

  it('displays tier badge', () => {
    render(<UsageStats tier="pro" usage={mockUsage} />);

    expect(screen.getByText('PRO')).toBeInTheDocument();
  });

  it('displays free tier badge', () => {
    render(<UsageStats tier="free" usage={mockUsage} />);

    expect(screen.getByText('FREE')).toBeInTheDocument();
  });

  it('displays business tier badge', () => {
    render(<UsageStats tier="business" usage={mockUsage} />);

    expect(screen.getByText('BUSINESS')).toBeInTheDocument();
  });

  it('displays enterprise tier badge', () => {
    render(<UsageStats tier="enterprise" usage={mockUsage} />);

    expect(screen.getByText('ENTERPRISE')).toBeInTheDocument();
  });

  it('formats feature names correctly', () => {
    render(<UsageStats tier="free" usage={mockUsage} />);

    expect(screen.getByText('Favorites')).toBeInTheDocument();
    expect(screen.getByText('Comparisons')).toBeInTheDocument();
    expect(screen.getByText('Saved Searches')).toBeInTheDocument();
    expect(screen.getByText('Api Access')).toBeInTheDocument();
  });

  it('displays current/limit values', () => {
    render(<UsageStats tier="free" usage={mockUsage} />);

    expect(screen.getByText('3 / 5')).toBeInTheDocument();
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
  });

  it('shows disabled state for boolean features', () => {
    render(<UsageStats tier="free" usage={mockUsage} />);

    expect(screen.getByText('✗ Disabled')).toBeInTheDocument();
  });

  it('shows enabled state for boolean features', () => {
    const usageWithEnabled = {
      ...mockUsage,
      api_access: { current: 0, limit: true, percentage: 0 },
    };

    render(<UsageStats tier="pro" usage={usageWithEnabled} />);

    expect(screen.getByText('✓ Enabled')).toBeInTheDocument();
  });

  it('shows unlimited text for Infinity limit', () => {
    const usageWithUnlimited = {
      favorites: { current: 100, limit: Infinity, percentage: 0 },
    };

    render(<UsageStats tier="pro" usage={usageWithUnlimited} />);

    expect(screen.getByText('100 / Unlimited')).toBeInTheDocument();
    expect(screen.getByText('Unlimited usage available')).toBeInTheDocument();
  });

  it('shows upgrade CTA for free tier', () => {
    render(<UsageStats tier="free" usage={mockUsage} />);

    expect(screen.getByText('Upgrade for Unlimited Access')).toBeInTheDocument();
  });

  it('does not show upgrade CTA for pro tier', () => {
    render(<UsageStats tier="pro" usage={mockUsage} />);

    expect(screen.queryByText('Upgrade for Unlimited Access')).not.toBeInTheDocument();
  });

  it('shows approaching limit warning at 80%', () => {
    const usageWithHighPercentage = {
      favorites: { current: 4, limit: 5, percentage: 85 },
    };

    render(<UsageStats tier="free" usage={usageWithHighPercentage} />);

    expect(screen.getByText('Approaching limit')).toBeInTheDocument();
  });

  it('shows limit reached warning at 100%', () => {
    const usageAtLimit = {
      favorites: { current: 5, limit: 5, percentage: 100 },
    };

    render(<UsageStats tier="free" usage={usageAtLimit} />);

    expect(screen.getByText('Limit reached')).toBeInTheDocument();
  });

  it('renders progress bar for numeric limits', () => {
    const { container } = render(<UsageStats tier="free" usage={mockUsage} />);

    // Should have progress bars for numeric limits
    const progressBars = container.querySelectorAll('.bg-gray-200.rounded-full');
    expect(progressBars.length).toBeGreaterThan(0);
  });

  it('applies correct color for low usage', () => {
    const lowUsage = {
      favorites: { current: 1, limit: 5, percentage: 20 },
    };

    const { container } = render(<UsageStats tier="free" usage={lowUsage} />);

    // Should have green progress bar
    expect(container.querySelector('.bg-green-500')).toBeInTheDocument();
  });

  it('applies correct color for medium usage', () => {
    const mediumUsage = {
      favorites: { current: 4, limit: 5, percentage: 75 },
    };

    const { container } = render(<UsageStats tier="free" usage={mediumUsage} />);

    // Should have yellow progress bar
    expect(container.querySelector('.bg-yellow-500')).toBeInTheDocument();
  });

  it('applies correct color for high usage', () => {
    const highUsage = {
      favorites: { current: 5, limit: 5, percentage: 95 },
    };

    const { container } = render(<UsageStats tier="free" usage={highUsage} />);

    // Should have red progress bar
    expect(container.querySelector('.bg-red-500')).toBeInTheDocument();
  });
});
