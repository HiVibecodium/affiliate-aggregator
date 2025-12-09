/**
 * Toast Component Tests
 */

import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { ToastProvider, useToast, toast, setToastFunction } from '@/components/Toast';

// Test component that uses the toast hook
function TestComponent() {
  const toastContext = useToast();

  return (
    <div>
      <button onClick={() => toastContext.success('Success message')}>Show Success</button>
      <button onClick={() => toastContext.error('Error message')}>Show Error</button>
      <button onClick={() => toastContext.warning('Warning message')}>Show Warning</button>
      <button onClick={() => toastContext.info('Info message')}>Show Info</button>
      <button onClick={() => toastContext.addToast('Custom message', 'success', 1000)}>
        Custom Toast
      </button>
    </div>
  );
}

// Component that exposes toast functions
function ToastFunctionExporter() {
  const toastContext = useToast();

  React.useEffect(() => {
    setToastFunction(toastContext);
  }, [toastContext]);

  return null;
}

describe('Toast Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('ToastProvider', () => {
    it('renders children correctly', () => {
      render(
        <ToastProvider>
          <div data-testid="child">Child Content</div>
        </ToastProvider>
      );

      expect(screen.getByTestId('child')).toHaveTextContent('Child Content');
    });

    it('provides toast context to children', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      expect(screen.getByText('Show Success')).toBeInTheDocument();
    });
  });

  describe('useToast hook', () => {
    it('throws error when used outside ToastProvider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useToast must be used within a ToastProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('Toast types', () => {
    it('shows success toast', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Show Success'));

      expect(screen.getByText('Success message')).toBeInTheDocument();
    });

    it('shows error toast', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Show Error'));

      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('shows warning toast', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Show Warning'));

      expect(screen.getByText('Warning message')).toBeInTheDocument();
    });

    it('shows info toast', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Show Info'));

      expect(screen.getByText('Info message')).toBeInTheDocument();
    });
  });

  describe('Toast auto-dismiss', () => {
    it('auto-removes toast after duration', async () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Custom Toast'));

      expect(screen.getByText('Custom message')).toBeInTheDocument();

      // Fast-forward time
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Wait for exit animation
      act(() => {
        jest.advanceTimersByTime(200);
      });

      await waitFor(() => {
        expect(screen.queryByText('Custom message')).not.toBeInTheDocument();
      });
    });
  });

  describe('Toast manual dismiss', () => {
    it('removes toast when close button is clicked', async () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Show Success'));

      expect(screen.getByText('Success message')).toBeInTheDocument();

      // Find and click close button (the X button in the toast)
      const closeButton = screen.getByRole('button', { name: '' });
      fireEvent.click(closeButton);

      // Wait for exit animation
      act(() => {
        jest.advanceTimersByTime(200);
      });

      await waitFor(() => {
        expect(screen.queryByText('Success message')).not.toBeInTheDocument();
      });
    });
  });

  describe('Multiple toasts', () => {
    it('can show multiple toasts', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Show Success'));
      fireEvent.click(screen.getByText('Show Error'));
      fireEvent.click(screen.getByText('Show Warning'));

      expect(screen.getByText('Success message')).toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.getByText('Warning message')).toBeInTheDocument();
    });
  });

  describe('Standalone toast function', () => {
    it('works when ToastProvider is mounted', () => {
      render(
        <ToastProvider>
          <ToastFunctionExporter />
        </ToastProvider>
      );

      act(() => {
        toast('Standalone message');
      });

      expect(screen.getByText('Standalone message')).toBeInTheDocument();
    });

    it('warns when used without ToastProvider', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      // Reset toast function
      setToastFunction(null as unknown as Parameters<typeof setToastFunction>[0]);

      toast('Test message');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Toast function not initialized. Make sure ToastProvider is mounted.'
      );

      consoleSpy.mockRestore();
    });

    it('has success, error, warning, info methods', () => {
      render(
        <ToastProvider>
          <ToastFunctionExporter />
        </ToastProvider>
      );

      act(() => {
        toast.success('Success via function');
      });

      expect(screen.getByText('Success via function')).toBeInTheDocument();

      act(() => {
        toast.error('Error via function');
      });

      expect(screen.getByText('Error via function')).toBeInTheDocument();

      act(() => {
        toast.warning('Warning via function');
      });

      expect(screen.getByText('Warning via function')).toBeInTheDocument();

      act(() => {
        toast.info('Info via function');
      });

      expect(screen.getByText('Info via function')).toBeInTheDocument();
    });
  });

  describe('Toast styling', () => {
    it('applies correct colors for each type', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      // Success toast - check for class in any parent
      fireEvent.click(screen.getByText('Show Success'));
      const successText = screen.getByText('Success message');
      expect(successText.closest('.bg-green-500')).toBeInTheDocument();

      // Error toast
      fireEvent.click(screen.getByText('Show Error'));
      const errorText = screen.getByText('Error message');
      expect(errorText.closest('.bg-red-500')).toBeInTheDocument();

      // Warning toast
      fireEvent.click(screen.getByText('Show Warning'));
      const warningText = screen.getByText('Warning message');
      expect(warningText.closest('.bg-yellow-500')).toBeInTheDocument();

      // Info toast
      fireEvent.click(screen.getByText('Show Info'));
      const infoText = screen.getByText('Info message');
      expect(infoText.closest('.bg-blue-500')).toBeInTheDocument();
    });
  });

  describe('Toast animations', () => {
    it('applies enter animation class', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Show Success'));

      const toastContainer = screen.getByText('Success message').closest('.animate-toast-in');
      expect(toastContainer).toBeInTheDocument();
    });

    it('applies exit animation class when removing', async () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Custom Toast'));

      // Trigger auto-dismiss
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Check for exit animation
      const toastContainer = screen.getByText('Custom message').closest('.animate-toast-out');
      expect(toastContainer).toBeInTheDocument();
    });
  });

  describe('Progress bar', () => {
    it('renders progress bar with correct duration', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Custom Toast'));

      // Progress bar should have animation duration matching toast duration
      const progressBar = document.querySelector('.animate-toast-progress');
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveStyle({ animationDuration: '1000ms' });
    });
  });
});
