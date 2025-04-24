import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { useEffect, useState } from 'react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
}

interface CacheOptions {
  key?: string;
  ttl?: number; // Time to live in milliseconds
}

export function useDataLoader<T>(
  loadData: () => Promise<T>,
  dependencies: any[] = [],
  eventNames: string[] = [],
  cacheOptions?: CacheOptions
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  refreshing: boolean;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getCachedData = () => {
    if (!cacheOptions?.key) return null;
    const cached = localStorage.getItem(cacheOptions.key);
    if (!cached) return null;

    try {
      const { data, timestamp } = JSON.parse(cached);
      if (cacheOptions.ttl && Date.now() - timestamp > cacheOptions.ttl) {
        localStorage.removeItem(cacheOptions.key);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  };

  const setCachedData = (data: T) => {
    if (!cacheOptions?.key) return;
    const cache = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(cacheOptions.key, JSON.stringify(cache));
  };

  const refresh = async () => {
    try {
      setRefreshing(true);
      const result = await loadData();
      setData(result);
      setCachedData(result);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        // Try to get cached data first
        const cached = getCachedData();
        if (cached) {
          setData(cached);
          setLoading(false);
          // Refresh in background if TTL is close to expiring
          if (cacheOptions?.ttl && cacheOptions.key) {
            const cached = localStorage.getItem(cacheOptions.key);
            if (cached) {
              const { timestamp } = JSON.parse(cached);
              if (Date.now() - timestamp > cacheOptions.ttl * 0.8) {
                refresh();
              }
            }
          }
          return;
        }

        // If no cache or expired, load fresh data
        const result = await loadData();
        if (mounted) {
          setData(result);
          setCachedData(result);
          setError(null);
        }
      } catch (e) {
        if (mounted) {
          setError(e instanceof Error ? e : new Error('An error occurred'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    const handleUpdate = () => {
      refresh();
    };

    eventNames.forEach(eventName => {
      window.addEventListener(eventName, handleUpdate);
    });

    return () => {
      mounted = false;
      eventNames.forEach(eventName => {
        window.removeEventListener(eventName, handleUpdate);
      });
    };
  }, dependencies);

  return { data, loading, error, refresh, refreshing };
}
