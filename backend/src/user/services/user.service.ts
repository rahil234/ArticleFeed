import { User } from '../domain/user.entity';
import { UserResponseDto } from '@/user/dto/user-response.dto';
import { UpdateUserDto } from '@/user/dto/update-user.dto';

export interface UserService {
    create(dto: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        dob: string;
        hashedPassword: string;
        preferences: string[];
    }): Promise<UserResponseDto>;

    getUserProfile(userId?: string): Promise<UserResponseDto>;

    findById(id: string): Promise<UserResponseDto>;

    findByEmailOrPhone(identifier: string): Promise<User | null>;

    update(id: string, dto: Partial<UpdateUserDto>): Promise<User>;
}
