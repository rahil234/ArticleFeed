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

    getById: (id: string) =>
        handleAsync<Article>(() =>
            api.get(`/article/${id}`).then((res) => res.data),
        ),

    create: (data: {
        title: string;
        description: string;
        content: string;
        images: string[];
        tags: string[];
        category: string;
    }) => handleAsync(() => api.post('/article', data).then((res) => res.data)),

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
    ) =>
        handleAsync(() =>
            api.put(`/article/${id}`, data).then((res) => res.data),
        ),

    getUserArticles: () =>
        handleAsync<Article[]>(() =>
            api.get('/article').then((res) => res.data),
        ),

    interact: (articleId: string, type: 'like' | 'dislike' | 'block') =>
        handleAsync(() =>
            api
                .post(`/interaction/${articleId}`, { type })
                .then((res) => res.data),
        ),

    delete: (id: string) =>
        handleAsync(() => api.delete(`/article/${id}`).then((res) => res.data)),
};
