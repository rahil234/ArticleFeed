import { Article } from '@/article/entities/article.entity';
import { CreateArticleDto } from '@/article/dto/create-article.dto';
import { ArticleResponseDto } from '@/article/dto/article-response.dto';

export interface ArticleService {
    create(
        data: CreateArticleDto,
        authorId: string,
    ): Promise<ArticleResponseDto>;

    findFeedByUser(userId: string): Promise<ArticleResponseDto[]>;

    findByUserId(userId: string): Promise<ArticleResponseDto[]>;

    findOne(id: string): Promise<ArticleResponseDto>;

    update(id: string, data: Partial<Article>): Promise<Article>;

    remove(id: string): Promise<void>;
}
