import { Injectable, Logger } from '@nestjs/common';
import { CreateUser } from './types';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly userRepository: UserRepository) {}

  public async createUser(data: CreateUser) {
    try {
      return await this.userRepository.create(data);
    } catch (e) {
      this.logger.error('Failed to create user', e);
    }
  }
}
