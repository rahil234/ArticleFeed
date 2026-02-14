import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Req,
    Put,
    UnauthorizedException,
    Inject,
} from '@nestjs/common';
import type { Request } from 'express';
import type { ArticleService } from '@/article/services/article.service';
import { CreateArticleDto } from '@/article/dto/create-article.dto';
import { UpdateArticleDto } from '@/article/dto/update-article.dto';
import type { HTTP_RESPONSE } from '@/common/types';
import { ArticleResponseDto } from '@/article/dto/article-response.dto';

@Controller('article')
export class ArticleController {
    constructor(
        @Inject('ArticleService')
        private readonly _articleService: ArticleService,
    ) {}

    @Get('public')
    async findAllPublic(): Promise<HTTP_RESPONSE<ArticleResponseDto[]>> {
        const data = await this._articleService.findAllPublic();

        return {
            message: 'Public articles fetched successfully',
            success: true,
            data: data,
        };
    }

    @Get('public/:id')
    async findOnePublic(
        @Param('id') id: string,
    ): Promise<HTTP_RESPONSE<ArticleResponseDto | null>> {
        const data = await this._articleService.findOne(id);
        return {
            message: 'Article fetched successfully',
            success: true,
            data,
        };
    }

    @Get()
    async findUserArticles(
        @Req() req: Request,
    ): Promise<HTTP_RESPONSE<ArticleResponseDto[]>> {
        const userId = req.user?.sub;
        if (!userId) {
            throw new UnauthorizedException('User not authenticated');
        }
        const data = await this._articleService.findByUserId(userId);

        return {
            message: 'Articles fetched successfully',
            success: true,
            data: data,
        };
    }

    @Post()
    async create(
        @Req() req: Request,
        @Body() dto: CreateArticleDto,
    ): Promise<HTTP_RESPONSE<ArticleResponseDto>> {
        const userId = req.user?.sub;
        if (!userId) throw new UnauthorizedException('User not authenticated');

        const data = await this._articleService.create(dto, userId);
        return {
            message: 'Article created successfully',
            success: true,
            data,
        };
    }

    @Get('feed')
    async findFeed(
        @Req() req: Request,
    ): Promise<HTTP_RESPONSE<ArticleResponseDto[]>> {
        const userId = req.user?.sub;
        if (!userId) throw new UnauthorizedException('User not authenticated');

        const data = await this._articleService.findFeedByUser(userId);

        return {
            message: 'Articles fetched successfully',
            success: true,
            data,
        };
    }

    @Get(':id')
    async findOne(
        @Param('id') id: string,
    ): Promise<HTTP_RESPONSE<ArticleResponseDto | null>> {
        const data = await this._articleService.findOne(id);
        return {
            message: 'Article fetched successfully',
            success: true,
            data,
        };
    }

    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() updateArticleDto: UpdateArticleDto,
    ) {
        return this._articleService.update(id, updateArticleDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this._articleService.remove(id);
    }

    @Post(':id/publish')
    async publish(
        @Param('id') id: string,
        @Req() req: Request,
    ): Promise<HTTP_RESPONSE<ArticleResponseDto>> {
        const userId = req.user?.sub;
        if (!userId) throw new UnauthorizedException('User not authenticated');

        const data = await this._articleService.publish(id, userId);
        return {
            message: 'Article published successfully',
            success: true,
            data,
        };
    }

    @Post(':id/unpublish')
    async unpublish(
        @Param('id') id: string,
        @Req() req: Request,
    ): Promise<HTTP_RESPONSE<ArticleResponseDto>> {
        const userId = req.user?.sub;
        if (!userId) throw new UnauthorizedException('User not authenticated');

        const data = await this._articleService.unpublish(id, userId);
        return {
            message: 'Article unpublished successfully',
            success: true,
            data,
        };
    }
}
