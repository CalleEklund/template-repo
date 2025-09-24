import { z } from 'zod';

export const UnauthorizedResponse = z.object({
  status: z.literal(401),
  messages: z.array(
    z.object({
      code: z.literal('http/unauthorized'),
      message: z.string(),
    })
  ),
});
