import { Module } from '@nestjs/common';

import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/user/user.module';
import { PrismaService } from '@/prisma/prisma.service';
import { ArticleModule } from './article/article.module';
import { ConfigModule } from '@/common/config/config.module';
import { UploadModule } from './upload/upload.module';

@Module({
    imports: [
        ConfigModule,
        AuthModule,
        UserModule,
        ArticleModule,
        UploadModule,
    ],
    providers: [PrismaService],
})
export class AppModule {}
