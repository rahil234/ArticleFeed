import { api } from '@/lib/api';
import { handleAsync } from '@/utils/handle-async.util';
import { User } from '@/lib/types';

export const userService = {
    getCurrentUser: () => {
        return handleAsync<User>(() =>
            api.get('/user/me').then((res) => res.data),
        );
    },

    updateProfile: (
        data: Partial<{
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
            dob: string;
        }>,
    ) => handleAsync(() => api.put('/user/profile', data)),

    updatePassword: (data: { currentPassword: string; newPassword: string }) =>
        handleAsync(() => api.patch('/user/password', data)),

    updatePreferences: (preferences: string[]) =>
        handleAsync(() =>
            api
                .patch('/user/preferences', { preferences })
                .then((res) => res.data),
        ),
};
