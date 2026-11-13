import { useState, useEffect, useCallback } from 'react';

export interface OnlineStatusState {
  isOnline: boolean;
  isSimulatedOffline: boolean;
  effectiveOnline: boolean;
  isReadOnly: boolean;
  lastOnlineAt: string;
  offlineSince: string | null;
}

const SIMULATE_OFFLINE_KEY = 'mandela_simulate_offline_readonly';

/**
 * Hook to monitor online/offline status with Workbox cache read-only protection.
 * Supports manual simulation for testing remote African infrastructure disconnection.
 */
export function useOnlineStatus() {
  const [isBrowserOnline, setIsBrowserOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(SIMULATE_OFFLINE_KEY) === 'true';
    }
    return false;
  });

  const [lastOnlineAt, setLastOnlineAt] = useState<string>(() => new Date().toISOString());
  const [offlineSince, setOfflineSince] = useState<string | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsBrowserOnline(true);
      setLastOnlineAt(new Date().toISOString());
      setOfflineSince(null);
    };

    const handleOffline = () => {
      setIsBrowserOnline(false);
      setOfflineSince(new Date().toISOString());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleSimulateOffline = useCallback(() => {
    setIsSimulatedOffline((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem(SIMULATE_OFFLINE_KEY, String(next));
      }
      if (next) {
        setOfflineSince(new Date().toISOString());
      } else {
        setLastOnlineAt(new Date().toISOString());
        setOfflineSince(null);
      }
      return next;
    });
  }, []);

  // Application is read-only if real network is disconnected OR offline simulation is active
  const effectiveOnline = isBrowserOnline && !isSimulatedOffline;
  const isReadOnly = !effectiveOnline;

  return {
    isOnline: effectiveOnline,
    isBrowserOnline,
    isSimulatedOffline,
    isReadOnly,
    lastOnlineAt,
    offlineSince,
    toggleSimulateOffline
  };
}
