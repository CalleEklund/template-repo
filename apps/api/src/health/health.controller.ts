import { InjectPostgresPool, PostgresPool, sql } from '../postgres';
import {
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { z } from 'zod';

@Controller({
  path: 'health',
  version: VERSION_NEUTRAL,
})
@ApiExcludeController()
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(
    @InjectPostgresPool()
    private readonly pool: PostgresPool,
  ) {}

  @Get('/')
  public async get() {
    const query = sql.type(
      z.object({
        status: z.literal('OK'),
      }),
    )`
      select 'OK' as status;
    `;

    const status = await this.pool
      .oneFirst(query)
      .catch(() => 'ERROR' as const);

    if (status === 'ERROR') {
      this.logger.error('Health check failed');
      throw new InternalServerErrorException({ status: status });
    }

    return {
      status: status,
    };
  }
}
