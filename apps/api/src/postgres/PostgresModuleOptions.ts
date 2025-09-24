import { ModuleMetadata } from "@nestjs/common";

export const POSTGRES_MODULE_OPTIONS_KEY = Symbol("POSTGRES_MODULE_OPTIONS");

export interface PostgresModuleOptions {
  postgres: { connectionUri: string } | undefined;
  migrationDirectory: string;
  migrate: boolean;
  logging?: boolean;
}

export interface PostgresModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  useFactory: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) => Promise<PostgresModuleOptions> | PostgresModuleOptions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inject?: any[];
}
