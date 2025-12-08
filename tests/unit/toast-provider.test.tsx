/**
 * ToastProvider Component Tests
 */

import React from 'react';
import { render } from '@testing-library/react';
import { ToastProvider } from '@/components/notifications/ToastProvider';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  Toaster: jest.fn(({ position, toastOptions }) => (
    <div data-testid="toaster" data-position={position}>
      <span data-testid="toast-duration">{toastOptions?.duration}</span>
      <span data-testid="success-duration">{toastOptions?.success?.duration}</span>
      <span data-testid="error-duration">{toastOptions?.error?.duration}</span>
    </div>
  )),
}));

describe('ToastProvider', () => {
  it('renders Toaster component', () => {
    const { getByTestId } = render(<ToastProvider />);

    expect(getByTestId('toaster')).toBeInTheDocument();
  });

  it('sets position to top-right', () => {
    const { getByTestId } = render(<ToastProvider />);

    expect(getByTestId('toaster')).toHaveAttribute('data-position', 'top-right');
  });

  it('sets default duration to 4000ms', () => {
    const { getByTestId } = render(<ToastProvider />);

    expect(getByTestId('toast-duration')).toHaveTextContent('4000');
  });

  it('sets success duration to 3000ms', () => {
    const { getByTestId } = render(<ToastProvider />);

    expect(getByTestId('success-duration')).toHaveTextContent('3000');
  });

  it('sets error duration to 5000ms', () => {
    const { getByTestId } = render(<ToastProvider />);

    expect(getByTestId('error-duration')).toHaveTextContent('5000');
  });

  it('renders without crashing', () => {
    expect(() => render(<ToastProvider />)).not.toThrow();
  });
});
