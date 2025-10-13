import { Article as ArticleEntity } from '@/article/domain/article.entity';
import { Article as PrismaArticle, User } from '@prisma/client';

export class ArticleMapper {
    static toPersistence(entity: ArticleEntity): Omit<PrismaArticle, 'id'> {
        return {
            title: entity.title,
            category: entity.category,
            authorId: entity.authorId,
            images: entity.images,
            description: entity.description,
            content: entity.content,
            tags: entity.tags,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    static toDomain(
        prismaArticle: PrismaArticle & { author?: User | null },
    ): ArticleEntity {
        return new ArticleEntity(
            prismaArticle.id,
            prismaArticle.title,
            prismaArticle.description,
            prismaArticle.content,
            prismaArticle.category,
            prismaArticle.images,
            prismaArticle.authorId,
            prismaArticle.tags,
            prismaArticle.createdAt,
            prismaArticle.updatedAt,
            prismaArticle.author ? prismaArticle.author : null,
        );
    }
}
