import { InjectPostgresPool } from './PostgresPoolProvider';
import { OnModuleDestroy } from '@nestjs/common';
import { DatabasePool } from 'slonik';

export class ConnectionEnder implements OnModuleDestroy {
  constructor(@InjectPostgresPool() private readonly pool: DatabasePool) {}
  public async onModuleDestroy() {
    await this.pool.end();
  }
}
