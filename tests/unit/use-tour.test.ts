/**
 * useTour Hook Tests
 */

import { renderHook, act } from '@testing-library/react';

// Mock localStorage
const mockLocalStorage: Record<string, string> = {};
const localStorageMock = {
  getItem: jest.fn((key: string) => mockLocalStorage[key] || null),
  setItem: jest.fn((key: string, value: string) => {
    mockLocalStorage[key] = value;
  }),
  removeItem: jest.fn((key: string) => {
    delete mockLocalStorage[key];
  }),
  clear: jest.fn(() => {
    Object.keys(mockLocalStorage).forEach((key) => delete mockLocalStorage[key]);
  }),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock Shepherd.js
const mockAddStep = jest.fn();
const mockStart = jest.fn();
const mockComplete = jest.fn();
const mockOn = jest.fn();
const mockIsActive = jest.fn().mockReturnValue(false);

const eventHandlers: Record<string, () => void> = {};

jest.mock('shepherd.js', () => ({
  __esModule: true,
  default: {
    Tour: jest.fn().mockImplementation(() => ({
      addStep: mockAddStep,
      start: mockStart,
      complete: mockComplete,
      on: jest.fn((event: string, handler: () => void) => {
        mockOn(event, handler);
        eventHandlers[event] = handler;
      }),
      isActive: mockIsActive,
    })),
  },
}));

// Mock tour steps
jest.mock('@/lib/tour/tour-steps', () => ({
  tourSteps: [
    { id: 'step-1', title: 'Welcome', text: 'Welcome to the app' },
    { id: 'step-2', title: 'Search', text: 'Use the search feature' },
    { id: 'step-3', title: 'Done', text: 'You are ready to go' },
  ],
  tourOptions: {
    useModalOverlay: true,
    defaultStepOptions: {
      classes: 'shepherd-theme-default',
    },
  },
}));

import { useTour } from '@/hooks/useTour';

const TOUR_COMPLETED_KEY = 'affiliate-aggregator-tour-completed';

describe('useTour Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    Object.keys(eventHandlers).forEach((key) => delete eventHandlers[key]);
    mockIsActive.mockReturnValue(false);
  });

  it('initializes tour on mount', () => {
    renderHook(() => useTour());
    expect(mockAddStep).toHaveBeenCalledTimes(3);
  });

  it('returns tour instance', () => {
    const { result } = renderHook(() => useTour());
    expect(result.current.tour).toBeDefined();
  });

  it('returns startTour function', () => {
    const { result } = renderHook(() => useTour());
    expect(typeof result.current.startTour).toBe('function');
  });

  it('returns resetTour function', () => {
    const { result } = renderHook(() => useTour());
    expect(typeof result.current.resetTour).toBe('function');
  });

  it('returns shouldShowTour function', () => {
    const { result } = renderHook(() => useTour());
    expect(typeof result.current.shouldShowTour).toBe('function');
  });

  it('isCompleted is false when tour not completed', () => {
    const { result } = renderHook(() => useTour());
    expect(result.current.isCompleted).toBe(false);
  });

  it('isCompleted is true when localStorage indicates completed', () => {
    localStorageMock.setItem(TOUR_COMPLETED_KEY, 'true');

    const { result } = renderHook(() => useTour());
    expect(result.current.isCompleted).toBe(true);
  });

  it('startTour calls tour.start()', () => {
    const { result } = renderHook(() => useTour());

    act(() => {
      result.current.startTour();
    });

    expect(mockStart).toHaveBeenCalled();
  });

  it('resetTour removes localStorage item', () => {
    localStorageMock.setItem(TOUR_COMPLETED_KEY, 'true');

    const { result } = renderHook(() => useTour());

    act(() => {
      result.current.resetTour();
    });

    expect(localStorageMock.removeItem).toHaveBeenCalledWith(TOUR_COMPLETED_KEY);
  });

  it('resetTour sets isCompleted to false', () => {
    localStorageMock.setItem(TOUR_COMPLETED_KEY, 'true');

    const { result } = renderHook(() => useTour());

    expect(result.current.isCompleted).toBe(true);

    act(() => {
      result.current.resetTour();
    });

    expect(result.current.isCompleted).toBe(false);
  });

  it('shouldShowTour returns true when not completed', () => {
    const { result } = renderHook(() => useTour());
    expect(result.current.shouldShowTour()).toBe(true);
  });

  it('shouldShowTour returns false when completed', () => {
    localStorageMock.setItem(TOUR_COMPLETED_KEY, 'true');

    const { result } = renderHook(() => useTour());
    expect(result.current.shouldShowTour()).toBe(false);
  });

  it('registers complete event handler', () => {
    renderHook(() => useTour());
    expect(mockOn).toHaveBeenCalledWith('complete', expect.any(Function));
  });

  it('registers cancel event handler', () => {
    renderHook(() => useTour());
    expect(mockOn).toHaveBeenCalledWith('cancel', expect.any(Function));
  });

  it('sets localStorage on tour complete', () => {
    const { result } = renderHook(() => useTour());

    // Trigger complete event
    act(() => {
      eventHandlers['complete']?.();
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(TOUR_COMPLETED_KEY, 'true');
    expect(result.current.isCompleted).toBe(true);
  });

  it('sets localStorage on tour cancel', () => {
    const { result } = renderHook(() => useTour());

    // Trigger cancel event
    act(() => {
      eventHandlers['cancel']?.();
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(TOUR_COMPLETED_KEY, 'true');
    expect(result.current.isCompleted).toBe(true);
  });

  it('completes tour on unmount if active', () => {
    mockIsActive.mockReturnValue(true);

    const { unmount } = renderHook(() => useTour());

    unmount();

    expect(mockComplete).toHaveBeenCalled();
  });

  it('does not complete tour on unmount if not active', () => {
    mockIsActive.mockReturnValue(false);

    const { unmount } = renderHook(() => useTour());

    unmount();

    expect(mockComplete).not.toHaveBeenCalled();
  });

  it('adds all tour steps from config', () => {
    renderHook(() => useTour());

    expect(mockAddStep).toHaveBeenCalledWith({
      id: 'step-1',
      title: 'Welcome',
      text: 'Welcome to the app',
    });
    expect(mockAddStep).toHaveBeenCalledWith({
      id: 'step-2',
      title: 'Search',
      text: 'Use the search feature',
    });
    expect(mockAddStep).toHaveBeenCalledWith({
      id: 'step-3',
      title: 'Done',
      text: 'You are ready to go',
    });
  });

  it('reads completed state from localStorage on mount', () => {
    // First render - not completed
    const { result: result1 } = renderHook(() => useTour());
    expect(result1.current.isCompleted).toBe(false);

    // Mark as completed
    localStorageMock.setItem(TOUR_COMPLETED_KEY, 'true');

    // New render should see completed state
    const { result: result2 } = renderHook(() => useTour());
    expect(result2.current.isCompleted).toBe(true);
  });

  it('returns isCompleted based on tour instance', () => {
    const { result } = renderHook(() => useTour());

    // Initially not completed
    expect(result.current.isCompleted).toBe(false);

    // After completing tour
    act(() => {
      eventHandlers['complete']?.();
    });

    expect(result.current.isCompleted).toBe(true);
  });
});
