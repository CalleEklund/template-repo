import { createSqlTag } from "slonik";
import { z } from "zod";

const SQL_VOID_TYPE_ALIAS_KEY = Symbol("SQL_VOID_TYPE_ALIAS");

export const sql = createSqlTag({
  typeAliases: {
    [SQL_VOID_TYPE_ALIAS_KEY]: z.object({}).strict(),
  },
});

export const voidQuery = sql.typeAlias(SQL_VOID_TYPE_ALIAS_KEY);
