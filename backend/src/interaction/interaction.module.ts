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
import { PrismaInteractionRepository } from '@/interaction/repositories/prisma-interaction.repository';
import { InteractionController } from '@/interaction/controllers/interaction.controller';
import { ArticleModule } from '@/article/article.module';
import { InteractionServiceImpl } from '@/interaction/services/interaction.service.impl';

@Module({
    imports: [UserModule, AuthModule, forwardRef(() => ArticleModule)],
    controllers: [InteractionController],
    providers: [
        {
            provide: 'InteractionService',
            useClass: InteractionServiceImpl,
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
