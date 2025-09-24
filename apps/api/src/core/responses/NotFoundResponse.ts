import { z } from 'zod';

export const NotFoundResponse = z.object({
  status: z.literal(404),
  messages: z.array(
    z.object({
      code: z.literal('http/not-found'),
      message: z.string(),
    })
  ),
});
