import { z } from 'zod';

export const ForbiddenResponse = z.object({
  status: z.literal(403),
  messages: z.array(
    z.object({
      code: z.literal('http/forbidden'),
      message: z.string(),
    })
  ),
});
