import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { ArticleRepository } from '@/article/domain/article.repository';
import { Article } from '@/article/domain/article.entity';
import { CreateArticleDto } from '@/article/presentation/dto/create-article.dto';
import { UserService } from '@/user/application/user.service';

@Injectable()
export class ArticleService {
    constructor(
        @Inject('ArticleRepository')
        private readonly _articleRepository: ArticleRepository,
        private readonly _userService: UserService,
    ) {}

    async create(data: CreateArticleDto, authorId?: string): Promise<Article> {
        if (!authorId) {
            throw new BadRequestException(
                'Author ID is required to create an article',
            );
        }

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

        return await this._articleRepository.create(article);
    }

    async findAll() {
        return await this._articleRepository.findAll();
    }

    async findFeedByUser(userId?: string) {
        if (!userId) {
            throw new BadRequestException('User ID is required to fetch feed');
        }

        const user = await this._userService.findById(userId);
        if (!user) {
            throw new BadRequestException('User not found');
        }

        const categories = user.preferences || [];

        return await this._articleRepository.findByCategory(userId, categories);
    }

    async findByUserId(userId: string): Promise<Article[]> {
        const articles = await this._articleRepository.findManyByUserId(userId);
        return articles ? articles : [];
    }

    async findByCategory(userId: string, ...categories: string[]) {
        return await this._articleRepository.findByCategory(userId, categories);
    }

    async findOne(id: string) {
        return await this._articleRepository.findById(id);
    }

    async update(id: string, data: Partial<Article>) {
        return await this._articleRepository.update(id, data);
    }

    async remove(id: string) {
        return await this._articleRepository.delete(id);
    }
}
