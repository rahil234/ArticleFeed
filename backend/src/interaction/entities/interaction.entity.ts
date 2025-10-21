export class Interaction {
    constructor(
        public readonly props: {
            id?: string;
            type: 'LIKE' | 'DISLIKE';
            userId: string;
            articleId: string;
            createdAt?: Date;
        },
    ) {}

    get id() {
        return this.props.id!;
    }

    get type() {
        return this.props.type;
    }

    get userId() {
        return this.props.userId;
    }

    get articleId() {
        return this.props.articleId;
    }

    get createdAt() {
        return this.props.createdAt ?? new Date();
    }
}
