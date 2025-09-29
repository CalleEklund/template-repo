import { useApiClient } from "./useApiClient";
import {
  QueryFunctionContext,
  QueryKey,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";

type ApiQueryFn<T = unknown, TQueryKey extends QueryKey = QueryKey> = (
  client: ReturnType<typeof useApiClient>,
  context: QueryFunctionContext<TQueryKey>,
) => T | Promise<T>;

export const useApiQuery = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    "queryFn"
  > & { queryFn: ApiQueryFn<TQueryFnData, TQueryKey> },
) => {
  const client = useApiClient();
  return useQuery<TQueryFnData, TError, TData, TQueryKey>({
    ...options,
    queryFn: (context) => options.queryFn(client, context),
  });
};
