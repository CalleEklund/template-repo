import { Border } from './Border';
import {
  InvalidBody,
  InvalidPathParameters,
  InvalidQueryParameters,
} from './errors';
import {
  ArgumentMetadata,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class BorderPipe<
  TBody extends z.ZodSchema | undefined,
  TParams extends Record<string, z.ZodSchema | undefined>,
  TQuery extends Record<string, z.ZodSchema | undefined>,
  TResponses extends Partial<Record<HttpStatus, z.ZodSchema>>,
  TFiles extends z.ZodSchema | undefined = undefined,
> implements PipeTransform
{
  private readonly border;

  constructor(border: Border<TBody, TParams, TQuery, TResponses, TFiles>) {
    this.border = border;
  }

  transform(value: Record<string, unknown>, metadata: ArgumentMetadata) {
    switch (metadata.type) {
      case 'body': {
        if (!this.border.bodySchema) {
          return undefined;
        }

        const parseResult = this.border.bodySchema.safeParse(value);

        if (parseResult.success) {
          return parseResult.data as never;
        }

        throw new InvalidBody(parseResult.error);
      }
      case 'param': {
        const parsedValue: Record<string, unknown> = {};
        Object.entries(this.border.paramsSchema)
          .filter(
            (entry): entry is [string, NonNullable<(typeof entry)[1]>] => {
              return !entry[1] ? false : true;
            },
          )
          .forEach(([paramKey, schema]) => {
            const parseResult = schema.safeParse(value[paramKey]);

            if (parseResult.success) {
              parsedValue[paramKey] = parseResult.data;
              return;
            }

            throw new InvalidPathParameters(parseResult.error);
          });

        return parsedValue;
      }
      case 'query': {
        const parsedValue: Record<string, unknown> = {};
        Object.entries(this.border.querySchema)
          .filter(
            (entry): entry is [string, NonNullable<(typeof entry)[1]>] => {
              return !entry[1] ? false : true;
            },
          )
          .forEach(([queryKey, schema]) => {
            const parseResult = schema.safeParse(value[queryKey]);

            if (parseResult.success) {
              parsedValue[queryKey] = parseResult.data;
              return;
            }

            throw new InvalidQueryParameters(parseResult.error);
          });

        return parsedValue;
      }
      case 'custom': {
        if (this.border.filesSchema) {
          const parseResult = this.border.filesSchema.safeParse(value);
          if (parseResult.success) {
            return parseResult.data as never;
          }
          throw new InvalidBody(parseResult.error); // Or a new `InvalidFiles` error
        }
        return value;
      }
    }
  }
}
