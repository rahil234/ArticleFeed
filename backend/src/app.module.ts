import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@/common/config/config.module';
import { AuthModule } from '@/auth/auth.module';
import { PrismaService } from '@/prisma/prisma.service';
import { UserModule } from '@/user/user.module';
import { JwtAuthMiddleware } from '@/common/middlewares/jwt-auth.middleware';
import { ArticleModule } from './article/article.module';

@Module({
    imports: [ConfigModule, AuthModule, UserModule, ArticleModule],
    providers: [PrismaService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer
            .apply(JwtAuthMiddleware)
            .forRoutes('/user/me', '/user/preferences');
        consumer
            .apply(JwtAuthMiddleware)
            .forRoutes('/article', '/article/feed');
    }
}
