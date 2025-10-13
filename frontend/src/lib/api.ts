import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

const apiClient = axios.create({
    baseURL: `${BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status, data } = error.response;
            throw new ApiError(status, data.message || 'An error occurred');
        }
        throw new Error('Network error');
    },
);

export const api = apiClient;

// export async function fetchApi(endpoint: string, options: RequestInit = {}) {
//     const token = localStorage.getItem('authToken');
//
//     const headers: HeadersInit = {
//         'Content-Type': 'application/json',
//         ...(token && { Authorization: `Bearer ${token}` }),
//         ...options.headers,
//     };
//
//     const response = await fetch(`${BASE_URL}/api${endpoint}`, {
//         ...options,
//         headers,
//     });
//
//     if (!response.ok) {
//         const error = await response
//             .json()
//             .catch(() => ({ message: 'An error occurred' }));
//         throw new ApiError(
//             response.status,
//             error.message || 'An error occurred',
//         );
//     }
//
//     return response.json();
// }
