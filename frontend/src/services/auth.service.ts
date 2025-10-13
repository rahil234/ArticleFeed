import { api } from '@/lib/api';
import { handleAsync } from '@/utils/handle-async.util';
import { User } from '@/lib/types';

export const authService = {
    register: (data: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        dob: string;
        password: string;
        preferences: string[];
    }) =>
        handleAsync(() =>
            api.post('/auth/register', data).then((res) => res.data),
        ),

    login: (data: { emailOrPhone: string; password: string }) =>
        handleAsync<User, { token: string }>(() =>
            api.post('/auth/login', data).then((res) => res.data),
        ),

    logout: () =>
        handleAsync(() => api.post('/auth/logout').then((res) => res.data)),

    refreshToken: () =>
        handleAsync(() =>
            api.post('/auth/refresh-token').then((res) => res.data),
        ),
};
