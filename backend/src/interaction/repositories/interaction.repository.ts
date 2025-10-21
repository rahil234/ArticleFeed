import { Interaction } from '@/interaction/entities/interaction.entity';

export interface InteractionRepository {
    create(interaction: Interaction): Promise<Interaction>;
    findAll(): Promise<Interaction[]>;
    findByArticleId(articleId: string): Promise<Interaction[] | null>;
    findManyByUserId(userId: string): Promise<Interaction[] | null>;
    delete(id: string): Promise<void>;
}
