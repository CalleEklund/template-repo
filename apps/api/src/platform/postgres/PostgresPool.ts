import { Logger } from "@nestjs/common";
import { ClientConfiguration, createPool, createTypeParserPreset, DatabasePool, type Interceptor, type QueryResultRow, SchemaValidationError } from "slonik";


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

export type PostgresPool = DatabasePool;

export const PostgresPool = Symbol("@template-repo/PostgresPool");

export const createPostgresPool = async (
  connectionUri: string,
  options: Partial<ClientConfiguration>,
  logger: Logger,
) => {
  return await createPool(connectionUri, {
    interceptors: [createResultParserInterceptor(logger)],
    typeParsers: [...createTypeParserPreset()],
    connectionTimeout: 10_000,
    idleTimeout: 30_000,
    maximumPoolSize: 20,
    connectionRetryLimit: 3,
    minimumPoolSize: 10,
    ...options,
  });
};
