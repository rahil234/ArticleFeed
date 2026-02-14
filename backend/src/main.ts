import { join } from 'path';
import { Server } from 'node:http';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { setupApp } from '@/common/config/app.config';
import { Logger, LoggerInstance } from '@/common/logger/winston-logger';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: LoggerInstance,
    });

    // Serve static files from uploads directory
    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });

    setupApp(app);

    const configService = app.get(ConfigService);
    const port = configService.getOrThrow<number>('PORT');

    await app.listen(port).then((value: Server) => {
        const serverAddress = JSON.parse(JSON.stringify(value.address())) as {
            port: number;
            family: string;
            address: string;
        };

        Logger.info(`Server Started Listening: ${serverAddress.port}`);
    });
}

void bootstrap();
