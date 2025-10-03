const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
    ) {
        super(message)
        this.name = "ApiError"
    }
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem("authToken")

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token && {Authorization: `Bearer ${token}`}),
        ...options.headers,
    }

    const response = await fetch(`${BASE_URL}/api${endpoint}`, {
        ...options,
        headers,
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({message: "An error occurred"}))
        throw new ApiError(response.status, error.message || "An error occurred")
    }

    return response.json()
}


export const userApi = {
    updateProfile: (
        data: Partial<{
            firstName: string
            lastName: string
            email: string
            phone: string
            dob: string
        }>,
    ) =>
        fetchApi("/user/profile", {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    updatePassword: (data: { currentPassword: string; newPassword: string }) =>
        fetchApi("/user/password", {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    updatePreferences: (preferences: string[]) =>
        fetchApi("/user/preferences", {
            method: "PUT",
            body: JSON.stringify({preferences}),
        }),
}


// Article APIs
export const articleApi = {
    getFeed: (params?: { page?: number; limit?: number }) => {
        const query = new URLSearchParams(params as any).toString()
        return fetchApi(`/articles/feed?${query}`)
    },

    getById: (id: string) => fetchApi(`/articles/${id}`),

    create: (data: {
        title: string
        description: string
        content: string
        images: string[]
        tags: string[]
        category: string
    }) =>
        fetchApi("/articles", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    update: (
        id: string,
        data: Partial<{
            title: string
            description: string
            content: string
            images: string[]
            tags: string[]
            category: string
        }>,
    ) =>
        fetchApi(`/articles/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    delete: (id: string) => fetchApi(`/articles/${id}`, {method: "DELETE"}),

    getUserArticles: () => fetchApi("/articles/my-articles"),

    interact: (articleId: string, type: "like" | "dislike" | "block") =>
        fetchApi(`/articles/${articleId}/interact`, {
            method: "POST",
            body: JSON.stringify({type}),
        }),
}
