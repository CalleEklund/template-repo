import {
  QueryClient,
  QueryClientProvider as TanstackQueryClientProvider,
} from "@tanstack/react-query";
import { FC, ReactNode } from "react";

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
