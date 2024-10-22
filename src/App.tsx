import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree';

const queryClient = new QueryClient();

const router = new Router({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;