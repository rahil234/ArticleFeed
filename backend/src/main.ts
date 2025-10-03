import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import morgan from 'morgan';
import { Logger, LoggerInstance } from '@/common/logger/winston-logger';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule, {
        logger: LoggerInstance,
    });

    app.use(morgan('dev'));

    app.setGlobalPrefix('api');

    app.enableCors({
        origin: ['http://localhost:3000'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });

    const port = process.env.PORT;
    if (!port) {
        throw new Error('PORT environment variable is not set');
    }

    await app.listen(port, () => {
        Logger.log('info', `Server is running on http://localhost:${port}`);
    });
}

void bootstrap();
