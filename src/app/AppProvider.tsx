import { StrictMode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/config/queryClient';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </StrictMode>
  );
}