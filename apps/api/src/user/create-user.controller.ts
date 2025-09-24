import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { Version, VersionTag } from '../app.constants';
import z from 'zod';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { Border, UseBorder, InferFromBorder } from '../core/border/';

const BORDER = new Border({
  requestBody: z.object({
    email: z.string().email(),
  }),

  responses: {
    [HttpStatus.OK]: z
      .object({
        id: z.string().uuid(),
        email: z.string().email(),
      })
      .optional(),
  },
});

@Controller({
  path: 'users',
  version: Version.V1,
})
export class CreateUserController {
  constructor(private readonly userService: UserService) {}
  @Post('/')
  @UseBorder(BORDER)
  @ApiTags(VersionTag.V1)
  async createUser(@Body() body: InferFromBorder<typeof BORDER, 'body'>) {
    const user = await this.userService.createUser(body);
    return BORDER.createResponse(HttpStatus.OK, user);
  }
}
