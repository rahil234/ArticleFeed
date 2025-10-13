import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, LoggerInstance } from '@/common/logger/winston-logger';
import { setupApp } from '@/common/config/app.config';
import { ConfigService } from '@nestjs/config';
import { Server } from 'node:http';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule, {
        logger: LoggerInstance,
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
