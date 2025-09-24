import { paths } from './types';
type ExtractPathParams<T> = T extends {
    parameters: {
        path: infer P;
    };
} ? P : never;
type ExtractQueryParams<T> = T extends {
    parameters: {
        query?: infer Q;
    };
} ? Q : never;
type ExtractRequestBody<T> = T extends {
    requestBody: {
        content: {
            'application/json': infer R;
        };
    };
} ? R : never;
type ExtractSuccessResponse<T, Status extends number> = T extends {
    responses: Record<Status, {
        content: {
            'application/json': infer R;
        };
    }>;
} ? R : never;
export type ClientPathParams<P extends keyof paths, M extends keyof paths[P] = 'get'> = NonNullable<ExtractPathParams<paths[P][M]>>;
export type ClientQueryParams<P extends keyof paths, M extends keyof paths[P] = 'get'> = NonNullable<ExtractQueryParams<paths[P][M]>>;
export type ClientRequestBody<P extends keyof paths, M extends keyof paths[P] = 'post'> = NonNullable<ExtractRequestBody<paths[P][M]>>;
export type ClientResponse<P extends keyof paths, Status extends number = 200> = NonNullable<Exclude<{
    [M in keyof paths[P]]: ExtractSuccessResponse<paths[P][M], Status>;
}[keyof paths[P]], never>>;
export type ErrorResponse<P extends keyof paths> = ClientResponse<P, 400> | ClientResponse<P, 401> | ClientResponse<P, 403> | ClientResponse<P, 404> | ClientResponse<P, 409> | ClientResponse<P, 422> | ClientResponse<P, 500>;
export {};
