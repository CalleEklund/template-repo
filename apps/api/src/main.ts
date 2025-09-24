import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, VersioningType } from '@nestjs/common';
import { ConfigurationService } from './configuration';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersionTag } from './app.constants';
import * as fs from 'fs/promises';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });
  const logger = new Logger();
  const configurationService = app.get(ConfigurationService);
  const port = configurationService.get().server.port;
  app.enableCors({
    origin: configurationService.get().server.corsOrigins,
    credentials: true,
  });
  app.useBodyParser('json', { limit: '50mb' });
  app.useBodyParser('urlencoded', { limit: '50mb', extended: true });

  const config = new DocumentBuilder()
    .setTitle('API')
    .setVersion(VersionTag.V1)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  document.openapi = '3.1.0';
  void fs.writeFile(
    './openapi-spec.json',
    JSON.stringify(document, null, '\t'),
  );
  SwaggerModule.setup('/api', app, document);
  //swager localhost:9000/api
  await app.listen(port, async () => {
    logger.log(`Running on: ${await app.getUrl()} ${port}`);
  });
}
bootstrap();
