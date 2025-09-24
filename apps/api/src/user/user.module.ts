import { Module } from '@nestjs/common';
import { CreateUserController } from './create-user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

@Module({
  controllers: [CreateUserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
