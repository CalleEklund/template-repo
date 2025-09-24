import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  AnyConfigurationException,
  SecretVersionDataIsUndefinedExepction,
  ConfigurationIsEmptyException,
} from './configuration.exception';

@Catch(SecretVersionDataIsUndefinedExepction, ConfigurationIsEmptyException)
export class ConfigurationExceptionFilter
  implements ExceptionFilter<AnyConfigurationException>
{
  private readonly logger = new Logger(ConfigurationExceptionFilter.name);

  constructor() {}

  async catch(exception: AnyConfigurationException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    this.logger.error(exception);

    if (exception instanceof SecretVersionDataIsUndefinedExepction) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'SECRET_VERSION_DATA_IS_UNDEFINED',
      });
    } else if (exception instanceof ConfigurationIsEmptyException) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'CONFIGURATION_IS_EMPTY',
      });
    }
  }
}
