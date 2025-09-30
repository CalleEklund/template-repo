import { PostgresUserRepository } from "../PostgresUserRepository";
import { User } from "~/contexts/user/domain/entities";
import { createPostgresTestingPool } from "~/platform/postgres/__test__";

describe("PostgresUserRepository", () => {
  let repository: PostgresUserRepository;
  let teardown: () => Promise<void>;

  beforeEach(async () => {
    const testing = await createPostgresTestingPool();
    repository = new PostgresUserRepository(testing.pool);
    teardown = testing.teardown;
  });

  afterEach(async () => {
    await teardown();
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });

  it("shoule save user", async () => {
    const user = User.create({
      email: "test@gmail.com",
      username: "test",
    });
    await expect(repository.save(user)).resolves.toEqual(user);
  });
});
