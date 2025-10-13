export interface HTTP_RESPONSE<T = never> {
    message: string;
    success: boolean;
    data: T;
    token?: string;
}
