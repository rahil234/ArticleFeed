import bcrypt from 'bcryptjs';
import {
    BadRequestException,
    Body,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '@/user/application/user.service';
import { CreateUserDto } from '@/user/presentation/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWTPayload } from '@/common/types';

@Injectable()
export class AuthService {
    constructor(
        private readonly _userService: UserService,
        private readonly _jwtService: JwtService,
        private readonly _configService: ConfigService,
    ) {}

    async register(@Body() dto: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const userToCreate = { ...dto, hashedPassword };

        return await this._userService.create(userToCreate);
    }

    async login(dto: { identifier: string; password: string }) {
        const user = await this._userService.findByEmailOrPhone(dto.identifier);

        if (!user) throw new BadRequestException('Invalid credentials');

        const isPasswordValid = await bcrypt.compare(
            dto.password,
            user.password,
        );
        if (!isPasswordValid)
            throw new BadRequestException('Invalid credentials');

        const accessToken = this._jwtService.sign({
            sub: user.id,
            role: 'user',
        });

        return { user, accessToken };
    }

    verifyToken(token: string) {
        try {
            const JWT_SECRET =
                this._configService.getOrThrow<string>('JWT_SECRET');

            return this._jwtService.verify<JWTPayload>(token, {
                secret: JWT_SECRET,
            });
        } catch {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
