import morgan from 'morgan';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export function setupApp(app: INestApplication) {
    app.use(
        morgan('dev', {
            skip: (req) => req.method === 'OPTIONS',
        }),
    );

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: false,
            transform: true,
        }),
    );

    const config = new DocumentBuilder()
        .setTitle('ArticleFeed API')
        .setDescription('API documentation for the ArticleFeed project')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    app.setGlobalPrefix('api');

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
        ui: true,
    });

    const configService = app.get(ConfigService);
    const origins = configService.getOrThrow<string>('CORS_ORIGIN').split(',');

    app.enableCors({
        origin: origins,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
}
