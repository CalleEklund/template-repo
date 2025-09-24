import { Injectable } from '@nestjs/common';
import {
  ApplicationConfiguration,
  ApplicationConfigurationSchema,
} from './types/';

@Injectable()
export class ConfigurationService {
  private configuration: ApplicationConfiguration;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    unvalidatedConfig: any,
  ) {
    this.configuration = ApplicationConfigurationSchema.parse({
      ...unvalidatedConfig,
    });
  }

  public get() {
    return this.configuration;
  }
}
