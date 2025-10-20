import {
    Injectable,
    BadRequestException,
    NotFoundException,
    UnauthorizedException,
    Inject,
} from '@nestjs/common';
import { User } from '../domain/user.entity';
import type { UserRepository } from '../domain/user.repository';
import { UserResponseDto } from '@/user/dto/user-response.dto';
import { UpdateUserDto } from '@/user/dto/update-user.dto';

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

    async findByEmailOrPhone(identifier: string): Promise<User | null> {
        const user = await this._userRepository.findByEmailOrPhone(identifier);
        return user ? user : null;
    }

    async update(id: string, dto: Partial<UpdateUserDto>): Promise<User> {
        const user = await this._userRepository.findById(id);
        if (!user) throw new NotFoundException('User not found');

        const userData = {
            ...user,
            ...dto,
            dob: dto.dob ? new Date(dto.dob) : user.dob,
            updatedAt: new Date(),
        };

        return this._userRepository.update(id, userData);
    }
}
