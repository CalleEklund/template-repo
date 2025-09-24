/* eslint-disable @typescript-eslint/no-explicit-any */
import { Border } from './Border';
import { BorderResponse } from './BorderResponse';
import { HttpStatus } from '@nestjs/common';
import { z } from 'zod';

// -------------------
// Body
// -------------------
type InferBodyFromBorder<TBorder> = TBorder extends Border<
  infer TBody,
  any,
  any,
  any,
  any
>
  ? TBody extends z.ZodSchema
    ? z.infer<TBody>
    : never
  : never;

// -------------------
// Path Parameters
// -------------------
type InferPathParametersFromBorder<TBorder> = TBorder extends Border<
  any,
  infer TParams,
  any,
  any,
  any
>
  ? TParams extends Record<string, z.ZodSchema | undefined>
    ? {
        [K in keyof TParams]: TParams[K] extends z.ZodSchema
          ? z.infer<TParams[K]>
          : never;
      }
    : never
  : never;

// -------------------
// Query Parameters
// -------------------
type InferQueryParametersFromBorder<TBorder> = TBorder extends Border<
  any,
  any,
  infer TQuery,
  any,
  any
>
  ? TQuery extends Record<string, z.ZodSchema | undefined>
    ? {
        [K in keyof TQuery]: TQuery[K] extends z.ZodSchema
          ? z.infer<TQuery[K]>
          : never;
      }
    : never
  : never;

// -------------------
// Response
// -------------------
type InferResponseFromBorder<TBorder> = TBorder extends Border<
  any,
  any,
  any,
  infer TResponses,
  any
>
  ? {
      [K in keyof TResponses]: TResponses[K] extends z.ZodSchema
        ? BorderResponse<K & HttpStatus, z.infer<TResponses[K]>>
        : never;
    }[keyof TResponses]
  : never;

// -------------------
// Files
// -------------------
type InferFilesFromBorder<TBorder> = TBorder extends Border<
  any,
  any,
  any,
  any,
  infer TFiles
>
  ? TFiles extends z.ZodSchema
    ? z.infer<TFiles>
    : undefined // <-- if no files schema, return undefined
  : never;

// -------------------
// Main export
// -------------------
export type InferFromBorder<
  TBorder extends Border<any, any, any, any, any>,
  TFrom extends
    | 'body'
    | 'pathParameters'
    | 'queryParameters'
    | 'response'
    | 'files',
> = TFrom extends 'body'
  ? InferBodyFromBorder<TBorder>
  : TFrom extends 'pathParameters'
  ? InferPathParametersFromBorder<TBorder>
  : TFrom extends 'queryParameters'
  ? InferQueryParametersFromBorder<TBorder>
  : TFrom extends 'response'
  ? InferResponseFromBorder<TBorder>
  : TFrom extends 'files'
  ? InferFilesFromBorder<TBorder>
  : never;
