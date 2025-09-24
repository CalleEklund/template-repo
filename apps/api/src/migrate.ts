import { Migrater } from './migrater/migrater';
import { MigraterModule } from './migrater/migrater.module';
import { NestFactory } from '@nestjs/core';

const bootstrap = async () => {
  const direction = (() => {
    const value = process.argv[2];
    switch (value) {
      case 'up':
      case 'down':
        return value;
      default:
        throw new Error("Invalid migration direction, must be 'up' or 'down'");
    }
  })();

  const appContext = await NestFactory.createApplicationContext(MigraterModule);
  const migrater = appContext.get(Migrater);
  try {
    await migrater.migrate(direction);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Migration failed!');
    throw error;
  } finally {
    await appContext.close();
  }
};

void bootstrap();
