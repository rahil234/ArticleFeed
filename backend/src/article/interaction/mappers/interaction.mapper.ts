import { Interaction } from '@/article/interaction/domain/interaction.entity';
import { Interaction as PrismaInteraction } from '@prisma/client';

export class InteractionMapper {
    static toDomain(raw: PrismaInteraction): Interaction {
        return new Interaction({
            id: raw.id,
            type: raw.type,
            userId: raw.userId,
            articleId: raw.articleId,
            createdAt: raw.createdAt,
        });
    }

    static toPersistence(
        interaction: Interaction,
    ): Omit<PrismaInteraction, 'createdAt' | 'id'> {
        return {
            type: interaction.type,
            userId: interaction.userId,
            articleId: interaction.articleId,
        };
    }
}
