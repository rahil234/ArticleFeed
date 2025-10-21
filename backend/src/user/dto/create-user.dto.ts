import {
    IsString,
    IsEmail,
    MinLength,
    IsArray,
    IsPhoneNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'Rahil', description: 'First name of the user' })
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsEmail()
    email: string;

    @IsPhoneNumber('IN', {
        message: 'Phone number must be a valid Indian number',
    })
    @MinLength(10)
    phone: string;

    @IsString()
    dob: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsArray()
    @IsString({ each: true })
    preferences: string[];
}
