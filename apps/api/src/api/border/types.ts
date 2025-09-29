/* eslint-disable @typescript-eslint/no-explicit-any */
import { Border } from "./Border";
import { BorderResponse } from "./BorderResponse";
import { HttpStatus } from "@nestjs/common";
import { z } from "zod";

type InferBodyFromBorder<TBorder> =
  TBorder extends Border<infer TBody, any, any, any>
    ? TBody extends z.ZodSchema
      ? z.infer<TBody>
      : never
    : never;

type InferPathParametersFromBorder<TBorder> =
  TBorder extends Border<any, infer TPathParameters, any, any>
    ? TPathParameters extends Record<string, z.ZodSchema | undefined>
      ? {
          [K in keyof TPathParameters]: TPathParameters[K] extends z.ZodSchema
            ? z.infer<TPathParameters[K]>
            : never;
        }
      : never
    : never;

type InferQueryParametersFromBorder<TBorder> =
  TBorder extends Border<any, any, infer TQueryParameters, any>
    ? TQueryParameters extends Record<string, z.ZodSchema | undefined>
      ? {
          [K in keyof TQueryParameters]: TQueryParameters[K] extends z.ZodSchema
            ? z.infer<TQueryParameters[K]>
            : never;
        }
      : never
    : never;

type InferResponseFromBorder<TBorder> =
  TBorder extends Border<any, any, any, infer TResponses>
    ? {
        [K in keyof TResponses]: K extends HttpStatus & keyof TResponses
          ? TResponses[K] extends z.ZodSchema
            ? BorderResponse<K, z.infer<TResponses[K]>>
            : never
          : never;
        //
      }[keyof TResponses]
    : never;

export type InferFromBorder<
  TBorder extends Border<any, any, any, any>,
  TFrom extends "body" | "pathParameters" | "queryParameters" | "response",
> = TFrom extends "body"
  ? InferBodyFromBorder<TBorder>
  : TFrom extends "pathParameters"
    ? InferPathParametersFromBorder<TBorder>
    : TFrom extends "queryParameters"
      ? InferQueryParametersFromBorder<TBorder>
      : TFrom extends "response"
        ? InferResponseFromBorder<TBorder>
        : never;
