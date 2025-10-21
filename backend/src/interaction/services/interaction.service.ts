import { Interaction } from '@/interaction/entities/interaction.entity';

export interface InteractionService {
    create(
        articleId: string,
        userId: string,
        action: 'like' | 'dislike',
    ): Promise<Interaction>;
}
