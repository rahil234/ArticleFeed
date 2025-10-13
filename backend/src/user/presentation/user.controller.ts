import { Body, Controller, Get, Param, Patch, Req } from '@nestjs/common';
import { UserService } from '@/user/application/user.service';
import type { Request } from 'express';
import type { HTTP_RESPONSE } from '@/common/types';
import { UserResponseDto } from '@/user/presentation/dto/user-response.dto';
import { UpdateUserPreferencesDto } from '@/user/presentation/dto/update-user-preferences.dto';

@Controller('user')
export class UserController {
    constructor(private readonly _userService: UserService) {}

    @Get('me')
    async getUser(
        @Req() req: Request,
    ): Promise<HTTP_RESPONSE<UserResponseDto>> {
        const user = await this._userService.getUserProfile(req.user?.sub);

        return {
            message: 'Fetched user successfully',
            success: true,
            data: user,
        };
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this._userService.findById(id);
    }

    @Patch('preferences')
    async updatePreferences(
        @Req() req: Request,
        @Body() dto: UpdateUserPreferencesDto,
    ): Promise<HTTP_RESPONSE<UserResponseDto>> {
        const userId = req.user?.sub;
        if (!userId) {
            return {
                message: 'User not authenticated',
                success: false,
            };
        }

        const user = await this._userService.update(userId, {
            preferences: dto.preferences,
        });

        return {
            message: 'Preferences updated successfully',
            success: true,
            data: new UserResponseDto(user),
        };
    }
}
