import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserPreferencesDto extends PickType(CreateUserDto, [
    'preferences',
]) {}
