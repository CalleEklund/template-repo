import { Injectable } from "@nestjs/common";
import { z } from "zod";

const ApplicationConfigurationSchema = z.object({
  server: z.object({
    port: z.string(),
    host: z.string(),
  }),
  postgres: z.object({
    uri: z.string(),
  }),
});

type ApplicationConfiguration = z.infer<typeof ApplicationConfigurationSchema>;

type DeepStrictPartial<T> = T extends object
  ? {
      [K in keyof T]: DeepStrictPartial<T[K]>;
    }
  : T | undefined;

@Injectable()
export class ConfigurationService {
  private readonly configuration: ApplicationConfiguration;

  constructor() {
    const config = {
      server: {
        port: process.env["SERVER_PORT"],
        host: process.env["SERVER_HOST"],
      },
      postgres: {
        uri: process.env["POSTGRES_URI"],
      },
    } satisfies DeepStrictPartial<ApplicationConfiguration>;

    this.configuration = ApplicationConfigurationSchema.parse(config);
  }

  public get() {
    return this.configuration;
  }
}
