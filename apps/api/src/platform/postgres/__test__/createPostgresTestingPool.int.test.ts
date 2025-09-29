import { createPostgresTestingPool } from "./createPostgresTestingPool";

describe("createPostgresTestingPool", () => {
  jest.setTimeout(60000);
  it("should start and exit gracefully", async () => {
    const pool = await createPostgresTestingPool();

    await pool.teardown();
  });
});
