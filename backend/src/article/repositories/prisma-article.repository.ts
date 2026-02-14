import { Injectable } from '@nestjs/common';
import { Article as PrismaArticle } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';
import { Article } from '@/article/entities/article.entity';
import { ArticleMapper } from '@/article/mappers/article.mapper';
import { BaseRepository } from '@/common/repositories/base.repository';
import { ArticleRepository } from '@/article/repositories/article.repository';

@Injectable()
export class PrismaArticleRepository
    extends BaseRepository<Article, PrismaArticle>
    implements ArticleRepository
{
    constructor(prisma: PrismaService) {
        super(prisma);
    }

    protected getDelegate() {
        return this.prisma.article;
    }

    protected getMapper() {
        return ArticleMapper;
    }

    // Override findAll to include custom logic
    async findAll(): Promise<Article[]> {
        const articles = await this.prisma.article.findMany({
            where: { status: 'PUBLISHED' },
            include: { author: true, interactions: true },
            orderBy: { publishedAt: 'desc' },
        });
        return articles.map((d) => ArticleMapper.toDomain(d));
    }

    // Override findById to include relations
    async findById(id: string): Promise<Article | null> {
        const article = await this.prisma.article.findUnique({
            where: { id },
            include: { interactions: true },
        });
        return article ? ArticleMapper.toDomain(article) : null;
    }

    // Domain-specific methods

    async findManyByUserId(userId: string): Promise<Article[] | null> {
        const articles = await this.prisma.article.findMany({
            where: { authorId: userId },
            include: { interactions: true, author: true },
        });
        return articles.length > 0
            ? articles.map((d) => ArticleMapper.toDomain(d))
            : null;
    }

    async findByCategory(
        userId: string,
        category: string[],
    ): Promise<Article[] | null> {
        const articles = await this.prisma.article.findMany({
            where: {
                category: { in: category },
                authorId: { not: userId },
                status: 'PUBLISHED',
            },
            include: {
                author: true,
                interactions: true,
            },
        });

        return articles.length > 0
            ? articles.map((d) => ArticleMapper.toDomain(d))
            : null;
    }

    async publish(id: string, userId: string): Promise<Article> {
        const updated = await this.prisma.article.update({
            where: { id, authorId: userId },
            data: { status: 'PUBLISHED', publishedAt: new Date() },
        });
        return ArticleMapper.toDomain(updated);
    }

    async unpublish(id: string, userId: string): Promise<Article> {
        const updated = await this.prisma.article.update({
            where: { id, authorId: userId },
            data: { status: 'DRAFT', publishedAt: null },
        });
        return ArticleMapper.toDomain(updated);
    }
}
