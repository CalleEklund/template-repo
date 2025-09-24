import { ConfigurationModule } from '../configuration';
import { PostgresModule } from '../postgres';
import { Migrater } from './migrater';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    PostgresModule,
    ConfigurationModule.forRootAsync({
      configurationFilePath:
        process.env.CONFIGURATION_PATH ??
        __dirname + '/../../configuration/configuration.yml',
    }),
  ],
  providers: [Migrater],
})
export class MigraterModule {}
