import { createParamDecorator } from "@nestjs/common";
import {
  CustomParamFactory,
  PipeTransform,
  Type,
} from "@nestjs/common/interfaces";

export type InferTypedParamDecoratorReturn<TParamDecorator> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TParamDecorator extends CreateTypedParamDecoratorReturn<any, infer TReturn>
    ? TReturn
    : never;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type CreateTypedParamDecoratorReturn<TFactoryData, TFactoryOutput> = (
  ...dataOrPipes: (Type<PipeTransform> | PipeTransform | TFactoryData)[]
) => ParameterDecorator;

export const createTypedParamDecorator = <TFactoryData, TFactoryOutput>(
  factory: CustomParamFactory<TFactoryData, TFactoryOutput>,
): CreateTypedParamDecoratorReturn<TFactoryData, TFactoryOutput> =>
  createParamDecorator(factory);
