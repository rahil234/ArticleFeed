'use client';

import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from 'react';
import { authService } from '@/services/auth.service';
import { userService } from '@/services/user.service';
import type { User } from './types';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (emailOrPhone: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = async () => {
        try {
            const { data, error } = await userService.getCurrentUser();

            if (error || !data?.success) {
                throw new Error(error || 'Failed to fetch user');
            }

            setUser(data.data);
        } catch {
            setUser(null);
            localStorage.removeItem('authToken');
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            refreshUser().finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (emailOrPhone: string, password: string) => {
        const { data } = await authService.login({
            emailOrPhone,
            password,
        });

        if (!data?.success) {
            throw new Error(data?.message || 'Login failed');
        }

        localStorage.setItem('authToken', data.token);
        setUser(data?.data);
    };

    const logout = async () => {
        try {
            await authService.logout();
        } finally {
            localStorage.removeItem('authToken');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, isLoading, login, logout, refreshUser }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
