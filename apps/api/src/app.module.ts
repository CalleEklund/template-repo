import { ApiModule } from "./api";
import { UserModule } from "./contexts/user";
import {
  ConfigurationModule,
  ConfigurationService,
} from "./platform/configuration";
import { PostgresModule } from "./platform/postgres";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    ConfigurationModule,
    PostgresModule.forRootAsync({
      inject: [ConfigurationService],
      useFactory: (configurationService: ConfigurationService) => ({
        connectionUri: configurationService.get().postgres.uri,
      }),
    }),

    //Context Modules
    ApiModule,
    UserModule,
  ],
})
export class AppModule {}
