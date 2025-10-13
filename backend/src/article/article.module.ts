import { Module } from '@nestjs/common';
import { ArticleService } from '@/article/application/article.service';
import { ArticleController } from '@/article/presentation/article.controller';
import { PrismaArticleRepository } from '@/article/infrastructure/prisma-article.repository';
import { PrismaService } from '@/prisma/prisma.service';
import { UserModule } from '@/user/user.module';

@Module({
    imports: [UserModule],
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
export class ArticleModule {}
