import { Fetcher, FetchReturnType, Middleware } from 'openapi-typescript-fetch';
import { paths } from './types.js';

export const createApiClient = (url: string, middleware?: Middleware[]) => {
  const client = Fetcher.for<paths>();
  client.configure({
    baseUrl: url,
    init: {
      credentials: 'include',
    },
    use: middleware,
  });

  return {
    test: {
      helloWorld: client.path('/v1/users').method('post').create(),
    },
  };
};

export type ClientEndpoints = ReturnType<typeof createApiClient>;

export type FetchReturnTypeByPath<
  T,
  K1 extends keyof T,
  K2 extends keyof T[K1],
> = FetchReturnType<T[K1][K2]>;
