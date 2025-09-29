import { User } from "../../domain/entities";
import z from "zod";

export const PostgresUserRowSchema = z
  .object({
    id: z.string().uuid(),
    username: z.string(),
    email: z.string().email(),
    createdAt: z.date(),
  })
  .transform((data) => {
    return User.reconstitute({
      id: data.id,
      username: data.username,
      email: data.email,
      createdAt: data.createdAt,
    });
  });
