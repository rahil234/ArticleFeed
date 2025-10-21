import { User } from '@/user/domain/user.entity';

export class UserResponseDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    dob: Date;
    preferences: string[];

    constructor(user: User) {
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.dob = user.dob;
        this.preferences = user.preferences;
    }
}
