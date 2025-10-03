import { Controller, Post } from '@nestjs/common';
import type { HTTP_RESPONSE, User } from '@/common/types';

@Controller('/auth')
export class AuthController {
    @Post('login')
    login(): HTTP_RESPONSE<User> {
        return {
            message: 'Login successful',
            success: true,
            data: {
                id: '1',
                username: 'username',
                email: 'example@gmail.com',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        };
    }

    @Post('register')
    register(): HTTP_RESPONSE<null> {
        return {
            message: 'Registration successful',
            success: true,
        };
    }
}
