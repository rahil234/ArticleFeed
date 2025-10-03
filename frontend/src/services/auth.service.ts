import {fetchApi} from "@/lib/api";

export const authService = {
    register: (data: {
        firstName: string
        lastName: string
        email: string
        phone: string
        dob: string
        password: string
        preferences: string[]
    }) =>
        fetchApi("/auth/register", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    login: (credentials: { emailOrPhone: string; password: string }) =>
        fetchApi("/auth/login", {
            method: "POST",
            body: JSON.stringify(credentials),
        }),

    logout: () => fetchApi("/auth/logout", {method: "POST"}),

    getCurrentUser: () => fetchApi("/auth/me"),
}
