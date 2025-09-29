import { VersionTag } from "./app.constants";
import { AppModule } from "./app.module";
import { ConfigurationService } from "./platform/configuration";
import * as dotenvx from "@dotenvx/dotenvx";
import { Logger, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { writeFile } from "node:fs/promises";

dotenvx.config({
  path: [".env"],
  ignore: ["MISSING_ENV_FILE"],
});

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: "v",
  });
  const logger = new Logger();
  app.useLogger(logger);
  const configurationService = app.get(ConfigurationService);
  const port = configurationService.get().server.port;
  app.enableCors({
    origin: ["http://localhost:3000"],
    credentials: true,
  });
  app.useBodyParser("json", { limit: "50mb" });
  app.useBodyParser("urlencoded", { limit: "50mb", extended: true });

  const config = new DocumentBuilder()
    .setTitle("API")
    .setVersion(VersionTag.V1)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  document.openapi = "3.1.0";
  await writeFile("./openapi-spec.json", JSON.stringify(document, null, "\t"));
  SwaggerModule.setup("/api", app, document);
  await app.listen(port);
}
void bootstrap();
