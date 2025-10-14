import {
    forwardRef,
    MiddlewareConsumer,
    Module,
    NestModule,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UserModule } from '@/user/user.module';
import { JwtAuthMiddleware } from '@/common/middlewares/jwt-auth.middleware';
import { AuthModule } from '@/auth/auth.module';
import { PrismaInteractionRepository } from '@/article/interaction/infrastructure/prisma-interaction.repository';
import { InteractionService } from '@/article/interaction/application/interaction.service';
import { InteractionController } from '@/article/interaction/presentation/interaction.controller';
import { ArticleModule } from '@/article/article.module';

@Module({
    imports: [UserModule, AuthModule, forwardRef(() => ArticleModule)],
    controllers: [InteractionController],
    providers: [
        {
            provide: 'InteractionService',
            useClass: InteractionService,
        },
        {
            provide: 'InteractionRepository',
            useClass: PrismaInteractionRepository,
        },
        PrismaService,
    ],
})
export class InteractionModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(JwtAuthMiddleware).forRoutes('/interaction');
    }
}
