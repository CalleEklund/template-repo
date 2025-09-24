import { useApiMutation, useApiQuery } from '@/core/hooks';
import { ApiClient } from '@/core/types';

type Variables = Parameters<ApiClient['test']['helloWorld']>[0];

export const useCreateUser = () => {
  return useApiMutation({
    mutationFn: async (client, variables: Variables) => {
      return await client.test.helloWorld(variables);
    },
  });
};
