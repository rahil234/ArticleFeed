import {
    forwardRef,
    MiddlewareConsumer,
    Module,
    NestModule,
} from '@nestjs/common';
import { UserService } from '@/user/application/user.service';
import { UserController } from '@/user/presentation/user.controller';
import { PrismaUserRepository } from '@/user/infrastructure/prisma-user.repository';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtAuthMiddleware } from '@/common/middlewares/jwt-auth.middleware';
import { AuthModule } from '@/auth/auth.module';

@Module({
    imports: [forwardRef(() => AuthModule)],
    controllers: [UserController],
    providers: [
        UserService,
        PrismaService,
        { provide: 'UserRepository', useClass: PrismaUserRepository },
    ],
    exports: [UserService],
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(JwtAuthMiddleware).forRoutes('/user/me');
    }
}
