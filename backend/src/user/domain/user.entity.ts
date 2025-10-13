export class User {
    constructor(
        public id: string,
        public firstName: string,
        public lastName: string,
        public email: string,
        public phone: string,
        public dob: Date,
        public password: string,
        public preferences: string[],
        public createdAt: Date,
        public updatedAt: Date,
    ) {}
}
