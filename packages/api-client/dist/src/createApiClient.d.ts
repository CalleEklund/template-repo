import { FetchReturnType, Middleware } from 'openapi-typescript-fetch';
export declare const createApiClient: (url: string, middleware?: Middleware[]) => {
    test: {
        helloWorld: import("openapi-typescript-fetch").TypedFetch<{
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        email: string;
                    };
                };
            };
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            id: string;
                            email: string;
                        };
                    };
                };
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            status: 500;
                            messages: {
                                code: "http/internal-server-error";
                                message: string;
                            }[];
                        };
                    };
                };
            };
        }>;
    };
};
export type ClientEndpoints = ReturnType<typeof createApiClient>;
export type FetchReturnTypeByPath<T, K1 extends keyof T, K2 extends keyof T[K1]> = FetchReturnType<T[K1][K2]>;
//# sourceMappingURL=createApiClient.d.ts.map