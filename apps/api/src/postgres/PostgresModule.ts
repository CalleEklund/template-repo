import { ConnectionEnder } from "./ConnectionEnder";
import {
  POSTGRES_MODULE_OPTIONS_KEY,
  PostgresModuleAsyncOptions,
  PostgresModuleOptions,
} from "./PostgresModuleOptions";
import { PostgresPoolProvider } from "./PostgresPoolProvider";
import { DynamicModule, FactoryProvider, Global, Module } from "@nestjs/common";

@Global()
@Module({})
export class PostgresModule {
  public static forRootAsync(
    options: PostgresModuleAsyncOptions,
  ): DynamicModule {
    const optionsProvider: FactoryProvider<PostgresModuleOptions> = {
      inject: options.inject ?? [],
      provide: POSTGRES_MODULE_OPTIONS_KEY,
      useFactory: options.useFactory,
    };
    return {
      module: PostgresModule,
      providers: [optionsProvider, ConnectionEnder, PostgresPoolProvider()],
      exports: [PostgresPoolProvider()],
      global: true,
    };
  }
}
