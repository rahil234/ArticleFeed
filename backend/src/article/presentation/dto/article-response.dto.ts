import { Article } from '@/article/domain/article.entity';

export class ArticleResponseDto {
    id: string;
    title: string;
    description: string;
    category: string;
    content: string;
    tags: string[];
    images: string[];
    authorName: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: Partial<Article>) {
        Object.assign(this, data);
        this.authorName = data.author?.firstName || 'Unknown Author';
    }
}
