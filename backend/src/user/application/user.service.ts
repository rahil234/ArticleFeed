import {
    Injectable,
    BadRequestException,
    NotFoundException,
    UnauthorizedException,
    Inject,
} from '@nestjs/common';
import { User } from '../domain/user.entity';
import type { UserRepository } from '../domain/user.repository';
import { UserResponseDto } from '@/user/presentation/dto/user-response.dto';

@Injectable()
export class UserService {
    constructor(
        @Inject('UserRepository')
        private readonly _userRepository: UserRepository,
    ) {}

    async create(dto: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        dob: string;
        hashedPassword: string;
        preferences: string[];
    }): Promise<UserResponseDto> {
        const existing = await this._userRepository.findByEmail(dto.email);
        if (existing)
            throw new BadRequestException('Email or phone already exists');

        const user = new User(
            '',
            dto.firstName,
            dto.lastName,
            dto.email,
            dto.phone,
            new Date(dto.dob),
            dto.hashedPassword,
            dto.preferences,
            new Date(),
            new Date(),
        );

        const createdUser = await this._userRepository.create(user);

        return new UserResponseDto(createdUser);
    }

    async getUserProfile(userId?: string) {
        if (!userId) throw new UnauthorizedException('User not authenticated');

        const user = await this._userRepository.findById(userId);
        if (!user) throw new NotFoundException('User not found');
        return new UserResponseDto(user);
    }

    async findById(id: string): Promise<UserResponseDto> {
        const user = await this._userRepository.findById(id);
        if (!user) throw new NotFoundException('User not found');
        return new UserResponseDto(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this._userRepository.findByEmail(email);
        return user ? user : null;
    }

    async findByEmailOrPhone(identifier: string): Promise<User | null> {
        const user = await this._userRepository.findByEmailOrPhone(identifier);
        return user ? user : null;
    }

    async update(id: string, dto: Partial<User>): Promise<User> {
        return this._userRepository.update(id, dto);
    }

    async remove(id: string): Promise<void> {
        return this._userRepository.delete(id);
    }
}
