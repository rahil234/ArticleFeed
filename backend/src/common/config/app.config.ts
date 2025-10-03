import { INestApplication } from '@nestjs/common';
import morgan from 'morgan';

export function setupApp(app: INestApplication) {
    app.use(
        morgan('dev', {
            skip: (req) => req.method === 'OPTIONS',
        }),
    );

    app.setGlobalPrefix('api');

    app.enableCors({
        origin: ['http://localhost:3000'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
}
