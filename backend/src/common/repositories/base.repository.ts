import { PrismaService } from '@/prisma/prisma.service';

/**
 * Prisma delegate interface for type-safe operations
 */
interface PrismaDelegate<T> {
    create: (args: { data: any }) => Promise<T>;
    findUnique: (args: { where: { id: string } }) => Promise<T | null>;
    findMany: (args?: any) => Promise<T[]>;
    update: (args: { where: { id: string }; data: any }) => Promise<T>;
    delete: (args: { where: { id: string } }) => Promise<T>;
}

/**
 * Mapper interface for domain/persistence transformation
 */
interface EntityMapper<TEntity, TPrismaModel> {
    toDomain: (prismaModel: TPrismaModel) => TEntity;
    toPersistence: (entity: TEntity) => Partial<TPrismaModel>;
}

/**
 * Base Repository for common CRUD operations
 * Provides type-safe generic implementation for standard database operations
 *
 * @template TEntity - Domain entity type
 * @template TPrismaModel - Prisma model type
 */
export abstract class BaseRepository<TEntity, TPrismaModel> {
    protected constructor(protected readonly prisma: PrismaService) {}

    /**
     * Get the Prisma delegate for this repository
     * Must be implemented by child repositories
     */
    protected abstract getDelegate(): PrismaDelegate<TPrismaModel>;

    /**
     * Get the mapper for this repository
     * Must be implemented by child repositories
     */
    protected abstract getMapper(): EntityMapper<TEntity, TPrismaModel>;

    /**
     * Create a new entity
     */
    async create(entity: TEntity): Promise<TEntity> {
        const mapper = this.getMapper();
        const delegate = this.getDelegate();

        const created = await delegate.create({
            data: mapper.toPersistence(entity),
        });

        return mapper.toDomain(created);
    }

    /**
     * Find entity by ID
     */
    async findById(id: string): Promise<TEntity | null> {
        const mapper = this.getMapper();
        const delegate = this.getDelegate();

        const entity = await delegate.findUnique({
            where: { id },
        });

        return entity ? mapper.toDomain(entity) : null;
    }

    /**
     * Find all entities
     */
    async findAll(): Promise<TEntity[]> {
        const mapper = this.getMapper();
        const delegate = this.getDelegate();

        const entities = await delegate.findMany();

        return entities.map((entity) => mapper.toDomain(entity));
    }

    /**
     * Update entity by ID
     */
    async update(id: string, data: Partial<TPrismaModel>): Promise<TEntity> {
        const mapper = this.getMapper();
        const delegate = this.getDelegate();

        const updated = await delegate.update({
            where: { id },
            data,
        });

        return mapper.toDomain(updated);
    }

    /**
     * Delete entity by ID
     */
    async delete(id: string): Promise<void> {
        const delegate = this.getDelegate();

        await delegate.delete({
            where: { id },
        });
    }
}
