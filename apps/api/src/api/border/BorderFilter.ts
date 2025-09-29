import {
  BadRequestResponse,
  ForbiddenResponse,
  InternalServerErrorResponse,
  UnauthorizedResponse,
} from "../responses";
import {
  InvalidBody,
  InvalidPathParameters,
  InvalidQueryParameters,
} from "./errors";
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { SchemaValidationError } from "slonik";
import { z } from "zod";

@Catch()
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
        status_code: 400,
        error_code: "BAD_REQUEST",
        error_message: exception.name,
        error_details: exceptionErrors,
      };

      return response.status(400).json(body);
    } else if (exception instanceof SchemaValidationError) {
      this.logger.error(
        `Schema validation error: ${exception.sql} ${JSON.stringify(exception.issues, null, 2)}`,
      );
      const body: z.infer<typeof InternalServerErrorResponse> = {
        status_code: 500,
        error_code: "INTERNAL_SERVER_ERROR",
        error_message: "Something went wrong",
      };
      return response.status(500).json(body);
    } else if (exception instanceof UnauthorizedException) {
      const body: z.infer<typeof UnauthorizedResponse> = {
        status_code: 401,
        error_code: "UNAUTHORIZED",
        error_message: exception.message,
      };

      this.logger.warn(
        `Unauthorized access attempt in ${request.method} ${request.url}: ${exception.message}`,
      );

      return response.status(401).json(body);
    } else if (exception instanceof ForbiddenException) {
      const body: z.infer<typeof ForbiddenResponse> = {
        status_code: 403,
        error_code: "FORBIDDEN",
        error_message: exception.message,
      };

      this.logger.warn(
        `Forbidden access attempt in ${request.method} ${request.url}: ${exception.message}`,
      );

      return response.status(403).json(body);
    } else if (exception instanceof Error) {
      const body: z.infer<typeof InternalServerErrorResponse> = {
        status_code: 500,
        error_code: "INTERNAL_SERVER_ERROR",
        error_message: exception.message,
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
      status_code: 500,
      error_code: "INTERNAL_SERVER_ERROR",
      error_message: JSON.stringify(exception),
    };

    return response.status(500).json(body);
  }
  private extractZodError(
    issues: z.ZodIssue[],
  ): { field: string; message: string }[] {
    return issues.flatMap((issue) => {
      if (issue.code === "invalid_union") {
        return this.extractZodError(
          issue.unionErrors.flatMap((issue) => issue.issues),
        ).flat();
      }
      return { field: issue.path.join("."), message: issue.message };
    });
  }
}
