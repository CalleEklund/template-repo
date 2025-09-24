import { Fetcher } from 'openapi-typescript-fetch';
export const createApiClient = (url, middleware) => {
    const client = Fetcher.for();
    client.configure({
        baseUrl: url,
        init: {
            credentials: 'include',
        },
        use: middleware,
    });
    return {
        test: {
            helloWorld: client.path('/v1/helloWorld').method('get').create(),
        },
    };
};
//# sourceMappingURL=createApiClient.js.map