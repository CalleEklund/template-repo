import { Border } from './Border';
import { BorderResponse } from './BorderResponse';
import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';
import { z } from 'zod';

@Injectable()
export class BorderInterceptor<
  TBody extends z.ZodSchema | undefined,
  TParams extends Record<string, z.ZodSchema | undefined>,
  TQuery extends Record<string, z.ZodSchema | undefined>,
  TResponses extends Partial<Record<HttpStatus, z.ZodSchema>>,
  TFiles extends z.ZodSchema | undefined = undefined,
> implements NestInterceptor
{
  private readonly border;

  constructor(border: Border<TBody, TParams, TQuery, TResponses, TFiles>) {
    this.border = border;
  }

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<never> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse<Response>();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data: unknown) => {
        if (!(data instanceof BorderResponse)) {
          return data as never;
        }

        const status = data.status as HttpStatus;
        response.statusCode = status;

        const responseSchema = this.border.getResponseSchemaForHttpCode(status);

        if (!responseSchema) {
          throw new Error(
            `No response schema defined for status for status code ${statusCode.toString()}`,
          );
        }

        const parseResult = (
          responseSchema as unknown as z.ZodSchema
        ).safeParse(data.body);

        if (parseResult.success) {
          return parseResult.data as never;
        }

        throw (parseResult as z.SafeParseError<unknown>).error;
      }),
    );
  }
}
