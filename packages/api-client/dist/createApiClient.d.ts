import { FetchReturnType } from "openapi-typescript-fetch";
export declare const createApiClient: (baseUrl: string) => {
    user: {
        register: import("openapi-typescript-fetch").TypedFetch<{
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        username: string;
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
                            user: {
                                id: string;
                                username: string;
                                email: string;
                                createdAt: string;
                            };
                        };
                    };
                };
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            status_code: 500;
                            error_code: "INTERNAL_SERVER_ERROR";
                            error_message: string;
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