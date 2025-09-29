import { User } from "../../domain/entities";

export class UserDto {
  id: string;
  username: string;
  email: string;
  createdAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.createdAt = user.createdAt;
  }
}
