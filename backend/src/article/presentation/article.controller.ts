import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Req,
    Put,
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
    async findAll(): Promise<HTTP_RESPONSE<ArticleResponseDto[]>> {
        const articles = await this._articleService.findAll();
        return {
            message: 'Articles fetched successfully',
            success: true,
            data: articles.map((article) => new ArticleResponseDto(article)),
        };
    }

    @Post()
    async create(
        @Req() req: Request,
        @Body() dto: CreateArticleDto,
    ): Promise<HTTP_RESPONSE<ArticleResponseDto>> {
        const article = await this._articleService.create(dto, req.user?.sub);
        return {
            message: 'Article created successfully',
            success: true,
            data: new ArticleResponseDto(article),
        };
    }

    @Get('feed')
    async findFeed(
        @Req() req: Request,
    ): Promise<HTTP_RESPONSE<ArticleResponseDto[]>> {
        const data = await this._articleService.findFeedByUser(req.user?.sub);

        const MappedData = data?.length
            ? data.map((item) => new ArticleResponseDto(item))
            : [];

        return {
            message: 'Articles fetched successfully',
            success: true,
            data: MappedData,
        };
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this._articleService.findOne(id);
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
