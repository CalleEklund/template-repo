import { UserDto } from "../../application/dtos/UserDto";
import z from "zod";

export class UserDtoMapper {
  public static HttpSchema = z.object({
    id: z.string().uuid(),
    username: z.string().min(3).max(30),
    email: z.string().email(),
    createdAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    }),
  });
  public static toHttp(domain: UserDto) {
    const obj: z.infer<typeof UserDtoMapper.HttpSchema> = {
      id: domain.id,
      username: domain.username,
      email: domain.email,
      createdAt: domain.createdAt.toISOString(),
    };
    return UserDtoMapper.HttpSchema.parse(obj);
  }
}
