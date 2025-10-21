import {
    forwardRef,
    MiddlewareConsumer,
    Module,
    NestModule,
} from '@nestjs/common';
import { UserController } from '@/user/controllers/user.controller';
import { PrismaUserRepository } from '@/user/infrastructure/prisma-user.repository';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtAuthMiddleware } from '@/common/middlewares/jwt-auth.middleware';
import { AuthModule } from '@/auth/auth.module';
import { UserServiceImpl } from '@/user/services/user.service.impl';

@Module({
    imports: [forwardRef(() => AuthModule)],
    controllers: [UserController],
    providers: [
        { provide: 'UserService', useClass: UserServiceImpl },
        PrismaService,
        { provide: 'UserRepository', useClass: PrismaUserRepository },
    ],
    exports: ['UserService'],
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(JwtAuthMiddleware).forRoutes('user', '/user/me');
    }
}
