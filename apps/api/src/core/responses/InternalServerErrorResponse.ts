import { z } from 'zod';

export const InternalServerErrorResponse = z.object({
  status: z.literal(500),
  messages: z.array(
    z.object({
      code: z.literal('http/internal-server-error'),
      message: z.string(),
    })
  ),
});
