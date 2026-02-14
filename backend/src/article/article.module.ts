import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';

import { UserModule } from '@/user/user.module';
import { AuthModule } from '@/auth/auth.module';
import { PrismaService } from '@/prisma/prisma.service';
import { InteractionModule } from '@/interaction/interaction.module';
import { ArticleServiceImpl } from '@/article/services/article.service.impl';
import { JwtAuthMiddleware } from '@/common/middlewares/jwt-auth.middleware';
import { ArticleController } from '@/article/controllers/article.controller';
import { PrismaArticleRepository } from '@/article/repositories/prisma-article.repository';

@Module({
    imports: [UserModule, AuthModule, InteractionModule],
    controllers: [ArticleController],
    providers: [
        { provide: 'ArticleService', useClass: ArticleServiceImpl },
        {
            provide: 'ArticleRepository',
            useClass: PrismaArticleRepository,
        },
        PrismaService,
    ],
    exports: ['ArticleService', 'ArticleRepository'],
})
export class ArticleModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer
            .apply(JwtAuthMiddleware)
            .exclude(
                { path: 'article/public', method: RequestMethod.GET },
                { path: 'article/public/:id', method: RequestMethod.GET },
            )
            .forRoutes(ArticleController);
    }
}
