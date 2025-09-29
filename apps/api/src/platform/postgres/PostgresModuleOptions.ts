import { ClientConfiguration } from "slonik";

export interface PostgresModuleOptions {
  connectionUri: string;
  connectionOptions?: Partial<ClientConfiguration>;
}
