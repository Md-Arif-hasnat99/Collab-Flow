import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import type { ReactNode } from 'react';
import { queryClient } from '../lib/query-client';
import { AuthProvider } from '../features/auth/hooks/useAuth';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#FFFFFF',
              color: '#111111',
              border: '2px solid #171717',
              borderRadius: '4px',
              fontFamily: '"Inter", system-ui, sans-serif',
              fontSize: '14px',
              boxShadow: '0 2px 0 #171717',
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}
