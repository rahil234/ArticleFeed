import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UserRepository } from '@/user/domain/user.repository';
import { UserMapper } from '@/user/mappers/user.mapper';
import { User } from '@/user/domain/user.entity';

@Injectable()
export class PrismaUserRepository implements UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(user: User): Promise<User> {
        const created = await this.prisma.user.create({
            data: UserMapper.toPersistence(user),
        });
        return UserMapper.toDomain(created);
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({ where: { id } });
        return user ? UserMapper.toDomain(user) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.user.findFirst({
            where: { email },
        });
        return user ? UserMapper.toDomain(user) : null;
    }

    async findByEmailOrPhone(identifier: string): Promise<User | null> {
        const user = await this.prisma.user.findFirst({
            where: { OR: [{ email: identifier }, { phone: identifier }] },
        });
        return user ? UserMapper.toDomain(user) : null;
    }

    async update(id: string, data: Partial<User>): Promise<User> {
        const updated = await this.prisma.user.update({
            where: { id },
            data: data,
        });
        return UserMapper.toDomain(updated);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.user.delete({ where: { id } });
    }
}
