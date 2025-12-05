/**
 * Real-time Updates System
 * Server-Sent Events (SSE) based real-time updates
 * Note: WebSocket requires custom server, SSE works with Next.js serverless
 */

import { NextRequest } from 'next/server';

// Event types for real-time updates
export type RealtimeEventType =
  | 'program.new'
  | 'program.updated'
  | 'click.recorded'
  | 'favorite.changed'
  | 'stats.updated'
  | 'notification'
  | 'heartbeat';

export interface RealtimeEvent {
  type: RealtimeEventType;
  data: Record<string, unknown>;
  timestamp: string;
  id?: string;
}

// Channel subscriptions (in-memory, use Redis pub/sub in production)
type ChannelCallback = (event: RealtimeEvent) => void;
const channels = new Map<string, Set<ChannelCallback>>();
const userChannels = new Map<string, Set<string>>(); // userId -> Set of channel names

/**
 * Subscribe to a channel
 */
export function subscribe(channel: string, callback: ChannelCallback): () => void {
  if (!channels.has(channel)) {
    channels.set(channel, new Set());
  }
  channels.get(channel)!.add(callback);

  // Return unsubscribe function
  return () => {
    const channelCallbacks = channels.get(channel);
    if (channelCallbacks) {
      channelCallbacks.delete(callback);
      if (channelCallbacks.size === 0) {
        channels.delete(channel);
      }
    }
  };
}

/**
 * Subscribe user to their personal channel
 */
export function subscribeUser(userId: string, channelName: string): void {
  if (!userChannels.has(userId)) {
    userChannels.set(userId, new Set());
  }
  userChannels.get(userId)!.add(channelName);
}

/**
 * Unsubscribe user from channel
 */
export function unsubscribeUser(userId: string, channelName: string): void {
  const userSubs = userChannels.get(userId);
  if (userSubs) {
    userSubs.delete(channelName);
  }
}

/**
 * Publish event to channel
 */
export function publish(channel: string, event: Omit<RealtimeEvent, 'timestamp'>): void {
  const fullEvent: RealtimeEvent = {
    ...event,
    timestamp: new Date().toISOString(),
    id: crypto.randomUUID(),
  };

  const callbacks = channels.get(channel);
  if (callbacks) {
    callbacks.forEach((callback) => {
      try {
        callback(fullEvent);
      } catch (error) {
        console.error('Error in realtime callback:', error);
      }
    });
  }
}

/**
 * Publish to all subscribers of a user
 */
export function publishToUser(userId: string, event: Omit<RealtimeEvent, 'timestamp'>): void {
  const userSubs = userChannels.get(userId);
  if (userSubs) {
    userSubs.forEach((channel) => publish(channel, event));
  }
}

/**
 * Broadcast to all connected clients on a channel pattern
 */
export function broadcast(channelPattern: string, event: Omit<RealtimeEvent, 'timestamp'>): void {
  const regex = new RegExp(channelPattern.replace('*', '.*'));
  channels.forEach((_, channel) => {
    if (regex.test(channel)) {
      publish(channel, event);
    }
  });
}

/**
 * Create SSE stream for client connection
 */
export function createSSEStream(
  request: NextRequest,
  channelName: string
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  let isActive = true;

  return new ReadableStream({
    start(controller) {
      // Send initial connection event
      const connectEvent = formatSSEMessage({
        type: 'notification',
        data: { message: 'Connected to real-time updates', channel: channelName },
        timestamp: new Date().toISOString(),
      });
      controller.enqueue(encoder.encode(connectEvent));

      // Subscribe to channel
      const unsubscribe = subscribe(channelName, (event) => {
        if (isActive) {
          const message = formatSSEMessage(event);
          controller.enqueue(encoder.encode(message));
        }
      });

      // Heartbeat to keep connection alive
      const heartbeatInterval = setInterval(() => {
        if (isActive) {
          const heartbeat = formatSSEMessage({
            type: 'heartbeat',
            data: {},
            timestamp: new Date().toISOString(),
          });
          controller.enqueue(encoder.encode(heartbeat));
        }
      }, 30000); // 30 second heartbeat

      // Handle client disconnect
      request.signal.addEventListener('abort', () => {
        isActive = false;
        clearInterval(heartbeatInterval);
        unsubscribe();
        controller.close();
      });
    },
    cancel() {
      isActive = false;
    },
  });
}

