import { Injectable } from '@nestjs/common';
import { CreateUser, UserSchema } from './types';
import { InjectPostgresPool, PostgresPool, sql } from '../postgres';

@Injectable()
export class UserRepository {
  constructor(@InjectPostgresPool() private readonly pool: PostgresPool) {}

  public async create(data: CreateUser) {
    const query = sql.type(UserSchema)`
        insert into users (email) values (${data.email}) 
        returning *`;
    const row = await this.pool.one(query);
    return row;
  }
}
