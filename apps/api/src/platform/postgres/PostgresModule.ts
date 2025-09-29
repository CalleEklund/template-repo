import { AsyncOptions } from "../../types";
import { PostgresModuleOptions } from "./PostgresModuleOptions";
import { createPostgresPool, PostgresPool } from "./PostgresPool";
import { DynamicModule, FactoryProvider, Logger, Module } from "@nestjs/common";
import {
  type Interceptor,
  type QueryResultRow,
  SchemaValidationError,
} from "slonik";

export const MODULE_OPTIONS_KEY = Symbol("POSTGRES_MODULE_OPTIONS");

const createResultParserInterceptor = (logger: Logger): Interceptor => {
  return {
    // If you are not going to transform results using Zod, then you should use `afterQueryExecution` instead.
    // Future versions of Zod will provide a more efficient parser when parsing without transformations.
    // You can even combine the two – use `afterQueryExecution` to validate results, and (conditionally)
    // transform results as needed in `transformRow`.
    transformRow: async (executionContext, actualQuery, row) => {
      const { resultParser } = executionContext;

      if (!resultParser) {
        return row;
      }

      // It is recommended (but not required) to parse async to avoid blocking the event loop during validation
      const validationResult = await resultParser.safeParseAsync(row);

      if (!validationResult.success) {
        logger.error(
          `Error parsing row: ${JSON.stringify(row)}, error: ${validationResult.error}`,
        );

        throw new SchemaValidationError(
          actualQuery,
          row,
          validationResult.error.issues,
        );
      }

      return validationResult.data as QueryResultRow;
    },
  };
};

@Module({})
export class PostgresModule {
  public static forRootAsync(
    options: AsyncOptions<PostgresModuleOptions>,
  ): DynamicModule {
    const logger = new Logger(PostgresModule.name);

    const ModuleOptionsProvider: FactoryProvider = {
      inject: options.inject ?? [],
      provide: MODULE_OPTIONS_KEY,
      useFactory: options.useFactory,
    };

    const PoolProvider: FactoryProvider = {
      provide: PostgresPool,
      inject: [MODULE_OPTIONS_KEY],
      useFactory: async (options: PostgresModuleOptions) => {
        const pool = await createPostgresPool(
          `${options.connectionUri}?application_name=api`,
          {
            connectionTimeout: 10_000,
            idleTimeout: 30_000,
            maximumPoolSize: 20,
            connectionRetryLimit: 3,
            minimumPoolSize: 10,
            interceptors: [createResultParserInterceptor(logger)],
            ...options.connectionOptions,
          },
          logger,
        );

        return pool;
      },
    };

    return {
      module: PostgresModule,
      global: true,
      providers: [ModuleOptionsProvider, PoolProvider],
      exports: [PoolProvider],
    };
  }
}
