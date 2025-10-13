import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '@/user/presentation/dto/create-user.dto';
import { AuthService } from '@/auth/auth.service';
import { UserResponseDto } from '@/user/presentation/dto/user-response.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { HTTP_RESPONSE } from '@/common/types';

@Controller('auth')
export class AuthController {
    constructor(private readonly _authService: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    @ApiResponse({ status: 400, description: 'Validation failed' })
    async register(@Body() dto: CreateUserDto): Promise<HTTP_RESPONSE> {
        await this._authService.register(dto);

        return {
            message: 'User registered successfully',
            success: true,
        };
    }

    @Post('login')
    async login(
        @Body() dto: { emailOrPhone: string; password: string },
    ): Promise<HTTP_RESPONSE<UserResponseDto>> {
        const { user, accessToken } = await this._authService.login({
            identifier: dto.emailOrPhone,
            password: dto.password,
        });

        return {
            message: 'Login successful',
            success: true,
            data: user,
            token: accessToken,
        };
    }
}
