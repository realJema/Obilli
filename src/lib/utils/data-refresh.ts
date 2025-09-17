// Utility functions for background data refresh and caching strategies

// Type for our cached data with metadata
interface CachedData<T> {
  data: T;
  timestamp: number;
  isStale: boolean;
}

// Cache storage for background refresh
const backgroundCache = new Map<string, CachedData<unknown>>();

// Function to create a background refresh wrapper for functions with parameters
export function withBackgroundRefresh<T, P extends unknown[]>(
  key: string,
  fetchFn: (...params: P) => Promise<T>,
  staleTime: number = 5 * 60 * 1000 // 5 minutes default
): (...params: P) => Promise<T> {
  return async (...params: P): Promise<T> => {
    // Create a unique key based on parameters
    const cacheKey = `${key}_${JSON.stringify(params)}`;
    const cached = backgroundCache.get(cacheKey);
    const now = Date.now();
    
    // If we have cached data and it's not stale, return it immediately
    if (cached && (now - cached.timestamp) < staleTime) {
      return cached.data as T;
    }
    
    // If we have stale data, return it immediately and refresh in background
    if (cached && cached.isStale) {
      // Refresh in background without blocking
      fetchFn(...params).then(data => {
        backgroundCache.set(cacheKey, {
          data,
          timestamp: now,
          isStale: false
        });
      }).catch(error => {
        console.warn(`Background refresh failed for ${cacheKey}:`, error);
      });
      
      return cached.data as T;
    }
    
    // If no cached data, fetch and return
    try {
      const data = await fetchFn(...params);
      backgroundCache.set(cacheKey, {
        data,
        timestamp: now,
        isStale: false
      });
      return data;
    } catch (error) {
      console.error(`Failed to fetch data for ${cacheKey}:`, error);
      throw error;
    }
  };
}

// Function to mark data as stale (for manual invalidation)
export function markAsStale(key: string): void {
  // Mark all entries with this key prefix as stale
  for (const [cacheKey, cached] of backgroundCache.entries()) {
    if (cacheKey.startsWith(key)) {
      backgroundCache.set(cacheKey, {
        ...cached,
        isStale: true
      });
    }
  }
}

// Function to clear cache for a key
export function clearCache(key: string): void {
  // Clear all entries with this key prefix
  for (const cacheKey of backgroundCache.keys()) {
    if (cacheKey.startsWith(key)) {
      backgroundCache.delete(cacheKey);
    }
  }
}

// Function to clear all cache
export function clearAllCache(): void {
  backgroundCache.clear();
}