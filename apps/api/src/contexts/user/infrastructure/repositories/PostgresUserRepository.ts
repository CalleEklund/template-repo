import { User } from "../../domain/entities";
import { IUserRepository } from "../../domain/repositories";
import { PostgresUserRowSchema } from "../schemas";
import { Injectable, Logger } from "@nestjs/common";
import { sql, type DatabasePool } from "slonik";
import { InjectPgPool } from "~/platform/postgres";

@Injectable()
export class PostgresUserRepository implements IUserRepository {
  private readonly logger = new Logger(PostgresUserRepository.name);
  constructor(@InjectPgPool() private readonly pool: DatabasePool) {}
  async save(user: User): Promise<User> {
    try {
      const query = sql.type(PostgresUserRowSchema)`
        INSERT INTO users
        (id, username, email, created_at)
        VALUES
        (${user.id}, ${user.username}, ${user.email}, ${user.createdAt.toISOString()})
        `;
      await this.pool.query(query);
      return user;
    } catch (error) {
      this.logger.error("Error saving user", error);
      throw new Error(`Error saving user info: ${error}`);
    }
  }
}
