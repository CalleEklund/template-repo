import { defaultOptions, i18next } from '@template-repo/i18n';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import i18nextMiddleware from 'i18next-http-middleware';

@Module({})
export class I18nModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    void i18next.use(i18nextMiddleware.LanguageDetector).init({
      ...defaultOptions,
      detection: {
        order: ['querystring', 'cookie', 'header'],
        caches: ['cookie'],
      },
    });

    consumer.apply(i18nextMiddleware.handle(i18next)).forRoutes('*');
  }
}
