import { z } from "zod";

export const ForbiddenResponse = z.object({
  status_code: z.literal(403),
  error_code: z.literal("FORBIDDEN"),
  error_message: z.string(),
});
