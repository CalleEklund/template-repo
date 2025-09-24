import {
  POSTGRES_MODULE_OPTIONS_KEY,
  PostgresModuleOptions,
} from './PostgresModuleOptions';
import { FactoryProvider, Inject } from '@nestjs/common';
import migrate from 'node-pg-migrate';
import { Client } from 'pg';
import { createPool } from 'slonik';

const KEY = Symbol('POSTGRES_POOL');

export const PostgresPoolProvider = (): FactoryProvider => ({
  provide: KEY,
  inject: [POSTGRES_MODULE_OPTIONS_KEY],
  useFactory: async (options: PostgresModuleOptions) => {
    if (!options.postgres) {
      return undefined;
    }

    if (options.migrate && options.migrationDirectory) {
      const client = new Client(options.postgres.connectionUri);
      await client.connect();
      await migrate({
        dbClient: client,
        migrationsTable: 'migration',
        direction: 'up',
        dir: options.migrationDirectory,
        // eslint-disable-next-line no-console
        log: options.logging === false ? () => null : console.log,
      });

      await client.end();
    }

    const pool = await createPool(options.postgres.connectionUri);

    return pool;
  },
});

export const InjectPostgresPool = () => Inject(KEY);
