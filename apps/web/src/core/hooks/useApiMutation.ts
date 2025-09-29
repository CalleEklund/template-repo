import { useApiClient } from "./useApiClient";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

type ApiMutationFn<TData = unknown, TVariables = unknown> = (
  client: ReturnType<typeof useApiClient>,
  variables: TVariables,
) => Promise<TData>;

export const useApiMutation = <
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
>(
  options: Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    "mutationFn"
  > & { mutationFn: ApiMutationFn<TData, TVariables> },
) => {
  const client = useApiClient();

  return useMutation<TData, TError, TVariables, TContext>({
    ...options,
    mutationFn: (variables) => options.mutationFn(client, variables),
  });
};
