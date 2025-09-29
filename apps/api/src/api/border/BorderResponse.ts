import { HttpStatus } from "@nestjs/common";

export class BorderResponse<TStatusCode extends HttpStatus, TBody> {
  public readonly status: TStatusCode;
  public readonly body: TBody;

  constructor(options: { statusCode: TStatusCode; body: TBody }) {
    this.status = options.statusCode;
    this.body = options.body;
  }
}
