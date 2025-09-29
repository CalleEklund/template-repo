import { User } from "../entities";

export interface IUserRepository {
  save(user: User): Promise<User>;
}
export const IUserRepository = Symbol("IUserRepository");
