import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, LoggerInstance } from '@/common/logger/winston-logger';
import { setupApp } from '@/common/config/app.config';
import { ConfigService } from '@nestjs/config';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule, {
        logger: LoggerInstance,
    });

    setupApp(app);

    const configService = app.get(ConfigService);
    const port = configService.getOrThrow<number>('PORT');

    await app.listen(port, () => {
        Logger.info(`Server is running on http://localhost:${port}`);
    });
}

void bootstrap();
