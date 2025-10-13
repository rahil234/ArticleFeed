import { User } from '@prisma/client';

export class Article {
    constructor(
        public readonly id: string,
        public title: string,
        public description: string,
        public content: string,
        public category: string,
        public images: string[],
        public authorId: string,
        public tags: string[],
        public createdAt: Date,
        public updatedAt: Date,
        public author: User | null = null,
    ) {}
}
