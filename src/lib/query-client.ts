import { QueryClient, isServer } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: { retry: 0 },
    },
  });
}

let browserClient: QueryClient | undefined;

// New client per request on the server, one shared client in the browser.
export function getQueryClient() {
  if (isServer) return makeQueryClient();
  browserClient ??= makeQueryClient();
  return browserClient;
}
