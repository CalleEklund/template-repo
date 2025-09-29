import { createPostgresPool } from "../PostgresPool";
import { setupPostgresContainer } from "./setupPostgresContainer";
import { Logger } from "@nestjs/common";

export const createPostgresTestingPool = async () => {
  const postgresContainer = await setupPostgresContainer();
  const pool = await createPostgresPool(
    postgresContainer.connectionUri,
    {},
    new Logger(),
  );
  return {
    pool,
    teardown: async () => {
      await pool.end();
      await postgresContainer.teardown();
    },
  };
};
