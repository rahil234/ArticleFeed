import {
    Controller,
    Post,
    Body,
    Param,
    Req,
    UnauthorizedException,
    Inject,
} from '@nestjs/common';
import type { InteractionService } from '@/article/interaction/application/interaction.service';
import type { Request } from 'express';
import type { HTTP_RESPONSE } from '@/common/types';

@Controller('interaction')
export class InteractionController {
    constructor(
        @Inject('InteractionService')
        private readonly _interactionService: InteractionService,
    ) {}

    @Post(':id')
    async interact(
        @Param('id') id: string,
        @Body('type') type: 'like' | 'dislike',
        @Req() req: Request,
    ): Promise<HTTP_RESPONSE> {
        const userId = req.user?.sub;
        if (!userId) {
            throw new UnauthorizedException('User not authenticated');
        }

        const result = await this._interactionService.create(id, userId, type);

        if (!result) {
            return {
                message: 'Article not found',
                success: false,
            };
        }
        return {
            message: 'Interaction recorded successfully',
            success: true,
        };
    }
}
