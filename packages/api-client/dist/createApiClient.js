import { Fetcher } from "openapi-typescript-fetch";
export const createApiClient = (baseUrl) => {
    const client = Fetcher.for();
    client.configure({ baseUrl });
    return {
        user: {
            register: client.path("/v1/user/register").method("post").create(),
        },
    };
};
//# sourceMappingURL=createApiClient.js.map