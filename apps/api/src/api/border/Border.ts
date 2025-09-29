import { BorderResponse } from "./BorderResponse";
import { HttpStatus } from "@nestjs/common";
import { z } from "zod";

export class Border<
  TBody extends z.ZodSchema | undefined,
  TParams extends Record<string, z.ZodSchema | undefined>,
  TQuery extends Record<string, z.ZodSchema | undefined>,
  TResponses extends { [K in HttpStatus]?: z.ZodSchema },
> {
  public readonly bodySchema: TBody;
  public readonly paramsSchema: TParams;
  public readonly querySchema: TQuery;
  public readonly responsesSchema: TResponses;

  constructor(borderOptions: {
    requestBody?: TBody;
    parameters?: {
      path?: TParams;
      query?: TQuery;
    };
    responses: TResponses;
  }) {
    this.bodySchema = borderOptions.requestBody ?? (undefined as TBody);
    this.paramsSchema = borderOptions.parameters?.path ?? ({} as TParams);
    this.querySchema = borderOptions.parameters?.query ?? ({} as TQuery);
    this.responsesSchema = borderOptions.responses;
  }

  public getResponseSchemaForHttpCode<TCode extends keyof TResponses>(
    code: TCode,
  ): TResponses[TCode] {
    return this.responsesSchema[code];
  }

  public createResponse<TCode extends keyof TResponses & HttpStatus>(
    code: TCode,
    data: TResponses[TCode] extends z.ZodSchema
      ? z.infer<TResponses[TCode]>
      : never,
  ) {
    return new BorderResponse({
      statusCode: code,
      body: data,
    });
  }
}
