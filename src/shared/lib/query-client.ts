import { QueryClient } from '@tanstack/react-query';

/**
 * Central QueryClient instance for the entire app.
 *
 * Default settings explained:
 * ─────────────────────────────────────────────────────
 * • staleTime (60s):  Data is considered "fresh" for 60 seconds.
 *   During this window, navigating to a screen that uses the same
 *   query will NOT trigger a new network request — it reads from cache.
 *   Think of it as Doctrine's result cache TTL.
 *
 * • gcTime (5min):    "Garbage Collection Time" (formerly cacheTime).
 *   After a query has NO active observers (no mounted component using it)
 *   for this duration, the cached data is garbage-collected.
 *
 * • retry (2):        Failed requests auto-retry twice with exponential
 *   backoff before surfacing the error to the UI.
 *
 * • refetchOnWindowFocus (true): When the user switches back to the app
 *   (e.g., after checking WhatsApp at the gym), stale queries will
 *   silently refetch in the background.
 * ─────────────────────────────────────────────────────
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60,         // 60 seconds
            gcTime: 1000 * 60 * 5,        // 5 minutes
            retry: 2,
            refetchOnWindowFocus: true,
        },
    },
});
