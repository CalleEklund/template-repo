import { FC, ReactNode } from 'react';
import {
  QueryClient,
  QueryClientProvider as TanstackQueryClientProvider,
} from '@tanstack/react-query';

export const QueryClientProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const client = new QueryClient();
  return (
    <TanstackQueryClientProvider client={client}>
      {children}
    </TanstackQueryClientProvider>
  );
};
