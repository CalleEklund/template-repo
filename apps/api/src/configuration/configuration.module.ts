import { DynamicModule, Global, Module, ValueProvider } from '@nestjs/common';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import { ConfigurationModuleOptions } from './types/';
import { ConfigurationIsEmptyException } from './configuration.exception';
import { ConfigurationService } from './configuration.service';

@Global()
@Module({})
export class ConfigurationModule {
  static async forRootAsync(
    options: ConfigurationModuleOptions,
  ): Promise<DynamicModule> {
    const unvalidatedConfig = load(
      readFileSync(options.configurationFilePath, 'utf8'),
    );
    if (!unvalidatedConfig) {
      throw new ConfigurationIsEmptyException();
    }

    const configServiceProvider: ValueProvider = {
      provide: ConfigurationService,
      useValue: new ConfigurationService(
        unvalidatedConfig as { [k: string]: unknown },
      ),
    };

    return {
      module: ConfigurationModule,
      providers: [configServiceProvider],
      exports: [ConfigurationService],
    };
  }
}
