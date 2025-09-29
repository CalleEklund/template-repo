import { Border, UseBorder } from "../../border";
import { Controller, Get, HttpStatus, VERSION_NEUTRAL } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { z } from "zod";

const BORDER = new Border({
  responses: {
    [HttpStatus.OK]: z.object({
      status: z.literal("ok"),
    }),
  },
});

@Controller({
  version: VERSION_NEUTRAL,
  path: "/",
})
@ApiTags("Application")
export class HealthController {
  @Get("/health")
  @ApiOperation({ summary: "Get health status of application" })
  @UseBorder(BORDER)
  handler() {
    return BORDER.createResponse(HttpStatus.OK, {
      status: "ok",
    });
  }
}
