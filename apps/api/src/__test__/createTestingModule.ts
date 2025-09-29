import { ModuleMetadata } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { Server } from "node:http";
import request from "supertest";
import { PostgresModule } from "~/platform/postgres";

export type TestingModule = Awaited<ReturnType<typeof createTestingModule>>;

export async function createTestingModule(
  meta?: ModuleMetadata,
  platformServices?: {
    postgres?: boolean;
    nats?: boolean;
  },
) {
  const path = __dirname + "/../../schema.sql";

  const postgresContainer = platformServices?.postgres
    ? await new PostgreSqlContainer("postgres:17.3-alpine")
        .withCopyFilesToContainer([
          {
            source: path,
            target: "/docker-entrypoint-initdb.d/init.sql",
          },
        ])
        .start()
    : null;

  const imports = [];

  if (platformServices?.postgres) {
    imports.push(
      PostgresModule.forRootAsync({
        useFactory: () => ({
          connectionUri: postgresContainer?.getConnectionUri() ?? "",
          connectionOptions: {
            minimumPoolSize: 0,
          },
        }),
      }),
    );
  }

  const module = await Test.createTestingModule({
    imports: [...(meta?.imports ?? []), ...imports],
    controllers: [...(meta?.controllers ?? [])],
    providers: [...(meta?.providers ?? [])],
    exports: [...(meta?.exports ?? [])],
  }).compile();

  const app = module.createNestApplication();

  app.enableVersioning();

  await app.init();

  const httpClient = request(app.getHttpServer() as Server);

  return {
    app: app,
    httpClient: httpClient,
    teardown: async () => {
      if (platformServices?.postgres) {
        await postgresContainer?.stop();
      }

      await app.close();
    },
  };
}
