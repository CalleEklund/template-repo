import { FilesInterceptor } from '@nestjs/platform-express/multer/interceptors/files.interceptor';
import { InternalServerErrorResponse } from '../responses';
import { Border } from './Border';
import { BorderFilter } from './BorderFilter';
import { BorderInterceptor } from './BorderInterceptor';
import { BorderPipe } from './BorderPipe';
import { generateSchema } from '@anatine/zod-openapi';
import {
  applyDecorators,
  HttpStatus,
  UseFilters,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { z } from 'zod';

export const UseBorder = <
  TBody extends z.ZodSchema | undefined,
  TQuery extends Record<string, z.ZodSchema | undefined>,
  TParams extends Record<string, z.ZodSchema | undefined>,
  TResponses extends Partial<Record<HttpStatus, z.ZodSchema>>,
  TFiles extends z.ZodSchema | undefined = undefined,
>(
  border: Border<TBody, TParams, TQuery, TResponses, TFiles>,
) => {
  const decorators: MethodDecorator[] = [];

  Object.entries(border.paramsSchema).forEach(([paramKey, schema]) => {
    if (!schema) return;

    decorators.push(
      ApiParam({
        name: paramKey,
        schema: generateSchema(schema, false, '3.0') as never,
        description: schema.description ?? '',
      }),
    );
  });

  Object.entries(border.querySchema).forEach(([queryKey, schema]) => {
    if (!schema) return;

    decorators.push(
      ApiQuery({
        name: queryKey,
        required: !schema.isOptional(),
        schema: generateSchema(schema, false, '3.0') as never,
        description: schema.description ?? '',
      }),
    );
  });

  if (border.bodySchema && !border.filesSchema) {
    decorators.push(
      ApiBody({
        schema: generateSchema(border.bodySchema, false, '3.0') as never,
        description: border.bodySchema.description ?? '',
      }),
    );
  }

  if (border.filesSchema) {
    decorators.push(
      ApiBody({
        required: true,
        description: 'Multipart form data with JSON body + files',
        schema: {
          type: 'object',
          properties: {
            ...(border.bodySchema
              ? generateSchema(border.bodySchema, false, '3.0').properties
              : {}),
            files: {
              type: 'array',
              items: {
                type: 'string',
                format: 'binary',
              },
            },
          },
        } as never,
      }),
    );
  }

  Object.entries(border.responsesSchema).forEach(([httpCode, schema]) => {
    decorators.push(
      ApiResponse({
        status: Number(httpCode),
        schema: generateSchema(schema, false, '3.0') as never,
        description: schema.description ?? '',
      }),
    );
  });

  decorators.push(
    ApiResponse({
      status: 500,
      schema: generateSchema(
        InternalServerErrorResponse,
        false,
        '3.0',
      ) as never,
      description: 'An unexpected error occured.',
    }),
  );

  return applyDecorators(
    ...(border.filesSchema ? [UseInterceptors(FilesInterceptor('files'))] : []),
    UseInterceptors(new BorderInterceptor(border)),
    UsePipes(new BorderPipe(border)),
    UseFilters(BorderFilter),
    ...decorators,
  );
};
