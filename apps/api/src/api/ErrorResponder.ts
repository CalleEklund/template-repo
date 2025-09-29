import { Border } from "./border";
import { BorderResponse } from "./border/BorderResponse";
import { InternalServerErrorResponse } from "./responses";
import { HttpStatus, Logger } from "@nestjs/common";
import z from "zod";

export interface IHttpErrorResponder {
  internalServerError(
    e: unknown,
  ): BorderResponse<
    HttpStatus.INTERNAL_SERVER_ERROR,
    z.infer<typeof InternalServerErrorResponse>
  >;
}

export const IHttpErrorResponder = Symbol("IHttpErrorResponder");

const border = new Border({
  responses: {
    [HttpStatus.INTERNAL_SERVER_ERROR]: InternalServerErrorResponse,
  },
});

export class HttpErrorResponder implements IHttpErrorResponder {
  private readonly logger = new Logger(HttpErrorResponder.name);

  public internalServerError(
    e: unknown,
  ): BorderResponse<
    HttpStatus.INTERNAL_SERVER_ERROR,
    z.infer<typeof InternalServerErrorResponse>
  > {
    this.logger.error(e);

    return border.createResponse(HttpStatus.INTERNAL_SERVER_ERROR, {
      status_code: 500,
      error_code: "INTERNAL_SERVER_ERROR",
      error_message: "Something went wrong",
    });
  }
}
