/**
 * useRealtime Hook Tests
 */

import { renderHook, act } from '@testing-library/react';
import {
  useRealtime,
  useProgramUpdates,
  useProgramsFeed,
  useUserNotifications,
  useLiveStats,
} from '@/hooks/useRealtime';

// Mock EventSource
class MockEventSource {
  static instances: MockEventSource[] = [];
  url: string;
  onopen: (() => void) | null = null;
  onerror: (() => void) | null = null;
  readyState: number = 0;
  private listeners: Record<string, ((event: MessageEvent) => void)[]> = {};

  constructor(url: string) {
    this.url = url;
    MockEventSource.instances.push(this);
  }

  addEventListener(type: string, listener: (event: MessageEvent) => void) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(listener);
  }

  removeEventListener(type: string, listener: (event: MessageEvent) => void) {
    if (this.listeners[type]) {
      this.listeners[type] = this.listeners[type].filter((l) => l !== listener);
    }
  }

  close() {
    this.readyState = 2;
  }

  // Helper to trigger events in tests
  triggerEvent(type: string, data: unknown) {
    const event = {
      type,
      data: JSON.stringify(data),
    } as MessageEvent;
    this.listeners[type]?.forEach((listener) => listener(event));
  }

  triggerOpen() {
    this.readyState = 1;
    this.onopen?.();
  }

  triggerError() {
    this.onerror?.();
  }

  static clearInstances() {
    MockEventSource.instances = [];
  }

  static getLastInstance() {
    return MockEventSource.instances[MockEventSource.instances.length - 1];
  }
}

// Assign mock to global
(global as unknown as { EventSource: typeof MockEventSource }).EventSource = MockEventSource;

