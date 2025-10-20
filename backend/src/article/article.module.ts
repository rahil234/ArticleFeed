import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ArticleService } from '@/article/services/article.service';
import { ArticleController } from '@/article/controllers/article.controller';
import { PrismaArticleRepository } from '@/article/repositories/prisma-article.repository';
import { PrismaService } from '@/prisma/prisma.service';
import { UserModule } from '@/user/user.module';
import { JwtAuthMiddleware } from '@/common/middlewares/jwt-auth.middleware';
import { AuthModule } from '@/auth/auth.module';
import { InteractionModule } from '@/interaction/interaction.module';

@Module({
    imports: [UserModule, AuthModule, InteractionModule],
    controllers: [ArticleController],
    providers: [
        ArticleService,
        {
            provide: 'ArticleRepository',
            useClass: PrismaArticleRepository,
        },
        PrismaService,
    ],
    exports: [ArticleService, 'ArticleRepository'],
})
export class ArticleModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer
            .apply(JwtAuthMiddleware)
            .forRoutes('/article', '/article/feed');
    }
}
