'use client';

import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface ServiceWorkerUpdateInfo {
  isUpdateAvailable: boolean;
  updateServiceWorker: () => void;
}

/**
 * Hook to manage PWA installation
 */
export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (typeof window !== 'undefined') {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
      setIsInstalled(isStandalone);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      }
    } catch (error) {
      console.error('Error installing PWA:', error);
    }

    return false;
  }, [deferredPrompt]);

  return {
    isInstalled,
    isInstallable,
    install,
  };
}

/**
 * Hook to manage Service Worker updates
 */
export function useServiceWorkerUpdate(): ServiceWorkerUpdateInfo {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    const handleUpdate = () => {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration?.waiting) {
          setWaitingWorker(registration.waiting);
          setIsUpdateAvailable(true);
        }
      });
    };

    // Check for updates on load
    handleUpdate();

    // Listen for controller changes (new SW activated)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });

    // Check periodically for updates
    const interval = setInterval(handleUpdate, 60 * 1000); // Every minute

    return () => clearInterval(interval);
  }, []);

  const updateServiceWorker = useCallback(() => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  }, [waitingWorker]);

  return {
    isUpdateAvailable,
    updateServiceWorker,
  };
}

/**
 * Hook to detect online/offline status
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

/**
 * Hook to manage PWA display mode
 */
export function useDisplayMode() {
  const [displayMode, setDisplayMode] = useState<'browser' | 'standalone' | 'fullscreen'>(
    'browser'
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateDisplayMode = () => {
      if (window.matchMedia('(display-mode: fullscreen)').matches) {
        setDisplayMode('fullscreen');
      } else if (window.matchMedia('(display-mode: standalone)').matches) {
        setDisplayMode('standalone');
      } else {
        setDisplayMode('browser');
      }
    };

    updateDisplayMode();

    const mqStandalone = window.matchMedia('(display-mode: standalone)');
    const mqFullscreen = window.matchMedia('(display-mode: fullscreen)');

    mqStandalone.addEventListener('change', updateDisplayMode);
    mqFullscreen.addEventListener('change', updateDisplayMode);

    return () => {
      mqStandalone.removeEventListener('change', updateDisplayMode);
      mqFullscreen.removeEventListener('change', updateDisplayMode);
    };
  }, []);

  return displayMode;
}

/**
 * Hook to register and manage push notifications
 */
export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkSupport = () => {
      const supported =
        'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
      setIsSupported(supported);

      if (supported) {
        setPermission(Notification.permission);
      }
    };

    checkSupport();
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch {
      return false;
    }
  }, [isSupported]);

  const subscribe = useCallback(
    async (vapidPublicKey: string): Promise<PushSubscription | null> => {
      if (!isSupported || permission !== 'granted') return null;

      try {
        const registration = await navigator.serviceWorker.ready;
        const sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });

        setSubscription(sub);
        return sub;
      } catch (error) {
        console.error('Failed to subscribe to push notifications:', error);
        return null;
      }
    },
    [isSupported, permission]
  );

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!subscription) return false;

    try {
      await subscription.unsubscribe();
      setSubscription(null);
      return true;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  }, [subscription]);

  return {
    isSupported,
    permission,
    subscription,
    requestPermission,
    subscribe,
    unsubscribe,
  };
}

// Helper function to convert VAPID key to ArrayBuffer
function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer as ArrayBuffer;
}

/**
 * Comprehensive PWA hook combining all features
 */
export function usePWA() {
  const install = usePWAInstall();
  const update = useServiceWorkerUpdate();
  const isOnline = useOnlineStatus();
  const displayMode = useDisplayMode();
  const push = usePushNotifications();

  return {
    // Installation
    isInstalled: install.isInstalled,
    isInstallable: install.isInstallable,
    install: install.install,

    // Updates
    isUpdateAvailable: update.isUpdateAvailable,
    updateServiceWorker: update.updateServiceWorker,

    // Connectivity
    isOnline,

    // Display
    displayMode,
    isStandalone: displayMode === 'standalone' || displayMode === 'fullscreen',

    // Push notifications
    push: {
      isSupported: push.isSupported,
      permission: push.permission,
      subscription: push.subscription,
      requestPermission: push.requestPermission,
      subscribe: push.subscribe,
      unsubscribe: push.unsubscribe,
    },
  };
}
