import { z } from 'zod';

export const ApplicationConfigurationSchema = z.object({
  server: z.object({
    port: z.number(),
    host: z.string(),
    corsOrigins: z.array(z.string().url()),
  }),
  postgres: z.object({
    connectionUri: z.string(),
    migrationDirectory: z.string(),
    migrate: z.boolean(),
  }),
});

export type ApplicationConfiguration = z.infer<
  typeof ApplicationConfigurationSchema
>;

export type ConfigurationModuleOptionsFromFile = {
  configurationFilePath: string;
};

export type ConfigurationModuleOptions = ConfigurationModuleOptionsFromFile;
