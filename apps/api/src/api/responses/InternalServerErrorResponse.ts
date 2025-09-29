import { z } from "zod";

export const InternalServerErrorResponse = z.object({
  status_code: z.literal(500),
  error_code: z.literal("INTERNAL_SERVER_ERROR"),
  error_message: z.string(),
});
