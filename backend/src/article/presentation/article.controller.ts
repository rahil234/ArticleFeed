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
} from '@nestjs/common';
import type { Request } from 'express';
import { ArticleService } from '@/article/application/article.service';
import { CreateArticleDto } from '@/article/presentation/dto/create-article.dto';
import { UpdateArticleDto } from '@/article/presentation/dto/update-article.dto';
import type { HTTP_RESPONSE } from '@/common/types';
import { ArticleResponseDto } from '@/article/presentation/dto/article-response.dto';

@Controller('article')
export class ArticleController {
    constructor(private readonly _articleService: ArticleService) {}

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
}
