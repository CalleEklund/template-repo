import { paths } from "./types";
import { Fetcher, FetchReturnType } from "openapi-typescript-fetch";

export const createApiClient = (baseUrl: string) => {
  const client = Fetcher.for<paths>();
  client.configure({ baseUrl });

  return {
    user: {
      register: client.path("/v1/user/register").method("post").create(),
    },
  };
};

export type ClientEndpoints = ReturnType<typeof createApiClient>;

export type FetchReturnTypeByPath<
  T,
  K1 extends keyof T,
  K2 extends keyof T[K1],
> = FetchReturnType<T[K1][K2]>;
