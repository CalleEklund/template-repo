import { z } from "zod";

/**
 * Utility function to determine the column types to use in a Slonik `unnest` operation using a
 * Zod schema of the columns in the table.
 */
export function getColumnTypesFromSchema<
  K extends string,
  V extends z.ZodTypeAny,
>(schema: z.ZodObject<Record<K, V>>): string[] {
  function _determineType(type: z.ZodTypeAny): string {
    if (type instanceof z.ZodString) {
      if (type.isUUID) {
        return "uuid";
      }

      return "text";
    } else if (type instanceof z.ZodEnum) {
      return "text";
    } else if (type instanceof z.ZodNumber) {
      if (type.isInt) {
        return "int4";
      } else {
        return "float8";
      }
    } else if (type instanceof z.ZodBoolean) {
      return "bool";
    } else if (type instanceof z.ZodRecord || type instanceof z.ZodObject) {
      return "jsonb";
    }
    // eslint-disable-next-line no-console
    console.log(`Unknown type: ${JSON.stringify(type)}`);
    return "unknown";
  }

  return Object.values(schema.shape).map((type) => {
    if (type instanceof z.ZodNullable) {
      return _determineType(type.unwrap() as z.ZodTypeAny);
    }
    return _determineType(type as z.ZodTypeAny);
  });
}
