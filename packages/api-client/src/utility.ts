import { paths } from './types';

// =========================
// 1. PARAMETER EXTRACTION
// =========================

// Path parameters (e.g., /users/{id})
type ExtractPathParams<T> = T extends { parameters: { path: infer P } }
  ? P
  : never;

// Query parameters (e.g., ?filter=active)
type ExtractQueryParams<T> = T extends { parameters: { query?: infer Q } }
  ? Q
  : never;

type ExtractRequestBody<T> = T extends {
  requestBody: { content: { 'application/json': infer R } };
}
  ? R
  : never;

// Helper to extract successful responses (200, 201, etc.)
type ExtractSuccessResponse<T, Status extends number> = T extends {
  responses: Record<Status, { content: { 'application/json': infer R } }>;
}
  ? R
  : never;
// =========================
// 2. CLIENT TYPES (STRICT)
// =========================

// For PATH parameters (non-undefined)
export type ClientPathParams<
  P extends keyof paths,
  M extends keyof paths[P] = 'get',
> = NonNullable<ExtractPathParams<paths[P][M]>>;

// For QUERY parameters (non-undefined)
export type ClientQueryParams<
  P extends keyof paths,
  M extends keyof paths[P] = 'get',
> = NonNullable<ExtractQueryParams<paths[P][M]>>;

// For REQUEST BODY (non-undefined)
export type ClientRequestBody<
  P extends keyof paths,
  M extends keyof paths[P] = 'post',
> = NonNullable<ExtractRequestBody<paths[P][M]>>;

// Path-specific response union (for all methods with success responses)
export type ClientResponse<
  P extends keyof paths,
  Status extends number = 200,
> = NonNullable<
  Exclude<
    {
      [M in keyof paths[P]]: ExtractSuccessResponse<paths[P][M], Status>;
    }[keyof paths[P]],
    never
  >
>;

// Union of all error responses for a given path (all methods)
export type ErrorResponse<P extends keyof paths> =
  | ClientResponse<P, 400>
  | ClientResponse<P, 401>
  | ClientResponse<P, 403>
  | ClientResponse<P, 404>
  | ClientResponse<P, 409>
  | ClientResponse<P, 422>
  | ClientResponse<P, 500>;
