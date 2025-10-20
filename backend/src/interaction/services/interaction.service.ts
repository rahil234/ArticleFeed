import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { InteractionRepository } from '@/interaction/repositories/interaction.repository';
import { Interaction } from '@/interaction/entities/interaction.entity';
import { ArticleService } from '@/article/services/article.service';

@Injectable()
export class InteractionService {
    constructor(
        @Inject('InteractionRepository')
        private readonly _interactionRepository: InteractionRepository,
        private readonly _articleService: ArticleService,
    ) {}

    async create(
        articleId: string,
        userId: string,
        action: 'like' | 'dislike',
    ): Promise<Interaction> {
        const article = await this._articleService.findOne(articleId);
        if (!article) {
            throw new BadRequestException('Article not found');
        }

        let interactionType: 'LIKE' | 'DISLIKE' | null;

        switch (action) {
            case 'like':
                interactionType = 'LIKE';
                break;
            case 'dislike':
                interactionType = 'DISLIKE';
                break;
            default:
                interactionType = null;
        }

        if (!interactionType) {
            throw new BadRequestException();
        }

        const interaction = new Interaction({
            userId,
            articleId,
            type: interactionType,
        });

        await this._interactionRepository.create(interaction);

        return interaction;
    }
}
