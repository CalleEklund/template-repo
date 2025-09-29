import { User } from "../../domain/entities";
import { IUserRepository } from "../../domain/repositories";
import { Inject, Injectable, Logger } from "@nestjs/common";

@Injectable()
export class UserRegisterService {
  private readonly logger = new Logger(UserRegisterService.name);

  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  public async register({
    username,
    email,
  }: {
    username: string;
    email: string;
  }) {
    const user = User.create({ username, email });
    return await this.userRepository.save(user);
  }
}
