import { Article } from '@/article/entities/article.entity';
import { PublishStatus } from '@prisma/client';

interface InteractionCounts {
    likes: number;
    dislikes: number;
    blocks: number;
}

export class ArticleResponseDto {
    id: string;
    title: string;
    description: string;
    category: string;
    content: string;
    tags: string[];
    images: string[];
    authorName: string;
    isLiked?: boolean;
    isDisliked?: boolean;
    likes: number;
    dislikes: number;
    blocks: number;
    createdAt: Date;
    updatedAt: Date;
    status: PublishStatus;
    publishedAt: Date | null;

    constructor(
        data: Partial<Article>,
        interactions?: InteractionCounts,
        userInteractionType?: 'LIKE' | 'DISLIKE' | 'BLOCK' | null,
    ) {
        Object.assign(this, data);
        this.authorName = data.author?.firstName || 'Unknown Author';
        this.isLiked = userInteractionType === 'LIKE';
        this.isDisliked = userInteractionType === 'DISLIKE';
        this.likes = interactions?.likes || 0;
        this.dislikes = interactions?.dislikes || 0;
        this.blocks = interactions?.blocks || 0;
        this.status = data.status || PublishStatus.DRAFT;
        this.publishedAt = data.publishedAt || null;
    }
}
