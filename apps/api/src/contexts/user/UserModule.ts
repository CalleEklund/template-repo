import { UserRegisterService } from "./application/services";
import { IUserRepository } from "./domain/repositories";
import { PostgresUserRepository } from "./infrastructure/repositories";
import { UserRegisterController } from "./presentation/http";
import { Module } from "@nestjs/common";

@Module({
  providers: [
    {
      provide: IUserRepository,
      useClass: PostgresUserRepository,
    },
    UserRegisterService,
  ],
  imports: [],
  controllers: [UserRegisterController],
  exports: [],
})
export class UserModule {}