/**
 * Format event as SSE message
 */
function formatSSEMessage(event: RealtimeEvent): string {
  const lines: string[] = [];

  if (event.id) {
    lines.push(`id: ${event.id}`);
  }
  lines.push(`event: ${event.type}`);
  lines.push(`data: ${JSON.stringify(event.data)}`);
  lines.push(''); // Empty line to end message

  return lines.join('\n') + '\n';
}

/**
 * Real-time event helpers
 */
export const RealtimeEvents = {
  /**
   * Notify about new program
   */
  newProgram(program: { id: string; name: string; category?: string; networkName?: string }): void {
    broadcast('programs:*', {
      type: 'program.new',
      data: program,
    });
  },

  /**
   * Notify about program update
   */
  programUpdated(programId: string, changes: Record<string, unknown>): void {
    publish(`program:${programId}`, {
      type: 'program.updated',
      data: { programId, changes },
    });
    broadcast('programs:*', {
      type: 'program.updated',
      data: { programId, changes },
    });
  },

  /**
   * Notify about click recorded
   */
  clickRecorded(programId: string, clickData: { source?: string }): void {
    publish(`program:${programId}`, {
      type: 'click.recorded',
      data: { programId, ...clickData },
    });
  },

  /**
   * Notify user about favorite change
   */
  favoriteChanged(userId: string, action: 'added' | 'removed', programId: string): void {
    publishToUser(userId, {
      type: 'favorite.changed',
      data: { action, programId },
    });
  },

  /**
   * Broadcast stats update
   */
  statsUpdated(stats: { totalPrograms: number; totalClicks: number }): void {
    broadcast('stats:*', {
      type: 'stats.updated',
      data: stats,
    });
  },

  /**
   * Send notification to user
   */
  notify(
    userId: string,
    notification: {
      title: string;
      message: string;
      type?: 'info' | 'success' | 'warning' | 'error';
    }
  ): void {
    publishToUser(userId, {
      type: 'notification',
      data: notification,
    });
  },
};

/**
 * React hook helper - returns connection info for client
 */
export function getSSEEndpoint(channel: string): string {
  return `/api/realtime?channel=${encodeURIComponent(channel)}`;
}

/**
 * Client-side SSE connection class
 */
export class RealtimeClient {
  private eventSource: EventSource | null = null;
  private handlers = new Map<RealtimeEventType, Set<(data: unknown) => void>>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(private channel: string) {}

  connect(): void {
    if (typeof window === 'undefined') return;

    const url = getSSEEndpoint(this.channel);
    this.eventSource = new EventSource(url);

    this.eventSource.onopen = () => {
      this.reconnectAttempts = 0;
      console.log('Realtime connected');
    };

    this.eventSource.onerror = () => {
      this.eventSource?.close();
      this.attemptReconnect();
    };

    // Set up event listeners
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
      this.eventSource?.addEventListener(eventType, (event) => {
        const data = JSON.parse((event as MessageEvent).data);
        this.handlers.get(eventType)?.forEach((handler) => handler(data));
      });
    });
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      setTimeout(() => this.connect(), delay);
    }
  }

  on(eventType: RealtimeEventType, handler: (data: unknown) => void): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler);

    return () => {
      this.handlers.get(eventType)?.delete(handler);
    };
  }

  disconnect(): void {
    this.eventSource?.close();
    this.eventSource = null;
    this.handlers.clear();
  }
}
