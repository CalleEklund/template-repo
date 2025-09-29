import { HttpErrorResponder, IHttpErrorResponder } from "./ErrorResponder";
import { ApplicationControllers } from "./http/application";
import { Module } from "@nestjs/common";

@Module({
  imports: [],
  controllers: [...ApplicationControllers],
  providers: [
    {
      provide: IHttpErrorResponder,
      useClass: HttpErrorResponder,
    },
  ],
})
export class ApiModule {}
