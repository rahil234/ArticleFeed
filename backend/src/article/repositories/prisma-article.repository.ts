import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Article } from '@/article/entities/article.entity';
import { Article as PrismaArticle } from '@prisma/client';
import { ArticleRepository } from '@/article/repositories/article.repository';
import { ArticleMapper } from '@/article/mappers/article.mapper';

@Injectable()
export class PrismaArticleRepository implements ArticleRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(article: Article): Promise<Article> {
        const created = await this.prisma.article.create({
            data: ArticleMapper.toPersistence(article),
        });
        return ArticleMapper.toDomain(created);
    }

    async findAll(): Promise<Article[]> {
        const users = await this.prisma.article.findMany();
        return users.map((d) => ArticleMapper.toDomain(d));
    }

    async findById(id: string): Promise<Article | null> {
        const article = await this.prisma.article.findUnique({
            where: { id },
            include: { interactions: true },
        });
        return article ? ArticleMapper.toDomain(article) : null;
    }

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
            where: { category: { in: category }, authorId: { not: userId } },
            include: {
                author: true,
                interactions: true,
            },
        });

        return articles.length > 0
            ? articles.map((d) => ArticleMapper.toDomain(d))
            : null;
    }

    async update(id: string, data: Partial<PrismaArticle>): Promise<Article> {
        const updated = await this.prisma.article.update({
            where: { id },
            data,
        });
        return ArticleMapper.toDomain(updated);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.article.delete({ where: { id } });
    }
}
