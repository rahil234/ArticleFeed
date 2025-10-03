export interface HTTP_RESPONSE<T> {
    message: string;
    success: boolean;
    data?: T;
}

export interface User {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}