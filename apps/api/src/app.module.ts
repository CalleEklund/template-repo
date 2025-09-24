import { Module } from '@nestjs/common';
import { ConfigurationModule, ConfigurationService } from './configuration';
import { BorderPatrolModule } from '@qte/nest-border-patrol';
import { I18nModule } from './i18n/i18n.module';
import { PostgresModule } from './postgres';
import { HealthModule } from './health';
import { UserModule } from './user';

@Module({
  imports: [
    I18nModule,
    BorderPatrolModule.forRootAsync({
      useFactory: () => ({
        useDefaultFilter: false,
      }),
    }),
    ConfigurationModule.forRootAsync({
      configurationFilePath: __dirname + '/../configuration/configuration.yml',
    }),
    PostgresModule.forRootAsync({
      imports: [ConfigurationModule],
      inject: [ConfigurationService],
      useFactory: (configurationService: ConfigurationService) => {
        const { connectionUri, migrate, migrationDirectory } =
          configurationService.get().postgres;
        return {
          postgres: { connectionUri },
          migrationDirectory: `${__dirname}/../${migrationDirectory}`,
          migrate,
        };
      },
    }),
    HealthModule,
    UserModule,
  ],
})
export class AppModule {}
