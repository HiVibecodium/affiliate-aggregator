'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import type { RealtimeEventType } from '@/lib/realtime';

interface RealtimeMessage {
  type: RealtimeEventType;
  data: Record<string, unknown>;
  timestamp: string;
}

interface UseRealtimeOptions {
  channel: string;
  onMessage?: (message: RealtimeMessage) => void;
  autoConnect?: boolean;
}

interface UseRealtimeReturn {
  isConnected: boolean;
  lastMessage: RealtimeMessage | null;
  error: Error | null;
  connect: () => void;
  disconnect: () => void;
}

/**
 * React hook for real-time updates via SSE
 */
export function useRealtime({
  channel,
  onMessage,
  autoConnect = true,
}: UseRealtimeOptions): UseRealtimeReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<RealtimeMessage | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);

  const connect = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Clean up existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const url = `/api/realtime?channel=${encodeURIComponent(channel)}`;
    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
      setError(null);
      reconnectAttempts.current = 0;
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      eventSource.close();

      // Exponential backoff reconnect
      if (reconnectAttempts.current < 5) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
        reconnectAttempts.current++;

        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, delay);
      } else {
        setError(new Error('Failed to connect after multiple attempts'));
      }
    };

    // Event types to listen for
    const eventTypes: RealtimeEventType[] = [
      'program.new',
      'program.updated',
      'click.recorded',
      'favorite.changed',
      'stats.updated',
      'notification',
      'heartbeat',
    ];

    eventTypes.forEach((eventType) => {
      eventSource.addEventListener(eventType, (event) => {
        try {
          const data = JSON.parse((event as MessageEvent).data);
          const message: RealtimeMessage = {
            type: eventType,
            data,
            timestamp: new Date().toISOString(),
          };

          setLastMessage(message);
          onMessage?.(message);
        } catch (err) {
          console.error('Error parsing realtime message:', err);
        }
      });
    });
  }, [channel, onMessage]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    setIsConnected(false);
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    isConnected,
    lastMessage,
    error,
    connect,
    disconnect,
  };
}

/**
 * Hook for subscribing to program updates
 */
export function useProgramUpdates(programId: string) {
  return useRealtime({
    channel: `program:${programId}`,
  });
}

/**
 * Hook for subscribing to all programs feed
 */
export function useProgramsFeed() {
  return useRealtime({
    channel: 'programs:all',
  });
}

/**
 * Hook for subscribing to user notifications
 */
export function useUserNotifications(userId: string) {
  const [notifications, setNotifications] = useState<RealtimeMessage[]>([]);

  const { isConnected, error, connect, disconnect } = useRealtime({
    channel: `user:${userId}`,
    onMessage: (message) => {
      if (message.type === 'notification') {
        setNotifications((prev) => [message, ...prev].slice(0, 50));
      }
    },
  });

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    isConnected,
    notifications,
    error,
    connect,
    disconnect,
    clearNotifications,
  };
}

/**
 * Hook for live stats updates
 */
export function useLiveStats() {
  const [stats, setStats] = useState<{
    totalPrograms?: number;
    totalClicks?: number;
    lastUpdated?: string;
  }>({});

  const { isConnected } = useRealtime({
    channel: 'stats:global',
    onMessage: (message) => {
      if (message.type === 'stats.updated') {
        setStats({
          ...message.data,
          lastUpdated: message.timestamp,
        } as typeof stats);
      }
    },
  });

  return {
    ...stats,
    isLive: isConnected,
  };
}