describe('useRealtime Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    MockEventSource.clearInstances();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('useRealtime', () => {
    it('creates EventSource with correct URL', () => {
      renderHook(() => useRealtime({ channel: 'test-channel' }));

      const instance = MockEventSource.getLastInstance();
      expect(instance).toBeDefined();
      expect(instance.url).toBe('/api/realtime?channel=test-channel');
    });

    it('encodes channel name in URL', () => {
      renderHook(() => useRealtime({ channel: 'test channel with spaces' }));

      const instance = MockEventSource.getLastInstance();
      expect(instance.url).toBe('/api/realtime?channel=test%20channel%20with%20spaces');
    });

    it('initializes with disconnected state', () => {
      const { result } = renderHook(() => useRealtime({ channel: 'test' }));

      expect(result.current.isConnected).toBe(false);
      expect(result.current.lastMessage).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it('sets connected state on open', () => {
      const { result } = renderHook(() => useRealtime({ channel: 'test' }));

      act(() => {
        MockEventSource.getLastInstance().triggerOpen();
      });

      expect(result.current.isConnected).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('does not auto-connect when autoConnect is false', () => {
      renderHook(() => useRealtime({ channel: 'test', autoConnect: false }));

      expect(MockEventSource.instances.length).toBe(0);
    });

    it('provides connect function', () => {
      const { result } = renderHook(() => useRealtime({ channel: 'test', autoConnect: false }));

      expect(typeof result.current.connect).toBe('function');

      act(() => {
        result.current.connect();
      });

      expect(MockEventSource.instances.length).toBe(1);
    });

    it('provides disconnect function', () => {
      const { result } = renderHook(() => useRealtime({ channel: 'test' }));

      act(() => {
        MockEventSource.getLastInstance().triggerOpen();
      });

      expect(result.current.isConnected).toBe(true);

      act(() => {
        result.current.disconnect();
      });

      expect(result.current.isConnected).toBe(false);
    });

    it('receives and processes messages', () => {
      const onMessage = jest.fn();
      const { result } = renderHook(() => useRealtime({ channel: 'test', onMessage }));

      act(() => {
        MockEventSource.getLastInstance().triggerOpen();
      });

      act(() => {
        MockEventSource.getLastInstance().triggerEvent('notification', {
          title: 'Test',
        });
      });

      expect(result.current.lastMessage).toMatchObject({
        type: 'notification',
        data: { title: 'Test' },
      });
      expect(onMessage).toHaveBeenCalled();
    });

    it('handles program.new event', () => {
      const { result } = renderHook(() => useRealtime({ channel: 'test' }));

      act(() => {
        MockEventSource.getLastInstance().triggerOpen();
      });

      act(() => {
        MockEventSource.getLastInstance().triggerEvent('program.new', {
          id: '123',
          name: 'New Program',
        });
      });

      expect(result.current.lastMessage?.type).toBe('program.new');
      expect(result.current.lastMessage?.data).toEqual({
        id: '123',
        name: 'New Program',
      });
    });

    it('handles program.updated event', () => {
      const { result } = renderHook(() => useRealtime({ channel: 'test' }));

      act(() => {
        MockEventSource.getLastInstance().triggerOpen();
      });

      act(() => {
        MockEventSource.getLastInstance().triggerEvent('program.updated', {
          id: '123',
          changes: { commission: 20 },
        });
      });

      expect(result.current.lastMessage?.type).toBe('program.updated');
    });

    it('handles stats.updated event', () => {
      const { result } = renderHook(() => useRealtime({ channel: 'test' }));

      act(() => {
        MockEventSource.getLastInstance().triggerOpen();
      });

      act(() => {
        MockEventSource.getLastInstance().triggerEvent('stats.updated', {
          totalPrograms: 100,
        });
      });

      expect(result.current.lastMessage?.type).toBe('stats.updated');
    });

    it('handles heartbeat event', () => {
      const { result } = renderHook(() => useRealtime({ channel: 'test' }));

      act(() => {
        MockEventSource.getLastInstance().triggerOpen();
      });

      act(() => {
        MockEventSource.getLastInstance().triggerEvent('heartbeat', {
          time: Date.now(),
        });
      });

      expect(result.current.lastMessage?.type).toBe('heartbeat');
    });

    it('sets error after max reconnect attempts', () => {
      const { result } = renderHook(() => useRealtime({ channel: 'test' }));

      // Trigger errors to exhaust reconnect attempts
      for (let i = 0; i < 6; i++) {
        act(() => {
          MockEventSource.getLastInstance().triggerError();
          jest.advanceTimersByTime(30000);
        });
      }

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Failed to connect after multiple attempts');
    });

    it('cleans up on unmount', () => {
      const { unmount } = renderHook(() => useRealtime({ channel: 'test' }));

      const instance = MockEventSource.getLastInstance();
      unmount();

      expect(instance.readyState).toBe(2); // CLOSED
    });

    it('reconnects with exponential backoff', () => {
      renderHook(() => useRealtime({ channel: 'test' }));

      // First error - should wait 1s
      act(() => {
        MockEventSource.getLastInstance().triggerError();
      });

      expect(MockEventSource.instances.length).toBe(1);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(MockEventSource.instances.length).toBe(2);

      // Second error - should wait 2s
      act(() => {
        MockEventSource.getLastInstance().triggerError();
      });

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(MockEventSource.instances.length).toBe(3);
    });

    it('resets reconnect attempts on successful connection', () => {
      const { result } = renderHook(() => useRealtime({ channel: 'test' }));

      // Trigger error then reconnect successfully
      act(() => {
        MockEventSource.getLastInstance().triggerError();
        jest.advanceTimersByTime(1000);
      });

      act(() => {
        MockEventSource.getLastInstance().triggerOpen();
      });

      expect(result.current.isConnected).toBe(true);
      expect(result.current.error).toBeNull();
    });
  });

  describe('useProgramUpdates', () => {
    it('connects to program-specific channel', () => {
      renderHook(() => useProgramUpdates('program-123'));

      const instance = MockEventSource.getLastInstance();
      expect(instance.url).toContain('channel=program%3Aprogram-123');
    });

    it('returns realtime connection state', () => {
      const { result } = renderHook(() => useProgramUpdates('program-123'));

      expect(result.current).toHaveProperty('isConnected');
      expect(result.current).toHaveProperty('lastMessage');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('connect');
      expect(result.current).toHaveProperty('disconnect');
    });
  });

  describe('useProgramsFeed', () => {
    it('connects to all programs feed', () => {
      renderHook(() => useProgramsFeed());

      const instance = MockEventSource.getLastInstance();
      expect(instance.url).toContain('channel=programs%3Aall');
    });

    it('returns realtime connection state', () => {
      const { result } = renderHook(() => useProgramsFeed());

      expect(result.current).toHaveProperty('isConnected');
      expect(result.current).toHaveProperty('lastMessage');
    });
  });

  describe('useUserNotifications', () => {
    it('connects to user-specific channel', () => {
      renderHook(() => useUserNotifications('user-456'));

      const instance = MockEventSource.getLastInstance();
      expect(instance.url).toContain('channel=user%3Auser-456');
    });

    it('initializes with empty notifications', () => {
      const { result } = renderHook(() => useUserNotifications('user-456'));

      expect(result.current.notifications).toEqual([]);
    });

    it('accumulates notification messages', () => {
      const { result } = renderHook(() => useUserNotifications('user-456'));

      act(() => {
        MockEventSource.getLastInstance().triggerOpen();
      });

      act(() => {
        MockEventSource.getLastInstance().triggerEvent('notification', {
          title: 'First',
        });
      });

      expect(result.current.notifications.length).toBe(1);

      act(() => {
        MockEventSource.getLastInstance().triggerEvent('notification', {
          title: 'Second',
        });
      });

      expect(result.current.notifications.length).toBe(2);
    });

    it('keeps newest notifications first', () => {
      const { result } = renderHook(() => useUserNotifications('user-456'));

      act(() => {
        MockEventSource.getLastInstance().triggerOpen();
      });

      act(() => {
        MockEventSource.getLastInstance().triggerEvent('notification', {
          title: 'First',
        });
      });

      act(() => {
        MockEventSource.getLastInstance().triggerEvent('notification', {
          title: 'Second',
        });
      });

      expect(result.current.notifications[0].data).toEqual({ title: 'Second' });
      expect(result.current.notifications[1].data).toEqual({ title: 'First' });
    });

    it('limits notifications to 50', () => {
      const { result } = renderHook(() => useUserNotifications('user-456'));

      act(() => {
        MockEventSource.getLastInstance().triggerOpen();
      });

      // Add 55 notifications
      for (let i = 0; i < 55; i++) {
        act(() => {
          MockEventSource.getLastInstance().triggerEvent('notification', {
            title: `Notification ${i}`,
          });
        });
      }

      expect(result.current.notifications.length).toBe(50);
    });

    it('provides clearNotifications function', () => {
      const { result } = renderHook(() => useUserNotifications('user-456'));

      act(() => {
        MockEventSource.getLastInstance().triggerOpen();
      });

      act(() => {
        MockEventSource.getLastInstance().triggerEvent('notification', {
          title: 'Test',
        });
      });

      expect(result.current.notifications.length).toBe(1);

      act(() => {
        result.current.clearNotifications();
      });

      expect(result.current.notifications.length).toBe(0);
    });

    it('ignores non-notification messages', () => {
      const { result } = renderHook(() => useUserNotifications('user-456'));

      act(() => {
        MockEventSource.getLastInstance().triggerOpen();
      });

      act(() => {
        MockEventSource.getLastInstance().triggerEvent('heartbeat', {
          time: Date.now(),
        });
      });

      expect(result.current.notifications.length).toBe(0);
    });
  });

  describe('useLiveStats', () => {
    it('connects to global stats channel', () => {
      renderHook(() => useLiveStats());

      const instance = MockEventSource.getLastInstance();
      expect(instance.url).toContain('channel=stats%3Aglobal');
    });

    it('initializes with empty stats', () => {
      const { result } = renderHook(() => useLiveStats());

      expect(result.current.totalPrograms).toBeUndefined();
      expect(result.current.totalClicks).toBeUndefined();
    });

    it('updates stats on stats.updated event', () => {
      const { result } = renderHook(() => useLiveStats());

      act(() => {
        MockEventSource.getLastInstance().triggerOpen();
      });

      act(() => {
        MockEventSource.getLastInstance().triggerEvent('stats.updated', {
          totalPrograms: 500,
          totalClicks: 10000,
        });
      });

      expect(result.current.totalPrograms).toBe(500);
      expect(result.current.totalClicks).toBe(10000);
    });

    it('sets lastUpdated timestamp', () => {
      const { result } = renderHook(() => useLiveStats());

      act(() => {
        MockEventSource.getLastInstance().triggerOpen();
      });

      act(() => {
        MockEventSource.getLastInstance().triggerEvent('stats.updated', {
          totalPrograms: 500,
        });
      });

      expect(result.current.lastUpdated).toBeDefined();
    });

    it('returns isLive property', () => {
      const { result } = renderHook(() => useLiveStats());

      // isLive should be a boolean
      expect(typeof result.current.isLive).toBe('boolean');
    });
  });
});
