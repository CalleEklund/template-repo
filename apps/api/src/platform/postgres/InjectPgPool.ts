import { PostgresPool } from "./PostgresPool";
import { Inject } from "@nestjs/common";

export const InjectPgPool = () => Inject(PostgresPool);
