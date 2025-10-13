import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ArticleService } from '@/article/application/article.service';
import { ArticleController } from '@/article/presentation/article.controller';
import { PrismaArticleRepository } from '@/article/infrastructure/prisma-article.repository';
import { PrismaService } from '@/prisma/prisma.service';
import { UserModule } from '@/user/user.module';
import { JwtAuthMiddleware } from '@/common/middlewares/jwt-auth.middleware';
import { AuthModule } from '@/auth/auth.module';

@Module({
    imports: [UserModule, AuthModule],
    controllers: [ArticleController],
    providers: [
        ArticleService,
        {
            provide: 'ArticleRepository',
            useClass: PrismaArticleRepository,
        },
        PrismaService,
    ],
})
export class ArticleModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer
            .apply(JwtAuthMiddleware)
            .forRoutes('/article', '/article/feed');
    }
}
