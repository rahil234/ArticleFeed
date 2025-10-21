import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { InteractionRepository } from '@/interaction/repositories/interaction.repository';
import { Interaction } from '@/interaction/entities/interaction.entity';
import { InteractionMapper } from '@/interaction/mappers/interaction.mapper';

@Injectable()
export class PrismaInteractionRepository implements InteractionRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(interaction: Interaction): Promise<Interaction> {
        const created = await this.prisma.interaction.create({
            data: InteractionMapper.toPersistence(interaction),
        });
        return InteractionMapper.toDomain(created);
    }

    async findAll(): Promise<Interaction[]> {
        const records = await this.prisma.interaction.findMany();
        return records.map((d) => InteractionMapper.toDomain(d));
    }

    async findByArticleId(articleId: string): Promise<Interaction[] | null> {
        const records = await this.prisma.interaction.findMany({
            where: { articleId },
        });
        return records.length
            ? records.map((d) => InteractionMapper.toDomain(d))
            : null;
    }

    async findManyByUserId(userId: string): Promise<Interaction[] | null> {
        const records = await this.prisma.interaction.findMany({
            where: { userId },
        });
        return records.length
            ? records.map((d) => InteractionMapper.toDomain(d))
            : null;
    }

    async delete(id: string): Promise<void> {
        await this.prisma.interaction.delete({ where: { id } });
    }
}
