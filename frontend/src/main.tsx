import React from 'react';
import ReactDOM from 'react-dom/client';
import { dehydrate, hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

const queryCacheKey = 'flavorflow_query_cache';
const queryCacheMaxAge = 5 * 60 * 1000;
const isMaintenanceQuery = (queryKey: readonly unknown[]) =>
  queryKey[0] === 'publicMaintenanceSettings' || queryKey[0] === 'adminMaintenanceSettings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: queryCacheMaxAge,
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnMount: true
    },
    mutations: {
      retry: 0
    }
  }
});

try {
  const storedCache = sessionStorage.getItem(queryCacheKey);
  if (storedCache) {
    const parsedCache = JSON.parse(storedCache) as { timestamp: number; state: ReturnType<typeof dehydrate> };
    if (Date.now() - parsedCache.timestamp <= queryCacheMaxAge) {
      hydrate(queryClient, parsedCache.state);
      queryClient.removeQueries({ queryKey: ['publicMaintenanceSettings'], exact: true });
      queryClient.removeQueries({ queryKey: ['adminMaintenanceSettings'], exact: true });
    } else {
      sessionStorage.removeItem(queryCacheKey);
    }
  }
} catch {
  sessionStorage.removeItem(queryCacheKey);
}

queryClient.getQueryCache().subscribe(() => {
  try {
    sessionStorage.setItem(queryCacheKey, JSON.stringify({
      timestamp: Date.now(),
      state: dehydrate(queryClient, {
        shouldDehydrateQuery: (query) =>
          query.state.status === 'success' && !isMaintenanceQuery(query.queryKey)
      })
    }));
  } catch {
    sessionStorage.removeItem(queryCacheKey);
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
