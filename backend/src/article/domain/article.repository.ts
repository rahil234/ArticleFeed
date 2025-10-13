import { Article } from '@/article/domain/article.entity';

export interface ArticleRepository {
    create(user: Article): Promise<Article>;
    findAll(): Promise<Article[]>;
    findById(id: string): Promise<Article | null>;
    findManyByUserId(userId: string): Promise<Article[] | null>;
    findByCategory(
        userId: string,
        category: string[],
    ): Promise<Article[] | null>;
    update(id: string, data: Partial<Article>): Promise<Article>;
    delete(id: string): Promise<void>;
}
