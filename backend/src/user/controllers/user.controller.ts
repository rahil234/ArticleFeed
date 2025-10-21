import {
    Body,
    Controller,
    Get,
    Inject,
    Param,
    Patch,
    Put,
    Req,
    UnauthorizedException,
} from '@nestjs/common';
import type { UserService } from '@/user/services/user.service';
import type { Request } from 'express';
import type { HTTP_RESPONSE } from '@/common/types';
import { UserResponseDto } from '@/user/dto/user-response.dto';
import { UpdateUserPreferencesDto } from '@/user/dto/update-user-preferences.dto';
import { UpdateUserDto } from '@/user/dto/update-user.dto';

@Controller('user')
export class UserController {
    constructor(
        @Inject('UserService') private readonly _userService: UserService,
    ) {}

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

    @Put()
    async updateUser(@Req() req: Request, @Body() dto: Partial<UpdateUserDto>) {
        const userId = req.user?.sub;
        if (!userId) {
            throw new UnauthorizedException('User not authenticated');
        }

        const user = await this._userService.update(userId, dto);

        return {
            message: 'User updated successfully',
            success: true,
            data: new UserResponseDto(user),
        };
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
