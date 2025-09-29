import { z } from "zod";

export const UnauthorizedResponse = z.object({
  status_code: z.literal(401),
  error_code: z.literal("UNAUTHORIZED"),
  error_message: z.string(),
});
