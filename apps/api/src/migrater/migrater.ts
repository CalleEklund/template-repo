import { ConfigurationService } from '../configuration';
import { Injectable } from '@nestjs/common';
import migrate from 'node-pg-migrate';
import { Client } from 'pg';

@Injectable()
export class Migrater {
  constructor(private readonly configurationService: ConfigurationService) {}
  async migrate(direction: 'up' | 'down') {
    const dbUrl = this.configurationService.get().postgres.connectionUri;
    const client = new Client(dbUrl);
    await client.connect();

    await migrate({
      dbClient: client,
      migrationsTable: 'migration',
      direction,
      dir: 'migrations',
      // eslint-disable-next-line no-console
      log: console.log,
    });
    await client.end();
  }
}
