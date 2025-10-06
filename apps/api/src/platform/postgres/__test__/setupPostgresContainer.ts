import { PostgreSqlContainer } from "@testcontainers/postgresql";

// import { GenericContainer, Wait } from "testcontainers";

// const setupAtlasContainer = async (connectionUri: string) => {
//   connectionUri = connectionUri + "?search_path=public&sslmode=disable";

//   const container = await new GenericContainer("arigaio/atlas:0.32.1-alpine")
//     .withCommand([
//       "schema",
//       "apply",
//       "--url",
//       connectionUri,
//       "--to",
//       "file://migrations/schema.sql",
//       "--auto-approve",
//     ])
//     .withCopyFilesToContainer([
//       {
//         source: `${__dirname}/../../../../../edi-processor/schema.sql`,
//         target: "/migrations/schema.sql",
//       },
//     ])
//     .withNetworkMode("host")
//     .withWaitStrategy(Wait.forOneShotStartup())
//     .start();

//   return async () => {
//     await container.stop();
//   };
// };

export const setupPostgresContainer = async () => {
  const container = await new PostgreSqlContainer("postgres:17.3-alpine")
    .withUsername("template-repo")
    .withPassword("password")
    .withDatabase("template-repo")
    .withCopyFilesToContainer([
      {
        source: __dirname + "/../../../../schema.sql",
        target: "/docker-entrypoint-initdb.d/init.sql",
      },
    ])
    .start();

  // const teardownAtlas = await setupAtlasContainer(container.getConnectionUri());

  return {
    connectionUri: container.getConnectionUri(),
    teardown: async () => {
      // await teardownAtlas();
      await container.stop();
    },
  };
};
