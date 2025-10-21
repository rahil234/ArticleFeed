import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
    @IsString()
    title: string;

    @IsString()
    content: string;

    @IsString()
    description: string;

    @IsString()
    category: string;

    @IsArray()
    @IsOptional()
    tags?: string[];

    @IsArray()
    @IsOptional()
    images?: string[];
}
