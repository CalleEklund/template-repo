import { z } from "zod";

export class InvalidQueryParameters extends Error {
  private readonly _error: z.ZodError;

  constructor(error: z.ZodError) {
    super(error.message);
    this.name = "InvalidQueryParameters";
    this._error = error;
  }

  public get error(): z.ZodError {
    return this._error;
  }
}

export class InvalidPathParameters extends Error {
  private readonly _error: z.ZodError;

  constructor(error: z.ZodError) {
    super(error.message);
    this.name = "InvalidPathParameters";
    this._error = error;
  }

  public get error(): z.ZodError {
    return this._error;
  }
}

export class InvalidBody extends Error {
  private readonly _error: z.ZodError;

  constructor(error: z.ZodError) {
    super(error.message);
    this.name = "InvalidBody";
    this._error = error;
  }

  public get error(): z.ZodError {
    return this._error;
  }
}
