// SWR cache provider with localStorage persistence
const CACHE_PREFIX = "swr_cache_";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const cacheProvider = () => {
  const map = new Map();

  // Load persisted cache from localStorage on init
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("swr_cache_data");
      if (stored) {
        const data = JSON.parse(stored);
        Object.entries(data).forEach(([key, { value, timestamp }]) => {
          // Only load if not expired
          if (Date.now() - timestamp < CACHE_DURATION) {
            map.set(key, value);
          }
        });
      }
    } catch (error) {
      console.error("Failed to load SWR cache from localStorage:", error);
    }
  }

  // Periodically persist cache to localStorage
  if (typeof window !== "undefined") {
    const persistCache = () => {
      try {
        const data = {};
        map.forEach((value, key) => {
          data[key] = {
            value,
            timestamp: Date.now(),
          };
        });
        localStorage.setItem("swr_cache_data", JSON.stringify(data));
      } catch (error) {
        console.error("Failed to persist SWR cache to localStorage:", error);
      }
    };

    // Persist on every update (debounced via interval)
    const interval = setInterval(persistCache, 5000);
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", persistCache);
    }
  }

  return {
    get: (key) => map.get(key),
    set: (key, value) => {
      map.set(key, value);
    },
    del: (key) => {
      map.delete(key);
    },
    clear: () => {
      map.clear();
      if (typeof window !== "undefined") {
        localStorage.removeItem("swr_cache_data");
      }
    },
  };
};
