import { api } from '@/lib/api';
import { handleAsync } from '@/utils/handle-async.util';
import { Article } from '@/lib/types';

export const articleService = {
    getFeed: async (params?: { page?: number; limit?: number }) => {
        const p = {
            page: String(params?.page || 1),
            limit: String(params?.limit || 10),
        };
        const query = new URLSearchParams(p).toString();
        return await handleAsync<Article[]>(() =>
            api.get(`/article/feed?${query}`).then((res) => res.data),
        );
    },

    getById: (id: string) => handleAsync(() => api.get(`/article/${id}`)),

    create: (data: {
        title: string;
        description: string;
        content: string;
        images: string[];
        tags: string[];
        category: string;
    }) => handleAsync(() => api.post('/article', data)),

    update: (
        id: string,
        data: Partial<{
            title: string;
            description: string;
            content: string;
            images: string[];
            tags: string[];
            category: string;
        }>,
    ) => handleAsync(() => api.put(`/article/${id}`, data)),

    getUserArticles: () =>
        handleAsync<Article[]>(() =>
            api.get('/article').then((res) => res.data),
        ),

    interact: (articleId: string, type: 'like' | 'dislike' | 'block') =>
        handleAsync(() => api.post(`/article/${articleId}/interact`, type)),

    delete: (id: string) => handleAsync(() => api.delete(`/article/${id}`)),
};
