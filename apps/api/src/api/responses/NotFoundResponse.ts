import { z } from "zod";

export const NotFoundResponse = z.object({
  status_code: z.literal(404),
  error_code: z.literal("NOT_FOUND"),
  error_message: z.string(),
});
