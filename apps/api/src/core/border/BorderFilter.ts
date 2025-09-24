import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { SchemaValidationError } from '@qte/elephas-nest';
import {
  BadRequestResponse,
  ForbiddenResponse,
  InternalServerErrorResponse,
  UnauthorizedResponse,
} from '../responses';
import {
  InvalidBody,
  InvalidPathParameters,
  InvalidQueryParameters,
} from './errors';

import { Request, Response } from 'express';

import { z } from 'zod';

@Catch(
  HttpException,
  InvalidQueryParameters,
  InvalidPathParameters,
  InvalidBody,
  SchemaValidationError,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
)
export class BorderFilter implements ExceptionFilter {
  private readonly logger = new Logger(BorderFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request: Request = context.getRequest();
    const response: Response = context.getResponse();

    if (
      exception instanceof InvalidQueryParameters ||
      exception instanceof InvalidPathParameters ||
      exception instanceof InvalidBody
    ) {
      const exceptionErrors = this.extractZodError(exception.error.issues);

      const body: z.infer<typeof BadRequestResponse> = {
        status: 400,
        messages: [
          {
            code: 'http/bad-request',
            message: 'Invalid request input',
            errors: exceptionErrors,
          },
        ],
      };

      return response.status(400).json(body);
    } else if (exception instanceof SchemaValidationError) {
      this.logger.error(
        `Schema validation error: ${exception.sql} ${JSON.stringify(
          exception.issues,
          null,
          2,
        )}`,
      );
      const body: z.infer<typeof InternalServerErrorResponse> = {
        status: 500,
        messages: [
          {
            code: 'http/internal-server-error',
            message: 'An unexpected error occurred',
          },
        ],
      };
      return response.status(500).json(body);
    } else if (exception instanceof BadRequestException) {
      const body: z.infer<typeof BadRequestResponse> = {
        status: 400,
        messages: [
          {
            code: 'http/bad-request',
            message: exception.message || 'Bad Request',
            errors: [],
          },
        ],
      };

      this.logger.warn(
        `Bad request in ${request.method} ${request.url}: ${exception.message}`,
      );

      return response.status(400).json(body);
    } else if (exception instanceof UnauthorizedException) {
      const body: z.infer<typeof UnauthorizedResponse> = {
        status: 401,
        messages: [
          {
            code: 'http/unauthorized',
            message: exception.message || 'Unauthorized',
          },
        ],
      };

      this.logger.warn(
        `Unauthorized access attempt in ${request.method} ${request.url}: ${exception.message}`,
      );

      return response.status(401).json(body);
    } else if (exception instanceof ForbiddenException) {
      const body: z.infer<typeof ForbiddenResponse> = {
        status: 403,
        messages: [
          {
            code: 'http/forbidden',
            message: exception.message || 'Forbidden',
          },
        ],
      };

      this.logger.warn(
        `Forbidden access attempt in ${request.method} ${request.url}: ${exception.message}`,
      );

      return response.status(403).json(body);
    } else if (exception instanceof HttpException) {
      const body = {
        status: exception.getStatus(),
        messages: [
          {
            code: this.getErrorCodeFromStatusCode(exception.getStatus()),
            message: exception.message,
          },
        ],
      };
      return response.status(exception.getStatus()).json(body);
    } else if (exception instanceof Error) {
      const body: z.infer<typeof InternalServerErrorResponse> = {
        status: 500,
        messages: [
          {
            code: 'http/internal-server-error',
            message: 'An unexpected error occurred',
          },
        ],
      };

      this.logger.error(
        `Error in ${request.method} ${request.url}: ${exception}`,
      );

      return response.status(500).json(body);
    }

    this.logger.error(
      `Error in ${request.method} ${request.url}: ${exception}`,
    );

    const body: z.infer<typeof InternalServerErrorResponse> = {
      status: 500,
      messages: [
        {
          code: 'http/internal-server-error',
          message: 'An unexpected error occurred',
        },
      ],
    };

    return response.status(500).json(body);
  }

  private getErrorCodeFromStatusCode(statusCode: number): string {
    switch (statusCode) {
      case 400:
        return 'http/bad-request';
      case 401:
        return 'http/unauthorized';
      case 403:
        return 'http/forbidden';
      case 404:
        return 'http/not-found';
      case 500:
        return 'http/internal-server-error';
      default:
        return 'http/internal-server-error';
    }
  }

  private extractZodError(
    issues: z.ZodIssue[],
  ): { field: string; message: string }[] {
    return issues.flatMap((issue) => {
      if (issue.code === 'invalid_union') {
        return this.extractZodError(
          issue.unionErrors.flatMap((issue) => issue.issues),
        ).flat();
      }
      return { field: issue.path.join('.'), message: issue.message };
    });
  }
}
