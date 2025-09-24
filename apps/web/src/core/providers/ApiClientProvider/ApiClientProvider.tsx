import { createContext, FC, ReactNode } from 'react';
import { z } from 'zod';
import { createApiClient } from '@template-repo/api-client';

const ApplicationConfigurationSchema = z.object({
  api: z.object({
    url: z.string().url(),
  }),
});

export const configuration = (() => {
  return ApplicationConfigurationSchema.parse({
    api: {
      url: import.meta.env.VITE_API_URL,
    },
  });
})();

const client = createApiClient(configuration.api.url, []);

export const ApiClientContext = createContext(client);

export const ApiClientProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <ApiClientContext.Provider value={client}>
      {children}
    </ApiClientContext.Provider>
  );
};
