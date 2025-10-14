import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { ArticleRepository } from '@/article/domain/article.repository';
import { Article } from '@/article/domain/article.entity';
import { CreateArticleDto } from '@/article/presentation/dto/create-article.dto';
import { UserService } from '@/user/application/user.service';
import { ArticleResponseDto } from '@/article/presentation/dto/article-response.dto';
import { Interaction } from '@/article/interaction/domain/interaction.entity';

@Injectable()
export class ArticleService {
    constructor(
        @Inject('ArticleRepository')
        private readonly _articleRepository: ArticleRepository,
        private readonly _userService: UserService,
    ) {}

    async create(
        data: CreateArticleDto,
        authorId: string,
    ): Promise<ArticleResponseDto> {
        const article = new Article(
            '',
            data.title,
            data.description,
            data.content,
            data.category,
            data.images || [],
            authorId,
            data.tags || [],
            new Date(),
            new Date(),
        );

        const createdArticle = await this._articleRepository.create(article);

        return new ArticleResponseDto(createdArticle);
    }

    async findFeedByUser(userId: string): Promise<ArticleResponseDto[]> {
        const user = await this._userService.findById(userId);
        if (!user) {
            throw new BadRequestException('User not found');
        }

        const categories = user.preferences || [];

        const articles = await this._articleRepository.findByCategory(
            userId,
            categories,
        );

        const res = articles?.map((article) => {
            const interactions = (article.interactions ?? []) as Interaction[];
            const counts = {
                likes: interactions.filter((i) => i.type === 'LIKE').length,
                dislikes: interactions.filter((i) => i.type === 'DISLIKE')
                    .length,
                blocks: 0,
            };

            const userInteraction = article.interactions.find(
                //@ts-expect-error userId exists in interaction
                (i) => i.userId === userId,
            );

            return new ArticleResponseDto(
                article,
                counts,
                userInteraction?.type,
            );
        });

        return res ? res : [];
    }

    async findByUserId(userId: string): Promise<ArticleResponseDto[]> {
        const articles = await this._articleRepository.findManyByUserId(userId);

        const res = articles?.map((article) => {
            const interactions = (article.interactions ?? []) as Interaction[];
            const counts = {
                likes: interactions.filter((i) => i.type === 'LIKE').length,
                dislikes: interactions.filter((i) => i.type === 'DISLIKE')
                    .length,
                blocks: 0,
            };

            return new ArticleResponseDto(article, counts);
        });

        return res ? res : [];
    }

    async findOne(id: string): Promise<ArticleResponseDto> {
        const article = await this._articleRepository.findById(id);
        if (!article) {
            throw new BadRequestException('Article not found');
        }
        return new ArticleResponseDto(article);
    }

    async update(id: string, data: Partial<Article>) {
        return await this._articleRepository.update(id, data);
    }

    async remove(id: string) {
        return await this._articleRepository.delete(id);
    }
}
