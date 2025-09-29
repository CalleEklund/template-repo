import { useApiMutation } from "~/core/hooks";
import { ApiClient } from "~/core/types";

type Variables = Parameters<ApiClient["user"]["register"]>[0];

export const useCreateUser = () => {
  return useApiMutation({
    mutationFn: async (client, variables: Variables) => {
      return await client.user.register(variables);
    },
  });
};
