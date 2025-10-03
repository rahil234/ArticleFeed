"use client"

import {createContext, useContext, useState, useEffect, type ReactNode} from "react"
import type {User} from "./types"
import {authService} from "@/services/auth.service"

interface AuthContextType {
    user: User | null
    isLoading: boolean
    login: (emailOrPhone: string, password: string) => Promise<void>
    logout: () => Promise<void>
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({children}: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const refreshUser = async () => {
        try {
            const userData = await authService.getCurrentUser()
            setUser(userData)
        } catch (error) {
            setUser(null)
            localStorage.removeItem("authToken")
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("authToken")
        if (token) {
            refreshUser().finally(() => setIsLoading(false))
        } else {
            setIsLoading(false)
        }
    }, [])

    const login = async (emailOrPhone: string, password: string) => {
        const response = await authService.login({emailOrPhone, password})
        localStorage.setItem("authToken", response.token)
        setUser(response.user)
    }

    const logout = async () => {
        try {
            await authService.logout()
        } finally {
            localStorage.removeItem("authToken")
            setUser(null)
        }
    }

    return <AuthContext.Provider value={{user, isLoading, login, logout, refreshUser}}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
