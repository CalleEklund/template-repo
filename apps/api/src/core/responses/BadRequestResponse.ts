import { z } from 'zod';

export const BadRequestResponse = z.object({
  status: z.literal(400),
  messages: z.array(
    z.object({
      code: z.literal('http/bad-request'),
      message: z.string(),
      errors: z
        .object({
          field: z.string(),
          message: z.string(),
        })
        .array(),
    })
  ),
});
