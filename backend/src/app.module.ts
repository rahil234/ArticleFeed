import { Module } from '@nestjs/common';
import { ConfigModule } from '@/common/config/config.module';
import { AuthModule } from '@/auth/auth.module';
import { PrismaService } from '@/prisma/prisma.service';
import { UserModule } from '@/user/user.module';
import { ArticleModule } from './article/article.module';

@Module({
    imports: [ConfigModule, AuthModule, UserModule, ArticleModule],
    providers: [PrismaService],
})
export class AppModule {}
