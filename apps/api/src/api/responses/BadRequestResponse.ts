import { z } from "zod";

export const BadRequestResponse = z.object({
  status_code: z.literal(400),
  error_code: z.literal("BAD_REQUEST"),
  error_message: z.string(),
  error_details: z
    .object({
      field: z.string(),
      message: z.string(),
    })
    .array(),
});
