import { UserRegisterService } from "../../application/services";
import { UserDtoMapper } from "../mappers/UserDtoMapper";
import { Body, Controller, HttpStatus, Logger, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import z from "zod";
import { Border, type InferFromBorder, UseBorder } from "~/api/border";
import { InternalServerErrorResponse } from "~/api/responses";
import { Version } from "~/app.constants";

const BORDER = new Border({
  requestBody: z.object({
    username: z.string().min(3).max(30),
    email: z.string().email(),
  }),
  responses: {
    [HttpStatus.OK]: z.object({
      user: UserDtoMapper.HttpSchema,
    }),
    [HttpStatus.INTERNAL_SERVER_ERROR]: InternalServerErrorResponse,
  },
});

@Controller({
  path: "user",
  version: Version.V1,
})
@ApiTags("User")
export class UserRegisterController {
  constructor(
    private readonly logger = new Logger(UserRegisterController.name),
    private readonly userRegisterService: UserRegisterService,
  ) {}
  @Post("/register")
  @ApiOperation({ summary: "Register a new user" })
  @UseBorder(BORDER)
  async handler(@Body() body: InferFromBorder<typeof BORDER, "body">) {
    try {
      const res = await this.userRegisterService.register(body);
      return BORDER.createResponse(HttpStatus.OK, {
        user: UserDtoMapper.toHttp(res),
      });
    } catch (error) {
      this.logger.error(`Error in user registration: info ${error}`);
      return BORDER.createResponse(HttpStatus.INTERNAL_SERVER_ERROR, {
        error_code: "INTERNAL_SERVER_ERROR",
        status_code: HttpStatus.INTERNAL_SERVER_ERROR,
        error_message: "An unexpected error occurred",
      });
    }
  }
}
