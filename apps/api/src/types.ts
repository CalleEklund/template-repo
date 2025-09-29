import { InjectionToken, ModuleMetadata } from "@nestjs/common";

export interface AsyncOptions<TOptions>
  extends Pick<ModuleMetadata, "imports"> {
  inject?: InjectionToken[];
  useFactory: (...args: never[]) => Promise<TOptions> | TOptions;
}
