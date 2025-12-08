/**
 * usePWA Hook Tests
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import {
  usePWAInstall,
  useServiceWorkerUpdate,
  useOnlineStatus,
  useDisplayMode,
  usePushNotifications,
  usePWA,
} from '@/hooks/usePWA';

// Mock window and navigator
const mockMatchMedia = jest.fn();
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

// Store event handlers for triggering
const eventHandlers: Record<string, ((e?: Event) => void)[]> = {};

// Helper to trigger events
const triggerWindowEvent = (eventName: string, eventData?: Partial<Event>) => {
  const handlers = eventHandlers[eventName] || [];
  const event = { ...eventData, type: eventName } as Event;
  handlers.forEach((handler) => handler(event));
};

describe('usePWA Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.keys(eventHandlers).forEach((key) => {
      eventHandlers[key] = [];
    });

    // Default matchMedia mock
    mockMatchMedia.mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });

    // Override addEventListener to capture handlers
    window.addEventListener = jest.fn(
      (event: string, handler: EventListenerOrEventListenerObject) => {
        mockAddEventListener(event, handler);
        if (!eventHandlers[event]) {
          eventHandlers[event] = [];
        }
        eventHandlers[event].push(handler as (e?: Event) => void);
      }
    ) as typeof window.addEventListener;

    window.removeEventListener = jest.fn(
      (event: string, handler: EventListenerOrEventListenerObject) => {
        mockRemoveEventListener(event, handler);
        if (eventHandlers[event]) {
          eventHandlers[event] = eventHandlers[event].filter((h) => h !== handler);
        }
      }
    ) as typeof window.removeEventListener;

    // Mock navigator
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    });
  });

  describe('useOnlineStatus', () => {
    it('returns true when online', () => {
      const { result } = renderHook(() => useOnlineStatus());
      expect(result.current).toBe(true);
    });

    it('returns false when offline', () => {
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false,
      });

      const { result } = renderHook(() => useOnlineStatus());
      expect(result.current).toBe(false);
    });

    it('adds online/offline event listeners', () => {
      renderHook(() => useOnlineStatus());

      expect(mockAddEventListener).toHaveBeenCalledWith('online', expect.any(Function));
      expect(mockAddEventListener).toHaveBeenCalledWith('offline', expect.any(Function));
    });

    it('removes event listeners on unmount', () => {
      const { unmount } = renderHook(() => useOnlineStatus());

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith('online', expect.any(Function));
      expect(mockRemoveEventListener).toHaveBeenCalledWith('offline', expect.any(Function));
    });

    it('updates when going offline', () => {
      const { result } = renderHook(() => useOnlineStatus());

      expect(result.current).toBe(true);

      act(() => {
        triggerWindowEvent('offline');
      });

      expect(result.current).toBe(false);
    });

    it('updates when going online', () => {
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false,
      });

      const { result } = renderHook(() => useOnlineStatus());

      expect(result.current).toBe(false);

      act(() => {
        triggerWindowEvent('online');
      });

      expect(result.current).toBe(true);
    });
  });

  describe('useDisplayMode', () => {
    it('returns browser mode by default', () => {
      const { result } = renderHook(() => useDisplayMode());
      expect(result.current).toBe('browser');
    });

    it('returns standalone when in standalone mode', () => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query === '(display-mode: standalone)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));

      const { result } = renderHook(() => useDisplayMode());
      expect(result.current).toBe('standalone');
    });

    it('returns fullscreen when in fullscreen mode', () => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query === '(display-mode: fullscreen)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));

      const { result } = renderHook(() => useDisplayMode());
      expect(result.current).toBe('fullscreen');
    });

    it('adds media query listeners', () => {
      const addListenerMock = jest.fn();
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: addListenerMock,
        removeEventListener: jest.fn(),
      }));

      renderHook(() => useDisplayMode());

      expect(addListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
    });
  });

  describe('usePWAInstall', () => {
    it('initializes with not installed state', () => {
      const { result } = renderHook(() => usePWAInstall());

      expect(result.current.isInstalled).toBe(false);
      expect(result.current.isInstallable).toBe(false);
    });

    it('detects standalone mode as installed', () => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query === '(display-mode: standalone)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));

      const { result } = renderHook(() => usePWAInstall());

      expect(result.current.isInstalled).toBe(true);
    });

    it('adds beforeinstallprompt listener', () => {
      renderHook(() => usePWAInstall());

      expect(mockAddEventListener).toHaveBeenCalledWith(
        'beforeinstallprompt',
        expect.any(Function)
      );
    });

    it('adds appinstalled listener', () => {
      renderHook(() => usePWAInstall());

      expect(mockAddEventListener).toHaveBeenCalledWith('appinstalled', expect.any(Function));
    });

    it('sets isInstallable when beforeinstallprompt fires', () => {
      const { result } = renderHook(() => usePWAInstall());

      expect(result.current.isInstallable).toBe(false);

      act(() => {
        const mockEvent = {
          preventDefault: jest.fn(),
          prompt: jest.fn(),
          userChoice: Promise.resolve({ outcome: 'accepted' }),
        };
        triggerWindowEvent('beforeinstallprompt', mockEvent as unknown as Event);
      });

      expect(result.current.isInstallable).toBe(true);
    });

    it('sets isInstalled when appinstalled fires', () => {
      const { result } = renderHook(() => usePWAInstall());

      act(() => {
        triggerWindowEvent('appinstalled');
      });

      expect(result.current.isInstalled).toBe(true);
      expect(result.current.isInstallable).toBe(false);
    });

    it('install returns false when no deferred prompt', async () => {
      const { result } = renderHook(() => usePWAInstall());

      let installResult: boolean = true;
      await act(async () => {
        installResult = await result.current.install();
      });

      expect(installResult).toBe(false);
    });

    it('install calls prompt and handles accepted outcome', async () => {
      const mockPrompt = jest.fn();
      const mockEvent = {
        preventDefault: jest.fn(),
        prompt: mockPrompt,
        userChoice: Promise.resolve({ outcome: 'accepted' as const }),
      };

      const { result } = renderHook(() => usePWAInstall());

      act(() => {
        triggerWindowEvent('beforeinstallprompt', mockEvent as unknown as Event);
      });

      let installResult: boolean = false;
      await act(async () => {
        installResult = await result.current.install();
      });

      expect(mockPrompt).toHaveBeenCalled();
      expect(installResult).toBe(true);
      expect(result.current.isInstalled).toBe(true);
    });

    it('install handles dismissed outcome', async () => {
      const mockPrompt = jest.fn();
      const mockEvent = {
        preventDefault: jest.fn(),
        prompt: mockPrompt,
        userChoice: Promise.resolve({ outcome: 'dismissed' as const }),
      };

      const { result } = renderHook(() => usePWAInstall());

      act(() => {
        triggerWindowEvent('beforeinstallprompt', mockEvent as unknown as Event);
      });

      let installResult: boolean = true;
      await act(async () => {
        installResult = await result.current.install();
      });

      expect(installResult).toBe(false);
      expect(result.current.isInstalled).toBe(false);
    });
  });

  describe('useServiceWorkerUpdate', () => {
    const mockGetRegistration = jest.fn();

    beforeEach(() => {
      Object.defineProperty(navigator, 'serviceWorker', {
        writable: true,
        value: {
          getRegistration: mockGetRegistration,
          ready: Promise.resolve({
            waiting: null,
          }),
          addEventListener: jest.fn(),
        },
      });
      mockGetRegistration.mockResolvedValue(null);
    });

    it('initializes with no update available', () => {
      const { result } = renderHook(() => useServiceWorkerUpdate());
      expect(result.current.isUpdateAvailable).toBe(false);
    });

    it('provides updateServiceWorker function', () => {
      const { result } = renderHook(() => useServiceWorkerUpdate());
      expect(typeof result.current.updateServiceWorker).toBe('function');
    });

    it('checks for service worker registration', async () => {
      renderHook(() => useServiceWorkerUpdate());

      await waitFor(() => {
        expect(mockGetRegistration).toHaveBeenCalled();
      });
    });

    it('detects update when waiting worker exists', async () => {
      const mockWaitingWorker = {
        postMessage: jest.fn(),
      };
      mockGetRegistration.mockResolvedValue({
        waiting: mockWaitingWorker,
      });

      const { result } = renderHook(() => useServiceWorkerUpdate());

      await waitFor(() => {
        expect(result.current.isUpdateAvailable).toBe(true);
      });
    });
  });

  describe('usePushNotifications', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'Notification', {
        writable: true,
        value: {
          permission: 'default' as NotificationPermission,
          requestPermission: jest.fn(),
        },
      });

      Object.defineProperty(window, 'PushManager', {
        writable: true,
        value: jest.fn(),
      });

      Object.defineProperty(navigator, 'serviceWorker', {
        writable: true,
        value: {
          ready: Promise.resolve({
            pushManager: {
              subscribe: jest.fn(),
            },
          }),
        },
      });
    });

    it('detects push notification support', async () => {
      const { result } = renderHook(() => usePushNotifications());

      await waitFor(() => {
        expect(result.current.isSupported).toBe(true);
      });
    });

    it('returns current permission state', async () => {
      const { result } = renderHook(() => usePushNotifications());

      await waitFor(() => {
        expect(result.current.permission).toBe('default');
      });
    });

    it('provides requestPermission function', () => {
      const { result } = renderHook(() => usePushNotifications());
      expect(typeof result.current.requestPermission).toBe('function');
    });

    it('requestPermission returns true when granted', async () => {
      (window.Notification.requestPermission as jest.Mock).mockResolvedValue('granted');

      const { result } = renderHook(() => usePushNotifications());

      await waitFor(() => {
        expect(result.current.isSupported).toBe(true);
      });

      let permissionResult: boolean = false;
      await act(async () => {
        permissionResult = await result.current.requestPermission();
      });

      expect(permissionResult).toBe(true);
    });

    it('provides subscribe function', () => {
      const { result } = renderHook(() => usePushNotifications());
      expect(typeof result.current.subscribe).toBe('function');
    });

    it('provides unsubscribe function', () => {
      const { result } = renderHook(() => usePushNotifications());
      expect(typeof result.current.unsubscribe).toBe('function');
    });

    it('unsubscribe returns false when no subscription', async () => {
      const { result } = renderHook(() => usePushNotifications());

      let unsubResult: boolean = true;
      await act(async () => {
        unsubResult = await result.current.unsubscribe();
      });

      expect(unsubResult).toBe(false);
    });
  });

  describe('usePWA (combined hook)', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'Notification', {
        writable: true,
        value: {
          permission: 'default' as NotificationPermission,
          requestPermission: jest.fn(),
        },
      });

      Object.defineProperty(window, 'PushManager', {
        writable: true,
        value: jest.fn(),
      });

      Object.defineProperty(navigator, 'serviceWorker', {
        writable: true,
        value: {
          getRegistration: jest.fn().mockResolvedValue(null),
          ready: Promise.resolve({
            pushManager: {
              subscribe: jest.fn(),
            },
          }),
          addEventListener: jest.fn(),
        },
      });
    });

    it('returns combined PWA state', () => {
      const { result } = renderHook(() => usePWA());

      expect(result.current).toHaveProperty('isInstalled');
      expect(result.current).toHaveProperty('isInstallable');
      expect(result.current).toHaveProperty('install');
      expect(result.current).toHaveProperty('isUpdateAvailable');
      expect(result.current).toHaveProperty('updateServiceWorker');
      expect(result.current).toHaveProperty('isOnline');
      expect(result.current).toHaveProperty('displayMode');
      expect(result.current).toHaveProperty('isStandalone');
      expect(result.current).toHaveProperty('push');
    });

    it('returns push notification handlers', () => {
      const { result } = renderHook(() => usePWA());

      expect(result.current.push).toHaveProperty('isSupported');
      expect(result.current.push).toHaveProperty('permission');
      expect(result.current.push).toHaveProperty('subscription');
      expect(result.current.push).toHaveProperty('requestPermission');
      expect(result.current.push).toHaveProperty('subscribe');
      expect(result.current.push).toHaveProperty('unsubscribe');
    });

    it('isStandalone is true when display mode is standalone', () => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query === '(display-mode: standalone)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));

      const { result } = renderHook(() => usePWA());

      expect(result.current.isStandalone).toBe(true);
    });

    it('isStandalone is true when display mode is fullscreen', () => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query === '(display-mode: fullscreen)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));

      const { result } = renderHook(() => usePWA());

      expect(result.current.isStandalone).toBe(true);
    });

    it('isStandalone is false in browser mode', () => {
      const { result } = renderHook(() => usePWA());
      expect(result.current.isStandalone).toBe(false);
    });
  });
});
