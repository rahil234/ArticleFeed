import { User as UserEntity } from '../domain/user.entity';
import { User as PrismaUser } from '@prisma/client';

export class UserMapper {
    static toPersistence(
        entity: Omit<UserEntity, 'id'>,
    ): Omit<PrismaUser, 'id'> {
        return {
            firstName: entity.firstName,
            lastName: entity.lastName,
            email: entity.email,
            phone: entity.phone,
            dob: entity.dob,
            password: entity.password,
            preferences: entity.preferences,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    static toDomain(prismaUser: PrismaUser): UserEntity {
        return new UserEntity(
            prismaUser.id,
            prismaUser.firstName,
            prismaUser.lastName,
            prismaUser.email,
            prismaUser.phone,
            prismaUser.dob,
            prismaUser.password,
            prismaUser.preferences,
            prismaUser.createdAt,
            prismaUser.updatedAt,
        );
    }
}
